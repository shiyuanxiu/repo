/** Hot Stocks RSS config — US equities only (NYSE · NASDAQ) */

export const DAY_MS = 24 * 60 * 60 * 1000;

export const DOMAINS = [
  { id: "all", label: "All" },
  { id: "mega", label: "Mega-cap" },
  { id: "tech", label: "Tech" },
  { id: "earnings", label: "Earnings" },
  { id: "macro", label: "Macro" },
  { id: "meme", label: "Meme" },
];

export const PLATFORMS = [
  { id: "all", label: "All" },
  { id: "reddit", label: "Reddit" },
  { id: "web", label: "Web" },
];

const NON_US_RE =
  /\b(hong kong|hang seng|shanghai|shenzhen|a-share|a-shares|china stock|chinese stock|beijing stock|taiwan|taipei|tsx|toronto stock|london stock|ftse 100|ftse100|dax|frankfurt|euro stoxx|bombay|nifty|sensex|bse|india stock|indian stock|kospi|korea stock|asx|australia stock|singapore stock|stoxx|european stock|uk stock|japan stock|nikkei)\b/i;

const US_MARKET_RE =
  /\b(us stock|u\.s\. stock|american stock|wall street|nyse|nasdaq|dow jones|s&p 500|s&p500|\bspy\b|\bqqq\b|\bdia\b|\biwm\b|premarket|pre-market|after hours|after-hours|federal reserve|\bfed\b|treasury yield|sec filing)\b/i;

const US_TICKER_RE =
  /\b(nvda|aapl|msft|tsla|amzn|googl?|meta|amd|avgo|cost|nflx|crm|orcl|intc|mu|pltr|coin|hood|bac|jpm|v|ma|unh|brk\.?a|wmt|dis|xom|cvx|pep|ko|abbv|llly|smci|arm|snow|uber|abnb)\b/i;

/** Keep US-listed equities; drop overseas / non-US market headlines */
export function isUsStockStory(title = "", summary = "") {
  const t = `${title} ${summary}`;
  const lower = t.toLowerCase();
  if (NON_US_RE.test(t)) return false;
  if (US_MARKET_RE.test(t)) return true;
  if (US_TICKER_RE.test(lower)) return true;
  if (/\$[A-Z]{1,5}\b/.test(t)) return true;
  if (/\b(us|u\.s\.|america|american)\b/i.test(t) && /\b(stock|stocks|equity|equities|earnings|ipo|dividend)\b/i.test(t)) return true;
  if (/\b(wsb|meme stock|short squeeze|yolo)\b/i.test(lower)) return true;
  if (/\b(stock|stocks|ticker|earnings|market rally|selloff|blue chip)\b/i.test(lower) && !NON_US_RE.test(t)) return true;
  return false;
}

export const FEEDS = [
  {
    source: "Reddit · r/stocks",
    sourceKey: "reddit_stocks",
    sourceIcon: "📈",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "mega",
    url: "https://www.reddit.com/r/stocks/.rss",
    fallbacks: ["https://www.reddit.com/r/stocks/top/.rss?t=day"],
  },
  {
    source: "Reddit · r/StockMarket",
    sourceKey: "reddit_smarket",
    sourceIcon: "🏦",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "mega",
    url: "https://www.reddit.com/r/StockMarket/.rss",
    fallbacks: ["https://www.reddit.com/r/StockMarket/top/.rss?t=day"],
  },
  {
    source: "Reddit · r/wallstreetbets",
    sourceKey: "reddit_wsb",
    sourceIcon: "🚀",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "meme",
    url: "https://www.reddit.com/r/wallstreetbets/.rss",
    fallbacks: ["https://www.reddit.com/r/wallstreetbets/top/.rss?t=day"],
  },
  {
    source: "Google News · US market",
    sourceKey: "google_us_mkt",
    sourceIcon: "🇺🇸",
    platform: "web",
    platformLabel: "Web",
    domain: "macro",
    url: "https://news.google.com/rss/search?q=US+stock+market+NYSE+NASDAQ+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "Google News · Wall Street",
    sourceKey: "google_wallst",
    sourceIcon: "📡",
    platform: "web",
    platformLabel: "Web",
    domain: "macro",
    url: "https://news.google.com/rss/search?q=Wall+Street+stocks+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "Google News · US earnings",
    sourceKey: "google_us_earn",
    sourceIcon: "📊",
    platform: "web",
    platformLabel: "Web",
    domain: "earnings",
    url: "https://news.google.com/rss/search?q=US+earnings+report+NYSE+NASDAQ+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "Google News · US tech stocks",
    sourceKey: "google_us_tech",
    sourceIcon: "💻",
    platform: "web",
    platformLabel: "Web",
    domain: "tech",
    url: "https://news.google.com/rss/search?q=NVDA+AAPL+MSFT+NASDAQ+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "CNBC · US stocks",
    sourceKey: "cnbc_us",
    sourceIcon: "📺",
    platform: "web",
    platformLabel: "Web",
    domain: "mega",
    url: "https://news.google.com/rss/search?q=site:cnbc.com+US+stock+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "MarketWatch · US",
    sourceKey: "mktwatch_us",
    sourceIcon: "📰",
    platform: "web",
    platformLabel: "Web",
    domain: "mega",
    url: "https://news.google.com/rss/search?q=site:marketwatch.com+stock+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "Yahoo Finance · US",
    sourceKey: "yahoo_us",
    sourceIcon: "🟣",
    platform: "web",
    platformLabel: "Web",
    domain: "mega",
    url: "https://news.google.com/rss/search?q=site:finance.yahoo.com+NYSE+NASDAQ+when:1d&hl=en-US&gl=US&ceid=US:en",
    fallbacks: ["https://finance.yahoo.com/news/rssindex"],
  },
];

export function classifyDomain(title = "", summary = "") {
  const t = `${title} ${summary}`.toLowerCase();
  if (/\b(earnings|eps|revenue beat|guidance|quarterly report)\b/.test(t)) return "earnings";
  if (/\b(fed|inflation|cpi|rate cut|treasury|s&p|nasdaq|dow|market rally|selloff)\b/.test(t)) return "macro";
  if (/\b(wsb|meme|yolo|short squeeze|gamma|options frenzy)\b/.test(t)) return "meme";
  if (/\b(nvda|nvidia|aapl|apple|msft|microsoft|goog|meta|tsla|tesla|amzn|amd|ai chip)\b/.test(t)) return "tech";
  if (/\b(berkshire|jpm|visa|unitedhealth|mega cap|blue chip)\b/.test(t)) return "mega";
  return "mega";
}

export function computeHeat(publishedAt, rank) {
  const ageH = Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 3600000);
  const base = Math.max(500, 9000 - ageH * 380);
  return Math.round((base - rank * 120 + (rank % 3) * 47) * 10) / 10;
}

export function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
