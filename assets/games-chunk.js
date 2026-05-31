/** Games / Recommend tab chunk — defers feed-meta until first visit. */
(function initGamesChunk() {
  let gamesPromise = null;

  window.vvEnsureGamesChunk = function vvEnsureGamesChunk() {
    if (window.__vvGamesLoaded) return Promise.resolve();
    if (gamesPromise) return gamesPromise;

    const cfg = window.VV_CHUNKS?.games;
    gamesPromise = (cfg?.bundle
      ? window.vvLoadScriptBundle(cfg.bundle, cfg.scripts)
      : window.vvLoadScripts(cfg?.scripts || ["assets/feed-meta.js"])
    )
      .then(() => {
        window.__vvGamesLoaded = true;
      })
      .catch((err) => {
        gamesPromise = null;
        throw err;
      });

    return gamesPromise;
  };
})();
