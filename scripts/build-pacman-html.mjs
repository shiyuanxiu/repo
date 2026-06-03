import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const ref = path.join(root, ".tmp-pacman-ref");
const out = path.join(root, "games", "pacman.html");

const gameJs = fs.readFileSync(path.join(ref, "static/script/game.js"), "utf8");
let indexJs = fs.readFileSync(path.join(ref, "static/script/index.js"), "utf8");

indexJs = indexJs.replace(
  /_LIFE = 5,[\s\S]*?_SCORE = 0;/,
  `_LIFE = 3,
\t_SCORE = 0,
\t_GHOST_CHAIN = 0,
\t_LIFE_BONUS_AT = 0,
\t_SOUND = false,
\t_FONT_FAMILY = '"Courier New", Courier, monospace';`,
);

indexJs = indexJs.replace(/PressStart2P/g, "' + _FONT_FAMILY + '");

indexJs = indexJs.replace(
  /if\(item\.status==3\)\{\s*item\.status = 4;\s*_SCORE \+= 10;/,
  `if(item.status==3){
\t\t\t\t\t\t\t\t\titem.status = 4;
\t\t\t\t\t\t\t\t\t_GHOST_CHAIN = Math.min(_GHOST_CHAIN + 1, 4);
\t\t\t\t\t\t\t\t\t_SCORE += 200 * Math.pow(2, _GHOST_CHAIN - 1);
\t\t\t\t\t\t\t\t\tplayTone(880, 0.08);`,
);

indexJs = indexJs.replace(
  /if\(!beans\.get\(this\.coord\.x,this\.coord\.y\)\)\{\s*\/\/吃豆\s*_SCORE\+\+;\s*beans\.set\(this\.coord\.x,this\.coord\.y,1\);\s*if\(config\['goods'\]\[this\.coord\.x\+','\+this\.coord\.y\]\)\{/,
  `if(!beans.get(this.coord.x,this.coord.y)){
\t\t\t\t\t\tvar isPower = config['goods'][this.coord.x+','+this.coord.y];
\t\t\t\t\t\t_SCORE += isPower ? 50 : 10;
\t\t\t\t\t\tbeans.set(this.coord.x,this.coord.y,1);
\t\t\t\t\t\tawardLifeBonus();
\t\t\t\t\t\tplayTone(isPower ? 520 : 320, isPower ? 0.12 : 0.04);
\t\t\t\t\t\tif(isPower){
\t\t\t\t\t\t\t_GHOST_CHAIN = 0;
\t\t\t\t\t\t\titems.forEach(function(item){`,
);

indexJs = indexJs.replace(
  /if\(config\['goods'\]\[this\.coord\.x\+','\+this\.coord\.y\]\)\{\s*\/\/吃到能量豆\s*items\.forEach/,
  `if(isPower){
\t\t\t\t\t\t\t_GHOST_CHAIN = 0;
\t\t\t\t\t\t\titems.forEach`,
);

indexJs = indexJs.replace(
  /type:2,\s*frames:10,\s*speed:1,/,
  "type:2,\n\t\t\t\t\tframes:Math.max(5, 10 - index),\n\t\t\t\t\tspeed:1 + Math.min(index * 0.18, 2.5),",
);

indexJs = indexJs.replace(
  /type:1,\s*location:map,\s*coord:\{x:13\.5,y:23\},\s*orientation:2,\s*speed:2,\s*frames:10,/,
  "type:1,\n\t\t\t\tlocation:map,\n\t\t\t\tcoord:{x:13.5,y:23},\n\t\t\t\torientation:2,\n\t\t\t\tspeed:2 + Math.min(index * 0.1, 1.2),\n\t\t\t\tframes:10,",
);

indexJs = indexJs.replace(
  /var max = Math\.min\(_LIFE-1,5\);/,
  "var max = Math.min(_LIFE, 5);",
);
indexJs = indexJs.replace(
  /context\.fillText\(\(_LIFE-1\),this\.x\+10,this\.y\+26\);/,
  "context.fillText(_LIFE, this.x + 10, this.y + 26);",
);

indexJs = indexJs.replace(
  /context\.fillText\('FINAL SCORE: '\+\(_SCORE\+50\*Math\.max\(_LIFE-1,0\)\),this\.x,this\.y\);/,
  "context.fillText('FINAL SCORE: '+_SCORE, this.x, this.y);",
);

indexJs = indexJs.replace(
  /_SCORE = 0;\s*_LIFE = 5;/,
  "_SCORE = 0;\n\t\t\t\t_LIFE = 3;\n\t\t\t\t_LIFE_BONUS_AT = 0;\n\t\t\t\t_GHOST_CHAIN = 0;",
);

indexJs = indexJs.replace(
  /const myFont = new FontFace[\s\S]*?game\.init\(\);\s*\}\);/,
  `function awardLifeBonus() {
\t\tvar tier = Math.floor(_SCORE / 10000);
\t\tif (tier > _LIFE_BONUS_AT) {
\t\t\t_LIFE += tier - _LIFE_BONUS_AT;
\t\t\t_LIFE_BONUS_AT = tier;
\t\t\tplayTone(660, 0.15);
\t\t}
\t}

\tvar _audioCtx = null;
\tfunction playTone(freq, dur) {
\t\tif (!_SOUND) return;
\t\ttry {
\t\t\tif (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
\t\t\tif (_audioCtx.state === 'suspended') _audioCtx.resume();
\t\t\tvar o = _audioCtx.createOscillator();
\t\t\tvar g = _audioCtx.createGain();
\t\t\to.type = 'square';
\t\t\to.frequency.value = freq;
\t\t\tg.gain.value = 0.04;
\t\t\tg.gain.exponentialRampToValueAtTime(0.001, _audioCtx.currentTime + dur);
\t\t\to.connect(g);
\t\t\tg.connect(_audioCtx.destination);
\t\t\to.start();
\t\t\to.stop(_audioCtx.currentTime + dur);
\t\t} catch (_) {}
\t}

\tfunction resetGame() {
\t\t_SCORE = 0;
\t\t_LIFE = 3;
\t\t_LIFE_BONUS_AT = 0;
\t\t_GHOST_CHAIN = 0;
\t\tgame.setStage(1);
\t}

\tfunction bindGlobalKeys(stage) {
\t\tstage.bind('keydown', function(e) {
\t\t\tvar k = e.key ? e.key.toLowerCase() : '';
\t\t\tif (k === 'n') { resetGame(); return; }
\t\t\tif (k === 'p') { this.status = this.status === 2 ? 1 : 2; return; }
\t\t\tif (k === 's') { _SOUND = !_SOUND; return; }
\t\t});
\t}

\tgame.getStages().forEach(function(st, i) {
\t\tif (i > 0 && i < game.getStages().length - 1) bindGlobalKeys(st);
\t});

\tgame.init();
`,
);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="description" content="Classic Pac-Man arcade — eat pellets, power up, dodge ghosts. 12 mazes, wrap tunnels, keyboard controls.">
  <meta name="keywords" content="Pac-Man,Pacman,arcade,maze,retro,HTML5 game,classic,Miniverse">
  <title>Pac-Man Classic Arcade | Miniverse</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%; height: 100%; min-height: 100%; min-height: -webkit-fill-available;
      overflow: hidden; background: #000;
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
      touch-action: manipulation; user-select: none;
    }
    html.embed-root, body.embed { height: 100%; }
    body.embed:not(.playing) { touch-action: pan-y; }
    body.embed.playing { touch-action: none; }
    #wrap {
      position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
      padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    }
    canvas {
      display: block; max-width: 100%; max-height: 100%;
      width: auto; height: auto; image-rendering: pixelated;
      border-radius: 12px; background: #000;
    }
    #hint {
      position: fixed; left: 0; right: 0; bottom: max(8px, env(safe-area-inset-bottom));
      text-align: center; pointer-events: none; z-index: 5;
      font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.45);
      letter-spacing: 0.02em; padding: 0 12px;
    }
    body.embed #hint { font-size: 10px; }
    body.embed.playing #hint { opacity: 0.35; }
  </style>
</head>
<body>
  <div id="wrap"><canvas id="canvas" width="960" height="640">Canvas required</canvas></div>
  <p id="hint">Arrows move · N new · P pause · S sound</p>
  <script>
${gameJs.replace(/^\/\*[\s\S]*?\*\/\s*/m, "").replace(/^'use strict';\s*/m, "'use strict';\n")}
  <\/script>
  <script>
${indexJs}
  <\/script>
  <script>
(function () {
  var EMBED = new URLSearchParams(location.search).get("embed") === "1";
  var canvas = document.getElementById("canvas");
  function fitCanvas() {
    if (!canvas) return;
    var r = canvas.getBoundingClientRect();
    canvas.style.width = Math.min(window.innerWidth - 8, 960) + "px";
    canvas.style.height = "auto";
  }
  fitCanvas();
  window.addEventListener("resize", fitCanvas);

  if (EMBED) {
    document.documentElement.classList.add("embed-root");
    document.body.classList.add("embed");
    window.parent.postMessage({ type: "pacman-ready" }, "*");
  }

  function setPlaying(on) {
    document.body.classList.toggle("playing", !!on);
    if (EMBED) window.parent.postMessage({ type: "pacman-interact", active: !!on }, "*");
  }

  window.addEventListener("keydown", function () { setPlaying(true); }, { once: true });
  document.getElementById("wrap")?.addEventListener("pointerdown", function () { setPlaying(true); });

  window.__setFeedSound = function (enabled) {
    if (typeof _SOUND !== "undefined") _SOUND = !!enabled;
  };
  window.__unlockGameAudio = function () { window.__setFeedSound(true); };

  window.addEventListener("message", function (e) {
    if (e.data?.type === "pacman-sound") _SOUND = !!e.data.enabled;
    if (e.data?.type === "pacman-resize") fitCanvas();
  });
})();
  <\/script>
</body>
</html>
`;

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log("Wrote", out, "(" + Math.round(html.length / 1024) + " KB)");
