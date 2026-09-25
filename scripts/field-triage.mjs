// 0.3.134 (H) — Field Triage is a Medic ability, and only a Medic ability.
//
// 0.3.130 wired it in as the universal **Heal** swap (`DEFAULT_ITEM_SWAPS` in scripts/module.mjs), so
// every hero in the game — and all nine pregens — carried a 2-Reagent Medic maneuver that eight of
// them had no Reagents to pay for. 0.3.134 moves it to a Medic class grant and deletes the universal
// Heal outright: **there is no universal First Aid in Ghostwire.** Everyone else stabilises with
// Trauma Patches and medkits (scripts/consumable-use.mjs).
//
// Rebuilding a pack fixes the compendium and nothing already in a world, so this file is the GM-only
// `ready` pass that takes the stray copies off existing non-Medic sheets.
//
// The pure helpers are Foundry-free so tools/wave-03134-smoke.mjs can run them in Node.

const MODULE_ID = "draw-steel-ghostwire";
const SETTING = "fieldTriageMedicOnly";
export const FIELD_TRIAGE_DSID = "field-triage";
export const FIELD_TRIAGE_MIGRATION_VERSION = "0.3.134";

/**
 * Is this actor a Medic?
 *
 * Three layers, most authoritative first, because a world has hand-built heroes in it:
 *  1. the **class** Item's `_dsid` — `medic`. This is what `system.class` resolves to and what every
 *     other file in the module keys Medic behaviour off.
 *  2. any **subclass** Item's `_dsid` in the Medic family (`street-doc`, `combat-medic`, `chop-shop`
 *     and friends all begin `medic-` in the pack, and a subclass without its class is still a Medic).
 *  3. an Item that *is* the Medic class by dsid, for a sheet whose `system.class` pointer is broken.
 *
 * Deliberately **not** "has a Reagents resource": a Director's homebrew could have one.
 *
 * @param {{system?: object, items?: Iterable<object>}} actor  Actor data, live or plain.
 * @returns {boolean}
 */
export function isMedic(actor) {
  if (!actor) return false;
  if (actor.system?.class?.system?._dsid === "medic") return true;
  const items = [...(actor.items ?? [])];
  for (const item of items) {
    const dsid = String(item?.system?._dsid ?? "");
    if ((item?.type === "class") && (dsid === "medic")) return true;
    if ((item?.type === "subclass") && dsid.startsWith("medic")) return true;
  }
  // A sheet whose subclass is one of the Medic specialisations but whose class row is missing.
  for (const subclass of actor.system?.subclasses ?? []) {
    if (String(subclass?.system?._dsid ?? "").startsWith("medic")) return true;
  }
  return false;
}

/**
 * The embedded Field Triage copies that should come off this actor.
 * @param {object} actor
 * @returns {string[]} item ids; empty for a Medic, and empty when there is nothing to remove.
 */
export function strayFieldTriage(actor) {
  if (isMedic(actor)) return [];
  return [...(actor?.items ?? [])]
    .filter(item => item?.system?._dsid === FIELD_TRIAGE_DSID)
    .map(item => item.id ?? item._id)
    .filter(Boolean);
}

/* ============================================ Foundry registration */

/**
 * Take Field Triage off every non-Medic in the world. Idempotent: the setting gate means one pass
 * per upgrade, and `strayFieldTriage` returns nothing on a second run anyway.
 * @param {object} [options]
 * @param {boolean} [options.force]
 * @returns {Promise<number>} actors changed.
 */
export async function migrateFieldTriage({ force = false } = {}) {
  if (!game.user.isGM) return 0;
  if (!force && (game.settings.get(MODULE_ID, SETTING) === FIELD_TRIAGE_MIGRATION_VERSION)) return 0;

  let changed = 0;
  for (const actor of game.actors) {
    if ((actor.type !== "hero") || !actor.isOwner) continue;
    const ids = strayFieldTriage(actor);
    if (!ids.length) continue;
    await actor.deleteEmbeddedDocuments("Item", ids);
    changed += 1;
  }
  await game.settings.set(MODULE_ID, SETTING, FIELD_TRIAGE_MIGRATION_VERSION);
  if (changed) {
    console.log(`${MODULE_ID} | Field Triage ${FIELD_TRIAGE_MIGRATION_VERSION}: removed from ${changed} non-Medic hero(es)`);
  }
  return changed;
}

export function registerFieldTriage() {
  game.settings.register(MODULE_ID, SETTING, {
    scope: "world", config: false, type: String, default: "",
  });
  Hooks.once("ready", async () => {
    try {
      await migrateFieldTriage();
    } catch (error) {
      console.error(`${MODULE_ID} | Field Triage migration failed`, error);
    }
  });
  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = { ...(module.api ?? {}), fieldTriage: { isMedic, strayFieldTriage, migrateFieldTriage } };
  }
}
