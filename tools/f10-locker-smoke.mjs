#!/usr/bin/env node
/**
 * F10 smoke: Chest / Locker ownership gate + deposit / withdraw piles (no live Foundry).
 *
 * Run: node tools/f10-locker-smoke.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import {
  LOCKER_ACTOR_ID,
  LOCKER_TOKEN_ART,
  LOCKER_UUID,
  STORABLE_TYPES,
  accessGate,
  isHeroActor,
  isLockerActor,
  isStorableItem,
  itemQuantity,
  itemTransferData,
  matchStack,
  planTransfer,
  readLockerConfig,
  transferChatContent,
} from "../scripts/locker.mjs";
import { atLeast } from "./lib/module-version.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const MOD = "draw-steel-ghostwire";
const OWNER = 3;
const module = JSON.parse(readFileSync("module.json", "utf8"));
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const boot = readFileSync("scripts/module.mjs", "utf8");
const locker = readFileSync("scripts/locker.mjs", "utf8");
const kiosk = readFileSync("scripts/kiosk.mjs", "utf8");
const director = readFileSync("docs/directors/f10-chest-locker.md", "utf8");
const stub = JSON.parse(readFileSync("src/packs/summons/lockers/locker-stash.json", "utf8"));
const folder = JSON.parse(readFileSync("src/packs/summons/lockers/_folder.json", "utf8"));

const mkLocker = (over = {}) => ({
  type: "npc",
  ownership: over.ownership ?? { default: 0 },
  flags: { [MOD]: { kind: "locker", shared: [], partyShare: false, locked: true, ...(over.flags ?? {}) } },
});
const gearItem = (over = {}) => ({
  name: over.name ?? "Medkit",
  type: over.type ?? "treasure",
  system: { _dsid: over.dsid ?? "medkit", quantity: over.quantity ?? 1 },
  flags: { [MOD]: over.gwFlags ?? {} },
});

console.log("F10 chest / locker smoke\n");

console.log("1) Ship surface");
note(atLeast(module.version, "0.3.113"), `module.json is ≥ 0.3.113 (got ${module.version})`);
note(boot.includes("registerLocker()"), "module.mjs registers registerLocker");
note(existsSync("templates/locker.hbs"), "templates/locker.hbs on disk");
note(director.length > 1000, "Director note exists and is not a stub");
note(stub._id === LOCKER_ACTOR_ID && stub._key === `!actors!${LOCKER_ACTOR_ID}`, "pack stub id matches the script constant");
note(stub.flags[MOD].kind === "locker", "pack stub is kind=locker");
note(stub.folder === folder._id, "stub sits in the Lockers folder");
note(LOCKER_UUID.endsWith(LOCKER_ACTOR_ID) && LOCKER_UUID.includes(".summons."), "UUID points at the summons pack");
note(stub.img === LOCKER_TOKEN_ART && stub.prototypeToken.texture.src === LOCKER_TOKEN_ART, "stub art is the core chest icon");
note(LOCKER_TOKEN_ART.startsWith("icons/svg/"), "token art is an always-present core SVG");
note(stub.ownership.default === 0, "pack stub grants nobody access by default");
note(stub.prototypeToken.actorLink === true, "the stub token is actor-linked, so one locker is one shelf");

console.log("\n2) Not a shop");
note(!locker.includes("system.hero.wealth"), "locker.mjs never touches hero wealth");
note(!/catalogPrice|listingPrice|formatYen/.test(locker), "locker.mjs imports no pricing helpers");
note(!locker.includes("kiosk-presets"), "locker.mjs does not pull kiosk presets");
note(kiosk.includes("WEALTH_PATH"), "the kiosk still owns the ¥ path (untouched)");
note(lang.GHOSTWIRE.Locker.DropHint.includes("not a shop"), "the panel says so out loud");

console.log("\n3) Ownership gate");
const player = { id: "u1", isGM: false };
const other = { id: "u2", isGM: false };
const gm = { id: "gm", isGM: true };
const owned = mkLocker({ ownership: { default: 0, u1: OWNER } });
note(accessGate({ user: gm, locker: mkLocker(), ownerLevel: OWNER }).via === "director", "the Director always opens a locker");
note(accessGate({ user: player, locker: owned, ownerLevel: OWNER }).via === "owner", "the owner opens their own locker");
const denied = accessGate({ user: other, locker: owned, ownerLevel: OWNER });
note(denied.ok === false && denied.reason === "locked", "anybody else is refused");
note(accessGate({ user: other, locker: mkLocker({ flags: { shared: ["u2"] } }), ownerLevel: OWNER }).via === "shared",
  "an explicit share list lets one user in");
note(accessGate({ user: other, locker: mkLocker({ flags: { partyShare: true } }), ownerLevel: OWNER }).via === "party",
  "party share opens it to the whole crew");
note(accessGate({ user: other, locker: mkLocker({ flags: { locked: false } }), ownerLevel: OWNER }).via === "unlocked",
  "an explicitly unlocked locker is open");
note(accessGate({ user: null, locker: owned, ownerLevel: OWNER }).ok === false, "no user, no access");
note(accessGate({ user: other, locker: mkLocker({ ownership: { default: 2 } }), ownerLevel: OWNER }).ok === false,
  "Observer-level ownership is not enough to open a locker");
note(accessGate({ user: other, locker: mkLocker({ ownership: { default: OWNER } }), ownerLevel: OWNER }).via === "owner",
  "a default-OWNER locker is open to everyone (the Director's explicit choice)");

console.log("\n4) Config reading");
const cfg = readLockerConfig(mkLocker({ flags: { shared: ["u2", "u2", ""], partyShare: true, tagline: "back room" } }));
note(cfg.shared.join(",") === "u2", "share list de-duplicates and drops blanks");
note(cfg.partyShare === true && cfg.locked === true, "flags round-trip");
note(readLockerConfig({}).locked === true, "a locker with no flags still defaults to locked");
note(isLockerActor(stub) && !isLockerActor({ flags: { [MOD]: { kind: "kiosk" } } }), "isLockerActor does not catch kiosks");
note(isHeroActor({ type: "hero" }) && !isHeroActor({ type: "npc" }), "heroes only on the carry side");

console.log("\n5) What can be stashed");
note(STORABLE_TYPES.includes("treasure"), "treasure (the Ghostwire gear type) is storable");
note(isStorableItem(gearItem()), "plain gear is storable");
note(!isStorableItem(gearItem({ gwFlags: { chrome: { integrity: 2 } } })), "chrome never leaves the body");
note(!isStorableItem(gearItem({ gwFlags: { grantedBy: "abc" } })), "implant-granted abilities are not loot");
note(!isStorableItem({ type: "class", system: {} }), "class paperwork is not loot");
note(!isStorableItem({ type: "ancestry", system: {} }), "ancestry is not loot");
note(!isStorableItem(null), "null is not storable");

console.log("\n6) Deposit / withdraw piles");
const half = planTransfer({ available: 5, requested: 2 });
note(half.ok && half.moved === 2 && half.left === 3, "a partial pile splits the stack");
const all = planTransfer({ available: 3, requested: 9 });
note(all.moved === 3 && all.left === 0, "asking for more than the stack moves the stack");
note(planTransfer({ available: 0, requested: 1 }).reason === "empty", "an empty stack refuses");
note(planTransfer({ available: 4, requested: 0 }).moved === 1, "a zero request still moves one");
note(planTransfer({ available: 4, requested: -3 }).moved === 1, "a negative request still moves one");
note(itemQuantity(gearItem({ quantity: 7 })) === 7 && itemQuantity(gearItem({ quantity: 0 })) === 1, "quantity reading floors at 1");

console.log("\n7) Stack merge on the far side");
const shelf = [gearItem({ dsid: "medkit", quantity: 2 }), gearItem({ name: "Burner", dsid: "burner" })];
note(matchStack(shelf, gearItem({ dsid: "medkit" }))?.system._dsid === "medkit", "a matching _dsid merges");
note(matchStack(shelf, gearItem({ dsid: "grenade" })) === null, "a different SKU starts a new stack");
note(matchStack([gearItem({ name: "Odd", dsid: undefined })], { name: "Odd", type: "treasure", system: {} })?.name === "Odd",
  "no _dsid falls back to matching by name");
note(matchStack([gearItem({ gwFlags: { chrome: {} } })], gearItem())?.name === undefined, "chrome on the shelf is never a merge target");

console.log("\n8) Transfer payload hygiene");
const source = { _id: "abc", _key: "!items!abc", folder: "f", sort: 9, _stats: { x: 1 },
  name: "Medkit", type: "treasure", system: { _dsid: "medkit", quantity: 5 },
  effects: [{ _id: "e1", _key: "!items.effects!e1", name: "E" }], ownership: { default: 3 } };
const copy = itemTransferData(source, 2);
note(copy._id === undefined && copy._key === undefined, "the copy drops document ids");
note(copy.folder === undefined && copy.sort === undefined && copy._stats === undefined, "the copy drops pack metadata");
note(copy.system.quantity === 2, "the copy carries the moved count, not the whole stack");
note(copy.effects[0]._id === undefined && copy.effects[0].name === "E", "embedded effects keep their data, lose their ids");
note(copy.ownership.default === 0, "the copy resets ownership");
note(source._id === "abc" && source.system.quantity === 5, "the source object is not mutated");
note(itemTransferData(null) === null, "no source, no payload");

console.log("\n9) Chat lines");
const dep = transferChatContent({ hero: "Sabbat", locker: "Squat safe", item: "Medkit", count: 2, direction: "deposit" });
const wit = transferChatContent({ hero: "Sabbat", locker: "Squat safe", item: "Medkit", count: 1, direction: "withdraw" });
note(dep.includes("stows") && dep.includes("×2"), "deposit line names the pile");
note(wit.includes("pulls"), "withdraw line reads the other way");
note(transferChatContent({ hero: "<b>x", locker: "l", item: "i", count: 1, direction: "deposit" }).includes("&lt;b&gt;"),
  "names are escaped");
note(!dep.includes("¥"), "no ¥ anywhere in a transfer line");

console.log("\n10) Strings");
const lk = lang.GHOSTWIRE.Locker;
note(lk.Title === "Locker" && lk.Place === "Place Locker", "panel + scene-control titles are plain strings");
note(typeof lk.PlaceForm === "object" && !!lk.PlaceForm.Owner, "the place dialog fields are nested under PlaceForm");
note(!!lk.Denied && lk.Denied.includes("Director"), "the refusal names who may open it");
note(Object.keys(lk.Via).length === 5, "a label per access route");
note(Object.keys(lk.Errors).length === 4, "a message per transfer refusal");
note(lk.Chat.Deposited.includes("{count}") && lk.Chat.Withdrew.includes("{count}"), "both chat lines take a count");
note(!!lk.Template.Name && !!lk.Template.Description, "the pack stub has its own strings");

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
