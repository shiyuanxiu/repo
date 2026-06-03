(function () {
  const cfg = window.GITHUB_AUTH_CONFIG;

  /** Local dev server (start-dev-server.bat on port 8765). */
  function isLocalDev() {
    const host = window.location.host;
    return host === "localhost:8765" || host === "127.0.0.1:8765";
  }

  /** Demo auth (local + production) — no GitHub OAuth while authMode is "mock". */
  function isMockAuth() {
    return (cfg.authMode || "mock") === "mock";
  }

  function mockUserProfile() {
    const m = cfg.mockUser || {};
    return {
      login: m.login || "demo_player",
      id: m.id || 10000001,
      name: m.name || m.login || "Demo Player",
      avatar_url: m.avatar_url || "https://avatars.githubusercontent.com/u/10000001?v=4",
    };
  }

  function buildMockAuth() {
    return {
      mock: true,
      access_token: "mock_demo_token",
      user: mockUserProfile(),
      expires_at: Date.now() + 86400 * 365 * 1000,
    };
  }

  function ensureMockAuth() {
    if (!isMockAuth()) return null;
    const existing = readAuthRaw();
    if (existing?.mock && existing.user?.login) return existing;
    const data = buildMockAuth();
    sessionStorage.setItem(cfg.storageKey, JSON.stringify(data));
    return data;
  }

  function readAuthRaw() {
    try {
      const raw = sessionStorage.getItem(cfg.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /** OAuth App client_id — auto local vs production. */
  function clientId() {
    if (isLocalDev()) return cfg.clientIdLocal || cfg.clientId || "";
    return cfg.clientIdProduction || cfg.clientId || "";
  }

  if (!isMockAuth() && !clientId()) return;

  const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const publicPages = new Set(["github-callback.html", "login.html"]);

  /** OAuth callback — auto local vs production. */
  function redirectUri() {
    if (isLocalDev()) {
      return cfg.redirectUriLocal || `http://${window.location.host}/github-callback.html`;
    }
    return cfg.redirectUriProduction || "https://miniverse.gg/github-callback.html";
  }

  /** Token exchange endpoint — local dev-server only. */
  function tokenExchangeApi() {
    if (isLocalDev()) {
      return cfg.tokenExchangeApiLocal || "/auth/exchange-token";
    }
    return cfg.tokenExchangeApiProduction || "https://miniverse.gg/auth/exchange-token";
  }

  function readAuth() {
    if (isMockAuth()) return ensureMockAuth();
    return readAuthRaw();
  }

  function isAuthed() {
    if (isMockAuth()) {
      ensureMockAuth();
      return true;
    }
    const data = readAuthRaw();
    if (!data?.access_token || !data?.user?.login) return false;
    if (data.expires_at && Date.now() > data.expires_at) return false;
    return true;
  }

  function buildAuthorizeUrl() {
    const state = crypto.randomUUID();
    sessionStorage.setItem(cfg.stateKey, state);
    const q = new URLSearchParams({
      client_id: clientId(),
      redirect_uri: redirectUri(),
      scope: cfg.scope || "read:user",
      state,
    });
    return `https://github.com/login/oauth/authorize?${q}`;
  }

  function startLogin() {
    if (isMockAuth()) {
      ensureMockAuth();
      window.location.href = "index.html";
      return "index.html";
    }
    const url = buildAuthorizeUrl();
    window.location.href = url;
    return url;
  }

  function logout() {
    sessionStorage.removeItem(cfg.storageKey);
    sessionStorage.removeItem(cfg.stateKey);
    if (isMockAuth()) {
      ensureMockAuth();
      window.location.href = "index.html";
      return;
    }
    startLogin();
  }

  if (isMockAuth()) ensureMockAuth();

  window.MiniverseGitHubAuth = {
    isAuthed,
    readAuth,
    startLogin,
    buildAuthorizeUrl,
    logout,
    redirectUri,
    isLocalDev,
    isMockAuth,
    clientId,
    tokenExchangeApi,
  };

  if (publicPages.has(page)) return;

  if (window.location.protocol === "file:") {
    window.location.replace("login.html?reason=file");
    return;
  }

  if (isMockAuth()) return;

  if (!isAuthed()) {
    const dest = "login.html";
    if (!page.includes("login") && window.location.pathname.split("/").pop() !== dest) {
      window.location.replace(dest);
    }
  }
})();
