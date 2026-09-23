// Rigger vertical (0.3.105): Deploy & Command picker, Jump-In (Jacked In + meat inert),
// biofeedback / Uptime drain, Facility Rigger Home Ground edge.
// Fleet refuse + chassis stamp live in machines.mjs deployMachine.

import { WIRED_STATUS_DEFS } from "./wired-state.mjs";
import {
  machineBand,
  deployMachine,
  recallMachine,
  deployedMachine,
  fleetSizeCap,
  fieldedMachineCount,
  isJumpInCapable,
  isMachineKindDocument,
} from "./machines.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const UI = "GHOSTWIRE.Summons.Machines.UI";
const MEAT_INERT = "ghostwire-meat-inert";
const HOME_GROUND_EDGE = "ghostwire-home-ground-edge";

export function ownedMachineItems(actor) {
  if (!(actor instanceof Actor)) return [];
  return [...actor.items].filter(item => !!item.getFlag(MODULE_ID, "vehicle") || !!machineBand(item));
}

async function setJackedIn(actor, active) {
  for (const [key, status] of Object.entries(WIRED_STATUS_DEFS)) {
    if (key === "jackedIn") continue;
    if (actor.statuses.has(status.id)) await actor.toggleStatusEffect(status.id, { active: false });
  }
  await actor.toggleStatusEffect(WIRED_STATUS_DEFS.jackedIn.id, { active: !!active });
  await actor.update({
    [`flags.${MODULE_ID}.wired`]: {
      connected: true,
      immersed: !!active,
      state: active ? "jackedIn" : "disconnected",
    },
  });
}

function meatInertEffect(originUuid) {
  return {
    name: game.i18n.localize(`${UI}.MeatInert`),
    img: "icons/svg/sleep.svg",
    origin: originUuid,
    disabled: false,
    transfer: false,
    statuses: [MEAT_INERT],
    description: game.i18n.localize(`${UI}.MeatInertHint`),
    flags: { [MODULE_ID]: { meatInert: true } },
    changes: [],
  };
}

export function isJumpedInto(machineActor) {
  return !!machineActor?.getFlag(MODULE_ID, "jumpedInBy");
}

export async function jumpIn(pilot, machineActor) {
  if (!(pilot instanceof Actor) || !(machineActor instanceof Actor)) return false;
  const machine = machineActor.getFlag(MODULE_ID, "machine") ?? {};
  if (!isJumpInCapable(machineActor)) {
    ui.notifications.warn(game.i18n.format(`${UI}.JumpInNotCapable`, { name: machineActor.name }));
    return false;
  }
  const prior = pilot.getFlag(MODULE_ID, "jumpedInto");
  if (prior) {
    const old = await fromUuid(prior);
    if (old) await old.unsetFlag(MODULE_ID, "jumpedInBy");
  }
  await setJackedIn(pilot, true);
  const existing = pilot.effects.filter(e => e.getFlag(MODULE_ID, "meatInert"));
  if (existing.length) await pilot.deleteEmbeddedDocuments("ActiveEffect", existing.map(e => e.id));
  await pilot.createEmbeddedDocuments("ActiveEffect", [meatInertEffect(machineActor.uuid)]);
  await pilot.setFlag(MODULE_ID, "jumpedInto", machineActor.uuid);
  await machineActor.setFlag(MODULE_ID, "jumpedInBy", pilot.uuid);
  if (machine.beacon || machine.homeGround) await ensureHomeGroundEdge(pilot, machineActor);
  ui.notifications.info(game.i18n.format(`${UI}.JumpInOk`, { pilot: pilot.name, machine: machineActor.name }));
  return true;
}

const JUMP_IN_ABILITY_DSID = "jump-in-signature-platform";

function uniqueActors(list) {
  const seen = new Set();
  const out = [];
  for (const actor of list) {
    if (!actor) continue;
    const id = actor.id ?? actor.uuid;
    if (id && seen.has(id)) continue;
    if (id) seen.add(id);
    out.push(actor);
  }
  return out;
}

/**
 * Machines a Jump-In can land on, most specific first.
 * A targeted machine token beats a controlled one, which beats every fielded owned machine.
 * Non-machines in the target set are ignored so a targeted hero falls through to the fielded frame.
 */
export function jumpInCandidates({ targets = [], controlled = [], fielded = [] } = {}) {
  const machines = list => uniqueActors(list.filter(actor => isMachineKindDocument(actor)));
  const targeted = machines(targets);
  if (targeted.length) return targeted;
  const held = machines(controlled);
  if (held.length) return held;
  return machines(fielded);
}

/**
 * Whether an ability use may roll. One incapable machine is a denial, not a roll.
 * Several machines and none targeted is also a denial — guessing would jack the wrong frame.
 * @param {object[]} candidates
 * @param {{ capable?: (actor: object) => boolean }} [options]
 */
export function jumpInUsePlan(candidates, { capable = () => false } = {}) {
  const list = Array.isArray(candidates) ? candidates : [];
  if (!list.length) return { proceed: false, reason: "none" };
  if (list.length > 1) return { proceed: false, reason: "many" };
  const machine = list[0];
  if (!capable(machine)) return { proceed: false, reason: "incapable", machine };
  return { proceed: true, machine };
}

/** Lang key under GHOSTWIRE.Summons.Machines.UI for a refused plan, or null when the use may roll. */
export function jumpInDenialKey(plan) {
  if (!plan || plan.proceed) return null;
  if (plan.reason === "incapable") return "JumpInNotCapable";
  if (plan.reason === "many") return "JumpInPickOne";
  return "JumpInNoTarget";
}

function tokenActors(tokens) {
  const out = [];
  for (const token of tokens ?? []) {
    const actor = token?.actor ?? token?.document?.actor ?? null;
    if (actor) out.push(actor);
  }
  return out;
}

function planJumpInUse(pilot) {
  return jumpInUsePlan(jumpInCandidates({
    targets: tokenActors(game.user?.targets),
    controlled: tokenActors(canvas?.tokens?.controlled),
    fielded: ownedMachineItems(pilot).map(item => deployedMachine(item)).filter(Boolean),
  }), { capable: isJumpInCapable });
}

function denyJumpIn(plan) {
  const key = jumpInDenialKey(plan);
  if (key === "JumpInNotCapable") {
    ui.notifications.warn(game.i18n.format(`${UI}.JumpInNotCapable`, { name: plan.machine?.name ?? "" }));
  } else if (key) {
    ui.notifications.warn(game.i18n.localize(`${UI}.${key}`));
  }
  return null;
}

export async function jumpOut(pilot) {
  if (!(pilot instanceof Actor)) return;
  const machineUuid = pilot.getFlag(MODULE_ID, "jumpedInto");
  if (machineUuid) {
    const machine = await fromUuid(machineUuid);
    if (machine) await machine.unsetFlag(MODULE_ID, "jumpedInBy");
  }
  await pilot.unsetFlag(MODULE_ID, "jumpedInto");
  const inert = pilot.effects.filter(e => e.getFlag(MODULE_ID, "meatInert"));
  if (inert.length) await pilot.deleteEmbeddedDocuments("ActiveEffect", inert.map(e => e.id));
  const edge = pilot.effects.filter(e => e.getFlag(MODULE_ID, "homeGroundEdge"));
  if (edge.length) await pilot.deleteEmbeddedDocuments("ActiveEffect", edge.map(e => e.id));
  if (pilot.statuses.has(WIRED_STATUS_DEFS.jackedIn.id)) {
    await pilot.toggleStatusEffect(WIRED_STATUS_DEFS.jackedIn.id, { active: false });
  }
  ui.notifications.info(game.i18n.format(`${UI}.JumpOutOk`, { pilot: pilot.name }));
}

async function ensureHomeGroundEdge(pilot, beaconActor) {
  const isFacility = [...(pilot.items ?? [])].some(i =>
    i.system?._dsid === "facility-rigger"
    || (i.type === "subclass" && /facility/i.test(i.name)));
  if (!isFacility) return;
  const existing = pilot.effects.filter(e => e.getFlag(MODULE_ID, "homeGroundEdge"));
  if (existing.length) await pilot.deleteEmbeddedDocuments("ActiveEffect", existing.map(e => e.id));
  await pilot.createEmbeddedDocuments("ActiveEffect", [{
    name: game.i18n.localize(`${UI}.HomeGroundEdge`),
    img: "icons/svg/upgrade.svg",
    origin: beaconActor.uuid,
    disabled: false,
    transfer: false,
    statuses: [HOME_GROUND_EDGE],
    description: game.i18n.localize(`${UI}.HomeGroundEdgeHint`),
    flags: { [MODULE_ID]: { homeGroundEdge: true, beaconUuid: beaconActor.uuid } },
    changes: [],
  }]);
}

async function drainUptime(pilot, amount, reason) {
  const resource = pilot.system?.coreResource;
  if (!resource?.path || !resource?.target) {
    ui.notifications.warn(game.i18n.format(`${UI}.UptimeDrainManual`, {
      pilot: pilot.name, amount, reason,
    }));
    return;
  }
  const current = Number(foundry.utils.getProperty(resource.target, resource.path)) || 0;
  const next = Math.max(0, current - amount);
  await resource.target.update({ [resource.path]: next });
  ui.notifications.info(game.i18n.format(`${UI}.UptimeDrained`, {
    pilot: pilot.name, amount, current: next, reason,
  }));
}

export async function openDeployCommandPicker(actor) {
  if (!(actor instanceof Actor)) return;
  const machines = ownedMachineItems(actor);
  if (!machines.length) return ui.notifications.warn(game.i18n.localize(`${UI}.NoOwnedMachines`));
  const cap = fleetSizeCap(actor);
  const fielded = fieldedMachineCount(actor);
  const options = machines.map(item => {
    const deployed = deployedMachine(item);
    const vehicle = item.getFlag(MODULE_ID, "vehicle") ?? {};
    const kind = vehicle.baseAsset ? "baseAsset" : (vehicle.drone ? "drone" : "vehicle");
    const state = deployed
      ? game.i18n.localize(`${UI}.StatusDeployedShort`)
      : game.i18n.localize(`${UI}.StatusStowedShort`);
    return `<option value="${item.id}">${foundry.utils.escapeHTML(item.name)} [${kind}] — ${state}</option>`;
  }).join("");

  const content = `
    <form class="ghostwire-deploy-command flexcol">
      <p>${game.i18n.format(`${UI}.FleetStatus`, { fielded, cap })}</p>
      <label>${game.i18n.localize(`${UI}.PickMachine`)}
        <select name="itemId">${options}</select>
      </label>
      <p class="hint">${game.i18n.localize(`${UI}.DeployCommandHint`)}</p>
    </form>`;

  const result = await foundry.applications.api.DialogV2.wait({
    window: { title: game.i18n.localize(`${UI}.DeployCommandTitle`) },
    content,
    buttons: [
      {
        action: "deploy",
        label: game.i18n.localize(`${UI}.Deploy`),
        icon: "fa-solid fa-location-dot",
        default: true,
        callback: (_e, button) => ({ action: "deploy", itemId: button.form.elements.itemId.value }),
      },
      {
        action: "command",
        label: game.i18n.localize(`${UI}.Command`),
        icon: "fa-solid fa-satellite-dish",
        callback: (_e, button) => ({ action: "command", itemId: button.form.elements.itemId.value }),
      },
      {
        action: "jumpIn",
        label: game.i18n.localize(`${UI}.JumpIn`),
        icon: "fa-solid fa-plug",
        callback: (_e, button) => ({ action: "jumpIn", itemId: button.form.elements.itemId.value }),
      },
      { action: "cancel", label: game.i18n.localize("Cancel"), icon: "fa-solid fa-xmark" },
    ],
  });
  if (!result || result === "cancel" || !result.itemId) return;
  const item = actor.items.get(result.itemId);
  if (!item) return;
  if (result.action === "deploy") {
    if (deployedMachine(item)) {
      return ui.notifications.warn(game.i18n.format(`${UI}.AlreadyDeployed`, { name: item.name }));
    }
    return deployMachine(item);
  }
  if (result.action === "command") {
    const deployed = deployedMachine(item);
    if (!deployed) {
      return ui.notifications.warn(game.i18n.format(`${UI}.NotDeployed`, { name: item.name }));
    }
    deployed.sheet?.render(true);
    ui.notifications.info(game.i18n.format(`${UI}.CommandOpen`, { name: deployed.name }));
    return deployed;
  }
  if (result.action === "jumpIn") {
    let deployed = deployedMachine(item);
    if (!deployed) deployed = await deployMachine(item);
    // jumpIn warns and returns false when the frame is not capable. Either way this action
    // is finished: the caller must not fall through into Deploy & Command's power roll.
    if (deployed) await jumpIn(actor, deployed);
    return { action: "jumpIn" };
  }
}

function patchDeployAndCommandUse() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? globalThis.ds?.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use missing; Deploy & Command picker not hooked`);
    return;
  }
  const prior = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    const dsid = this._dsid ?? this.parent?.system?._dsid;
    // Jump-In (Signature Platform) is a real power roll. The sheet never called jumpIn, so a
    // non-capable Bulldog rolled, posted a card, and left Jacked In untouched.
    if ((dsid === JUMP_IN_ABILITY_DSID) && this.actor) {
      const plan = planJumpInUse(this.actor);
      if (!plan.proceed) return denyJumpIn(plan);
      const message = await prior.call(this, config, dialogOptions, messageOptions);
      if (!message) return message;
      await jumpIn(this.actor, plan.machine);
      return message;
    }
    if ((dsid === "deploy-and-command") && this.actor) {
      const picked = await openDeployCommandPicker(this.actor);
      if (picked?.action === "jumpIn") return null;
    }
    return prior.call(this, config, dialogOptions, messageOptions);
  };
}

function registerJumpInDamageHooks() {
  Hooks.on("updateActor", async (actor, changes, _options, userId) => {
    if (userId !== game.user.id) return;
    const stamina = foundry.utils.getProperty(changes, "system.stamina.value");
    if (stamina === undefined) return;
    const pilotUuid = actor.getFlag(MODULE_ID, "jumpedInBy");
    if (!pilotUuid) {
      actor._ghostwireLastStamina = Number(stamina);
      return;
    }
    const pilot = await fromUuid(pilotUuid);
    if (!(pilot instanceof Actor)) return;
    const newVal = Number(stamina);
    const last = actor._ghostwireLastStamina;
    actor._ghostwireLastStamina = newVal;
    if (last != null && newVal >= last) return;
    const lost = last != null ? Math.max(1, last - newVal) : 1;
    await drainUptime(pilot, 1, game.i18n.format(`${UI}.MachineHit`, { name: actor.name }));
    const buffered = [...(pilot.items ?? [])].some(i => i.system?._dsid === "ghost-rein");
    if (!buffered) {
      const cur = Number(pilot.system?.stamina?.value ?? 0);
      if (Number.isFinite(cur) && cur > 0) {
        await pilot.update({ "system.stamina.value": Math.max(0, cur - 1) });
        ui.notifications.warn(game.i18n.format(`${UI}.Biofeedback`, { pilot: pilot.name, amount: 1 }));
      } else {
        ui.notifications.warn(game.i18n.format(`${UI}.BiofeedbackManual`, { pilot: pilot.name, lost }));
      }
    }
  });
}

export function registerRiggerVertical() {
  CONFIG.statusEffects[MEAT_INERT] ??= {
    id: MEAT_INERT,
    name: `${UI}.MeatInert`,
    img: "icons/svg/sleep.svg",
  };
  CONFIG.statusEffects[HOME_GROUND_EDGE] ??= {
    id: HOME_GROUND_EDGE,
    name: `${UI}.HomeGroundEdge`,
    img: "icons/svg/upgrade.svg",
  };

  patchDeployAndCommandUse();
  registerJumpInDamageHooks();

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      fleetSizeCap,
      fieldedMachineCount,
      ownedMachineItems,
      deployMachine,
      recallMachine,
      openDeployCommandPicker,
      jumpIn,
      jumpOut,
      isJumpedInto,
    };
  }
  console.log(`${MODULE_ID} | Rigger vertical: Deploy&Command / Jump-In registered`);
}
