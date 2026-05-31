import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "poetry", "lvyexianzong.mid");

const res = await fetch("https://www.midishow.com/download/getm?id=55781", {
  headers: {
    Referer: "https://www.midishow.com/midi/55781.html",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
});
const buf = Buffer.from(await res.arrayBuffer());
const magic = buf.slice(0, 4).toString("ascii");
if (magic !== "MThd") {
  console.error("Not a MIDI file:", magic, "size", buf.length);
  process.exit(1);
}
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, buf);
console.log("Saved", out, buf.length, "bytes");
