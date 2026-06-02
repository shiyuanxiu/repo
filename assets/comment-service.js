/**
 * Miniverse Comment Service — GitHub Gist backed comments with replies.
 *
 * Data model (v3 global-comment.json):
 *   { "version": 3, "cards": { "gameId::cardId": [ Comment, ... ] } }
 *
 * Comment fields: commentId, userId, username, avatar, content, createTime, replyTo
 * Rules: 1 main comment per userId per card; replies max depth 1; max 50 per card.
 *
 * Read:  Gist Raw URL (public)
 * Write: POST /auth/social/community { op: "comment", gameId, cardId, comment, replyTo }
 */
(function (global) {
  "use strict";

  const CFG = global.GITHUB_AUTH_CONFIG?.social || {};
  const MAX_COMMENTS_PER_CARD = 50;
  const MAX_CONTENT_LEN = 500;
  const US_EASTERN = "America/New_York";

  /** @typedef {{ commentId: string, userId: string, username: string, avatar: string, content: string, createTime: string, replyTo: string|null }} Comment */

  /**
   * Build storage key for a card.
   * @param {string} gameId
   * @param {string} [cardId] defaults to gameId
   */
  function cardKey(gameId, cardId) {
    const g = String(gameId || "").trim();
    const c = String(cardId || g).trim();
    return `${g}::${c}`;
  }

  /**
   * Format date as US Eastern YYYY-MM-DD hh:mm:ss (24h).
   * @param {Date|number|string} [input] defaults to now
   */
  function formatUsEasternTime(input) {
    const d = input instanceof Date ? input : input ? new Date(input) : new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: US_EASTERN,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(d);
    const get = (type) => parts.find((p) => p.type === type)?.value || "00";
    return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
  }

  /** @param {unknown} id */
  function newCommentId(id) {
    if (id && String(id).trim()) return String(id).trim();
    return global.crypto?.randomUUID?.() || `c-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  /**
   * Normalize legacy or partial record to v3 Comment shape.
   * @param {Record<string, unknown>} raw
   * @returns {Comment|null}
   */
  function normalizeComment(raw) {
    if (!raw || typeof raw !== "object") return null;
    const content = String(raw.content || raw.text || "").trim();
    if (!content) return null;
    const replyTo = raw.replyTo ?? raw.reply_to ?? null;
    return {
      commentId: newCommentId(raw.commentId || raw.id),
      userId: String(raw.userId || raw.login || raw.user_id || "unknown"),
      username: String(raw.username || raw.name || raw.login || "Player"),
      avatar: String(raw.avatar || raw.avatar_url || ""),
      content: content.slice(0, MAX_CONTENT_LEN),
      createTime: String(raw.createTime || raw.time || formatUsEasternTime(raw.ts || Date.now())),
      replyTo: replyTo ? String(replyTo) : null,
    };
  }

  /** @param {Comment[]} list */
  function dedupeByCommentId(list) {
    const seen = new Set();
    const out = [];
    for (const c of list || []) {
      if (!c?.commentId || seen.has(c.commentId)) continue;
      seen.add(c.commentId);
      out.push(c);
    }
    return out;
  }

  /** @param {Comment[]} list */
  function countComments(list) {
    return dedupeByCommentId(list).length;
  }

  /**
   * @param {Comment[]} list
   * @param {string} userId
   */
  function hasMainComment(list, userId) {
    const uid = String(userId);
    return dedupeByCommentId(list).some((c) => !c.replyTo && c.userId === uid);
  }

  /**
   * @param {Comment[]} list
   * @param {string} commentId
   */
  function findComment(list, commentId) {
    return dedupeByCommentId(list).find((c) => c.commentId === commentId) || null;
  }

  /**
   * Validate before submit.
   * @param {Comment[]} existing
   * @param {{ userId: string, content: string, replyTo?: string|null }} draft
   * @returns {{ ok: true } | { ok: false, error: string }}
   */
  function validateSubmit(existing, draft) {
    const content = String(draft.content || "").trim();
    if (!content) return { ok: false, error: "empty_content" };
    if (content.length > MAX_CONTENT_LEN) return { ok: false, error: "content_too_long" };
    if (!draft.userId) return { ok: false, error: "missing_userId" };

    const list = dedupeByCommentId(existing);
    if (countComments(list) >= MAX_COMMENTS_PER_CARD) {
      return { ok: false, error: "card_limit_reached" };
    }

    const replyTo = draft.replyTo ? String(draft.replyTo) : null;
    if (!replyTo) {
      if (hasMainComment(list, draft.userId)) {
        return { ok: false, error: "main_comment_exists" };
      }
      return { ok: true };
    }

    const parent = findComment(list, replyTo);
    if (!parent) return { ok: false, error: "parent_not_found" };
    if (parent.replyTo) return { ok: false, error: "max_reply_depth" };
    return { ok: true };
  }

  /**
   * Build comment payload for API.
   * @param {{ user: { login?: string, id?: number|string, name?: string, avatar_url?: string }, content: string, replyTo?: string|null, commentId?: string }} opts
   */
  function buildCommentPayload(opts) {
    const user = opts.user || {};
    return {
      commentId: newCommentId(opts.commentId),
      userId: String(user.id || user.login || "unknown"),
      username: String(user.name || user.login || "Player"),
      avatar: String(user.avatar_url || ""),
      content: String(opts.content || "").trim().slice(0, MAX_CONTENT_LEN),
      createTime: formatUsEasternTime(),
      replyTo: opts.replyTo ? String(opts.replyTo) : null,
    };
  }

  /**
   * Parse Gist JSON (v3 or legacy gistKey arrays).
   * @param {unknown} doc
   * @returns {{ version: number, cards: Record<string, Comment[]> }}
   */
  function parseGistDocument(doc) {
    if (!doc || typeof doc !== "object") return { version: 3, cards: {} };

    /** @type {Record<string, Comment[]>} */
    const cards = {};

    if (Number(doc.version) >= 3 && doc.cards && typeof doc.cards === "object") {
      for (const [key, items] of Object.entries(doc.cards)) {
        cards[key] = dedupeByCommentId((items || []).map(normalizeComment).filter(Boolean));
      }
      return { version: 3, cards };
    }

    // Legacy: { SquishyChick: [{ name, avatar, content, time }] }
    for (const [gistKey, items] of Object.entries(doc)) {
      if (!Array.isArray(items)) continue;
      const gameId = gistKey.charAt(0).toLowerCase() + gistKey.slice(1);
      const key = cardKey(gameId, gameId);
      cards[key] = dedupeByCommentId(
        items.map((item, i) =>
          normalizeComment({
            commentId: `${gameId}-legacy-${i}`,
            userId: item.name || item.login || `legacy-${i}`,
            username: item.name || "Player",
            avatar: item.avatar,
            content: item.content || item.text,
            createTime: item.time,
            replyTo: null,
          })
        ).filter(Boolean)
      );
    }
    return { version: 3, cards };
  }

  /** @param {Record<string, Comment[]>} cards */
  function serializeGistDocument(cards) {
    const out = { version: 3, cards: {} };
    for (const [key, items] of Object.entries(cards || {})) {
      out.cards[key] = dedupeByCommentId(items).slice(0, MAX_COMMENTS_PER_CARD);
    }
    return out;
  }

  /**
   * Gist Raw URL for public read.
   * @param {string} [gistId]
   * @param {string} [filename]
   */
  function gistRawUrl(gistId, filename) {
    if (CFG.commentsGistRawUrl) {
      return `${CFG.commentsGistRawUrl}?v=${Date.now()}`;
    }
    const id = gistId || CFG.commentsGistId || "";
    const file = filename || CFG.commentsGistFile || "global-comment.json";
    if (!id) return "";
    return `https://gist.githubusercontent.com/raw/${id}/${file}?v=${Date.now()}`;
  }

  /**
   * Fetch comments for one card via Gist Raw (fallback: community API).
   * @param {string} gameId
   * @param {string} [cardId]
   * @param {{ communityApi?: string, gistId?: string }} [opts]
   */
  async function fetchCardComments(gameId, cardId, opts) {
    const key = cardKey(gameId, cardId);
    const gistId = opts?.gistId || CFG.commentsGistId;
    const rawUrl = gistRawUrl(gistId);

    if (rawUrl) {
      try {
        const res = await fetch(rawUrl, { cache: "no-store" });
        if (res.ok) {
          const doc = parseGistDocument(await res.json());
          return doc.cards[key] || [];
        }
      } catch (e) {
        console.warn("[CommentService] raw fetch failed", e);
      }
    }

    const api = opts?.communityApi ?? CFG.communityApi;
    if (api) {
      const res = await fetch(api, { cache: "no-store" });
      if (!res.ok) throw new Error(`community HTTP ${res.status}`);
      const data = await res.json();
      const comments = data.comments || data.community?.comments || {};
      return dedupeByCommentId((comments[key] || comments[gameId] || []).map(normalizeComment).filter(Boolean));
    }

    return [];
  }

  /**
   * Submit comment via dev-server (PATCH Gist server-side).
   * @param {string} gameId
   * @param {string} cardId
   * @param {Comment} comment
   * @param {string} token Bearer token
   */
  async function submitComment(gameId, cardId, comment, token) {
    const api = CFG.communityApi;
    if (!api) throw new Error("communityApi_not_configured");
    const res = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        op: "comment",
        gameId,
        cardId: cardId || gameId,
        replyTo: comment.replyTo || null,
        comment,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || "comment_submit_failed");
      err.code = data.error;
      throw err;
    }
    return data;
  }

  /**
   * Group flat list into threads for rendering.
   * @param {Comment[]} list
   */
  function groupCommentThreads(list) {
    const all = dedupeByCommentId(list);
    const mains = all.filter((c) => !c.replyTo).sort((a, b) => a.createTime.localeCompare(b.createTime));
    const repliesByParent = new Map();
    for (const c of all) {
      if (!c.replyTo) continue;
      if (!repliesByParent.has(c.replyTo)) repliesByParent.set(c.replyTo, []);
      repliesByParent.get(c.replyTo).push(c);
    }
    for (const arr of repliesByParent.values()) {
      arr.sort((a, b) => a.createTime.localeCompare(b.createTime));
    }
    return mains.map((main) => ({
      main,
      replies: repliesByParent.get(main.commentId) || [],
    }));
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /**
   * Render comment threads into a container element.
   * @param {HTMLElement} listEl <ul>
   * @param {Comment[]} comments
   * @param {{ userId?: string, onReply?: (commentId: string, username: string) => void }} ctx
   */
  function renderCommentList(listEl, comments, ctx) {
    if (!listEl) return;
    const threads = groupCommentThreads(comments);
    if (!threads.length) {
      listEl.innerHTML = '<li class="social-comment-empty">No comments yet — be the first!</li>';
      return;
    }

    const uid = ctx?.userId || "";
    listEl.innerHTML = threads
      .map(({ main, replies }) => {
        const canReply = uid && uid !== main.userId;
        const replyBtn = canReply
          ? `<button type="button" class="social-comment-reply" data-reply-to="${escapeHtml(main.commentId)}" data-reply-user="${escapeHtml(main.username)}">Reply</button>`
          : "";
        const repliesHtml = replies
          .map(
            (r) => `
          <li class="social-comment-reply-item">
            <div class="social-comment-meta">
              ${r.avatar ? `<img src="${escapeHtml(r.avatar)}" alt="">` : ""}
              <strong>${escapeHtml(r.username)}</strong>
              <span>${escapeHtml(r.createTime)} ET</span>
            </div>
            <div class="social-comment-body">${escapeHtml(r.content)}</div>
          </li>`
          )
          .join("");
        return `
        <li class="social-comment-thread" data-comment-id="${escapeHtml(main.commentId)}">
          <div class="social-comment-item social-comment-main">
            <div class="social-comment-meta">
              ${main.avatar ? `<img src="${escapeHtml(main.avatar)}" alt="">` : ""}
              <strong>${escapeHtml(main.username)}</strong>
              <span>${escapeHtml(main.createTime)} ET</span>
            </div>
            <div class="social-comment-body">${escapeHtml(main.content)}</div>
            ${replyBtn}
          </div>
          ${replies.length ? `<ul class="social-comment-replies">${repliesHtml}</ul>` : ""}
        </li>`;
      })
      .join("");

    if (ctx?.onReply) {
      listEl.querySelectorAll(".social-comment-reply").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          ctx.onReply(btn.dataset.replyTo, btn.dataset.replyUser);
        });
      });
    }
  }

  const CommentService = {
    cardKey,
    formatUsEasternTime,
    normalizeComment,
    dedupeByCommentId,
    countComments,
    hasMainComment,
    findComment,
    validateSubmit,
    buildCommentPayload,
    parseGistDocument,
    serializeGistDocument,
    gistRawUrl,
    fetchCardComments,
    submitComment,
    groupCommentThreads,
    renderCommentList,
    escapeHtml,
    MAX_COMMENTS_PER_CARD,
    MAX_CONTENT_LEN,
  };

  global.MiniverseCommentService = CommentService;
})(typeof window !== "undefined" ? window : globalThis);
