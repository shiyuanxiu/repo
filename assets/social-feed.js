/**
 * Miniverse feed social — likes, favorites, comments, share.
 * Storage: localStorage cache + GitHub Gist (private user, public community).
 * Requires: MiniverseGitHubAuth + GITHUB_AUTH_CONFIG (gist scope).
 */
(function () {
  const CFG = window.GITHUB_AUTH_CONFIG?.social || {};
  const COMMUNITY_FILE = CFG.communityFile || "miniverse-community.json";
  const USER_FILE = CFG.userFile || "miniverse-user.json";
  const LS_CACHE = "miniverse_social_cache_v1";
  const LS_PRIVATE_GIST = "miniverse_private_gist_id";
  const LS_PUBLIC_GIST = "miniverse_public_gist_id";
  const LS_PENDING_SYNC = "miniverse_social_pending_sync";
  const COMMUNITY_API = CFG.communityApi || "";
  const COMMUNITY_POLL_MS = 45000;
  const SYNC_DEBOUNCE_MS = 2800;
  const FETCH_TIMEOUT_MS = 20000;
  const MAX_RETRIES = 2;
  const MOCK_COMMENTS_BASE = "/assets/mock-comments/";

  const SHARE_META = {
    home: { title: "Miniverse", text: "Free mini games in a scroll feed!", tag: "#Miniverse" },
  };

  let gameRegistry = null;
  let registryById = null;

  async function loadGameRegistry() {
    if (gameRegistry) return gameRegistry;
    try {
      const res = await fetch("/assets/game-registry.json", { cache: "no-store" });
      if (!res.ok) throw new Error("registry fetch failed");
      gameRegistry = await res.json();
      registryById = Object.fromEntries((gameRegistry.games || []).map((g) => [g.id, g]));
    } catch (e) {
      console.warn("[MiniverseSocial] game-registry.json unavailable", e);
      gameRegistry = { games: [] };
      registryById = {};
    }
    return gameRegistry;
  }

  function shareMetaFor(gameId) {
    const g = registryById?.[gameId];
    if (g) {
      return { title: g.name, text: `Play ${g.name} on Miniverse`, tag: g.tag || `#${g.gistKey || gameId}` };
    }
    return SHARE_META[gameId] || SHARE_META.home;
  }

  function isKnownGameId(gameId) {
    return !gameId || !registryById || !!registryById[gameId];
  }

  const ICONS = {
    like: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    comment:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
    share:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>',
  };

  const CS = () => window.MiniverseCommentService;

  const COMMENT_ERRORS = {
    empty_content: "Comment cannot be empty.",
    content_too_long: "Comment is too long (max 500 characters).",
    missing_userId: "Sign in with GitHub to comment.",
    main_comment_exists: "You already posted a comment on this card. Use Reply on others' comments.",
    card_limit_reached: "This card has reached the 50 comment limit.",
    parent_not_found: "The comment you are replying to was removed.",
    max_reply_depth: "Replies can only go one level deep.",
  };

  let cache = loadCache();
  let privateGistId = localStorage.getItem(LS_PRIVATE_GIST) || "";
  let publicGistId = CFG.publicGistId || localStorage.getItem(LS_PUBLIC_GIST) || "";
  let syncTimer = null;
  let syncing = false;
  let lastSyncFailToast = 0;
  /** @type {Record<string, number>} mock totalLike per gameId */
  let mockLikeByGame = {};
  let mockManifest = null;
  /** @type {Map<string, { gameId: string, totalLike: number, comments: object[] }>} */
  const mockByGameId = new Map();

  function loadCache() {
    try {
      return JSON.parse(localStorage.getItem(LS_CACHE) || "{}");
    } catch {
      return {};
    }
  }

  function saveCache() {
    localStorage.setItem(LS_CACHE, JSON.stringify(cache));
  }

  function defaultCommunity() {
    return { v: 2, comments: {}, likes: {}, users: {} };
  }

  function defaultUser() {
    return { v: 1, likes: [], favorites: [] };
  }

  function ensureCacheShape() {
    if (!cache.community) cache.community = defaultCommunity();
    if (!cache.user) cache.user = defaultUser();
    if (!cache.community.comments) cache.community.comments = {};
    if (!cache.community.likes) cache.community.likes = {};
    if (!cache.community.users) cache.community.users = {};
    delete cache.community.counts;
  }

  function myLogin() {
    return getUser()?.login || "";
  }

  function applyUserFromCommunity(login) {
    if (!login) return;
    ensureCacheShape();
    const row = cache.community.users?.[login];
    if (!row) return;
    cache.user = {
      v: 1,
      likes: Array.isArray(row.likes) ? row.likes.slice() : [],
      favorites: Array.isArray(row.favorites) ? row.favorites.slice() : [],
    };
    saveCache();
    syncSavedGamesList();
  }

  function isAuthed() {
    return window.MiniverseGitHubAuth?.isAuthed?.() === true;
  }

  function getToken() {
    return window.MiniverseGitHubAuth?.readAuth?.()?.access_token || "";
  }

  function getUser() {
    return window.MiniverseGitHubAuth?.readAuth?.()?.user || null;
  }

  function toast(msg) {
    if (typeof showAppToast === "function") showAppToast(msg);
  }

  function lockedToast() {
    if (window.MiniverseGitHubAuth?.isMockAuth?.()) return;
    toast("Sign in with GitHub to like, save, or comment.");
  }

  function isProductionMock() {
    return window.MiniverseGitHubAuth?.isMockAuth?.() === true;
  }

  function isDemoAuth() {
    return isProductionMock();
  }

  function useCommunityApi() {
    if (window.MiniverseGitHubAuth?.isMockAuth?.()) return false;
    return !!COMMUNITY_API;
  }

  function refreshAllCardsUI() {
    document.querySelectorAll(".feed-item").forEach((item) => {
      const id = resolveGameId(item);
      if (id) updateCardUI(item, id);
    });
  }

  async function pullCommunityShared() {
    if (!useCommunityApi()) {
      await pullPublicCommunity();
      await mergeMockCommentsIntoCache();
      return;
    }
    try {
      const res = await fetch(COMMUNITY_API, { cache: "no-store" });
      if (!res.ok) {
        await mergeMockCommentsIntoCache();
        return;
      }
      const data = await res.json();
      const community = data.community || data;
      ensureCacheShape();
      cache.community = {
        v: 2,
        comments: community.comments || {},
        likes: community.likes || {},
        users: community.users || {},
      };
      applyUserFromCommunity(myLogin());
      await mergeMockCommentsIntoCache();
      saveCache();
    } catch (e) {
      console.warn("[MiniverseSocial] community API unreachable — using local mock comments", e);
      await mergeMockCommentsIntoCache();
    }
  }

  async function postCommunityOp(payload) {
    const res = await fetch(COMMUNITY_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    if (!res.ok) {
      const err = new Error(data.error || "community_api_failed");
      err.status = res.status;
      err.code = data.error;
      throw err;
    }
    if (data.community) {
      cache.community = data.community;
      applyUserFromCommunity(myLogin());
      saveCache();
      syncSavedGamesList();
    }
    return data;
  }

  /** Local dev: browser → localhost proxy → GitHub (avoids direct api.github.com blocks). */
  function githubApiRoot() {
    const h = location.hostname;
    if (h === "localhost" || h === "127.0.0.1") return "/auth/github-api";
    return "https://api.github.com";
  }

  function isNetworkError(err) {
    const msg = String(err?.message || err || "").toLowerCase();
    return (
      err?.name === "TypeError" ||
      msg.includes("failed to fetch") ||
      msg.includes("network") ||
      msg.includes("connection") ||
      msg.includes("aborted")
    );
  }

  async function gh(path, options = {}) {
    let lastErr;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
      try {
        const res = await fetch(`${githubApiRoot()}${path}`, {
          ...options,
          signal: ctrl.signal,
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${getToken()}`,
            "X-GitHub-Api-Version": "2022-11-28",
            ...(options.headers || {}),
          },
        });
        clearTimeout(timer);
        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = { raw: text };
        }
        if (!res.ok) {
          const err = new Error(data?.message || `GitHub API ${res.status}`);
          err.status = res.status;
          err.data = data;
          throw err;
        }
        return data;
      } catch (e) {
        clearTimeout(timer);
        lastErr = e;
        if (attempt < MAX_RETRIES && isNetworkError(e)) {
          await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
          continue;
        }
        throw e;
      }
    }
    throw lastErr;
  }

  function gistFileContent(gist, filename) {
    const file = gist?.files?.[filename];
    if (!file?.content) return null;
    try {
      return JSON.parse(file.content);
    } catch {
      return null;
    }
  }

  async function getGist(id) {
    return gh(`/gists/${id}`);
  }

  async function createGist(payload) {
    return gh("/gists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  async function patchGist(id, files, description) {
    const body = { files };
    if (description) body.description = description;
    return gh(`/gists/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  async function ensurePrivateGist() {
    if (privateGistId) return privateGistId;
    const gist = await createGist({
      description: "Miniverse personal likes & favorites (private)",
      public: false,
      files: {
        [USER_FILE]: { content: JSON.stringify(defaultUser(), null, 2) },
      },
    });
    privateGistId = gist.id;
    localStorage.setItem(LS_PRIVATE_GIST, privateGistId);
    console.info("[Miniverse] Private gist (your likes/favorites):", privateGistId);
    return privateGistId;
  }

  async function ensurePublicGist() {
    if (publicGistId) return publicGistId;
    const gist = await createGist({
      description: "Miniverse community comments & counts (public)",
      public: true,
      files: {
        [COMMUNITY_FILE]: { content: JSON.stringify(defaultCommunity(), null, 2) },
      },
    });
    publicGistId = gist.id;
    localStorage.setItem(LS_PUBLIC_GIST, publicGistId);
    announcePublicGist(publicGistId, true);
    return publicGistId;
  }

  function announcePublicGist(id, isNew) {
    if (!id || CFG.publicGistId) return;
    const seen = localStorage.getItem("miniverse_public_gist_announced");
    if (!isNew && seen === id) return;
    localStorage.setItem("miniverse_public_gist_announced", id);
    const line = `publicGistId: "${id}"`;
    console.warn(
      "%c[Miniverse] Public Gist ID\n%c" + id + "\n\nPaste into auth/github-config.js → social:\n" + line,
      "font-size:13px;font-weight:700;color:#6366f1",
      "font-size:12px;color:#0f172a"
    );
    toast("Public Gist created. Press F12 → Console, run MiniverseSocial.showGistIds()");
    if (navigator.clipboard?.writeText && isNew) {
      navigator.clipboard.writeText(line).catch(() => {});
    }
  }

  async function pullPublicCommunity() {
    if (!publicGistId) return;
    ensureCacheShape();
    try {
      const res = await fetch(`${githubApiRoot()}/gists/${publicGistId}`, {
        headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
      });
      if (!res.ok) return;
      const g = await res.json();
      const community = gistFileContent(g, COMMUNITY_FILE);
      if (community) {
        cache.community = community;
        saveCache();
      }
    } catch (e) {
      console.warn("[MiniverseSocial] public pull failed", e);
    }
  }

  async function pullUserGist() {
    if (!isAuthed()) return;
    try {
      if (!privateGistId) await ensurePrivateGist();
      if (!privateGistId) return;
      const g = await getGist(privateGistId);
      const user = gistFileContent(g, USER_FILE);
      if (user) {
        ensureCacheShape();
        cache.user = {
          v: 1,
          likes: Array.isArray(user.likes) ? user.likes : [],
          favorites: Array.isArray(user.favorites) ? user.favorites : [],
        };
        saveCache();
        syncSavedGamesList();
      }
    } catch (e) {
      console.warn("[MiniverseSocial] private gist pull failed", e);
    }
  }

  async function pullFromGists() {
    ensureCacheShape();
    if (isProductionMock()) {
      await loadAllMockComments();
      saveCache();
      syncSavedGamesList();
      return;
    }
    if (useCommunityApi()) {
      await pullCommunityShared();
    } else {
      await pullPublicCommunity();
    }
    await pullUserGist();
    if (!useCommunityApi() && isAuthed()) {
      try {
        if (!publicGistId) await ensurePublicGist();
        else await pullPublicCommunity();
        if (publicGistId && !CFG.publicGistId) announcePublicGist(publicGistId, false);
      } catch (e) {
        console.warn("[MiniverseSocial] public gist pull failed", e);
      }
    }
    saveCache();
    syncSavedGamesList();
  }

  function markPendingSync() {
    localStorage.setItem(LS_PENDING_SYNC, "1");
  }

  function clearPendingSync() {
    localStorage.removeItem(LS_PENDING_SYNC);
  }

  function syncFailToast(msg) {
    const now = Date.now();
    if (now - lastSyncFailToast < 12000) return;
    lastSyncFailToast = now;
    toast(msg);
  }

  function scheduleSync() {
    if (!isAuthed()) return;
    if (isProductionMock()) {
      saveCache();
      return;
    }
    markPendingSync();
    clearTimeout(syncTimer);
    syncTimer = setTimeout(flushToGists, SYNC_DEBOUNCE_MS);
  }

  async function flushToGists() {
    if (isProductionMock()) return;
    if (!isAuthed() || syncing) return;
    if (useCommunityApi()) {
      clearPendingSync();
      return;
    }
    syncing = true;
    ensureCacheShape();
    try {
      const pid = privateGistId || (await ensurePrivateGist());
      await patchGist(pid, {
        [USER_FILE]: { content: JSON.stringify(cache.user, null, 2) },
      });
      if (!useCommunityApi()) {
        await new Promise((r) => setTimeout(r, 400));
        const pubId = publicGistId || (await ensurePublicGist());
        await patchGist(pubId, {
          [COMMUNITY_FILE]: { content: JSON.stringify(cache.community, null, 2) },
        });
      }
      saveCache();
      clearPendingSync();
      console.info("[MiniverseSocial] GitHub Gist sync OK (likes/favorites → private gist)");
    } catch (e) {
      markPendingSync();
      if (isNetworkError(e)) {
        console.debug("[MiniverseSocial] sync deferred (network):", e.message || e);
        syncFailToast("Saved on this device. GitHub sync when your network can reach api.github.com.");
      } else if (e?.status === 403 || e?.data?.message?.includes("scope")) {
        console.warn("[MiniverseSocial] sync failed (scope)", e);
        syncFailToast("Gist permission missing — sign out and sign in again.");
      } else {
        console.warn("[MiniverseSocial] sync failed", e);
        syncFailToast("Could not sync to GitHub Gist. Changes stay on this device.");
      }
    } finally {
      syncing = false;
    }
  }

  function tryResumePendingSync() {
    if (isProductionMock()) {
      loadAllMockComments().then(refreshAllCardsUI);
      return;
    }
    if (useCommunityApi()) pullCommunityShared().then(refreshAllCardsUI);
    if (!isAuthed()) return;
    if (localStorage.getItem(LS_PENDING_SYNC)) scheduleSync();
    else pullUserGist().then(refreshAllCardsUI);
  }

  function myUserId() {
    const u = getUser();
    return String(u?.id || u?.login || "");
  }

  async function loadMockManifest() {
    if (mockManifest) return mockManifest;
    try {
      const res = await fetch(`${MOCK_COMMENTS_BASE}manifest.json`, { cache: "no-store" });
      if (!res.ok) return null;
      mockManifest = await res.json();
    } catch {
      mockManifest = null;
    }
    return mockManifest;
  }

  function normalizeMockCommentList(gameId, mock) {
    if (!mock?.comments?.length || mock.gameId !== gameId) return [];
    const svc = CS();
    return svc
      ? svc.dedupeByCommentId(
          mock.comments
            .map((c) =>
              svc.normalizeComment({
                ...c,
                replyTo: c.replyTo || null,
              })
            )
            .filter(Boolean)
        )
      : mock.comments.slice();
  }

  /** Load mock JSON for one gameId only — strict match, no cross-game bleed. */
  async function loadMockForGame(gameId) {
    if (!gameId || mockByGameId.has(gameId)) return mockByGameId.get(gameId) || null;
    const manifest = await loadMockManifest();
    const entry = manifest?.files?.[gameId];
    if (!entry?.file) {
      mockByGameId.set(gameId, null);
      return null;
    }
    try {
      const res = await fetch(`${MOCK_COMMENTS_BASE}${entry.file}`, { cache: "no-store" });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.gameId !== gameId) {
        console.warn("[MiniverseSocial] mock gameId mismatch", data.gameId, gameId);
        return null;
      }
      mockByGameId.set(gameId, data);
      mockLikeByGame[gameId] = Number(data.totalLike) || 0;
      return data;
    } catch (e) {
      console.warn("[MiniverseSocial] mock load failed", gameId, e);
      mockByGameId.set(gameId, null);
      return null;
    }
  }

  /** Seed cache when a card has no live comments (empty [] from server counts as empty). */
  async function applyMockCommentsForGame(gameId) {
    const mock = await loadMockForGame(gameId);
    const normalized = normalizeMockCommentList(gameId, mock);
    if (!normalized.length) return false;
    ensureCacheShape();
    const key = commentStorageKey(gameId);
    const live = cache.community.comments[key] || cache.community.comments[gameId] || [];
    if (live.length > 0) return false;
    cache.community.comments[key] = normalized;
    return true;
  }

  async function mergeMockCommentsIntoCache() {
    const manifest = await loadMockManifest();
    if (!manifest?.files) return;
    let changed = false;
    for (const gameId of Object.keys(manifest.files)) {
      if (await applyMockCommentsForGame(gameId)) changed = true;
    }
    if (changed) saveCache();
  }

  async function loadAllMockComments() {
    await mergeMockCommentsIntoCache();
  }

  function getMockCommentsSync(gameId) {
    const mock = mockByGameId.get(gameId);
    return normalizeMockCommentList(gameId, mock);
  }

  function commentStorageKey(gameId, cardId) {
    const svc = CS();
    return svc ? svc.cardKey(gameId, cardId || gameId) : gameId;
  }

  function getCommentsForCard(gameId, cardId) {
    const svc = CS();
    const key = commentStorageKey(gameId, cardId);
    const raw = cache.community?.comments?.[key] || cache.community?.comments?.[gameId] || [];
    let list = svc
      ? svc.dedupeByCommentId(raw.map((c) => svc.normalizeComment(c)).filter(Boolean))
      : raw.slice();
    if (!list.length) list = getMockCommentsSync(gameId);
    return list;
  }

  function getLikeCount(gameId) {
    const mockBase = mockLikeByGame[gameId];
    if (isProductionMock() && mockBase != null) {
      return mockBase + (userHas(gameId, "likes") ? 1 : 0);
    }
    const live = (cache.community?.likes?.[gameId] || []).length;
    if (live > 0) return live;
    if (mockBase != null) return mockBase;
    return 0;
  }

  function getCommentCount(gameId, cardId) {
    const svc = CS();
    const list = getCommentsForCard(gameId, cardId);
    return svc ? svc.countComments(list) : list.length;
  }

  function userHas(gameId, field) {
    return (cache.user?.[field] || []).includes(gameId);
  }

  function setUserList(gameId, field, on) {
    ensureCacheShape();
    const list = cache.user[field];
    const i = list.indexOf(gameId);
    if (on && i === -1) list.push(gameId);
    if (!on && i !== -1) list.splice(i, 1);
    saveCache();
  }

  function syncSavedGamesList() {
    const key = "vv_saved";
    const favs = cache.user?.favorites || [];
    localStorage.setItem(key, JSON.stringify(favs));
  }

  function resolveGameId(item) {
    if (item.dataset.game) return item.dataset.game;
    const sound = item.querySelector(".sound-toggle[data-game]");
    if (sound?.dataset.game) return sound.dataset.game;
    const play = item.querySelector('a[href*="game="]');
    if (play) {
      try {
        const u = new URL(play.href, location.href);
        return u.searchParams.get("game") || "";
      } catch {
        /* ignore */
      }
    }
    const card = item.querySelector("[id$='Card']");
    if (card?.id) return card.id.replace(/Card$/i, "").toLowerCase();
    return "";
  }

  function formatCount(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return String(n);
  }

  function setCountEl(btn, n) {
    const el = btn.querySelector(".social-count");
    if (!el) return;
    const prev = el.textContent;
    el.textContent = formatCount(n);
    if (prev !== el.textContent) btn.classList.add("bump"), setTimeout(() => btn.classList.remove("bump"), 400);
  }

  function renderComments(panel, gameId, cardId) {
    const list = panel.querySelector(".social-comment-list");
    const svc = CS();
    const comments = getCommentsForCard(gameId, cardId || gameId);
    if (!list) return;
    if (svc) {
      svc.renderCommentList(list, comments, {
        userId: myUserId(),
        onReply: (commentId, username) => setReplyTarget(panel, commentId, username),
      });
      return;
    }
    if (!comments.length) {
      list.innerHTML = '<li class="social-comment-empty">No comments yet — be the first!</li>';
      return;
    }
    list.innerHTML = comments
      .slice()
      .sort((a, b) => String(b.createTime || "").localeCompare(String(a.createTime || "")))
      .map(
        (c) => `<li class="social-comment-item">
        <div class="social-comment-meta">
          ${c.avatar ? `<img src="${escapeHtml(c.avatar)}" alt="">` : ""}
          <strong>${escapeHtml(c.username || c.name || "Player")}</strong>
          <span>${escapeHtml(c.createTime || "")}</span>
        </div>
        <div>${escapeHtml(c.content || c.text || "")}</div>
      </li>`
      )
      .join("");
  }

  function setReplyTarget(panel, commentId, username) {
    if (!panel || !commentId) return;
    const form = panel.querySelector(".social-comment-form");
    const hint = panel.querySelector("[data-reply-hint]");
    const nameEl = panel.querySelector("[data-reply-name]");
    if (form) form.dataset.replyTo = commentId;
    if (hint) hint.classList.remove("hidden");
    if (nameEl) nameEl.textContent = username || "user";
    const input = panel.querySelector(".social-comment-input");
    if (input) {
      input.placeholder = `Reply to ${username || "user"}…`;
      input.focus();
    }
  }

  function clearReplyTarget(panel) {
    if (!panel) return;
    const form = panel.querySelector(".social-comment-form");
    const hint = panel.querySelector("[data-reply-hint]");
    if (form) delete form.dataset.replyTo;
    if (hint) hint.classList.add("hidden");
    updateCommentFormState(panel, resolveGameId(panel.closest(".feed-item") || panel));
  }

  function updateCommentFormState(panel, gameId) {
    const svc = CS();
    const authed = isAuthed();
    const input = panel?.querySelector(".social-comment-input");
    const send = panel?.querySelector(".social-comment-send");
    if (!input || !send) return;
    const replyTo = panel.querySelector(".social-comment-form")?.dataset.replyTo;
    const hasMain = svc && authed && svc.hasMainComment(getCommentsForCard(gameId), myUserId());
    if (!authed) {
      input.disabled = true;
      send.disabled = true;
      input.placeholder = "Sign in to comment";
      return;
    }
    if (replyTo) {
      input.disabled = false;
      send.disabled = false;
      return;
    }
    if (hasMain) {
      input.disabled = true;
      send.disabled = true;
      input.placeholder = "You already commented — tap Reply on others' posts";
      return;
    }
    input.disabled = false;
    send.disabled = false;
    input.placeholder = "Write a comment…";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildToolbar(gameId) {
    const likeCount = getLikeCount(gameId);
    const cc = getCommentCount(gameId);
    const liked = userHas(gameId, "likes");
    const saved = userHas(gameId, "favorites");
    return `
      <button type="button" class="social-btn social-like${liked ? " is-on" : ""}" data-action="like" aria-label="Like">
        ${ICONS.like}<span class="social-count">${formatCount(likeCount)}</span>
      </button>
      <button type="button" class="social-btn social-star${saved ? " is-on" : ""}" data-action="star" aria-label="Favorite">
        ${ICONS.star}
      </button>
      <button type="button" class="social-btn social-comment" data-action="comment" aria-label="Comments" aria-expanded="false">
        ${ICONS.comment}<span class="social-count">${formatCount(cc)}</span>
      </button>
      <button type="button" class="social-btn social-share" data-action="share" aria-label="Share">
        ${ICONS.share}
      </button>`;
  }

  function commentPanelHint() {
    if (!isAuthed()) return "Sign in to comment.";
    return "";
  }

  function buildCommentsPanel(gameId) {
    const authed = isAuthed();
    const hint = commentPanelHint();
    return `
      <div class="social-comments hidden" data-social-comments="${gameId}" data-card-id="${gameId}">
        ${hint ? `<p class="social-login-hint">${hint}</p>` : ""}
        <ul class="social-comment-list"></ul>
        <div class="social-comment-reply-hint hidden" data-reply-hint>
          Replying to <strong data-reply-name></strong>
          <button type="button" class="social-comment-cancel-reply">Cancel</button>
        </div>
        <form class="social-comment-form">
          <textarea class="social-comment-input" rows="2" maxlength="500" placeholder="${authed ? "Write a comment…" : "Sign in to comment"}" ${authed ? "" : "disabled"}></textarea>
          <button type="submit" class="social-comment-send" ${authed ? "" : "disabled"}>Post</button>
        </form>
      </div>`;
  }

  function updateCardUI(item, gameId) {
    const stats = item.querySelector(".social-feed-stats");
    if (!stats) return;
    const cc = getCommentCount(gameId);
    const likeBtn = stats.querySelector('[data-action="like"]');
    const starBtn = stats.querySelector('[data-action="star"]');
    const commentBtn = stats.querySelector('[data-action="comment"]');
    if (likeBtn) {
      likeBtn.classList.toggle("is-on", userHas(gameId, "likes"));
      setCountEl(likeBtn, getLikeCount(gameId));
    }
    if (starBtn) {
      starBtn.classList.toggle("is-on", userHas(gameId, "favorites"));
    }
    if (commentBtn) setCountEl(commentBtn, cc);
    const panel = item.querySelector(`[data-social-comments="${gameId}"]`);
    if (panel && !panel.classList.contains("hidden")) {
      renderComments(panel, gameId);
      updateCommentFormState(panel, gameId);
    }
  }

  async function handleLike(gameId, btn) {
    if (!isAuthed()) return lockedToast();
    const login = myLogin();
    if (!login) return lockedToast();
    const willLike = !userHas(gameId, "likes");
    setUserList(gameId, "likes", willLike);
    btn.classList.toggle("is-on", willLike);
    if (willLike) btn.classList.add("pop"), setTimeout(() => btn.classList.remove("pop"), 400);
    setCountEl(btn, getLikeCount(gameId));
    toast(willLike ? "Liked!" : "Like removed");
    if (isProductionMock()) {
      ensureCacheShape();
      const likes = cache.community.likes[gameId] || (cache.community.likes[gameId] = []);
      const i = likes.indexOf(login);
      if (willLike && i === -1) likes.push(login);
      if (!willLike && i !== -1) likes.splice(i, 1);
      saveCache();
      updateCardUI(document.querySelector(`[data-game="${gameId}"]`)?.closest(".feed-item") || document.querySelector(".feed-item"), gameId);
      refreshAllCardsUI();
      return;
    }
    if (useCommunityApi()) {
      try {
        await postCommunityOp({ op: "like", gameId, login, liked: willLike });
        refreshAllCardsUI();
      } catch (e) {
        setUserList(gameId, "likes", !willLike);
        refreshAllCardsUI();
        console.warn("[MiniverseSocial] like sync failed", e);
        toast(
          e?.status === 400 && String(e?.message || "").includes("unknown op")
            ? "Dev server outdated — restart start-dev-server.bat"
            : "Could not sync like — restart start-dev-server.bat"
        );
      }
      return;
    }
    scheduleSync();
  }

  async function handleStar(gameId, btn, item) {
    if (!isAuthed()) return lockedToast();
    const login = myLogin();
    if (!login) return lockedToast();
    const willSave = !userHas(gameId, "favorites");
    setUserList(gameId, "favorites", willSave);
    btn.classList.toggle("is-on", willSave);
    syncSavedGamesList();
    if (typeof toggleSavedGame === "function") toggleSavedGame(gameId, willSave);
    toast(willSave ? "Saved to favorites" : "Removed from favorites");
    if (isProductionMock()) {
      saveCache();
      updateCardUI(item, gameId);
      return;
    }
    if (useCommunityApi()) {
      try {
        await postCommunityOp({ op: "favorite", gameId, login, saved: willSave });
        refreshAllCardsUI();
      } catch (e) {
        setUserList(gameId, "favorites", !willSave);
        syncSavedGamesList();
        refreshAllCardsUI();
        console.warn("[MiniverseSocial] favorite sync failed", e);
        const msg =
          e?.status === 400 && String(e?.message || "").includes("unknown op")
            ? "Dev server outdated — restart start-dev-server.bat"
            : "Could not sync favorite — restart start-dev-server.bat";
        toast(msg);
      }
      return;
    }
    scheduleSync();
    updateCardUI(item, gameId);
  }

  function handleShare(gameId) {
    const meta = shareMetaFor(gameId);
    const url = `${location.origin}${location.pathname}?game=${gameId}`;
    const text = `${meta.text} ${meta.tag}`;
    if (navigator.share) {
      navigator.share({ title: meta.title, text, url }).catch(() => {});
    } else if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(`${text} ${url}`);
      toast("Link copied!");
    } else {
      toast("Copy this link: " + url);
    }
  }

  async function handleCommentToggle(item, gameId, btn) {
    const panel = item.querySelector(`[data-social-comments="${gameId}"]`);
    if (!panel) return;
    const open = panel.classList.toggle("hidden");
    const isOpen = !open;
    btn.classList.toggle("is-open", isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      await loadMockForGame(gameId);
      await mergeMockCommentsIntoCache();
      await pullCommunityShared();
      renderComments(panel, gameId);
      updateCommentFormState(panel, gameId);
      updateCardUI(item, gameId);
    }
  }

  async function handleCommentPost(item, gameId, text) {
    if (!isAuthed()) return lockedToast();
    const trimmed = text.trim();
    if (!trimmed) return;
    const panel = item.querySelector(`[data-social-comments="${gameId}"]`);
    const form = panel?.querySelector(".social-comment-form");
    const cardId = panel?.dataset.cardId || gameId;
    const replyTo = form?.dataset.replyTo || null;
    const user = getUser();
    const svc = CS();

    if (svc) {
      const existing = getCommentsForCard(gameId, cardId);
      const draft = svc.buildCommentPayload({ user, content: trimmed, replyTo });
      const check = svc.validateSubmit(existing, {
        userId: draft.userId,
        content: draft.content,
        replyTo: draft.replyTo,
      });
      if (!check.ok) {
        toast(COMMENT_ERRORS[check.error] || check.error);
        return;
      }

      if (useCommunityApi()) {
        try {
          await postCommunityOp({ op: "comment", gameId, cardId, replyTo: draft.replyTo, comment: draft });
          await pullCommunityShared();
          clearReplyTarget(panel);
          refreshAllCardsUI();
          toast(replyTo ? "Reply posted — synced to GitHub Gist" : "Comment posted — synced to GitHub Gist");
        } catch (e) {
          toast(COMMENT_ERRORS[e?.code || e?.message] || "Could not post comment. Restart start-dev-server.bat");
        }
        return;
      }

      ensureCacheShape();
      const key = commentStorageKey(gameId, cardId);
      if (!cache.community.comments[key]) cache.community.comments[key] = [];
      cache.community.comments[key].push(draft);
      saveCache();
      if (panel) {
        renderComments(panel, gameId, cardId);
        updateCommentFormState(panel, gameId);
        clearReplyTarget(panel);
      }
      updateCardUI(item, gameId);
      toast(replyTo ? "Reply posted" : "Comment posted");
      scheduleSync();
      return;
    }

    const comment = {
      commentId: crypto.randomUUID(),
      userId: user?.login || "guest",
      username: user?.name || user?.login || "Player",
      avatar: user?.avatar_url || "",
      content: trimmed.slice(0, 500),
      createTime: new Date().toISOString(),
      replyTo: replyTo || null,
    };

    if (useCommunityApi()) {
      try {
        await postCommunityOp({ op: "comment", gameId, cardId, replyTo, comment });
        await pullCommunityShared();
        clearReplyTarget(panel);
        refreshAllCardsUI();
        toast("Comment posted — synced to GitHub Gist");
      } catch {
        toast("Could not post comment. Restart start-dev-server.bat");
      }
      return;
    }

    ensureCacheShape();
    const key = commentStorageKey(gameId, cardId);
    if (!cache.community.comments[key]) cache.community.comments[key] = [];
    cache.community.comments[key].push(comment);
    saveCache();
    if (panel) renderComments(panel, gameId, cardId);
    updateCardUI(item, gameId);
    toast("Comment posted");
    scheduleSync();
  }

  function bindCard(item) {
    const gameId = resolveGameId(item);
    if (!gameId) return;
    if (registryById && !isKnownGameId(gameId)) {
      console.warn("[MiniverseSocial] Unknown gameId — add to assets/game-registry.json:", gameId);
    }
    item.dataset.game = gameId;

    const meta = item.querySelector(".feed-meta");
    if (!meta) return;

    let stats = meta.querySelector(".feed-stats");
    if (!stats) {
      stats = document.createElement("div");
      meta.appendChild(stats);
    }
    stats.className = "feed-stats social-feed-stats";
    stats.dataset.socialBound = "1";
    stats.innerHTML = buildToolbar(gameId);

    if (!item.querySelector(`[data-social-comments="${gameId}"]`)) {
      meta.insertAdjacentHTML("afterend", buildCommentsPanel(gameId));
    }

    const authed = isAuthed();
    stats.classList.toggle("is-locked", !authed);

    stats.addEventListener("click", (e) => {
      const btn = e.target.closest(".social-btn");
      if (!btn) return;
      e.stopPropagation();
      const action = btn.dataset.action;
      if (!authed && action !== "share" && action !== "comment") return lockedToast();
      if (action === "like") return void handleLike(gameId, btn);
      if (action === "star") return void handleStar(gameId, btn, item);
      if (action === "share") return handleShare(gameId);
      if (action === "comment") return void handleCommentToggle(item, gameId, btn);
    });

    const form = item.querySelector(`[data-social-comments="${gameId}"] .social-comment-form`);
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector(".social-comment-input");
      handleCommentPost(item, gameId, input?.value || "");
      if (input) input.value = "";
    });

    const panel = item.querySelector(`[data-social-comments="${gameId}"]`);
    panel?.querySelector(".social-comment-cancel-reply")?.addEventListener("click", (e) => {
      e.preventDefault();
      clearReplyTarget(panel);
    });
    updateCommentFormState(panel, gameId);
  }

  function mergeLegacySaved() {
    ensureCacheShape();
    try {
      const list = JSON.parse(localStorage.getItem("vv_saved") || "[]");
      if (!Array.isArray(list)) return;
      list.forEach((id) => {
        if (id && !cache.user.favorites.includes(id)) cache.user.favorites.push(id);
      });
      saveCache();
      syncSavedGamesList();
    } catch {
      /* ignore */
    }
  }

  async function migrateLegacyUserToCloud() {
    if (!useCommunityApi() || !isAuthed()) return;
    const login = myLogin();
    if (!login) return;
    await pullCommunityShared();
    const remote = cache.community.users?.[login];
    const localFavs = cache.user.favorites || [];
    const localLikes = cache.user.likes || [];
    const tasks = [];
    localFavs.forEach((id) => {
      if (!remote?.favorites?.includes(id)) {
        tasks.push(postCommunityOp({ op: "favorite", gameId: id, login, saved: true }));
      }
    });
    localLikes.forEach((id) => {
      if (!remote?.likes?.includes(id)) {
        tasks.push(postCommunityOp({ op: "like", gameId: id, login, liked: true }));
      }
    });
    if (tasks.length) {
      await Promise.allSettled(tasks);
      await pullCommunityShared();
    }
  }

  async function initAllCards() {
    await loadGameRegistry();
    ensureCacheShape();
    mergeLegacySaved();
    await loadAllMockComments();
    document.querySelectorAll(".feed-item").forEach(bindCard);
    const authed = isAuthed();
    document.querySelectorAll(".social-feed-stats").forEach((el) => el.classList.toggle("is-locked", !authed));
    refreshAllCardsUI();
    await pullFromGists();
    await migrateLegacyUserToCloud();
    refreshAllCardsUI();
    if (useCommunityApi() && !window._miniverseCommunityPoll) {
      window._miniverseCommunityPoll = setInterval(() => {
        pullCommunityShared().then(refreshAllCardsUI);
      }, COMMUNITY_POLL_MS);
    }
  }

  function boot() {
    const onReady = () => {
      initAllCards()
        .then(() => tryResumePendingSync())
        .catch((e) => console.warn("[MiniverseSocial] init failed", e));
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onReady);
    } else {
      onReady();
    }
    window.addEventListener("online", tryResumePendingSync);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") tryResumePendingSync();
    });
  }

  function showGistIds() {
    const ids = {
      publicGistId: CFG.publicGistId || publicGistId || localStorage.getItem(LS_PUBLIC_GIST) || "",
      privateGistId: privateGistId || localStorage.getItem(LS_PRIVATE_GIST) || "",
      configFile: "auth/github-config.js → social.publicGistId",
      localStorageKeys: [LS_PUBLIC_GIST, LS_PRIVATE_GIST],
    };
    if (!ids.publicGistId) {
      console.warn(
        "[Miniverse] No public Gist yet. While logged in, click ♥ Like on any game (needs gist scope). Then run showGistIds() again."
      );
    } else {
      announcePublicGist(ids.publicGistId, false);
    }
    console.table(ids);
    console.log("Config snippet:\n  publicGistId: \"" + (ids.publicGistId || "") + "\",");
    return ids;
  }

  window.MiniverseSocial = {
    refresh: initAllCards,
    pullFromGists,
    pullCommunity: pullCommunityShared,
    syncNow: flushToGists,
    getCache: () => cache,
    getUserLists: () => ({ likes: cache.user?.likes || [], favorites: cache.user?.favorites || [] }),
    getLikeCount,
    showGistIds,
    usesCommunityApi: useCommunityApi,
  };

  boot();
})();
