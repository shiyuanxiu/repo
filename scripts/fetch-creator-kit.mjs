import { buildRadarBundle } from "./learn-radar-fetch.mjs";
import { FEEDS, DOMAINS, PLATFORMS, DAY_MS, classifyDomain, computeHeat, dayKey } from "./creator-kit-feeds.mjs";

buildRadarBundle({
  name: "Creator Kit",
  feeds: FEEDS,
  domains: DOMAINS,
  platforms: PLATFORMS,
  dayMs: DAY_MS,
  classifyDomain,
  computeHeat,
  dayKey,
  windowPrefix: "CREATOR_KIT",
  feedFileName: "creator-kit-feeds.js",
  dataFileName: "creator-kit.js",
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
