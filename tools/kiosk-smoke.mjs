#!/usr/bin/env node
/**
 * B118 / B119 smoke: kiosk purchase helpers + preset inventory building (no live Foundry).
 *
 * Run: node tools/kiosk-smoke.mjs
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  DEFAULT_KIOSK_RANGE,
  KIOSK_ACTOR_ID,
  KIOSK_CORE_ITEM_IMG,
  KIOSK_SHELF_FALLBACK_IMG,
  KIOSK_TOKEN_ART,
  KIOSK_UUID,
  WEALTH_PATH,
  applyPurchase,
  browseGate,
  catalogPrice,
  formatYen,
  isBuyerInRange,
  isKioskActor,
  isUsableKioskImg,
  isWithinKioskRange,
  itemCreateData,
  kioskConsumableIcon,
  kioskListingFallbackImg,
  kioskListingImg,
  kioskShelfOf,
  listingPrice,
  normalizeInventory,
  planPurchase,
  purchaseChatContent,
  readKioskConfig,
  tokenDistanceSquares,
} from "../scripts/kiosk.mjs";
import { KIOSK_PRESETS, getPreset, listingsFromItems } from "../scripts/kiosk-presets.mjs";
import { buffEffectsOf, crashEffectsOf, isConsumableTreasure, planConsumableUse } from "../scripts/consumable-use.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const module = JSON.parse(readFileSync("module.json", "utf8"));
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const spike = readFileSync("docs/spikes/B118-SCENE-KIOSK-MERCHANT.md", "utf8");
const director = readFileSync("docs/directors/scene-kiosk-merchant.md", "utf8");
const boot = readFileSync("scripts/module.mjs", "utf8");
const gold = readFileSync("scripts/gold-line-scene.mjs", "utf8");
const actor = JSON.parse(readFileSync("src/packs/summons/kiosks/kiosk-merchant.json", "utf8"));
const folder = JSON.parse(readFileSync("src/packs/summons/kiosks/_folder.json", "utf8"));

console.log("B118 / B119 scene kiosk merchant + presets smoke\n");

console.log("1) Ship surface");
note(typeof module.version === "string" && module.version >= "0.3.65", `module.json is ≥ 0.3.65 (got ${module.version})`);
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
note(KIOSK_TOKEN_ART === "modules/draw-steel-ghostwire/assets/tokens/kiosks/kiosk-merchant.webp", "token art module path");
note(actor.img === KIOSK_TOKEN_ART, "pack stub img is kiosk plate");
note(actor.prototypeToken?.texture?.src === KIOSK_TOKEN_ART, "pack stub token texture is kiosk plate");
note(existsSync("assets/tokens/kiosks/kiosk-merchant.png") && existsSync("assets/tokens/kiosks/kiosk-merchant.webp"), "png + webp on disk");
note(readFileSync("scripts/kiosk.mjs", "utf8").includes("KIOSK_TOKEN_ART"), "placeKiosk stamps KIOSK_TOKEN_ART");
note(director.includes("kiosks/kiosk-merchant.webp"), "Director note documents art path");
note(spike.includes("kiosks/kiosk-merchant.webp"), "B118 spike documents art path");

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

console.log("\n6) B119 preset inventory (src/packs catalog)");
const b119 = readFileSync("docs/spikes/B119-KIOSK-PRESETS-CONSUMABLES.md", "utf8");
note(b119.includes("0.3.65") && b119.includes("SHIPPED"), "B119 spike shipped 0.3.65");
note(b119.includes("kiosks/kiosk-merchant.webp"), "B119 spike documents art path");
note(director.includes("Street Food Kiosk") && director.includes("Armor Locker"), "Director note names type defaults");
note(boot.includes("registerConsumableUse()"), "module registers registerConsumableUse");
note(KIOSK_PRESETS.map(p => p.id).join(",") === "food,medical,tools,armor,weapons,drones", "six preset ids");
note(getPreset("food")?.match.pathPrefixes.includes("consumables/food"), "food filter is consumables/food");
note(getPreset("armor")?.match.kinds.includes("armor"), "armor filter is kind=armor");
note(getPreset("weapons")?.match.kinds.includes("weapon"), "weapons filter is kind=weapon");
note(getPreset("drones")?.match.vehicleDrone === true, "drones filter is vehicle.drone");

function scanSrcCatalog() {
  const items = [];
  for (const pack of ["gear", "vehicles"]) {
    const base = join("src/packs", pack);
    const files = readdirSync(base, { recursive: true }).filter(f => String(f).endsWith(".json") && !String(f).endsWith("_folder.json"));
    for (const file of files) {
      const rel = String(file).replaceAll("\\", "/");
      const data = JSON.parse(readFileSync(join(base, rel), "utf8"));
      if (!data._id || data._key?.startsWith("!folders!")) continue;
      items.push({
        pack,
        path: rel.replace(/\.json$/, ""),
        id: data._id,
        uuid: `Compendium.draw-steel-ghostwire.${pack}.Item.${data._id}`,
        folder: data.folder,
        system: data.system,
        flags: data.flags,
        type: data.type,
        name: data.name,
        effects: data.effects ?? [],
      });
    }
  }
  return items;
}

const catalog = scanSrcCatalog();
const food = listingsFromItems(catalog, "food");
const medical = listingsFromItems(catalog, "medical");
const tools = listingsFromItems(catalog, "tools");
const armor = listingsFromItems(catalog, "armor");
const weapons = listingsFromItems(catalog, "weapons");
const drones = listingsFromItems(catalog, "drones");
note(food.length === 6, `food stocks 6 SKUs (got ${food.length})`);
note(food.every(row => row.price === null), "food listings use catalog ¥");
note(medical.length >= 9, `medical is chems + existing kits (got ${medical.length})`);
note(tools.length >= 10, `tools stocks infiltration/sensors/survival (got ${tools.length})`);
note(armor.length >= 20, `armor stocks all armor Items (got ${armor.length})`);
note(weapons.length >= 40, `weapons stocks all weapon Items (got ${weapons.length})`);
note(drones.length >= 30, `drones stocks vehicle.drone Items (got ${drones.length})`);
const foodIds = new Set(food.map(r => r.uuid.split(".").pop()));
note(foodIds.has("GwBuzzCan0000001") && foodIds.has("GwStallRamen0001"), "food includes Buzz-Can + Stall Ramen");
const medIds = new Set(medical.map(r => r.uuid.split(".").pop()));
note(medIds.has("GwKickwire000001") && medIds.has("Rv0BEDaaCZ14x6GV"), "medical includes Kickwire + Stim Patch");
note(armor.every(row => row.uuid.includes(".gear.Item.")), "armor UUIDs are gear pack");
note(drones.every(row => row.uuid.includes(".vehicles.Item.")), "drone UUIDs are vehicles pack");

const buzzCan = JSON.parse(readFileSync("src/packs/gear/consumables/food/buzz-can.json", "utf8"));
const boughtFood = applyPurchase({
  wealth: 5000,
  price: listingPrice({ price: null }, buzzCan),
  sourceItem: buzzCan,
});
note(boughtFood.ok && boughtFood.wealthAfter === 4996 && boughtFood.item?.name === "GHOSTWIRE.Gear.Items.BuzzCan.Name", "purchase Buzz-Can deducts ¥4");

console.log("\n7) Chem dose plans");
const kickwire = JSON.parse(readFileSync("src/packs/gear/consumables/chems/kickwire.json", "utf8"));
const clearline = JSON.parse(readFileSync("src/packs/gear/consumables/chems/clearline.json", "utf8"));
const numb = JSON.parse(readFileSync("src/packs/gear/consumables/chems/numb-tap.json", "utf8"));
const dust = JSON.parse(readFileSync("src/packs/gear/consumables/chems/red-dust.json", "utf8"));
note(isConsumableTreasure(kickwire) && isConsumableTreasure(dust), "chems carry consumableUse");
note(!isConsumableTreasure(JSON.parse(readFileSync("src/packs/gear/consumables/food/buzz-can.json", "utf8"))), "food is not a dose");
note(buffEffectsOf(kickwire).length === 1 && crashEffectsOf(kickwire).length === 1, "Kickwire has buff + crash AE");
note(buffEffectsOf(clearline).length === 1 && crashEffectsOf(clearline).length === 0, "Clearline is buff-only");
const dose = planConsumableUse({
  quantity: 1,
  staminaValue: 20,
  staminaMax: 30,
  staminaTemporary: 0,
  taint: 0,
  use: kickwire.flags["draw-steel-ghostwire"].gear.consumableUse,
});
note(dose.ok && dose.tempGranted === 5 && dose.quantityAfter === 0, `Kickwire grants 5 temp Stamina and spends the dose`);
const spent = planConsumableUse({ quantity: 0, use: kickwire.flags["draw-steel-ghostwire"].gear.consumableUse });
note(spent.ok === false && spent.reason === "spent", "spent dose refuses");
const spice = planConsumableUse({
  quantity: 2,
  staminaTemporary: 0,
  taint: 2,
  use: dust.flags["draw-steel-ghostwire"].gear.consumableUse,
});
note(spice.ok && spice.tempGranted === 10 && spice.taint.delta === 1 && spice.quantityAfter === 1, "Red Dust +10 temp Stamina and +1 Taint");
note(numb.flags["draw-steel-ghostwire"].gear.consumableUse.tempStamina === 8, "Numb-Tap is +8 temp Stamina");
note(lang.GHOSTWIRE.ConsumableUse.AbilityName === "Use {item}", "lang Use {item}");
note(!JSON.stringify(lang.GHOSTWIRE.Gear.Items.Kickwire).includes("Draw Steel Heroes"), "Kickwire player text is Ghostwire-only");
note(lang.GHOSTWIRE.Gear.Items.Kickwire.Description.includes("Physique"), "Kickwire names Physique, not Might");

console.log("\n8) Consumable kiosk art (0.3.66)");
const kioskSrc = readFileSync("scripts/kiosk.mjs", "utf8");
const kioskTpl = readFileSync("templates/kiosk.hbs", "utf8");
note(!kioskSrc.includes("gold-line-scene"), "kiosk.mjs does not import gold-line-scene");
note(kioskTpl.includes("data-fallback") && kioskTpl.includes("gw-kiosk-row-img"), "kiosk rows have img fallback hook");
note(kioskSrc.includes("bindKioskImgFallback") && kioskSrc.includes("kioskListingImg"), "shop binds onerror fallback");
note(KIOSK_CORE_ITEM_IMG === "icons/svg/item-bag.svg", "core fallback is icons/svg/item-bag.svg");
note(KIOSK_SHELF_FALLBACK_IMG.food.endsWith("/food.svg") && KIOSK_SHELF_FALLBACK_IMG.chem.endsWith("/chem.svg"), "shelf fallbacks are food.svg / chem.svg");
note(!isUsableKioskImg("") && !isUsableKioskImg("icons/consumables/drinks/soda-bottle-blue.webp"), "blank + icons/consumables are unusable");
note(!isUsableKioskImg("icons/tools/medical/bandages-gauze.webp"), "non-svg icons/ trees are unusable");
note(isUsableKioskImg("icons/svg/item-bag.svg") && isUsableKioskImg(kioskConsumableIcon("buzz-can")), "core svg + module svg are usable");
const foodSku = JSON.parse(readFileSync("src/packs/gear/consumables/food/buzz-can.json", "utf8"));
const chemSku = JSON.parse(readFileSync("src/packs/gear/consumables/chems/kickwire.json", "utf8"));
note(kioskShelfOf(foodSku) === "food" && kioskShelfOf(chemSku) === "chem", "shelf from kioskShelf flag");
note(kioskListingImg({ img: "icons/consumables/food/soup-broth-bowl-brown.webp", flags: foodSku.flags }) === KIOSK_SHELF_FALLBACK_IMG.food, "broken food game-icon falls back to food.svg");
note(kioskListingImg({ img: "", flags: chemSku.flags }) === KIOSK_SHELF_FALLBACK_IMG.chem, "blank chem img falls back to chem.svg");
note(kioskListingImg({ img: kioskConsumableIcon("stall-ramen") }) === kioskConsumableIcon("stall-ramen"), "module svg passes through");
note(kioskListingFallbackImg({}) === KIOSK_CORE_ITEM_IMG, "unknown shelf falls back to item-bag");
note(kioskListingImg(null) === KIOSK_CORE_ITEM_IMG, "missing item uses item-bag");

function walkConsumables(dir) {
  const out = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, name.name);
    if (name.isDirectory()) out.push(...walkConsumables(path));
    else if (name.name.endsWith(".json") && name.name !== "_folder.json") out.push(path);
  }
  return out;
}
const skuFiles = walkConsumables("src/packs/gear/consumables");
note(skuFiles.length === 10, `ten consumable SKUs (got ${skuFiles.length})`);
let skuArtOk = 0;
for (const path of skuFiles) {
  const doc = JSON.parse(readFileSync(path, "utf8"));
  const dsid = doc.system?._dsid;
  const expected = kioskConsumableIcon(dsid);
  const disk = join("assets/icons/consumables", `${dsid}.svg`);
  if (doc.img === expected && existsSync(disk) && !String(doc.img).startsWith("icons/")) skuArtOk += 1;
}
note(skuArtOk === 10, `all SKU img paths are module SVGs on disk (${skuArtOk}/10)`);
note(existsSync("assets/icons/consumables/food.svg") && existsSync("assets/icons/consumables/chem.svg"), "food.svg + chem.svg fallbacks on disk");
note(!gold.includes("kiosk"), "gold-line-scene.mjs still untouched");

const foodPrices = Object.fromEntries(skuFiles.filter(p => p.includes("/food/")).map(p => {
  const doc = JSON.parse(readFileSync(p, "utf8"));
  return [doc.system._dsid, doc.flags["draw-steel-ghostwire"].gear.price];
}));
note(foodPrices["buzz-can"] === 4 && foodPrices["lyte-pouch"] === 5 && foodPrices["stall-ramen"] === 10 && foodPrices["grease-box"] === 12 && foodPrices["brick-bar"] === 3 && foodPrices["shift-chews"] === 6,
  `food is street-snack ¥ (got ${JSON.stringify(foodPrices)})`);
note(kickwire.flags["draw-steel-ghostwire"].gear.price === 400 && clearline.flags["draw-steel-ghostwire"].gear.price === 350 && numb.flags["draw-steel-ghostwire"].gear.price === 250 && dust.flags["draw-steel-ghostwire"].gear.price === 600, "chems keep stim ¥");
note(/Cost:<\/strong> ¥4 /.test(lang.GHOSTWIRE.Gear.Items.BuzzCan.Description), "lang Buzz-Can is ¥4");
note(/Cost:<\/strong> ¥3 /.test(lang.GHOSTWIRE.Gear.Items.BrickBar.Description), "lang Brick Bar is ¥3");

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
