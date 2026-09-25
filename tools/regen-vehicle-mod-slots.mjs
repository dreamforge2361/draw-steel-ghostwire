#!/usr/bin/env node
/**
 * 0.3.139 (D) — make every chassis card's "Mod slots (N)" paragraph agree with its own header.
 *
 * The bug: a vehicle or drone card prints its capacity **twice**.
 *
 *   <strong>Mod slots:</strong> 6            ← the header line, derived from flags.<module>.vehicle.modSlots
 *   <strong>Mod slots (4):</strong> Fill …   ← the paragraph below it, hand-authored once and never updated
 *
 * 75 of the 87 chassis that print both disagreed with themselves. Brick said 6 and then 4;
 * Star-Chopper said 2 and then 1. A player reading the card has no way to know which number
 * the Director will honour.
 *
 * The fix, and the source of truth: **`flags.<module>.vehicle.modSlots`**. The header already reads it;
 * this rewrites the paragraph's `(N)` from the same flag, and leaves the rest of the paragraph — the
 * mod links and the §Craft sentence — exactly as published. Lock D is the count, not a re-authoring of
 * 87 cards' link lists, and `tools/regen-mod-slot-cards.mjs` remains the place where the **gear** pack's
 * paragraphs are derived end to end.
 *
 * Rows with **no** paragraph are skipped rather than given one. Base assets (workbenches, door locks,
 * the Mesh-Web) print neither the header line nor the paragraph; giving them one would invent a claim
 * the card never made, not fix a mismatch.
 *
 * Run (no live Foundry needed):
 *   node tools/regen-vehicle-mod-slots.mjs           # rewrite lang/en.json in place
 *   node tools/regen-vehicle-mod-slots.mjs --check   # exit 1 if any chassis disagrees with itself
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MODULE_ID = "draw-steel-ghostwire";
const LANG = "lang/en.json";
const check = process.argv.slice(2).includes("--check");

const readJson = path => JSON.parse(readFileSync(path, "utf8"));

/** `GHOSTWIRE.Vehicles.Items.Brick.Description` -> `Brick` */
const langKeyOf = doc => String(doc.system?.description?.value ?? "").split(".").at(-2);

/** Every non-folder Item under src/packs/vehicles. */
export function vehicleDocs() {
  const base = "src/packs/vehicles";
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

/** The published capacity: the one number both halves of the card must show. */
export const modSlotsOf = doc => Number(doc?.flags?.[MODULE_ID]?.vehicle?.modSlots);

export const HEADER_RE = /<strong>Mod slots:<\/strong>\s*(\d+)/;
export const PARA_RE = /<strong>Mod slots \((\d+)\):<\/strong>/;

/**
 * What a card says about its own capacity.
 * @returns {{header: number|null, paragraph: number|null}}
 */
export function slotClaims(description) {
  const text = String(description ?? "");
  const header = HEADER_RE.exec(text);
  const para = PARA_RE.exec(text);
  return {
    header: header ? Number(header[1]) : null,
    paragraph: para ? Number(para[1]) : null,
  };
}

/** The same description with both claims re-stamped from `slots`. Untouched when it prints neither. */
export function restamp(description, slots) {
  let text = String(description ?? "");
  if (!Number.isFinite(slots)) return text;
  if (HEADER_RE.test(text)) text = text.replace(HEADER_RE, `<strong>Mod slots:</strong> ${slots}`);
  if (PARA_RE.test(text)) text = text.replace(PARA_RE, `<strong>Mod slots (${slots}):</strong>`);
  return text;
}

if (import.meta.url === `file://${process.argv[1].replaceAll("\\", "/")}`
  || process.argv[1]?.endsWith("regen-vehicle-mod-slots.mjs")) {
  const lang = readJson(LANG);
  const vehicleLang = lang.GHOSTWIRE.Vehicles.Items;

  const stale = [];
  let rewritten = 0;
  for (const { doc } of vehicleDocs()) {
    const slots = modSlotsOf(doc);
    if (!Number.isFinite(slots)) continue;
    const key = langKeyOf(doc);
    const entry = vehicleLang[key];
    if (!entry) {
      console.error(`${doc.system?._dsid}: no GHOSTWIRE.Vehicles.Items.${key} entry`);
      process.exit(1);
    }
    const next = restamp(entry.Description, slots);
    if (next === entry.Description) continue;
    stale.push(`${doc.system._dsid} (${slotClaims(entry.Description).paragraph} → ${slots})`);
    entry.Description = next;
    rewritten += 1;
  }

  if (check) {
    if (stale.length) {
      console.error(`${stale.length} chassis card(s) disagree with their own modSlots flag:\n  ${stale.join("\n  ")}`);
      process.exit(1);
    }
    console.log("every chassis card's Mod slots header and paragraph match its modSlots flag");
    process.exit(0);
  }

  if (rewritten) {
    // lang/en.json is stored indent 2, raw UTF-8, CRLF, trailing newline.
    writeFileSync(LANG, `${JSON.stringify(lang, null, 2).replaceAll("\n", "\r\n")}\r\n`, "utf8");
  }
  console.log(`${rewritten} chassis card(s) restamped${rewritten ? `:\n  ${stale.join("\n  ")}` : ""}`);
}
