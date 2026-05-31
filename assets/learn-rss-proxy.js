/** Unified RSS proxy for Learn feeds — race direct + proxies for speed */
(function initLearnRssProxy() {
  const HEADERS = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept: "application/rss+xml, application/xml, text/xml, application/atom+xml, */*",
    "Accept-Language": "en-US,en;q=0.9",
  };

  const PROXY_TARGETS = [
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  ];

  const isRssText = (text) =>
    typeof text === "string" && (text.includes("<item") || text.includes("<entry"));

  const withBust = (feedUrl, bust) => {
    if (!bust) return feedUrl;
    try {
      const u = new URL(feedUrl);
      u.searchParams.set("_vv", String(Date.now()));
      return u.toString();
    } catch (_) {
      return feedUrl;
    }
  };

  const readRss = async (targetUrl, headers, timeoutMs) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(targetUrl, {
        headers,
        signal: ctrl.signal,
        redirect: "follow",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!isRssText(text)) throw new Error("not RSS");
      return text;
    } finally {
      clearTimeout(timer);
    }
  };

  window.fetchRssText = async function fetchRssText(feedUrl, opts = {}) {
    const timeoutMs = opts.timeoutMs ?? 22000;
    const url = withBust(feedUrl, opts.bust !== false);

    const tasks = [
      readRss(url, HEADERS, timeoutMs),
      ...PROXY_TARGETS.map((toProxy) => readRss(toProxy(url), undefined, timeoutMs)),
    ];

    try {
      return await Promise.any(tasks);
    } catch (_) {
      throw new Error("RSS fetch failed");
    }
  };
})();
