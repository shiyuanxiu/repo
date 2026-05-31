import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { radarArticleHtml } from "./learn-feed-html.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const RADARS = [
  {
    prefix: "cb",
    learnSection: "climate",
    hubId: "climateHubItem",
    logo: "🌍",
    titleA: "Climate",
    titleB: "Brief",
    subtitle: "Policy · science · energy · action",
    listTitle: "Today's Climate",
    feedTitle: "Climate Brief",
    feedDesc: "Guardian · HN · climate news",
  },
  {
    prefix: "ck",
    learnSection: "creator",
    hubId: "creatorHubItem",
    logo: "🎬",
    titleA: "Creator",
    titleB: "Kit",
    subtitle: "Video · social · tools · monetize",
    listTitle: "Today's Creator News",
    feedTitle: "Creator Kit",
    feedDesc: "Reddit · creator economy news",
  },
  {
    prefix: "fd",
    learnSection: "food",
    hubId: "foodHubItem",
    logo: "🍜",
    titleA: "Food",
    titleB: "on Campus",
    subtitle: "Budget · recipes · dining · healthy",
    listTitle: "Today's Food Picks",
    feedTitle: "Food on Campus",
    feedDesc: "NPR · Reddit · cheap eats",
  },
];

const htmlPath = path.join(root, "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

if (!html.includes('id="climateHubItem"')) {
  const block =
    "\n\n      <!-- Learn 10–12: Climate · Creator · Food -->\n" +
    RADARS.map((r) => radarArticleHtml(r)).join("\n\n") +
    "\n";

  const needles = [
    '</footer>\n      </article>\n\n\n      <article class="feed-item knowledge-feed-item" data-feed="knowledge" data-learn-section="finance"',
    '</footer>\n      </article>\n\n      <article class="feed-item knowledge-feed-item" data-feed="knowledge" data-learn-section="finance"',
  ];
  let pos = -1;
  for (const needle of needles) {
    pos = html.indexOf(needle);
    if (pos >= 0) break;
  }
  if (pos < 0) {
    const startupEnd = html.indexOf('id="startupHubItem"');
    if (startupEnd < 0) throw new Error("startupHubItem not found");
    const financeStart = html.indexOf('data-learn-section="finance"', startupEnd);
    if (financeStart < 0) throw new Error("finance section not found");
    const articleStart = html.lastIndexOf("<article", financeStart);
    pos = articleStart - 1;
    html = html.slice(0, pos) + block + html.slice(pos);
  } else {
    html = html.slice(0, pos + "</footer>\n      </article>".length) + block + html.slice(pos + "</footer>\n      </article>".length);
  }

  html = html.replace(/Swipe ↕ sixteen mini-apps in one feed/, "Swipe ↕ nineteen mini-apps in one feed");
  html = html.replace(
    /🎮 Gaming · 🌿 Wellness · 🚀 Startup · \+ Finance/,
    "🎮 Gaming · 🌿 Wellness · 🚀 Startup · 🌍 Climate · 🎬 Creator · 🍜 Food · + Finance",
  );

  const scriptBlock = `  <script src="assets/climate-brief-feeds.js"></script>
  <script src="assets/climate-brief.js"></script>
  <script src="assets/climate-brief-hub.js"></script>
  <script src="assets/creator-kit-feeds.js"></script>
  <script src="assets/creator-kit.js"></script>
  <script src="assets/creator-kit-hub.js"></script>
  <script src="assets/food-campus-feeds.js"></script>
  <script src="assets/food-campus.js"></script>
  <script src="assets/food-campus-hub.js"></script>
`;
  const scriptNeedle = "  <script src=\"assets/startup-wire-hub.js\"></script>\n";
  if (html.includes(scriptNeedle)) {
    html = html.replace(scriptNeedle, scriptNeedle + scriptBlock);
  } else {
    html = html.replace(
      "  <script src=\"assets/feed-meta.js\"></script>",
      `${scriptBlock}  <script src="assets/feed-meta.js"></script>`,
    );
  }

  fs.writeFileSync(htmlPath, html);
  console.log("Inserted Climate Brief, Creator Kit, Food on Campus");
} else {
  console.log("Batch 2 radars already in index.html — skip HTML");
}

const appPath = path.join(root, "app.js");
let app = fs.readFileSync(appPath, "utf8");
if (!app.includes("climateHubItem")) {
  app = app.replace(
    'startup: "startupHubItem" }',
    'startup: "startupHubItem", climate: "climateHubItem", creator: "creatorHubItem", food: "foodHubItem" }',
  );
  fs.writeFileSync(appPath, app);
  console.log("Updated app.js learnIds");
}

const cssPath = path.join(root, "styles.css");
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes(".knowledge-feed-item .cb-app")) {
  css = css.replace(
    ".knowledge-feed-item .sw-app,",
    ".knowledge-feed-item .cb-app,\n.knowledge-feed-item .ck-app,\n.knowledge-feed-item .fd-app,\n.knowledge-feed-item .sw-app,",
  );
  fs.writeFileSync(cssPath, css);
  console.log("Updated styles.css selectors");
}

const buildPath = path.join(root, "scripts", "build-site.mjs");
let build = fs.readFileSync(buildPath, "utf8");
for (const script of ["fetch-climate-brief.mjs", "fetch-creator-kit.mjs", "fetch-food-campus.mjs"]) {
  if (!build.includes(script)) {
    build = build.replace(
      /"fetch-startup-wire\.mjs",/,
      `"fetch-startup-wire.mjs",\n  "${script}",`,
    );
    if (!build.includes(script)) {
      build = build.replace(
        '"fetch-job-radar.mjs",',
        `"fetch-job-radar.mjs",\n  "${script}",`,
      );
    }
  }
}
fs.writeFileSync(buildPath, build);
console.log("Updated build-site.mjs");
