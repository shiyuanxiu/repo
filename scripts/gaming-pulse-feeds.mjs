/** Gaming Pulse RSS config */

export const DAY_MS = 24 * 60 * 60 * 1000;

export const DOMAINS = [
  { id: "all", label: "All" },
  { id: "releases", label: "Releases" },
  { id: "esports", label: "Esports" },
  { id: "indie", label: "Indie" },
  { id: "hardware", label: "Hardware" },
  { id: "culture", label: "Culture" },
];

export const PLATFORMS = [
  { id: "all", label: "All" },
  { id: "reddit", label: "Reddit" },
  { id: "web", label: "Web" },
  { id: "hackernews", label: "HN" },
];

export const FEEDS = [
  {
    source: "Hacker News · Games",
    sourceKey: "hn_games",
    sourceIcon: "🟠",
    platform: "hackernews",
    platformLabel: "HN",
    domain: "culture",
    url: "https://hnrss.org/newest?q=game",
    fallbacks: ["https://hnrss.org/newest?q=video+game"],
  },
  {
    source: "Reddit · r/games",
    sourceKey: "reddit_games",
    sourceIcon: "🎮",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "culture",
    url: "https://www.reddit.com/r/games/.rss",
    fallbacks: ["https://www.reddit.com/r/games/top/.rss?t=day"],
  },
  {
    source: "Reddit · GamesNews",
    sourceKey: "reddit_gnews",
    sourceIcon: "📰",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "releases",
    url: "https://www.reddit.com/r/GamesNews/.rss",
    fallbacks: ["https://www.reddit.com/r/GamesNews/top/.rss?t=day"],
  },
  {
    source: "Reddit · pcgaming",
    sourceKey: "reddit_pc",
    sourceIcon: "🖥",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "hardware",
    url: "https://www.reddit.com/r/pcgaming/.rss",
    fallbacks: ["https://www.reddit.com/r/pcgaming/top/.rss?t=day"],
  },
  {
    source: "Reddit · esports",
    sourceKey: "reddit_esports",
    sourceIcon: "🏆",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "esports",
    url: "https://www.reddit.com/r/esports/.rss",
    fallbacks: ["https://www.reddit.com/r/esports/top/.rss?t=day"],
  },
  {
    source: "Google News · Gaming",
    sourceKey: "google_gaming",
    sourceIcon: "📡",
    platform: "web",
    platformLabel: "Web",
    domain: "releases",
    url: "https://news.google.com/rss/search?q=video+game+release+launch+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "Google News · Esports",
    sourceKey: "google_esports",
    sourceIcon: "⚡",
    platform: "web",
    platformLabel: "Web",
    domain: "esports",
    url: "https://news.google.com/rss/search?q=esports+tournament+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
];

export function classifyDomain(title = "", summary = "") {
  const t = `${title} ${summary}`.toLowerCase();
  if (/\b(esport|tournament|league of legends|valorant|cs2|dota|overwatch)\b/.test(t)) return "esports";
  if (/\b(release|launch|trailer|patch|update|dlc|sequel)\b/.test(t)) return "releases";
  if (/\b(indie|steam next fest|kickstarter|roguelike)\b/.test(t)) return "indie";
  if (/\b(gpu|console|steam deck|hardware|pc build|nvidia|playstation|xbox|switch)\b/.test(t)) return "hardware";
  return "culture";
}

export function computeHeat(publishedAt, rank) {
  const ageH = Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 3600000);
  const base = Math.max(500, 9000 - ageH * 380);
  return Math.round((base - rank * 120 + (rank % 3) * 47) * 10) / 10;
}

export function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
