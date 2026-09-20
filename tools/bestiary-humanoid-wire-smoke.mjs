#!/usr/bin/env node
/**
 * 0.3.85 — Bestiary humanoid Wire Kit / Connect smoke.
 *
 * Asserts the humanoid Connect pass:
 *   - every Actor with keyword humanoid/human/rival/cyborg/timeRaider can Connect
 *     via Wire Kit (actorHasConnectInterface)
 *   - reach-critters have zero Wire Kits
 *   - ICE constructs / animal / beast without humanoid stay without Wire Kit
 *
 * Run: node tools/bestiary-humanoid-wire-smoke.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { actorHasKit, isWireKit } from "../scripts/wired-kit.mjs";
import { actorHasConnectInterface } from "../scripts/wired-console-verbs.mjs";

const MODULE = "draw-steel-ghostwire";
const VERSION = "0.3.85";
const BESTIARY = "src/packs/bestiary";
const HUMANOID_KW = new Set(["humanoid", "human", "rival", "cyborg", "timeRaider"]);
const MEAT_FOLDERS = ["reach-critters"];

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

const read = p => JSON.parse(readFileSync(p, "utf8"));

function walkActors(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkActors(p, out);
    else if (name.endsWith(".json") && name !== "_folder.json") {
      const actor = read(p);
      if (actor.type === "npc") out.push({ file: p.replace(/\\/g, "/"), folder: dir.split(/[\\/]/).pop(), actor });
    }
  }
  return out;
}

console.log(`Bestiary humanoid Wire Kit smoke (${VERSION})\n`);

ok(read("module.json").version === VERSION, `module.json is ${VERSION}`);

const actors = walkActors(BESTIARY);
const humanoids = actors.filter(({ actor }) => {
  const kws = new Set(actor.system?.monster?.keywords ?? []);
  return [...HUMANOID_KW].some(k => kws.has(k));
});
const nonHumanoids = actors.filter(({ actor }) => {
  const kws = new Set(actor.system?.monster?.keywords ?? []);
  return ![...HUMANOID_KW].some(k => kws.has(k));
});

console.log(`\n1) Every humanoid Actor can Connect (${humanoids.length})`);
for (const { file, actor } of humanoids) {
  ok(actorHasConnectInterface({ items: actor.items ?? [] }), `${file} actorHasConnectInterface`);
  ok(actorHasKit({ items: actor.items ?? [] }), `${file} actorHasKit`);
  const kits = (actor.items ?? []).filter(isWireKit);
  ok(kits.length === 1, `${file} embeds exactly one Wire Kit (${kits.length})`);
}

console.log("\n2) reach-critters have zero Wire Kits");
for (const dir of MEAT_FOLDERS) {
  const stamped = actors.filter(a => a.folder === dir && actorHasKit({ items: a.actor.items ?? [] }));
  ok(stamped.length === 0, `${dir} has no Wire Kit (${stamped.map(s => s.file).join(", ") || "clean"})`);
}

console.log("\n3) Non-humanoid ICE / animal / beast stay without Wire Kit");
for (const { file, folder, actor } of nonHumanoids) {
  if (MEAT_FOLDERS.includes(folder)) continue; // already covered
  ok(!actorHasKit({ items: actor.items ?? [] }), `${file} non-humanoid stays without Wire Kit`);
}

console.log(`\nSummary: ${humanoids.length} humanoids Connect-capable; ${nonHumanoids.length} non-humanoids meat-checked`);

if (failures.length) {
  console.error(`\n${failures.length} failed:\n${failures.map(m => `  ✗ ${m}`).join("\n")}`);
  process.exit(1);
}
console.log("\nbestiary-humanoid-wire-smoke passed");
