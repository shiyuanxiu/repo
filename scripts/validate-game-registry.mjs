#!/usr/bin/env node
/** Validate assets/game-registry.json — unique ids, gistKeys, slugs */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const reg = JSON.parse(readFileSync(join(root, "assets/game-registry.json"), "utf8"));
const games = reg.games || [];

function dupes(arr, label) {
  const seen = new Map();
  const d = [];
  for (const v of arr) {
    if (seen.has(v)) d.push(v);
    else seen.set(v, true);
  }
  if (d.length) {
    console.error(`Duplicate ${label}:`, [...new Set(d)].join(", "));
    process.exit(1);
  }
}

dupes(games.map((g) => g.id), "id");
dupes(games.map((g) => g.gistKey), "gistKey");
dupes(games.map((g) => g.slug), "slug");

const html = readFileSync(join(root, "index.html"), "utf8");
const idsInHtml = new Set();
for (const m of html.matchAll(/data-game="([^"]+)"/g)) idsInHtml.add(m[1]);

const regIds = new Set(games.map((g) => g.id));
const missingInReg = [...idsInHtml].filter((id) => !regIds.has(id));
const missingInHtml = games.map((g) => g.id).filter((id) => !idsInHtml.has(id));

if (missingInReg.length) {
  console.warn("WARN index.html data-game not in registry:", missingInReg.join(", "));
}
if (missingInHtml.length) {
  console.warn("WARN registry ids missing data-game in index.html:", missingInHtml.join(", "));
}

console.log(`OK ${games.length} games — ids, gistKeys, slugs all unique`);
