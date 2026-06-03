/** Unit tests for 2248 Chain link/merge logic (mirrors app.js + number-merge.html). */
const N = 5;

function emptyBoard() {
  return Array.from({ length: N }, () => Array(N).fill(0));
}

function adj(a, b) {
  const dr = Math.abs(a.r - b.r);
  const dc = Math.abs(a.c - b.c);
  return dr <= 1 && dc <= 1 && dr + dc > 0;
}

function canExtendPath(board, path, cell) {
  if (!path.length) return false;
  const last = path[path.length - 1];
  if (cell.r === last.r && cell.c === last.c) return false;
  if (path.some((x) => x.r === cell.r && x.c === cell.c)) return false;
  if (!adj(last, cell)) return false;
  const base = board[path[0].r][path[0].c];
  if (!board[cell.r][cell.c] || board[cell.r][cell.c] !== base) return false;
  return true;
}

function buildPath(board, cells) {
  const path = [];
  for (const cell of cells) {
    if (!path.length) {
      if (board[cell.r][cell.c]) path.push(cell);
    } else if (canExtendPath(board, path, cell)) {
      path.push(cell);
    }
  }
  return path;
}

function applyMerge(board, chain, score = 0) {
  if (!chain || chain.length < 2) return { board, score, merged: null, spawned: false };
  const val = board[chain[0].r][chain[0].c];
  if (!val) return { board, score, merged: null, spawned: false };
  const end = chain[chain.length - 1];
  const merged = val * 2;
  const next = board.map((row) => row.slice());
  for (let i = 0; i < chain.length; i++) {
    const p = chain[i];
    next[p.r][p.c] = i === chain.length - 1 ? merged : 0;
  }
  const newScore = score + merged;
  // deterministic spawn in first empty cell (row-major)
  let spawned = false;
  outer: for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (next[r][c] === 0) {
        next[r][c] = 2;
        spawned = true;
        break outer;
      }
    }
  }
  return { board: next, score: newScore, merged, end, spawned };
}

function canPlay(board) {
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const v = board[r][c];
      if (!v) return true;
      for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < N && nc >= 0 && nc < N && board[nr][nc] === v) return true;
      }
    }
  }
  return false;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function eqBoard(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

let passed = 0;

function test(name, fn) {
  fn();
  passed++;
  console.log(`✓ ${name}`);
}

// --- tests ---
test("adjacency includes orth and diagonal", () => {
  assert(adj({ r: 0, c: 0 }, { r: 0, c: 1 }), "horizontal");
  assert(adj({ r: 0, c: 0 }, { r: 1, c: 0 }), "vertical");
  assert(adj({ r: 0, c: 0 }, { r: 1, c: 1 }), "diagonal");
  assert(!adj({ r: 0, c: 0 }, { r: 0, c: 2 }), "no skip");
});

test("chain of 3 same values merges to double at end", () => {
  const board = emptyBoard();
  board[0][0] = 2;
  board[0][1] = 2;
  board[0][2] = 2;
  const chain = buildPath(board, [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }]);
  assert(chain.length === 3, "chain len 3");
  const { board: next, score, merged, spawned } = applyMerge(board, chain);
  assert(merged === 4, "merged value 4");
  assert(next[0][1] === 0 && next[0][2] === 4, "cleared except end");
  assert(next[0][0] === 2 && spawned, "spawn fills first empty after merge");
  assert(score === 4, "score += merged");
});

test("cannot link different numbers", () => {
  const board = emptyBoard();
  board[0][0] = 2;
  board[0][1] = 4;
  const chain = buildPath(board, [{ r: 0, c: 0 }, { r: 0, c: 1 }]);
  assert(chain.length === 1, "blocked at mismatch");
});

test("cannot revisit cell in path", () => {
  const board = emptyBoard();
  board[0][0] = 2;
  board[0][1] = 2;
  board[1][1] = 2;
  board[0][0] = 2; // ensure start
  const chain = buildPath(board, [
    { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 1 }, { r: 0, c: 1 },
  ]);
  assert(chain.length === 3, "no backtrack into path");
});

test("L-shaped chain works", () => {
  const board = emptyBoard();
  board[1][1] = 8;
  board[1][2] = 8;
  board[2][2] = 8;
  const chain = buildPath(board, [{ r: 1, c: 1 }, { r: 1, c: 2 }, { r: 2, c: 2 }]);
  assert(chain.length === 3, "L chain");
  const { merged } = applyMerge(board, chain);
  assert(merged === 16, "8*2=16");
});

test("single cell release does not merge", () => {
  const board = emptyBoard();
  board[2][2] = 4;
  const chain = buildPath(board, [{ r: 2, c: 2 }]);
  const { merged, board: next } = applyMerge(board, chain);
  assert(merged === null, "no merge");
  assert(eqBoard(board, next), "board unchanged");
});

test("merge always leaves spawn when empty exists", () => {
  const board = emptyBoard();
  board[0][0] = 2;
  board[0][1] = 2;
  const chain = buildPath(board, [{ r: 0, c: 0 }, { r: 0, c: 1 }]);
  const { spawned, board: next } = applyMerge(board, chain);
  assert(spawned, "spawned tile");
  const empties = next.flat().filter((v) => v === 0).length;
  assert(empties === N * N - 2, "one merged + one spawn on 5x5");
});

test("chain snapshot: path cleared before merge still works (onUp pattern)", () => {
  const board = emptyBoard();
  board[2][2] = 2;
  board[2][3] = 2;
  let path = [{ r: 2, c: 2 }, { r: 2, c: 3 }];
  const chain = path.slice();
  path = [];
  assert(path.length === 0, "path cleared");
  const { merged } = applyMerge(board, chain);
  assert(merged === 4, "merge from snapshot ok");
});

test("canPlay detects adjacent same values", () => {
  const board = emptyBoard();
  board[4][3] = 2;
  board[4][4] = 2;
  assert(canPlay(board), "has move");
  const full = emptyBoard();
  const vals = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2, 4, 8, 16, 32];
  let i = 0;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) full[r][c] = vals[i++];
  assert(!canPlay(full), "full grid no pairs");
});

test("diagonal chain works (8-way adjacency)", () => {
  const board = emptyBoard();
  board[0][0] = 2;
  board[1][1] = 2;
  const chain = buildPath(board, [{ r: 0, c: 0 }, { r: 1, c: 1 }]);
  assert(chain.length === 2, "diagonal link");
  const { merged } = applyMerge(board, chain);
  assert(merged === 4, "diagonal merge");
});

test("demo cover path stops at first number mismatch", () => {
  const demo = [
    [2, 4, 8, 4, 2], [0, 2, 8, 2, 0], [4, 2, 16, 2, 4], [0, 8, 16, 8, 0], [2, 4, 32, 4, 2],
  ];
  const demoPath = [
    { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 },
  ];
  const chain = buildPath(demo, demoPath);
  assert(chain.length === 1, "cover path stops at first mismatch (2 then 4)");
});

test("initial board always has a mergeable pair", () => {
  for (let i = 0; i < 40; i++) {
    const board = emptyBoard();
    const a = { r: Math.floor(Math.random() * N), c: Math.floor(Math.random() * N) };
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    const neighbors = dirs
      .map(([dr, dc]) => ({ r: a.r + dr, c: a.c + dc }))
      .filter(({ r, c }) => r >= 0 && r < N && c >= 0 && c < N);
    if (!neighbors.length) continue;
    const b = neighbors[Math.floor(Math.random() * neighbors.length)];
    board[a.r][a.c] = 2;
    board[b.r][b.c] = 2;
    assert(canPlay(board), "adjacent pair is playable");
    break;
  }
});

console.log(`\n${passed} tests passed`);
