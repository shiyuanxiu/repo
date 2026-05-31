/** Food on Campus feeds */
window.FOOD_CAMPUS_FEEDS = [
  {
    "source": "NPR · Food",
    "sourceKey": "npr_food",
    "sourceIcon": "📻",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "recipes",
    "url": "https://feeds.npr.org/1019/rss.xml"
  },
  {
    "source": "Reddit · EatCheapAndHealthy",
    "sourceKey": "reddit_cheap",
    "sourceIcon": "🥗",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "budget",
    "url": "https://www.reddit.com/r/EatCheapAndHealthy/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/EatCheapAndHealthy/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit · college",
    "sourceKey": "reddit_college_food",
    "sourceIcon": "🍜",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "dining",
    "url": "https://www.reddit.com/r/college/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/college/top/.rss?t=week"
    ]
  },
  {
    "source": "Reddit · MealPrepSunday",
    "sourceKey": "reddit_mealprep",
    "sourceIcon": "🍱",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "recipes",
    "url": "https://www.reddit.com/r/MealPrepSunday/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/MealPrepSunday/top/.rss?t=day"
    ]
  },
  {
    "source": "Google News · College food",
    "sourceKey": "google_food",
    "sourceIcon": "📰",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "dining",
    "url": "https://news.google.com/rss/search?q=college+student+food+budget+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "Google News · Cheap meals",
    "sourceKey": "google_cheap",
    "sourceIcon": "💵",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "budget",
    "url": "https://news.google.com/rss/search?q=cheap+healthy+meals+students+when:1d&hl=en-US&gl=US&ceid=US:en"
  }
];
window.FOOD_CAMPUS_DAY_MS = 86400000;
window.FOOD_CAMPUS_STALE_MS = 300000;
window.FOOD_CAMPUS_DOMAINS = [
  {
    "id": "all",
    "label": "All"
  },
  {
    "id": "budget",
    "label": "Budget"
  },
  {
    "id": "recipes",
    "label": "Recipes"
  },
  {
    "id": "dining",
    "label": "Dining hall"
  },
  {
    "id": "healthy",
    "label": "Healthy"
  },
  {
    "id": "snacks",
    "label": "Snacks"
  }
];
window.FOOD_CAMPUS_PLATFORMS = [
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
