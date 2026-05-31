/* Job & Internship Radar — Learn tab */
(function () {
  if (!document.getElementById("jrApp")) return;
  if (document.getElementById("crApp")) return;
  window.initLearnRadar({
    prefix: "jr",
    appId: "jrApp",
    windowKey: "JOB_RADAR",
    learnSection: "jobs",
    listWindowMs: 7 * 24 * 60 * 60 * 1000,
    storage: {
      cache: "vv_job_radar_cache",
      saved: "vv_job_radar_saved",
      auto: "vv_job_radar_auto",
    },
    ids: {
      list: "jrList",
      radarDots: "jrRadarDots",
      updated: "jrUpdatedAt",
      domainFilters: "jrDomainFilters",
      platformFilters: "jrPlatformFilters",
      search: "jrSearch",
      sheet: "jrSheet",
      listCount: "jrListCount",
      refreshBtn: "jrRefreshBtn",
      autoBtn: "jrAutoBtn",
      savedToggle: "jrSavedToggle",
      sheetClose: "jrSheetClose",
      sheetBackdrop: "jrSheetBackdrop",
      sheetRank: "jrSheetRank",
      sheetPlatform: "jrSheetPlatform",
      sheetTitle: "jrSheetTitle",
      sheetHeat: "jrSheetHeat",
      sheetTime: "jrSheetTime",
      sheetDeep: "jrSheetDeep",
      sheetSave: "jrSheetSave",
      sheetLink: "jrSheetLink",
      readBtn: "jrReadBtn",
    },
    labels: {
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
  });
})();
