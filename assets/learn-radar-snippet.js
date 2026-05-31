/** Clean RSS/HN/Reddit snippets for radar feeds */
window.learnRadarPolish = function learnRadarPolish(text, title) {
  let t = String(text || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return title ? `Trending: ${String(title).slice(0, 100)}` : "Tap for details.";

  if (/Article URL:/i.test(t)) {
    const pts = t.match(/Points:\s*(\d+)/i);
    const com = t.match(/#\s*Comments:\s*(\d+)/i);
    const parts = [];
    if (pts) parts.push(`${pts[1]} upvotes on Hacker News`);
    if (com) parts.push(`${com[1]} comments`);
    if (parts.length) return parts.join(" · ");
  }

  t = t
    .replace(/^submitted by .*? to r\/\w+\s*/i, "")
    .replace(/\[link\]\s*/gi, "")
    .replace(/\[comments\]\s*/gi, "")
    .trim();

  if (/^https?:\/\//.test(t)) {
    return title ? `Discussion: ${String(title).slice(0, 120)}` : t;
  }

  if (t.length > 160) t = `${t.slice(0, 157)}…`;
  if (t.length < 12 && title) return `Trending: ${String(title).slice(0, 120)}`;
  return t;
};

window.learnRadarPolishItem = function learnRadarPolishItem(item) {
  const title = item.title || "";
  const summary = window.learnRadarPolish(item.summary, title);
  const bodyRaw = item.body || item.summary;
  let body = window.learnRadarPolish(bodyRaw, title);
  if (body === summary && /Article URL:/i.test(String(bodyRaw || ""))) body = summary;
  return { ...item, summary, body };
};
