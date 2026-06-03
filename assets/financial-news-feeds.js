/** RSS feed config �?keep in sync with scripts/financial-news-rss.mjs */
window.FINANCIAL_NEWS_FEEDS = [
  {
    "source": "CNBC",
    "sourceKey": "cnbc",
    "sourceIcon": "📺",
    "homepage": "https://www.cnbc.com",
    "url": "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114",
    "topic": "finance"
  },
  {
    "source": "NPR Business",
    "sourceKey": "npr",
    "sourceIcon": "📻",
    "homepage": "https://www.npr.org/sections/business/",
    "url": "https://feeds.npr.org/1019/rss.xml",
    "topic": "business"
  },
  {
    "source": "MarketWatch",
    "sourceKey": "marketwatch",
    "sourceIcon": "📊",
    "homepage": "https://www.marketwatch.com",
    "url": "https://feeds.marketwatch.com/marketwatch/topstories/",
    "topic": "finance"
  },
  {
    "source": "The Guardian · Business",
    "sourceKey": "guardian",
    "sourceIcon": "🇬🇧",
    "homepage": "https://www.theguardian.com/business",
    "url": "https://www.theguardian.com/business/rss",
    "topic": "business"
  },
  {
    "source": "AP Business",
    "sourceKey": "ap",
    "sourceIcon": "🗞�?,
    "homepage": "https://apnews.com/hub/business",
    "url": "https://rsshub.app/apnews/topics/business",
    "fallbacks": [
      "https://news.google.com/rss/search?q=site:apnews.com+business+when:7d&hl=en-US&gl=US&ceid=US:en"
    ],
    "topic": "business"
  },
  {
    "source": "BBC Business",
    "sourceKey": "bbc",
    "sourceIcon": "🌍",
    "homepage": "https://www.bbc.com/news/business",
    "url": "https://feeds.bbci.co.uk/news/business/rss.xml",
    "topic": "business"
  },
  {
    "source": "CNN Business",
    "sourceKey": "cnn",
    "sourceIcon": "📰",
    "homepage": "https://www.cnn.com/business",
    "url": "https://rss.cnn.com/rss/money_latest.rss",
    "fallbacks": [
      "http://rss.cnn.com/rss/money_latest.rss"
    ],
    "topic": "finance"
  },
  {
    "source": "Yahoo Finance",
    "sourceKey": "yahoo",
    "sourceIcon": "📈",
    "homepage": "https://finance.yahoo.com",
    "url": "https://news.google.com/rss/search?q=site:finance.yahoo.com+when:7d&hl=en-US&gl=US&ceid=US:en",
    "fallbacks": [
      "https://finance.yahoo.com/news/rssindex"
    ],
    "topic": "finance"
  },
  {
    "source": "Google · Business",
    "sourceKey": "google",
    "sourceIcon": "🔎",
    "homepage": "https://news.google.com",
    "url": "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en",
    "topic": "business"
  },
  {
    "source": "Google · Bloomberg",
    "sourceKey": "bloomberg",
    "sourceIcon": "💹",
    "homepage": "https://www.bloomberg.com",
    "url": "https://news.google.com/rss/search?q=site:bloomberg.com+when:7d&hl=en-US&gl=US&ceid=US:en",
    "topic": "finance"
  },
  {
    "source": "Google · Reuters",
    "sourceKey": "reuters",
    "sourceIcon": "📡",
    "homepage": "https://www.reuters.com",
    "url": "https://news.google.com/rss/search?q=site:reuters.com+business+when:7d&hl=en-US&gl=US&ceid=US:en",
    "topic": "business"
  }
];
window.FINANCIAL_NEWS_WEEK_MS = 604800000;
window.FINANCIAL_NEWS_STALE_MS = 300000;
