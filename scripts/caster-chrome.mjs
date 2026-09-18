// B55b caster chrome soft-cap (docs/spikes/B55b-CASTER-CHROME-SOFT-CAP.md, docs/raw/09-chrome-body-integrity.md):
// an Elementalist, Street Priest, or Technomancer with more than 5 Body Integrity spent on installed chrome takes a bane
// on every Magic / Veil / Resonance power roll until removal brings the total back to 5 or less.
// - Spent = the sum of flags.<module>.chrome.integrity on the chrome Items on the Actor now (not the lifetime scar).
// - While over the cap the Actor carries a "Weave Strain" Active Effect (flags.<module>.casterSoftCap) as the visible marker.
//   The bane itself is added in AbilityModel#use, like the Wired edges and banes: Draw Steel's ability-modifier effects
//   filter on ALL listed keywords, and one Active Effect per keyword would stack banes on multi-keyword abilities.
//   A GM can waive the bane by disabling the effect; sync never re-enables it.
// - Magic erosion (the cast-resource cap) is separate: magic-erosion.mjs, which reuses isCasterClass from here.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.CasterChrome";
export const CASTER_SOFT_CAP = 5;
// Ghostwire caster abilities all carry Magic; Veil and Resonance are matched too if they're ever used as keywords.
const CASTING_KEYWORDS = ["magic", "veil", "resonance"];
const EFFECT_IMG = "icons/svg/degen.svg";

/** Body Integrity spent on the chrome currently installed on the Actor. */
export function chromeIntegritySpent(actor) {
  if (!actor?.items) return 0;
  return actor.items.reduce((total, item) => total + (Number(item.getFlag(MODULE_ID, "chrome")?.integrity) || 0), 0);
}

export function registerCasterChrome({ isCyborg, casterClasses }) {
  /** A living hero with an Elementalist, Street Priest, or Technomancer class. */
  const isCasterClass = actor => (actor?.type === "hero") && !isCyborg(actor)
    && actor.items.some(i => (i.type === "class") && casterClasses.has(i.system._dsid));

  const overCap = actor => isCasterClass(actor) && (chromeIntegritySpent(actor) > CASTER_SOFT_CAP);
  const findEffect = actor => actor.effects.find(e => e.getFlag(MODULE_ID, "casterSoftCap"));
  const strained = actor => { const effect = findEffect(actor); return !!effect && effect.active; };

  // Sync one Actor at a time so a package install (several createItem hooks) can't create two effects.
  const queues = new Map();
  const sync = (actor, options) => {
    const next = (queues.get(actor.uuid) ?? Promise.resolve()).then(() => syncEffect(actor, options)).catch(err => console.error(err));
    queues.set(actor.uuid, next);
    return next;
  };

  async function syncEffect(actor, { notify = true } = {}) {
    if (!actor.isOwner) return;
    const effect = findEffect(actor);
    const spent = chromeIntegritySpent(actor);
    const format = key => game.i18n.format(`${L}.${key}`, { actor: actor.name, spent, cap: CASTER_SOFT_CAP });
    if (overCap(actor) && !effect) {
      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: game.i18n.localize(`${L}.Effect.Name`),
        img: EFFECT_IMG,
        description: game.i18n.localize(`${L}.Effect.Description`),
        flags: { [MODULE_ID]: { casterSoftCap: true } },
      }]);
      if (notify) ui.notifications.warn(format("Over"), { permanent: true });
    } else if (!overCap(actor) && effect) {
      await effect.delete();
      if (notify && isCasterClass(actor)) ui.notifications.info(format("Cleared"));
    }
  }

  const relevant = item => item.getFlag(MODULE_ID, "chrome") || ["class", "ancestry"].includes(item.type);
  const onItemChange = (item, userId) => {
    const actor = item.parent;
    if ((userId !== game.user.id) || (actor?.type !== "hero") || !relevant(item)) return;
    sync(actor);
  };
  Hooks.on("createItem", (item, options, userId) => onItemChange(item, userId));
  Hooks.on("deleteItem", (item, options, userId) => onItemChange(item, userId));
  Hooks.on("updateItem", (item, changes, options, userId) => {
    if (!foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.chrome`) && !foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.-=chrome`)) return;
    onItemChange(item, userId);
  });
  Hooks.on("createActor", (actor, options, userId) => {
    if ((userId === game.user.id) && (actor.type === "hero")) sync(actor, { notify: false });
  });
  // Existing heroes (GM client): add or clear the effect to match their installed chrome.
  Hooks.once("ready", () => {
    if (!game.user.isGM) return;
    for (const actor of game.actors) if (actor.type === "hero") sync(actor, { notify: false });
  });

  // Magic / Veil / Resonance power rolls take a bane while the Weave Strain effect is active.
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? ds.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; the caster chrome soft-cap bane isn't applied`);
  } else {
    const use = AbilityModel.prototype.use;
    AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
      const actor = this.actor;
      if (actor && this.power.roll.enabled && CASTING_KEYWORDS.some(k => this.keywords.has(k)) && strained(actor)) {
        const modifiers = config.modifiers ?? {};
        config = { ...config, modifiers: { ...modifiers, banes: (modifiers.banes ?? 0) + 1 } };
      }
      return use.call(this, config, dialogOptions, messageOptions);
    };
  }

  // Hero sheet: casters see "Chrome spent X / 5 soft-cap" in the Body Integrity fieldset.
  Hooks.on("renderDrawSteelHeroSheet", (app, element) => {
    const actor = app.document;
    const fieldset = element.querySelector(".ghostwire-integrity");
    if (!fieldset || fieldset.querySelector(".ghostwire-caster-softcap") || !isCasterClass(actor)) return;
    const spent = chromeIntegritySpent(actor);
    const over = spent > CASTER_SOFT_CAP;
    const hint = document.createElement("p");
    hint.className = "hint ghostwire-caster-softcap";
    hint.classList.toggle("over", over);
    hint.textContent = game.i18n.format(`${L}.SheetLine${over ? "Over" : ""}`, { spent, cap: CASTER_SOFT_CAP });
    hint.dataset.tooltip = game.i18n.localize(`${L}.Hint`);
    fieldset.append(hint);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) module.api = { ...(module.api ?? {}), chromeIntegritySpent, isCasterClass, casterSoftCap: CASTER_SOFT_CAP };
  return { isCasterClass };
}
