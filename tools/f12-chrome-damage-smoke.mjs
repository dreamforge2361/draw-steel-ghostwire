#!/usr/bin/env node
/**
 * F12 smoke: chrome Suppress / Damaged / Destroyed ladder, the no-delete lock,
 * Soft/Salvage grade shift, the Hacker 1-shot programs and the Technomancer paths.
 *
 * Run: node tools/f12-chrome-damage-smoke.mjs
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  CHROME_STATES,
  CHROME_STATE_FLAG,
  GRADE_SHIFT,
  MEND_ABILITIES,
  STATE_RANK,
  STRIKE_LADDERS,
  benefitsOffline,
  chromeDeleteBlocked,
  chromeGrade,
  chromeRefundBlocked,
  chromeStrikeOf,
  escalateState,
  isChromeItem,
  isDestroyed,
  lockedIntegrity,
  planChromeStrike,
  planRepair,
  readChromeState,
  repairProject,
  resolveChromeHit,
  resolveRepair,
  stepState,
} from "../scripts/chrome-damage.mjs";
import { atLeast } from "./lib/module-version.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const MOD = "draw-steel-ghostwire";
const module = JSON.parse(readFileSync("module.json", "utf8"));
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const boot = readFileSync("scripts/module.mjs", "utf8");
const damage = readFileSync("scripts/chrome-damage.mjs", "utf8");
const inventory = readFileSync("docs/spikes/F12-CHROME-DAMAGE-INVENTORY.md", "utf8");
const raw = readFileSync("docs/raw/09-chrome-body-integrity.md", "utf8");
const director = readFileSync("docs/directors/f12-chrome-damage.md", "utf8");
const templates = JSON.parse(readFileSync("scripts/data/payload-use-templates.json", "utf8"));

/** A chrome Item as it looks in the pack / on a sheet. */
const chrome = (grade, integrity = 2, state = null) => ({
  system: { _dsid: "test-chrome" },
  flags: { [MOD]: {
    chrome: { grade, location: "eyes", integrity, price: 2000, availability: "professional" },
    ...(state ? { [CHROME_STATE_FLAG]: { state } } : {}),
  } },
});

console.log("F12 chrome damage smoke\n");

console.log("1) Ship surface");
note(atLeast(module.version, "0.3.113"), `module.json is ≥ 0.3.113 (got ${module.version})`);
note(boot.includes("registerChromeDamage()"), "module.mjs registers registerChromeDamage");
note(boot.includes("chromeRefundBlocked"), "module.mjs delete-refund hook consults chromeRefundBlocked");
note(inventory.includes("Destroyed **must not** delete the Item"), "inventory spike still carries the no-delete lock");
note(raw.includes("Suppress / Damage / Destroy"), "RAW chapter still has the Suppress/Damage/Destroy section");
note(raw.includes("flags.draw-steel-ghostwire.chromeState") || raw.includes("chromeState"), "RAW chapter documents the Foundry flag");
note(director.length > 1000, "Director note exists and is not a stub");

console.log("\n2) States, flag, and the ladder");
note(CHROME_STATES.join(",") === "ok,suppressed,damaged,destroyed", "four states in rank order");
note(CHROME_STATE_FLAG === "chromeState", "state lives on flags.<module>.chromeState (adjacent to the catalog flag)");
note(!damage.includes("flags.${MODULE_ID}.chrome\"") && !/setFlag\(MODULE_ID, "chrome"/.test(damage), "the writer never overwrites the catalog chrome flag");
note(STATE_RANK.destroyed === 3 && STATE_RANK.ok === 0, "rank order ok < suppressed < damaged < destroyed");
note(stepState("suppressed", 1) === "damaged" && stepState("suppressed", -1) === "ok", "stepState walks the ladder both ways");
note(stepState("destroyed", 5) === "destroyed" && stepState("ok", -5) === "ok", "stepState clamps at both ends");
note(escalateState("damaged", "suppressed") === "damaged", "a hit never heals: the worse state wins");
note(readChromeState(chrome("standard")).state === "ok", "unstamped chrome reads as Online");
note(readChromeState(chrome("standard", 2, "damaged")).state === "damaged", "a stamped Item reads its state back");
note(isChromeItem(chrome("standard")) && !isChromeItem({ flags: {} }), "isChromeItem keys on the catalog flag");

console.log("\n3) Grade shift — Soft is harder to EMP, Salvage is fragile");
note(GRADE_SHIFT.soft === -1 && GRADE_SHIFT.standard === 0 && GRADE_SHIFT.salvage === 1, "shift table: soft −1 / standard 0 / salvage +1");
note(chromeGrade(chrome("soft")) === "soft" && chromeGrade({ flags: { [MOD]: { chrome: {} } } }) === "standard", "grade defaults to standard");
const pulseStd = resolveChromeHit({ grade: "standard", ladder: "suppress", tier: 2 });
const pulseSoft = resolveChromeHit({ grade: "soft", ladder: "suppress", tier: 2 });
const pulseSalvage = resolveChromeHit({ grade: "salvage", ladder: "suppress", tier: 2 });
note(pulseStd.state === "suppressed", "Pulse tier 2 suppresses standard chrome");
note(pulseSoft.state === "ok" && pulseSoft.resisted, "Soft chrome shrugs Pulse off entirely");
note(pulseSalvage.state === "damaged", "Salvage chrome comes out Damaged from the same Pulse");
note(resolveChromeHit({ grade: "soft", ladder: "destroy", tier: 3 }).state === "damaged", "Sunder Spike can never Destroy Soft chrome");
note(resolveChromeHit({ grade: "standard", ladder: "destroy", tier: 3 }).state === "destroyed", "Sunder Spike tier 3 Destroys standard chrome");
note(resolveChromeHit({ grade: "standard", ladder: "destroy", tier: 1 }).state === "damaged", "Sunder Spike tier 1 only Damages");
note(resolveChromeHit({ grade: "standard", ladder: "suppress", tier: 1 }).state === "ok", "Pulse tier 1 does nothing");
note(STRIKE_LADDERS.damage.join(",") === "suppressed,damaged,damaged", "System Rot ladder is suppress → damage → damage");

console.log("\n4) Strike planning against an already-hurt implant");
const worse = planChromeStrike({ current: "damaged", grade: "standard", ladder: "suppress", tier: 2 });
note(worse.to === "damaged" && !worse.changed, "a Suppress hit cannot improve a Damaged implant");
const escalate = planChromeStrike({ current: "suppressed", grade: "standard", ladder: "damage", tier: 2 });
note(escalate.to === "damaged" && escalate.changed, "System Rot escalates a Suppressed implant to Damaged");

console.log("\n5) Repair paths");
note(resolveRepair({ current: "suppressed", path: "reboot" }) === "ok", "reboot clears Suppressed");
note(resolveRepair({ current: "damaged", path: "reboot" }) === "damaged", "reboot does nothing for Damaged");
note(resolveRepair({ current: "suppressed", path: "mend" }) === "ok", "Resonance Mending clears Suppressed");
note(resolveRepair({ current: "damaged", path: "mend" }) === "damaged", "base Mending does not fix Damaged");
note(resolveRepair({ current: "damaged", path: "mendDeep" }) === "ok", "2-Resonance Mending restores Damaged chrome");
note(resolveRepair({ current: "destroyed", path: "mendDeep" }) === "damaged", "2-Resonance Mending drops Destroyed to Damaged (minimal function)");
note(resolveRepair({ current: "destroyed", path: "rite" }) === "ok", "Machine God's Rite restores anything");
note(resolveRepair({ current: "destroyed", path: "project" }) === "ok", "a downtime repair Project restores anything");
note(planRepair({ current: "ok", path: "rite" }).changed === false, "repairing healthy chrome is a no-op");
note(MEND_ABILITIES["resonance-mending"] === "mendDeep" && MEND_ABILITIES["machine-gods-rite"] === "rite",
  "the two RAW menders are wired to their paths");

console.log("\n6) The no-delete lock and locked Integrity");
const destroyed = chrome("standard", 6, "destroyed");
note(isDestroyed(destroyed), "destroyed chrome reads as destroyed");
note(chromeDeleteBlocked(destroyed, {}) === true, "a bare delete of Destroyed chrome is refused");
note(chromeDeleteBlocked(destroyed, { ghostwireChromeReplace: true }) === false, "the Replace path is allowed through");
note(chromeDeleteBlocked(chrome("standard", 6, "damaged"), {}) === false, "Damaged chrome can still be removed normally");
note(chromeRefundBlocked(destroyed, {}) === true, "Destroyed chrome never refunds Body Integrity");
note(chromeRefundBlocked(destroyed, { ghostwireChromeReplace: true }) === true, "even a sanctioned Replace refunds nothing");
note(chromeRefundBlocked(chrome("standard", 6), {}) === false, "healthy chrome still refunds on removal");
note(!/\.delete\(\)/.test(damage.replace(/item\.delete\(\{ ghostwireChromeReplace: true \}\)/g, "")),
  "chrome-damage.mjs has exactly one delete call, and it is the sanctioned Replace");
note(lockedIntegrity([destroyed, chrome("standard", 2, "damaged"), chrome("soft", 1)]) === 6,
  "lockedIntegrity sums only Destroyed implants");
note(benefitsOffline(destroyed) && benefitsOffline(chrome("standard", 2, "suppressed")), "Suppressed + Destroyed take benefits offline");
note(!benefitsOffline(chrome("standard", 2, "damaged")), "Damaged keeps its benefit (at a penalty)");

console.log("\n7) Repair Project recipe");
const dmgProject = repairProject(chrome("standard", 4, "damaged"));
const deadProject = repairProject(chrome("standard", 4, "destroyed"));
note(dmgProject.goal === 70 && dmgProject.cost === 500, `Damaged: goal 30+10×integrity, parts 25% of ¥ (got ${dmgProject.goal}/${dmgProject.cost})`);
note(deadProject.goal === 140 && deadProject.cost === 1200, `Destroyed: goal 60+20×integrity, parts 60% of ¥ (got ${deadProject.goal}/${deadProject.cost})`);
note(deadProject.goal > dmgProject.goal && deadProject.cost > dmgProject.cost, "repair-or-replace costs more than a repair");
note(repairProject(chrome("standard", 4)) === null, "healthy chrome has no repair Project");
note(repairProject(chrome("standard", 4, "suppressed")) === null, "Suppressed needs a reboot, not a Project");

console.log("\n8) Hacker 1-shot programs");
const payloadDir = "src/packs/matrix/payloads";
const payloads = Object.fromEntries(readdirSync(payloadDir)
  .filter(f => f.endsWith(".json") && f !== "_folder.json")
  .map(f => [f.replace(/\.json$/, ""), JSON.parse(readFileSync(join(payloadDir, f), "utf8"))]));
for (const [file, expect] of [["pulse", "suppress"], ["system-rot", "damage"], ["sunder-spike", "destroy"]]) {
  const doc = payloads[file];
  note(!!doc, `${file}.json is in the payloads pack`);
  if (!doc) continue;
  const flags = doc.flags[MOD];
  note(flags.matrix.role === "payload", `${file} is a payload (magazine chip)`);
  note(flags.mod?.magazine === true, `${file} loads as a deck / Wired Native magazine`);
  note(flags.chromeStrike?.ladder === expect, `${file} declares the ${expect} ladder`);
  const strike = chromeStrikeOf(doc);
  note(strike?.ladder?.length === 3, `${file} resolves to a three-rung ladder`);
  note(doc.folder === "rPSzM2YqrQBEstrv", `${file} sits in the Payloads folder`);
  note(!!templates.payloads[doc.system._dsid], `${file} has a Run-ability template`);
}
const echelons = ["pulse", "system-rot", "sunder-spike"].map(f => payloads[f].flags[MOD].matrix.echelon);
note(echelons.join(",") === "1,2,3", `programs climb E1 → E2 → E3 (got ${echelons.join(",")})`);
const prices = ["pulse", "system-rot", "sunder-spike"].map(f => payloads[f].flags[MOD].matrix.price);
note(prices[0] < prices[1] && prices[1] < prices[2], `¥ climbs with the ladder (${prices.join(" < ")})`);
note(payloads["sunder-spike"].flags[MOD].matrix.availability === "military", "Sunder Spike is Military availability");
note(chromeStrikeOf({ flags: { [MOD]: {} } }) === null, "a plain payload carries no chrome strike");

console.log("\n9) Technomancer paths");
const techDir = "src/packs/classes/technomancer/abilities";
const pulseRite = JSON.parse(readFileSync(join(techDir, "resonance-pulse.json"), "utf8"));
const sunder = JSON.parse(readFileSync(join(techDir, "chrome-sunder.json"), "utf8"));
note(pulseRite.system._dsid === "resonance-pulse" && pulseRite.flags[MOD].chromeStrike.ladder === "suppress", "Resonance Pulse is the Technomancer suppress");
note(sunder.system._dsid === "chrome-sunder" && sunder.flags[MOD].chromeStrike.ladder === "destroy", "Chrome Sunder is the Technomancer destroy");
note(sunder.system.effects.spend00000000000.resource.value === 5, "Chrome Sunder costs 5 Resonance");
note(pulseRite.system.effects.spend00000000000.resource.value === 1, "Resonance Pulse escalates from 1 Resonance");
note(sunder.system.prerequisites.dsid.includes("technomancer") && pulseRite.system.prerequisites.dsid.includes("technomancer"), "both are Technomancer-gated");
note(existsSync(join(techDir, "resonance-mending.json")) && existsSync(join(techDir, "machine-gods-rite.json")), "the mend abilities the smoke wires to still exist");
note(damage.includes("MEND_ABILITIES[ability.system?._dsid"), "ability-use hook routes mends by _dsid");
note(damage.includes("fromPayloadId"), "ability-use hook finds the chip behind a Run ability");

console.log("\n10) Strings");
const cd = lang.GHOSTWIRE.ChromeDamage;
note(cd.States.suppressed === "Suppressed" && cd.States.destroyed === "Destroyed", "state labels");
note(cd.Notify.DeleteBlocked.includes("{name}"), "delete-blocked warning is localized");
note(cd.Notify.NoRefund.includes("{cost}"), "no-refund notice names the locked Integrity");
note(cd.LockedIntegrity.includes("{locked}"), "hero-sheet locked-Integrity line");
note(Object.keys(cd.Mend.Hint).length === 5, "a hint per repair path");
for (const key of ["Pulse", "SystemRot", "SunderSpike"]) {
  note(!!lang.GHOSTWIRE.Matrix.Items[key]?.Name, `Matrix lang for ${key}`);
  note(!!lang.GHOSTWIRE.PayloadUse.Payloads[key]?.Tier3, `Run tier text for ${key}`);
}
note(!!lang.GHOSTWIRE.Classes.Technomancer.Items.ResonancePulse?.Name, "Resonance Pulse lang");
note(!!lang.GHOSTWIRE.Classes.Technomancer.Items.ChromeSunder?.Tier3, "Chrome Sunder lang");
note(lang.GHOSTWIRE.Classes.Technomancer.Items.ChromeSunder.Tier3.includes("not removed"), "Chrome Sunder tier 3 states the Item stays");

console.log("\n11) Nothing else broke");
note(boot.includes("GHOSTWIRE.Integrity.Installed"), "chrome install notice untouched");
note(boot.includes("Math.floor(chrome.integrity * 0.75)"), "the 75% removal refund is still there for healthy chrome");
note(boot.includes("registerKiosk()") && boot.includes("registerChargenWizard()"), "kiosk + chargen still registered");

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
