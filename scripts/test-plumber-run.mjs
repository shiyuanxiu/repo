/**
 * Smoke tests for Pixel Plumber Run (games/plumber-run.html)
 * Run: node scripts/test-plumber-run.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "games/plumber-run.html");
const html = fs.readFileSync(htmlPath, "utf8");

const checks = [];
function ok(name, pass, detail = "") {
  checks.push({ name, pass, detail });
  console.log(`${pass ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

ok("HTML file exists", fs.existsSync(htmlPath));
ok("Has canvas", html.includes('id="c"'));
ok("Has embed postMessage", html.includes("jump-ready"));
ok("Has history keys", html.includes("vv-jump-best") && html.includes("vv-jump-history"));
ok("Has level flow", html.includes("levelComplete") && html.includes("nextLevel"));
ok("Has audio", html.includes("startBgm") && html.includes("Audio.coin"));

const scriptMatch = html.match(/<script>\s*([\s\S]*?)<\/script>/);
ok("Inline script present", !!scriptMatch);

if (scriptMatch) {
  try {
    new Function(scriptMatch[1]);
    ok("JS parses without syntax error", true);
  } catch (e) {
    ok("JS parses without syntax error", false, e.message);
  }
}

const TILE = 32;
const GROUND_Y = 360;

function generateLevel(lv) {
  const list = [];
  const len = 28 + lv * 10;
  const gapEvery = Math.max(5, 8 - Math.floor(lv / 3));
  for (let i = 0; i < len; i++) {
    const x = i * TILE;
    const isGap = lv >= 2 && i > 4 && i < len - 3 && i % gapEvery === 0;
    if (!isGap) list.push({ t: 3, x, y: GROUND_Y, w: TILE, h: TILE, alive: true });
  }
  const endX = len * TILE - 48;
  list.push({ t: 7, x: endX, y: GROUND_Y - 54, w: 28, h: 54, alive: true });
  return { list, width: len * TILE };
}

function collide(a, b) {
  return a.x - a.w / 2 <= b.x + b.w / 2 && a.x + a.w / 2 >= b.x - b.w / 2 &&
    a.y - a.h / 2 <= b.y + b.h / 2 && a.y + a.h / 2 >= b.y - b.h / 2;
}

for (const lv of [1, 3, 5]) {
  const { list, width } = generateLevel(lv);
  ok(`Level ${lv} has flag`, list.some((o) => o.t === 7));
  ok(`Level ${lv} has ground`, list.some((o) => o.t === 3));
  ok(`Level ${lv} width > 800`, width > 800, `width=${width}`);
}

const player = { x: 80, y: 328, w: 28, h: 32 };
const ground = { x: 96, y: GROUND_Y, w: TILE, h: TILE };
ok("Collision detects player on ground", collide(player, ground));

const registry = JSON.parse(fs.readFileSync(path.join(root, "assets/game-registry.json"), "utf8"));
ok("Registered in game-registry", registry.games.some((g) => g.id === "jump"));

const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");
ok("app.js initJumpFeed", appJs.includes("initJumpFeed"));
ok("index.html feed card", fs.readFileSync(path.join(root, "index.html"), "utf8").includes('data-game="jump"'));

const failed = checks.filter((c) => !c.pass);
console.log(`\n${checks.length - failed.length}/${checks.length} passed`);
if (failed.length) process.exit(1);
console.log("All tests passed.");
