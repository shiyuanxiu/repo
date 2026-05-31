/** Hot Stocks (US) feeds */
window.STOCK_PULSE_FEEDS = [
  {
    "source": "Reddit · r/stocks",
    "sourceKey": "reddit_stocks",
    "sourceIcon": "📈",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "mega",
    "url": "https://www.reddit.com/r/stocks/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/stocks/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit · r/StockMarket",
    "sourceKey": "reddit_smarket",
    "sourceIcon": "🏦",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "mega",
    "url": "https://www.reddit.com/r/StockMarket/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/StockMarket/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit · r/wallstreetbets",
    "sourceKey": "reddit_wsb",
    "sourceIcon": "🚀",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "meme",
    "url": "https://www.reddit.com/r/wallstreetbets/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/wallstreetbets/top/.rss?t=day"
    ]
  },
  {
    "source": "Google News · US market",
    "sourceKey": "google_us_mkt",
    "sourceIcon": "🇺🇸",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "macro",
    "url": "https://news.google.com/rss/search?q=US+stock+market+NYSE+NASDAQ+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "Google News · Wall Street",
    "sourceKey": "google_wallst",
    "sourceIcon": "📡",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "macro",
    "url": "https://news.google.com/rss/search?q=Wall+Street+stocks+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "Google News · US earnings",
    "sourceKey": "google_us_earn",
    "sourceIcon": "📊",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "earnings",
    "url": "https://news.google.com/rss/search?q=US+earnings+report+NYSE+NASDAQ+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "Google News · US tech stocks",
    "sourceKey": "google_us_tech",
    "sourceIcon": "💻",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "tech",
    "url": "https://news.google.com/rss/search?q=NVDA+AAPL+MSFT+NASDAQ+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "CNBC · US stocks",
    "sourceKey": "cnbc_us",
    "sourceIcon": "📺",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "mega",
    "url": "https://news.google.com/rss/search?q=site:cnbc.com+US+stock+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "MarketWatch · US",
    "sourceKey": "mktwatch_us",
    "sourceIcon": "📰",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "mega",
    "url": "https://news.google.com/rss/search?q=site:marketwatch.com+stock+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "Yahoo Finance · US",
    "sourceKey": "yahoo_us",
    "sourceIcon": "🟣",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "mega",
    "url": "https://news.google.com/rss/search?q=site:finance.yahoo.com+NYSE+NASDAQ+when:1d&hl=en-US&gl=US&ceid=US:en",
    "fallbacks": [
      "https://finance.yahoo.com/news/rssindex"
    ]
  }
];
window.STOCK_PULSE_DAY_MS = 86400000;
window.STOCK_PULSE_STALE_MS = 300000;
window.STOCK_PULSE_DOMAINS = [
  {
    "id": "all",
    "label": "All"
  },
  {
    "id": "mega",
    "label": "Mega-cap"
  },
  {
    "id": "tech",
    "label": "Tech"
  },
  {
    "id": "earnings",
    "label": "Earnings"
  },
  {
    "id": "macro",
    "label": "Macro"
  },
  {
    "id": "meme",
    "label": "Meme"
  }
];
window.STOCK_PULSE_PLATFORMS = [
  {
    "id": "all",
    "label": "All"
  },
  {
    "id": "reddit",
    "label": "Reddit"
  },
  {
    "id": "web",
    "label": "Web"
  }
];
