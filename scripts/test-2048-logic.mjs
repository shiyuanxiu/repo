/**
 * Gabriele Cirulli 2048 — core logic tests (mirrors 2048.html)
 */
const SIZE = 4;

function emptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function slideLineLeft(line) {
  const tiles = line.filter((v) => v !== 0);
  const out = [];
  let score = 0;
  let i = 0;
  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
      const m = tiles[i] * 2;
      out.push(m);
      score += m;
      i += 2;
    } else {
      out.push(tiles[i]);
      i += 1;
    }
  }
  while (out.length < SIZE) out.push(0);
  const moved = out.some((v, idx) => v !== line[idx]);
  return { line: out, score, moved };
}

function slideLineRight(line) {
  const rev = slideLineLeft([...line].reverse());
  return { line: rev.line.reverse(), score: rev.score, moved: rev.moved };
}

function moveBoard(board, dir) {
  const next = emptyBoard();
  let totalScore = 0;
  let moved = false;

  if (dir === "left" || dir === "right") {
    for (let r = 0; r < SIZE; r++) {
      const row = [...board[r]];
      const res = dir === "left" ? slideLineLeft(row) : slideLineRight(row);
      next[r] = res.line;
      totalScore += res.score;
      if (res.moved) moved = true;
    }
  } else {
    for (let c = 0; c < SIZE; c++) {
      const col = [board[0][c], board[1][c], board[2][c], board[3][c]];
      const res = dir === "up" ? slideLineLeft(col) : slideLineRight(col);
      for (let r = 0; r < SIZE; r++) next[r][c] = res.line[r];
      totalScore += res.score;
      if (res.moved) moved = true;
    }
  }
  return { board: next, score: totalScore, moved };
}

function spawnOne(board, rng) {
  const slots = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (!board[r][c]) slots.push({ r, c });
  }
  if (!slots.length) return { board, spawned: false };
  const slot = slots[Math.floor(rng() * slots.length)];
  const next = board.map((row) => row.slice());
  next[slot.r][slot.c] = rng() < 0.9 ? 2 : 4;
  return { board: next, spawned: true, value: next[slot.r][slot.c] };
}

function countTiles(board) {
  let n = 0;
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (board[r][c]) n++;
  return n;
}

function canMove(board) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = board[r][c];
      if (!v) return true;
      if (c + 1 < SIZE && board[r][c + 1] === v) return true;
      if (r + 1 < SIZE && board[r + 1][c] === v) return true;
    }
  }
  return false;
}

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function startBoard(rng) {
  let b = emptyBoard();
  b = spawnOne(b, rng).board;
  b = spawnOne(b, rng).board;
  return b;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`✓ ${name}`);
}

test("start board has exactly 2 tiles", () => {
  const b = startBoard(mulberry32(1));
  assert(countTiles(b) === 2, `expected 2 got ${countTiles(b)}`);
});

test("[2,2,2,0] right → [0,0,2,4] score +4", () => {
  const { line, score } = slideLineRight([2, 2, 2, 0]);
  assert(JSON.stringify(line) === JSON.stringify([0, 0, 2, 4]), JSON.stringify(line));
  assert(score === 4, `score ${score}`);
});

test("[2,2,4,4] left → [4,8,0,0] score +12", () => {
  const { line, score } = slideLineLeft([2, 2, 4, 4]);
  assert(JSON.stringify(line) === JSON.stringify([4, 8, 0, 0]), JSON.stringify(line));
  assert(score === 12, `score ${score}`);
});

test("[4,4,4,4] left → [8,8,0,0] not 16", () => {
  const { line, score } = slideLineLeft([4, 4, 4, 4]);
  assert(JSON.stringify(line) === JSON.stringify([8, 8, 0, 0]), JSON.stringify(line));
  assert(score === 16, `score ${score}`);
});

test("no move → no spawn", () => {
  const b = [
    [2, 4, 2, 4],
    [4, 2, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 2],
  ];
  const { moved } = moveBoard(b, "left");
  assert(!moved, "full alternating board should not move left");
});

test("score equals merged tile values", () => {
  let b = emptyBoard();
  b[0] = [2, 2, 0, 0];
  const { board, score, moved } = moveBoard(b, "left");
  assert(moved, "moved");
  assert(board[0][0] === 4 && board[0][1] === 0, JSON.stringify(board[0]));
  assert(score === 4, `score ${score}`);
});

test("spawn uses 90/10 with fixed rng", () => {
  const rng = mulberry32(99);
  const b = emptyBoard();
  b[1][1] = 2;
  const vals = [];
  for (let i = 0; i < 20; i++) {
    const empty = emptyBoard();
    empty[0][0] = 2;
    const s = spawnOne(empty, mulberry32(100 + i));
    vals.push(s.value);
  }
  assert(vals.includes(2) && vals.includes(4), "both values possible");
});

test("full board no moves → canMove false", () => {
  const b = [
    [2, 4, 2, 4],
    [4, 2, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 2],
  ];
  assert(!canMove(b), "dead board");
});

console.log(`\n${passed} tests passed`);
