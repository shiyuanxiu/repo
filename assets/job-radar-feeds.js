/** Job Radar feeds */
window.JOB_RADAR_FEEDS = [
  {
    "source": "Reddit · Jobs",
    "sourceKey": "reddit_jobs",
    "sourceIcon": "💼",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "career",
    "url": "https://www.reddit.com/r/jobs/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/jobs/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit · Internships",
    "sourceKey": "reddit_intern",
    "sourceIcon": "🎓",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "internship",
    "url": "https://www.reddit.com/r/internships/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/internships/top/.rss?t=day"
    ]
  },
  {
    "source": "Reddit · cscareerquestions",
    "sourceKey": "reddit_cs",
    "sourceIcon": "💻",
    "platform": "reddit",
    "platformLabel": "Reddit",
    "domain": "tech",
    "url": "https://www.reddit.com/r/cscareerquestions/.rss",
    "fallbacks": [
      "https://www.reddit.com/r/cscareerquestions/top/.rss?t=day"
    ]
  },
  {
    "source": "Hacker News · Jobs",
    "sourceKey": "hn_jobs",
    "sourceIcon": "🟠",
    "platform": "hackernews",
    "platformLabel": "HN Jobs",
    "domain": "tech",
    "url": "https://hnrss.org/jobs"
  },
  {
    "source": "Google News · Hiring",
    "sourceKey": "google_jobs",
    "sourceIcon": "📰",
    "platform": "web",
    "platformLabel": "Web",
    "domain": "career",
    "url": "https://news.google.com/rss/search?q=jobs+hiring+internship+when:1d&hl=en-US&gl=US&ceid=US:en"
  },
  {
    "source": "Google News · Layoffs",
    "sourceKey": "google_layoffs",
    "sourceIcon": "�?,
    "platform": "web",
    "platformLabel": "Web",
    "domain": "layoffs",
    "url": "https://news.google.com/rss/search?q=layoffs+tech+jobs+when:1d&hl=en-US&gl=US&ceid=US:en"
  }
];
window.JOB_RADAR_DAY_MS = 86400000;
window.JOB_RADAR_STALE_MS = 300000;
window.JOB_RADAR_DOMAINS = [
  {
    "id": "all",
    "label": "All"
  },
  {
    "id": "internship",
    "label": "Internships"
  },
  {
    "id": "tech",
    "label": "Tech jobs"
  },
  {
    "id": "layoffs",
    "label": "Layoffs"
  },
  {
    "id": "career",
    "label": "Career"
  },
  {
    "id": "remote",
    "label": "Remote"
  }
];
window.JOB_RADAR_PLATFORMS = [
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
    "label": "HN Jobs"
  }
];
