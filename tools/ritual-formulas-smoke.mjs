#!/usr/bin/env node
/**
 * 0.3.88 — Ritual Workings / Ritual Formulas smoke.
 * - One Formula Item per "### " card in docs/raw/22-the-veil.md (Ritual Workings — <leader> sections).
 * - Every Formula resolves its name and description through lang/en.json, prints ¥ and a Components total,
 *   carries the RitualFormula tag, and is stable 16-char gwRit… id.
 * - Ward the Room (¥75 / ¥40), Seal the Flat (¥180, Project goals 4 / 6 / 4) and Data Ward exist; "Glyph Cage"
 *   and the "Mag" shorthand are gone from player-facing text.
 * - The resource firewall is on every card; Formula Items are on no kiosk shelf (folder not in any preset).
 * - Kaes, Vessa and Sabbat carry Ward the Room, flagged learned, without losing their other loot.
 *
 * Run: node tools/ritual-formulas-smoke.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { KIOSK_PRESETS, matchPresetItem } from "../scripts/kiosk-presets.mjs";

const MODULE = "draw-steel-ghostwire";
const DIR = "src/packs/gear/general/ritual-formulas";
const failures = [];
const ok = (cond, msg) => { if (!cond) failures.push(msg); else console.log(`  ✓ ${msg}`); };
const read = p => JSON.parse(readFileSync(p, "utf8").replace(/^FEFF/, ""));
const lang = read("lang/en.json");
const t = key => key.split(".").reduce((o, k) => o?.[k], lang);

const raw = readFileSync("docs/raw/22-the-veil.md", "utf8").replace(/\r\n/g, "\n");
const cardSections = raw.split(/^(?=## )/m).filter(s => s.startsWith("## Ritual Workings — ") && !s.includes("Card Index\n"));
const cardCount = cardSections.reduce((n, s) => n + (s.match(/^### /gm) ?? []).length, 0);
ok(cardCount === 46, `RAW carries 46 Working cards (found ${cardCount})`);
ok(!/Glyph Cage/.test(raw), "RAW: no Glyph Cage (renamed Data Ward)");
ok(!/\bMag\b/.test(raw.slice(raw.indexOf("## Ritual Workings\n"), raw.indexOf("## §C3"))), "RAW Ritual Workings: no 'Mag' shorthand");
ok(!/placeholder|\(proposed\)/i.test(raw), "RAW: no placeholder / proposed markers");
ok(/never\*\* spend \*\*Essence\*\*, \*\*Conviction\*\*, or \*\*Resonance\*\*/.test(raw), "RAW: resource firewall stated once at the top");

const folder = read(join(DIR, "_folder.json"));
ok(folder._id === "gwGearRitualForm" && t(folder.name) === "Ritual Formulas", "Ritual Formulas folder + lang");
const files = readdirSync(DIR).filter(f => f.endsWith(".json") && f !== "_folder.json");
ok(files.length === cardCount, `one Formula Item per card (${files.length})`);

const byId = new Map();
for (const f of files) {
  const it = read(join(DIR, f));
  byId.set(it._id, it);
  const name = t(it.name), desc = t(it.system.description.value);
  const g = it.flags?.[MODULE] ?? {};
  const bad = [];
  if (!/^gwRit[A-Za-z0-9]{11}$/.test(it._id)) bad.push("id");
  if (it._key !== `!items!${it._id}` || it.folder !== folder._id || it.type !== "treasure") bad.push("key/folder/type");
  if (typeof name !== "string" || !name.startsWith("Formula: ")) bad.push("name");
  if (typeof desc !== "string" || !/Components total/.test(desc) || !/¥[\d,]+/.test(desc)) bad.push("¥ / Components total");
  if (!/Essence.*Conviction.*Resonance/s.test(desc ?? "")) bad.push("firewall");
  if (/Glyph Cage|\bMag\b/.test(desc ?? "")) bad.push("Glyph Cage / Mag");
  if (!g.gear?.tags?.includes("RitualFormula") || g.gear?.price !== null) bad.push("gear flags");
  if (!g.ritual?.formula || !g.ritual?.componentsTotal?.length || g.ritual?.learned !== false) bad.push("ritual flags");
  if (bad.length) failures.push(`${f}: ${bad.join(", ")}`);
}
ok(!failures.some(f => f.includes(".json:")), `every Formula resolves name, card text, ¥, firewall, flags`);

const ward = byId.get("gwRitWardRoom000");
ok(ward && /¥75/.test(t(ward.system.description.value)) && /¥40/.test(t(ward.system.description.value)), "Ward the Room: ¥75 Veil / ¥40 Wire skin");
const seal = byId.get("gwRitSealFlat000");
const sealText = seal ? t(seal.system.description.value) : "";
ok(seal?.flags[MODULE].ritual.magnitude === 2 && seal.flags[MODULE].ritual.family === "Ward" && /General/.test(seal.flags[MODULE].ritual.leaders), "Seal the Flat: Magnitude 2 General Ward");
ok(/¥180/.test(sealText) && /goal 6/.test(sealText) && /goal 4/.test(sealText) && /Study goal:<\/strong> <strong>4/.test(sealText), "Seal the Flat: ¥180, study 4 / sanctum 6 / sealing 4");
ok(/Story walkthrough/.test(sealText), "Seal the Flat: story walkthrough");
const data = byId.get("gwRitDataWard000");
ok(data && t(data.name) === "Formula: Data Ward" && /Technomancer/.test(data.flags[MODULE].ritual.leaders), "Data Ward: Technomancer Wire ward");

const shelved = [...byId.values()].flatMap(it => KIOSK_PRESETS.filter(p => matchPresetItem({ ...it, pack: "gear" }, p)).map(p => `${it._id}→${p.id}`));
ok(!shelved.length, `no kiosk preset stocks a Ritual Formula${shelved.length ? ` (${shelved.join(", ")})` : ""}`);

const loadouts = read("docs/masters/pregens/loadouts.json");
for (const slug of ["kaes-vahn-estal", "vessa-corran-dov", "sabbat-vane"]) {
  const actor = read(`src/packs/pregens/${slug}.json`);
  const formula = actor.items.find(i => i._id === "gwRitWardRoom000");
  ok(formula?._key === `!actors.items!${actor._id}.gwRitWardRoom000` && formula.flags[MODULE].ritual.learned === true, `${slug}: Ward the Room embedded, learned`);
  ok(actor.items.filter(i => i.type === "treasure").length >= 8, `${slug}: other loot still present`);
  ok(loadouts[slug]?.rituals?.includes(`${DIR}/ward-the-room.json`), `${slug}: loadouts.json lists the Formula`);
}

if (failures.length) {
  console.error(`\nRitual Formulas smoke FAILED:\n  - ${failures.join("\n  - ")}`);
  process.exit(1);
}
console.log("\nRitual Formulas smoke passed");
