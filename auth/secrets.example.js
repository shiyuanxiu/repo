// Copy to auth/secrets.js (gitignored). Never commit real secrets.
// GitHub → Settings → Developer settings → OAuth Apps → Client secrets
window.GITHUB_AUTH_SECRETS = {
  /** Local OAuth App (Ov23liOu1avolRsyCXgE) — used by start-dev-server.bat */
  clientSecretLocal: "",
  /** Production OAuth App (Ov23liEp1iutKOH6gnjd) — used by Cloudflare Worker + optional local test */
  clientSecretProduction: "",
  /** Legacy alias for clientSecretLocal (still supported by dev-server) */
  clientSecret: "",
  /** Personal Access Token with gist scope — server-side only */
  githubPat: "",
};
