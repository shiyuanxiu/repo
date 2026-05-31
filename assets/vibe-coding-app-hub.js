/* Vibe Coding mini-app — Learn tab feed #6 */
(function initVibeCodingApp() {
  const DATA = window.VIBE_CODING_APP;
  const root = document.getElementById("vcApp");
  if (!root || !DATA) return;

  const PROGRESS_KEY = "vv_vibe_coding_progress";
  let view = "path";
  let expandedWeek = "week1";

  const pathEl = document.getElementById("vcPathList");
  const toolsEl = document.getElementById("vcToolsList");
  const progressEl = document.getElementById("vcProgressPanel");
  const tipsEl = document.getElementById("vcTipsList");

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
    return s.has(id);
  };

  const totalTasks = () => DATA.weeks.reduce((n, w) => n + w.tasks.length, 0);

  const switchView = (v) => {
    view = v;
    root.querySelectorAll("[data-vc-panel]").forEach((p) => {
      p.classList.toggle("active", p.dataset.vcPanel === v);
    });
    root.querySelectorAll("[data-vc-nav]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.vcNav === v);
    });
    if (v === "progress") renderProgress();
  };

  const renderPath = () => {
    if (!pathEl) return;
    const done = getProgress();
    pathEl.innerHTML = DATA.weeks
      .map((w) => {
        const open = expandedWeek === w.id;
        const weekDone = w.tasks.filter((t) => done.has(t.id)).length;
        const tasksHtml = w.tasks
          .map((t) => {
            const on = done.has(t.id);
            return `<label class="vc-task${on ? " done" : ""}">
              <input type="checkbox" class="vc-task-check" data-vc-task="${escapeHtml(t.id)}"${on ? " checked" : ""}>
              <span class="vc-task-label">${escapeHtml(t.label)}</span>
            </label>`;
          })
          .join("");
        return `<article class="vc-week${open ? " open" : ""}" data-vc-week="${escapeHtml(w.id)}">
          <button type="button" class="vc-week-head" data-vc-toggle="${escapeHtml(w.id)}">
            <span class="vc-week-num">${w.num}</span>
            <span class="vc-week-text">
              <span class="vc-week-title">${escapeHtml(w.title)}</span>
              <span class="vc-week-summary">${escapeHtml(w.summary)}</span>
            </span>
            <span class="vc-week-meta">${weekDone}/${w.tasks.length}</span>
          </button>
          <div class="vc-week-body">${tasksHtml}</div>
        </article>`;
      })
      .join("");

    pathEl.querySelectorAll("[data-vc-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        expandedWeek = expandedWeek === btn.dataset.vcToggle ? null : btn.dataset.vcToggle;
        renderPath();
      });
    });

    pathEl.querySelectorAll("[data-vc-task]").forEach((input) => {
      input.addEventListener("change", () => {
        toggleTask(input.dataset.vcTask);
        renderPath();
        renderProgress();
      });
    });
  };

  const renderTools = () => {
    if (!toolsEl) return;
    toolsEl.innerHTML = DATA.tools
      .map(
        (t) => `<a class="vc-tool-card" href="${escapeHtml(t.link)}" target="_blank" rel="noopener noreferrer">
          <span class="vc-tool-icon" aria-hidden="true">${t.icon}</span>
          <span class="vc-tool-body">
            <span class="vc-tool-tag">${escapeHtml(t.tag)}</span>
            <span class="vc-tool-name">${escapeHtml(t.name)}</span>
            <span class="vc-tool-desc">${escapeHtml(t.desc)}</span>
          </span>
          <span class="vc-tool-arrow" aria-hidden="true">↗</span>
        </a>`,
      )
      .join("");
  };

  const renderTips = () => {
    if (!tipsEl) return;
    tipsEl.innerHTML = DATA.tips.map((t) => `<li class="vc-tip">${escapeHtml(t)}</li>`).join("");
  };

  const renderProgress = () => {
    if (!progressEl) return;
    const done = getProgress();
    const total = totalTasks();
    const count = done.size;
    const pct = total ? Math.round((count / total) * 100) : 0;

    const weeksHtml = DATA.weeks
      .map((w) => {
        const weekDone = w.tasks.filter((t) => done.has(t.id)).length;
        const wPct = w.tasks.length ? Math.round((weekDone / w.tasks.length) * 100) : 0;
        return `<div class="vc-prog-week">
          <div class="vc-prog-week-head">
            <span>${escapeHtml(w.title)}</span>
            <span>${weekDone}/${w.tasks.length}</span>
          </div>
          <div class="vc-prog-bar"><div class="vc-prog-fill" style="width:${wPct}%"></div></div>
        </div>`;
      })
      .join("");

    progressEl.innerHTML = `
      <div class="vc-prog-hero">
        <p class="vc-prog-pct">${pct}%</p>
        <p class="vc-prog-label">${count} of ${total} tasks done</p>
        <div class="vc-prog-bar vc-prog-bar--lg"><div class="vc-prog-fill" style="width:${pct}%"></div></div>
      </div>
      ${weeksHtml}
      <button type="button" class="vc-reset-btn" id="vcResetProgress">Reset progress</button>`;

    document.getElementById("vcResetProgress")?.addEventListener("click", () => {
      saveProgress(new Set());
      renderPath();
      renderProgress();
      if (typeof showAppToast === "function") showAppToast("Progress cleared");
    });
  };

  root.querySelectorAll("[data-vc-nav]").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.vcNav));
  });

  const introTitle = document.getElementById("vcIntroTitle");
  const introBody = document.getElementById("vcIntroBody");
  if (introTitle) introTitle.textContent = DATA.intro.title;
  if (introBody) introBody.textContent = DATA.intro.body;

  renderPath();
  renderTools();
  renderTips();
  renderProgress();
  switchView("path");
})();
