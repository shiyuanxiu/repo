#!/usr/bin/env python3
"""Print global-comment.json keys from the configured comments Gist."""
from __future__ import annotations

import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main() -> int:
    secrets = ROOT / "auth" / "secrets.js"
    config = ROOT / "auth" / "github-config.js"
    if not secrets.is_file() or not config.is_file():
        print("Missing auth/secrets.js or auth/github-config.js")
        return 1
    pat = re.search(r'githubPat:\s*"([^"]+)"', secrets.read_text(encoding="utf-8"))
    gist = re.search(r'commentsGistId:\s*"([^"]+)"', config.read_text(encoding="utf-8"))
    if not pat or not gist:
        print("Missing PAT or commentsGistId")
        return 1
    req = urllib.request.Request(
        f"https://api.github.com/gists/{gist.group(1)}",
        headers={
            "Authorization": f"token {pat.group(1)}",
            "Accept": "application/vnd.github+json",
            "User-Agent": "Miniverse-Verify",
        },
    )
    raw = urllib.request.urlopen(req, timeout=90).read()
    data = json.loads(raw)
    blob = json.loads(data["files"]["global-comment.json"]["content"])
    print(f"Gist {gist.group(1)} — {len(blob)} game keys:")
    for key in sorted(blob.keys()):
        items = blob[key]
        n = len(items) if isinstance(items, list) else "?"
        print(f"  {key}: {n} comments")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
