import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

const order = [
  "hotspotHubItem",
  "aiToolsHubItem",
  "mindHubItem",
  "campusHubItem",
  "datingHubItem",
  "jobRadarHubItem",
  "financeHubItem",
  "wcHubItem",
  "catWikiHubItem",
  "spaceHubItem",
  "poetryHubItem",
  "vibeHubItem",
  "hustleHubItem",
];

function extractArticle(source, id) {
  const re = new RegExp(`(<article[^>]*id="${id}"[\\s\\S]*?</article>)`, "i");
  const m = source.match(re);
  if (!m) throw new Error(`Missing article: ${id}`);
  return m[1];
}

const blocks = {};
for (const id of order) {
  blocks[id] = extractArticle(html, id);
  html = html.replace(blocks[id], "");
}

const combined = order.map((id) => blocks[id]).join("\n\n      ");
const introIdx = html.indexOf('id="feedIntroLearn"');
if (introIdx < 0) throw new Error("feedIntroLearn not found");
const closeIdx = html.indexOf("</section>", introIdx);
const insertAt = closeIdx + "</section>".length;

html =
  html.slice(0, insertAt) +
  "\n\n      <!-- Learn feed: 1 Radar → 2 AI Tools → 3 Mind → 4 Finance → … -->\n      " +
  combined +
  html.slice(insertAt);

html = html.replace(/\n\s*<!-- Learn tab:[\s\S]*?-->\s*\n/g, "\n");

fs.writeFileSync(htmlPath, html);
console.log("Learn feed reordered:", order.join(" → "));
