#!/usr/bin/env python3
"""Clear local + Gist social data, then test like/favorite across cards."""
from __future__ import annotations

import importlib.util
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("dev_server", ROOT / "scripts" / "dev-server.py")
ds = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ds)

BASE = f"http://localhost:{ds.PORT}"
LOGIN = "test_user_alpha"
TOKEN = "test-token"


def http_json(method: str, path: str, body: dict | None = None) -> dict:
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        BASE + path,
        data=data,
        method=method,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN}",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())


def post_op(**kwargs) -> dict:
    payload = {"login": LOGIN, **kwargs}
    out = http_json("POST", "/auth/social/community", payload)
    return out["community"]


def like_count(community: dict, game_id: str) -> int:
    return len((community.get("likes") or {}).get(game_id) or [])


def user_row(community: dict) -> dict:
    return (community.get("users") or {}).get(LOGIN) or {"likes": [], "favorites": []}


def assert_eq(label: str, got, expected) -> None:
    if got != expected:
        raise AssertionError(f"{label}: got {got!r}, expected {expected!r}")


def clear_all() -> None:
    ds.load_proxy_env()
    community = ds.ensure_community_placeholders(ds.default_community())
    ds.save_community(community)
    print("Local community cleared.")
    pat = ds.load_github_pat()
    gist_id = ds.load_comments_gist_id()
    if not pat or not gist_id:
        print("WARN: no PAT/gist — local only")
        return
    files = {
        ds.GIST_COMMENT_FILE: {
            "content": json.dumps(ds.community_to_gist_blob({}), ensure_ascii=False, indent=2)
        },
        ds.GIST_LIKES_FILE: {
            "content": json.dumps(ds.empty_likes_gist_blob(), ensure_ascii=False, indent=2)
        },
        ds.GIST_USERS_FILE: {"content": "{}"},
    }
    if ds.patch_gist_files(pat, gist_id, files):
        print(f"Gist force-cleared (no merge): {gist_id}")
    else:
        print("WARN: Gist force-clear failed")


def wait_gist_sync(seconds: float = 4.0) -> None:
    time.sleep(seconds)


def verify_gist_empty() -> None:
    pat = ds.load_github_pat()
    gist_id = ds.load_comments_gist_id()
    if not pat or not gist_id:
        print("Skip Gist verify (no PAT)")
        return
    for fname in (ds.GIST_COMMENT_FILE, ds.GIST_LIKES_FILE, ds.GIST_USERS_FILE):
        blob = ds.fetch_gist_json_file(pat, gist_id, fname)
        if fname == ds.GIST_USERS_FILE:
            assert_eq(f"Gist {fname} users", blob, {})
        elif fname == ds.GIST_LIKES_FILE:
            non_empty = {k: v for k, v in (blob or {}).items() if v}
            if non_empty:
                raise AssertionError(f"Gist likes not empty: {non_empty}")
        print(f"  Gist {fname}: OK (empty)")


def run_tests() -> None:
    print("\n=== 1. Health check ===")
    health = http_json("GET", "/auth/health")
    assert_eq("health", health.get("ok"), True)

    print("\n=== 2. Like 3 different cards ===")
    for gid in ("chick", "shop", "run"):
        c = post_op(op="like", gameId=gid, liked=True)
        assert_eq(f"{gid} like count", like_count(c, gid), 1)
        assert LOGIN in (c.get("likes") or {}).get(gid, [])

    row = user_row(c)
    assert_eq("user likes after 3", sorted(row["likes"]), ["chick", "run", "shop"])

    print("\n=== 3. Unlike one card (shop) — others stay ===")
    c = post_op(op="like", gameId="shop", liked=False)
    assert_eq("chick like count", like_count(c, "chick"), 1)
    assert_eq("shop like count", like_count(c, "shop"), 0)
    assert_eq("run like count", like_count(c, "run"), 1)
    row = user_row(c)
    assert_eq("user likes after unlike shop", sorted(row["likes"]), ["chick", "run"])

    print("\n=== 4. Double-like idempotent ===")
    c = post_op(op="like", gameId="chick", liked=True)
    assert_eq("chick still 1", like_count(c, "chick"), 1)
    assert_eq("user likes unchanged", sorted(row["likes"]), ["chick", "run"])

    print("\n=== 5. Favorite 2 cards (no public fav count) ===")
    for gid in ("fortune", "pet"):
        c = post_op(op="favorite", gameId=gid, saved=True)
    row = user_row(c)
    assert_eq("user favorites", sorted(row["favorites"]), ["fortune", "pet"])
    assert_eq("user likes unchanged", sorted(row["likes"]), ["chick", "run"])

    print("\n=== 6. Unfavorite one (fortune) ===")
    c = post_op(op="favorite", gameId="fortune", saved=False)
    row = user_row(c)
    assert_eq("user favorites after remove", row["favorites"], ["pet"])

    print("\n=== 7. GET returns same state ===")
    wait_gist_sync()
    got = http_json("GET", "/auth/social/community")
    row = user_row(got)
    assert_eq("GET user likes", sorted(row["likes"]), ["chick", "run"])
    assert_eq("GET user favorites", row["favorites"], ["pet"])
    assert_eq("GET chick likes", like_count(got, "chick"), 1)
    assert_eq("GET shop likes", like_count(got, "shop"), 0)

    print("\n=== 8. Gist sync contains test user ===")
    wait_gist_sync(6)
    pat = ds.load_github_pat()
    gist_id = ds.load_comments_gist_id()
    if pat and gist_id:
        users = ds.fetch_gist_json_file(pat, gist_id, ds.GIST_USERS_FILE) or {}
        assert LOGIN in users, f"test user missing from Gist: {list(users.keys())}"
        assert_eq("Gist user likes", sorted(users[LOGIN]["likes"]), ["chick", "run"])
        assert_eq("Gist user favorites", users[LOGIN]["favorites"], ["pet"])
        likes_blob = ds.fetch_gist_json_file(pat, gist_id, ds.GIST_LIKES_FILE) or {}
        chick_key = ds.resolve_gist_key("chick")
        assert LOGIN in (likes_blob.get(chick_key) or []), likes_blob.get(chick_key)
        print("  Gist users + likes: OK")

    print("\n=== 9. Unlike all + clear favorites ===")
    for gid in ("chick", "run"):
        c = post_op(op="like", gameId=gid, liked=False)
    c = post_op(op="favorite", gameId="pet", saved=False)
    row = user_row(c)
    assert_eq("final likes", row["likes"], [])
    assert_eq("final favorites", row["favorites"], [])

    print("\nALL TESTS PASSED")


def main() -> int:
    if "--clear-only" in sys.argv:
        clear_all()
        return 0
    if "--test-only" in sys.argv:
        run_tests()
        return 0
    print("=== Clear cloud + local social data ===")
    clear_all()
    verify_gist_empty()
    run_tests()
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except urllib.error.URLError as e:
        print(f"\nFAIL: dev server not running at {BASE} — start start-dev-server.bat\n{e}")
        raise SystemExit(1)
    except AssertionError as e:
        print(f"\nFAIL: {e}")
        raise SystemExit(1)
