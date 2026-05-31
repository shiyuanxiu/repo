import { buildRadarBundle } from "./learn-radar-fetch.mjs";
import { FEEDS, DOMAINS, PLATFORMS, DAY_MS, classifyDomain, computeHeat, dayKey } from "./gaming-pulse-feeds.mjs";

buildRadarBundle({
  name: "Gaming Pulse",
  feeds: FEEDS,
  domains: DOMAINS,
  platforms: PLATFORMS,
  dayMs: DAY_MS,
  classifyDomain,
  computeHeat,
  dayKey,
  windowPrefix: "GAMING_PULSE",
  feedFileName: "gaming-pulse-feeds.js",
  dataFileName: "gaming-pulse.js",
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
