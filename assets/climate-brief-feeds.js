/** Climate Brief feeds */
window.CLIMATE_BRIEF_FEEDS = [
  {
    "source": "Guardian 路 Environment",
    "sourceKey": "guardian_env",
    "sourceIcon": "馃實",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "science",
    "url": "https://www.theguardian.com/environment/rss"
  },
  {
    "source": "Hacker News 路 Climate",
    "sourceKey": "hn_climate",
    "sourceIcon": "馃煚",
    "platform": "hackernews",
    "platformLabel": "HN",
    "domain": "science",
    "url": "https://hnrss.org/newest?q=climate"
  },
  {
    "source": "Reddit 路 environment",
    "sourceKey": "reddit_env",
    "sourceIcon": "鈾?,
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "action",
    "url": "https://www.reddit.com/r/environment/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/environment/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit 路 climate",
    "sourceKey": "reddit_climate",
    "sourceIcon": "馃尅",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "policy",
    "url": "https://www.reddit.com/r/climate/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/climate/top/.rss?t=day"
    ]
  },
  {
    "source": "Google News 路 Climate",
    "sourceKey": "google_climate",
    "sourceIcon": "馃摪",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "policy",
    "url": "https://news.google.com/rss/search?q=climate+change+environment+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "Google News 路 Renewable",
    "sourceKey": "google_energy",
    "sourceIcon": "鈿?,
    "platform": "web",
    "platformLabel": "Web",
    "domain": "energy",
    "url": "https://news.google.com/rss/search?q=renewable+energy+solar+when:1d&hl=en-US&gl=US&ceid=US:en"
  }
];
window.CLIMATE_BRIEF_DAY_MS = 86400000;
window.CLIMATE_BRIEF_STALE_MS = 300000;
window.CLIMATE_BRIEF_DOMAINS = [
  {
    "id": "all",
    "label": "All"
  },
  {
    "id": "policy",
    "label": "Policy"
  },
  {
    "id": "science",
    "label": "Science"
  },
  {
    "id": "energy",
    "label": "Energy"
  },
  {
    "id": "action",
    "label": "Action"
  },
  {
    "id": "wildlife",
    "label": "Wildlife"
  }
];
window.CLIMATE_BRIEF_PLATFORMS = [
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
