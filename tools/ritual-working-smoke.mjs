#!/usr/bin/env node
/**
 * 0.3.91 — Ritual Working applet smoke (scripts/ritual-working.mjs), no live Foundry.
 *
 * Checks the parts that are rules rather than UI:
 *  - Project goals are the RAW ladder (study Magnitude × 2, built sanctum Magnitude × 3, temporary cap 3).
 *  - Components totals parse off every shipped Formula, and the ladder / path split matches the card shapes.
 *  - The sealing characteristic follows the tradition the card names, then the leader's class.
 *  - Stage state is derived from documents (Project points, learned flag, paid stamp) and gates sealing.
 *  - The resource firewall holds: the module touches ¥ and nothing else.
 *  - Every lang key the panel and its chat cards name resolves, and the ship surface is wired.
 *
 * Run: node tools/ritual-working-smoke.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  SEAL_CHARACTERISTICS,
  STAGES,
  TEMP_SANCTUM_CAP,
  clampMagnitude,
  componentOptions,
  componentsFor,
  isMagnitudeLadder,
  leaderMatchesTradition,
  leakBand,
  lockedTradition,
  magnitudeRange,
  needsBuiltSanctum,
  newWorking,
  normalizeWorking,
  parseYen,
  sanctumGoal,
  sealOutcome,
  stageState,
  studyGoal,
  traditionCharacteristic,
} from "../scripts/ritual-working.mjs";
import { WEALTH_PATH } from "../scripts/kiosk.mjs";

const DIR = "src/packs/gear/general/ritual-formulas";
const failures = [];
const ok = (cond, msg) => { if (!cond) failures.push(msg); else console.log(`  ✓ ${msg}`); };
const read = p => JSON.parse(readFileSync(p, "utf8").replace(/^﻿/, ""));
const lang = read("lang/en.json");
const t = key => key.split(".").reduce((o, k) => o?.[k], lang);
const source = readFileSync("scripts/ritual-working.mjs", "utf8");
const template = readFileSync("templates/ritual-working.hbs", "utf8");

console.log("0.3.91 Ritual Working applet smoke\n");

/* ---------- 1. the Project ladder ---------- */
console.log("1) Project goals and the sanctum cap");
ok(STAGES.join(",") === "study,components,sanctum,seal,payoff", "five stages in order: Study → Components → Sanctum → Seal → Payoff");
ok([1, 2, 3, 4, 5].every(m => studyGoal(m) === m * 2), "study goal is Magnitude × 2 (2 / 4 / 6 / 8 / 10)");
ok([1, 2, 3, 4, 5].every(m => sanctumGoal(m) === m * 3), "built sanctum goal is Magnitude × 3 (3 / 6 / 9 / 12 / 15)");
ok(TEMP_SANCTUM_CAP === 3, "a temporary sanctum caps at rating 3");
ok(![1, 2, 3].some(needsBuiltSanctum) && [4, 5].every(needsBuiltSanctum), "Magnitude 4–5 forces a built sanctum, 1–3 does not");
ok(clampMagnitude(0) === 1 && clampMagnitude(9) === 5 && clampMagnitude("3") === 3 && clampMagnitude(null) === 1, "Magnitude is clamped to 1–5");
ok(leakBand(1) === "district" && leakBand(2) === "district" && leakBand(3) === "hive" && leakBand(5) === "hivewide", "Veil pressure bands match the detection table");
// Seal the Flat is the worked example: study 4, sanctum 6.
ok(studyGoal(2) === 4 && sanctumGoal(2) === 6, "Seal the Flat (Magnitude 2) reads study 4 / sanctum 6");

/* ---------- 2. components off the shipped cards ---------- */
console.log("\n2) Components totals on all 46 Formulas");
ok(parseYen("¥1,200") === 1200 && parseYen("¥75") === 75, "¥ totals parse, commas and all");
ok(parseYen("¥ —") === null && parseYen("") === null && parseYen(null) === null, "fetch reagents (¥ —) and blanks price as null");

const files = readdirSync(DIR).filter(f => f.endsWith(".json") && f !== "_folder.json");
ok(files.length >= 46, `${files.length} Formula sources on disk`);
let ladders = 0, paths = 0;
for (const file of files) {
  const ritual = read(join(DIR, file)).flags["draw-steel-ghostwire"].ritual;
  const { min, max } = magnitudeRange(ritual);
  const options = componentOptions(ritual);
  if (!options.length) { failures.push(`${file}: no Components total`); continue; }
  if (options.some(o => o.amount === null)) { failures.push(`${file}: a Components total did not parse`); continue; }
  if (isMagnitudeLadder(ritual)) {
    ladders++;
    // Every Magnitude the copy may be written at has exactly one total, and it climbs.
    const byMagnitude = Array.from({ length: max - min + 1 }, (_, i) => componentsFor(ritual, { magnitude: min + i }));
    if (byMagnitude.some(o => o === null)) failures.push(`${file}: a Magnitude in the range has no total`);
    if (byMagnitude.some((o, i) => i > 0 && o.amount < byMagnitude[i - 1].amount)) failures.push(`${file}: ladder totals do not climb`);
  } else {
    paths++;
    if (max !== min && options.length !== 1) failures.push(`${file}: open range but totals are not a ladder`);
  }
}
ok(ladders > 0 && paths > 0, `${ladders} Magnitude ladders and ${paths} fixed-Magnitude cards, all priced`);

const wardTheRoom = read(join(DIR, "ward-the-room.json")).flags["draw-steel-ghostwire"].ritual;
ok(!isMagnitudeLadder(wardTheRoom), "Ward the Room ¥75 / ¥40 reads as two paths, not two Magnitudes");
ok(componentsFor(wardTheRoom, { magnitude: 1, index: 0 }).amount === 75, "Ward the Room path 1 is ¥75 (Veil)");
ok(componentsFor(wardTheRoom, { magnitude: 1, index: 1 }).amount === 40, "Ward the Room path 2 is ¥40 (Wire-chalk skin)");

const scrub = read(join(DIR, "scrub-the-stain.json")).flags["draw-steel-ghostwire"].ritual;
ok(isMagnitudeLadder(scrub), "Scrub the Stain ¥100…¥12,000 reads as a Magnitude 1–5 ladder");
ok(componentsFor(scrub, { magnitude: 4 }).amount === 4000, "Scrub the Stain at Magnitude 4 owes ¥4,000");
ok(componentsFor(scrub, { magnitude: 1 }).amount === 100, "Scrub the Stain at Magnitude 1 owes ¥100");

/* ---------- 3. who leads, and on what ---------- */
console.log("\n3) Ritual Leader and the sealing characteristic");
ok(traditionCharacteristic({ leaders: "Street Priest only" }) === "presence", "Street Priest card seals on Persona (presence)");
ok(traditionCharacteristic({ leaders: "Elementalist only" }) === "reason", "Elementalist card seals on Logic (reason)");
ok(traditionCharacteristic({ leaders: "Technomancer only" }) === "reason", "Technomancer Wire-rite seals on Logic (reason), Matrix Theory applies");
ok(traditionCharacteristic({ leaders: "General", classDsid: "street-priest" }) === "presence", "General card in a Street Priest's hands seals on Persona");
ok(traditionCharacteristic({ leaders: "General", classDsid: "elementalist" }) === "reason", "General card in an Elementalist's hands seals on Logic");
ok(traditionCharacteristic({}) === "reason", "no card and no class still yields a legal characteristic");
ok(SEAL_CHARACTERISTICS.every(c => ["reason", "intuition", "presence"].includes(c)), "the picker offers Logic / Instinct / Persona only");
ok(lockedTradition("General") === null && lockedTradition("Street Priest only") === "street-priest", "only an \"… only\" card is tradition-locked");
ok(leaderMatchesTradition({ leaders: "General", classDsid: "operator" }), "a General card warns nobody");
ok(!leaderMatchesTradition({ leaders: "Elementalist only", classDsid: "street-priest" }), "a locked card warns when the leader is the wrong tradition");
ok(leaderMatchesTradition({ leaders: "Elementalist only", classDsid: "elementalist" }), "…and stays quiet when they are the right one");

// Every shipped card names a tradition the mapper understands.
for (const file of files) {
  const ritual = read(join(DIR, file)).flags["draw-steel-ghostwire"].ritual;
  if (!SEAL_CHARACTERISTICS.includes(traditionCharacteristic({ leaders: ritual.leaders }))) failures.push(`${file}: leaders "${ritual.leaders}" maps to no characteristic`);
}
ok(true, "all 46 cards map to a sealing characteristic");

/* ---------- 4. stage state is derived, and gates sealing ---------- */
console.log("\n4) Stage state");
const sealTheFlat = read(join(DIR, "seal-the-flat.json")).flags["draw-steel-ghostwire"].ritual;
const working = newWorking({ formulaUuid: "Actor.a.Item.b", formulaName: "Seal the Flat", ritual: sealTheFlat });
ok(working.magnitude === 2 && working.sanctumMode === "temporary", "a new Working takes the card's Magnitude and a temporary sanctum");
ok(working.sealTier === null && working.completed === null && !working.componentsPaid, "…and starts with nothing stamped");

const stageOf = (w, facts) => Object.fromEntries(stageState(w, facts).stages.map(s => [s.key, s]));
const fresh = stageState(working, {});
ok(fresh.current === "study", "a fresh Working sits at Study");
ok(!stageOf(working, { hasStudyProject: true, studyPoints: 4 }).study.done, "study points alone do not finish Study — the learned flag does");
ok(stageOf(working, { hasStudyProject: true, studyPoints: 4 }).study.goalMet, "…but meeting goal 4 offers the learned stamp");
ok(!stageOf(working, { hasStudyProject: true, studyPoints: 3 }).study.goalMet, "3 of 4 progress does not offer it");
ok(stageOf(working, { learned: true }).study.done, "the learned flag finishes Study");

const paid = normalizeWorking({ ...working, componentsPaid: true, componentsPaidAmount: 180 });
ok(stageOf(paid, { learned: true }).components.done, "the paid stamp finishes Components");
ok(!stageOf(paid, { learned: true }).seal.ready, "sealing is still blocked without a sanctum");
const ready = normalizeWorking({ ...paid, sanctumReady: true });
ok(stageOf(ready, { learned: true }).seal.ready, "learned + paid + sanctum opens Seal Ritual");
ok(!stageOf(ready, {}).seal.ready, "…and an unlearned Formula shuts it again");
ok(stageState(ready, { learned: true }).current === "seal", "the panel's current stage follows the first unfinished one");

const built = normalizeWorking({ ...ready, sanctumMode: "built" });
ok(!stageOf(built, { learned: true }).sanctum.done, "switching to a built sanctum reopens the stage until the Project is done");
ok(stageOf(built, { learned: true, hasSanctumProject: true, sanctumPoints: 6 }).sanctum.done, "…and goal 6 closes it");

const big = newWorking({ ritual: { magnitude: 4, magnitudeMax: 5, componentsTotal: ["¥5,000", "¥14,000"] } });
ok(big.sanctumMode === "built", "a Magnitude 4 Working opens on a built sanctum");
ok(normalizeWorking({ ...big, sanctumMode: "temporary" }).sanctumMode === "built", "…and cannot be talked back into a claimed room");
ok(componentsFor({ magnitude: 4, magnitudeMax: 5, componentsTotal: ["¥5,000", "¥14,000"] }, { magnitude: 5 }).amount === 14000, "raising the Magnitude raises the Components total on a ladder card");

const sealed = normalizeWorking({ ...ready, sealTier: 1 });
ok(stageOf(sealed, { learned: true }).seal.done && stageState(sealed, { learned: true }).outcome.hung, "a tier 1 seal is a hung ritual the Director holds");
ok(sealOutcome(2).key === "middle" && sealOutcome(3).key === "high" && !sealOutcome(3).hung, "tiers 2 / 3 are middle / high and hang nothing");
ok(sealOutcome(0) === null && sealOutcome(null) === null, "a cancelled roll stamps no outcome");
ok(normalizeWorking({ magnitude: 7, magnitudeMin: 2, magnitudeMax: 3 }).magnitude === 3, "a stored Magnitude is kept inside the card's window");

/* ---------- 5. the resource firewall ---------- */
console.log("\n5) Resource firewall");
ok(WEALTH_PATH === "system.hero.wealth", "the ¥ path is the kiosk's, reused rather than redeclared");
ok(source.includes("WEALTH_PATH") && source.includes("getWealth") && source.includes("formatYen"), "wealth helpers are imported from kiosk.mjs, not re-implemented");
const forbidden = ["essence", "conviction", "resonance", "clarity", "ferocity", "discipline", "drama", "insight"];
const hits = forbidden.filter(word => new RegExp(`system\\.[A-Za-z.]*${word}`, "i").test(source));
ok(hits.length === 0, `no heroic resource path is touched (${forbidden.length} names checked)`);
ok((source.match(/\.update\(\{ \[WEALTH_PATH\]/g) ?? []).length === 1, "exactly one place moves ¥ — payComponents");
ok(source.includes("system.roll()"), "Project progress goes through the stock Draw Steel Project roll");
ok(source.includes("rollCharacteristic"), "sealing goes through the stock characteristic Power Roll");
ok(!/system\.points["']?\s*:/.test(source.replace(/points: 0,/g, "")), "nothing writes Project points behind the system's back");

/* ---------- 6. ship surface ---------- */
console.log("\n6) Ship surface");
const boot = readFileSync("scripts/module.mjs", "utf8");
ok(boot.includes("registerRitualWorking()"), "module.mjs registers registerRitualWorking");
ok(boot.includes('from "./ritual-working.mjs"'), "…and imports it");
ok(source.includes("restricted: false"), "the keybinding is open to players, not Director-only");
ok(/visible: true/.test(source.split("getSceneControlButtons")[1] ?? ""), "the scene control button is visible to every player");
ok(readFileSync("styles/ghostwire.css", "utf8").includes(".ghostwire-ritual-working"), "styles/ghostwire.css carries the panel");
const cmp = (a, b) => { const p = v => v.split(".").map(Number); const [x, y] = [p(a), p(b)]; for (let i = 0; i < 3; i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) - (y[i] ?? 0); return 0; };
ok(cmp(read("module.json").version, "0.3.91") >= 0, `module.json is ≥ 0.3.91 (now ${read("module.json").version})`);
ok(readFileSync("README.md", "utf8").includes("0.3.91"), "README Status names 0.3.91");

/* ---------- 7. lang ---------- */
console.log("\n7) Lang");
const KEYS = [
  "Title", "Keybinding", "Menu.Start", "Formula", "PickNone", "PickHint", "NoFormulas", "Leader", "Learned",
  "NotLearned", "Magnitude", "Start", "StartHint", "Progress", "RollProject", "OpenProject", "OpenFormula",
  "Restart", "ProjectCreated", "NoProject", "NoFormulaItem", "NoPrice", "NoPermission", "Insufficient", "CannotAfford",
  "ComponentsPath", "ComponentsLadderOption", "ComponentsPathOption", "ComponentsDue", "ComponentsPaid",
  "PayComponents", "SanctumMode", "ClaimSanctum", "SealCharacteristic", "SealRitual", "Complete", "Abandon",
  "AbandonHint", "Reset", "TraditionWarning", "Firewall",
  "Study.GoalMet", "Study.Complete", "Study.CompleteHint",
  "Sanctum.temporary", "Sanctum.built", "Sanctum.ForcedBuilt",
  "Seal.RollTitle", "Seal.Blocked", "Seal.Assistants", "Seal.Hung",
  "Seal.Outcome.low", "Seal.Outcome.middle", "Seal.Outcome.high",
  "Payoff.low", "Payoff.middle", "Payoff.high", "Payoff.Upkeep",
  "Leak.district", "Leak.hive", "Leak.hivewide",
  "Project.StudyName", "Project.SanctumName", "Project.StudyHint", "Project.SanctumHint",
  "Chat.Started", "Chat.Paid", "Chat.Sanctum", "Chat.Sealed", "Chat.Attention", "Chat.Payoff",
];
for (const stage of STAGES) {
  KEYS.push(`Stage.${stage}.Name`, `Stage.${stage}.Hint`);
}
KEYS.push("Stage.study.Create", "Stage.sanctum.Create");
const missing = KEYS.filter(k => typeof t(`GHOSTWIRE.RitualWorking.${k}`) !== "string");
ok(missing.length === 0, `all ${KEYS.length} GHOSTWIRE.RitualWorking keys resolve${missing.length ? ` (missing: ${missing.join(", ")})` : ""}`);

// Every key the template localizes exists, and it never reaches for a Ritual key that lang lacks.
const templateKeys = [...template.matchAll(/localize "(GHOSTWIRE\.[A-Za-z.]+)"/g)].map(m => m[1]);
const strayTemplate = templateKeys.filter(k => typeof t(k) !== "string");
ok(strayTemplate.length === 0, `templates/ritual-working.hbs names ${new Set(templateKeys).size} keys, all present${strayTemplate.length ? ` (missing: ${strayTemplate.join(", ")})` : ""}`);
// Every quoted key literal inside a loc(…) call, ternaries included. Template-literal keys (`Stage.${…}`)
// carry no quoted literal, so the STAGES sweep below covers those instead.
const sourceKeys = [...source.matchAll(/loc\(([^;\n]*?)\)/g)]
  .flatMap(call => [...call[1].matchAll(/"([A-Za-z][A-Za-z.]*)"/g)].map(m => m[1]));
const straySource = [...new Set(sourceKeys)].filter(k => typeof t(`GHOSTWIRE.RitualWorking.${k}`) !== "string");
ok(straySource.length === 0, `ritual-working.mjs names ${new Set(sourceKeys).size} literal keys, all present${straySource.length ? ` (missing: ${straySource.join(", ")})` : ""}`);
for (const stage of STAGES) {
  if (typeof t(`GHOSTWIRE.RitualWorking.Stage.${stage}.Name`) !== "string") failures.push(`lang: Stage.${stage}.Name`);
}
ok(/\{points\}/.test(t("GHOSTWIRE.RitualWorking.Progress")) && /\{goal\}/.test(t("GHOSTWIRE.RitualWorking.Progress")), "the progress line names points and goal");
ok(/Essence/.test(t("GHOSTWIRE.RitualWorking.Firewall")), "the panel prints the resource firewall");

/* ---------- 8. the 0.3.89 gate still holds ---------- */
console.log("\n8) Mark Learned integration");
ok(source.includes("setFormulaLearned") && source.includes("isLearned"), "the panel reuses the 0.3.89 learned gate rather than a second one");
ok(source.includes("offerLearned"), "study completion offers the learned stamp");
ok(readFileSync("scripts/rituals.mjs", "utf8").includes("export function setFormulaLearned")
  || readFileSync("scripts/rituals.mjs", "utf8").includes("export async function setFormulaLearned"), "rituals.mjs still exports it");

/* ---------- 9. the template actually renders ---------- */
console.log("\n9) Template render");
let handlebars = null;
try {
  handlebars = (await import("./lib/foundry-require.mjs")).foundryRequire("handlebars");
} catch {
  console.log("  – handlebars not resolvable (no Foundry, no tools/node_modules) — render check skipped");
}
if (handlebars) {
  // The same helpers Foundry registers, so a branch that only exists in the panel still gets exercised.
  handlebars.registerHelper({
    disabled: value => (value ? "disabled" : ""),
    eq: (a, b) => a === b,
    not: pred => !pred,
    and() { return Array.prototype.every.call(arguments, Boolean); },
    or() { return Array.prototype.slice.call(arguments, 0, -1).some(Boolean); },
    localize: value => String(value),
  });
  const render = handlebars.compile(template);
  const panel = extra => render({
    hasFormulas: true,
    formulas: [{ uuid: "Actor.a.Item.b", name: "Seal the Flat", actor: "Vessa", learned: true, selected: true }],
    formulaName: "Seal the Flat", formulaImg: "x.webp", subtitle: "Ward · Magnitude 2 · General",
    leaderName: "Vessa", wealthLabel: "¥900", learned: true, canAct: true, isGM: true,
    hasWorking: true, leak: "leak", magnitudeLocked: false, magnitudeOptions: [{ value: 2, selected: true }],
    stages: STAGES.map((key, i) => ({ key, step: i + 1, label: `${i + 1}. ${key}`, hint: "h", done: false, current: i === 0 })),
    study: { progress: "Progress 0 / 4", hasProject: false, goalMet: false },
    components: { showChoices: true, choices: [{ index: 0, selected: true, label: "Path 1 — ¥180" }], hasPrice: true, priceLabel: "¥180", canAfford: true, paid: false },
    sanctum: { modes: [{ value: "temporary", label: "Temporary", selected: true, locked: false }], built: false, hasProject: false, progress: "Progress 0 / 6", forcedHint: null },
    seal: { characteristics: [{ value: "presence", label: "Persona", selected: true }], assistHint: "a", ready: false, blockedHint: "blocked" },
    payoff: { outcome: null, upkeep: "u", ready: false },
    firewall: "no Essence", working: { formulaUuid: "Actor.a.Item.b" },
    ...extra,
  });

  ok(render({}).includes("gw-rw-pick"), "the empty panel renders down to the Formula picker");
  const open = panel();
  for (const action of ["startWorking", "createProject", "payComponents", "claimSanctum", "seal", "completeWorking", "abandonWorking", "resetStage", "openDoc"]) {
    if (action === "startWorking") continue; // only on the not-yet-started panel
    if (!open.includes(`data-action="${action}"`)) failures.push(`template: no ${action} button`);
  }
  ok(true, "every stage button the app declares an action for is in the template");
  ok(/data-action="seal"[^>]*disabled/.test(open), "Seal Ritual renders disabled while the stage is not ready");
  const sealable = panel({ seal: { characteristics: [], assistHint: "a", ready: true, blockedHint: null } });
  ok(!/data-action="seal"[^>]*disabled/.test(sealable), "…and enabled once learned + paid + sanctum line up");
  const built = panel({ sanctum: { modes: [], built: true, hasProject: true, projectUuid: "Actor.a.Item.c", progress: "Progress 3 / 6", forcedHint: "forced" } });
  ok(built.includes('data-action="rollProject" data-stage="sanctum"'), "a built sanctum offers its Project roll");
  const spectator = panel({ canAct: false });
  ok(/data-action="payComponents"[^>]*disabled/.test(spectator) && /data-action="claimSanctum"[^>]*disabled/.test(spectator),
    "a user who does not own the Ritual Leader gets every stage button disabled");
  ok(!/data-action="payComponents"[^>]*disabled/.test(open), "…and the owner does not");
  const unpriced = panel({ components: { showChoices: false, choices: [], hasPrice: false, priceLabel: "no ¥ total", canAfford: true, paid: false } });
  ok(/data-action="payComponents"[^>]*disabled/.test(unpriced) && !unpriced.includes("CannotAfford"),
    "a card with no printed ¥ total offers no Pay and raises no affordability warning");
  ok(panel({ hasWorking: false, canStart: true, startHint: "s" }).includes('data-action="startWorking"'), "the pre-start panel offers Start Working");
  ok(!panel({ isGM: false }).includes('data-action="resetStage"'), "the Director-only stage resets stay hidden from players");
}

if (failures.length) {
  console.error(`\nRitual Working smoke FAILED:\n  - ${failures.join("\n  - ")}`);
  process.exit(1);
}
console.log("\nRitual Working smoke passed");
