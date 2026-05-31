/* Side Hustle Lab — Learn tab feed #8 */
(function initHustleApp() {
  const DATA = window.HUSTLE_APP;
  const root = document.getElementById("huApp");
  if (!root || !DATA) return;

  const PROGRESS_KEY = "vv_hustle_progress";
  let view = "path";
  let expandedPath = "ugc";
  let activeIdeaTag = "all";

  const pathEl = document.getElementById("huPathList");
  const ideasEl = document.getElementById("huIdeasList");
  const ideaFiltersEl = document.getElementById("huIdeaFilters");
  const resourcesEl = document.getElementById("huResourcesList");
  const progressEl = document.getElementById("huProgressPanel");
  const tipsEl = document.getElementById("huTipsList");

  const escapeHtml = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const stars = (n) => "★".repeat(n) + "☆".repeat(Math.max(0, 5 - n));

  const getProgress = () => {
    try {
      return new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]"));
    } catch (_) {
      return new Set();
    }
  };

  const saveProgress = (set) => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify([...set]));
    } catch (_) {}
  };

  const toggleTask = (id) => {
    const s = getProgress();
    if (s.has(id)) s.delete(id);
    else s.add(id);
    saveProgress(s);
    return s.has(id);
  };

  const totalTasks = () => DATA.paths.reduce((n, p) => n + p.tasks.length, 0);

  const switchView = (v) => {
    view = v;
    root.querySelectorAll("[data-hu-panel]").forEach((p) => {
      p.classList.toggle("active", p.dataset.huPanel === v);
    });
    root.querySelectorAll("[data-hu-nav]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.huNav === v);
    });
    if (v === "progress") renderProgress();
  };

  const renderPath = () => {
    if (!pathEl) return;
    const done = getProgress();
    pathEl.innerHTML = DATA.paths
      .map((p) => {
        const open = expandedPath === p.id;
        const pathDone = p.tasks.filter((t) => done.has(t.id)).length;
        const tasksHtml = p.tasks
          .map((t) => {
            const on = done.has(t.id);
            return `<label class="hu-task${on ? " done" : ""}">
              <input type="checkbox" class="hu-task-check" data-hu-task="${escapeHtml(t.id)}"${on ? " checked" : ""}>
              <span class="hu-task-label">${escapeHtml(t.label)}</span>
            </label>`;
          })
          .join("");
        return `<article class="hu-path${open ? " open" : ""}" data-hu-path="${escapeHtml(p.id)}">
          <button type="button" class="hu-path-head" data-hu-toggle="${escapeHtml(p.id)}">
            <span class="hu-path-emoji" aria-hidden="true">${p.emoji}</span>
            <span class="hu-path-text">
              <span class="hu-path-title">${escapeHtml(p.title)}</span>
              <span class="hu-path-summary">${escapeHtml(p.summary)}</span>
              <span class="hu-path-stats">${escapeHtml(p.startupCost)} · ${escapeHtml(p.timePerWeek)}/wk</span>
            </span>
            <span class="hu-path-meta">${pathDone}/${p.tasks.length}</span>
          </button>
          <div class="hu-path-body">${tasksHtml}</div>
        </article>`;
      })
      .join("");

    pathEl.querySelectorAll("[data-hu-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        expandedPath = expandedPath === btn.dataset.huToggle ? null : btn.dataset.huToggle;
        renderPath();
      });
    });

    pathEl.querySelectorAll("[data-hu-task]").forEach((input) => {
      input.addEventListener("change", () => {
        toggleTask(input.dataset.huTask);
        renderPath();
        renderProgress();
      });
    });
  };

  const renderIdeaFilters = () => {
    if (!ideaFiltersEl) return;
    ideaFiltersEl.innerHTML = (DATA.ideaTags || [])
      .map(
        (t) =>
          `<button type="button" class="hu-idea-filter${activeIdeaTag === t.id ? " active" : ""}" data-hu-idea-tag="${escapeHtml(t.id)}">${escapeHtml(t.label)}</button>`,
      )
      .join("");

    ideaFiltersEl.querySelectorAll("[data-hu-idea-tag]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeIdeaTag = btn.dataset.huIdeaTag;
        renderIdeaFilters();
        renderIdeas();
      });
    });
  };

  const renderIdeas = () => {
    if (!ideasEl) return;
    const filtered = (DATA.ideas || []).filter(
      (i) => activeIdeaTag === "all" || i.tag === activeIdeaTag,
    );
    ideasEl.innerHTML = filtered.length
      ? filtered
          .map((i) => {
            const tagLabel = (DATA.ideaTags || []).find((t) => t.id === i.tag)?.label || i.tag;
            return `<article class="hu-idea-card">
          <div class="hu-idea-top">
            <h4 class="hu-idea-title">${escapeHtml(i.title)}</h4>
            <span class="hu-idea-diff" title="Difficulty ${i.difficulty}/5">${stars(i.difficulty)}</span>
          </div>
          <p class="hu-idea-desc">${escapeHtml(i.desc)}</p>
          <div class="hu-idea-meta">
            <span class="hu-idea-tag">${escapeHtml(tagLabel)}</span>
            <span>${escapeHtml(i.startupCost)} start</span>
            <span>${escapeHtml(i.timePerWeek)}/wk</span>
          </div>
        </article>`;
          })
          .join("")
      : '<p class="hu-empty">No ideas in this category.</p>';
  };

  const renderResources = () => {
    if (!resourcesEl) return;
    resourcesEl.innerHTML = (DATA.resources || [])
      .map(
        (r) => `<a class="hu-resource-card" href="${escapeHtml(r.link)}" target="_blank" rel="noopener noreferrer">
          <span class="hu-resource-icon" aria-hidden="true">${r.icon}</span>
          <span class="hu-resource-body">
            <span class="hu-resource-tag">${escapeHtml(r.tag)}</span>
            <span class="hu-resource-name">${escapeHtml(r.name)}</span>
            <span class="hu-resource-desc">${escapeHtml(r.desc)}</span>
          </span>
          <span class="hu-resource-arrow" aria-hidden="true">↗</span>
        </a>`,
      )
      .join("");
  };

  const renderTips = () => {
    if (!tipsEl) return;
    tipsEl.innerHTML = (DATA.tips || []).map((t) => `<li class="hu-tip">${escapeHtml(t)}</li>`).join("");
  };

  const renderProgress = () => {
    if (!progressEl) return;
    const done = getProgress();
    const total = totalTasks();
    const count = done.size;
    const pct = total ? Math.round((count / total) * 100) : 0;

    const pathsHtml = DATA.paths
      .map((p) => {
        const pathDone = p.tasks.filter((t) => done.has(t.id)).length;
        const pPct = p.tasks.length ? Math.round((pathDone / p.tasks.length) * 100) : 0;
        return `<div class="hu-prog-path">
          <div class="hu-prog-path-head">
            <span>${p.emoji} ${escapeHtml(p.title)}</span>
            <span>${pathDone}/${p.tasks.length}</span>
          </div>
          <div class="hu-prog-bar"><div class="hu-prog-fill" style="width:${pPct}%"></div></div>
        </div>`;
      })
      .join("");

    progressEl.innerHTML = `
      <div class="hu-prog-hero">
        <p class="hu-prog-pct">${pct}%</p>
        <p class="hu-prog-label">${count} of ${total} tasks done</p>
        <div class="hu-prog-bar hu-prog-bar--lg"><div class="hu-prog-fill" style="width:${pct}%"></div></div>
      </div>
      ${pathsHtml}
      <button type="button" class="hu-reset-btn" id="huResetProgress">Reset progress</button>`;

    document.getElementById("huResetProgress")?.addEventListener("click", () => {
      saveProgress(new Set());
      renderPath();
      renderProgress();
      if (typeof showAppToast === "function") showAppToast("Progress cleared");
    });
  };

  root.querySelectorAll("[data-hu-nav]").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.huNav));
  });

  const introTitle = document.getElementById("huIntroTitle");
  const introBody = document.getElementById("huIntroBody");
  if (introTitle) introTitle.textContent = DATA.intro.title;
  if (introBody) introBody.textContent = DATA.intro.body;

  renderPath();
  renderIdeaFilters();
  renderIdeas();
  renderResources();
  renderTips();
  renderProgress();
  switchView("path");
})();
