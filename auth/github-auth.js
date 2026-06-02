(function () {
  const cfg = window.GITHUB_AUTH_CONFIG;
  if (!cfg?.clientId) return;

  const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const publicPages = new Set(["github-callback.html", "login.html"]);

  function redirectUri() {
    const host = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : "";
    const origin =
      host === "127.0.0.1" || host === "localhost"
        ? `http://localhost${port}`
        : `${window.location.protocol}//${host}${port}`;
    return `${origin}/github-callback.html`;
  }

  function readAuth() {
    try {
      const raw = sessionStorage.getItem(cfg.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function isAuthed() {
    const data = readAuth();
    if (!data?.access_token || !data?.user?.login) return false;
    if (data.expires_at && Date.now() > data.expires_at) return false;
    return true;
  }

  function buildAuthorizeUrl() {
    const state = crypto.randomUUID();
    sessionStorage.setItem(cfg.stateKey, state);
    const q = new URLSearchParams({
      client_id: cfg.clientId,
      redirect_uri: redirectUri(),
      scope: cfg.scope || "read:user",
      state,
    });
    return `https://github.com/login/oauth/authorize?${q}`;
  }

  function startLogin() {
    const url = buildAuthorizeUrl();
    window.location.href = url;
    return url;
  }

  function logout() {
    sessionStorage.removeItem(cfg.storageKey);
    sessionStorage.removeItem(cfg.stateKey);
    startLogin();
  }

  window.MiniverseGitHubAuth = {
    isAuthed,
    readAuth,
    startLogin,
    buildAuthorizeUrl,
    logout,
    redirectUri,
  };

  if (publicPages.has(page)) return;

  if (window.location.protocol === "file:") {
    window.location.replace("login.html?reason=file");
    return;
  }

  if (!isAuthed()) {
    const dest = "login.html";
    if (!page.includes("login") && window.location.pathname.split("/").pop() !== dest) {
      window.location.replace(dest);
    }
  }
})();
