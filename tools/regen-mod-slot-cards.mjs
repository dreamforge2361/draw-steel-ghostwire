#!/usr/bin/env node
/**
 * Regenerate the "Mod slots (N): Fill them with …" paragraph on every host gear card.
 *
 * A host is any `src/packs/gear/**` Item whose `flags.<module>.gear` publishes `modSlots > 0`
 * and a non-empty `modFamily`. Its card closes with one paragraph listing every mod in the Mods
 * pack whose own host families overlap — so publishing a new mod SKU never leaves 88 hand-written
 * @UUID lists behind (G2, 0.3.100). The paragraph is derived, never authored:
 *
 *   order        the order `GHOSTWIRE.Mods.Items` already reads in (catalog order, not alphabetical)
 *   family label one label per family token the host publishes, joined with " / "
 *   skills       the distinct §Craft skills of the listed mods, first-seen order, joined with " or "
 *
 * Run (no live Foundry needed):
 *   node tools/regen-mod-slot-cards.mjs           # rewrite lang/en.json in place
 *   node tools/regen-mod-slot-cards.mjs --check    # exit 1 if any card is stale (CI / smoke)
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MODULE_ID = "draw-steel-ghostwire";
const LANG = "lang/en.json";
const check = process.argv.slice(2).includes("--check");

/** One label per host-family token. Joined with " / " in the order the host publishes them. */
const FAMILY_LABEL = {
  weapon: "weapon",
  armor: "armor",
  shield: "shield",
  comms: "comms",
  wired: "Wired gadget",
  "bne-mechanical": "mechanical break-in tool",
  "bne-electronic": "electronic break-in tool",
  sensors: "sensors & optics",
  survival: "survival kit",
};

/** Which Mods-pack folder a family belongs to, for the "Ghostwire Mods › …" pointer. */
const SECTION = family => {
  if (family === "weapon") return "Weapon Mods";
  if (family === "armor" || family === "shield") return "Armor & Shield Mods";
  return "Gadget Mods";
};

const SKILL_LABEL = { repair: "Repair", electronics: "Electronics", hacking: "Hacking", cybertech: "Cybertech" };

const readJson = path => JSON.parse(readFileSync(path, "utf8"));
const gw = doc => doc?.flags?.[MODULE_ID] ?? {};

/** Every non-folder Item under src/packs/<pack>. */
function scan(pack) {
  const base = join("src/packs", pack);
  const rows = [];
  for (const file of readdirSync(base, { recursive: true })) {
    const rel = String(file).replaceAll("\\", "/");
    if (!rel.endsWith(".json") || rel.endsWith("_folder.json")) continue;
    const doc = readJson(join(base, rel));
    if (!doc._id || String(doc._key ?? "").startsWith("!folders!")) continue;
    rows.push({ doc, path: rel });
  }
  return rows;
}

/** `GHOSTWIRE.Mods.Items.TraumaPlates.Description` -> `TraumaPlates` */
const langKeyOf = doc => String(doc.system?.description?.value ?? "").split(".").at(-2);

const lang = readJson(LANG);
const modLang = lang.GHOSTWIRE.Mods.Items;
const gearLang = lang.GHOSTWIRE.Gear.Items;

// Mods, in the order GHOSTWIRE.Mods.Items reads (that is the published catalog order).
const modsByKey = new Map();
for (const { doc } of scan("mods")) {
  if (!gw(doc).mod) continue;
  modsByKey.set(langKeyOf(doc), doc);
}
const orderedMods = Object.keys(modLang)
  .filter(key => modsByKey.has(key))
  .map(key => ({ key, doc: modsByKey.get(key) }));

const missing = [...modsByKey.keys()].filter(key => !(key in modLang));
if (missing.length) {
  console.error(`Mods with no GHOSTWIRE.Mods.Items entry: ${missing.join(", ")}`);
  process.exit(1);
}

const hostsOf = mod => [...new Set([gw(mod).mod?.hosts, gw(mod).mod?.host].flat().filter(Boolean))];

function paragraph(host) {
  const gear = gw(host).gear;
  const families = gear.modFamily;
  const slots = Number(gear.modSlots);
  const fits = orderedMods.filter(({ doc }) => hostsOf(doc).some(family => families.includes(family)));
  if (!fits.length) return null;

  const label = families.map(family => FAMILY_LABEL[family] ?? family).join(" / ");
  const links = fits
    .map(({ key, doc }) => `@UUID[Compendium.${MODULE_ID}.mods.Item.${doc._id}]{${modLang[key].Name}}`)
    .join(", ");
  const skills = [...new Set(fits.flatMap(({ doc }) => gw(doc).mod.craftSkill ?? []))]
    .map(skill => SKILL_LABEL[skill] ?? skill)
    .join(" or ");

  return `<p><strong>Mod slots (${slots}):</strong> Fill them with ${label} mods from `
    + `<strong>Ghostwire Mods › ${SECTION(families[0])}</strong>: ${links}. `
    + `Installing is a downtime Project (§Craft) keyed to each mod’s skill (${skills}); `
    + `toggling an installed mod is a field action.</p>`;
}

const PARA_RE = /<p><strong>Mod slots \(\d+\):<\/strong> Fill them with [\s\S]*$/;

let rewritten = 0;
const stale = [];
for (const { doc } of scan("gear")) {
  const gear = gw(doc).gear;
  if (!(Number(gear?.modSlots) > 0) || !gear.modFamily?.length) continue;
  const key = langKeyOf(doc);
  const entry = gearLang[key];
  if (!entry) {
    console.error(`${doc.system?._dsid}: no GHOSTWIRE.Gear.Items.${key} entry`);
    process.exit(1);
  }
  const para = paragraph(doc);
  if (!para) continue;
  const base = entry.Description.replace(PARA_RE, "");
  const next = base + para;
  if (next === entry.Description) continue;
  stale.push(doc.system._dsid);
  entry.Description = next;
  rewritten += 1;
}

if (check) {
  if (stale.length) {
    console.error(`${stale.length} host card(s) out of sync with the Mods pack:\n  ${stale.join("\n  ")}`);
    process.exit(1);
  }
  console.log("every host mod-slot card matches the Mods pack");
  process.exit(0);
}

if (rewritten) {
  // lang/en.json is stored indent 2, raw UTF-8, CRLF, trailing newline.
  const body = JSON.stringify(lang, null, 2).replaceAll("\n", "\r\n") + "\r\n";
  writeFileSync(LANG, body, "utf8");
}
console.log(`${rewritten} host card(s) rewritten${rewritten ? `: ${stale.join(", ")}` : ""}`);
