import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  GUIDES,
  CATEGORY_META,
  guidesByCategory,
  SITE,
} from "./game-catalog.mjs";
import {
  esc,
  renderOgMeta,
  siteChromeNav,
  siteFooter,
  BRAND,
} from "./og-meta.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const categoriesDir = path.join(root, "categories");

function renderCategoryHub(cat) {
  const meta = CATEGORY_META[cat];
  const games = guidesByCategory(cat);
  const url = `${SITE}/categories/${cat}.html`;
  const image = `${SITE}/assets/og/og-${cat}.svg`;
  const otherCats = Object.keys(CATEGORY_META).filter((c) => c !== cat);

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: BRAND, item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Categories", item: `${SITE}/categories/arcade.html` },
          { "@type": "ListItem", position: 3, name: meta.shortName, item: url },
        ],
      },
      {
        "@type": "ItemList",
        name: `${meta.shortName} mini games on ${BRAND}`,
        numberOfItems: games.length,
        itemListElement: games.map((g, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: g.name,
          url: `${SITE}/games/${g.slug}.html`,
        })),
      },
    ],
  };

  const cards = games
    .map(
      (g) => `      <article class="category-card">
        <span class="category-card-emoji" aria-hidden="true">${g.emoji}</span>
        <h3><a href="../games/${g.slug}.html">${esc(g.name)}</a></h3>
        <p>${esc(g.lead.slice(0, 110))}…</p>
        <div class="category-card-actions">
          <a class="play-cta play-cta--sm" href="../index.html?game=${g.id}">Play</a>
          <a class="category-guide-link" href="../games/${g.slug}.html">Guide</a>
        </div>
      </article>`,
    )
    .join("\n");

  const crossLinks = otherCats
    .map(
      (c) =>
        `<a href="${c}.html">${CATEGORY_META[c].emoji} ${esc(CATEGORY_META[c].shortName)}</a>`,
    )
    .join(" · ");

  const editorial = (meta.editorial || [])
    .map((p) => `    <p>${esc(p)}</p>`)
    .join("\n");

  const topPicks = (meta.topPickSlugs || [])
    .map((slug) => GUIDES.find((g) => g.slug === slug))
    .filter(Boolean)
    .map(
      (g) => `      <article class="category-spotlight">
        <span class="category-spotlight-badge">Editor's pick</span>
        <h3>${g.emoji} <a href="../games/${g.slug}.html">${esc(g.name)}</a></h3>
        <p>${esc(g.editorPick)}</p>
        <a class="play-cta play-cta--sm" href="../index.html?game=${g.id}">Play now</a>
      </article>`,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(meta.title)} | ${BRAND}</title>
  <meta name="description" content="${esc(meta.description.slice(0, 155))}">
  <link rel="canonical" href="${url}">
${renderOgMeta({ url, title: `${meta.title} | ${BRAND}`, description: meta.description, image })}
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <link rel="stylesheet" href="../styles.css">
  <link rel="stylesheet" href="../assets/legal.css">
</head>
<body>
${siteChromeNav("../")}

  <main class="content-page">
    <nav class="guide-breadcrumb" aria-label="Breadcrumb">
      <a href="../index.html">Home</a> · <a href="../games/index.html">Guides</a> · ${esc(meta.shortName)}
    </nav>
    <h1>${meta.emoji} ${esc(meta.title)}</h1>
    <p class="content-lead">${esc(meta.description)}</p>
    <a class="play-cta" href="../index.html?cat=${cat}">▶ Play ${esc(meta.shortName.toLowerCase())} games in the feed</a>

    <div class="category-editorial">
${editorial}
    </div>

    <h2>Editor's top picks</h2>
    <div class="category-spotlights">
${topPicks}
    </div>

    <h2>All ${esc(meta.shortName.toLowerCase())} games</h2>
    <div class="category-grid">
${cards}
    </div>

    <h2>Other categories</h2>
    <p class="category-crosslinks">${crossLinks}</p>

    <p><a href="../index.html">Back to feed</a> · <a href="../play-tips.html">Play tips by mood</a> · <a href="../games/index.html">All 18 guides</a></p>
  </main>

${siteFooter("../")}
</body>
</html>
`;
}

function renderGamesIndex() {
  const url = `${SITE}/games/`;
  const featured = ["squishy-chick", "neon-rush", "runway-glow-up", "daily-fortune"];
  const featuredList = featured
    .map((slug) => {
      const g = GUIDES.find((x) => x.slug === slug);
      if (!g) return "";
      return `      <li><a href="${g.slug}.html">${esc(g.name)}</a> — ${esc(g.lead.slice(0, 55))}…</li>`;
    })
    .filter(Boolean)
    .join("\n");

  const sections = Object.keys(CATEGORY_META)
    .map((cat) => {
      const meta = CATEGORY_META[cat];
      const items = guidesByCategory(cat)
        .map(
          (g) =>
            `      <li><a href="${g.slug}.html">${esc(g.name)}</a> — ${esc(g.lead.slice(0, 48))}…</li>`,
        )
        .join("\n");
      return `    <h2><a href="../categories/${cat}.html">${meta.emoji} ${esc(meta.shortName)}</a></h2>
    <p>${esc(meta.blurb)} <a href="../categories/${cat}.html">Browse all ${guidesByCategory(cat).length} →</a></p>
    <ul class="guide-list">
${items}
    </ul>`;
    })
    .join("\n\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game Guides — How to Play Every ${BRAND} Mini Game</title>
  <meta name="description" content="Browse all 18 ${BRAND} game guides: Squishy Chick, Neon Rush, Runway Glow-Up, Memory Match, and more. Free browser mini games.">
  <link rel="canonical" href="${url}">
${renderOgMeta({
  url,
  title: `Game Guides — ${BRAND}`,
  description: `How to play all 18 free browser mini games on ${BRAND}.`,
})}
  <link rel="stylesheet" href="../styles.css">
  <link rel="stylesheet" href="../assets/legal.css">
</head>
<body>
${siteChromeNav("../")}

  <main class="content-page">
    <nav class="guide-breadcrumb" aria-label="Breadcrumb">
      <a href="../index.html">Home</a> · Game guides
    </nav>
    <h1>Game guides</h1>
    <p class="content-lead">How to play every mini game on ${BRAND} — tips, FAQs, and direct play links. All 18 games run free in your browser with no download.</p>

    <a class="play-cta" href="../index.html">▶ Open the game feed</a>

    <p class="category-crosslinks">Browse by vibe:
      <a href="../categories/arcade.html">Arcade</a> ·
      <a href="../categories/puzzle.html">Puzzle</a> ·
      <a href="../categories/chill.html">Chill</a> ·
      <a href="../categories/social.html">Social</a>
    </p>

    <h2>Featured</h2>
    <ul class="guide-list">
${featuredList}
    </ul>

${sections}
  </main>

${siteFooter("../")}
</body>
</html>
`;
}

fs.mkdirSync(categoriesDir, { recursive: true });
for (const cat of Object.keys(CATEGORY_META)) {
  fs.writeFileSync(path.join(categoriesDir, `${cat}.html`), renderCategoryHub(cat));
}
fs.writeFileSync(path.join(root, "games", "index.html"), renderGamesIndex());
console.log(`Built ${Object.keys(CATEGORY_META).length} category hubs + games/index.html`);
