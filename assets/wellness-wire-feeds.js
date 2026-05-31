/** Wellness Wire feeds */
window.WELLNESS_WIRE_FEEDS = [
  {
    "source": "NPR · Health",
    "sourceKey": "npr_health",
    "sourceIcon": "📻",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "mental",
    "url": "https://feeds.npr.org/1128/rss.xml"
  },
  {
    "source": "Hacker News · Health",
    "sourceKey": "hn_health",
    "sourceIcon": "🟠",
    "platform": "hackernews",
    "platformLabel": "HN",
    "domain": "habits",
    "url": "https://hnrss.org/newest?q=health"
  },
  {
    "source": "Reddit · mentalhealth",
    "sourceKey": "reddit_mh",
    "sourceIcon": "🧠",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "mental",
    "url": "https://www.reddit.com/r/mentalhealth/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/mentalhealth/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit · Fitness",
    "sourceKey": "reddit_fit",
    "sourceIcon": "💪",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "fitness",
    "url": "https://www.reddit.com/r/Fitness/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/Fitness/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit · sleep",
    "sourceKey": "reddit_sleep",
    "sourceIcon": "😴",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "sleep",
    "url": "https://www.reddit.com/r/sleep/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/sleep/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit · nutrition",
    "sourceKey": "reddit_nutrition",
    "sourceIcon": "🥗",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "nutrition",
    "url": "https://www.reddit.com/r/nutrition/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/nutrition/top/.rss?t=day"
    ]
  },
  {
    "source": "Google News · Wellness",
    "sourceKey": "google_wellness",
    "sourceIcon": "🌿",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "habits",
    "url": "https://news.google.com/rss/search?q=wellness+mental+health+students+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "Google News · Sleep",
    "sourceKey": "google_sleep",
    "sourceIcon": "🌙",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "sleep",
    "url": "https://news.google.com/rss/search?q=sleep+health+research+when:1d&hl=en-US&gl=US&ceid=US:en"
  }
];
window.WELLNESS_WIRE_DAY_MS = 86400000;
window.WELLNESS_WIRE_STALE_MS = 300000;
window.WELLNESS_WIRE_DOMAINS = [
  {
    "id": "all",
    "label": "All"
  },
  {
    "id": "mental",
    "label": "Mental"
  },
  {
    "id": "fitness",
    "label": "Fitness"
  },
  {
    "id": "sleep",
    "label": "Sleep"
  },
  {
    "id": "nutrition",
    "label": "Nutrition"
  },
  {
    "id": "habits",
    "label": "Habits"
  }
];
window.WELLNESS_WIRE_PLATFORMS = [
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
