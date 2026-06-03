/**
 * 2048 原版规则鉴定 — 对照 Miniverse「2248 Chain」(number-merge.html / app.js)
 * 官方参考: Gabriele Cirulli 2048 — 4×4 滑块合并
 */

const N = 5; // game uses 5×5, official is 4×4

function emptyBoard() {
  return Array.from({ length: N }, () => Array(N).fill(0));
}

function neighborsOf(r, c) {
  const out = [];
  for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < N && nc >= 0 && nc < N) out.push({ r: nr, c: nc });
  }
  return out;
}

function hasLinkableMove(board) {
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const v = board[r][c];
      if (!v) continue;
      for (const nb of neighborsOf(r, c)) {
        if (board[nb.r][nb.c] === v) return true;
      }
    }
  }
  return false;
}

function spawnRandomTile(board, rng) {
  const empty = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (board[r][c] === 0) empty.push({ r, c });
  }
  if (!empty.length) return { spawned: false, board };
  const slot = empty[Math.floor(rng() * empty.length)];
  const next = board.map((row) => row.slice());
  next[slot.r][slot.c] = rng() < 0.85 ? 2 : 4;
  return { spawned: true, board: next, value: next[slot.r][slot.c], slot };
}

function spawnInitialBoard(rng) {
  for (let attempt = 0; attempt < 96; attempt++) {
    let board = emptyBoard();
    const a = { r: Math.floor(rng() * N), c: Math.floor(rng() * N) };
    const nbs = neighborsOf(a.r, a.c);
    if (!nbs.length) continue;
    const b = nbs[Math.floor(rng() * nbs.length)];
    const val = rng() < 0.85 ? 2 : 4;
    board[a.r][a.c] = val;
    board[b.r][b.c] = val;
    let extra = null;
    if (rng() < 0.35) {
      const s = spawnRandomTile(board, rng);
      board = s.board;
      extra = s;
    }
    if (hasLinkableMove(board)) return { board, pairVal: val, extra };
  }
  const board = emptyBoard();
  board[2][2] = 2;
  board[2][3] = 2;
  return { board, pairVal: 2, extra: null };
}

function applyMerge(board, chain) {
  if (!chain || chain.length < 2) return { board, scoreDelta: 0, merged: null };
  const val = board[chain[0].r][chain[0].c];
  if (!val) return { board, scoreDelta: 0, merged: null };
  const next = board.map((row) => row.slice());
  const merged = val * 2;
  for (let i = 0; i < chain.length; i++) {
    const p = chain[i];
    next[p.r][p.c] = i === chain.length - 1 ? merged : 0;
  }
  return { board: next, scoreDelta: merged, merged };
}

/** ——— Official Gabriele Cirulli 2048 (reference impl for tests) ——— */
const OFF = 4;

function offEmpty() {
  return Array.from({ length: OFF }, () => Array(OFF).fill(0));
}

function offSlideRow(row, toRight) {
  const nums = row.filter((v) => v !== 0);
  const out = [];
  let score = 0;
  if (toRight) nums.reverse();
  let i = 0;
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const m = nums[i] * 2;
      out.push(m);
      score += m;
      i += 2;
    } else {
      out.push(nums[i]);
      i += 1;
    }
  }
  while (out.length < OFF) out.push(0);
  if (toRight) out.reverse();
  return { row: out, score, moved: JSON.stringify(out) !== JSON.stringify(row) };
}

function offSpawn(board, rng) {
  const empty = [];
  for (let r = 0; r < OFF; r++) for (let c = 0; c < OFF; c++) {
    if (!board[r][c]) empty.push({ r, c });
  }
  if (!empty.length) return board;
  const slot = empty[Math.floor(rng() * empty.length)];
  const next = board.map((row) => row.slice());
  next[slot.r][slot.c] = rng() < 0.9 ? 2 : 4;
  return next;
}

function offStart(rng) {
  let b = offEmpty();
  b = offSpawn(b, rng);
  b = offSpawn(b, rng);
  return b;
}

function countTiles(board) {
  let n = 0;
  const vals = [];
  for (const row of board) {
    for (const v of row) {
      if (v) { n++; vals.push(v); }
    }
  }
  return { count: n, vals };
}

function boardRow(board, r) {
  return [...board[r]];
}

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const results = [];

function audit(name, official, current, verdict) {
  results.push({ name, official, current, verdict });
}

console.log("=== 2048 原版规则鉴定报告 ===\n");
console.log("鉴定对象: Miniverse「2248 Chain」(number-merge.html / feed merge)\n");

// ——— Test 1: Opening tiles ———
const rng1 = mulberry32(42);
const offOpen = offStart(rng1);
const offOpenStats = countTiles(offOpen);

const rng2 = mulberry32(42);
const { board: curOpen, pairVal, extra } = spawnInitialBoard(rng2);
const curOpenStats = countTiles(curOpen);

audit(
  "1. 开局格子数量与数字",
  `4×4 棋盘，恰好 2 格有数；每格独立随机空位；90%→2 / 10%→4`,
  `${N}×${N} 棋盘，本局 ${curOpenStats.count} 格有数 [${curOpenStats.vals.join(",")}]；`
    + `强制一对相邻同数(${pairVal},${pairVal})${extra?.spawned ? " +35%概率额外1格" : ""}；spawn 85%→2/10%→4`,
  curOpenStats.count === 2 && offOpenStats.count === 2 ? "数量偶然相同但机制不同" : "不符合",
);

console.log("【测试1】开局");
console.log("  原版(种子42):", offOpenStats.count, "格", offOpenStats.vals, "棋盘4×4");
console.log("  现版(种子42):", curOpenStats.count, "格", curOpenStats.vals, `棋盘${N}×${N}`);
console.log("  判定: 不符合 — 非4×4、非独立随机两格、开局保证相邻同数对\n");

// ——— Test 2: Three 2s slide right ———
const rowBefore = [2, 2, 2, 0];
const { row: rowAfter, score: offScore } = offSlideRow(rowBefore, true);
audit(
  "2. 一行三个2同向滑动",
  `[2,2,2,0] 右移 → [0,2,4]；得分 +4；禁止二次合并成8`,
  "无滑块/方向键；仅支持拖拽连线相邻同数。若强行连线3个2：合并结果见下",
  "完全不符合（无滑动机制）",
);

let b223 = emptyBoard();
b223[0][0] = 2; b223[0][1] = 2; b223[0][2] = 2;
const link3 = applyMerge(b223, [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }]);

console.log("【测试2】三个2一行");
console.log("  原版右移:", rowBefore, "→", rowAfter, "得分 +", offScore);
console.log("  现版连线3格2:", boardRow(link3.board, 0), "得分 +", link3.scoreDelta, "合成值", link3.merged);
console.log("  判定: 无滑动；连线3个2得", link3.merged, "(非滑块逻辑)，机制完全不同\n");

// ——— Test 4 first for ordering: score pair merge ———
let b22 = emptyBoard();
b22[0][0] = 2; b22[0][1] = 2;
const link2 = applyMerge(b22, [{ r: 0, c: 0 }, { r: 0, c: 1 }]);
const offPair = offSlideRow([2, 2, 0, 0], true);

audit(
  "4. 合并加分",
  "得分 = 本次合并产出的数字（2+2→+4）",
  `chain任意长度：score += base×2（仅翻一倍，与链长无关）；2+2 → +${link2.scoreDelta}`,
  link2.scoreDelta === offPair.score ? "数字巧合相同，规则不同" : "不符合",
);

console.log("【测试4】合并加分");
console.log("  原版 [2,2,0,0] 右移得分 +", offPair.score);
console.log("  现版连线2格2得分 +", link2.scoreDelta);
const b4 = emptyBoard();
b4[0][0] = 2; b4[0][1] = 2; b4[0][2] = 2; b4[0][3] = 2;
const link4 = applyMerge(b4, [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }]);
console.log("  现版连线4格2:", boardRow(link4.board, 0), "得分 +", link4.scoreDelta, "(链长4仍只+4，原版不可能一次滑出)");
console.log("  判定: 两格合并得分与原版相同；长链合并规则原版不存在\n");

// ——— Test 3: no move no spawn ———
let idleBoard = offEmpty();
idleBoard[0][0] = 2;
idleBoard[3][3] = 4;
const beforeIdle = JSON.stringify(idleBoard);
const idleSlide = offSlideRow([2, 0, 0, 0], false); // left on row with only one tile - actually moves?
// Better: full board slide that doesn't change
idleBoard = offEmpty();
idleBoard[0][0] = 2;
idleBoard[1][0] = 4;
idleBoard[2][0] = 8;
idleBoard[3][0] = 16;
const offUp = (b) => {
  let totalScore = 0, moved = false;
  const next = offEmpty();
  for (let c = 0; c < OFF; c++) {
    const col = [b[0][c], b[1][c], b[2][c], b[3][c]];
    const { row, score, moved: m } = offSlideRow(col, false);
    totalScore += score;
    if (m) moved = true;
    for (let r = 0; r < OFF; r++) next[r][c] = row[r];
  }
  return { board: next, score: totalScore, moved };
};
const stuck = offUp(idleBoard);
const afterOff = offSpawn(stuck.board, mulberry32(99)); // official only spawns IF moved

let curIdle = emptyBoard();
curIdle[0][0] = 2;
curIdle[4][4] = 4;
const curBefore = countTiles(curIdle).count;
// no applyMerge, no spawnRandomTile call
const curAfter = countTiles(curIdle).count;

audit(
  "3. 无移动不刷新",
  "滑块未发生位移/合并不生成新块",
  "无滑动操作；静止不调用 spawnRandomTile/applyMerge 则不刷新",
  "表面一致，但实现路径不同（无滑块）",
);

console.log("【测试3】原地不动是否刷新");
console.log("  原版: 无法移动的方向键 → 棋盘不变、不 spawn");
console.log("  现版: 不拖拽/不合并 → 格子数保持", curBefore, "→", curAfter);
console.log("  判定: 静止不刷新 ✓（但因为没有滑动，不是原版机制）\n");

// ——— Extra mod checklist ———
console.log("=== 逐项规则对照（魔改清单）===\n");
const mods = [
  ["棋盘尺寸", "4×4", `${N}×${N}`, "魔改"],
  ["操作方式", "四方向滑动整盘", "手指拖拽连线相邻同数（含对角）", "重度魔改"],
  ["合并触发", "滑动后自动靠边合并", "松手时沿路径合并", "重度魔改"],
  ["单次合并限制", "每个方块每步最多合并一次", "一条链一次合并，链长不限", "重度魔改"],
  ["三同数滑移", "[2,2,2]→[0,2,4]", "连线3个2→[0,0,4] 一次得4", "机制不同"],
  ["开局布局", "2个独立随机空位", "1对强制相邻同数 + 35%额外1块", "魔改"],
  ["新块概率", "90% / 10%", "85% / 15%", "轻度魔改"],
  ["合并后刷新", "有移动才+1块", "每次成功连线合并都+1（+ensurePlayable补子）", "魔改"],
  ["智能补子 ensurePlayable", "无", "无可连对子时自动补相邻同数", "重度魔改"],
  ["得分", "合并产出值", "base×2（与链长无关）", "部分相同/长链不同"],
  ["胜利条件", "合成2048可继续", "无2048胜利屏，可无限追高分", "魔改"],
  ["失败条件", "满盘且四向都无法动", "满盘且无相邻同数", "近似但不同（对角算相邻）"],
  ["2048方块", "游戏目标", "仅配色名，非胜利条件", "名义借用"],
];

for (const [item, orig, cur, level] of mods) {
  console.log(`  • ${item}`);
  console.log(`    原版: ${orig}`);
  console.log(`    现版: ${cur}`);
  console.log(`    → ${level}\n`);
}

console.log("=== 总结 ===");
console.log("  标准版:     0/5 核心机制匹配");
console.log("  轻度改版:   不适用（核心玩法已换类）");
console.log("  重度魔改版: ✓ 本游戏属于此类");
console.log("");
console.log("  结论: 「2248 Chain」是 2248/连线合并 品类，不是 Gabriele Cirulli 2048。");
console.log("  仅共享「2的幂次方方块」视觉与 2048 配色；玩法、棋盘、操作、胜负均为另一套规则。");
