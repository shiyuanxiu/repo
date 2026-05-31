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
