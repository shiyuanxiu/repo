/* Hot Stocks — US equities radar (NYSE · NASDAQ) */
(function () {
  if (!document.getElementById("stkApp")) return;

  const NON_US_RE =
    /\b(hong kong|hang seng|shanghai|shenzhen|a-share|china stock|chinese stock|taiwan|taipei|tsx|ftse|dax|nifty|sensex|india stock|kospi|asx|nikkei)\b/i;
  const US_MARKET_RE =
    /\b(us stock|u\.s\. stock|wall street|nyse|nasdaq|dow jones|s&p 500|s&p500|\bspy\b|\bqqq\b|premarket|pre-market|after hours|federal reserve|\bfed\b)\b/i;
  const US_TICKER_RE =
    /\b(nvda|aapl|msft|tsla|amzn|googl?|meta|amd|avgo|nflx|crm|intc|pltr|coin|jpm|v|unh|brk\.?a)\b/;

  const isUsStockStory = (title, summary) => {
    const t = `${title} ${summary}`;
    const lower = t.toLowerCase();
    if (NON_US_RE.test(t)) return false;
    if (US_MARKET_RE.test(t)) return true;
    if (US_TICKER_RE.test(lower)) return true;
    if (/\$[A-Z]{1,5}\b/.test(t)) return true;
    if (/\b(us|u\.s\.|america|american)\b/i.test(t) && /\b(stock|stocks|equity|earnings)\b/i.test(t)) return true;
    if (/\b(wsb|meme stock|short squeeze)\b/i.test(lower)) return true;
    if (/\b(stock|stocks|ticker|earnings|selloff|rally)\b/i.test(lower)) return true;
    return false;
  };

  window.initLearnRadar({
    prefix: "stk",
    appId: "stkApp",
    windowKey: "STOCK_PULSE",
    learnSection: "stocks",
    listWindowMs: 3 * 24 * 60 * 60 * 1000,
    storage: {
      cache: "vv_stock_pulse_cache",
      saved: "vv_stock_pulse_saved",
      auto: "vv_stock_pulse_auto",
    },
    ids: {
      list: "stkList",
      radarDots: "stkRadarDots",
      updated: "stkUpdatedAt",
      domainFilters: "stkDomainFilters",
      platformFilters: "stkPlatformFilters",
      search: "stkSearch",
      sheet: "stkSheet",
      listCount: "stkListCount",
      refreshBtn: "stkRefreshBtn",
      autoBtn: "stkAutoBtn",
      savedToggle: "stkSavedToggle",
      sheetClose: "stkSheetClose",
      sheetBackdrop: "stkSheetBackdrop",
      sheetRank: "stkSheetRank",
      sheetPlatform: "stkSheetPlatform",
      sheetTitle: "stkSheetTitle",
      sheetHeat: "stkSheetHeat",
      sheetTime: "stkSheetTime",
      sheetDeep: "stkSheetDeep",
      sheetSave: "stkSheetSave",
      sheetLink: "stkSheetLink",
      readBtn: "stkReadBtn",
    },
    labels: {
      listTitle: "Today's US Hot Stocks",
      deepIntro: "US-listed headlines — NYSE, NASDAQ, and Wall Street movers.",
      refreshToast: "Scanning US stock headlines…",
      loading: "Loading US stocks…",
      empty: "No US stock stories match your filters.",
    },
    classifyDomain(title, summary) {
      const t = `${title} ${summary}`.toLowerCase();
      if (/\b(earnings|eps|revenue beat|guidance|quarterly report)\b/.test(t)) return "earnings";
      if (/\b(fed|inflation|cpi|rate cut|treasury|s&p|nasdaq|dow|market rally|selloff)\b/.test(t)) return "macro";
      if (/\b(wsb|meme|yolo|short squeeze|gamma|options frenzy)\b/.test(t)) return "meme";
      if (/\b(nvda|nvidia|aapl|apple|msft|microsoft|goog|meta|tsla|tesla|amzn|amd|ai chip)\b/.test(t)) return "tech";
      if (/\b(berkshire|jpm|visa|unitedhealth|mega cap|blue chip)\b/.test(t)) return "mega";
      return "mega";
    },
    relevanceFilter: isUsStockStory,
    autoDaily: true,
    autoDailyDefault: true,
    dailyRefreshHour: 9,
  });
})();
