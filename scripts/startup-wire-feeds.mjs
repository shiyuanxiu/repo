/** Startup Wire RSS config */

export const DAY_MS = 24 * 60 * 60 * 1000;

export const DOMAINS = [
  { id: "all", label: "All" },
  { id: "funding", label: "Funding" },
  { id: "product", label: "Product" },
  { id: "founders", label: "Founders" },
  { id: "tech", label: "Tech" },
  { id: "careers", label: "Careers" },
];

export const PLATFORMS = [
  { id: "all", label: "All" },
  { id: "reddit", label: "Reddit" },
  { id: "web", label: "Web" },
  { id: "hackernews", label: "HN" },
];

export const FEEDS = [
  {
    source: "Reddit · startups",
    sourceKey: "reddit_startups",
    sourceIcon: "🚀",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "founders",
    url: "https://www.reddit.com/r/startups/.rss",
    fallbacks: ["https://www.reddit.com/r/startups/top/.rss?t=day"],
  },
  {
    source: "Reddit · Entrepreneur",
    sourceKey: "reddit_entrepreneur",
    sourceIcon: "💡",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "founders",
    url: "https://www.reddit.com/r/Entrepreneur/.rss",
    fallbacks: ["https://www.reddit.com/r/Entrepreneur/top/.rss?t=day"],
  },
  {
    source: "Reddit · SideProject",
    sourceKey: "reddit_side",
    sourceIcon: "🛠",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "product",
    url: "https://www.reddit.com/r/SideProject/.rss",
    fallbacks: ["https://www.reddit.com/r/SideProject/top/.rss?t=day"],
  },
  {
    source: "Hacker News · Front",
    sourceKey: "hn_front",
    sourceIcon: "🟠",
    platform: "hackernews",
    platformLabel: "HN",
    domain: "tech",
    url: "https://hnrss.org/frontpage",
  },
  {
    source: "Google News · Startups",
    sourceKey: "google_startups",
    sourceIcon: "📰",
    platform: "web",
    platformLabel: "Web",
    domain: "funding",
    url: "https://news.google.com/rss/search?q=startup+funding+venture+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "Google News · YC",
    sourceKey: "google_yc",
    sourceIcon: "🟧",
    platform: "web",
    platformLabel: "Web",
    domain: "founders",
    url: "https://news.google.com/rss/search?q=y+combinator+startup+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
];

export function classifyDomain(title = "", summary = "") {
  const t = `${title} ${summary}`.toLowerCase();
  if (/\b(raised|funding|series [abc]|seed round|venture|investor|valuation)\b/.test(t)) return "funding";
  if (/\b(launch|product|mvp|beta|ship|feature|saas)\b/.test(t)) return "product";
  if (/\b(hiring|career|job|intern|recruit)\b/.test(t)) return "careers";
  if (/\b(ai|software|developer|api|open source|tech)\b/.test(t)) return "tech";
  if (/\b(founder|ceo|startup|bootstrapp|solo founder)\b/.test(t)) return "founders";
  return "founders";
}

export function computeHeat(publishedAt, rank) {
  const ageH = Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 3600000);
  const base = Math.max(500, 9000 - ageH * 380);
  return Math.round((base - rank * 120 + (rank % 3) * 47) * 10) / 10;
}

export function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
