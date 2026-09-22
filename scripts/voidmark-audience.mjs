// VOIDMARK audience helpers (B122 / S6) — who is allowed to hear a piece of lore.
// No Foundry globals: every helper takes plain documents / user-like objects so
// tools/voidmark-audience-smoke.mjs can unit-test them under Node.
//
// Flag shape (LOCKED by docs/spikes/B122-DIRECTOR-ONLY-LORE-VOIDMARK.md):
//   flags.draw-steel-ghostwire.voidmarkAudience = "director" | "player"
// Missing flag on a page inherits the parent Journal Entry's flag; if neither is
// set, Foundry ownership decides (nothing a non-GM can see = Director-only).

export const MODULE_ID = "draw-steel-ghostwire";
export const AUDIENCE_FLAG = "voidmarkAudience";

/** Mirrors CONST.DOCUMENT_OWNERSHIP_LEVELS so this module stays Foundry-free. */
export const OWNERSHIP = { INHERIT: -1, NONE: 0, LIMITED: 1, OBSERVER: 2, OWNER: 3 };

/** Level a player needs before VOIDMARK will read a page's text back to them. */
export const READ_LEVEL = OWNERSHIP.OBSERVER;

/** Level that counts as "somebody out there can see this" when inheriting from ownership. */
export const SHARED_LEVEL = OWNERSHIP.LIMITED;

/** @returns {"director"|"player"|null} */
export function normalizeAudience(value) {
  const text = String(value ?? "").toLowerCase();
  if (text === "director") return "director";
  if (text === "player") return "player";
  return null;
}

/** Explicit VOIDMARK mark on one document, or null when unmarked. */
export function readAudienceFlag(doc) {
  if (!doc) return null;
  let raw;
  if (typeof doc.getFlag === "function") {
    try { raw = doc.getFlag(MODULE_ID, AUDIENCE_FLAG); } catch { raw = undefined; }
  }
  raw ??= doc?.flags?.[MODULE_ID]?.[AUDIENCE_FLAG];
  return normalizeAudience(raw);
}

/**
 * Effective ownership level for one user, resolving INHERIT up to the parent entry.
 * @param {{ ownership?: Record<string, number> }} doc
 * @param {{ id?: string, isGM?: boolean }} user
 * @param {{ parent?: object }} [options]
 */
export function ownershipLevel(doc, user, { parent = null } = {}) {
  if (!doc) return OWNERSHIP.NONE;
  if (user?.isGM) return OWNERSHIP.OWNER;
  const ownership = doc.ownership ?? {};
  let level = user?.id == null ? undefined : ownership[user.id];
  if (level == null || Number(level) === OWNERSHIP.INHERIT) level = ownership.default;
  if (level == null || Number(level) === OWNERSHIP.INHERIT) {
    return parent ? ownershipLevel(parent, user) : OWNERSHIP.NONE;
  }
  return Number(level);
}

/** True when at least one non-GM can see this document at all (ownership only). */
export function hasPlayerVisibleOwnership(doc, { users = [], parent = null } = {}) {
  if (!doc) return false;
  const inherited = doc.ownership?.default;
  if (inherited != null && Number(inherited) !== OWNERSHIP.INHERIT) {
    if (Number(inherited) >= SHARED_LEVEL) return true;
  } else if (parent && Number(parent.ownership?.default ?? OWNERSHIP.NONE) >= SHARED_LEVEL) {
    return true;
  }
  return (users ?? [])
    .filter(u => u && !u.isGM)
    .some(u => ownershipLevel(doc, u, { parent }) >= SHARED_LEVEL);
}

/**
 * Resolve the audience for a Journal Entry or Journal Page.
 * Page flag wins over entry flag; unmarked falls back to ownership.
 * @param {object} doc              Journal Entry or Journal Entry Page
 * @param {{ parent?: object, users?: object[] }} [options] parent = owning entry when doc is a page
 * @returns {"director"|"player"}
 */
export function resolveVoidmarkAudience(doc, { parent = null, users = [] } = {}) {
  const own = readAudienceFlag(doc);
  if (own) return own;
  const entry = parent ?? doc?.parent ?? null;
  const inherited = readAudienceFlag(entry);
  if (inherited) return inherited;
  return hasPlayerVisibleOwnership(doc, { users, parent: entry }) ? "player" : "director";
}

/** Convenience predicate for the sidebar badge and the RAG filter. */
export function isVoidmarkDirectorOnly(doc, options = {}) {
  return resolveVoidmarkAudience(doc, options) === "director";
}

/** True when the mark was set by hand (as opposed to inherited from ownership). */
export function hasExplicitVoidmarkMark(doc) {
  return readAudienceFlag(doc) != null;
}

/** GM + Director mode is the only combination that hears Director-only material. */
export function audienceForAsk({ user, mode, forcePlayer = false } = {}) {
  if (forcePlayer) return "player";
  return (user?.isGM && String(mode ?? "").toLowerCase() === "director") ? "all" : "player";
}

/**
 * May VOIDMARK read this world Journal page back to the asker?
 * Applies the VOIDMARK mark first, then Foundry ownership — never bypasses perms.
 * @param {{ id?: string, isGM?: boolean }} user
 * @param {object} page
 * @param {{ mode?: string, entry?: object, users?: object[], forcePlayer?: boolean }} [options]
 */
export function canVoidmarkUsePage(user, page, { mode = "runner", entry = null, users = [], forcePlayer = false } = {}) {
  if (!user || !page) return false;
  const parent = entry ?? page.parent ?? null;
  if (ownershipLevel(page, user, { parent }) < READ_LEVEL) return false;
  if (audienceForAsk({ user, mode, forcePlayer }) === "all") return true;
  return resolveVoidmarkAudience(page, { parent, users }) === "player";
}
