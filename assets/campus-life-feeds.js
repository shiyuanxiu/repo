/** Campus Life Feed feeds */
window.CAMPUS_LIFE_FEEDS = [
  {
    "source": "Reddit · College",
    "sourceKey": "reddit_college",
    "sourceIcon": "🎓",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "campus",
    "url": "https://www.reddit.com/r/college/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/college/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit · ApplyingToCollege",
    "sourceKey": "reddit_a2c",
    "sourceIcon": "📝",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "career",
    "url": "https://www.reddit.com/r/ApplyingToCollege/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/ApplyingToCollege/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit · Roommates",
    "sourceKey": "reddit_room",
    "sourceIcon": "🏠",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "dorm",
    "url": "https://www.reddit.com/r/roommates/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/roommates/top/.rss?t=day"
    ]
  },
  {
    "source": "Google News · Campus",
    "sourceKey": "google_campus",
    "sourceIcon": "🏫",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "campus",
    "url": "https://news.google.com/rss/search?q=college+campus+students+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "Google News · College life",
    "sourceKey": "google_life",
    "sourceIcon": "📚",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "social",
    "url": "https://news.google.com/rss/search?q=college+life+dorm+internship+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "NPR · Education",
    "sourceKey": "npr_ed",
    "sourceIcon": "📻",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "campus",
    "url": "https://feeds.npr.org/1013/rss.xml"
  }
];
window.CAMPUS_LIFE_DAY_MS = 86400000;
window.CAMPUS_LIFE_STALE_MS = 300000;
window.CAMPUS_LIFE_DOMAINS = [
  {
    "id": "all",
    "label": "All"
  },
  {
    "id": "campus",
    "label": "Campus"
  },
  {
    "id": "dorm",
    "label": "Dorm"
  },
  {
    "id": "study",
    "label": "Study"
  },
  {
    "id": "social",
    "label": "Social"
  },
  {
    "id": "career",
    "label": "Career prep"
  }
];
window.CAMPUS_LIFE_PLATFORMS = [
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
