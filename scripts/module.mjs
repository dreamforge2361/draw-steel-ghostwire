import { MATRIX_VERB_DSIDS, MATRIX_VERBS } from "./wired-verbs.mjs";
import { actorHasConnectInterface, abilityUuidsFromMessages, hasHideInSheetFlag, isTemporaryConsoleVerb, orphanTemporaryVerbs, DS_HIDE_IN_SHEET, DS_SYSTEM_ID } from "./wired-console-verbs.mjs";
import {
  WIRED_STATUS_DEFS,
  abilityPowerRollModifiers,
  connectTargetState,
  isFullyConnected,
  isLinkedOkVerb,
  isOnNet,
  jumpedInBlocksAbility,
  nextToggleState,
  PILOT_AND_GUNNER_DSID,
} from "./wired-state.mjs";
import { registerGhostwireSkills } from "./skills.mjs";
import { registerGhostwireLanguages } from "./languages.mjs";
import { registerWiredConsole } from "./wired-console.mjs";
import { registerWiredMinimap } from "./wired-minimap.mjs";
import { registerWiredNodeVerbs } from "./wired-node-verbs.mjs";
import { registerWiredKit } from "./wired-kit.mjs";
import { registerRunGenerator } from "./run-generator.mjs";
import { registerMachines, isDeployedMachineActor, hasAnyToken } from "./machines.mjs";
import { registerRiggerVertical } from "./rigger-vertical.mjs";
import { registerMachineSheet } from "./machine-sheet.mjs";
import { registerStreetEye } from "./street-eye.mjs";
import { registerKitGrants } from "./kit-grants.mjs";
import { registerSprites } from "./sprites.mjs";
import { registerAgents } from "./agents.mjs";
import { registerVeilSummons } from "./veil-summons.mjs";
import { registerMods, modSlotsLabel, softwareEdges } from "./mods.mjs";
import { registerMounts } from "./mounts.mjs";
import { registerWiredVision } from "./wired-vision.mjs";
import { registerAbilitySfx } from "./sfx.mjs";
import { registerEquipmentUse } from "./equipment-use.mjs";
import { isMountedWeapon, weaponSkillBonus } from "./weapon-skills.mjs";
import { registerPayloadUse } from "./payload-use.mjs";
import { registerFreeStrikeStrip } from "./free-strikes.mjs";
import { registerCasterChrome } from "./caster-chrome.mjs";
import { registerMagicErosion } from "./magic-erosion.mjs";
import { registerVoidmark } from "./voidmark.mjs";
import { registerVoidmarkJournal } from "./voidmark-journal.mjs";
import { registerGoldLineScene } from "./gold-line-scene.mjs";
import { registerNightjarMarketScene } from "./nightjar-market-scene.mjs";
import { registerTaint } from "./taint.mjs";
import { registerDirectorWealth } from "./director-wealth.mjs";
import { registerKiosk } from "./kiosk.mjs";
import { registerBlackMarket } from "./black-market.mjs";
import { registerConsumableUse } from "./consumable-use.mjs";
import { registerRituals } from "./rituals.mjs";
import { registerRitualWorking } from "./ritual-working.mjs";
import { registerTokenVision } from "./token-vision.mjs";
import { registerSights } from "./sights.mjs";
import { registerChargenWizard } from "./chargen-wizard.mjs";
import { registerChromeDamage, chromeRefundBlocked } from "./chrome-damage.mjs";
import { registerLocker } from "./locker.mjs";
import { registerIdentity } from "./identity.mjs";
import { registerWireStateToggle } from "./wire-state-toggle.mjs";
import { registerCritFeedback } from "./crit-feedback.mjs";
import { registerCoverConceal } from "./cover-conceal.mjs";
import { registerFlanking } from "./flanking.mjs";
import { registerWorkshopBenches } from "./workshop-benches.mjs";

const MODULE_ID = "draw-steel-ghostwire";

// Draw Steel copies ds.CONFIG.hero.defaultItems onto every new hero.
// Ghostwire swaps stock actions for street-themed copies with the same mechanics.
const DEFAULT_ITEM_SWAPS = {
  // Ride -> Drive (vehicles, not mounts)
  "Compendium.draw-steel.abilities.Item.QXOkflcYF6DITJE3": `Compendium.${MODULE_ID}.abilities.Item.Xc5MebcXHYG1hdQR`,
  // Charge -> Rush
  "Compendium.draw-steel.abilities.Item.wNqJWJbgAbnJBqZf": `Compendium.${MODULE_ID}.abilities.Item.Od6u2idYoCRmoDYD`,
  // Defend -> Take Cover
  "Compendium.draw-steel.abilities.Item.fjtY7RKBGWx2u5tK": `Compendium.${MODULE_ID}.abilities.Item.1W0HIoL2SAcbTU6W`,
  // Heal -> Patch Up
  "Compendium.draw-steel.abilities.Item.2qWHDVB7SBS9anLB": `Compendium.${MODULE_ID}.abilities.Item.pJY4ybZUtkH9HDxy`,
  // Aid Attack -> Spot Target
  "Compendium.draw-steel.abilities.Item.Xb3S5N1fZyICD58D": `Compendium.${MODULE_ID}.abilities.Item.Lc7LhoqWg9ydP5Jm`,
};

// Wired connection states: token/sheet statuses are the source of truth, mirrored to flags.<module>.wired.
// Lock 2026-09-20: Disconnected | Linked | Overlay | Jacked In.
const WIRED_STATUSES = WIRED_STATUS_DEFS;

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Draw Steel - Ghostwire Build initialized`);
  document.body.classList.add("ghostwire", "ghostwire-theme");

  const defaultItems = ds.CONFIG.hero.defaultItems;
  for (const [stock, ghostwire] of Object.entries(DEFAULT_ITEM_SWAPS)) {
    if (defaultItems.delete(stock)) defaultItems.add(ghostwire);
    else console.warn(`${MODULE_ID} | ${stock} not found in hero default items; ${ghostwire} not added`);
  }
  // B117: Matrix Verbs fire from the node applet. Strip any leftover defaultItems grants.
  for (const uuid of MATRIX_VERBS) defaultItems.delete(uuid);
  for (const status of Object.values(WIRED_STATUSES)) CONFIG.statusEffects[status.id] = { ...status };

  // Tech: non-Magic, non-Psionic ability keyword for machine abilities (Cyborg Installed Suite).
  // Draw Steel localizes keyword labels at i18nInit, after this hook.
  ds.CONFIG.abilities.keywords.tech ??= { label: "GHOSTWIRE.Abilities.Keywords.Tech" };
  // Chrome / Optics: Scout gear keywords (implant-driven and emitter/holo-driven abilities).
  ds.CONFIG.abilities.keywords.chrome ??= { label: "GHOSTWIRE.Abilities.Keywords.Chrome" };
  ds.CONFIG.abilities.keywords.optics ??= { label: "GHOSTWIRE.Abilities.Keywords.Optics" };
  // Wired: Matrix Verbs, Programs, and other abilities that act in the Wired.
  ds.CONFIG.abilities.keywords.wired ??= { label: "GHOSTWIRE.Abilities.Keywords.Wired" };
  // Command: Commander abilities driven by command presence (orders, rallies, reads).
  ds.CONFIG.abilities.keywords.command ??= { label: "GHOSTWIRE.Abilities.Keywords.Command" };
  // F21 Psychic: an attack whose only medium is the mind. Draw Steel ships `psionic`, but that is the
  // Talent class keyword — a Veil ghost's wail and an Incursion horror's reach are not Talent powers,
  // and Cyborg Cortical Firewall keys off psychic *damage*, not off psionic. Keyword marks the attack,
  // the psychic damage type is what the firewall actually absorbs.
  ds.CONFIG.abilities.keywords.psychic ??= { label: "GHOSTWIRE.Abilities.Keywords.Psychic" };

  registerGhostwireSkills();
  registerGhostwireLanguages();
  registerPerkTypes();
  patchPerkGrants();
  patchPreviousLifeFilter();
  patchPactFilter();
  patchAddOrigin();
  patchArcaneSeverance();
  enforceHeroicResourceCost();
  patchPersistentReagents();
  patchWiredAbilities();
  registerWiredConsole({ getWiredState });
  registerWiredMinimap({ getWiredState });
  registerWiredNodeVerbs({ getWiredState });
  registerWiredKit();
  registerRunGenerator();
  registerWiredVision({ statusIds: { overlay: WIRED_STATUSES.overlay.id, jackedIn: WIRED_STATUSES.jackedIn.id } });
  registerMachines();
  registerRiggerVertical();
  registerMachineSheet();
  registerStreetEye();
  registerKitGrants();
  registerSprites();
  registerAgents();
  registerVeilSummons();
  registerMods();
  registerMounts();
  registerAbilitySfx();
  registerEquipmentUse();
  registerPayloadUse({ getWiredState });
  registerFreeStrikeStrip();
  const { isCasterClass } = registerCasterChrome({ isCyborg, casterClasses: VEIL_CASTER_CLASSES });
  registerMagicErosion({ isCasterClass });
  registerTaint();
  registerVoidmark();
  registerVoidmarkJournal();
  registerGoldLineScene();
  registerNightjarMarketScene();
  registerKiosk();
  registerDirectorWealth();
  registerBlackMarket();
  registerConsumableUse();
  registerRituals();
  registerRitualWorking();
  registerTokenVision();
  // F20 — the canvas half of Has Vision. token-vision owns sight.enabled; this owns detectionModes
  // and sight.visionMode, driven by flags.draw-steel-ghostwire.sightGrant on the granting Item.
  registerSights();
  registerChargenWizard();
  registerChromeDamage();
  registerLocker();
  registerIdentity();
  // S9 — the player-facing Wire-state door. It writes nothing of its own: getWiredState and
  // setWiredState below are the same pair the Wired Console and the Matrix Verbs already use.
  registerWireStateToggle({ getWiredState, setWiredState });
  registerCritFeedback();
  registerCoverConceal();
  // F14 — the positional sibling of F13. Same getTargetModifiers seam, opposite sign: Cover/Conceal
  // banes a ranged attacker, Flanking edges a melee one. It never double-counts Draw Steel's own
  // flanking edge — see the guard in scripts/flanking.mjs.
  registerFlanking();
  // F18 — benches are E1 Base Assets with one extra flag, so placement is already handled by
  // scripts/machines.mjs. This only owns the two benefits: the capped project slot and the edge.
  registerWorkshopBenches();
});

// ---------- Wired connection states ----------

/** @returns {"disconnected"|"linked"|"overlay"|"jackedIn"} */
function getWiredState(actor) {
  if (!actor) return "disconnected";
  if (actor.statuses?.has?.(WIRED_STATUSES.jackedIn.id)) return "jackedIn";
  if (actor.statuses?.has?.(WIRED_STATUSES.overlay.id)) return "overlay";
  if (actor.statuses?.has?.(WIRED_STATUSES.linked.id)) return "linked";
  // Fielded machine under an on-net owner displays LINKED in Wired Console Connections.
  if (isDeployedMachineActor(actor) && hasAnyToken(actor)) {
    const ownerUuid = actor.getFlag(MODULE_ID, "ownerUuid");
    const owner = ownerUuid ? fromUuidSync(ownerUuid) : null;
    if (owner instanceof Actor) {
      if (owner.statuses?.has?.(WIRED_STATUSES.jackedIn.id)
        || owner.statuses?.has?.(WIRED_STATUSES.overlay.id)
        || owner.statuses?.has?.(WIRED_STATUSES.linked.id)) {
        return "linked";
      }
    }
  }
  return "disconnected";
}

async function syncWiredFlag(actor) {
  const state = getWiredState(actor);
  const onNet = isOnNet(state);
  const flag = actor.getFlag(MODULE_ID, "wired");
  if ((flag?.state === state) && (flag?.connected === onNet) && (flag?.immersed === isFullyConnected(state))) return;
  await actor.update({ [`flags.${MODULE_ID}.wired`]: { connected: onNet, immersed: isFullyConnected(state), state } });
}

async function setWiredState(actor, state) {
  for (const [key, status] of Object.entries(WIRED_STATUSES)) {
    if (key !== state) await actor.toggleStatusEffect(status.id, { active: false });
  }
  if (WIRED_STATUSES[state]) await actor.toggleStatusEffect(WIRED_STATUSES[state].id, { active: true });
  await syncWiredFlag(actor);
  ui.notifications.info(game.i18n.format("GHOSTWIRE.Wired.Changed", { actor: actor.name, state: game.i18n.localize(`GHOSTWIRE.Wired.States.${state}`) }));
}

// Token HUD: Linked / Overlay / Jacked In are exclusive; the flag follows.
const wiredStatusKey = effect => Object.keys(WIRED_STATUSES).find(key => effect.statuses?.has(WIRED_STATUSES[key].id));
Hooks.on("createActiveEffect", async (effect, options, userId) => {
  const actor = effect.parent;
  const key = wiredStatusKey(effect);
  if ((userId !== game.user.id) || !key || !(actor instanceof Actor)) return;
  for (const [otherKey, status] of Object.entries(WIRED_STATUSES)) {
    if (otherKey !== key && actor.statuses.has(status.id)) await actor.toggleStatusEffect(status.id, { active: false });
  }
  await syncWiredFlag(actor);
});
Hooks.on("deleteActiveEffect", async (effect, options, userId) => {
  const actor = effect.parent;
  if ((userId !== game.user.id) || !wiredStatusKey(effect) || !(actor instanceof Actor)) return;
  await syncWiredFlag(actor);
});

// Matrix Verbs drive the connection state, and connection states modify power rolls:
// - Connect needs you disconnected (+ interface) and enters Linked.
// - Broadcast / Toggle / Jack Out work from any on-net state (Linked, Overlay, Jacked In).
// - Scan / Navigate / Ping / Search / Read-Write / Programs / payload Runs need Overlay or Jacked In.
// - Toggle steps Linked → Overlay → Jacked In → Linked. Jack Out disconnects.
// - Linked applies neither Overlay meat bane nor Jacked In Wired edge.
function patchWiredAbilities() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? ds.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; Matrix Verbs don't change connection state`);
    return;
  }
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    const actor = this.actor;
    if (!actor) return use.call(this, config, dialogOptions, messageOptions);
    const state = getWiredState(actor);
    const dsid = this.parent.system._dsid ?? "";
    const verb = dsid.startsWith("matrix-") ? dsid.slice("matrix-".length) : null;
    const wired = this.keywords.has("wired");
    const warn = key => {
      ui.notifications.warn(game.i18n.format(`GHOSTWIRE.Wired.Warnings.${key}`, {
        actor: actor.name, name: this.parent.name, state: game.i18n.localize(`GHOSTWIRE.Wired.States.${state}`),
      }));
      return null;
    };

    if ((verb === "connect") && isOnNet(state)) return warn("AlreadyConnected");
    if ((verb === "connect") && !actorHasConnectInterface(actor)) return warn("NeedInterface");
    if (verb && (verb !== "connect") && !isOnNet(state)) return warn("NotConnected");
    if (verb && (verb !== "connect") && !isFullyConnected(state) && !isLinkedOkVerb(verb)) return warn("NeedImmersion");
    if (wired && !verb && !isFullyConnected(state)) return warn("NeedImmersion");

    // 0.3.114 — a Jumped-In pilot firing a gun that is bolted to the machine's hardpoint is doing
    // seat fire, not swinging the meat body around. Resolve the ability's source gear (the hero keeps
    // the gun; Deploy only mirrors it) and ask whether it is mounted *right now*. Unmounted personal
    // gear-use stays blocked, so a scrap-bow in hand is still JackedInPhysical.
    const fromGearId = this.parent.getFlag?.(MODULE_ID, "fromGearId") ?? null;
    const sourceGear = fromGearId ? actor.items?.get?.(fromGearId) ?? null : null;
    const gearMounted = !!sourceGear && isMountedWeapon(sourceGear);
    const jumpedIn = !!actor.getFlag?.(MODULE_ID, "jumpedInto");
    const hasPilotAndGunner = jumpedIn && !!actor.items?.some?.(item => item.system?._dsid === PILOT_AND_GUNNER_DSID);

    // Jacked In locks the meat body. Deploy & Command, Rigged Fire, and the other seat
    // abilities still have to fire — they are the machine, not a personal weapon.
    if (jumpedInBlocksAbility({
      state, wired, dsid, rollEnabled: !!this.power?.roll?.enabled,
      jumpedIn, gearMounted, fromGear: !!fromGearId,
    })) return warn("JackedInPhysical");

    if (this.power.roll.enabled) {
      // Installed, running deck programs and RCC autosofts that name this ability (B20d, scripts/mods.mjs),
      // plus the Jump-In weapon-lock edge and Pilot and Gunner's extra edge on Rigged Fire (0.3.114).
      const { edges, banes } = abilityPowerRollModifiers({
        wired,
        hasHacking: !!actor.system.skills?.value?.has?.("hacking"),
        softwareEdges: softwareEdges(actor, dsid),
        state,
        jumpedIn,
        dsid,
        gearMounted,
        hasPilotAndGunner,
      });
      if (edges || banes) {
        const modifiers = config.modifiers ?? {};
        config = { ...config, modifiers: { ...modifiers, edges: (modifiers.edges ?? 0) + edges, banes: (modifiers.banes ?? 0) + banes } };
      }

      // G4 / B49 — the skill that backs this weapon is worth RAW's flat +2 on its own attack roll,
      // the same benefit Draw Steel's skill dropdown grants on a test. A spawned weapon ability has
      // no skill dropdown to pick from, so the mapping applies it (scripts/weapon-skills.mjs).
      //
      // It has to ride in on `dialogOptions`, not `config`: AbilityModel#use copies `config.modifiers`
      // for edges and banes only, and then does `context.modifiers.bonuses ??= 0`. Seeding the
      // dialog context is the one path the system leaves open, and it also means the player *sees*
      // the +2 sitting in the roll dialog and can clear it if the Director rules otherwise.
      const { bonus, skill } = weaponSkillBonus(this.parent, actor);
      if (bonus) {
        const seeded = (dialogOptions.context?.modifiers?.bonuses ?? 0) + bonus;
        dialogOptions = foundry.utils.mergeObject(dialogOptions, { context: { modifiers: { bonuses: seeded } } }, { inplace: false });
        console.debug(`${MODULE_ID} | ${actor.name}: ${this.parent.name} +${bonus} from ${skill}`);
      }
    }

    const message = await use.call(this, config, dialogOptions, messageOptions);
    if (message && verb) {
      if (verb === "connect") await setWiredState(actor, connectTargetState());
      else if (verb === "jack-out") await setWiredState(actor, "disconnected");
      else if (verb === "toggle-connection-state") await setWiredState(actor, nextToggleState(state));
    }
    return message;
  };
}

// Existing worlds: strip every Matrix Verb off sheets (heroes, pregens, Wire Kit NPCs, Mama).
// B117 applet-only — flag matrixVerbsApplet so the one-time permanent strip runs once.
// 0.3.64: leftover `temporaryConsoleVerb` embeds are stripped every ready unless a chat
// card still points at their abilityUuid (Draw Steel fromUuidSync). Keepers get hideInSheet.
Hooks.once("ready", async () => {
  const keepUuids = abilityUuidsFromMessages(game.messages ?? []);
  let stripped = 0;
  for (const actor of game.actors) {
    if (!actor.isOwner) continue;
    const leftoverTemps = [...actor.items].filter(item => isTemporaryConsoleVerb(item));
    const orphans = orphanTemporaryVerbs(leftoverTemps, keepUuids);
    const orphanIds = new Set(orphans.map(item => item.id));
    if (orphans.length) {
      await actor.deleteEmbeddedDocuments("Item", orphans.map(item => item.id));
    }
    for (const item of leftoverTemps) {
      if (orphanIds.has(item.id) || hasHideInSheetFlag(item)) continue;
      try { await item.setFlag(DS_SYSTEM_ID, DS_HIDE_IN_SHEET, true); }
      catch (err) { console.warn(`${MODULE_ID} | could not stamp hideInSheet on leftover Matrix Verb`, err); }
    }
    if (!game.user.isGM || actor.getFlag(MODULE_ID, "matrixVerbsApplet")) continue;
    const offSheet = [...actor.items].filter(item => MATRIX_VERB_DSIDS.includes(item.system?._dsid) && !isTemporaryConsoleVerb(item));
    if (offSheet.length) {
      await actor.deleteEmbeddedDocuments("Item", offSheet.map(item => item.id));
      stripped += offSheet.length;
    }
    await actor.setFlag(MODULE_ID, "matrixVerbsApplet", true);
  }
  if (stripped) ui.notifications.info(game.i18n.format("GHOSTWIRE.Wired.ConsoleMigrated", { count: stripped }));
});

// Medic Reagents (docs/rulebook/04-medic.md) persist across encounters and have no per-turn gain.
// Draw Steel sets every hero's heroic resource to their Victories when combat starts and rolls the class turnGain
// ("0" still posts a chat card) at the start of each turn; skip both for Medics.
const PERSISTENT_RESOURCE_CLASSES = new Set(["medic"]);

function patchPersistentReagents() {
  const HeroModel = CONFIG.Actor.dataModels?.hero;
  const parent = HeroModel && Object.getPrototypeOf(HeroModel.prototype);
  if (!HeroModel?.prototype.startCombat || !HeroModel.prototype._onStartTurn || !parent) {
    console.warn(`${MODULE_ID} | HeroModel combat hooks not found; Medic Reagents reset when combat starts`);
    return;
  }
  const persistent = model => PERSISTENT_RESOURCE_CLASSES.has(model.class?.system._dsid);

  const startCombat = HeroModel.prototype.startCombat;
  HeroModel.prototype.startCombat = async function(combatant) {
    if (!persistent(this)) return startCombat.call(this, combatant);
    return parent.startCombat.call(this, combatant);
  };

  const onStartTurn = HeroModel.prototype._onStartTurn;
  HeroModel.prototype._onStartTurn = async function(combatant) {
    if (!persistent(this)) return onStartTurn.call(this, combatant);
    return parent._onStartTurn.call(this, combatant);
  };
}

// Heroic abilities: Draw Steel's use dialog lets a hero spend Adrenaline (or any heroic resource) they don't have.
// In combat, refuse to use an ability whose cost is more than the hero's current heroic resource.
// Outside combat, most classes' chapters let heroic abilities be used without spending, so nothing is checked,
// except for Medic Reagents: a physical kit that still spends outside combat (04-medic.md), so it's always checked.
function enforceHeroicResourceCost() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? ds.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; heroic resource costs aren't enforced`);
    return;
  }
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    const actor = this.actor;
    const cost = Number(this.resource) || 0;
    const persistent = PERSISTENT_RESOURCE_CLASSES.has(actor?.system.class?.system._dsid);
    if ((cost > 0) && (actor?.type === "hero") && (actor.inCombat || persistent)) {
      const resource = actor.system.coreResource;
      const current = Number(foundry.utils.getProperty(resource.target, resource.path)) || 0;
      if (current < cost) {
        ui.notifications.warn(game.i18n.format("GHOSTWIRE.Abilities.NotEnoughResource", { name: this.parent.name, cost, resource: resource.name, current }));
        return null;
      }
    }
    return use.call(this, config, dialogOptions, messageOptions);
  };
}

// Perks (docs/rulebook/17-perks.md): the Ghostwire Perks pack replaces the Draw Steel perks.
const PERK_PACK = `${MODULE_ID}.perks`;
const STOCK_PERK_PACK = "draw-steel.character-options";
const PERK_TYPES = ["crafting", "exploration", "interpersonal", "intrigue", "lore", "supernatural"];

// Draw Steel builds perk type options from the skill groups, which Ghostwire replaced, so the Draw Steel perk types
// lost their labels. List exactly the six perk types instead (Draw Steel localizes the labels at i18nInit).
function registerPerkTypes() {
  const perks = ds.CONFIG.perks;
  perks.types = Object.fromEntries(PERK_TYPES.map(type => [type, { label: `GHOSTWIRE.Perks.Types.${type.charAt(0).toUpperCase()}${type.slice(1)}` }]));
  Object.defineProperty(perks, "typeOptions", {
    configurable: true,
    get: () => Object.entries(perks.types).map(([value, { label }]) => ({ value, label })),
  });
}

// Perk grants (additional.type "perk") have an empty pool, so Draw Steel only offers a drop zone.
// List every Ghostwire perk that matches the grant's perk types as a choice, and refuse dropped Draw Steel perks.
function patchPerkGrants() {
  const ItemGrant = ds.CONFIG.Advancement?.itemGrant?.documentClass;
  const Dialog = ds.applications.apps.advancement?.ItemGrantConfigurationDialog;
  const Leaf = ds.utils.advancement?.AdvancementLeaf;
  if (!ItemGrant?.prototype.createLeaves || !Dialog?.prototype._onDrop || !Leaf) {
    console.warn(`${MODULE_ID} | Draw Steel item grant classes not found; perk grants don't list Ghostwire perks`);
    return;
  }

  const createLeaves = ItemGrant.prototype.createLeaves;
  ItemGrant.prototype.createLeaves = async function(node) {
    const result = await createLeaves.call(this, node);
    if ((this.additional.type !== "perk") || !node) return result;
    const pack = game.packs.get(PERK_PACK);
    if (!pack) return result;
    const types = this.additional.perkType;
    const perks = await pack.getDocuments({ type: "perk" });
    for (const perk of perks.sort((a, b) => a.name.localeCompare(b.name, game.i18n.lang))) {
      if (types.size && !types.has(perk.system.perkType)) continue;
      node.choices[perk.uuid] ??= new Leaf(node, perk.uuid, perk.toAnchor().outerHTML, { item: perk });
    }
    return result;
  };

  const onDrop = Dialog.prototype._onDrop;
  Dialog.prototype._onDrop = async function(event) {
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
    const item = data?.uuid ? await fromUuid(data.uuid) : null;
    if ((item?.type === "perk") && (item.pack === STOCK_PERK_PACK)) {
      ui.notifications.warn(game.i18n.format("GHOSTWIRE.Perks.Warnings.StockPerk", { name: item.name }));
      return;
    }
    return onDrop.call(this, event);
  };

  // The registry indexes perks from every pack; keep only non-Draw Steel perks.
  const initialize = ds.registry.initialize;
  ds.registry.initialize = async function(...args) {
    const result = await initialize.apply(this, args);
    for (const [key, entry] of this.perk.entries()) {
      if (entry.uuid?.startsWith(`Compendium.${STOCK_PERK_PACK}.`)) this.perk.delete(key);
    }
    return result;
  };
}

// Hero sheet "+ Add Ancestry / Background / Profession" opens the Ghostwire compendiums instead of draw-steel.origins.
const ORIGIN_PACKS = { ancestry: `${MODULE_ID}.origins`, culture: `${MODULE_ID}.backgrounds`, career: `${MODULE_ID}.professions`, class: `${MODULE_ID}.classes` };
function patchAddOrigin() {
  const actions = ds.applications.sheets?.DrawSteelHeroSheet?.DEFAULT_OPTIONS?.actions;
  if (!actions?.addOrigin) {
    console.warn(`${MODULE_ID} | DrawSteelHeroSheet addOrigin action not found; + Add buttons open Draw Steel compendiums`);
    return;
  }
  const original = actions.addOrigin;
  actions.addOrigin = function(event, target) {
    const pack = game.packs.get(ORIGIN_PACKS[target.dataset.type]);
    if (pack) return pack.render(true);
    return original.call(this, event, target);
  };
}

// Revenant Previous Life: its trait picker only enables traits from the Former Life People's Origins folder.
// Draw Steel's own prerequisite check only knows class and subclass DSIDs, so extend it here.
function patchPreviousLifeFilter() {
  const dialog = ds.applications.apps.advancement?.ItemGrantConfigurationDialog;
  if (!dialog?.prototype.fulfillsRequirements) {
    console.warn(`${MODULE_ID} | ItemGrantConfigurationDialog not found; Revenant Previous Life is unfiltered`);
    return;
  }
  const original = dialog.prototype.fulfillsRequirements;
  dialog.prototype.fulfillsRequirements = function(item) {
    if (!original.call(this, item)) return false;
    if (!this.advancement.document?.getFlag(MODULE_ID, "previousLife")) return true;
    const formerLife = findFormerLife(this.node.chain);
    return !!formerLife?.folder && ((item._source?.folder ?? item.folder?.id) === formerLife.folder);
  };
}

// Street Priest pact (07-street-priest.md): pact-named features come in Light and Dark versions, flagged
// flags.draw-steel-ghostwire.pact. A grant only enables the version matching the Light Pact / Dark Pact feature
// chosen earlier in the chain or already on the actor (both stay enabled until a pact is known).
function patchPactFilter() {
  const dialog = ds.applications.apps.advancement?.ItemGrantConfigurationDialog;
  if (!dialog?.prototype.fulfillsRequirements) {
    console.warn(`${MODULE_ID} | ItemGrantConfigurationDialog not found; Light/Dark pact features are unfiltered`);
    return;
  }
  const original = dialog.prototype.fulfillsRequirements;
  dialog.prototype.fulfillsRequirements = function(item) {
    if (!original.call(this, item)) return false;
    const pact = item.getFlag?.(MODULE_ID, "pact") ?? item.flags?.[MODULE_ID]?.pact;
    if (!pact) return true;
    const alignment = findPactAlignment(this.node.chain);
    return !alignment || (alignment === pact);
  };
}

function findPactAlignment(chain) {
  for (const node of chain.activeNodes()) {
    if (node.advancement.type !== "itemGrant") continue;
    for (const uuid of node.chosenSelection ?? []) {
      const alignment = node.choices[uuid]?.item?.getFlag(MODULE_ID, "pactAlignment");
      if (alignment) return alignment;
    }
  }
  return chain.actor.items.find(i => i.getFlag(MODULE_ID, "pactAlignment"))?.getFlag(MODULE_ID, "pactAlignment") ?? null;
}

// The Former Life chosen earlier in this advancement chain, or already on the actor.
function findFormerLife(chain) {
  for (const node of chain.activeNodes()) {
    if (node.advancement.type !== "itemGrant") continue;
    for (const uuid of node.chosenSelection ?? []) {
      const formerLife = node.choices[uuid]?.item?.getFlag(MODULE_ID, "formerLife");
      if (formerLife) return formerLife;
    }
  }
  return chain.actor.items.find(i => i.getFlag(MODULE_ID, "formerLife"))?.getFlag(MODULE_ID, "formerLife") ?? null;
}

// Changer forms: enabling one form effect switches the whole form, so exactly one form is active. A form can have
// several effects (Hybrid: Intimidation edge + melee damage modifier): every effect of that form turns on and every
// other form's effect turns off.
Hooks.on("updateActiveEffect", (effect, changes, options, userId) => {
  if ((userId !== game.user.id) || (changes.disabled !== false) || options.ghostwireChangerForm) return;
  const form = effect.getFlag(MODULE_ID, "changerForm");
  if (!form) return;
  const actor = (effect.parent instanceof Actor) ? effect.parent : effect.parent?.actor;
  setChangerForm(actor ? [...actor.allApplicableEffects()] : [...effect.parent.effects], form, actor);
});

// Enable every changerForm effect of `form` and disable the rest, one update per parent document, then swap the art.
async function setChangerForm(effects, form, actor) {
  const updates = new Map();
  for (const e of effects) {
    const f = e.getFlag(MODULE_ID, "changerForm");
    if (!f || (e.disabled === (f !== form))) continue;
    if (!updates.has(e.parent)) updates.set(e.parent, []);
    updates.get(e.parent).push({ _id: e.id, disabled: f !== form });
  }
  for (const [parent, changes] of updates) {
    await parent.updateEmbeddedDocuments("ActiveEffect", changes, { ghostwireChangerForm: true });
  }
  if (actor) await syncChangerFormArt(actor, form);
}

// Changer form art: swap the sheet portrait and the canvas token to the form's images from flags.changer.
//
// R2 (0.3.121) splits the two. `humanArt` / `hybridArt` / `beastArt` are the square dossier plates the Hero sheet
// shows; `humanToken` / `hybridToken` / `beastToken` are the round transparent WebPs the canvas uses. They are
// deliberately different files and this function must never force one onto the other — that is exactly what the
// pre-R2 version did, which is why every pregen walked onto the map as a rectangular photo.
//
// A Changer with no `*Token` for a form falls back to that form's `*Art`, so hand-built Changers (and anyone who
// only filled the sheet's art pickers) keep working. Changers without beastArt or humanArt keep their art entirely;
// the forms still work mechanically.
const CHANGER_ART_KEYS = { human: "humanArt", hybrid: "hybridArt", beast: "beastArt" };
const CHANGER_TOKEN_KEYS = { human: "humanToken", hybrid: "hybridToken", beast: "beastToken" };

async function syncChangerFormArt(actor, form) {
  const art = actor.getFlag(MODULE_ID, "changer") ?? {};
  if (!art.beastArt && !art.humanArt) return;
  // Snapshot the current portrait / token as the human form before the first Beast swap, so Human can swap back.
  if ((form === "beast") && art.beastArt && !art.humanArt && (actor.img !== art.beastArt)) {
    await actor.setFlag(MODULE_ID, "changer.humanArt", actor.img);
    art.humanArt = actor.img;
    const canvasSrc = actor.isToken ? actor.token?.texture?.src : actor.prototypeToken?.texture?.src;
    if (canvasSrc && (canvasSrc !== art.beastToken)) {
      await actor.setFlag(MODULE_ID, "changer.humanToken", canvasSrc);
      art.humanToken = canvasSrc;
    }
  }
  const plate = f => art[CHANGER_ART_KEYS[f]] ?? null;
  const circle = f => art[CHANGER_TOKEN_KEYS[f]] ?? null;
  // Hybrid has always fallen back to Human when it has no plate of its own — keep that on both halves.
  const fallback = (form === "hybrid") ? "human" : null;
  const portrait = plate(form) ?? (fallback && plate(fallback)) ?? null;
  // A form with no round token of its own still swaps the canvas, but it takes *this* form's portrait
  // before it takes another form's token: being in the right form matters more than being round.
  const token = circle(form) ?? plate(form) ?? (fallback && circle(fallback)) ?? portrait;
  if (!portrait && !token) return;

  const update = {};
  if (portrait && (actor.img !== portrait)) update.img = portrait;
  if (token && !actor.isToken && (actor.prototypeToken.texture.src !== token)) update["prototypeToken.texture.src"] = token;
  if (!foundry.utils.isEmpty(update)) await actor.update(update);
  if (!token) return;
  const tokens = actor.isToken ? [actor.token] : actor.getActiveTokens(false, true);
  for (const placed of tokens) {
    if (placed && (placed.texture.src !== token)) await placed.update({ "texture.src": token });
  }
}

// Pact spirits (Ghostwire Summons & Machines › Pact Spirits): one Actor serves both pacts. Enabling its Pact: Light or
// Pact: Dark effect disables the other, records flags.pact, and tints the token; setting flags.pact enables the matching effect.
const PACT_TINTS = { light: "#fff1b8", dark: "#c9a0ff" };

async function syncPactTint(actor, pact) {
  const updates = actor.effects.filter(e => e.getFlag(MODULE_ID, "pactTint"))
    .filter(e => e.disabled === (e.getFlag(MODULE_ID, "pactTint") === pact))
    .map(e => ({ _id: e.id, disabled: !e.disabled }));
  if (updates.length) await actor.updateEmbeddedDocuments("ActiveEffect", updates);
  if ((actor.getFlag(MODULE_ID, "pact") ?? null) !== pact) await actor.update({ [`flags.${MODULE_ID}.pact`]: pact });
  const tint = PACT_TINTS[pact] ?? "#ffffff";
  const tokens = actor.isToken ? [actor.token] : actor.getActiveTokens(false, true);
  for (const token of tokens) {
    if (token?.texture.tint?.css !== tint) await token.update({ "texture.tint": tint });
  }
}

Hooks.on("updateActiveEffect", (effect, changes, options, userId) => {
  const actor = effect.parent;
  const pact = effect.getFlag(MODULE_ID, "pactTint");
  if ((userId !== game.user.id) || !pact || !("disabled" in changes) || !(actor instanceof Actor)) return;
  if (!effect.disabled) syncPactTint(actor, pact);
  // Turning a pact off clears it, unless this is the other pact being switched off by syncPactTint itself.
  else if (!actor.effects.some(e => !e.disabled && e.getFlag(MODULE_ID, "pactTint"))) syncPactTint(actor, null);
});

Hooks.on("updateActor", (actor, changes, options, userId) => {
  if ((userId !== game.user.id) || (actor.getFlag(MODULE_ID, "kind") !== "spirit")) return;
  if (!foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.pact`)) return;
  syncPactTint(actor, actor.getFlag(MODULE_ID, "pact") ?? null);
});

// Changer lineage: Draw Steel lets chargen be confirmed with a choice left unpicked, so warn when it happens.
Hooks.on("createItem", (item, options, userId) => {
  if ((userId !== game.user.id) || (item.type !== "ancestry") || (item.system._dsid !== "changer")) return;
  const actor = item.parent;
  if (!actor || actor.items.some(i => i.getFlag(MODULE_ID, "changerLineage"))) return;
  const message = game.i18n.format("GHOSTWIRE.Peoples.Changer.Warnings.MissingLineage", { name: actor.name });
  ui.notifications.warn(message, { permanent: true });
});

// Body Integrity (Chrome chapter): living heroes start at 20/20; Cyborgs start at 25/25 (Michael 2026-09-23).
// Cyborgs MAY buy living Chrome from the chrome pack — install debits Integrity like everyone else.
// Frame Modules = deferred later retag of chrome SKUs (no separate pack in this ship).
const INTEGRITY_START = 20;
const CYBORG_INTEGRITY_START = 25;
const STARTING_NUYEN = 5000;
// Implants per body location (Chrome chapter); arms and legs are 2 per limb, so 4 total.
const CHROME_SLOT_CAPS = { head: 3, eyes: 1, ears: 1, torso: 3, arms: 4, legs: 4, nervous: 1 };

const isCyborg = actor => actor.items.some(i => (i.type === "ancestry") && (i.system._dsid === "cyborg"));

const integrityStartFor = actor => (isCyborg(actor) ? CYBORG_INTEGRITY_START : INTEGRITY_START);

function getIntegrity(actor) {
  const flag = actor.getFlag(MODULE_ID, "integrity") ?? {};
  const start = integrityStartFor(actor);
  return { value: flag.value ?? start, max: flag.max ?? start };
}

const setIntegrity = (actor, value) => actor.update({ [`flags.${MODULE_ID}.integrity.value`]: value });

// New heroes: Integrity 20/20 and ¥5,000 starting funds. Duplicates, imports, and compendium heroes keep their data.
// Token Has Vision for heroes/NPCs is in scripts/token-vision.mjs (preCreateActor + preCreateToken + ready).
// What a token can see once it has vision — detectionModes + sight.visionMode from a sight SKU — is F20
// in scripts/sights.mjs (createItem/updateItem/deleteItem + Active Effect hooks + preCreateToken + ready).

// Pregens used to store only biSpent/biRemaining. The sheet reads integrity.value/max — migrate once.
Hooks.once("ready", async () => {
  let fixed = 0;
  let cyborgFixed = 0;
  for (const actor of game.actors) {
    if (actor.type !== "hero") continue;
    const flag = actor.getFlag(MODULE_ID, "integrity");
    // Legacy biRemaining → integrity.value/max (living start 20).
    if (flag?.value === undefined) {
      const remaining = actor.getFlag(MODULE_ID, "biRemaining");
      if (remaining !== undefined && remaining !== null) {
        await actor.update({
          [`flags.${MODULE_ID}.integrity`]: { value: Number(remaining), max: INTEGRITY_START },
        });
        fixed += 1;
      }
    }
    // Cyborg BI25 once: N/A / missing / max 20 → max 25. Never rewrite living heroes.
    if (!isCyborg(actor)) continue;
    const after = actor.getFlag(MODULE_ID, "integrity") ?? {};
    const max = Number(after.max);
    const value = Number(after.value);
    if (Number.isFinite(max) && (max === CYBORG_INTEGRITY_START)) continue;
    let nextMax = CYBORG_INTEGRITY_START;
    let nextValue;
    if (!Number.isFinite(max) || !Number.isFinite(value)) {
      nextValue = CYBORG_INTEGRITY_START;
    } else if (max === INTEGRITY_START) {
      // Give the +5 headroom; keep spent chrome as spent.
      nextValue = Math.min(CYBORG_INTEGRITY_START, value + (CYBORG_INTEGRITY_START - INTEGRITY_START));
    } else {
      // Odd/missing max (old N/A path): start clean at 25/25.
      nextValue = CYBORG_INTEGRITY_START;
    }
    await actor.update({
      [`flags.${MODULE_ID}.integrity`]: { value: nextValue, max: nextMax },
    });
    cyborgFixed += 1;
  }
  if (fixed) console.log(`${MODULE_ID} | migrated Body Integrity onto ${fixed} hero(es) from biRemaining`);
  if (cyborgFixed) console.log(`${MODULE_ID} | migrated ${cyborgFixed} Cyborg hero(es) to Body Integrity max ${CYBORG_INTEGRITY_START}`);
});

Hooks.on("preCreateActor", (actor, data, options, userId) => {
  if ((userId !== game.user.id) || (actor.type !== "hero")) return;
  const stats = data._stats ?? {};
  if (stats.duplicateSource || stats.compendiumSource || stats.exportSource) return;
  const updates = {
    [`flags.${MODULE_ID}.integrity`]: { value: INTEGRITY_START, max: INTEGRITY_START },
    // Taint is a separate 0–12 stain track (B80). Chrome install never writes this flag.
    [`flags.${MODULE_ID}.taint`]: 0,
    [`flags.${MODULE_ID}.corruptionHistory`]: "",
    // New heroes skip sheet Matrix Verb grants — verbs live on the node applet.
    [`flags.${MODULE_ID}.matrixVerbs`]: true,
    [`flags.${MODULE_ID}.matrixVerbsConsole`]: true,
    [`flags.${MODULE_ID}.matrixVerbsApplet`]: true,
    [`flags.${MODULE_ID}.wired`]: { connected: false, immersed: false, state: "disconnected" },
  };
  if (foundry.utils.getProperty(data, "system.hero.wealth") === undefined) updates["system.hero.wealth"] = STARTING_NUYEN;
  actor.updateSource(updates);
});


// Cyborg People: stamp Body Integrity 25/25 when the ancestry lands (chargen or drop).
// Only upgrades living defaults / missing — never clobber a Cyborg who already spent chrome past max 25.
Hooks.on("createItem", async (item, options, userId) => {
  if ((userId !== game.user.id) || (item.type !== "ancestry") || (item.system._dsid !== "cyborg")) return;
  const actor = item.parent;
  if (!actor || (actor.type !== "hero")) return;
  const flag = actor.getFlag(MODULE_ID, "integrity") ?? {};
  const max = Number(flag.max);
  const value = Number(flag.value);
  const atLivingDefault = (max === INTEGRITY_START) && (value === INTEGRITY_START);
  const missing = !Number.isFinite(max) || !Number.isFinite(value);
  if (!missing && !atLivingDefault && (max === CYBORG_INTEGRITY_START)) return;
  if (!missing && !atLivingDefault && (max > CYBORG_INTEGRITY_START)) return;
  // Upgrade living 20/20 or missing → 25/25; if max was 20 with spend, add +5 headroom.
  let nextValue = CYBORG_INTEGRITY_START;
  if (Number.isFinite(max) && Number.isFinite(value) && (max === INTEGRITY_START) && (value < INTEGRITY_START)) {
    nextValue = Math.min(CYBORG_INTEGRITY_START, value + (CYBORG_INTEGRITY_START - INTEGRITY_START));
  }
  await actor.update({
    [`flags.${MODULE_ID}.integrity`]: { value: nextValue, max: CYBORG_INTEGRITY_START },
  });
});

// Arcane Severance (09-species.md, 06-elementalist.md, 20-technomancer.md): Cyborgs can never take a magic class
// (the Veil casters and the Technomancer).
// Checked on the hero sheet drop, before Draw Steel opens the advancement dialog, so nothing is half-created;
// the preCreateItem hook below is a backstop for any other creation path.
const VEIL_CASTER_CLASSES = new Set(["elementalist", "street-priest", "technomancer"]);

function arcaneSeveranceBlock(actor, item) {
  if (actor?.type !== "hero") return null;
  const dsid = item.system?._dsid;
  if ((item.type === "class") && VEIL_CASTER_CLASSES.has(dsid) && isCyborg(actor)) {
    return game.i18n.format("GHOSTWIRE.ArcaneSeverance.ClassBlocked", { actor: actor.name, name: item.name });
  }
  const casterClass = actor.items.find(i => (i.type === "class") && VEIL_CASTER_CLASSES.has(i.system._dsid));
  if ((item.type === "ancestry") && (dsid === "cyborg") && casterClass) {
    return game.i18n.format("GHOSTWIRE.ArcaneSeverance.AncestryBlocked", { actor: actor.name, name: casterClass.name });
  }
  return null;
}

function patchArcaneSeverance() {
  const HeroSheet = ds.applications.sheets?.DrawSteelHeroSheet;
  if (!HeroSheet?.prototype._onDropItem) {
    console.warn(`${MODULE_ID} | DrawSteelHeroSheet#_onDropItem not found; Arcane Severance is only checked on item creation`);
    return;
  }
  const onDropItem = HeroSheet.prototype._onDropItem;
  HeroSheet.prototype._onDropItem = async function(event, item) {
    const message = (this.actor.uuid !== item.parent?.uuid) && arcaneSeveranceBlock(this.actor, item);
    if (message) {
      ui.notifications.warn(message);
      return null;
    }
    return onDropItem.call(this, event, item);
  };
}

Hooks.on("preCreateItem", (item, data, options, userId) => {
  if (userId !== game.user.id) return;
  const message = arcaneSeveranceBlock(item.parent, item);
  if (!message) return;
  ui.notifications.warn(message);
  return false;
});

// Chrome install: block installs the hero can't afford, then spend Integrity once the implant is on the sheet.
// Cyborgs may install living Chrome (BI25 lock); Arcane Severance + Cortical Firewall stay unchanged.
Hooks.on("preCreateItem", (item, data, options, userId) => {
  const chrome = item.getFlag(MODULE_ID, "chrome");
  const actor = item.parent;
  if (!chrome || (userId !== game.user.id) || (actor?.type !== "hero")) return;
  const format = key => game.i18n.format(`GHOSTWIRE.Integrity.${key}`, { actor: actor.name, name: item.name, cost: chrome.integrity, value: getIntegrity(actor).value });
  if (getIntegrity(actor).value < chrome.integrity) {
    ui.notifications.warn(format("Insufficient"));
    return false;
  }
  const cap = CHROME_SLOT_CAPS[chrome.location];
  const count = actor.items.filter(i => i.getFlag(MODULE_ID, "chrome")?.location === chrome.location).length;
  if (cap && (count >= cap)) {
    const location = game.i18n.localize(`GHOSTWIRE.Chrome.Locations.${chrome.location}`);
    ui.notifications.warn(game.i18n.format("GHOSTWIRE.Integrity.SlotFull", { actor: actor.name, name: item.name, location, count, cap }));
    return false;
  }
});

Hooks.on("createItem", (item, options, userId) => {
  const chrome = item.getFlag(MODULE_ID, "chrome");
  const actor = item.parent;
  if (!chrome || (userId !== game.user.id) || (actor?.type !== "hero")) return;
  const { value, max } = getIntegrity(actor);
  const remaining = Math.max(0, value - chrome.integrity);
  // Chrome spends Body Integrity only. Do not write flags.<module>.taint here (B80).
  setIntegrity(actor, remaining);
  ui.notifications.info(game.i18n.format("GHOSTWIRE.Integrity.Installed", { name: item.name, cost: chrome.integrity, value: remaining, max }));
  grantChromeItems(item, chrome);
});

// Implants that grant abilities (Implant Weapon -> Spur Strike): add them on install, tagged with the implant's id.
async function grantChromeItems(item, chrome) {
  if (!chrome.grants?.length) return;
  const sources = (await Promise.all(chrome.grants.map(uuid => fromUuid(uuid)))).filter(Boolean);
  const data = sources.map(source => {
    const itemData = game.items.fromCompendium(source, { clearFolder: true });
    foundry.utils.setProperty(itemData, `flags.${MODULE_ID}.grantedBy`, item.id);
    return itemData;
  });
  if (data.length) await item.parent.createEmbeddedDocuments("Item", data);
}

// Chrome removal returns 75% of the implant's Integrity (round down); the rest is permanent scarring.
Hooks.on("deleteItem", (item, options, userId) => {
  const chrome = item.getFlag(MODULE_ID, "chrome");
  const actor = item.parent;
  if (!chrome || (userId !== game.user.id) || (actor?.type !== "hero")) return;
  // F12: a Destroyed implant returns nothing. Its Integrity stays locked out until a fresh implant
  // is installed — the whole reason Destroyed never deletes the Item by itself.
  if (chromeRefundBlocked(item, options)) {
    const granted = actor.items.filter(i => i.getFlag(MODULE_ID, "grantedBy") === item.id).map(i => i.id);
    if (granted.length) actor.deleteEmbeddedDocuments("Item", granted);
    ui.notifications.info(game.i18n.format("GHOSTWIRE.ChromeDamage.Notify.NoRefund", { name: item.name, cost: chrome.integrity }));
    return;
  }
  const { value, max } = getIntegrity(actor);
  const refund = Math.floor(chrome.integrity * 0.75);
  const restored = Math.min(max, value + refund);
  setIntegrity(actor, restored);
  ui.notifications.info(game.i18n.format("GHOSTWIRE.Integrity.Removed", { name: item.name, refund, value: restored, max }));
  const granted = actor.items.filter(i => i.getFlag(MODULE_ID, "grantedBy") === item.id).map(i => i.id);
  if (granted.length) actor.deleteEmbeddedDocuments("Item", granted);
});

// Item sheet: chrome and catalog items (gear, mods, matrix, vehicles, foci) show their grade and ¥ under the name.
// Draw Steel treasure has no price field, so price lives in flags.draw-steel-ghostwire.<type>.price.
const formatYen = price => `¥${Number(price ?? 0).toLocaleString(game.i18n.lang)}`;
// Matrix before mod: deck programs and RCC autosofts carry both, and the matrix flag has their ¥ and echelon (B20d).
const CATALOG_FLAGS = ["gear", "matrix", "mod", "vehicle", "focus"];

function catalogLine(entry, item) {
  const parts = [
    entry.echelon ? game.i18n.format("GHOSTWIRE.Gear.SheetLine.Echelon", { echelon: entry.echelon }) : game.i18n.localize("GHOSTWIRE.Gear.SheetLine.NoGrade"),
  ];
  if (entry.availability) parts.push(game.i18n.localize(`GHOSTWIRE.Gear.Availability.${entry.availability}`));
  parts.push(entry.price != null ? `${formatYen(entry.price)}${entry.priceNote ?? ""}` : (entry.priceText ?? "—"));
  if (entry.slotCost) parts.push(game.i18n.format("GHOSTWIRE.Gear.SheetLine.SlotCost", { slots: entry.slotCost }));
  // Owned hosts show used / max (B20c mod install tracker); catalog copies show capacity only.
  else if (entry.modSlots) parts.push(modSlotsLabel(item) ?? game.i18n.format("GHOSTWIRE.Gear.SheetLine.ModSlots", { slots: entry.modSlots }));
  return parts.join(" · ");
}

Hooks.on("renderDrawSteelItemSheet", (app, element) => {
  const chrome = app.document.getFlag(MODULE_ID, "chrome");
  const catalog = CATALOG_FLAGS.map(key => app.document.getFlag(MODULE_ID, key)).find(Boolean);
  const name = element.querySelector(".sheet-header .document-name");
  if (!(chrome || catalog) || !name || element.querySelector(".ghostwire-chrome-line")) return;
  const line = document.createElement("div");
  line.className = "ghostwire-chrome-line";
  line.textContent = chrome
    ? game.i18n.format("GHOSTWIRE.Chrome.SheetLine", {
      grade: game.i18n.localize(`GHOSTWIRE.Chrome.Grades.${chrome.grade}`),
      location: game.i18n.localize(`GHOSTWIRE.Chrome.Locations.${chrome.location}`),
      integrity: chrome.integrity,
      price: formatYen(chrome.price),
      availability: game.i18n.localize(`GHOSTWIRE.Chrome.Availability.${chrome.availability}`),
    })
    : catalogLine(catalog, app.document);
  name.after(line);
});

// R0 (0.3.120): the Hero sheet Ghostwire skin hangs off one marker class, and this is the whole of
// the JS it needs. Styling against Draw Steel's own `.application.draw-steel.actor.hero` chain would
// work today, but that chain is three of the system's DEFAULT_OPTIONS away from us; the class is ours.
// Everything else the skin does lives in `styles/ghostwire.css` under `.ghostwire-hero-sheet`.
Hooks.on("renderDrawSteelHeroSheet", (app, element) => {
  element.classList.add("ghostwire-hero-sheet");
});

// Hero sheet: a Body Integrity fieldset at the top of the Stats tab (current / max). Cyborgs use 25 max.
Hooks.on("renderDrawSteelHeroSheet", (app, element) => {
  const stats = element.querySelector("section.tab[data-tab='stats']");
  if (!stats || stats.querySelector(".ghostwire-integrity")) return;
  const actor = app.document;

  const fieldset = document.createElement("fieldset");
  fieldset.className = "ghostwire-integrity flexrow";
  const legend = document.createElement("legend");
  legend.textContent = game.i18n.localize("GHOSTWIRE.Integrity.Label");
  legend.dataset.tooltip = game.i18n.localize(
    isCyborg(actor) ? "GHOSTWIRE.Integrity.CyborgHint" : "GHOSTWIRE.Integrity.Hint",
  );
  fieldset.append(legend);

  const integrity = getIntegrity(actor);
  for (const key of ["value", "max"]) {
    const group = document.createElement("div");
    group.className = "form-group stacked";
    const label = document.createElement("label");
    label.textContent = game.i18n.localize(`GHOSTWIRE.Integrity.${key === "value" ? "Current" : "Max"}`);
    const input = document.createElement("input");
    Object.assign(input, { type: "number", min: 0, step: 1, value: integrity[key], disabled: !app.isEditable });
    // Unnamed input handled here, so the sheet's own form submit never sees it.
    input.addEventListener("change", event => {
      event.stopPropagation();
      const number = Math.max(0, Math.floor(Number(input.value) || 0));
      actor.update({ [`flags.${MODULE_ID}.integrity.${key}`]: number });
    });
    group.append(label, input);
    fieldset.append(group);
  }

  const resources = stats.querySelector("fieldset.resources");
  if (resources) resources.after(fieldset);
  else stats.prepend(fieldset);
});

// Hero sheet: a read-only Wired fieldset under Body Integrity showing the connection state.
Hooks.on("renderDrawSteelHeroSheet", (app, element) => {
  const stats = element.querySelector("section.tab[data-tab='stats']");
  if (!stats || stats.querySelector(".ghostwire-wired")) return;
  const state = getWiredState(app.document);
  const fieldset = document.createElement("fieldset");
  fieldset.className = `ghostwire-wired state-${state}`;
  const legend = document.createElement("legend");
  legend.textContent = game.i18n.localize("GHOSTWIRE.Wired.Label");
  legend.dataset.tooltip = game.i18n.localize("GHOSTWIRE.Wired.Hint");
  const value = document.createElement("span");
  value.className = "ghostwire-wired-state";
  value.textContent = game.i18n.localize(`GHOSTWIRE.Wired.States.${state}`);
  const hint = document.createElement("span");
  hint.className = "hint";
  hint.textContent = game.i18n.localize(`GHOSTWIRE.Wired.StateHints.${state}`);
  fieldset.append(legend, value, hint);
  const anchor = stats.querySelector(".ghostwire-integrity") ?? stats.querySelector("fieldset.resources");
  if (anchor) anchor.after(fieldset);
  else stats.prepend(fieldset);
});

// Hero sheet: Changer form control (B50b) under the Wired fieldset. Clicking a form runs setChangerForm: all of that
// form's Forms-trait effects on, the other forms' off, then the art swap.
const CHANGER_FORMS = ["human", "hybrid", "beast"];

Hooks.on("renderDrawSteelHeroSheet", (app, element) => {
  const stats = element.querySelector("section.tab[data-tab='stats']");
  if (!stats || stats.querySelector(".ghostwire-changer-forms")) return;
  const actor = app.document;
  const formEffects = [...actor.allApplicableEffects()].filter(e => CHANGER_FORMS.includes(e.getFlag(MODULE_ID, "changerForm")));
  const effects = Object.groupBy(formEffects, e => e.getFlag(MODULE_ID, "changerForm"));
  if (foundry.utils.isEmpty(effects)) return;
  const isActive = form => effects[form]?.some(e => !e.disabled);
  const active = CHANGER_FORMS.find(isActive);
  const art = actor.getFlag(MODULE_ID, "changer") ?? {};

  const fieldset = document.createElement("fieldset");
  fieldset.className = "ghostwire-changer-forms";
  const legend = document.createElement("legend");
  legend.textContent = game.i18n.localize("GHOSTWIRE.Peoples.Changer.Forms.Name");
  legend.dataset.tooltip = game.i18n.localize("GHOSTWIRE.Peoples.Changer.Forms.Hint");
  fieldset.append(legend);

  const buttons = document.createElement("div");
  buttons.className = "ghostwire-changer-form-buttons";
  for (const form of CHANGER_FORMS) {
    if (!effects[form]) continue;
    const key = `GHOSTWIRE.Peoples.Changer.Forms.${form.capitalize()}`;
    const button = document.createElement("button");
    Object.assign(button, { type: "button", textContent: game.i18n.localize(`${key}.Label`), disabled: !actor.isOwner });
    button.classList.toggle("active", form === active);
    button.setAttribute("aria-pressed", String(form === active));
    button.dataset.tooltip = game.i18n.localize(`${key}.Description`);
    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      setChangerForm(formEffects, form, actor);
    });
    buttons.append(button);
  }
  fieldset.append(buttons);

  const artRow = document.createElement("div");
  artRow.className = "ghostwire-changer-form-art";
  // R2 (0.3.121): each form owns two pictures — the square sheet portrait and the round canvas
  // token — so each slot gets its own picker. Clearing one never touches the other.
  const ART_KINDS = [
    { kind: "portrait", keys: CHANGER_ART_KEYS, label: "Portrait", hint: "Hint", fallback: () => actor.img },
    { kind: "token", keys: CHANGER_TOKEN_KEYS, label: "Token", hint: "TokenHint", fallback: () => actor.prototypeToken?.texture?.src ?? actor.img },
  ];
  for (const form of CHANGER_FORMS) {
    const cell = document.createElement("div");
    cell.className = "ghostwire-changer-form-art-slot";
    const label = document.createElement("label");
    label.textContent = game.i18n.localize(`GHOSTWIRE.Peoples.Changer.Forms.${form.capitalize()}.Label`);
    cell.append(label);

    for (const { kind, keys, label: kindLabel, hint, fallback } of ART_KINDS) {
      const flagKey = keys[form];
      const path = art[flagKey] ?? "";
      const box = document.createElement("div");
      box.className = `ghostwire-changer-form-art-kind ghostwire-changer-form-art-${kind}`;
      const kindText = document.createElement("span");
      kindText.className = "ghostwire-changer-form-art-kind-label";
      kindText.textContent = game.i18n.localize(`GHOSTWIRE.Peoples.Changer.Forms.Art.${kindLabel}`);
      const thumb = document.createElement("img");
      thumb.alt = "";
      if (path) thumb.src = path;
      else thumb.classList.add("empty");
      const pick = document.createElement("button");
      Object.assign(pick, {
        type: "button",
        textContent: game.i18n.localize("GHOSTWIRE.Peoples.Changer.Forms.Art.Pick"),
        disabled: !actor.isOwner,
      });
      pick.dataset.tooltip = game.i18n.localize(`GHOSTWIRE.Peoples.Changer.Forms.Art.${hint}`);
      pick.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        const fp = new FilePicker({
          type: "image",
          current: path || fallback(),
          callback: async src => {
            await actor.setFlag(MODULE_ID, `changer.${flagKey}`, src);
            const activeNow = CHANGER_FORMS.find(isActive);
            if (activeNow === form) await syncChangerFormArt(actor, form);
            else if (app.rendered) app.render();
          },
        });
        fp.browse();
      });
      const clear = document.createElement("button");
      Object.assign(clear, {
        type: "button",
        textContent: game.i18n.localize("GHOSTWIRE.Peoples.Changer.Forms.Art.Clear"),
        disabled: !actor.isOwner || !path,
      });
      clear.addEventListener("click", async event => {
        event.preventDefault();
        event.stopPropagation();
        await actor.unsetFlag(MODULE_ID, `changer.${flagKey}`);
        if (app.rendered) app.render();
      });
      box.append(kindText, thumb, pick, clear);
      cell.append(box);
    }
    artRow.append(cell);
  }
  fieldset.append(artRow);

  const anchor = stats.querySelector(".ghostwire-wired") ?? stats.querySelector(".ghostwire-integrity")
    ?? stats.querySelector("fieldset.resources");
  if (anchor) anchor.after(fieldset);
  else stats.prepend(fieldset);
});
