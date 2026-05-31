/* Classical Chinese Poetry mini-app — Learn tab feed #5 */
(function initPoetryApp() {
  const DATA = window.POETRY_APP;
  const root = document.getElementById("poApp");
  if (!root || !DATA) return;

  const SAVED_KEY = "vv_poetry_app_saved";
  const BGM_KEY = "vv_poetry_app_bgm";
  let view = "home";
  let detailId = null;
  let themeFilter = null;
  let emotionFilter = null;
  let searchQuery = "";
  let speaking = false;
  let speechQueue = [];

  const BGM_VOL = 0.42;
  const BGM_DUCK = 0.1;

  const bgmEl = document.getElementById("poBgm");
  const bgmBtn = document.getElementById("poBgmToggle");
  const detailEl = document.getElementById("poDetail");
  const popularEl = document.getElementById("poPopularList");
  const savedEl = document.getElementById("poSavedList");
  const searchInput = document.getElementById("poSearchInput");
  const searchResults = document.getElementById("poSearchResults");
  const themeTagsEl = document.getElementById("poThemeTags");
  const emotionTagsEl = document.getElementById("poEmotionTags");

  const escapeHtml = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const getSaved = () => {
    try {
      return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"));
    } catch (_) {
      return new Set();
    }
  };

  const saveSaved = (set) => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify([...set]));
    } catch (_) {}
  };

  const toggleSaved = (id) => {
    const s = getSaved();
    if (s.has(id)) s.delete(id);
    else s.add(id);
    saveSaved(s);
    return s.has(id);
  };

  const isBgmOn = () => localStorage.getItem(BGM_KEY) !== "off";

  const playBgm = () => {
    if (!bgmEl || !isBgmOn()) return;
    bgmEl.loop = true;
    bgmEl.volume = speaking ? BGM_DUCK : BGM_VOL;
    return bgmEl.play();
  };

  const duckBgm = () => {
    if (bgmEl && isBgmOn()) bgmEl.volume = BGM_DUCK;
  };

  const restoreBgmVol = () => {
    if (bgmEl && isBgmOn()) bgmEl.volume = BGM_VOL;
  };

  const pauseBgm = () => {
    bgmEl?.pause();
  };

  const setBgmOn = (on) => {
    localStorage.setItem(BGM_KEY, on ? "on" : "off");
    bgmBtn?.classList.toggle("active", on);
    bgmBtn?.setAttribute("aria-pressed", on ? "true" : "false");
    if (!on) {
      pauseBgm();
      return;
    }
    playBgm()?.catch(() => {
      if (typeof showAppToast === "function") showAppToast("Tap 🎵 again to start music");
    });
  };

  const pickVoice = (langPrefix) => {
    const synth = window.speechSynthesis;
    if (!synth) return null;
    const voices = synth.getVoices();
    return voices.find((v) => v.lang.replace("_", "-").toLowerCase().startsWith(langPrefix)) || null;
  };

  const stopSpeech = () => {
    speechQueue = [];
    speaking = false;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    restoreBgmVol();
    document.getElementById("poDetailRead")?.classList.remove("speaking");
  };

  const runSpeechQueue = () => {
    if (!speechQueue.length) {
      speaking = false;
      restoreBgmVol();
      document.getElementById("poDetailRead")?.classList.remove("speaking");
      return;
    }
    const item = speechQueue.shift();
    const utter = new SpeechSynthesisUtterance(item.text);
    utter.lang = item.lang;
    utter.rate = item.rate;
    const voice = pickVoice(item.langPrefix);
    if (voice) utter.voice = voice;
    utter.onend = runSpeechQueue;
    utter.onerror = runSpeechQueue;
    window.speechSynthesis.speak(utter);
  };

  const speakPoem = (p) => {
    if (!window.speechSynthesis || !p) return;
    stopSpeech();
    if (isBgmOn()) playBgm()?.catch(() => {});
    duckBgm();
    speaking = true;
    document.getElementById("poDetailRead")?.classList.add("speaking");

    speechQueue = [
      {
        text: `${p.titleZh}。作者，${p.authorZh}。${p.linesZh.join("")}`,
        lang: "zh-CN",
        langPrefix: "zh",
        rate: 0.82,
      },
      {
        text: `${p.titleEn}, by ${p.authorEn}. ${p.linesEn.join(" ")}`,
        lang: "en-US",
        langPrefix: "en",
        rate: 0.9,
      },
      {
        text: `Meaning. ${p.meaning}`,
        lang: "en-US",
        langPrefix: "en",
        rate: 0.92,
      },
    ];
    runSpeechQueue();
  };

  const dailyPoem = () => {
    const day = Math.floor(Date.now() / 86400000);
    return DATA.poems[day % DATA.poems.length];
  };

  const formatDate = () => {
    const d = new Date();
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const poemMatches = (p, q) => {
    if (!q) return true;
    const hay = [
      p.titleZh,
      p.titleEn,
      p.authorZh,
      p.authorEn,
      p.dynasty,
      p.meaning,
      ...p.linesZh,
      ...p.linesEn,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  };

  const filterPoems = () => {
    const q = searchQuery.trim().toLowerCase();
    return DATA.poems.filter((p) => {
      const themeOk = !themeFilter || p.themes.includes(themeFilter);
      const emoOk = !emotionFilter || p.emotions.includes(emotionFilter);
      return themeOk && emoOk && poemMatches(p, q);
    });
  };

  const linesHtml = (p) =>
    p.linesZh
      .map(
        (zh, i) =>
          `<p class="po-line-zh">${escapeHtml(zh)}</p><p class="po-line-en">${escapeHtml(p.linesEn[i] || "")}</p>`,
      )
      .join("");

  const excerptHtml = (p) => {
    const zh = p.linesZh.slice(0, 2).join("");
    const en = p.linesEn.slice(0, 2).join(" ");
    return `<p class="po-excerpt-zh">${escapeHtml(zh)}</p><p class="po-excerpt-en">${escapeHtml(en)}</p>`;
  };

  const poemCardHtml = (p, saved) =>
    `<button type="button" class="po-poem-card" data-po-poem="${escapeHtml(p.id)}">
      <span class="po-poem-dynasty">${escapeHtml(p.dynasty)}</span>
      <h3 class="po-poem-title">${escapeHtml(p.titleEn)}</h3>
      <p class="po-poem-author">${escapeHtml(p.authorEn)} · <span lang="zh">${escapeHtml(p.titleZh)}</span></p>
      ${excerptHtml(p)}
    </button>`;

  const switchView = (v) => {
    view = v;
    stopSpeech();
    detailEl?.classList.add("hidden");
    detailId = null;
    root.querySelectorAll("[data-po-panel]").forEach((p) => {
      p.classList.toggle("active", p.dataset.poPanel === v);
    });
    root.querySelectorAll("[data-po-nav]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.poNav === v);
    });
    if (v === "saved") renderSaved();
    if (v === "browse") renderPopular();
    if (v === "search") renderSearch();
  };

  const renderHome = () => {
    const p = dailyPoem();
    const verse = DATA.poems.find((x) => x.id === "shui-diao-ge-tou") || p;
    document.getElementById("poVerseZh").textContent = verse.linesZh.join("");
    document.getElementById("poVerseEn").textContent = verse.linesEn.join(" ");
    const dailyCard = document.getElementById("poDailyCard");
    if (dailyCard) {
      dailyCard.innerHTML = `
        <div class="po-daily-head">
          <span class="po-daily-label">✦ Today's Pick</span>
          <span class="po-daily-date">${formatDate()}</span>
        </div>
        <h3 class="po-daily-title">${escapeHtml(p.titleEn)}</h3>
        <p class="po-daily-meta">${escapeHtml(p.dynasty)} · ${escapeHtml(p.authorEn)} <span lang="zh">（${escapeHtml(p.authorZh)}）</span></p>
        ${excerptHtml(p)}
        <span class="po-daily-more">Read full poem →</span>`;
      dailyCard.dataset.poPoem = p.id;
      dailyCard.onclick = () => openDetail(p.id);
    }
    const preview = document.getElementById("poPopularPreview");
    if (preview) {
      preview.innerHTML = DATA.poems.slice(0, 4).map((po) => poemCardHtml(po)).join("");
      preview.querySelectorAll("[data-po-poem]").forEach((btn) => {
        btn.addEventListener("click", () => openDetail(btn.dataset.poPoem));
      });
    }
  };

  const renderPopular = () => {
    if (!popularEl) return;
    popularEl.innerHTML = DATA.poems.map((p) => poemCardHtml(p)).join("");
    popularEl.querySelectorAll("[data-po-poem]").forEach((btn) => {
      btn.addEventListener("click", () => openDetail(btn.dataset.poPoem));
    });
  };

  const renderThemeTags = () => {
    if (!themeTagsEl) return;
    themeTagsEl.innerHTML = DATA.themeCategories
      .map(
        (c) =>
          `<button type="button" class="po-tag po-tag--theme${themeFilter === c.id ? " active" : ""}" data-po-theme="${c.id}">${c.icon} ${escapeHtml(c.label)}</button>`,
      )
      .join("");
    themeTagsEl.querySelectorAll("[data-po-theme]").forEach((btn) => {
      btn.addEventListener("click", () => {
        themeFilter = themeFilter === btn.dataset.poTheme ? null : btn.dataset.poTheme;
        renderThemeTags();
        renderSearch();
      });
    });
  };

  const renderEmotionTags = () => {
    if (!emotionTagsEl) return;
    emotionTagsEl.innerHTML = DATA.emotionCategories
      .map(
        (c) =>
          `<button type="button" class="po-tag po-tag--${c.color}${emotionFilter === c.id ? " active" : ""}" data-po-emotion="${c.id}">${escapeHtml(c.label)}</button>`,
      )
      .join("");
    emotionTagsEl.querySelectorAll("[data-po-emotion]").forEach((btn) => {
      btn.addEventListener("click", () => {
        emotionFilter = emotionFilter === btn.dataset.poEmotion ? null : btn.dataset.poEmotion;
        renderEmotionTags();
        renderSearch();
      });
    });
  };

  const renderSearch = () => {
    if (!searchResults) return;
    const list = filterPoems();
    searchResults.innerHTML = list.length
      ? list.map((p) => poemCardHtml(p)).join("")
      : '<p class="po-empty">No poems match — try another keyword or tag.</p>';
    searchResults.querySelectorAll("[data-po-poem]").forEach((btn) => {
      btn.addEventListener("click", () => openDetail(btn.dataset.poPoem));
    });
  };

  const renderSaved = () => {
    if (!savedEl) return;
    const saved = getSaved();
    const list = DATA.poems.filter((p) => saved.has(p.id));
    savedEl.innerHTML = list.length
      ? list.map((p) => poemCardHtml(p)).join("")
      : '<div class="po-empty"><span aria-hidden="true">♡</span><p>No favorites yet</p><p class="po-empty-hint">Tap ♡ on any poem to save it here.</p></div>';
    savedEl.querySelectorAll("[data-po-poem]").forEach((btn) => {
      btn.addEventListener("click", () => openDetail(btn.dataset.poPoem));
    });
    document.getElementById("poSavedCount").textContent = String(list.length);
  };

  const updateHeart = (id, btn) => {
    if (!btn) return;
    const on = getSaved().has(id);
    btn.classList.toggle("saved", on);
    btn.setAttribute("aria-label", on ? "Remove from favorites" : "Add to favorites");
    btn.textContent = on ? "♥" : "♡";
  };

  const openDetail = (id) => {
    const p = DATA.poems.find((x) => x.id === id);
    if (!p || !detailEl) return;
    detailId = id;
    document.getElementById("poDetailDynasty").textContent = p.dynasty;
    document.getElementById("poDetailTitleEn").textContent = p.titleEn;
    document.getElementById("poDetailTitleZh").textContent = p.titleZh;
    document.getElementById("poDetailAuthor").innerHTML = `${escapeHtml(p.authorEn)} · <span lang="zh">${escapeHtml(p.authorZh)}</span>`;
    document.getElementById("poDetailLines").innerHTML = linesHtml(p);
    document.getElementById("poDetailMeaning").textContent = p.meaning;
    updateHeart(id, document.getElementById("poDetailHeart"));
    detailEl.classList.remove("hidden");
    if (!isBgmOn()) setBgmOn(true);
    playBgm()?.catch(() => {});
    speakPoem(p);
  };

  const closeDetail = () => {
    stopSpeech();
    detailEl?.classList.add("hidden");
    detailId = null;
  };

  root.querySelectorAll("[data-po-nav]").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.poNav));
  });

  document.getElementById("poHomeBrowse")?.addEventListener("click", () => switchView("browse"));
  document.getElementById("poHomeSearch")?.addEventListener("click", () => switchView("search"));
  document.getElementById("poDetailBack")?.addEventListener("click", closeDetail);
  document.getElementById("poDetailRead")?.addEventListener("click", () => {
    if (!detailId) return;
    if (speaking) {
      stopSpeech();
      return;
    }
    const p = DATA.poems.find((x) => x.id === detailId);
    if (p) speakPoem(p);
  });
  document.getElementById("poDetailHeart")?.addEventListener("click", () => {
    if (!detailId) return;
    const on = toggleSaved(detailId);
    updateHeart(detailId, document.getElementById("poDetailHeart"));
    if (typeof showAppToast === "function") showAppToast(on ? "Saved to favorites" : "Removed");
    renderSaved();
  });

  bgmBtn?.addEventListener("click", () => {
    const next = !isBgmOn();
    setBgmOn(next);
    if (typeof showAppToast === "function") {
      showAppToast(next ? `${DATA.bgmTitle || "Music"} playing` : "Music off");
    }
  });

  root.addEventListener(
    "click",
    () => {
      if (isBgmOn() && bgmEl?.paused) playBgm()?.catch(() => {});
    },
    { once: true },
  );

  searchInput?.addEventListener("input", () => {
    searchQuery = searchInput.value;
    renderSearch();
  });

  document.getElementById("poSearchBtn")?.addEventListener("click", () => {
    searchQuery = searchInput?.value || "";
    renderSearch();
  });

  document.getElementById("poSettingClear")?.addEventListener("click", () => {
    saveSaved(new Set());
    renderSaved();
    if (detailId) updateHeart(detailId, document.getElementById("poDetailHeart"));
    if (typeof showAppToast === "function") showAppToast("Favorites cleared");
  });

  if (bgmEl && DATA.bgm) {
    bgmEl.src = DATA.bgm;
    bgmEl.loop = true;
    bgmEl.preload = "auto";
    bgmEl.volume = BGM_VOL;
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      window.speechSynthesis.getVoices();
    });
  }

  renderHome();
  renderThemeTags();
  renderEmotionTags();
  renderPopular();
  renderSearch();
  setBgmOn(isBgmOn());
  switchView("home");
})();
