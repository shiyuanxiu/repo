/* === assets/learn-feed-sync.js === */
/** Learn feeds — Live / Cached / Offline pack tiers, dedupe, background refresh */
(function initLearnFeedSync() {
  const STALE_MS = 2 * 60 * 1000;
  const REFRESH_MS = 90 * 1000;
  const LIVE_MIN_ITEMS = 5;
  const LIVE_MIN_SOURCES = 2;
  const FUTURE_SKEW_MS = 10 * 60 * 1000;
  const MAX_AGE_MS = 90 * 86400000;

  const formatAgo = (iso) => {
    if (!iso) return "—";
    const m = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    return h < 48 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
  };

  const normalizeUrl = (url) => {
    try {
      const u = new URL(String(url || "").trim());
      u.hash = "";
      ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"].forEach(
        (k) => u.searchParams.delete(k),
      );
      let s = u.toString();
      if (s.endsWith("/")) s = s.slice(0, -1);
      return s;
    } catch (_) {
      return String(url || "").trim();
    }
  };

  const validatePublishedAt = (iso, maxAgeMs = MAX_AGE_MS) => {
    if (!iso) return false;
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return false;
    if (t > Date.now() + FUTURE_SKEW_MS) return false;
    if (Date.now() - t > maxAgeMs) return false;
    return true;
  };

  const dedupeArticles = (list, opts = {}) => {
    const {
      maxItems = 30,
      windowMs = 86400000,
      relevanceFilter,
      urlKey = "url",
      sortBy = "publishedAt",
    } = opts;
    const seen = new Set();
    const out = [];

    for (const raw of list || []) {
      const url = normalizeUrl(raw[urlKey]);
      if (!url || !url.startsWith("http") || seen.has(url)) continue;
      if (!validatePublishedAt(raw.publishedAt, windowMs)) continue;
      if (relevanceFilter && !relevanceFilter(raw.title, raw.summary)) continue;
      seen.add(url);
      out.push({ ...raw, [urlKey]: url });
    }

    out.sort((a, b) => new Date(b[sortBy]) - new Date(a[sortBy]));
    return out.slice(0, maxItems);
  };

  const isMetaStale = (fetchedAt) =>
    !fetchedAt || Date.now() - new Date(fetchedAt).getTime() > STALE_MS;

  const qualifiesLiveData = (meta) =>
    (meta?.count ?? 0) >= LIVE_MIN_ITEMS && (meta?.sourceCount ?? 0) >= LIVE_MIN_SOURCES;

  /** Resolve Live · Cached · Offline pack · Updating from meta flags + age */
  const normalizeFeedMeta = (meta = {}) => {
    const m = { ...meta };
    m.count = m.count ?? 0;
    m.sourceCount = m.sourceCount ?? 0;

    if (m.bundle) {
      m.tier = "bundle";
      m.live = false;
      m.cached = false;
      m.offline = true;
      return m;
    }

    const stale = isMetaStale(m.fetchedAt);
    if (m.live && stale) {
      m.live = false;
      m.cached = true;
    }

    const liveOk = m.live && !stale && qualifiesLiveData(m);
    if (liveOk) {
      m.tier = "live";
      m.cached = false;
      m.offline = false;
      return m;
    }

    if (m.cached || (m.fetchedAt && !m.bundle)) {
      m.tier = "cached";
      m.live = false;
      m.cached = true;
      m.offline = true;
      return m;
    }

    m.tier = "updating";
    m.live = false;
    m.offline = true;
    return m;
  };

  const feedTier = (meta) => normalizeFeedMeta(meta).tier;

  /** Live fetch succeeded: ≥2 sources, ≥5 items, not from cache/bundle */
  const buildFeedMeta = (items, { feedCount = 0, okSources = 0, fromCache = false, fromBundle = false, errors = 0 } = {}) => {
    const sourceCount = new Set((items || []).map((a) => a.sourceKey).filter(Boolean)).size || okSources;
    const count = items?.length || 0;
    const fetchedOk = !fromCache && !fromBundle;
    const live =
      fetchedOk &&
      count >= LIVE_MIN_ITEMS &&
      sourceCount >= LIVE_MIN_SOURCES &&
      errors < Math.max(1, feedCount);

    return normalizeFeedMeta({
      fetchedAt: new Date().toISOString(),
      count,
      sourceCount,
      live,
      offline: !live,
      bundle: fromBundle,
      cached: fromCache,
      errors,
    });
  };

  const formatStatusLabel = (meta, itemCount = meta?.count) => {
    const n = itemCount ?? meta?.count ?? 0;
    if (meta?.refreshing) return `Refreshing · ${n} stories…`;

    const m = normalizeFeedMeta({ ...meta, count: n });
    const src = m.sourceCount ?? 0;
    const when = m.fetchedAt ? formatAgo(m.fetchedAt) : "—";

    if (meta?.refreshFailed && m.tier === "bundle") {
      return `Offline pack · ${n} stories · refresh failed · tap Retry`;
    }
    if (meta?.refreshFailed && m.tier === "cached") {
      return `Cached · ${n} stories · sync failed ${when} · tap Refresh`;
    }
    if (m.tier === "live") return `Live · ${n} stories · ${src} sources · synced ${when}`;
    if (m.tier === "cached") return `Cached · ${n} stories · synced ${when}`;
    if (m.tier === "bundle") return `Offline pack · ${n} stories · tap Refresh for live`;
    return `Updating · ${n} stories · ${when}`;
  };

  const applyFeedStatus = (el, meta, itemCount) => {
    if (!el) return normalizeFeedMeta(meta);
    const m = normalizeFeedMeta({ ...meta, count: itemCount ?? meta?.count ?? 0 });
    el.textContent = formatStatusLabel(meta, itemCount);
    el.dataset.feedTier = meta?.refreshing ? "refreshing" : m.tier;
    return m;
  };

  /** Cached always background-refresh; Live fresh ≤2min skips; Offline pack = manual only */
  const shouldAutoRefresh = (meta) => {
    const m = normalizeFeedMeta(meta);
    if (m.tier === "bundle") return false;
    if (m.tier === "live") return false;
    if (m.tier === "cached") return true;
    return true;
  };

  const publishWindowMeta = (windowKey, meta) => {
    if (!windowKey) return;
    window[`${windowKey}_META`] = normalizeFeedMeta(meta);
  };

  const fetchHnTop = async (limit = 25) => {
    const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error("HN list failed");
    const ids = (await res.json()).slice(0, limit);
    const items = await Promise.all(
      ids.map((id) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ),
    );
    return items
      .filter((item) => item?.title && item.time)
      .map((item) => ({
        id: String(item.id),
        title: item.title,
        url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
        publishedAt: new Date(item.time * 1000).toISOString(),
        summary: item.title,
        body: item.text || "",
      }));
  };

  const loadPrefs = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || "null");
    } catch (_) {
      return null;
    }
  };

  const savePrefs = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (_) {}
  };

  const topIds = (list, n = 5) => (list || []).slice(0, n).map((a) => a.id);

  const maybeNotify = (section, prevIds, nextList, title = "New headlines") => {
    if (!section || !nextList?.length) return;
    if (document.visibilityState === "visible") return;
    try {
      if (localStorage.getItem(`vv_notify_${section}`) !== "1") return;
      if (Notification.permission !== "granted") return;
      const nextIds = topIds(nextList, 3);
      const fresh = nextIds.some((id) => !prevIds.includes(id));
      if (!fresh) return;
      const head = nextList[0];
      new Notification(title, {
        body: head?.title || "Fresh stories available",
        tag: `vv-learn-${section}`,
        renotify: true,
      });
    } catch (_) {}
  };

  const requestNotify = async (section) => {
    try {
      localStorage.setItem(`vv_notify_${section}`, "1");
      if (!("Notification" in window)) return "unsupported";
      if (Notification.permission === "granted") return "granted";
      if (Notification.permission === "denied") return "denied";
      const p = await Notification.requestPermission();
      return p;
    } catch (_) {
      return "error";
    }
  };

  const fetchParallel = async (items, worker, concurrency = 4) => {
    const out = [];
    let i = 0;
    const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        try {
          const r = await worker(items[idx], idx);
          if (r != null) out.push(r);
        } catch (_) {}
      }
    });
    await Promise.all(runners);
    return out;
  };

  window.learnFeedSync = {
    STALE_MS,
    REFRESH_MS,
    LIVE_MIN_ITEMS,
    LIVE_MIN_SOURCES,
    FUTURE_SKEW_MS,
    MAX_AGE_MS,
    formatAgo,
    isMetaStale,
    qualifiesLiveData,
    normalizeFeedMeta,
    feedTier,
    shouldAutoRefresh,
    publishWindowMeta,
    applyFeedStatus,
    fetchHnTop,
    normalizeUrl,
    validatePublishedAt,
    dedupeArticles,
    buildFeedMeta,
    formatStatusLabel,
    loadPrefs,
    savePrefs,
    topIds,
    maybeNotify,
    requestNotify,
    fetchParallel,
  };

  const isLearnTab = () =>
    document.querySelector(".tab.active")?.dataset.tab === "knowledge" ||
    !document.getElementById("feedIntroLearn")?.classList.contains("hidden");

  let refreshTimer = null;

  const tickRefresh = () => {
    if (!isLearnTab() || document.visibilityState !== "visible") return;
    window.dispatchEvent(new CustomEvent("vv-learn-refresh-all", { detail: { reason: "interval" } }));
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && isLearnTab()) tickRefresh();
  });

  if (!refreshTimer) refreshTimer = setInterval(tickRefresh, REFRESH_MS);
})();


/* === assets/financial-news-rss.js === */
/** Browser mirror of scripts/financial-news-rss.mjs — keep logic in sync */
window.FINANCIAL_NEWS_RSS = (function () {
  const SUMMARY_CARD_LEN = 360;
  const SUMMARY_BODY_MAX = 2400;

  function decodeEntities(s) {
    return String(s || "")
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'");
  }

  function stripHtml(s) {
    return decodeEntities(
      String(s || "")
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    );
  }

  function extractTag(block, tag) {
    const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i");
    const m1 = block.match(cdata);
    if (m1) return stripHtml(m1[1]);
    const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
    const m2 = block.match(plain);
    return m2 ? stripHtml(m2[1]) : "";
  }

  function extractNamespacedTag(block, localName) {
    const cdata = new RegExp(`<[\\w-]+:${localName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/[\\w-]+:${localName}>`, "i");
    const m1 = block.match(cdata);
    if (m1) return stripHtml(m1[1]);
    const plain = new RegExp(`<[\\w-]+:${localName}[^>]*>([\\s\\S]*?)<\\/[\\w-]+:${localName}>`, "i");
    const m2 = block.match(plain);
    return m2 ? stripHtml(m2[1]) : "";
  }

  function extractLink(block) {
    const atom = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i);
    if (atom?.[1]?.startsWith("http")) return atom[1].split(" ")[0];
    let link = extractTag(block, "link");
    if (link?.startsWith("http")) return link.split(" ")[0];
    const guid = extractTag(block, "guid");
    if (guid?.startsWith("http")) return guid.split(" ")[0];
    return "";
  }

  function extractDescription(block) {
    const parts = [
      extractNamespacedTag(block, "encoded"),
      extractNamespacedTag(block, "description"),
      extractTag(block, "description"),
      extractTag(block, "summary"),
      extractTag(block, "content"),
    ].filter(Boolean);
    const best = parts.sort((a, b) => b.length - a.length)[0] || "";
    return best.slice(0, SUMMARY_BODY_MAX);
  }

  function truncateSummary(text, max = SUMMARY_CARD_LEN) {
    const t = (text || "").trim();
    if (t.length <= max) return t;
    const cut = t.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    const trimmed = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
    return `${trimmed}…`;
  }

  const TECH_RULES = [
    /\bartificial intelligence\b/i,
    /\bgenerative ai\b/i,
    /\bmachine learning\b/i,
    /\bopenai\b/i,
    /\bnvidia\b/i,
    /\bsemiconductor(s)?\b/i,
    /\bcybersecurity\b/i,
    /\btech(nology| sector| stocks| company| giants)?\b/i,
    /\bstartup(s)?\b/i,
    /\b(apple|google|microsoft|amazon|meta)\b/i,
    /\bai-powered\b/i,
    /\bai robots\b/i,
    /\brobot labs\b/i,
  ];

  const FINANCE_RULES = [
    /\bstock(s)?\b/i,
    /\bmarket(s)?\b/i,
    /\bs&p\b/i,
    /\bnasdaq\b/i,
    /\bdow jones\b/i,
    /\bwall street\b/i,
    /\bfederal reserve\b/i,
    /\binterest rate(s)?\b/i,
    /\binflation\b/i,
    /\bearnings\b/i,
    /\bipo\b/i,
    /\bportfolio\b/i,
    /\b401\s*\(\s*k\s*\)\b/i,
    /\bcrypto(currency)?\b/i,
    /\bbitcoin\b/i,
    /\btrading\b/i,
    /\brecession\b/i,
    /\bgdp\b/i,
  ];

  function classifyTopic(title, summary, fallback = "business") {
    const t = `${title} ${summary}`;
    if (TECH_RULES.some((re) => re.test(t))) return "tech";
    if (FINANCE_RULES.some((re) => re.test(t))) return "finance";
    return fallback || "business";
  }

  function parseDate(block) {
    const raw =
      extractTag(block, "pubDate") ||
      extractTag(block, "published") ||
      extractTag(block, "updated") ||
      extractNamespacedTag(block, "published") ||
      extractNamespacedTag(block, "updated");
    if (!raw?.trim()) return null;
    const d = new Date(raw.trim());
    if (Number.isNaN(d.getTime())) return null;
    const sync = window.learnFeedSync;
    const maxAge = sync?.MAX_AGE_MS ?? 90 * 86400000;
    const skew = sync?.FUTURE_SKEW_MS ?? 10 * 60 * 1000;
    if (d.getTime() > Date.now() + skew) return null;
    if (Date.now() - d.getTime() > maxAge) return null;
    return d;
  }

  function buildArticle(fields) {
    const body = fields.body || "";
    return {
      ...fields,
      summary: truncateSummary(body),
      body,
      excerptNote: "RSS excerpt",
    };
  }

  function parseRssXml(xml, feed, perFeed, idFn) {
    const items = [];
    const re = /<(?:item|entry)[\s>][\s\S]*?<\/(?:item|entry)>/gi;
    let m;
    while ((m = re.exec(xml)) && items.length < perFeed) {
      const block = m[0];
      const title = extractTag(block, "title");
      const url = extractLink(block);
      if (!title || !url?.startsWith("http")) continue;
      const pub = parseDate(block);
      if (!pub) continue;
      const publishedAt = pub.toISOString();
      const body = extractDescription(block);
      items.push(
        buildArticle({
          id: idFn(url),
          source: feed.source,
          sourceKey: feed.sourceKey,
          sourceIcon: feed.sourceIcon,
          topic: classifyTopic(title, body, feed.topic),
          title,
          body: body || title,
          url,
          publishedAt,
        }),
      );
    }
    return items;
  }

  return {
    SUMMARY_CARD_LEN,
    SUMMARY_BODY_MAX,
    decodeEntities,
    truncateSummary,
    classifyTopic,
    parseRssXml,
    extractDescription,
  };
})();


/* === assets/learn-rss-proxy.js === */
/** Unified RSS proxy for Learn feeds — race direct + proxies for speed */
(function initLearnRssProxy() {
  const HEADERS = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept: "application/rss+xml, application/xml, text/xml, application/atom+xml, */*",
    "Accept-Language": "en-US,en;q=0.9",
  };

  const PROXY_TARGETS = [
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  ];

  const isRssText = (text) =>
    typeof text === "string" && (text.includes("<item") || text.includes("<entry"));

  const withBust = (feedUrl, bust) => {
    if (!bust) return feedUrl;
    try {
      const u = new URL(feedUrl);
      u.searchParams.set("_vv", String(Date.now()));
      return u.toString();
    } catch (_) {
      return feedUrl;
    }
  };

  const readRss = async (targetUrl, headers, timeoutMs) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(targetUrl, {
        headers,
        signal: ctrl.signal,
        redirect: "follow",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!isRssText(text)) throw new Error("not RSS");
      return text;
    } finally {
      clearTimeout(timer);
    }
  };

  window.fetchRssText = async function fetchRssText(feedUrl, opts = {}) {
    const timeoutMs = opts.timeoutMs ?? 22000;
    const url = withBust(feedUrl, opts.bust !== false);

    const tasks = [
      readRss(url, HEADERS, timeoutMs),
      ...PROXY_TARGETS.map((toProxy) => readRss(toProxy(url), undefined, timeoutMs)),
    ];

    try {
      return await Promise.any(tasks);
    } catch (_) {
      throw new Error("RSS fetch failed");
    }
  };
})();


/* === assets/learn-radar-snippet.js === */
/** Clean RSS/HN/Reddit snippets for radar feeds */
window.learnRadarPolish = function learnRadarPolish(text, title) {
  let t = String(text || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return title ? `Trending: ${String(title).slice(0, 100)}` : "Tap for details.";

  if (/Article URL:/i.test(t)) {
    const pts = t.match(/Points:\s*(\d+)/i);
    const com = t.match(/#\s*Comments:\s*(\d+)/i);
    const parts = [];
    if (pts) parts.push(`${pts[1]} upvotes on Hacker News`);
    if (com) parts.push(`${com[1]} comments`);
    if (parts.length) return parts.join(" · ");
  }

  t = t
    .replace(/^submitted by .*? to r\/\w+\s*/i, "")
    .replace(/\[link\]\s*/gi, "")
    .replace(/\[comments\]\s*/gi, "")
    .trim();

  if (/^https?:\/\//.test(t)) {
    return title ? `Discussion: ${String(title).slice(0, 120)}` : t;
  }

  if (t.length > 160) t = `${t.slice(0, 157)}…`;
  if (t.length < 12 && title) return `Trending: ${String(title).slice(0, 120)}`;
  return t;
};

window.learnRadarPolishItem = function learnRadarPolishItem(item) {
  const title = item.title || "";
  const summary = window.learnRadarPolish(item.summary, title);
  const bodyRaw = item.body || item.summary;
  let body = window.learnRadarPolish(bodyRaw, title);
  if (body === summary && /Article URL:/i.test(String(bodyRaw || ""))) body = summary;
  return { ...item, summary, body };
};


/* === assets/learn-radar-hub.js === */
/* Shared Learn Radar hub — used by Campus Life & Job Radar */
window.initLearnRadar = function initLearnRadar(cfg) {
  const p = cfg.prefix;
  const app = document.getElementById(cfg.appId);
  if (!app) return;

  if (typeof app.__lrCleanup === "function") app.__lrCleanup();
  const ac = new AbortController();
  const { signal } = ac;
  let autoTimer = null;
  let dailyTimer = null;

  app.__lrCleanup = () => {
    ac.abort();
    if (autoTimer) clearInterval(autoTimer);
    if (dailyTimer) clearTimeout(dailyTimer);
    autoTimer = null;
    dailyTimer = null;
    document.getElementById(cfg.ids.sheet)?.classList.add("hidden");
    document.body.style.overflow = "";
  };

  const RSS = window.FINANCIAL_NEWS_RSS || {};
  const SYNC = window.learnFeedSync || {};
  const win = window;
  const DAY_MS = win[`${cfg.windowKey}_DAY_MS`] || 86400000;
  const STALE_MS = SYNC.STALE_MS ?? win[`${cfg.windowKey}_STALE_MS`] ?? 5 * 60 * 1000;
  const FEEDS = win[`${cfg.windowKey}_FEEDS`] || [];
  const DOMAINS = win[`${cfg.windowKey}_DOMAINS`] || [];
  const PLATFORMS = win[`${cfg.windowKey}_PLATFORMS`] || [];

  const listEl = document.getElementById(cfg.ids.list);
  const radarEl = document.getElementById(cfg.ids.radarDots);
  const updatedEl = document.getElementById(cfg.ids.updated);
  const domainRow = document.getElementById(cfg.ids.domainFilters);
  const platformRow = document.getElementById(cfg.ids.platformFilters);
  const searchInput = document.getElementById(cfg.ids.search);
  const sheet = document.getElementById(cfg.ids.sheet);
  const countEl = document.getElementById(cfg.ids.listCount);

  let hotspots = [];
  let meta = win[`${cfg.windowKey}_META`] || {};
  let activeDomain = "all";
  let activePlatform = "all";
  let savedOnly = false;
  let activeId = null;
  let refreshing = false;
  let speaking = false;

  const L = cfg.labels || {};
  const dataAttr = `data-${p}-id`;
  const domainAttr = `data-${p}-domain`;
  const platformAttr = `data-${p}-platform`;

  const escapeHtml = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const LIST_MS = cfg.listWindowMs || DAY_MS;
  const isRecent = (iso) =>
    SYNC.validatePublishedAt ? SYNC.validatePublishedAt(iso, LIST_MS) : Date.now() - new Date(iso).getTime() <= LIST_MS;

  const prefsKey = `${cfg.storage.cache}_prefs`;
  const savedPrefs = SYNC.loadPrefs?.(prefsKey);
  if (savedPrefs?.domain) activeDomain = savedPrefs.domain;
  if (savedPrefs?.platform) activePlatform = savedPrefs.platform;
  if (savedPrefs?.savedOnly) savedOnly = savedPrefs.savedOnly;

  const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);
  const decode = (s) => (RSS.decodeEntities ? RSS.decodeEntities(s) : s);

  const polish = (item) => (window.learnRadarPolishItem ? window.learnRadarPolishItem(item) : item);

  const normalizeList = (list, windowMs = LIST_MS) =>
    (list || [])
      .filter((a) => a.url && (SYNC.validatePublishedAt ? SYNC.validatePublishedAt(a.publishedAt, windowMs) : Date.now() - new Date(a.publishedAt).getTime() <= windowMs))
      .filter((a) => !cfg.relevanceFilter || cfg.relevanceFilter(decode(a.title), decode(a.summary)))
      .map((a) => {
        const decoded = {
          ...a,
          title: decode(a.title),
          summary: decode(a.summary),
          body: decode(a.body),
        };
        return polish(decoded);
      });

  const hashId = (url) => {
    let h = 0;
    for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) >>> 0;
    return h.toString(16).slice(0, 12);
  };

  const computeHeat = (publishedAt, rank) => {
    const ageH = Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 3600000);
    const base = Math.max(500, 9000 - ageH * 380);
    return Math.round((base - rank * 120 + (rank % 3) * 47) * 10) / 10;
  };

  const classifyDomain = cfg.classifyDomain || (() => "all");

  const formatAgo = (iso) => {
    const m = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
  };

  const formatTs = (iso) => {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const cleanBody = (text, title) =>
    window.learnRadarPolish ? window.learnRadarPolish(text, title) : String(text || "");

  const enrichItem = (raw, feed, rank) =>
    polish({
      id: raw.id || hashId(raw.url),
      title: decode(raw.title),
      summary: decode(raw.summary),
      body: decode(raw.body || raw.summary),
      url: raw.url,
      source: raw.source || feed.source,
      sourceKey: feed.sourceKey || raw.sourceKey,
      sourceIcon: feed.sourceIcon || raw.sourceIcon,
      platform: feed.platform || raw.platform,
      platformLabel: feed.platformLabel || raw.platformLabel,
      domain: feed.domain || classifyDomain(raw.title, raw.summary),
      publishedAt: raw.publishedAt,
      heat: raw.heat != null ? raw.heat : computeHeat(raw.publishedAt, rank),
      rank,
    });

  const isDataStale = (fetchedAt) => !fetchedAt || Date.now() - new Date(fetchedAt).getTime() > STALE_MS;

  const loadCache = () => {
    try {
      const raw = localStorage.getItem(cfg.storage.cache);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data.dayKey !== dayKey()) return null;
      return data;
    } catch (_) {
      return null;
    }
  };

  const saveCache = (list, m) => {
    try {
      localStorage.setItem(
        cfg.storage.cache,
        JSON.stringify({
          hotspots: list,
          fetchedAt: m.fetchedAt || new Date().toISOString(),
          dayKey: dayKey(),
          sourceCount: m.sourceCount,
        }),
      );
    } catch (_) {}
  };

  const getSaved = () => {
    try {
      return new Set(JSON.parse(localStorage.getItem(cfg.storage.saved) || "[]"));
    } catch (_) {
      return new Set();
    }
  };

  const saveSaved = (set) => {
    try {
      localStorage.setItem(cfg.storage.saved, JSON.stringify([...set]));
    } catch (_) {}
  };

  const buildDeepDive = (item) => {
    const cleaned = cleanBody(item.body, item.title) || item.summary;
    const domainLabel = DOMAINS.find((d) => d.id === item.domain)?.label || item.domain;
    const extra =
      cleaned !== item.summary && item.summary ? `\n\n**Summary:** ${item.summary}` : "";
    return (
      `${L.deepIntro || "Here's today's story."}\n\n` +
      `### **${item.title}**\n\n` +
      `${cleaned}${extra}\n\n` +
      `**Context:** Trending on **${item.platformLabel}** · **${item.source}** (${domainLabel}). Heat **${item.heat}**.\n\n` +
      `**Next step:** Read the original for full details.`
    );
  };

  const fetchRssProxy = async (feedUrl, bust = false) => {
    if (typeof window.fetchRssText === "function") return window.fetchRssText(feedUrl, { bust });
    throw new Error("RSS proxy unavailable");
  };

  const fetchFeedClient = async (feed, bust = false) => {
    if (feed.sourceKey === "hackernews" && SYNC.fetchHnTop) {
      try {
        const raw = await SYNC.fetchHnTop(30);
        const items = raw
          .filter((a) => isRecent(a.publishedAt))
          .map((a, i) =>
            enrichItem(
              {
                ...a,
                source: feed.source,
                sourceKey: feed.sourceKey,
                sourceIcon: feed.sourceIcon,
                platform: feed.platform,
                platformLabel: feed.platformLabel,
                domain: feed.domain,
              },
              feed,
              i,
            ),
          );
        if (items.length) return items;
      } catch (_) {}
    }
    for (const url of [feed.url, ...(feed.fallbacks || [])]) {
      try {
        const xml = await fetchRssProxy(url, bust);
        const items = RSS.parseRssXml(xml, { ...feed, topic: feed.domain }, 10, hashId).filter((a) =>
          isRecent(a.publishedAt),
        );
        if (items.length) return items.map((a) => enrichItem(a, feed, 0));
      } catch (_) {}
    }
    return [];
  };

  const setHotspots = (list, m) => {
    hotspots = normalizeList(list)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 30)
      .map((a, i) => ({ ...a, rank: i + 1, heat: computeHeat(a.publishedAt, i + 1) }));
    meta = SYNC.normalizeFeedMeta
      ? SYNC.normalizeFeedMeta({
          ...meta,
          ...(m || {}),
          count: hotspots.length,
          sourceCount: m?.sourceCount || new Set(hotspots.map((h) => h.sourceKey)).size,
        })
      : { ...meta, ...(m || {}), count: hotspots.length };
    SYNC.applyFeedStatus?.(updatedEl, meta, hotspots.length);
    SYNC.publishWindowMeta?.(cfg.windowKey, meta);
    renderAll();
    window.dispatchEvent(
      new CustomEvent("vv-learn-radar-update", {
        detail: {
          windowKey: cfg.windowKey,
          learnSection: cfg.learnSection,
          count: hotspots.length,
          tier: meta.tier,
          offline: meta.tier !== "live",
        },
      }),
    );
  };

  const refreshHotspots = async (manual = false, opts = {}) => {
    if (refreshing) return;
    const force = opts.force === true;
    if (!manual && !force && SYNC.shouldAutoRefresh && !SYNC.shouldAutoRefresh(meta)) return;
    refreshing = true;
    meta = { ...meta, refreshing: true, refreshFailed: false };
    SYNC.applyFeedStatus?.(updatedEl, meta, hotspots.length);
    const prevIds = SYNC.topIds ? SYNC.topIds(hotspots) : [];
    if (manual && typeof showAppToast === "function") showAppToast(L.refreshToast || "Refreshing…");

    try {
      const collected = [];
      const okSources = new Set();
      let errors = 0;
      await Promise.allSettled(
        FEEDS.map(async (feed) => {
          try {
            const items = await fetchFeedClient(feed, true);
            if (items.length) {
              okSources.add(feed.sourceKey);
              collected.push(...items);
            } else errors += 1;
          } catch (_) {
            errors += 1;
          }
        }),
      );

      if (collected.length) {
        const merged = (SYNC.dedupeArticles ? SYNC.dedupeArticles(collected, {
          maxItems: 30,
          windowMs: LIST_MS,
          relevanceFilter: cfg.relevanceFilter,
        }) : collected)
          .map((a, i) => enrichItem(a, a, i + 1));
        const m = SYNC.buildFeedMeta
          ? SYNC.buildFeedMeta(merged, { feedCount: FEEDS.length, okSources: okSources.size, errors })
          : {
              fetchedAt: new Date().toISOString(),
              dayKey: dayKey(),
              count: merged.length,
              sourceCount: okSources.size,
              live: merged.length >= 5 && okSources.size >= 2,
              offline: !(merged.length >= 5 && okSources.size >= 2),
            };
        m.dayKey = dayKey();
        m.refreshing = false;
        m.refreshFailed = false;
        saveCache(merged, m);
        setHotspots(merged, m);
        SYNC.maybeNotify?.(cfg.learnSection, prevIds, merged, L.listTitle || "Learn feed");
        if (manual && typeof showAppToast === "function") {
          const label = SYNC.formatStatusLabel ? SYNC.formatStatusLabel(m, merged.length) : `Updated · ${merged.length} stories`;
          showAppToast(label);
        }
      } else {
        meta = {
          ...meta,
          refreshing: false,
          refreshFailed: manual,
          refreshAttemptAt: new Date().toISOString(),
        };
        SYNC.applyFeedStatus?.(updatedEl, meta, hotspots.length);
        if (manual && typeof showAppToast === "function") {
          showAppToast(L.refreshFail || "Refresh failed — check connection or try again");
        }
      }
    } finally {
      refreshing = false;
    }
  };

  const bootstrap = async () => {
    const cached = loadCache();
    if (cached?.hotspots?.length) {
      setHotspots(cached.hotspots, {
        fetchedAt: cached.fetchedAt,
        dayKey: cached.dayKey,
        sourceCount: cached.sourceCount,
        cached: true,
        live: false,
      });
      refreshHotspots(false);
      return;
    }
    const bundled = normalizeList(win[cfg.windowKey] || []);
    if (bundled.length) {
      const bundledMeta = win[`${cfg.windowKey}_META`] || {};
      setHotspots(bundled, {
        ...bundledMeta,
        offline: true,
        bundle: true,
        live: false,
        cached: false,
        fetchedAt: bundledMeta.fetchedAt,
      });
      return;
    }
    if (listEl) listEl.innerHTML = `<p class="${p}-empty">${L.loading || "Loading…"}</p>`;
    await refreshHotspots(false);
  };

  const filteredHotspots = () => {
    const q = (searchInput?.value || "").trim().toLowerCase();
    const saved = getSaved();
    return hotspots.filter((h) => {
      const domainOk = activeDomain === "all" || h.domain === activeDomain;
      const platformOk = activePlatform === "all" || h.platform === activePlatform;
      const savedOk = !savedOnly || saved.has(h.id);
      const text = `${h.title} ${h.summary} ${h.source}`.toLowerCase();
      return domainOk && platformOk && savedOk && (!q || text.includes(q));
    });
  };

  const radarPosition = (index, total) => {
    const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
    const r = 22 + (index % 4) * 5 + (index % 3) * 2;
    return { left: 50 + r * Math.cos(angle), top: 50 + r * Math.sin(angle) };
  };

  const renderRadar = () => {
    if (!radarEl) return;
    radarEl.innerHTML = filteredHotspots()
      .slice(0, 15)
      .map((h, i) => {
        const pos = radarPosition(i, 15);
        const lg = h.rank <= 3 ? ` ${p}-dot--lg` : "";
        return `<button type="button" class="${p}-dot${lg}" ${dataAttr}="${escapeHtml(h.id)}" style="left:${pos.left}%;top:${pos.top}%">${h.rank}</button>`;
      })
      .join("");
  };

  const renderList = () => {
    if (!listEl) return;
    const items = filteredHotspots();
    if (countEl) countEl.textContent = `${items.length} items`;
    listEl.innerHTML = items.length
      ? items
          .map(
            (h) => `<button type="button" class="${p}-card" ${dataAttr}="${escapeHtml(h.id)}">
          <span class="${p}-rank">${h.rank}</span>
          <div class="${p}-card-body">
            <h3 class="${p}-card-title">${escapeHtml(h.title)}</h3>
            <p class="${p}-card-snippet">${escapeHtml(h.summary)}</p>
            <div class="${p}-card-meta">
              <span class="${p}-tag ${p}-tag--platform">${escapeHtml(h.platformLabel)}</span>
              <span class="${p}-time">${formatTs(h.publishedAt)}</span>
              <span class="${p}-heat">🔥 ${h.heat}</span>
            </div>
          </div>
          <span class="${p}-card-arrow">›</span>
        </button>`,
          )
          .join("")
      : `<p class="${p}-empty">${L.empty || "No matches."}</p>`;
  };

  const renderFilters = () => {
    const mk = (row, items, active, attr) => {
      if (!row) return;
      row.innerHTML = items
        .map(
          (x) =>
            `<button type="button" class="${p}-filter${active === x.id ? " active" : ""}" data-${attr}="${escapeHtml(x.id)}">${escapeHtml(x.label)}</button>`,
        )
        .join("");
    };
    mk(domainRow, DOMAINS, activeDomain, `${p}-domain`);
    mk(platformRow, PLATFORMS, activePlatform, `${p}-platform`);
  };

  const renderAll = () => {
    renderRadar();
    renderList();
  };

  const itemById = (id) => hotspots.find((h) => h.id === id);

  const stopSpeech = () => {
    window.speechSynthesis?.cancel();
    speaking = false;
    document.getElementById(cfg.ids.readBtn)?.classList.remove("speaking");
  };

  const openSheet = (id) => {
    const h = itemById(id);
    if (!h || !sheet) return;
    activeId = id;
    stopSpeech();
    document.getElementById(cfg.ids.sheetRank).textContent = `#${h.rank}`;
    document.getElementById(cfg.ids.sheetPlatform).textContent = h.platformLabel;
    document.getElementById(cfg.ids.sheetTitle).textContent = h.title;
    document.getElementById(cfg.ids.sheetHeat).textContent = String(h.heat);
    document.getElementById(cfg.ids.sheetTime).textContent = formatTs(h.publishedAt);
    document.getElementById(cfg.ids.sheetDeep).textContent = buildDeepDive(h);
    const saved = getSaved();
    const saveBtn = document.getElementById(cfg.ids.sheetSave);
    if (saveBtn) {
      saveBtn.classList.toggle("active", saved.has(id));
      saveBtn.innerHTML = saved.has(id) ? '<span aria-hidden="true">♥</span> Saved' : '<span aria-hidden="true">♡</span> Save';
    }
    const link = document.getElementById(cfg.ids.sheetLink);
    if (link) {
      link.href = h.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    sheet.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  const closeSheet = () => {
    stopSpeech();
    sheet?.classList.add("hidden");
    document.body.style.overflow = "";
    activeId = null;
  };

  renderFilters();
  domainRow?.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest(`[${domainAttr}]`);
      if (!btn) return;
      activeDomain = btn.getAttribute(domainAttr);
      SYNC.savePrefs?.(prefsKey, { domain: activeDomain, platform: activePlatform, savedOnly });
      renderFilters();
      renderAll();
    },
    { signal },
  );
  platformRow?.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest(`[${platformAttr}]`);
      if (!btn) return;
      activePlatform = btn.getAttribute(platformAttr);
      SYNC.savePrefs?.(prefsKey, { domain: activeDomain, platform: activePlatform, savedOnly });
      renderFilters();
      renderAll();
    },
    { signal },
  );
  searchInput?.addEventListener("input", renderAll, { signal });
  document.getElementById(cfg.ids.refreshBtn)?.addEventListener("click", () => refreshHotspots(true), { signal });
  document.getElementById(cfg.ids.savedToggle)?.addEventListener(
    "click",
    () => {
      savedOnly = !savedOnly;
      SYNC.savePrefs?.(prefsKey, { domain: activeDomain, platform: activePlatform, savedOnly });
      document.getElementById(cfg.ids.savedToggle)?.classList.toggle("active", savedOnly);
      renderAll();
    },
    { signal },
  );
  app.addEventListener(
    "click",
    (e) => {
      const card = e.target.closest(`[${dataAttr}]`);
      if (card) openSheet(card.getAttribute(dataAttr));
    },
    { signal },
  );
  document.getElementById(cfg.ids.sheetClose)?.addEventListener("click", closeSheet, { signal });
  document.getElementById(cfg.ids.sheetBackdrop)?.addEventListener("click", closeSheet, { signal });
  document.getElementById(cfg.ids.readBtn)?.addEventListener(
    "click",
    () => {
      const item = itemById(activeId);
      if (!item || !window.speechSynthesis) return;
      if (speaking) stopSpeech();
      else {
        const u = new SpeechSynthesisUtterance(buildDeepDive(item).replace(/[#*]/g, ""));
        u.lang = "en-US";
        u.rate = 0.95;
        u.onend = () => {
          speaking = false;
          document.getElementById(cfg.ids.readBtn)?.classList.remove("speaking");
        };
        speaking = true;
        document.getElementById(cfg.ids.readBtn)?.classList.add("speaking");
        window.speechSynthesis.speak(u);
      }
    },
    { signal },
  );
  document.getElementById(cfg.ids.sheetSave)?.addEventListener(
    "click",
    () => {
      if (!activeId) return;
      const saved = getSaved();
      if (saved.has(activeId)) saved.delete(activeId);
      else saved.add(activeId);
      saveSaved(saved);
      openSheet(activeId);
    },
    { signal },
  );

  const autoBtn = document.getElementById(cfg.ids.autoBtn);
  if (autoBtn && cfg.storage.auto) {
    const dailyMode = cfg.autoDaily === true;
    const autoKey = cfg.storage.auto;
    let stored = localStorage.getItem(autoKey);
    if (stored === null && cfg.autoDailyDefault) {
      stored = "1";
      localStorage.setItem(autoKey, "1");
    }
    let on = stored === "1";
    const refreshInterval = dailyMode ? DAY_MS : STALE_MS;

    const scheduleDailyRefresh = (hour = cfg.dailyRefreshHour ?? 8) => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(hour, 0, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      return setTimeout(() => {
        refreshHotspots(false);
        if (on) dailyTimer = scheduleDailyRefresh(hour);
      }, next.getTime() - now.getTime());
    };

    const startAuto = () => {
      if (autoTimer) clearInterval(autoTimer);
      if (dailyTimer) clearTimeout(dailyTimer);
      autoTimer = null;
      dailyTimer = null;
      if (!on) return;
      if (dailyMode) {
        dailyTimer = scheduleDailyRefresh();
      } else {
        autoTimer = setInterval(() => refreshHotspots(false, { force: true }), refreshInterval);
      }
    };

    const sync = () => {
      autoBtn.classList.toggle("active", on);
      if (dailyMode) {
        autoBtn.innerHTML = on
          ? '<span aria-hidden="true">⏱</span> Daily on · 8am'
          : '<span aria-hidden="true">⏱</span> Daily refresh';
      } else {
        autoBtn.innerHTML = on ? '<span aria-hidden="true">⏱</span> Auto on' : '<span aria-hidden="true">⏱</span> Auto refresh';
      }
    };
    sync();
    startAuto();
    if (on && dailyMode) refreshHotspots(false);

    autoBtn.addEventListener(
      "click",
      () => {
        on = !on;
        localStorage.setItem(autoKey, on ? "1" : "0");
        sync();
        startAuto();
        if (on) refreshHotspots(false, { force: true });
      },
      { signal },
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.visibilityState !== "visible" || !on || !dailyMode) return;
        const cached = loadCache();
        if (!cached || cached.dayKey !== dayKey()) refreshHotspots(false);
      },
      { signal },
    );
  }

  window.addEventListener(
    "vv-learn-refresh-all",
    () => {
      if (SYNC.shouldAutoRefresh?.(meta)) refreshHotspots(false, { force: true });
    },
    { signal },
  );

  bootstrap();
};


/* === assets/learn-picks.js === */
/** Learn feed — daily picks, quick nav, skip thin radars in scroll */
(function initLearnPicks() {
  const intro = document.getElementById("feedIntroLearn");
  if (!intro) return;

  const SECTIONS = {
    radar: { hub: "hotspotHubItem", emoji: "📡", title: "Hotspot Radar", tag: "News", data: "HOTSPOT_RADAR" },
    aitools: { hub: "aiToolsHubItem", emoji: "🤖", title: "AI Tools Daily", tag: "Tools" },
    mind: { hub: "mindHubItem", emoji: "🌿", title: "Mind Check-in", tag: "Guide" },
    campus: { hub: "campusHubItem", emoji: "🏫", title: "Campus Life", tag: "News", data: "CAMPUS_LIFE", group: "more" },
    dating: { hub: "datingHubItem", emoji: "💕", title: "Dating 101", tag: "Guide" },
    career: { hub: "careerHubItem", emoji: "💼", title: "Career Radar", tag: "News", data: "JOB_RADAR" },
    jobs: { hub: "careerHubItem", emoji: "💼", title: "Career · Jobs", tag: "News", data: "JOB_RADAR", careerTab: "jobs" },
    startup: { hub: "careerHubItem", emoji: "🚀", title: "Career · Startups", tag: "News", data: "STARTUP_WIRE", careerTab: "startup" },
    creatorplay: { hub: "creatorPlayHubItem", emoji: "🎬", title: "Creator & Play", tag: "News", data: "GAMING_PULSE", group: "more" },
    gaming: { hub: "creatorPlayHubItem", emoji: "🎮", title: "Creator · Gaming", tag: "News", data: "GAMING_PULSE", group: "more", playTab: "gaming" },
    creator: { hub: "creatorPlayHubItem", emoji: "🎬", title: "Creator · News", tag: "News", data: "CREATOR_KIT", group: "more", playTab: "creator" },
    wellness: { hub: "wellnessHubItem", emoji: "🌿", title: "Wellness Wire", tag: "News", data: "WELLNESS_WIRE", group: "more" },
    climate: { hub: "climateHubItem", emoji: "🌍", title: "Climate Brief", tag: "News", data: "CLIMATE_BRIEF", group: "more" },
    food: { hub: "foodHubItem", emoji: "🍜", title: "Food on Campus", tag: "News", data: "FOOD_CAMPUS", group: "more" },
    finance: { hub: "financeHubItem", emoji: "📈", title: "Finance News", tag: "News", data: "FINANCIAL_NEWS" },
    stocks: { hub: "stockPulseHubItem", emoji: "🇺🇸", title: "US Hot Stocks", tag: "News", data: "STOCK_PULSE" },
    hustle: { hub: "hustleHubItem", emoji: "💡", title: "Side Hustle Lab", tag: "Guide" },
    vibecoding: { hub: "vibeHubItem", emoji: "🌱", title: "Vibe Coding", tag: "Guide" },
    wiki: { hub: "catWikiHubItem", emoji: "🐱", title: "Cat Encyclopedia", tag: "Fun" },
    worldcup: { hub: "wcHubItem", emoji: "⚽", title: "World Cup", tag: "Fun" },
    space: { hub: "spaceHubItem", emoji: "🛸", title: "Space News", tag: "Fun" },
    poetry: { hub: "poetryHubItem", emoji: "📜", title: "Daily Poetry", tag: "Fun" },
  };

  const MORE_SECTIONS = ["campus", "creatorplay", "wellness", "climate", "food"];
  const MIN_FULL = 5;

  const daySeed = () => {
    const d = new Date();
    return d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate();
  };

  const feedCount = (key) => {
    if (!key) return 99;
    const list = window[key];
    const meta = window[`${key}_META`];
    if (Array.isArray(list)) return list.length;
    if (meta?.count != null) return meta.count;
    return 0;
  };

  const SYNC = window.learnFeedSync || {};

  const sectionMeta = (sectionId) => {
    const meta = feedMetaFor(sectionId);
    const count = sectionItemCount(sectionId);
    return SYNC.normalizeFeedMeta ? SYNC.normalizeFeedMeta({ ...meta, count }) : { ...meta, count };
  };

  const isOfflineFeed = (sectionId) => {
    const cfg = SECTIONS[sectionId];
    if (!cfg?.data) return false;
    if (window.vvIsLearnSectionLoaded && !window.vvIsLearnSectionLoaded(sectionId)) return false;
    const m = sectionMeta(sectionId);
    return m.tier === "bundle";
  };

  const feedMetaFor = (sectionId) => {
    if (sectionId === "creatorplay") {
      const g = window.GAMING_PULSE_META || {};
      const c = window.CREATOR_KIT_META || {};
      return {
        offline: g.offline || c.offline,
        live: g.live && c.live,
        bundle: g.bundle || c.bundle,
      };
    }
    if (sectionId === "career") {
      const j = window.JOB_RADAR_META || {};
      const s = window.STARTUP_WIRE_META || {};
      return {
        offline: j.offline || s.offline,
        live: j.live && s.live,
        bundle: j.bundle || s.bundle,
      };
    }
    const key = SECTIONS[sectionId]?.data;
    return key ? window[`${key}_META`] || {} : {};
  };

  const activeLearnArticle = () => {
    const feed = document.getElementById("feed");
    if (!feed) return null;
    const feedRect = feed.getBoundingClientRect();
    const items = [...feed.querySelectorAll(".knowledge-feed-item:not(.hidden)")];
    let best = null;
    let bestVisible = 0;
    for (const el of items) {
      const rect = el.getBoundingClientRect();
      const visible = Math.min(rect.bottom, feedRect.bottom) - Math.max(rect.top, feedRect.top);
      if (visible > bestVisible) {
        bestVisible = visible;
        best = el;
      }
    }
    return best;
  };

  const syncLearnSearch = (query) => {
    const art = activeLearnArticle();
    const hint = document.getElementById("learnFeedSearchHint");
    if (!art) {
      if (hint) hint.textContent = "Scroll to a mini-app to search its content";
      return;
    }
    const section = art.dataset.learnSection;
    const cfg = SECTIONS[section];
    const input = art.querySelector('input[type="search"]');
    if (input) {
      input.value = query;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      if (hint) hint.innerHTML = query ? `Filtering <strong>${cfg?.title || section}</strong> · ${query}` : `Search <strong>${cfg?.title || section}</strong> · type to filter list`;
    } else if (hint) {
      hint.innerHTML = `<strong>${cfg?.title || section}</strong> has no list search — use chips above to jump`;
    }
  };

  const bindLearnSearch = () => {
    const input = document.getElementById("learnFeedSearch");
    if (!input || input.dataset.bound) return;
    input.dataset.bound = "1";
    input.addEventListener("input", () => syncLearnSearch(input.value));
    input.addEventListener("search", () => {
      if (!input.value.trim()) syncLearnSearch("");
    });
    const feed = document.getElementById("feed");
    if (feed && !feed.dataset.learnSearchScroll) {
      feed.dataset.learnSearchScroll = "1";
      feed.addEventListener("scroll", () => {
        const searchInput = document.getElementById("learnFeedSearch");
        if (!searchInput) return;
        syncLearnSearch(searchInput.value || "");
      }, { passive: true });
    }
  };

  window.focusLearnFeedSearch = () => {
    document.getElementById("learnFeedSearch")?.focus();
  };
  window.syncLearnSearch = syncLearnSearch;

  const expandSection = (learn) => {
    const cfg = SECTIONS[learn];
    if (!cfg) return null;
    const el = document.getElementById(cfg.hub);
    if (!el) return null;
    el.classList.remove("learn-feed-skip", "learn-feed-compact", "learn-feed-offline");
    el.classList.add("learn-feed-expanded");
    el.querySelector(".learn-feed-compact-bar")?.remove();
    el.querySelector(".learn-offline-ribbon")?.remove();
    return el;
  };

  window.scrollToLearnSection = async (learn) => {
    const sectionKey =
      learn === "jobs" || learn === "startup"
        ? learn
        : learn === "gaming" || learn === "creator"
          ? learn
          : learn;
    if (typeof window.vvEnsureLearnSection === "function") {
      await window.vvEnsureLearnSection(sectionKey);
    }
    const cfg = SECTIONS[learn];
    if (cfg?.playTab && typeof window.scrollToCreatorPlayTab === "function") {
      window.scrollToCreatorPlayTab(cfg.playTab);
      return;
    }
    if ((learn === "creatorplay" || learn === "gaming" || learn === "creator") && typeof window.scrollToCreatorPlayTab === "function") {
      window.scrollToCreatorPlayTab(learn === "creator" ? "creator" : "gaming");
      return;
    }
    if (cfg?.careerTab && typeof window.scrollToCareerTab === "function") {
      window.scrollToCareerTab(cfg.careerTab);
      return;
    }
    if ((learn === "career" || learn === "jobs" || learn === "startup") && typeof window.scrollToCareerTab === "function") {
      window.scrollToCareerTab(learn === "startup" ? "startup" : "jobs");
      return;
    }
    const el = expandSection(learn);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.refreshFeedProgress?.();
  };

  const pickDaily = () => {
    const seed = daySeed();
    const guides = ["mind", "dating", "hustle", "vibecoding", "aitools"];
    const newsPool = ["career", "stocks", "creatorplay", "wellness", "food", "climate", "campus"]
      .map((id) => {
        const dataKey = SECTIONS[id]?.data;
        let count = feedCount(dataKey);
        if (id === "career") {
          count = Math.max(feedCount("JOB_RADAR"), feedCount("STARTUP_WIRE"));
        }
        if (id === "creatorplay") {
          count = Math.max(feedCount("GAMING_PULSE"), feedCount("CREATOR_KIT"));
        }
        return { id, count };
      })
      .filter((x) => x.count >= MIN_FULL || !SECTIONS[x.id]?.group || x.count > 0)
      .sort((a, b) => b.count - a.count);
    const g1 = guides[seed % guides.length];
    const n1 = newsPool[0]?.id || newsPool[seed % Math.max(newsPool.length, 1)]?.id || "career";
    return [
      { id: "radar", ...SECTIONS.radar },
      { id: g1, ...SECTIONS[g1] },
      { id: n1, ...SECTIONS[n1] },
    ];
  };

  const chipGroups = () => [
    {
      label: "News",
      ids: ["radar", "career", "stocks", "finance"],
    },
    {
      label: "Guides",
      ids: ["aitools", "mind", "dating", "hustle", "vibecoding"],
    },
    {
      label: "More",
      ids: ["creatorplay", "wellness", "food", "climate", "campus", "wiki", "space", "poetry"],
    },
  ];

  const sectionItemCount = (id) => {
    if (id === "creatorplay") return Math.max(feedCount("GAMING_PULSE"), feedCount("CREATOR_KIT"));
    if (id === "career") return Math.max(feedCount("JOB_RADAR"), feedCount("STARTUP_WIRE"));
    const cfg = SECTIONS[id];
    return feedCount(cfg?.data);
  };

  const renderMoreList = () => {
    return MORE_SECTIONS.map((id) => {
      const cfg = SECTIONS[id];
      const count = sectionItemCount(id);
      const thin = isOfflineFeed(id);
      return `<button type="button" class="learn-more-item${thin ? " learn-more-item--thin" : ""}" data-learn="${id}">
        <span class="learn-more-emoji">${cfg.emoji}</span>
        <span class="learn-more-text">
          <strong>${cfg.title}</strong>
          <span>${count ? (thin ? `Offline pack · ${count} stories` : `${count} stories`) : "Offline pack · tap Refresh"}</span>
        </span>
      </button>`;
    }).join("");
  };

  const allQuickIds = () => {
    const seen = new Set();
    const ids = [];
    chipGroups().forEach((g) => g.ids.forEach((id) => {
      if (!seen.has(id) && SECTIONS[id]) {
        seen.add(id);
        ids.push(id);
      }
    }));
    return ids;
  };

  const MINI_APP_COUNT = 18;

  const render = () => {
    const picks = pickDaily();
    const offlineMore = MORE_SECTIONS.filter(isOfflineFeed).length;
    intro.innerHTML = `
      <div class="learn-toolbar">
        <div class="learn-toolbar-row">
          <div class="learn-feed-search-wrap">
            <label class="learn-feed-search-label" for="learnFeedSearch">Search current mini-app</label>
            <input type="search" class="learn-feed-search" id="learnFeedSearch" placeholder="Search feed…" autocomplete="off" enterkeyhint="search">
          </div>
          <button type="button" class="learn-nav-toggle" id="learnNavToggle" aria-expanded="false" aria-controls="learnNavDrawer">
            Browse <span class="learn-nav-count">${MINI_APP_COUNT}</span>
          </button>
        </div>
        <p class="learn-feed-search-hint" id="learnFeedSearchHint" aria-live="polite">Swipe ↕ mini-apps · <strong>/</strong> to search</p>
      </div>
      <div class="learn-nav-drawer hidden" id="learnNavDrawer">
        <p class="learn-drawer-label">Today's picks</p>
        <div class="learn-picks-scroll">
          ${picks
            .map(
              (p) => `<button type="button" class="learn-quick-pill learn-quick-pill--pick" data-learn="${p.id}">
            <span aria-hidden="true">${p.emoji}</span> ${p.title.split(" ")[0]}
          </button>`,
            )
            .join("")}
        </div>
        <p class="learn-drawer-label">Jump to</p>
        <div class="learn-picks-scroll learn-chips-scroll">
          ${allQuickIds()
            .map(
              (id) => `<button type="button" class="learn-quick-pill" data-learn="${id}">${SECTIONS[id].emoji} ${SECTIONS[id].title.split(" ")[0]}</button>`,
            )
            .join("")}
        </div>
        <div class="learn-more-wrap">
          <button type="button" class="learn-more-toggle" id="learnMoreToggle" aria-expanded="false">
            More feeds${offlineMore ? ` · ${offlineMore} offline` : ""} <span class="learn-more-count">${MORE_SECTIONS.length}</span>
          </button>
          <div class="learn-more-panel hidden" id="learnMorePanel">${renderMoreList()}</div>
        </div>
      </div>`;

    intro.classList.remove("is-nav-open");

    const closeNavDrawer = () => {
      intro.classList.remove("is-nav-open");
      intro.querySelector("#learnNavDrawer")?.classList.add("hidden");
      intro.querySelector("#learnNavToggle")?.setAttribute("aria-expanded", "false");
    };

    intro.querySelectorAll("[data-learn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.scrollToLearnSection(btn.getAttribute("data-learn"));
        closeNavDrawer();
      });
    });

    intro.querySelector("#learnNavToggle")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const panel = intro.querySelector("#learnNavDrawer");
      const btn = intro.querySelector("#learnNavToggle");
      const open = panel?.classList.toggle("hidden") === false;
      intro.classList.toggle("is-nav-open", open);
      if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    intro.querySelector("#learnMoreToggle")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const panel = intro.querySelector("#learnMorePanel");
      const btn = intro.querySelector("#learnMoreToggle");
      const open = panel?.classList.toggle("hidden") === false;
      if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    if (!intro.dataset.navBound) {
      intro.dataset.navBound = "1";
      document.addEventListener("click", (e) => {
        if (!intro.classList.contains("is-nav-open")) return;
        if (e.target.closest("#feedIntroLearn")) return;
        closeNavDrawer();
      });
    }
  };

  const applyOfflineBadges = () => {
    document.querySelectorAll(".knowledge-feed-item[data-learn-section]").forEach((art) => {
      const section = art.dataset.learnSection;
      const cfg = SECTIONS[section];
      const expanded = art.classList.contains("learn-feed-expanded");

      if (!cfg?.data) {
        art.classList.remove("learn-feed-offline", "learn-feed-compact", "learn-feed-skip");
        art.querySelector(".learn-feed-compact-bar")?.remove();
        art.querySelector(".learn-offline-ribbon")?.remove();
        return;
      }

      const count = sectionItemCount(section);
      const m = sectionMeta(section);
      const offline = m.tier === "bundle";

      if (!expanded && offline && count === 0) {
        art.classList.add("learn-feed-compact");
        art.classList.remove("learn-feed-skip");
        if (!art.querySelector(".learn-feed-compact-bar")) {
          const bar = document.createElement("button");
          bar.type = "button";
          bar.className = "learn-feed-compact-bar";
          bar.innerHTML = `<span class="learn-feed-compact-emoji">${cfg.emoji}</span><span class="learn-feed-compact-text"><strong>${cfg.title}</strong> · Offline pack · tap Refresh for live</span><span class="learn-feed-compact-arrow">›</span>`;
          bar.addEventListener("click", () => window.scrollToLearnSection(section));
          art.insertBefore(bar, art.firstChild);
        }
      } else {
        art.classList.remove("learn-feed-compact", "learn-feed-skip");
        art.querySelector(".learn-feed-compact-bar")?.remove();
      }

      art.classList.toggle("learn-feed-offline", m.tier === "bundle" && !expanded);

      let ribbon = art.querySelector(".learn-offline-ribbon");
      if (m.tier === "bundle" && !expanded && count >= MIN_FULL) {
        if (!ribbon) {
          ribbon = document.createElement("div");
          ribbon.className = "learn-offline-ribbon";
          ribbon.setAttribute("role", "status");
          art.insertBefore(ribbon, art.firstChild);
        }
        ribbon.textContent = SYNC.formatStatusLabel
          ? SYNC.formatStatusLabel(m, count)
          : `Offline pack · ${count} stories · tap Refresh for live`;
      } else {
        ribbon?.remove();
      }
    });
    window.refreshFeedProgress?.();
  };

  render();
  applyOfflineBadges();
  bindLearnSearch();
  syncLearnSearch("");

  window.addEventListener("vv-learn-radar-update", () => applyOfflineBadges());
  window.addEventListener("vv-learn-sections-prefetched", () => applyOfflineBadges());

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.dataset.tab === "knowledge") setTimeout(applyOfflineBadges, 400);
    });
  });

  window.refreshLearnPicks = () => {
    const prev = document.getElementById("learnFeedSearch")?.value || "";
    render();
    applyOfflineBadges();
    bindLearnSearch();
    const input = document.getElementById("learnFeedSearch");
    if (input && prev) {
      input.value = prev;
      syncLearnSearch(prev);
    } else {
      syncLearnSearch("");
    }
  };
})();
