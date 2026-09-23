#!/usr/bin/env node
/**
 * 0.3.94 — Magical Societies contact Actors smoke (F7).
 *
 * Three named society contacts under Ghostwire Bestiary → Magical Societies:
 * Senior Examiner Edda Marr (Measure Collegium), Tavi Sorn (Wickkeepers) and
 * Field Coordinator Daska Venn (Ash Survey).
 *
 * Guards the four things that break these contacts:
 *   1. The canon locks of 2026-09-22 — Edda CAN cast (Corran Elementalist) and is
 *      not the sole leader; Tavi is Pure Human and CANNOT cast; Daska is a
 *      full-conversion Cyborg and CANNOT cast (Arcane Severance is never waived).
 *   2. Plain English on the sheet — no raw GHOSTWIRE.* keys in a name or bio,
 *      because these are Director-facing NPCs read at the table.
 *   3. All three can Connect via Wire Kit (0.3.85 humanoid Connect pass) and keep
 *      Token Has Vision ON (0.3.67 rule), wearing their own supplied plate.
 *   4. The folder is reproducible — tools/gen-magical-societies-cast.mjs regenerates
 *      it byte for byte, so nobody hand-edits a stat block the generator will eat.
 *
 * Run: node tools/magical-societies-cast-smoke.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { actorHasKit, isWireKit } from "../scripts/wired-kit.mjs";
import { actorHasConnectInterface, itemIsConnectInterface } from "../scripts/wired-console-verbs.mjs";
import { atLeast } from "./lib/module-version.mjs";

const MODULE = "draw-steel-ghostwire";
const VERSION = "0.3.94"; // min; module may be newer
const WIRE_KIT_DSID = "wire-kit-matrix-verbs";
const BESTIARY = "src/packs/bestiary";
const SOCIETIES = join(BESTIARY, "magical-societies");
const LORE = "src/packs/lore/magical-societies";
const GENERATOR = "tools/gen-magical-societies-cast.mjs";
const FOLDER_ID = "gwBestiaryMagSoc";
const PLATES = "assets/tokens/bestiary/magical-societies";
/** system.monster.keywords is a system enum — a stray ancestry value renders wrong. */
const KEYWORDS = new Set(["animal", "beast", "construct", "cyborg", "horror", "human",
  "humanoid", "rival", "soulless", "swarm", "timeRaider", "undead", "voicelessTalker", "warDog"]);

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

const read = p => JSON.parse(readFileSync(p, "utf8"));
const lang = read("lang/en.json");
const loc = key => key.split(".").reduce((o, k) => o?.[k], lang);

const files = readdirSync(SOCIETIES).filter(f => f.endsWith(".json") && f !== "_folder.json").sort();
const cast = files.map(file => ({ file, slug: file.replace(/\.json$/, ""), actor: read(join(SOCIETIES, file)) }));
const bySlug = slug => cast.find(c => c.slug === slug)?.actor;
const textOf = actor => `${actor?.system?.biography?.value ?? ""} ${actor?.system?.biography?.director ?? ""} `
  + (actor?.items ?? []).map(i => `${i.name} ${i.system?.description?.value ?? ""}`).join(" ");
const abilityKeywords = actor => new Set((actor?.items ?? [])
  .filter(i => i.type === "ability").flatMap(i => i.system?.keywords ?? []));

console.log(`Magical Societies contact Actors smoke (${VERSION})\n`);

console.log("1) Ship surface");
const moduleVersion = read("module.json").version;
const readme = readFileSync("README.md", "utf8");
ok(atLeast(moduleVersion, VERSION), `module.json is ≥ ${VERSION} (got ${moduleVersion})`);
ok(readme.includes(`\`${VERSION}\``), `README changelog names ${VERSION}`);
ok(/Magical Societies|society contacts/i.test(readme.split("\n").find(l => l.includes(`\`${VERSION}\``)) ?? ""),
  `README ${VERSION} line names the society contacts`);

console.log("\n2) The folder is a top-level Actor folder and reads in plain English");
const folder = read(join(SOCIETIES, "_folder.json"));
ok(folder._id === FOLDER_ID, `folder _id is ${FOLDER_ID}`);
ok(folder._key === `!folders!${FOLDER_ID}`, "folder _key matches its _id");
ok(/^[A-Za-z0-9]{16}$/.test(folder._id), "folder _id is 16 alphanumeric");
ok(folder.type === "Actor", "folder is an Actor folder");
ok(folder.folder === null, "folder is top-level (folder: null)");
ok(folder.name === "GHOSTWIRE.Bestiary.Folders.MagicalSocieties", "folder uses the Bestiary lang key");
ok(loc(folder.name) === "Magical Societies", `folder builds as "${loc(folder.name)}"`);
// A sort collision with another top-level bestiary folder shuffles the sidebar unpredictably.
const siblingSorts = readdirSync(BESTIARY)
  .filter(d => d !== "magical-societies" && existsSync(join(BESTIARY, d, "_folder.json")))
  .map(d => read(join(BESTIARY, d, "_folder.json")))
  .filter(f => f.folder === null)
  .map(f => f.sort);
ok(!siblingSorts.includes(folder.sort), `folder sort ${folder.sort} is free among top-level bestiary folders`);
ok(folder.sort > 100000 && folder.sort < 200000, `folder sorts with the Reach folders (${folder.sort})`);

console.log("\n3) Three contacts, well-formed, all in the folder");
ok(cast.length === 3, `magical-societies has ${cast.length} Actors`);
const allIds = new Set();
for (const { file, actor } of cast) {
  ok(actor.type === "npc", `${file} is an npc Actor`);
  ok(actor.folder === FOLDER_ID, `${file} folder is ${FOLDER_ID}`);
  ok(actor._key === `!actors!${actor._id}`, `${file} _key matches its _id`);
  const docs = [actor, ...(actor.items ?? []), ...(actor.effects ?? [])];
  ok(docs.every(d => /^[A-Za-z0-9]{16}$/.test(d._id ?? "")), `${file} every _id is 16 alphanumeric`);
  for (const d of docs) {
    ok(!allIds.has(d._id), `${file} id ${d._id} is unique across the cast`);
    allIds.add(d._id);
  }
  ok((actor.items ?? []).every(i => i._key === `!actors.items!${actor._id}.${i._id}`),
    `${file} every item _key targets its own Actor`);
  ok((actor.system?.monster?.keywords ?? []).every(k => KEYWORDS.has(k)),
    `${file} keywords are system enum values (${(actor.system?.monster?.keywords ?? []).join(", ")})`);
  ok(actor.system?.stamina?.max === actor.system?.stamina?.value, `${file} stamina value matches max`);
  ok(actor.system?.ev > 0, `${file} has an EV`);
  ok(Number.isInteger(actor.system?.monster?.freeStrike), `${file} freeStrike is an integer`);
  ok(!("freestrike" in (actor.system?.monster ?? {})), `${file} has no stray lowercase freestrike key`);
  ok((actor.items ?? []).some(i => i.type === "ability"), `${file} has at least one usable ability`);
}
// Two Actors sharing a sort shuffle unpredictably in the compendium sidebar.
const sorts = cast.map(c => c.actor.sort);
ok(new Set(sorts).size === sorts.length, "every contact has a distinct sort");

console.log("\n4) Plain English on the sheet — no raw lang keys in names or bios");
for (const { file, actor } of cast) {
  ok(!actor.name.startsWith("GHOSTWIRE."), `${file} name is plain English ("${actor.name}")`);
  ok(actor.prototypeToken?.name === actor.name, `${file} token name matches the Actor name`);
  const bio = actor.system?.biography?.value ?? "";
  const hook = actor.system?.biography?.director ?? "";
  ok(bio.startsWith("<p>") && bio.length > 200, `${file} has a written biography`);
  ok(/<strong>Role:<\/strong>/.test(hook), `${file} biography.director opens on a Role line`);
  ok(/What she cannot do/.test(hook), `${file} hook states what she cannot do`);
  for (const item of actor.items ?? []) {
    for (const value of [item.name, item.system?.description?.value]) {
      ok(typeof value !== "string" || !value.startsWith("GHOSTWIRE.") || typeof loc(value) === "string",
        `${file} "${String(value).slice(0, 40)}" resolves in lang/en.json`);
    }
  }
}

console.log("\n5) Canon lock — Edda Marr is a Corran Elementalist who CAN cast, and is not the sole leader");
const edda = bySlug("edda-marr");
ok(!!edda, "edda-marr.json exists");
ok(edda?._id === "gwBesEddaMarr000", `Edda's _id is stable (${edda?._id})`);
ok(edda?.flags?.[MODULE]?.bestiary?.people === "Corran", "Edda is flagged Corran");
ok(edda?.flags?.[MODULE]?.bestiary?.casting === true, "Edda is flagged casting: true");
ok(/Corran/.test(edda?.system?.biography?.value ?? ""), "Edda's bio names her as Corran");
ok(/Elementalist/.test(edda?.system?.biography?.value ?? ""), "Edda's bio names her as an Elementalist");
ok(abilityKeywords(edda).has("magic"), "Edda has at least one ability with the magic keyword (she casts)");
ok(/not<\/strong> the sole leader|is <strong>not<\/strong> the sole leader|not the sole leader/i
  .test(edda?.system?.biography?.director ?? ""), "Edda's hook says she is not the sole leader of the Collegium");
ok(/Senior Examiner/.test(edda?.flags?.[MODULE]?.bestiary?.station ?? ""), "Edda's station is Senior Examiner");
ok(/Datum House/.test(edda?.flags?.[MODULE]?.bestiary?.station ?? ""), "Edda works out of Datum House");

console.log("\n6) Canon lock — Tavi Sorn is Pure Human with NO casting ability");
const tavi = bySlug("tavi-sorn");
ok(!!tavi, "tavi-sorn.json exists");
ok(tavi?._id === "gwBesTaviSorn000", `Tavi's _id is stable (${tavi?._id})`);
ok(tavi?.flags?.[MODULE]?.bestiary?.people === "Pure Human", "Tavi is flagged Pure Human");
ok(tavi?.flags?.[MODULE]?.bestiary?.casting === false, "Tavi is flagged casting: false");
ok(!abilityKeywords(tavi).has("magic"), "Tavi has no ability with the magic keyword");
ok(!abilityKeywords(tavi).has("supernatural"), "Tavi has no supernatural ability");
ok((tavi?.items ?? []).some(i => i.system?._dsid === "no-casting-no-claim"),
  "Tavi carries the No Casting, No Claim feature");
ok(/cannot ward a room|no casting ability/i.test(textOf(tavi)), "Tavi's sheet says plainly that she cannot cast");
ok(/Last Kettle/.test(tavi?.flags?.[MODULE]?.bestiary?.station ?? ""), "Tavi works out of the Last Kettle");
ok(/does not obligate|cannot order|not obligate any other cell/i.test(tavi?.system?.biography?.director ?? ""),
  "Tavi's hook keeps her a local coordinator, not the network's commander");
ok(/certify anyone holy|grant Conviction/i.test(textOf(tavi)),
  "Tavi's sheet keeps the no-new-church boundary (no holiness, no Conviction)");

console.log("\n7) Canon lock — Daska Venn is a full-conversion Cyborg who CANNOT cast (Arcane Severance)");
const daska = bySlug("daska-venn");
ok(!!daska, "daska-venn.json exists");
ok(daska?._id === "gwBesDaskaVenn00", `Daska's _id is stable (${daska?._id})`);
ok(/Cyborg/.test(daska?.flags?.[MODULE]?.bestiary?.people ?? ""), "Daska is flagged a Cyborg");
ok(daska?.flags?.[MODULE]?.bestiary?.casting === false, "Daska is flagged casting: false");
ok((daska?.system?.monster?.keywords ?? []).includes("cyborg"), "Daska carries the cyborg keyword");
ok(!abilityKeywords(daska).has("magic"), "Daska has no ability with the magic keyword");
ok((daska?.items ?? []).some(i => i.name === "Arcane Severance"), "Daska carries the Arcane Severance feature");
ok(/cannot cast|<strong>cannot cast<\/strong>/i.test(textOf(daska)), "Daska's sheet says plainly that she cannot cast");
ok(/does not waive|never waives|membership in the Ash Survey does not waive/i.test(textOf(daska)),
  "Daska's sheet says membership does not waive the restriction");
ok(/not .{0,20}(a )?magical exception|not evidence of a magical exception/i.test(textOf(daska)),
  "Daska is not framed as a magical exception for Cyborgs");
ok(/Cinder Yard/.test(daska?.flags?.[MODULE]?.bestiary?.station ?? ""), "Daska works out of the Cinder Yard");
ok(/clean report is not a clean site/i.test(textOf(daska)), "Daska keeps the Survey's governing maxim");

console.log("\n8) Each contact points at its shipped lore journal");
const loreIds = new Set(readdirSync(LORE).filter(f => f !== "_folder.json").map(f => read(join(LORE, f))._id));
for (const { file, actor } of cast) {
  const uuid = actor.flags?.[MODULE]?.bestiary?.loreJournal ?? "";
  const id = uuid.split(".").pop();
  ok(uuid.startsWith(`Compendium.${MODULE}.lore.JournalEntry.`), `${file} records a lore journal UUID`);
  ok(loreIds.has(id), `${file} lore journal ${id} ships in ${LORE}`);
  ok((actor.system?.biography?.director ?? "").includes(`@UUID[${uuid}]`), `${file} hook links that journal`);
  ok(typeof actor.flags?.[MODULE]?.bestiary?.society === "string", `${file} records its society`);
}

console.log("\n9) All three can Connect via Wire Kit");
for (const { file, actor } of cast) {
  ok(actorHasConnectInterface({ items: actor.items ?? [] }), `${file} can Connect`);
  ok(actorHasKit({ items: actor.items ?? [] }), `${file} carries a kit`);
  ok(actor.flags?.[MODULE]?.bestiary?.wired === true, `${file} is flagged wired`);
  const kits = (actor.items ?? []).filter(i => i.system?._dsid === WIRE_KIT_DSID);
  ok(kits.length === 1, `${file} embeds exactly one Wire Kit`);
  const kit = kits[0];
  if (kit) {
    ok(isWireKit(kit), `${file} kit passes isWireKit`);
    ok(itemIsConnectInterface(kit), `${file} kit is a Connect interface`);
    ok(kit.flags?.[MODULE]?.wired?.connectInterface === true, `${file} kit sets wired.connectInterface`);
    ok(kit.name === "GHOSTWIRE.Matrix.Items.WireKit.ShortName", `${file} kit uses the ShortName key`);
    ok(loc(kit.name) === "Wire Kit", `${file} kit builds as "Wire Kit"`);
  }
}

console.log("\n10) Token Has Vision ON, and every contact wears its own supplied plate");
for (const { file, slug, actor } of cast) {
  const token = actor.prototypeToken ?? {};
  ok(token.sight?.enabled === true, `${file} token Has Vision on`);
  ok(typeof token.sight?.range === "number", `${file} keeps sight.range (${token.sight?.range})`);
  ok(token.disposition === 0, `${file} token disposition is neutral`);
  ok(actor.img === `modules/${MODULE}/${PLATES}/${slug}.webp`, `${file} points at its own plate`);
  ok(token.texture?.src === actor.img, `${file} token texture matches the Actor portrait`);
  const webp = join(PLATES, `${slug}.webp`);
  ok(existsSync(webp), `${file} WebP plate exists on disk (${webp})`);
  ok(existsSync(webp) && statSync(webp).size > 20000,
    `${file} WebP is a real conversion, not a truncated write (${existsSync(webp) ? statSync(webp).size : 0} bytes)`);
  const bestiary = actor.flags?.[MODULE]?.bestiary ?? {};
  ok(bestiary.slug === slug, `${file} slug flag matches its filename`);
  ok(bestiary.region === "magical-societies", `${file} records the magical-societies region`);
  ok(typeof bestiary.station === "string" && bestiary.station.length > 0, `${file} records a station`);
  ok(["F", "M"].includes(bestiary.sex), `${file} records a sex`);
}

console.log("\n11) Roster");
for (const { slug, actor } of [...cast].sort((a, b) => a.actor.sort - b.actor.sort)) {
  const b = actor.flags[MODULE].bestiary;
  const m = actor.system.monster;
  console.log(
    `  ${slug.padEnd(12)} ${actor._id}  L${m.level} ${m.organization.padEnd(7)} ${m.role.padEnd(10)} `
    + `sta=${String(actor.system.stamina.max).padEnd(3)} ev=${String(actor.system.ev).padEnd(2)} `
    + `${b.casting ? "CASTS     " : "no casting"} ${b.people.padEnd(24)} ${actor.name} — ${b.station}`
  );
}

/**
 * Compare ignoring CRLF/LF. core.autocrlf is true here and .gitattributes only pins `packs/**`,
 * so a fresh checkout hands us CRLF under src/packs/ while the generator always writes LF.
 */
const sameText = (a, b) => a.toString("utf8").replace(/\r\n/g, "\n") === b.toString("utf8").replace(/\r\n/g, "\n");

console.log("\n12) Round trip — regenerating reproduces the committed folder (line endings aside)");
const snapshot = new Map(readdirSync(SOCIETIES).map(f => [join(SOCIETIES, f), readFileSync(join(SOCIETIES, f))]));
let changed = [];
try {
  execFileSync(process.execPath, [GENERATOR], { stdio: "pipe" });
  changed = [...snapshot].filter(([p, before]) => !existsSync(p) || !sameText(readFileSync(p), before)).map(([p]) => p);
  const added = readdirSync(SOCIETIES).filter(f => !snapshot.has(join(SOCIETIES, f)));
  ok(!changed.length && !added.length,
    `regen is a no-op${changed.length ? ` — changed: ${changed.join(", ")}` : ""}${added.length ? ` — added: ${added.join(", ")}` : ""}`);
} catch (err) {
  ok(false, `generator ran clean (${err.message.split("\n")[0]})`);
} finally {
  if (changed.length) { for (const [p, before] of snapshot) writeFileSync(p, before); console.log("     (working tree restored)"); }
}

if (failures.length) {
  console.error(`\n${failures.length} failed:\n${failures.map(m => `  ✗ ${m}`).join("\n")}`);
  process.exit(1);
}
console.log(`\n${cast.length} society contacts checked; smoke passed`);
