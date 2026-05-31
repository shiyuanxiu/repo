import { buildRadarBundle } from "./learn-radar-fetch.mjs";
import { FEEDS, DOMAINS, PLATFORMS, DAY_MS, classifyDomain, computeHeat, dayKey, isUsStockStory } from "./stock-pulse-feeds.mjs";

buildRadarBundle({
  name: "Hot Stocks (US)",
  feeds: FEEDS,
  domains: DOMAINS,
  platforms: PLATFORMS,
  dayMs: DAY_MS,
  classifyDomain,
  computeHeat,
  dayKey,
  windowPrefix: "STOCK_PULSE",
  feedFileName: "stock-pulse-feeds.js",
  dataFileName: "stock-pulse.js",
  relevanceFilter: isUsStockStory,
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
