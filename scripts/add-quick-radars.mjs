import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { radarArticleHtml } from "./learn-feed-html.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const RADARS = [
  {
    prefix: "gm",
    learnSection: "gaming",
    hubId: "gamingHubItem",
    logo: "🎮",
    titleA: "Gaming",
    titleB: "Pulse",
    subtitle: "Releases · esports · indie · hardware",
    listTitle: "Today's Gaming",
    feedTitle: "Gaming Pulse",
    feedDesc: "Reddit · Google News · last 24h",
  },
  {
    prefix: "wl",
    learnSection: "wellness",
    hubId: "wellnessHubItem",
    logo: "🌿",
    titleA: "Wellness",
    titleB: "Wire",
    subtitle: "Mental · fitness · sleep · nutrition",
    listTitle: "Today's Wellness",
    feedTitle: "Wellness Wire",
    feedDesc: "Reddit · wellness news · last 24h",
  },
  {
    prefix: "sw",
    learnSection: "startup",
    hubId: "startupHubItem",
    logo: "🚀",
    titleA: "Startup",
    titleB: "Wire",
    subtitle: "Funding · product · founders · HN",
    listTitle: "Today's Startup News",
    feedTitle: "Startup Wire",
    feedDesc: "Reddit · HN · startup news",
  },
];

const htmlPath = path.join(root, "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

if (!html.includes('id="gamingHubItem"')) {
  const block =
    "\n\n      <!-- Learn 7–9: Gaming · Wellness · Startup -->\n" +
    RADARS.map((r) => radarArticleHtml(r)).join("\n\n") +
    "\n";

  const needle =
    '</footer>\n      </article>\n\n\n      <article class="feed-item knowledge-feed-item" data-feed="knowledge" data-learn-section="finance"';
  const pos = html.indexOf(needle);
  if (pos < 0) {
    const alt =
      '</footer>\n      </article>\n\n      <article class="feed-item knowledge-feed-item" data-feed="knowledge" data-learn-section="finance"';
    const pos2 = html.indexOf(alt);
    if (pos2 < 0) throw new Error("Insert marker before finance not found");
    html = html.slice(0, pos2 + "</footer>\n      </article>".length) + block + html.slice(pos2 + "</footer>\n      </article>".length);
  } else {
    html = html.slice(0, pos + "</footer>\n      </article>".length) + block + html.slice(pos + "</footer>\n      </article>".length);
  }

  html = html.replace(
    /Swipe ↕ thirteen mini-apps in one feed/,
    "Swipe ↕ sixteen mini-apps in one feed",
  );
  html = html.replace(
    /📡 Radar · 🤖 AI Tools · 🌿 Mind · 🏫 Campus · 💕 Dating · 💼 Jobs · \+ Finance/,
    "📡 Radar · 🤖 AI · 🌿 Mind · 🏫 Campus · 💕 Dating · 💼 Jobs · 🎮 Gaming · 🌿 Wellness · 🚀 Startup · + Finance",
  );
  html = html.replace(
    /<!-- Learn feed: 1 Radar → 2 AI Tools → 3 Mind → 4 Campus → 5 Dating → 6 Jobs → … -->/,
    "<!-- Learn feed: 1 Radar → … → 6 Jobs → 7 Gaming → 8 Wellness → 9 Startup → … -->",
  );

  const scriptBlock = `  <script src="assets/gaming-pulse-feeds.js"></script>
  <script src="assets/gaming-pulse.js"></script>
  <script src="assets/gaming-pulse-hub.js"></script>
  <script src="assets/wellness-wire-feeds.js"></script>
  <script src="assets/wellness-wire.js"></script>
  <script src="assets/wellness-wire-hub.js"></script>
  <script src="assets/startup-wire-feeds.js"></script>
  <script src="assets/startup-wire.js"></script>
  <script src="assets/startup-wire-hub.js"></script>
`;
  html = html.replace(
    "  <script src=\"assets/job-radar-hub.js\"></script>\n  <script src=\"assets/feed-meta.js\"></script>",
    `  <script src="assets/job-radar-hub.js"></script>\n${scriptBlock}  <script src="assets/feed-meta.js"></script>`,
  );

  fs.writeFileSync(htmlPath, html);
  console.log("Inserted Gaming Pulse, Wellness Wire, Startup Wire into index.html");
} else {
  console.log("Quick radars already in index.html — skip HTML");
}

const appPath = path.join(root, "app.js");
let app = fs.readFileSync(appPath, "utf8");
const learnPatch =
  'jobs: "jobRadarHubItem", gaming: "gamingHubItem", wellness: "wellnessHubItem", startup: "startupHubItem"';
if (!app.includes("gamingHubItem")) {
  app = app.replace('jobs: "jobRadarHubItem" }', `${learnPatch} }`);
  fs.writeFileSync(appPath, app);
  console.log("Updated app.js learnIds");
}

const cssPath = path.join(root, "styles.css");
let css = fs.readFileSync(cssPath, "utf8");
const selectorNeedle = ".knowledge-feed-item .jr-app,";
const selectorAdd = ".knowledge-feed-item .gm-app,\n.knowledge-feed-item .wl-app,\n.knowledge-feed-item .sw-app,";
if (!css.includes(".knowledge-feed-item .gm-app")) {
  css = css.replace(selectorNeedle, `${selectorAdd}\n${selectorNeedle}`);
  fs.writeFileSync(cssPath, css);
  console.log("Updated styles.css feed item selectors");
}

const buildPath = path.join(root, "scripts", "build-site.mjs");
let build = fs.readFileSync(buildPath, "utf8");
for (const script of ["fetch-gaming-pulse.mjs", "fetch-wellness-wire.mjs", "fetch-startup-wire.mjs"]) {
  if (!build.includes(script)) {
    build = build.replace(
      '"fetch-job-radar.mjs",',
      `"fetch-job-radar.mjs",\n  "${script}",`,
    );
  }
}
fs.writeFileSync(buildPath, build);
console.log("Updated build-site.mjs");
