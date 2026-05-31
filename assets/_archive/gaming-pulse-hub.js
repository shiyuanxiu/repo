/* Gaming Pulse — Learn tab */
(function () {
  if (!document.getElementById("gmApp")) return;
  window.initLearnRadar({
    prefix: "gm",
    appId: "gmApp",
    windowKey: "GAMING_PULSE",
    learnSection: "gaming",
    listWindowMs: 3 * 24 * 60 * 60 * 1000,
    storage: {
      cache: "vv_gaming_pulse_cache",
      saved: "vv_gaming_pulse_saved",
      auto: "vv_gaming_pulse_auto",
    },
    ids: {
      list: "gmList",
      radarDots: "gmRadarDots",
      updated: "gmUpdatedAt",
      domainFilters: "gmDomainFilters",
      platformFilters: "gmPlatformFilters",
      search: "gmSearch",
      sheet: "gmSheet",
      listCount: "gmListCount",
      refreshBtn: "gmRefreshBtn",
      autoBtn: "gmAutoBtn",
      savedToggle: "gmSavedToggle",
      sheetClose: "gmSheetClose",
      sheetBackdrop: "gmSheetBackdrop",
      sheetRank: "gmSheetRank",
      sheetPlatform: "gmSheetPlatform",
      sheetTitle: "gmSheetTitle",
      sheetHeat: "gmSheetHeat",
      sheetTime: "gmSheetTime",
      sheetDeep: "gmSheetDeep",
      sheetSave: "gmSheetSave",
      sheetLink: "gmSheetLink",
      readBtn: "gmReadBtn",
    },
    labels: {
      listTitle: "Today's Gaming",
      deepIntro: "Gaming headlines for players and fans.",
      refreshToast: "Scanning gaming news…",
      loading: "Loading gaming pulse…",
      empty: "No gaming stories match your filters.",
    },
    classifyDomain(title, summary) {
      const t = `${title} ${summary}`.toLowerCase();
      if (/\b(esport|tournament|league of legends|valorant|cs2|dota|overwatch)\b/.test(t)) return "esports";
      if (/\b(release|launch|trailer|patch|update|dlc|sequel)\b/.test(t)) return "releases";
      if (/\b(indie|steam next fest|kickstarter|roguelike)\b/.test(t)) return "indie";
      if (/\b(gpu|console|steam deck|hardware|pc build|nvidia|playstation|xbox|switch)\b/.test(t)) return "hardware";
      return "culture";
    },
    relevanceFilter(title, summary) {
      const t = `${title} ${summary}`.toLowerCase();
      return /\b(game|gaming|gamer|esport|steam|xbox|playstation|nintendo|valorant|minecraft|fortnite|zelda|pokemon)\b/.test(t);
    },
  });
})();
