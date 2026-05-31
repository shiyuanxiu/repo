/* AI Tools Daily — Learn tab feed #9 */
(function initAiToolsDaily() {
  const app = document.getElementById("atApp");
  if (!app) return;

  const CATALOG = window.AI_TOOLS_CATALOG || [];
  const CATEGORIES = window.AI_TOOLS_CATEGORIES || [{ id: "all", label: "All" }];
  const STALE_MS = window.AI_TOOLS_STALE_MS || 60 * 60 * 1000;

  const CACHE_KEY = "vv_ai_tools_daily_cache";
  const SAVED_KEY = "vv_ai_tools_saved";

  const featuredEl = document.getElementById("atFeatured");
  const listEl = document.getElementById("atList");
  const newsEl = document.getElementById("atNewsList");
  const catRow = document.getElementById("atCategoryFilters");
  const searchInput = document.getElementById("atSearch");
  const updatedEl = document.getElementById("atUpdatedAt");
  const countEl = document.getElementById("atListCount");
  const sheet = document.getElementById("atSheet");

  let daily = window.AI_TOOLS_DAILY || {};
  let meta = window.AI_TOOLS_DAILY_META || {};
  let activeCategory = "all";
  let savedOnly = false;
  let activeId = null;
  let speaking = false;

  const escapeHtml = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);

  const toolById = (id) => CATALOG.find((t) => t.id === id);

  const pickDailyClient = (key) => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    const n = CATALOG.length || 1;
    const featuredIdx = hash % n;
    const spotlight = [];
    for (let j = 1; j <= 3; j++) {
      const t = CATALOG[(featuredIdx + j * 7) % n];
      if (t) spotlight.push(t.id);
    }
    return {
      dayKey: key,
      featuredId: CATALOG[featuredIdx]?.id,
      spotlightIds: spotlight,
      news: daily.news || [],
    };
  };

  const pricingLabel = (p) => {
    const map = { free: "Free", freemium: "Freemium", paid: "Paid" };
    return map[p] || p;
  };

  const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || id;

  const formatAgo = () => {
    const t = meta.fetchedAt ? new Date(meta.fetchedAt).getTime() : 0;
    if (!t) return "today";
    const m = Math.max(0, Math.floor((Date.now() - t) / 60000));
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    return `${Math.floor(m / 60)}h ago`;
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

  const saveCache = (d, m) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ daily: d, meta: m, dayKey: dayKey() }));
    } catch (_) {}
  };

  const isStale = () => !meta.fetchedAt || Date.now() - new Date(meta.fetchedAt).getTime() > STALE_MS;

  const ensureDaily = () => {
    const key = dayKey();
    if (daily.dayKey !== key) daily = pickDailyClient(key);
    return daily;
  };

  const buildDeepDive = (t) =>
    `Tool of the day deep dive.\n\n` +
    `### **${t.name}**\n\n` +
    `${t.tagline}\n\n` +
    `**Use case:** ${t.useCase}\n\n` +
    `**Category:** ${categoryLabel(t.category)} · **Pricing:** ${pricingLabel(t.pricing)}\n\n` +
    `**Tip:** Try one real task today — a slide, email, or bug fix — instead of just browsing features.`;

  const sortedTools = () => {
    const d = ensureDaily();
    const order = new Map();
    if (d.featuredId) order.set(d.featuredId, 0);
    (d.spotlightIds || []).forEach((id, i) => order.set(id, i + 1));
    return [...CATALOG].sort((a, b) => {
      const oa = order.has(a.id) ? order.get(a.id) : 99;
      const ob = order.has(b.id) ? order.get(b.id) : 99;
      if (oa !== ob) return oa - ob;
      return a.name.localeCompare(b.name);
    });
  };

  const filteredTools = () => {
    const q = (searchInput?.value || "").trim().toLowerCase();
    const saved = getSaved();
    return sortedTools().filter((t) => {
      const catOk = activeCategory === "all" || t.category === activeCategory;
      const savedOk = !savedOnly || saved.has(t.id);
      const text = `${t.name} ${t.tagline} ${t.useCase} ${t.category}`.toLowerCase();
      return catOk && savedOk && (!q || text.includes(q));
    });
  };

  const renderFeatured = () => {
    if (!featuredEl) return;
    const d = ensureDaily();
    const t = toolById(d.featuredId);
    if (!t) {
      featuredEl.innerHTML = "";
      return;
    }
    const saved = getSaved();
    featuredEl.innerHTML = `<article class="at-featured-card" data-at-id="${escapeHtml(t.id)}">
      <span class="at-featured-badge">Tool of the day</span>
      <div class="at-featured-main">
        <span class="at-featured-icon" aria-hidden="true">${t.icon}</span>
        <div>
          <h3 class="at-featured-name">${escapeHtml(t.name)}</h3>
          <p class="at-featured-tagline">${escapeHtml(t.tagline)}</p>
        </div>
      </div>
      <p class="at-featured-use">${escapeHtml(t.useCase)}</p>
      <div class="at-featured-meta">
        <span class="at-tag at-tag--cat">${escapeHtml(categoryLabel(t.category))}</span>
        <span class="at-tag at-tag--price">${escapeHtml(pricingLabel(t.pricing))}</span>
        ${saved.has(t.id) ? '<span class="at-tag at-tag--saved">★ Saved</span>' : ""}
      </div>
      <span class="at-featured-cta">Tap for details →</span>
    </article>`;
  };

  const renderList = () => {
    if (!listEl) return;
    const d = ensureDaily();
    const spotlight = new Set(d.spotlightIds || []);
    const items = filteredTools().filter((t) => t.id !== d.featuredId);
    if (countEl) countEl.textContent = `${items.length + (d.featuredId ? 1 : 0)} tools`;

    listEl.innerHTML = items.length
      ? items
          .map((t) => {
            const saved = getSaved();
            return `<button type="button" class="at-card${spotlight.has(t.id) ? " at-card--spot" : ""}" data-at-id="${escapeHtml(t.id)}">
          <span class="at-card-icon" aria-hidden="true">${t.icon}</span>
          <span class="at-card-body">
            <span class="at-card-name">${escapeHtml(t.name)}${spotlight.has(t.id) ? ' <em class="at-spot-label">Spotlight</em>' : ""}${saved.has(t.id) ? ' <em class="at-saved-mark">★</em>' : ""}</span>
            <span class="at-card-tagline">${escapeHtml(t.tagline)}</span>
            <span class="at-card-meta">
              <span class="at-tag at-tag--cat">${escapeHtml(categoryLabel(t.category))}</span>
              <span class="at-tag at-tag--price">${escapeHtml(pricingLabel(t.pricing))}</span>
            </span>
          </span>
          <span class="at-card-arrow" aria-hidden="true">›</span>
        </button>`;
          })
          .join("")
      : '<p class="at-empty">No tools match your filters.</p>';
  };

  const renderNews = () => {
    if (!newsEl) return;
    const news = daily.news || [];
    newsEl.innerHTML = news.length
      ? news
          .map(
            (n) => `<a class="at-news-card" href="${escapeHtml(n.url)}" target="_blank" rel="noopener noreferrer">
          <span class="at-news-title">${escapeHtml(n.title)}</span>
          <span class="at-news-src">${escapeHtml(n.source)}</span>
        </a>`,
          )
          .join("")
      : "";
    newsEl.closest(".at-news-section")?.classList.toggle("hidden", !news.length);
  };

  const renderCategories = () => {
    if (!catRow) return;
    catRow.innerHTML = CATEGORIES.map(
      (c) =>
        `<button type="button" class="at-filter${activeCategory === c.id ? " active" : ""}" data-at-cat="${escapeHtml(c.id)}">${escapeHtml(c.label)}</button>`,
    ).join("");
  };

  const renderAll = () => {
    if (updatedEl) {
      updatedEl.textContent = `Updated ${formatAgo()} · ${dayKey()}`;
    }
    renderFeatured();
    renderList();
    renderNews();
    renderCategories();
  };

  const stopSpeech = () => {
    window.speechSynthesis?.cancel();
    speaking = false;
    document.getElementById("atReadBtn")?.classList.remove("speaking");
  };

  const readDeepDive = () => {
    const t = toolById(activeId);
    if (!t || !window.speechSynthesis) return;
    stopSpeech();
    const u = new SpeechSynthesisUtterance(buildDeepDive(t).replace(/[#*]/g, ""));
    u.lang = "en-US";
    u.rate = 0.95;
    u.onend = () => {
      speaking = false;
      document.getElementById("atReadBtn")?.classList.remove("speaking");
    };
    speaking = true;
    document.getElementById("atReadBtn")?.classList.add("speaking");
    window.speechSynthesis.speak(u);
  };

  const openSheet = (id) => {
    const t = toolById(id);
    if (!t || !sheet) return;
    activeId = id;
    stopSpeech();

    const d = ensureDaily();
    const isFeatured = d.featuredId === id;

    document.getElementById("atSheetIcon").textContent = t.icon;
    document.getElementById("atSheetName").textContent = t.name;
    document.getElementById("atSheetTagline").textContent = t.tagline;
    document.getElementById("atSheetUse").textContent = t.useCase;
    document.getElementById("atSheetCat").textContent = categoryLabel(t.category);
    document.getElementById("atSheetPrice").textContent = pricingLabel(t.pricing);
    document.getElementById("atSheetDeep").textContent = buildDeepDive(t);

    const badge = document.getElementById("atSheetBadge");
    if (badge) badge.textContent = isFeatured ? "Tool of the day" : "AI Tool";

    const link = document.getElementById("atSheetLink");
    if (link) {
      link.href = t.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    const saved = getSaved();
    const saveBtn = document.getElementById("atSheetSave");
    if (saveBtn) {
      saveBtn.classList.toggle("active", saved.has(id));
      saveBtn.innerHTML = saved.has(id)
        ? '<span aria-hidden="true">★</span> Saved'
        : '<span aria-hidden="true">☆</span> Save';
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

  const refreshDaily = async (manual = false) => {
    if (manual && typeof showAppToast === "function") showAppToast("Refreshing today's picks…");

    const key = dayKey();
    daily = pickDailyClient(key);
    meta = { fetchedAt: new Date().toISOString(), dayKey: key, toolCount: CATALOG.length };
    saveCache(daily, meta);
    renderAll();

    if (manual && typeof showAppToast === "function") {
      showAppToast(`Today's pick: ${toolById(daily.featuredId)?.name || "updated"}`);
    }
  };

  const bootstrap = () => {
    const cached = loadCache();
    if (cached?.daily?.dayKey === dayKey()) {
      daily = cached.daily;
      meta = cached.meta || meta;
    } else if (daily.dayKey !== dayKey()) {
      daily = pickDailyClient(dayKey());
    }
    renderAll();
    if (isStale()) refreshDaily(false);
  };

  renderCategories();

  catRow?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-at-cat]");
    if (!btn) return;
    activeCategory = btn.dataset.atCat;
    renderCategories();
    renderList();
  });

  searchInput?.addEventListener("input", renderList);

  document.getElementById("atRefreshBtn")?.addEventListener("click", () => refreshDaily(true));

  document.getElementById("atSavedBtn")?.addEventListener("click", () => {
    savedOnly = !savedOnly;
    document.getElementById("atSavedBtn")?.classList.toggle("active", savedOnly);
    renderList();
  });

  app.addEventListener("click", (e) => {
    const el = e.target.closest("[data-at-id]");
    if (el) openSheet(el.dataset.atId);
  });

  document.getElementById("atSheetClose")?.addEventListener("click", closeSheet);
  document.getElementById("atSheetBackdrop")?.addEventListener("click", closeSheet);
  document.getElementById("atReadBtn")?.addEventListener("click", () => {
    if (speaking) stopSpeech();
    else readDeepDive();
  });

  document.getElementById("atSheetSave")?.addEventListener("click", () => {
    if (!activeId) return;
    const saved = getSaved();
    if (saved.has(activeId)) saved.delete(activeId);
    else saved.add(activeId);
    saveSaved(saved);
    openSheet(activeId);
    renderFeatured();
    renderList();
  });

  bootstrap();
})();
