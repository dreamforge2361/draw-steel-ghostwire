// B80 smoke: Taint 0–12 lock, RAW + journal + flag path, BOM-free JSON, chrome/rest firewall.
// 0.3.58: Director Taint +1 helper / macro / scene control.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  clampTaint,
  taintBandId,
  TAINT_MAX,
  TAINT_BANDS,
  getTaint,
  incrementTaint,
  previewTaintDelta,
  actorAcceptsTaint,
  hasTaintFlag,
  collectTaintTargets,
} from "../scripts/taint.mjs";
import { atLeast } from "./lib/module-version.mjs";

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

note(atLeast(module.version, "0.3.58"), `module.json is ≥ 0.3.58 (got ${module.version})`);
note(module.packs.some(p => p.name === "macros" && p.type === "Macro"), "module.json registers Ghostwire Macros pack");
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
note(raw.includes("Director Taint +1"), "RAW Foundry aside names Director Taint +1");
note(director.includes("incrementTaint"), "Director notes name incrementTaint");
note(spike.includes("incrementTaint"), "spike as-built names incrementTaint");
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
note(sheet.includes("getSceneControlButtons"), "Director Taint +1 registers a scene-control button");
note(sheet.includes("export async function incrementTaint"), "incrementTaint is exported");
note(sheet.includes("directorTaintPlusOne"), "directorTaintPlusOne is exported");
note(boot.includes("registerTaint()"), "module registers Taint");
note(!/taint/.test(chrome.split("createItem")[2] ?? "") || chrome.includes("Do not write flags.<module>.taint"), "chrome install comments the Taint firewall");
note(lang.GHOSTWIRE.Taint.Bands.clean === "Clean", "lang Clean");
note(lang.GHOSTWIRE.Taint.Bands.hollowed === "Hollowed", "lang Hollowed");
note(lang.GHOSTWIRE.Taint.Director.Title === "Director: Taint +1", "lang Director title");
note(lang.GHOSTWIRE.Taint.Director.AtMax.includes("12"), "lang Director at-max warning");
note(lang.GHOSTWIRE.COMPENDIUM.macros === "Ghostwire Macros", "lang Ghostwire Macros pack label");

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

function mockActor({ type = "hero", taint, id = "Actor0000000001", name = "Test" } = {}) {
  const flags = { "draw-steel-ghostwire": {} };
  if (taint !== undefined) flags["draw-steel-ghostwire"].taint = taint;
  return {
    id,
    name,
    type,
    flags,
    getFlag(mod, key) {
      return this.flags[mod]?.[key];
    },
    async update(data) {
      const next = data["flags.draw-steel-ghostwire.taint"];
      if (next !== undefined) this.flags["draw-steel-ghostwire"].taint = next;
    },
  };
}

note(actorAcceptsTaint(mockActor({ type: "hero" })), "hero without flag accepts Taint");
note(actorAcceptsTaint(mockActor({ type: "hero", taint: 0 })), "hero at 0 accepts Taint");
note(!actorAcceptsTaint(mockActor({ type: "npc" })), "NPC without flag is ineligible");
note(actorAcceptsTaint(mockActor({ type: "npc", taint: 0 })), "NPC with taint 0 is eligible");
note(actorAcceptsTaint(mockActor({ type: "npc", taint: 4 })), "NPC with taint 4 is eligible");
note(!hasTaintFlag(mockActor({ type: "hero" })), "missing flag is not hasTaintFlag");
note(hasTaintFlag(mockActor({ type: "npc", taint: 0 })), "taint 0 counts as hasTaintFlag");

const preview12 = previewTaintDelta(12, 1);
note(preview12.value === 12 && preview12.unchanged && preview12.atMax, "preview +1 at 12 stays 12 / atMax");
note(previewTaintDelta(11, 1).value === 12 && !previewTaintDelta(11, 1).atMax, "preview 11 +1 → 12 is not atMax warn");
note(previewTaintDelta(0, 1).value === 1 && previewTaintDelta(0, 1).band === "marked", "preview 0 +1 → 1 Marked");
note(previewTaintDelta(5, -2).value === 3, "preview supports negative delta");
note(previewTaintDelta(0, "1").value === 1, "preview truncates numeric strings");

const targeted = collectTaintTargets({
  targeted: [{ actor: { id: "a", name: "A" } }],
  controlled: [{ actor: { id: "b", name: "B" } }],
});
note(targeted.length === 1 && targeted[0].id === "a", "collectTaintTargets prefers targeted over controlled");
const selected = collectTaintTargets({ targeted: [], controlled: [{ actor: { id: "b", name: "B" } }, { actor: { id: "b", name: "B" } }] });
note(selected.length === 1 && selected[0].id === "b", "collectTaintTargets falls back to controlled and dedupes");

await (async () => {
  const hero = mockActor({ type: "hero", taint: 0 });
  const r1 = await incrementTaint(hero, 1);
  note(r1.value === 1 && getTaint(hero) === 1 && r1.band === "marked", "incrementTaint 0 +1 → 1 Marked");
  const r2 = await incrementTaint(hero, 1);
  note(r2.value === 2 && getTaint(hero) === 2, "incrementTaint 1 +1 → 2");

  const stained = mockActor({ type: "hero", taint: 6 });
  const r3 = await incrementTaint(stained);
  note(r3.value === 7 && r3.band === "claimed" && getTaint(stained) === 7, "incrementTaint 6 +1 → 7 Claimed");

  const almost = mockActor({ type: "hero", taint: 11 });
  const r4 = await incrementTaint(almost, 1);
  note(r4.value === 12 && r4.band === "hollowed" && !r4.atMax, "incrementTaint 11 +1 → 12 Hollowed");

  const full = mockActor({ type: "hero", taint: 12 });
  const r5 = await incrementTaint(full, 1);
  note(r5.value === 12 && r5.unchanged && r5.atMax && getTaint(full) === 12, "incrementTaint 12 +1 clamps and warns atMax");

  const over = mockActor({ type: "hero", taint: 10 });
  const r6 = await incrementTaint(over, 5);
  note(r6.value === 12 && getTaint(over) === 12, "incrementTaint clamps +5 from 10 to 12");

  const npc = mockActor({ type: "npc", taint: 3 });
  const r7 = await incrementTaint(npc, 1);
  note(r7.value === 4 && getTaint(npc) === 4, "incrementTaint works on an NPC that already has the flag");
})();

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
  note(/Director Taint \+1/.test(blob), "journal In Foundry names Director Taint +1");
  note(!blob.includes("\uFEFF"), "journal JSON text has no BOM char");
} catch (err) {
  note(false, `Taint journal readable (${err.message})`);
}

const rulebook = readdirSync("src/packs/rulebook/ghostwire-systems").filter(f => f.endsWith(".json"));
note(rulebook.includes("27-corruption-taint.json"), "rulebook systems folder lists 27");

const macroPath = join("src/packs/macros/director-taint-plus-one.json");
try {
  const macro = JSON.parse(readFileSync(macroPath, "utf8"));
  note(!hasBom(macroPath), "Director Taint macro is BOM-free");
  note(macro._id === "gwDirTaintPlus01" && macro.type === "script", "macro is a script document");
  note(macro.command.includes("directorTaintPlusOne"), "macro command calls directorTaintPlusOne");
  note(macro.flags?.["draw-steel-ghostwire"]?.directorTool === "taint-plus-one", "macro flags directorTool");
} catch (err) {
  note(false, `Director Taint macro readable (${err.message})`);
}

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
