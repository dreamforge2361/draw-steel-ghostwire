#!/usr/bin/env node
/**
 * F4 smoke (0.3.93): re-running the pregen generator must be safe.
 *
 * Before F4, `node tools/pregens-to-actors.mjs` quietly destroyed hand-applied fixes — portraits went
 * to mystery-man, the class level dropped to 0, Taint/Corruption History vanished, Sabbat lost his
 * installed Whiteout and Vira reverted to the wrong kit. Every one of those now comes from the
 * generator's ROSTER, docs/masters/pregens/loadouts.json or docs/masters/pregens/post-patches.json.
 *
 * This smoke asserts the invariants on the committed actors and then re-runs the generator and
 * byte-compares, so a regen that would change anything fails here instead of on Michael's table.
 *
 * Run: node tools/pregen-regen-smoke.mjs        (safe — restores the tree if the round trip differs)
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MODULE_ID = "draw-steel-ghostwire";
const OUT = "src/packs/pregens";
const LANG = "lang/en.json";
const read = p => JSON.parse(readFileSync(p, "utf8"));
const loadouts = read("docs/masters/pregens/loadouts.json");
const postPatches = read("docs/masters/pregens/post-patches.json");

const failures = [];
const ok = (cond, msg) => { if (cond) console.log(`  ✓ ${msg}`); else { failures.push(msg); console.log(`  ✗ ${msg}`); } };

const files = readdirSync(OUT).filter(f => f.endsWith(".json") && !f.startsWith("_"));
const actors = Object.fromEntries(files.map(f => [f.replace(/\.json$/, ""), read(join(OUT, f))]));
const gw = a => a.flags[MODULE_ID] ?? {};
const localArt = src => src?.startsWith(`modules/${MODULE_ID}/`) && existsSync(src.slice(`modules/${MODULE_ID}/`.length));

console.log(`F4 pregen regenerate smoke — ${files.length} actors\n`);

console.log("1) Portraits and token art resolve to shipped assets");
for (const [slug, a] of Object.entries(actors)) {
  ok(localArt(a.img), `${slug}: portrait ${a.img.replace(/.*\//, "")}`);
  ok(a.prototypeToken.texture.src === a.img, `${slug}: prototype token uses the same art`);
}

console.log("\n2) Changer form art (B50 syncChangerFormArt reads these flags)");
for (const slug of ["wren-sable-corvin", "vira-kellis-nade"]) {
  const c = gw(actors[slug]).changer ?? {};
  ok(c.humanArt === actors[slug].img, `${slug}: humanArt matches the sheet portrait`);
  for (const form of ["hybridArt", "beastArt"]) ok(localArt(c[form]), `${slug}: ${form} ${String(c[form]).replace(/.*\//, "")}`);
}

console.log("\n3) Draw Steel level lives on the class Item, and it is Level 1");
for (const [slug, a] of Object.entries(actors)) {
  const cls = a.items.filter(i => i.type === "class");
  ok(cls.length === 1 && cls[0].system.level === 1, `${slug}: ${cls[0]?.system?._dsid ?? "no class"} at level ${cls[0]?.system?.level}`);
}

console.log("\n4) Taint fields (tools/taint-smoke.mjs asserts these too)");
for (const [slug, a] of Object.entries(actors)) {
  ok(gw(a).taint === 0, `${slug}: taint 0`);
  ok(gw(a).corruptionHistory === "", `${slug}: empty Corruption History`);
}

console.log("\n5) Ward the Room is embedded and already learned on the three ritualists");
for (const slug of ["kaes-vahn-estal", "vessa-corran-dov", "sabbat-vane"]) {
  const f = actors[slug].items.find(i => i.system?._dsid === "ritual-ward-the-room");
  ok(f?.flags?.[MODULE_ID]?.ritual?.learned === true, `${slug}: Ward the Room learned`);
}
for (const slug of Object.keys(actors).filter(s => !(loadouts[s]?.rituals ?? []).length))
  ok(!actors[slug].items.some(i => i.flags?.[MODULE_ID]?.ritual), `${slug}: no ritual Formula (none in the loadout)`);

console.log("\n6) Every loadout line is on the sheet");
for (const [slug, l] of Object.entries(loadouts)) {
  const held = new Set(actors[slug].items.map(i => i.system?._dsid));
  const paths = [l.armor, ...(l.weapons ?? []), ...(l.gear ?? []), ...(l.rituals ?? []),
    ...(l.chrome ?? []).map(c => c.path), ...(l.mods ?? []).map(m => m.path)].filter(Boolean);
  const missing = paths.filter(p => !held.has(read(p).system?._dsid));
  ok(!missing.length, `${slug}: all ${paths.length} loadout items embedded${missing.length ? ` (missing ${missing.join(", ")})` : ""}`);
  ok(gw(actors[slug]).biSpent === (l.biTotal ?? 0) && gw(actors[slug]).integrity.value === 20 - (l.biTotal ?? 0),
    `${slug}: Body Integrity ${20 - (l.biTotal ?? 0)}/20 from ${(l.chrome ?? []).length} chrome`);
}

console.log("\n7) Installed matrix mods keep their host and magazine count");
for (const [slug, l] of Object.entries(loadouts)) {
  for (const m of l.mods ?? []) {
    const dsid = read(m.path).system?._dsid;
    const item = actors[slug].items.find(i => i.system?._dsid === dsid);
    const mod = item?.flags?.[MODULE_ID]?.mod ?? {};
    ok(item?.system?.quantity === m.quantity && mod.installedOn === m.installedOn && mod.active === m.active,
      `${slug}: ${dsid} ×${m.quantity} installed on ${m.installedOn}`);
    ok(actors[slug].items.some(i => i._id === m.installedOn), `${slug}: host ${m.installedOn} is on the sheet`);
  }
}

console.log("\n8) Kit identity (0.1.92 hand-fixes now live in the generator ROSTER)");
const kitOf = slug => actors[slug].items.find(i => i.type === "kit")?.system?._dsid;
ok(kitOf("vira-kellis-nade") === "fabricators-bench", `vira-kellis-nade: kit ${kitOf("vira-kellis-nade")}`);
ok(!actors["barak-voss-hallor"].items.some(i => i.system?._dsid === "command-persona-fearful-awe"),
  "barak-voss-hallor: no Command Persona / Fearful Awe");
ok(!actors["wren-sable-corvin"].items.some(i => i.system?._dsid === "careful-observation"),
  "wren-sable-corvin: no L3 Careful Observation");

console.log("\n9) post-patches.json carries the non-gear, non-identity fields");
ok(postPatches._all?.flags?.[MODULE_ID]?.taint === 0, "_all patches taint");
ok(postPatches._all?.flags?.[MODULE_ID]?.corruptionHistory === "", "_all patches Corruption History");

console.log("\n10) Round trip — regenerating reproduces the committed actors byte for byte");
const snapshot = new Map([...files.map(f => [join(OUT, f), readFileSync(join(OUT, f))]), [LANG, readFileSync(LANG)]]);
let changed = [];
try {
  execFileSync(process.execPath, ["tools/pregens-to-actors.mjs"], { stdio: "pipe" });
  changed = [...snapshot].filter(([p, before]) => !existsSync(p) || !readFileSync(p).equals(before)).map(([p]) => p);
  const added = readdirSync(OUT).filter(f => !snapshot.has(join(OUT, f)));
  ok(!changed.length && !added.length, `regen is a no-op${changed.length ? ` — changed: ${changed.join(", ")}` : ""}${added.length ? ` — added: ${added.join(", ")}` : ""}`);
} catch (err) {
  ok(false, `generator ran clean (${err.message.split("\n")[0]})`);
} finally {
  if (changed.length) { for (const [p, before] of snapshot) writeFileSync(p, before); console.log("     (working tree restored)"); }
}

console.log("");
if (failures.length) { console.error(`pregen-regen-smoke: ${failures.length} FAILED\n  ${failures.join("\n  ")}`); process.exit(1); }
console.log("pregen-regen-smoke: all checks passed");
