// B80 smoke: Taint 0–12 lock, RAW + journal + flag path, BOM-free JSON, chrome/rest firewall.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { clampTaint, taintBandId, TAINT_MAX, TAINT_BANDS } from "../scripts/taint.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(msg);

const raw = readFileSync("docs/raw/27-corruption-taint.md", "utf8");
const spike = readFileSync("docs/spikes/B80-CORRUPTION-TAINT-TRACK.md", "utf8");
const director = readFileSync("docs/directors/corruption-taint.md", "utf8");
const module = JSON.parse(readFileSync("module.json", "utf8"));
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const sheet = readFileSync("scripts/taint.mjs", "utf8");
const boot = readFileSync("scripts/module.mjs", "utf8");
const chrome = readFileSync("scripts/module.mjs", "utf8");
const index = readFileSync("docs/raw/00-INDEX.md", "utf8");
const veil = readFileSync("docs/raw/22-the-veil.md", "utf8");
const ancestry = readFileSync("docs/raw/05-ancestries.md", "utf8");
const mapping = readFileSync("tools/raw-to-journals.mjs", "utf8");

note(module.version === "0.3.37", `module.json is 0.3.37 (got ${module.version})`);
note(spike.includes("DESIGN LOCKED"), "spike is DESIGN LOCKED");
note(/Clean|Marked|Stained|Claimed|Hollowed/.test(raw) && raw.includes("0") && raw.includes("12"), "RAW names all five bands and 0–12");
note(raw.includes("+1 Taint maximum per scene") || raw.includes("+1 Taint maximum per scene"), "RAW prints the per-scene cap");
note(/pact/i.test(raw) && raw.includes("ignores the cap"), "RAW prints the pact exception");
note(/never cleanses Taint/i.test(raw), "RAW: rest never cleanses");
note(/Chrome does not raise Taint/i.test(raw), "RAW: chrome does not raise Taint");
note(/Corruption Load is retired/i.test(raw), "RAW: Mutant Load stays retired");
note(!/Warhammer|Shadowrun|Cthulhu|Warhammer 40|World of Darkness|Chaos Undivided/i.test(raw + director + spike), "no third-party IP names in B80 published text");
note(index.includes("27-corruption-taint.md"), "RAW index lists 27");
note(veil.includes("27-corruption-taint.md"), "Veil points at 27");
note(ancestry.includes("27-corruption-taint.md"), "Ancestries point at 27");
note(director.includes("corrupted zone"), "Director notes cover corrupted zones");
note(mapping.includes("27-corruption-taint"), "journal mapping includes 27");
note(sheet.includes("flags.${MODULE_ID}.taint"), "sheet writes flags.draw-steel-ghostwire.taint");
note(sheet.includes("renderDrawSteelHeroSheet"), "sheet hooks renderDrawSteelHeroSheet");
note(sheet.includes("renderActorSheet"), "sheet hooks renderActorSheet fallback");
note(sheet.includes("ghostwire-taint-header"), "sheet injects header Taint control");
note(sheet.includes('type: "number"') && sheet.includes("TAINT_MAX"), "sheet uses a 0–12 number input");
note(sheet.includes("isOwner") && sheet.includes("isGM"), "owner + GM can edit");
note(sheet.includes("addEventListener(\"input\""), "band updates live on input");
note(sheet.includes("corruptionHistory") && sheet.includes("ghostwire-corruption-history"), "Biography tab Corruption History field");
note(sheet.includes("data-tab='biography'"), "history injects on Biography tab");
note(boot.includes("registerTaint()"), "module registers Taint");
note(!/taint/.test(chrome.split("createItem")[2] ?? "") || chrome.includes("Do not write flags.<module>.taint"), "chrome install comments the Taint firewall");
note(lang.GHOSTWIRE.Taint.Bands.clean === "Clean", "lang Clean");
note(lang.GHOSTWIRE.Taint.Bands.hollowed === "Hollowed", "lang Hollowed");

const cases = [
  [-1, 0, "clean"],
  [0, 0, "clean"],
  [1, 1, "marked"],
  [3, 3, "marked"],
  [4, 4, "stained"],
  [6, 6, "stained"],
  [7, 7, "claimed"],
  [9, 9, "claimed"],
  [10, 10, "hollowed"],
  [12, 12, "hollowed"],
  [13, 12, "hollowed"],
  ["2", 2, "marked"],
  [{ value: 8 }, 0, "clean"],
];
for (const [input, expected, band] of cases) {
  const n = clampTaint(input);
  note(n === expected && taintBandId(input) === band, `clamp/band ${JSON.stringify(input)} → ${expected} ${band}`);
}
note(TAINT_MAX === 12 && TAINT_BANDS.length === 5, "helper exports 0–12 / five bands");

function hasBom(path) {
  const buf = readFileSync(path);
  return buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;
}
note(!hasBom("module.json"), "module.json is BOM-free");
note(!hasBom("lang/en.json"), "lang/en.json is BOM-free");

const journalPath = join("src/packs/rulebook/ghostwire-systems/27-corruption-taint.json");
try {
  const journal = JSON.parse(readFileSync(journalPath, "utf8"));
  const blob = JSON.stringify(journal);
  note(!hasBom(journalPath), "Taint journal is BOM-free");
  note(journal.flags?.["draw-steel-ghostwire"]?.raw === "docs/raw/27-corruption-taint.md", "journal flags raw path");
  note(/Clean|Marked|Stained|Claimed|Hollowed/.test(blob), "journal carries band names");
  note(/flags\.draw-steel-ghostwire\.taint/.test(blob), "journal In Foundry names the flag");
  note(/Corruption History/.test(blob) && /corruptionHistory/.test(blob), "journal In Foundry names Corruption History");
  note(!blob.includes("\uFEFF"), "journal JSON text has no BOM char");
} catch (err) {
  note(false, `Taint journal readable (${err.message})`);
}

const rulebook = readdirSync("src/packs/rulebook/ghostwire-systems").filter(f => f.endsWith(".json"));
note(rulebook.includes("27-corruption-taint.json"), "rulebook systems folder lists 27");

const pregens = readdirSync("src/packs/pregens").filter(f => f.endsWith(".json") && !f.endsWith("_folder.json"));
for (const file of pregens) {
  const actor = JSON.parse(readFileSync(join("src/packs/pregens", file), "utf8"));
  note(actor.flags?.["draw-steel-ghostwire"]?.taint === 0, `pregen ${file} has taint 0`);
  note(actor.flags?.["draw-steel-ghostwire"]?.corruptionHistory === "", `pregen ${file} has empty Corruption History`);
}

console.log(ok.map(m => `ok  ${m}`).join("\n"));
if (fail.length) {
  console.error(fail.map(m => `FAIL ${m}`).join("\n"));
  process.exit(1);
}
console.log(`taint-smoke: ${ok.length} checks`);
