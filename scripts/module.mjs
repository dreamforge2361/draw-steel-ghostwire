import { MATRIX_VERB_DSIDS, MATRIX_VERBS } from "./wired-verbs.mjs";
import { actorHasConnectInterface, abilityUuidsFromMessages, hasHideInSheetFlag, isTemporaryConsoleVerb, orphanTemporaryVerbs, powerRollTotalFromMessage, DS_HIDE_IN_SHEET, DS_SYSTEM_ID } from "./wired-console-verbs.mjs";
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
import { registerGhostwireLanguages, TRADE_CANT_KEY } from "./languages.mjs";
import { registerWiredConsole } from "./wired-console.mjs";
import { registerWiredMinimap } from "./wired-minimap.mjs";
import { registerWiredNodeVerbs } from "./wired-node-verbs.mjs";
import { registerWiredKit } from "./wired-kit.mjs";
import { registerRunGenerator } from "./run-generator.mjs";
import { registerMachines, isDeployedMachineActor, hasAnyToken } from "./machines.mjs";
import { registerRiggerVertical } from "./rigger-vertical.mjs";
import { registerPassengers } from "./passengers.mjs";
import { registerMachineSheet } from "./machine-sheet.mjs";
import { registerStreetEye } from "./street-eye.mjs";
import { registerKitGrants } from "./kit-grants.mjs";
import { registerSprites } from "./sprites.mjs";
import { registerAgents } from "./agents.mjs";
import { registerVeilSummons } from "./veil-summons.mjs";
import { registerSummonArt } from "./summon-art.mjs";
import { registerDismissAbilities } from "./dismiss-abilities.mjs";
import { registerElementalist } from "./elementalist.mjs";
import { registerMods, modSlotsLabel, softwareEdges } from "./mods.mjs";
// 0.3.139 (C) — Skillwires / skillsofts, the system that replaces RCC autosofts.
import { registerSkillsofts, skillsoftEdges } from "./skillsofts.mjs";
import { registerMounts } from "./mounts.mjs";
import { registerWiredVision } from "./wired-vision.mjs";
import { registerAbilitySfx } from "./sfx.mjs";
import { registerHitFx } from "./hit-fx.mjs";
import { registerEquipmentUse } from "./equipment-use.mjs";
import { registerWeaponRename } from "./weapon-rename.mjs";
import { registerVehicleRename } from "./vehicle-rename.mjs";
import { registerFieldTriage } from "./field-triage.mjs";
import { registerRecoveryPrompt } from "./recovery-prompt.mjs";
import { registerRally } from "./rally.mjs";
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
import { registerDirectorBiofeedback } from "./director-biofeedback.mjs";
import { registerWiredIce } from "./wired-ice.mjs";
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
import { registerConceal } from "./conceal.mjs";
import { registerTakeCover } from "./take-cover.mjs";
import { registerFlanking } from "./flanking.mjs";
import { registerWorkshopBenches } from "./workshop-benches.mjs";
import { registerDirectorResource } from "./director-resource.mjs";
import { registerTraitRepick } from "./trait-repick.mjs";
import { registerStamina } from "./stamina.mjs";
import { registerMachineConditions } from "./machine-conditions.mjs";
import { registerChaseHud } from "./chase-hud.mjs";
import { registerTokenLight } from "./token-light.mjs";
import { registerCantrip } from "./cantrip.mjs";
import { registerPactStrike } from "./pact-strike.mjs";
import { registerReagents } from "./reagents.mjs";
import { registerAmmo } from "./ammo.mjs";
import { registerGrenades } from "./grenades.mjs";
import { registerNpcLoot } from "./npc-loot.mjs";
import { registerMark } from "./mark.mjs";
import {
  CHANGER_ART_KEYS,
  CHANGER_FORMS,
  CHANGER_TOKEN_KEYS,
  changerFormTokenSize,
  shouldSnapshotBeastSize,
} from "./changer-forms.mjs";

const MODULE_ID = "draw-steel-ghostwire";

// Draw Steel copies ds.CONFIG.hero.defaultItems onto every new hero.
// Ghostwire swaps stock actions for street-themed copies with the same mechanics.
// 0.3.134 (H) — Draw Steel's **Heal** is deleted from the hero defaults and replaced by nothing.
//
// 0.3.130 swapped it for Field Triage, which handed all nine pregens and every new hero a 2-Reagent
// Medic maneuver. Field Triage is now Medic-only, granted by the Medic class advancement rather than
// by the universal default list, and there is no universal First Aid in Ghostwire at all — everyone
// else stabilises with Trauma Patches and medkits (see `scripts/consumable-use.mjs`).
const DEFAULT_ITEM_DELETES = ["Compendium.draw-steel.abilities.Item.2qWHDVB7SBS9anLB"];

const DEFAULT_ITEM_SWAPS = {
  // Ride -> Drive (vehicles, not mounts)
  "Compendium.draw-steel.abilities.Item.QXOkflcYF6DITJE3": `Compendium.${MODULE_ID}.abilities.Item.Xc5MebcXHYG1hdQR`,
  // Charge -> Rush
  "Compendium.draw-steel.abilities.Item.wNqJWJbgAbnJBqZf": `Compendium.${MODULE_ID}.abilities.Item.Od6u2idYoCRmoDYD`,
  // Defend -> Take Cover
  "Compendium.draw-steel.abilities.Item.fjtY7RKBGWx2u5tK": `Compendium.${MODULE_ID}.abilities.Item.1W0HIoL2SAcbTU6W`,
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
  for (const stock of DEFAULT_ITEM_DELETES) {
    if (!defaultItems.delete(stock)) console.warn(`${MODULE_ID} | ${stock} not found in hero default items; nothing to remove`);
  }
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
  // 0.3.136 (2) — Ghostwire-native passengers: heroes ride a machine token and move with it.
  // This is **not** scripts/mounts.mjs, which is weapon hardpoints; the two share no flag, lang key
  // or hook. Registered after registerMachines so the band / kind helpers it reads are live.
  registerPassengers();
  registerMachineSheet();
  registerStreetEye();
  registerKitGrants();
  registerSprites();
  registerAgents();
  registerVeilSummons();
  // 0.3.133 (A) — summon token art, plus the one-per-upgrade world pass that brings Actors and placed
  // tokens stamped from the old rows onto it. It only ever replaces art the module itself shipped.
  registerSummonArt();
  // 0.3.132 (D) — the other half of every summon. sprites.mjs, agents.mjs and veil-summons.mjs all
  // shipped a working decompile / dismiss engine reachable only from an item sheet; this puts a
  // one-click ability on the Abilities tab for sprites, elementals and spirits (Hacker Agents
  // already had one) and keeps it in sync with what the hero can actually summon. Registered after
  // the three engines so their exports are live before the first sync runs.
  registerDismissAbilities();
  // 0.3.132 (E) — the Elementalist's printed choices, which until this wave printed and then did
  // nothing: Elemental Shaping's three modes, an attunement the hero can actually hold (and which
  // types the nine class abilities whose text says "typed to attunement"), and the companion element
  // Zephyr and Boulder both ask for as they are summoned.
  registerElementalist();
  registerMods();
  // 0.3.139 (C) — registered after registerMods: both patch ActiveEffect#isSuppressed, and skillsofts
  // must wrap the mods getter (each one falls through to the descriptor it captured).
  registerSkillsofts();
  registerMounts();
  registerAbilitySfx();
  registerEquipmentUse();
  // 0.3.134 (B) — the 30 firearms renamed to maker + model. Rebuilding a pack renames the compendium
  // and nothing already in a world, so this is the GM-only `ready` pass that renames world Items,
  // embedded copies and the generated "Fire <weapon>" abilities. Registered after registerEquipmentUse
  // so a weapon armed on this load is already there when the rename walks the actor.
  registerWeaponRename();
  // 0.3.144 — the 21 ground chassis and 3 band templates renamed to Catalog Name · Maker · role, same
  // shape and same reason as the firearms above: a pack rebuild fixes the compendium and nothing a
  // Director already bought. Keyed by `_dsid`, so a chassis somebody named themselves keeps its name.
  registerVehicleRename();
  // 0.3.134 (H) — Field Triage is Medic-only now. The compendium and the pregens already are; this
  // is the GM-only `ready` pass that takes the 0.3.130 copies off existing non-Medic sheets.
  registerFieldTriage();
  // 0.3.134 (I/J) — the shared "Spend an immediate recovery?" prompt, and the two cards that use it.
  // registerRecoveryPrompt first: it owns the socket both of them answer on.
  registerRecoveryPrompt();
  registerRally();
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
  // 0.3.142 (D) — Director: Apply Biofeedback. Takes getWiredState so the macro reads the same
  // connection state the Wired Console and the Matrix Verbs already do, rather than a second copy.
  registerDirectorBiofeedback({ getWiredState });
  // 0.3.143 — the node applet's ICE package. It notices the four triggers, announces the Alert strip
  // and raises the Director confirm card; every apply it makes goes back through the 0.3.142
  // Biofeedback pipeline above, so there is still exactly one place that writes Stamina.
  registerWiredIce({ getWiredState, rollTotalFromMessage: powerRollTotalFromMessage });
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
  // 0.3.124 (B2) — the free Scout maneuver that *applies* Cover/Conceal, plus the Invisible status
  // its high tier buys. Registered after registerCoverConceal so COVER_CONCEAL_ID already exists.
  registerConceal();
  // 0.3.133 (B) — Take Cover, the universal Defend swap, now *applies* Cover/Conceal on use and drops
  // it again when the hero changes square. Registered after registerConceal so both cards write to the
  // one status through the same source list and neither can end the other's cover.
  registerTakeCover();
  // F14 — the positional sibling of F13. Same getTargetModifiers seam, opposite sign: Cover/Conceal
  // banes a ranged attacker, Flanking edges a melee one. It never double-counts Draw Steel's own
  // flanking edge — see the guard in scripts/flanking.mjs.
  registerFlanking();
  // F18 — benches are E1 Base Assets with one extra flag, so placement is already handled by
  // scripts/machines.mjs. This only owns the two benefits: the capped project slot and the edge.
  registerWorkshopBenches();
  // 0.3.122 — Director: +1 heroic resource (Influence / Adrenaline / whatever the class names it).
  registerDirectorResource();
  // 0.3.122 — right-click Beast-Hide (and Layered Hide) to re-pick the damage immunity, because
  // Take Respite does not open Draw Steel's own effectGrant chooser in practice.
  registerTraitRepick();
  // 0.3.122 — worn armor finally enables its Stamina band, and the locked sheet's Stamina pool says
  // which sources built the max. Registered after the sheet patches above so the context-menu entries
  // sit alongside them rather than fighting them.
  registerStamina();
  // 0.3.122 — On Fire / Leaking, Crippled and Systems Down, read off a machine's Integrity.
  registerMachineConditions();
  // 0.3.141 — the Chase HUD: the 0.3.138 chase round as an applet with its own phase clock. It never
  // touches Foundry Combat. Registered after registerMachineConditions: the HUD writes Integrity to
  // `system.stamina.value` and the condition statuses follow that write on their own.
  registerChaseHud();
  // 0.3.123 — the shared 20-foot glow behind Street Priest Blessed Light and Elementalist Cantrip.
  // Registered before registerCantrip so the Cantrip dialog can call straight into it.
  registerTokenLight();
  registerCantrip();
  // 0.3.123 — Light Pact gets Rebuke, Dark Pact gets Drain, and nobody ever has both.
  registerPactStrike();
  // 0.3.125 (E) — the *other* half of Medic Reagents. patchPersistentReagents() above already stops
  // combat resetting the pool and stops the per-turn drip; this caps every path that grants Reagents
  // at the echelon kit capacity, ships the Craft Reagents downtime project, and makes Improvise!
  // actually hand two back. Registered after registerConsumableUse so both AbilityModel#use patches
  // are in place and each one passes through to the next.
  registerReagents();
  // 0.3.126 (B) — guns spend rounds. Handgun 12 / SMG 30 / Longarm 20 / Shotgun 8 / Heavy 50, a
  // Reload maneuver that tops the magazine in one action, and the Stick-n-Shock rider. Like the two
  // above it this wraps AbilityModel#use: each patch recognises its own ability by flag and hands
  // everything else down to the one registered before it, so registration order is a chain, not a
  // priority. A gun with an empty magazine never reaches Draw Steel's roll dialog at all.
  registerAmmo();
  // 0.3.127 (A) — and Blast grenades stop being single-target free strikes. One shared Throw, a
  // 15-foot circle the player places before the roll, and a Reflex save read Low / Mid / High.
  registerGrenades();
  // 0.3.127 (D) / 0.3.131 (A) — Ghostwire's own gun / spell / melee / grenade hit FX. Fires on the
  // ability *result*, where B40 fires on the ability *use*, and depends on no other module: the
  // built-in beat is additive sprites off assets/fx/ (generated by tools/make-fx-assets.mjs) with
  // a PIXI-version-agnostic vector floor underneath it, and it is relayed to every client on the
  // scene rather than drawn only for whoever rolled. Sequencer and JB2A make it prettier when they
  // are present; Automated Animations is not involved either way.
  registerHitFx();
  // 0.3.128 (C) — the loot 0.3.127 (E) embedded on 51 bestiary NPCs, on the sheet where a Director
  // can see it and drag it. Draw Steel gives an NPC no Equipment tab, so this is a Ghostwire panel on
  // the Features tab rather than a fight with the system's own sheet parts.
  registerNpcLoot();
  // 0.3.128 (D) — one Mark, four sources. You! / Spot Target / Hard Tag / Commander Mark all apply a
  // real Active Effect on use, show an icon on the token, and grant their edge to the creatures the
  // ability's own text names — not to everyone who happens to be shooting at the marked target.
  // Registered last of the AbilityModel#use chain so every other patch above has already seen the use.
  registerMark();
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
      // Installed, running deck programs and payloads that name this ability (B20d, scripts/mods.mjs),
      // plus running skillsofts that name it (0.3.139 C, scripts/skillsofts.mjs — this is where the
      // old RCC-autosoft edge went), plus the Jump-In weapon-lock edge and Pilot and Gunner's extra
      // edge on Rigged Fire (0.3.114).
      const { edges, banes } = abilityPowerRollModifiers({
        wired,
        hasHacking: !!actor.system.skills?.value?.has?.("hacking"),
        softwareEdges: softwareEdges(actor, dsid) + skillsoftEdges(actor, dsid),
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
  if (!actor) return;
  await syncChangerFormArt(actor, form);
  await syncChangerFormTokenSize(actor, form);
}

// 0.3.122 — the canvas footprint half of a form swap. A Rat-lineage Changer in Beast Form is a rat:
// `rat-lineage-trait.json` already overrides the *rules* size to 1S, and this is the same fact on the
// grid. Human and Hybrid restore the footprint the token had before the first Beast swap, so a
// Director's own 2×2 frame is never silently rewritten to 1×1.
//
// Lineage is read from `flags.<module>.changerLineage` on the lineage trait Item — the flag the
// chargen warning in this file and the lineage pack rows already use. No parallel flag.
const changerLineageOf = actor => [...(actor?.items ?? [])]
  .map(item => item.getFlag?.(MODULE_ID, "changerLineage"))
  .find(Boolean) ?? null;

async function syncChangerFormTokenSize(actor, form) {
  const lineage = changerLineageOf(actor);
  const proto = actor.isToken ? null : actor.prototypeToken;
  const reference = proto ?? actor.token;
  const changer = actor.getFlag(MODULE_ID, "changer") ?? {};
  if (shouldSnapshotBeastSize({ lineage, form, stored: changer.baseTokenSize, current: reference })) {
    await actor.setFlag(MODULE_ID, "changer.baseTokenSize", {
      width: Number(reference?.width) || 1,
      height: Number(reference?.height) || 1,
    });
  }
  const base = actor.getFlag(MODULE_ID, "changer")?.baseTokenSize ?? null;
  const size = changerFormTokenSize({ lineage, form, base });
  if (!size) return;

  if (proto && ((proto.width !== size.width) || (proto.height !== size.height))) {
    await actor.update({ "prototypeToken.width": size.width, "prototypeToken.height": size.height });
  }
  const tokens = actor.isToken ? [actor.token] : actor.getActiveTokens(false, true);
  for (const placed of tokens) {
    if (placed && ((placed.width !== size.width) || (placed.height !== size.height))) {
      await placed.update({ width: size.width, height: size.height });
    }
  }
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
  // 0.3.122 — Trade Cant is free for every hero. Additive: whatever the create data already carries
  // (a drag from a compendium hero, a duplicate with a full language list) keeps every entry it had.
  const languages = new Set(foundry.utils.getProperty(data, "system.biography.languages") ?? []);
  if (!languages.has(TRADE_CANT_KEY)) {
    languages.add(TRADE_CANT_KEY);
    updates["system.biography.languages"] = [...languages];
  }
  actor.updateSource(updates);
});

// Existing worlds: give every hero Trade Cant once. Flagged so a player who deliberately drops it
// is not handed it back every load — the lock is "free at creation", not "impossible to remove".
Hooks.once("ready", async () => {
  if (!game.user.isGM) return;
  let granted = 0;
  for (const actor of game.actors) {
    if ((actor.type !== "hero") || !actor.isOwner) continue;
    if (actor.getFlag(MODULE_ID, "tradeCantGranted")) continue;
    const languages = new Set(actor.system.biography?.languages ?? []);
    const update = { [`flags.${MODULE_ID}.tradeCantGranted`]: true };
    if (!languages.has(TRADE_CANT_KEY)) {
      languages.add(TRADE_CANT_KEY);
      update["system.biography.languages"] = [...languages];
      granted += 1;
    }
    await actor.update(update);
  }
  if (granted) console.log(`${MODULE_ID} | granted free Trade Cant to ${granted} hero(es)`);
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
// Matrix before mod: deck programs and payloads carry both, and the matrix flag has their ¥ and echelon (B20d).
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
//
// 0.3.122 splits the box in two. The three **form buttons** stay here, on the Stats tab, because
// swapping form is a maneuver a player takes mid-fight and the first page is where they are looking.
// The **art pickers** moved to the Biography tab: R2 (0.3.121) doubled them — a portrait picker and a
// round-token picker for each of three forms — and six thumbnails pushed Stamina and the
// characteristics below the fold. Art is a once-per-character job, so Biography is where it belongs.
// Both halves read the same `flags.<module>.changer` keys and both end in syncChangerFormArt.

/** Every Changer form effect on this hero, flat and grouped. Empty groups mean "not a Changer". */
function changerFormEffects(actor) {
  const formEffects = [...actor.allApplicableEffects()].filter(e => CHANGER_FORMS.includes(e.getFlag(MODULE_ID, "changerForm")));
  return { formEffects, effects: Object.groupBy(formEffects, e => e.getFlag(MODULE_ID, "changerForm")) };
}

Hooks.on("renderDrawSteelHeroSheet", (app, element) => {
  const stats = element.querySelector("section.tab[data-tab='stats']");
  if (!stats || stats.querySelector(".ghostwire-changer-forms")) return;
  const actor = app.document;
  const { formEffects, effects } = changerFormEffects(actor);
  if (foundry.utils.isEmpty(effects)) return;
  const isActive = form => effects[form]?.some(e => !e.disabled);
  const active = CHANGER_FORMS.find(isActive);

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

  // One line so nobody hunts for the pickers that used to sit right here.
  const pointer = document.createElement("p");
  pointer.className = "hint ghostwire-changer-art-pointer";
  pointer.textContent = game.i18n.localize("GHOSTWIRE.Peoples.Changer.Forms.Art.MovedHint");
  fieldset.append(pointer);

  const anchor = stats.querySelector(".ghostwire-wired") ?? stats.querySelector(".ghostwire-integrity")
    ?? stats.querySelector("fieldset.resources");
  if (anchor) anchor.after(fieldset);
  else stats.prepend(fieldset);
});

// Hero sheet, Biography tab: the per-form portrait and round-token pickers (0.3.122 — moved off Stats).
Hooks.on("renderDrawSteelHeroSheet", (app, element) => {
  const biography = element.querySelector("section.tab[data-tab='biography']");
  if (!biography || biography.querySelector(".ghostwire-changer-form-art")) return;
  const actor = app.document;
  const { effects } = changerFormEffects(actor);
  if (foundry.utils.isEmpty(effects)) return;
  const isActive = form => effects[form]?.some(e => !e.disabled);
  const art = actor.getFlag(MODULE_ID, "changer") ?? {};

  const fieldset = document.createElement("fieldset");
  fieldset.className = "ghostwire-changer-forms ghostwire-changer-art";
  const legend = document.createElement("legend");
  legend.textContent = game.i18n.localize("GHOSTWIRE.Peoples.Changer.Forms.Art.Name");
  legend.dataset.tooltip = game.i18n.localize("GHOSTWIRE.Peoples.Changer.Forms.Art.Hint");
  fieldset.append(legend);

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
  biography.append(fieldset);
});
