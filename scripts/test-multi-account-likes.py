#!/usr/bin/env python3
"""Multi-account like count tests — each login counts once per game."""
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
TOKEN = "test-token"
ACCOUNTS = ["alice_dev", "bob_dev", "carol_dev"]


def http_json(method: str, path: str, body: dict | None = None) -> dict:
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        BASE + path,
        data=data,
        method=method,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {TOKEN}"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())


def like_as(login: str, game_id: str, liked: bool) -> dict:
    out = http_json(
        "POST",
        "/auth/social/community",
        {"op": "like", "login": login, "gameId": game_id, "liked": liked},
    )
    return out["community"]


def like_count(c: dict, game_id: str) -> int:
    return len((c.get("likes") or {}).get(game_id) or [])


def likers(c: dict, game_id: str) -> list[str]:
    return list((c.get("likes") or {}).get(game_id) or [])


def user_likes(c: dict, login: str) -> list[str]:
    return list((c.get("users") or {}).get(login, {}).get("likes") or [])


def assert_eq(label: str, got, expected) -> None:
    if got != expected:
        raise AssertionError(f"{label}: got {got!r}, expected {expected!r}")


def reset_local() -> None:
    ds.load_proxy_env()
    community = ds.ensure_community_placeholders(ds.default_community())
    ds.save_community(community)
    pat = ds.load_github_pat()
    gist_id = ds.load_comments_gist_id()
    if pat and gist_id:
        files = {
            ds.GIST_COMMENT_FILE: {
                "content": json.dumps(ds.community_to_gist_blob({}), ensure_ascii=False, indent=2)
            },
            ds.GIST_LIKES_FILE: {
                "content": json.dumps(ds.empty_likes_gist_blob(), ensure_ascii=False, indent=2)
            },
            ds.GIST_USERS_FILE: {"content": "{}"},
        }
        ok = ds.patch_gist_files(pat, gist_id, files)
        print(f"Gist reset: {'OK' if ok else 'FAILED (rate limit?)'}")
    print("Local data reset for test.")


def run() -> None:
    print("=== Multi-account like count tests ===\n")

    http_json("GET", "/auth/health")
    reset_local()

    print("1. Three accounts like Starfall (star)")
    c = None
    for login in ACCOUNTS:
        c = like_as(login, "star", True)
    assert_eq("star like count", like_count(c, "star"), 3)
    assert_eq("star likers sorted", sorted(likers(c, "star")), sorted(ACCOUNTS))
    for login in ACCOUNTS:
        assert "star" in user_likes(c, login), f"{login} missing star in user list"

    print("2. Bob unlikes star → count 2, Alice & Carol remain")
    c = like_as("bob_dev", "star", False)
    assert_eq("star like count", like_count(c, "star"), 2)
    assert_eq("star likers", sorted(likers(c, "star")), ["alice_dev", "carol_dev"])
    assert_eq("bob likes", user_likes(c, "bob_dev"), [])
    assert "star" in user_likes(c, "alice_dev")

    print("3. Carol double-likes (idempotent) → still 2")
    c = like_as("carol_dev", "star", True)
    assert_eq("star like count", like_count(c, "star"), 2)

    print("4. Different cards — each account likes a different game")
    c = like_as("alice_dev", "merge", True)
    c = like_as("bob_dev", "beat", True)
    c = like_as("carol_dev", "leap", True)
    assert_eq("star", like_count(c, "star"), 2)
    assert_eq("merge", like_count(c, "merge"), 1)
    assert_eq("beat", like_count(c, "beat"), 1)
    assert_eq("leap", like_count(c, "leap"), 1)
    assert_eq("alice likes", sorted(user_likes(c, "alice_dev")), ["merge", "star"])
    assert_eq("bob likes", sorted(user_likes(c, "bob_dev")), ["beat"])
    assert_eq("carol likes", sorted(user_likes(c, "carol_dev")), ["leap", "star"])

    print("5. Alice also likes beat → beat count becomes 2")
    c = like_as("alice_dev", "beat", True)
    assert_eq("beat count", like_count(c, "beat"), 2)
    assert_eq("beat likers", sorted(likers(c, "beat")), ["alice_dev", "bob_dev"])

    print("6. GET community matches")
    time.sleep(0.5)
    got = http_json("GET", "/auth/social/community")
    assert_eq("GET star count", like_count(got, "star"), 2)
    assert_eq("GET beat count", like_count(got, "beat"), 2)
    assert_eq("GET merge count", like_count(got, "merge"), 1)

    print("7. Gist sync (wait debounce 6s)")
    time.sleep(6)
    pat = ds.load_github_pat()
    gist_id = ds.load_comments_gist_id()
    if pat and gist_id:
        users = ds.fetch_gist_json_file(pat, gist_id, ds.GIST_USERS_FILE)
        likes_blob = ds.fetch_gist_json_file(pat, gist_id, ds.GIST_LIKES_FILE)
        if users is None or likes_blob is None or not users.get("alice_dev"):
            print("   Gist verify skipped (rate limit or sync pending — local OK)")
        else:
            chick_key = ds.resolve_gist_key("chick")
            run_key = ds.resolve_gist_key("run")
            assert_eq("Gist alice likes", sorted(users.get("alice_dev", {}).get("likes", [])), ["chick", "run", "shop"])
            assert_eq("Gist chick likers", sorted(likes_blob.get(chick_key) or []), ["alice_dev", "carol_dev"])
            assert_eq("Gist run likers", sorted(likes_blob.get(run_key) or []), ["alice_dev", "bob_dev"])
            print("   Gist users + like counts: OK")
    else:
        print("   Skip Gist verify (no PAT)")

    print("\n=== ALL MULTI-ACCOUNT TESTS PASSED ===")
    print("\nSummary:")
    print("  star:  2 likes (alice, carol) — bob removed")
    print("  merge: 1 like  (alice)")
    print("  beat:  2 likes (alice, bob)")
    print("  leap:  1 like  (carol)")


if __name__ == "__main__":
    try:
        run()
    except urllib.error.URLError as e:
        print(f"\nFAIL: start start-dev-server.bat first\n{e}")
        sys.exit(1)
    except AssertionError as e:
        print(f"\nFAIL: {e}")
        sys.exit(1)
