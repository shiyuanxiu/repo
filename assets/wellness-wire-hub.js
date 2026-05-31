/* Wellness Wire — Learn tab */
(function () {
  if (!document.getElementById("wlApp")) return;
  window.initLearnRadar({
    prefix: "wl",
    appId: "wlApp",
    windowKey: "WELLNESS_WIRE",
    listWindowMs: 3 * 24 * 60 * 60 * 1000,
    storage: {
      cache: "vv_wellness_wire_cache",
      saved: "vv_wellness_wire_saved",
      auto: "vv_wellness_wire_auto",
    },
    ids: {
      list: "wlList",
      radarDots: "wlRadarDots",
      updated: "wlUpdatedAt",
      domainFilters: "wlDomainFilters",
      platformFilters: "wlPlatformFilters",
      search: "wlSearch",
      sheet: "wlSheet",
      listCount: "wlListCount",
      refreshBtn: "wlRefreshBtn",
      autoBtn: "wlAutoBtn",
      savedToggle: "wlSavedToggle",
      sheetClose: "wlSheetClose",
      sheetBackdrop: "wlSheetBackdrop",
      sheetRank: "wlSheetRank",
      sheetPlatform: "wlSheetPlatform",
      sheetTitle: "wlSheetTitle",
      sheetHeat: "wlSheetHeat",
      sheetTime: "wlSheetTime",
      sheetDeep: "wlSheetDeep",
      sheetSave: "wlSheetSave",
      sheetLink: "wlSheetLink",
      readBtn: "wlReadBtn",
    },
    labels: {
      listTitle: "Today's Wellness",
      deepIntro: "Health and wellness stories worth a calm read.",
      refreshToast: "Scanning wellness headlines…",
      loading: "Loading wellness wire…",
      empty: "No wellness stories match your filters.",
    },
    classifyDomain(title, summary) {
      const t = `${title} ${summary}`.toLowerCase();
      if (/\b(anxiety|depression|therapy|mental|stress|burnout|mindful)\b/.test(t)) return "mental";
      if (/\b(sleep|insomnia|circadian|nap|rest)\b/.test(t)) return "sleep";
      if (/\b(diet|nutrition|protein|calorie|meal|vitamin)\b/.test(t)) return "nutrition";
      if (/\b(workout|gym|run|cardio|yoga|exercise|steps)\b/.test(t)) return "fitness";
      if (/\b(habit|routine|screen time|hydrat|walk)\b/.test(t)) return "habits";
      return "mental";
    },
  });
})();
