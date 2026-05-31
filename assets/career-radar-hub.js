/* Career Radar — Jobs + Startup dual tab */
(function initCareerRadar() {
  const app = document.getElementById("crApp");
  if (!app) return;

  const CR_IDS = {
    list: "crList",
    radarDots: "crRadarDots",
    updated: "crUpdatedAt",
    domainFilters: "crDomainFilters",
    platformFilters: "crPlatformFilters",
    search: "crSearch",
    sheet: "crSheet",
    listCount: "crListCount",
    refreshBtn: "crRefreshBtn",
    autoBtn: "crAutoBtn",
    savedToggle: "crSavedToggle",
    sheetClose: "crSheetClose",
    sheetBackdrop: "crSheetBackdrop",
    sheetRank: "crSheetRank",
    sheetPlatform: "crSheetPlatform",
    sheetTitle: "crSheetTitle",
    sheetHeat: "crSheetHeat",
    sheetTime: "crSheetTime",
    sheetDeep: "crSheetDeep",
    sheetSave: "crSheetSave",
    sheetLink: "crSheetLink",
    readBtn: "crReadBtn",
  };

  const TABS = {
    jobs: {
      windowKey: "JOB_RADAR",
      learnSection: "career",
      listWindowMs: 7 * 24 * 60 * 60 * 1000,
      subtitle: "Internships · hiring · layoffs · tech careers",
      listTitle: "Today's Job News",
      storage: {
        cache: "vv_job_radar_cache",
        saved: "vv_job_radar_saved",
        auto: "vv_career_radar_auto_jobs",
      },
      labels: {
        listTitle: "Today's Job News",
        deepIntro: "Job market update for early-career seekers.",
        refreshToast: "Scanning job headlines…",
        loading: "Loading job radar…",
        empty: "No job stories match your filters.",
      },
      classifyDomain(title, summary) {
        const t = `${title} ${summary}`.toLowerCase();
        if (/\b(intern|internship|co-op)\b/.test(t)) return "internship";
        if (/\b(layoff|laid off|downsiz)\b/.test(t)) return "layoffs";
        if (/\b(remote|wfh|work from home)\b/.test(t)) return "remote";
        if (/\b(software|engineer|developer|tech|swe)\b/.test(t)) return "tech";
        return "career";
      },
    },
    startup: {
      windowKey: "STARTUP_WIRE",
      learnSection: "career",
      listWindowMs: 3 * 24 * 60 * 60 * 1000,
      subtitle: "Funding · product · founders · HN",
      listTitle: "Today's Startup News",
      storage: {
        cache: "vv_startup_wire_cache",
        saved: "vv_startup_wire_saved",
        auto: "vv_career_radar_auto_startup",
      },
      labels: {
        listTitle: "Today's Startup News",
        deepIntro: "Founder and startup headlines for builders.",
        refreshToast: "Scanning startup wire…",
        loading: "Loading startup wire…",
        empty: "No startup stories match your filters.",
      },
      classifyDomain(title, summary) {
        const t = `${title} ${summary}`.toLowerCase();
        if (/\b(raised|funding|series [abc]|seed round|venture|investor|valuation)\b/.test(t)) return "funding";
        if (/\b(launch|product|mvp|beta|ship|feature|saas)\b/.test(t)) return "product";
        if (/\b(hiring|career|job|intern|recruit)\b/.test(t)) return "careers";
        if (/\b(ai|software|developer|api|open source|tech)\b/.test(t)) return "tech";
        if (/\b(founder|ceo|startup|bootstrapp|solo founder)\b/.test(t)) return "founders";
        return "founders";
      },
    },
  };

  let activeTab = localStorage.getItem("vv_career_radar_tab") || "jobs";
  if (!TABS[activeTab]) activeTab = "jobs";

  const syncTabUi = (tab) => {
    document.querySelectorAll(".cr-career-tab").forEach((btn) => {
      const on = btn.getAttribute("data-career-tab") === tab;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    const cfg = TABS[tab];
    const sub = document.getElementById("crSubtitle");
    const listTitle = document.getElementById("crListTitle");
    if (sub) sub.textContent = cfg.subtitle;
    if (listTitle) listTitle.textContent = cfg.listTitle;
  };

  const mountTab = (tab) => {
    activeTab = tab;
    localStorage.setItem("vv_career_radar_tab", tab);
    syncTabUi(tab);
    const cfg = TABS[tab];
    window.initLearnRadar({
      prefix: "cr",
      appId: "crApp",
      windowKey: cfg.windowKey,
      learnSection: cfg.learnSection,
      listWindowMs: cfg.listWindowMs,
      storage: cfg.storage,
      ids: CR_IDS,
      labels: cfg.labels,
      classifyDomain: cfg.classifyDomain,
    });
  };

  window.scrollToCareerTab = (tab) => {
    const t = TABS[tab] ? tab : "jobs";
    if (t !== activeTab) mountTab(t);
    else syncTabUi(t);
    const el = document.getElementById("careerHubItem");
    if (!el) return;
    el.classList.remove("learn-feed-skip", "learn-feed-compact");
    el.classList.add("learn-feed-expanded");
    el.querySelector(".learn-feed-compact-bar")?.remove();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.refreshFeedProgress?.();
  };

  document.getElementById("crCareerTabs")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-career-tab]");
    if (!btn) return;
    const tab = btn.getAttribute("data-career-tab");
    if (tab && tab !== activeTab) mountTab(tab);
  });

  mountTab(activeTab);
})();
