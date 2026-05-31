/** Generate loopable guzheng-style ambient WAV for poetry feed BGM */
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dir, "..", "assets", "poetry");
const outPath = join(outDir, "bgm.wav");

const SAMPLE_RATE = 44100;
const LOOP_SEC = 48;
const samples = SAMPLE_RATE * LOOP_SEC;
const buf = new Float32Array(samples);

const pluck = (freq, startSec, durSec, vol = 0.38) => {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(durSec * SAMPLE_RATE);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const attack = 1 - Math.exp(-28 * t);
    const decay = Math.exp(-1.85 * t);
    const env = attack * decay * vol;
    const s =
      Math.sin(2 * Math.PI * freq * t) * 0.72 +
      Math.sin(2 * Math.PI * freq * 2.01 * t) * 0.18 +
      Math.sin(2 * Math.PI * freq * 3.02 * t) * 0.07 +
      Math.sin(2 * Math.PI * freq * 5.01 * t) * 0.03;
    const idx = start + i;
    if (idx >= 0 && idx < samples) buf[idx] += s * env;
  }
};

const drone = (freq, vol = 0.045) => {
  for (let i = 0; i < samples; i++) {
    const t = i / SAMPLE_RATE;
    const wobble = 1 + 0.004 * Math.sin(2 * Math.PI * 0.08 * t);
    buf[i] +=
      (Math.sin(2 * Math.PI * freq * wobble * t) * 0.55 +
        Math.sin(2 * Math.PI * freq * 2 * t) * 0.25) *
      vol;
  }
};

// D-major pentatonic — meditative guzheng-like phrase
const notes = {
  d3: 146.83,
  e3: 164.81,
  g3: 196.0,
  a3: 220.0,
  b3: 246.94,
  d4: 293.66,
  e4: 329.63,
  g4: 392.0,
  a4: 440.0,
  b4: 493.88,
  d5: 587.33,
};

const phrase = [
  [notes.d4, 0.0, 2.8],
  [notes.e4, 3.0, 2.6],
  [notes.g4, 6.0, 3.2],
  [notes.a4, 9.5, 2.4],
  [notes.g4, 12.2, 2.8],
  [notes.e4, 15.2, 2.6],
  [notes.d4, 18.0, 3.4],
  [notes.g3, 21.8, 3.0],
  [notes.a3, 25.2, 2.6],
  [notes.b3, 28.0, 2.8],
  [notes.d4, 31.0, 3.2],
  [notes.e4, 34.5, 2.4],
  [notes.g4, 37.2, 3.0],
  [notes.d5, 40.5, 2.8],
  [notes.b4, 43.5, 2.2],
  [notes.a4, 45.8, 2.0],
];

phrase.forEach(([f, start, dur]) => pluck(f, start, dur));
drone(notes.d3);
drone(notes.g3, 0.028);

// Soft echo (simple delay mix)
const delaySamples = Math.floor(0.28 * SAMPLE_RATE);
const wet = new Float32Array(samples);
for (let i = delaySamples; i < samples; i++) {
  wet[i] += buf[i - delaySamples] * 0.22;
  wet[i] += buf[i - delaySamples * 2] * 0.1;
}
for (let i = 0; i < samples; i++) buf[i] = buf[i] * 0.82 + wet[i];

// Normalize
let peak = 0;
for (let i = 0; i < samples; i++) peak = Math.max(peak, Math.abs(buf[i]));
const gain = peak > 0 ? 0.92 / peak : 1;

const pcm = Buffer.alloc(samples * 2);
for (let i = 0; i < samples; i++) {
  const v = Math.max(-1, Math.min(1, buf[i] * gain));
  pcm.writeInt16LE(Math.round(v * 32767), i * 2);
}

const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(SAMPLE_RATE, 24);
header.writeUInt32LE(SAMPLE_RATE * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(pcm.length, 40);

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, Buffer.concat([header, pcm]));
console.log(`Wrote ${outPath} (${(pcm.length / 1024 / 1024).toFixed(2)} MB, ${LOOP_SEC}s loop)`);
