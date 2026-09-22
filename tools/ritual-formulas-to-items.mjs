// Generates the Ritual Formula Items (src/packs/gear/general/ritual-formulas/) from the Ritual Workings
// cards in docs/raw/22-the-veil.md (0.3.88). docs/raw stays the single source of truth: every "### " card
// under a "## Ritual Workings — <leader>" section becomes one treasure Item whose description IS the card.
// Names and descriptions are lang keys under GHOSTWIRE.Gear.Items.Ritual*, written to lang/en.json.
// Formula Items are rare esoterica — found, never vendor stock (the folder is on no kiosk preset).
// Run:  node tools/ritual-formulas-to-items.mjs   then   node tools/build-packs.mjs gear   (Foundry closed)
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { foundryRequire } from "./lib/foundry-require.mjs";

const showdown = foundryRequire("showdown");
const converter = new showdown.Converter({ disableForced4SpacesIndentedSublists: true, noHeaderId: true, strikethrough: true, tables: true, tablesHeaderId: true });

const MODULE_ID = "draw-steel-ghostwire";
const RAW = "docs/raw/22-the-veil.md";
const OUT = "src/packs/gear/general/ritual-formulas";
const FOLDER_ID = "gwGearRitualForm";
const GENERAL_FOLDER_ID = "JQFKRPm2gZ2IZST5";
const B62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
// Same id scheme as tools/raw-to-journals.mjs, so the card can link to The Veil journal.
const rulebookId = seed => [...createHash("sha256").update("gw-rulebook:" + seed).digest()].slice(0, 16).map(b => B62[b % 62]).join("");
const VEIL_UUID = `Compendium.${MODULE_ID}.rulebook.JournalEntry.${rulebookId("22-the-veil")}`;

const ICONS = {
  datachip: "icons/commodities/tech/electronics-chip-data.webp",
  scroll: "icons/sundries/scrolls/scroll-bound-red-tan.webp",
  tome: "icons/sundries/books/book-embossed-clasp-gold-brown.webp",
};
// Earliest leader echelon by Magnitude (Magnitude table, 22).
const ECHELON = { 1: 1, 2: 1, 3: 2, 4: 3, 5: 4 };

const pascal = title => title.replace(/\(.*?\)/g, " ").replace(/['’]/g, "").split(/[^A-Za-z0-9]+/).filter(Boolean)
  .map(w => w[0].toUpperCase() + w.slice(1)).join("");
/** gwRit + title words (minus the/of/and), cut or zero-padded to 16 characters: Ward the Room → gwRitWardRoom000. */
const itemId = title => ("gwRit" + pascal(title.split(/\s+/).filter(w => !/^(the|of|and)$/i.test(w)).join(" ")).slice(0, 11)).padEnd(16, "0");

const md = readFileSync(RAW, "utf8").replace(/\r\n/g, "\n");
const sections = md.split(/^(?=## )/m).filter(s => s.startsWith("## Ritual Workings — ") && !s.startsWith("## Ritual Workings — Card Index"));
if (sections.length !== 4) throw new Error(`expected 4 Ritual Workings card sections in ${RAW}, found ${sections.length}`);

const cards = [];
for (const section of sections) {
  const leaderGroup = /^## Ritual Workings — (.+)$/m.exec(section)[1].trim();
  for (const chunk of section.split(/^(?=### )/m).slice(1)) {
    const lines = chunk.replace(/\n-{3,}\s*$/, "").trim().split("\n");
    const title = lines[0].replace(/^### /, "").replace(/\s*\*\(optional\)\*\s*$/, "").trim();
    const header = lines[1];
    const hm = /^\*\*(.+?)\*\* · \*\*Magnitude ([^*]+)\*\* · \*\*(.+?)\*\*/.exec(header);
    if (!hm) throw new Error(`${title}: card header not recognised: ${header}`);
    const [, family, magnitudeText, leaders] = hm;
    const mags = (magnitudeText.match(/\d/g) ?? []).map(Number);
    const minMag = Math.min(...mags);
    const maxMag = Math.max(...mags);
    const formLine = lines.find(l => l.startsWith("**Formula Item form:**")) ?? "";
    const form = formLine.replace("**Formula Item form:**", "").trim();
    const first = /datachip|job-stick|chip/i.exec(form)?.index ?? Infinity;
    const scroll = /scroll|chapbook|booklet|notebook|recipe/i.exec(form)?.index ?? Infinity;
    const tome = /tome|grimoire|volume|book|prospectus/i.exec(form)?.index ?? Infinity;
    const icon = first < scroll && first < tome ? "datachip" : (scroll <= tome ? "scroll" : "tome");
    // "| **Components total …** | … | **¥75** |" rows: one ¥ cell per Magnitude or per path.
    const totals = lines.filter(l => l.startsWith("| **Components total"))
      .flatMap(l => [...l.matchAll(/\*\*(¥[\d,]+)\*\*/g)].map(m => m[1]));
    if (!totals.length) throw new Error(`${title}: no Components total row`);
    const body = lines.slice(1).join("\n").trim();
    cards.push({ title, family, magnitudeText: magnitudeText.trim(), minMag, maxMag, leaders, leaderGroup, form, icon, totals, body });
  }
}

const ids = new Map();
for (const c of cards) {
  c.id = itemId(c.title);
  if (!/^[A-Za-z0-9]{16}$/.test(c.id)) throw new Error(`${c.title}: bad id ${c.id}`);
  if (ids.has(c.id)) throw new Error(`id collision ${c.id}: ${ids.get(c.id)} / ${c.title}`);
  ids.set(c.id, c.title);
  c.key = "Ritual" + pascal(c.title);
}

mkdirSync(OUT, { recursive: true });
for (const entry of readdirSync(OUT)) rmSync(join(OUT, entry), { recursive: true, force: true });
writeFileSync(join(OUT, "_folder.json"), JSON.stringify({
  _id: FOLDER_ID, _key: `!folders!${FOLDER_ID}`, name: "GHOSTWIRE.Gear.Folders.GeneralRitualFormulas",
  type: "Item", folder: GENERAL_FOLDER_ID, description: "", color: null, sorting: "m", sort: 10000, flags: {},
}, null, 2) + "\n");

const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const items = lang.GHOSTWIRE.Gear.Items;
for (const k of Object.keys(items)) if (/^Ritual[A-Z]/.test(k) && !cards.some(c => c.key === k)) delete items[k];
lang.GHOSTWIRE.Gear.Folders.GeneralRitualFormulas = "Ritual Formulas";

cards.forEach((c, i) => {
  const totalText = c.totals.length ? `Components ${[...new Set(c.totals)].join(" / ")}` : "";
  const intro = `<p><em>Ritual Formula · ${c.family} · Magnitude ${c.magnitudeText} · ${c.leaders}</em></p>`
    + `<p><strong>Rare esoterica — found, never sold.</strong> Owning this Item does not let you cast: study it until the Director marks it <strong>learned</strong>, then have it present at sealing. Rituals never spend <strong>Essence</strong>, <strong>Conviction</strong>, or <strong>Resonance</strong>.</p>`;
  const outro = `<p><em>Shared ritual rules (study, components, sanctum, sealing, detection, countermagic): @UUID[${VEIL_UUID}]{The Veil — Ritual Workings}.</em></p>`;
  items[c.key] = { Name: `Formula: ${c.title}`, Description: intro + converter.makeHtml(c.body) + outro };
  const doc = {
    _id: c.id, _key: `!items!${c.id}`,
    name: `GHOSTWIRE.Gear.Items.${c.key}.Name`,
    type: "treasure",
    img: ICONS[c.icon],
    system: {
      description: { value: `GHOSTWIRE.Gear.Items.${c.key}.Description`, director: "" },
      source: { book: "Ghostwire Core — The Veil", page: `Ritual Workings — ${c.leaderGroup}`, license: "Draw Steel Creator License" },
      _dsid: `ritual-${c.title.toLowerCase().replace(/\(.*?\)/g, "").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      kind: "other", category: "trinket", echelon: ECHELON[c.minMag], keywords: [], quantity: 1,
      project: { prerequisites: "", source: "", rollCharacteristic: [], yield: { amount: "1", display: "" }, goal: null },
    },
    effects: [], folder: FOLDER_ID, sort: (i + 1) * 1000, ownership: { default: 0 },
    flags: {
      [MODULE_ID]: {
        gear: {
          echelon: ECHELON[c.minMag], availability: "restricted", price: null, modSlots: 0,
          tags: ["RitualFormula"],
          priceText: `Not sold — found${totalText ? ` (${totalText})` : ""}`,
        },
        ritual: {
          formula: true, family: c.family, magnitude: c.minMag, magnitudeMax: c.maxMag, magnitudeText: c.magnitudeText,
          leaders: c.leaders, form: c.form, componentsTotal: c.totals, learned: false,
        },
      },
    },
  };
  writeFileSync(join(OUT, `${doc.system._dsid.replace(/^ritual-/, "")}.json`), JSON.stringify(doc, null, 2) + "\n");
});

writeFileSync("lang/en.json", JSON.stringify(lang, null, 2) + "\n");
console.log(`ritual formulas: ${cards.length} Items → ${OUT}`);
for (const c of cards) console.log(`  ${c.id}  ${c.title} (${c.family}, Magnitude ${c.magnitudeText}, ${c.leaders}, ${c.icon}) ${c.totals.join(" / ")}`);
