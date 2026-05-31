import { buildRadarBundle } from "./learn-radar-fetch.mjs";
import { FEEDS, DOMAINS, PLATFORMS, DAY_MS, classifyDomain, computeHeat, dayKey } from "./wellness-wire-feeds.mjs";

buildRadarBundle({
  name: "Wellness Wire",
  feeds: FEEDS,
  domains: DOMAINS,
  platforms: PLATFORMS,
  dayMs: DAY_MS,
  classifyDomain,
  computeHeat,
  dayKey,
  windowPrefix: "WELLNESS_WIRE",
  feedFileName: "wellness-wire-feeds.js",
  dataFileName: "wellness-wire.js",
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
