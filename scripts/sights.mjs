// F20 — Wired sights on the canvas (docs/directors/_next-wave/f20-foundry-sights-brief.md,
// director note docs/directors/f20-foundry-sights.md).
//
// Before this pass a sight SKU was flavour plus a Perception edge: scripts/token-vision.mjs forced
// `sight.enabled` and nothing else, so Cyber-Eyes and Low-Light Goggles changed nothing about what a
// token could actually see on the canvas. This module is that sibling. It leaves `sight.enabled` to
// token-vision for every creature already in that module's scope and writes `detectionModes` (plus
// `sight.visionMode`) from a flag on the granting Item.
//
// Locks (Michael 2026-09-23, F20 brief):
//  1. **Stock Foundry modes only.** No invented thermal engine, no custom DetectionMode subclass.
//     Everything in FOUNDRY_DETECTION_MODES / FOUNDRY_VISION_MODES is what CONFIG.Canvas ships.
//  2. **Three claims, three mappings** — SIGHT_DOCTRINE below. A card may only claim what the canvas
//     can do, so the printed rules and the detectionModes agree. Foundry has no thermal imaging, so
//     Ghostwire *defines* thermal as `seeAll` at a printed range: inside it you pick creatures out
//     of smoke and darkness whatever they are hiding behind, and walls still stop you.
//  3. **A grant is only live while its source is live.** F12 suppressed / destroyed chrome grants
//     nothing (benefitsOffline), and a mod grants nothing until it is installed and switched on.
//  4. **Everything we write is reversible.** `flags.<module>.sightApplied` records the mode ids, the
//     vision mode and the vision flip this module put on a token, so removing the implant removes
//     exactly those and restores a Director's own configuration underneath.
//
// Helpers above the "Foundry registration" divider are Foundry-free so
// tools/f20-foundry-sights-smoke.mjs can run them in Node.

import { benefitsOffline } from "./chrome-damage.mjs";
import { actorWantsTokenVision } from "./token-vision.mjs";

export const MODULE_ID = "draw-steel-ghostwire";
export const SIGHT_GRANT_FLAG = "sightGrant";
export const SIGHT_APPLIED_FLAG = "sightApplied";
export const SIGHTS_SETTING = "sightsMigrated";

/** Stock Foundry 14 detection mode ids (CONFIG.Canvas.detectionModes). Nothing else is writable. */
export const FOUNDRY_DETECTION_MODES = Object.freeze([
  "basicSight", "lightPerception", "seeInvisibility", "senseInvisibility", "feelTremor", "seeAll", "senseAll",
]);

/** Stock Foundry 14 vision mode ids (CONFIG.Canvas.visionModes). The Wired tints are client-only. */
export const FOUNDRY_VISION_MODES = Object.freeze([
  "basic", "darkvision", "monochromatic", "blindness", "tremorsense", "lightAmplification",
]);

/**
 * The only three claims a Ghostwire sight card is allowed to make, and the stock Foundry mode each
 * one becomes. A through-wall or supernatural-detect claim is deliberately absent: no stock mode
 * does it, so those cards say "Director call" instead of pretending.
 */
export const SIGHT_DOCTRINE = Object.freeze({
  // Low-light / night / photon-amplifier optics. basicSight *is* DetectionModeDarkvision.
  nightOptics: Object.freeze({ mode: "basicSight", visionMode: "darkvision" }),
  // Thermal / IR. Foundry has no thermal: `seeAll` is Truesight — creatures inside the range are
  // detected through smoke, darkness and invisibility, but walls still block.
  thermal: Object.freeze({ mode: "seeAll", visionMode: null }),
  // Veil glimpse / see invisible / spirit-thin.
  veilGlimpse: Object.freeze({ mode: "seeInvisibility", visionMode: null }),
});

export const SIGHT_CLAIMS = Object.freeze(Object.keys(SIGHT_DOCTRINE));

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? doc?.flags?.["draw-steel-ghostwire"] ?? {};

/* -------------------------------------------- reading the grant */

/** A finite range in squares, or null for unlimited (Foundry reads null as Infinity). */
function normalizeRange(value) {
  if (value === null || value === undefined || value === "") return null;
  const range = Number(value);
  if (!Number.isFinite(range) || range < 0) return null;
  return range;
}

/**
 * The sight grant declared on one Item, normalized. Unknown mode / vision ids are dropped rather
 * than written, so a typo in a pack row can never hand Foundry an id it does not have.
 * @param {object} item
 * @returns {{modes: Array<{id: string, range: number|null, enabled: boolean}>, visionMode: string|null,
 *            priority: number, claims: string[], enableVision: boolean}|null}
 */
export function sightGrantOf(item) {
  const raw = gwFlags(item)[SIGHT_GRANT_FLAG];
  if (!raw || typeof raw !== "object") return null;
  const modes = [];
  for (const entry of Array.isArray(raw.modes) ? raw.modes : []) {
    const id = String(entry?.id ?? "");
    if (!FOUNDRY_DETECTION_MODES.includes(id)) continue;
    if (modes.some(mode => mode.id === id)) continue;
    modes.push({ id, range: normalizeRange(entry?.range), enabled: entry?.enabled !== false });
  }
  if (!modes.length) return null;
  const visionMode = FOUNDRY_VISION_MODES.includes(raw.visionMode) ? raw.visionMode : null;
  const priority = Number.isFinite(Number(raw.priority)) ? Number(raw.priority) : 0;
  const claims = (Array.isArray(raw.claims) ? raw.claims : []).filter(claim => SIGHT_CLAIMS.includes(claim));
  return { modes, visionMode, priority, claims, enableVision: raw.enableVision === true };
}

/** Claims that name a mode the grant does not actually write — the pack row is lying to the card. */
export function claimProblems(grant) {
  if (!grant) return [];
  const ids = new Set(grant.modes.map(mode => mode.id));
  return grant.claims.filter(claim => !ids.has(SIGHT_DOCTRINE[claim].mode));
}

/* -------------------------------------------- is the grant live? */

/** F12: suppressed or destroyed chrome is offline, so its optics grant nothing. */
const chromeOffline = item => !!gwFlags(item).chrome && benefitsOffline(item);

/**
 * Mirrors mods.mjs `isRunning` without the host lookup: a mod grants nothing until it is installed
 * on a host and left switched on.
 */
const modOffline = item => {
  const mod = gwFlags(item).mod;
  if (!mod) return false;
  return !mod.installedOn || mod.active === false;
};

/** Gear spent down to nothing is not in anyone's hands. */
const gearGone = item => Number(item?.system?.quantity) === 0;

/** A grant on this Item is live right now. */
export function isSightGrantLive(item) {
  if (!sightGrantOf(item)) return false;
  return !chromeOffline(item) && !modOffline(item) && !gearGone(item);
}

/** Every live grant on an Actor, in declaration order. */
export function actorSightGrants(actor) {
  const items = actor?.items ?? [];
  const grants = [];
  for (const item of items) {
    if (!isSightGrantLive(item)) continue;
    grants.push(sightGrantOf(item));
  }
  return grants;
}

/* -------------------------------------------- merging */

/**
 * Two pairs of optics stack by taking the *better* of each mode: unlimited beats any number and a
 * longer printed range beats a shorter one. The vision mode with the highest priority wins, so a
 * Full Sensorium is not overruled by a pair of cheap shades.
 * @param {Array} grants   sightGrantOf() results.
 * @returns {{modes: Record<string, {enabled: boolean, range: number|null}>, visionMode: string|null,
 *            enableVision: boolean}}
 */
export function mergeSightGrants(grants = []) {
  const modes = {};
  let visionMode = null;
  let visionPriority = -Infinity;
  let enableVision = false;
  for (const grant of grants) {
    if (!grant) continue;
    if (grant.enableVision) enableVision = true;
    if (grant.visionMode && grant.priority > visionPriority) {
      visionMode = grant.visionMode;
      visionPriority = grant.priority;
    }
    for (const mode of grant.modes) {
      const current = modes[mode.id];
      if (!current) {
        modes[mode.id] = { enabled: mode.enabled, range: mode.range };
        continue;
      }
      current.enabled = current.enabled || mode.enabled;
      if (current.range !== null) current.range = mode.range === null ? null : Math.max(current.range, mode.range);
    }
  }
  // A mode nobody enabled is noise; drop it rather than write enabled:false over the Director's own.
  for (const [id, mode] of Object.entries(modes)) if (!mode.enabled) delete modes[id];
  return { modes, visionMode, enableVision };
}

/** What this module last wrote onto a token, so it can take exactly that back off. */
export function appliedRecord(doc) {
  const raw = gwFlags(doc)[SIGHT_APPLIED_FLAG];
  if (!raw || typeof raw !== "object") return null;
  return {
    modes: (Array.isArray(raw.modes) ? raw.modes : []).filter(id => FOUNDRY_DETECTION_MODES.includes(id)),
    visionMode: FOUNDRY_VISION_MODES.includes(raw.visionMode) ? raw.visionMode : null,
    baseVisionMode: FOUNDRY_VISION_MODES.includes(raw.baseVisionMode) ? raw.baseVisionMode : null,
    enabledVision: raw.enabledVision === true,
  };
}

/* -------------------------------------------- the patch */

const sameMode = (a, b) => !!a && a.enabled === b.enabled && (a.range ?? null) === (b.range ?? null);

/**
 * The nested update that brings one Token (or prototypeToken) in line with the merged grants.
 *
 * @param {object} current                 { sight, detectionModes, flags } as stored on the document.
 * @param {object} merged                  mergeSightGrants() output.
 * @param {object} [options]
 * @param {boolean} [options.keepVision]   True when token-vision already wants Has Vision on for this
 *   actor, so an expiring `enableVision` grant must not switch it back off.
 * @returns {object|null}                  A nested patch, or null when the document is already right.
 */
export function sightUpdate(current, merged, { keepVision = false } = {}) {
  const applied = appliedRecord(current);
  const have = current?.detectionModes ?? {};
  const patch = {};
  const detection = {};

  for (const [id, mode] of Object.entries(merged.modes)) {
    if (sameMode(have[id], mode)) continue;
    detection[id] = { enabled: mode.enabled, range: mode.range };
  }
  // Only ever remove a mode this module put there.
  for (const id of applied?.modes ?? []) {
    if (merged.modes[id]) continue;
    if (!(id in have)) continue;
    detection[`-=${id}`] = null;
  }
  if (Object.keys(detection).length) patch.detectionModes = detection;

  const sight = {};
  const haveVisionMode = current?.sight?.visionMode ?? null;
  if (merged.visionMode) {
    if (haveVisionMode !== merged.visionMode) sight.visionMode = merged.visionMode;
  } else if (applied?.visionMode && haveVisionMode === applied.visionMode) {
    sight.visionMode = applied.baseVisionMode ?? "basic";
  }
  if (merged.enableVision) {
    if (current?.sight?.enabled !== true) sight.enabled = true;
  } else if (applied?.enabledVision && !keepVision && current?.sight?.enabled === true) {
    sight.enabled = false;
  }
  if (Object.keys(sight).length) patch.sight = sight;

  const wants = Object.keys(merged.modes).length || merged.visionMode || merged.enableVision;
  if (wants) {
    const next = {
      modes: Object.keys(merged.modes),
      visionMode: merged.visionMode,
      // Remember the Director's own vision mode the first time we overwrite it, not every time.
      baseVisionMode: merged.visionMode
        ? (applied?.baseVisionMode ?? (haveVisionMode === merged.visionMode ? null : haveVisionMode))
        : null,
      enabledVision: merged.enableVision ? (applied?.enabledVision || current?.sight?.enabled !== true) : false,
    };
    if (JSON.stringify(next) !== JSON.stringify(applied)) {
      patch.flags = { [MODULE_ID]: { [SIGHT_APPLIED_FLAG]: next } };
    }
  } else if (applied) {
    patch.flags = { [MODULE_ID]: { [`-=${SIGHT_APPLIED_FLAG}`]: null } };
  }

  return Object.keys(patch).length ? patch : null;
}

/** Actor-level convenience: the prototypeToken patch for this actor's current items. */
export function actorSightUpdate(actor) {
  const merged = mergeSightGrants(actorSightGrants(actor));
  return sightUpdate(actor?.prototypeToken ?? {}, merged, { keepVision: actorWantsTokenVision(actor) });
}

/** Placed-token patch. `actor` is the Token's actor (may be null). */
export function tokenSightUpdate(token, actor) {
  const subject = actor ?? token?.actor ?? null;
  if (!subject) return null;
  const merged = mergeSightGrants(actorSightGrants(subject));
  return sightUpdate(token ?? {}, merged, { keepVision: actorWantsTokenVision(subject) });
}

/** Wrap a token patch for an Actor update, preserving the `-=` deletion keys. */
export function prototypePatch(patch) {
  if (!patch) return null;
  return { prototypeToken: patch };
}

/* ============================================ Foundry registration */

const isActor = doc => doc instanceof Actor;

/** Walk every scene for tokens driven by this actor — linked and unlinked alike. */
async function applyToPlacedTokens(actor) {
  let count = 0;
  for (const scene of game.scenes ?? []) {
    const updates = [];
    for (const token of scene.tokens) {
      if (token.actor !== actor) continue;
      const patch = tokenSightUpdate(token, actor);
      if (!patch) continue;
      updates.push({ _id: token.id, ...patch });
    }
    if (!updates.length) continue;
    try {
      await scene.updateEmbeddedDocuments("Token", updates);
      count += updates.length;
    } catch (error) {
      console.warn(`${MODULE_ID} | could not write sight detectionModes on scene ${scene.name}`, error);
    }
  }
  return count;
}

/**
 * Recompute one actor's canvas sight from the Items it is carrying right now: prototypeToken first,
 * then every placed token. Safe to call repeatedly — it writes nothing when nothing changed.
 */
export async function refreshActorSight(actor) {
  if (!actor?.isOwner) return false;
  let wrote = false;
  const patch = actorSightUpdate(actor);
  if (patch) {
    try {
      await actor.update(prototypePatch(patch));
      wrote = true;
    } catch (error) {
      console.warn(`${MODULE_ID} | could not write sight detectionModes on ${actor.name}`, error);
    }
  }
  if (await applyToPlacedTokens(actor)) wrote = true;
  return wrote;
}

/** The Actor behind a changed document, when there is one. */
function ownerActor(doc) {
  if (!doc) return null;
  if (isActor(doc.parent)) return doc.parent;
  // An ActiveEffect on an owned Item: Item -> Actor.
  if (doc.parent?.parent && isActor(doc.parent.parent)) return doc.parent.parent;
  return null;
}

export function registerSights() {
  game.settings.register(MODULE_ID, SIGHTS_SETTING, {
    scope: "world",
    config: false,
    type: Boolean,
    default: false,
  });

  // Install / remove / re-flag a granting Item. The acting client owns the write so a GM and the
  // player do not both push the same patch.
  for (const hook of ["createItem", "updateItem", "deleteItem"]) {
    Hooks.on(hook, (item, ...rest) => {
      const userId = rest.at(-1);
      if (userId !== game.user.id) return;
      const actor = item?.parent;
      if (!isActor(actor)) return;
      if (!sightGrantOf(item) && !appliedRecord(actor.prototypeToken)) return;
      refreshActorSight(actor);
    });
  }

  // F12 suppress / destroy and the mod field toggle both land as Item updates, but an Active Effect
  // switched on or off can change a grant too (installed mods ship their AE disabled).
  for (const hook of ["createActiveEffect", "updateActiveEffect", "deleteActiveEffect"]) {
    Hooks.on(hook, (effect, ...rest) => {
      const userId = rest.at(-1);
      if (userId !== game.user.id) return;
      const actor = ownerActor(effect);
      if (!isActor(actor)) return;
      refreshActorSight(actor);
    });
  }

  // A token dropped from an actor copies its prototypeToken, which is already correct. An unlinked
  // token whose actor data was edited afterwards is not, so re-derive on create.
  Hooks.on("preCreateToken", (token, data, options, userId) => {
    if (userId !== game.user.id) return;
    const actor = token.actor ?? game.actors?.get(token.actorId ?? data.actorId) ?? null;
    if (!actor) return;
    const patch = tokenSightUpdate({
      sight: token.sight ?? data.sight,
      detectionModes: token.detectionModes ?? data.detectionModes,
      flags: token.flags ?? data.flags,
    }, actor);
    if (patch) token.updateSource(patch);
  });

  Hooks.once("ready", migrateSights);
}

/** One-time GM pass: existing world actors carrying sight SKUs from before 0.3.119. */
export async function migrateSights() {
  if (!game.user.isGM) return;
  if (game.settings.get(MODULE_ID, SIGHTS_SETTING)) return;

  let actors = 0;
  for (const actor of game.actors) {
    if (!actorSightGrants(actor).length && !appliedRecord(actor.prototypeToken)) continue;
    if (await refreshActorSight(actor)) actors += 1;
  }
  await game.settings.set(MODULE_ID, SIGHTS_SETTING, true);
  if (actors) console.log(`${MODULE_ID} | wired sight detectionModes onto ${actors} actor(s)`);
}
