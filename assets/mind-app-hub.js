/* Mind Check-in — Learn tab feed #10 */
(function initMindApp() {
  const DATA = window.MIND_APP;
  const root = document.getElementById("miApp");
  if (!root || !DATA) return;

  const MOOD_KEY = "vv_mind_mood_log";
  const DONE_KEY = "vv_mind_practice_done";
  let view = "today";
  let activePracticeId = null;
  let practiceFilter = "all";
  let speaking = false;
  let breathTimer = null;

  const escapeHtml = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);

  const dayHash = (key, mod) => {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return h % mod;
  };

  const getMoodLog = () => {
    try {
      return JSON.parse(localStorage.getItem(MOOD_KEY) || "{}");
    } catch (_) {
      return {};
    }
  };

  const saveMood = (level) => {
    const log = getMoodLog();
    log[dayKey()] = level;
    try {
      localStorage.setItem(MOOD_KEY, JSON.stringify(log));
    } catch (_) {}
  };

  const getPracticeDone = () => {
    try {
      return JSON.parse(localStorage.getItem(DONE_KEY) || "{}");
    } catch (_) {
      return {};
    }
  };

  const markPracticeDone = (id) => {
    const done = getPracticeDone();
    done[dayKey()] = id;
    try {
      localStorage.setItem(DONE_KEY, JSON.stringify(done));
    } catch (_) {}
  };

  const computeStreak = () => {
    const log = getMoodLog();
    let streak = 0;
    const d = new Date();
    for (;;) {
      const k = dayKey(d);
      if (log[k] == null) break;
      streak++;
      d.setDate(d.getDate() - 1);
      if (streak > 365) break;
    }
    return streak;
  };

  const todayMood = () => getMoodLog()[dayKey()];

  const dailyPractice = () => {
    const practices = DATA.practices || [];
    if (!practices.length) return null;
    return practices[dayHash(dayKey(), practices.length)];
  };

  const dailyAffirmation = () => {
    const list = DATA.affirmations || [];
    if (!list.length) return "";
    return list[dayHash(dayKey(), list.length)];
  };

  const practiceById = (id) => (DATA.practices || []).find((p) => p.id === id);

  const switchView = (v) => {
    view = v;
    root.querySelectorAll("[data-mi-panel]").forEach((p) => {
      p.classList.toggle("active", p.dataset.miPanel === v);
    });
    root.querySelectorAll("[data-mi-nav]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.miNav === v);
    });
    if (v === "today") renderToday();
    if (v === "practices") renderPractices();
    if (v === "support") renderSupport();
  };

  const renderMoods = () => {
    const row = document.getElementById("miMoodRow");
    if (!row) return;
    const current = todayMood();
    row.innerHTML = (DATA.moods || [])
      .map(
        (m) =>
          `<button type="button" class="mi-mood-btn${current === m.id ? " active" : ""}" data-mi-mood="${m.id}" aria-label="${escapeHtml(m.label)}" title="${escapeHtml(m.label)}">
        <span class="mi-mood-emoji" aria-hidden="true">${m.emoji}</span>
        <span class="mi-mood-label">${escapeHtml(m.label)}</span>
      </button>`,
      )
      .join("");

    row.querySelectorAll("[data-mi-mood]").forEach((btn) => {
      btn.addEventListener("click", () => {
        saveMood(Number(btn.dataset.miMood));
        renderToday();
        if (typeof showAppToast === "function") showAppToast("Check-in saved · streak updated");
      });
    });
  };

  const renderToday = () => {
    const streakEl = document.getElementById("miStreak");
    const affEl = document.getElementById("miAffirmation");
    const practiceCard = document.getElementById("miDailyPractice");
    const statusEl = document.getElementById("miTodayStatus");

    if (streakEl) streakEl.textContent = String(computeStreak());
    if (affEl) affEl.textContent = dailyAffirmation();

    const dp = dailyPractice();
    const done = getPracticeDone()[dayKey()];
    if (statusEl) {
      const mood = todayMood();
      const moodObj = (DATA.moods || []).find((m) => m.id === mood);
      statusEl.textContent = moodObj
        ? `Today: ${moodObj.emoji} ${moodObj.label}`
        : "How are you feeling today?";
    }

    if (practiceCard && dp) {
      const completed = done === dp.id;
      practiceCard.innerHTML = `<article class="mi-daily-card${completed ? " done" : ""}" data-mi-practice="${escapeHtml(dp.id)}">
        <span class="mi-daily-badge">Today's practice</span>
        <div class="mi-daily-head">
          <span class="mi-daily-icon" aria-hidden="true">${dp.icon}</span>
          <div>
            <h3 class="mi-daily-title">${escapeHtml(dp.title)}</h3>
            <p class="mi-daily-meta">${escapeHtml(dp.duration)} · ${escapeHtml(dp.summary)}</p>
          </div>
        </div>
        <span class="mi-daily-cta">${completed ? "Completed ✓ — tap to review" : "Tap to start →"}</span>
      </article>`;
    }

    renderMoods();
    renderWeekStrip();
  };

  const renderWeekStrip = () => {
    const el = document.getElementById("miWeekStrip");
    if (!el) return;
    const log = getMoodLog();
    const days = [];
    const d = new Date();
    for (let i = 6; i >= 0; i--) {
      const dd = new Date(d);
      dd.setDate(dd.getDate() - i);
      const k = dayKey(dd);
      const mood = log[k];
      const mObj = (DATA.moods || []).find((m) => m.id === mood);
      const label = dd.toLocaleDateString("en-US", { weekday: "narrow" });
      days.push(`<span class="mi-week-day${k === dayKey() ? " today" : ""}" title="${k}">
        <span class="mi-week-label">${label}</span>
        <span class="mi-week-dot">${mObj ? mObj.emoji : "·"}</span>
      </span>`);
    }
    el.innerHTML = days.join("");
  };

  const renderPracticeFilters = () => {
    const row = document.getElementById("miPracticeFilters");
    if (!row) return;
    row.innerHTML = (DATA.practiceCategories || [])
      .map(
        (c) =>
          `<button type="button" class="mi-filter${practiceFilter === c.id ? " active" : ""}" data-mi-pcat="${escapeHtml(c.id)}">${escapeHtml(c.label)}</button>`,
      )
      .join("");

    row.querySelectorAll("[data-mi-pcat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        practiceFilter = btn.dataset.miPcat;
        renderPracticeFilters();
        renderPracticesList();
      });
    });
  };

  const renderPracticesList = () => {
    const list = document.getElementById("miPracticeList");
    if (!list) return;
    const items = (DATA.practices || []).filter(
      (p) => practiceFilter === "all" || p.category === practiceFilter,
    );
    list.innerHTML = items
      .map(
        (p) => `<button type="button" class="mi-practice-card" data-mi-practice="${escapeHtml(p.id)}">
        <span class="mi-practice-icon" aria-hidden="true">${p.icon}</span>
        <span class="mi-practice-body">
          <span class="mi-practice-title">${escapeHtml(p.title)}</span>
          <span class="mi-practice-meta">${escapeHtml(p.duration)} · ${escapeHtml(p.summary)}</span>
        </span>
        <span class="mi-practice-arrow" aria-hidden="true">›</span>
      </button>`,
      )
      .join("");
  };

  const renderPractices = () => {
    renderPracticeFilters();
    renderPracticesList();
  };

  const renderSupport = () => {
    const list = document.getElementById("miResourceList");
    const disc = document.getElementById("miDisclaimer");
    if (disc) disc.textContent = DATA.disclaimer;
    if (!list) return;
    list.innerHTML = (DATA.resources || [])
      .map(
        (r) => `<a class="mi-resource-card${r.crisis ? " mi-resource-card--crisis" : ""}" href="${escapeHtml(r.link)}" target="_blank" rel="noopener noreferrer">
        <span class="mi-resource-tag">${escapeHtml(r.tag)}</span>
        <span class="mi-resource-name">${escapeHtml(r.name)}</span>
        <span class="mi-resource-desc">${escapeHtml(r.desc)}</span>
      </a>`,
      )
      .join("");
  };

  const stopSpeech = () => {
    window.speechSynthesis?.cancel();
    speaking = false;
    document.getElementById("miReadBtn")?.classList.remove("speaking");
    if (breathTimer) {
      clearInterval(breathTimer);
      breathTimer = null;
    }
    document.getElementById("miBreathGuide")?.classList.add("hidden");
  };

  const readPractice = (p) => {
    if (!p || !window.speechSynthesis) return;
    stopSpeech();
    const text = p.readAloud || [p.title, ...p.steps].join(". ");
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.88;
    u.onend = () => {
      speaking = false;
      document.getElementById("miReadBtn")?.classList.remove("speaking");
    };
    speaking = true;
    document.getElementById("miReadBtn")?.classList.add("speaking");
    window.speechSynthesis.speak(u);
  };

  const openPracticeSheet = (id) => {
    const p = practiceById(id);
    const sheet = document.getElementById("miSheet");
    if (!p || !sheet) return;
    activePracticeId = id;
    stopSpeech();

    document.getElementById("miSheetIcon").textContent = p.icon;
    document.getElementById("miSheetTitle").textContent = p.title;
    document.getElementById("miSheetDuration").textContent = p.duration;
    document.getElementById("miSheetSummary").textContent = p.summary;

    const stepsEl = document.getElementById("miSheetSteps");
    if (stepsEl) {
      stepsEl.innerHTML = (p.steps || [])
        .map((s, i) => `<li class="mi-step"><span class="mi-step-num">${i + 1}</span>${escapeHtml(s)}</li>`)
        .join("");
    }

    const doneBtn = document.getElementById("miDoneBtn");
    const done = getPracticeDone()[dayKey()] === id;
    if (doneBtn) {
      doneBtn.textContent = done ? "Completed today ✓" : "Mark as done today";
      doneBtn.classList.toggle("done", done);
    }

    sheet.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  const closeSheet = () => {
    stopSpeech();
    document.getElementById("miSheet")?.classList.add("hidden");
    document.body.style.overflow = "";
    activePracticeId = null;
    renderToday();
  };

  root.querySelectorAll("[data-mi-nav]").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.miNav));
  });

  root.addEventListener("click", (e) => {
    const card = e.target.closest("[data-mi-practice]");
    if (card) openPracticeSheet(card.dataset.miPractice);
  });

  document.getElementById("miPracticeList")?.addEventListener("click", (e) => {
    const card = e.target.closest("[data-mi-practice]");
    if (card) openPracticeSheet(card.dataset.miPractice);
  });

  document.getElementById("miSheetClose")?.addEventListener("click", closeSheet);
  document.getElementById("miSheetBackdrop")?.addEventListener("click", closeSheet);

  document.getElementById("miReadBtn")?.addEventListener("click", () => {
    const p = practiceById(activePracticeId);
    if (speaking) stopSpeech();
    else readPractice(p);
  });

  document.getElementById("miDoneBtn")?.addEventListener("click", () => {
    if (!activePracticeId) return;
    markPracticeDone(activePracticeId);
    openPracticeSheet(activePracticeId);
    if (typeof showAppToast === "function") showAppToast("Practice logged for today");
  });

  document.getElementById("miBreathBtn")?.addEventListener("click", () => {
    const guide = document.getElementById("miBreathGuide");
    if (!guide) return;
    if (breathTimer) {
      stopSpeech();
      return;
    }
    const phases = ["Breathe in…", "Hold…", "Breathe out…", "Hold…"];
    let i = 0;
    guide.classList.remove("hidden");
    guide.textContent = phases[0];
    breathTimer = setInterval(() => {
      i = (i + 1) % phases.length;
      guide.textContent = phases[i];
    }, 4000);
  });

  renderToday();
  renderPractices();
  renderSupport();
  switchView("today");
})();
