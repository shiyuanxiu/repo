import { buildRadarBundle } from "./learn-radar-fetch.mjs";
import { FEEDS, DOMAINS, PLATFORMS, DAY_MS, classifyDomain, computeHeat, dayKey } from "./climate-brief-feeds.mjs";

buildRadarBundle({
  name: "Climate Brief",
  feeds: FEEDS,
  domains: DOMAINS,
  platforms: PLATFORMS,
  dayMs: DAY_MS,
  classifyDomain,
  computeHeat,
  dayKey,
  windowPrefix: "CLIMATE_BRIEF",
  feedFileName: "climate-brief-feeds.js",
  dataFileName: "climate-brief.js",
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
