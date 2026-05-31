import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GUIDES, CATEGORY_META, SITE } from "./game-catalog.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const staticPages = [
  { loc: `${SITE}/`, priority: "1.0", changefreq: "weekly" },
  { loc: `${SITE}/index.html`, priority: "1.0", changefreq: "weekly" },
  { loc: `${SITE}/about.html`, priority: "0.7", changefreq: "monthly" },
  { loc: `${SITE}/contact.html`, priority: "0.6", changefreq: "monthly" },
  { loc: `${SITE}/privacy.html`, priority: "0.4", changefreq: "monthly" },
  { loc: `${SITE}/terms.html`, priority: "0.4", changefreq: "monthly" },
  { loc: `${SITE}/favorites.html`, priority: "0.5", changefreq: "weekly" },
  { loc: `${SITE}/play-tips.html`, priority: "0.75", changefreq: "monthly" },
  { loc: `${SITE}/how-it-works.html`, priority: "0.7", changefreq: "monthly" },
  { loc: `${SITE}/whats-new.html`, priority: "0.65", changefreq: "weekly" },
  { loc: `${SITE}/games/`, priority: "0.85", changefreq: "weekly" },
  { loc: `${SITE}/games/index.html`, priority: "0.85", changefreq: "weekly" },
];

const urls = [
  ...staticPages,
  ...Object.keys(CATEGORY_META).map((cat) => ({
    loc: `${SITE}/categories/${cat}.html`,
    priority: "0.75",
    changefreq: "weekly",
  })),
  ...GUIDES.map((g) => ({
    loc: `${SITE}/games/${g.slug}.html`,
    priority: "0.8",
    changefreq: "monthly",
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(root, "sitemap.xml"), xml);
console.log(`Sitemap: ${urls.length} URLs`);
