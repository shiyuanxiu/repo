/** Campus Life Feed RSS config */

export const DAY_MS = 24 * 60 * 60 * 1000;

export const DOMAINS = [
  { id: "all", label: "All" },
  { id: "campus", label: "Campus" },
  { id: "dorm", label: "Dorm" },
  { id: "study", label: "Study" },
  { id: "social", label: "Social" },
  { id: "career", label: "Career prep" },
];

export const PLATFORMS = [
  { id: "all", label: "All" },
  { id: "reddit", label: "Reddit" },
  { id: "web", label: "Web" },
];

export const FEEDS = [
  {
    source: "Reddit · College",
    sourceKey: "reddit_college",
    sourceIcon: "🎓",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "campus",
    url: "https://www.reddit.com/r/college/.rss",
    fallbacks: ["https://www.reddit.com/r/college/top/.rss?t=day"],
  },
  {
    source: "Reddit · ApplyingToCollege",
    sourceKey: "reddit_a2c",
    sourceIcon: "📝",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "career",
    url: "https://www.reddit.com/r/ApplyingToCollege/.rss",
    fallbacks: ["https://www.reddit.com/r/ApplyingToCollege/top/.rss?t=day"],
  },
  {
    source: "Reddit · Roommates",
    sourceKey: "reddit_room",
    sourceIcon: "🏠",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "dorm",
    url: "https://www.reddit.com/r/roommates/.rss",
    fallbacks: ["https://www.reddit.com/r/roommates/top/.rss?t=day"],
  },
  {
    source: "Google News · Campus",
    sourceKey: "google_campus",
    sourceIcon: "🏫",
    platform: "web",
    platformLabel: "Web",
    domain: "campus",
    url: "https://news.google.com/rss/search?q=college+campus+students+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "Google News · College life",
    sourceKey: "google_life",
    sourceIcon: "📚",
    platform: "web",
    platformLabel: "Web",
    domain: "social",
    url: "https://news.google.com/rss/search?q=college+life+dorm+internship+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "NPR · Education",
    sourceKey: "npr_ed",
    sourceIcon: "📻",
    platform: "web",
    platformLabel: "Web",
    domain: "campus",
    url: "https://feeds.npr.org/1013/rss.xml",
  },
];

export function classifyDomain(title = "", summary = "") {
  const t = `${title} ${summary}`.toLowerCase();
  if (/\b(dorm|roommate|housing|lease|rent)\b/.test(t)) return "dorm";
  if (/\b(exam|study|homework|class|professor|gpa|midterm|finals)\b/.test(t)) return "study";
  if (/\b(intern|job|career|resume|interview|apply|admission)\b/.test(t)) return "career";
  if (/\b(party|friend|dating|club|greek|social)\b/.test(t)) return "social";
  return "campus";
}

export function computeHeat(publishedAt, rank) {
  const ageH = Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 3600000);
  const base = Math.max(500, 9000 - ageH * 380);
  return Math.round((base - rank * 120 + (rank % 3) * 47) * 10) / 10;
}

export function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
