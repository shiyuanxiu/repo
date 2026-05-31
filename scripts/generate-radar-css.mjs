import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(__dirname, "..", "styles.css");
let css = fs.readFileSync(cssPath, "utf8");

const HR_START = "/* ===== Hotspot Radar mini-app";
const HR_END = "/* ===== Side Hustle Lab";
const DUP_START = "/* ===== Campus Life Feed";
const REDUCED = "@media (prefers-reduced-motion: reduce)";

const PREFIXES = ["hr", "cp", "jr", "cr", "gm", "wl", "sw", "cb", "ck", "cpl", "stk", "fd"];

const THEMES = {
  hr: {
    bg: "linear-gradient(165deg, #060d1f 0%, #0a1530 45%, #070f22 100%)",
    a: "34, 211, 238",
    b: "#67e8f9",
    c: "#22d3ee",
    d: "167, 139, 250",
    e: "#a78bfa",
    f: "#c4b5fd",
    shadow: "99, 102, 241",
  },
  cp: {
    bg: "linear-gradient(165deg, #1a0f05 0%, #1f1408 45%, #140c06 100%)",
    a: "251, 146, 60",
    b: "#fdba74",
    c: "#fb923c",
    d: "251, 191, 36",
    e: "#fcd34d",
    f: "#fde68a",
    shadow: "251, 146, 60",
  },
  jr: {
    bg: "linear-gradient(165deg, #050818 0%, #0a1230 45%, #060a18 100%)",
    a: "96, 165, 250",
    b: "#93c5fd",
    c: "#60a5fa",
    d: "59, 130, 246",
    e: "#3b82f6",
    f: "#bfdbfe",
    shadow: "59, 130, 246",
  },
  cr: {
    bg: "linear-gradient(165deg, #061028 0%, #0c1838 42%, #081220 100%)",
    a: "96, 165, 250",
    b: "#93c5fd",
    c: "#60a5fa",
    d: "251, 191, 36",
    e: "#fbbf24",
    f: "#fde68a",
    shadow: "59, 130, 246",
  },
  gm: {
    bg: "linear-gradient(165deg, #12061f 0%, #1a0a2e 45%, #0f0518 100%)",
    a: "192, 132, 252",
    b: "#d8b4fe",
    c: "#c084fc",
    d: "167, 139, 250",
    e: "#a78bfa",
    f: "#e9d5ff",
    shadow: "167, 139, 250",
  },
  wl: {
    bg: "linear-gradient(165deg, #041612 0%, #062018 45%, #031410 100%)",
    a: "52, 211, 153",
    b: "#6ee7b7",
    c: "#34d399",
    d: "16, 185, 129",
    e: "#10b981",
    f: "#a7f3d0",
    shadow: "16, 185, 129",
  },
  sw: {
    bg: "linear-gradient(165deg, #1a1205 0%, #221808 45%, #140e04 100%)",
    a: "251, 191, 36",
    b: "#fde68a",
    c: "#fbbf24",
    d: "245, 158, 11",
    e: "#f59e0b",
    f: "#fcd34d",
    shadow: "245, 158, 11",
  },
  cb: {
    bg: "linear-gradient(165deg, #041a14 0%, #062820 45%, #031510 100%)",
    a: "45, 212, 191",
    b: "#5eead4",
    c: "#2dd4bf",
    d: "20, 184, 166",
    e: "#14b8a6",
    f: "#99f6e4",
    shadow: "20, 184, 166",
  },
  ck: {
    bg: "linear-gradient(165deg, #1a0818 0%, #220a22 45%, #160612 100%)",
    a: "244, 114, 182",
    b: "#f9a8d4",
    c: "#f472b6",
    d: "236, 72, 153",
    e: "#ec4899",
    f: "#fbcfe8",
    shadow: "236, 72, 153",
  },
  cpl: {
    bg: "linear-gradient(165deg, #140818 0%, #1a0a28 42%, #12061a 100%)",
    a: "192, 132, 252",
    b: "#d8b4fe",
    c: "#c084fc",
    d: "244, 114, 182",
    e: "#f472b6",
    f: "#fbcfe8",
    shadow: "192, 132, 252",
  },
  stk: {
    bg: "linear-gradient(165deg, #041208 0%, #061810 42%, #030a06 100%)",
    a: "52, 211, 153",
    b: "#6ee7b7",
    c: "#34d399",
    d: "251, 191, 36",
    e: "#fbbf24",
    f: "#fde68a",
    shadow: "52, 211, 153",
  },
  fd: {
    bg: "linear-gradient(165deg, #1a0a06 0%, #221008 45%, #140804 100%)",
    a: "248, 113, 113",
    b: "#fca5a5",
    c: "#f87171",
    d: "251, 146, 60",
    e: "#fb923c",
    f: "#fed7aa",
    shadow: "248, 113, 113",
  },
};

function expandHrSelectors(block) {
  return block
    .split("\n")
    .map((line) => {
      if (!line.includes(".hr-")) return line;
      return line.replace(/\.hr-([\w-]+)/g, (_, suffix) =>
        PREFIXES.map((p) => `.${p}-${suffix}`).join(", "),
      );
    })
    .join("\n");
}

function tokenizeThemeColors(block) {
  return block
    .replace(/linear-gradient\(165deg, #060d1f 0%, #0a1530 45%, #070f22 100%\)/g, "var(--lr-bg)")
    .replace(/rgba\(34, 211, 238/g, "rgba(var(--lr-a)")
    .replace(/#67e8f9/g, "var(--lr-b)")
    .replace(/#22d3ee/g, "var(--lr-c)")
    .replace(/rgba\(167, 139, 250/g, "rgba(var(--lr-d)")
    .replace(/#a78bfa/g, "var(--lr-e)")
    .replace(/#c4b5fd/g, "var(--lr-f)")
    .replace(/rgba\(99, 102, 241/g, "rgba(var(--lr-shadow)")
    .replace(/@keyframes hr-sweep/g, "@keyframes lr-sweep")
    .replace(/@keyframes hr-pulse/g, "@keyframes lr-pulse")
    .replace(/\bhr-sweep\b/g, "lr-sweep")
    .replace(/\bhr-pulse\b/g, "lr-pulse");
}

function themeVarBlock(prefix, theme) {
  return `.${prefix}-app {
  --lr-bg: ${theme.bg};
  --lr-a: ${theme.a};
  --lr-b: ${theme.b};
  --lr-c: ${theme.c};
  --lr-d: ${theme.d};
  --lr-e: ${theme.e};
  --lr-f: ${theme.f};
  --lr-shadow: ${theme.shadow};
}`;
}

const hrStart = css.indexOf(HR_START);
let hrEnd = css.indexOf(HR_END);
if (hrStart < 0 || hrEnd < 0) throw new Error("Hotspot Radar CSS block not found");

const dupStart = css.indexOf(DUP_START);
const reducedIdx = css.indexOf(REDUCED);
if (dupStart >= 0 && reducedIdx > dupStart) {
  css = css.slice(0, dupStart) + css.slice(reducedIdx);
  hrEnd = css.indexOf(HR_END);
}

const hrBlock = css.slice(hrStart, hrEnd);
let unified =
  "/* ===== Learn Radar apps (shared layout + per-theme CSS variables) ===== */\n" +
  PREFIXES.map((p) => themeVarBlock(p, THEMES[p])).join("\n\n") +
  "\n\n" +
  tokenizeThemeColors(expandHrSelectors(hrBlock)).replace(
    /\/\* ===== Hotspot Radar mini-app \(Learn tab feed #7\) ===== \*\//,
    "",
  );

css = css.slice(0, hrStart) + unified + "\n\n" + css.slice(hrEnd);

const datingMarker = "/* ===== Dating & Social 101";
if (!css.includes(".ds-app")) {
  const dating = `
/* ===== Dating & Social 101 (Learn tab feed #13) ===== */
.ds-app {
  position: relative;
  width: 100%;
  max-width: var(--hero-max);
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(165deg, #1a0812 0%, #200818 50%, #180610 100%);
  box-shadow: 0 12px 40px rgba(244, 114, 182, 0.14);
  color: #e2e8f0;
}
.ds-glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 45% at 20% 0%, rgba(244, 114, 182, 0.12), transparent 55%),
    radial-gradient(ellipse 45% 35% at 90% 25%, rgba(251, 113, 133, 0.08), transparent 50%);
  z-index: 0;
}
.ds-hero { flex-shrink: 0; padding: 0.85rem 0.85rem 0.5rem; position: relative; z-index: 1; }
.ds-brand { display: flex; align-items: center; gap: 0.65rem; }
.ds-logo { font-size: 1.5rem; width: 2.25rem; height: 2.25rem; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(244, 114, 182, 0.18); }
.ds-title { margin: 0; font-size: 1.05rem; font-weight: 800; line-height: 1.2; }
.ds-title-a { color: #f9a8d4; }
.ds-title-b { color: #fda4af; }
.ds-subtitle { margin: 0.15rem 0 0; font-size: 0.625rem; color: #94a3b8; }
.ds-panel { display: none; flex: 1; min-height: 0; flex-direction: column; padding: 0 0.85rem 0.35rem; overflow: hidden; position: relative; z-index: 1; }
.ds-panel.active { display: flex; }
.ds-intro-card { flex-shrink: 0; padding: 0.75rem 0.85rem; margin-bottom: 0.65rem; border-radius: 14px; background: rgba(30, 15, 25, 0.75); border: 1px solid rgba(244, 114, 182, 0.2); }
.ds-intro-title { margin: 0 0 0.4rem; font-size: 0.8125rem; font-weight: 800; color: #fce7f3; }
.ds-intro-body { margin: 0; font-size: 0.6875rem; line-height: 1.55; color: #94a3b8; }
.ds-section-label { flex-shrink: 0; margin: 0 0 0.5rem; font-size: 0.75rem; font-weight: 800; color: #f9a8d4; }
.ds-panel-head { flex-shrink: 0; margin-bottom: 0.5rem; }
.ds-panel-title { margin: 0; font-size: 0.9375rem; font-weight: 800; color: #fce7f3; }
.ds-panel-sub { margin: 0.15rem 0 0; font-size: 0.625rem; color: #64748b; }
.ds-scroll { flex: 1; min-height: 0; overflow-y: auto; padding-bottom: 3.75rem; }
.ds-guide { margin-bottom: 0.55rem; }
.ds-guide-head { display: flex; align-items: flex-start; gap: 0.55rem; width: 100%; padding: 0.65rem 0.75rem; border: 1px solid rgba(244, 114, 182, 0.15); border-radius: 12px; background: rgba(30, 15, 25, 0.65); cursor: pointer; text-align: left; color: inherit; }
.ds-guide.open .ds-guide-head { border-color: rgba(251, 113, 133, 0.35); background: rgba(30, 15, 25, 0.9); }
.ds-guide-emoji { flex-shrink: 0; font-size: 1.25rem; }
.ds-guide-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.12rem; }
.ds-guide-title { font-size: 0.75rem; font-weight: 800; color: #fce7f3; }
.ds-guide-summary { font-size: 0.625rem; color: #64748b; line-height: 1.4; }
.ds-guide-meta { flex-shrink: 0; font-size: 0.5625rem; font-weight: 700; color: #fda4af; }
.ds-guide-body { display: none; padding: 0.5rem 0.75rem 0.65rem 2.35rem; }
.ds-guide.open .ds-guide-body { display: block; }
.ds-task { display: flex; align-items: flex-start; gap: 0.5rem; padding: 0.4rem 0; cursor: pointer; font-size: 0.6875rem; color: #cbd5e1; }
.ds-task.done .ds-task-label { color: #64748b; text-decoration: line-through; }
.ds-task-check { flex-shrink: 0; margin-top: 0.1rem; accent-color: #f472b6; }
.ds-filter-scroll { flex-shrink: 0; display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.5rem; }
.ds-filter { padding: 0.28rem 0.6rem; border-radius: 999px; border: 1px solid rgba(244, 114, 182, 0.2); background: rgba(30, 15, 25, 0.6); color: #94a3b8; font-size: 0.5625rem; font-weight: 600; cursor: pointer; }
.ds-filter.active { border-color: rgba(244, 114, 182, 0.5); background: rgba(244, 114, 182, 0.15); color: #f9a8d4; }
.ds-scenario { padding: 0.7rem 0.75rem; margin-bottom: 0.45rem; border-radius: 12px; background: rgba(30, 15, 25, 0.7); border: 1px solid rgba(244, 114, 182, 0.12); }
.ds-scenario-tag { display: inline-block; font-size: 0.5rem; font-weight: 700; color: #fda4af; margin-bottom: 0.25rem; }
.ds-scenario-title { margin: 0 0 0.35rem; font-size: 0.75rem; font-weight: 800; color: #fce7f3; }
.ds-scenario-situation, .ds-scenario-tip { margin: 0.25rem 0 0; font-size: 0.625rem; line-height: 1.45; color: #94a3b8; }
.ds-disclaimer { flex-shrink: 0; margin: 0 0 0.55rem; padding: 0.55rem 0.65rem; border-radius: 10px; background: rgba(248, 113, 113, 0.08); border: 1px solid rgba(248, 113, 113, 0.2); font-size: 0.5625rem; line-height: 1.5; color: #fca5a5; }
.ds-flags-label, .ds-resources-label, .ds-tips-label { flex-shrink: 0; margin: 0.5rem 0 0.35rem; font-size: 0.6875rem; font-weight: 700; color: #f9a8d4; }
.ds-red-flags { margin: 0 0 0.65rem; padding: 0 0 0 1rem; font-size: 0.625rem; color: #fda4af; line-height: 1.45; }
.ds-red-flag { margin-bottom: 0.25rem; }
.ds-resource { display: flex; flex-direction: column; gap: 0.12rem; padding: 0.65rem 0.75rem; margin-bottom: 0.4rem; border-radius: 12px; background: rgba(30, 15, 25, 0.6); border: 1px solid rgba(244, 114, 182, 0.12); text-decoration: none; color: inherit; }
.ds-resource-tag { font-size: 0.5rem; font-weight: 700; color: #fda4af; }
.ds-resource-name { font-size: 0.75rem; font-weight: 800; color: #fce7f3; }
.ds-resource-desc { font-size: 0.5625rem; color: #94a3b8; line-height: 1.4; }
.ds-tips { margin: 0 0 3.5rem; padding: 0 0 0 1rem; font-size: 0.625rem; color: #94a3b8; line-height: 1.5; }
.ds-tip { margin-bottom: 0.35rem; }
.ds-nav { flex-shrink: 0; display: flex; justify-content: space-around; padding: 0.45rem 0.25rem calc(0.45rem + env(safe-area-inset-bottom, 0)); background: rgba(26, 8, 18, 0.94); border-top: 1px solid rgba(244, 114, 182, 0.15); z-index: 5; position: relative; }
.ds-nav-btn { display: flex; flex-direction: column; align-items: center; gap: 0.12rem; border: none; background: transparent; color: #64748b; font-size: 0.5rem; font-weight: 600; cursor: pointer; padding: 0.2rem 0.35rem; }
.ds-nav-btn span { font-size: 0.9375rem; }
.ds-nav-btn.active { color: #f9a8d4; }
`;
  const insertAt = css.indexOf(HR_END);
  if (insertAt >= 0) css = css.slice(0, insertAt) + dating + "\n" + css.slice(insertAt);
}

fs.writeFileSync(cssPath, css);
console.log("Radar CSS unified:", PREFIXES.length, "themes via CSS variables; duplicates removed.");
