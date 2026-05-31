/* Startup Wire — Learn tab */
(function () {
  if (!document.getElementById("swApp")) return;
  if (document.getElementById("crApp")) return;
  window.initLearnRadar({
    prefix: "sw",
    appId: "swApp",
    windowKey: "STARTUP_WIRE",
    listWindowMs: 3 * 24 * 60 * 60 * 1000,
    storage: {
      cache: "vv_startup_wire_cache",
      saved: "vv_startup_wire_saved",
      auto: "vv_startup_wire_auto",
    },
    ids: {
      list: "swList",
      radarDots: "swRadarDots",
      updated: "swUpdatedAt",
      domainFilters: "swDomainFilters",
      platformFilters: "swPlatformFilters",
      search: "swSearch",
      sheet: "swSheet",
      listCount: "swListCount",
      refreshBtn: "swRefreshBtn",
      autoBtn: "swAutoBtn",
      savedToggle: "swSavedToggle",
      sheetClose: "swSheetClose",
      sheetBackdrop: "swSheetBackdrop",
      sheetRank: "swSheetRank",
      sheetPlatform: "swSheetPlatform",
      sheetTitle: "swSheetTitle",
      sheetHeat: "swSheetHeat",
      sheetTime: "swSheetTime",
      sheetDeep: "swSheetDeep",
      sheetSave: "swSheetSave",
      sheetLink: "swSheetLink",
      readBtn: "swReadBtn",
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
  });
})();
