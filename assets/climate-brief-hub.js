/* Climate Brief — Learn tab */
(function () {
  if (!document.getElementById("cbApp")) return;
  window.initLearnRadar({
    prefix: "cb",
    appId: "cbApp",
    windowKey: "CLIMATE_BRIEF",
    listWindowMs: 3 * 24 * 60 * 60 * 1000,
    storage: {
      cache: "vv_climate_brief_cache",
      saved: "vv_climate_brief_saved",
      auto: "vv_climate_brief_auto",
    },
    ids: {
      list: "cbList",
      radarDots: "cbRadarDots",
      updated: "cbUpdatedAt",
      domainFilters: "cbDomainFilters",
      platformFilters: "cbPlatformFilters",
      search: "cbSearch",
      sheet: "cbSheet",
      listCount: "cbListCount",
      refreshBtn: "cbRefreshBtn",
      autoBtn: "cbAutoBtn",
      savedToggle: "cbSavedToggle",
      sheetClose: "cbSheetClose",
      sheetBackdrop: "cbSheetBackdrop",
      sheetRank: "cbSheetRank",
      sheetPlatform: "cbSheetPlatform",
      sheetTitle: "cbSheetTitle",
      sheetHeat: "cbSheetHeat",
      sheetTime: "cbSheetTime",
      sheetDeep: "cbSheetDeep",
      sheetSave: "cbSheetSave",
      sheetLink: "cbSheetLink",
      readBtn: "cbReadBtn",
    },
    labels: {
      listTitle: "Today's Climate",
      deepIntro: "Environment and climate headlines at a glance.",
      refreshToast: "Scanning climate news…",
      loading: "Loading climate brief…",
      empty: "No climate stories match your filters.",
    },
    classifyDomain(title, summary) {
      const t = `${title} ${summary}`.toLowerCase();
      if (/\b(solar|wind|renewable|nuclear|grid|battery|ev)\b/.test(t)) return "energy";
      if (/\b(wildlife|species|ocean|coral|forest|biodiversity)\b/.test(t)) return "wildlife";
      if (/\b(study|research|scientist|model|temperature|ipcc)\b/.test(t)) return "science";
      if (/\b(protest|activist|volunteer|local|campus|recycle)\b/.test(t)) return "action";
      if (/\b(law|policy|cop|government|regulation|paris)\b/.test(t)) return "policy";
      return "science";
    },
  });
})();
