/** Hotspot Radar feeds �?sync with scripts/hotspot-radar-feeds.mjs */
window.HOTSPOT_RADAR_FEEDS = [
  {
    "source": "Hacker News",
    "sourceKey": "hackernews",
    "sourceIcon": "🟠",
    "platform": "hackernews",
    "platformLabel": "Hacker News",
    "domain": "tech",
    "homepage": "https://news.ycombinator.com",
    "url": "https://hnrss.org/frontpage"
  },
  {
    "source": "Reddit · Technology",
    "sourceKey": "reddit",
    "sourceIcon": "🔴",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "social",
    "homepage": "https://www.reddit.com/r/technology",
    "url": "https://www.reddit.com/r/technology/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/technology/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit · World News",
    "sourceKey": "reddit_world",
    "sourceIcon": "🌐",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "social",
    "homepage": "https://www.reddit.com/r/worldnews",
    "url": "https://www.reddit.com/r/worldnews/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/worldnews/top/.rss?t=day"
    ]
  },
  {
    "source": "TechCrunch",
    "sourceKey": "techcrunch",
    "sourceIcon": "💚",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "tech",
    "homepage": "https://techcrunch.com",
    "url": "https://techcrunch.com/feed/"
  },
  {
    "source": "The Verge",
    "sourceKey": "verge",
    "sourceIcon": "📱",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "tech",
    "homepage": "https://www.theverge.com",
    "url": "https://www.theverge.com/rss/index.xml"
  },
  {
    "source": "Ars Technica",
    "sourceKey": "arstechnica",
    "sourceIcon": "🔬",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "tech",
    "homepage": "https://arstechnica.com",
    "url": "https://feeds.arstechnica.com/arstechnica/technology-lab"
  },
  {
    "source": "Google News · AI",
    "sourceKey": "google_ai",
    "sourceIcon": "🤖",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "ai",
    "homepage": "https://news.google.com",
    "url": "https://news.google.com/rss/search?q=artificial+intelligence+OR+OpenAI+OR+Claude+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "Google News · Tech",
    "sourceKey": "google_tech",
    "sourceIcon": "�?,
    "platform": "web",
    "platformLabel": "Web",
    "domain": "tech",
    "homepage": "https://news.google.com",
    "url": "https://news.google.com/rss/search?q=technology+startup+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "Google News · Business",
    "sourceKey": "google_biz",
    "sourceIcon": "💼",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "business",
    "homepage": "https://news.google.com",
    "url": "https://news.google.com/rss/search?q=business+markets+when:1d&hl=en-US&gl=US&ceid=US:en"
  }
];
window.HOTSPOT_RADAR_DAY_MS = 86400000;
window.HOTSPOT_RADAR_STALE_MS = 300000;
window.HOTSPOT_RADAR_DOMAINS = [
  {
    "id": "all",
    "label": "All"
  },
  {
    "id": "ai",
    "label": "AI"
  },
  {
    "id": "tech",
    "label": "Tech"
  },
  {
    "id": "business",
    "label": "Business"
  },
  {
    "id": "social",
    "label": "Social"
  }
];
window.HOTSPOT_RADAR_PLATFORMS = [
  {
    "id": "all",
    "label": "All"
  },
  {
    "id": "web",
    "label": "Web"
  },
  {
    "id": "social",
    "label": "Social"
  },
  {
    "id": "reddit",
    "label": "Reddit"
  },
  {
    "id": "hackernews",
    "label": "Hacker News"
  }
];
