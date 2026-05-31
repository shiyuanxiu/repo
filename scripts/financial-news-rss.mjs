/** Shared RSS parsing + topic classification (Node + browser mirror in assets/financial-news-rss.js) */

export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
export const STALE_MS = 5 * 60 * 1000;
export const SUMMARY_CARD_LEN = 360;
export const SUMMARY_BODY_MAX = 2400;

export const FEEDS = [
  {
    source: "CNBC",
    sourceKey: "cnbc",
    sourceIcon: "📺",
    homepage: "https://www.cnbc.com",
    url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114",
    topic: "finance",
  },
  {
    source: "NPR Business",
    sourceKey: "npr",
    sourceIcon: "📻",
    homepage: "https://www.npr.org/sections/business/",
    url: "https://feeds.npr.org/1019/rss.xml",
    topic: "business",
  },
  {
    source: "MarketWatch",
    sourceKey: "marketwatch",
    sourceIcon: "📊",
    homepage: "https://www.marketwatch.com",
    url: "https://feeds.marketwatch.com/marketwatch/topstories/",
    topic: "finance",
  },
  {
    source: "The Guardian · Business",
    sourceKey: "guardian",
    sourceIcon: "🇬🇧",
    homepage: "https://www.theguardian.com/business",
    url: "https://www.theguardian.com/business/rss",
    topic: "business",
  },
  {
    source: "AP Business",
    sourceKey: "ap",
    sourceIcon: "🗞️",
    homepage: "https://apnews.com/hub/business",
    url: "https://rsshub.app/apnews/topics/business",
    fallbacks: ["https://news.google.com/rss/search?q=site:apnews.com+business+when:7d&hl=en-US&gl=US&ceid=US:en"],
    topic: "business",
  },
  {
    source: "BBC Business",
    sourceKey: "bbc",
    sourceIcon: "🌍",
    homepage: "https://www.bbc.com/news/business",
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    topic: "business",
  },
  {
    source: "CNN Business",
    sourceKey: "cnn",
    sourceIcon: "📰",
    homepage: "https://www.cnn.com/business",
    url: "https://rss.cnn.com/rss/money_latest.rss",
    fallbacks: ["http://rss.cnn.com/rss/money_latest.rss"],
    topic: "finance",
  },
  {
    source: "Yahoo Finance",
    sourceKey: "yahoo",
    sourceIcon: "📈",
    homepage: "https://finance.yahoo.com",
    url: "https://news.google.com/rss/search?q=site:finance.yahoo.com+when:7d&hl=en-US&gl=US&ceid=US:en",
    fallbacks: ["https://finance.yahoo.com/news/rssindex"],
    topic: "finance",
  },
  {
    source: "Google · Business",
    sourceKey: "google",
    sourceIcon: "🔎",
    homepage: "https://news.google.com",
    url: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en",
    topic: "business",
  },
  {
    source: "Google · Bloomberg",
    sourceKey: "bloomberg",
    sourceIcon: "💹",
    homepage: "https://www.bloomberg.com",
    url: "https://news.google.com/rss/search?q=site:bloomberg.com+when:7d&hl=en-US&gl=US&ceid=US:en",
    topic: "finance",
  },
  {
    source: "Google · Reuters",
    sourceKey: "reuters",
    sourceIcon: "📡",
    homepage: "https://www.reuters.com",
    url: "https://news.google.com/rss/search?q=site:reuters.com+business+when:7d&hl=en-US&gl=US&ceid=US:en",
    topic: "business",
  },
];

export function decodeEntities(s) {
  return (s || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

export function stripHtml(s) {
  return decodeEntities(
    (s || "")
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

export function extractTag(block, tag) {
  const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i");
  const m1 = block.match(cdata);
  if (m1) return stripHtml(m1[1]);
  const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m2 = block.match(plain);
  return m2 ? stripHtml(m2[1]) : "";
}

export function extractNamespacedTag(block, localName) {
  const cdata = new RegExp(`<[\\w-]+:${localName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/[\\w-]+:${localName}>`, "i");
  const m1 = block.match(cdata);
  if (m1) return stripHtml(m1[1]);
  const plain = new RegExp(`<[\\w-]+:${localName}[^>]*>([\\s\\S]*?)<\\/[\\w-]+:${localName}>`, "i");
  const m2 = block.match(plain);
  return m2 ? stripHtml(m2[1]) : "";
}

export function extractLink(block) {
  const atom = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i);
  if (atom?.[1]?.startsWith("http")) return atom[1].split(" ")[0];
  let link = extractTag(block, "link");
  if (link?.startsWith("http")) return link.split(" ")[0];
  const guid = extractTag(block, "guid");
  if (guid?.startsWith("http")) return guid.split(" ")[0];
  return "";
}

export function extractDescription(block) {
  const parts = [
    extractNamespacedTag(block, "encoded"),
    extractNamespacedTag(block, "description"),
    extractTag(block, "description"),
    extractTag(block, "summary"),
    extractTag(block, "content"),
  ].filter(Boolean);
  const best = parts.sort((a, b) => b.length - a.length)[0] || "";
  return best.slice(0, SUMMARY_BODY_MAX);
}

export function truncateSummary(text, max = SUMMARY_CARD_LEN) {
  const t = (text || "").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${trimmed}…`;
}

const TECH_RULES = [
  /\bartificial intelligence\b/i,
  /\bgenerative ai\b/i,
  /\bmachine learning\b/i,
  /\bopenai\b/i,
  /\bnvidia\b/i,
  /\bsemiconductor(s)?\b/i,
  /\bcybersecurity\b/i,
  /\btech(nology| sector| stocks| company| giants)?\b/i,
  /\bstartup(s)?\b/i,
  /\b(apple|google|microsoft|amazon|meta)\b/i,
  /\bai-powered\b/i,
  /\bai robots\b/i,
  /\brobot labs\b/i,
];

const FINANCE_RULES = [
  /\bstock(s)?\b/i,
  /\bmarket(s)?\b/i,
  /\bs&p\b/i,
  /\bnasdaq\b/i,
  /\bdow jones\b/i,
  /\bwall street\b/i,
  /\bfederal reserve\b/i,
  /\binterest rate(s)?\b/i,
  /\binflation\b/i,
  /\bearnings\b/i,
  /\bipo\b/i,
  /\bportfolio\b/i,
  /\b401\s*\(\s*k\s*\)\b/i,
  /\bcrypto(currency)?\b/i,
  /\bbitcoin\b/i,
  /\btrading\b/i,
  /\brecession\b/i,
  /\bgdp\b/i,
];

export function classifyTopic(title, summary, fallback = "business") {
  const t = `${title} ${summary}`;
  if (TECH_RULES.some((re) => re.test(t))) return "tech";
  if (FINANCE_RULES.some((re) => re.test(t))) return "finance";
  return fallback || "business";
}

export function isWithinWeek(iso, weekMs = WEEK_MS) {
  return Date.now() - new Date(iso).getTime() <= weekMs;
}

export function parseDate(block) {
  const raw =
    extractTag(block, "pubDate") ||
    extractTag(block, "published") ||
    extractTag(block, "updated") ||
    extractNamespacedTag(block, "published") ||
    extractNamespacedTag(block, "updated");
  if (!raw?.trim()) return null;
  const d = new Date(raw.trim());
  if (Number.isNaN(d.getTime())) return null;
  if (d.getTime() > Date.now() + 10 * 60 * 1000) return null;
  if (Date.now() - d.getTime() > 90 * 86400000) return null;
  return d;
}

export function buildArticle(fields) {
  const body = fields.body || "";
  return {
    ...fields,
    summary: truncateSummary(body),
    body,
    excerptNote: body.length >= SUMMARY_BODY_MAX ? "Long RSS excerpt" : "RSS excerpt",
  };
}

export function parseRssXml(xml, feed, perFeed = 8, idFn) {
  const items = [];
  const itemRegex = /<(?:item|entry)[\s>][\s\S]*?<\/(?:item|entry)>/gi;
  let m;
  while ((m = itemRegex.exec(xml)) && items.length < perFeed) {
    const block = m[0];
    const title = extractTag(block, "title");
    const url = extractLink(block);
    if (!title || !url?.startsWith("http")) continue;
    const pub = parseDate(block);
    if (!pub) continue;
    const publishedAt = pub.toISOString();
    if (!isWithinWeek(publishedAt)) continue;
    const body = extractDescription(block);
    if (!body && !title) continue;
    items.push(
      buildArticle({
        id: idFn(url),
        source: feed.source,
        sourceKey: feed.sourceKey,
        sourceIcon: feed.sourceIcon,
        sourceHome: feed.homepage,
        topic: classifyTopic(title, body, feed.topic),
        title,
        body: body || title,
        url,
        publishedAt,
      }),
    );
  }
  return items;
}

export function sourceListFromFeeds(feeds = FEEDS) {
  const seen = new Set();
  const list = [{ id: "all", label: "All", icon: "🌐" }];
  for (const f of feeds) {
    if (seen.has(f.sourceKey)) continue;
    seen.add(f.sourceKey);
    list.push({ id: f.sourceKey, label: f.source.replace(/ Business$/, ""), icon: f.sourceIcon });
  }
  return list;
}

export function homepagesFromFeeds(feeds = FEEDS) {
  return Object.fromEntries(feeds.map((f) => [f.sourceKey, f.homepage]));
}
