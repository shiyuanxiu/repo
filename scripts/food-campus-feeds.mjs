/** Food on Campus RSS config */

export const DAY_MS = 24 * 60 * 60 * 1000;

export const DOMAINS = [
  { id: "all", label: "All" },
  { id: "budget", label: "Budget" },
  { id: "recipes", label: "Recipes" },
  { id: "dining", label: "Dining hall" },
  { id: "healthy", label: "Healthy" },
  { id: "snacks", label: "Snacks" },
];

export const PLATFORMS = [
  { id: "all", label: "All" },
  { id: "reddit", label: "Reddit" },
  { id: "web", label: "Web" },
];

export const FEEDS = [
  {
    source: "NPR · Food",
    sourceKey: "npr_food",
    sourceIcon: "📻",
    platform: "web",
    platformLabel: "Web",
    domain: "recipes",
    url: "https://feeds.npr.org/1019/rss.xml",
  },
  {
    source: "Reddit · EatCheapAndHealthy",
    sourceKey: "reddit_cheap",
    sourceIcon: "🥗",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "budget",
    url: "https://www.reddit.com/r/EatCheapAndHealthy/.rss",
    fallbacks: ["https://www.reddit.com/r/EatCheapAndHealthy/top/.rss?t=day"],
  },
  {
    source: "Reddit · college",
    sourceKey: "reddit_college_food",
    sourceIcon: "🍜",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "dining",
    url: "https://www.reddit.com/r/college/.rss",
    fallbacks: ["https://www.reddit.com/r/college/top/.rss?t=week"],
  },
  {
    source: "Reddit · MealPrepSunday",
    sourceKey: "reddit_mealprep",
    sourceIcon: "🍱",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "recipes",
    url: "https://www.reddit.com/r/MealPrepSunday/.rss",
    fallbacks: ["https://www.reddit.com/r/MealPrepSunday/top/.rss?t=day"],
  },
  {
    source: "Google News · College food",
    sourceKey: "google_food",
    sourceIcon: "📰",
    platform: "web",
    platformLabel: "Web",
    domain: "dining",
    url: "https://news.google.com/rss/search?q=college+student+food+budget+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "Google News · Cheap meals",
    sourceKey: "google_cheap",
    sourceIcon: "💵",
    platform: "web",
    platformLabel: "Web",
    domain: "budget",
    url: "https://news.google.com/rss/search?q=cheap+healthy+meals+students+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
];

export function classifyDomain(title = "", summary = "") {
  const t = `${title} ${summary}`.toLowerCase();
  if (/\b(dining hall|cafeteria|campus food|meal plan|swipe)\b/.test(t)) return "dining";
  if (/\b(cheap|budget|dollar|afford|broke|ramen)\b/.test(t)) return "budget";
  if (/\b(recipe|meal prep|cook|instant pot|air fryer)\b/.test(t)) return "recipes";
  if (/\b(healthy|nutrition|protein|vegetarian|vegan|salad)\b/.test(t)) return "healthy";
  if (/\b(snack|microwave|dorm|late night|coffee)\b/.test(t)) return "snacks";
  return "budget";
}

export function computeHeat(publishedAt, rank) {
  const ageH = Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 3600000);
  const base = Math.max(500, 9000 - ageH * 380);
  return Math.round((base - rank * 120 + (rank % 3) * 47) * 10) / 10;
}

export function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
