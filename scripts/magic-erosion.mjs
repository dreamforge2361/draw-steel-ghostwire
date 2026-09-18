// B56 magic erosion (docs/spikes/B56-MAGIC-EROSION.md, docs/raw/09-chrome-body-integrity.md § Magic erosion):
// installed chrome lowers a living caster's casting-resource cap (Essence / Conviction / Resonance).
// - erosion = floor(Soft Integrity / 3) + floor(Standard Integrity / 2) + Salvage Integrity, summed over the chrome Items
//   on the Actor now. A chrome flag with no grade counts as Standard.
// - Base cap follows the Veil-caster spine: 8 / 12 / 16 / 20 by echelon. Street Priests add +2 for Burgeoning Saint or
//   Rising Adept and +4 for Most Faithful (detected by the feature Item's _dsid). The Technomancer uses the same spine
//   (provisional: the class text never prints a Resonance cap).
// - effectiveCap = max(0, class minimum, base cap - erosion) — never below 0 (Michael 2026-09-18). Draw Steel doesn't store a heroic resource maximum, so every
//   update that would raise system.hero.primary.value above it is clamped in preUpdateActor (turn gains, startCombat,
//   power-roll resource gains, sheet edits all end in an Actor update).
// - The B55b soft-cap (Weave Strain) lives in caster-chrome.mjs and is independent of this.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.MagicErosion";
const PRIMARY = "system.hero.primary.value";
const ECHELON_CAPS = { 1: 8, 2: 12, 3: 16, 4: 20 };
// Street Priest cap features: Burgeoning Saint (light pact) / Rising Adept (dark pact) at 6th, Most Faithful at 10th.
const CAP_FEATURES = { "burgeoning-saint": 2, "rising-adept": 2, "most-faithful": 4 };
const GRADES = ["soft", "standard", "salvage"];

/** Body Integrity spent on installed chrome, by grade. */
export function chromeIntegrityByGrade(actor) {
  const spent = { soft: 0, standard: 0, salvage: 0 };
  for (const item of actor?.items ?? []) {
    const chrome = item.getFlag(MODULE_ID, "chrome");
    if (!chrome) continue;
    const grade = GRADES.includes(chrome.grade) ? chrome.grade : "standard";
    spent[grade] += Number(chrome.integrity) || 0;
  }
  return spent;
}

/** Cap loss from the shared magic-erosion formula. */
export function erosionFor({ soft = 0, standard = 0, salvage = 0 }) {
  return Math.floor(soft / 3) + Math.floor(standard / 2) + Math.floor(salvage);
}

/** Casting-resource cap before erosion: the echelon spine plus Street Priest cap features. */
function baseCap(actor) {
  const echelon = Math.clamp(Number(actor.system.echelon) || 1, 1, 4);
  let cap = ECHELON_CAPS[echelon];
  const seen = new Set();
  for (const item of actor.items) {
    const dsid = item.system?._dsid;
    if ((item.type !== "feature") || !(dsid in CAP_FEATURES) || seen.has(dsid)) continue;
    seen.add(dsid);
    cap += CAP_FEATURES[dsid];
  }
  // Burgeoning Saint and Rising Adept are the same 6th-level feature renamed by pact; count it once.
  if (seen.has("burgeoning-saint") && seen.has("rising-adept")) cap -= CAP_FEATURES["rising-adept"];
  return cap;
}

/** The class's heroic resource minimum, or 0 if it can't be evaluated. */
function classMinimum(actor) {
  const cls = actor.system.class;
  if (!cls?.system.minimum) return 0;
  try {
    const minimum = ds.utils.evaluateFormula(cls.system.minimum, cls.getRollData());
    return Number.isFinite(minimum) ? minimum : 0;
  } catch (err) {
    return 0;
  }
}

export function registerMagicErosion({ isCasterClass }) {
  /** @returns {{soft, standard, salvage, erosion, baseCap, effectiveCap}|null} null for Cyborgs and non-casters. */
  function chromeErosion(actor) {
    if (!isCasterClass(actor)) return null;
    const spent = chromeIntegrityByGrade(actor);
    const erosion = erosionFor(spent);
    const base = baseCap(actor);
    return { ...spent, erosion, baseCap: base, effectiveCap: Math.max(0, classMinimum(actor), base - erosion) };
  }

  // Overflow above the cap is discarded; tell the user once per actor per session.
  const notified = new Set();
  const notifyOverflow = (actor, state) => {
    if (notified.has(actor.uuid)) return;
    notified.add(actor.uuid);
    ui.notifications.info(game.i18n.format(`${L}.Clamped`, { actor: actor.name, cap: state.effectiveCap }));
  };

  Hooks.on("preUpdateActor", (actor, changes, options, userId) => {
    if ((userId !== game.user.id) || (actor.type !== "hero") || !foundry.utils.hasProperty(changes, PRIMARY)) return;
    const state = chromeErosion(actor);
    const value = Number(foundry.utils.getProperty(changes, PRIMARY));
    if (!state || !Number.isFinite(value) || (value <= state.effectiveCap)) return;
    foundry.utils.setProperty(changes, PRIMARY, state.effectiveCap);
    if (!options.ghostwireErosionSync) notifyOverflow(actor, state);
  });

  // Keep flags.<module>.magicErosion current and pull the resource down if the cap dropped below it.
  const queues = new Map();
  const sync = actor => {
    const next = (queues.get(actor.uuid) ?? Promise.resolve()).then(() => syncActor(actor)).catch(err => console.error(err));
    queues.set(actor.uuid, next);
    return next;
  };

  async function syncActor(actor) {
    if (!actor.isOwner) return;
    const state = chromeErosion(actor);
    const stored = actor.getFlag(MODULE_ID, "magicErosion");
    const updates = {};
    if (!state) {
      if (stored) updates[`flags.${MODULE_ID}.-=magicErosion`] = null;
    } else {
      if (!stored || Object.entries(state).some(([key, value]) => stored[key] !== value)) {
        updates[`flags.${MODULE_ID}.magicErosion`] = state;
      }
      if (actor.system.hero.primary.value > state.effectiveCap) updates[PRIMARY] = state.effectiveCap;
    }
    if (!foundry.utils.isEmpty(updates)) await actor.update(updates, { ghostwireErosionSync: true });
  }

  const relevant = item => item.getFlag(MODULE_ID, "chrome") || ["class", "ancestry", "feature"].includes(item.type);
  const onItemChange = (item, userId) => {
    const actor = item.parent;
    if ((userId !== game.user.id) || (actor?.type !== "hero") || !relevant(item)) return;
    sync(actor);
  };
  Hooks.on("createItem", (item, options, userId) => onItemChange(item, userId));
  Hooks.on("deleteItem", (item, options, userId) => onItemChange(item, userId));
  // Chrome grade / Integrity edits and class level changes move the cap.
  Hooks.on("updateItem", (item, changes, options, userId) => {
    const chromeChanged = foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.chrome`)
      || foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.-=chrome`);
    if (chromeChanged || (item.type === "class")) onItemChange(item, userId);
  });
  Hooks.on("createActor", (actor, options, userId) => {
    if ((userId === game.user.id) && (actor.type === "hero")) sync(actor);
  });
  Hooks.once("ready", () => {
    if (!game.user.isGM) return;
    for (const actor of game.actors) if (actor.type === "hero") sync(actor);
  });

  // Hero sheet: casters see "<Resource> cap N (base B − erosion E)" in the Body Integrity fieldset.
  Hooks.on("renderDrawSteelHeroSheet", (app, element) => {
    const actor = app.document;
    const fieldset = element.querySelector(".ghostwire-integrity");
    if (!fieldset || fieldset.querySelector(".ghostwire-magic-erosion")) return;
    const state = chromeErosion(actor);
    if (!state) return;
    const hint = document.createElement("p");
    hint.className = "hint ghostwire-magic-erosion";
    hint.classList.toggle("eroded", state.erosion > 0);
    const resource = actor.system.class?.system.primary || game.i18n.localize(`${L}.Resource`);
    hint.textContent = game.i18n.format(`${L}.SheetLine${state.erosion > 0 ? "Eroded" : ""}`, {
      resource, cap: state.effectiveCap, base: state.baseCap, erosion: state.erosion,
    });
    hint.dataset.tooltip = game.i18n.format(`${L}.Breakdown`, {
      soft: state.soft, softLoss: Math.floor(state.soft / 3),
      standard: state.standard, standardLoss: Math.floor(state.standard / 2),
      salvage: state.salvage, salvageLoss: state.salvage,
    });
    fieldset.append(hint);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) module.api = { ...(module.api ?? {}), chromeErosion, chromeIntegrityByGrade, erosionFor };
}
