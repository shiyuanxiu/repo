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
