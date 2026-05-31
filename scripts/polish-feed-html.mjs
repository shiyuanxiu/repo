import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(indexPath, "utf8");

const EMOJI = {
  moodsign: "🌸", wanzhou: "🌍", foresthut: "🐣", pixeldeer: "🦌", woodshop: "🏪",
  pondskip: "🐸", neondash: "⚡", superface: "💅", flavorbox: "🎁", gensente: "✨",
  petoffice: "🐾", rainbowlake: "🌈", mjdraw: "🀄", starcatch: "⭐", stacktower: "🧱",
  memoryflip: "🃏", nummerge: "🔢", beattap: "🎵",
};

html = html.replace(/<!--[\s\S]*?-->/g, "");
html = html.replace(
  /<div class="feed-user">\s*<img src="https:\/\/picsum\.photos\/seed\/([^/]+)\/40\/40" alt="[^"]*">\s*<span>([^<]*)<\/span>\s*<\/div>/g,
  (_, seed, name) => {
    const emoji = EMOJI[seed] || "🎮";
    return `<div class="feed-user"><span class="feed-avatar" aria-hidden="true">${emoji}</span><span>${name}</span></div>`;
  }
);
html = html.replace(/\s*<span>\d+<\/span>(?=\s*<\/button>\s*<\/div>\s*<\/footer>)/g, "");
html = html.replace(/\s*<span>\d+<\/span>(?=\s*<\/button>)/g, "");
html = html.replace(
  /\s*<button class="stat-btn" data-action="comment">[\s\S]*?<\/button>/g,
  ""
);
html = html.replace(/(<button class="stat-btn" data-action="like")/g, '$1 aria-label="Like"');
html = html.replace(/(<button class="stat-btn" data-action="star")/g, '$1 aria-label="Save"');
html = html.replace(/(<button class="stat-btn" data-action="share")/g, '$1 aria-label="Share"');

fs.writeFileSync(indexPath, html);
console.log("Polished index.html");
