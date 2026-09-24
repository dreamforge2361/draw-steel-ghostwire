// 0.3.127 (E) — let the bestiary cast generators rewrite an Actor without eating its loot.
//
// Four generators own src/packs/bestiary/** actors (Aequitas/Lazarus, the Deadhead cast, the Mama's
// club cast, the magical societies), and each of them rebuilds its actors from scratch on every run.
// tools/bestiary-loot.mjs is a *post*-pass over the same files, so without this the next
// `node tools/gen-magical-societies-cast.mjs` would silently strip Daska Venn's winch line — and
// tools/magical-societies-cast-smoke.mjs, which byte-compares a regen, would go red.
//
// The rule is one line long: **an item flagged `flags.draw-steel-ghostwire.loot` survives a regen.**
// It is the same contract docs/masters/pregens/post-patches.json has with the pregen generator —
// the generator owns identity, a later pass owns what is in the pockets, and neither reaches into
// the other.

import { existsSync, readFileSync } from "node:fs";

const MODULE_ID = "draw-steel-ghostwire";

/** Is this embedded Item something tools/bestiary-loot.mjs put there? */
export const isLootItem = item => item?.flags?.[MODULE_ID]?.loot === true;

/**
 * Carry the loot already on disk at `path` into a freshly generated `doc`.
 *
 * Loot is appended after whatever the generator produced, and an id the generator is now using
 * wins — a collision means the two passes genuinely disagree, and the loot stamp is the one that
 * can be re-run.
 *
 * @param {string} path  Where this actor will be written.
 * @param {object} doc   The freshly generated Actor.
 * @returns {object}     The same shape, with any prior loot re-attached.
 */
export function keepLoot(path, doc) {
  if (!existsSync(path)) return doc;
  let prior;
  try {
    prior = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return doc;                                   // unreadable or not JSON: the generator is the truth
  }
  const loot = (prior.items ?? []).filter(isLootItem);
  if (!loot.length) return doc;
  const taken = new Set((doc.items ?? []).map(item => item._id));
  const kept = loot.filter(item => !taken.has(item._id));
  if (!kept.length) return doc;
  return { ...doc, items: [...(doc.items ?? []), ...kept] };
}
