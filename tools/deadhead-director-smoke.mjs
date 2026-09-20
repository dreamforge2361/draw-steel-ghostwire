#!/usr/bin/env node
/**
 * Deadhead Director journal smoke (B104 content pass).
 *
 * Run: node tools/deadhead-director-smoke.mjs
 * Does not write Scene JSON or touch Gold Line inject.
 */
import { existsSync, readFileSync } from "node:fs";

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

const JOURNAL = "src/packs/runs/deadhead/deadhead-director.json";
const MAP = "src/packs/runs/deadhead/gold-line-map.json";
const MODULE = "module.json";
const SOR = "docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md";
const REMAP = "docs/directors/runs/deadhead/GOLD-LINE-CARGO-REMAP.md";
const LANG = "lang/en.json";

const PAGE_KEYS = [
  "Overview",
  "TraceAlert",
  "CastKit",
  "Beat0",
  "Beat1",
  "Beat2",
  "Beat3",
  "Beat4",
  "Beat5",
  "Items",
  "Opposition",
  "FoundryChecklist",
];

console.log("Deadhead Director journal smoke");

const moduleJson = readBomFreeJson(MODULE);
ok(moduleJson.version === "0.3.55", `module.json is 0.3.55 (got ${moduleJson.version})`);
ok(!existsSync("scripts/deadhead-hangout-scene.mjs"), "hangout inject script is gone");
ok(!existsSync("data/scenes/deadhead-hangout.json"), "hangout scene template is gone");
ok(!existsSync("assets/maps/battlemaps/map-deadhead-hangout.webp"), "hangout plate is gone");
ok(!existsSync("tools/deadhead-hangout-smoke.mjs"), "hangout smoke is gone");
const entry = readFileSync("scripts/module.mjs", "utf8");
ok(!/registerDeadheadHangoutScene|deadhead-hangout-scene/.test(entry), "module.mjs has no hangout register/import");

const journal = readBomFreeJson(JOURNAL);
ok(journal._id === "gwDeadheadDirJrn", "director journal id is gwDeadheadDirJrn");
ok(/^[A-Za-z0-9]{16}$/.test(journal._id), "journal _id is 16 alphanumeric");
ok(journal.folder === "gwRunsDeadhead00", "journal sits in Deadhead folder");
ok(journal.sort === 50000, "director journal sorts before map notes");
ok(journal.pages?.length === 12, `journal has 12 pages (got ${journal.pages?.length})`);

const lang = readBomFreeJson(LANG);
ok(lang.GHOSTWIRE.Runs.Journals.DeadheadDirector === "Deadhead — Director", "lang journal name");
ok(!lang.GHOSTWIRE?.Scenes?.DeadheadHangout, "lang has no DeadheadHangout keys");
for (const key of PAGE_KEYS) {
  ok(typeof lang.GHOSTWIRE.Runs.Pages[key] === "string", `lang page ${key}`);
}

const names = journal.pages.map(p => p.name);
for (const key of PAGE_KEYS) {
  ok(names.includes(`GHOSTWIRE.Runs.Pages.${key}`), `page key ${key} present`);
}

for (const page of journal.pages ?? []) {
  ok(/^[A-Za-z0-9]{16}$/.test(page._id), `page ${page.name} _id is 16 alphanumeric`);
  ok(page._key === `!journal.pages!${journal._id}.${page._id}`, `page ${page.name} _key matches`);
  ok(page.text?.format === 2 && page.text.markdown && page.text.content, `page ${page.name} has markdown+html`);
}

const text = journal.pages.map(p => `${p.text.markdown}\n${p.text.content}`).join("\n");
ok(/¥8,000/.test(text) && /¥14,000/.test(text) && /¥2,000/.test(text), "pay table is Mama 8k / corp 14k / Signal 2k");
ok(/wiped and fragged/.test(text) && /still inside its carry capsule/.test(text), "wipe-if-stop-while-nested is written");
ok(/\+1 per round/.test(text) || /\+1 max per round/.test(text), "Trace +1/round cap is written");
ok(/call-home/.test(text) && /Trace −1/.test(text), "ICE call-home Block → Trace −1");
ok(/AFT FREIGHT/.test(text) && /L1/.test(text) && /R1/.test(text) && /R3/.test(text), "cargo consist L1–R3 is written");
ok(/freight crawl/i.test(text) || /Freight crawl/.test(text) || /aft freight/.test(text), "Beat 2 is freight crawl");
ok(/not a passenger train/i.test(text), "cargo lock is stated");
ok(!/\bPASSENGER\b/.test(text) && !/passenger PA/i.test(text) && !/5 cars/.test(text), "no passenger-train consist");
ok(/hide the Roofs/.test(text) || /hide the \*\*Roofs/.test(text), "Director hides roofs when inside");
ok(/Michael’s live|Michael's live|Michael’s world|Michael manual/.test(text), "Gold Line is Michael's manual scene");
ok(!/ensureGoldLineScene/.test(text), "director journal does not tell Michael to force-inject Gold Line");
ok(!/Draw Steel Heroes|MCDM/i.test(text), "Ghostwire-only (no Draw Steel Heroes / MCDM)");
ok(!/\bdecker\b/i.test(text) && !/\bMatrix\b/.test(text) && !/\bShadowrun\b/i.test(text), "Ghostwire-only player wording");
ok(/Mama’s Deadhead Brief|Mama's Deadhead Brief/.test(text), "Mama brief notes");
ok(/live transaction wafer|ghost ledger/.test(text), "capsule / live wafer notes");
ok(/B104 Gear SKUs shipped/.test(text), "Items page notes B104 Gear SKUs shipped");
ok(/gwMamaBriefWafer/.test(text) && /gwArgCourierCap0/.test(text), "Items page UUID-hooks both Gear SKUs");
ok(/gwDhAerialRecon0/.test(text) && /gwGoldLineRecon0/.test(text), "Director journal UUID-hooks aerial recon Journal + Plot Item");
ok(/Handouts \(shipped 0\.3\.54\)/.test(text), "Foundry checklist marks aerial recon handout shipped");
ok(/Gear SKUs \(shipped 0\.3\.52\)/.test(text), "Foundry checklist marks Gear SKUs shipped");
ok(/gwNoxTrashFrgt00/.test(text) && /nox-trash-freighter/.test(text), "Director journal UUID-hooks Nox trash freighter");
ok(/gwNoxTrashActor0/.test(text) && /Deadhead Actors/.test(text), "Director journal UUID-hooks Nox freighter Actor pack");
ok(/Vehicles \(shipped 0\.3\.54\)/.test(text), "Foundry checklist marks Nox freighter shipped");
ok(/ARG Corporate Enforcer/.test(text) && /ARG Response Lieutenant/.test(text) && /Watchdog ICE/.test(text), "opposition cheat sheet");
ok(/Crew hangout/.test(text) && /REMOVED permanently 0\.3\.55/.test(text), "scene checklist marks hangout REMOVED permanently");
ok(/Mama’s Club|Mama's Club/.test(text) && /Canyon/.test(text), "scene checklist still lists Mama / canyon");
ok(/no hangout Scene/i.test(text) && /table procedure/.test(text), "Beat 0 is table procedure without a hangout Scene");
ok(!/Shady Workshop/.test(text), "Director journal does not name Shady Workshop");
ok(!/map-deadhead-hangout/.test(text), "Director journal has no hangout plate path");
ok(!/deadheadHangoutScene/.test(text), "Director journal has no hangout scene flag");
ok(!/registerDeadheadHangoutScene|ensureDeadheadHangoutScene/.test(text), "Director journal has no hangout inject API");
ok(/Gold Line/.test(text) && /sacred|do \*\*not\*\* inject|Do \*\*not\*\* inject/i.test(text), "Gold Line checklist is manual / do not inject");

const sor = readFileSync(SOR, "utf8");
const remap = readFileSync(REMAP, "utf8");
ok(/cargo maglev/i.test(sor) && /AFT FREIGHT/.test(sor), "SoR still cargo-locked");
ok(/NOT a passenger train/i.test(remap) && /AFT FREIGHT/.test(remap), "cargo remap sidecar still locked");

const map = readBomFreeJson(MAP);
const mapText = map.pages.map(p => `${p.text?.markdown ?? ""}\n${p.text?.content ?? ""}`).join("\n");
ok(/AFT FREIGHT/.test(mapText) && /freight Enforcers/.test(mapText), "map-notes beat page is cargo remap");
ok(!/\bPASSENGER\b/.test(mapText) && !/5 cars/.test(mapText), "map-notes beat page has no passenger consist");

const mama = readBomFreeJson("src/packs/bestiary/reach-streets/mama-cassavir.json");
const ghostItemNames = (mama.items ?? []).filter(i => String(i.name).startsWith("GHOSTWIRE."));
ok(ghostItemNames.length === 0, `mama-cassavir has zero item names starting with GHOSTWIRE. (found ${ghostItemNames.map(i => i.name).join(", ") || "none"})`);

const gearFiles = [
  "src/packs/gear/general/plot/_folder.json",
  "src/packs/gear/general/plot/mama-deadhead-brief.json",
  "src/packs/gear/general/plot/arg-courier-capsule.json",
  "src/packs/gear/general/plot/gold-line-aerial-recon.json",
  "assets/items/deadhead/item-mama-brief-wafer.png",
  "assets/items/deadhead/item-mama-brief-wafer.webp",
  "assets/items/deadhead/item-arg-courier-capsule.png",
  "assets/items/deadhead/item-arg-courier-capsule.webp",
  "assets/items/deadhead/gold-line-aerial-recon.png",
  "assets/items/deadhead/gold-line-aerial-recon.webp",
];
for (const file of gearFiles) {
  ok(existsSync(file), `${file} exists`);
}
const brief = readBomFreeJson("src/packs/gear/general/plot/mama-deadhead-brief.json");
const capsule = readBomFreeJson("src/packs/gear/general/plot/arg-courier-capsule.json");
ok(brief._id === "gwMamaBriefWafer" && brief.system?._dsid === "mama-deadhead-brief", "Mama brief SKU id + dsid");
ok(capsule._id === "gwArgCourierCap0" && capsule.system?._dsid === "arg-courier-capsule", "ARG capsule SKU id + dsid");
ok(brief.flags?.["draw-steel-ghostwire"]?.gear && capsule.flags?.["draw-steel-ghostwire"]?.gear, "both SKUs carry flags.draw-steel-ghostwire.gear");
ok(brief.img.endsWith("item-mama-brief-wafer.webp") && capsule.img.endsWith("item-arg-courier-capsule.webp"), "SKU img paths point at deadhead webp");
ok(existsSync("docs/rulebook/ART-NPC-PORTRAIT-NOTES.md"), "ART-NPC-PORTRAIT-NOTES.md installed");

const freighter = readBomFreeJson("src/packs/vehicles/air/nox-trash-freighter.json");
ok(freighter._id === "gwNoxTrashFrgt00" && freighter.system?._dsid === "nox-trash-freighter", "Nox freighter id + dsid");
ok(freighter.flags?.["draw-steel-ghostwire"]?.vehicle?.drone === false, "Nox freighter is a crewed vehicle, not a drone");
ok(freighter.flags?.["draw-steel-ghostwire"]?.vehicle?.tags?.includes("Deadhead") && freighter.flags["draw-steel-ghostwire"].vehicle.tags.includes("Plot"), "Nox freighter has Deadhead + Plot tags");
ok(freighter.img.endsWith("nox-trash-freighter.webp"), "Nox freighter img is the shipped webp");
ok(existsSync("assets/tokens/vehicles/nox-trash-freighter.png") && existsSync("assets/tokens/vehicles/nox-trash-freighter.webp"), "Nox freighter png+webp on disk");

const actor = readBomFreeJson("src/packs/deadhead/nox-trash-freighter.json");
ok(actor._id === "gwNoxTrashActor0" && actor.type === "npc", "Nox freighter Actor id + npc type");
ok(actor.folder === null && actor._key === "!actors!gwNoxTrashActor0", "Nox freighter Actor is pack-root Actor (not a Journal)");
ok(actor.img.endsWith("nox-trash-freighter.webp") && actor.prototypeToken?.texture?.src?.endsWith("nox-trash-freighter.webp"), "Actor img + prototypeToken use freighter webp");
ok(actor.prototypeToken.width === 4 && actor.prototypeToken.height === 6, "Actor token starts at 4×6 squares");
ok(actor.prototypeToken.disposition === 1 && actor.prototypeToken.ring?.enabled === false, "Actor is friendly with no token ring");
ok(actor.prototypeToken.actorLink === true, "Actor token is linked");
ok(actor.flags?.["draw-steel-ghostwire"]?.kind === "vehicle" && actor.flags["draw-steel-ghostwire"].plot === true, "Actor is plot vehicle");
ok(actor.flags?.["draw-steel-ghostwire"]?.tags?.includes("Deadhead") && actor.flags["draw-steel-ghostwire"].tags.includes("Plot"), "Actor has Deadhead + Plot tags");
ok(lang.GHOSTWIRE.Deadhead.Actors.NoxTrashFreighter?.Name === "Nox’s Trash Freighter", "lang Actor name");
ok(/4×6/.test(lang.GHOSTWIRE.Deadhead.Actors.NoxTrashFreighter.Description), "lang Actor notes suggested 4×6 size");
ok(lang.GHOSTWIRE.COMPENDIUM.deadhead === "Ghostwire Runs — Deadhead Actors", "lang Deadhead Actor pack label");
ok(moduleJson.packs.some(p => p.name === "deadhead" && p.type === "Actor"), "module.json registers Ghostwire Deadhead Actor pack");
ok(moduleJson.packFolders?.[0]?.packs?.includes("deadhead"), "packFolders lists deadhead next to runs");
ok(!existsSync("src/packs/runs/deadhead/nox-trash-freighter.json") || readBomFreeJson("src/packs/runs/deadhead/nox-trash-freighter.json").pages, "runs/deadhead does not mix an Actor into the JournalEntry pack");
ok(/Nox trash freighter \*\*Actor\*\*/.test(sor) && /Deadhead Actors/.test(sor), "SoR checklist marks freighter Actor shipped");

const recon = readBomFreeJson("src/packs/runs/deadhead/gold-line-aerial-recon.json");
ok(recon._id === "gwDhAerialRecon0", "aerial recon journal id");
ok(recon.folder === "gwRunsDeadhead00" && recon.sort === 150000, "aerial recon journal sits after map notes");
ok(recon.pages?.length === 2, "aerial recon journal has image + text pages");
const photo = recon.pages.find(p => p.type === "image");
const intel = recon.pages.find(p => p.type === "text");
ok(photo?._id === "gwDhAerialImg000" && photo.src?.endsWith("gold-line-aerial-recon.webp"), "image page points at webp");
ok(intel?._id === "gwDhAerialNote00" && /Discovery intel only/.test(intel.text?.markdown ?? ""), "intel page has discovery copy");
ok(lang.GHOSTWIRE.Runs.Journals.GoldLineAerialRecon === "Gold Line — Aerial Recon", "lang aerial recon journal name");
ok(lang.GHOSTWIRE.Runs.Pages.GoldLineAerialPhoto === "Photo" && lang.GHOSTWIRE.Runs.Pages.GoldLineAerialIntel === "Intel", "lang aerial recon page names");
ok(lang.GHOSTWIRE.Gear.Items.GoldLineAerialRecon?.Name === "Gold Line Aerial Recon", "lang aerial recon item name");

const reconItem = readBomFreeJson("src/packs/gear/general/plot/gold-line-aerial-recon.json");
ok(reconItem._id === "gwGoldLineRecon0" && reconItem.system?._dsid === "gold-line-aerial-recon", "aerial recon Plot Item id + dsid");
ok(reconItem.flags?.["draw-steel-ghostwire"]?.gear?.tags?.includes("Plot"), "aerial recon Item is Plot gear");
ok(reconItem.img.endsWith("gold-line-aerial-recon.webp"), "aerial recon Item img is the shipped webp");

ok(/aerial recon photo/i.test(sor) && /Ghostwire Runs → Deadhead/.test(sor), "SoR Discovery notes aerial recon handout");
ok(/Handout: Gold Line aerial recon photo/.test(sor) && /0\.3\.54/.test(sor), "SoR checklist marks aerial recon handout shipped");

const sceneTemplate = readFileSync("data/scenes/gold-line.json", "utf8");
const sceneScript = readFileSync("scripts/gold-line-scene.mjs", "utf8");
ok(!/gold-line-aerial-recon/.test(sceneTemplate) && !/gold-line-aerial-recon/.test(sceneScript), "aerial recon is not baked into Gold Line scene/inject");

if (failures.length) {
  console.error("\nFAILED:");
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nAll Deadhead Director smoke checks passed.");
