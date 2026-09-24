// S9 (0.3.116) — the player-facing Wire-state toggle.
//
// Michael lock 2026-09-23: a Rigger picks among **Jumped In**, **Linked** and **Overlay** from one
// door, and it writes **the same flags Jump-In / Deploy / the Wired Console already write**. There
// is deliberately no new state, no new status id and no parallel flag namespace here — this file
// owns a *plan* and a *door*, and hands every write to code that already existed:
//
//   * Linked / Overlay          → `setWiredState()` in scripts/module.mjs (statuses
//                                 `ghostwire-linked` / `ghostwire-overlay`, mirrored to
//                                 `flags.<module>.wired`).
//   * Jumped In                 → `jumpIn()` in scripts/rigger-vertical.mjs (`jumpedInto` /
//                                 `jumpedInBy`, the `ghostwire-meat-inert` Active Effect, and the
//                                 `ghostwire-jacked-in` status via its own `setJackedIn`).
//   * Leaving Jumped In         → `jumpOut()`, the same cleanup the Jump-Out path runs, *then* the
//                                 chosen landing state. The pilot is never left holding `jumpedInto`
//                                 with no seat.
//
// **Jumped In is not Jacked In.** Jacked In is a Matrix state a deck reaches with no machine in it;
// Jumped In is Jacked In *plus a seat*. Both carry `ghostwire-jacked-in`, so both are full
// Connected for the F12 chrome-strike / matrix Pulse path (Overlay or Jacked In). Only Jumped In
// carries meat-inert — that is the one asymmetry, and `wireTogglePlan` is the only place that says so.
//
// Two doors, both calling the same picker: the token HUD (the pattern wired-kit / taint / locker
// already use) and a chip in the hero sheet header (the pattern taint already uses). Either can be
// switched off in settings; the plan helpers below do not care which one fired.

import { WIRED_STATUS_DEFS, isFullyConnected, isOnNet } from "./wired-state.mjs";
import { actorHasConnectInterface } from "./wired-console-verbs.mjs";
import { deployedMachine, isJumpInCapable } from "./machines.mjs";
import { jumpIn, jumpInCandidates, jumpInDenialKey, jumpInUsePlan, jumpOut, ownedMachineItems } from "./rigger-vertical.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.WireToggle";
const MEAT_INERT = "ghostwire-meat-inert";

/**
 * The four rungs the player-facing toggle offers, in ladder order (0.3.122).
 *
 * **Michael lock 2026-09-23 — Disconnect is a rung.** Through 0.3.121 this list was three long and
 * the file argued hard that Disconnected must stay off it: Connect was the only on-ramp, Jack Out
 * the only off-ramp. Two locks retired that argument in one ship — Disconnect became a first-class
 * target, and the cycle macro (`cycleWireState`) walks Disconnected → Linked → Overlay → Jumped In
 * → Disconnected, which needs Disconnected to be both a source and a destination.
 *
 * What did **not** change is the thing the old doctrine was actually protecting. Going **on**-net
 * still needs a Wired interface — the plan takes `hasInterface` and refuses `noInterface` without
 * one, exactly as the Connect verb does in scripts/module.mjs. Coming **off**-net needs nothing:
 * you can always pull the plug.
 */
export const WIRE_TOGGLE_OPTIONS = Object.freeze(["disconnected", "linked", "overlay", "jumpedIn"]);

/** The cycle the 0.3.122 macro walks, one rung per use, wrapping at the end. */
export const WIRE_CYCLE_ORDER = WIRE_TOGGLE_OPTIONS;

/** Reasons a plan can refuse, each with a lang key under `GHOSTWIRE.WireToggle.Refuse`. */
export const WIRE_TOGGLE_REFUSALS = Object.freeze(["same", "unknown", "notConnected", "noInterface", "noMachine"]);

/**
 * What the player should see as their current rung.
 *
 * A pilot in a seat reads **Jumped In** even though the status underneath is `ghostwire-jacked-in`,
 * because that is the thing they chose. A deck jockey with no seat keeps reading **Jacked In**.
 *
 * @param {object} opts
 * @param {string} opts.state      getWiredState(actor) — disconnected | linked | overlay | jackedIn.
 * @param {boolean} opts.jumpedIn  The actor carries `flags.<module>.jumpedInto`.
 */
export function wireDisplayState({ state = "disconnected", jumpedIn = false } = {}) {
  return jumpedIn ? "jumpedIn" : state;
}

/** Meat-inert belongs to Jumped In and to nothing else. */
export function meatInertForDisplayState(display) {
  return display === "jumpedIn";
}

/**
 * Jumped In and Jacked In are both full Connected (F12 Pulse: Overlay or Jacked In).
 * Linked stays soft on-net and is not.
 */
export function isWireConnectedDisplay(display) {
  return display === "jumpedIn" || isFullyConnected(display);
}

/**
 * Plan one toggle. Pure — it performs nothing and touches no Foundry global.
 *
 * Legality, in the order it is checked:
 *  1. The target has to be one of the four rungs.
 *  2. Already there is a no-op, not a re-entry (re-running Jump-In would re-stamp meat-inert).
 *  3. **Disconnect is always allowed** from any on-net rung, and from the seat — leaving Jumped In
 *     runs `jumpOut()` first so the pilot never lands off-net still holding `jumpedInto`.
 *  4. Going **on**-net from Disconnected needs a Wired interface, the same gate the Connect verb
 *     applies in scripts/module.mjs. Without one this refuses `noInterface`; the toggle is a shorter
 *     road to Connect, never a way around it.
 *  5. Jumped In needs exactly one Jump-In-capable machine to land on.
 *
 * @param {object} opts
 * @param {string} opts.from          wireDisplayState of the actor now.
 * @param {string} opts.to            The rung the player picked.
 * @param {boolean} opts.hasMachine   A single capable machine resolved for Jump-In.
 * @param {boolean} opts.hasInterface The actor carries a Connect-capable Wired interface.
 * @returns {{ok: boolean, reason?: string, jumpOut: boolean, jumpIn: boolean,
 *            targetState: string|null, meatInert: boolean}}
 */
export function wireTogglePlan({ from = "disconnected", to = "", hasMachine = false, hasInterface = false } = {}) {
  const refuse = reason => ({ ok: false, reason, jumpOut: false, jumpIn: false, targetState: null, meatInert: false });
  if (!WIRE_TOGGLE_OPTIONS.includes(to)) return refuse("unknown");
  if (from === to) return refuse("same");

  const leaving = from === "jumpedIn";
  // Off-ramp: pulling the plug is free. Nothing is required of the hero to stop being on-net.
  if (to === "disconnected") {
    return { ok: true, jumpOut: leaving, jumpIn: false, targetState: "disconnected", meatInert: false };
  }

  // On-ramp: the hero has to own the hardware Connect would have used.
  const offNet = !isOnNet(from) && !leaving;
  if (offNet && !hasInterface) return refuse("noInterface");

  if (to === "jumpedIn") {
    if (!hasMachine) return refuse("noMachine");
    // jumpIn() owns the status write (setJackedIn) as well as the seat flags, so the plan asks for
    // no separate setWiredState — issuing one would fight it.
    return { ok: true, jumpOut: false, jumpIn: true, targetState: "jackedIn", meatInert: true };
  }
  return { ok: true, jumpOut: leaving, jumpIn: false, targetState: to, meatInert: false };
}

/**
 * The next rung in the 0.3.122 cycle: Disconnected → Linked → Overlay → Jumped In → Disconnected.
 *
 * A deck jockey reading plain **Jacked In** (Matrix Toggle's deepest rung, no seat) is not on this
 * ladder. They are one step past Overlay, so their next rung is the seat — which then refuses in the
 * ordinary way if they have no Jump-In-capable machine, rather than being silently rerouted.
 */
export function nextWireCycleState(display) {
  if (display === "jackedIn") return "jumpedIn";
  const index = WIRE_CYCLE_ORDER.indexOf(display);
  if (index < 0) return WIRE_CYCLE_ORDER[0];
  return WIRE_CYCLE_ORDER[(index + 1) % WIRE_CYCLE_ORDER.length];
}

/** Lang key under `GHOSTWIRE.WireToggle.Refuse` for a refused plan, or null when it may run. */
export function wireToggleRefusalKey(plan) {
  if (!plan || plan.ok) return null;
  const reason = plan.reason ?? "unknown";
  return WIRE_TOGGLE_REFUSALS.includes(reason) ? reason : "unknown";
}

/* -------------------------------------------- runtime */

function tokenActors(tokens) {
  const out = [];
  for (const token of tokens ?? []) {
    const actor = token?.actor ?? token?.document?.actor ?? null;
    if (actor) out.push(actor);
  }
  return out;
}

/**
 * The Jump-In plan for this door. Same precedence Jump-In (Signature Platform) uses: a targeted
 * machine beats a controlled one beats the fielded fleet, and "several, none targeted" is a
 * refusal rather than a guess — which is why this returns the whole plan, so a refusal can be
 * reported in Jump-In's own words instead of a second vocabulary for the same thing.
 */
export function jumpInSeatPlan(actor) {
  return jumpInUsePlan(jumpInCandidates({
    targets: tokenActors(game.user?.targets),
    controlled: tokenActors(canvas?.tokens?.controlled),
    fielded: ownedMachineItems(actor).map(item => deployedMachine(item)).filter(Boolean),
  }), { capable: isJumpInCapable });
}

/** The single capable machine a Jump-In would land on, or null. */
export function jumpInTarget(actor) {
  const plan = jumpInSeatPlan(actor);
  return plan.proceed ? plan.machine : null;
}

function currentDisplay(actor, getWiredState) {
  return wireDisplayState({
    state: getWiredState(actor),
    jumpedIn: !!actor?.getFlag?.(MODULE_ID, "jumpedInto"),
  });
}

function stateLabel(display) {
  return display === "jumpedIn"
    ? game.i18n.localize(`${L}.States.jumpedIn`)
    : game.i18n.localize(`GHOSTWIRE.Wired.States.${display}`);
}

async function announce(actor, from, to) {
  const line = game.i18n.format(`${L}.Chat.Changed`, {
    actor: actor.name,
    from: stateLabel(from),
    to: stateLabel(to),
  });
  ui.notifications.info(line);
  if (!game.settings.get(MODULE_ID, "wireStateToggleChat")) return;
  const hintKey = to === "jumpedIn" ? `${L}.Hints.jumpedIn` : `GHOSTWIRE.Wired.StateHints.${to}`;
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `<div class="ghostwire-wire-toggle-card state-${to}">`
      + `<p><strong>${game.i18n.localize(`${L}.Label`)}</strong> — ${foundry.utils.escapeHTML(line)}</p>`
      + `<p class="hint">${game.i18n.localize(hintKey)}</p></div>`,
    flags: { [MODULE_ID]: { wireToggle: to } },
  });
}

/**
 * Run one toggle end to end. Every write goes through the pre-existing helpers.
 * @returns {Promise<{ok: boolean, reason?: string, from: string, to: string}>}
 */
export async function applyWireState(actor, to, { getWiredState, setWiredState } = {}) {
  if (!(actor instanceof Actor)) return { ok: false, reason: "unknown", from: "", to };
  const from = currentDisplay(actor, getWiredState);
  const seat = to === "jumpedIn" ? jumpInSeatPlan(actor) : null;
  const machine = seat?.proceed ? seat.machine : null;
  const plan = wireTogglePlan({
    from,
    to,
    hasMachine: !!machine,
    // The same interface check the Connect verb runs (scripts/wired-console-verbs.mjs), not a copy.
    hasInterface: actorHasConnectInterface(actor),
  });

  if (!plan.ok) {
    const key = wireToggleRefusalKey(plan);
    // "Several machines and none targeted" and "that frame is not Jump-In capable" already have
    // Jump-In's own wording; reuse it rather than inventing a second vocabulary for the same thing.
    const jumpKey = (key === "noMachine") ? jumpInDenialKey(seat) : null;
    if (jumpKey) {
      ui.notifications.warn(game.i18n.format(`GHOSTWIRE.Summons.Machines.UI.${jumpKey}`, { name: seat.machine?.name ?? "" }));
    } else if (key && key !== "same") {
      ui.notifications.warn(game.i18n.format(`${L}.Refuse.${key}`, { actor: actor.name, state: stateLabel(from) }));
    }
    return { ok: false, reason: plan.reason, from, to };
  }

  // Leaving the seat: jumpOut() clears jumpedInto / jumpedInBy, deletes the meat-inert and
  // Home Ground effects, and drops ghostwire-jacked-in — exactly what Jump-Out does.
  if (plan.jumpOut) await jumpOut(actor);
  if (plan.jumpIn) {
    const landed = await jumpIn(actor, machine);
    if (!landed) return { ok: false, reason: "noMachine", from, to };
  } else if (plan.targetState) {
    await setWiredState(actor, plan.targetState);
  }

  // Belt and braces: meat-inert belongs to Jumped In only. jumpOut already deletes it, so this is a
  // no-op on every clean path — it exists so a half-finished earlier Jump-In cannot strand the body.
  if (!plan.meatInert) {
    const inert = (actor.effects ?? []).filter(effect => effect.statuses?.has?.(MEAT_INERT) || effect.getFlag?.(MODULE_ID, "meatInert"));
    if (inert.length) await actor.deleteEmbeddedDocuments("ActiveEffect", inert.map(effect => effect.id));
  }

  await announce(actor, from, to);
  return { ok: true, from, to };
}

/**
 * Step one actor one rung along the cycle (0.3.122). Everything it does goes through
 * `applyWireState`, so the Jump-In seat check, the interface check and the jumpOut() cleanup are the
 * same code the picker uses — this only decides *which* rung comes next.
 */
export async function cycleWireState(actor, api = {}) {
  if (!(actor instanceof Actor)) return { ok: false, reason: "unknown", from: "", to: "" };
  const from = currentDisplay(actor, api.getWiredState);
  return applyWireState(actor, nextWireCycleState(from), api);
}

/**
 * The 0.3.122 Director / player macro: every selected token cycles one rung, independently.
 *
 * Multi-select is deliberately forgiving — a Rigger with a drone takes the seat while the decker
 * beside them refuses for want of one, and that refusal (already toasted by `applyWireState`) does
 * not stop the rest of the selection from moving.
 */
export async function cycleWireStateForSelection(api = {}) {
  const actors = [];
  const seen = new Set();
  for (const token of canvas?.tokens?.controlled ?? []) {
    const actor = token?.actor ?? token?.document?.actor ?? null;
    if (!actor || seen.has(actor.uuid)) continue;
    seen.add(actor.uuid);
    actors.push(actor);
  }
  if (!actors.length) {
    ui.notifications.warn(game.i18n.localize(`${L}.Cycle.NoSelection`));
    return [];
  }
  const results = [];
  for (const actor of actors) {
    if (!canToggle(actor)) {
      ui.notifications.warn(game.i18n.format(`${L}.Cycle.NotHero`, { actor: actor.name }));
      results.push({ actor: actor.name, ok: false, reason: "unknown" });
      continue;
    }
    // Sequential on purpose: each cycle writes statuses and flags on its own actor, and a refusal
    // toast that arrives out of order is worse than a few milliseconds of wall clock.
    const result = await cycleWireState(actor, api);
    results.push({ actor: actor.name, ...result });
  }
  return results;
}

/* -------------------------------------------- the door */

function optionRow(display, option) {
  const label = stateLabel(option);
  const hint = option === "jumpedIn"
    ? game.i18n.localize(`${L}.Hints.jumpedIn`)
    : game.i18n.localize(`GHOSTWIRE.Wired.StateHints.${option}`);
  const current = option === display ? ` <em>(${game.i18n.localize(`${L}.Current`)})</em>` : "";
  return `<label class="ghostwire-wire-toggle-option">
    <input type="radio" name="wireState" value="${option}"${option === display ? " checked" : ""}>
    <span class="ghostwire-wire-toggle-name">${label}${current}</span>
    <span class="hint">${hint}</span>
  </label>`;
}

export async function openWireStatePicker(actor, { getWiredState, setWiredState } = {}) {
  if (!(actor instanceof Actor)) return null;
  const display = currentDisplay(actor, getWiredState);
  const machine = jumpInTarget(actor);
  const content = `<form class="ghostwire-wire-toggle flexcol">
    <p>${game.i18n.format(`${L}.Prompt`, { actor: foundry.utils.escapeHTML(actor.name), state: stateLabel(display) })}</p>
    ${WIRE_TOGGLE_OPTIONS.map(option => optionRow(display, option)).join("")}
    <p class="hint">${machine
      ? game.i18n.format(`${L}.SeatReady`, { name: foundry.utils.escapeHTML(machine.name) })
      : game.i18n.localize(`${L}.SeatNone`)}</p>
  </form>`;

  const picked = await foundry.applications.api.DialogV2.wait({
    window: { title: game.i18n.localize(`${L}.Title`) },
    content,
    buttons: [
      {
        action: "set",
        label: game.i18n.localize(`${L}.Set`),
        icon: "fa-solid fa-tower-broadcast",
        default: true,
        callback: (_event, button) => button.form.elements.wireState.value,
      },
      { action: "cancel", label: game.i18n.localize("Cancel"), icon: "fa-solid fa-xmark" },
    ],
  });
  if (!picked || picked === "cancel") return null;
  return applyWireState(actor, picked, { getWiredState, setWiredState });
}

function canToggle(actor) {
  return (actor?.type === "hero") && (actor.isOwner || game.user?.isGM);
}

function injectHud(hud, html, api) {
  if (!game.settings.get(MODULE_ID, "wireStateToggleHud")) return;
  const actor = hud.object?.actor;
  if (!canToggle(actor)) return;
  const root = html?.rootElement ?? html?.[0] ?? html;
  if (!root?.querySelector) return;
  const col = root.querySelector(".col.left") ?? root.querySelector(".left")
    ?? root.querySelector(".col.right") ?? root.querySelector(".right");
  if (!col || col.querySelector(".ghostwire-wire-toggle-hud")) return;
  const display = currentDisplay(actor, api.getWiredState);
  const btn = document.createElement("div");
  btn.className = `control-icon ghostwire-wire-toggle-hud state-${display}`;
  btn.dataset.tooltip = game.i18n.format(`${L}.Hud`, { state: stateLabel(display) });
  btn.innerHTML = `<i class="fa-solid fa-tower-broadcast"></i>`;
  btn.addEventListener("click", event => {
    event.preventDefault();
    openWireStatePicker(actor, api);
  });
  col.appendChild(btn);
}

function sheetRoot(app, element) {
  if (element?.querySelector) return element;
  if (element?.[0]?.querySelector) return element[0];
  if (app?.element?.querySelector) return app.element;
  return null;
}

function injectSheetChip(app, element, api) {
  if (!game.settings.get(MODULE_ID, "wireStateToggleSheet")) return;
  const actor = app?.document ?? app?.actor;
  if (!canToggle(actor)) return;
  const root = sheetRoot(app, element);
  if (!root || root.querySelector(".ghostwire-wire-toggle-chip")) return;
  const header = root.querySelector("[data-application-part='header']")
    ?? root.querySelector(".sheet-header")
    ?? root.querySelector(".window-content .profile");
  if (!header) return;

  const display = currentDisplay(actor, api.getWiredState);
  const button = document.createElement("button");
  button.type = "button";
  button.className = `ghostwire-wire-toggle-chip state-${display}`;
  button.dataset.tooltip = game.i18n.localize(`${L}.Hint`);
  button.innerHTML = `<i class="fa-solid fa-tower-broadcast"></i> <span>${stateLabel(display)}</span>`;
  button.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    openWireStatePicker(actor, api);
  });

  const name = header.querySelector(".document-name") ?? header.querySelector("h1");
  if (name) name.after(button);
  else header.append(button);
}

function registerSettings() {
  game.settings.register(MODULE_ID, "wireStateToggleHud", {
    name: `${L}.Settings.Hud.Name`, hint: `${L}.Settings.Hud.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
  });
  game.settings.register(MODULE_ID, "wireStateToggleSheet", {
    name: `${L}.Settings.Sheet.Name`, hint: `${L}.Settings.Sheet.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
  });
  game.settings.register(MODULE_ID, "wireStateToggleChat", {
    name: `${L}.Settings.Chat.Name`, hint: `${L}.Settings.Chat.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
  });
}

/**
 * @param {object} api
 * @param {(actor: Actor) => string} api.getWiredState  scripts/module.mjs — statuses are the truth.
 * @param {(actor: Actor, state: string) => Promise<void>} api.setWiredState  scripts/module.mjs.
 */
export function registerWireStateToggle({ getWiredState, setWiredState } = {}) {
  registerSettings();
  const api = { getWiredState, setWiredState };

  Hooks.on("renderTokenHUD", (hud, html) => injectHud(hud, html, api));
  Hooks.on("renderDrawSteelHeroSheet", (app, element) => injectSheetChip(app, element, api));
  // Fallback if a world still fires the generic actor-sheet hook for heroes.
  Hooks.on("renderActorSheet", (app, element) => injectSheetChip(app, element, api));

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      openWireStatePicker: actor => openWireStatePicker(actor, api),
      applyWireState: (actor, to) => applyWireState(actor, to, api),
      cycleWireState: actor => cycleWireState(actor, api),
      cycleWireStateForSelection: () => cycleWireStateForSelection(api),
      wireTogglePlan,
      wireDisplayState,
      nextWireCycleState,
      WIRE_TOGGLE_OPTIONS,
      WIRE_CYCLE_ORDER,
    };
  }
  console.log(`${MODULE_ID} | Wire-state toggle registered (${WIRE_TOGGLE_OPTIONS.join(" / ")}; statuses ${WIRED_STATUS_DEFS.linked.id} / ${WIRED_STATUS_DEFS.overlay.id} / ${WIRED_STATUS_DEFS.jackedIn.id})`);
}
