import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { parseRssXml } from "./financial-news-rss.mjs";
import { polishItem } from "./learn-radar-snippet.mjs";
import { fetchRssText } from "./rss-proxy.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "..", "assets");

export function articleId(url) {
  return crypto.createHash("md5").update(url).digest("hex").slice(0, 12);
}

async function fetchFeedOnce(url, feed, perFeed) {
  const text = await fetchRssText(url);
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

export async function buildRadarBundle({
  name,
  feeds,
  domains,
  platforms,
  dayMs,
  classifyDomain,
  computeHeat,
  dayKey,
  windowPrefix,
  feedFileName,
  dataFileName,
  relevanceFilter,
}) {
  console.log(`Fetching ${name} (last 24h) — ${dayKey()}…`);
  const results = await Promise.allSettled(feeds.map((f) => fetchFeed(f, 10)));
  const all = [];
  const errors = [];

  results.forEach((r, i) => {
    const feed = feeds[i];
    if (r.status === "fulfilled" && r.value.length) {
      all.push(...r.value.map((item) => ({ ...item, _feed: feed })));
    } else {
      errors.push(`${feed.source}: ${r.reason?.message || "failed"}`);
    }
  });

  const cutoff = Date.now() - dayMs;
  const seen = new Set();
  let filtered = all
    .filter((a) => a.url && new Date(a.publishedAt).getTime() >= cutoff)
    .filter((a) => !relevanceFilter || relevanceFilter(a.title, a.summary))
    .filter((a) => {
      if (seen.has(a.url)) return false;
      seen.add(a.url);
      return true;
    })
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 30);

  if (!filtered.length) {
    seen.clear();
    filtered = all
      .filter((a) => a.url)
      .filter((a) => !relevanceFilter || relevanceFilter(a.title, a.summary))
      .filter((a) => {
        if (seen.has(a.url)) return false;
        seen.add(a.url);
        return true;
      })
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 30);
  }

  const items = filtered.map((a, i) => {
    const feed = a._feed;
    const domain = feed.domain || classifyDomain(a.title, a.summary);
    return polishItem({
      id: a.id,
      title: a.title,
      summary: a.summary,
      body: a.body || a.summary,
      url: a.url,
      source: a.source || feed.source,
      sourceKey: feed.sourceKey,
      sourceIcon: feed.sourceIcon,
      platform: feed.platform,
      platformLabel: feed.platformLabel,
      domain,
      publishedAt: a.publishedAt,
      heat: computeHeat(a.publishedAt, i + 1),
      rank: i + 1,
    });
  });

  const sourceCount = new Set(items.map((h) => h.sourceKey)).size;
  const live = items.length >= 5 && sourceCount >= 2 && errors.length < feeds.length;
  const meta = {
    fetchedAt: new Date().toISOString(),
    dayKey: dayKey(),
    count: items.length,
    sourceCount,
    live,
    offline: !live,
    bundle: items.length > 0 && (errors.length > 0 || !live),
  };

  const feedsJs = `/** ${name} feeds */
window.${windowPrefix}_FEEDS = ${JSON.stringify(feeds, null, 2)};
window.${windowPrefix}_DAY_MS = ${dayMs};
window.${windowPrefix}_STALE_MS = ${5 * 60 * 1000};
window.${windowPrefix}_DOMAINS = ${JSON.stringify(domains, null, 2)};
window.${windowPrefix}_PLATFORMS = ${JSON.stringify(platforms, null, 2)};
`;
  fs.writeFileSync(path.join(assetsDir, feedFileName), feedsJs);

  const dataPath = path.join(assetsDir, dataFileName);
  if (!items.length && fs.existsSync(dataPath)) {
    try {
      const prev = fs.readFileSync(dataPath, "utf8");
      const prevMatch = prev.match(new RegExp(`window\\.${windowPrefix} = (\\[[\\s\\S]*?\\]);`));
      const metaMatch = prev.match(new RegExp(`window\\.${windowPrefix}_META = (\\{[\\s\\S]*?\\});`));
      if (prevMatch) {
        const prevItems = JSON.parse(prevMatch[1]);
        if (prevItems.length) {
          const prevMeta = metaMatch ? JSON.parse(metaMatch[1]) : {};
          const patched = {
            ...prevMeta,
            offline: true,
            bundle: true,
            live: false,
            count: prevItems.length,
            fetchedAt: prevMeta.fetchedAt || new Date().toISOString(),
          };
          const dataJs = `/** ${name} bundled data — offline bundle retained ${patched.fetchedAt} */
window.${windowPrefix} = ${JSON.stringify(prevItems, null, 2)};
window.${windowPrefix}_META = ${JSON.stringify(patched, null, 2)};
`;
          fs.writeFileSync(dataPath, dataJs);
          console.warn(`${name}: fetch empty — kept ${prevItems.length} offline bundle items`);
          return;
        }
      }
    } catch (_) {}
  }

  const dataJs = `/** ${name} bundled data — ${meta.fetchedAt} */
window.${windowPrefix} = ${JSON.stringify(items, null, 2)};
window.${windowPrefix}_META = ${JSON.stringify(meta, null, 2)};
`;
  fs.writeFileSync(dataPath, dataJs);

  console.log(`${name}: ${items.length} items from ${meta.sourceCount} sources`);
  if (errors.length) console.warn(`${name} feed errors:`, errors.join("; "));
}
