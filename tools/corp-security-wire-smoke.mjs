#!/usr/bin/env node
/**
 * 0.3.83 — Corp & Security Connect-interface smoke.
 * Playtest bug: corp/security NPCs could not Connect to the Wire because no Actor in
 * src/packs/bestiary/corp-security carried a Connect interface (no Wire Kit, no commlink).
 * Every Actor in that folder now embeds Wire Kit (the Director stamp — no extra commlink).
 *
 * Also guards the sheet label: the embedded kit must resolve through lang/en.json to
 * "Wire Kit", never render the raw GHOSTWIRE.* key, and never be a dangling lang key.
 * Meat-only folders (critters, veil, wilds, streets) stay unstamped.
 *
 * Run: node tools/corp-security-wire-smoke.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { actorHasKit, isWireKit } from "../scripts/wired-kit.mjs";
import { actorHasConnectInterface, itemIsConnectInterface } from "../scripts/wired-console-verbs.mjs";

const MODULE = "draw-steel-ghostwire";
const WIRE_KIT_DSID = "wire-kit-matrix-verbs";
const KIT_NAME_KEY = "GHOSTWIRE.Matrix.Items.WireKit.ShortName";
const KIT_LABEL = "Wire Kit";
const BESTIARY = "src/packs/bestiary";
const CORP = join(BESTIARY, "corp-security");
/** Meat-only / non-corp folders that must not pick up a kit from this pass. */
const MEAT_ONLY = ["reach-critters", "veil-undead", "wilds-jungles", "reach-streets"];

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

const read = p => JSON.parse(readFileSync(p, "utf8"));
const lang = read("lang/en.json");
const loc = key => key.split(".").reduce((o, k) => o?.[k], lang);
const actorsIn = dir =>
  readdirSync(join(BESTIARY, dir))
    .filter(f => f.endsWith(".json") && f !== "_folder.json")
    .map(f => ({ file: f, actor: read(join(BESTIARY, dir, f)) }));

console.log("Corp & Security Wire-access smoke (0.3.83)\n");

ok(read("module.json").version === "0.3.83", `module.json is 0.3.83 (got ${read("module.json").version})`);

console.log("\n1) Wire Kit label resolves to a readable name");
ok(loc(KIT_NAME_KEY) === KIT_LABEL, `${KIT_NAME_KEY} resolves to "${KIT_LABEL}"`);
ok(typeof loc("GHOSTWIRE.Matrix.Items.WireKit.Name") === "string", "long WireKit.Name lang key still ships");

console.log("\n2) Every corp-security Actor can Connect");
const corp = actorsIn("corp-security");
ok(corp.length >= 12, `corp-security has ${corp.length} Actors`);
for (const { file, actor } of corp) {
  const items = actor.items ?? [];
  ok(actorHasConnectInterface({ items }), `${file} actorHasConnectInterface`);
  ok(actorHasKit({ items }), `${file} actorHasKit`);
  const kit = items.find(i => i.system?._dsid === WIRE_KIT_DSID);
  ok(!!kit, `${file} embeds Wire Kit`);
  if (!kit) continue;
  ok(isWireKit(kit), `${file} kit passes isWireKit`);
  ok(itemIsConnectInterface(kit), `${file} kit is a Connect interface`);
  ok(kit.flags?.[MODULE]?.wired?.connectInterface === true, `${file} kit sets wired.connectInterface`);
  ok(kit.flags?.[MODULE]?.kind === "wire-kit", `${file} kit flags kind wire-kit`);
  ok(/^[A-Za-z0-9]{16}$/.test(kit._id), `${file} kit _id is 16 alphanumeric (${kit._id})`);
  ok(kit._key === `!actors.items!${actor._id}.${kit._id}`, `${file} kit _key targets its own Actor`);
  ok(items.filter(i => i.system?._dsid === WIRE_KIT_DSID).length === 1, `${file} embeds exactly one Wire Kit`);
}

console.log("\n3) No embedded Wire Kit shows a raw lang key");
const wired = [...corp, ...actorsIn("aequitas"), ...actorsIn("lazarus")];
for (const { file, actor } of wired) {
  const kit = (actor.items ?? []).find(i => i.system?._dsid === WIRE_KIT_DSID);
  if (!kit) continue;
  ok(kit.name === KIT_NAME_KEY, `${file} kit name is ${KIT_NAME_KEY}`);
  ok(loc(kit.name) === KIT_LABEL, `${file} kit builds as "${KIT_LABEL}"`);
  // A GHOSTWIRE.* string that lang/en.json cannot resolve is what the sheet renders raw.
  for (const value of [kit.name, kit.system?.description?.value]) {
    ok(typeof value !== "string" || !value.startsWith("GHOSTWIRE.") || typeof loc(value) === "string",
      `${file} kit "${String(value).slice(0, 44)}" resolves in lang/en.json`);
  }
}

console.log("\n4) AEQ / LAZ kits untouched apart from the label");
for (const { file, actor } of [...actorsIn("aequitas"), ...actorsIn("lazarus")]) {
  ok(actorHasConnectInterface({ items: actor.items ?? [] }), `${file} still Connect-capable`);
}

console.log("\n5) Meat-only folders stay unstamped");
for (const dir of MEAT_ONLY) {
  const stamped = actorsIn(dir).filter(({ actor }) => actorHasKit({ items: actor.items ?? [] }));
  ok(stamped.length === 0, `${dir} has no Wire Kit (${stamped.map(s => s.file).join(", ") || "clean"})`);
}

console.log("\n6) corp-netrunner keeps its gear");
const netrunner = read(join(CORP, "corp-netrunner.json"));
for (const piece of ["Black ICE Jolt", "Feedback Firewall", "Hijack Building Systems"]) {
  ok(netrunner.items.some(i => i.name === piece), `corp-netrunner still has ${piece}`);
}

if (failures.length) {
  console.error(`\n${failures.length} failed:\n${failures.map(m => `  ✗ ${m}`).join("\n")}`);
  process.exit(1);
}
console.log(`\n${corp.length} corp-security Actors checked; smoke passed`);
