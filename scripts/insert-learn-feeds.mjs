import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { radarArticleHtml, DATING_ARTICLE_HTML } from "./learn-feed-html.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

if (html.includes('id="campusHubItem"')) {
  console.log("Learn feeds already inserted — skip");
  process.exit(0);
}

const campus = radarArticleHtml({
  prefix: "cp",
  learnSection: "campus",
  hubId: "campusHubItem",
  logo: "🏫",
  titleA: "Campus",
  titleB: "Life Feed",
  subtitle: "College news · dorm · study · social",
  listTitle: "Today's Campus",
  feedTitle: "Campus Life Feed",
  feedDesc: "Reddit · NPR · last 24h",
});

const jobs = radarArticleHtml({
  prefix: "jr",
  learnSection: "jobs",
  hubId: "jobRadarHubItem",
  logo: "💼",
  titleA: "Job",
  titleB: "Radar",
  subtitle: "Internships · hiring · tech careers",
  listTitle: "Today's Job News",
  feedTitle: "Job Radar",
  feedDesc: "Internships · layoffs · HN jobs",
});

const block =
  "\n      <!-- Learn 4–6: Campus · Dating · Jobs -->\n" +
  campus +
  "\n\n" +
  DATING_ARTICLE_HTML +
  "\n\n" +
  jobs +
  "\n";

const needle =
  '</footer>\n      </article>\n\n      <article class="feed-item knowledge-feed-item" data-feed="knowledge" data-learn-section="finance"';
const idx = html.indexOf('id="mindHubItem"');
const pos = html.indexOf(needle, idx);
if (pos < 0) throw new Error("Insert marker not found after mindHubItem");

const insertAt = pos + "</footer>\n      </article>".length;
html = html.slice(0, insertAt) + block + html.slice(insertAt);
fs.writeFileSync(htmlPath, html);
console.log("Inserted Campus, Dating, Job Radar after Mind Check-in");
