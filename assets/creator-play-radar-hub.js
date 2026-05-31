/* Creator & Play — Gaming Pulse + Creator Kit dual tab, daily auto refresh */
(function initCreatorPlayRadar() {
  const app = document.getElementById("cplApp");
  if (!app) return;

  const CPL_IDS = {
    list: "cplList",
    radarDots: "cplRadarDots",
    updated: "cplUpdatedAt",
    domainFilters: "cplDomainFilters",
    platformFilters: "cplPlatformFilters",
    search: "cplSearch",
    sheet: "cplSheet",
    listCount: "cplListCount",
    refreshBtn: "cplRefreshBtn",
    autoBtn: "cplAutoBtn",
    savedToggle: "cplSavedToggle",
    sheetClose: "cplSheetClose",
    sheetBackdrop: "cplSheetBackdrop",
    sheetRank: "cplSheetRank",
    sheetPlatform: "cplSheetPlatform",
    sheetTitle: "cplSheetTitle",
    sheetHeat: "cplSheetHeat",
    sheetTime: "cplSheetTime",
    sheetDeep: "cplSheetDeep",
    sheetSave: "cplSheetSave",
    sheetLink: "cplSheetLink",
    readBtn: "cplReadBtn",
  };

  const TABS = {
    gaming: {
      windowKey: "GAMING_PULSE",
      learnSection: "creatorplay",
      listWindowMs: 3 * 24 * 60 * 60 * 1000,
      subtitle: "Releases · esports · indie · hardware",
      listTitle: "Today's Gaming",
      storage: {
        cache: "vv_gaming_pulse_cache",
        saved: "vv_gaming_pulse_saved",
        auto: "vv_creator_play_auto_gaming",
      },
      labels: {
        listTitle: "Today's Gaming",
        deepIntro: "Gaming headlines for players and creators who stream.",
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
        return /\b(game|gaming|gamer|esport|steam|xbox|playstation|nintendo|valorant|minecraft|fortnite|zelda|pokemon|twitch|stream)\b/.test(t);
      },
    },
    creator: {
      windowKey: "CREATOR_KIT",
      learnSection: "creatorplay",
      listWindowMs: 3 * 24 * 60 * 60 * 1000,
      subtitle: "Video · social · tools · monetize",
      listTitle: "Today's Creator News",
      storage: {
        cache: "vv_creator_kit_cache",
        saved: "vv_creator_kit_saved",
        auto: "vv_creator_play_auto_creator",
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
    },
  };

  let activeTab = localStorage.getItem("vv_creator_play_tab") || "gaming";
  if (!TABS[activeTab]) activeTab = "gaming";

  const syncTabUi = (tab) => {
    document.querySelectorAll(".cpl-play-tab").forEach((btn) => {
      const on = btn.getAttribute("data-play-tab") === tab;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    const cfg = TABS[tab];
    const sub = document.getElementById("cplSubtitle");
    const listTitle = document.getElementById("cplListTitle");
    if (sub) sub.textContent = cfg.subtitle;
    if (listTitle) listTitle.textContent = cfg.listTitle;
  };

  const mountTab = (tab) => {
    activeTab = tab;
    localStorage.setItem("vv_creator_play_tab", tab);
    syncTabUi(tab);
    const cfg = TABS[tab];
    window.initLearnRadar({
      prefix: "cpl",
      appId: "cplApp",
      windowKey: cfg.windowKey,
      learnSection: cfg.learnSection,
      listWindowMs: cfg.listWindowMs,
      storage: cfg.storage,
      ids: CPL_IDS,
      labels: cfg.labels,
      classifyDomain: cfg.classifyDomain,
      relevanceFilter: cfg.relevanceFilter,
      autoDaily: true,
      autoDailyDefault: true,
      dailyRefreshHour: 8,
    });
  };

  window.scrollToCreatorPlayTab = (tab) => {
    const t = TABS[tab] ? tab : "gaming";
    if (t !== activeTab) mountTab(t);
    else syncTabUi(t);
    const el = document.getElementById("creatorPlayHubItem");
    if (!el) return;
    el.classList.remove("learn-feed-skip", "learn-feed-compact");
    el.classList.add("learn-feed-expanded");
    el.querySelector(".learn-feed-compact-bar")?.remove();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.refreshFeedProgress?.();
  };

  document.getElementById("cplPlayTabs")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-play-tab]");
    if (!btn) return;
    const tab = btn.getAttribute("data-play-tab");
    if (tab && tab !== activeTab) mountTab(tab);
  });

  mountTab(activeTab);
})();
