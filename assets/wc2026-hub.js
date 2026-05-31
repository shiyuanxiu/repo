/* 2026 World Cup mini-app — real-time countdown & live schedule */
(function initWc2026Hub() {
  const DATA = window.WC2026;
  const app = document.getElementById("wcApp");
  if (!app || !DATA) return;

  const REMINDER_KEY = "vv_wc2026_reminder";
  const MATCH_DURATION_MS = 2 * 60 * 60 * 1000;
  let scheduleFilter = "all";
  let teamQuery = "";
  let tickTimer = null;

  const openingMs = () => new Date(DATA.openingKickoff).getTime();
  const finalMs = () => new Date(DATA.finalKickoff || DATA.openingKickoff).getTime();

  const matchKickoffMs = (m) => new Date(m.kickoff || `${m.date}T12:00:00`).getTime();

  const panels = {
    countdown: document.getElementById("wcPanelCountdown"),
    champions: document.getElementById("wcPanelChampions"),
    schedule: document.getElementById("wcPanelSchedule"),
    teams: document.getElementById("wcPanelTeams"),
  };

  const detailEl = document.getElementById("wcChampionDetail");
  const countdownDaysEl = document.getElementById("wcCountdownDays");
  const countdownLabelEl = document.getElementById("wcCountdownLabel");
  const countdownClockEl = document.getElementById("wcCountdownClock");
  const countdownLiveEl = document.getElementById("wcCountdownLive");
  const nextMatchEl = document.getElementById("wcNextMatch");
  const scheduleListEl = document.getElementById("wcScheduleList");
  const scheduleFiltersEl = document.getElementById("wcScheduleFilters");
  const championsListEl = document.getElementById("wcChampionsList");
  const teamsListEl = document.getElementById("wcTeamsList");
  const teamSearchEl = document.getElementById("wcTeamSearch");

  const escapeHtml = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const pad2 = (n) => String(n).padStart(2, "0");

  const splitCountdown = (targetMs) => {
    const diff = targetMs - Date.now();
    if (diff <= 0) return { past: true, days: 0, hours: 0, mins: 0, secs: 0, totalMs: 0 };
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return { past: false, days, hours, mins, secs, totalMs: diff };
  };

  /** Days display uses ceil on partial days (matches reference apps) */
  const displayDays = (targetMs) => {
    const diff = targetMs - Date.now();
    if (diff <= 0) return 0;
    return Math.max(1, Math.ceil(diff / 86400000));
  };

  const formatDuration = ({ days, hours, mins, secs }) =>
    days > 0 ? `${days}d ${pad2(hours)}:${pad2(mins)}:${pad2(secs)}` : `${pad2(hours)}:${pad2(mins)}:${pad2(secs)}`;

  const formatLocalTime = () => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatKickoffLocal = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const tournamentPhase = () => {
    const now = Date.now();
    const open = openingMs();
    const fin = finalMs() + MATCH_DURATION_MS;
    if (now < open) return "pre";
    if (now >= open && now <= fin) return "live";
    return "post";
  };

  const sortedSchedule = () =>
    [...DATA.schedule].sort((a, b) => matchKickoffMs(a) - matchKickoffMs(b));

  const nextUpcomingMatch = () => {
    const now = Date.now();
    return sortedSchedule().find((m) => matchKickoffMs(m) + MATCH_DURATION_MS > now);
  };

  const matchStatus = (m) => {
    const start = matchKickoffMs(m);
    const end = start + MATCH_DURATION_MS;
    const now = Date.now();
    if (now < start) return { key: "upcoming", label: `Starts in ${formatDuration(splitCountdown(start))}` };
    if (now >= start && now < end) return { key: "live", label: "● LIVE NOW" };
    return { key: "finished", label: "Full time" };
  };

  const switchView = (view) => {
    Object.entries(panels).forEach(([key, el]) => {
      el?.classList.toggle("active", key === view);
    });
    app.querySelectorAll("[data-wc-nav]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.wcNav === view);
    });
  };

  const renderInfoCard = () => {
    document.getElementById("wcInfoHosts").textContent = DATA.hosts;
    document.getElementById("wcInfoTeams").textContent = `${DATA.teamCount} teams`;
    document.getElementById("wcInfoCities").textContent = DATA.hostCities;
    document.getElementById("wcInfoOpening").textContent = formatKickoffLocal(DATA.openingKickoff);
    document.getElementById("wcInfoLocalTime").textContent = formatLocalTime();
  };

  const renderCountdown = () => {
    const phase = tournamentPhase();
    const target = openingMs();
    const cd = splitCountdown(target);
    const days = displayDays(target);

    if (phase === "pre") {
      if (countdownDaysEl) countdownDaysEl.textContent = String(days);
      if (countdownLabelEl) countdownLabelEl.textContent = days === 1 ? "Day" : "Days";
      if (countdownClockEl) countdownClockEl.textContent = `${pad2(cd.hours)}:${pad2(cd.mins)}:${pad2(cd.secs)}`;
      if (countdownLiveEl) {
        countdownLiveEl.textContent = `Kickoff ${formatKickoffLocal(DATA.openingKickoff)}`;
      }
    } else if (phase === "live") {
      if (countdownDaysEl) countdownDaysEl.textContent = "⚽";
      if (countdownLabelEl) countdownLabelEl.textContent = "Tournament live";
      if (countdownClockEl) countdownClockEl.textContent = formatLocalTime().split(", ").pop() || "";
      if (countdownLiveEl) countdownLiveEl.textContent = "2026 FIFA World Cup is underway";
    } else {
      if (countdownDaysEl) countdownDaysEl.textContent = "🏆";
      if (countdownLabelEl) countdownLabelEl.textContent = "Champions crowned";
      if (countdownClockEl) countdownClockEl.textContent = "";
      if (countdownLiveEl) countdownLiveEl.textContent = "See Past Champions tab for history";
    }

    renderInfoCard();
    renderNextMatch();
    renderReminderBtn();
  };

  const renderNextMatch = () => {
    if (!nextMatchEl) return;
    const m = nextUpcomingMatch();
    if (!m) {
      nextMatchEl.hidden = true;
      return;
    }
    const st = matchStatus(m);
    if (st.key === "finished") {
      nextMatchEl.hidden = true;
      return;
    }
    nextMatchEl.hidden = false;
    const kick = matchKickoffMs(m);
    const cd = splitCountdown(kick);
    nextMatchEl.innerHTML = `<span class="wc-next-label">${st.key === "live" ? "Now playing" : "Next match"}</span>
      <span class="wc-next-teams">${m.flagA} ${escapeHtml(m.teamA)} vs ${m.flagB} ${escapeHtml(m.teamB)}</span>
      <span class="wc-next-when${st.key === "live" ? " is-live" : ""}">${st.label}</span>`;
  };

  const renderReminderBtn = () => {
    const btn = document.getElementById("wcReminderBtn");
    if (!btn) return;
    const on = localStorage.getItem(REMINDER_KEY) === "1";
    btn.classList.toggle("is-set", on);
    btn.innerHTML = on
      ? '<span aria-hidden="true">🔔</span> Reminder on'
      : '<span aria-hidden="true">🔔</span> Set Reminder';
  };

  const tick = () => {
    renderCountdown();
    if (panels.schedule?.classList.contains("active")) renderSchedule();
  };

  const startTicker = () => {
    if (tickTimer) clearInterval(tickTimer);
    tick();
    tickTimer = setInterval(tick, 1000);
  };

  const formatDate = (iso) => {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  const renderChampions = () => {
    if (!championsListEl) return;
    championsListEl.innerHTML = DATA.champions
      .map(
        (c) => `<button type="button" class="wc-champ-card" data-wc-champion="${escapeHtml(c.id)}">
          <div class="wc-champ-card-year">${c.year}</div>
          <div class="wc-champ-card-flags">${c.chFlag} <span class="wc-vs">VS</span> ${c.ruFlag}</div>
          <div class="wc-champ-card-names"><strong>${escapeHtml(c.champion)}</strong> beat ${escapeHtml(c.runnerUp)}</div>
          <div class="wc-champ-card-score">${escapeHtml(c.score)}</div>
          <div class="wc-champ-card-loc">📍 ${escapeHtml(c.location)}</div>
        </button>`,
      )
      .join("");

    championsListEl.querySelectorAll("[data-wc-champion]").forEach((btn) => {
      btn.addEventListener("click", () => openChampionDetail(btn.dataset.wcChampion));
    });
  };

  const openChampionDetail = (id) => {
    const c = DATA.champions.find((x) => x.id === id);
    if (!c || !detailEl) return;
    document.getElementById("wcDetailYear").textContent = c.year;
    document.getElementById("wcDetailLocation").textContent = c.location;
    document.getElementById("wcDetailChampion").textContent = c.champion;
    document.getElementById("wcDetailRunner").textContent = c.runnerUp;
    document.getElementById("wcDetailScore").textContent = c.score;
    document.getElementById("wcDetailChFlag").textContent = c.chFlag;
    document.getElementById("wcDetailRuFlag").textContent = c.ruFlag;
    document.getElementById("wcDetailTitle").textContent = `${c.year} FIFA World Cup`;
    document.getElementById("wcDetailDesc").textContent = `${c.champion} won the ${c.year} tournament in ${c.location.split(" · ")[0]}, defeating ${c.runnerUp} ${c.score}.`;
    document.getElementById("wcDetailDate").textContent = formatDate(`${c.year}-07-15`);
    detailEl.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  const closeChampionDetail = () => {
    detailEl?.classList.add("hidden");
    document.body.style.overflow = "";
  };

  const renderScheduleFilters = () => {
    if (!scheduleFiltersEl) return;
    scheduleFiltersEl.innerHTML = DATA.scheduleFilters
      .map(
        (f) =>
          `<button type="button" class="wc-pill${f.id === scheduleFilter ? " active" : ""}" data-wc-schedule-filter="${f.id}">${f.label}</button>`,
      )
      .join("");
    scheduleFiltersEl.querySelectorAll("[data-wc-schedule-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        scheduleFilter = btn.dataset.wcScheduleFilter;
        renderScheduleFilters();
        renderSchedule();
      });
    });
  };

  const renderSchedule = () => {
    if (!scheduleListEl) return;
    const filtered = sortedSchedule().filter((m) => scheduleFilter === "all" || m.stage === scheduleFilter);
    const byDate = filtered.reduce((acc, m) => {
      const key = m.date;
      (acc[key] = acc[key] || []).push(m);
      return acc;
    }, {});

    scheduleListEl.innerHTML = Object.keys(byDate)
      .sort()
      .map((date) => {
        const dayLabel = formatKickoffLocal(`${date}T12:00:00`).split(",").slice(0, 2).join(",");
        return `<section class="wc-schedule-day">
          <h3 class="wc-schedule-date"><span aria-hidden="true">📅</span> ${escapeHtml(dayLabel)}</h3>
          ${byDate[date]
            .map((m) => {
              const st = matchStatus(m);
              return `<article class="wc-match-card wc-match-card--${st.key}">
                <div class="wc-match-status${st.key === "live" ? " is-live" : ""}">${escapeHtml(st.label)}</div>
                <div class="wc-match-time"><span aria-hidden="true">🕐</span> ${escapeHtml(m.time)} · ${escapeHtml(formatKickoffLocal(m.kickoff).split(",").pop()?.trim() || "")}</div>
                <div class="wc-match-teams">
                  <span class="wc-match-team">${m.flagA} ${escapeHtml(m.teamA)}</span>
                  <span class="wc-match-vs">VS</span>
                  <span class="wc-match-team">${m.flagB} ${escapeHtml(m.teamB)}</span>
                </div>
                <div class="wc-match-meta">
                  <span class="wc-match-tag">${escapeHtml(m.stageLabel)}</span>
                  ${m.group ? `<span class="wc-match-tag">Group ${escapeHtml(m.group)}</span>` : ""}
                  <span class="wc-match-venue"><span aria-hidden="true">📍</span> ${escapeHtml(m.venue)}</span>
                </div>
              </article>`;
            })
            .join("")}
        </section>`;
      })
      .join("");
  };

  const renderTeams = () => {
    if (!teamsListEl) return;
    const q = teamQuery.trim().toLowerCase();
    const list = DATA.teams.filter(
      (t) => !q || t.name.toLowerCase().includes(q) || t.confederation.toLowerCase().includes(q),
    );
    teamsListEl.innerHTML = list.length
      ? list
          .map(
            (t) => `<article class="wc-team-card">
              <div class="wc-team-flag">${t.flag}</div>
              <h3 class="wc-team-name">${escapeHtml(t.name)}</h3>
              <p class="wc-team-stat">Appearances: ${t.appearances}</p>
              <p class="wc-team-conf">${escapeHtml(t.confederation)}</p>
              <div class="wc-team-stars" aria-label="Rating ${t.rating} of 5">${stars(t.rating)}</div>
            </article>`,
          )
          .join("")
      : '<p class="wc-empty">No teams match your search.</p>';
  };

  app.querySelectorAll("[data-wc-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchView(btn.dataset.wcNav);
      if (btn.dataset.wcNav === "schedule") renderSchedule();
    });
  });

  document.getElementById("wcReminderBtn")?.addEventListener("click", () => {
    const on = localStorage.getItem(REMINDER_KEY) === "1";
    localStorage.setItem(REMINDER_KEY, on ? "0" : "1");
    renderReminderBtn();
    if (typeof showAppToast === "function") {
      showAppToast(on ? "Reminder turned off" : "We'll nudge you before kickoff!");
    }
  });

  document.getElementById("wcDetailClose")?.addEventListener("click", closeChampionDetail);
  document.getElementById("wcDetailBackdrop")?.addEventListener("click", closeChampionDetail);

  teamSearchEl?.addEventListener("input", () => {
    teamQuery = teamSearchEl.value;
    renderTeams();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") tick();
  });

  renderChampions();
  renderScheduleFilters();
  renderSchedule();
  renderTeams();
  switchView("countdown");
  startTicker();
})();
