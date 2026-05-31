import { buildRadarBundle } from "./learn-radar-fetch.mjs";
import { FEEDS, DOMAINS, PLATFORMS, DAY_MS, classifyDomain, computeHeat, dayKey } from "./campus-life-feeds.mjs";

buildRadarBundle({
  name: "Campus Life Feed",
  feeds: FEEDS,
  domains: DOMAINS,
  platforms: PLATFORMS,
  dayMs: DAY_MS,
  classifyDomain,
  computeHeat,
  dayKey,
  windowPrefix: "CAMPUS_LIFE",
  feedFileName: "campus-life-feeds.js",
  dataFileName: "campus-life.js",
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
