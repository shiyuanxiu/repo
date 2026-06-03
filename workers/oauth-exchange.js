/**
 * Cloudflare Worker — GitHub OAuth token exchange for miniverse.gg (production).
 *
 * Deploy:
 *   cd workers
 *   wrangler secret put GITHUB_CLIENT_SECRET   # production OAuth App secret
 *   wrangler deploy -c wrangler.oauth.toml
 *
 * Route: miniverse.gg/auth/exchange-token
 */
const PROD_CLIENT_ID = "Ov23liEp1iutKOH6gnjd";
const PROD_REDIRECT = "https://miniverse.gg/github-callback.html";

const cors = {
  "Access-Control-Allow-Origin": "https://miniverse.gg",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/auth/exchange-token") {
      return new Response("Not found", { status: 404 });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (request.method !== "POST") {
      return Response.json({ error: "method_not_allowed" }, { status: 405, headers: cors });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "invalid_json" }, { status: 400, headers: cors });
    }

    const code = body?.code;
    const redirect_uri = body?.redirect_uri;
    if (!code || !redirect_uri) {
      return Response.json({ error: "missing_code_or_redirect_uri" }, { status: 400, headers: cors });
    }

    if (redirect_uri !== PROD_REDIRECT) {
      return Response.json({ error: "invalid_redirect_uri" }, { status: 400, headers: cors });
    }

    const clientSecret = env.GITHUB_CLIENT_SECRET || "";
    if (!clientSecret) {
      return Response.json(
        {
          error: "missing_client_secret",
          error_description: "Set GITHUB_CLIENT_SECRET via wrangler secret put",
        },
        { status: 500, headers: cors }
      );
    }

    const clientId = env.GITHUB_CLIENT_ID || PROD_CLIENT_ID;

    let tokenRes;
    try {
      tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": "Miniverse-OAuth-Worker",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri,
        }),
      });
    } catch (e) {
      return Response.json(
        { error: "github_unreachable", error_description: String(e.message || e) },
        { status: 502, headers: cors }
      );
    }

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || tokenData.error || !tokenData.access_token) {
      return Response.json(tokenData, { status: tokenRes.ok ? 400 : tokenRes.status, headers: cors });
    }

    let userRes;
    try {
      userRes = await fetch("https://api.github.com/user", {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "Miniverse-OAuth-Worker",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
    } catch (e) {
      return Response.json(
        { error: "github_unreachable", error_description: String(e.message || e) },
        { status: 502, headers: cors }
      );
    }

    const user = await userRes.json();
    if (!userRes.ok) {
      return Response.json(user, { status: userRes.status, headers: cors });
    }

    return Response.json(
      {
        access_token: tokenData.access_token,
        token_type: tokenData.token_type || "bearer",
        scope: tokenData.scope || "",
        expires_in: tokenData.expires_in,
        user: {
          login: user.login,
          id: user.id,
          name: user.name || user.login,
          avatar_url: user.avatar_url,
        },
      },
      { headers: cors }
    );
  },
};
