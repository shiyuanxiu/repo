window.GITHUB_AUTH_CONFIG = {
  clientId: "Ov23liOu1avolRsyCXgE",
  scope: "read:user",
  storageKey: "miniverse_github_auth",
  stateKey: "miniverse_oauth_state",
  social: {
    /** Shared comments + counts for all users (no GitHub required). */
    communityApi: "/auth/social/community",
    /** Production: deploy workers/social-community.js and set full URL, e.g. https://miniverse.gg/api/social/community */
    // communityApi: "https://YOUR-WORKER.workers.dev/community",
    publicGistId: "52ae8578e3aa6e4ae3ddf41ea805c0e3",
    /** Public gist files (synced via githubPat in auth/secrets.js) */
    commentsGistId: "a2bc4f4cf12fe15760f207ada83ed5ad",
    commentsGistFile: "global-comment.json",
    /** Public read — Gist Raw (no auth). Write goes through dev-server PATCH. */
    commentsGistRawUrl:
      "https://gist.githubusercontent.com/raw/a2bc4f4cf12fe15760f207ada83ed5ad/global-comment.json",
    likesGistFile: "global-likes.json",
    usersGistFile: "global-users.json",
    communityFile: "miniverse-community.json",
    userFile: "miniverse-user.json",
  },
};
