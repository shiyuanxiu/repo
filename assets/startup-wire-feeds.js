/** Startup Wire feeds */
window.STARTUP_WIRE_FEEDS = [
  {
    "source": "Reddit · startups",
    "sourceKey": "reddit_startups",
    "sourceIcon": "🚀",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "founders",
    "url": "https://www.reddit.com/r/startups/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/startups/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit · Entrepreneur",
    "sourceKey": "reddit_entrepreneur",
    "sourceIcon": "💡",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "founders",
    "url": "https://www.reddit.com/r/Entrepreneur/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/Entrepreneur/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit · SideProject",
    "sourceKey": "reddit_side",
    "sourceIcon": "🛠",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "product",
    "url": "https://www.reddit.com/r/SideProject/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/SideProject/top/.rss?t=day"
    ]
  },
  {
    "source": "Hacker News · Front",
    "sourceKey": "hn_front",
    "sourceIcon": "🟠",
    "platform": "hackernews",
    "platformLabel": "HN",
    "domain": "tech",
    "url": "https://hnrss.org/frontpage"
  },
  {
    "source": "Google News · Startups",
    "sourceKey": "google_startups",
    "sourceIcon": "📰",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "funding",
    "url": "https://news.google.com/rss/search?q=startup+funding+venture+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "Google News · YC",
    "sourceKey": "google_yc",
    "sourceIcon": "🟧",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "founders",
    "url": "https://news.google.com/rss/search?q=y+combinator+startup+when:1d&hl=en-US&gl=US&ceid=US:en"
  }
];
window.STARTUP_WIRE_DAY_MS = 86400000;
window.STARTUP_WIRE_STALE_MS = 300000;
window.STARTUP_WIRE_DOMAINS = [
  {
    "id": "all",
    "label": "All"
  },
  {
    "id": "funding",
    "label": "Funding"
  },
  {
    "id": "product",
    "label": "Product"
  },
  {
    "id": "founders",
    "label": "Founders"
  },
  {
    "id": "tech",
    "label": "Tech"
  },
  {
    "id": "careers",
    "label": "Careers"
  }
];
window.STARTUP_WIRE_PLATFORMS = [
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
  },
  {
    "id": "hackernews",
    "label": "HN"
  }
];
