/** Sequential script loader with in-flight dedupe (preserves execution order). */
(function initChunkLoader() {
  const cache = new Map();

  window.vvLoadScript = function vvLoadScript(src) {
    if (cache.has(src)) return cache.get(src);
    const p = new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.src = src;
      el.async = false;
      el.onload = () => resolve(src);
      el.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(el);
    });
    cache.set(src, p);
    return p;
  };

  window.vvLoadScripts = async function vvLoadScripts(list) {
    for (const src of list) await window.vvLoadScript(src);
  };

  window.vvLoadScriptBundle = async function vvLoadScriptBundle(bundleSrc, fallbackList) {
    try {
      await window.vvLoadScript(bundleSrc);
    } catch (_) {
      if (fallbackList?.length) await window.vvLoadScripts(fallbackList);
      else throw _;
    }
  };
})();
