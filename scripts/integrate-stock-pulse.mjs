import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { radarArticleHtml } from "./learn-feed-html.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

if (html.includes('id="stockPulseHubItem"')) {
  console.log("Hot Stocks already integrated");
  process.exit(0);
}

const cfg = {
  prefix: "stk",
  learnSection: "stocks",
  hubId: "stockPulseHubItem",
  logo: "📊",
  titleA: "Hot",
  titleB: "Stocks",
  subtitle: "Trending tickers · earnings · macro · WSB",
  listTitle: "Today's Hot Stocks",
  feedTitle: "Hot Stocks",
  feedDesc: "Reddit · Yahoo · Google News · daily refresh 9am",
};

const block =
  "\n      <!-- Learn: Hot Stocks radar -->\n" +
  radarArticleHtml(cfg).replace(
    '<p class="feed-desc">' + cfg.feedDesc + "</p>",
    "<p class=\"feed-desc\">Reddit · Yahoo · Google News · daily refresh 9am</p>",
  ) +
  "\n";

const financeStart = html.indexOf('id="financeHubItem"');
if (financeStart < 0) throw new Error("financeHubItem not found");
const insertAt = html.lastIndexOf("<article", financeStart);

html = html.slice(0, insertAt) + block + html.slice(insertAt);

html = html.replace(
  "  <script src=\"assets/food-campus-hub.js\"></script>\n  <script src=\"assets/learn-picks.js\"></script>",
  "  <script src=\"assets/food-campus-hub.js\"></script>\n  <script src=\"assets/stock-pulse-feeds.js\"></script>\n  <script src=\"assets/stock-pulse.js\"></script>\n  <script src=\"assets/stock-pulse-hub.js\"></script>\n  <script src=\"assets/learn-picks.js\"></script>",
);

fs.writeFileSync(htmlPath, html);

const appPath = path.join(root, "app.js");
let app = fs.readFileSync(appPath, "utf8");
if (!app.includes("stockPulseHubItem")) {
  app = app.replace(
    'creatorplay: "creatorPlayHubItem", gaming: "creatorPlayHubItem", creator: "creatorPlayHubItem", wellness:',
    'creatorplay: "creatorPlayHubItem", gaming: "creatorPlayHubItem", creator: "creatorPlayHubItem", stocks: "stockPulseHubItem", wellness:',
  );
  fs.writeFileSync(appPath, app);
}

const cssPath = path.join(root, "styles.css");
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes(".knowledge-feed-item .stk-app")) {
  css = css.replace(
    ".knowledge-feed-item .cpl-app,",
    ".knowledge-feed-item .stk-app,\n.knowledge-feed-item .cpl-app,",
  );
  css = css.replace(
    ".feed-column:has(#feedIntroLearn:not(.hidden)) .knowledge-feed-item .cpl-app,",
    ".feed-column:has(#feedIntroLearn:not(.hidden)) .knowledge-feed-item .stk-app,\n.feed-column:has(#feedIntroLearn:not(.hidden)) .knowledge-feed-item .cpl-app,",
  );
  fs.writeFileSync(cssPath, css);
}

console.log("Integrated Hot Stocks radar before Daily Finance");
