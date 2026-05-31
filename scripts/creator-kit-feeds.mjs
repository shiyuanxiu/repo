/** Creator Kit radar RSS config */

export const DAY_MS = 24 * 60 * 60 * 1000;

export const DOMAINS = [
  { id: "all", label: "All" },
  { id: "video", label: "Video" },
  { id: "social", label: "Social" },
  { id: "tools", label: "Tools" },
  { id: "monetize", label: "Monetize" },
  { id: "tips", label: "Tips" },
];

export const PLATFORMS = [
  { id: "all", label: "All" },
  { id: "reddit", label: "Reddit" },
  { id: "web", label: "Web" },
  { id: "hackernews", label: "HN" },
];

export const FEEDS = [
  {
    source: "Hacker News · Creators",
    sourceKey: "hn_creators",
    sourceIcon: "🟠",
    platform: "hackernews",
    platformLabel: "HN",
    domain: "video",
    url: "https://hnrss.org/newest?q=content+creator",
  },
  {
    source: "Hacker News · YouTube",
    sourceKey: "hn_youtube",
    sourceIcon: "▶",
    platform: "hackernews",
    platformLabel: "HN",
    domain: "social",
    url: "https://hnrss.org/newest?q=youtube",
  },
  {
    source: "Hacker News · Creator",
    sourceKey: "hn_creator",
    sourceIcon: "🎬",
    platform: "hackernews",
    platformLabel: "HN",
    domain: "tools",
    url: "https://hnrss.org/newest?q=creator",
  },
  {
    source: "Reddit · NewTubers",
    sourceKey: "reddit_newtubers",
    sourceIcon: "▶",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "video",
    url: "https://www.reddit.com/r/NewTubers/.rss",
    fallbacks: ["https://www.reddit.com/r/NewTubers/top/.rss?t=day"],
  },
  {
    source: "Reddit · ContentCreation",
    sourceKey: "reddit_content",
    sourceIcon: "🎬",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "tips",
    url: "https://www.reddit.com/r/ContentCreation/.rss",
    fallbacks: ["https://www.reddit.com/r/ContentCreation/top/.rss?t=day"],
  },
  {
    source: "Reddit · TikTokCreators",
    sourceKey: "reddit_tiktok",
    sourceIcon: "📱",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "social",
    url: "https://www.reddit.com/r/TikTokCreators/.rss",
    fallbacks: ["https://www.reddit.com/r/TikTokCreators/top/.rss?t=day"],
  },
  {
    source: "Google News · Creator economy",
    sourceKey: "google_creator",
    sourceIcon: "📰",
    platform: "web",
    platformLabel: "Web",
    domain: "monetize",
    url: "https://news.google.com/rss/search?q=creator+economy+youtube+tiktok+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "Google News · Video editing",
    sourceKey: "google_editing",
    sourceIcon: "✂",
    platform: "web",
    platformLabel: "Web",
    domain: "tools",
    url: "https://news.google.com/rss/search?q=video+editing+capcut+premiere+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
];

export function classifyDomain(title = "", summary = "") {
  const t = `${title} ${summary}`.toLowerCase();
  if (/\b(youtube|tiktok|shorts|reels|stream|podcast)\b/.test(t)) return "video";
  if (/\b(instagram|twitter|x\.com|threads|social media)\b/.test(t)) return "social";
  if (/\b(capcut|premiere|davinci|obs|canva|tool|app|software)\b/.test(t)) return "tools";
  if (/\b(sponsor|monetiz|ad revenue|brand deal|affiliate|patron)\b/.test(t)) return "monetize";
  if (/\b(tip|how to|guide|grow|algorithm|hook)\b/.test(t)) return "tips";
  return "video";
}

export function computeHeat(publishedAt, rank) {
  const ageH = Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 3600000);
  const base = Math.max(500, 9000 - ageH * 380);
  return Math.round((base - rank * 120 + (rank % 3) * 47) * 10) / 10;
}

export function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
