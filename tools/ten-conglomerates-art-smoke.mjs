#!/usr/bin/env node
/**
 * Twelve Conglomerates art smoke.
 * Host skins, brand journals, Nox trash freighter. Does not generate art.
 * AEQ / LAZ plates ship with the Twelve.
 *
 * Run: node tools/ten-conglomerates-art-smoke.mjs
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { NODE_TOKEN_LIBRARY, tokenSrcForStyle } from "../scripts/wired-node-art.mjs";
import { MEGACORPS, megacorpBrandSrc, megacorpEntryId } from "./lib/megacorps-journals.mjs";

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

function readBomFreeJson(path) {
  const buf = readFileSync(path);
  ok(buf[0] !== 0xEF && buf[1] !== 0xBB && buf[2] !== 0xBF, `${path} is BOM-free`);
  return JSON.parse(buf.toString("utf8"));
}

console.log("Twelve Conglomerates art smoke\n");

const moduleJson = readBomFreeJson("module.json");
ok(/^\d+\.\d+\.\d+$/.test(moduleJson.version), `module.json has a patch version (got ${moduleJson.version})`);

const tickers = MEGACORPS.map(c => c.ticker);
ok(tickers.join(",") === "HAL,FER,MER,CAD,IRN,ARG,VER,OBS,SAN,NYX,AEQ,LAZ", "ticker order matches MEGACORP-TICKERS");

const library = readBomFreeJson("assets/tokens/wired/library.json");
const hosts = library.styles.filter(s => s.hostTicker);
ok(hosts.length === 12, "library.json has 12 megacorp Host styles");
ok(library.styles.find(s => s.id === "node-host")?.name === "Host", "generic Host remains default");
ok(library.styles.filter(s => s.autoKind).map(s => s.id).join(",") === "light-control,maglock,cam-controls", "autoKinds unchanged");

for (const corp of MEGACORPS) {
  const id = `node-host-${corp.ticker.toLowerCase()}`;
  const row = library.styles.find(s => s.id === id);
  const mjs = NODE_TOKEN_LIBRARY.find(s => s.id === id);
  ok(row && mjs && row.hostTicker === corp.ticker && mjs.hostTicker === corp.ticker, `${id} catalog row + mjs`);
  if (corp.artPending) {
    ok(row.placeholder === true && mjs.placeholder === true, `${id} is placeholder until Michael drops plates`);
    ok(tokenSrcForStyle(id) == null, `${id} does not resolve while placeholder`);
    continue;
  }
  ok(tokenSrcForStyle(id)?.endsWith(`/${id}.webp`), `${id} resolves`);
  const png = `assets/tokens/wired/${id}.png`;
  const webp = `assets/tokens/wired/${id}.webp`;
  ok(existsSync(png) && existsSync(webp), `${id} png+webp on disk`);
  const pngBuf = readFileSync(png);
  const webpBuf = readFileSync(webp);
  ok(pngBuf.readUInt32BE(16) === 1254 && pngBuf.readUInt32BE(20) === 1254, `${id}.png is 1254²`);
  ok(webpBuf.slice(0, 4).toString() === "RIFF" && webpBuf.slice(8, 12).toString() === "WEBP", `${id}.webp is WebP`);
}

ok(tokenSrcForStyle("node-host")?.endsWith("/node-host.webp"), "generic node-host still resolves");

const lang = readBomFreeJson("lang/en.json");
ok(lang.GHOSTWIRE.Lore.Folders.Megacorps === "Twelve Conglomerates", "lang megacorps folder");
ok(lang.GHOSTWIRE.Vehicles.Items.NoxTrashFreighter?.Name.includes("Trash Freighter"), "lang Nox freighter name");

const megaFiles = readdirSync("src/packs/lore/megacorps").filter(f => f.endsWith(".json") && f !== "_folder.json");
ok(megaFiles.length === 12, `twelve megacorp journals (got ${megaFiles.length})`);
const folder = readBomFreeJson("src/packs/lore/megacorps/_folder.json");
ok(folder._id === "gwLorePackMega00", "megacorps folder id");

for (const corp of MEGACORPS) {
  const brandPng = `assets/brands/megacorps/brand-${corp.ticker.toLowerCase()}.png`;
  const brandWebp = `assets/brands/megacorps/brand-${corp.ticker.toLowerCase()}.webp`;
  if (corp.artPending) {
    ok(!existsSync(brandPng) && !existsSync(brandWebp), `brand-${corp.ticker.toLowerCase()} plates not invented`);
  } else {
    ok(existsSync(brandPng) && existsSync(brandWebp), `brand-${corp.ticker.toLowerCase()} png+webp`);
  }
  ok(!existsSync(`assets/brands/megacorps/brand-${corp.ticker.toLowerCase()}-${corp.name.toLowerCase().replace(/ /g, "-")}.webp`), `no long-slug brand copy committed for ${corp.ticker}`);
  ok(lang.GHOSTWIRE.Lore.Journals[corp.langKey] === `${corp.name} (${corp.ticker})`, `lang ${corp.langKey}`);
}

const index = readBomFreeJson("src/packs/lore/setting/lore-index.json");
const indexText = `${index.pages[0].text.markdown}\n${index.pages[0].text.content}`;
ok(/Twelve Conglomerates/.test(indexText), "lore index lists Twelve Conglomerates");
for (const corp of MEGACORPS) {
  ok(indexText.includes(megacorpEntryId(corp.ticker)), `lore index UUID ${corp.ticker}`);
}

for (const corp of MEGACORPS) {
  const slug = corp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const path = `src/packs/lore/megacorps/${corp.ticker.toLowerCase()}-${slug}.json`;
  const doc = readBomFreeJson(path);
  ok(doc._id === megacorpEntryId(corp.ticker), `${corp.ticker} journal id`);
  ok(doc.img === megacorpBrandSrc(corp.ticker), `${corp.ticker} cover img is expected brand webp path`);
  ok(doc.folder === "gwLorePackMega00", `${corp.ticker} in megacorps folder`);
  const blob = `${doc.pages[0].text.markdown}\n${doc.pages[0].text.content}`;
  ok(blob.includes(corp.domain) && blob.includes(`**${corp.ticker}**`), `${corp.ticker} domain-only prose`);
  ok(!/First Chair|solar arrays|Blacklight/i.test(blob), `${corp.ticker} does not invent deep lore`);
  if (corp.artPending) ok(/brand plate pending/i.test(blob), `${corp.ticker} notes pending plate`);
}

const freighter = readBomFreeJson("src/packs/vehicles/air/nox-trash-freighter.json");
ok(freighter.flags["draw-steel-ghostwire"].vehicle.scale === "Heavy", "freighter is Heavy air scale");
ok(freighter.flags["draw-steel-ghostwire"].vehicle.drone === false, "freighter drone:false");
ok(existsSync("assets/tokens/vehicles/nox-trash-freighter.webp"), "freighter webp");

const tickersDoc = readFileSync("docs/rulebook/MEGACORP-TICKERS.md", "utf8");
ok(/assets\/brands\/megacorps/.test(tickersDoc) && /raster concept/.test(tickersDoc), "MEGACORP-TICKERS notes brand art SoR");
ok(/AEQ/.test(tickersDoc) && /LAZ/.test(tickersDoc) && /Twelve/.test(tickersDoc), "MEGACORP-TICKERS locks AEQ + LAZ + Twelve");

const sor = readFileSync("docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md", "utf8");
ok(/Nox trash freighter \*\*Item\*\*/.test(sor) && /0\.3\.54/.test(sor), "SoR marks freighter Item shipped");
ok(/Nox trash freighter \*\*Actor\*\*/.test(sor) && /Deadhead Actors/.test(sor), "SoR marks freighter Actor shipped");
ok(existsSync("src/packs/deadhead/nox-trash-freighter.json"), "freighter Actor JSON on disk");
ok(lang.GHOSTWIRE.COMPENDIUM.deadhead === "Ghostwire Runs — Deadhead Actors", "lang Deadhead Actor pack");
ok(/Handout: Gold Line aerial recon photo/.test(sor), "SoR marks aerial recon handout shipped");
ok(existsSync("assets/items/deadhead/gold-line-aerial-recon.webp"), "aerial recon webp on disk");
ok(lang.GHOSTWIRE.Runs.Journals.GoldLineAerialRecon === "Gold Line — Aerial Recon", "lang aerial recon journal");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("\nTwelve Conglomerates art smoke OK");
