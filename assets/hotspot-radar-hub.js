/* Hotspot Radar — daily trending tech / AI feed (Learn tab #7) */
(function initHotspotRadar() {
  const app = document.getElementById("hrApp");
  if (!app) return;

  const RSS = window.FINANCIAL_NEWS_RSS || {};
  const SYNC = window.learnFeedSync || {};
  const DAY_MS = window.HOTSPOT_RADAR_DAY_MS || 24 * 60 * 60 * 1000;
  const STALE_MS = SYNC.STALE_MS ?? window.HOTSPOT_RADAR_STALE_MS ?? 5 * 60 * 1000;
  const FEEDS = window.HOTSPOT_RADAR_FEEDS || [];
  const DOMAINS = window.HOTSPOT_RADAR_DOMAINS || [{ id: "all", label: "All" }];
  const PLATFORMS = window.HOTSPOT_RADAR_PLATFORMS || [{ id: "all", label: "All" }];

  const CACHE_KEY = "vv_hotspot_radar_cache";
  const SAVED_KEY = "vv_hotspot_radar_saved";
  const AUTO_KEY = "vv_hotspot_radar_auto";

  const listEl = document.getElementById("hrList");
  const radarEl = document.getElementById("hrRadarDots");
  const updatedEl = document.getElementById("hrUpdatedAt");
  const domainRow = document.getElementById("hrDomainFilters");
  const platformRow = document.getElementById("hrPlatformFilters");
  const searchInput = document.getElementById("hrSearch");
  const sheet = document.getElementById("hrSheet");
  const countEl = document.getElementById("hrListCount");

  let hotspots = [];
  let meta = window.HOTSPOT_RADAR_META || {};
  let activeDomain = "all";
  let activePlatform = "all";
  let savedOnly = false;
  let activeId = null;
  let refreshing = false;
  let autoTimer = null;
  let autoRefreshOn = false;
  let speaking = false;

  const escapeHtml = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);

  const isToday = (iso) =>
    SYNC.validatePublishedAt ? SYNC.validatePublishedAt(iso, DAY_MS) : Date.now() - new Date(iso).getTime() <= DAY_MS;

  const hrPrefs = SYNC.loadPrefs?.("vv_hotspot_radar_prefs");
  if (hrPrefs?.domain) activeDomain = hrPrefs.domain;
  if (hrPrefs?.platform) activePlatform = hrPrefs.platform;

  const minsAgo = (iso) => Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));

  const formatAgo = (iso) => {
    const m = minsAgo(iso);
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

  const decode = (s) => (RSS.decodeEntities ? RSS.decodeEntities(s) : s);

  const hashId = (url) => {
    let h = 0;
    for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) >>> 0;
    return h.toString(16).slice(0, 12);
  };

  const classifyDomain = (title = "", summary = "") => {
    const t = `${title} ${summary}`.toLowerCase();
    if (/\b(ai|openai|anthropic|claude|gpt|llm|gemini|deepseek|model|chatbot)\b/.test(t)) return "ai";
    if (/\b(stock|market|fed|earnings|ipo|bank|invest|crypto|bitcoin)\b/.test(t)) return "business";
    if (/\b(reddit|social|viral|meme|influencer|tiktok|twitter|x\.com)\b/.test(t)) return "social";
    return "tech";
  };

  const computeHeat = (publishedAt, rank) => {
    const ageH = Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 3600000);
    const base = Math.max(500, 9000 - ageH * 380);
    return Math.round((base - rank * 120 + (rank % 3) * 47) * 10) / 10;
  };

  const cleanHnBody = (text) => {
    const t = String(text || "");
    if (!/Article URL:/i.test(t)) return t;
    const urlMatch = t.match(/Article URL:\s*(\S+)/i);
    const pointsMatch = t.match(/Points:\s*(\d+)/i);
    const commentsMatch = t.match(/#\s*Comments:\s*(\d+)/i);
    const parts = [];
    if (pointsMatch) parts.push(`${pointsMatch[1]} upvotes on Hacker News`);
    if (commentsMatch) parts.push(`${commentsMatch[1]} comments`);
    if (urlMatch && parts.length) return parts.join(" · ");
    return t.replace(/Article URL:.*?$/s, "").trim() || t;
  };

  const enrichItem = (raw, feed, rank) => {
    const title = decode(raw.title);
    const summary = decode(raw.summary);
    const body = decode(raw.body || raw.summary);
    const domain = feed.domain || raw.domain || classifyDomain(title, summary);
    const publishedAt = raw.publishedAt;
    return {
      id: raw.id || hashId(raw.url),
      title,
      summary,
      body,
      url: raw.url,
      source: raw.source || feed.source,
      sourceKey: feed.sourceKey || raw.sourceKey,
      sourceIcon: feed.sourceIcon || raw.sourceIcon,
      platform: feed.platform || raw.platform,
      platformLabel: feed.platformLabel || raw.platformLabel,
      domain,
      publishedAt,
      heat: raw.heat != null ? raw.heat : computeHeat(publishedAt, rank),
      rank,
    };
  };

  const normalizeList = (list) =>
    (list || [])
      .filter((a) => a.url && isToday(a.publishedAt))
      .map((a, i) => {
        const decoded = {
          ...a,
          title: decode(a.title),
          summary: decode(a.summary),
          body: decode(a.body),
          rank: i + 1,
        };
        return window.learnRadarPolishItem ? window.learnRadarPolishItem(decoded) : decoded;
      });

  const isDataStale = (fetchedAt) => !fetchedAt || Date.now() - new Date(fetchedAt).getTime() > STALE_MS;

  const loadCache = () => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
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
        CACHE_KEY,
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
      return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"));
    } catch (_) {
      return new Set();
    }
  };

  const saveSaved = (set) => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify([...set]));
    } catch (_) {}
  };

  const buildDeepDive = (item) => {
    const cleaned = cleanHnBody(item.body) || item.summary;
    const domainLabel = DOMAINS.find((d) => d.id === item.domain)?.label || item.domain;
    return (
      `Here is a deep dive on today's trending topic.\n\n` +
      `### **${item.title}**\n\n` +
      `${cleaned}\n\n` +
      `**Context:** This story is trending on **${item.platformLabel}** via **${item.source}** (${domainLabel}). ` +
      `Heat score **${item.heat}** reflects how fresh and prominent it is in the last 24 hours.\n\n` +
      `**Why it matters:** ${item.summary}\n\n` +
      `**What to watch:** Check the original article for updates and follow related threads on ${item.platformLabel}.`
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
          .filter((a) => isToday(a.publishedAt))
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
    const urls = [feed.url, ...(feed.fallbacks || [])];
    for (const url of urls) {
      try {
        const xml = await fetchRssProxy(url, bust);
        const feedForParse = { ...feed, topic: feed.domain };
        const items = RSS.parseRssXml(xml, feedForParse, 10, hashId).filter((a) => isToday(a.publishedAt));
        if (items.length) return items.map((a) => enrichItem(a, feed, 0));
      } catch (_) {}
    }
    return [];
  };

  const setHotspots = (list, m) => {
    const sorted = normalizeList(list)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 30)
      .map((a, i) => ({ ...a, rank: i + 1, heat: computeHeat(a.publishedAt, i + 1) }));
    hotspots = sorted;
    meta = SYNC.normalizeFeedMeta
      ? SYNC.normalizeFeedMeta({
          ...meta,
          ...(m || {}),
          count: sorted.length,
          sourceCount: m?.sourceCount || new Set(sorted.map((h) => h.sourceKey)).size,
        })
      : { ...meta, ...(m || {}), count: sorted.length };
    SYNC.applyFeedStatus?.(updatedEl, meta, sorted.length);
    SYNC.publishWindowMeta?.("HOTSPOT_RADAR", meta);
    renderAll();
    window.dispatchEvent(
      new CustomEvent("vv-learn-radar-update", {
        detail: { windowKey: "HOTSPOT_RADAR", learnSection: "radar", count: sorted.length, tier: meta.tier, offline: meta.tier !== "live" },
      }),
    );
  };

  const updateUpdatedLabel = () => {
    SYNC.applyFeedStatus?.(updatedEl, meta, hotspots.length);
  };

  const refreshHotspots = async (manual = false, opts = {}) => {
    if (refreshing) return;
    const force = opts.force === true;
    if (!manual && !force && SYNC.shouldAutoRefresh && !SYNC.shouldAutoRefresh(meta)) return;
    refreshing = true;
    meta = { ...meta, refreshing: true, refreshFailed: false };
    SYNC.applyFeedStatus?.(updatedEl, meta, hotspots.length);
    const prevIds = SYNC.topIds ? SYNC.topIds(hotspots) : [];
    if (manual && typeof showAppToast === "function") showAppToast("Scanning hotspots…");

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
        const merged = (SYNC.dedupeArticles
          ? SYNC.dedupeArticles(collected, { maxItems: 30, windowMs: DAY_MS })
          : collected
        ).map((a, i) => enrichItem(a, a, i + 1));
        const m = SYNC.buildFeedMeta
          ? SYNC.buildFeedMeta(merged, { feedCount: FEEDS.length, okSources: okSources.size, errors })
          : {
              fetchedAt: new Date().toISOString(),
              dayKey: dayKey(),
              count: merged.length,
              sourceCount: okSources.size,
            };
        m.dayKey = dayKey();
        m.refreshing = false;
        m.refreshFailed = false;
        saveCache(merged, m);
        setHotspots(merged, m);
        SYNC.maybeNotify?.("radar", prevIds, merged, "Hotspot Radar");
        if (manual && typeof showAppToast === "function") {
          showAppToast(SYNC.formatStatusLabel ? SYNC.formatStatusLabel(m, merged.length) : `Updated · ${merged.length} hotspots`);
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
          showAppToast("Refresh failed — check connection or try again");
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
    const bundled = normalizeList(window.HOTSPOT_RADAR || []);
    if (bundled.length) {
      setHotspots(bundled, { ...meta, offline: true, bundle: true, live: false, cached: false });
      if (autoRefreshOn) refreshHotspots(false, { force: true });
      return;
    }
    if (listEl) listEl.innerHTML = '<p class="hr-empty">Scanning today\'s hotspots…</p>';
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
    const items = filteredHotspots().slice(0, 15);
    radarEl.innerHTML = items
      .map((h, i) => {
        const pos = radarPosition(i, items.length);
        const size = h.rank <= 3 ? " hr-dot--lg" : "";
        return `<button type="button" class="hr-dot${size}" data-hr-id="${escapeHtml(h.id)}" style="left:${pos.left}%;top:${pos.top}%" title="${escapeHtml(h.title)}" aria-label="Rank ${h.rank}: ${escapeHtml(h.title)}">${h.rank}</button>`;
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
            (h) => `<button type="button" class="hr-card" data-hr-id="${escapeHtml(h.id)}">
          <span class="hr-rank" aria-hidden="true">${h.rank}</span>
          <div class="hr-card-body">
            <h3 class="hr-card-title">${escapeHtml(h.title)}</h3>
            <p class="hr-card-snippet">${escapeHtml(h.summary)}</p>
            <div class="hr-card-meta">
              <span class="hr-tag hr-tag--platform">${escapeHtml(h.platformLabel)}</span>
              <span class="hr-time">${formatTs(h.publishedAt)}</span>
              <span class="hr-heat" aria-label="Heat ${h.heat}">🔥 ${h.heat}</span>
            </div>
          </div>
          <span class="hr-card-arrow" aria-hidden="true">›</span>
        </button>`,
          )
          .join("")
      : '<p class="hr-empty">No hotspots match your filters.</p>';
  };

  const renderAll = () => {
    renderRadar();
    renderList();
  };

  const itemById = (id) => hotspots.find((h) => h.id === id);

  const stopSpeech = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    speaking = false;
    document.getElementById("hrReadBtn")?.classList.remove("speaking");
  };

  const readDeepDive = () => {
    const item = itemById(activeId);
    if (!item || !window.speechSynthesis) return;
    stopSpeech();
    const text = buildDeepDive(item).replace(/[#*]/g, "");
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.95;
    u.onend = () => {
      speaking = false;
      document.getElementById("hrReadBtn")?.classList.remove("speaking");
    };
    speaking = true;
    document.getElementById("hrReadBtn")?.classList.add("speaking");
    window.speechSynthesis.speak(u);
  };

  const openSheet = (id) => {
    const h = itemById(id);
    if (!h || !sheet) return;
    activeId = id;
    stopSpeech();

    document.getElementById("hrSheetRank").textContent = `#${h.rank}`;
    document.getElementById("hrSheetPlatform").textContent = h.platformLabel;
    document.getElementById("hrSheetTitle").textContent = h.title;
    document.getElementById("hrSheetHeat").textContent = String(h.heat);
    document.getElementById("hrSheetTime").textContent = formatTs(h.publishedAt);
    document.getElementById("hrSheetDeep").textContent = buildDeepDive(h);

    const saved = getSaved();
    const saveBtn = document.getElementById("hrSheetSave");
    if (saveBtn) {
      saveBtn.classList.toggle("active", saved.has(id));
      saveBtn.innerHTML = saved.has(id)
        ? '<span aria-hidden="true">♥</span> Saved'
        : '<span aria-hidden="true">♡</span> Save';
    }

    const link = document.getElementById("hrSheetLink");
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

  const renderFilters = () => {
    const mk = (row, items, active, attr) => {
      if (!row) return;
      row.innerHTML = items
        .map(
          (x) =>
            `<button type="button" class="hr-filter${active === x.id ? " active" : ""}" data-${attr}="${escapeHtml(x.id)}">${escapeHtml(x.label)}</button>`,
        )
        .join("");
    };
    mk(domainRow, DOMAINS, activeDomain, "hr-domain");
    mk(platformRow, PLATFORMS, activePlatform, "hr-platform");
  };

  const setupAutoRefresh = () => {
    let on = true;
    try {
      const saved = localStorage.getItem(AUTO_KEY);
      on = saved === null || saved === "1";
      if (saved === null) {
        localStorage.setItem(AUTO_KEY, "1");
      }
    } catch (_) {}
    autoRefreshOn = on;
    const btn = document.getElementById("hrAutoBtn");
    const syncBtn = () => {
      if (btn) {
        btn.classList.toggle("active", on);
        btn.innerHTML = on
          ? '<span aria-hidden="true">⏱</span> Auto on'
          : '<span aria-hidden="true">⏱</span> Auto refresh';
      }
    };
    syncBtn();
    if (autoTimer) clearInterval(autoTimer);
    if (on) {
      autoTimer = setInterval(() => refreshHotspots(false, { force: true }), STALE_MS);
    }
    btn?.addEventListener("click", () => {
      on = !on;
      autoRefreshOn = on;
      try {
        localStorage.setItem(AUTO_KEY, on ? "1" : "0");
      } catch (_) {}
      syncBtn();
      if (autoTimer) clearInterval(autoTimer);
      if (on) {
        autoTimer = setInterval(() => refreshHotspots(false, { force: true }), STALE_MS);
        refreshHotspots(false, { force: true });
      }
    });
  };

  renderFilters();

  domainRow?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-hr-domain]");
    if (!btn) return;
    activeDomain = btn.dataset.hrDomain;
    renderFilters();
    renderAll();
  });

  platformRow?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-hr-platform]");
    if (!btn) return;
    activePlatform = btn.dataset.hrPlatform;
    renderFilters();
    renderAll();
  });

  searchInput?.addEventListener("input", renderAll);

  document.getElementById("hrRefreshBtn")?.addEventListener("click", () => refreshHotspots(true));

  document.getElementById("hrSavedToggle")?.addEventListener("click", () => {
    savedOnly = !savedOnly;
    document.getElementById("hrSavedToggle")?.classList.toggle("active", savedOnly);
    renderAll();
  });

  app.addEventListener("click", (e) => {
    const card = e.target.closest("[data-hr-id]");
    if (card) openSheet(card.dataset.hrId);
  });

  document.getElementById("hrSheetClose")?.addEventListener("click", closeSheet);
  document.getElementById("hrSheetBackdrop")?.addEventListener("click", closeSheet);
  document.getElementById("hrReadBtn")?.addEventListener("click", () => {
    if (speaking) stopSpeech();
    else readDeepDive();
  });

  document.getElementById("hrSheetSave")?.addEventListener("click", () => {
    if (!activeId) return;
    const saved = getSaved();
    if (saved.has(activeId)) saved.delete(activeId);
    else saved.add(activeId);
    saveSaved(saved);
    openSheet(activeId);
  });

  setupAutoRefresh();
  window.addEventListener("vv-learn-refresh-all", () => {
    if (SYNC.shouldAutoRefresh?.(meta)) refreshHotspots(false, { force: true });
  });
  bootstrap();
})();
