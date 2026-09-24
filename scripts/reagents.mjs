// 0.3.125 (E) — Medic Reagents: the kit capacity ceiling, the Craft Reagents project, and Improvise!
//
// Michael's lock, in one sentence: **Reagents are a bag, not a battery.** They persist across
// encounters, there is no drip, free signatures stay free, and the bag comes back up in downtime —
// primarily through a Craft / Restock project, plus the printed subclass riders.
//
// Most of that already worked before this file existed, and it is worth being clear about which
// parts, so nobody re-implements them here:
//
//   * **No drip.** `patchPersistentReagents()` in scripts/module.mjs already routes Medics past
//     `HeroModel#startCombat` and `#_onStartTurn`, so combat never resets the pool to Victories and
//     no turn ever adds to it.
//   * **Spending.** Draw Steel's own `AbilityModel#use` debits `fd.resource + Σ fd.spend` through
//     `updateResource`, so every heroic's printed `system.resource` (1/3/5/7/9/11) and every
//     signature's `spend` effect (2+) already come out of the bag, base uses stay free at 0, and a
//     cost-waive rider is just a dialog the player does not fill in.
//   * **Refusing.** `enforceHeroicResourceCost()` already blocks a use the bag cannot pay for, and
//     already special-cases Medics so the block applies *out* of combat too.
//
// What was missing was the other direction. **Nothing capped a gain.** The `[[/gain 2 hr]]` enricher
// on Improvise!, the Reputation feature, a Director typing into the sheet and (now) a finished Craft
// project all land on `system.hero.primary.value` through paths that do not know what a kit capacity
// is, so a Medic could bank 30 Reagents at Echelon 1 — which `15-medic.md` forbids in as many words
// ("you cannot bank more than the cap even by refusing to spend for several fights in a row").
//
// So the cap is enforced at the one place every one of those paths passes through: `preUpdateActor`.
// One clamp, no per-feature plumbing, and it is *only* a clamp — it never raises a pool, so a Medic
// who is somehow over cap (a capacity that dropped, a Director's deliberate override being undone)
// slides down to legal rather than being topped up.
//
// Everything above the "Foundry registration" divider is Foundry-free so
// tools/medic-reagents-03125-smoke.mjs can run it under Node.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Classes.Medic";

/** The class this file is about. Nothing here touches any other hero. */
export const MEDIC_DSID = "medic";

/** `_dsid` of the feature that grants the project, and of the project this file spawns. */
export const CRAFT_REAGENTS_DSID = "craft-reagents";
export const CRAFT_REAGENTS_PROJECT_DSID = "craft-reagents-project";

/** `_dsid` of the Street-Doc triggered ability that hands two Reagents back. */
export const IMPROVISE_DSID = "improvise";

/** Kit capacity by echelon — `15-medic.md`, "Kit capacity by Echelon". Index 0 is Echelon 1. */
export const KIT_CAPACITY_BY_ECHELON = Object.freeze([10, 14, 20, 38]);

/** Advanced Chem-Prep (2nd level) adds this on top of the echelon baseline. */
export const ADVANCED_CHEM_PREP_DSID = "advanced-chem-prep";
export const ADVANCED_CHEM_PREP_BONUS = 2;

/** Improvise!: a free triggered action, once per encounter, only when the bag is this low or lower. */
export const IMPROVISE_THRESHOLD = 3;
export const IMPROVISE_GRANT = 2;

/** Project goal for one full restock. Downtime-sized, not a single respite's worth. */
export const CRAFT_REAGENTS_GOAL = 30;

/**
 * Echelon from hero level, matching Draw Steel's own thresholds (1-3 / 4-6 / 7-9 / 10+).
 *
 * The system exposes this as `actor.system.echelon`, and `capacityOf` below reads that when it can.
 * This exists so the pure half can be exercised without a world, and so a level that arrives as a
 * string or a null does not silently become Echelon 4.
 */
export function echelonForLevel(level) {
  const n = Math.floor(Number(level) || 0);
  if (n >= 10) return 4;
  if (n >= 7) return 3;
  if (n >= 4) return 2;
  return 1;
}

/**
 * How many Reagents this Medic's kit holds.
 * @param {object} opts
 * @param {number} [opts.echelon]            1-4. Takes precedence over `level`.
 * @param {number} [opts.level]              Used when no echelon is given.
 * @param {boolean} [opts.advancedChemPrep]  Whether the 2nd-level feature is on the sheet.
 * @returns {number}
 */
export function reagentCapacity({ echelon = null, level = null, advancedChemPrep = false } = {}) {
  const tier = echelon ? Math.min(4, Math.max(1, Math.floor(Number(echelon) || 1))) : echelonForLevel(level);
  return KIT_CAPACITY_BY_ECHELON[tier - 1] + (advancedChemPrep ? ADVANCED_CHEM_PREP_BONUS : 0);
}

/**
 * What a grant of `grant` Reagents actually lands as.
 *
 * The ceiling is the whole point: a Medic at 9 of 10 who triggers Improvise! gains **1**, not 2, and
 * the card should say so rather than pretending two went in and one evaporated.
 *
 * @returns {{value: number, granted: number, capped: boolean}}
 */
export function planReagentGrant({ current = 0, capacity = 0, grant = 0 } = {}) {
  const cap = Math.max(0, Math.floor(Number(capacity) || 0));
  const now = Math.max(0, Math.floor(Number(current) || 0));
  const want = Math.max(0, Math.floor(Number(grant) || 0));
  const value = Math.min(cap, now + want);
  return { value, granted: value - now, capped: (now + want) > cap };
}

/**
 * The clamp `preUpdateActor` applies.
 *
 * Returns `null` when the write is already legal, so the hook can leave an untouched update alone
 * rather than rewriting every Reagent change into the same number it already was.
 */
export function clampReagents({ value = 0, capacity = 0 } = {}) {
  const cap = Math.max(0, Math.floor(Number(capacity) || 0));
  const next = Math.floor(Number(value) || 0);
  return (next > cap) ? cap : null;
}

/**
 * Improvise! — free triggered, once per encounter, "when your kit has 3 or fewer Reagents remaining,
 * gain 2 Reagents back".
 *
 * The threshold is a *trigger*, so a Medic sitting on 8 is refused rather than quietly given
 * nothing: the printed ability does not fire, and the once-per-encounter allowance is not burnt.
 *
 * @returns {{ok: boolean, reason: string|null, value?: number, granted?: number, capped?: boolean}}
 */
export function planImprovise({ current = 0, capacity = 0, usedThisEncounter = false } = {}) {
  if (usedThisEncounter) return { ok: false, reason: "usedThisEncounter" };
  const now = Math.max(0, Math.floor(Number(current) || 0));
  if (now > IMPROVISE_THRESHOLD) return { ok: false, reason: "notLowEnough" };
  return { ok: true, reason: null, ...planReagentGrant({ current: now, capacity, grant: IMPROVISE_GRANT }) };
}

/**
 * A finished Craft Reagents project refills the bag **to capacity**.
 *
 * `15-medic.md` says restocking is "refilling to full kit capacity" and that it "is never a roll you
 * can fail on its own" — so completion is not a variable yield, it is the bag being full. A Medic
 * who spent nothing and crafts anyway completes a project that grants 0, which is correct and worth
 * saying out loud on the card.
 *
 * @returns {{complete: boolean, value: number, granted: number}}
 */
export function planCraftRestock({ current = 0, capacity = 0, points = 0, goal = CRAFT_REAGENTS_GOAL } = {}) {
  const target = Math.max(1, Math.floor(Number(goal) || CRAFT_REAGENTS_GOAL));
  const done = Math.floor(Number(points) || 0) >= target;
  if (!done) return { complete: false, value: Math.floor(Number(current) || 0), granted: 0 };
  const cap = Math.max(0, Math.floor(Number(capacity) || 0));
  const now = Math.max(0, Math.floor(Number(current) || 0));
  return { complete: true, value: Math.max(now, cap), granted: Math.max(0, cap - now) };
}

/* ============================================ Foundry registration */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const dsidsOf = actor => new Set((actor?.items ?? []).map(i => i.system?._dsid).filter(Boolean));

/** The hero whose whole resource model this file is about. */
export function isMedic(actor) {
  return (actor?.type === "hero") && (actor.system?.class?.system?._dsid === MEDIC_DSID);
}

/** This Medic's kit capacity right now, echelon + Advanced Chem-Prep. */
export function capacityOf(actor) {
  return reagentCapacity({
    echelon: actor?.system?.echelon ?? null,
    level: actor?.system?.level ?? null,
    advancedChemPrep: dsidsOf(actor).has(ADVANCED_CHEM_PREP_DSID),
  });
}

const reagentsOf = actor => Number(foundry.utils.getProperty(actor ?? {}, "system.hero.primary.value")) || 0;

/**
 * E1 — the ceiling, applied to every path at once.
 *
 * `preUpdateActor` is downstream of the `[[/gain]]` enricher, the sheet field, `updateResource`, the
 * Reputation feature and this file's own project completion, so one clamp covers all of them and
 * there is nothing to remember to wire up when the seventh Reagent-granting rider ships.
 */
function patchReagentCap() {
  Hooks.on("preUpdateActor", (actor, changes) => {
    if (!isMedic(actor)) return;
    const next = foundry.utils.getProperty(changes, "system.hero.primary.value");
    if (next === undefined) return;
    const capped = clampReagents({ value: next, capacity: capacityOf(actor) });
    if (capped === null) return;
    foundry.utils.setProperty(changes, "system.hero.primary.value", capped);
    ui.notifications.info(loc("Reagents.Capped", { actor: actor.name, capacity: capped }));
  });
}

/* -------------------------------------------- Craft Reagents project */

const craftProjectId = feature => feature?.getFlag?.(MODULE_ID, "craftProjectId") ?? null;
const sourceFeatureId = project => project?.getFlag?.(MODULE_ID, "fromCraftFeatureId") ?? null;

/**
 * The project Item a Medic with the Craft Reagents feature carries.
 *
 * Built in code rather than shipped as a pack row, the same way scripts/consumable-use.mjs builds a
 * use-ability from a gear SKU: the project's goal and text are the feature's business, and a
 * `project` sitting loose in the classes compendium would be browsable, draggable and confusing in a
 * way a generated one is not.
 */
export function buildCraftProject(feature, { goal = CRAFT_REAGENTS_GOAL } = {}) {
  return {
    name: loc("Items.CraftReagents.ProjectName"),
    type: "project",
    img: feature?.img ?? "icons/consumables/potions/bottle-round-corked-green.webp",
    system: {
      description: { value: loc("Items.CraftReagents.ProjectDescription", { goal }), director: "" },
      source: { book: "Ghostwire", page: "15-medic", license: "Draw Steel Creator License" },
      _dsid: CRAFT_REAGENTS_PROJECT_DSID,
      type: "crafting",
      prerequisites: loc("Items.CraftReagents.Prerequisites"),
      projectSource: loc("Items.CraftReagents.ProjectSource"),
      rollCharacteristic: ["reason", "intuition"],
      goal,
      points: 0,
      yield: { amount: "1", display: loc("Items.CraftReagents.Yield") },
    },
    flags: { [MODULE_ID]: { fromCraftFeatureId: feature?.id ?? null, craftReagents: true } },
  };
}

/** Give a Medic who has the feature the project, once. */
async function armCraftProject(feature) {
  const actor = feature?.parent;
  if (!isMedic(actor) || !actor.isOwner) return null;
  if (feature.system?._dsid !== CRAFT_REAGENTS_DSID) return null;
  const existing = craftProjectId(feature);
  if (existing && actor.items.get(existing)) return null;
  if (actor.items.some(i => sourceFeatureId(i) === feature.id)) return null;
  const [project] = await actor.createEmbeddedDocuments("Item", [buildCraftProject(feature)]);
  if (project) await feature.setFlag(MODULE_ID, "craftProjectId", project.id);
  return project;
}

/** Take it away again when the feature goes. */
async function disarmCraftProject(feature) {
  const actor = feature?.parent;
  if (!(actor instanceof Actor)) return;
  const ids = actor.items.filter(i => sourceFeatureId(i) === feature.id).map(i => i.id);
  if (ids.length) await actor.deleteEmbeddedDocuments("Item", ids);
}

/** Sync one actor's Craft project against their features. */
export async function syncCraftProject(actor) {
  if (!isMedic(actor) || !actor.isOwner) return 0;
  let added = 0;
  for (const feature of actor.items) {
    if (feature.system?._dsid !== CRAFT_REAGENTS_DSID) continue;
    if (await armCraftProject(feature)) added += 1;
  }
  return added;
}

/**
 * E2 — a finished Craft project fills the bag and resets itself.
 *
 * Draw Steel's own `ProjectModel#_onUpdate` fires `options.completeProject` and then only creates a
 * yielded *document*; Reagents are not a document, so the grant lands here instead. Points go back
 * to 0 afterwards, because restocking is something a Medic does every downtime, not once per career.
 */
async function completeCraftProject(project) {
  const actor = project?.actor;
  if (!isMedic(actor) || !actor.isOwner) return;
  const capacity = capacityOf(actor);
  const plan = planCraftRestock({
    current: reagentsOf(actor),
    capacity,
    points: Number(project.system?.points) || 0,
    goal: Number(project.system?.goal) || CRAFT_REAGENTS_GOAL,
  });
  if (!plan.complete) return;
  if (plan.granted) await actor.update({ "system.hero.primary.value": plan.value });
  await project.update({ "system.points": 0 });
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: plan.granted
      ? loc("Reagents.Chat.Restocked", { actor: actor.name, granted: plan.granted, value: plan.value })
      : loc("Reagents.Chat.RestockedFull", { actor: actor.name, value: plan.value }),
  });
}

/* -------------------------------------------- Improvise! */

/** Flag path for the once-per-encounter ledger: `{ [dsid]: combatId }`. */
export const ENCOUNTER_USE_FLAG = "medicEncounterUse";

const encounterUseRecord = (actor, dsid) => actor?.getFlag?.(MODULE_ID, ENCOUNTER_USE_FLAG)?.[dsid] ?? null;

/**
 * E5 — Improvise! actually hands the Reagents back.
 *
 * The ability's printed text carries a `[[/gain 2 hr]]` link, which works but is uncapped and
 * unpoliced: it fires whatever the bag holds and however many times it is clicked. Using the card
 * now does the grant itself, gated on the printed trigger and on once per encounter, and the
 * enricher is left in the text as the Director's manual override.
 *
 * "Once per encounter" keys off the Combat id for the same reason the Trauma Patch's once-per-combat
 * gate does (scripts/consumable-use.mjs): a new fight is a new allowance with nothing to reset. Out
 * of combat there is no encounter, so there is no gate.
 */
async function applyImprovise(actor) {
  if (!isMedic(actor) || !actor.isOwner) return null;
  const combatId = game.combat?.id ?? null;
  const plan = planImprovise({
    current: reagentsOf(actor),
    capacity: capacityOf(actor),
    usedThisEncounter: !!combatId && (encounterUseRecord(actor, IMPROVISE_DSID) === combatId),
  });
  if (!plan.ok) {
    ui.notifications.warn(loc(plan.reason === "usedThisEncounter"
      ? "Reagents.Improvise.UsedThisEncounter"
      : "Reagents.Improvise.NotLowEnough", { actor: actor.name, threshold: IMPROVISE_THRESHOLD }));
    return plan;
  }
  if (plan.granted) await actor.update({ "system.hero.primary.value": plan.value });
  if (combatId) await actor.setFlag(MODULE_ID, `${ENCOUNTER_USE_FLAG}.${IMPROVISE_DSID}`, combatId);
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: loc("Reagents.Chat.Improvised", { actor: actor.name, granted: plan.granted, value: plan.value }),
  });
  return plan;
}

/* -------------------------------------------- registration */

export function registerReagents() {
  patchReagentCap();

  Hooks.once("ready", async () => {
    let added = 0;
    for (const actor of game.actors) {
      if (!actor.isOwner) continue;
      added += await syncCraftProject(actor);
    }
    if (added) console.log(`${MODULE_ID} | Craft Reagents projects created: ${added}`);
  });

  Hooks.on("createItem", (item, options, userId) => {
    if (userId !== game.user.id) return;
    if (item?.system?._dsid === CRAFT_REAGENTS_DSID) armCraftProject(item);
  });

  Hooks.on("deleteItem", (item, options, userId) => {
    if (userId !== game.user.id) return;
    if (item?.system?._dsid === CRAFT_REAGENTS_DSID) disarmCraftProject(item);
  });

  Hooks.on("createActor", (actor, options, userId) => {
    if (userId !== game.user.id) return;
    syncCraftProject(actor);
  });

  // The Draw Steel project sheet writes `system.points`; that is the only signal a project finished.
  Hooks.on("updateItem", (item, changes, options, userId) => {
    if (userId !== game.user.id) return;
    if (item?.type !== "project") return;
    if (!item.getFlag?.(MODULE_ID, "craftReagents")) return;
    if (foundry.utils.getProperty(changes, "system.points") === undefined) return;
    completeCraftProject(item);
  });

  // The fight is over, so Improvise!'s allowance is too — same shape as the consumable ledger.
  Hooks.on("deleteCombat", async (combat, options, userId) => {
    if (userId !== game.user.id) return;
    for (const actor of game.actors) {
      if (!actor.isOwner) continue;
      const ledger = actor.getFlag(MODULE_ID, ENCOUNTER_USE_FLAG);
      if (!ledger || !Object.values(ledger).includes(combat.id)) continue;
      const kept = Object.fromEntries(Object.entries(ledger).filter(([, id]) => id !== combat.id));
      await actor.update({ [`flags.${MODULE_ID}.${ENCOUNTER_USE_FLAG}`]: null });
      if (!foundry.utils.isEmpty(kept)) await actor.setFlag(MODULE_ID, ENCOUNTER_USE_FLAG, kept);
    }
  });

  patchImproviseUse();
  patchAdministerDosePrompt();
  patchNanoAdrenalSpend();

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      reagentCapacity: capacityOf,
      planReagentGrant,
      planImprovise,
      planCraftRestock,
      clampReagents,
      syncCraftProject,
    };
  }
  console.log(`${MODULE_ID} | Medic Reagents registered (kit capacity cap · Craft Reagents project · Improvise! · Administer Dose prompt · Nano-Adrenal spend)`);
}

/** Using the Improvise! card does the grant. */
function patchImproviseUse() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? ds.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; Improvise! grants no Reagents`);
    return;
  }
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    if (this.parent?.system?._dsid !== IMPROVISE_DSID) return use.call(this, config, dialogOptions, messageOptions);
    const actor = this.actor;
    if (!isMedic(actor)) return use.call(this, config, dialogOptions, messageOptions);
    // Refuse before the card posts, so a Medic with a full bag never leaves a "you found something
    // in the trash" card on the log that found nothing.
    const combatId = game.combat?.id ?? null;
    const preview = planImprovise({
      current: reagentsOf(actor),
      capacity: capacityOf(actor),
      usedThisEncounter: !!combatId && (encounterUseRecord(actor, IMPROVISE_DSID) === combatId),
    });
    if (!preview.ok) {
      ui.notifications.warn(loc(preview.reason === "usedThisEncounter"
        ? "Reagents.Improvise.UsedThisEncounter"
        : "Reagents.Improvise.NotLowEnough", { actor: actor.name, threshold: IMPROVISE_THRESHOLD }));
      return null;
    }
    const message = await use.call(this, config, dialogOptions, messageOptions);
    if (!message) return message;
    await applyImprovise(actor);
    return message;
  };
}

/* -------------------------------------------- Administer Dose — Stimulant vs Toxin prompt */

const ADMINISTER_DOSE_DSID = "administer-dose";

function patchAdministerDosePrompt() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? ds.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) return;
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    if (this.parent?.system?._dsid !== ADMINISTER_DOSE_DSID) return use.call(this, config, dialogOptions, messageOptions);
    const actor = this.actor;
    if (!isMedic(actor)) return use.call(this, config, dialogOptions, messageOptions);

    const esc = foundry.utils.escapeHTML;
    const data = await foundry.applications.api.DialogV2.input({
      window: { title: loc("Reagents.AdministerDose.Title"), icon: "fa-solid fa-syringe" },
      content: `<p>${esc(loc("Reagents.AdministerDose.Hint"))}</p>`
        + `<div class="form-group"><label>${loc("Reagents.AdministerDose.Title")}</label>`
        + `<select name="compound">`
        + `<option value="stimulant">${esc(loc("Reagents.AdministerDose.Stimulant"))}</option>`
        + `<option value="toxin">${esc(loc("Reagents.AdministerDose.Toxin"))}</option>`
        + `</select></div>`,
      ok: { label: `${L}.Reagents.AdministerDose.Confirm`, icon: "fa-solid fa-syringe" },
    });
    if (!data?.compound) return null;

    const message = await use.call(this, config, dialogOptions, messageOptions);
    if (message) {
      await message.setFlag?.(MODULE_ID, "administerDoseCompound", data.compound);
    }
    return message;
  };
}

/* -------------------------------------------- Nano-Adrenal Auto-Injector — 30 Reagents or -1 BI */

const NANO_ADRENAL_DSID = "nano-adrenal-auto-injector";

function patchNanoAdrenalSpend() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? ds.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) return;
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    if (this.parent?.system?._dsid !== NANO_ADRENAL_DSID) return use.call(this, config, dialogOptions, messageOptions);
    const actor = this.actor;
    if (!actor) return use.call(this, config, dialogOptions, messageOptions);

    const current = reagentsOf(actor);
    const integrity = actor.getFlag?.(MODULE_ID, "integrity") ?? {};
    const biValue = Number(integrity.value ?? 0);
    const biMax = Number(integrity.max ?? 0);
    const canReagents = current >= 30;
    const canBI = biValue > 0;

    if (!canReagents && !canBI) {
      ui.notifications.warn(loc("Reagents.NanoAdrenal.NotEnough", { actor: actor.name }));
      return null;
    }

    const esc = foundry.utils.escapeHTML;
    const options = [];
    if (canReagents) options.push(`<option value="reagents">${esc(loc("Reagents.NanoAdrenal.Reagents"))} (${current} available)</option>`);
    if (canBI) options.push(`<option value="bi">${esc(loc("Reagents.NanoAdrenal.BI"))} (${biValue}/${biMax})</option>`);

    const data = await foundry.applications.api.DialogV2.input({
      window: { title: loc("Reagents.NanoAdrenal.Title"), icon: "fa-solid fa-heart-pulse" },
      content: `<p>${esc(loc("Reagents.NanoAdrenal.Hint"))}</p>`
        + `<div class="form-group"><label>${loc("Reagents.NanoAdrenal.Title")}</label>`
        + `<select name="payment">${options.join("")}</select></div>`,
      ok: { label: `${L}.Reagents.NanoAdrenal.Confirm`, icon: "fa-solid fa-heart-pulse" },
    });
    if (!data?.payment) return null;

    const message = await use.call(this, config, dialogOptions, messageOptions);
    if (!message) return message;

    if (data.payment === "reagents") {
      const next = Math.max(0, current - 30);
      await actor.update({ "system.hero.primary.value": next });
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: loc("Reagents.Chat.NanoAdrenalReagents", { actor: actor.name, value: next }),
      });
    } else {
      const nextBI = Math.max(0, biValue - 1);
      await actor.update({ [`flags.${MODULE_ID}.integrity.value`]: nextBI });
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: loc("Reagents.Chat.NanoAdrenalBI", { actor: actor.name, value: nextBI, max: biMax }),
      });
    }
    return message;
  };
}
