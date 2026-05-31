/* Food on Campus — Learn tab */
(function () {
  if (!document.getElementById("fdApp")) return;
  window.initLearnRadar({
    prefix: "fd",
    appId: "fdApp",
    windowKey: "FOOD_CAMPUS",
    listWindowMs: 3 * 24 * 60 * 60 * 1000,
    storage: {
      cache: "vv_food_campus_cache",
      saved: "vv_food_campus_saved",
      auto: "vv_food_campus_auto",
    },
    ids: {
      list: "fdList",
      radarDots: "fdRadarDots",
      updated: "fdUpdatedAt",
      domainFilters: "fdDomainFilters",
      platformFilters: "fdPlatformFilters",
      search: "fdSearch",
      sheet: "fdSheet",
      listCount: "fdListCount",
      refreshBtn: "fdRefreshBtn",
      autoBtn: "fdAutoBtn",
      savedToggle: "fdSavedToggle",
      sheetClose: "fdSheetClose",
      sheetBackdrop: "fdSheetBackdrop",
      sheetRank: "fdSheetRank",
      sheetPlatform: "fdSheetPlatform",
      sheetTitle: "fdSheetTitle",
      sheetHeat: "fdSheetHeat",
      sheetTime: "fdSheetTime",
      sheetDeep: "fdSheetDeep",
      sheetSave: "fdSheetSave",
      sheetLink: "fdSheetLink",
      readBtn: "fdReadBtn",
    },
    labels: {
      listTitle: "Today's Food Picks",
      deepIntro: "Budget eats, recipes, and dorm-friendly food ideas.",
      refreshToast: "Scanning food stories…",
      loading: "Loading food feed…",
      empty: "No food stories match your filters.",
    },
    classifyDomain(title, summary) {
      const t = `${title} ${summary}`.toLowerCase();
      if (/\b(dining hall|cafeteria|campus food|meal plan|swipe)\b/.test(t)) return "dining";
      if (/\b(cheap|budget|dollar|afford|broke|ramen)\b/.test(t)) return "budget";
      if (/\b(recipe|meal prep|cook|instant pot|air fryer)\b/.test(t)) return "recipes";
      if (/\b(healthy|nutrition|protein|vegetarian|vegan|salad)\b/.test(t)) return "healthy";
      if (/\b(snack|microwave|dorm|late night|coffee)\b/.test(t)) return "snacks";
      return "budget";
    },
  });
})();
