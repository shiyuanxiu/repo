import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GUIDES, CATEGORY_META } from "./game-catalog.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "assets", "feed-meta.js");

const meta = Object.fromEntries(
  GUIDES.map((g) => [
    g.id,
    {
      editorPick: g.editorPick,
      guide: `${g.slug}.html`,
      category: g.category,
      categoryLabel: CATEGORY_META[g.category].shortName,
      name: g.name,
    },
  ]),
);

const highlights = [
  { game: "run", label: "Neon Rush high scores", tip: "Share distance + points after each run" },
  { game: "fortune", label: "Daily fortune cards", tip: "Draw once, post your prompt" },
  { game: "sente", label: "Meme line cards", tip: "DIY mode for inside jokes" },
  { game: "spot", label: "Travel check-ins", tip: "Polaroid cards from Rainbow Salt Lake" },
  { game: "face", label: "Runway glow-ups", tip: "TikTok/IG share after a full slay" },
];

const body = `window.FEED_META = ${JSON.stringify(meta, null, 2)};
window.FEED_HIGHLIGHTS = ${JSON.stringify(highlights, null, 2)};
`;

fs.writeFileSync(out, body);
console.log(`Built feed-meta.js (${GUIDES.length} games, ${highlights.length} highlights)`);
