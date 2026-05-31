/* Financial news hub — weekly headlines from US-accessible RSS feeds */
(function initFinancialNewsHub() {
  const RSS = window.FINANCIAL_NEWS_RSS || {};
  const WEEK_MS = window.FINANCIAL_NEWS_WEEK_MS || 7 * 24 * 60 * 60 * 1000;
  const STALE_MS = window.learnFeedSync?.STALE_MS ?? window.FINANCIAL_NEWS_STALE_MS ?? 2 * 60 * 1000;
  const REFRESH_MS = window.learnFeedSync?.REFRESH_MS ?? 90 * 1000;
  const SYNC = window.learnFeedSync || {};
  const CACHE_KEY = "vv_financial_news_cache";
  const READ_KEY = "vv_financial_news_read";
  const SAVED_KEY = "vv_financial_news_saved";
  const FEEDS = window.FINANCIAL_NEWS_FEEDS || [];

  let articles = [];
  let newsMeta = window.FINANCIAL_NEWS_META || {};
  const topics = window.FINANCIAL_NEWS_TOPICS || [];
  const sources = window.FINANCIAL_NEWS_SOURCES || [];

  const listEl = document.getElementById("fnCardList");
  if (!listEl) return;

  const topicRow = document.getElementById("fnTopicFilters");
  const sourceRow = document.getElementById("fnSourceFilters");
  const searchInput = document.getElementById("fnSearch");
  const readBadge = document.getElementById("fnReadBadge");
  const updatedEl = document.getElementById("fnUpdatedAt");
  const sheet = document.getElementById("fnSheet");

  let activeTopic = "all";
  let activeSource = "all";
  let activeArticleId = null;
  let refreshing = false;

  const escapeHtml = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const weekKey = (d = new Date()) => {
    const jan1 = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
  };

  const isWithinWeek = (iso) => Date.now() - new Date(iso).getTime() <= WEEK_MS;

  const minsAgo = (iso) => Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));

  const formatAgo = (iso) => {
    const m = minsAgo(iso);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    return h < 48 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
  };

  const normalizeArticle = (a) => ({
    ...a,
    title: RSS.decodeEntities ? RSS.decodeEntities(a.title) : a.title,
    summary: RSS.decodeEntities ? RSS.decodeEntities(a.summary) : a.summary,
    body: RSS.decodeEntities ? RSS.decodeEntities(a.body) : a.body,
  });

  const filterWeek = (list) =>
    (list || []).filter((a) => a.url && isWithinWeek(a.publishedAt)).map(normalizeArticle);

  const isDataStale = (fetchedAt) => {
    if (!fetchedAt) return true;
    return Date.now() - new Date(fetchedAt).getTime() > STALE_MS;
  };

  const loadCache = () => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data.weekKey !== weekKey()) return null;
      if (Date.now() - new Date(data.fetchedAt).getTime() > WEEK_MS) return null;
      return data;
    } catch (_) {
      return null;
    }
  };

  const saveCache = (list, meta) => {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          articles: list,
          fetchedAt: meta.fetchedAt || new Date().toISOString(),
          weekKey: weekKey(),
          sourceCount: meta.sourceCount || countSources(list),
        }),
      );
    } catch (_) {}
  };

  const countSources = (list) => new Set((list || []).map((a) => a.sourceKey)).size;

  const needsRefresh = () => SYNC.shouldAutoRefresh?.(newsMeta) ?? isDataStale(newsMeta.fetchedAt);

  const updateUpdatedLabel = () => {
    SYNC.applyFeedStatus?.(updatedEl, newsMeta, articles.length);
  };

  const setArticles = (list, meta) => {
    articles = filterWeek(list);
    newsMeta = SYNC.normalizeFeedMeta
      ? SYNC.normalizeFeedMeta({
          ...newsMeta,
          ...(meta || {}),
          count: articles.length,
          sourceCount: meta?.sourceCount || countSources(articles),
        })
      : { ...newsMeta, ...(meta || {}), sourceCount: meta?.sourceCount || countSources(articles) };
    SYNC.publishWindowMeta?.("FINANCIAL_NEWS", newsMeta);
    updateUpdatedLabel();
    renderCards();
    window.dispatchEvent(
      new CustomEvent("vv-learn-radar-update", {
        detail: { windowKey: "FINANCIAL_NEWS", learnSection: "finance", count: articles.length, tier: newsMeta.tier, offline: newsMeta.tier !== "live" },
      }),
    );
  };

  const getRead = () => {
    try {
      return new Set(JSON.parse(localStorage.getItem(READ_KEY) || "[]"));
    } catch (_) {
      return new Set();
    }
  };

  const getSaved = () => {
    try {
      return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"));
    } catch (_) {
      return new Set();
    }
  };

  const saveRead = (set) => {
    try {
      localStorage.setItem(READ_KEY, JSON.stringify([...set]));
    } catch (_) {}
    if (readBadge) readBadge.textContent = String(set.size);
  };

  const saveSaved = (set) => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify([...set]));
    } catch (_) {}
  };

  const articleById = (id) => articles.find((a) => a.id === id);

  const hashId = (url) => {
    let h = 0;
    for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) >>> 0;
    return h.toString(16).slice(0, 12);
  };

  const fetchRssProxy = async (feedUrl, bust = false) => {
    if (typeof window.fetchRssText === "function") return window.fetchRssText(feedUrl, { bust });
    throw new Error("RSS proxy unavailable");
  };

  const fetchFeedClient = async (feed, bust = false) => {
    const urls = [feed.url, ...(feed.fallbacks || [])];
    for (const url of urls) {
      try {
        const xml = await fetchRssProxy(url, bust);
        const items = RSS.parseRssXml(xml, feed, 10, hashId).filter((a) => isWithinWeek(a.publishedAt));
        if (items.length) return items;
      } catch (_) {}
    }
    return [];
  };

  const refreshFinancialNews = async (manual = false, opts = {}) => {
    if (refreshing) return;
    const force = opts.force === true;
    if (!manual && !force && SYNC.shouldAutoRefresh && !SYNC.shouldAutoRefresh(newsMeta)) return;
    refreshing = true;
    newsMeta = { ...newsMeta, refreshing: true, refreshFailed: false };
    SYNC.applyFeedStatus?.(updatedEl, newsMeta, articles.length);
    const prevIds = SYNC.topIds ? SYNC.topIds(articles) : [];
    if (manual && typeof showAppToast === "function") showAppToast("Refreshing headlines…");

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
          ? SYNC.dedupeArticles(collected, { maxItems: 80, windowMs: WEEK_MS })
          : collected
        ).map((a, i) => ({ ...normalizeArticle(a), featured: i < 10 }));
        const meta = SYNC.buildFeedMeta
          ? { ...SYNC.buildFeedMeta(merged, { feedCount: FEEDS.length, okSources: okSources.size, errors }), weekKey: weekKey() }
          : {
              fetchedAt: new Date().toISOString(),
              weekKey: weekKey(),
              count: merged.length,
              sourceCount: okSources.size,
            };
        meta.refreshing = false;
        meta.refreshFailed = false;
        saveCache(merged, meta);
        setArticles(merged, meta);
        SYNC.maybeNotify?.("finance", prevIds, merged, "Daily Finance");
        if (manual && typeof showAppToast === "function") {
          showAppToast(SYNC.formatStatusLabel ? SYNC.formatStatusLabel(meta, merged.length) : `Updated · ${merged.length} headlines`);
        }
      } else {
        newsMeta = {
          ...newsMeta,
          refreshing: false,
          refreshFailed: manual,
          refreshAttemptAt: new Date().toISOString(),
        };
        SYNC.applyFeedStatus?.(updatedEl, newsMeta, articles.length);
        if (manual && typeof showAppToast === "function") {
          showAppToast("Refresh failed — check connection or try again");
        }
      }
    } finally {
      refreshing = false;
    }
  };

  const bootstrapArticles = async () => {
    const cached = loadCache();
    if (cached?.articles?.length) {
      setArticles(cached.articles, {
        fetchedAt: cached.fetchedAt,
        weekKey: cached.weekKey,
        sourceCount: cached.sourceCount,
        cached: true,
        live: false,
      });
      refreshFinancialNews(false);
      return;
    }
    const bundled = filterWeek(window.FINANCIAL_NEWS || []);
    if (bundled.length) {
      setArticles(bundled, { ...newsMeta, offline: true, bundle: true, live: false, cached: false });
      return;
    }
    listEl.innerHTML = '<p class="finance-empty">Loading headlines…</p>';
    await refreshFinancialNews(false);
  };

  const openSheet = (id) => {
    const a = articleById(id);
    if (!a || !sheet) return;
    activeArticleId = id;
    const read = getRead();
    read.add(id);
    saveRead(read);

    document.getElementById("fnSheetSource").textContent = `${a.sourceIcon} ${a.source}`;
    document.getElementById("fnSheetTime").textContent = formatAgo(a.publishedAt);
    document.getElementById("fnSheetTitle").textContent = a.title;
    document.getElementById("fnSheetSummary").textContent = a.summary;
    document.getElementById("fnSheetBody").textContent = a.body || a.summary;
    document.getElementById("fnSheetTopic").textContent = a.topic;
    const noteEl = document.getElementById("fnSheetExcerptNote");
    if (noteEl) {
      noteEl.textContent =
        "This is an RSS excerpt from the publisher. Open the original article for the full story and latest updates.";
    }
    const link = document.getElementById("fnSheetLink");
    if (link) {
      link.href = a.url;
      link.textContent = "Read full article";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    const saveBtn = document.getElementById("fnSheetSave");
    const saved = getSaved();
    if (saveBtn) {
      saveBtn.classList.toggle("primary", saved.has(id));
      saveBtn.innerHTML = saved.has(id)
        ? '<span aria-hidden="true">🔖</span> Saved'
        : '<span aria-hidden="true">🔖</span> Save';
    }
    sheet.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    renderCards();
  };

  const closeSheet = () => {
    sheet?.classList.add("hidden");
    document.body.style.overflow = "";
    activeArticleId = null;
  };

  const renderCards = () => {
    const q = (searchInput?.value || "").trim().toLowerCase();
    const read = getRead();
    const saved = getSaved();
    const filtered = articles.filter((a) => {
      const topicOk = activeTopic === "all" || a.topic === activeTopic;
      const sourceOk = activeSource === "all" || a.sourceKey === activeSource;
      const text = `${a.title} ${a.summary} ${a.source}`.toLowerCase();
      return topicOk && sourceOk && (!q || text.includes(q));
    });

    listEl.innerHTML = filtered.length
      ? filtered
          .map((a) => {
            const isRead = read.has(a.id);
            const isSaved = saved.has(a.id);
            const isNew = !isRead && a.featured;
            return `<button type="button" class="finance-card${isRead ? " is-read" : ""}" data-finance-id="${escapeHtml(a.id)}" role="listitem">
              <div class="finance-card-status">
                ${isRead ? '<span class="read-mark" title="Read">✓</span>' : ""}
                ${isNew ? '<span class="new-mark" title="New">!</span>' : ""}
              </div>
              <div class="finance-card-head">
                <span class="finance-card-source"><span aria-hidden="true">${a.sourceIcon}</span> ${escapeHtml(a.source)}</span>
                <time class="finance-card-time" datetime="${escapeHtml(a.publishedAt)}">${formatAgo(a.publishedAt)}</time>
              </div>
              <h3 class="finance-card-title">${escapeHtml(a.title)}</h3>
              <p class="finance-card-summary">${escapeHtml(a.summary)}</p>
              <div class="finance-card-foot">
                <button type="button" class="${isSaved ? "saved" : ""}" data-finance-save="${escapeHtml(a.id)}" aria-label="Save">${isSaved ? "🔖" : "☆"}</button>
                <button type="button" data-finance-share="${escapeHtml(a.id)}" aria-label="Share">↗</button>
                <button type="button" data-finance-open-ext="${escapeHtml(a.id)}" aria-label="Open original">🔗</button>
              </div>
            </button>`;
          })
          .join("")
      : '<p class="finance-empty">No headlines this week — tap Refresh to load latest.</p>';

    listEl.querySelectorAll("[data-finance-id]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (e.target.closest("[data-finance-save], [data-finance-share], [data-finance-open-ext]")) return;
        openSheet(btn.dataset.fnId);
      });
    });
    listEl.querySelectorAll("[data-finance-save]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.fnSave;
        const s = getSaved();
        if (s.has(id)) s.delete(id);
        else s.add(id);
        saveSaved(s);
        renderCards();
        if (typeof showAppToast === "function") showAppToast(s.has(id) ? "Saved" : "Removed");
      });
    });
    listEl.querySelectorAll("[data-finance-share]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const a = articleById(btn.dataset.fnShare);
        if (!a) return;
        if (navigator.share) {
          navigator.share({ title: a.title, text: a.summary, url: a.url }).catch(() => {});
        } else if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(`${a.title}\n${a.url}`);
          if (typeof showAppToast === "function") showAppToast("Link copied!");
        }
      });
    });
    listEl.querySelectorAll("[data-finance-open-ext]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const a = articleById(btn.dataset.fnOpenExt);
        if (a?.url) window.open(a.url, "_blank", "noopener,noreferrer");
      });
    });
  };

  if (topicRow && topics.length) {
    topicRow.innerHTML = topics
      .map(
        (t) =>
          `<button type="button" class="finance-filter-btn${t.id === activeTopic ? " active" : ""}" data-finance-topic="${t.id}" role="tab">${t.label}</button>`,
      )
      .join("");
    topicRow.querySelectorAll("[data-finance-topic]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTopic = btn.dataset.fnTopic;
        topicRow.querySelectorAll(".finance-filter-btn").forEach((b) => {
          b.classList.toggle("active", b.dataset.fnTopic === activeTopic);
        });
        renderCards();
      });
    });
  }

  if (sourceRow && sources.length) {
    sourceRow.innerHTML = sources
      .map(
        (s) =>
          `<button type="button" class="finance-filter-btn${s.id === activeSource ? " active" : ""}" data-finance-source="${s.id}" role="tab">${s.icon} ${s.label}</button>`,
      )
      .join("");
    sourceRow.querySelectorAll("[data-finance-source]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeSource = btn.dataset.fnSource;
        sourceRow.querySelectorAll(".finance-filter-btn").forEach((b) => {
          b.classList.toggle("active", b.dataset.fnSource === activeSource);
        });
        renderCards();
      });
    });
  }

  searchInput?.addEventListener("input", renderCards);

  document.getElementById("fnClearReadBtn")?.addEventListener("click", () => {
    saveRead(new Set());
    renderCards();
    if (typeof showAppToast === "function") showAppToast("Read history cleared");
  });

  document.getElementById("fnRefreshBtn")?.addEventListener("click", () => refreshFinancialNews(true));

  document.getElementById("fnNotifyBtn")?.addEventListener("click", async () => {
    const status = await SYNC.requestNotify?.("finance");
    if (status === "granted") {
      if (typeof showAppToast === "function") showAppToast("Alerts on — new headlines when tab is in background");
    } else if (status === "denied") {
      if (typeof showAppToast === "function") showAppToast("Enable notifications in browser settings");
    } else {
      try {
        localStorage.setItem("vv_financial_notify", "1");
      } catch (_) {}
      if (typeof showAppToast === "function") showAppToast("Auto-refresh every 5 min on Learn tab");
    }
  });

  document.getElementById("fnSheetClose")?.addEventListener("click", closeSheet);
  document.getElementById("fnSheetBackdrop")?.addEventListener("click", closeSheet);

  document.getElementById("fnSheetSave")?.addEventListener("click", () => {
    if (!activeArticleId) return;
    const s = getSaved();
    const wasSaved = s.has(activeArticleId);
    if (wasSaved) s.delete(activeArticleId);
    else s.add(activeArticleId);
    saveSaved(s);
    if (typeof showAppToast === "function") showAppToast(wasSaved ? "Removed from saved" : "Saved");
    openSheet(activeArticleId);
  });

  document.getElementById("fnSheetShare")?.addEventListener("click", () => {
    const a = articleById(activeArticleId);
    if (!a) return;
    if (navigator.share) {
      navigator.share({ title: a.title, text: a.summary, url: a.url }).catch(() => {});
    } else if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(`${a.title}\n${a.url}`);
      if (typeof showAppToast === "function") showAppToast("Link copied!");
    }
  });

  document.getElementById("fnSheetCopy")?.addEventListener("click", () => {
    const a = articleById(activeArticleId);
    if (!a || !navigator.clipboard?.writeText) return;
    navigator.clipboard.writeText(`${a.title}\n\n${a.body || a.summary}\n\n${a.url}`);
    if (typeof showAppToast === "function") showAppToast("Copied to clipboard");
  });

  document.querySelectorAll(".tab[data-tab='knowledge']").forEach((tab) => {
    tab.addEventListener("click", () => {
      if (needsRefresh()) refreshFinancialNews(false);
    });
  });

  const chipRow = document.getElementById("fnSourceChips");
  const homepages = window.FINANCIAL_NEWS_HOMEPAGES || {};
  if (chipRow && sources.length) {
    chipRow.innerHTML = sources
      .filter((s) => s.id !== "all")
      .map(
        (s) =>
          `<a class="finance-source-chip" href="${homepages[s.id] || "#"}" target="_blank" rel="noopener noreferrer" role="listitem"><span>${s.icon}</span> ${s.label}</a>`,
      )
      .join("");
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && needsRefresh()) refreshFinancialNews(false);
  });

  setInterval(() => {
    const onLearn =
      document.querySelector(".tab.active")?.dataset.tab === "knowledge" ||
      !document.getElementById("feedIntroLearn")?.classList.contains("hidden");
    if (onLearn && needsRefresh()) refreshFinancialNews(false);
  }, REFRESH_MS);

  window.addEventListener("vv-learn-refresh-all", () => {
    if (needsRefresh()) refreshFinancialNews(false, { force: true });
  });

  saveRead(getRead());
  bootstrapArticles();

  const params = new URLSearchParams(window.location.search);
  const articleParam = params.get("article");
  if (articleParam) {
    setTimeout(() => {
      if (articleById(articleParam)) openSheet(articleParam);
    }, 900);
  }
})();
