#!/usr/bin/env node
/**
 * S9 smoke (0.3.116): the player-facing Wire-state toggle.
 *
 * The point of this smoke is the lock "reuse the SAME flags, do not invent a parallel state
 * system". So as well as executing the plan helpers, it reads scripts/wire-state-toggle.mjs as
 * source and asserts what it does NOT contain: no new status id, no flag write of its own, no
 * second meat-inert. If a later pass re-implements any of that locally, this goes red.
 *
 * Run: node tools/wire-state-toggle-smoke.mjs
 * Does not need live Foundry.
 */
import { readFileSync } from "node:fs";
import {
  WIRE_TOGGLE_OPTIONS,
  WIRE_TOGGLE_REFUSALS,
  isWireConnectedDisplay,
  meatInertForDisplayState,
  wireDisplayState,
  wireTogglePlan,
  wireToggleRefusalKey,
} from "../scripts/wire-state-toggle.mjs";
import { WIRED_STATUS_DEFS, isFullyConnected, isOnNet } from "../scripts/wired-state.mjs";
import { atLeast } from "./lib/module-version.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const module = JSON.parse(readFileSync("module.json", "utf8"));
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const src = readFileSync("scripts/wire-state-toggle.mjs", "utf8");
const boot = readFileSync("scripts/module.mjs", "utf8");
const rigger = readFileSync("scripts/rigger-vertical.mjs", "utf8");
const css = readFileSync("styles/ghostwire.css", "utf8");
/** Source with every `//` comment line stripped, for "the code does not mention X" checks. */
const code = src.replace(/^\s*\/\/.*$/gm, "").replace(/^\s*\*.*$/gm, "");

console.log("S9 Wire-state toggle smoke (0.3.116)\n");

console.log("1) Ship surface");
note(atLeast(module.version, "0.3.116"), `module.json is >= 0.3.116 (got ${module.version})`);
note(boot.includes('import { registerWireStateToggle } from "./wire-state-toggle.mjs"'), "module.mjs imports the toggle");
note(/registerWireStateToggle\(\{\s*getWiredState,\s*setWiredState\s*\}\)/.test(boot),
  "module.mjs hands it the SAME getWiredState / setWiredState the Console and Matrix Verbs use");

console.log("\n2) The three rungs");
note(WIRE_TOGGLE_OPTIONS.length === 3, `three options (got ${WIRE_TOGGLE_OPTIONS.length})`);
note(WIRE_TOGGLE_OPTIONS.join(",") === "linked,overlay,jumpedIn", "Linked / Overlay / Jumped In, in ladder order");
note(!WIRE_TOGGLE_OPTIONS.includes("disconnected"), "Disconnected is not offered — Jack Out stays the only off-ramp");
note(!WIRE_TOGGLE_OPTIONS.includes("jackedIn"), "plain Jacked In is not offered — Jumped In is the seat, and Toggle Connection State still owns the deck ladder");

console.log("\n3) Display state");
note(wireDisplayState({ state: "jackedIn", jumpedIn: true }) === "jumpedIn", "a pilot in a seat reads Jumped In");
note(wireDisplayState({ state: "jackedIn", jumpedIn: false }) === "jackedIn", "a deck with no seat still reads Jacked In");
note(wireDisplayState({ state: "overlay", jumpedIn: false }) === "overlay", "Overlay reads Overlay");
note(wireDisplayState({ state: "linked" }) === "linked", "Linked reads Linked");
note(wireDisplayState({}) === "disconnected", "no arguments reads Disconnected");

console.log("\n4) Meat-inert belongs to Jumped In and nothing else");
note(meatInertForDisplayState("jumpedIn"), "Jumped In is meat-inert");
for (const state of ["linked", "overlay", "jackedIn", "disconnected"]) {
  note(!meatInertForDisplayState(state), `${state} is NOT meat-inert`);
}
for (const to of WIRE_TOGGLE_OPTIONS) {
  const plan = wireTogglePlan({ from: "linked", to, hasMachine: true });
  note(plan.meatInert === (to === "jumpedIn"), `plan → ${to} sets meatInert ${to === "jumpedIn"}`);
}

console.log("\n5) Overlay stays valid Wire Connected (F12 Pulse: Overlay or Jacked In)");
note(isWireConnectedDisplay("overlay"), "Overlay is full Connected");
note(isWireConnectedDisplay("jackedIn"), "Jacked In is full Connected");
note(isWireConnectedDisplay("jumpedIn"), "Jumped In is full Connected — it carries ghostwire-jacked-in");
note(!isWireConnectedDisplay("linked"), "Linked stays soft on-net, not full Connected");
note(!isWireConnectedDisplay("disconnected"), "Disconnected is not Connected");
note(isFullyConnected("overlay") && !isFullyConnected("linked"), "and it agrees with wired-state.mjs rather than re-deciding");

console.log("\n6) Legal transitions");
const plan = (from, to, hasMachine = true) => wireTogglePlan({ from, to, hasMachine });
note(plan("linked", "overlay").ok && plan("linked", "overlay").targetState === "overlay", "Linked → Overlay");
note(plan("overlay", "linked").ok && plan("overlay", "linked").targetState === "linked", "Overlay → Linked");
note(plan("linked", "jumpedIn").ok && plan("linked", "jumpedIn").jumpIn, "Linked → Jumped In calls Jump-In");
note(plan("overlay", "jumpedIn").ok && plan("overlay", "jumpedIn").jumpIn, "Overlay → Jumped In calls Jump-In");
note(plan("jackedIn", "overlay").ok, "a deck jockey may step Jacked In → Overlay");
note(plan("jackedIn", "jumpedIn").ok && plan("jackedIn", "jumpedIn").jumpIn, "Jacked In → Jumped In takes the seat");
note(plan("linked", "jumpedIn").targetState === "jackedIn", "Jumped In lands on the EXISTING jackedIn state, not a new one");
note(!plan("linked", "jumpedIn").jumpOut, "entering the seat does not call Jump-Out");

console.log("\n7) Leaving the seat cleans up the way Jump-Out does");
for (const to of ["linked", "overlay"]) {
  const leave = plan("jumpedIn", to);
  note(leave.ok, `Jumped In → ${to} is legal`);
  note(leave.jumpOut, `Jumped In → ${to} calls jumpOut() first`);
  note(leave.targetState === to, `Jumped In → ${to} then lands in ${to}`);
  note(!leave.meatInert, `Jumped In → ${to} clears meat-inert`);
}
note(/if \(plan\.jumpOut\) await jumpOut\(actor\)/.test(src), "applyWireState really calls the exported jumpOut()");
note(/await jumpIn\(actor, machine\)/.test(src), "and the exported jumpIn()");
note(rigger.includes("export async function jumpOut") && rigger.includes("export async function jumpIn"),
  "rigger-vertical.mjs still exports both");
note(/unsetFlag\(MODULE_ID, "jumpedInto"\)/.test(rigger), "jumpOut is still the thing that unsets jumpedInto");

console.log("\n8) Refusals");
note(!plan("linked", "linked").ok && plan("linked", "linked").reason === "same", "switching to the rung you are on is a no-op");
note(!plan("jumpedIn", "jumpedIn").ok, "so is re-picking Jumped In (it must not re-stamp meat-inert)");
note(!plan("linked", "disconnected").ok && plan("linked", "disconnected").reason === "unknown", "Disconnected is refused as a target");
note(!plan("linked", "jackedIn").ok, "plain Jacked In is refused as a target");
note(!plan("disconnected", "linked").ok && plan("disconnected", "linked").reason === "notConnected",
  "a Disconnected hero is refused — Connect is the only on-ramp and it needs an interface");
note(!plan("disconnected", "jumpedIn").ok, "and cannot jump straight into a seat either");
note(!plan("linked", "jumpedIn", false).ok && plan("linked", "jumpedIn", false).reason === "noMachine",
  "Jumped In with no capable machine is refused");
note(WIRE_TOGGLE_REFUSALS.every(reason => typeof lang.GHOSTWIRE.WireToggle.Refuse[reason] === "string"),
  `every refusal has a string (${WIRE_TOGGLE_REFUSALS.join(", ")})`);
note(wireToggleRefusalKey(plan("linked", "linked")) === "same", "refusal key maps to the lang key");
note(wireToggleRefusalKey(plan("linked", "overlay")) === null, "a legal plan has no refusal key");
note(wireToggleRefusalKey({ ok: false, reason: "invented" }) === "unknown", "an unknown reason falls back to unknown");
for (const bad of [null, undefined, "", 0]) {
  note(!wireTogglePlan({ from: "linked", to: bad }).ok, `a ${JSON.stringify(bad)} target is refused`);
}

console.log("\n9) NO parallel flag namespace");
note(src.includes('from "./wired-state.mjs"'), "the toggle imports the existing state helpers");
note(src.includes('from "./rigger-vertical.mjs"'), "and the existing Jump-In / Jump-Out");
note(!/CONFIG\.statusEffects/.test(code), "it registers no status of its own");
note(!/ghostwire-(linked|overlay|jacked-in)/.test(code), "it never hard-codes a Wired status id — WIRED_STATUS_DEFS is the only source");
note(!/setFlag\(/.test(code) && !/actor\.update\(/.test(code), "it writes no Actor flag directly; setWiredState / jumpIn own that");
note(!/flags\.\$\{MODULE_ID\}\.wire[A-Z]/.test(code), "no flags.<module>.wireSomething parallel state");
note(!/createEmbeddedDocuments\(/.test(code), "it creates no Active Effect of its own (no second meat-inert)");
note((code.match(/MEAT_INERT/g) ?? []).length > 0 && code.includes("ghostwire-meat-inert"),
  "it names the EXISTING ghostwire-meat-inert id for its cleanup sweep");
note(rigger.includes('const MEAT_INERT = "ghostwire-meat-inert"'), "and rigger-vertical.mjs still owns that id");
note(WIRED_STATUS_DEFS.linked.id === "ghostwire-linked"
  && WIRED_STATUS_DEFS.overlay.id === "ghostwire-overlay"
  && WIRED_STATUS_DEFS.jackedIn.id === "ghostwire-jacked-in", "the three Wired status ids are unchanged");
note(isOnNet("linked") && isOnNet("overlay") && isOnNet("jackedIn") && !isOnNet("disconnected"),
  "on-net membership is unchanged");

console.log("\n10) UI hooks, settings, lang, CSS");
note(src.includes('Hooks.on("renderTokenHUD"'), "token HUD door registered");
note(src.includes('Hooks.on("renderDrawSteelHeroSheet"'), "hero sheet door registered");
note(src.includes('Hooks.on("renderActorSheet"'), "generic actor-sheet fallback registered");
note(src.includes("DialogV2.wait"), "the picker is a DialogV2");
for (const key of ["wireStateToggleHud", "wireStateToggleSheet", "wireStateToggleChat"]) {
  note(src.includes(`"${key}"`), `setting ${key} is registered`);
}
const strings = lang.GHOSTWIRE.WireToggle;
note(!!strings, "GHOSTWIRE.WireToggle exists");
note(strings.States.jumpedIn === "Jumped In", "Jumped In has its own label");
note(typeof strings.Hints.jumpedIn === "string" && /inert/i.test(strings.Hints.jumpedIn), "the Jumped In hint names the inert body");
note(strings.Chat.Changed.includes("{from}") && strings.Chat.Changed.includes("{to}"), "the chat line carries both rungs");
note(/Connect/.test(strings.Refuse.notConnected), "the not-connected refusal points at Connect");
for (const key of ["Hud", "Sheet", "Chat"]) {
  note(typeof strings.Settings[key]?.Name === "string" && typeof strings.Settings[key]?.Hint === "string",
    `Settings.${key} has a name and a hint`);
}
note(typeof strings.Hud === "string" && strings.Hud.includes("{state}"), "the HUD tooltip prints the current rung");
note(lang.GHOSTWIRE.Wired.States.linked === "Linked" && lang.GHOSTWIRE.Wired.States.overlay === "Overlay",
  "Linked / Overlay labels are still read from the existing Wired block");
note(css.includes(".ghostwire-wire-toggle-hud"), "CSS for the HUD button");
note(css.includes(".ghostwire-wire-toggle-chip"), "CSS for the sheet chip");
note(css.includes(".ghostwire-wire-toggle-card"), "CSS for the chat card");

console.log("\n11) Chat / toast on change");
note(/ui\.notifications\.info\(line\)/.test(src), "every change toasts");
note(/ChatMessage\.create\(/.test(src), "and posts a card when the setting allows");
note(/wireStateToggleChat/.test(src), "the card is behind the setting; the toast is not");

console.log("\n12) Director note");
const note116 = readFileSync("docs/directors/wire-state-toggle-03116.md", "utf8");
note(note116.length > 1500, "docs/directors/wire-state-toggle-03116.md exists and is not a stub");
note(/Jumped In is not Jacked In/i.test(note116), "the note spells out that Jumped In is not Jacked In");
note(/meat-inert/i.test(note116), "and where meat-inert lives");
note(/Connect/.test(note116) && /Jack Out/.test(note116), "and that Connect / Jack Out still own the on- and off-ramps");
note(/Overlay/.test(note116) && /Connected/.test(note116), "and that Overlay stays valid Wire Connected");

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
