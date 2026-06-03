import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GUIDES, gameOgImage, SITE } from "./game-catalog.mjs";
import { esc, renderOgMeta, siteChromeNav, siteFooter, BRAND } from "./og-meta.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gamesDir = path.join(__dirname, "..", "games");

function renderGuide(g) {
  const url = `${SITE}/games/${g.slug}.html`;
  const faqEntities = g.faq.map(([q, a]) => ({
    "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a },
  }));
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: BRAND, item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Game guides", item: `${SITE}/games/` },
          { "@type": "ListItem", position: 3, name: g.name, item: url },
        ],
      },
      {
        "@type": "VideoGame", name: g.name, description: g.lead, url,
        gamePlatform: "Web browser",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      { "@type": "FAQPage", mainEntity: faqEntities },
    ],
  };

  const tips = g.tips.map((t) => `      <li>${esc(t)}</li>`).join("\n");
  const faq = g.faq.map(([q, a]) => `      <dt>${esc(q)}</dt>\n      <dd>${esc(a)}</dd>`).join("\n");
  const related = g.related.map(([href, label]) => {
    const h = href.startsWith("../") ? href : href;
    return `      <li><a href="${h}">${esc(label)}</a></li>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(g.name)} — How to Play | ${BRAND}</title>
  <meta name="description" content="${esc(g.lead.slice(0, 155))}">
  <link rel="canonical" href="${url}">
${renderOgMeta({ url, title: `${g.name} — ${BRAND}`, description: g.lead, image: gameOgImage(g.slug) })}
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <link rel="stylesheet" href="../styles.css">
  <link rel="stylesheet" href="../assets/legal.css">
</head>
<body>
${siteChromeNav("../")}

  <main class="content-page">
    <nav class="guide-breadcrumb" aria-label="Breadcrumb">
      <a href="../index.html">Home</a> · <a href="index.html">Guides</a> · <a href="../categories/${g.category}.html">${esc(g.category)}</a> · ${esc(g.name)}
    </nav>
    <h1>${g.emoji} ${esc(g.name)}</h1>
    <p class="content-lead">${esc(g.lead)}</p>
    <blockquote class="guide-highlight">${esc(g.highlight)}</blockquote>
    <a class="play-cta" href="../index.html?game=${g.id}">▶ Play ${esc(g.name)} now</a>

    <h2>Who is this for?</h2>
    <p>${esc(g.forWho)}</p>

    <h2>How to play</h2>
    <p>${esc(g.how)}</p>

    <h2>Tips</h2>
    <ul>
${tips}
    </ul>

    <h2>FAQ</h2>
    <dl class="content-faq">
${faq}
    </dl>

    <h2>Related games</h2>
    <ul class="guide-list">
${related}
    </ul>

    <p><a href="../index.html">Back to the feed</a> · <a href="../categories/${g.category}.html">More ${esc(g.category)} games</a> · <a href="index.html">All 18 guides</a></p>
  </main>

${siteFooter("../")}
</body>
</html>
`;
}

for (const g of GUIDES) {
  fs.writeFileSync(path.join(gamesDir, `${g.slug}.html`), renderGuide(g));
}
console.log(`Built ${GUIDES.length} guide pages`);
