import { buildRadarBundle } from "./learn-radar-fetch.mjs";
import { FEEDS, DOMAINS, PLATFORMS, DAY_MS, classifyDomain, computeHeat, dayKey } from "./food-campus-feeds.mjs";

buildRadarBundle({
  name: "Food on Campus",
  feeds: FEEDS,
  domains: DOMAINS,
  platforms: PLATFORMS,
  dayMs: DAY_MS,
  classifyDomain,
  computeHeat,
  dayKey,
  windowPrefix: "FOOD_CAMPUS",
  feedFileName: "food-campus-feeds.js",
  dataFileName: "food-campus.js",
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
