import fs from "fs";

const html = fs.readFileSync("games/pacman.html", "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
scripts.forEach((s, i) => {
  try {
    new Function(s);
    console.log(`script ${i}: ok`);
  } catch (e) {
    console.error(`script ${i}: ${e.message}`);
    process.exit(1);
  }
});
console.log("all scripts valid");
