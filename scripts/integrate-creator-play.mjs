import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { creatorPlayRadarArticleHtml } from "./learn-feed-html.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

if (html.includes('id="creatorPlayHubItem"')) {
  console.log("Creator & Play already integrated");
  process.exit(0);
}

const gamingStart = html.indexOf('id="gamingHubItem"');
if (gamingStart < 0) throw new Error("gamingHubItem not found");
const gamingArticleStart = html.lastIndexOf("<article", gamingStart);
const gamingEnd = html.indexOf("</article>", gamingStart) + "</article>".length;

const creatorStart = html.indexOf('id="creatorHubItem"');
if (creatorStart < 0) throw new Error("creatorHubItem not found");
const creatorArticleStart = html.lastIndexOf("<article", creatorStart);
const creatorEnd = html.indexOf("</article>", creatorStart) + "</article>".length;

const block =
  "\n      <!-- Learn: Creator & Play (Gaming + Creator) -->\n" + creatorPlayRadarArticleHtml() + "\n";

html = html.slice(0, gamingArticleStart) + block + html.slice(gamingEnd, creatorArticleStart) + html.slice(creatorEnd);

html = html.replace(
  "  <script src=\"assets/gaming-pulse-hub.js\"></script>\n",
  "  <script src=\"assets/creator-play-radar-hub.js\"></script>\n",
);
html = html.replace(/\n  <script src="assets\/creator-kit-hub.js"><\/script>/, "");

html = html.replace(/eighteen mini-apps/g, "seventeen mini-apps");
html = html.replace(/18 mini-apps/g, "17 mini-apps");

fs.writeFileSync(htmlPath, html);

const appPath = path.join(root, "app.js");
let app = fs.readFileSync(appPath, "utf8");
app = app.replace(
  'gaming: "gamingHubItem", wellness:',
  'creatorplay: "creatorPlayHubItem", gaming: "creatorPlayHubItem", creator: "creatorPlayHubItem", wellness:',
);
fs.writeFileSync(appPath, app);

const cssPath = path.join(root, "styles.css");
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes(".knowledge-feed-item .cpl-app")) {
  css = css.replace(
    ".knowledge-feed-item .cr-app,",
    ".knowledge-feed-item .cpl-app,\n.knowledge-feed-item .cr-app,",
  );
}
if (!css.includes(".cpl-play-tabs")) {
  css = css.replace(
    ".cr-career-tab.active {",
    `.cpl-play-tabs {
  display: flex;
  gap: 0.4rem;
  margin: 0.35rem 0 0.5rem;
  padding: 0 0.1rem;
}

.cpl-play-tab {
  flex: 1;
  padding: 0.4rem 0.55rem;
  border-radius: 10px;
  border: 1px solid rgba(192, 132, 252, 0.28);
  background: rgba(15, 23, 42, 0.55);
  color: #94a3b8;
  font-size: 0.625rem;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
}

.cpl-play-tab.active {
  border-color: rgba(244, 114, 182, 0.45);
  background: linear-gradient(135deg, rgba(192, 132, 252, 0.22), rgba(244, 114, 182, 0.14));
  color: #fbcfe8;
}

.cr-career-tab.active {`,
  );
  fs.writeFileSync(cssPath, css);
}

console.log("Integrated Creator & Play — replaced Gaming + Creator articles");
