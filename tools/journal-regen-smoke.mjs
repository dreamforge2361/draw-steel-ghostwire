// B98 smoke: rules journals stay text-only; lore journals carry placed plates;
// In Foundry sidebars survive; Ghostwire-only naming after front matter.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(msg);

function loadJournals(pack) {
  const root = join("src/packs", pack);
  const files = readdirSync(root, { recursive: true }).filter(f => f.endsWith(".json") && !f.endsWith("_folder.json"));
  return files.map(f => ({ file: f, doc: JSON.parse(readFileSync(join(root, f), "utf8")) }));
}

function pagesOf(entries) {
  return entries.flatMap(e => (e.doc.pages ?? []).map(p => ({ ...e, page: p })));
}

function textOf(page) {
  return `${page.text?.markdown ?? ""}\n${page.text?.content ?? ""}`;
}

const rulebook = loadJournals("rulebook");
const lore = loadJournals("lore");
const rulePages = pagesOf(rulebook);
const lorePages = pagesOf(lore);

note(rulebook.some(e => e.file.includes("26-lifestyle-downtime")), "rulebook includes Lifestyle & Downtime");
note(rulebook.some(e => e.file.includes("rulebook-index")), "rulebook index present");
note(lore.some(e => e.file.includes("L1-setting-primer")), "lore includes L1");
note(lore.some(e => e.file.includes("L3-ossian-reach-color")), "lore includes L3");
note(lore.some(e => e.file.includes("L4-voidmark")), "lore includes L4");
note(lore.some(e => e.file.includes("L5-hands-off-accords")), "lore includes L5");

const index = rulebook.find(e => e.file.includes("rulebook-index"));
const indexText = index ? textOf(index.doc.pages[0]) : "";
note(indexText.includes("You do **not** need a separate rulebook") || indexText.includes("You do <strong>not</strong> need a separate rulebook"), "rulebook index is Ghostwire-only");
note(!/Draw Steel Heroes/i.test(indexText), "rulebook index does not name Draw Steel Heroes");

const rulesImgs = rulePages.filter(p => /<img\b|!\[[^\]]*]\([^)]+\)/.test(textOf(p.page)));
note(rulesImgs.length === 0, `rules journals have no artwork plates (${rulesImgs.length} hits)`);

const foundrySidebars = rulePages.filter(p => /\*\*In Foundry\*\*|In Foundry/.test(textOf(p.page)));
note(foundrySidebars.length >= 8, `In Foundry sidebars survive in rules text (${foundrySidebars.length} pages)`);

const afterFront = rulebook.filter(e => !/00-front-matter|rulebook-index/.test(e.file));
const heroesLeak = afterFront.filter(e => (e.doc.pages ?? []).some(p => /Draw Steel Heroes/i.test(textOf(p))));
note(heroesLeak.length === 0, `no Draw Steel Heroes language after front matter (${heroesLeak.length} journals)`);

const expectedArt = [
  "cosmology.webp",
  "planes.webp",
  "megacorps.webp",
  "wired.webp",
  "timeline.webp",
  "city-nocturne.webp",
  "peoples-opener.webp",
  "voidmark.webp",
  "hands-off.webp",
  "metermen.webp",
  "skinjobs.webp",
  "nightshift.webp",
  "ninth-ward-kings.webp",
  "rust-saints.webp",
  "glass-vipers.webp",
  "hollow-men.webp",
  "undertow.webp",
  "00_flats_overview_L.webp",
];
const loreBlob = lorePages.map(p => textOf(p.page)).join("\n");
for (const file of expectedArt) {
  note(loreBlob.includes(file), `lore journal embeds ${file}`);
}

const module = JSON.parse(readFileSync("module.json", "utf8"));
note(module.version >= "0.3.24", `module.json is ≥ 0.3.24 (got ${module.version})`);
note(module.packs.some(p => p.name === "lore"), "module.json registers lore pack");
note(module.packFolders?.[0]?.name === "Ghostwire", "packFolders still nest under Ghostwire");
note(module.packFolders?.[0]?.packs.includes("lore"), "lore pack is inside Ghostwire folder");
note(module.packFolders?.[0]?.packs.includes("rulebook"), "rulebook pack stays inside Ghostwire folder");

console.log(ok.map(m => `OK  ${m}`).join("\n"));
if (fail.length) {
  console.error(fail.map(m => `FAIL  ${m}`).join("\n"));
  process.exit(1);
}
console.log(`journal-regen-smoke: ${ok.length} checks`);
