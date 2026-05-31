import { buildRadarBundle } from "./learn-radar-fetch.mjs";
import { FEEDS, DOMAINS, PLATFORMS, DAY_MS, classifyDomain, computeHeat, dayKey } from "./startup-wire-feeds.mjs";

buildRadarBundle({
  name: "Startup Wire",
  feeds: FEEDS,
  domains: DOMAINS,
  platforms: PLATFORMS,
  dayMs: DAY_MS,
  classifyDomain,
  computeHeat,
  dayKey,
  windowPrefix: "STARTUP_WIRE",
  feedFileName: "startup-wire-feeds.js",
  dataFileName: "startup-wire.js",
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
