// 0.3.122 — machine damage conditions, read straight off Integrity.
//
// Michael lock 2026-09-23. A deployed machine's Integrity **is** its Stamina (scripts/machines.mjs
// stamps `system.stamina` from the chassis band plus the armor kit), and three bands of damage now
// carry a condition:
//
//   * **On Fire / Leaking** at **50%** or less — the frame is venting something.
//   * **Crippled** at **25%** or less — three quarters gone.
//   * **Systems Down** at **0%** — it is a wreck.
//
// One band at a time, worst wins: 0% beats 25% beats 50% beats healthy. Stalled and Dead-stick are
// explicitly **out of scope** for this ship and are not modelled anywhere in this file.
//
// The bands are statuses (`CONFIG.statusEffects`, the same door the Wired rungs use in
// scripts/module.mjs), so a Director sees them on the token as well as on the sheet, and the Machine
// sheet's first page prints the current band as a `Condition:` chip.
//
// Helpers above the "Foundry registration" divider are Foundry-free so
// tools/machine-conditions-smoke.mjs can run them in Node.

import { isDeployedMachineActor } from "./machines.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Summons.Machines.Conditions";

/**
 * The bands, worst first. `atOrBelow` is a fraction of max Integrity.
 *
 * `onFire` is one band with two names on the card ("On Fire / Leaking") because it is one mechanical
 * state — what leaks out depends on whether the frame runs on fuel or fluid, and that is the
 * Director's call at the table, not a second status to track.
 */
export const MACHINE_CONDITIONS = Object.freeze([
  { id: "systemsDown", status: "ghostwire-systems-down", _id: "gwSystemsDown000", atOrBelow: 0, img: "icons/svg/skull.svg" },
  { id: "crippled", status: "ghostwire-crippled", _id: "gwCrippled000000", atOrBelow: 0.25, img: "icons/svg/downgrade.svg" },
  { id: "onFire", status: "ghostwire-on-fire", _id: "gwOnFireLeaking0", atOrBelow: 0.5, img: "icons/svg/fire.svg" },
]);

/** Status defs in the shape CONFIG.statusEffects wants. */
export const MACHINE_CONDITION_STATUS_DEFS = Object.freeze(Object.fromEntries(MACHINE_CONDITIONS.map(band => [
  band.id,
  { id: band.status, _id: band._id, name: `${L}.${band.id}.Label`, img: band.img },
])));

export const MACHINE_CONDITION_IDS = Object.freeze(MACHINE_CONDITIONS.map(band => band.id));

/**
 * The worst band an Integrity reading falls into, or null when the frame is healthy.
 *
 * A machine with no max Integrity (never deployed, or a Base Asset with no chassis band) is **not**
 * Systems Down — 0/0 is "unrated", not "destroyed", and flagging every door lock in the world as a
 * wreck would be worse than saying nothing.
 *
 * @param {object} integrity
 * @param {number} integrity.value
 * @param {number} integrity.max
 * @returns {"systemsDown"|"crippled"|"onFire"|null}
 */
export function machineConditionFor({ value, max } = {}) {
  const ceiling = Number(max);
  const current = Number(value);
  if (!Number.isFinite(ceiling) || (ceiling <= 0)) return null;
  if (!Number.isFinite(current)) return null;
  const fraction = Math.max(0, current) / ceiling;
  for (const band of MACHINE_CONDITIONS) {
    if (fraction <= band.atOrBelow) return band.id;
  }
  return null;
}

/**
 * Which condition statuses should be on and which off.
 * @param {string|null} condition  machineConditionFor() result.
 * @returns {{on: string[], off: string[]}}  Status ids.
 */
export function machineConditionStatusPlan(condition) {
  const on = [];
  const off = [];
  for (const band of MACHINE_CONDITIONS) {
    (band.id === condition ? on : off).push(band.status);
  }
  return { on, off };
}

/** The percentage a sheet chip should print, rounded the way a Director reads it. */
export function integrityPercent({ value, max } = {}) {
  const ceiling = Number(max);
  if (!Number.isFinite(ceiling) || (ceiling <= 0)) return null;
  return Math.max(0, Math.round((Math.max(0, Number(value) || 0) / ceiling) * 100));
}

/* ============================================ Foundry registration */

/** Integrity as the machine Actor stores it. */
export function machineIntegrity(actor) {
  const stamina = actor?.system?.stamina ?? {};
  return { value: Number(stamina.value) || 0, max: Number(stamina.max) || 0 };
}

/** The band this machine is in right now, or null. */
export function machineCondition(actor) {
  return machineConditionFor(machineIntegrity(actor));
}

/** The localized chip text for the Machine sheet: "On Fire / Leaking (38%)" or "Operational". */
export function machineConditionLabel(actor) {
  const condition = machineCondition(actor);
  const percent = integrityPercent(machineIntegrity(actor));
  if (!condition) {
    return percent === null
      ? game.i18n.localize(`${L}.unrated.Label`)
      : game.i18n.format(`${L}.healthy.Chip`, { percent });
  }
  return game.i18n.format(`${L}.${condition}.Chip`, {
    label: game.i18n.localize(`${L}.${condition}.Label`),
    percent: percent ?? 0,
  });
}

/** Put the right condition status on this machine and take the other two off. */
export async function syncMachineCondition(actor) {
  if (!isDeployedMachineActor(actor) || !actor.isOwner) return false;
  const { on, off } = machineConditionStatusPlan(machineCondition(actor));
  let wrote = false;
  for (const status of off) {
    if (!actor.statuses?.has?.(status)) continue;
    await actor.toggleStatusEffect(status, { active: false });
    wrote = true;
  }
  for (const status of on) {
    if (actor.statuses?.has?.(status)) continue;
    await actor.toggleStatusEffect(status, { active: true });
    wrote = true;
  }
  return wrote;
}

export function registerMachineConditions() {
  for (const def of Object.values(MACHINE_CONDITION_STATUS_DEFS)) {
    CONFIG.statusEffects[def.id] = { ...def };
  }

  // Integrity changes land as `system.stamina` updates on the machine Actor — the Machine sheet's
  // own fields, damage applied from a chat card, and the deploy / armor-kit restamp all take that
  // road, so one hook covers every one of them.
  Hooks.on("updateActor", async (actor, changes, options, userId) => {
    if ((userId !== game.user.id) || !foundry.utils.hasProperty(changes, "system.stamina")) return;
    await syncMachineCondition(actor);
  });

  // A freshly deployed machine starts at full Integrity, but a re-deploy of a damaged frame does not.
  Hooks.on("createActor", async (actor, options, userId) => {
    if (userId !== game.user.id) return;
    await syncMachineCondition(actor);
  });

  Hooks.once("ready", async () => {
    if (!game.user.isGM) return;
    let synced = 0;
    for (const actor of game.actors) {
      if (await syncMachineCondition(actor)) synced += 1;
    }
    if (synced) console.log(`${MODULE_ID} | machine conditions synced on ${synced} machine(s)`);
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        machineCondition,
        machineConditionLabel,
        syncMachineCondition,
      };
    }
  });

  console.log(`${MODULE_ID} | Machine conditions registered (${MACHINE_CONDITIONS.map(b => b.status).join(" / ")})`);
}
