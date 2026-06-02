/**
 * Cloudflare Worker — shared comments for Miniverse (all users).
 * Deploy: wrangler deploy
 * Bind KV namespace "SOCIAL_KV", then set auth/github-config.js:
 *   communityApi: "https://YOUR-WORKER.workers.dev/community"
 */
const KV_KEY = "miniverse-community";
const MAX_COMMENTS = 300;

function defaultCommunity() {
  return { v: 1, counts: {}, comments: {} };
}

function applyOp(data, body) {
  const op = body.op;
  const gameId = body.gameId;
  if (!gameId) throw new Error("missing gameId");

  if (op === "comment") {
    const c = body.comment || {};
    const text = String(c.text || "").trim().slice(0, 500);
    if (!text) throw new Error("empty comment");
    const list = data.comments[gameId] || (data.comments[gameId] = []);
    list.push({
      id: c.id || crypto.randomUUID(),
      login: c.login || "player",
      name: c.name || c.login || "Player",
      avatar: c.avatar || "",
      text,
      ts: c.ts || Date.now(),
    });
    if (list.length > MAX_COMMENTS) data.comments[gameId] = list.slice(-MAX_COMMENTS);
    return data;
  }

  if (op === "count") {
    const field = body.field;
    const delta = Number(body.delta) || 0;
    if (field !== "likes" && field !== "favorites") throw new Error("invalid field");
    const counts = data.counts[gameId] || (data.counts[gameId] = { likes: 0, favorites: 0 });
    counts[field] = Math.max(0, (counts[field] || 0) + delta);
    return data;
  }

  throw new Error("unknown op");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/community") {
      return new Response("Not found", { status: 404 });
    }

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    let data =
      (await env.SOCIAL_KV.get(KV_KEY, "json")) || defaultCommunity();
    data.counts = data.counts || {};
    data.comments = data.comments || {};

    if (request.method === "GET") {
      return Response.json(data, { headers: cors });
    }

    if (request.method === "POST") {
      const auth = request.headers.get("Authorization") || "";
      if (!auth.startsWith("Bearer ")) {
        return Response.json({ error: "auth_required" }, { status: 401, headers: cors });
      }
      let body;
      try {
        body = await request.json();
      } catch {
        return Response.json({ error: "invalid_json" }, { status: 400, headers: cors });
      }
      try {
        data = applyOp(data, body);
      } catch (e) {
        return Response.json({ error: String(e.message || e) }, { status: 400, headers: cors });
      }
      await env.SOCIAL_KV.put(KV_KEY, JSON.stringify(data));
      return Response.json({ ok: true, community: data }, { headers: cors });
    }

    return new Response("Method not allowed", { status: 405, headers: cors });
  },
};
