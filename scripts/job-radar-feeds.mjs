/** Job & Internship Radar RSS config */

export const DAY_MS = 24 * 60 * 60 * 1000;

export const DOMAINS = [
  { id: "all", label: "All" },
  { id: "internship", label: "Internships" },
  { id: "tech", label: "Tech jobs" },
  { id: "layoffs", label: "Layoffs" },
  { id: "career", label: "Career" },
  { id: "remote", label: "Remote" },
];

export const PLATFORMS = [
  { id: "all", label: "All" },
  { id: "reddit", label: "Reddit" },
  { id: "web", label: "Web" },
  { id: "hackernews", label: "HN Jobs" },
];

export const FEEDS = [
  {
    source: "Reddit · Jobs",
    sourceKey: "reddit_jobs",
    sourceIcon: "💼",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "career",
    url: "https://www.reddit.com/r/jobs/.rss",
    fallbacks: ["https://www.reddit.com/r/jobs/top/.rss?t=day"],
  },
  {
    source: "Reddit · Internships",
    sourceKey: "reddit_intern",
    sourceIcon: "🎓",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "internship",
    url: "https://www.reddit.com/r/internships/.rss",
    fallbacks: ["https://www.reddit.com/r/internships/top/.rss?t=day"],
  },
  {
    source: "Reddit · cscareerquestions",
    sourceKey: "reddit_cs",
    sourceIcon: "💻",
    platform: "reddit",
    platformLabel: "Reddit",
    domain: "tech",
    url: "https://www.reddit.com/r/cscareerquestions/.rss",
    fallbacks: ["https://www.reddit.com/r/cscareerquestions/top/.rss?t=day"],
  },
  {
    source: "Hacker News · Jobs",
    sourceKey: "hn_jobs",
    sourceIcon: "🟠",
    platform: "hackernews",
    platformLabel: "HN Jobs",
    domain: "tech",
    url: "https://hnrss.org/jobs",
  },
  {
    source: "Google News · Hiring",
    sourceKey: "google_jobs",
    sourceIcon: "📰",
    platform: "web",
    platformLabel: "Web",
    domain: "career",
    url: "https://news.google.com/rss/search?q=jobs+hiring+internship+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "Google News · Layoffs",
    sourceKey: "google_layoffs",
    sourceIcon: "⚠",
    platform: "web",
    platformLabel: "Web",
    domain: "layoffs",
    url: "https://news.google.com/rss/search?q=layoffs+tech+jobs+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
];

export function classifyDomain(title = "", summary = "") {
  const t = `${title} ${summary}`.toLowerCase();
  if (/\b(intern|internship|co-op|summer+analyst)\b/.test(t)) return "internship";
  if (/\b(layoff|laid+off|downsiz|cut+\d+\s*jobs)\b/.test(t)) return "layoffs";
  if (/\b(remote|wfh|work.from.home)\b/.test(t)) return "remote";
  if (/\b(software|engineer|developer|tech|swe|coding|programmer)\b/.test(t)) return "tech";
  return "career";
}

export function computeHeat(publishedAt, rank) {
  const ageH = Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 3600000);
  const base = Math.max(500, 9000 - ageH * 380);
  return Math.round((base - rank * 120 + (rank % 3) * 47) * 10) / 10;
}

export function dayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
