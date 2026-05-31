import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { parseRssXml } from "./financial-news-rss.mjs";
import {
  HOTSPOT_FEEDS,
  DAY_MS,
  classifyDomain,
  computeHeat,
  dayKey,
} from "./hotspot-radar-feeds.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "..", "assets");

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/rss+xml, application/xml, text/xml, application/atom+xml, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

function articleId(url) {
  return crypto.createHash("md5").update(url).digest("hex").slice(0, 12);
}

async function fetchFeedOnce(url, feed, perFeed) {
  const res = await fetch(url, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(28000),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  if (!text.includes("<item") && !text.includes("<entry")) throw new Error("not RSS");
  return parseRssXml(text, feed, perFeed, articleId);
}

async function fetchFeed(feed, perFeed = 10) {
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

function enrichItem(raw, feed, rank) {
  const domain = feed.domain || classifyDomain(raw.title, raw.summary);
  return {
    id: raw.id,
    title: raw.title,
    summary: raw.summary,
    body: raw.body || raw.summary,
    url: raw.url,
    source: raw.source || feed.source,
    sourceKey: feed.sourceKey,
    sourceIcon: feed.sourceIcon,
    platform: feed.platform,
    platformLabel: feed.platformLabel,
    domain,
    publishedAt: raw.publishedAt,
    heat: computeHeat(raw.publishedAt, rank),
    rank,
  };
}

function writeFeedsJs() {
  const js = `/** Hotspot Radar feeds — sync with scripts/hotspot-radar-feeds.mjs */
window.HOTSPOT_RADAR_FEEDS = ${JSON.stringify(HOTSPOT_FEEDS, null, 2)};
window.HOTSPOT_RADAR_DAY_MS = ${DAY_MS};
window.HOTSPOT_RADAR_STALE_MS = ${5 * 60 * 1000};
window.HOTSPOT_RADAR_DOMAINS = ${JSON.stringify(
    [
      { id: "all", label: "All" },
      { id: "ai", label: "AI" },
      { id: "tech", label: "Tech" },
      { id: "business", label: "Business" },
      { id: "social", label: "Social" },
    ],
    null,
    2,
  )};
window.HOTSPOT_RADAR_PLATFORMS = ${JSON.stringify(
    [
      { id: "all", label: "All" },
      { id: "web", label: "Web" },
      { id: "social", label: "Social" },
      { id: "reddit", label: "Reddit" },
      { id: "hackernews", label: "Hacker News" },
    ],
    null,
    2,
  )};
`;
  fs.writeFileSync(path.join(assetsDir, "hotspot-radar-feeds.js"), js);
}

async function main() {
  console.log(`Fetching Hotspot Radar (last 24h) — ${dayKey()}…`);
  const results = await Promise.allSettled(HOTSPOT_FEEDS.map((f) => fetchFeed(f, 10)));
  const all = [];
  const errors = [];

  results.forEach((r, i) => {
    const feed = HOTSPOT_FEEDS[i];
    if (r.status === "fulfilled" && r.value.length) {
      all.push(...r.value.map((item) => ({ ...item, _feed: feed })));
    } else {
      errors.push(`${feed.source}: ${r.reason?.message || "failed"}`);
    }
  });

  const cutoff = Date.now() - DAY_MS;
  const seen = new Set();
  const filtered = all
    .filter((a) => a.url && new Date(a.publishedAt).getTime() >= cutoff)
    .filter((a) => {
      if (seen.has(a.url)) return false;
      seen.add(a.url);
      return true;
    })
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 30);

  const hotspots = filtered.map((a, i) => enrichItem(a, a._feed, i + 1));

  const meta = {
    fetchedAt: new Date().toISOString(),
    dayKey: dayKey(),
    count: hotspots.length,
    sourceCount: new Set(hotspots.map((h) => h.sourceKey)).size,
  };

  writeFeedsJs();

  const dataJs = `/** Hotspot Radar bundled data — ${meta.fetchedAt} */
window.HOTSPOT_RADAR = ${JSON.stringify(hotspots, null, 2)};
window.HOTSPOT_RADAR_META = ${JSON.stringify(meta, null, 2)};
`;
  fs.writeFileSync(path.join(assetsDir, "hotspot-radar.js"), dataJs);

  console.log(`Wrote ${hotspots.length} hotspots from ${meta.sourceCount} sources`);
  if (errors.length) console.warn("Feed errors:", errors.join("; "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
