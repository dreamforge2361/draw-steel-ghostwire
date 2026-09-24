// 0.3.123 (A1 / A3) — one free signature strike per Street Priest, and the pact picks which one.
//
// Before this pass the class shipped **two** free ranged strikes (Smite / Rebuke as a class signature, plus
// Rebuke again in the optional signature pool) and Drain was a pick anybody could take, Light pact or not.
// Michael's lock collapses all of that to one sentence: **Light Pact gets Rebuke, Dark Pact gets Drain, and
// nobody ever has both.**
//
// Two halves:
//
//  * **Chargen** is the class's own `Pact Strike` itemGrant (sort 9500, chooseN 1). Both rows carry
//    `flags.draw-steel-ghostwire.pact`, so `patchPactFilter()` in scripts/module.mjs — which already gates
//    Roster of the Saved / Ledger of the Damned and friends — leaves only the matching one selectable once
//    Pact Alignment (sort 6000) has been answered. No new dialog code.
//  * **Live heroes** are this file. A priest who already exists, or who switches pact mid-campaign, gets the
//    swap done for them: the wrong strike comes off, the right one is pulled from the classes compendium.
//    Only the two pact strikes are ever touched — a hand-added copy of any other ability is not this
//    module's business.
//
// Helpers above the "Foundry registration" divider are Foundry-free so
// tools/sp-el-foundry-wave-03123-smoke.mjs can run them in Node.

export const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.PactStrike";

/** The two free strikes, by pact. Values are `system._dsid` on the shipped pack rows. */
export const PACT_STRIKES = Object.freeze({ light: "rebuke", dark: "priest-drain" });

/** Every dsid this module owns. Nothing outside this set is ever added or removed. */
export const PACT_STRIKE_DSIDS = Object.freeze(Object.values(PACT_STRIKES));

/**
 * Free strikes 0.3.123 retired. `smite-rebuke` was the class-signature bolt that competed with Rebuke;
 * its pack row is gone, but worlds built before this wave still carry an embedded copy on the sheet, and
 * leaving it there is exactly the "two free ranged strikes" the lock forbids.
 */
export const RETIRED_STRIKE_DSIDS = Object.freeze(["smite-rebuke"]);

/** Compendium ids for the two rows, so a live swap does not have to search by name. */
export const PACT_STRIKE_IDS = Object.freeze({ rebuke: "JXCLBRELJP9ryI3s", "priest-drain": "QugJ5UZHgyW5UM4i" });

/**
 * What a priest of this pact should be holding.
 *
 * @param {object} opts
 * @param {"light"|"dark"|null} opts.pact
 * @param {string[]} opts.held  `_dsid`s already on the sheet.
 * @returns {{grant: string|null, remove: string[]}}
 */
export function planPactStrike({ pact = null, held = [] } = {}) {
  const wanted = PACT_STRIKES[pact] ?? null;
  // No pact chosen yet: leave the sheet exactly as it is. Chargen has not answered the question.
  if (!wanted) return { grant: null, remove: [] };
  const owned = new Set(held);
  const stale = [...PACT_STRIKE_DSIDS, ...RETIRED_STRIKE_DSIDS];
  return {
    grant: owned.has(wanted) ? null : wanted,
    remove: stale.filter(dsid => (dsid !== wanted) && owned.has(dsid)),
  };
}

/* ============================================ Foundry registration */

const isStreetPriest = actor => (actor?.type === "hero") && (actor.system?.class?.system?._dsid === "street-priest");

/** The pact this priest swore, from the Light Pact / Dark Pact feature on the sheet. */
export function pactOf(actor) {
  for (const item of actor?.items ?? []) {
    const alignment = item.getFlag?.(MODULE_ID, "pactAlignment");
    if (alignment) return alignment;
  }
  return null;
}

const OWNED_DSIDS = new Set([...PACT_STRIKE_DSIDS, ...RETIRED_STRIKE_DSIDS]);

const strikesOn = actor => [...(actor?.items ?? [])]
  .filter(item => (item.type === "ability") && OWNED_DSIDS.has(item.system?._dsid));

async function strikeSource(dsid) {
  const id = PACT_STRIKE_IDS[dsid];
  if (!id) return null;
  const item = await fromUuid(`Compendium.${MODULE_ID}.classes.Item.${id}`);
  return item ?? null;
}

/**
 * Bring one priest's free strike in line with their pact. Writes nothing when nothing changed.
 * @returns {Promise<boolean>} whether anything was swapped.
 */
export async function syncPactStrike(actor, { silent = false } = {}) {
  if (!isStreetPriest(actor) || !actor.isOwner) return false;
  const held = strikesOn(actor);
  const plan = planPactStrike({ pact: pactOf(actor), held: held.map(item => item.system._dsid) });
  if (!plan.grant && !plan.remove.length) return false;

  if (plan.remove.length) {
    const ids = held.filter(item => plan.remove.includes(item.system._dsid)).map(item => item.id);
    if (ids.length) await actor.deleteEmbeddedDocuments("Item", ids);
  }
  let granted = null;
  if (plan.grant) {
    const source = await strikeSource(plan.grant);
    if (source) {
      [granted] = await actor.createEmbeddedDocuments("Item", [game.items.fromCompendium(source, { clearFolder: true })]);
    } else {
      console.warn(`${MODULE_ID} | pact strike ${plan.grant} not found in the classes compendium`);
    }
  }
  if (!silent && granted) {
    ui.notifications.info(game.i18n.format(`${L}.Swapped`, { actor: actor.name, name: granted.name }));
  }
  return true;
}

export function registerPactStrike() {
  // Swearing (or re-swearing) a pact swaps the strike. The pact features carry `pactAlignment`.
  Hooks.on("createItem", async (item, options, userId) => {
    if (userId !== game.user.id) return;
    if (!item.getFlag?.(MODULE_ID, "pactAlignment")) return;
    await syncPactStrike(item.parent);
  });

  Hooks.on("deleteItem", async (item, options, userId) => {
    if (userId !== game.user.id) return;
    if (!item.flags?.[MODULE_ID]?.pactAlignment) return;
    await syncPactStrike(item.parent);
  });

  // Worlds built before 0.3.123: a priest carrying the retired Smite / Rebuke, or both free strikes at once,
  // is corrected on load. Priests with no pact yet are left alone.
  Hooks.once("ready", async () => {
    if (!game.user.isGM) return;
    let touched = 0;
    for (const actor of game.actors) {
      if (await syncPactStrike(actor, { silent: true })) touched += 1;
    }
    if (touched) console.log(`${MODULE_ID} | pact free strike synced on ${touched} Street Priest(s)`);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) module.api = { ...(module.api ?? {}), syncPactStrike, pactOf, planPactStrike };
  console.log(`${MODULE_ID} | Street Priest pact strike registered (Light → Rebuke, Dark → Drain)`);
}
