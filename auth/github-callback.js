(function () {
  const cfg = window.GITHUB_AUTH_CONFIG;
  const statusEl = document.getElementById("authStatus");
  const detailEl = document.getElementById("authDetail");

  function show(msg, detail) {
    if (statusEl) statusEl.textContent = msg;
    if (detailEl) detailEl.textContent = detail || "";
  }

  async function handleCallback() {
    if (window.location.protocol === "file:") {
      show("Use dev server", "Run start-dev-server.bat, then open http://localhost:8765/login.html");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err) {
      show("GitHub 登录已取消", err);
      return;
    }

    const code = params.get("code");
    const state = params.get("state");
    const saved = sessionStorage.getItem(cfg.stateKey);
    if (!code || !state || state !== saved) {
      show("Invalid callback", "OAuth code expired. Open login.html and sign in again.");
      return;
    }

    show("正在验证 GitHub 账号…");

    try {
      const tokenRes = await fetch("/auth/exchange-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          redirect_uri: window.MiniverseGitHubAuth.redirectUri(),
        }),
      });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || tokenData.error || !tokenData.access_token) {
        let hint =
          tokenData.error === "missing_client_secret"
            ? "请用 start-dev-server.bat 启动（不要用 py -m http.server），并填写 auth/secrets.js"
            : tokenData.error_description || tokenData.error || "请检查 Client Secret 与 Callback URL";
        if (tokenData.error === "github_unreachable" || /ssl|handshake|timed out/i.test(hint)) {
          hint =
            "本机 Python 连不上 GitHub（SSL 超时）。\n\n" +
            "① 更新 hosts 里 github.com / api.github.com 的 IP，执行 ipconfig /flushdns\n" +
            "② 或复制 auth/proxy.env.example → auth/proxy.env，填入代理端口后重启 start-dev-server.bat\n" +
            "③ 重新打开首页登录（OAuth code 只能用一次）";
        }
        show("Sign-in failed", hint + "\n\n→ login.html");
        return;
      }

      sessionStorage.setItem(
        cfg.storageKey,
        JSON.stringify({
          access_token: tokenData.access_token,
          user: tokenData.user,
          expires_at: Date.now() + (tokenData.expires_in || 28800) * 1000,
        })
      );
      sessionStorage.removeItem(cfg.stateKey);
      window.location.replace("index.html");
    } catch (e) {
      show("网络错误", String(e.message || e));
    }
  }

  handleCallback();
})();
