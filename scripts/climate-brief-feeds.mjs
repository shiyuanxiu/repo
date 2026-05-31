/** Climate Brief RSS config */

export const DAY_MS = 24 * 60 * 60 * 1000;

export const DOMAINS = [
  { id: "all", label: "All" },
  { id: "policy", label: "Policy" },
  { id: "science", label: "Science" },
  { id: "energy", label: "Energy" },
  { id: "action", label: "Action" },
  { id: "wildlife", label: "Wildlife" },
];

export const PLATFORMS = [
  { id: "all", label: "All" },
  { id: "reddit", label: "Reddit" },
  { id: "web", label: "Web" },
  { id: "hackernews", label: "HN" },
];

export const FEEDS = [
  {
    source: "Guardian · Environment",
    sourceKey: "guardian_env",
    sourceIcon: "🌍",
    platform: "web",
    platformLabel: "Web",
    domain: "science",
    url: "https://www.theguardian.com/environment/rss",
  },
  {
    source: "Hacker News · Climate",
    sourceKey: "hn_climate",
    sourceIcon: "🟠",
    platform: "hackernews",
    platformLabel: "HN",
    domain: "science",
    url: "https://hnrss.org/newest?q=climate",
  },
  {
    source: "Reddit · environment",
    sourceKey: "reddit_env",
    sourceIcon: "♻",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "action",
    url: "https://www.reddit.com/r/environment/.rss",
    fallbacks: ["https://www.reddit.com/r/environment/top/.rss?t=day"],
  },
  {
    source: "Reddit · climate",
    sourceKey: "reddit_climate",
    sourceIcon: "🌡",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "policy",
    url: "https://www.reddit.com/r/climate/.rss",
    fallbacks: ["https://www.reddit.com/r/climate/top/.rss?t=day"],
  },
  {
    source: "Google News · Climate",
    sourceKey: "google_climate",
    sourceIcon: "📰",
    platform: "web",
    platformLabel: "Web",
    domain: "policy",
    url: "https://news.google.com/rss/search?q=climate+change+environment+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "Google News · Renewable",
    sourceKey: "google_energy",
    sourceIcon: "⚡",
    platform: "web",
    platformLabel: "Web",
    domain: "energy",
    url: "https://news.google.com/rss/search?q=renewable+energy+solar+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
];

export function classifyDomain(title = "", summary = "") {
  const t = `${title} ${summary}`.toLowerCase();
  if (/\b(solar|wind|renewable|nuclear|grid|battery|ev)\b/.test(t)) return "energy";
  if (/\b(wildlife|species|ocean|coral|forest|biodiversity)\b/.test(t)) return "wildlife";
  if (/\b(study|research|scientist|model|temperature|ipcc)\b/.test(t)) return "science";
  if (/\b(protest|activist|volunteer|local|campus|recycle)\b/.test(t)) return "action";
  if (/\b(law|policy|cop|government|regulation|paris)\b/.test(t)) return "policy";
  return "science";
}

export function computeHeat(publishedAt, rank) {
  const ageH = Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 3600000);
  const base = Math.max(500, 9000 - ageH * 380);
  return Math.round((base - rank * 120 + (rank % 3) * 47) * 10) / 10;
}

export function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
