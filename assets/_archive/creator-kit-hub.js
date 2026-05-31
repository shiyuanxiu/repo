/* Creator Kit — Learn tab */
(function () {
  if (!document.getElementById("ckApp")) return;
  window.initLearnRadar({
    prefix: "ck",
    appId: "ckApp",
    windowKey: "CREATOR_KIT",
    learnSection: "creator",
    listWindowMs: 3 * 24 * 60 * 60 * 1000,
    storage: {
      cache: "vv_creator_kit_cache",
      saved: "vv_creator_kit_saved",
      auto: "vv_creator_kit_auto",
    },
    ids: {
      list: "ckList",
      radarDots: "ckRadarDots",
      updated: "ckUpdatedAt",
      domainFilters: "ckDomainFilters",
      platformFilters: "ckPlatformFilters",
      search: "ckSearch",
      sheet: "ckSheet",
      listCount: "ckListCount",
      refreshBtn: "ckRefreshBtn",
      autoBtn: "ckAutoBtn",
      savedToggle: "ckSavedToggle",
      sheetClose: "ckSheetClose",
      sheetBackdrop: "ckSheetBackdrop",
      sheetRank: "ckSheetRank",
      sheetPlatform: "ckSheetPlatform",
      sheetTitle: "ckSheetTitle",
      sheetHeat: "ckSheetHeat",
      sheetTime: "ckSheetTime",
      sheetDeep: "ckSheetDeep",
      sheetSave: "ckSheetSave",
      sheetLink: "ckSheetLink",
      readBtn: "ckReadBtn",
    },
    labels: {
      listTitle: "Today's Creator News",
      deepIntro: "Tools, tips, and trends for content creators.",
      refreshToast: "Scanning creator headlines…",
      loading: "Loading creator kit…",
      empty: "No creator stories match your filters.",
    },
    classifyDomain(title, summary) {
      const t = `${title} ${summary}`.toLowerCase();
      if (/\b(youtube|tiktok|shorts|reels|stream|podcast)\b/.test(t)) return "video";
      if (/\b(instagram|twitter|x\.com|threads|social media)\b/.test(t)) return "social";
      if (/\b(capcut|premiere|davinci|obs|canva|tool|app|software)\b/.test(t)) return "tools";
      if (/\b(sponsor|monetiz|ad revenue|brand deal|affiliate|patron)\b/.test(t)) return "monetize";
      if (/\b(tip|how to|guide|grow|algorithm|hook)\b/.test(t)) return "tips";
      return "video";
    },
    relevanceFilter(title, summary) {
      const t = `${title} ${summary}`.toLowerCase();
      if (/\b(creator|youtube|tiktok|ugc|influencer|streamer|podcast|content|capcut|monetiz|subscribers|algorithm)\b/.test(t)) return true;
      return /\b(video|vlog)\b/.test(t) && /youtube|youtu\.be|tiktok|twitch/.test(t);
    },
  });
})();
