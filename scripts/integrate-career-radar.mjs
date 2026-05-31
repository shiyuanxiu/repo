import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { careerRadarArticleHtml } from "./learn-feed-html.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

if (html.includes('id="careerHubItem"')) {
  console.log("Career Radar already integrated");
  process.exit(0);
}

const jobStart = html.indexOf('id="jobRadarHubItem"');
if (jobStart < 0) throw new Error("jobRadarHubItem not found");
const jobArticleStart = html.lastIndexOf("<article", jobStart);
const jobEnd = html.indexOf("</article>", jobStart) + "</article>".length;

const startupStart = html.indexOf('id="startupHubItem"');
if (startupStart < 0) throw new Error("startupHubItem not found");
const startupArticleStart = html.lastIndexOf("<article", startupStart);
const startupEnd = html.indexOf("</article>", startupStart) + "</article>".length;

const careerBlock = "\n      <!-- Learn: Career Radar (Jobs + Startup) -->\n" + careerRadarArticleHtml() + "\n";

html = html.slice(0, jobArticleStart) + careerBlock + html.slice(jobEnd, startupArticleStart) + html.slice(startupEnd);

html = html.replace(/nineteen mini-apps/g, "eighteen mini-apps");
html = html.replace(/💼 Jobs · 🎮 Gaming/g, "💼 Career · 🎮 Gaming");
html = html.replace(/🚀 Startup · 🌍 Climate/g, "🌍 Climate");

html = html.replace(
  "  <script src=\"assets/job-radar-hub.js\"></script>\n",
  "  <script src=\"assets/career-radar-hub.js\"></script>\n",
);
html = html.replace(/\n  <script src="assets\/startup-wire-hub.js"><\/script>/, "");

fs.writeFileSync(htmlPath, html);

const appPath = path.join(__dirname, "..", "app.js");
let app = fs.readFileSync(appPath, "utf8");
app = app.replace(
  'jobs: "jobRadarHubItem", gaming:',
  'career: "careerHubItem", jobs: "careerHubItem", startup: "careerHubItem", gaming:',
);
app = app.replace(/startup: "startupHubItem", climate:/, "climate:");
fs.writeFileSync(appPath, app);

const cssPath = path.join(__dirname, "..", "styles.css");
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes(".knowledge-feed-item .cr-app")) {
  css = css.replace(
    ".knowledge-feed-item .jr-app,",
    ".knowledge-feed-item .cr-app,\n.knowledge-feed-item .jr-app,",
  );
  fs.writeFileSync(cssPath, css);
}

console.log("Integrated Career Radar — replaced Job + removed Startup articles");
