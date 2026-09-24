// 0.3.132 (D) — the other half of every summon: putting it away.
//
// Three engines already did this work and none of them was reachable from a hero sheet's Abilities
// tab, which is where a player actually looks:
//
//   * sprites   — `decompileSprite` / `decompileAll` lived on the Compile Sprite *item sheet* and in
//                 a right-click context menu on that one row.
//   * elementals — `dismissVeil` / `dismissAllVeil` lived on the summon abilities' item sheets, so a
//                 Zephyr Companion could only be sent home from the sheet that called it.
//   * spirits   — same file, same door.
//
// Hacker Agents were the exception and the proof: `decompile-agent` is a real ability row in the
// classes pack, granted beside Compile Agent, and nobody has ever had to be told where it is. This
// file gives the other three the same shape.
//
// **Why a runtime ability rather than three new pack rows and three new class grants.** The Reload
// maneuver (0.3.126 B, scripts/ammo.mjs) already established the pattern: an ability the module
// builds and keeps in sync with what the hero is actually carrying. It is the right shape here for
// a reason that is specific to these three classes:
//
//   * The Technomancer's Compile Sprite lives in a straight `itemGrant`, so a fourth row there would
//     read as a fourth signature ability, which Decompile Sprite is not.
//   * The Elementalist's Summon Elemental and the Street Priest's Invoke the Pact both live in
//     **`chooseN: 1` pools** — pick one heroic ability from five. Adding a free maneuver to either
//     pool would make "I can put my elemental away" cost a hero their heroic ability choice.
//   * Companions come from origins (Pyromancer / Stormcaller / Geomancer), not from the class, so
//     no single class grant covers everyone who can summon in the first place.
//
// A synced ability sidesteps all three, and — the part that matters at the table — it lands on
// heroes **who already exist**, including the five pregens, without anybody rebuilding a character.
//
// The rule for presence is the Reload rule: the ability is on the sheet exactly while the hero has
// something that can summon. Lose the summon ability, lose the dismiss.
//
// Everything above the "Foundry registration" divider is Foundry-free so
// tools/wave-03132-smoke.mjs can run it under Node.

import { compiledSprites, decompileAll, decompileSprite } from "./sprites.mjs";
import { dismissAllVeil, dismissVeil, veilSummons, VEIL_SUMMON_DSIDS, ELEMENTAL_ABILITIES, SPIRIT_ABILITIES } from "./veil-summons.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const UI = "GHOSTWIRE.Summons.Dismiss";

/** The flag that marks a built dismiss ability, and the key under it that names which one. */
export const DISMISS_FLAG = "dismissAbility";

/**
 * The three dismiss abilities, as data.
 *
 * `needs` is the presence rule: the hero has at least one of these `_dsid`s. `classDsid` narrows it
 * further, because a Director's homebrew hero holding a copy of Compile Sprite is not a Technomancer
 * and should not grow a Technomancer maneuver.
 *
 * `dsid` values are prefixed `gw-` exactly as the Reload maneuver's `gw-reload` is: these are
 * Ghostwire's own rows, not Draw Steel content, and the prefix keeps them from ever colliding with a
 * real pack `_dsid`. scripts/hit-fx.mjs suppresses all three by name.
 */
export const DISMISS_SPECS = Object.freeze({
  sprite: Object.freeze({
    key: "sprite",
    dsid: "gw-decompile-sprite",
    classDsid: "technomancer",
    needs: Object.freeze(["compile-sprite"]),
    lang: "GHOSTWIRE.Classes.Technomancer.Items.DecompileSprite",
    img: "modules/draw-steel-ghostwire/assets/icons/abilities/decompile-agent.svg",
  }),
  elemental: Object.freeze({
    key: "elemental",
    dsid: "gw-dismiss-elemental",
    classDsid: "elementalist",
    needs: ELEMENTAL_ABILITIES,
    lang: "GHOSTWIRE.Classes.Elementalist.Items.DismissElemental",
    img: "icons/magic/air/wind-tornado-funnel-blue.webp",
  }),
  spirit: Object.freeze({
    key: "spirit",
    dsid: "gw-dismiss-spirit",
    classDsid: "street-priest",
    needs: SPIRIT_ABILITIES,
    lang: "GHOSTWIRE.Classes.StreetPriest.Items.DismissSpirit",
    img: "icons/magic/holy/angel-winged-humanoid-blue.webp",
  }),
});

/** Every dismiss `_dsid` this file owns. */
export const DISMISS_DSIDS = Object.freeze(Object.values(DISMISS_SPECS).map(spec => spec.dsid));

/**
 * Should this hero have this dismiss ability right now?
 *
 * Both halves are required and neither is a formality: the class, because a Technomancer maneuver on
 * a Hacker sheet is a bug, and the summon ability, because "Dismiss Elemental" on a hero who cannot
 * summon one is a row that does nothing forever.
 *
 * @param {object} opts
 * @param {object|null} opts.spec        A row of {@link DISMISS_SPECS}.
 * @param {string} opts.classDsid        The hero's class `_dsid`.
 * @param {Iterable<string>} opts.dsids  Every ability `_dsid` on the hero's sheet.
 * @returns {boolean}
 */
export function wantsDismissAbility({ spec = null, classDsid = "", dsids = [] } = {}) {
  if (!spec) return false;
  if (String(classDsid) !== spec.classDsid) return false;
  const have = new Set(dsids ?? []);
  return spec.needs.some(dsid => have.has(dsid));
}

/**
 * What one Use does: dismiss one, dismiss all, or refuse.
 *
 * Split out from the dialog so the smoke can drive all three without a browser. One summon out is
 * **not** a question — matching `promptDecompileTarget` in scripts/agents.mjs, which has behaved
 * that way since 0.3.121 and is the shape players already know.
 *
 * @param {object} opts
 * @param {number} opts.count  How many summons of this family are out.
 * @returns {{mode: "none"|"one"|"choose"}}
 */
export function dismissPlan({ count = 0 } = {}) {
  const out = Math.max(0, Math.floor(Number(count) || 0));
  if (!out) return { mode: "none" };
  if (out === 1) return { mode: "one" };
  return { mode: "choose" };
}

/* ============================================ Foundry registration */

const loc = (key, data) => (data ? game.i18n.format(key, data) : game.i18n.localize(key));
const esc = text => foundry.utils.escapeHTML(String(text ?? ""));
const isHero = actor => actor?.type === "hero";
const classDsidOf = actor => (isHero(actor) ? (actor.system.class?.system?._dsid ?? "") : "");
const abilityDsids = actor => (actor?.items ?? []).filter(item => item.type === "ability").map(item => item.system?._dsid);

/** The live roster for one family. */
function rosterOf(spec, actor) {
  if (spec.key === "sprite") return compiledSprites(actor);
  return veilSummons(actor).filter(pet => pet.getFlag(MODULE_ID, "kind") === spec.key);
}

/** Send one home. */
async function dismissOne(spec, pet) {
  if (spec.key === "sprite") return decompileSprite(pet);
  return dismissVeil(pet);
}

/** Send the whole family home. */
async function dismissEvery(spec, actor) {
  if (spec.key === "sprite") return decompileAll(actor);
  return dismissAllVeil(actor, { family: spec.key });
}

/**
 * The ability row itself.
 *
 * A **free maneuver with no resource**: none of the three printed texts charges for letting go, and
 * inventing a cost would be inventing RAW. `distance.type: "self"` is both true and useful — it is
 * what keeps scripts/hit-fx.mjs from ever reading this as an attack.
 */
export function buildDismissAbility(spec) {
  return {
    name: loc(`${spec.lang}.Name`),
    type: "ability",
    img: spec.img,
    system: {
      description: { value: "", director: "" },
      source: { book: "Ghostwire Core Rulebook", page: "", license: "Draw Steel Creator License" },
      _dsid: spec.dsid,
      story: loc(`${spec.lang}.Story`),
      keywords: [],
      type: "maneuver",
      category: "",
      resource: null,
      trigger: "",
      distance: { type: "self", primary: "", secondary: "1", tertiary: "1" },
      target: { type: "self", value: null, custom: "" },
      power: { roll: { formula: "@chr", characteristics: [], reactive: false }, effects: {} },
      effects: {
        dismissBefore000: {
          _id: "dismissBefore000", type: "base", description: loc(`${spec.lang}.Effect_before0000000000`),
          before: true, name: "", img: null, sort: 0,
        },
      },
    },
    flags: { [MODULE_ID]: { [DISMISS_FLAG]: spec.key } },
  };
}

const dismissAbilityOf = (actor, spec) =>
  (actor?.items ?? []).find(item => item.getFlag?.(MODULE_ID, DISMISS_FLAG) === spec.key) ?? null;

/**
 * One dismiss ability per family per sheet, present exactly while the hero can summon that family.
 * @returns {Promise<{added: number, removed: number}>}
 */
export async function syncDismissAbilities(actor) {
  if (!isHero(actor) || !actor.isOwner) return { added: 0, removed: 0 };
  const classDsid = classDsidOf(actor);
  const dsids = abilityDsids(actor);
  let added = 0;
  let removed = 0;
  for (const spec of Object.values(DISMISS_SPECS)) {
    const existing = dismissAbilityOf(actor, spec);
    const wanted = wantsDismissAbility({ spec, classDsid, dsids });
    if (wanted && !existing) {
      await actor.createEmbeddedDocuments("Item", [buildDismissAbility(spec)]);
      added += 1;
    } else if (!wanted && existing) {
      await actor.deleteEmbeddedDocuments("Item", [existing.id]);
      removed += 1;
    }
  }
  return { added, removed };
}

/**
 * Pick one summon, or all of them. Returns an Actor, the string `"all"`, or null on a refusal.
 *
 * Deliberately the same three-way shape as `promptDecompileTarget` in scripts/agents.mjs.
 */
async function promptDismissTarget(spec, caster) {
  const roster = rosterOf(spec, caster);
  const plan = dismissPlan({ count: roster.length });
  if (plan.mode === "none") {
    ui.notifications.warn(loc(`${UI}.None`, { actor: caster.name }));
    return null;
  }
  if (plan.mode === "one") return roster[0];

  const options = roster.map((pet, index) => {
    const label = loc(`${UI}.Pick.One`, {
      name: pet.name, stamina: pet.system.stamina?.value ?? 0, max: pet.system.stamina?.max ?? 0,
    });
    return `<option value="${pet.id}"${index === 0 ? " selected" : ""}>${esc(label)}</option>`;
  });
  options.push(`<option value="all">${esc(loc(`${UI}.Pick.All`, { count: roster.length }))}</option>`);
  const picked = await foundry.applications.api.DialogV2.prompt({
    window: { title: loc(`${UI}.Pick.Title`) },
    content: `<p>${esc(loc(`${UI}.Pick.Hint`, { actor: caster.name }))}</p>`
      + `<div class="form-group"><label>${loc(`${UI}.Pick.Which`)}</label>`
      + `<select name="pet">${options.join("")}</select></div>`,
    ok: { label: loc(`${UI}.Pick.Confirm`), callback: (event, button) => button.form.elements.pet.value },
    rejectClose: false,
  });
  if (!picked) return null;
  if (picked === "all") return "all";
  return roster.find(pet => pet.id === picked) ?? null;
}

/**
 * Patch `AbilityModel#use`.
 *
 * The target is chosen **before** `use` runs, so backing out of the dialog leaves no card behind;
 * the dismissal happens **after**, so the card that names the maneuver posts first. The card itself
 * is not required: like Spot Target (0.3.132 B), this is a maneuver with an empty `power`, and the
 * system is entitled to hand back nothing. The summon goes home either way.
 */
function patchDismissUse() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? globalThis.ds?.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; dismiss abilities are sheet-only`);
    return;
  }
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    const key = this.parent?.getFlag?.(MODULE_ID, DISMISS_FLAG);
    const spec = key ? DISMISS_SPECS[key] : null;
    if (!spec) return use.call(this, config, dialogOptions, messageOptions);

    const caster = this.actor;
    const target = await promptDismissTarget(spec, caster);
    if (!target) return null;
    const message = await use.call(this, config, dialogOptions, messageOptions);
    if (target === "all") await dismissEvery(spec, caster);
    else await dismissOne(spec, target);
    return message;
  };
}

export function registerDismissAbilities() {
  patchDismissUse();

  Hooks.once("ready", async () => {
    let added = 0;
    let removed = 0;
    for (const actor of game.actors) {
      const result = await syncDismissAbilities(actor);
      added += result.added;
      removed += result.removed;
    }
    if (added || removed) console.log(`${MODULE_ID} | dismiss abilities: +${added} / -${removed}`);
  });

  // Gaining (or losing) the summon ability is the only thing that changes the answer.
  const watched = new Set([...VEIL_SUMMON_DSIDS, "compile-sprite"]);
  const touches = item => (item?.type === "ability") && watched.has(item.system?._dsid);
  Hooks.on("createItem", (item, options, userId) => {
    if ((userId !== game.user.id) || !touches(item)) return;
    if (item.parent instanceof Actor) syncDismissAbilities(item.parent);
  });
  Hooks.on("deleteItem", (item, options, userId) => {
    if ((userId !== game.user.id) || !touches(item)) return;
    if (item.parent instanceof Actor) syncDismissAbilities(item.parent);
  });
  Hooks.on("createActor", (actor, options, userId) => {
    if (userId !== game.user.id) return;
    syncDismissAbilities(actor);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      DISMISS_SPECS,
      dismissPlan,
      wantsDismissAbility,
      syncDismissAbilities,
    };
  }
  console.log(`${MODULE_ID} | dismiss abilities registered (${DISMISS_DSIDS.join(" / ")})`);
}
