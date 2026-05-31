import { buildRadarBundle } from "./learn-radar-fetch.mjs";
import { FEEDS, DOMAINS, PLATFORMS, DAY_MS, classifyDomain, computeHeat, dayKey } from "./job-radar-feeds.mjs";

buildRadarBundle({
  name: "Job Radar",
  feeds: FEEDS,
  domains: DOMAINS,
  platforms: PLATFORMS,
  dayMs: DAY_MS,
  classifyDomain,
  computeHeat,
  dayKey,
  windowPrefix: "JOB_RADAR",
  feedFileName: "job-radar-feeds.js",
  dataFileName: "job-radar.js",
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
