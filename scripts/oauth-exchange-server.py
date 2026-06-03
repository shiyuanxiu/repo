#!/usr/bin/env python3
"""
Standalone GitHub OAuth token exchange (production) — no Cloudflare required.

Use when Cloudflare Workers/dashboard is blocked. Deploy on:
  - VPS / 阿里云 / 腾讯云 (systemd + nginx reverse proxy)
  - Render / Railway (set env GITHUB_CLIENT_SECRET)
  - Same machine as miniverse.gg static site

Run locally test:
  set GITHUB_CLIENT_SECRET=your_prod_secret
  py -3 scripts/oauth-exchange-server.py --port 8780

Nginx example (miniverse.gg):
  location /auth/exchange-token {
    proxy_pass http://127.0.0.1:8780/auth/exchange-token;
    proxy_set_header Host $host;
  }
"""
from __future__ import annotations

import argparse
import json
import os
import re
import ssl
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CLIENT_ID = os.environ.get("GITHUB_CLIENT_ID", "Ov23liEp1iutKOH6gnjd")
PROD_REDIRECT = "https://miniverse.gg/github-callback.html"
ALLOW_ORIGIN = os.environ.get("OAUTH_CORS_ORIGIN", "https://miniverse.gg")
TIMEOUT = 60


def load_secret() -> str:
    env = os.environ.get("GITHUB_CLIENT_SECRET", "").strip()
    if env:
        return env
    path = ROOT / "auth" / "secrets.js"
    if path.is_file():
        text = path.read_text(encoding="utf-8")
        for key in ("clientSecretProduction", "clientSecret"):
            m = re.search(rf'{key}:\s*"([^"]+)"', text)
            if m and m.group(1):
                return m.group(1)
    return ""


def github_post(url: str, payload: dict) -> tuple[int, dict]:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method="POST",
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Miniverse-OAuth-Proxy",
        },
    )
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        try:
            return e.code, json.loads(body)
        except json.JSONDecodeError:
            return e.code, {"error": body}


def github_get(url: str, token: str) -> tuple[int, dict]:
    req = urllib.request.Request(
        url,
        method="GET",
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "User-Agent": "Miniverse-OAuth-Proxy",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as resp:
        return resp.status, json.loads(resp.read().decode("utf-8"))


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"[OAuth] {self.address_string()} {fmt % args}")

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", ALLOW_ORIGIN)
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _json(self, status: int, body: dict):
        raw = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self._cors()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_OPTIONS(self):
        if self.path.rstrip("/") != "/auth/exchange-token":
            self.send_response(404)
            self.end_headers()
            return
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self):
        if self.path.rstrip("/") in ("/", "/health", "/auth/health"):
            self._json(200, {"ok": True, "service": "oauth-exchange"})
            return
        self._json(404, {"error": "not_found"})

    def do_POST(self):
        if self.path.rstrip("/") != "/auth/exchange-token":
            self._json(404, {"error": "not_found"})
            return

        secret = load_secret()
        if not secret:
            self._json(
                500,
                {
                    "error": "missing_client_secret",
                    "error_description": "Set GITHUB_CLIENT_SECRET env or auth/secrets.js",
                },
            )
            return

        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
        except (ValueError, json.JSONDecodeError):
            self._json(400, {"error": "invalid_json"})
            return

        code = body.get("code")
        redirect_uri = body.get("redirect_uri")
        if not code or not redirect_uri:
            self._json(400, {"error": "missing_code_or_redirect_uri"})
            return
        if redirect_uri != PROD_REDIRECT:
            self._json(400, {"error": "invalid_redirect_uri"})
            return

        try:
            status, token_data = github_post(
                "https://github.com/login/oauth/access_token",
                {
                    "client_id": CLIENT_ID,
                    "client_secret": secret,
                    "code": code,
                    "redirect_uri": redirect_uri,
                },
            )
        except urllib.error.URLError as e:
            self._json(502, {"error": "github_unreachable", "error_description": str(e.reason or e)})
            return

        if status >= 400 or token_data.get("error") or not token_data.get("access_token"):
            self._json(status if status >= 400 else 400, token_data)
            return

        try:
            _, user = github_get("https://api.github.com/user", token_data["access_token"])
        except urllib.error.URLError as e:
            self._json(502, {"error": "github_unreachable", "error_description": str(e.reason or e)})
            return

        self._json(
            200,
            {
                "access_token": token_data["access_token"],
                "token_type": token_data.get("token_type", "bearer"),
                "scope": token_data.get("scope", ""),
                "expires_in": token_data.get("expires_in"),
                "user": {
                    "login": user.get("login"),
                    "id": user.get("id"),
                    "name": user.get("name") or user.get("login"),
                    "avatar_url": user.get("avatar_url"),
                },
            },
        )


def main():
    parser = argparse.ArgumentParser(description="Miniverse OAuth exchange (no Cloudflare)")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=8780)
    args = parser.parse_args()
    secret = load_secret()
    if not secret:
        print("[OAuth] WARN: no GITHUB_CLIENT_SECRET — set env or auth/secrets.js")
    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"[OAuth] Listening http://{args.host}:{args.port}/auth/exchange-token")
    print(f"[OAuth] CORS origin: {ALLOW_ORIGIN}")
    print(f"[OAuth] Expected redirect_uri: {PROD_REDIRECT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[OAuth] Stopped.")


if __name__ == "__main__":
    main()
