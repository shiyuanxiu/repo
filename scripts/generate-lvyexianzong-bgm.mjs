/** Render 绿野仙踪 (Pipa Yin) — xiao + piano style loop WAV */
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dir, "..", "assets", "poetry");
const outPath = join(outDir, "lvyexianzong.wav");

const SR = 44100;
const LOOP_SEC = 92;
const samples = SR * LOOP_SEC;
const buf = new Float32Array(samples);

const N = {
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
};

// Main xiao melody — 绿野仙踪 / 琵琶吟 theme (numbered notation 1=G)
const melody = [
  [N.D4, 1.6],
  [N.B3, 0.45],
  [N.A3, 0.45],
  [N.G3, 0.45],
  [N.A3, 0.45],
  [N.B3, 0.45],
  [N.D4, 1.1],
  [0, 0.35],
  [N.E4, 0.45],
  [N.D4, 0.45],
  [N.B3, 0.45],
  [N.A3, 0.45],
  [N.G3, 2.0],
  [0, 0.4],
  [N.G3, 0.45],
  [N.A3, 0.45],
  [N.B3, 0.45],
  [N.C4, 0.45],
  [N.D4, 0.45],
  [N.E4, 0.45],
  [N.D4, 0.45],
  [N.C4, 0.45],
  [N.B3, 0.45],
  [N.A3, 0.45],
  [N.G3, 1.6],
  [0, 0.5],
  [N.B3, 0.45],
  [N.D4, 0.45],
  [N.E4, 0.45],
  [N.G4, 0.45],
  [N.A4, 0.45],
  [N.G4, 0.45],
  [N.E4, 0.45],
  [N.D4, 0.45],
  [N.B3, 1.8],
  [0, 0.5],
  [N.D4, 1.4],
  [N.E4, 0.45],
  [N.G4, 0.45],
  [N.A4, 0.45],
  [N.G4, 0.45],
  [N.E4, 0.45],
  [N.D4, 0.45],
  [N.B3, 0.45],
  [N.A3, 0.45],
  [N.G3, 2.2],
  [0, 0.6],
  [N.A3, 0.45],
  [N.B3, 0.45],
  [N.C4, 0.45],
  [N.D4, 0.45],
  [N.E4, 0.45],
  [N.D4, 0.45],
  [N.C4, 0.45],
  [N.B3, 0.45],
  [N.A3, 0.45],
  [N.G3, 2.4],
];

const pianoArps = [
  { t: 0, notes: [N.G3, N.B3, N.D4], dur: 4.5 },
  { t: 4.8, notes: [N.E3 || 164.81, N.G3, N.B3], dur: 4.2 },
  { t: 9.2, notes: [N.C3 || 130.81, N.E3 || 164.81, N.G3], dur: 4.0 },
  { t: 13.5, notes: [N.G3, N.B3, N.D4], dur: 5.0 },
  { t: 19.0, notes: [N.A3, N.C4, N.E4], dur: 4.5 },
  { t: 23.8, notes: [N.G3, N.B3, N.D4], dur: 4.5 },
  { t: 28.5, notes: [N.D3 || 146.83, N.F4, N.A3], dur: 4.0 },
  { t: 32.8, notes: [N.G3, N.B3, N.D4], dur: 5.5 },
  { t: 38.8, notes: [N.E3 || 164.81, N.G3, N.B3], dur: 4.0 },
  { t: 43.2, notes: [N.C3 || 130.81, N.E3 || 164.81, N.G3], dur: 4.5 },
  { t: 48.0, notes: [N.G3, N.B3, N.D4], dur: 6.0 },
  { t: 54.5, notes: [N.A3, N.C4, N.E4], dur: 4.5 },
  { t: 59.5, notes: [N.G3, N.B3, N.D4], dur: 5.0 },
  { t: 65.0, notes: [N.E3 || 164.81, N.G3, N.B3], dur: 4.5 },
  { t: 70.0, notes: [N.C3 || 130.81, N.E3 || 164.81, N.G3], dur: 5.0 },
  { t: 75.5, notes: [N.G3, N.B3, N.D4], dur: 8.0 },
];

N.E3 = 164.81;
N.C3 = 130.81;
N.D3 = 146.83;

const xiaoPluck = (freq, startSec, durSec, vol = 0.34) => {
  if (!freq) return;
  const start = Math.floor(startSec * SR);
  const len = Math.floor(durSec * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const attack = 1 - Math.exp(-18 * t);
    const decay = Math.exp(-2.1 * t);
    const env = attack * decay * vol;
    const breath = (Math.random() * 2 - 1) * 0.012 * Math.exp(-8 * t);
    const s =
      Math.sin(2 * Math.PI * freq * t) * 0.62 +
      Math.sin(2 * Math.PI * freq * 2.01 * t) * 0.22 +
      Math.sin(2 * Math.PI * freq * 3.02 * t) * 0.1 +
      breath;
    const idx = start + i;
    if (idx >= 0 && idx < samples) buf[idx] += s * env;
  }
};

const pianoNote = (freq, startSec, durSec, vol = 0.07) => {
  if (!freq) return;
  const start = Math.floor(startSec * SR);
  const len = Math.floor(durSec * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const attack = 1 - Math.exp(-12 * t);
    const decay = Math.exp(-1.4 * t);
    const env = attack * decay * vol;
    const s =
      Math.sin(2 * Math.PI * freq * t) * 0.5 +
      Math.sin(2 * Math.PI * freq * 2 * t) * 0.25 +
      Math.sin(2 * Math.PI * freq * 4 * t) * 0.08;
    const idx = start + i;
    if (idx >= 0 && idx < samples) buf[idx] += s * env;
  }
};

let t = 2.0;
for (const [freq, dur] of melody) {
  if (freq) xiaoPluck(freq, t, dur * 0.95);
  t += dur;
}

for (const arp of pianoArps) {
  const step = arp.dur / arp.notes.length;
  arp.notes.forEach((freq, i) => {
    pianoNote(freq, arp.t + i * step, step * 1.8, 0.085);
  });
}

// Repeat melody once more for fuller loop
t = 46.0;
for (const [freq, dur] of melody) {
  if (freq) xiaoPluck(freq, t, dur * 0.92, 0.28);
  t += dur;
  if (t > LOOP_SEC - 2) break;
}

// Soft reverb
const wet = new Float32Array(samples);
const d1 = Math.floor(0.32 * SR);
const d2 = Math.floor(0.58 * SR);
for (let i = d2; i < samples; i++) {
  wet[i] += buf[i - d1] * 0.18 + buf[i - d2] * 0.1;
}
for (let i = 0; i < samples; i++) buf[i] = buf[i] * 0.85 + wet[i];

let peak = 0;
for (let i = 0; i < samples; i++) peak = Math.max(peak, Math.abs(buf[i]));
const gain = peak > 0 ? 0.9 / peak : 1;

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
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(pcm.length, 40);

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, Buffer.concat([header, pcm]));
console.log(`Wrote ${outPath} (${LOOP_SEC}s — 绿野仙踪 xiao+piano style)`);
