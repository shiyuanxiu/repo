/** Learn feed — daily picks, quick nav, skip thin radars in scroll */
(function initLearnPicks() {
  const intro = document.getElementById("feedIntroLearn");
  if (!intro) return;

  const SECTIONS = {
    radar: { hub: "hotspotHubItem", emoji: "📡", title: "Hotspot Radar", tag: "News", data: "HOTSPOT_RADAR" },
    aitools: { hub: "aiToolsHubItem", emoji: "🤖", title: "AI Tools Daily", tag: "Tools" },
    mind: { hub: "mindHubItem", emoji: "🌿", title: "Mind Check-in", tag: "Guide" },
    campus: { hub: "campusHubItem", emoji: "🏫", title: "Campus Life", tag: "News", data: "CAMPUS_LIFE", group: "more" },
    dating: { hub: "datingHubItem", emoji: "💕", title: "Dating 101", tag: "Guide" },
    career: { hub: "careerHubItem", emoji: "💼", title: "Career Radar", tag: "News", data: "JOB_RADAR" },
    jobs: { hub: "careerHubItem", emoji: "💼", title: "Career · Jobs", tag: "News", data: "JOB_RADAR", careerTab: "jobs" },
    startup: { hub: "careerHubItem", emoji: "🚀", title: "Career · Startups", tag: "News", data: "STARTUP_WIRE", careerTab: "startup" },
    creatorplay: { hub: "creatorPlayHubItem", emoji: "🎬", title: "Creator & Play", tag: "News", data: "GAMING_PULSE", group: "more" },
    gaming: { hub: "creatorPlayHubItem", emoji: "🎮", title: "Creator · Gaming", tag: "News", data: "GAMING_PULSE", group: "more", playTab: "gaming" },
    creator: { hub: "creatorPlayHubItem", emoji: "🎬", title: "Creator · News", tag: "News", data: "CREATOR_KIT", group: "more", playTab: "creator" },
    wellness: { hub: "wellnessHubItem", emoji: "🌿", title: "Wellness Wire", tag: "News", data: "WELLNESS_WIRE", group: "more" },
    climate: { hub: "climateHubItem", emoji: "🌍", title: "Climate Brief", tag: "News", data: "CLIMATE_BRIEF", group: "more" },
    food: { hub: "foodHubItem", emoji: "🍜", title: "Food on Campus", tag: "News", data: "FOOD_CAMPUS", group: "more" },
    finance: { hub: "financeHubItem", emoji: "📈", title: "Finance News", tag: "News", data: "FINANCIAL_NEWS" },
    stocks: { hub: "stockPulseHubItem", emoji: "🇺🇸", title: "US Hot Stocks", tag: "News", data: "STOCK_PULSE" },
    hustle: { hub: "hustleHubItem", emoji: "💡", title: "Side Hustle Lab", tag: "Guide" },
    vibecoding: { hub: "vibeHubItem", emoji: "🌱", title: "Vibe Coding", tag: "Guide" },
    wiki: { hub: "catWikiHubItem", emoji: "🐱", title: "Cat Encyclopedia", tag: "Fun" },
    worldcup: { hub: "wcHubItem", emoji: "⚽", title: "World Cup", tag: "Fun" },
    space: { hub: "spaceHubItem", emoji: "🛸", title: "Space News", tag: "Fun" },
    poetry: { hub: "poetryHubItem", emoji: "📜", title: "Daily Poetry", tag: "Fun" },
  };

  const MORE_SECTIONS = ["campus", "creatorplay", "wellness", "climate", "food"];
  const MIN_FULL = 5;

  const daySeed = () => {
    const d = new Date();
    return d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate();
  };

  const feedCount = (key) => {
    if (!key) return 99;
    const list = window[key];
    const meta = window[`${key}_META`];
    if (Array.isArray(list)) return list.length;
    if (meta?.count != null) return meta.count;
    return 0;
  };

  const SYNC = window.learnFeedSync || {};

  const sectionMeta = (sectionId) => {
    const meta = feedMetaFor(sectionId);
    const count = sectionItemCount(sectionId);
    return SYNC.normalizeFeedMeta ? SYNC.normalizeFeedMeta({ ...meta, count }) : { ...meta, count };
  };

  const isOfflineFeed = (sectionId) => {
    const cfg = SECTIONS[sectionId];
    if (!cfg?.data) return false;
    if (window.vvIsLearnSectionLoaded && !window.vvIsLearnSectionLoaded(sectionId)) return false;
    const m = sectionMeta(sectionId);
    return m.tier === "bundle";
  };

  const feedMetaFor = (sectionId) => {
    if (sectionId === "creatorplay") {
      const g = window.GAMING_PULSE_META || {};
      const c = window.CREATOR_KIT_META || {};
      return {
        offline: g.offline || c.offline,
        live: g.live && c.live,
        bundle: g.bundle || c.bundle,
      };
    }
    if (sectionId === "career") {
      const j = window.JOB_RADAR_META || {};
      const s = window.STARTUP_WIRE_META || {};
      return {
        offline: j.offline || s.offline,
        live: j.live && s.live,
        bundle: j.bundle || s.bundle,
      };
    }
    const key = SECTIONS[sectionId]?.data;
    return key ? window[`${key}_META`] || {} : {};
  };

  const activeLearnArticle = () => {
    const feed = document.getElementById("feed");
    if (!feed) return null;
    const feedRect = feed.getBoundingClientRect();
    const items = [...feed.querySelectorAll(".knowledge-feed-item:not(.hidden)")];
    let best = null;
    let bestVisible = 0;
    for (const el of items) {
      const rect = el.getBoundingClientRect();
      const visible = Math.min(rect.bottom, feedRect.bottom) - Math.max(rect.top, feedRect.top);
      if (visible > bestVisible) {
        bestVisible = visible;
        best = el;
      }
    }
    return best;
  };

  const syncLearnSearch = (query) => {
    const art = activeLearnArticle();
    const hint = document.getElementById("learnFeedSearchHint");
    if (!art) {
      if (hint) hint.textContent = "Scroll to a mini-app to search its content";
      return;
    }
    const section = art.dataset.learnSection;
    const cfg = SECTIONS[section];
    const input = art.querySelector('input[type="search"]');
    if (input) {
      input.value = query;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      if (hint) hint.innerHTML = query ? `Filtering <strong>${cfg?.title || section}</strong> · ${query}` : `Search <strong>${cfg?.title || section}</strong> · type to filter list`;
    } else if (hint) {
      hint.innerHTML = `<strong>${cfg?.title || section}</strong> has no list search — use chips above to jump`;
    }
  };

  const bindLearnSearch = () => {
    const input = document.getElementById("learnFeedSearch");
    if (!input || input.dataset.bound) return;
    input.dataset.bound = "1";
    input.addEventListener("input", () => syncLearnSearch(input.value));
    input.addEventListener("search", () => {
      if (!input.value.trim()) syncLearnSearch("");
    });
    const feed = document.getElementById("feed");
    if (feed && !feed.dataset.learnSearchScroll) {
      feed.dataset.learnSearchScroll = "1";
      feed.addEventListener("scroll", () => {
        const searchInput = document.getElementById("learnFeedSearch");
        if (!searchInput) return;
        syncLearnSearch(searchInput.value || "");
      }, { passive: true });
    }
  };

  window.focusLearnFeedSearch = () => {
    document.getElementById("learnFeedSearch")?.focus();
  };
  window.syncLearnSearch = syncLearnSearch;

  const expandSection = (learn) => {
    const cfg = SECTIONS[learn];
    if (!cfg) return null;
    const el = document.getElementById(cfg.hub);
    if (!el) return null;
    el.classList.remove("learn-feed-skip", "learn-feed-compact", "learn-feed-offline");
    el.classList.add("learn-feed-expanded");
    el.querySelector(".learn-feed-compact-bar")?.remove();
    el.querySelector(".learn-offline-ribbon")?.remove();
    return el;
  };

  window.scrollToLearnSection = async (learn) => {
    const sectionKey =
      learn === "jobs" || learn === "startup"
        ? learn
        : learn === "gaming" || learn === "creator"
          ? learn
          : learn;
    if (typeof window.vvEnsureLearnSection === "function") {
      await window.vvEnsureLearnSection(sectionKey);
    }
    const cfg = SECTIONS[learn];
    if (cfg?.playTab && typeof window.scrollToCreatorPlayTab === "function") {
      window.scrollToCreatorPlayTab(cfg.playTab);
      return;
    }
    if ((learn === "creatorplay" || learn === "gaming" || learn === "creator") && typeof window.scrollToCreatorPlayTab === "function") {
      window.scrollToCreatorPlayTab(learn === "creator" ? "creator" : "gaming");
      return;
    }
    if (cfg?.careerTab && typeof window.scrollToCareerTab === "function") {
      window.scrollToCareerTab(cfg.careerTab);
      return;
    }
    if ((learn === "career" || learn === "jobs" || learn === "startup") && typeof window.scrollToCareerTab === "function") {
      window.scrollToCareerTab(learn === "startup" ? "startup" : "jobs");
      return;
    }
    const el = expandSection(learn);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.refreshFeedProgress?.();
  };

  const pickDaily = () => {
    const seed = daySeed();
    const guides = ["mind", "dating", "hustle", "vibecoding", "aitools"];
    const newsPool = ["career", "stocks", "creatorplay", "wellness", "food", "climate", "campus"]
      .map((id) => {
        const dataKey = SECTIONS[id]?.data;
        let count = feedCount(dataKey);
        if (id === "career") {
          count = Math.max(feedCount("JOB_RADAR"), feedCount("STARTUP_WIRE"));
        }
        if (id === "creatorplay") {
          count = Math.max(feedCount("GAMING_PULSE"), feedCount("CREATOR_KIT"));
        }
        return { id, count };
      })
      .filter((x) => x.count >= MIN_FULL || !SECTIONS[x.id]?.group || x.count > 0)
      .sort((a, b) => b.count - a.count);
    const g1 = guides[seed % guides.length];
    const n1 = newsPool[0]?.id || newsPool[seed % Math.max(newsPool.length, 1)]?.id || "career";
    return [
      { id: "radar", ...SECTIONS.radar },
      { id: g1, ...SECTIONS[g1] },
      { id: n1, ...SECTIONS[n1] },
    ];
  };

  const chipGroups = () => [
    {
      label: "News",
      ids: ["radar", "career", "stocks", "finance"],
    },
    {
      label: "Guides",
      ids: ["aitools", "mind", "dating", "hustle", "vibecoding"],
    },
    {
      label: "More",
      ids: ["creatorplay", "wellness", "food", "climate", "campus", "wiki", "space", "poetry"],
    },
  ];

  const sectionItemCount = (id) => {
    if (id === "creatorplay") return Math.max(feedCount("GAMING_PULSE"), feedCount("CREATOR_KIT"));
    if (id === "career") return Math.max(feedCount("JOB_RADAR"), feedCount("STARTUP_WIRE"));
    const cfg = SECTIONS[id];
    return feedCount(cfg?.data);
  };

  const renderMoreList = () => {
    return MORE_SECTIONS.map((id) => {
      const cfg = SECTIONS[id];
      const count = sectionItemCount(id);
      const thin = isOfflineFeed(id);
      return `<button type="button" class="learn-more-item${thin ? " learn-more-item--thin" : ""}" data-learn="${id}">
        <span class="learn-more-emoji">${cfg.emoji}</span>
        <span class="learn-more-text">
          <strong>${cfg.title}</strong>
          <span>${count ? (thin ? `Offline pack · ${count} stories` : `${count} stories`) : "Offline pack · tap Refresh"}</span>
        </span>
      </button>`;
    }).join("");
  };

  const allQuickIds = () => {
    const seen = new Set();
    const ids = [];
    chipGroups().forEach((g) => g.ids.forEach((id) => {
      if (!seen.has(id) && SECTIONS[id]) {
        seen.add(id);
        ids.push(id);
      }
    }));
    return ids;
  };

  const MINI_APP_COUNT = 18;

  const render = () => {
    const picks = pickDaily();
    const offlineMore = MORE_SECTIONS.filter(isOfflineFeed).length;
    intro.innerHTML = `
      <div class="learn-toolbar">
        <div class="learn-toolbar-row">
          <div class="learn-feed-search-wrap">
            <label class="learn-feed-search-label" for="learnFeedSearch">Search current mini-app</label>
            <input type="search" class="learn-feed-search" id="learnFeedSearch" placeholder="Search feed…" autocomplete="off" enterkeyhint="search">
          </div>
          <button type="button" class="learn-nav-toggle" id="learnNavToggle" aria-expanded="false" aria-controls="learnNavDrawer">
            Browse <span class="learn-nav-count">${MINI_APP_COUNT}</span>
          </button>
        </div>
        <p class="learn-feed-search-hint" id="learnFeedSearchHint" aria-live="polite">Swipe ↕ mini-apps · <strong>/</strong> to search</p>
      </div>
      <div class="learn-nav-drawer hidden" id="learnNavDrawer">
        <p class="learn-drawer-label">Today's picks</p>
        <div class="learn-picks-scroll">
          ${picks
            .map(
              (p) => `<button type="button" class="learn-quick-pill learn-quick-pill--pick" data-learn="${p.id}">
            <span aria-hidden="true">${p.emoji}</span> ${p.title.split(" ")[0]}
          </button>`,
            )
            .join("")}
        </div>
        <p class="learn-drawer-label">Jump to</p>
        <div class="learn-picks-scroll learn-chips-scroll">
          ${allQuickIds()
            .map(
              (id) => `<button type="button" class="learn-quick-pill" data-learn="${id}">${SECTIONS[id].emoji} ${SECTIONS[id].title.split(" ")[0]}</button>`,
            )
            .join("")}
        </div>
        <div class="learn-more-wrap">
          <button type="button" class="learn-more-toggle" id="learnMoreToggle" aria-expanded="false">
            More feeds${offlineMore ? ` · ${offlineMore} offline` : ""} <span class="learn-more-count">${MORE_SECTIONS.length}</span>
          </button>
          <div class="learn-more-panel hidden" id="learnMorePanel">${renderMoreList()}</div>
        </div>
      </div>`;

    intro.classList.remove("is-nav-open");

    const closeNavDrawer = () => {
      intro.classList.remove("is-nav-open");
      intro.querySelector("#learnNavDrawer")?.classList.add("hidden");
      intro.querySelector("#learnNavToggle")?.setAttribute("aria-expanded", "false");
    };

    intro.querySelectorAll("[data-learn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.scrollToLearnSection(btn.getAttribute("data-learn"));
        closeNavDrawer();
      });
    });

    intro.querySelector("#learnNavToggle")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const panel = intro.querySelector("#learnNavDrawer");
      const btn = intro.querySelector("#learnNavToggle");
      const open = panel?.classList.toggle("hidden") === false;
      intro.classList.toggle("is-nav-open", open);
      if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    intro.querySelector("#learnMoreToggle")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const panel = intro.querySelector("#learnMorePanel");
      const btn = intro.querySelector("#learnMoreToggle");
      const open = panel?.classList.toggle("hidden") === false;
      if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    if (!intro.dataset.navBound) {
      intro.dataset.navBound = "1";
      document.addEventListener("click", (e) => {
        if (!intro.classList.contains("is-nav-open")) return;
        if (e.target.closest("#feedIntroLearn")) return;
        closeNavDrawer();
      });
    }
  };

  const applyOfflineBadges = () => {
    document.querySelectorAll(".knowledge-feed-item[data-learn-section]").forEach((art) => {
      const section = art.dataset.learnSection;
      const cfg = SECTIONS[section];
      const expanded = art.classList.contains("learn-feed-expanded");

      if (!cfg?.data) {
        art.classList.remove("learn-feed-offline", "learn-feed-compact", "learn-feed-skip");
        art.querySelector(".learn-feed-compact-bar")?.remove();
        art.querySelector(".learn-offline-ribbon")?.remove();
        return;
      }

      const count = sectionItemCount(section);
      const m = sectionMeta(section);
      const offline = m.tier === "bundle";

      if (!expanded && offline && count === 0) {
        art.classList.add("learn-feed-compact");
        art.classList.remove("learn-feed-skip");
        if (!art.querySelector(".learn-feed-compact-bar")) {
          const bar = document.createElement("button");
          bar.type = "button";
          bar.className = "learn-feed-compact-bar";
          bar.innerHTML = `<span class="learn-feed-compact-emoji">${cfg.emoji}</span><span class="learn-feed-compact-text"><strong>${cfg.title}</strong> · Offline pack · tap Refresh for live</span><span class="learn-feed-compact-arrow">›</span>`;
          bar.addEventListener("click", () => window.scrollToLearnSection(section));
          art.insertBefore(bar, art.firstChild);
        }
      } else {
        art.classList.remove("learn-feed-compact", "learn-feed-skip");
        art.querySelector(".learn-feed-compact-bar")?.remove();
      }

      art.classList.toggle("learn-feed-offline", m.tier === "bundle" && !expanded);

      let ribbon = art.querySelector(".learn-offline-ribbon");
      if (m.tier === "bundle" && !expanded && count >= MIN_FULL) {
        if (!ribbon) {
          ribbon = document.createElement("div");
          ribbon.className = "learn-offline-ribbon";
          ribbon.setAttribute("role", "status");
          art.insertBefore(ribbon, art.firstChild);
        }
        ribbon.textContent = SYNC.formatStatusLabel
          ? SYNC.formatStatusLabel(m, count)
          : `Offline pack · ${count} stories · tap Refresh for live`;
      } else {
        ribbon?.remove();
      }
    });
    window.refreshFeedProgress?.();
  };

  render();
  applyOfflineBadges();
  bindLearnSearch();
  syncLearnSearch("");

  window.addEventListener("vv-learn-radar-update", () => applyOfflineBadges());
  window.addEventListener("vv-learn-sections-prefetched", () => applyOfflineBadges());

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.dataset.tab === "knowledge") setTimeout(applyOfflineBadges, 400);
    });
  });

  window.refreshLearnPicks = () => {
    const prev = document.getElementById("learnFeedSearch")?.value || "";
    render();
    applyOfflineBadges();
    bindLearnSearch();
    const input = document.getElementById("learnFeedSearch");
    if (input && prev) {
      input.value = prev;
      syncLearnSearch(prev);
    } else {
      syncLearnSearch("");
    }
  };
})();
