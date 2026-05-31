/** Learn tab chunk loader — core bundle on tab switch, hubs on scroll into view. */
(function initLearnChunk() {
  const loadedSections = new Set();
  let corePromise = null;
  let hubObserver = null;

  const sectionScripts = (section) => {
    const map = window.VV_CHUNKS?.learnSections || {};
    return map[section] || null;
  };

  const loadChunk = (cfg) => {
    if (!cfg) return Promise.resolve();
    if (cfg.bundle) {
      return window.vvLoadScriptBundle(cfg.bundle, cfg.scripts);
    }
    return window.vvLoadScripts(cfg.scripts || []);
  };

  window.vvEnsureLearnCore = function vvEnsureLearnCore() {
    if (window.__vvLearnCoreLoaded) return Promise.resolve();
    if (corePromise) return corePromise;
    corePromise = loadChunk(window.VV_CHUNKS?.learnCore)
      .then(() => {
        window.__vvLearnCoreLoaded = true;
        setupHubObserver();
      })
      .catch((err) => {
        corePromise = null;
        throw err;
      });
    return corePromise;
  };

  window.vvEnsureLearnSection = async function vvEnsureLearnSection(section) {
    if (!section || loadedSections.has(section)) return;
    await window.vvEnsureLearnCore();
    const scripts = sectionScripts(section);
    if (!scripts) return;
    await window.vvLoadScripts(scripts);
    loadedSections.add(section);
  };

  const primeVisibleSections = () => {
    document
      .querySelectorAll(".knowledge-feed-item[data-learn-section]:not(.hidden)")
      .forEach((art) => {
        if (isNearViewport(art)) {
          window.vvEnsureLearnSection(art.dataset.learnSection).catch(() => {});
        }
      });
  };

  function isNearViewport(el) {
    const feed = document.getElementById("feed");
    if (!feed || !el) return false;
    const r = el.getBoundingClientRect();
    const fr = feed.getBoundingClientRect();
    const margin = 160;
    return r.top < fr.bottom + margin && r.bottom > fr.top - margin;
  }

  function setupHubObserver() {
    if (hubObserver) return;
    const feed = document.getElementById("feed");
    if (!feed || !("IntersectionObserver" in window)) {
      primeVisibleSections();
      return;
    }

    hubObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = entry.target.dataset?.learnSection;
          if (section) window.vvEnsureLearnSection(section).catch(() => {});
        });
      },
      { root: feed, rootMargin: "180px 0px", threshold: 0.05 },
    );

    document.querySelectorAll(".knowledge-feed-item[data-learn-section]").forEach((art) => {
      hubObserver.observe(art);
    });
    primeVisibleSections();
  }

  window.vvEnsureLearnChunk = function vvEnsureLearnChunk() {
    return window.vvEnsureLearnCore();
  };

  const PRIORITY_SECTIONS = ["radar", "aitools", "finance", "stocks", "career"];

  window.vvIsLearnSectionLoaded = function vvIsLearnSectionLoaded(section) {
    return loadedSections.has(section);
  };

  window.vvPrefetchLearnSections = async function vvPrefetchLearnSections(sections = PRIORITY_SECTIONS) {
    await window.vvEnsureLearnCore();
    await Promise.allSettled(sections.map((s) => window.vvEnsureLearnSection(s)));
    window.dispatchEvent(new CustomEvent("vv-learn-sections-prefetched"));
  };

  window.vvOnLearnTabActive = function vvOnLearnTabActive() {
    return window.vvEnsureLearnCore().then(() => {
      primeVisibleSections();
      window.vvPrefetchLearnSections(PRIORITY_SECTIONS).catch(() => {});
    });
  };
})();
