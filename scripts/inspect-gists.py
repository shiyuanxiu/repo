#!/usr/bin/env python3
"""Inspect Miniverse social gist files."""
from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def fetch_gist(gist_id: str, pat: str) -> dict:
    req = urllib.request.Request(
        f"https://api.github.com/gists/{gist_id}",
        headers={
            "Authorization": f"token {pat}",
            "Accept": "application/vnd.github+json",
            "User-Agent": "Miniverse-Inspect",
        },
    )
    return json.loads(urllib.request.urlopen(req, timeout=90).read())


def main() -> int:
    secrets = (ROOT / "auth" / "secrets.js").read_text(encoding="utf-8")
    config = (ROOT / "auth" / "github-config.js").read_text(encoding="utf-8")
    pat = re.search(r'githubPat:\s*"([^"]+)"', secrets).group(1)
    gist_id = re.search(r'commentsGistId:\s*"([^"]+)"', config).group(1)
    g = fetch_gist(gist_id, pat)
    print(f"Gist {gist_id} files: {list((g.get('files') or {}).keys())}\n")

    for fname in ("global-comment.json", "global-likes.json", "global-users.json"):
        fo = (g.get("files") or {}).get(fname)
        if not fo:
            print(f"=== {fname}: missing ===")
            continue
        data = json.loads(fo["content"])
        print(f"=== {fname} ===")
        if fname == "global-comment.json":
            chick = data.get("SquishyChick", [])
            print(f"  SquishyChick: {len(chick)} comments")
        elif fname == "global-likes.json":
            chick = data.get("SquishyChick", [])
            print(f"  SquishyChick: {len(chick)} accounts — {chick}")
        elif fname == "global-users.json":
            for login, row in list(data.items())[:5]:
                print(f"  {login}: likes={row.get('likes', [])} favorites={row.get('favorites', [])}")
            if len(data) > 5:
                print(f"  ... +{len(data) - 5} more users")
        print()

    local_path = ROOT / "data" / "miniverse-community.json"
    if local_path.is_file():
        local = json.loads(local_path.read_text(encoding="utf-8"))
        print("=== local miniverse-community.json ===")
        print(f"  v={local.get('v')} chick likes={len((local.get('likes') or {}).get('chick', []))}")
        users = local.get("users") or {}
        for login, row in list(users.items())[:3]:
            print(f"  {login}: favorites={row.get('favorites', [])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
