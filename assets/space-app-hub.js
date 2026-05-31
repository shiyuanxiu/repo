/* Interstellar Exploration mini-app — Learn tab feed #4 */
(function initSpaceApp() {
  const DATA = window.SPACE_APP;
  const root = document.getElementById("spApp");
  if (!root || !DATA) return;

  const SAVED_KEY = "vv_space_app_saved";
  const AUDIO_KEY = "vv_space_app_audio";
  let view = "explore";
  let detailId = null;
  let speaking = false;

  const gridEl = document.getElementById("spGrid");
  const savedEl = document.getElementById("spSavedList");
  const detailEl = document.getElementById("spDetail");
  const audioToggle = document.getElementById("spAudioToggle");

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

  const isAudioOn = () => localStorage.getItem(AUDIO_KEY) !== "off";

  const setAudioOn = (on) => {
    localStorage.setItem(AUDIO_KEY, on ? "on" : "off");
    audioToggle?.classList.toggle("active", on);
    audioToggle?.setAttribute("aria-pressed", on ? "true" : "false");
    document.getElementById("spSettingAudio")?.classList.toggle("active", on);
  };

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    speaking = false;
    document.getElementById("spReadAloud")?.classList.remove("speaking");
    document.getElementById("spDetailReadAloud")?.classList.remove("speaking");
  };

  const speakText = (text, btnId) => {
    if (!window.speechSynthesis || !isAudioOn()) {
      if (typeof showAppToast === "function") showAppToast("Enable voice in Settings");
      return;
    }
    stopSpeech();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.onend = () => {
      speaking = false;
      document.getElementById(btnId)?.classList.remove("speaking");
    };
    speaking = true;
    document.getElementById(btnId)?.classList.add("speaking");
    window.speechSynthesis.speak(utter);
  };

  const thumbImg = (src, alt) =>
    `<img class="sp-thumb-img" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" width="200" height="200">`;

  const switchView = (v) => {
    view = v;
    stopSpeech();
    detailEl?.classList.add("hidden");
    detailId = null;
    root.querySelectorAll("[data-sp-panel]").forEach((p) => {
      p.classList.toggle("active", p.dataset.spPanel === v);
    });
    root.querySelectorAll("[data-sp-nav]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.spNav === v);
    });
    if (v === "favorites") renderSaved();
  };

  const renderGrid = () => {
    if (!gridEl) return;
    gridEl.innerHTML = DATA.bodies
      .map(
        (b) => `<button type="button" class="sp-grid-card" data-sp-body="${escapeHtml(b.id)}">
          <div class="sp-grid-thumb">${thumbImg(b.image, b.name)}</div>
          <div class="sp-grid-body">
            <span class="sp-grid-tag">${escapeHtml(b.tag)}</span>
            <h3 class="sp-grid-title">${escapeHtml(b.name)}</h3>
            <p class="sp-grid-desc">${escapeHtml(b.summary)}</p>
          </div>
        </button>`,
      )
      .join("");

    gridEl.querySelectorAll("[data-sp-body]").forEach((btn) => {
      btn.addEventListener("click", () => openDetail(btn.dataset.spBody));
    });
  };

  const updateHeart = (id, btn) => {
    if (!btn) return;
    const on = getSaved().has(id);
    btn.classList.toggle("saved", on);
    btn.setAttribute("aria-label", on ? "Remove from favorites" : "Add to favorites");
    btn.textContent = on ? "♥" : "♡";
  };

  const openDetail = (id) => {
    const b = DATA.bodies.find((x) => x.id === id);
    if (!b || !detailEl) return;
    detailId = id;
    document.getElementById("spDetailImg").innerHTML = thumbImg(b.image, b.name);
    document.getElementById("spDetailTag").textContent = b.tag;
    document.getElementById("spDetailTitle").textContent = b.name;
    document.getElementById("spDetailSummary").textContent = b.summary;
    document.getElementById("spDetailBody").textContent = b.body;
    updateHeart(id, document.getElementById("spDetailHeart"));
    detailEl.classList.remove("hidden");
    if (isAudioOn()) {
      setTimeout(() => speakText(`${b.name}. ${b.summary} ${b.body}`, "spDetailReadAloud"), 300);
    }
  };

  const closeDetail = () => {
    stopSpeech();
    detailEl?.classList.add("hidden");
    detailId = null;
  };

  const renderSaved = () => {
    if (!savedEl) return;
    const saved = getSaved();
    const list = DATA.bodies.filter((b) => saved.has(b.id));

    savedEl.innerHTML = list.length
      ? list
          .map(
            (b) => `<button type="button" class="sp-saved-row" data-sp-body="${escapeHtml(b.id)}">
              <span class="sp-saved-thumb">${thumbImg(b.image, b.name)}</span>
              <span class="sp-saved-text">
                <span class="sp-saved-tag">${escapeHtml(b.tag)}</span>
                <span class="sp-saved-name">${escapeHtml(b.name)}</span>
              </span>
              <span class="sp-saved-arrow" aria-hidden="true">›</span>
            </button>`,
          )
          .join("")
      : `<div class="sp-empty"><span aria-hidden="true">♡</span><p>No favorites yet</p><p class="sp-empty-hint">Tap ♡ on any world to save it here.</p></div>`;

    savedEl.querySelectorAll("[data-sp-body]").forEach((btn) => {
      btn.addEventListener("click", () => openDetail(btn.dataset.spBody));
    });
  };

  root.querySelectorAll("[data-sp-nav]").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.spNav));
  });

  document.getElementById("spDetailBack")?.addEventListener("click", closeDetail);
  document.getElementById("spDetailHeart")?.addEventListener("click", () => {
    if (!detailId) return;
    const on = toggleSaved(detailId);
    updateHeart(detailId, document.getElementById("spDetailHeart"));
    if (typeof showAppToast === "function") showAppToast(on ? "Saved to favorites" : "Removed");
    if (view === "favorites") renderSaved();
  });

  document.getElementById("spDetailReadAloud")?.addEventListener("click", () => {
    const b = DATA.bodies.find((x) => x.id === detailId);
    if (!b) return;
    if (speaking) {
      stopSpeech();
      return;
    }
    speakText(`${b.name}. ${b.summary} ${b.body}`, "spDetailReadAloud");
  });

  audioToggle?.addEventListener("click", () => {
    setAudioOn(!isAudioOn());
    if (typeof showAppToast === "function") showAppToast(isAudioOn() ? "Voice on" : "Voice off");
  });

  document.getElementById("spSettingAudio")?.addEventListener("click", () => {
    setAudioOn(!isAudioOn());
  });

  document.getElementById("spSettingClear")?.addEventListener("click", () => {
    saveSaved(new Set());
    renderSaved();
    if (detailId) updateHeart(detailId, document.getElementById("spDetailHeart"));
    if (typeof showAppToast === "function") showAppToast("Favorites cleared");
  });

  setAudioOn(isAudioOn());
  renderGrid();
  switchView("explore");
})();
