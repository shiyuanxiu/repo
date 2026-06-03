import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATEGORY_META, GUIDES } from "./game-catalog.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ogDir = path.join(__dirname, "..", "assets", "og");
const gamesOgDir = path.join(ogDir, "games");

const PALETTES = {
  arcade: { a: "#06b6d4", b: "#6366f1", accent: "#fbbf24" },
  puzzle: { a: "#a855f7", b: "#ec4899", accent: "#34d399" },
  chill: { a: "#f472b6", b: "#fb923c", accent: "#86efac" },
  social: { a: "#f97316", b: "#e879f9", accent: "#fde047" },
  default: { a: "#9333ea", b: "#ec4899", accent: "#22d3ee" },
};

function escXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderOgSvg({ title, subtitle, emoji, paletteKey = "default" }) {
  const p = PALETTES[paletteKey] || PALETTES.default;
  const safeTitle = escXml(title);
  const safeSub = escXml(subtitle);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${safeTitle}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.a}"/>
      <stop offset="100%" stop-color="${p.b}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="150" cy="120" r="80" fill="${p.accent}" opacity="0.25"/>
  <circle cx="1050" cy="520" r="120" fill="#fff" opacity="0.08"/>
  <circle cx="980" cy="100" r="60" fill="#fff" opacity="0.12"/>
  <text x="600" y="250" text-anchor="middle" font-size="120" font-family="Segoe UI, system-ui, sans-serif">${emoji}</text>
  <text x="600" y="340" text-anchor="middle" fill="#fff" font-size="56" font-weight="700" font-family="Segoe UI, system-ui, sans-serif">${safeTitle}</text>
  <text x="600" y="410" text-anchor="middle" fill="rgba(255,255,255,0.92)" font-size="28" font-family="Segoe UI, system-ui, sans-serif">${safeSub}</text>
  <text x="600" y="560" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-size="28" font-weight="600" font-family="Segoe UI, system-ui, sans-serif">✦ Miniverse · Free browser mini games</text>
</svg>`;
}

fs.mkdirSync(gamesOgDir, { recursive: true });

fs.writeFileSync(
  path.join(ogDir, "og-default.svg"),
  renderOgSvg({
    title: "Miniverse",
    subtitle: "18 free browser mini games",
    emoji: "✦",
    paletteKey: "default",
  }),
);

for (const [cat, meta] of Object.entries(CATEGORY_META)) {
  fs.writeFileSync(
    path.join(ogDir, `og-${cat}.svg`),
    renderOgSvg({
      title: meta.shortName,
      subtitle: meta.blurb,
      emoji: meta.emoji,
      paletteKey: cat,
    }),
  );
}

for (const g of GUIDES) {
  fs.writeFileSync(
    path.join(gamesOgDir, `${g.slug}.svg`),
    renderOgSvg({
      title: g.name,
      subtitle: g.tag.replace("#", ""),
      emoji: g.emoji,
      paletteKey: g.category,
    }),
  );
}

console.log(`Built ${Object.keys(CATEGORY_META).length + 1} brand OG SVGs + ${GUIDES.length} game OG SVGs`);
