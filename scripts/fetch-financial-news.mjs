import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import {
  FEEDS,
  WEEK_MS,
  parseRssXml,
  sourceListFromFeeds,
  homepagesFromFeeds,
} from "./financial-news-rss.mjs";
import { fetchRssText } from "./rss-proxy.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const assetsDir = path.join(root, "assets");

function articleId(url) {
  return crypto.createHash("md5").update(url).digest("hex").slice(0, 12);
}

async function fetchFeedOnce(url, feed, perFeed) {
  const text = await fetchRssText(url);
  return parseRssXml(text, feed, perFeed, articleId);
}

async function fetchFeed(feed, perFeed = 8) {
  const urls = [feed.url, ...(feed.fallbacks || [])];
  let lastErr;
  for (const url of urls) {
    try {
      const items = await fetchFeedOnce(url, feed, perFeed);
      if (items.length) return items;
      lastErr = new Error("empty feed");
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("failed");
}

function weekKey(d = new Date()) {
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function writeFeedsJs() {
  const feedsJs = `/** RSS feed config — keep in sync with scripts/financial-news-rss.mjs */
window.FINANCIAL_NEWS_FEEDS = ${JSON.stringify(FEEDS, null, 2)};
window.FINANCIAL_NEWS_WEEK_MS = ${WEEK_MS};
window.FINANCIAL_NEWS_STALE_MS = ${5 * 60 * 1000};
`;
  fs.writeFileSync(path.join(assetsDir, "financial-news-feeds.js"), feedsJs);
}

async function main() {
  console.log(`Fetching financial news (last 7 days) — week ${weekKey()}…`);
  const results = await Promise.allSettled(FEEDS.map((f) => fetchFeed(f, 8)));
  const all = [];
  const errors = [];
  const okSources = new Set();

  results.forEach((r, i) => {
    const feed = FEEDS[i];
    if (r.status === "fulfilled" && r.value.length) {
      all.push(...r.value);
      okSources.add(feed.sourceKey);
      console.log(`  ✓ ${feed.source}: ${r.value.length} (this week)`);
    } else {
      const msg = r.status === "rejected" ? r.reason?.message : "empty";
      errors.push({ source: feed.source, error: msg || "failed" });
      console.warn(`  ✗ ${feed.source}: ${msg || "failed"}`);
    }
  });

  const seen = new Set();
  const deduped = all
    .filter((a) => {
      if (seen.has(a.url)) return false;
      seen.add(a.url);
      return true;
    })
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 80)
    .map((a, i) => ({ ...a, featured: i < 10 }));

  const now = new Date().toISOString();
  const meta = {
    fetchedAt: now,
    weekKey: weekKey(),
    weekMs: WEEK_MS,
    staleMs: 5 * 60 * 1000,
    count: deduped.length,
    sourceCount: okSources.size,
    errors,
  };

  fs.writeFileSync(path.join(assetsDir, "financial-news.json"), JSON.stringify({ ...meta, articles: deduped }, null, 2));

  const sources = sourceListFromFeeds(FEEDS);
  const js = `window.FINANCIAL_NEWS = ${JSON.stringify(deduped)};
window.FINANCIAL_NEWS_META = ${JSON.stringify(meta)};
window.FINANCIAL_NEWS_TOPICS = [
  { id: "all", label: "All" },
  { id: "business", label: "Business" },
  { id: "finance", label: "Finance" },
  { id: "tech", label: "Tech" }
];
window.FINANCIAL_NEWS_SOURCES = ${JSON.stringify(sources, null, 2)};
window.FINANCIAL_NEWS_HOMEPAGES = ${JSON.stringify(homepagesFromFeeds(FEEDS))};
`;

  fs.writeFileSync(path.join(assetsDir, "financial-news.js"), js);
  writeFeedsJs();
  console.log(`\nWrote ${deduped.length} articles from ${okSources.size} sources → assets/financial-news.js`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
