/** Creator Kit feeds */
window.CREATOR_KIT_FEEDS = [
  {
    "source": "Hacker News 路 Creators",
    "sourceKey": "hn_creators",
    "sourceIcon": "馃煚",
    "platform": "hackernews",
    "platformLabel": "HN",
    "domain": "video",
    "url": "https://hnrss.org/newest?q=content+creator"
  },
  {
    "source": "Hacker News 路 YouTube",
    "sourceKey": "hn_youtube",
    "sourceIcon": "鈻?,
    "platform": "hackernews",
    "platformLabel": "HN",
    "domain": "social",
    "url": "https://hnrss.org/newest?q=youtube"
  },
  {
    "source": "Hacker News 路 Creator",
    "sourceKey": "hn_creator",
    "sourceIcon": "馃幀",
    "platform": "hackernews",
    "platformLabel": "HN",
    "domain": "tools",
    "url": "https://hnrss.org/newest?q=creator"
  },
  {
    "source": "Reddit 路 NewTubers",
    "sourceKey": "reddit_newtubers",
    "sourceIcon": "鈻?,
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "video",
    "url": "https://www.reddit.com/r/NewTubers/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/NewTubers/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit 路 ContentCreation",
    "sourceKey": "reddit_content",
    "sourceIcon": "馃幀",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "tips",
    "url": "https://www.reddit.com/r/ContentCreation/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/ContentCreation/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit 路 TikTokCreators",
    "sourceKey": "reddit_tiktok",
    "sourceIcon": "馃摫",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "social",
    "url": "https://www.reddit.com/r/TikTokCreators/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/TikTokCreators/top/.rss?t=day"
    ]
  },
  {
    "source": "Google News 路 Creator economy",
    "sourceKey": "google_creator",
    "sourceIcon": "馃摪",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "monetize",
    "url": "https://news.google.com/rss/search?q=creator+economy+youtube+tiktok+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "Google News 路 Video editing",
    "sourceKey": "google_editing",
    "sourceIcon": "鉁?,
    "platform": "web",
    "platformLabel": "Web",
    "domain": "tools",
    "url": "https://news.google.com/rss/search?q=video+editing+capcut+premiere+when:1d&hl=en-US&gl=US&ceid=US:en"
  }
];
window.CREATOR_KIT_DAY_MS = 86400000;
window.CREATOR_KIT_STALE_MS = 300000;
window.CREATOR_KIT_DOMAINS = [
  {
    "id": "all",
    "label": "All"
  },
  {
    "id": "video",
    "label": "Video"
  },
  {
    "id": "social",
    "label": "Social"
  },
  {
    "id": "tools",
    "label": "Tools"
  },
  {
    "id": "monetize",
    "label": "Monetize"
  },
  {
    "id": "tips",
    "label": "Tips"
  }
];
window.CREATOR_KIT_PLATFORMS = [
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
