#!/usr/bin/env python3
"""One-time: merge legacy publicGist miniverse-user.json into v2 community + gist."""
from __future__ import annotations

import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
import importlib.util

spec = importlib.util.spec_from_file_location("dev_server", ROOT / "scripts" / "dev-server.py")
ds = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ds)

LOGIN = "shiyuanxiu"


def fetch_legacy_user(pat: str, gist_id: str) -> dict | None:
    req = urllib.request.Request(
        f"https://api.github.com/gists/{gist_id}",
        headers={
            "Authorization": f"token {pat}",
            "Accept": "application/vnd.github+json",
            "User-Agent": "Miniverse-Migrate",
        },
    )
    g = json.loads(urllib.request.urlopen(req, timeout=90).read())
    fo = (g.get("files") or {}).get("miniverse-user.json")
    if not fo:
        return None
    return json.loads(fo["content"])


def rebuild_likes_from_users(users: dict) -> dict:
    likes: dict = {gid: [] for gid in ds.all_registry_game_ids()}
    for login, row in users.items():
        for game_id in row.get("likes") or []:
            likes.setdefault(game_id, [])
            if login not in likes[game_id]:
                likes[game_id].append(login)
    return likes


def main() -> int:
    ds.load_proxy_env()
    pat = ds.load_github_pat()
    if not pat:
        print("No PAT")
        return 1
    config = (ROOT / "auth" / "github-config.js").read_text(encoding="utf-8")
    legacy_id = re.search(r'publicGistId:\s*"([^"]+)"', config)
    legacy_id = legacy_id.group(1) if legacy_id else ""
    legacy = fetch_legacy_user(pat, legacy_id) if legacy_id else None
    if not legacy:
        print("No legacy user blob found")
        return 1

    community = ds.ensure_community_placeholders(ds.load_community())
    community["users"][LOGIN] = {
        "likes": list(dict.fromkeys(legacy.get("likes") or [])),
        "favorites": list(dict.fromkeys(legacy.get("favorites") or [])),
    }
    community["likes"] = ds.merge_like_maps(community.get("likes") or {}, rebuild_likes_from_users(community["users"]))
    ds.save_community(community)
    ds.sync_social_to_gist(community)
    ds.save_community(community)
    print("Migrated user", LOGIN)
    print("  favorites:", community["users"][LOGIN]["favorites"])
    print("  likes:", community["users"][LOGIN]["likes"])
    print("  chick like count:", len(community["likes"].get("chick", [])))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
