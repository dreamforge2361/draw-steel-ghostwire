#!/usr/bin/env node
/**
 * 0.3.84 — AEQ Mandate + LAZ Extract conglomerate NPC smoke.
 * Foundry-free: pack JSON + art + lang + Wire Kit flags.
 *
 * Run: node tools/aeq-laz-npc-smoke.mjs
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { actorHasKit, isWireKit } from "../scripts/wired-kit.mjs";
import { itemIsConnectInterface } from "../scripts/wired-console-verbs.mjs";

const MODULE = "draw-steel-ghostwire";
const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

const read = p => JSON.parse(readFileSync(p, "utf8"));
const lang = read("lang/en.json");
const loc = key => key.split(".").reduce((o, k) => o?.[k], lang);

console.log("AEQ / LAZ conglomerate NPC smoke (0.3.84)\n");

const moduleJson = read("module.json");
ok(moduleJson.version === "0.3.84", `module.json is 0.3.84 (got ${moduleJson.version})`);

const ACTORS = [
  {
    slug: "aeq-trooper",
    file: "src/packs/bestiary/aequitas/aeq-trooper.json",
    name: "Mandate Trooper",
    faction: "aeq",
    art: "modules/draw-steel-ghostwire/assets/tokens/bestiary/aeq/aequitas-mandate-officer.webp",
    stam: 5,
    org: "minion",
    kit: ["Stunstick & Sidearm", "Zip-Cuffs", "Mandate HUD Suite"],
  },
  {
    slug: "aeq-sergeant",
    file: "src/packs/bestiary/aequitas/aeq-sergeant.json",
    name: "Mandate Sergeant",
    faction: "aeq",
    art: "modules/draw-steel-ghostwire/assets/tokens/bestiary/aeq/aequitas-mandate-officer.webp",
    stam: 20,
    org: "horde",
    kit: ["Duty Sidearm", "Hold the Line", "Zip-Cuffs", "Mandate HUD Suite"],
  },
  {
    slug: "laz-medic",
    file: "src/packs/bestiary/lazarus/laz-medic.json",
    name: "Extract Medic",
    faction: "laz",
    art: "modules/draw-steel-ghostwire/assets/tokens/bestiary/laz/lazarus-combat-medic.webp",
    stam: 30,
    org: "platoon",
    kit: ["Stun Sidearm", "Trauma Patch", "Stimulant Dart", "Stabilize", "Medical HUD Suite"],
  },
  {
    slug: "laz-chief-medic",
    file: "src/packs/bestiary/lazarus/laz-chief-medic.json",
    name: "Extract Chief Medic",
    faction: "laz",
    art: "modules/draw-steel-ghostwire/assets/tokens/bestiary/laz/lazarus-combat-medic.webp",
    stam: 60,
    org: "elite",
    kit: ["Stun Sidearm", "Trauma Patch", "Stabilize", "Extract Lead", "Lazarus Trauma Package", "Medical HUD Suite"],
  },
];

console.log("1) Locked names, art, vision, faction, Wire Kit");
const docs = [];
for (const spec of ACTORS) {
  const actor = read(spec.file);
  docs.push({ spec, actor });
  const name = loc(actor.name);
  ok(name === spec.name, `${spec.slug} name is ${spec.name}`);
  ok(actor.type === "npc", `${spec.slug} is npc`);
  ok(/^[A-Za-z0-9]{16}$/.test(actor._id), `${spec.slug} actor _id is 16 alphanumeric`);
  ok(actor.img === spec.art, `${spec.slug} img is shared corp plate`);
  ok(actor.prototypeToken?.texture?.src === spec.art, `${spec.slug} token texture matches img`);
  ok(actor.prototypeToken?.sight?.enabled === true, `${spec.slug} Has Vision on`);
  ok(actor.system.stamina.max === spec.stam, `${spec.slug} Stamina ${spec.stam}`);
  ok(actor.system.monster.organization === spec.org, `${spec.slug} org ${spec.org}`);
  ok(actor.flags[MODULE].faction === spec.faction, `${spec.slug} faction ${spec.faction}`);
  ok(actor.flags[MODULE].bestiary.faction === spec.faction, `${spec.slug} bestiary.faction ${spec.faction}`);
  const kitItem = actor.items.find(i => i.system?._dsid === "wire-kit-matrix-verbs");
  ok(!!kitItem, `${spec.slug} embeds Wire Kit`);
  if (kitItem) {
    ok(isWireKit(kitItem), `${spec.slug} isWireKit`);
    ok(itemIsConnectInterface(kitItem), `${spec.slug} Wire Kit is Connect interface`);
  }
  ok(actorHasKit({ items: actor.items }), `${spec.slug} actorHasKit`);
  const itemNames = actor.items.map(i => i.name);
  for (const piece of spec.kit) {
    ok(itemNames.includes(piece), `${spec.slug} has ${piece}`);
  }
  ok(!actor.items.some(i => /loyalty collar|kill code|blight grenade|fodder run/i.test(i.name)), `${spec.slug} dropped Ironclad/street-chem leftovers`);
}

console.log("2) Shared plates + art files");
ok(docs[0].actor.img === docs[1].actor.img, "both AEQ ranks share Mandate officer plate");
ok(docs[2].actor.img === docs[3].actor.img, "both LAZ ranks share Lazarus medic plate");
for (const rel of [
  "assets/tokens/bestiary/aeq/aequitas-mandate-officer.png",
  "assets/tokens/bestiary/aeq/aequitas-mandate-officer.webp",
  "assets/tokens/bestiary/laz/lazarus-combat-medic.png",
  "assets/tokens/bestiary/laz/lazarus-combat-medic.webp",
]) {
  ok(existsSync(rel) && statSync(rel).size > 1000, `${rel} ships`);
}

console.log("3) Folders nest under Corp & Security");
const aeqFolder = read("src/packs/bestiary/aequitas/_folder.json");
const lazFolder = read("src/packs/bestiary/lazarus/_folder.json");
ok(aeqFolder.folder === "gwBestiaryCorp00" && aeqFolder._id === "gwBestiaryAeq000", "Aequitas folder under Corp & Security");
ok(lazFolder.folder === "gwBestiaryCorp00" && lazFolder._id === "gwBestiaryLaz000", "Lazarus folder under Corp & Security");
ok(loc("GHOSTWIRE.Bestiary.Folders.AequitasMandate") === "Aequitas Mandate", "Aequitas folder label");
ok(loc("GHOSTWIRE.Bestiary.Folders.LazarusExtract") === "Lazarus Extract", "Lazarus folder label");

console.log("4) Docs + Director filters");
const raw = readFileSync("docs/raw/25-opposition.md", "utf8");
const director = readFileSync("docs/directors/conglomerate-npcs.md", "utf8");
const tickers = readFileSync("docs/rulebook/MEGACORP-TICKERS.md", "utf8");
const readme = readFileSync("README.md", "utf8");
ok(/Aequitas Mandate/.test(raw) && /Lazarus Extract/.test(raw), "RAW 25 names AEQ + LAZ");
ok(/Twelve Conglomerates/.test(raw) && /Twelve Conglomerates/.test(director), "RAW + Director cross-link Twelve Conglomerates");
ok(/\*\*AEQ\*\*/.test(tickers) && /\*\*LAZ\*\*/.test(tickers), "MEGACORP-TICKERS lists AEQ / LAZ corp-line filters");
ok(/Twelve Conglomerates/.test(tickers) && /AEQ/.test(tickers) && /LAZ/.test(tickers), "tickers seat AEQ/LAZ on the Twelve");
ok(/0\.3\.81/.test(readme) && /Mandate Trooper/.test(readme), "README changelog names 0.3.81");
const opp = read("scripts/data/runs/opposition-map.json");
ok(opp.strata.grid.includes("Mandate Trooper") && opp.types.extraction.includes("Extract Medic"), "Run Generator opposition-map names AEQ/LAZ");

console.log("5) Apply-tool overrides");
const apply = readFileSync("tools/apply-bestiary-portrait-art.mjs", "utf8");
ok(apply.includes('"aeq-trooper"') && apply.includes("aequitas-mandate-officer"), "apply tool maps AEQ slugs to shared plate");
ok(apply.includes('"laz-chief-medic"') && apply.includes("lazarus-combat-medic"), "apply tool maps LAZ slugs to shared plate");

if (failures.length) {
  console.error(`\n${failures.length} failed:\n${failures.map(m => `  ✗ ${m}`).join("\n")}`);
  process.exit(1);
}
console.log(`\n${ACTORS.length} Actors checked; smoke passed`);
