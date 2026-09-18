#!/usr/bin/env node
/**
 * B59 smoke: Hacker L1 and Scout L1 fills must not embed future-level grants.
 *
 * Run: node tools/pregen-level-gate-smoke.mjs
 * Does not write actor JSON or rebuild packs.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  advancementMeetsLevel,
  advancementRequiredLevel,
  abilityAllowedAtLevel,
  buildGrantLevelByDsid,
} from "./lib/pregen-level-gate.mjs";

const read = p => JSON.parse(readFileSync(p, "utf8"));
const idFromUuid = uuid => uuid?.split(".").pop();

const INDEX = new Map();
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".json") && e.name !== "_folder.json") {
      let j; try { j = read(p); } catch { continue; }
      if (j?._id && j?.type) INDEX.set(j._id, { path: p, json: j });
    }
  }
})("src/packs");

const GRANT_LEVEL_BY_DSID = buildGrantLevelByDsid(INDEX, idFromUuid);
const TARGET = 1;
const failures = [];
const ok = (cond, msg) => { if (!cond) failures.push(msg); else console.log(`  ✓ ${msg}`); };

console.log("B59 pregen level-gate smoke\n");

// --- Unit: grant-level index knows the overgrant cases
console.log("1) Grant-level index");
ok(GRANT_LEVEL_BY_DSID.get("dual-boot") === 6, `dual-boot granted at L${GRANT_LEVEL_BY_DSID.get("dual-boot")}`);
ok(GRANT_LEVEL_BY_DSID.get("backdoor-override") === 8, `backdoor-override granted at L${GRANT_LEVEL_BY_DSID.get("backdoor-override")}`);
ok(GRANT_LEVEL_BY_DSID.get("careful-observation") === 3, `careful-observation granted at L${GRANT_LEVEL_BY_DSID.get("careful-observation")}`);
ok(GRANT_LEVEL_BY_DSID.get("deep-scan") === 1, `deep-scan granted at L${GRANT_LEVEL_BY_DSID.get("deep-scan")}`);
ok(GRANT_LEVEL_BY_DSID.get("quarry") === 1, `quarry granted at L${GRANT_LEVEL_BY_DSID.get("quarry")}`);

console.log("\n2) abilityAllowedAtLevel at L1");
ok(!abilityAllowedAtLevel("dual-boot", TARGET, GRANT_LEVEL_BY_DSID), "Dual Boot blocked at L1");
ok(!abilityAllowedAtLevel("backdoor-override", TARGET, GRANT_LEVEL_BY_DSID), "Backdoor Override blocked at L1");
ok(!abilityAllowedAtLevel("careful-observation", TARGET, GRANT_LEVEL_BY_DSID), "Careful Observation / Glass the Block blocked at L1");
ok(abilityAllowedAtLevel("deep-scan", TARGET, GRANT_LEVEL_BY_DSID), "Deep Scan allowed at L1");
ok(abilityAllowedAtLevel("quarry", TARGET, GRANT_LEVEL_BY_DSID), "Quarry allowed at L1");
ok(abilityAllowedAtLevel("command-presence", TARGET, GRANT_LEVEL_BY_DSID), "manual seed (no pool) still allowed");

console.log("\n3) Class advancement walk gated at L1");
function collectGrantedDsids(classPath, targetLevel) {
  const cls = read(classPath);
  const out = new Set();
  const warnings = [];
  for (const adv of Object.values(cls.system?.advancements ?? {})) {
    if (!advancementMeetsLevel(adv, targetLevel, { warnings, label: adv.name })) continue;
    if (adv.type !== "itemGrant") continue;
    for (const entry of adv.pool ?? []) {
      const id = idFromUuid(entry.uuid);
      const dsid = INDEX.get(id)?.json?.system?._dsid;
      if (dsid) out.add(dsid);
    }
  }
  return { out, warnings, cls };
}

const hacker = collectGrantedDsids("src/packs/classes/hacker/hacker.json", TARGET);
ok(!hacker.out.has("dual-boot"), "Hacker L1 class walk excludes dual-boot");
ok(!hacker.out.has("backdoor-override"), "Hacker L1 class walk excludes backdoor-override");
ok(hacker.out.has("deep-scan") || [...hacker.out].some(d => d.includes("scan") || d.includes("seize") || d.includes("ghost")), 
  `Hacker L1 still grants some L1 programs (got ${hacker.out.size} pool dsids)`);

const scout = collectGrantedDsids("src/packs/classes/scout/scout.json", TARGET);
ok(!scout.out.has("careful-observation"), "Scout L1 class walk excludes careful-observation");

// Prove L3 / L6 / L8 advancements exist but are filtered
const hackerL6 = Object.values(read("src/packs/classes/hacker/hacker.json").system.advancements)
  .filter(a => advancementRequiredLevel(a) === 6);
const scoutL3 = Object.values(read("src/packs/classes/scout/scout.json").system.advancements)
  .filter(a => advancementRequiredLevel(a) === 3);
ok(hackerL6.some(a => (a.name || "").includes("Dual Boot")), "Hacker has Dual Boot advancement at L6");
ok(scoutL3.some(a => (a.name || "").toLowerCase().includes("careful") || (a.pool || []).some(p => {
  const id = idFromUuid(p.uuid);
  return INDEX.get(id)?.json?.system?._dsid === "careful-observation";
})), "Scout has Careful Observation advancement at L3");
ok(hackerL6.every(a => !advancementMeetsLevel(a, TARGET)), "No L6 hacker advancement meets L1");
ok(scoutL3.every(a => !advancementMeetsLevel(a, TARGET)), "No L3 scout advancement meets L1");

console.log("\n4) Simulated robust-fill seed (roster + class walk) for Hacker / Scout L1");
function findInClass(cls, dsid) {
  const roots = [`src/packs/classes/${cls}`, `src/packs/classes/${cls}/abilities`];
  if (existsSync(`src/packs/classes/${cls}/origins`)) {
    for (const dir of readdirSync(`src/packs/classes/${cls}/origins`, { withFileTypes: true }).filter(d => d.isDirectory()))
      roots.push(`src/packs/classes/${cls}/origins/${dir.name}`);
  }
  for (const root of roots) {
    const p = join(root, `${dsid}.json`);
    if (existsSync(p)) return read(p);
  }
  return null;
}

/** Minimal resolveGrants mirror — same gate as the generator. */
function resolveGrants(seed, targetLevel) {
  const items = new Map(seed.filter(Boolean).map(i => [i._id, i]));
  const queue = [...items.values()];
  while (queue.length) {
    const item = queue.shift();
    for (const adv of Object.values(item.system?.advancements ?? {})) {
      if (!advancementMeetsLevel(adv, targetLevel)) continue;
      if (adv.type !== "itemGrant") continue;
      for (const entry of adv.pool ?? []) {
        // chooseN: take all for overgrant detection (worst case)
        const id = idFromUuid(entry.uuid);
        const found = INDEX.get(id);
        if (!found || items.has(id)) continue;
        items.set(id, found.json);
        queue.push(found.json);
      }
    }
  }
  return [...items.values()].map(i => i.system?._dsid).filter(Boolean);
}

function seedAbilities(cls, abilities, targetLevel) {
  return abilities.map(a => {
    if (!abilityAllowedAtLevel(a, targetLevel, GRANT_LEVEL_BY_DSID)) return null;
    return findInClass(cls, a);
  }).filter(Boolean);
}

const hackerSeed = [
  read("src/packs/classes/hacker/hacker.json"),
  findInClass("hacker", "disruptor"),
  ...seedAbilities("hacker", ["deep-scan", "dual-boot", "backdoor-override"], TARGET),
];
const hackerDsids = resolveGrants(hackerSeed, TARGET);
ok(!hackerDsids.includes("dual-boot"), "Hacker L1 fill output excludes dual-boot");
ok(!hackerDsids.includes("backdoor-override"), "Hacker L1 fill output excludes backdoor-override");
ok(hackerDsids.includes("deep-scan"), "Hacker L1 fill still includes deep-scan");

const scoutSeed = [
  read("src/packs/classes/scout/scout.json"),
  findInClass("scout", "hunter"),
  ...seedAbilities("scout", ["quarry", "steady-the-scope", "careful-observation"], TARGET),
];
const scoutDsids = resolveGrants(scoutSeed, TARGET);
ok(!scoutDsids.includes("careful-observation"), "Scout L1 fill output excludes careful-observation");
ok(scoutDsids.includes("quarry"), "Scout L1 fill still includes quarry");

console.log("\n5) Shapes: levels[] / unlock / missing metadata");
ok(advancementRequiredLevel({ requirements: { levels: [4, 2, 9] } }) === 2, "levels[] uses min");
ok(advancementRequiredLevel({ unlock: 5 }) === 5, "unlock number");
ok(advancementRequiredLevel({ unlock: { level: 7 } }) === 7, "unlock.level");
ok(advancementRequiredLevel({ requirements: { level: null } }) == null, "null level → missing");
const missWarn = [];
ok(advancementMeetsLevel({ requirements: { level: null }, name: "kit-sig" }, 1, { warnings: missWarn, label: "kit-sig" }),
  "null level treated as always-on (kit/career policy)");
ok(missWarn.length === 1, "null level emits a warning");

console.log("");
if (failures.length) {
  console.error(`FAIL (${failures.length}):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("All B59 smoke checks passed.");
