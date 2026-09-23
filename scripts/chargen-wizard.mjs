// B95 / I2 — Chargen Wizard (0.3.101): the Appendix B punch-list as a clickable applet on the Hero sheet.
// Locks: docs/spikes/B95-CHARGEN-WIZARD.md. Print source: docs/manuscript/04-back/29-chargen-cheat-sheet.md (B93).
//
// Four things shape this file:
//   1. It is a *driver*, not a second chargen engine. Every People / Background / Profession / Class / Kit pick
//      goes through the exact call the Draw Steel hero sheet makes on a drop — `system.advance()` for a class,
//      `system.applyAdvancements()` for anything else carrying advancements, plain Item.create otherwise. The
//      stock advancement dialog runs, the wizard awaits it, and no grant math is re-implemented here. G1
//      `kit-grants.mjs` therefore fires on its own when a Kit lands; the wizard never grants street gear.
//   2. The ¥ firewall is absolute for *stats*: ¥ buys objects and nothing else — never a characteristic, a skill,
//      or class power. G10 (0.3.103) *reopens* Programs + Chrome at chargen: CHARGEN_SPEND_PACKS includes
//      chrome alongside gear/matrix/foci/vehicles; mods stay forbidden. `isChargenSpendable()` still refuses
//      unpriced rows and mods. module.mjs debits Body Integrity when chrome lands — the spend UI surfaces that
//      Integrity hit before buy.
//   3. Player-facing copy carries no Draw Steel / MCDM name-checks (B93 lock). Ancestry→People,
//      Culture→Background, Career→Profession everywhere a player can read it.
//   4. Everything above the app class is Foundry-free, so tools/chargen-wizard-smoke.mjs can drive the step
//      ladder, the characteristic array and the spend firewall in Node with no world.

import { WEALTH_PATH, catalogPrice, formatYen, getWealth, planPurchase } from "./kiosk.mjs";
import { packageDsids } from "./kit-grants.mjs";
// VOIDMARK is reached through `module.api.voidmark` rather than imported: scripts/voidmark.mjs destructures
// `foundry.applications.api` at module scope, and this file has to stay importable in plain Node for the smoke.

export const MODULE_ID = "draw-steel-ghostwire";
/** `flags.draw-steel-ghostwire.chargen` — step, drafts, and the completion stamp. */
export const CHARGEN_FLAG = "chargen";
const APP_ID = "ghostwire-chargen-wizard";
const L = "GHOSTWIRE.Chargen";

/** Appendix B §0 / §6–7: a new runner's liquid ¥. Mirrors module.mjs STARTING_NUYEN. */
export const STARTING_NUYEN = 5000;
/** Appendix B §8: living Peoples start 20/20. Mirrors module.mjs INTEGRITY_START. */
export const INTEGRITY_START = 20;
/** Cyborgs start 25/25 (Michael 2026-09-23 BI25 lock). Mirrors module.mjs CYBORG_INTEGRITY_START. */
export const CYBORG_INTEGRITY_START = 25;

/** Body Integrity start for this runner (Cyborg 25, living 20). */
export const integrityStartFor = (facts = {}) => (facts.isCyborg ? CYBORG_INTEGRITY_START : INTEGRITY_START);

/** Appendix B §6: the one legal starting spread. Order is irrelevant; the multiset is not. */
export const CHARACTERISTIC_ARRAY = Object.freeze([2, 2, 1, 1, 0]);
/** Draw Steel keys, in the order Appendix B prints the Ghostwire labels. */
export const CHARACTERISTIC_KEYS = Object.freeze(["might", "agility", "reason", "intuition", "presence"]);
/** Sheet remap (B93): the label a player reads for each Draw Steel key. */
export const CHARACTERISTIC_LABELS = Object.freeze({
  might: "Physique", agility: "Reflex", reason: "Logic", intuition: "Instinct", presence: "Persona",
});

/** Arcane Severance (Appendix B §1 / §3): a Cyborg can never take these. Mirrors module.mjs VEIL_CASTER_CLASSES. */
export const CYBORG_BLOCKED_CLASSES = Object.freeze(["elementalist", "street-priest", "technomancer"]);

/**
 * The step ladder. Michael's FULL order (2026-09-22): brainstorm and name the runner first, then the
 * Appendix B spine, then the optional ¥ spends, then Done.
 */
export const CHARGEN_STEPS = Object.freeze([
  "bio", "name", "people", "background", "class", "kit",
  "skills", "characteristics", "languages", "resources", "integrity", "spends", "done",
]);

/** Steps a runner may leave in whatever state they like and still be finished. */
export const OPTIONAL_STEPS = Object.freeze(["bio", "spends"]);

/** Steps that are a *read and confirm*, not a pick — they finish on the runner's acknowledgement. */
export const ACK_STEPS = Object.freeze(["bio", "kit", "languages", "resources"]);

/**
 * Packs the ¥5,000 may be spent in (Appendix B §9: deck, focus, extra Street gear, Personal/Light air scout).
 * Mods stay absent from early spends. Chrome is allowed (G10 / BI25); Integrity still debits on install. Installing
 * a mod is a later job. This list is the firewall; `isChargenSpendable()` is the second lock behind it.
 */
export const CHARGEN_SPEND_PACKS = Object.freeze(["gear", "matrix", "foci", "vehicles", "chrome"]);
/** Packs the wizard must never offer at chargen, whatever else changes. Mods stay out (G10). */
export const CHARGEN_FORBIDDEN_PACKS = Object.freeze(["mods"]);
/** Catalog flag families a spendable row may carry. Chrome is allowed at chargen as of G10 / 0.3.103. */
export const CATALOG_KEYS = Object.freeze(["gear", "matrix", "vehicle", "focus", "chrome"]);
/** Availability bands, widest-first, for the spend filter. */
export const AVAILABILITY_BANDS = Object.freeze(["street", "professional", "restricted", "military", "prototype"]);
/**
 * Player-facing early-spend category chips (G8). "wired" is the Ghostwire name for matrix/programs.
 * Vehicles stay as their own chip alongside these.
 */
export const SPEND_CATEGORIES = Object.freeze(["armor", "weapon", "foci", "wired", "food", "medical", "chrome", "vehicles"]);

/** The pick each spine step drives: pack name and Item type. */
export const CHARGEN_PICKS = Object.freeze({
  people: { pack: "origins", type: "ancestry" },
  background: { pack: "backgrounds", type: "culture" },
  profession: { pack: "professions", type: "career" },
  class: { pack: "classes", type: "class" },
  kit: { pack: "kits", type: "kit" },
});

/* -------------------------------------------- pure: the ladder */

export const stepIndex = key => CHARGEN_STEPS.indexOf(String(key));

export function nextStep(key) {
  const i = stepIndex(key);
  if (i < 0) return CHARGEN_STEPS[0];
  return CHARGEN_STEPS[Math.min(CHARGEN_STEPS.length - 1, i + 1)];
}

export function prevStep(key) {
  const i = stepIndex(key);
  if (i <= 0) return CHARGEN_STEPS[0];
  return CHARGEN_STEPS[i - 1];
}

/** Fill in every field a stored record may be missing, and clamp the step onto the ladder. */
export function normalizeChargenState(raw = {}) {
  const step = CHARGEN_STEPS.includes(raw?.step) ? raw.step : CHARGEN_STEPS[0];
  const acked = Array.isArray(raw?.acked) ? raw.acked.filter(key => CHARGEN_STEPS.includes(key)) : [];
  return {
    step,
    // The concept the runner typed on step 1, kept as a draft alongside the sheet biography.
    bio: String(raw?.bio ?? ""),
    acked: [...new Set(acked)],
    // Running total of ¥ the wizard itself debited, so the Done summary can name it.
    spent: Math.max(0, Math.round(Number(raw?.spent)) || 0),
    started: raw?.started ? String(raw.started) : null,
    completed: raw?.completed ? String(raw.completed) : null,
  };
}

/* -------------------------------------------- pure: characteristics */

const sortedDesc = values => [...values].sort((a, b) => b - a);

/** The five assigned numbers, nulls dropped. */
export function assignedValues(characteristics = {}) {
  return CHARACTERISTIC_KEYS
    .map(key => characteristics?.[key])
    .filter(value => Number.isFinite(Number(value)) && (value !== null) && (value !== ""))
    .map(Number);
}

/** The array entries still unspent, given what is already on the sheet. */
export function remainingPool(characteristics = {}) {
  const pool = [...CHARACTERISTIC_ARRAY];
  for (const value of assignedValues(characteristics)) {
    const at = pool.indexOf(value);
    if (at >= 0) pool.splice(at, 1);
  }
  return pool;
}

/** True only when the five characteristics are exactly 2, 2, 1, 1, 0 in some order. */
export function characteristicsAssigned(characteristics = {}) {
  const values = assignedValues(characteristics);
  if (values.length !== CHARACTERISTIC_KEYS.length) return false;
  return sortedDesc(values).join(",") === sortedDesc(CHARACTERISTIC_ARRAY).join(",");
}

/**
 * The numbers one characteristic may legally be set to right now: whatever is left in the pool, plus its own
 * current value, so re-picking the same number is never a dead option.
 */
export function arrayOptionsFor(key, characteristics = {}) {
  const own = Number(characteristics?.[key]);
  const pool = remainingPool(characteristics);
  const options = Number.isFinite(own) ? [...pool, own] : pool;
  return [...new Set(options)].sort((a, b) => b - a);
}

/**
 * Appendix B §6 ("Lean on the class cores"): 2s onto the class's two core characteristics, then 1, 1, 0 down
 * the printed order. Deterministic — the same cores always produce the same spread.
 * @param {string[]} coreKeys   Draw Steel characteristic keys from the class.
 */
export function autoAssignArray(coreKeys = []) {
  const cores = CHARACTERISTIC_KEYS.filter(key => coreKeys.includes(key)).slice(0, 2);
  const rest = CHARACTERISTIC_KEYS.filter(key => !cores.includes(key));
  const pool = [...CHARACTERISTIC_ARRAY];
  const spread = {};
  for (const key of [...cores, ...rest]) spread[key] = pool.shift();
  return spread;
}

/* -------------------------------------------- pure: the ¥ firewall */

/**
 * May the wizard offer this catalog row at chargen?
 *
 * Three refusals, all load-bearing: a pack outside CHARGEN_SPEND_PACKS, anything carrying a chrome flag
 * (module.mjs debits Body Integrity the instant such an Item lands on a hero, and Appendix B §8 says a new
 * runner has *no chrome*), and an unpriced row — the wizard never guesses at ¥.
 *
 * @param {{pack?: string, price?: number|null, chrome?: object|null}} row
 */
export function isChargenSpendable({ pack, price, chrome } = {}) {
  if (CHARGEN_FORBIDDEN_PACKS.includes(String(pack))) return false;
  if (!CHARGEN_SPEND_PACKS.includes(String(pack))) return false;
  // G10: chrome rows are allowed; Integrity debit still happens on Item create in module.mjs.
  void chrome;
  const n = Number(price);
  return Number.isFinite(n) && (n > 0);
}

/** Integrity hit shown in the spend row before buy (G10). */
export function chromeIntegrityCost(row = {}) {
  const chrome = row?.chrome;
  if (!chrome) return 0;
  const n = Number(chrome.integrity ?? chrome.cost ?? 0);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

/**
 * Map a spend catalog row onto a G8 player-facing category.
 * Wired = matrix/programs; chrome is its own chip; food/medical from gear tags / names.
 */
export function spendCategoryOf(row = {}) {
  const pack = String(row.pack ?? "");
  if (pack === "chrome") return "chrome";
  if (pack === "vehicles") return "vehicles";
  if (pack === "foci") return "foci";
  if (pack === "matrix") return "wired";
  const kind = String(row.kind ?? row.gearKind ?? row.armorClass ?? "").toLowerCase();
  const tags = (row.tags ?? []).map(t => String(t).toLowerCase());
  const name = String(row.name ?? "").toLowerCase();
  if (kind === "armor" || kind === "shield" || tags.includes("armor") || row.armorClass) return "armor";
  if (kind === "weapon" || tags.includes("weapon")) return "weapon";
  if (tags.includes("food") || /ration|meal|noodle|caff|stims?\b/.test(name)) return "food";
  if (tags.includes("medical") || tags.includes("medicine") || /medkit|bandage|traum|stimpack|antidote/.test(name)) return "medical";
  return "";
}

/**
 * Skill pick budget from spine Items' skill advancements (G7).
 * Fixed skill advancements count as 1; chooseN counts as N.
 */
export function skillPickBudget(advancements = []) {
  let total = 0;
  for (const adv of advancements) {
    if (!adv || adv.type !== "skill") continue;
    const choose = Number(adv.chooseN);
    if (Number.isFinite(choose) && choose > 0) total += choose;
    else {
      const fixed = adv.skills?.choices?.length ?? 0;
      total += Math.max(1, fixed);
    }
  }
  return total;
}

/** Language pick budget (G7). Prefer explicit language advancements; default floor of 1. */
export function languagePickBudget(advancements = []) {
  let total = 0;
  for (const adv of advancements) {
    if (!adv) continue;
    const type = String(adv.type ?? "");
    if (type !== "language" && type !== "languages") continue;
    const choose = Number(adv.chooseN);
    if (Number.isFinite(choose) && choose > 0) total += choose;
    else total += Math.max(1, adv.languages?.choices?.length ?? adv.choices?.length ?? 1);
  }
  return Math.max(total, 1);
}

/** Wrapper over the kiosk's plan, so the wizard and the shop debit ¥ by the same arithmetic. */
export function planChargenSpend({ wealth, price }) {
  return planPurchase({ wealth, price });
}

/* -------------------------------------------- pure: step state */

const isBlank = text => !String(text ?? "").trim();

/** Names a fresh Actor may still be wearing. A runner wearing one has not been named. */
const PLACEHOLDER_NAMES = Object.freeze(["new actor", "new hero", "unnamed", "hero", "runner"]);

export function isPlaceholderName(name) {
  const value = String(name ?? "").trim().toLowerCase();
  if (!value) return true;
  return PLACEHOLDER_NAMES.includes(value);
}

/**
 * Per-step `{ done, warn, optional }` for one hero.
 *
 * `facts` is the Foundry-free shape `heroFacts()` produces, so the smoke can drive every branch without a
 * world. `warn` is always advisory: the wizard never refuses to move on, because the Director may have called
 * something the punch-list did not anticipate.
 *
 * @param {object} facts
 * @returns {Record<string, {done: boolean, warn: string|null, optional: boolean}>}
 */
export function stepStatus(facts = {}) {
  const spine = spineStatus(facts);
  return { ...spine, done: { done: spineComplete(spine), warn: null, optional: false } };
}

/**
 * The twelve steps before Done. Split out because Done's own state is "every other step is finished", and
 * folding that back into one function would have `stepStatus` call itself forever.
 */
function spineStatus(facts = {}) {
  const state = normalizeChargenState(facts.state);
  const acked = key => state.acked.includes(key);
  const row = (done, warn = null, optional = false) => ({ done: !!done, warn: warn ?? null, optional });

  const cyborg = !!facts.isCyborg;
  const kits = Array.isArray(facts.kits) ? facts.kits : [];
  const kitWantsGear = kits.some(kit => kit?.needsGear);
  const chars = facts.characteristics ?? {};

  return {
    bio: row(!isBlank(facts.bio) || acked("bio"), null, true),
    name: row(!isPlaceholderName(facts.name)),
    people: row(!!facts.peopleDsid,
      ((facts.peopleDsid === "changer") && !facts.changerLineage) ? "ChangerLineage" : null),
    background: row(!!facts.backgroundDsid && !!facts.professionDsid),
    class: row(!!facts.classDsid,
      (cyborg && CYBORG_BLOCKED_CLASSES.includes(String(facts.classDsid))) ? "ArcaneSeverance" : null),
    kit: row((kits.length > 0) || acked("kit"),
      (kitWantsGear && !Number(facts.streetGearCount)) ? "KitNeedsGear" : null),
    skills: row(Array.isArray(facts.skills) && (facts.skills.length > 0)),
    characteristics: row(characteristicsAssigned(chars)),
    languages: row((Array.isArray(facts.languages) && (facts.languages.length > 0)) || acked("languages")),
    resources: row(acked("resources"), facts.classDsid ? null : "ResourcesNeedClass"),
    integrity: row(integrityClean(facts), integrityWarning(facts)),
    spends: row(true, null, true),
  };
}

/** Every non-optional step in a computed spine is done. */
const spineComplete = spine => CHARGEN_STEPS
  .filter(key => (key !== "done") && !OPTIONAL_STEPS.includes(key))
  .every(key => spine[key]?.done);

/** Appendix B §8: Integrity at People start (living 20 / Cyborg 25), Taint 0. */
export function integrityClean(facts = {}) {
  // G10: chrome is allowed at chargen; the Integrity step still expects People-start value/max
  // (module.mjs debits on chrome create — a chromed sheet below start fails this honest check).
  if (Number(facts.taint) !== 0) return false;
  const start = integrityStartFor(facts);
  const integrity = facts.integrity ?? {};
  return (Number(integrity.value) === start) && (Number(integrity.max) === start);
}

/** The lang suffix under `GHOSTWIRE.Chargen.Warnings` for whatever is off, or null when the firewall holds. */
export function integrityWarning(facts = {}) {
  // G10: chrome at chargen is allowed. Still warn when Integrity is off this People's start,
  // or when taint is already on the sheet, so the Integrity step stays honest.
  if (Number(facts.taint) !== 0) return "TaintNotZero";
  const start = integrityStartFor(facts);
  const integrity = facts.integrity ?? {};
  if ((Number(integrity.value) !== start) || (Number(integrity.max) !== start)) return "IntegrityOff";
  if (Number(facts.chromeCount) > 0 && Number(integrity.value) < start) return "IntegrityOff";
  return null;
}

/**
 * The Appendix B "Done when…" box, one row per printed bullet. Portrait / token is listed and never required.
 * @returns {{key: string, done: boolean, optional: boolean, spent?: number}[]}
 */
export function doneChecklist(facts = {}) {
  const status = stepStatus(facts);
  const state = normalizeChargenState(facts.state);
  const kits = Array.isArray(facts.kits) ? facts.kits : [];
  const kitGearOk = !kits.some(kit => kit?.needsGear) || (Number(facts.streetGearCount) > 0);
  return [
    { key: "Items", done: status.people.done && status.background.done && status.class.done, optional: false },
    { key: "Kit", done: status.kit.done && kitGearOk, optional: false },
    { key: "Skills", done: status.skills.done, optional: false },
    { key: "Characteristics", done: status.characteristics.done, optional: false },
    { key: "Resources", done: status.resources.done && status.languages.done, optional: false },
    { key: "Firewall", done: status.integrity.done, optional: false },
    { key: "Spends", done: true, optional: true, spent: state.spent },
    { key: "Portrait", done: !!facts.hasPortrait, optional: true },
  ];
}

/** Every non-optional step is done. */
export function chargenComplete(facts = {}) {
  return spineComplete(spineStatus(facts));
}

/**
 * May this hero's chargen still be *run*, or is the wizard a read-only record?
 *
 * Safer default (Michael's lock): a hero past 1st level, or one already stamped complete, opens review-only —
 * for Directors too. Re-running the picks would drive the advancement dialogs a second time and double-grant.
 *
 * @returns {{writable: boolean, reason: string|null}}
 */
export function rerunGate(facts = {}) {
  const state = normalizeChargenState(facts.state);
  if (state.completed) return { writable: false, reason: "Completed" };
  if (Number(facts.level) > 1) return { writable: false, reason: "PastFirstLevel" };
  return { writable: true, reason: null };
}

/** The VOIDMARK seed for step 1 — a chargen question shaped by whatever the runner has typed and picked. */
export function voidmarkSeed(facts = {}) {
  const lines = [];
  const concept = String(facts.bio ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (concept) lines.push(`Concept: ${concept.slice(0, 600)}`);
  const picks = [];
  if (facts.peopleName) picks.push(`People ${facts.peopleName}`);
  if (facts.backgroundName) picks.push(`Background ${facts.backgroundName}`);
  if (facts.professionName) picks.push(`Profession ${facts.professionName}`);
  if (facts.className) picks.push(`Class ${facts.className}`);
  if (picks.length) lines.push(`Already picked: ${picks.join(", ")}.`);
  lines.push(concept
    ? "Give me Reach colour for this runner, then three build directions — People, Class and Kit vibes — that fit the concept, and name the district they came out of."
    : "I am building a new Reach runner from scratch. Pitch me three concepts with People, Class and Kit vibes, and the district each one came out of.");
  return lines.join("\n");
}

/* -------------------------------------------- Foundry: reading the sheet */

const loc = (key, data) => (data
  ? game.i18n.format(`${L}.${key}`, data)
  : game.i18n.localize(`${L}.${key}`));
const esc = text => foundry.utils.escapeHTML(String(text ?? ""));
const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? doc?.getFlag?.(MODULE_ID) ?? {};
const dsidOf = doc => doc?.system?._dsid ?? doc?.dsid ?? null;

export const isHeroActor = actor => actor?.type === "hero";

/** The VOIDMARK surface registered by scripts/voidmark.mjs at ready, or null when it never came up. */
const voidmarkApi = () => game.modules.get(MODULE_ID)?.api?.voidmark ?? null;

/** Owner of the hero, or any GM — Directors build runners for the table too. */
export const canOpenChargen = (actor, user = game.user) =>
  isHeroActor(actor) && (!!user?.isGM || !!actor?.isOwner);

const chargenStateOf = actor => normalizeChargenState(actor?.getFlag?.(MODULE_ID, CHARGEN_FLAG) ?? {});

const writeChargenState = (actor, patch) =>
  actor.setFlag(MODULE_ID, CHARGEN_FLAG, { ...chargenStateOf(actor), ...patch });

/** Street-band weapon / armor already on the sheet — what makes a Kit live (Appendix B §4). */
function streetGearCount(actor) {
  return [...(actor?.items ?? [])].filter(item => {
    const gear = item?.flags?.[MODULE_ID]?.gear;
    if (!gear) return false;
    if (String(gear.availability ?? "").toLowerCase() !== "street") return false;
    return ["weapon", "armor"].includes(String(item.system?.kind ?? ""));
  }).length;
}

/**
 * One hero, flattened into the Foundry-free shape every pure helper above takes.
 * @param {Actor} actor
 */
export function heroFacts(actor) {
  if (!isHeroActor(actor)) return { state: normalizeChargenState({}) };
  const system = actor.system ?? {};
  const people = system.ancestry ?? null;
  const background = system.culture ?? null;
  const profession = system.career ?? null;
  const cls = system.class ?? null;
  const subclass = actor.itemTypes?.subclass?.at?.(0) ?? null;
  const integrity = actor.getFlag(MODULE_ID, "integrity") ?? {};
  const peopleDsid = dsidOf(people);

  return {
    name: actor.name,
    bio: system.biography?.value ?? "",
    level: Number(system.level ?? 0),
    hasPortrait: !!actor.img && !/mystery-man|\.svg$/i.test(String(actor.img)),

    peopleDsid,
    peopleName: people?.name ?? null,
    isCyborg: peopleDsid === "cyborg",
    changerLineage: [...(actor.items ?? [])].some(item => item.getFlag?.(MODULE_ID, "changerLineage")),

    backgroundDsid: dsidOf(background),
    backgroundName: background?.name ?? null,
    professionDsid: dsidOf(profession),
    professionName: profession?.name ?? null,

    classDsid: dsidOf(cls),
    className: cls?.name ?? null,
    subclassName: subclass?.name ?? null,
    coreCharacteristics: [...(cls?.system?.characteristics?.core ?? [])],

    kits: (system.kits ?? []).map(kit => ({
      id: kit.id,
      uuid: kit.uuid,
      dsid: dsidOf(kit),
      name: kit.name,
      // An unmapped Kit is treated as needing nothing rather than guessed at — the G1 rule.
      needsGear: (packageDsids(dsidOf(kit)) ?? []).length > 0,
    })),
    streetGearCount: streetGearCount(actor),

    skills: [...(system.skills?.value ?? [])],
    characteristics: Object.fromEntries(CHARACTERISTIC_KEYS.map(key =>
      [key, system.characteristics?.[key]?.value ?? null])),
    languages: [...(system.biography?.languages ?? [])],

    wealth: getWealth(actor),
    integrity: { value: integrity.value ?? null, max: integrity.max ?? null },
    taint: Number(actor.getFlag(MODULE_ID, "taint") ?? 0),
    chromeCount: [...(actor.items ?? [])].filter(item => !!item?.flags?.[MODULE_ID]?.chrome).length,

    resource: {
      primary: cls?.system?.primary ?? null,
      stamina: system.stamina?.max ?? null,
      recoveries: system.recoveries?.max ?? null,
      speed: system.movement?.value ?? null,
      stability: system.combat?.stability ?? null,
    },

    state: chargenStateOf(actor),
  };
}

/* -------------------------------------------- Foundry: driving the picks */

/**
 * Put one compendium Item onto the hero the way the Draw Steel hero sheet does on a drop, so the stock
 * advancement dialog runs and every grant is the system's own. Awaits the dialog; resolves null when the
 * runner cancelled it or the pick was refused.
 *
 * @param {Actor} actor
 * @param {Item} source   A compendium Item document.
 */
export async function applyChargenItem(actor, source) {
  if (!isHeroActor(actor) || !actor.isOwner || !source) return null;

  if (source.type === "class") {
    const existing = actor.system.class;
    // Chargen never levels a hero, so a class already on the sheet is a replacement the wizard refuses to
    // guess at — the player deletes it on the sheet first, exactly as the stock drop would demand.
    if (existing) {
      const key = (dsidOf(existing) === dsidOf(source)) ? "ClassAlready" : "ClassReplace";
      ui.notifications.warn(loc(`Errors.${key}`, { existing: existing.name, name: source.name }));
      return null;
    }
    return actor.system.advance({ levels: 1, item: source });
  }

  if (source.supportsAdvancements) {
    if (["ancestry", "career", "culture"].includes(source.type)) {
      const existing = actor.system[source.type];
      if (existing) {
        const confirmed = await existing.advancementDeletionPrompt({ replacement: true });
        if (!confirmed) return null;
      }
    }
    return source.system.applyAdvancements({ actor, levels: { end: actor.system.level } });
  }

  const keepId = !actor.items.has(source.id);
  const itemData = game.items.fromCompendium(source, { keepId, clearFolder: true });
  return getDocumentClass("Item").create(itemData, { parent: actor, keepId });
}

/** Pack index rows for one spine pick, sorted by name. */
async function pickChoices({ pack, type }) {
  const compendium = game.packs.get(`${MODULE_ID}.${pack}`);
  if (!compendium) return [];
  const index = await compendium.getIndex({ fields: ["system._dsid", "type", "img"] });
  return index
    .filter(entry => entry.type === type)
    .map(entry => ({
      uuid: entry.uuid ?? `Compendium.${MODULE_ID}.${pack}.Item.${entry._id}`,
      name: entry.name,
      img: entry.img,
      dsid: foundry.utils.getProperty(entry, "system._dsid") ?? null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, game.i18n.lang));
}

/** The chargen spend catalog: allowed packs (incl. chrome/Programs per G10), priced, cheapest first. */
async function spendCatalog() {
  const rows = [];
  for (const pack of CHARGEN_SPEND_PACKS) {
    const compendium = game.packs.get(`${MODULE_ID}.${pack}`);
    if (!compendium) continue;
    const index = await compendium.getIndex({
      fields: ["type", "img", "system._dsid", "system.kind", "system.category", `flags.${MODULE_ID}`],
    });
    for (const entry of index) {
      const flags = foundry.utils.getProperty(entry, `flags.${MODULE_ID}`) ?? {};
      const price = catalogPrice({ flags: { [MODULE_ID]: flags } });
      if (!isChargenSpendable({ pack, price, chrome: flags.chrome })) continue;
      const catalog = CATALOG_KEYS.map(key => flags[key]).find(Boolean) ?? {};
      const row = {
        uuid: entry.uuid ?? `Compendium.${MODULE_ID}.${pack}.Item.${entry._id}`,
        name: entry.name,
        img: entry.img,
        pack,
        price,
        availability: String(catalog.availability ?? flags.chrome?.availability ?? "").toLowerCase(),
        echelon: Number(catalog.echelon) || null,
        kind: foundry.utils.getProperty(entry, "system.kind")
          ?? foundry.utils.getProperty(entry, "system.category")
          ?? catalog.armorClass
          ?? "",
        armorClass: catalog.armorClass ?? null,
        tags: Array.isArray(catalog.tags) ? catalog.tags : [],
        chrome: flags.chrome ?? null,
      };
      row.category = spendCategoryOf(row);
      rows.push(row);
    }
  }
  return rows.sort((a, b) => (a.price - b.price) || a.name.localeCompare(b.name, game.i18n.lang));
}

/* -------------------------------------------- Foundry: writes */

/** Appendix B §0: a runner starts on ¥5,000 unless the field already carries a number. */
export async function ensureStartingWealth(actor) {
  if (!isHeroActor(actor) || !actor.isOwner) return false;
  const current = foundry.utils.getProperty(actor, WEALTH_PATH);
  if (Number.isFinite(Number(current)) && (current !== null)) return false;
  await actor.update({ [WEALTH_PATH]: STARTING_NUYEN });
  return true;
}

/** Spend ¥ on one catalog row. The same wealth path the kiosk uses; nothing else is touched. */
export async function buyChargenItem(actor, uuid, price) {
  if (!isHeroActor(actor) || !actor.isOwner) return { ok: false, reason: "no-permission" };
  const source = await fromUuid(uuid);
  if (!source) return { ok: false, reason: "no-item" };
  // G10: chrome is purchasable; module.mjs still debits Body Integrity on create.
  // Surface the Integrity cost so the runner sees the hit before the Item lands.
  const chrome = source.flags?.[MODULE_ID]?.chrome;
  if (chrome) {
    const cost = Number(chrome.integrity ?? 0) || 0;
    if (cost > 0) {
      const proceed = await foundry.applications.api.DialogV2.confirm({
        window: { title: loc("Spends.IntegrityConfirmTitle") },
        content: `<p>${esc(loc("Spends.IntegrityConfirm", { name: source.name, cost }))}</p>`,
      });
      if (!proceed) return { ok: false, reason: "integrity-cancel" };
    }
  }
  if (source.flags?.[MODULE_ID]?.mod || String(source.pack ?? "").endsWith(".mods")) {
    ui.notifications.warn(loc("Errors.NoMods", { name: source.name }));
    return { ok: false, reason: "mods" };
  }
  const wealth = getWealth(actor);
  const plan = planChargenSpend({ wealth, price: price ?? catalogPrice(source) ?? 0 });
  if (!plan.ok) {
    ui.notifications.warn(loc("Errors.Insufficient", {
      name: source.name, price: formatYen(plan.price), wealth: formatYen(plan.wealth),
    }));
    return { ok: false, reason: plan.reason };
  }
  const itemData = game.items.fromCompendium(source, { clearFolder: true });
  await getDocumentClass("Item").create(itemData, { parent: actor });
  await actor.update({ [WEALTH_PATH]: plan.wealthAfter });
  await writeChargenState(actor, { spent: chargenStateOf(actor).spent + plan.price });
  ui.notifications.info(loc("Spends.Bought", { name: source.name, price: formatYen(plan.price) }));
  return { ok: true, reason: null, price: plan.price, wealthAfter: plan.wealthAfter };
}

/* -------------------------------------------- app */

let ChargenWizardApp = null;

function defineChargenWizardApp() {
  const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

  return class GhostwireChargenWizard extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
      id: APP_ID,
      classes: ["ghostwire-chargen"],
      window: { title: `${L}.Title`, icon: "fa-solid fa-id-card-clip", resizable: true },
      position: { width: 760, height: 800 },
      actions: {
        goStep: GhostwireChargenWizard.#onGoStep,
        advance: GhostwireChargenWizard.#onAdvance,
        retreat: GhostwireChargenWizard.#onRetreat,
        askVoidmark: GhostwireChargenWizard.#onAskVoidmark,
        saveBio: GhostwireChargenWizard.#onSaveBio,
        saveName: GhostwireChargenWizard.#onSaveName,
        pick: GhostwireChargenWizard.#onPick,
        openDoc: GhostwireChargenWizard.#onOpenDoc,
        autoAssign: GhostwireChargenWizard.#onAutoAssign,
        clearArray: GhostwireChargenWizard.#onClearArray,
        addSkill: GhostwireChargenWizard.#onAddSkill,
        removeSkill: GhostwireChargenWizard.#onRemoveSkill,
        addLanguage: GhostwireChargenWizard.#onAddLanguage,
        removeLanguage: GhostwireChargenWizard.#onRemoveLanguage,
        ack: GhostwireChargenWizard.#onAck,
        buy: GhostwireChargenWizard.#onBuy,
        refresh: GhostwireChargenWizard.#onRefresh,
        openSheet: GhostwireChargenWizard.#onOpenSheet,
        finish: GhostwireChargenWizard.#onFinish,
        startOver: GhostwireChargenWizard.#onStartOver,
      },
    };

    static PARTS = {
      wizard: {
        template: `modules/${MODULE_ID}/templates/chargen-wizard.hbs`,
        scrollable: [".gw-cg-body", ".gw-cg-picks", ".gw-cg-catalog"],
      },
    };

    /** The hero this wizard is pointed at. */
    actorUuid = null;
    /** The step on screen. Mirrored onto the Actor flag so a refresh lands back here. */
    step = CHARGEN_STEPS[0];
    /** Unsaved concept text from step 1. */
    #bioDraft = null;
    /** Unsaved name text from step 2. */
    #nameDraft = null;
    /** Spend-step filters. */
    #spend = { search: "", pack: "", band: "street", category: "" };

    get actor() {
      return this.actorUuid ? fromUuidSync(this.actorUuid) : null;
    }

    /** @override */
    get title() {
      const actor = this.actor;
      return actor ? loc("TitleFor", { name: actor.name }) : loc("Title");
    }

    select(actor) {
      if (this.actorUuid !== (actor?.uuid ?? null)) {
        this.#bioDraft = null;
        this.#nameDraft = null;
      }
      this.actorUuid = actor?.uuid ?? null;
      this.step = chargenStateOf(actor).step;
      return this;
    }

    /** @override */
    async _prepareContext() {
      const actor = this.actor;
      if (!isHeroActor(actor)) return { missing: true, missingHint: loc("Errors.NoHero") };

      const facts = heroFacts(actor);
      if (this.#bioDraft !== null) facts.bio = this.#bioDraft;
      const status = stepStatus(facts);
      const gate = rerunGate(facts);
      const writable = gate.writable && actor.isOwner;
      const warnKey = status[this.step]?.warn ?? null;

      const context = {
        actorName: actor.name,
        actorImg: actor.img,
        isGM: game.user.isGM,
        writable,
        readOnly: !writable,
        readOnlyHint: gate.reason
          ? loc(`ReadOnly.${gate.reason}`, { name: actor.name })
          : loc("ReadOnly.NotOwner", { name: actor.name }),
        wealthLabel: formatYen(facts.wealth),
        taint: facts.taint,
        step: this.step,
        stepNumber: stepIndex(this.step) + 1,
        stepCount: CHARGEN_STEPS.length,
        stepLabel: loc(`Steps.${this.step}.Name`),
        stepHint: loc(`Steps.${this.step}.Hint`),
        atStart: this.step === CHARGEN_STEPS[0],
        atEnd: this.step === CHARGEN_STEPS[CHARGEN_STEPS.length - 1],
        rail: CHARGEN_STEPS.map((key, index) => ({
          key,
          number: index + 1,
          label: loc(`Steps.${key}.Name`),
          done: status[key]?.done,
          optional: status[key]?.optional,
          current: key === this.step,
        })),
        warn: warnKey ? loc(`Warnings.${warnKey}`, { name: actor.name }) : null,
        stepDone: status[this.step]?.done,
        complete: chargenComplete(facts),
        // Each step's markup is guarded by `is.<step>` rather than a chain of {{#if (eq …)}}.
        is: Object.fromEntries(CHARGEN_STEPS.map(key => [key, key === this.step])),
      };

      await this.#stepContext(context, actor, facts);
      return context;
    }

    /** Whatever the active step needs, and nothing the other twelve would pay for. */
    async #stepContext(context, actor, facts) {
      const acked = key => facts.state.acked.includes(key);
      const writable = !context.readOnly;
      /** One picker: an optional heading, what is already on the sheet, and the pack's rows. */
      const section = async (pick, { head = null, currentDsid = null, currentUuid = null, currentName = null, blocked = () => false } = {}) => ({
        head: head ? loc(head) : null,
        current: currentName,
        currentUuid,
        choices: (await pickChoices(pick)).map(row => {
          const isBlocked = blocked(row);
          return {
            ...row,
            selected: !!currentDsid && (row.dsid === currentDsid),
            blocked: isBlocked,
            disabled: !writable || isBlocked,
          };
        }),
      });

      switch (this.step) {
        case "bio":
          context.bio = facts.bio;
          context.voidmarkReady = !!voidmarkApi()?.canOpenVoidmark?.();
          context.voidmarkHint = context.voidmarkReady ? loc("Bio.VoidmarkHint") : loc("Bio.VoidmarkOffline");
          context.acked = acked("bio");
          break;

        case "name":
          context.nameDraft = this.#nameDraft ?? actor.name;
          context.namePlaceholder = isPlaceholderName(actor.name);
          break;

        case "people":
          context.sections = [await section(CHARGEN_PICKS.people, {
            currentDsid: facts.peopleDsid,
            currentName: facts.peopleName,
            currentUuid: actor.system.ancestry?.uuid ?? null,
          })];
          context.blockedClasses = CYBORG_BLOCKED_CLASSES.map(dsid => loc(`Classes.${dsid}`)).join(" · ");
          context.isCyborg = facts.isCyborg;
          context.isChanger = facts.peopleDsid === "changer";
          break;

        case "background":
          context.sections = [
            await section(CHARGEN_PICKS.background, {
              head: "Background.BackgroundHead",
              currentDsid: facts.backgroundDsid,
              currentName: facts.backgroundName,
              currentUuid: actor.system.culture?.uuid ?? null,
            }),
            await section(CHARGEN_PICKS.profession, {
              head: "Background.ProfessionHead",
              currentDsid: facts.professionDsid,
              currentName: facts.professionName,
              currentUuid: actor.system.career?.uuid ?? null,
            }),
          ];
          break;

        case "class":
          context.sections = [await section(CHARGEN_PICKS.class, {
            currentDsid: facts.classDsid,
            currentName: facts.className,
            currentUuid: actor.system.class?.uuid ?? null,
            // Arcane Severance, surfaced before the drop rather than as a refusal after it.
            blocked: row => (facts.isCyborg && CYBORG_BLOCKED_CLASSES.includes(row.dsid)) || !!facts.classDsid,
          })];
          context.subclassName = facts.subclassName;
          context.hasClass = !!facts.classDsid;
          context.isCyborg = facts.isCyborg;
          break;

        case "kit":
          context.sections = [await section(CHARGEN_PICKS.kit)];
          context.kits = facts.kits;
          context.streetGearCount = facts.streetGearCount;
          context.acked = acked("kit");
          break;

        case "skills": {
          const budget = spineSkillBudget(actor);
          const count = facts.skills.length;
          const atCap = Number.isFinite(budget) && budget > 0 && count >= budget && !game.user.isGM;
          context.groups = skillGroupContext(facts.skills, !context.readOnly);
          context.addOptions = atCap ? [] : addableSkills(facts.skills);
          context.count = count;
          context.budget = budget;
          context.atCap = atCap;
          context.budgetLabel = loc("Skills.Budget", { count, budget: budget || "—" });
          break;
        }

        case "characteristics": {
          const chars = facts.characteristics;
          context.rows = CHARACTERISTIC_KEYS.map(key => ({
            key,
            label: loc(`Characteristics.${CHARACTERISTIC_LABELS[key]}`),
            core: facts.coreCharacteristics.includes(key),
            options: arrayOptionsFor(key, chars).map(value => ({ value, selected: Number(chars[key]) === value })),
          }));
          context.arrayLabel = CHARACTERISTIC_ARRAY.join(", ");
          context.remaining = remainingPool(chars).join(", ") || loc("Characteristics.PoolEmpty");
          context.canAuto = facts.coreCharacteristics.length > 0;
          context.coreLabel = facts.coreCharacteristics
            .map(key => loc(`Characteristics.${CHARACTERISTIC_LABELS[key]}`)).join(" / ");
          break;
        }

        case "languages": {
          const budget = spineLanguageBudget(actor);
          const count = facts.languages.length;
          const atCap = Number.isFinite(budget) && budget > 0 && count >= budget && !game.user.isGM;
          context.known = facts.languages
            .map(key => ({ key, label: languageLabel(key), disabled: context.readOnly }))
            .sort((a, b) => a.label.localeCompare(b.label, game.i18n.lang));
          context.addOptions = atCap ? [] : addableLanguages(facts.languages);
          context.acked = acked("languages");
          context.budget = budget;
          context.atCap = atCap;
          context.budgetLabel = loc("Languages.Budget", { count, budget: budget || "—" });
          break;
        }

        case "resources":
          context.resource = {
            primary: facts.resource.primary || loc("Resources.NoResource"),
            stamina: facts.resource.stamina ?? "—",
            recoveries: facts.resource.recoveries ?? "—",
            speed: facts.resource.speed ?? "—",
            stability: facts.resource.stability ?? "—",
          };
          context.hasClass = !!facts.classDsid;
          context.kitNames = facts.kits.map(kit => kit.name).join(", ");
          context.acked = acked("resources");
          break;

        case "integrity":
          context.isCyborg = facts.isCyborg;
          context.integrity = facts.integrity;
          context.integrityTarget = integrityStartFor(facts);
          context.chromeCount = facts.chromeCount;
          context.taint = facts.taint;
          break;

        case "spends": {
          const catalog = await spendCatalog();
          context.spend = this.#spend;
          context.packOptions = CHARGEN_SPEND_PACKS.map(pack => ({
            value: pack, label: loc(`Spends.Packs.${pack}`), selected: this.#spend.pack === pack,
          }));
          context.bandOptions = AVAILABILITY_BANDS.map(band => ({
            value: band, label: loc(`Spends.Bands.${band}`), selected: this.#spend.band === band,
          }));
          context.categoryOptions = SPEND_CATEGORIES.map(category => ({
            value: category, label: loc(`Spends.Categories.${category}`), selected: this.#spend.category === category,
          }));
          const rows = filterSpendRows(catalog, this.#spend, facts.wealth);
          context.rows = rows.slice(0, 150);
          context.rowCount = rows.length;
          context.truncated = rows.length > context.rows.length;
          context.spentLabel = formatYen(facts.state.spent);
          break;
        }

        case "done":
          context.checklist = doneChecklist(facts).map(row => ({
            ...row,
            label: loc(`Done.${row.key}`, {
              spent: formatYen(row.spent ?? 0),
              wealth: formatYen(facts.wealth),
            }),
          }));
          context.summary = {
            people: facts.peopleName ?? "—",
            background: facts.backgroundName ?? "—",
            profession: facts.professionName ?? "—",
            className: facts.subclassName
              ? `${facts.className ?? "—"} (${facts.subclassName})`
              : (facts.className ?? "—"),
            kits: facts.kits.map(kit => kit.name).join(", ") || loc("Done.NoKit"),
            skills: facts.skills.length,
            languages: facts.languages.length,
            array: CHARACTERISTIC_KEYS
              .map(key => `${loc(`Characteristics.${CHARACTERISTIC_LABELS[key]}`)} ${facts.characteristics[key] ?? "—"}`)
              .join(" · "),
            integrity: `${facts.integrity.value ?? "—"}/${facts.integrity.max ?? "—"}`,
            taint: facts.taint,
            chrome: facts.chromeCount,
            wealth: formatYen(facts.wealth),
          };
          context.alreadyComplete = !!facts.state.completed;
          break;
      }
    }

    /** @override */
    _onRender(context, options) {
      super._onRender(context, options);
      const root = this.element;

      const bio = root.querySelector("[data-bio]");
      if (bio) bio.addEventListener("input", event => { this.#bioDraft = event.currentTarget.value; });

      const name = root.querySelector("[data-name]");
      if (name) {
        name.addEventListener("input", event => { this.#nameDraft = event.currentTarget.value; });
        name.addEventListener("keydown", event => {
          if (event.key !== "Enter") return;
          event.preventDefault();
          this.#saveName();
        });
      }

      for (const select of root.querySelectorAll("[data-characteristic]")) {
        select.addEventListener("change", event => {
          this.#setCharacteristic(event.currentTarget.dataset.characteristic, event.currentTarget.value);
        });
      }

      for (const input of root.querySelectorAll("[data-spend-filter]")) {
        const field = input.dataset.spendFilter;
        input.addEventListener((input.tagName === "SELECT") ? "change" : "change", event => {
          this.#spend[field] = event.currentTarget.value;
          this.render();
        });
      }
    }

    /* ---------- step movement ---------- */

    async #goto(step) {
      if (!CHARGEN_STEPS.includes(step)) return;
      this.step = step;
      const actor = this.actor;
      if (actor?.isOwner) {
        await writeChargenState(actor, {
          step,
          started: chargenStateOf(actor).started ?? new Date().toISOString(),
        });
      }
      this.render();
    }

    static #onGoStep(event, target) {
      this.#goto(target.dataset.step);
    }

    static async #onAdvance() {
      // Leaving step 1 or 2 with unsaved text should keep it, not drop it.
      if (this.step === "bio") await this.#saveBio({ quiet: true });
      if (this.step === "name") await this.#saveName({ quiet: true });
      this.#goto(nextStep(this.step));
    }

    static #onRetreat() {
      this.#goto(prevStep(this.step));
    }

    static #onRefresh() {
      this.render();
    }

    /* ---------- step 1: biography + VOIDMARK ---------- */

    static #onAskVoidmark() {
      const actor = this.actor;
      if (!actor) return;
      const facts = heroFacts(actor);
      if (this.#bioDraft !== null) facts.bio = this.#bioDraft;
      const open = voidmarkApi()?.open;
      if (!open) {
        ui.notifications.warn(loc("Bio.VoidmarkOffline"));
        return;
      }
      // Audience lock (B122 / S6): the thread's own mode decides what VOIDMARK may say. The wizard seeds the
      // prompt box and never touches the mode, so a player stays a runner asking a runner's question.
      if (!open({ seed: voidmarkSeed(facts) })) return;
      ui.notifications.info(loc("Bio.VoidmarkSeeded"));
    }

    static #onSaveBio() {
      this.#saveBio();
    }

    async #saveBio({ quiet = false } = {}) {
      const actor = this.actor;
      if (!actor?.isOwner) return;
      const value = this.#bioDraft;
      if (value === null) return;
      this.#bioDraft = null;
      if (value === (actor.system.biography?.value ?? "")) return;
      await actor.update({ "system.biography.value": value });
      await writeChargenState(actor, { bio: value });
      if (!quiet) ui.notifications.info(loc("Bio.Saved", { name: actor.name }));
      this.render();
    }

    /* ---------- step 2: name ---------- */

    static #onSaveName() {
      this.#saveName();
    }

    async #saveName({ quiet = false } = {}) {
      const actor = this.actor;
      if (!actor?.isOwner) return;
      const value = String(this.#nameDraft ?? "").trim();
      this.#nameDraft = null;
      if (!value || (value === actor.name)) {
        this.render();
        return;
      }
      await actor.update({ name: value });
      if (!quiet) ui.notifications.info(loc("Name.Saved", { name: value }));
      this.render();
    }

    /* ---------- the spine picks ---------- */

    static async #onPick(event, target) {
      const actor = this.actor;
      if (!actor?.isOwner) return;
      if (!rerunGate(heroFacts(actor)).writable) {
        ui.notifications.warn(loc("ReadOnly.Blocked", { name: actor.name }));
        return;
      }
      const source = await fromUuid(target.dataset.uuid);
      if (!source) return;
      target.disabled = true;
      try {
        await applyChargenItem(actor, source);
      } catch (error) {
        // The system throws a localized error and has already told the player. Log it for the Director.
        console.warn(`${MODULE_ID} | Chargen: "${source.name}" was refused`, error);
      } finally {
        this.render();
      }
    }

    static async #onOpenDoc(event, target) {
      const doc = await fromUuid(target.dataset.uuid);
      doc?.sheet?.render({ force: true });
    }

    /* ---------- characteristics ---------- */

    async #setCharacteristic(key, raw) {
      const actor = this.actor;
      if (!actor?.isOwner || !CHARACTERISTIC_KEYS.includes(key)) return;
      const value = (raw === "") ? 0 : Number(raw);
      await actor.update({ [`system.characteristics.${key}.value`]: Number.isFinite(value) ? value : 0 });
      this.render();
    }

    static async #onAutoAssign() {
      const actor = this.actor;
      if (!actor?.isOwner) return;
      const facts = heroFacts(actor);
      if (!facts.coreCharacteristics.length) {
        ui.notifications.warn(loc("Characteristics.NoCores"));
        return;
      }
      const spread = autoAssignArray(facts.coreCharacteristics);
      await actor.update(Object.fromEntries(
        CHARACTERISTIC_KEYS.map(key => [`system.characteristics.${key}.value`, spread[key]]),
      ));
      this.render();
    }

    static async #onClearArray() {
      const actor = this.actor;
      if (!actor?.isOwner) return;
      await actor.update(Object.fromEntries(
        CHARACTERISTIC_KEYS.map(key => [`system.characteristics.${key}.value`, 0]),
      ));
      this.render();
    }

    /* ---------- skills + languages ---------- */

    static async #onAddSkill() {
      const actor = this.actor;
      const key = this.element.querySelector("[data-skill-pick]")?.value;
      if (!actor?.isOwner || !key) return;
      const known = new Set(actor.system.skills?.value ?? []);
      if (known.has(key)) {
        ui.notifications.warn(loc("Skills.Duplicate"));
        return;
      }
      const budget = spineSkillBudget(actor);
      if (!game.user.isGM && budget > 0 && known.size >= budget) {
        ui.notifications.warn(loc("Skills.BudgetSpent", { budget }));
        return;
      }
      known.add(key);
      await actor.update({ "system.skills.value": [...known] });
      this.render();
    }

    static async #onRemoveSkill(event, target) {
      const actor = this.actor;
      if (!actor?.isOwner) return;
      const known = new Set(actor.system.skills?.value ?? []);
      known.delete(target.dataset.skill);
      await actor.update({ "system.skills.value": [...known] });
      this.render();
    }

    static async #onAddLanguage() {
      const actor = this.actor;
      const key = this.element.querySelector("[data-language-pick]")?.value;
      if (!actor?.isOwner || !key) return;
      const known = new Set(actor.system.biography?.languages ?? []);
      const budget = spineLanguageBudget(actor);
      if (!game.user.isGM && budget > 0 && known.size >= budget) {
        ui.notifications.warn(loc("Languages.BudgetSpent", { budget }));
        return;
      }
      known.add(key);
      await actor.update({ "system.biography.languages": [...known] });
      this.render();
    }

    static async #onRemoveLanguage(event, target) {
      const actor = this.actor;
      if (!actor?.isOwner) return;
      const known = new Set(actor.system.biography?.languages ?? []);
      known.delete(target.dataset.language);
      await actor.update({ "system.biography.languages": [...known] });
      this.render();
    }

    /* ---------- confirmations, spends, done ---------- */

    static async #onAck(event, target) {
      const actor = this.actor;
      const key = target.dataset.ack;
      if (!actor?.isOwner || !ACK_STEPS.includes(key)) return;
      const acked = new Set(chargenStateOf(actor).acked);
      if (acked.has(key)) acked.delete(key);
      else acked.add(key);
      await writeChargenState(actor, { acked: [...acked] });
      this.render();
    }

    static async #onBuy(event, target) {
      const actor = this.actor;
      if (!actor?.isOwner) return;
      target.disabled = true;
      await buyChargenItem(actor, target.dataset.uuid, Number(target.dataset.price));
      this.render();
    }

    static #onOpenSheet() {
      this.actor?.sheet?.render({ force: true });
    }

    /** G6: clear only this step's picks / drafts so a runner can change their mind. */
    static async #onStartOver() {
      const actor = this.actor;
      if (!actor?.isOwner || this.readOnly) return;
      const step = this.step;
      const proceed = await foundry.applications.api.DialogV2.confirm({
        window: { title: loc("StartOver.Title") },
        content: `<p>${esc(loc("StartOver.Confirm", { step: loc(`Steps.${step}.Name`) }))}</p>`,
      });
      if (!proceed) return;
      await resetChargenStep(actor, step);
      if (step === "spends") this.#spend = { search: "", pack: "", band: "street", category: "" };
      if (step === "bio") this.#bioDraft = "";
      if (step === "name") this.#nameDraft = actor.name;
      this.render();
    }

    static async #onFinish() {

      const actor = this.actor;
      if (!actor?.isOwner) return;
      const facts = heroFacts(actor);
      if (!chargenComplete(facts)) {
        const proceed = await foundry.applications.api.DialogV2.confirm({
          window: { title: loc("Done.IncompleteTitle") },
          content: `<p>${esc(loc("Done.IncompleteHint", { name: actor.name }))}</p>`,
        });
        if (!proceed) return;
      }
      await writeChargenState(actor, { completed: new Date().toISOString(), step: "done" });
      await postDoneCard(actor, facts);
      ui.notifications.info(loc("Done.Notify", { name: actor.name }));
      await this.close();
      actor.sheet?.render({ force: true });
    }
  };
}

/* -------------------------------------------- context helpers */


/** Collect skill/language advancements off the spine Items currently on the hero. */
function spineAdvancements(actor) {
  const items = [];
  const system = actor?.system ?? {};
  for (const ref of [system.ancestry, system.culture, system.career, system.class]) {
    if (ref) items.push(ref);
  }
  for (const kit of actor?.items ?? []) {
    if (kit?.type === "kit") items.push(kit);
  }
  const out = [];
  for (const item of items) {
    const advancements = item.system?.advancements ?? item.system?.advancement ?? {};
    const list = Array.isArray(advancements) ? advancements : Object.values(advancements);
    out.push(...list);
  }
  return out;
}

function spineSkillBudget(actor) {
  return skillPickBudget(spineAdvancements(actor));
}

function spineLanguageBudget(actor) {
  return languagePickBudget(spineAdvancements(actor));
}

/**
 * G6 — reverse one step's local state. Spine picks delete the Item (with the stock replacement prompt
 * path already used by Take). Skills/languages clear the sheet lists. Characteristics zero the array.
 * Spends only reset filters (purchases stay — ¥ does not refund here).
 */
async function resetChargenStep(actor, step) {
  const state = chargenStateOf(actor);
  const acked = new Set(state.acked);
  acked.delete(step);

  switch (step) {
    case "bio":
      await writeChargenState(actor, { bio: "", acked: [...acked] });
      await actor.update({ "system.biography.value": "" });
      return;
    case "name":
      await actor.update({ name: game.i18n.localize("DOCUMENT.Actor") });
      return;
    case "people":
      if (actor.system.ancestry) await actor.system.ancestry.advancementDeletionPrompt?.({ replacement: true })
        ?? actor.system.ancestry.delete();
      break;
    case "background": {
      if (actor.system.culture) await actor.system.culture.advancementDeletionPrompt?.({ replacement: true })
        ?? actor.system.culture.delete();
      if (actor.system.career) await actor.system.career.advancementDeletionPrompt?.({ replacement: true })
        ?? actor.system.career.delete();
      break;
    }
    case "class":
      ui.notifications.warn(loc("StartOver.ClassHint"));
      break;
    case "kit": {
      const kits = [...(actor.items ?? [])].filter(i => i.type === "kit");
      for (const kit of kits) await kit.delete();
      acked.delete("kit");
      break;
    }
    case "skills":
      await actor.update({ "system.skills.value": [] });
      break;
    case "characteristics":
      await actor.update(Object.fromEntries(
        CHARACTERISTIC_KEYS.map(key => [`system.characteristics.${key}.value`, 0]),
      ));
      break;
    case "languages":
      await actor.update({ "system.biography.languages": [] });
      acked.delete("languages");
      break;
    case "resources":
    case "integrity":
      acked.delete(step);
      break;
    case "spends":
      // Filters only — purchased Items stay on the sheet.
      break;
    default:
      break;
  }
  await writeChargenState(actor, { acked: [...acked] });
}

function skillLabel(key) {
  const config = globalThis.ds?.CONFIG?.skills?.list?.[key];
  return config?.label ? game.i18n.localize(config.label) : String(key);
}

const skillGroupOf = key => globalThis.ds?.CONFIG?.skills?.list?.[key]?.group ?? null;

function languageLabel(key) {
  const config = globalThis.ds?.CONFIG?.languages?.[key];
  return config?.label ? game.i18n.localize(config.label) : String(key);
}

/** Collected skills, bucketed by Ghostwire group, so a same-group swap is one glance (Appendix B §5). */
function skillGroupContext(known = [], writable = true) {
  const groups = new Map();
  for (const key of known) {
    const group = skillGroupOf(key) ?? "other";
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push({ key, label: skillLabel(key), disabled: !writable });
  }
  const groupLabel = group => {
    const config = globalThis.ds?.CONFIG?.skills?.groups?.[group];
    return config?.label ? game.i18n.localize(config.label) : String(group);
  };
  return [...groups.entries()]
    .map(([group, skills]) => ({
      group,
      label: groupLabel(group),
      skills: skills.sort((a, b) => a.label.localeCompare(b.label, game.i18n.lang)),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, game.i18n.lang));
}

function addableSkills(known = []) {
  const owned = new Set(known);
  return Object.keys(globalThis.ds?.CONFIG?.skills?.list ?? {})
    .filter(key => !owned.has(key))
    .map(key => ({ key, label: skillLabel(key) }))
    .sort((a, b) => a.label.localeCompare(b.label, game.i18n.lang));
}

function addableLanguages(known = []) {
  const owned = new Set(known);
  return Object.keys(globalThis.ds?.CONFIG?.languages ?? {})
    .filter(key => !owned.has(key))
    .map(key => ({ key, label: languageLabel(key) }))
    .sort((a, b) => a.label.localeCompare(b.label, game.i18n.lang));
}

/**
 * Search / pack / Availability-band filter over the spend catalog.
 * The band is a *ceiling*: picking Professional still shows Street.
 */
export function filterSpendRows(rows = [], { search = "", pack = "", band = "", category = "" } = {}, wealth = 0) {
  const needle = String(search).trim().toLowerCase();
  const ceiling = AVAILABILITY_BANDS.indexOf(String(band));
  const want = String(category || "");
  return rows
    .filter(row => {
      if (pack && (row.pack !== pack)) return false;
      if (want) {
        const cat = row.category || spendCategoryOf(row);
        if (cat !== want) return false;
      }
      if (needle && !String(row.name).toLowerCase().includes(needle)) return false;
      if (ceiling >= 0) {
        const at = AVAILABILITY_BANDS.indexOf(row.availability);
        if (at > ceiling) return false;
      }
      return true;
    })
    .map(row => {
      const integrityCost = chromeIntegrityCost(row);
      return {
        ...row,
        category: row.category || spendCategoryOf(row),
        priceLabel: formatYen(row.price),
        availabilityLabel: row.availability ? game.i18n.localize(`${L}.Spends.Bands.${row.availability}`) : "",
        packLabel: game.i18n.localize(`${L}.Spends.Packs.${row.pack}`),
        canAfford: row.price <= Number(wealth),
        integrityCost,
        integrityLabel: integrityCost > 0 ? game.i18n.format(`${L}.Spends.IntegrityHit`, { cost: integrityCost }) : "",
      };
    });
}

/** A short "there's a new face on the street" card. The table should see the runner arrive. */
async function postDoneCard(actor, facts) {
  const line = (key, value) => `<li><strong>${esc(loc(`Done.Card.${key}`))}:</strong> ${esc(value)}</li>`;
  const content = `<div class="ghostwire-chargen-card">`
    + `<p><strong>${esc(loc("Done.Card.Title", { name: actor.name }))}</strong></p>`
    + `<ul>`
    + line("People", facts.peopleName ?? "—")
    + line("Background", `${facts.backgroundName ?? "—"} / ${facts.professionName ?? "—"}`)
    + line("Class", facts.subclassName ? `${facts.className} (${facts.subclassName})` : (facts.className ?? "—"))
    + line("Kit", facts.kits.map(kit => kit.name).join(", ") || loc("Done.NoKit"))
    + line("Wealth", formatYen(facts.wealth))
    + `</ul>`
    + `<p class="hint">${esc(loc("Done.Card.Foot"))}</p>`
    + `</div>`;
  return ChatMessage.implementation.create({
    speaker: ChatMessage.implementation.getSpeaker({ actor }),
    content,
  });
}

/* -------------------------------------------- open / register */

const instance = () => foundry.applications.instances.get(APP_ID) ?? null;

function rerender() {
  const app = instance();
  if (app?.rendered) app.render();
}

/**
 * Open the Chargen Wizard on one hero. Players and Directors both may — the gate is ownership of the Actor.
 * @param {Actor|string|null} target   A hero Actor, its uuid / id, or null to fall back to the selected token.
 */
export async function openChargenWizard(target = null) {
  let actor = target;
  if (typeof target === "string") actor = (await fromUuid(target)) ?? game.actors.get(target) ?? null;
  if (!actor) actor = canvas?.tokens?.controlled?.[0]?.actor ?? game.user.character ?? null;

  if (!isHeroActor(actor)) {
    ui.notifications.warn(loc("Errors.NoHero"));
    return null;
  }
  if (!canOpenChargen(actor)) {
    ui.notifications.warn(loc("Errors.NoPermission", { name: actor.name }));
    return null;
  }
  // G9: once stamped complete (or past 1st), refuse — build another runner on a new Hero.
  {
    const state = chargenStateOf(actor);
    const level = Number(actor.system?.level ?? 0);
    if (state.completed || level > 1) {
      ui.notifications.warn(loc("Errors.AlreadyComplete", { name: actor.name }));
      return null;
    }
  }
  await ensureStartingWealth(actor);

  ChargenWizardApp ??= defineChargenWizardApp();
  const app = instance() ?? new ChargenWizardApp();
  app.select(actor);
  return app.render({ force: true });
}

/** A compact launcher in the hero sheet header — top of the sheet, clear of the tab strip. */
function injectChargenButton(app, element) {
  const actor = app?.document ?? app?.actor;
  if (!isHeroActor(actor) || !canOpenChargen(actor)) return;
  // G9: Chargen is once per Hero — never inject the launcher after Finish, or past 1st level.
  const state = chargenStateOf(actor);
  const level = Number(actor.system?.level ?? 0);
  if (state.completed || level > 1) return;
  const root = element?.rootElement ?? element?.[0] ?? element ?? app?.element;
  if (!root?.querySelector) return;
  if (root.querySelector(".ghostwire-chargen-launch")) return;

  const header = root.querySelector("[data-application-part='header']")
    ?? root.querySelector(".sheet-header")
    ?? root.querySelector(".window-content .profile");
  if (!header) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "ghostwire-chargen-launch";
  button.dataset.tooltip = game.i18n.localize(`${L}.LaunchHint`);
  button.setAttribute("aria-label", game.i18n.localize(`${L}.Launch`));
  button.innerHTML = `<i class="fa-solid fa-id-card-clip"></i><span>${esc(game.i18n.localize(`${L}.Launch`))}</span>`;
  button.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    openChargenWizard(actor);
  });

  // After the Taint readout if B80 already claimed the spot, otherwise after the runner's name.
  const anchor = header.querySelector(".ghostwire-taint-header")
    ?? header.querySelector(".document-name")
    ?? header.querySelector("h1");
  if (anchor) anchor.after(button);
  else header.append(button);
}

/** Register the Chargen Wizard: hero sheet launcher, keybinding, API. Call during init. */
export function registerChargenWizard() {
  game.keybindings.register(MODULE_ID, "chargenWizard", {
    name: `${L}.Keybinding`,
    editable: [],
    restricted: false,
    onDown: () => {
      const app = instance();
      if (app?.rendered) app.close();
      else openChargenWizard(null);
      return true;
    },
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  // Same overlay family as Taint / Body Integrity / Wired (Draw Steel hero sheet, AppV2).
  Hooks.on("renderDrawSteelHeroSheet", injectChargenButton);
  Hooks.on("renderActorSheet", injectChargenButton);
  Hooks.on("renderActorSheetV2", injectChargenButton);

  // The stock advancement dialogs write Items and Actor data behind the wizard's back — follow them.
  Hooks.on("createItem", item => { if (isHeroActor(item?.parent)) rerender(); });
  Hooks.on("deleteItem", item => { if (isHeroActor(item?.parent)) rerender(); });
  Hooks.on("updateActor", actor => { if (isHeroActor(actor)) rerender(); });

  Hooks.once("ready", () => {
    ChargenWizardApp ??= defineChargenWizardApp();
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        openChargenWizard,
        chargen: {
          open: openChargenWizard,
          heroFacts,
          stepStatus,
          doneChecklist,
          chargenComplete,
          rerunGate,
          applyChargenItem,
          buyChargenItem,
          ensureStartingWealth,
          isChargenSpendable,
          CHARGEN_STEPS,
          CHARGEN_SPEND_PACKS,
          CHARACTERISTIC_ARRAY,
        },
      };
    }
    game.ghostwire = { ...(game.ghostwire ?? {}), openChargenWizard };
    console.log(`${MODULE_ID} | Chargen Wizard: ${CHARGEN_STEPS.length}-step hero applet registered (flags.${MODULE_ID}.${CHARGEN_FLAG})`);
  });
}
