#!/usr/bin/env node
/**
 * 0.3.95 — Director Pay / Spend Hero smoke (scripts/director-wealth.mjs), no live Foundry.
 *
 * Checks the parts that are rules rather than UI:
 *  - The purse math: pay always credits, spend refuses what the hero cannot cover, and a refusal writes nothing.
 *  - Amounts are non-negative integers whatever the dialog hands back.
 *  - Targets are collected the Director Taint +1 way — targeted tokens first, then selected, deduped by actor.
 *  - The only wealth path is the kiosk's `system.hero.wealth`; there is no second purse.
 *  - Every lang key the prompt, the notifications and the chat card name resolves.
 *  - The Ghostwire Macros pack entries are shaped like the Director Taint +1 macro and call the real API.
 *
 * Run: node tools/director-wealth-smoke.mjs
 */
import { readFileSync } from "node:fs";
import {
  WEALTH_MODES,
  actorAcceptsWealth,
  clampAmount,
  collectWealthTargets,
  normalizeMode,
  normalizeReason,
  previewWealthChange,
  signFor,
} from "../scripts/director-wealth.mjs";
import { WEALTH_PATH } from "../scripts/kiosk.mjs";

const failures = [];
const ok = (cond, msg) => { if (!cond) failures.push(msg); else console.log(`  ✓ ${msg}`); };
const read = p => JSON.parse(readFileSync(p, "utf8").replace(/^﻿/, ""));
const lang = read("lang/en.json");
const t = key => key.split(".").reduce((o, k) => o?.[k], lang);
const source = readFileSync("scripts/director-wealth.mjs", "utf8");
const module_ = readFileSync("scripts/module.mjs", "utf8");

console.log("0.3.95 Director Pay / Spend Hero smoke\n");

/* ---------- 1. amounts ---------- */
console.log("1) Amounts are integers ≥ 0");
ok(clampAmount("1200") === 1200 && clampAmount(1200) === 1200, "a typed amount reads as a number");
ok(clampAmount(1200.9) === 1200, "fractions floor — ¥ has no small change in Ghostwire");
ok(clampAmount(-500) === 0 && clampAmount("-500") === 0, "a negative amount is refused, not flipped into the other direction");
ok(clampAmount(null) === 0 && clampAmount("") === 0 && clampAmount("abc") === 0 && clampAmount(undefined) === 0,
  "an unreadable amount is 0, and 0 changes nothing");
ok(normalizeMode("spend") === "spend" && normalizeMode("pay") === "pay" && normalizeMode("steal") === "pay" && normalizeMode() === "pay",
  "an unknown direction falls back to pay — the harmless one");
ok(signFor("pay") === 1 && signFor("spend") === -1, "pay credits, spend debits");
ok(WEALTH_MODES.length === 2, "there are exactly two directions");

/* ---------- 2. the purse math ---------- */
console.log("\n2) Pay credits, spend refuses what it cannot cover");
const paid = previewWealthChange({ wealth: 250, amount: 1000, mode: "pay" });
ok(paid.ok && paid.wealthAfter === 1250 && paid.delta === 1000, "a pay of ¥1,000 on ¥250 lands at ¥1,250");
ok(previewWealthChange({ wealth: 0, amount: 5000, mode: "pay" }).wealthAfter === 5000,
  "a hero with nothing can still be paid");

const spent = previewWealthChange({ wealth: 1250, amount: 400, mode: "spend" });
ok(spent.ok && spent.wealthAfter === 850 && spent.delta === -400, "a spend of ¥400 on ¥1,250 lands at ¥850");
const exact = previewWealthChange({ wealth: 400, amount: 400, mode: "spend" });
ok(exact.ok && exact.wealthAfter === 0, "a hero may spend to exactly zero");

const short = previewWealthChange({ wealth: 399, amount: 400, mode: "spend" });
ok(!short.ok && short.reason === "insufficient", "a spend larger than the purse is refused");
ok(short.wealthAfter === short.wealth && short.delta === 0, "…and the refusal writes nothing — ¥ never goes negative");
ok(previewWealthChange({ wealth: 0, amount: 1, mode: "spend" }).reason === "insufficient",
  "an empty purse cannot be spent from");

const zero = previewWealthChange({ wealth: 500, amount: 0, mode: "pay" });
ok(!zero.ok && zero.reason === "zero" && zero.wealthAfter === 500, "a zero amount is a no-op with a named reason");
ok(previewWealthChange({ wealth: -50, amount: 10, mode: "spend" }).wealth === 0,
  "a broken wealth value reads as 0 before anything is decided");
ok(previewWealthChange({ wealth: 100, amount: 10.9, mode: "spend" }).wealthAfter === 90,
  "the amount is clamped before the arithmetic, not after");

/* ---------- 3. reasons and eligibility ---------- */
console.log("\n3) Reasons and who has a purse");
ok(normalizeReason("  Gold Line   job pay \n") === "Gold Line job pay", "a reason is trimmed to one line");
ok(normalizeReason(null) === "" && normalizeReason(undefined) === "", "no reason given is an empty string, not 'null'");
ok(normalizeReason("x".repeat(400)).length === 160, "a runaway reason is cut to a chat-safe length");
ok(actorAcceptsWealth({ type: "hero" }), "heroes carry ¥");
ok(!actorAcceptsWealth({ type: "npc" }) && !actorAcceptsWealth(null), "nothing else does");

/* ---------- 4. collecting targets ---------- */
console.log("\n4) Targets — the Director Taint +1 collect, shared not copied");
const kais = { id: "a", name: "Kaïs", type: "hero" };
const vessa = { id: "b", name: "Vessa", type: "hero" };
ok(collectWealthTargets({ targeted: [{ actor: kais }], controlled: [{ actor: vessa }] })[0] === kais,
  "targeted tokens win over selected ones");
ok(collectWealthTargets({ targeted: [], controlled: [{ actor: vessa }] })[0] === vessa,
  "…and selection is the fallback");
ok(collectWealthTargets({ targeted: [{ actor: kais }, { actor: kais }] }).length === 1,
  "two tokens of one hero pay that hero once");
ok(collectWealthTargets({}).length === 0, "nothing targeted and nothing selected collects nobody");
ok(source.includes('from "./taint.mjs"'), "the collect is imported from taint.mjs rather than re-written");

/* ---------- 5. one purse ---------- */
console.log("\n5) One wealth path");
ok(WEALTH_PATH === "system.hero.wealth", "the kiosk's path is the path");
ok(source.includes('from "./kiosk.mjs"') && source.includes("[WEALTH_PATH]:"),
  "the Director tool writes through WEALTH_PATH, not a string of its own");
ok((source.match(/actor\.update\(/g) ?? []).length === 1, "there is exactly one Actor write in the file");
ok(source.includes("formatYen"), "every ¥ the Director sees is formatted by the kiosk's formatter");
// Comments name the neighbouring tracks (Taint, the firewall); only the code is asked to stay clean.
const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
ok(!/essence|conviction|resonance/i.test(code), "the Director purse touches no other resource track");
ok(!/system\.hero\.(?!wealth)/.test(code), "…and writes nothing else under system.hero");
ok(/if \(!game\.user\?\.isGM\)/.test(source), "a player pressing the API is refused before anything is read");

/* ---------- 6. lang ---------- */
console.log("\n6) Lang keys");
const L = "GHOSTWIRE.Wealth.Director";
const KEYS = ["Title", "PayTitle", "SpendTitle", "MacroPayName", "MacroSpendName", "Keybinding", "Hud", "Hint",
  "GMOnly", "NoTarget", "NotEligible", "NoAmount", "Insufficient", "Speaker", "Targets", "Mode", "Amount",
  "Reason", "ReasonPlaceholder", "Submit", "ChatTitlePay", "ChatTitleSpend", "ChatLinePay", "ChatLineSpend",
  "ChatReason", "NoReason", "NotifyPay", "NotifySpend"];
for (const key of KEYS) if (typeof t(`${L}.${key}`) !== "string") failures.push(`missing lang key ${L}.${key}`);
ok(true, `${KEYS.length} Director wealth keys resolve`);
for (const mode of WEALTH_MODES) if (typeof t(`${L}.Modes.${mode}`) !== "string") failures.push(`missing lang key ${L}.Modes.${mode}`);
ok(true, "both directions are labelled in the prompt");
for (const key of ["ChatLinePay", "ChatLineSpend"]) {
  const line = t(`${L}.${key}`);
  if (!["{actor}", "{amount}", "{before}", "{after}"].every(token => line.includes(token))) {
    failures.push(`${L}.${key} must name {actor}, {amount}, {before} and {after}`);
  }
}
ok(true, "the chat card prints who, how much, and ¥ before → after");
ok(t(`${L}.ChatReason`).includes("{reason}"), "…and why");
ok(["{actor}", "{amount}", "{wealth}"].every(token => t(`${L}.Insufficient`).includes(token)),
  "the refusal names the hero, the ask and what they actually have");

/* ---------- 7. the macros ---------- */
console.log("\n7) Ghostwire Macros pack");
const taint = read("src/packs/macros/director-taint-plus-one.json");
for (const [file, mode, nameKey] of [
  ["src/packs/macros/director-pay-hero.json", "pay", `${L}.MacroPayName`],
  ["src/packs/macros/director-spend-hero.json", "spend", `${L}.MacroSpendName`],
]) {
  const macro = read(file);
  if (!/^[A-Za-z0-9]{16}$/.test(macro._id)) failures.push(`${file}: _id must be 16 alphanumeric characters`);
  if (macro._key !== `!macros!${macro._id}`) failures.push(`${file}: _key must be !macros!<id>`);
  if (macro.name !== nameKey) failures.push(`${file}: name must be the lang key ${nameKey}`);
  if (typeof t(macro.name) !== "string") failures.push(`${file}: ${macro.name} does not resolve`);
  if (macro.type !== "script" || macro.scope !== "global") failures.push(`${file}: must be a global script macro`);
  if (macro.author !== taint.author) failures.push(`${file}: author must match the Director Taint +1 macro`);
  if (macro.ownership?.default !== 0) failures.push(`${file}: must be Director-only (ownership default 0)`);
  if (!macro.command.includes("directorWealthPrompt")) failures.push(`${file}: does not call the module API`);
  if (!macro.command.includes(`mode: "${mode}"`)) failures.push(`${file}: does not open on ${mode}`);
  if (!macro.command.includes("draw-steel-ghostwire")) failures.push(`${file}: does not guard on the module being enabled`);
}
ok(true, "both Director macros are shaped like Director Taint +1 and call directorWealthPrompt");
ok(read("src/packs/macros/director-pay-hero.json")._id !== read("src/packs/macros/director-spend-hero.json")._id,
  "the two macros have different ids");

/* ---------- 8. the ship surface ---------- */
console.log("\n8) Wiring");
ok(module_.includes('import { registerDirectorWealth } from "./director-wealth.mjs";'), "module.mjs imports the tool");
ok(module_.includes("registerDirectorWealth();"), "…and registers it at init");
for (const name of ["directorPayHero", "directorSpendHero", "directorAdjustWealth", "directorWealthPrompt"]) {
  if (!new RegExp(`module\\.api[\\s\\S]{0,500}${name}`).test(source)) failures.push(`module.api does not expose ${name}`);
  if (!new RegExp(`game\\.ghostwire = \\{[\\s\\S]{0,300}${name}`).test(source)) failures.push(`game.ghostwire does not expose ${name}`);
}
ok(true, "pay, spend, the raw adjust and the prompt are all on the API and on game.ghostwire");
ok(source.includes("ghostwireWealthPay") && source.includes("ghostwireWealthSpend"), "both scene-control tools are declared");
ok(/getSceneControlButtons[\s\S]{0,200}game\.user\?\.isGM/.test(source), "the scene tools are Director-only");
ok(source.includes('Hooks.on("renderTokenHUD"'), "a GM token-HUD button opens the prompt on one hero");
ok(source.includes('game.keybindings.register') && source.includes("restricted: true"), "the keybinding is Director-restricted");

const version = read("module.json").version;
ok((() => {
  const [maj, min, pat] = String(version).split(".").map(Number);
  return maj === 0 && min === 3 && pat >= 95;
})(), `module.json is 0.3.95+ (got ${version})`);

if (failures.length) {
  console.error(`\nDirector wealth smoke FAILED:\n  - ${failures.join("\n  - ")}`);
  process.exit(1);
}
console.log("\nDirector wealth smoke passed");
