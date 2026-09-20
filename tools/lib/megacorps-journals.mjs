// Ten Conglomerates brand journals (ticker cards). Domain text is MEGACORP-TICKERS.md only —
// do not invent deep lore. Brand rasters live at assets/brands/megacorps/brand-{ticker}.{png,webp}.
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { markdownToHtml } from "./md-to-html.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const FOLDER_ID = "gwLorePackMega00";
const B62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const stableId = seed => [...createHash("sha256").update("gw-lore:" + seed).digest()].slice(0, 16).map(b => B62[b % 62]).join("");

export const MEGACORPS = [
  { ticker: "HAL", name: "HALO Ascendant", domain: "Orbital, energy, and life-support", langKey: "HaloAscendant" },
  { ticker: "FER", name: "Ferrum Dynastic", domain: "Heavy industry, construction, hive superstructure", langKey: "FerrumDynastic" },
  { ticker: "MER", name: "Meridian Signal", domain: "Wired, telecom, media, information", langKey: "MeridianSignal" },
  { ticker: "CAD", name: "Caduceus Vitalis", domain: "Biotech, pharma, chrome-flesh interface, medicine", langKey: "CaduceusVitalis" },
  { ticker: "IRN", name: "Ironclad Martial", domain: "Arms, security, private military, mercenary trade", langKey: "IroncladMartial" },
  { ticker: "ARG", name: "Argent Exchange", domain: "Finance, currency, scrip-and-nuyen, credit", langKey: "ArgentExchange" },
  { ticker: "VER", name: "Verdant Provision", domain: "Agriculture, food, water, wasteland reclamation", langKey: "VerdantProvision" },
  { ticker: "OBS", name: "Obsidian Holdings", domain: "Luxury, entertainment, vice, simsense/experience", langKey: "ObsidianHoldings" },
  { ticker: "SAN", name: "Sanctum Assurance", domain: "Insurance, data, surveillance, private law", langKey: "SanctumAssurance" },
  { ticker: "NYX", name: "Nyx Cartel", domain: "Legitimized underworld — tenth seat", langKey: "NyxCartel" },
];

export const MEGACORP_FOLDER = {
  key: "Megacorps",
  id: FOLDER_ID,
  dir: "megacorps",
  label: "Ten Conglomerates",
};

export function megacorpEntryId(ticker) {
  return stableId(`megacorp-${ticker}`);
}

export function megacorpBrandSrc(ticker) {
  return `modules/${MODULE_ID}/assets/brands/megacorps/brand-${ticker.toLowerCase()}.webp`;
}

export function megacorpIndexLinks() {
  return MEGACORPS.map(c => `@UUID[Compendium.${MODULE_ID}.lore.JournalEntry.${megacorpEntryId(c.ticker)}]{${c.name} (${c.ticker})}`).join(" · ");
}

function overviewMarkdown(corp) {
  const src = megacorpBrandSrc(corp.ticker);
  const alt = `${corp.name} (${corp.ticker})`;
  return [
    `![${alt}](${src})`,
    "",
    `*${alt} — brand mark*`,
    "",
    `**${corp.ticker}** — ${corp.name}`,
    "",
    `**Domain:** ${corp.domain}`,
    "",
    "Ticker locked (`docs/rulebook/MEGACORP-TICKERS.md`). Brand mark is raster concept art at `assets/brands/megacorps/`, not a vector master.",
  ].join("\n");
}

export function writeMegacorpJournals(outRoot = "src/packs/lore") {
  const dir = join(outRoot, MEGACORP_FOLDER.dir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "_folder.json"), JSON.stringify({
    _id: FOLDER_ID,
    _key: `!folders!${FOLDER_ID}`,
    name: `GHOSTWIRE.Lore.Folders.${MEGACORP_FOLDER.key}`,
    type: "JournalEntry",
    folder: null,
    sort: 350000,
    flags: {},
    color: null,
    description: "",
    sorting: "m",
  }, null, 2) + "\n");

  const lang = { Folders: { [MEGACORP_FOLDER.key]: MEGACORP_FOLDER.label }, Journals: {} };
  MEGACORPS.forEach((corp, i) => {
    const entryId = megacorpEntryId(corp.ticker);
    if (!/^[A-Za-z0-9]{16}$/.test(entryId)) throw new Error(`Bad megacorp journal id ${entryId}`);
    const pageId = stableId(`megacorp-${corp.ticker}#0#Overview`);
    if (!/^[A-Za-z0-9]{16}$/.test(pageId)) throw new Error(`Bad megacorp page id ${pageId}`);
    const markdown = overviewMarkdown(corp);
    const img = megacorpBrandSrc(corp.ticker);
    const slug = corp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const entry = {
      _id: entryId,
      _key: `!journal!${entryId}`,
      name: `GHOSTWIRE.Lore.Journals.${corp.langKey}`,
      img,
      folder: FOLDER_ID,
      sort: (i + 1) * 100000,
      categories: [],
      pages: [
        {
          _id: pageId,
          _key: `!journal.pages!${entryId}.${pageId}`,
          name: "Overview",
          type: "text",
          sort: 100000,
          title: { show: true, level: 1 },
          image: {},
          video: { controls: true, volume: 0.5 },
          src: null,
          system: {},
          text: { format: 2, markdown, content: markdownToHtml(markdown) },
          category: null,
          ownership: { default: -1 },
          flags: {},
        },
      ],
      ownership: { default: 0 },
      flags: {
        [MODULE_ID]: {
          source: "docs/rulebook/MEGACORP-TICKERS.md",
          ticker: corp.ticker,
          brand: `assets/brands/megacorps/brand-${corp.ticker.toLowerCase()}.webp`,
        },
      },
    };
    writeFileSync(join(dir, `${corp.ticker.toLowerCase()}-${slug}.json`), JSON.stringify(entry, null, 2) + "\n");
    lang.Journals[corp.langKey] = `${corp.name} (${corp.ticker})`;
  });
  return lang;
}
