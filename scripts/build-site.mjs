import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const node = process.execPath;

const scripts = [
  "fetch-financial-news.mjs",
  "fetch-hotspot-radar.mjs",
  "fetch-ai-tools-daily.mjs",
  "fetch-campus-life.mjs",
  "fetch-job-radar.mjs",
  "fetch-startup-wire.mjs",
  "fetch-food-campus.mjs",
  "fetch-creator-kit.mjs",
  "fetch-climate-brief.mjs",
  "fetch-wellness-wire.mjs",
  "fetch-gaming-pulse.mjs",
  "fetch-stock-pulse.mjs",
  "polish-radar-bundles.mjs",
  "build-og-svgs.mjs",
  "build-feed-meta.mjs",
  "build-guides.mjs",
  "build-category-hubs.mjs",
  "build-chunks.mjs",
  "generate-radar-css.mjs",
];

for (const script of scripts) {
  const r = spawnSync(node, [path.join(__dirname, script)], { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status || 1);
}
console.log("Site build complete.");
