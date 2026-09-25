#!/usr/bin/env node
/**
 * 0.3.96 — Black Market sell smoke (scripts/black-market.mjs), no live Foundry.
 *
 * Checks the parts that are rules rather than UI:
 *  - The payout math: 50% of catalog ¥, floored; a haggle moves the percentage to 55 / 60 and nothing else.
 *  - A missing or 0 catalog price refuses the sale and pays nothing — no price is ever invented.
 *  - Stacks: a line's list price is catalog ¥ × the quantity sold, and quantities clamp to what is on the sheet.
 *  - Who may sell: the hero's owner or the Director, and only Items that sit on that hero.
 *  - The only wealth path is the kiosk's `system.hero.wealth`; there is no second purse.
 *  - Every lang key the dialog, the notifications and the chat card name resolves.
 *  - The Ghostwire Macros pack entry is shaped like the Director wealth macros and calls the real API.
 *
 * Run: node tools/black-market-smoke.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import {
  BASE_SALE_PERCENT,
  DEFAULT_HAGGLE_CHARACTERISTIC,
  HAGGLE_CHARACTERISTICS,
  SALE_TIER_PERCENT,
  canSell,
  clampSaleQuantity,
  collectSaleTargets,
  normalizeHaggleCharacteristic,
  normalizeSaleTier,
  ownsSellableItem,
  planSale,
  planSaleBatch,
  previewSaleWealth,
  saleOutcomeKey,
  salePercentForTier,
} from "../scripts/black-market.mjs";
import { WEALTH_PATH } from "../scripts/kiosk.mjs";

const failures = [];
const ok = (cond, msg) => { if (!cond) failures.push(msg); else console.log(`  ✓ ${msg}`); };
const read = p => JSON.parse(readFileSync(p, "utf8").replace(/^﻿/, ""));
const lang = read("lang/en.json");
const t = key => key.split(".").reduce((o, k) => o?.[k], lang);
const source = readFileSync("scripts/black-market.mjs", "utf8");
const module_ = readFileSync("scripts/module.mjs", "utf8");

console.log("0.3.96 Black Market sell smoke\n");

/* ---------- 1. tiers and percentages ---------- */
console.log("1) The street pays 50%, and only a haggle moves that");
ok(BASE_SALE_PERCENT === 50, "base payout is 50% of list");
ok(salePercentForTier(null) === 50, "no haggle pays the base 50%");
ok(salePercentForTier(1) === 50, "a low haggle (tier 1) pays 50% — the roll bought nothing");
ok(salePercentForTier(2) === 55, "a middle haggle (tier 2) pays 55%");
ok(salePercentForTier(3) === 60, "a high haggle (tier 3) pays 60%");
ok(salePercentForTier(4) === 50 && salePercentForTier(0) === 50 && salePercentForTier("x") === 50,
  "a tier outside 1–3 is read as no haggle, never as a bonus");
ok(Object.keys(SALE_TIER_PERCENT).length === 3, "there are exactly three tiers");
ok(Math.max(...Object.values(SALE_TIER_PERCENT)) === 60, "60% is the ceiling — a haggle never beats it");
ok(normalizeSaleTier("2") === 2 && normalizeSaleTier(2.7) === 2, "a tier reads as an integer");
ok(normalizeSaleTier(null) === null && normalizeSaleTier(undefined) === null && normalizeSaleTier(9) === null,
  "an unrolled or impossible tier is null, not 1");
ok(saleOutcomeKey(1) === "low" && saleOutcomeKey(2) === "middle" && saleOutcomeKey(3) === "high" && saleOutcomeKey(null) === null,
  "each tier names its outcome, and no roll names none");

/* ---------- 2. payout math ---------- */
console.log("\n2) Payout math");
const base = planSale({ listPrice: 1000 });
ok(base.ok && base.payout === 500 && base.percent === 50, "a ¥1,000 SKU fences for ¥500");
ok(planSale({ listPrice: 1000, tier: 1 }).payout === 500, "a hung haggle still pays ¥500");
ok(planSale({ listPrice: 1000, tier: 2 }).payout === 550, "a held haggle pays ¥550");
ok(planSale({ listPrice: 1000, tier: 3 }).payout === 600, "a clean haggle pays ¥600");
ok(planSale({ listPrice: 999 }).payout === 499, "the payout floors — ¥ has no small change");
ok(planSale({ listPrice: 333, tier: 2 }).payout === 183, "…on a haggled percentage too (333 × 55% = 183.15 → 183)");
ok(planSale({ listPrice: 1000.9 }).listPrice === 1000, "the list price floors before the arithmetic, not after");
ok(planSale({ listPrice: 1 }).ok && planSale({ listPrice: 1 }).payout === 0,
  "a ¥1 SKU fences for ¥0 — the sale is legal, and the dialog shows the ¥0 before anything is deleted");
ok(planSale({ listPrice: 1000 }).payout <= 1000, "a sale never pays more than list");

console.log("\n3) A missing catalog price refuses the sale");
for (const [label, value] of [["missing", undefined], ["null", null], ["zero", 0], ["unreadable", "abc"], ["negative", -500]]) {
  const plan = planSale({ listPrice: value });
  if (plan.ok || plan.reason !== "no-price" || plan.payout !== 0) failures.push(`a ${label} list price must refuse with no-price and pay 0`);
}
ok(true, "missing, null, 0, unreadable and negative list prices all refuse with `no-price` and pay ¥0");
ok(planSale({ listPrice: 0, tier: 3 }).payout === 0, "…and a clean haggle cannot conjure a price out of nothing");

/* ---------- 4. baskets ---------- */
console.log("\n4) Baskets");
const basket = planSaleBatch({
  items: [
    { id: "a", name: "Deck", listPrice: 1000 },
    { id: "b", name: "Grenades", listPrice: 300 },
    { id: "c", name: "Keepsake", listPrice: 0 },
  ],
});
ok(basket.ok && basket.payout === 650, "a basket pays the sum of its lines (500 + 150)");
ok(basket.sold.length === 2 && basket.refused.length === 1, "an unpriced row is refused on its own, not the whole sale");
ok(basket.refused[0].name === "Keepsake", "…and the refusal names the SKU the seller has to keep");
ok(basket.lines.length === 3, "every row is reported, sold or not");
const haggled = planSaleBatch({ items: [{ id: "a", listPrice: 1000 }, { id: "b", listPrice: 300 }], tier: 3 });
ok(haggled.payout === 780 && haggled.percent === 60, "one haggle applies to the whole basket (600 + 180)");
const nothing = planSaleBatch({ items: [] });
ok(!nothing.ok && nothing.reason === "no-items" && nothing.payout === 0, "an empty basket is a named no-op");
ok(!planSaleBatch({ items: [{ id: "c", listPrice: 0 }] }).ok, "a basket of only unpriced rows sells nothing");
ok(planSaleBatch({ items: [{ id: "a", listPrice: 1000 }] }).payout === planSale({ listPrice: 1000 }).payout,
  "a one-row basket is exactly one planSale");

/* ---------- 5. stacks ---------- */
console.log("\n5) Stacks — list price is catalog ¥ × the quantity sold");
ok(clampSaleQuantity(3, 5) === 3, "a partial stack sells what was asked for");
ok(clampSaleQuantity(9, 5) === 5, "…never more than sits on the sheet");
ok(clampSaleQuantity(0, 5) === 1 && clampSaleQuantity(-2, 5) === 1, "…and never fewer than one");
ok(clampSaleQuantity(undefined, 5) === 5 && clampSaleQuantity("abc", 5) === 5, "an unreadable quantity sells the whole stack");
ok(clampSaleQuantity(2, 0) === 1 && clampSaleQuantity(2, null) === 1, "a broken stock reads as a stack of one");
ok(clampSaleQuantity(2.9, 5) === 2, "quantities are integers");
const stack = planSaleBatch({ items: [{ id: "b", name: "Grenades", listPrice: 100 * 3, quantity: 3, stock: 5 }] });
ok(stack.payout === 150, "3 of 5 ¥100 grenades fence for ¥150, not ¥50");
ok(stack.sold[0].quantity === 3 && stack.sold[0].stock === 5, "…and the line remembers both what sold and what was held");
ok(source.includes("unitPrice * quantity"), "the multiplication happens where the Item is read, not inside planSale");

/* ---------- 6. the purse ---------- */
console.log("\n6) A sale only ever credits");
const purse = previewSaleWealth({ wealth: 250, payout: 500 });
ok(purse.wealthAfter === 750, "¥250 plus a ¥500 sale is ¥750");
ok(previewSaleWealth({ wealth: 0, payout: 0 }).wealthAfter === 0, "a ¥0 sale leaves the purse alone");
ok(previewSaleWealth({ wealth: -50, payout: 100 }).wealth === 0, "a broken wealth value reads as 0 before anything is decided");
ok(previewSaleWealth({ wealth: 100, payout: -100 }).wealthAfter === 100, "a sale can never debit a hero");
ok(WEALTH_PATH === "system.hero.wealth", "the kiosk's path is the path");
ok(source.includes('from "./kiosk.mjs"') && source.includes("[WEALTH_PATH]:"),
  "the sale writes through WEALTH_PATH, not a string of its own");
ok(source.includes("catalogPrice"), "the list price is the kiosk's catalog price");
ok((source.match(/seller\.update\(/g) ?? []).length === 1, "there is exactly one Actor write in the file");
ok(source.includes("formatYen"), "every ¥ the seller sees is formatted by the kiosk's formatter");
const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
ok(!/essence|conviction|resonance|taint/i.test(code), "the Black Market touches no other resource track");
ok(!/system\.hero\.(?!wealth)/.test(code), "…and writes nothing else under system.hero");

/* ---------- 7. who may sell what ---------- */
console.log("\n7) Who may sell, and what");
const kais = { id: "a", name: "Kaïs", type: "hero", isOwner: true };
const vessa = { id: "b", name: "Vessa", type: "hero", isOwner: false };
const rig = { id: "n", name: "Corpsec Rig", type: "npc", isOwner: true };
ok(canSell({ actor: kais }).ok, "a hero's owner may sell");
ok(canSell({ actor: vessa, isGM: true }).ok, "the Director may sell for any hero");
ok(!canSell({ actor: vessa }).ok && canSell({ actor: vessa }).reason === "no-permission",
  "a player may not sell off a hero they do not own");
ok(!canSell({ actor: rig }).ok && canSell({ actor: rig }).reason === "not-hero", "an NPC has no purse to sell into");
ok(!canSell({ actor: null }).ok && !canSell({}).ok, "no actor sells nothing");

const deck = { id: "i1", name: "Deck", parent: kais, isOwner: true };
const theirs = { id: "i2", name: "Their Deck", parent: vessa, isOwner: false };
const loose = { id: "i3", name: "World Item", parent: null, isOwner: true };
ok(ownsSellableItem({ actor: kais, item: deck }), "an owned Item on the seller may be fenced");
ok(!ownsSellableItem({ actor: kais, item: theirs }), "an Item on another hero may not");
ok(!ownsSellableItem({ actor: kais, item: loose }), "a world Item with no parent may not");
ok(!ownsSellableItem({ actor: kais, item: { id: "i4", parent: kais, isOwner: false } }),
  "an Item the user cannot delete may not");
ok(ownsSellableItem({ actor: vessa, item: theirs, isGM: true }), "…unless the Director is doing it");
ok(!ownsSellableItem({ actor: null, item: deck }) && !ownsSellableItem({ actor: kais, item: null }),
  "a missing side of the pair is never sellable");
ok(/ownsSellableItem\(\{ actor: seller, item: line\.item, isGM \}\)/.test(source),
  "executeSale re-checks ownership at the write, whatever the caller passed");

/* ---------- 8. targets and haggle characteristics ---------- */
console.log("\n8) Targets and the haggle");
ok(collectSaleTargets({ targeted: [{ actor: kais }], controlled: [{ actor: vessa }] })[0] === kais,
  "targeted tokens win over selected ones");
ok(collectSaleTargets({ targeted: [], controlled: [{ actor: vessa }] })[0] === vessa, "…and selection is the fallback");
ok(collectSaleTargets({}).length === 0, "nothing targeted and nothing selected collects nobody");
ok(source.includes('from "./director-wealth.mjs"'), "the collect is imported from the F6 tool rather than re-written");
ok(HAGGLE_CHARACTERISTICS.includes(DEFAULT_HAGGLE_CHARACTERISTIC), "the default haggle characteristic is one of the offered ones");
ok(DEFAULT_HAGGLE_CHARACTERISTIC === "presence", "the pitch defaults to Presence");
ok(normalizeHaggleCharacteristic("might") === "presence" && normalizeHaggleCharacteristic(null) === "presence",
  "an unoffered characteristic falls back to the pitch");
ok(normalizeHaggleCharacteristic("reason") === "reason", "…and an offered one is kept");
ok(/rollCharacteristic\?\.\(key/.test(source), "the haggle is a stock Draw Steel Power Roll on the seller");
ok(source.includes("rolled: false") && source.includes("HaggleCancelled"),
  "a dismissed haggle roll cancels the sale instead of quietly fencing at 50%");

/* ---------- 9. lang ---------- */
console.log("\n9) Lang keys");
const L = "GHOSTWIRE.BlackMarket";
const KEYS = ["Title", "SceneTool", "MacroName", "Keybinding", "Hud", "Hint", "RowPrice", "RowNoPrice", "Haggle",
  "HaggleCharacteristic", "HaggleHint", "HaggleRollTitle", "HaggleCancelled", "Total", "TotalHaggle", "Submit",
  "NoSeller", "NotHero", "NoPermission", "NoStock", "NothingPicked", "NoPrice", "NotOwnedItems", "SkippedUnpriced",
  "ChatTitle", "ChatHeadline", "ChatLine", "ChatHaggle", "ChatNoHaggle", "Notify"];
for (const key of KEYS) if (typeof t(`${L}.${key}`) !== "string") failures.push(`missing lang key ${L}.${key}`);
ok(true, `${KEYS.length} Black Market keys resolve`);
ok(typeof t(`${L}.Menu.Sell`) === "string", "the hero-sheet context-menu entry is localized");
for (const key of ["low", "middle", "high"]) {
  if (typeof t(`${L}.Outcome.${key}`) !== "string") failures.push(`missing lang key ${L}.Outcome.${key}`);
}
ok(true, "all three haggle outcomes are labelled");
for (const [key, tokens] of [
  ["ChatHeadline", ["{actor}", "{count}", "{payout}", "{before}", "{after}"]],
  ["ChatLine", ["{item}", "{quantity}", "{list}", "{percent}", "{payout}"]],
  ["ChatHaggle", ["{characteristic}", "{outcome}", "{percent}"]],
  ["Total", ["{count}", "{percent}", "{payout}"]],
  ["TotalHaggle", ["{count}", "{payout}", "{best}"]],
  ["RowPrice", ["{list}", "{payout}"]],
  ["Notify", ["{actor}", "{count}", "{payout}", "{after}"]],
]) {
  const line = t(`${L}.${key}`);
  const missing = tokens.filter(token => !String(line).includes(token));
  if (missing.length) failures.push(`${L}.${key} must name ${missing.join(", ")}`);
}
ok(true, "the chat card prints who, what, how many, list ¥, the percentage and ¥ before → after");
ok(/50/.test(t(`${L}.HaggleHint`)) && /55/.test(t(`${L}.HaggleHint`)) && /60/.test(t(`${L}.HaggleHint`)),
  "the haggle hint states all three percentages before the roll");

/* ---------- 10. the macro ---------- */
console.log("\n10) Ghostwire Macros pack");
const pay = read("src/packs/macros/director-pay-hero.json");
const macro = read("src/packs/macros/black-market-sell.json");
if (!/^[A-Za-z0-9]{16}$/.test(macro._id)) failures.push("black-market-sell.json: _id must be 16 alphanumeric characters");
if (macro._key !== `!macros!${macro._id}`) failures.push("black-market-sell.json: _key must be !macros!<id>");
if (macro.name !== `${L}.MacroName`) failures.push(`black-market-sell.json: name must be the lang key ${L}.MacroName`);
if (macro.type !== "script" || macro.scope !== "global") failures.push("black-market-sell.json: must be a global script macro");
if (macro.author !== pay.author) failures.push("black-market-sell.json: author must match the Director wealth macros");
if (!macro.command.includes("blackMarketPrompt")) failures.push("black-market-sell.json: does not call the module API");
if (!macro.command.includes("draw-steel-ghostwire")) failures.push("black-market-sell.json: does not guard on the module being enabled");
if (macro._id === pay._id) failures.push("black-market-sell.json: shares an id with the Director pay macro");
ok(true, "the Black Market macro is shaped like the Director wealth macros and calls blackMarketPrompt");

/* ---------- 11. the ship surface ---------- */
console.log("\n11) Wiring");
ok(module_.includes('import { registerBlackMarket } from "./black-market.mjs";'), "module.mjs imports the tool");
ok(module_.includes("registerBlackMarket();"), "…and registers it at init");
for (const name of ["blackMarketPrompt", "blackMarketSellPrompt", "executeSale", "sellItem"]) {
  if (!new RegExp(`module\\.api[\\s\\S]{0,600}${name}`).test(source)) failures.push(`module.api does not expose ${name}`);
  if (!new RegExp(`game\\.ghostwire = \\{[\\s\\S]{0,400}${name}`).test(source)) failures.push(`game.ghostwire does not expose ${name}`);
}
ok(true, "the prompt, the macro entry, the raw sale and the one-Item door are on module.api and game.ghostwire");
ok(source.includes('Hooks.on("getDocumentListContextOptions"'), "a hero-sheet Item context menu opens the sale");
// 0.3.137 declutter: the Token toolbar button is GONE. The macro, the keybinding, the HUD sack and the
// item-context Sell entry are the doors that remain.
ok(!source.includes("ghostwireBlackMarket"), "no scene-control tool is declared (dropped in 0.3.137)");
ok(existsSync("src/packs/macros/black-market-sell.json"), "…and the Black Market Sell macro still ships");
ok(source.includes('Hooks.on("renderTokenHUD"'), "a token-HUD button opens the sale on one hero");
ok(source.includes("game.keybindings.register") && source.includes("restricted: false"),
  "the keybinding is open to players — this is their door, not only the Director's");
ok(/createEmbeddedDocuments\("Item", restore/.test(source) && /updateEmbeddedDocuments\("Item", revert\)/.test(source),
  "a failed purse write puts every Item back — a sale is never half-done");
ok(!/div\.(classList|setAttribute|id\s*=)/.test(source),
  "the DialogV2 content wrapper carries no attributes — DialogV2 throws on one and keeps only its innerHTML");
ok(/<div class="ghostwire-market-dialog">/.test(source) && readFileSync("styles/ghostwire.css", "utf8").includes(".ghostwire-market-dialog"),
  "…so the styling hook is an inner div, and the stylesheet targets it");

const version = read("module.json").version;
ok((() => {
  const [maj, min, pat] = String(version).split(".").map(Number);
  return maj === 0 && min === 3 && pat >= 96;
})(), `module.json is 0.3.96+ (got ${version})`);

if (failures.length) {
  console.error(`\nBlack Market smoke FAILED:\n  - ${failures.join("\n  - ")}`);
  process.exit(1);
}
console.log("\nBlack Market smoke passed");
