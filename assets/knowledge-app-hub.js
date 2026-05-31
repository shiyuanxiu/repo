/* Cat Breed Encyclopedia mini-app — Learn tab */
(function initKnowledgeApp() {
  const DATA = window.KNOWLEDGE_APP;
  const root = document.getElementById("kaApp");
  if (!root || !DATA) return;

  const SAVED_KEY = "vv_cat_app_saved";
  let view = "encyclopedia";
  let gridFilter = "all";
  let guideCategory = "all";
  let gridQuery = "";
  let guideQuery = "";
  let detailItem = null;

  const gridEl = document.getElementById("kaGrid");
  const gridFiltersEl = document.getElementById("kaGridFilters");
  const gridSearchEl = document.getElementById("kaGridSearch");
  const savedEl = document.getElementById("kaSavedList");
  const guideListEl = document.getElementById("kaGuideList");
  const guideCatsEl = document.getElementById("kaGuideCategories");
  const guideSearchEl = document.getElementById("kaGuideSearch");
  const sheet = document.getElementById("kaSheet");

  const escapeHtml = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

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

  const toggleSaved = (id) => {
    const s = getSaved();
    if (s.has(id)) s.delete(id);
    else s.add(id);
    saveSaved(s);
    return s.has(id);
  };

  const switchView = (v) => {
    view = v;
    root.querySelectorAll("[data-ka-panel]").forEach((p) => {
      p.classList.toggle("active", p.dataset.kaPanel === v);
    });
    root.querySelectorAll("[data-ka-nav]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.kaNav === v);
    });
    if (v === "saved") renderSaved();
    if (v === "guides") renderGuides();
  };

  const thumbImg = (src, alt) =>
    `<img class="ka-thumb-img" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" width="200" height="200">`;

  const setSheetThumb = (src, alt) => {
    const el = document.getElementById("kaSheetThumb");
    if (!el) return;
    el.innerHTML = thumbImg(src, alt);
  };

  const renderGridFilters = () => {
    if (!gridFiltersEl) return;
    gridFiltersEl.innerHTML = DATA.gridFilters
      .map(
        (f) =>
          `<button type="button" class="ka-pill${f.id === gridFilter ? " active" : ""}" data-ka-grid-filter="${f.id}">${f.label}</button>`,
      )
      .join("");
    gridFiltersEl.querySelectorAll("[data-ka-grid-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        gridFilter = btn.dataset.kaGridFilter;
        renderGridFilters();
        renderGrid();
      });
    });
  };

  const renderGrid = () => {
    if (!gridEl) return;
    const q = gridQuery.trim().toLowerCase();
    const list = DATA.breeds.filter((b) => {
      const catOk = gridFilter === "all" || b.category === gridFilter;
      const text = `${b.name} ${b.tag}`.toLowerCase();
      return catOk && (!q || text.includes(q));
    });
    gridEl.innerHTML = list.length
      ? list
          .map(
            (b) => `<button type="button" class="ka-grid-card" data-ka-breed="${escapeHtml(b.id)}">
              <div class="ka-grid-thumb">${thumbImg(b.image, b.name)}</div>
              <div class="ka-grid-body">
                <h3 class="ka-grid-title">${escapeHtml(b.name)}</h3>
                <span class="ka-grid-tag">${escapeHtml(b.tag)}</span>
              </div>
            </button>`,
          )
          .join("")
      : '<p class="ka-empty">No breeds match — try another filter.</p>';

    gridEl.querySelectorAll("[data-ka-breed]").forEach((btn) => {
      btn.addEventListener("click", () => openBreed(btn.dataset.kaBreed));
    });
  };

  const openBreed = (id) => {
    const b = DATA.breeds.find((x) => x.id === id);
    if (!b) return;
    detailItem = { type: "breed", ...b };
    document.getElementById("kaSheetTag").textContent = b.tag;
    document.getElementById("kaSheetTitle").textContent = b.name;
    document.getElementById("kaSheetSummary").textContent = b.summary;
    document.getElementById("kaSheetBody").textContent = b.body;
    document.getElementById("kaSheetRead").textContent = `${b.readMin || 3} min read`;
    setSheetThumb(b.image, b.name);
    const linkBtn = document.getElementById("kaSheetLink");
    const playBtn = document.getElementById("kaSheetPlay");
    if (linkBtn) {
      linkBtn.classList.add("hidden");
      linkBtn.removeAttribute("href");
    }
    if (playBtn) {
      playBtn.classList.add("hidden");
      playBtn.removeAttribute("href");
    }
    updateSheetHeart(b.id);
    sheet?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  const openArticle = (id) => {
    const a = DATA.articles.find((x) => x.id === id);
    if (!a) return;
    detailItem = { type: "article", ...a };
    document.getElementById("kaSheetTag").textContent = a.tag;
    document.getElementById("kaSheetTitle").textContent = a.title;
    document.getElementById("kaSheetSummary").textContent = a.summary;
    document.getElementById("kaSheetBody").textContent = a.body;
    document.getElementById("kaSheetRead").textContent = `${a.readMin} min read`;
    setSheetThumb(a.image, a.title);
    const linkBtn = document.getElementById("kaSheetLink");
    const playBtn = document.getElementById("kaSheetPlay");
    if (linkBtn) {
      linkBtn.classList.add("hidden");
      linkBtn.removeAttribute("href");
    }
    if (playBtn) {
      playBtn.classList.add("hidden");
      playBtn.removeAttribute("href");
    }
    updateSheetHeart(a.id);
    sheet?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  const updateSheetHeart = (id) => {
    const btn = document.getElementById("kaSheetHeart");
    if (!btn) return;
    const on = getSaved().has(id);
    btn.classList.toggle("saved", on);
    btn.setAttribute("aria-label", on ? "Remove from saved" : "Save");
    btn.textContent = on ? "♥" : "♡";
  };

  const closeSheet = () => {
    sheet?.classList.add("hidden");
    document.body.style.overflow = "";
    detailItem = null;
    renderSaved();
    renderGuides();
    renderGrid();
  };

  const renderGuideCategories = () => {
    if (!guideCatsEl) return;
    guideCatsEl.innerHTML = DATA.guideCategories
      .map(
        (c) =>
          `<button type="button" class="ka-cat-btn${c.id === guideCategory ? " active" : ""}" data-ka-guide-cat="${c.id}">
            <span class="ka-cat-icon" aria-hidden="true">${c.icon}</span>
            <span class="ka-cat-label">${escapeHtml(c.label)}</span>
          </button>`,
      )
      .join("");
    guideCatsEl.querySelectorAll("[data-ka-guide-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        guideCategory = btn.dataset.kaGuideCat;
        renderGuideCategories();
        renderGuides();
      });
    });
  };

  const renderGuides = () => {
    if (!guideListEl) return;
    const q = guideQuery.trim().toLowerCase();
    const saved = getSaved();
    const list = DATA.articles.filter((a) => {
      const catOk = guideCategory === "all" || a.category === guideCategory;
      const text = `${a.title} ${a.summary} ${a.tag}`.toLowerCase();
      return catOk && (!q || text.includes(q));
    });

    guideListEl.innerHTML = list.length
      ? list
          .map((a) => {
            const fav = saved.has(a.id);
            return `<article class="ka-guide-card">
              <button type="button" class="ka-guide-heart${fav ? " saved" : ""}" data-ka-fav="${escapeHtml(a.id)}" aria-label="Save">${fav ? "♥" : "♡"}</button>
              <button type="button" class="ka-guide-main" data-ka-article="${escapeHtml(a.id)}">
                <div class="ka-guide-thumb">${thumbImg(a.image, a.title)}</div>
                <div class="ka-guide-text">
                  <span class="ka-guide-tag">${escapeHtml(a.tag)}</span>
                  <h3 class="ka-guide-title">${escapeHtml(a.title)}</h3>
                  <p class="ka-guide-summary">${escapeHtml(a.summary)}</p>
                  <span class="ka-guide-read"><span aria-hidden="true">🕐</span> ${a.readMin} min</span>
                </div>
              </button>
            </article>`;
          })
          .join("")
      : '<p class="ka-empty">No articles in this category yet.</p>';

    guideListEl.querySelectorAll("[data-ka-article]").forEach((btn) => {
      btn.addEventListener("click", () => openArticle(btn.dataset.kaArticle));
    });
    guideListEl.querySelectorAll("[data-ka-fav]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const on = toggleSaved(btn.dataset.kaFav);
        btn.classList.toggle("saved", on);
        btn.textContent = on ? "♥" : "♡";
        if (typeof showAppToast === "function") showAppToast(on ? "Saved" : "Removed");
      });
    });
  };

  const renderSaved = () => {
    if (!savedEl) return;
    const saved = getSaved();
    const breeds = DATA.breeds.filter((b) => saved.has(b.id));
    const articles = DATA.articles.filter((a) => saved.has(a.id));

    if (!breeds.length && !articles.length) {
      savedEl.innerHTML =
        '<div class="ka-saved-empty"><span aria-hidden="true">♡</span><p>Nothing saved yet</p><p class="ka-saved-hint">Tap ♡ on any breed or guide to collect favorites here.</p></div>';
      return;
    }

    savedEl.innerHTML = [
      ...breeds.map(
        (b) => `<button type="button" class="ka-saved-row" data-ka-breed="${escapeHtml(b.id)}">
          <span class="ka-saved-emoji">${thumbImg(b.image, b.name)}</span>
          <span class="ka-saved-name">${escapeHtml(b.name)}</span>
          <span class="ka-saved-type">Breed</span>
        </button>`,
      ),
      ...articles.map(
        (a) => `<button type="button" class="ka-saved-row" data-ka-article="${escapeHtml(a.id)}">
          <span class="ka-saved-emoji">${thumbImg(a.image, a.title)}</span>
          <span class="ka-saved-name">${escapeHtml(a.title)}</span>
          <span class="ka-saved-type">Guide</span>
        </button>`,
      ),
    ].join("");

    savedEl.querySelectorAll("[data-ka-breed]").forEach((btn) => {
      btn.addEventListener("click", () => openBreed(btn.dataset.kaBreed));
    });
    savedEl.querySelectorAll("[data-ka-article]").forEach((btn) => {
      btn.addEventListener("click", () => openArticle(btn.dataset.kaArticle));
    });
  };

  root.querySelectorAll("[data-ka-nav]").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.kaNav));
  });

  gridSearchEl?.addEventListener("input", () => {
    gridQuery = gridSearchEl.value;
    renderGrid();
  });

  guideSearchEl?.addEventListener("input", () => {
    guideQuery = guideSearchEl.value;
    renderGuides();
  });

  document.getElementById("kaFab")?.addEventListener("click", () => {
    switchView("guides");
    if (typeof showAppToast === "function") showAppToast("Cat care knowledge");
  });

  document.getElementById("kaQuickBtn")?.addEventListener("click", () => {
    const pool = DATA.breeds;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    openBreed(pick.id);
    if (typeof showAppToast === "function") showAppToast(`Random breed: ${pick.name}`);
  });

  document.getElementById("kaSheetClose")?.addEventListener("click", closeSheet);
  document.getElementById("kaSheetBackdrop")?.addEventListener("click", closeSheet);
  document.getElementById("kaSheetHeart")?.addEventListener("click", () => {
    if (!detailItem) return;
    const on = toggleSaved(detailItem.id);
    updateSheetHeart(detailItem.id);
    if (typeof showAppToast === "function") showAppToast(on ? "Saved to My Cats" : "Removed");
  });

  renderGridFilters();
  renderGrid();
  renderGuideCategories();
  renderGuides();
  switchView("encyclopedia");
})();
