// VOIDMARK world-journal audience (B122 / S6): the Director-facing mark plus the
// world-journal side of retrieve.
//
// Right-click a Journal Entry in the sidebar, or a page in the journal's table of
// contents, to set flags.draw-steel-ghostwire.voidmarkAudience. Director-only
// entries/pages never reach a player ask, and never reach a GM asking in Runner mode.
// Pure predicates live in scripts/voidmark-audience.mjs so Node smoke can test them.

import {
  AUDIENCE_FLAG,
  MODULE_ID,
  canVoidmarkUsePage,
  hasExplicitVoidmarkMark,
  isVoidmarkDirectorOnly,
  readAudienceFlag,
  resolveVoidmarkAudience,
} from "./voidmark-audience.mjs";

const L = "GHOSTWIRE.Voidmark.Audience";
const MARK_CLASS = "ghostwire-voidmark-director-only";
const BADGE_CLASS = "ghostwire-voidmark-badge";

/** Max characters of one world-journal page fed to the model per chunk. */
const MAX_JOURNAL_CHUNK = 1600;
const MIN_JOURNAL_CHUNK = 24;
/** Ceiling on world-journal chunks scored per ask, so a giant world stays responsive. */
const MAX_JOURNAL_CHUNKS = 400;

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));

function allUsers() {
  return game.users?.contents ?? [];
}

/* ---------- marking ---------- */

async function setAudience(doc, value) {
  if (!doc) return;
  if (value === null) await doc.unsetFlag(MODULE_ID, AUDIENCE_FLAG);
  else await doc.setFlag(MODULE_ID, AUDIENCE_FLAG, value);
  const name = doc.name ?? doc.parent?.name ?? "";
  const key = value === "director" ? "Notify.Marked" : value === "player" ? "Notify.Cleared" : "Notify.Reset";
  ui.notifications.info(loc(key, { name }));
}

function canMark(doc) {
  return !!doc && game.user.isGM && doc.canUserModify?.(game.user, "update") !== false;
}

/** Context menu entries shared by the sidebar (entries) and the TOC (pages). */
function audienceMenuItems(resolve) {
  return [
    {
      label: `${L}.MarkDirector`,
      icon: "fa-solid fa-user-shield",
      visible: target => {
        const doc = resolve(target);
        return canMark(doc) && readAudienceFlag(doc) !== "director";
      },
      onClick: (event, target) => setAudience(resolve(target), "director"),
    },
    {
      label: `${L}.AllowPlayers`,
      icon: "fa-solid fa-users",
      visible: target => {
        const doc = resolve(target);
        return canMark(doc) && readAudienceFlag(doc) !== "player";
      },
      onClick: (event, target) => setAudience(resolve(target), "player"),
    },
    {
      label: `${L}.ClearMark`,
      icon: "fa-solid fa-eraser",
      visible: target => {
        const doc = resolve(target);
        return canMark(doc) && hasExplicitVoidmarkMark(doc);
      },
      onClick: (event, target) => setAudience(resolve(target), null),
    },
  ];
}

/* ---------- sidebar / TOC badges ---------- */

function badgeHtml(title) {
  return `<i class="${BADGE_CLASS} fa-solid fa-user-shield" data-tooltip="${foundry.utils.escapeHTML(title)}"></i>`;
}

function decorate(element, directorOnly, title) {
  if (!element) return;
  element.classList.toggle(MARK_CLASS, !!directorOnly);
  const existing = element.querySelector(`:scope .${BADGE_CLASS}`);
  if (!directorOnly) {
    existing?.remove();
    return;
  }
  if (existing) return;
  const anchor = element.querySelector(":scope .entry-name, :scope .document-name, :scope .page-title, :scope h4, :scope a")
    ?? element;
  anchor.insertAdjacentHTML("beforeend", ` ${badgeHtml(title)}`);
}

function decorateDirectory(element) {
  if (!game.user.isGM) return;
  const users = allUsers();
  for (const li of element.querySelectorAll(".directory-item[data-entry-id]")) {
    const entry = game.journal?.get(li.dataset.entryId);
    if (!entry) continue;
    decorate(li, isVoidmarkDirectorOnly(entry, { users }), loc("Badge"));
  }
}

function decorateJournalSheet(app, element) {
  if (!game.user.isGM) return;
  const entry = app?.document ?? app?.entry;
  if (!entry?.pages) return;
  const users = allUsers();
  for (const li of element.querySelectorAll(".toc .page[data-page-id], .directory-item[data-page-id]")) {
    const page = entry.pages.get(li.dataset.pageId);
    if (!page) continue;
    decorate(li, isVoidmarkDirectorOnly(page, { parent: entry, users }), loc("Badge"));
  }
}

/* ---------- world journal RAG ---------- */

/** Journal HTML → plain text VOIDMARK can quote. */
export function journalTextFromHtml(html) {
  const raw = String(html ?? "");
  if (!raw.trim()) return "";
  // Block boundaries become paragraph breaks — textContent alone would weld pages into one blob.
  const spaced = raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|li|ul|ol|h[1-6]|tr|td|th|section|article|blockquote|figcaption)>/gi, "\n\n");
  let text = spaced;
  if (typeof document !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = spaced;
    text = div.textContent ?? "";
  } else {
    text = spaced.replace(/<[^>]+>/g, " ");
  }
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Split page text into scoreable chunks on paragraph boundaries. Nothing is dropped. */
export function splitJournalText(text) {
  const paragraphs = String(text ?? "").split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  const chunks = [];
  let buffer = "";
  const flush = () => {
    if (buffer) chunks.push(buffer);
    buffer = "";
  };
  for (const paragraph of paragraphs) {
    let rest = paragraph;
    while (rest.length > MAX_JOURNAL_CHUNK) {
      flush();
      chunks.push(rest.slice(0, MAX_JOURNAL_CHUNK));
      rest = rest.slice(MAX_JOURNAL_CHUNK).trim();
    }
    if (!rest) continue;
    if (buffer && (buffer.length + rest.length + 2) > MAX_JOURNAL_CHUNK) flush();
    buffer = buffer ? `${buffer}\n\n${rest}` : rest;
  }
  flush();
  // Fold a short tail back into its neighbour rather than losing it.
  const merged = [];
  for (const chunk of chunks) {
    if (chunk.length < MIN_JOURNAL_CHUNK && merged.length) merged[merged.length - 1] += `\n\n${chunk}`;
    else if (chunk.length >= MIN_JOURNAL_CHUNK) merged.push(chunk);
  }
  // A page shorter than one chunk is still worth answering from.
  if (!merged.length && chunks.length) return [chunks.join("\n\n")];
  return merged;
}

/**
 * Chunks from world Journal pages the asker is allowed to hear.
 * Applies the VOIDMARK mark first, then Foundry ownership — never both bypassed.
 * @param {{ user?: User, mode?: string, forcePlayer?: boolean }} [spec]
 * @returns {object[]} chunks shaped like the static index
 */
export function worldJournalChunks({ user = game.user, mode = "runner", forcePlayer = false } = {}) {
  const users = allUsers();
  const chunks = [];
  for (const entry of game.journal ?? []) {
    for (const page of entry.pages ?? []) {
      if (chunks.length >= MAX_JOURNAL_CHUNKS) return chunks;
      if (page.type !== "text") continue;
      if (!canVoidmarkUsePage(user, page, { mode, entry, users, forcePlayer })) continue;
      const text = journalTextFromHtml(page.text?.content ?? "");
      if (!text) continue;
      const audience = resolveVoidmarkAudience(page, { parent: entry, users });
      splitJournalText(text).forEach((part, i) => {
        if (chunks.length >= MAX_JOURNAL_CHUNKS) return;
        chunks.push({
          id: `journal.${entry.id}.${page.id}#${i + 1}`,
          file: `journal:${entry.name}`,
          source: `Journal — ${entry.name}`,
          chapter: entry.name,
          heading: page.name,
          kind: "journal",
          audience,
          text: part,
        });
      });
    }
  }
  return chunks;
}

/* ---------- register ---------- */

/** Register the Director-only journal mark: context menus + sidebar badges. */
export function registerVoidmarkJournal() {
  Hooks.on("getJournalEntryContextOptions", (app, menuItems) => {
    const resolve = target => {
      const li = target?.closest?.("[data-entry-id]") ?? target;
      return game.journal?.get(li?.dataset?.entryId);
    };
    menuItems.push(...audienceMenuItems(resolve));
  });

  Hooks.on("getJournalEntryPageContextOptions", (app, menuItems) => {
    const entry = app?.document ?? app?.entry;
    const resolve = target => {
      const li = target?.closest?.("[data-page-id]") ?? target;
      return entry?.pages?.get(li?.dataset?.pageId);
    };
    menuItems.push(...audienceMenuItems(resolve));
  });

  Hooks.on("renderJournalDirectory", (app, element) => decorateDirectory(element));
  Hooks.on("renderJournalEntrySheet", (app, element) => decorateJournalSheet(app, element));
  Hooks.on("renderJournalSheet", (app, element) => decorateJournalSheet(app, element?.[0] ?? element));
}
