/* Campus Life Feed — Learn tab */
(function () {
  if (!document.getElementById("cpApp")) return;
  window.initLearnRadar({
    prefix: "cp",
    appId: "cpApp",
    windowKey: "CAMPUS_LIFE",
    learnSection: "campus",
    storage: {
      cache: "vv_campus_life_cache",
      saved: "vv_campus_life_saved",
      auto: "vv_campus_life_auto",
    },
    ids: {
      list: "cpList",
      radarDots: "cpRadarDots",
      updated: "cpUpdatedAt",
      domainFilters: "cpDomainFilters",
      platformFilters: "cpPlatformFilters",
      search: "cpSearch",
      sheet: "cpSheet",
      listCount: "cpListCount",
      refreshBtn: "cpRefreshBtn",
      autoBtn: "cpAutoBtn",
      savedToggle: "cpSavedToggle",
      sheetClose: "cpSheetClose",
      sheetBackdrop: "cpSheetBackdrop",
      sheetRank: "cpSheetRank",
      sheetPlatform: "cpSheetPlatform",
      sheetTitle: "cpSheetTitle",
      sheetHeat: "cpSheetHeat",
      sheetTime: "cpSheetTime",
      sheetDeep: "cpSheetDeep",
      sheetSave: "cpSheetSave",
      sheetLink: "cpSheetLink",
      readBtn: "cpReadBtn",
    },
    labels: {
      listTitle: "Today's Campus",
      deepIntro: "Campus life deep dive for students.",
      refreshToast: "Scanning campus stories…",
      loading: "Loading campus feed…",
      empty: "No campus stories match your filters.",
    },
    classifyDomain(title, summary) {
      const t = `${title} ${summary}`.toLowerCase();
      if (/\b(dorm|roommate|housing|lease|rent)\b/.test(t)) return "dorm";
      if (/\b(exam|study|homework|class|professor|gpa|midterm|finals)\b/.test(t)) return "study";
      if (/\b(intern|job|career|resume|interview|apply|admission)\b/.test(t)) return "career";
      if (/\b(party|friend|dating|club|greek|social)\b/.test(t)) return "social";
      return "campus";
    },
  });
})();
