/** Browser mirror of scripts/financial-news-rss.mjs — keep logic in sync */
window.FINANCIAL_NEWS_RSS = (function () {
  const SUMMARY_CARD_LEN = 360;
  const SUMMARY_BODY_MAX = 2400;

  function decodeEntities(s) {
    return String(s || "")
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

  function stripHtml(s) {
    return decodeEntities(
      String(s || "")
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    );
  }

  function extractTag(block, tag) {
    const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i");
    const m1 = block.match(cdata);
    if (m1) return stripHtml(m1[1]);
    const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
    const m2 = block.match(plain);
    return m2 ? stripHtml(m2[1]) : "";
  }

  function extractNamespacedTag(block, localName) {
    const cdata = new RegExp(`<[\\w-]+:${localName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/[\\w-]+:${localName}>`, "i");
    const m1 = block.match(cdata);
    if (m1) return stripHtml(m1[1]);
    const plain = new RegExp(`<[\\w-]+:${localName}[^>]*>([\\s\\S]*?)<\\/[\\w-]+:${localName}>`, "i");
    const m2 = block.match(plain);
    return m2 ? stripHtml(m2[1]) : "";
  }

  function extractLink(block) {
    const atom = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i);
    if (atom?.[1]?.startsWith("http")) return atom[1].split(" ")[0];
    let link = extractTag(block, "link");
    if (link?.startsWith("http")) return link.split(" ")[0];
    const guid = extractTag(block, "guid");
    if (guid?.startsWith("http")) return guid.split(" ")[0];
    return "";
  }

  function extractDescription(block) {
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

  function truncateSummary(text, max = SUMMARY_CARD_LEN) {
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

  function classifyTopic(title, summary, fallback = "business") {
    const t = `${title} ${summary}`;
    if (TECH_RULES.some((re) => re.test(t))) return "tech";
    if (FINANCE_RULES.some((re) => re.test(t))) return "finance";
    return fallback || "business";
  }

  function parseDate(block) {
    const raw =
      extractTag(block, "pubDate") ||
      extractTag(block, "published") ||
      extractTag(block, "updated") ||
      extractNamespacedTag(block, "published") ||
      extractNamespacedTag(block, "updated");
    if (!raw?.trim()) return null;
    const d = new Date(raw.trim());
    if (Number.isNaN(d.getTime())) return null;
    const sync = window.learnFeedSync;
    const maxAge = sync?.MAX_AGE_MS ?? 90 * 86400000;
    const skew = sync?.FUTURE_SKEW_MS ?? 10 * 60 * 1000;
    if (d.getTime() > Date.now() + skew) return null;
    if (Date.now() - d.getTime() > maxAge) return null;
    return d;
  }

  function buildArticle(fields) {
    const body = fields.body || "";
    return {
      ...fields,
      summary: truncateSummary(body),
      body,
      excerptNote: "RSS excerpt",
    };
  }

  function parseRssXml(xml, feed, perFeed, idFn) {
    const items = [];
    const re = /<(?:item|entry)[\s>][\s\S]*?<\/(?:item|entry)>/gi;
    let m;
    while ((m = re.exec(xml)) && items.length < perFeed) {
      const block = m[0];
      const title = extractTag(block, "title");
      const url = extractLink(block);
      if (!title || !url?.startsWith("http")) continue;
      const pub = parseDate(block);
      if (!pub) continue;
      const publishedAt = pub.toISOString();
      const body = extractDescription(block);
      items.push(
        buildArticle({
          id: idFn(url),
          source: feed.source,
          sourceKey: feed.sourceKey,
          sourceIcon: feed.sourceIcon,
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

  return {
    SUMMARY_CARD_LEN,
    SUMMARY_BODY_MAX,
    decodeEntities,
    truncateSummary,
    classifyTopic,
    parseRssXml,
    extractDescription,
  };
})();
