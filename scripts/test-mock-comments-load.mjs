/**
 * Verify mock comment files load and merge logic.
 * Run: node scripts/test-mock-comments-load.mjs
 * Optional: BASE=http://127.0.0.1:8765 node scripts/test-mock-comments-load.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MOCK_DIR = join(ROOT, "assets", "mock-comments");
const BASE = process.env.BASE || "";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`✓ ${name}`);
}

test("manifest lists 18 games", () => {
  const manifest = JSON.parse(readFileSync(join(MOCK_DIR, "manifest.json"), "utf8"));
  assert(Object.keys(manifest.files).length === 18, "18 files");
  assert(manifest.feeds.recommend.gameIds.length === 8, "8 for you");
  assert(manifest.feeds.games.gameIds.length === 10, "10 games");
});

test("each json gameId matches filename", () => {
  const files = readdirSync(MOCK_DIR).filter((f) => f.endsWith(".json") && f !== "manifest.json");
  assert(files.length === 18, "18 json files");
  for (const file of files) {
    const id = file.replace(".json", "");
    const doc = JSON.parse(readFileSync(join(MOCK_DIR, file), "utf8"));
    assert(doc.gameId === id, `${file} gameId mismatch`);
    assert(doc.comments.length >= 1, `${file} has comments`);
    assert(doc.totalLike >= 10 && doc.totalLike <= 100, `${file} totalLike range`);
  }
});

async function httpCheck() {
  if (!BASE) {
    console.log("○ skip HTTP (set BASE=http://127.0.0.1:8765 to test dev-server)");
    return;
  }
  const manifestRes = await fetch(`${BASE}/assets/mock-comments/manifest.json`);
  assert(manifestRes.ok, "manifest HTTP 200");
  const manifest = await manifestRes.json();
  const chickRes = await fetch(`${BASE}/assets/mock-comments/chick.json`);
  assert(chickRes.ok, "chick.json HTTP 200");
  const chick = await chickRes.json();
  assert(chick.gameId === "chick", "chick gameId");
  assert(chick.comments.length > 0, "chick has comments");
  console.log(`✓ HTTP mock files served from ${BASE}`);
  passed++;
}

await httpCheck();
console.log(`\n${passed} tests passed`);
