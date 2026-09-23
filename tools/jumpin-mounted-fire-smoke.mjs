#!/usr/bin/env node
/**
 * 0.3.114 — Jump-In mounted Fire + weapon-lock edge. Static smoke, no live Foundry.
 *
 * The bug: a fully Jumped-In pilot could not Fire a properly mounted Streetlash. The refuse path was
 * module.mjs -> jumpedInBlocksAbility, which only let a fixed dsid allowlist through; a spawned
 * `gear-use-streetlash` is neither Wired nor on that list, so it warned JackedInPhysical.
 *
 * The fix is a predicate, not another allowlist row (Michael lock 1): mounted gear + `jumpedInto`
 * is seat fire. Unmounted personal gear-use stays blocked.
 *
 * Also covers the RAW edges (locks 2 and 3): Jump-In's weapon-lock edge on seat fire, and the
 * Vehicle Rig-Pilot feature Pilot and Gunner's extra edge on Rigged Fire made while Jumped In.
 *
 * Run: node tools/jumpin-mounted-fire-smoke.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { atLeast } from "./lib/module-version.mjs";
import {
  JUMP_IN_SEAT_DSIDS,
  RIGGED_FIRE_DSID,
  abilityPowerRollModifiers,
  isGearUseDsid,
  isMountedSeatFire,
  jumpInFireEdges,
  jumpedInBlocksAbility,
} from "../scripts/wired-state.mjs";
import { isMountedWeapon, weaponSkillKey } from "../scripts/weapon-skills.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok.push(`  ✓ ${msg}`) : fail.push(msg));
const readJson = path => JSON.parse(readFileSync(path, "utf8").replace(/^﻿/, ""));

const module = readJson("module.json");

console.log("Jump-In mounted Fire smoke (0.3.114)\n");
note(atLeast(module.version, "0.3.114"), `module.json >= 0.3.114 (got ${module.version})`);

/* ------------------------------------------------------------------ */
/*  fakes — a pilot sheet with two guns and the abilities they armed   */
/* ------------------------------------------------------------------ */
const gear = (dsid, { mountedOn = null } = {}) => ({
  id: `gear-${dsid}`,
  type: "treasure",
  system: { _dsid: dsid, kind: "weapon" },
  flags: {
    [MODULE_ID]: {
      gear: { range: "long", damage: "6/9/12" },
      ...(mountedOn ? { mount: { mountedOn, kitDsid: "gun-rack", kitName: "Gun Rack", scale: "" } } : {}),
    },
  },
});

// equipment-use.mjs shape: `gear-use-<sku>` plus a fromGearId flag back to the treasure.
const useAbility = gearItem => ({
  system: { _dsid: `gear-use-${gearItem.system._dsid}` },
  flags: { [MODULE_ID]: { fromGearId: gearItem.id } },
});

const streetlash = gear("streetlash", { mountedOn: "kit-weaponry-1" });
const scrapBow = gear("scrap-bow");
const stowedStreetlash = { ...gear("streetlash"), id: "gear-streetlash-stowed" };
const sheet = [streetlash, scrapBow, stowedStreetlash];

/** Exactly what module.mjs's patched AbilityModel#use computes before it calls the gate. */
function gateInput(ability, { pilotGear, jumpedIn }) {
  const fromGearId = ability.flags?.[MODULE_ID]?.fromGearId ?? null;
  const sourceGear = fromGearId ? pilotGear.find(item => item.id === fromGearId) ?? null : null;
  return {
    state: "jackedIn",
    wired: false,
    rollEnabled: true,
    dsid: ability.system._dsid,
    jumpedIn,
    gearMounted: !!sourceGear && isMountedWeapon(sourceGear),
    fromGear: !!fromGearId,
  };
}

const blocked = (ability, jumpedIn) => jumpedInBlocksAbility(gateInput(ability, { pilotGear: sheet, jumpedIn }));
const stowedUse = { ...useAbility(stowedStreetlash), flags: { [MODULE_ID]: { fromGearId: stowedStreetlash.id } } };

/* ------------------------------------------------------------------ */
/*  lock 1 — the refuse path                                          */
/* ------------------------------------------------------------------ */
note(!blocked(useAbility(streetlash), true), "Jumped-In pilot may Fire a mounted Streetlash");
note(blocked(useAbility(scrapBow), true), "Jumped-In pilot still blocked on an unmounted scrap-bow (JackedInPhysical)");
note(blocked(stowedUse, true), "an unmounted Streetlash in the pack is still blocked");
note(blocked(useAbility(streetlash), false), "a merely Jacked In pilot (no Jump-In) is still blocked on the same mounted gun");
note(!jumpedInBlocksAbility({ state: "jackedIn", rollEnabled: true, dsid: RIGGED_FIRE_DSID }),
  "Rigged Fire still passes on the seat allowlist");
note(!jumpedInBlocksAbility({ state: "jackedIn", rollEnabled: true, dsid: "deploy-and-command" }),
  "Deploy & Command still passes on the seat allowlist");
note(jumpedInBlocksAbility({ state: "jackedIn", rollEnabled: true, dsid: "power-strike", jumpedIn: true }),
  "a plain melee ability is blocked under Jump-In even with the new predicate");
note(!jumpedInBlocksAbility({ state: "jackedIn", rollEnabled: true, dsid: "gear-use-streetlash", wired: true }),
  "Wired abilities are untouched by the gate");
note(!jumpedInBlocksAbility({ state: "overlay", rollEnabled: true, dsid: "gear-use-scrap-bow" }),
  "Overlay never blocks (the gate is Jacked In only)");
note(!jumpedInBlocksAbility({ state: "jackedIn", rollEnabled: false, dsid: "gear-use-scrap-bow" }),
  "an ability with no power roll never trips the gate");

// A predicate, not another dsid table.
const gearUseRows = [...JUMP_IN_SEAT_DSIDS].filter(dsid => isGearUseDsid(dsid));
note(!gearUseRows.length, `JUMP_IN_SEAT_DSIDS carries no gear-use rows${gearUseRows.length ? ` — ${gearUseRows.join(", ")}` : ""}`);
note(JUMP_IN_SEAT_DSIDS.has(RIGGED_FIRE_DSID), "rigged-fire is still on the seat allowlist");
note(JUMP_IN_SEAT_DSIDS.size === 55, `the seat allowlist did not grow (got ${JUMP_IN_SEAT_DSIDS.size})`);
note(isGearUseDsid("gear-use-streetlash") && !isGearUseDsid("rigged-fire"), "isGearUseDsid reads the equipment-use prefix");
note(isMountedSeatFire({ jumpedIn: true, dsid: "gear-use-streetlash", gearMounted: true }), "isMountedSeatFire: mounted + Jumped In");
note(!isMountedSeatFire({ jumpedIn: true, dsid: "gear-use-streetlash", gearMounted: false }), "isMountedSeatFire: unmounted is not seat fire");
note(!isMountedSeatFire({ jumpedIn: false, dsid: "gear-use-streetlash", gearMounted: true }), "isMountedSeatFire: no Jump-In is not seat fire");

/* ------------------------------------------------------------------ */
/*  locks 2 + 3 — weapon-lock edge and Pilot and Gunner               */
/* ------------------------------------------------------------------ */
const edgesFor = (dsid, opts = {}) => abilityPowerRollModifiers({
  wired: false, state: "jackedIn", dsid, jumpedIn: true, ...opts,
}).edges;

note(edgesFor("gear-use-streetlash", { gearMounted: true }) >= 1, "mounted Fire under Jump-In rolls the weapon-lock edge (>= 1)");
note(edgesFor(RIGGED_FIRE_DSID) >= 1, "Rigged Fire under Jump-In rolls the weapon-lock edge (>= 1)");
note(edgesFor(RIGGED_FIRE_DSID, { hasPilotAndGunner: true }) === 2,
  "Pilot and Gunner: Rigged Fire under Jump-In rolls 2 edges (weapon lock + the feature's extra edge)");
note(edgesFor("gear-use-streetlash", { gearMounted: true, hasPilotAndGunner: true }) === 1,
  "Pilot and Gunner's extra edge is Rigged Fire only — mounted Fire keeps the single weapon-lock edge");
note(edgesFor("gear-use-scrap-bow", { gearMounted: false }) === 0, "no weapon-lock edge on an unmounted personal weapon");
note(abilityPowerRollModifiers({ wired: false, state: "jackedIn", dsid: RIGGED_FIRE_DSID }).edges === 0,
  "no weapon-lock edge without the jumpedInto flag");
note(jumpInFireEdges({ jumpedIn: true, dsid: RIGGED_FIRE_DSID }) === 1, "jumpInFireEdges: Rigged Fire = 1");
note(jumpInFireEdges({ jumpedIn: true, dsid: RIGGED_FIRE_DSID, hasPilotAndGunner: true }) === 2,
  "jumpInFireEdges: Rigged Fire + Pilot and Gunner = 2");
note(jumpInFireEdges({ jumpedIn: false, dsid: RIGGED_FIRE_DSID, hasPilotAndGunner: true }) === 0,
  "jumpInFireEdges: nothing without Jump-In");

// The Jacked In meat bane / Wired edge arithmetic must be exactly what it was.
note(abilityPowerRollModifiers({ wired: true, hasHacking: true, softwareEdges: 1, state: "jackedIn" }).edges === 3,
  "Wired Jacked In arithmetic unchanged (Hacking + Jacked In + a Reader)");
note(abilityPowerRollModifiers({ wired: false, hasHacking: true, state: "overlay" }).banes === 1,
  "Overlay meat bane unchanged");

/* ------------------------------------------------------------------ */
/*  the call site actually wires it up                                 */
/* ------------------------------------------------------------------ */
const moduleSrc = readFileSync("scripts/module.mjs", "utf8");
note(moduleSrc.includes("isMountedWeapon"), "module.mjs resolves the source gear through isMountedWeapon");
note(moduleSrc.includes('getFlag?.(MODULE_ID, "fromGearId")'), "module.mjs reads the ability's fromGearId flag");
note(moduleSrc.includes('getFlag?.(MODULE_ID, "jumpedInto")'), "module.mjs reads the pilot's jumpedInto flag");
note(moduleSrc.includes("PILOT_AND_GUNNER_DSID"), "module.mjs detects the Pilot and Gunner feature");
note(/jumpedInBlocksAbility\(\{[\s\S]{0,240}gearMounted/.test(moduleSrc), "module.mjs passes gearMounted into the gate");
note(/abilityPowerRollModifiers\(\{[\s\S]{0,360}hasPilotAndGunner/.test(moduleSrc), "module.mjs passes the edge inputs into abilityPowerRollModifiers");

/* ------------------------------------------------------------------ */
/*  out of scope stayed out of scope                                   */
/* ------------------------------------------------------------------ */
const riggerSrc = readFileSync("scripts/rigger-vertical.mjs", "utf8");
note(/meatInertEffect[\s\S]{0,600}changes: \[\],/.test(riggerSrc), "the meat-inert effect still ships empty changes (not reworked)");
note(riggerSrc.includes('setFlag(MODULE_ID, "jumpedInto"'), "Jump-In still stamps jumpedInto on the pilot");
const equipSrc = readFileSync("scripts/equipment-use.mjs", "utf8");
note(equipSrc.includes("fromGearId: gearItem.id"), "gear-use abilities still carry fromGearId");
note(!/machineActor/.test(equipSrc), "equipment-use arms no Fire ability onto the deployed Machine Actor");

/* ------------------------------------------------------------------ */
/*  the gun in the bug report                                          */
/* ------------------------------------------------------------------ */
const sku = readJson("src/packs/gear/weapons/mounted/streetlash.json");
note(sku.system._dsid === "streetlash", "the Streetlash SKU still ships with _dsid streetlash");
note(weaponSkillKey(streetlash) === "gunnery", "a mounted Streetlash still answers to Gunnery (B49)");
note(existsSync("src/packs/classes/wrench/origins/vehicle-rig-pilot/pilot-and-gunner.json"),
  "the Pilot and Gunner feature SKU still ships");

const directorNote = "docs/directors/jumpin-mounted-fire-03114.md";
note(existsSync(directorNote), `Director note ships (${directorNote})`);
if (existsSync(directorNote)) {
  const dn = readFileSync(directorNote, "utf8");
  note(dn.includes("weapon-lock") && dn.includes("Pilot and Gunner") && dn.includes("mounted"),
    "Director note covers seat fire, the weapon-lock edge, and Pilot and Gunner");
}

/* ------------------------------------------------------------------ */
console.log(ok.join("\n"));
console.log("");
if (fail.length) {
  for (const msg of fail) console.error(`  ✗ ${msg}`);
  console.error(`\njumpin-mounted-fire smoke FAILED — ${fail.length} of ${fail.length + ok.length} check(s).`);
  process.exit(1);
}
console.log(`jumpin-mounted-fire smoke PASS — ${ok.length} checks.`);
