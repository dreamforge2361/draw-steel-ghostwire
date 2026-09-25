// Twelve Conglomerates brand journals (ticker cards). Domain text is MEGACORP-TICKERS.md only —
// do not invent deep lore. Brand rasters live at assets/brands/megacorps/brand-{ticker}.{png,webp}.
// Brand rasters: assets/brands/megacorps/brand-{ticker}.{png,webp}. Host skins: node-host-{ticker}.
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { markdownToHtml } from "./md-to-html.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const FOLDER_ID = "gwLorePackMega00";
const B62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const stableId = seed => [...createHash("sha256").update("gw-lore:" + seed).digest()].slice(0, 16).map(b => B62[b % 62]).join("");

export const MEGACORPS = [
  { ticker: "HAL", name: "HALO Ascendant", domain: "Orbital, energy, and life-support", langKey: "HaloAscendant" , arms: "**Seraph Armaments** — white-polymer “humane” peacekeeper weapons (sister firm to Aureole Security). It markets mercy and quietly sells lethality. Signature: Seraph Mercy, Seraph Halcyon, Seraph Stilling."},
  { ticker: "FER", name: "Ferrum Dynastic", domain: "Heavy industry, construction, hive superstructure", langKey: "FerrumDynastic" , arms: "**Ferrum Forgeworks** and **Deepworks Excavation** — old-money foundries whose demolition tools became weapons; Ferrum denies it has an arms division at all. Signature: Ferrum Rivet, Ferrum Mason .60, Ferrum Keystone, Deepworks Roughneck."},
  { ticker: "MER", name: "Meridian Signal", domain: "Wired, telecom, media, information", langKey: "MeridianSignal" , arms: "**Meridian Blacklight** (via Blacklight Systems) — networked smart guns that upload every shot. Signature: Meridian Vector, the SmartSystem mod, the Nullfield and Airburst grenades."},
  { ticker: "CAD", name: "Caduceus Vitalis", domain: "Biotech, pharma, chrome-flesh interface, medicine", langKey: "CaduceusVitalis" , arms: "**Lancet Biodefense** and **Grafthouse** — darts, gas and fire sold as quarantine tools, and cyber-weapons grafted into people. Signature: Lancet Hushdart, Lancet Cauterizer, Grafthouse Talon."},
  { ticker: "IRN", name: "Ironclad Martial", domain: "Arms, security, private military, mercenary trade", langKey: "IroncladMartial" , arms: "**Iron Writ Arms (IW)** — plain military workhorses sold to anyone with a contract. IW hates that Nyx copies its designs. Signature: IW Journeyman, IW Bastion, IW Barrage-12, IW Absolution."},
  { ticker: "ARG", name: "Argent Exchange", domain: "Finance, currency, scrip-and-nuyen, credit", langKey: "ArgentExchange" , arms: "**Argent Mint Arms** — luxury pieces stamped with the Exchange mint mark. Debt collectors carry them and every serial number is a bond. Signature: Argent Sovereign .50, Argent Mint Persuader."},
  { ticker: "VER", name: "Verdant Provision", domain: "Agriculture, food, water, wasteland reclamation", langKey: "VerdantProvision" , arms: "**Greenline Outfitters** — frontier bows, rifles and blades for the rangers who cull Incursion beasts. Signature: Greenline Longwatch, Greenline Thornback, Greenline Bushmaster."},
  { ticker: "OBS", name: "Obsidian Holdings", domain: "Luxury, entertainment, vice, simsense/experience", langKey: "ObsidianHoldings" , arms: "**Velvet Arms** — elegant concealables, presented as gifts in the Velvet Room. Signature: Velvet Cufflink, Velvet Nocturne, Velvet Murmur."},
  { ticker: "SAN", name: "Sanctum Assurance", domain: "Insurance, data, surveillance, private law", langKey: "SanctumAssurance" , arms: "**Grey Ledger** — “compliance gear”: nets, restraints, and a suppressed rifle that erases a line item. Signature: Grey Ledger Redaction, Grey Ledger Lien, Grey Ledger Snarecast."},
  { ticker: "NYX", name: "Nyx Cartel", domain: "Legitimized underworld — tenth seat", langKey: "NyxCartel" , arms: "**Nyx Undermarket** — cheap, rugged Sinks guns, many of them unlicensed copies. Signature: Nyx Wasp-9, Nyx Rattletrap (an unlicensed IW copy), Nyx Doorknocker, Nyx Grinder."},
  { ticker: "AEQ", name: "Aequitas Mandate", domain: "Council justice, investigation, and security — sells only to the Council", langKey: "AequitasMandate" , arms: "**Seal Warden Armory** — warrant-service shotguns and batons named after courtroom words, without irony. Signature: Seal Warden Gavel, Seal Warden Verdict, Seal Warden Prod."},
  { ticker: "LAZ", name: "Lazarus Extract", domain: "Trauma rescue, hot extraction, body recovery", langKey: "LazarusExtract" , arms: "**White Door Tactical** — extraction kit: compact carbines, smoke, everything sized to ride beside a med-bag. Signature: White Door Lifeline, the Screening Canister."},
];

/**
 * 0.3.134 (C) — the arms subsidiaries. Every one of the Twelve that builds weapons now says so on
 * its own ticker card, and every card points at the Arms Makers of the Reach journal (L9), which is
 * where the rivalries and the full signature lists live. Kestrel Aerodyne has no card here on
 * purpose: Kestrel Dynamics is the seatless thirteenth (L1), not one of the Twelve.
 */
const ARMS_MAKERS_ENTRY = stableId("L9-arms-makers");

export const MEGACORP_FOLDER = {
  key: "Megacorps",
  id: FOLDER_ID,
  dir: "megacorps",
  label: "Twelve Conglomerates",
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
  const art = corp.artPending
    ? [
      `*${alt} — brand plate pending.* Expected files: \`assets/brands/megacorps/brand-${corp.ticker.toLowerCase()}.{png,webp}\` (PNG 1254² + 1024² WebP). Wired Host skin: \`assets/tokens/wired/node-host-${corp.ticker.toLowerCase()}.{png,webp}\`. Michael drops plates; do not invent art in-repo.`,
    ]
    : [
      `![${alt}](${src})`,
      "",
      `*${alt} — brand mark*`,
    ];
  const armsBlock = corp.arms
    ? [
      "",
      `**Arms division:** ${corp.arms}`,
      "",
      `Full house profile, rivalries and street names: @UUID[Compendium.${MODULE_ID}.lore.JournalEntry.${ARMS_MAKERS_ENTRY}]{Arms Makers of the Reach}.`,
    ]
    : [];
  return [
    ...art,
    "",
    `**${corp.ticker}** — ${corp.name}`,
    "",
    `**Domain:** ${corp.domain}`,
    ...armsBlock,
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
