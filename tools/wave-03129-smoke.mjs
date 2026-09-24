#!/usr/bin/env node
/**
 * 0.3.129 wave smoke — the pregen Standard Rounds hotfix.
 *
 * Barak shipped 0.3.128 holding a Chatterbox LMG, twenty gun abilities that spend rounds, and no
 * ammunition whatsoever; Vira and Kessic were in the same state, and the other six carried the
 * kiosk's box of 30. The lock is one sentence: **every Hero pregen carries exactly 150 Standard
 * Rounds**, and it is held in the *source of truth* — loadouts.json plus the generator — rather
 * than patched onto the built actors, so the next regen reproduces it instead of wiping it.
 *
 *   A  All nine pregens hold standard-rounds at system.quantity === 150.
 *   B  loadouts.json lists standard-rounds for every slug, in the `{ path, quantity: 150 }` form.
 *   C  The generator honours a `quantity` override on any armor / weapon / gear line.
 *   D  The gear SKU is untouched — a box on a shelf is still 30 rounds, still ¥50, still `street`.
 *   E  No other ammunition was disturbed (Kade keeps his Shock-Stick).
 *   F  Version, README, Foundry checklist.
 *
 * Run: node tools/wave-03129-smoke.mjs
 * Does not need live Foundry.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { atLeast } from "./lib/module-version.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const PREGENS = "src/packs/pregens";
const ROUNDS_PATH = "src/packs/gear/general/ammunition/standard-rounds.json";
const ROUNDS_DSID = "standard-rounds";
const ROUNDS_ID = "cTpPZ97zeRzqECqV";
const LOCKED_QTY = 150;
const BOX = 30;

/** The nine dossier heroes, named rather than globbed — "every pregen" has to mean a known set. */
const HEROES = [
  "barak-voss-hallor", "kade-orrin-vex", "kaes-vahn-estal", "kessic-draye", "renn-solace-ward",
  "sabbat-vane", "vessa-corran-dov", "vira-kellis-nade", "wren-sable-corvin",
];

const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = p => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const readJson = p => JSON.parse(read(p));
/** Source with every comment line dropped — a header that *names* a thing is not the thing. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");

const pathOf = entry => (typeof entry === "string" ? entry : entry?.path);
const qtyOf = entry => (typeof entry === "string" ? null : entry?.quantity ?? null);

const loadouts = readJson("docs/masters/pregens/loadouts.json");
const actors = Object.fromEntries(HEROES.map(slug => [slug, readJson(join(PREGENS, `${slug}.json`))]));

console.log("0.3.129 wave smoke — every pregen carries 150 Standard Rounds\n");

/* ------------------------------------------------------------------ A: the built actors */

console.log("A) Every Hero pregen holds 150 Standard Rounds");

// The roster is the whole roster: a tenth hero added without ammunition must fail here, not pass
// because this smoke only knew about nine.
const onDisk = readdirSync(PREGENS).filter(f => f.endsWith(".json") && !f.startsWith("_"))
  .map(f => f.replace(/\.json$/, "")).sort();
note(onDisk.join() === [...HEROES].sort().join(), `${PREGENS} holds exactly the ${HEROES.length} known heroes`);

for (const slug of HEROES) {
  const actor = actors[slug];
  note(actor.type === "hero", `${slug}: is a Hero actor`);
  const rounds = actor.items.filter(i => i.system?._dsid === ROUNDS_DSID);
  note(rounds.length === 1, `${slug}: exactly one Standard Rounds stack (${rounds.length})`);
  note(rounds[0]?.system?.quantity === LOCKED_QTY,
    `${slug}: Standard Rounds ×${rounds[0]?.system?.quantity ?? "—"}`);
  // The embedded row is the real SKU, not a look-alike: same _dsid, same name key, same ammo family.
  note(rounds[0]?.name === "GHOSTWIRE.Gear.Items.StandardRounds.Name", `${slug}: the shipped name key`);
  note(rounds[0]?.flags?.[MODULE_ID]?.gear?.ammo?.type === "standard", `${slug}: ammo family "standard"`);
  note(rounds[0]?.type === "treasure", `${slug}: still a treasure Item`);
}

/* ------------------------------------------------------------------ B: the source of truth */

console.log("\nB) loadouts.json is the source of truth — the fix survives a regen");

for (const slug of HEROES) {
  const gear = loadouts[slug]?.gear ?? [];
  const entry = gear.find(g => pathOf(g) === ROUNDS_PATH);
  note(!!entry, `${slug}: loadouts.json lists ${ROUNDS_PATH.split("/").pop()}`);
  note(qtyOf(entry) === LOCKED_QTY, `${slug}: loadout asks for quantity ${qtyOf(entry) ?? "—"} (object form)`);
}
note(Object.keys(loadouts).length === HEROES.length,
  `loadouts.json covers all ${HEROES.length} heroes and no one else`);

/* ------------------------------------------------------------------ C: the generator */

console.log("\nC) The generator applies a loadout quantity override");

const gen = code(read("tools/pregens-to-actors.mjs"));
note(/typeof entry === "string" \? entry : entry\?\.path/.test(gen),
  "pregens-to-actors accepts either a path string or a { path, quantity } object");
note(/if \(quantity != null\) item\.system\.quantity = quantity;/.test(gen),
  "and stamps system.quantity after read(p)");

const regen = code(read("tools/pregen-regen-smoke.mjs"));
note(/\.map\(pathOf\)/.test(regen), "pregen-regen-smoke normalises loadout entries before read()");
note(/loadout asks for/.test(read("tools/pregen-regen-smoke.mjs")),
  "pregen-regen-smoke asserts the stamped quantity");

/* ------------------------------------------------------------------ D: the SKU is untouched */

console.log("\nD) The gear SKU is untouched — a box on a shelf is still 30 rounds");

const sku = readJson(ROUNDS_PATH);
note(sku._id === ROUNDS_ID, `the SKU is still ${ROUNDS_ID}`);
note(sku.system.quantity === BOX, `pack default quantity is still ${sku.system.quantity} (one street box)`);
const gearFlags = sku.flags[MODULE_ID].gear;
note(gearFlags.price === 50, `price is still ¥${gearFlags.price}`);
note(gearFlags.availability === "street", `availability is still ${gearFlags.availability}`);
note(gearFlags.ammo?.box === BOX && gearFlags.ammo?.type === "standard",
  `the ammo flag is still { type: standard, box: ${BOX} }`);

/* ------------------------------------------------------------------ E: nothing else disturbed */

console.log("\nE) No other ammunition was disturbed");

// 0.3.128 gave Kade a Shock-Stick; the hotfix touches exactly one _dsid and nothing beside it.
const kade = actors["kade-orrin-vex"].items.find(i => i.system?._dsid === "shock-stick");
note(!!kade, "kade-orrin-vex still holds the Shock-Stick");

// Every non-ammunition loadout line still lands at the SKU's own quantity, because only the
// Standard Rounds line carries an override.
for (const slug of HEROES) {
  const l = loadouts[slug];
  const lines = [l.armor, ...(l.weapons ?? []), ...(l.gear ?? [])].filter(Boolean);
  const overridden = lines.filter(e => qtyOf(e) != null).map(pathOf);
  note(overridden.length === 1 && overridden[0] === ROUNDS_PATH,
    `${slug}: exactly one quantity override, and it is the ammunition`);
  const drift = lines.filter(e => qtyOf(e) == null).filter(e => {
    const held = actors[slug].items.find(i => i.system?._dsid === readJson(pathOf(e)).system?._dsid);
    return held?.system?.quantity !== undefined
      && held.system.quantity !== readJson(pathOf(e)).system.quantity;
  }).map(pathOf);
  note(!drift.length, `${slug}: every other line kept its SKU quantity${drift.length ? ` (${drift.join(", ")})` : ""}`);
}

/* ------------------------------------------------------------------ F: version */

console.log("\nF) Version");

const version = readJson("module.json").version;
note(atLeast(version, "0.3.129"), `module.json is ${version}`);
note(/`0\.3\.129`/.test(read("README.md")), "README has a 0.3.129 entry");
note(existsSync("docs/directors/03129-smoke.md"), "the Foundry checklist is written");

/* ------------------------------------------------------------------ */

if (fail.length) {
  console.log(`\n0.3.129 smoke FAIL — ${fail.length}`);
  for (const msg of fail) console.log(`  - ${msg}`);
  process.exitCode = 1;
} else {
  console.log("\n0.3.129 smoke PASS.");
}
