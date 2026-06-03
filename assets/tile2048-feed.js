/**
 * Classic Gabriele Cirulli 2048 — Miniverse feed embed (replaces 2248 Chain slot).
 */
(() => {
  "use strict";

  const SIZE = 4;
  const WIN = 2048;
  const BEST_KEY = "classic-2048-best";

  const landing = document.getElementById("tile2048Landing");
  const play = document.getElementById("tile2048Play");
  const startBtn = document.getElementById("tile2048StartBtn");
  const backBtn = document.getElementById("tile2048BackBtn");
  const newBtn = document.getElementById("tile2048NewBtn");
  const gridEl = document.getElementById("tile2048Grid");
  const boardWrap = document.getElementById("tile2048BoardWrap");
  const scoreEl = document.getElementById("tile2048Score");
  const bestEl = document.getElementById("tile2048Best");
  const hintEl = document.getElementById("tile2048Hint");
  const winOverlay = document.getElementById("tile2048Win");
  const loseOverlay = document.getElementById("tile2048Lose");
  const loseMsg = document.getElementById("tile2048LoseMsg");
  const keepBtn = document.getElementById("tile2048KeepBtn");
  const winNewBtn = document.getElementById("tile2048WinNewBtn");
  const retryBtn = document.getElementById("tile2048RetryBtn");
  const feed = document.getElementById("feed");
  const card = document.getElementById("mergeCard");

  if (!gridEl || !play) return;

  let board = [];
  let score = 0;
  let best = parseInt(localStorage.getItem(BEST_KEY) || "0", 10);
  let won = false;
  let keepPlaying = false;
  let over = false;
  let active = false;
  let cells = [];
  let bound = false;

  function emptyBoard() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  }

  function slideLineLeft(line) {
    const tiles = line.filter((v) => v !== 0);
    const out = [];
    let sc = 0;
    let i = 0;
    while (i < tiles.length) {
      if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
        const m = tiles[i] * 2;
        out.push(m);
        sc += m;
        i += 2;
      } else {
        out.push(tiles[i]);
        i += 1;
      }
    }
    while (out.length < SIZE) out.push(0);
    return { line: out, score: sc, moved: out.some((v, idx) => v !== line[idx]) };
  }

  function slideLineRight(line) {
    const rev = slideLineLeft([...line].reverse());
    return { line: rev.line.reverse(), score: rev.score, moved: rev.moved };
  }

  function moveBoard(b, dir) {
    const next = emptyBoard();
    let totalScore = 0;
    let moved = false;
    if (dir === "left" || dir === "right") {
      for (let r = 0; r < SIZE; r++) {
        const res = dir === "left" ? slideLineLeft([...b[r]]) : slideLineRight([...b[r]]);
        next[r] = res.line;
        totalScore += res.score;
        if (res.moved) moved = true;
      }
    } else {
      for (let c = 0; c < SIZE; c++) {
        const col = [b[0][c], b[1][c], b[2][c], b[3][c]];
        const res = dir === "up" ? slideLineLeft(col) : slideLineRight(col);
        for (let r = 0; r < SIZE; r++) next[r][c] = res.line[r];
        totalScore += res.score;
        if (res.moved) moved = true;
      }
    }
    return { board: next, score: totalScore, moved };
  }

  function spawnOne(b) {
    const slots = [];
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      if (!b[r][c]) slots.push({ r, c });
    }
    if (!slots.length) return false;
    const slot = slots[Math.floor(Math.random() * slots.length)];
    b[slot.r][slot.c] = Math.random() < 0.9 ? 2 : 4;
    return true;
  }

  function canMove(b) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const v = b[r][c];
        if (!v) return true;
        if (c + 1 < SIZE && b[r][c + 1] === v) return true;
        if (r + 1 < SIZE && b[r + 1][c] === v) return true;
      }
    }
    return false;
  }

  function hasWinTile(b) {
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      if (b[r][c] >= WIN) return true;
    }
    return false;
  }

  function maxTile(b) {
    let m = 0;
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      m = Math.max(m, b[r][c] || 0);
    }
    return m;
  }

  function tileClass(v) {
    if (!v) return "";
    if (v <= 2048) return `tile-${v}`;
    return "tile-super";
  }

  function setFeedLock(on) {
    feed?.classList.toggle("tile2048-interacting", on);
    card?.classList.toggle("tile2048-interacting", on);
    card?.closest(".feed-item")?.classList.toggle("tile2048-feed-locked", on);
  }

  function playFx(kind) {
    if (typeof soundState !== "undefined" && !soundState.merge) return;
    if (typeof unlockAudioSync === "function") unlockAudioSync();
    if (typeof getAudioCtx !== "function") return;
    try {
      const ctx = getAudioCtx();
      const t = ctx.currentTime;
      const tone = (freq, dur, vol = 0.06) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = freq;
        g.gain.setValueAtTime(vol, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        o.connect(g).connect(ctx.destination);
        o.start(t);
        o.stop(t + dur);
      };
      if (kind === "move") tone(280, 0.05, 0.04);
      else if (kind === "merge") tone(420, 0.08, 0.06);
      else if (kind === "win") { tone(523, 0.1); tone(659, 0.12); tone(784, 0.14); }
      else if (kind === "over") tone(180, 0.3, 0.07);
    } catch (_) { /* noop */ }
  }

  function buildGrid() {
    gridEl.innerHTML = "";
    cells = [];
    for (let i = 0; i < 16; i++) {
      const el = document.createElement("div");
      el.className = "tile2048-cell";
      el.setAttribute("role", "gridcell");
      gridEl.appendChild(el);
      cells.push(el);
    }
  }

  function render() {
    let i = 0;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const v = board[r][c];
        const el = cells[i++];
        el.textContent = v || "";
        el.className = "tile2048-cell" + (v ? ` ${tileClass(v)}` : "");
      }
    }
    if (scoreEl) scoreEl.textContent = String(score);
    if (bestEl) bestEl.textContent = String(best);
  }

  function saveBest() {
    if (score > best) {
      best = score;
      localStorage.setItem(BEST_KEY, String(best));
    }
  }

  function showScene(el) {
    landing?.classList.add("hidden");
    play?.classList.add("hidden");
    el?.classList.remove("hidden");
  }

  function checkEnd() {
    if (!won && hasWinTile(board)) {
      won = true;
      if (!keepPlaying) {
        winOverlay?.classList.remove("hidden");
        playFx("win");
      }
    }
    if (!canMove(board)) {
      over = true;
      active = false;
      loseOverlay?.classList.remove("hidden");
      if (loseMsg) loseMsg.textContent = `Score ${score} · No moves left.`;
      playFx("over");
    }
  }

  function newGame() {
    board = emptyBoard();
    score = 0;
    over = false;
    won = false;
    keepPlaying = false;
    active = true;
    winOverlay?.classList.add("hidden");
    loseOverlay?.classList.add("hidden");
    spawnOne(board);
    spawnOne(board);
    if (hintEl) hintEl.textContent = "Swipe or arrow keys · classic 2048 rules";
    render();
  }

  function act(dir) {
    if (!active || over) return;
    const { board: next, score: delta, moved } = moveBoard(board, dir);
    if (!moved) return;
    board = next;
    score += delta;
    saveBest();
    playFx(delta > 0 ? "merge" : "move");
    spawnOne(board);
    render();
    checkEnd();
  }

  function bindSwipe() {
    if (!boardWrap) return;
    let x0 = 0, y0 = 0, tracking = false;
    const TH = 20;
    const pe = { passive: false };
    boardWrap.addEventListener("pointerdown", (e) => {
      if (!active || over) return;
      e.stopPropagation();
      tracking = true;
      x0 = e.clientX;
      y0 = e.clientY;
      setFeedLock(true);
      try { boardWrap.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
    }, pe);
    const end = (e) => {
      if (!tracking) return;
      tracking = false;
      setFeedLock(false);
      const dx = e.clientX - x0;
      const dy = e.clientY - y0;
      if (Math.hypot(dx, dy) < TH) return;
      if (Math.abs(dx) > Math.abs(dy)) act(dx > 0 ? "right" : "left");
      else act(dy > 0 ? "down" : "up");
    };
    boardWrap.addEventListener("pointerup", end, pe);
    boardWrap.addEventListener("pointercancel", () => { tracking = false; setFeedLock(false); });
  }

  function bindKeys() {
    if (window.__tile2048KeysBound) return;
    window.__tile2048KeysBound = true;
    document.addEventListener("keydown", (e) => {
      if (!active || !play || play.classList.contains("hidden")) return;
      const map = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", s: "down", a: "left", d: "right",
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      act(dir);
    });
  }

  function init() {
    if (bestEl) bestEl.textContent = String(best);
    buildGrid();
    if (bound) return;
    bound = true;
    bindSwipe();
    bindKeys();

    startBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (typeof unlockAudioSync === "function") unlockAudioSync();
      showScene(play);
      newGame();
    });
    backBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      active = false;
      over = false;
      setFeedLock(false);
      showScene(landing);
    });
    newBtn?.addEventListener("click", (e) => { e.stopPropagation(); newGame(); });
    retryBtn?.addEventListener("click", (e) => { e.stopPropagation(); newGame(); });
    winNewBtn?.addEventListener("click", (e) => { e.stopPropagation(); newGame(); });
    keepBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      keepPlaying = true;
      winOverlay?.classList.add("hidden");
    });
  }

  window.Tile2048Feed = {
    init,
    getScore: () => score,
    getMaxTile: () => maxTile(board),
    getBoard: () => board.map((r) => r.slice()),
  };
})();
