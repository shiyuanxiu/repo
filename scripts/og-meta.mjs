export const SITE = "https://miniverse.gg";
export const BRAND = "Miniverse";
export const OG_DEFAULT = `${SITE}/assets/og/og-default.png`;

export function ogImagePath(category) {
  if (category && category !== "default") {
    return `${SITE}/assets/og/og-${category}.svg`;
  }
  return OG_DEFAULT;
}

export function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderOgMeta({ url, title, description, image = OG_DEFAULT }) {
  const desc = esc(description.slice(0, 160));
  return `  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${image}">`;
}

export function siteChromeNav(root = "") {
  return `  <header class="site-chrome">
    <div class="site-chrome-inner">
      <a class="site-chrome-brand" href="${root}index.html"><span aria-hidden="true">✦</span> ${BRAND}</a>
      <nav class="site-chrome-nav" aria-label="Site">
        <a href="${root}index.html">Play</a>
        <a href="${root}games/index.html">Guides</a>
        <a href="${root}categories/arcade.html">Categories</a>
        <a href="${root}play-tips.html">Tips</a>
      </nav>
    </div>
  </header>`;
}

export function siteFooter(root = "") {
  return `  <footer class="site-chrome-footer">
    <p>© 2026 ${BRAND} · <a href="${root}about.html">About</a> · <a href="${root}whats-new.html">What's new</a> · <a href="${root}contact.html">Contact</a> · <a href="${root}privacy.html">Privacy</a> · <a href="${root}terms.html">Terms</a></p>
  </footer>`;
}
