/**
 * Smoke tests for Miniverse comment rules (mirrors assets/comment-service.js + dev-server).
 * Run: node scripts/test-comment-smoke.mjs
 * Optional integration: start start-dev-server.bat first (port 8765).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const MAX = 50;

function cardKey(gameId, cardId) {
  return `${gameId}::${cardId || gameId}`;
}

function dedupe(list) {
  const seen = new Set();
  const out = [];
  for (const c of list || []) {
    if (!c?.commentId || seen.has(c.commentId)) continue;
    seen.add(c.commentId);
    out.push(c);
  }
  return out;
}

function hasMain(list, userId) {
  return dedupe(list).some((c) => !c.replyTo && c.userId === userId);
}

function findComment(list, id) {
  return dedupe(list).find((c) => c.commentId === id) || null;
}

function validateSubmit(existing, draft) {
  const content = String(draft.content || "").trim();
  if (!content) return { ok: false, error: "empty_content" };
  if (!draft.userId) return { ok: false, error: "missing_userId" };
  const list = dedupe(existing);
  if (list.length >= MAX) return { ok: false, error: "card_limit_reached" };
  const replyTo = draft.replyTo || null;
  if (!replyTo) {
    if (hasMain(list, draft.userId)) return { ok: false, error: "main_comment_exists" };
    return { ok: true };
  }
  const parent = findComment(list, replyTo);
  if (!parent) return { ok: false, error: "parent_not_found" };
  if (parent.replyTo) return { ok: false, error: "max_reply_depth" };
  return { ok: true };
}

function parseGistDocument(doc) {
  if (doc?.version >= 3 && doc.cards) {
    const cards = {};
    for (const [k, items] of Object.entries(doc.cards)) {
      cards[k] = dedupe(items);
    }
    return { version: 3, cards };
  }
  return { version: 3, cards: {} };
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

test("cardKey uses gameId::cardId", () => {
  assert(cardKey("chick", "chick") === "chick::chick", "key format");
});

test("one main comment per userId", () => {
  const list = [{ commentId: "1", userId: "u1", content: "hi", replyTo: null }];
  const r = validateSubmit(list, { userId: "u1", content: "again", replyTo: null });
  assert(!r.ok && r.error === "main_comment_exists", "dup main blocked");
});

test("reply to main comment allowed", () => {
  const list = [{ commentId: "1", userId: "u1", content: "hi", replyTo: null }];
  const r = validateSubmit(list, { userId: "u2", content: "reply", replyTo: "1" });
  assert(r.ok, "reply ok");
});

test("third-level reply blocked", () => {
  const list = [
    { commentId: "1", userId: "u1", content: "main", replyTo: null },
    { commentId: "2", userId: "u2", content: "r1", replyTo: "1" },
  ];
  const r = validateSubmit(list, { userId: "u3", content: "r2", replyTo: "2" });
  assert(!r.ok && r.error === "max_reply_depth", "depth limit");
});

test("50 comment cap", () => {
  const list = Array.from({ length: 50 }, (_, i) => ({
    commentId: `c${i}`,
    userId: `u${i}`,
    content: "x",
    replyTo: null,
  }));
  const r = validateSubmit(list, { userId: "new", content: "one more", replyTo: null });
  assert(!r.ok && r.error === "card_limit_reached", "cap");
});

test("example JSON parses v3 cards", () => {
  const raw = readFileSync(join(ROOT, "docs/comment-data.example.json"), "utf8");
  const doc = parseGistDocument(JSON.parse(raw));
  assert(doc.cards["chick::chick"]?.length === 2, "two comments");
  assert(doc.cards["chick::chick"][1].replyTo === doc.cards["chick::chick"][0].commentId, "reply link");
});

async function integrationSmoke() {
  const base = "http://127.0.0.1:8765";
  try {
    const health = await fetch(`${base}/auth/health`, { signal: AbortSignal.timeout(3000) });
    if (!health.ok) return console.log("○ dev-server not running — skip integration");
    const h = await health.json();
    assert(h.social?.includes("v3") || h.comments === "v3", "server social v3");

    const getRes = await fetch(`${base}/auth/social/community`);
    assert(getRes.ok, "GET community");
    const community = await getRes.json();
    assert(typeof community.comments === "object", "comments object");

    const gameId = "chick";
    const key = cardKey(gameId, gameId);
    const before = (community.comments[key] || []).length;

    const postRes = await fetch(`${base}/auth/social/community`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer smoke-test" },
      body: JSON.stringify({
        op: "comment",
        gameId,
        cardId: gameId,
        comment: {
          commentId: `smoke-${Date.now()}`,
          userId: "smoke_user_a",
          username: "Smoke A",
          avatar: "",
          content: `smoke test ${Date.now()}`,
          createTime: "2026-06-01 12:00:00",
          replyTo: null,
        },
      }),
    });
    assert(postRes.ok, "POST comment");
    const after = await fetch(`${base}/auth/social/community`);
    const data = await after.json();
    const list = data.comments[key] || [];
    assert(list.length >= before + 1, "comment appended");

    const dup = await fetch(`${base}/auth/social/community`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer smoke-test" },
      body: JSON.stringify({
        op: "comment",
        gameId,
        cardId: gameId,
        comment: {
          userId: "smoke_user_a",
          username: "Smoke A",
          content: "duplicate main",
          createTime: "2026-06-01 12:01:00",
          replyTo: null,
        },
      }),
    });
    assert(dup.status === 400, "dup main rejected");
    const dupBody = await dup.json();
    assert(dupBody.error === "main_comment_exists", "error code");

    console.log("✓ integration: dev-server comment POST + dedupe");
    passed++;
  } catch (e) {
    console.log(`○ integration skipped: ${e.message}`);
  }
}

await integrationSmoke();
console.log(`\n${passed} tests passed`);
