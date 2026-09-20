#!/usr/bin/env node
/**
 * B118 smoke: kiosk price deduct + item create helpers (no live Foundry).
 *
 * Run: node tools/kiosk-smoke.mjs
 */
import { readFileSync } from "node:fs";
import {
  DEFAULT_KIOSK_RANGE,
  KIOSK_ACTOR_ID,
  KIOSK_UUID,
  WEALTH_PATH,
  applyPurchase,
  browseGate,
  catalogPrice,
  formatYen,
  isBuyerInRange,
  isKioskActor,
  isWithinKioskRange,
  itemCreateData,
  listingPrice,
  normalizeInventory,
  planPurchase,
  purchaseChatContent,
  readKioskConfig,
  tokenDistanceSquares,
} from "../scripts/kiosk.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const module = JSON.parse(readFileSync("module.json", "utf8"));
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const spike = readFileSync("docs/spikes/B118-SCENE-KIOSK-MERCHANT.md", "utf8");
const boot = readFileSync("scripts/module.mjs", "utf8");
const gold = readFileSync("scripts/gold-line-scene.mjs", "utf8");
const actor = JSON.parse(readFileSync("src/packs/summons/kiosks/kiosk-merchant.json", "utf8"));
const folder = JSON.parse(readFileSync("src/packs/summons/kiosks/_folder.json", "utf8"));

console.log("B118 scene kiosk merchant smoke\n");

console.log("1) Ship surface");
note(module.version === "0.3.59", `module.json is 0.3.59 (got ${module.version})`);
note(spike.includes("DESIGN LOCKED") || spike.includes("SHIPPED"), "spike is locked/shipped");
note(spike.includes("kind === \"kiosk\"") || spike.includes('kind === "kiosk"') || spike.includes("kind: kiosk") || spike.includes('kind === "kiosk"'), "spike documents Actor stub");
note(boot.includes("registerKiosk()"), "module registers registerKiosk");
note(!gold.includes("kiosk"), "gold-line-scene.mjs untouched by kiosk");
note(lang.GHOSTWIRE.Kiosk.Title === "Kiosk", "lang Title");
note(lang.GHOSTWIRE.Kiosk.Chat.Purchased.includes("{price}"), "lang purchase chat");
note(actor._id === KIOSK_ACTOR_ID, "pack actor id");
note(actor.flags["draw-steel-ghostwire"].kind === "kiosk", "pack kind=kiosk");
note(actor.flags["draw-steel-ghostwire"].range === DEFAULT_KIOSK_RANGE, "pack default range 2");
note(folder._id === actor.folder, "kiosk folder id matches");
note(KIOSK_UUID.endsWith(KIOSK_ACTOR_ID), "UUID suffix");
note(WEALTH_PATH === "system.hero.wealth", "wealth path is system.hero.wealth");

console.log("\n2) Catalog ¥ + listing override");
const burner = { flags: { "draw-steel-ghostwire": { gear: { price: 60 } } } };
const datajack = { flags: { "draw-steel-ghostwire": { chrome: { price: 500 } } } };
const deck = { flags: { "draw-steel-ghostwire": { matrix: { price: 1200 } } } };
note(catalogPrice(burner) === 60, "gear.price 60");
note(catalogPrice(datajack) === 500, "chrome.price 500");
note(catalogPrice(deck) === 1200, "matrix.price 1200");
note(catalogPrice({ flags: {} }) === null, "missing catalog → null");
note(listingPrice({ price: null }, burner) === 60, "null override uses catalog");
note(listingPrice({ price: 150 }, burner) === 150, "override 150 beats catalog 60");
note(listingPrice({ price: 0 }, burner) === 0, "override 0 is free");
note(listingPrice({}, { flags: {} }) === 0, "no catalog no override → 0");
note(formatYen(5000, "en") === "¥5,000", `formatYen 5000 → ${formatYen(5000, "en")}`);

console.log("\n3) Price deduct + item create");
const source = {
  _id: "PS7Jfr661TS2RPPM",
  _key: "!items!PS7Jfr661TS2RPPM",
  name: "Burner",
  type: "treasure",
  folder: "onsSFZfzViokfkSC",
  sort: 3,
  ownership: { default: 3 },
  flags: { "draw-steel-ghostwire": { gear: { price: 60 } } },
  effects: [{ _id: "EffKioskSmoke01", name: "noop" }],
};
const poor = applyPurchase({ wealth: 50, price: 60, sourceItem: source });
note(poor.ok === false && poor.reason === "insufficient" && poor.wealthAfter === 50, "refuse when wealth < price");
note(poor.item === null, "insufficient does not stamp an Item");

const bought = applyPurchase({ wealth: 5000, price: listingPrice({ price: null }, source), sourceItem: source });
note(bought.ok === true && bought.price === 60 && bought.wealthAfter === 4940, `deduct 60 from 5000 → ${bought.wealthAfter}`);
note(bought.item && bought.item.name === "Burner" && !bought.item._id, "created Item has no _id");
note(bought.item.folder == null && bought.item._key == null, "created Item drops folder/_key");
note(bought.item.effects?.[0] && !bought.item.effects[0]._id, "embedded effect _id stripped");
note(itemCreateData(null) === null, "itemCreateData(null) is null");

const plan = planPurchase({ wealth: 60, price: 60 });
note(plan.ok && plan.wealthAfter === 0, "exact funds leave ¥0");

const chat = purchaseChatContent({ buyer: "Kessic", merchant: "Mama’s Bar", item: "Burner", price: 60 });
note(chat.includes("Kessic") && chat.includes("Mama’s Bar") && chat.includes("Burner") && chat.includes("¥60"), "chat names buyer/merchant/item/¥");
note(!chat.includes("<script>"), "chat helper does not emit scripts");

console.log("\n4) Range (Chebyshev squares)");
const grid = 100;
const kioskTok = { x: 500, y: 500, width: 1, height: 1, actorId: "kiosk" };
const adjacent = { x: 600, y: 500, width: 1, height: 1, actorId: "hero" };
const twoAway = { x: 700, y: 500, width: 1, height: 1, actorId: "hero" };
const threeAway = { x: 800, y: 500, width: 1, height: 1, actorId: "hero" };
const diagonal = { x: 600, y: 600, width: 1, height: 1, actorId: "hero" };
note(tokenDistanceSquares(kioskTok, adjacent, grid) === 1, "adjacent = 1");
note(tokenDistanceSquares(kioskTok, twoAway, grid) === 2, "two squares = 2");
note(tokenDistanceSquares(kioskTok, threeAway, grid) === 3, "three squares = 3");
note(tokenDistanceSquares(kioskTok, diagonal, grid) === 1, "diagonal adjacent = 1 (Chebyshev)");
note(isWithinKioskRange(adjacent, kioskTok, 2, grid) === true, "default range 2 includes adjacent");
note(isWithinKioskRange(twoAway, kioskTok, 2, grid) === true, "default range 2 includes 2");
note(isWithinKioskRange(threeAway, kioskTok, 2, grid) === false, "default range 2 excludes 3");

const scene = {
  grid: { size: grid },
  tokens: [kioskTok, adjacent, threeAway],
};
const kioskActor = {
  id: "kiosk",
  name: "Mama’s Bar",
  flags: { "draw-steel-ghostwire": { kind: "kiosk", range: 2, inventory: [{ uuid: "Compendium.draw-steel-ghostwire.gear.Item.PS7Jfr661TS2RPPM" }] } },
};
const heroNear = { id: "hero-near", type: "hero", system: { hero: { wealth: 5000 } } };
const heroFar = { id: "hero-far", type: "hero", system: { hero: { wealth: 5000 } } };
adjacent.actorId = heroNear.id;
threeAway.actorId = heroFar.id;
note(isKioskActor(kioskActor), "read kind=kiosk");
note(readKioskConfig(kioskActor).inventory.length === 1, "normalize inventory keeps UUID");
note(isBuyerInRange(heroNear, kioskActor, scene) === true, "near hero is in range");
note(isBuyerInRange(heroFar, kioskActor, scene) === false, "far hero is out of range");

const playerGate = browseGate({ user: { isGM: false }, kiosk: kioskActor, scene, heroes: [heroFar] });
note(playerGate.ok === false && playerGate.reason === "out-of-range", "player far → out-of-range");
const gmGate = browseGate({ user: { isGM: true }, kiosk: kioskActor, scene, heroes: [heroFar] });
note(gmGate.ok === true, "GM always browses");
const noHero = browseGate({ user: { isGM: false }, kiosk: kioskActor, scene, heroes: [] });
note(noHero.ok === false && noHero.reason === "no-buyer", "no hero → no-buyer");

console.log("\n5) Inventory normalize");
const inv = normalizeInventory([
  { uuid: "Compendium.x.Item.AAA", price: "120" },
  { uuid: "Compendium.x.Item.AAA", price: 120 },
  { uuid: "  ", price: 1 },
  { uuid: "Compendium.x.Item.BBB" },
]);
note(inv.length === 2, `dedupes + drops blank UUID (got ${inv.length})`);
note(inv[0].price === 120 && inv[1].price === null, "override vs catalog null");

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
