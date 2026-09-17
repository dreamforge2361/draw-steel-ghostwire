// Builds the Pregen Fiction journal pack (src/packs/pregen-fiction/) from the eight origin
// stories in docs/masters/pregens/stories/*.md (B44). One JournalEntry, one page per story,
// plus an index page. Markdown (format 2) + HTML rendered by Foundry's own showdown, as in
// raw-to-journals.mjs. Run:  node tools/pregen-stories-to-journals.mjs   then   node tools/build-packs.mjs
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const FOUNDRY_APP = process.env.FOUNDRY_APP ?? "C:/Program Files/Foundry Virtual Tabletop/resources/app";
const showdown = createRequire(join(FOUNDRY_APP, "package.json"))("showdown");
const converter = new showdown.Converter({ disableForced4SpacesIndentedSublists: true, noHeaderId: true, parseImgDimensions: true, strikethrough: true, tables: true, tablesHeaderId: true });

const MODULE_ID = "draw-steel-ghostwire";
const STORIES = "docs/masters/pregens/stories";
const OUT = "src/packs/pregen-fiction";
const B62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const stableId = seed => [...createHash("sha256").update("gw-pregen-fiction:" + seed).digest()].slice(0, 16).map(b => B62[b % 62]).join("");

// Story file stem → the pregen whose portrait heads the page.
const PORTRAITS = {
  "01": "vessa-corran-dov", "02": "kaes-vahn-estal", "03": "krv-9-krow", "04": "barak-voss-hallor",
  "05": "wren-sable-corvin", "06": "sabbat-vane", "07": "vira-kellis-nade", "08": "kessic-draye",
};

if (!existsSync(STORIES)) throw new Error(`${STORIES} not found — run the story extraction first`);
const files = readdirSync(STORIES).filter(f => f.endsWith(".md")).sort();
if (files.length !== 8) throw new Error(`expected 8 stories, found ${files.length}`);

const pages = files.map(file => {
  const md = readFileSync(join(STORIES, file), "utf8").replace(/\r\n/g, "\n");
  const title = (/^#\s+(.+)$/m.exec(md)?.[1] ?? file.replace(/\.md$/, "")).trim();
  const body = md.replace(/^#\s+.+\n+/, "");
  const slug = PORTRAITS[file.slice(0, 2)];
  const art = slug && existsSync(`assets/pregens/${slug}.png`)
    ? `![${title}](modules/${MODULE_ID}/assets/pregens/${slug}.png)\n\n`
    : "";
  return { name: title, markdown: `${art}${body}`.trim() };
});

const index = {
  name: "The Eight",
  markdown: [
    "Eight origin stories, one per Ghostwire pregen. The heroes themselves are in the **Ghostwire Pregens** actor compendium, built at Level 1 — these pages are where they came from.",
    "",
    "| Story | Hero | Class · People |",
    "|---|---|---|",
    "| The Lamp on Ninth | Vessa Corran-Dov, “the Preacher of Ninth” | Street Priest (Shepherd) · Corran |",
    "| Rain on the Glass Tier | Kaïs Vahn-Estal, “the Static Saint” | Elementalist (Stormcaller) · Elvani |",
    "| Serial Number | KRV-9 “Krow” | Operator (Street-vet, Warframe) · Cyborg |",
    "| The Weight of the Word | Barak Voss-Hallor, “the Foreman” | Commander (Street-Fixer) · Goliar |",
    "| The Long Sight | Wren Sable-Corvin, “the Kite” | Scout (Hunter) · Changer, Raven lineage |",
    "| The Dead Frequency | Sabbat Vane | Technomancer (Sprite-Weaver) · Revenant |",
    "| Nine Ways Out | Vira Kellis-Nade, “the Warren-Wire” | Wrench (Drone Jockey) · Changer, Rat lineage |",
    "| Turn Their Own Guns Around | Kessic Draye, “Null” | Hacker (Disruptor) · Mutant |",
  ].join("\n"),
};

mkdirSync(OUT, { recursive: true });
for (const entry of readdirSync(OUT)) rmSync(join(OUT, entry), { recursive: true, force: true });

const entryId = stableId("pregen-fiction");
const all = [index, ...pages];
const entry = {
  _id: entryId, _key: `!journal!${entryId}`,
  name: "GHOSTWIRE.Pregens.Journals.Fiction",
  folder: null, sort: 100000, categories: [],
  pages: all.map((p, i) => {
    const _id = stableId(`page:${i}:${p.name}`);
    return {
      _id, _key: `!journal.pages!${entryId}.${_id}`,
      name: p.name, type: "text", sort: (i + 1) * 100000,
      title: { show: true, level: 1 }, image: {}, video: { controls: true, volume: 0.5 }, src: null, system: {},
      text: { format: 2, markdown: p.markdown, content: converter.makeHtml(p.markdown) },
      category: null, ownership: { default: -1 }, flags: {},
    };
  }),
  ownership: { default: 0 },
  flags: { [MODULE_ID]: { source: STORIES } },
};
writeFileSync(join(OUT, "pregen-fiction.json"), JSON.stringify(entry, null, 2) + "\n");

const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
lang.GHOSTWIRE.COMPENDIUM.pregenFiction = "Ghostwire Pregen Fiction";
lang.GHOSTWIRE.Pregens = { ...(lang.GHOSTWIRE.Pregens ?? {}), Journals: { Fiction: "Dossiers & Fiction — The Eight" } };
writeFileSync("lang/en.json", JSON.stringify(lang, null, 2) + "\n");
console.log(`pregen-fiction: 1 journal, ${all.length} pages`);
console.log(all.map((p, i) => `  ${i + 1}. ${p.name}`).join("\n"));
