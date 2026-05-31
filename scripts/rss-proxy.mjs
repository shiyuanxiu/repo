/** Unified RSS fetch — direct first, then shared proxy chain (server + browser parity) */

export const RSS_FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/rss+xml, application/xml, text/xml, application/atom+xml, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

export const RSS_PROXY_TARGETS = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

export function isRssText(text) {
  return typeof text === "string" && (text.includes("<item") || text.includes("<entry"));
}

export async function fetchRssText(feedUrl, opts = {}) {
  const timeoutMs = opts.timeoutMs ?? 28000;
  let lastErr;

  try {
    const res = await fetch(feedUrl, {
      headers: RSS_FETCH_HEADERS,
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (isRssText(text)) return text;
    throw new Error("not RSS");
  } catch (e) {
    lastErr = e;
  }

  for (const toProxy of RSS_PROXY_TARGETS) {
    try {
      const res = await fetch(toProxy(feedUrl), { signal: AbortSignal.timeout(timeoutMs) });
      if (!res.ok) throw new Error("proxy error");
      const text = await res.text();
      if (isRssText(text)) return text;
      throw new Error("not RSS");
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error("RSS fetch failed");
}
