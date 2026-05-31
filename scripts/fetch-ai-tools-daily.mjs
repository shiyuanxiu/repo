import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseRssXml } from "./financial-news-rss.mjs";
import { CATALOG, CATEGORIES, dayKey, pickDailyIds } from "./ai-tools-catalog.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "..", "assets");

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/rss+xml, application/xml, text/xml, */*",
};

const NEWS_FEEDS = [
  {
    source: "Google News · AI Tools",
    url: "https://news.google.com/rss/search?q=AI+tool+OR+ChatGPT+OR+Claude+when:1d&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "Hacker News",
    url: "https://hnrss.org/newest?q=AI+OR+GPT+OR+LLM",
  },
];

function articleId(url) {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) >>> 0;
  return h.toString(16).slice(0, 12);
}

async function fetchNews() {
  const items = [];
  for (const feed of NEWS_FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: FETCH_HEADERS,
        signal: AbortSignal.timeout(25000),
      });
      if (!res.ok) continue;
      const text = await res.text();
      const parsed = parseRssXml(
        text,
        { source: feed.source, sourceKey: "news", sourceIcon: "📰", topic: "ai" },
        5,
        articleId,
      );
      items.push(...parsed);
    } catch (_) {}
  }
  const seen = new Set();
  return items
    .filter((a) => {
      if (!a.url || seen.has(a.url)) return false;
      seen.add(a.url);
      return true;
    })
    .slice(0, 8)
    .map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      url: a.url,
      source: a.source,
      publishedAt: a.publishedAt,
    }));
}

async function main() {
  const key = dayKey();
  console.log(`Building AI Tools Daily — ${key}…`);

  const daily = pickDailyIds(CATALOG, key);
  const news = await fetchNews().catch(() => []);

  const meta = {
    fetchedAt: new Date().toISOString(),
    dayKey: key,
    toolCount: CATALOG.length,
    newsCount: news.length,
  };

  const dataJs = `/** AI Tools catalog — generated from scripts/ai-tools-catalog.mjs */
window.AI_TOOLS_CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};
window.AI_TOOLS_CATALOG = ${JSON.stringify(CATALOG, null, 2)};
`;

  const dailyJs = `/** AI Tools Daily bundle — ${meta.fetchedAt} */
window.AI_TOOLS_DAILY = ${JSON.stringify({ ...daily, news }, null, 2)};
window.AI_TOOLS_DAILY_META = ${JSON.stringify(meta, null, 2)};
window.AI_TOOLS_STALE_MS = ${5 * 60 * 1000};
`;

  fs.writeFileSync(path.join(assetsDir, "ai-tools-app-data.js"), dataJs);
  fs.writeFileSync(path.join(assetsDir, "ai-tools-daily.js"), dailyJs);

  console.log(`Featured: ${daily.featuredId} · ${CATALOG.length} tools · ${news.length} news items`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
