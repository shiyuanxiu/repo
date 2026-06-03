#!/usr/bin/env python3
"""Static file server + GitHub OAuth + Gist API proxy (browser → localhost → GitHub)."""
from __future__ import annotations

import argparse
import json
import os
import re
import socket
import ssl
import threading
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

GITHUB_TIMEOUT = 90

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
COMMUNITY_STORE = DATA_DIR / "miniverse-community.json"
CLIENT_ID_LOCAL = "Ov23liOu1avolRsyCXgE"
CLIENT_ID_PRODUCTION = "Ov23liEp1iutKOH6gnjd"
REDIRECT_URI_LOCAL = "http://localhost:8765/github-callback.html"
REDIRECT_URI_PRODUCTION = "https://miniverse.gg/github-callback.html"
PORT = 8765
GITHUB_API_PREFIX = "/auth/github-api"
SOCIAL_COMMUNITY_PATH = "/auth/social/community"
AUTH_HEALTH_PATH = "/auth/health"
MAX_COMMENTS_PER_CARD = 50
US_EASTERN = "America/New_York"


def default_community() -> dict:
    return {"v": 2, "comments": {}, "likes": {}, "users": {}}


def migrate_community(data: dict) -> dict:
    """v1 counts → v2 per-account likes; favorites are personal only."""
    if not isinstance(data, dict):
        return default_community()
    if int(data.get("v") or 1) >= 2:
        return data
    out = default_community()
    out["comments"] = data.get("comments") or {}
    old_users = data.get("users") or {}
    if old_users:
        out["users"] = old_users
    return out


def load_community() -> dict:
    if not COMMUNITY_STORE.is_file():
        return default_community()
    try:
        data = json.loads(COMMUNITY_STORE.read_text(encoding="utf-8"))
        if isinstance(data, dict):
            return migrate_community(data)
    except (json.JSONDecodeError, OSError):
        pass
    return default_community()


def save_community(data: dict) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    COMMUNITY_STORE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def card_storage_key(game_id: str, card_id: str | None = None) -> str:
    cid = (card_id or game_id or "").strip()
    gid = (game_id or "").strip()
    return f"{gid}::{cid}"


def format_us_eastern(ts: int | float | None = None) -> str:
    from datetime import datetime
    from zoneinfo import ZoneInfo

    tz = ZoneInfo(US_EASTERN)
    if ts is None:
        return datetime.now(tz).strftime("%Y-%m-%d %H:%M:%S")
    sec = ts / 1000 if ts and ts > 1_000_000_000_000 else (ts or 0)
    return datetime.fromtimestamp(sec, tz=tz).strftime("%Y-%m-%d %H:%M:%S")


def normalize_comment_record(comment: dict, reply_to: str | None = None) -> dict:
    content = str(comment.get("content") or comment.get("text") or "").strip()[:500]
    reply = reply_to if reply_to is not None else comment.get("replyTo") or comment.get("reply_to")
    return {
        "commentId": str(comment.get("commentId") or comment.get("id") or ""),
        "userId": str(comment.get("userId") or comment.get("login") or comment.get("user_id") or ""),
        "username": str(comment.get("username") or comment.get("name") or comment.get("login") or "Player"),
        "avatar": str(comment.get("avatar") or comment.get("avatar_url") or ""),
        "content": content,
        "createTime": str(comment.get("createTime") or comment.get("time") or format_us_eastern(comment.get("ts"))),
        "replyTo": str(reply) if reply else None,
    }


def validate_comment_submit(existing: list, draft: dict) -> str | None:
    content = str(draft.get("content") or "").strip()
    user_id = str(draft.get("userId") or "")
    reply_to = draft.get("replyTo")

    if not content:
        return "empty_content"
    if not user_id:
        return "missing_userId"
    if len(existing) >= MAX_COMMENTS_PER_CARD:
        return "card_limit_reached"

    if not reply_to:
        for c in existing:
            if not c.get("replyTo") and str(c.get("userId") or "") == user_id:
                return "main_comment_exists"
        return None

    parent = next((c for c in existing if str(c.get("commentId") or "") == str(reply_to)), None)
    if not parent:
        return "parent_not_found"
    if parent.get("replyTo"):
        return "max_reply_depth"
    return None


def apply_community_op(data: dict, body: dict) -> dict:
    op = body.get("op")
    game_id = body.get("gameId") or body.get("game_id")
    if not game_id:
        raise ValueError("missing gameId")

    if op == "comment":
        card_id = body.get("cardId") or game_id
        key = card_storage_key(game_id, card_id)
        comment = body.get("comment") or {}
        reply_to = body.get("replyTo") or comment.get("replyTo") or comment.get("reply_to")
        normalized = normalize_comment_record(comment, reply_to)
        if not normalized["content"]:
            raise ValueError("empty_content")
        if not normalized["userId"]:
            raise ValueError("missing_userId")
        if not normalized["commentId"]:
            import uuid

            normalized["commentId"] = str(uuid.uuid4())

        comments = data.setdefault("comments", {}).setdefault(key, [])
        err = validate_comment_submit(comments, normalized)
        if err:
            raise ValueError(err)
        comments.append(normalized)
        if len(comments) > MAX_COMMENTS_PER_CARD:
            raise ValueError("card_limit_reached")
        return data

    if op == "like":
        login = str(body.get("login") or "").strip()
        if not login:
            raise ValueError("missing login")
        liked = bool(body.get("liked"))
        likes = data.setdefault("likes", {}).setdefault(game_id, [])
        if liked:
            if login not in likes:
                likes.append(login)
        elif login in likes:
            likes.remove(login)
        user = data.setdefault("users", {}).setdefault(login, {"likes": [], "favorites": []})
        user_likes = user.setdefault("likes", [])
        if liked:
            if game_id not in user_likes:
                user_likes.append(game_id)
        elif game_id in user_likes:
            user_likes.remove(game_id)
        return reconcile_likes_from_users(data)

    if op == "favorite":
        login = str(body.get("login") or "").strip()
        if not login:
            raise ValueError("missing login")
        saved = bool(body.get("saved"))
        user = data.setdefault("users", {}).setdefault(login, {"likes": [], "favorites": []})
        favs = user.setdefault("favorites", [])
        if saved:
            if game_id not in favs:
                favs.append(game_id)
        elif game_id in favs:
            favs.remove(game_id)
        return data

    raise ValueError("unknown op")


GIST_COMMENT_FILE = "global-comment.json"
GIST_LIKES_FILE = "global-likes.json"
GIST_USERS_FILE = "global-users.json"
GIST_ID_STORE = DATA_DIR / "global-comments-gist-id.txt"
GAME_REGISTRY_PATH = ROOT / "assets" / "game-registry.json"
_game_registry_cache: dict | None = None


def load_game_registry() -> dict:
    global _game_registry_cache
    if _game_registry_cache is not None:
        return _game_registry_cache
    if not GAME_REGISTRY_PATH.is_file():
        _game_registry_cache = {"games": []}
        return _game_registry_cache
    _game_registry_cache = json.loads(GAME_REGISTRY_PATH.read_text(encoding="utf-8"))
    return _game_registry_cache


def game_to_gist_map() -> dict[str, str]:
    return {g["id"]: g["gistKey"] for g in load_game_registry().get("games", []) if g.get("id") and g.get("gistKey")}


def gist_to_game_map() -> dict[str, str]:
    return {v: k for k, v in game_to_gist_map().items()}


def resolve_gist_key(game_id: str) -> str:
    return game_to_gist_map().get(game_id, game_id[:1].upper() + game_id[1:] if game_id else "Unknown")


def resolve_game_id(gist_key: str) -> str:
    return gist_to_game_map().get(gist_key, gist_key[:1].lower() + gist_key[1:] if gist_key else "home")


def all_registry_game_ids() -> list[str]:
    return [g["id"] for g in load_game_registry().get("games", []) if g.get("id")]


def all_registry_gist_keys() -> list[str]:
    return [g["gistKey"] for g in load_game_registry().get("games", []) if g.get("gistKey")]


def empty_gist_blob() -> dict:
    return {key: [] for key in all_registry_gist_keys()}


def migrate_comment_keys(comments: dict) -> dict:
    """Legacy gameId-only keys → gameId::cardId storage keys."""
    out: dict = {}
    for key, items in (comments or {}).items():
        if "::" in str(key):
            out[key] = list(items or [])
        else:
            nk = card_storage_key(str(key))
            out[nk] = merge_comment_lists(out.get(nk, []), items or [])
    return out


def ensure_comment_placeholders(comments: dict) -> dict:
    out = migrate_comment_keys(comments)
    for game_id in all_registry_game_ids():
        out.setdefault(card_storage_key(game_id), [])
    return out


def rebuild_likes_from_users(users: dict) -> dict:
    likes: dict = {gid: [] for gid in all_registry_game_ids()}
    for login, row in (users or {}).items():
        for game_id in row.get("likes") or []:
            likes.setdefault(game_id, [])
            if login not in likes[game_id]:
                likes[game_id].append(login)
    return likes


def reconcile_likes_from_users(community: dict) -> dict:
    community["likes"] = ensure_like_placeholders(rebuild_likes_from_users(community.get("users") or {}))
    return community


def ensure_like_placeholders(likes: dict) -> dict:
    out = dict(likes or {})
    for game_id in all_registry_game_ids():
        out.setdefault(game_id, [])
    return out


def ensure_community_placeholders(community: dict) -> dict:
    community = migrate_community(dict(community or default_community()))
    community["v"] = 2
    community["comments"] = ensure_comment_placeholders(community.get("comments"))
    community["likes"] = ensure_like_placeholders(community.get("likes"))
    community["users"] = dict(community.get("users") or {})
    community.pop("counts", None)
    return reconcile_likes_from_users(community)


def gist_blob_missing_keys(blob: dict) -> bool:
    if isinstance(blob, dict) and int(blob.get("version") or 0) >= 3:
        cards = blob.get("cards") or {}
        for game_id in all_registry_game_ids():
            if card_storage_key(game_id) not in cards:
                return True
        return False
    required = set(all_registry_gist_keys())
    present = set(blob.keys()) if isinstance(blob, dict) else set()
    return bool(required - present)


def load_github_pat() -> str:
    path = ROOT / "auth" / "secrets.js"
    if not path.is_file():
        return ""
    text = path.read_text(encoding="utf-8")
    m = re.search(r'githubPat:\s*"([^"]+)"', text)
    if m and m.group(1):
        return m.group(1)
    m = re.search(r"(ghp_[A-Za-z0-9]+)", text)
    return m.group(1) if m else ""


def load_comments_gist_id() -> str:
    cfg = ROOT / "auth" / "github-config.js"
    if cfg.is_file():
        m = re.search(r'commentsGistId:\s*"([^"]+)"', cfg.read_text(encoding="utf-8"))
        if m and m.group(1):
            return m.group(1)
    if GIST_ID_STORE.is_file():
        return GIST_ID_STORE.read_text(encoding="utf-8").strip()
    return ""


def save_comments_gist_id(gist_id: str) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    GIST_ID_STORE.write_text(gist_id, encoding="utf-8")


def _ts_to_gist_time(ts: int | float) -> str:
    from datetime import datetime, timezone

    if not ts:
        return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    sec = ts / 1000 if ts > 1_000_000_000_000 else ts
    return datetime.fromtimestamp(sec, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%S")


def _gist_time_to_ts(time_str: str) -> int:
    from datetime import datetime, timezone

    if not time_str:
        return 0
    try:
        dt = datetime.strptime(time_str.strip(), "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
        return int(dt.timestamp() * 1000)
    except ValueError:
        return 0


def _legacy_item_to_v3(item: dict, game_id: str, index: int) -> dict | None:
    content = str(item.get("content") or item.get("text") or "").strip()
    if not content:
        return None
    name = str(item.get("name") or item.get("login") or "Player")
    t = item.get("time") or ""
    return {
        "commentId": f"{game_id}-legacy-{index}",
        "userId": name,
        "username": name,
        "avatar": str(item.get("avatar") or ""),
        "content": content,
        "createTime": t or format_us_eastern(_gist_time_to_ts(t)),
        "replyTo": None,
    }


def _normalize_v3_comment(raw: dict) -> dict | None:
    if not isinstance(raw, dict):
        return None
    content = str(raw.get("content") or raw.get("text") or "").strip()
    if not content:
        return None
    reply = raw.get("replyTo") or raw.get("reply_to")
    return {
        "commentId": str(raw.get("commentId") or raw.get("id") or ""),
        "userId": str(raw.get("userId") or raw.get("login") or raw.get("user_id") or "unknown"),
        "username": str(raw.get("username") or raw.get("name") or raw.get("login") or "Player"),
        "avatar": str(raw.get("avatar") or raw.get("avatar_url") or ""),
        "content": content[:500],
        "createTime": str(raw.get("createTime") or raw.get("time") or format_us_eastern(raw.get("ts"))),
        "replyTo": str(reply) if reply else None,
    }


def community_to_gist_blob(comments: dict) -> dict:
    cards: dict = {}
    for key, items in ensure_comment_placeholders(comments).items():
        cards[key] = [
            {
                "commentId": c.get("commentId") or c.get("id") or "",
                "userId": c.get("userId") or c.get("login") or "",
                "username": c.get("username") or c.get("name") or c.get("login") or "Player",
                "avatar": c.get("avatar") or "",
                "content": c.get("content") or c.get("text") or "",
                "createTime": c.get("createTime") or format_us_eastern(c.get("ts")),
                "replyTo": c.get("replyTo"),
            }
            for c in items
            if (c.get("content") or c.get("text") or "").strip()
        ]
        if len(cards[key]) > MAX_COMMENTS_PER_CARD:
            cards[key] = cards[key][-MAX_COMMENTS_PER_CARD:]
    return {"version": 3, "cards": cards}


def gist_blob_to_comments(blob: dict) -> dict:
    comments: dict = {}
    if isinstance(blob, dict) and int(blob.get("version") or 0) >= 3:
        for key, items in (blob.get("cards") or {}).items():
            if not isinstance(items, list):
                continue
            comments[key] = [c for c in (_normalize_v3_comment(i) for i in items) if c]
        return ensure_comment_placeholders(comments)

    for gist_key, items in (blob or {}).items():
        if gist_key in ("version", "cards") or not isinstance(items, list):
            continue
        game_id = resolve_game_id(gist_key)
        key = card_storage_key(game_id)
        comments[key] = []
        for i, item in enumerate(items):
            row = _legacy_item_to_v3(item, game_id, i) if isinstance(item, dict) else None
            if row:
                comments[key].append(row)
    return ensure_comment_placeholders(comments)


def _comment_key(c: dict) -> str:
    cid = str(c.get("commentId") or c.get("id") or "").strip()
    if cid:
        return cid
    return "|".join(
        [
            str(c.get("userId") or c.get("login") or ""),
            str(c.get("content") or c.get("text") or ""),
            str(c.get("createTime") or c.get("time") or c.get("ts") or ""),
        ]
    )


def merge_comment_lists(a: list, b: list) -> list:
    by_id: dict[str, dict] = {}
    for c in (a or []) + (b or []):
        if not isinstance(c, dict):
            continue
        row = _normalize_v3_comment(c) or c
        k = _comment_key(row)
        if not k:
            continue
        by_id[k] = row
    merged = list(by_id.values())
    merged.sort(key=lambda x: str(x.get("createTime") or ""))
    if len(merged) > MAX_COMMENTS_PER_CARD:
        merged = merged[-MAX_COMMENTS_PER_CARD:]
    return merged


def merge_all_comments(local: dict, remote: dict) -> dict:
    keys = set(local.keys()) | set(remote.keys())
    out: dict = {}
    for k in keys:
        out[k] = merge_comment_lists(local.get(k, []), remote.get(k, []))
    return out


def github_pat_request(method: str, url: str, payload: dict | None, pat: str) -> tuple[int, bytes]:
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"token {pat}",
        "User-Agent": "Miniverse-Dev-Server",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if data is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with get_opener().open(req, timeout=GITHUB_TIMEOUT) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except (urllib.error.URLError, socket.timeout, ssl.SSLError, TimeoutError, ConnectionError) as e:
        raise urllib.error.URLError(format_github_error(e)) from e


def fetch_gist_json_file(pat: str, gist_id: str, filename: str) -> dict | None:
    try:
        status, raw = github_pat_request("GET", f"https://api.github.com/gists/{gist_id}", None, pat)
    except urllib.error.URLError as e:
        print(f"[Miniverse] gist fetch failed ({filename}): {e}")
        return None
    if status >= 400:
        return None
    gist = json.loads(raw.decode("utf-8"))
    file_obj = gist.get("files", {}).get(filename)
    if not file_obj:
        return {}
    content = file_obj.get("content") or ""
    try:
        return json.loads(content) if content else {}
    except json.JSONDecodeError:
        return {}


def fetch_gist_comment_blob(pat: str, gist_id: str) -> dict | None:
    return fetch_gist_json_file(pat, gist_id, GIST_COMMENT_FILE)


def empty_likes_gist_blob() -> dict:
    return {key: [] for key in all_registry_gist_keys()}


def community_to_likes_gist_blob(likes: dict) -> dict:
    blob = empty_likes_gist_blob()
    for game_id, logins in ensure_like_placeholders(likes).items():
        key = resolve_gist_key(game_id)
        if key not in blob:
            blob[key] = []
        seen: set[str] = set()
        blob[key] = [lg for lg in (logins or []) if lg and lg not in seen and not seen.add(lg)]
    return blob


def likes_gist_blob_to_local(blob: dict) -> dict:
    likes: dict = {}
    for gist_key, logins in (blob or {}).items():
        if not isinstance(logins, list):
            continue
        game_id = resolve_game_id(gist_key)
        likes[game_id] = list(dict.fromkeys(str(lg) for lg in logins if lg))
    return likes


def merge_like_maps(local: dict, remote: dict) -> dict:
    keys = set(local.keys()) | set(remote.keys())
    out: dict = {}
    for k in keys:
        merged = list(dict.fromkeys((local.get(k) or []) + (remote.get(k) or [])))
        out[k] = merged
    return out


def merge_user_maps(local: dict, remote: dict) -> dict:
    """Local server state wins for each login (so un-like / un-favorite stick)."""
    out = dict(remote or {})
    for login, row in (local or {}).items():
        out[login] = {
            "likes": list(dict.fromkeys(row.get("likes") or [])),
            "favorites": list(dict.fromkeys(row.get("favorites") or [])),
        }
    return out


def patch_gist_files(pat: str, gist_id: str, files: dict) -> bool:
    status, raw = github_pat_request(
        "PATCH",
        f"https://api.github.com/gists/{gist_id}",
        {"files": files},
        pat,
    )
    if status >= 400:
        print(f"[Miniverse] gist patch failed HTTP {status}: {raw.decode('utf-8', errors='replace')[:200]}")
        return False
    return True


def sync_comments_to_gist(community: dict) -> str | None:
    """Push merged comments to public gist global-comment.json. Returns gist id or None."""
    pat = load_github_pat()
    if not pat:
        return None
    gist_id = load_comments_gist_id()
    local_comments = community.get("comments") or {}
    remote_blob: dict = {}
    if gist_id:
        remote_blob = fetch_gist_comment_blob(pat, gist_id) or {}
    remote_comments = gist_blob_to_comments(remote_blob)
    merged_comments = merge_all_comments(local_comments, remote_comments)
    community["comments"] = merged_comments
    merged_blob = community_to_gist_blob(merged_comments)
    body = {
        "public": True,
        "description": "Miniverse global comments (public gist)",
        "files": {GIST_COMMENT_FILE: {"content": json.dumps(merged_blob, ensure_ascii=False, indent=2)}},
    }
    if gist_id:
        status, raw = github_pat_request(
            "PATCH",
            f"https://api.github.com/gists/{gist_id}",
            {"files": body["files"]},
            pat,
        )
    else:
        status, raw = github_pat_request("POST", "https://api.github.com/gists", body, pat)
    if status >= 400:
        print(f"[Miniverse] gist sync failed HTTP {status}: {raw.decode('utf-8', errors='replace')[:200]}")
        return None
    result = json.loads(raw.decode("utf-8"))
    new_id = result.get("id") or gist_id
    if new_id and new_id != gist_id:
        save_comments_gist_id(new_id)
        print(f"[Miniverse] Created comments gist: {new_id} — add to github-config.js social.commentsGistId")
    return new_id


def sync_likes_to_gist(community: dict) -> str | None:
    pat = load_github_pat()
    if not pat:
        return None
    gist_id = load_comments_gist_id()
    community["likes"] = ensure_like_placeholders(rebuild_likes_from_users(community.get("users") or {}))
    merged_blob = community_to_likes_gist_blob(community["likes"])
    files = {GIST_LIKES_FILE: {"content": json.dumps(merged_blob, ensure_ascii=False, indent=2)}}
    if gist_id:
        if not patch_gist_files(pat, gist_id, files):
            return None
    else:
        body = {
            "public": True,
            "description": "Miniverse global social (comments, likes, users)",
            "files": files,
        }
        status, raw = github_pat_request("POST", "https://api.github.com/gists", body, pat)
        if status >= 400:
            return None
        gist_id = json.loads(raw.decode("utf-8")).get("id")
        if gist_id:
            save_comments_gist_id(gist_id)
    return gist_id


def sync_users_to_gist(community: dict) -> str | None:
    pat = load_github_pat()
    if not pat:
        return None
    gist_id = load_comments_gist_id()
    local_users = community.get("users") or {}
    remote_users: dict = {}
    if gist_id:
        remote_users = fetch_gist_json_file(pat, gist_id, GIST_USERS_FILE) or {}
    merged_users = merge_user_maps(local_users, remote_users)
    community["users"] = merged_users
    files = {GIST_USERS_FILE: {"content": json.dumps(merged_users, ensure_ascii=False, indent=2)}}
    if not gist_id:
        return sync_likes_to_gist(community)
    if not patch_gist_files(pat, gist_id, files):
        return None
    return gist_id


def sync_social_to_gist(community: dict) -> str | None:
    """Sync comments, per-account likes, and user favorites to gist."""
    sync_comments_to_gist(community)
    sync_users_to_gist(community)
    return sync_likes_to_gist(community)


_gist_sync_running = False
_gist_sync_timer: threading.Timer | None = None
_community_lock = threading.Lock()
GIST_SYNC_DEBOUNCE_SEC = 1.5


def schedule_gist_sync() -> None:
    """Push local community to Gist (debounced, no local overwrite)."""
    global _gist_sync_timer

    def _run() -> None:
        global _gist_sync_running
        try:
            with _community_lock:
                data = ensure_community_placeholders(load_community())
            sync_social_to_gist(data)
            print("[Miniverse] Gist sync OK")
        except Exception as e:
            print(f"[Miniverse] Gist sync error: {e}")
        finally:
            _gist_sync_running = False

    if _gist_sync_timer:
        _gist_sync_timer.cancel()
    _gist_sync_running = True
    _gist_sync_timer = threading.Timer(GIST_SYNC_DEBOUNCE_SEC, _run)
    _gist_sync_timer.daemon = True
    _gist_sync_timer.start()


_gist_pull_running = False


def schedule_gist_pull() -> None:
    """Pull remote Gist into local store without blocking HTTP responses."""
    global _gist_pull_running

    def _run() -> None:
        global _gist_pull_running
        try:
            with _community_lock:
                data = ensure_community_placeholders(load_community())
                data = pull_social_from_gist(data)
                save_community(data)
        except Exception as e:
            print(f"[Miniverse] Gist pull error: {e}")
        finally:
            _gist_pull_running = False

    if _gist_pull_running:
        return
    _gist_pull_running = True
    threading.Thread(target=_run, daemon=True).start()


def pull_comments_from_gist(community: dict) -> dict:
    pat = load_github_pat()
    gist_id = load_comments_gist_id()
    if not pat or not gist_id:
        return ensure_community_placeholders(community)
    blob = fetch_gist_comment_blob(pat, gist_id)
    if blob is None:
        return ensure_community_placeholders(community)
    remote = gist_blob_to_comments(blob)
    community["comments"] = merge_all_comments(community.get("comments") or {}, remote)
    return community


def pull_likes_from_gist(community: dict) -> dict:
    pat = load_github_pat()
    gist_id = load_comments_gist_id()
    if not pat or not gist_id:
        return community
    blob = fetch_gist_json_file(pat, gist_id, GIST_LIKES_FILE)
    if blob is None:
        return community
    remote = likes_gist_blob_to_local(blob)
    community["likes"] = merge_like_maps(community.get("likes") or {}, remote)
    return community


def pull_users_from_gist(community: dict) -> dict:
    pat = load_github_pat()
    gist_id = load_comments_gist_id()
    if not pat or not gist_id:
        return community
    remote = fetch_gist_json_file(pat, gist_id, GIST_USERS_FILE)
    if remote is None:
        return community
    community["users"] = merge_user_maps(community.get("users") or {}, remote or {})
    return community


def pull_social_from_gist(community: dict) -> dict:
    community = pull_comments_from_gist(community)
    community = pull_users_from_gist(community)
    return reconcile_likes_from_users(ensure_community_placeholders(community))


def seed_gist_placeholders(force: bool = False) -> str | None:
    """Ensure global-comment.json has empty [] for every registered game."""
    pat = load_github_pat()
    if not pat:
        print("[Miniverse] skip gist seed: no PAT in auth/secrets.js")
        return None
    community = ensure_community_placeholders(load_community())
    save_community(community)
    gist_id = load_comments_gist_id()
    if gist_id and not force:
        blob = fetch_gist_comment_blob(pat, gist_id) or {}
        if blob and not gist_blob_missing_keys(blob):
            return gist_id
    print("[Miniverse] Seeding gist placeholders for all registered games...")
    return sync_social_to_gist(community)


def load_proxy_env() -> None:
    """Optional: auth/proxy.env with HTTPS_PROXY=http://127.0.0.1:7890"""
    path = ROOT / "auth" / "proxy.env"
    if not path.is_file():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, val = line.split("=", 1)
        key, val = key.strip(), val.strip().strip('"').strip("'")
        if key and val:
            os.environ.setdefault(key, val)


def format_github_error(exc: BaseException) -> str:
    raw = str(getattr(exc, "reason", None) or exc)
    low = raw.lower()
    if "handshake" in low or "ssl" in low or "_ssl" in low:
        return (
            "SSL handshake timed out — Python cannot reach GitHub.\n"
            "1) Update hosts IPs (github.com + api.github.com), then: ipconfig /flushdns\n"
            "2) Or create auth/proxy.env with: HTTPS_PROXY=http://127.0.0.1:YOUR_PORT\n"
            "3) Restart start-dev-server.bat and login again"
        )
    if "timed out" in low or "timeout" in low:
        return "Connection to GitHub timed out. Check hosts / VPN / auth/proxy.env"
    return raw


_opener: urllib.request.OpenerDirector | None = None


def get_opener() -> urllib.request.OpenerDirector:
    global _opener
    if _opener is not None:
        return _opener
    handlers: list = []
    proxy_keys = ("HTTPS_PROXY", "https_proxy", "HTTP_PROXY", "http_proxy", "ALL_PROXY", "all_proxy")
    proxy_url = next((os.environ[k] for k in proxy_keys if os.environ.get(k)), "")
    if proxy_url:
        handlers.append(urllib.request.ProxyHandler({"http": proxy_url, "https": proxy_url}))
        print(f"[Miniverse] Using proxy: {proxy_url}")
    ctx = ssl.create_default_context()
    handlers.append(urllib.request.HTTPSHandler(context=ctx))
    _opener = urllib.request.build_opener(*handlers)
    return _opener


def load_secrets_js() -> dict[str, str]:
    path = ROOT / "auth" / "secrets.js"
    if not path.is_file():
        return {}
    text = path.read_text(encoding="utf-8")

    def pick(*keys: str) -> str:
        for key in keys:
            m = re.search(rf'{re.escape(key)}:\s*"([^"]+)"', text)
            if m and m.group(1):
                return m.group(1)
        return ""

    return {
        "clientSecretLocal": pick("clientSecretLocal", "clientSecret"),
        "clientSecretProduction": pick("clientSecretProduction"),
    }


def load_oauth_config() -> dict[str, str]:
    cfg_path = ROOT / "auth" / "github-config.js"
    text = cfg_path.read_text(encoding="utf-8") if cfg_path.is_file() else ""

    def pick(key: str, default: str = "") -> str:
        m = re.search(rf'{re.escape(key)}:\s*"([^"]+)"', text)
        return m.group(1) if m and m.group(1) else default

    return {
        "clientIdLocal": pick("clientIdLocal", pick("clientId", CLIENT_ID_LOCAL)),
        "clientIdProduction": pick("clientIdProduction", CLIENT_ID_PRODUCTION),
        "redirectUriLocal": pick("redirectUriLocal", REDIRECT_URI_LOCAL),
        "redirectUriProduction": pick("redirectUriProduction", REDIRECT_URI_PRODUCTION),
    }


def is_local_redirect_uri(redirect_uri: str) -> bool:
    u = (redirect_uri or "").lower()
    return "localhost:8765" in u or "127.0.0.1:8765" in u


def oauth_credentials_for_redirect(redirect_uri: str) -> tuple[str, str, str]:
    """Return (client_id, client_secret, env_label) for GitHub token exchange."""
    cfg = load_oauth_config()
    sec = load_secrets_js()
    if is_local_redirect_uri(redirect_uri):
        return cfg["clientIdLocal"], sec.get("clientSecretLocal", ""), "local"
    return cfg["clientIdProduction"], sec.get("clientSecretProduction", ""), "production"


def load_client_secret() -> str:
    """Legacy helper — local dev secret."""
    return load_secrets_js().get("clientSecretLocal", "")


def oauth_access_token_request(payload: dict) -> tuple[int, bytes]:
    """GitHub OAuth token endpoint requires Accept: application/json."""
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://github.com/login/oauth/access_token",
        data=data,
        method="POST",
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Miniverse-Dev-Server",
        },
    )
    try:
        with get_opener().open(req, timeout=GITHUB_TIMEOUT) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except (urllib.error.URLError, socket.timeout, ssl.SSLError, TimeoutError) as e:
        raise urllib.error.URLError(format_github_error(e)) from e


def github_request(url: str, method: str = "GET", payload: dict | None = None, token: str = "") -> tuple[int, bytes]:
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "Miniverse-Dev-Server",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if data is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with get_opener().open(req, timeout=GITHUB_TIMEOUT) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except (urllib.error.URLError, socket.timeout, ssl.SSLError, TimeoutError) as e:
        raise urllib.error.URLError(format_github_error(e)) from e


class DevHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format, *args):
        if args and isinstance(args[0], str) and args[0].startswith(("POST /auth/", "PATCH /auth/", "GET /auth/github")):
            return
        super().log_message(format, *args)

    def _read_body(self) -> bytes:
        length = int(self.headers.get("Content-Length", 0))
        return self.rfile.read(length) if length else b""

    def _json_response(self, status: int, payload: dict):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _raw_response(self, status: int, body: bytes, content_type: str = "application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _github_api_proxy(self, method: str) -> bool:
        parsed = urlparse(self.path)
        if not parsed.path.startswith(GITHUB_API_PREFIX + "/"):
            return False
        api_path = parsed.path[len(GITHUB_API_PREFIX) :]
        url = f"https://api.github.com{api_path}"
        auth = self.headers.get("Authorization", "")
        token = auth[7:] if auth.lower().startswith("bearer ") else ""
        body_in = self._read_body() if method in ("POST", "PATCH", "PUT") else None
        payload = None
        if body_in:
            try:
                payload = json.loads(body_in.decode("utf-8"))
            except json.JSONDecodeError:
                self._json_response(400, {"error": "invalid_json"})
                return True
        try:
            if payload is not None:
                status, body = github_request(url, method, payload, token)
            else:
                status, body = github_request(url, method, None, token)
        except urllib.error.URLError as e:
            self._json_response(
                502,
                {"error": "github_unreachable", "error_description": format_github_error(e)},
            )
            return True
        self._raw_response(status, body)
        return True

    def _auth_health(self) -> bool:
        if urlparse(self.path).path != AUTH_HEALTH_PATH:
            return False
        self._json_response(200, {"ok": True, "social": "v3", "comments": "v3"})
        return True

    def _social_community(self, method: str) -> bool:
        if urlparse(self.path).path != SOCIAL_COMMUNITY_PATH:
            return False
        if method == "GET":
            with _community_lock:
                data = ensure_community_placeholders(load_community())
            schedule_gist_pull()
            body = json.dumps(data, ensure_ascii=False).encode("utf-8")
            self._raw_response(200, body)
            return True
        if method == "POST":
            auth = self.headers.get("Authorization", "")
            if not auth.lower().startswith("bearer "):
                self._json_response(401, {"error": "auth_required"})
                return True
            try:
                body = json.loads(self._read_body().decode("utf-8") or "{}")
            except (json.JSONDecodeError, ValueError):
                self._json_response(400, {"error": "invalid_json"})
                return True
            with _community_lock:
                data = load_community()
                try:
                    data = apply_community_op(data, body)
                except ValueError as e:
                    self._json_response(400, {"error": str(e)})
                    return True
                save_community(data)
            if body.get("op") in ("comment", "like", "favorite"):
                schedule_gist_sync()
            self._json_response(200, {"ok": True, "community": data})
            return True
        return False

    def do_GET(self):
        if self._auth_health():
            return
        if self._social_community("GET"):
            return
        if self._github_api_proxy("GET"):
            return
        return super().do_GET()

    def _init_gist_placeholders(self):
        try:
            gist_id = seed_gist_placeholders(force=True)
        except Exception as e:
            self._json_response(500, {"error": "gist_seed_failed", "detail": str(e)})
            return
        if gist_id:
            self._json_response(200, {"ok": True, "gistId": gist_id, "games": len(all_registry_gist_keys())})
        else:
            self._json_response(503, {"error": "gist_seed_failed", "detail": "check PAT and network"})

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/auth/exchange-token":
            self._exchange_token()
            return
        if path == "/auth/gist/init-placeholders":
            self._init_gist_placeholders()
            return
        if self._social_community("POST"):
            return
        if self._github_api_proxy("POST"):
            return
        self.send_error(404)

    def do_PATCH(self):
        if self._github_api_proxy("PATCH"):
            return
        self.send_error(405)

    def _exchange_token(self):
        try:
            raw = self._read_body()
            body = json.loads(raw.decode("utf-8") or "{}")
        except (json.JSONDecodeError, ValueError):
            self._json_response(400, {"error": "invalid_json"})
            return

        code = body.get("code")
        redirect_uri = body.get("redirect_uri")
        if not code or not redirect_uri:
            self._json_response(400, {"error": "missing_code_or_redirect_uri"})
            return

        client_id, secret, env_label = oauth_credentials_for_redirect(redirect_uri)
        if not secret:
            self._json_response(
                500,
                {
                    "error": "missing_client_secret",
                    "error_description": (
                        f"Fill auth/secrets.js → clientSecret{env_label.capitalize()} "
                        f"(or clientSecret for local) and restart dev server."
                    ),
                },
            )
            return

        try:
            status, raw = oauth_access_token_request(
                {
                    "client_id": client_id,
                    "client_secret": secret,
                    "code": code,
                    "redirect_uri": redirect_uri,
                },
            )
            token_data = json.loads(raw.decode("utf-8"))
        except (urllib.error.URLError, json.JSONDecodeError) as e:
            desc = format_github_error(e) if isinstance(e, urllib.error.URLError) else str(e)
            self._json_response(502, {"error": "github_unreachable", "error_description": desc})
            return

        if status >= 400 or token_data.get("error") or not token_data.get("access_token"):
            self._json_response(status if status >= 400 else 400, token_data)
            return

        try:
            _, user_raw = github_request(
                "https://api.github.com/user",
                "GET",
                None,
                token_data["access_token"],
            )
            user = json.loads(user_raw.decode("utf-8"))
        except urllib.error.URLError as e:
            self._json_response(502, {"error": "github_unreachable", "error_description": format_github_error(e)})
            return

        self._json_response(
            200,
            {
                "access_token": token_data["access_token"],
                "expires_in": token_data.get("expires_in", 28800),
                "user": {
                    "login": user.get("login"),
                    "name": user.get("name") or user.get("login"),
                    "avatar_url": user.get("avatar_url"),
                },
            },
        )


def _seed_on_startup() -> None:
    try:
        gist_id = seed_gist_placeholders()
        if gist_id:
            print(f"[Miniverse] Gist placeholders OK ({len(all_registry_gist_keys())} games): {gist_id}")
    except Exception as e:
        print(f"[Miniverse] Gist seed error: {e}")


def main():
    load_proxy_env()
    threading.Thread(target=_seed_on_startup, daemon=True).start()
    server = ThreadingHTTPServer(("0.0.0.0", PORT), DevHandler)
    print(f"Serving {ROOT} at http://localhost:{PORT}/")
    print("Social API v2: comment · like · favorite → Gist (background sync)")
    print("OAuth:     POST /auth/exchange-token")
    print("Health:    GET  /auth/health  (login page check)")
    print("Community: GET/POST /auth/social/community  (shared comments)")
    print("Gist seed: POST /auth/gist/init-placeholders  (force all 18 empty slots)")
    print("Gist:      /auth/github-api/gists/... (optional)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
        server.server_close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Miniverse dev server")
    parser.add_argument(
        "--seed-only",
        action="store_true",
        help="Seed global-comment.json placeholders for all games and exit",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="With --seed-only, always PATCH gist even if keys already exist",
    )
    args = parser.parse_args()
    if args.seed_only:
        load_proxy_env()
        gist_id = seed_gist_placeholders(force=args.force)
        if gist_id:
            print(f"Done. Gist {gist_id} has {len(all_registry_gist_keys())} game slots.")
            raise SystemExit(0)
        print("Failed — check auth/secrets.js PAT and network/proxy.")
        raise SystemExit(1)
    main()
