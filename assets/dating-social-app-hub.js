/* Dating & Social 101 — Learn tab */
(function initDatingSocialApp() {
  const DATA = window.DATING_SOCIAL_APP;
  const root = document.getElementById("dsApp");
  if (!root || !DATA) return;

  const PROGRESS_KEY = "vv_dating_social_progress";
  let view = "guides";
  let expandedGuide = "online-dating";
  let scenarioTag = "all";

  const guidesEl = document.getElementById("dsGuideList");
  const scenariosEl = document.getElementById("dsScenarioList");
  const scenarioFiltersEl = document.getElementById("dsScenarioFilters");
  const resourcesEl = document.getElementById("dsResourceList");
  const redFlagsEl = document.getElementById("dsRedFlags");
  const tipsEl = document.getElementById("dsTipsList");

  const escapeHtml = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

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
  };

  const switchView = (v) => {
    view = v;
    root.querySelectorAll("[data-ds-panel]").forEach((p) => {
      p.classList.toggle("active", p.dataset.dsPanel === v);
    });
    root.querySelectorAll("[data-ds-nav]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.dsNav === v);
    });
  };

  const renderGuides = () => {
    if (!guidesEl) return;
    const done = getProgress();
    guidesEl.innerHTML = (DATA.guides || [])
      .map((g) => {
        const open = expandedGuide === g.id;
        const gDone = g.tasks.filter((t) => done.has(t.id)).length;
        const tasksHtml = g.tasks
          .map((t) => {
            const on = done.has(t.id);
            return `<label class="ds-task${on ? " done" : ""}">
              <input type="checkbox" class="ds-task-check" data-ds-task="${escapeHtml(t.id)}"${on ? " checked" : ""}>
              <span class="ds-task-label">${escapeHtml(t.label)}</span>
            </label>`;
          })
          .join("");
        return `<article class="ds-guide${open ? " open" : ""}">
          <button type="button" class="ds-guide-head" data-ds-toggle="${escapeHtml(g.id)}">
            <span class="ds-guide-emoji">${g.emoji}</span>
            <span class="ds-guide-text">
              <span class="ds-guide-title">${escapeHtml(g.title)}</span>
              <span class="ds-guide-summary">${escapeHtml(g.summary)}</span>
            </span>
            <span class="ds-guide-meta">${gDone}/${g.tasks.length}</span>
          </button>
          <div class="ds-guide-body">${tasksHtml}</div>
        </article>`;
      })
      .join("");

    guidesEl.querySelectorAll("[data-ds-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        expandedGuide = expandedGuide === btn.dataset.dsToggle ? null : btn.dataset.dsToggle;
        renderGuides();
      });
    });
    guidesEl.querySelectorAll("[data-ds-task]").forEach((input) => {
      input.addEventListener("change", () => {
        toggleTask(input.dataset.dsTask);
        renderGuides();
      });
    });
  };

  const renderScenarioFilters = () => {
    if (!scenarioFiltersEl) return;
    scenarioFiltersEl.innerHTML = (DATA.tags || [])
      .map(
        (t) =>
          `<button type="button" class="ds-filter${scenarioTag === t.id ? " active" : ""}" data-ds-stag="${escapeHtml(t.id)}">${escapeHtml(t.label)}</button>`,
      )
      .join("");
    scenarioFiltersEl.querySelectorAll("[data-ds-stag]").forEach((btn) => {
      btn.addEventListener("click", () => {
        scenarioTag = btn.dataset.dsStag;
        renderScenarioFilters();
        renderScenarios();
      });
    });
  };

  const renderScenarios = () => {
    if (!scenariosEl) return;
    const items = (DATA.scenarios || []).filter((s) => scenarioTag === "all" || s.tag === scenarioTag);
    scenariosEl.innerHTML = items
      .map((s) => {
        const tagLabel = (DATA.tags || []).find((t) => t.id === s.tag)?.label || s.tag;
        return `<article class="ds-scenario">
          <span class="ds-scenario-tag">${escapeHtml(tagLabel)}</span>
          <h4 class="ds-scenario-title">${escapeHtml(s.title)}</h4>
          <p class="ds-scenario-situation"><strong>Situation:</strong> ${escapeHtml(s.situation)}</p>
          <p class="ds-scenario-tip"><strong>Tip:</strong> ${escapeHtml(s.tip)}</p>
        </article>`;
      })
      .join("");
  };

  const renderSupport = () => {
    if (resourcesEl) {
      resourcesEl.innerHTML = (DATA.resources || [])
        .map(
          (r) => `<a class="ds-resource" href="${escapeHtml(r.link)}" target="_blank" rel="noopener noreferrer">
          <span class="ds-resource-tag">${escapeHtml(r.tag)}</span>
          <span class="ds-resource-name">${escapeHtml(r.name)}</span>
          <span class="ds-resource-desc">${escapeHtml(r.desc)}</span>
        </a>`,
        )
        .join("");
    }
    if (redFlagsEl) {
      redFlagsEl.innerHTML = (DATA.redFlags || []).map((f) => `<li class="ds-red-flag">${escapeHtml(f)}</li>`).join("");
    }
    if (tipsEl) {
      tipsEl.innerHTML = (DATA.tips || []).map((t) => `<li class="ds-tip">${escapeHtml(t)}</li>`).join("");
    }
    const disc = document.getElementById("dsDisclaimer");
    if (disc) disc.textContent = DATA.disclaimer;
  };

  root.querySelectorAll("[data-ds-nav]").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.dsNav));
  });

  const introTitle = document.getElementById("dsIntroTitle");
  const introBody = document.getElementById("dsIntroBody");
  if (introTitle) introTitle.textContent = DATA.intro.title;
  if (introBody) introBody.textContent = DATA.intro.body;

  renderGuides();
  renderScenarioFilters();
  renderScenarios();
  renderSupport();
  switchView("guides");
})();
