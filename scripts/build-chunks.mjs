import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const bundleDir = path.join(root, "assets", "bundle");

const CHUNKS = {
  "games-core.js": ["assets/feed-meta.js"],
  "learn-core.js": [
    "assets/learn-feed-sync.js",
    "assets/financial-news-rss.js",
    "assets/learn-rss-proxy.js",
    "assets/learn-radar-snippet.js",
    "assets/learn-radar-hub.js",
    "assets/learn-picks.js",
  ],
};

fs.mkdirSync(bundleDir, { recursive: true });

for (const [outName, files] of Object.entries(CHUNKS)) {
  const parts = files.map((rel) => {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) throw new Error(`Missing chunk source: ${rel}`);
    return `/* === ${rel} === */\n${fs.readFileSync(abs, "utf8")}`;
  });
  const out = path.join(bundleDir, outName);
  fs.writeFileSync(out, parts.join("\n\n"));
  console.log(`Wrote ${outName} (${files.length} files)`);
}
