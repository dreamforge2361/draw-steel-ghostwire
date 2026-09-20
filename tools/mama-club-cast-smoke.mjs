#!/usr/bin/env node
/**
 * 0.3.83 — Mama's Club floor cast smoke.
 *
 * Sixteen session regulars (13 named + 3 generic patrons) (staff + patrons) under Ghostwire Bestiary →
 * Reach Streets → Mama's Club. Mama Cassavir herself is NOT in this folder and
 * must stay exactly as she shipped.
 *
 * Guards the three things that break this cast in play:
 *   1. Plain English on the sheet — no raw GHOSTWIRE.* keys in a name or bio,
 *      because these are Director-facing NPCs read at the table.
 *   2. Exactly one Wired body. Kira "Soft Trace" Bell carries the Wire Kit
 *      (wired.connectInterface); the other fifteen are meat and must not be able
 *      to Connect, or the club stops being a safe room.
 *   3. Token Has Vision ON (0.3.67 rule) and art that actually resolves on disk —
 *      club plates come from Michael's drop, one per slug.
 *
 * Run: node tools/mama-club-cast-smoke.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { actorHasKit, isWireKit } from "../scripts/wired-kit.mjs";
import { actorHasConnectInterface, itemIsConnectInterface } from "../scripts/wired-console-verbs.mjs";

const MODULE = "draw-steel-ghostwire";
const VERSION = "0.3.83";
const WIRE_KIT_DSID = "wire-kit-matrix-verbs";
const BESTIARY = "src/packs/bestiary";
const CLUB = join(BESTIARY, "mama-club");
const FOLDER_ID = "gwBestiaryMama00";
const PARENT_FOLDER = "gwBestiaryStreet";
const WIRED_SLUG = "kira-soft-trace-bell";
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

const files = readdirSync(CLUB).filter(f => f.endsWith(".json") && f !== "_folder.json").sort();
const cast = files.map(file => ({ file, slug: file.replace(/\.json$/, ""), actor: read(join(CLUB, file)) }));

console.log(`Mama's Club floor cast smoke (${VERSION})\n`);

console.log("1) Ship surface");
ok(read("module.json").version === VERSION, `module.json is ${VERSION} (got ${read("module.json").version})`);
ok(/0\.3\.83/.test(readFileSync("README.md", "utf8")), "README changelog names 0.3.83");
ok(/Mama/i.test(readFileSync("README.md", "utf8").split("\n").find(l => l.includes("0.3.83")) ?? ""),
  "README 0.3.83 line names the club cast");

console.log("\n2) The folder nests under Reach Streets and reads in plain English");
const folder = read(join(CLUB, "_folder.json"));
ok(folder._id === FOLDER_ID, `folder _id is ${FOLDER_ID}`);
ok(folder._key === `!folders!${FOLDER_ID}`, "folder _key matches its _id");
ok(folder.folder === PARENT_FOLDER, `folder nests under ${PARENT_FOLDER}`);
ok(folder.type === "Actor", "folder is an Actor folder");
ok(/^[A-Za-z0-9]{16}$/.test(folder._id), "folder _id is 16 alphanumeric");
ok(typeof loc(folder.name) === "string", `${folder.name} resolves in lang/en.json`);
ok(/Mama/.test(loc(folder.name) ?? ""), `folder builds as "${loc(folder.name)}"`);

console.log("\n3) Thirteen Actors, and Mama Cassavir is not one of them");
ok(cast.length === 16, `mama-club has ${cast.length} Actors`);
ok(!cast.some(({ actor }) => /Cassavir/i.test(actor.name)), "no Mama Cassavir in the club folder");
ok(existsSync(join(BESTIARY, "reach-streets", "mama-cassavir.json")), "Mama Cassavir still ships in reach-streets");
// Nothing in this pass may edit the existing street cast; git is the authority.
const streetDiff = execFileSync("git", ["diff", "--name-only", "HEAD", "--", join(BESTIARY, "reach-streets")], { encoding: "utf8" }).trim();
ok(streetDiff === "", `reach-streets is unmodified (${streetDiff || "clean"})`);

console.log("\n4) Every Actor is well-formed and lands in the club folder");
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
  ok((actor.effects ?? []).every(e => e._key === `!actors.effects!${actor._id}.${e._id}`),
    `${file} every effect _key targets its own Actor`);
  ok((actor.system?.monster?.keywords ?? []).every(k => KEYWORDS.has(k)),
    `${file} keywords are system enum values (${(actor.system?.monster?.keywords ?? []).join(", ")})`);
  ok(actor.system?.stamina?.max === actor.system?.stamina?.value, `${file} stamina value matches max`);
  ok(actor.system?.ev > 0, `${file} has an EV`);
}

console.log("\n5) Plain English on the sheet — no raw lang keys in names or bios");
for (const { file, actor } of cast) {
  ok(!actor.name.startsWith("GHOSTWIRE."), `${file} name is plain English ("${actor.name}")`);
  ok(actor.prototypeToken?.name === actor.name, `${file} token name matches the Actor name`);
  const bio = actor.system?.biography?.value ?? "";
  const hook = actor.system?.biography?.director ?? "";
  ok(bio.startsWith("<p>") && bio.length > 120, `${file} has a written biography`);
  ok(hook.includes("Plot hook"), `${file} biography.director carries a plot hook`);
  ok(!bio.startsWith("GHOSTWIRE.") && !hook.startsWith("GHOSTWIRE."), `${file} bio and hook are plain English`);
  // Any GHOSTWIRE.* string that survives must still resolve, or the sheet renders it raw.
  for (const item of actor.items ?? []) {
    for (const value of [item.name, item.system?.description?.value]) {
      ok(typeof value !== "string" || !value.startsWith("GHOSTWIRE.") || typeof loc(value) === "string",
        `${file} "${String(value).slice(0, 40)}" resolves in lang/en.json`);
    }
  }
}

console.log("\n6) Exactly one Wired body on the floor — Soft Trace Bell");
const wired = cast.filter(({ actor }) => actorHasConnectInterface({ items: actor.items ?? [] }));
ok(wired.length === 1, `exactly one club Actor can Connect (${wired.map(w => w.slug).join(", ") || "none"})`);
ok(wired[0]?.slug === WIRED_SLUG, `the Wired one is ${WIRED_SLUG}`);

const bell = cast.find(c => c.slug === WIRED_SLUG);
ok(!!bell, `${WIRED_SLUG}.json exists`);
const kit = (bell?.actor.items ?? []).find(i => i.system?._dsid === WIRE_KIT_DSID);
ok(!!kit, "Soft Trace embeds a Wire Kit");
if (kit) {
  ok(isWireKit(kit), "Soft Trace kit passes isWireKit");
  ok(itemIsConnectInterface(kit), "Soft Trace kit is a Connect interface");
  ok(kit.flags?.[MODULE]?.wired?.connectInterface === true, "Soft Trace kit sets wired.connectInterface");
  ok(kit.flags?.[MODULE]?.kind === "wire-kit", "Soft Trace kit flags kind wire-kit");
  ok(kit.name === "GHOSTWIRE.Matrix.Items.WireKit.ShortName", "Soft Trace kit uses the ShortName key");
  ok(loc(kit.name) === "Wire Kit", `Soft Trace kit builds as "Wire Kit"`);
  ok((bell.actor.items ?? []).filter(i => i.system?._dsid === WIRE_KIT_DSID).length === 1,
    "Soft Trace embeds exactly one Wire Kit");
}
ok(bell?.actor.flags?.[MODULE]?.bestiary?.wired === true, "Soft Trace is flagged wired");

console.log("\n7) the other fifteen are meat");
for (const { file, slug, actor } of cast) {
  if (slug === WIRED_SLUG) continue;
  ok(!actorHasKit({ items: actor.items ?? [] }), `${file} has no Wire Kit`);
  ok(!actorHasConnectInterface({ items: actor.items ?? [] }), `${file} cannot Connect`);
  ok(actor.flags?.[MODULE]?.bestiary?.wired === false, `${file} is flagged meat`);
}

console.log("\n8) Token Has Vision ON, and every Actor wears its own club plate");
for (const { file, slug, actor } of cast) {
  const token = actor.prototypeToken ?? {};
  ok(token.sight?.enabled === true, `${file} token Has Vision on`);
  ok(typeof token.sight?.range === "number", `${file} keeps sight.range (${token.sight?.range})`);
  ok(typeof token.sight?.angle === "number", `${file} keeps sight.angle (${token.sight?.angle})`);
  ok(token.texture?.src === actor.img, `${file} token texture matches the Actor portrait`);
  // Michael's drop: a 1024² WebP that Foundry renders, beside the 1254² PNG original.
  ok(actor.img === `modules/${MODULE}/assets/tokens/bestiary/mama-club/${slug}.webp`,
    `${file} points at its own club plate`);
  const webp = actor.img.replace(`modules/${MODULE}/`, "");
  ok(existsSync(webp), `${file} WebP plate exists on disk (${webp})`);
  ok(existsSync(webp.replace(/[.]webp$/, ".png")), `${file} PNG original ships beside the WebP`);
  ok(statSync(webp).size > 20000, `${file} WebP is a real conversion, not a truncated write (${statSync(webp).size} bytes)`);
  const bestiary = actor.flags?.[MODULE]?.bestiary ?? {};
  ok(bestiary.slug === slug, `${file} slug flag matches its filename`);
  ok(typeof bestiary.station === "string" && bestiary.station.length > 0, `${file} records a station`);
  ok(typeof bestiary.people === "string" && bestiary.people.length > 0, `${file} records a people`);
  ok(["F", "M"].includes(bestiary.sex), `${file} records a sex`);
}

console.log("\n9) Minions carry the With Captain rider");
for (const { file, actor } of cast) {
  const minion = actor.system?.monster?.organization === "minion";
  const effects = actor.effects ?? [];
  if (!minion) {
    ok(effects.length === 0, `${file} is not a minion and carries no rider`);
    ok(actor.system?.monster?.withCaptainEffect === undefined, `${file} has no withCaptainEffect`);
    continue;
  }
  const rider = effects.find(e => e.name === "With Captain");
  ok(!!rider, `${file} has a With Captain effect`);
  ok(actor.system?.monster?.withCaptainEffect === rider?._id, `${file} withCaptainEffect points at its own rider`);
  ok(rider?.origin === `Actor.${actor._id}`, `${file} rider origin is its own Actor`);
}

console.log("\n10) Roster — all 16 club Actors");
const byStation = [...cast].sort((a, b) => a.actor.sort - b.actor.sort);
for (const { slug, actor } of byStation) {
  const b = actor.flags[MODULE].bestiary;
  const m = actor.system.monster;
  console.log(
    `  ${slug.padEnd(22)} ${actor._id}  ${b.wired ? "WIRED" : "meat "}  `
    + `L${m.level} ${m.organization.padEnd(7)} ${m.role.padEnd(10)} sta=${String(actor.system.stamina.max).padEnd(3)} `
    + `ev=${String(actor.system.ev).padEnd(2)} ${b.sex} ${b.people.padEnd(11)} ${actor.name} — ${b.station}`
  );
}
const slugs = byStation.map(c => c.slug);
ok(new Set(slugs).size === 16, `16 distinct slugs listed (${new Set(slugs).size})`);
ok(byStation.filter(c => c.actor.flags[MODULE].bestiary.sex === "F").length === 8, "8 women on the floor");
ok(byStation.filter(c => c.actor.flags[MODULE].bestiary.sex === "M").length === 8, "8 men on the floor");

console.log("\n11) The club does not leak a kit into the meat-only street folders");
for (const dir of ["reach-streets", "reach-critters", "veil-undead", "wilds-jungles"]) {
  const stamped = readdirSync(join(BESTIARY, dir))
    .filter(f => f.endsWith(".json") && f !== "_folder.json")
    .filter(f => actorHasKit({ items: read(join(BESTIARY, dir, f)).items ?? [] }));
  ok(stamped.length === 0, `${dir} stays unstamped (${stamped.join(", ") || "clean"})`);
}

if (failures.length) {
  console.error(`\n${failures.length} failed:\n${failures.map(m => `  ✗ ${m}`).join("\n")}`);
  process.exit(1);
}
console.log(`\n${cast.length} club Actors checked; smoke passed`);
