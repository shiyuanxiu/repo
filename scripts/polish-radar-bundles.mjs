/** Re-polish bundled radar JS files in assets/ */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { polishItem } from "./learn-radar-snippet.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(__dirname, "..", "assets");

const files = fs.readdirSync(assets).filter((f) => {
  if (!f.endsWith(".js")) return false;
  return (
    f.includes("radar") ||
    f.includes("pulse") ||
    f.includes("wire") ||
    f.includes("brief") ||
    f.includes("campus-life.js") ||
    f.includes("food-campus.js") ||
    f.includes("creator-kit.js")
  );
});

for (const file of files) {
  if (file.endsWith("-feeds.js") || file.endsWith("-hub.js")) continue;
  const full = path.join(assets, file);
  const src = fs.readFileSync(full, "utf8");
  const m = src.match(/^(\/\*\*[\s\S]*?\*\/\nwindow\.(\w+) = )(\[[\s\S]*?\]);(\nwindow\.\2_META = [\s\S]*)?$/);
  if (!m) continue;
  const key = m[2];
  let items;
  try {
    items = JSON.parse(m[3]);
  } catch {
    continue;
  }
  if (!Array.isArray(items)) continue;
  const polished = items.map((item) => polishItem(item));
  let meta = {};
  if (m[4]) {
    const metaMatch = m[4].match(/window\.\w+_META = (\{[\s\S]*\});/);
    if (metaMatch) meta = JSON.parse(metaMatch[1]);
  }
  meta.count = polished.length;
  const out =
    m[1] +
    JSON.stringify(polished, null, 2) +
    `;\nwindow.${key}_META = ${JSON.stringify(meta, null, 2)};\n`;
  fs.writeFileSync(full, out);
  console.log(`Polished ${file} (${polished.length} items)`);
}

console.log("Done.");
