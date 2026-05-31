#!/usr/bin/env python3
"""Remove fake social counts and picsum avatars from index.html."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
html = ROOT / "index.html"
text = html.read_text(encoding="utf-8")

# Remove numeric spans from stat buttons
text = re.sub(
    r'(<button class="stat-btn" data-action="like")',
    r'\1 aria-label="Like"',
    text,
)
text = re.sub(
    r'(<button class="stat-btn" data-action="star")',
    r'\1 aria-label="Save"',
    text,
)
text = re.sub(
    r'(<button class="stat-btn" data-action="comment")',
    r'\1 aria-label="Comment"',
    text,
)
text = re.sub(
    r'(<button class="stat-btn" data-action="share")',
    r'\1 aria-label="Share"',
    text,
)
text = re.sub(r'<span>\d+</span></button>\s*\n(\s*<button class="stat-btn" data-action="star")', r'</button>\n\1', text)
text = re.sub(r'(<button class="stat-btn"[^>]*>.*?</svg>)<span>\d+</span>', r'\1', text, flags=re.DOTALL)

AVATARS = {
    "profile": "✦",
    "moodsign": "🌸",
    "wanzhou": "🌍",
    "foresthut": "🐣",
    "pixeldeer": "🦌",
    "woodshop": "🏪",
    "pondskip": "🐸",
    "neondash": "⚡",
    "superface": "💅",
    "flavorbox": "🎁",
    "gensente": "✨",
    "petoffice": "🐾",
    "rainbowlake": "🌈",
    "mjdraw": "🀄",
    "starcatch": "⭐",
    "stacktower": "🧱",
    "memoryflip": "🃏",
    "nummerge": "🔢",
    "beattap": "🎵",
}

def avatar_repl(m):
    seed = m.group(1)
    emoji = AVATARS.get(seed, "🎮")
    return f'<span class="feed-avatar" aria-hidden="true">{emoji}</span>'

text = re.sub(
    r'<img src="https://picsum\.photos/seed/([^/]+)/[^"]*" alt="[^"]*">',
    avatar_repl,
    text,
)
text = re.sub(
    r'<img src="https://picsum\.photos/seed/([^/]+)/[^"]*" alt="">',
    avatar_repl,
    text,
)

html.write_text(text, encoding="utf-8")
print("Updated", html)
