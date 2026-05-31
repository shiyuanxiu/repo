/** RSS feed config 鈥?keep in sync with scripts/financial-news-rss.mjs */
window.FINANCIAL_NEWS_FEEDS = [
  {
    "source": "CNBC",
    "sourceKey": "cnbc",
    "sourceIcon": "馃摵",
    "homepage": "https://www.cnbc.com",
    "url": "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114",
    "topic": "finance"
  },
  {
    "source": "NPR Business",
    "sourceKey": "npr",
    "sourceIcon": "馃摶",
    "homepage": "https://www.npr.org/sections/business/",
    "url": "https://feeds.npr.org/1019/rss.xml",
    "topic": "business"
  },
  {
    "source": "MarketWatch",
    "sourceKey": "marketwatch",
    "sourceIcon": "馃搳",
    "homepage": "https://www.marketwatch.com",
    "url": "https://feeds.marketwatch.com/marketwatch/topstories/",
    "topic": "finance"
  },
  {
    "source": "The Guardian 路 Business",
    "sourceKey": "guardian",
    "sourceIcon": "馃嚞馃嚙",
    "homepage": "https://www.theguardian.com/business",
    "url": "https://www.theguardian.com/business/rss",
    "topic": "business"
  },
  {
    "source": "AP Business",
    "sourceKey": "ap",
    "sourceIcon": "馃棡锔?,
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
    "sourceIcon": "馃實",
    "homepage": "https://www.bbc.com/news/business",
    "url": "https://feeds.bbci.co.uk/news/business/rss.xml",
    "topic": "business"
  },
  {
    "source": "CNN Business",
    "sourceKey": "cnn",
    "sourceIcon": "馃摪",
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
    "sourceIcon": "馃搱",
    "homepage": "https://finance.yahoo.com",
    "url": "https://news.google.com/rss/search?q=site:finance.yahoo.com+when:7d&hl=en-US&gl=US&ceid=US:en",
    "fallbacks": [
      "https://finance.yahoo.com/news/rssindex"
    ],
    "topic": "finance"
  },
  {
    "source": "Google 路 Business",
    "sourceKey": "google",
    "sourceIcon": "馃攷",
    "homepage": "https://news.google.com",
    "url": "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en",
    "topic": "business"
  },
  {
    "source": "Google 路 Bloomberg",
    "sourceKey": "bloomberg",
    "sourceIcon": "馃捁",
    "homepage": "https://www.bloomberg.com",
    "url": "https://news.google.com/rss/search?q=site:bloomberg.com+when:7d&hl=en-US&gl=US&ceid=US:en",
    "topic": "finance"
  },
  {
    "source": "Google 路 Reuters",
    "sourceKey": "reuters",
    "sourceIcon": "馃摗",
    "homepage": "https://www.reuters.com",
    "url": "https://news.google.com/rss/search?q=site:reuters.com+business+when:7d&hl=en-US&gl=US&ceid=US:en",
    "topic": "business"
  }
];
window.FINANCIAL_NEWS_WEEK_MS = 604800000;
window.FINANCIAL_NEWS_STALE_MS = 300000;
