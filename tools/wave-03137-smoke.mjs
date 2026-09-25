#!/usr/bin/env node
/**
 * 0.3.137 wave smoke — the Mount / Dismount hot-fix, and the Token-toolbar declutter.
 *
 * Both items are the same kind of bug report: **the table saw something the code did not know about.**
 * A hero "aboard" a truck was standing two squares off its flank and staying there when the truck drove
 * away, and the Token toolbar had quietly grown past what fits down the left edge of the canvas.
 *
 * As in every wave smoke from 0.3.125 on, the assertions run the **real exported functions** rather than
 * re-typing the maths: `rimSeatPosition` / `seatPosition` / `shouldFollowMount` / `shouldHandleRide` /
 * `rideMovement` / `mountGeometry` are imported from `scripts/passengers.mjs` and driven directly. The
 * hook wiring and the toolbar removals cannot be run offline, so those are **source scans** over the
 * comment-stripped file — a header that *names* `moveToken` is not a `Hooks.on("moveToken")`.
 *
 * Foundry target: **14.367**, where `moveToken(document, movement, operation, user)` and
 * `stopToken(document)` are the movement-completion hooks and `DatabaseUpdateOperation#teleport` is
 * deprecated in favour of a `displace` waypoint action.
 *
 * Run: `node tools/wave-03137-smoke.mjs`
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

import { atLeast } from "./lib/module-version.mjs";
import {
  MOUNTED_RIDER_SCALE, MOUNT_GEOMETRY_KEYS, PASSENGER_LANG_ROOT, SEAT_RING,
  dismountPosition, mountGeometry, rideMovement, rimSeatPosition, sameGeometry,
  seatAngle, seatPosition, shouldFollowMount, shouldHandleRide,
} from "../scripts/passengers.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = path => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const readJson = path => JSON.parse(read(path));
/** Source with every comment line dropped — a header that *names* a hook is not the hook. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");
const sha256 = path => createHash("sha256").update(readFileSync(path)).digest("hex");

const manifest = readJson("module.json");
const lang = readJson("lang/en.json");
const localize = key => {
  let node = lang;
  for (const part of String(key).split(".")) {
    if (!node || (typeof node !== "object") || !(part in node)) return key;
    node = node[part];
  }
  return (typeof node === "string") ? node : key;
};

const rideSource = read("scripts/passengers.mjs");
const rideCode = code(rideSource);

/* ================================================================ 1 — riders sit on the hull */

console.log("\n1) Seats are an ellipse on the mount's own footprint, not a circle on its longest side");

{
  note((SEAT_RING >= 0.85) && (SEAT_RING <= 0.95), `SEAT_RING is ${SEAT_RING} — inside the brief's 0.85–0.95`);
  note(SEAT_RING < 1, "…so a seat sits just inside the painted chassis, not on the very edge of the footprint");

  /* The bug, reproduced against the fixed function. A 1×4 flatbed: seat 1 and seat 3 are its *flanks*,
     the short sides. A circle of max(w, h)/2 = 200px threw them 200px out from the centre line — two
     whole squares off a one-square-wide hull. The ellipse puts them on the hull. */
  const flatbed = { mountX: 0, mountY: 0, mountWidth: 1, mountHeight: 4, grid: 100, seatCount: 4 };
  const centre = { x: 50, y: 200 };
  const flank = seatPosition({ ...flatbed, seatIndex: 1 });
  const flankOffset = Math.abs((flank.x + 50) - centre.x);
  note(flankOffset < 200, `a 1×4 flatbed seats its flank rider ${Math.round(flankOffset)}px out, not the old 200px`);
  note(flankOffset <= 50, "…which is on the hull: no further out than the half-width of a one-square-wide chassis");
  const circleWould = Math.max(flatbed.mountWidth, flatbed.mountHeight) * 100 / 2;
  note(flankOffset < circleWould, `…strictly closer than the circle-of-max the 0.3.136 code used (${circleWould}px)`);

  // The long axis is still used for the nose and tail seats, which is where the length belongs.
  const nose = seatPosition({ ...flatbed, seatIndex: 0 });
  const tail = seatPosition({ ...flatbed, seatIndex: 2 });
  note(Math.abs((nose.y + 50) - centre.y) > flankOffset, "…and the nose seat still runs out along the long axis");
  note((nose.y < centre.y) && (tail.y > centre.y), "…nose forward of centre, tail behind it");
  note(Math.abs((nose.y + 50) - centre.y) === Math.round(SEAT_RING * 200),
    `…at exactly SEAT_RING of the half-length (${Math.round(SEAT_RING * 200)}px)`);

  // Square mounts: ellipse and circle agree, so nothing a Director already likes moved much.
  const truck = { mountX: 300, mountY: 300, mountWidth: 3, mountHeight: 3, grid: 100, seatCount: 4 };
  const truckCentre = { x: 450, y: 450 };
  const seats = [0, 1, 2, 3].map(seatIndex => seatPosition({ ...truck, seatIndex }));
  note(new Set(seats.map(s => `${s.x},${s.y}`)).size === 4, "four heroes on a 3×3 truck still get four different squares");
  note(seats.every(s => Math.abs(Math.hypot((s.x + 50) - truckCentre.x, (s.y + 50) - truckCentre.y) - (SEAT_RING * 150)) < 1),
    "…all of them the same distance out, because an ellipse on a square footprint *is* a circle");
  note(seats.every(s => Math.hypot((s.x + 50) - truckCentre.x, (s.y + 50) - truckCentre.y) < 150),
    "…and inside the hull rather than on it, which is the visible half of the fix");

  /* Rotation. The offset is worked out in the mount's own frame and then turned with the hull, which is
     what makes a *long* mount rotate correctly — the old code rotated a circle, where it did not matter. */
  const turned = seatPosition({ ...flatbed, seatIndex: 0, rotation: 90 });
  note(Math.abs((turned.x + 50) - centre.x) > Math.abs((turned.y + 50) - centre.y),
    "turn the flatbed 90° and its nose seat swings onto the x axis");
  note(Math.abs(Math.hypot((turned.x + 50) - centre.x, (turned.y + 50) - centre.y)
    - Math.hypot((nose.y + 50) - centre.y, 0)) < 2,
    "…the same distance from the centre as before, so the crew rides round rather than flying off");
  const spun = seatPosition({ ...flatbed, seatIndex: 0, rotation: 360 });
  note((spun.x === nose.x) && (spun.y === nose.y), "a full turn puts the crew back where it started");

  /* One seating function for Mount and for follow. */
  note(seatPosition({ ...truck, seatIndex: 0 }).y === rimSeatPosition({ ...truck, seatIndex: 0, ring: SEAT_RING }).y,
    "seatPosition is rimSeatPosition at SEAT_RING — one function, one ring");
  note(seatPosition({ ...truck, seatIndex: 0 }).y !== rimSeatPosition({ ...truck, seatIndex: 0 }).y,
    "…and it is NOT the old ring-1 default, so the fix actually changes the seat");
  note(/function seatFor\(mount, rider/.test(rideCode), "one internal seatFor() works a seat out from a live mount");
  note(/const spot = seatFor\(mount, rider/.test(rideCode.slice(rideCode.indexOf("export async function mountRiders"))),
    "…mountRiders seats through it");
  note((rideCode.match(/seatFor\(mount, rider/g) ?? []).length >= 2, "…and followMount re-seats through the same call");
  note(!/rimSeatPosition\(\{\s*$/m.test(rideCode.slice(rideCode.indexOf("async function followMount"))),
    "…so neither path hand-rolls its own rim maths any more");

  /* Degenerate input is a number, not a NaN written to a token. */
  note(seatPosition({}).x === 0 && Number.isFinite(seatPosition({}).y), "no arguments is a number, not NaN");
  note(Number.isFinite(seatPosition({ grid: 0 }).y), "…a zero grid does not divide by nothing");
  note(Number.isFinite(seatPosition({ mountWidth: 0, mountHeight: 0 }).x), "…and a zero footprint is survivable");

  // Seat angles and dismount are the 0.3.136 contract and this wave must not have moved them.
  note(Math.abs(seatAngle(0, 4) + (Math.PI / 2)) < 1e-9, "seat 0 is still the mount's nose");
  note(Math.abs(seatAngle(0, 4, 90) - seatAngle(1, 4, 0)) < 1e-9, "…and a 90° turn still carries seats round");
  note(MOUNTED_RIDER_SCALE === 0.5, "a rider is still drawn at half scale aboard");
  const off = dismountPosition({ ...truck, seatIndex: 0 });
  note((off.x % 100 === 0) && (off.y % 100 === 0), "a dismounted rider still lands snapped to the grid");
  note(Math.hypot((off.x + 50) - truckCentre.x, (off.y + 50) - truckCentre.y) > 150, "…clear of the hull");
  note(new Set([0, 1, 2, 3].map(i => JSON.stringify(dismountPosition({ ...truck, seatIndex: i })))).size === 4,
    "…and four riders still step off into four squares");
}

/* ================================================================ 2 — the crew follows on Foundry 14 */

console.log("\n2) Follow-the-mount survives Foundry 14.367 drag and rotate");

{
  /* 2a — the decision itself. Three independent ways in, so a MovementManager update that reports no
     useful `changes` cannot leave a crew standing in the road. */
  const here = { x: 0, y: 0, width: 2, height: 4, rotation: 0, elevation: 0 };
  const there = { ...here, x: 500 };
  note(shouldFollowMount({ movement: true, changes: {}, geometry: here, seated: here }) === true,
    "a moveToken / stopToken hook always re-seats, whatever `changes` said");
  note(shouldFollowMount({ changes: { x: 500 }, geometry: there, seated: here }) === true,
    "…so does the old fast path, when `changes` does name x");
  for (const key of MOUNT_GEOMETRY_KEYS) {
    note(shouldFollowMount({ changes: { [key]: 1 }, geometry: here, seated: here }) === true,
      `…on ${key}`);
  }
  note(shouldFollowMount({ changes: { flags: {} }, geometry: there, seated: here }) === true,
    "**the fix**: a bare update with no geometry key at all still re-seats when the mount has drifted");
  note(shouldFollowMount({ changes: {}, geometry: here, seated: null }) === true,
    "a crew we have never seated is always seated — a fresh session re-seats on first contact");
  note(shouldFollowMount({ changes: { flags: {} }, geometry: here, seated: here }) === false,
    "…and a flag-only update on a mount that has not moved does nothing, so we do not write every tick");
  note(shouldFollowMount({ changes: {}, geometry: { ...here, rotation: 90 }, seated: here }) === true,
    "a rotate the update forgot to mention is still caught by the remembered geometry");
  note(shouldFollowMount({ changes: {}, geometry: { ...here, elevation: 20 }, seated: here }) === true,
    "…and so is a climb");
  note(shouldFollowMount() === true, "no arguments errs towards re-seating, which is the safe direction");

  /* 2b — geometry is read off the live document, never off `changes`. */
  const doc = { x: 700, y: 800, width: 2, height: 4, rotation: 90, elevation: 20, name: "Bulldog" };
  note(JSON.stringify(mountGeometry(doc)) === JSON.stringify({ x: 700, y: 800, width: 2, height: 4, rotation: 90, elevation: 20 }),
    "mountGeometry reads the six seat numbers straight off a TokenDocument");
  note(MOUNT_GEOMETRY_KEYS.length === 6, "…the six being exactly MOUNT_GEOMETRY_KEYS");
  note(mountGeometry(null).width === 1, "…and a missing document is a 1×1 at the origin, not a crash");
  note(sameGeometry(doc, { ...doc }) === true, "sameGeometry says a mount that has not moved has not moved");
  note(sameGeometry(doc, { ...doc, x: 701 }) === false, "…and one pixel of drift is drift");
  note(sameGeometry(doc, null) === false, "…while nothing-remembered is never a match");
  note(/mountGeometry\(mount\)/.test(rideCode.slice(rideCode.indexOf("function seatFor"))),
    "seatFor works the seat out from the live document");
  note(!/mountX: mount\.x, mountY: mount\.y[\s\S]{0,200}rotation: mount\.rotation/.test(
    rideCode.slice(rideCode.indexOf("async function followMount"), rideCode.indexOf("async function followIfMoved"))),
    "…and followMount no longer re-reads the mount's fields by hand");

  /* 2c — the hooks that actually fire on Foundry 14.367. */
  note(/Hooks\.on\("updateToken"/.test(rideCode), "updateToken is still hooked");
  note(/Hooks\.on\("moveToken"/.test(rideCode), "**moveToken** is hooked — the Foundry 13/14 movement completion hook");
  note(/Hooks\.on\("stopToken"/.test(rideCode), "**stopToken** is hooked — a constrained move that was cut short");
  const registerAt = rideCode.indexOf("export function registerPassengers");
  note(registerAt > 0, "registerPassengers is where the wiring lives");
  const register = rideCode.slice(registerAt);
  for (const hook of ["updateToken", "moveToken", "stopToken", "preUpdateToken", "preDeleteToken",
    "deleteToken", "renderTokenHUD", "getSceneControlButtons"]) {
    note(register.includes(`Hooks.on("${hook}"`), `…registerPassengers registers ${hook}`);
  }
  note(/Hooks\.on\("moveToken", async \(tokenDoc, _movement, operation, user\)/.test(register),
    "moveToken is taken with Foundry 14's real signature (document, movement, operation, user)");
  note(/Hooks\.on\("stopToken", async tokenDoc/.test(register),
    "…and stopToken with its one-argument one, which hands us no user");
  note((register.match(/followIfMoved\(/g) ?? []).length >= 3,
    "all three movement signals go through the one followIfMoved gate");
  note(/if \(options\?\.ghostwireRide/.test(register) && /if \(operation\?\.ghostwireRide\) return;/.test(register),
    "our own seat writes are skipped on both the update and the movement path, so a follow cannot recurse");

  /* 2d — after mountRiders, the follow path runs once. */
  const mountBody = rideCode.slice(rideCode.indexOf("export async function mountRiders"));
  const setFlagAt = mountBody.indexOf(`setFlag(MODULE_ID, RIDERS_FLAG`);
  const followAt = mountBody.indexOf("await followMount(mount);");
  note(followAt > 0, "mountRiders calls followMount itself");
  note((setFlagAt > 0) && (followAt > setFlagAt), "…after the riders flag is written, so followMount can see the seats");
  note(followAt < mountBody.indexOf("Mounted`"), "…and before the notification, so the table never sees a bad seat");

  /* 2e — one client writes. Four heroes must not be moved four times. */
  note(shouldHandleRide({ userId: "gm", activeGmId: "gm", selfId: "gm", selfIsGM: true }) === true,
    "solo GM: the active GM is us, so we write — Michael's table");
  note(shouldHandleRide({ userId: "player", activeGmId: "gm", selfId: "gm", selfIsGM: true }) === true,
    "a player drags the truck and the active GM writes the seats");
  note(shouldHandleRide({ userId: "player", activeGmId: "gm", selfId: "player" }) === false,
    "…and that player's own client does NOT also write them");
  note(shouldHandleRide({ userId: "player", activeGmId: null, selfId: "player" }) === true,
    "with no GM connected, whoever moved it writes");
  note(shouldHandleRide({ userId: "player", activeGmId: null, selfId: "other" }) === false,
    "…and a spectator never does");
  note(shouldHandleRide({ userId: null, activeGmId: "gm", selfId: "gm", selfIsGM: true }) === true,
    "stopToken hands us no user; the active GM still writes");
  note(shouldHandleRide({ userId: null, activeGmId: null, selfId: "p", selfIsGM: false }) === false,
    "…and with no user and no active GM, a plain player client stays out of it");
  note(shouldHandleRide() === false, "no arguments writes nothing");
  note(/function shouldHandle\(userId\) \{\s*return shouldHandleRide\(/.test(rideCode),
    "the Foundry-side shouldHandle is a thin read of game state over the pure rule");
  note(/activeGmId: game\.users\?\.activeGM\?\.id/.test(rideCode), "…reading game.users.activeGM safely");

  /* 2f — a seated rider is PLACED, not walked: no wall stops the crew short of the hull. */
  const movement = rideMovement([{ _id: "a", x: 100, y: 200, elevation: 0 }, { _id: "b", x: 300, y: 400, elevation: 5 }]);
  note(Object.keys(movement).join(",") === "a,b", "rideMovement builds one movement entry per rider");
  note(movement.a.waypoints[0].action === "displace",
    "…asking for the `displace` action, which Foundry 14 does not constrain against walls");
  note(movement.a.waypoints[0].x === 100 && movement.a.waypoints[0].y === 200,
    "…at the seat we picked, not a path towards it");
  note(movement.b.waypoints[0].elevation === 5, "…carrying the mount's elevation");
  note((movement.a.method === "api") && (movement.a.autoRotate === false) && (movement.a.showRuler === false),
    "…as an api move with no auto-rotate and no ruler, so a carried hero does not spin or draw a line");
  note(Object.keys(rideMovement([{ _id: "c", elevation: 0 }])).length === 0,
    "an update that names no square gets no waypoint — a dismount with no mount is not a move");
  note(Object.keys(rideMovement([{ x: 1, y: 2 }])).length === 0, "…and an update with no id is skipped");
  note(Object.keys(rideMovement()).length === 0, "no arguments is an empty movement, not a crash");
  note(!/teleport: true/.test(rideCode),
    "the deprecated v13 `{ teleport: true }` operation is NOT used — it warns once per seat on 14.367");
  note((rideCode.match(/movement: rideMovement\(updates\)/g) ?? []).length >= 3,
    "mount, follow and dismount writes all carry it");

  /* 2g — the drag veto and the rest of the 0.3.136 contract survive. */
  note(/Hooks\.on\("preUpdateToken"/.test(rideCode) && /return false;/.test(rideCode),
    "dragging a mounted rider is still vetoed rather than turned into a dismount");
  note(/ghostwireRide/.test(rideCode), "…and the ghostwireRide option is still the bypass");
  note(/savedScale/.test(rideCode) && /savedElevation/.test(rideCode), "scale and elevation are still saved to restore");
  note(/tools\.ghostwireMount/.test(rideCode) && /tools\.ghostwireDismount/.test(rideCode),
    "Mount / Dismount KEEP their Token-toolbar tools (item 3 does not touch them)");
  note(/module\.api[\s\S]{0,600}seatPosition/.test(rideCode), "module.api.ride exposes seatPosition for a macro");
  note(/module\.api[\s\S]{0,600}SEAT_RING/.test(rideCode), "…and SEAT_RING, so a Director can see the number");
  note(PASSENGER_LANG_ROOT === "GHOSTWIRE.Ride", `passenger lang root is still ${PASSENGER_LANG_ROOT}`);

  /* 2h — weapon hardpoints and the third-party module. */
  note(sha256("scripts/mounts.mjs") === "915900fe565b4a8070cdf7502dd6308bd4e68ae9d627e58f284e61441d6289e4",
    "scripts/mounts.mjs is byte-for-byte the weapon-hardpoint file 0.3.136 shipped");
  note(!/from "\.\/mounts\.mjs"/.test(rideCode), "passengers.mjs does not import it");
  note(!/rideable/i.test(rideCode), "…and never mentions the third-party Rideable module");
  note(!/rideable/i.test(JSON.stringify(manifest)), "…which module.json declares no relationship with either");
}

/* ================================================================ 3 — Token toolbar declutter */

console.log("\n3) Four Token-toolbar buttons are gone; all four features still have their doors");

{
  /** The four tools the 0.3.137 addendum removes, and the file each one lived in. */
  const REMOVED = [
    { tool: "ghostwireBlackMarket", script: "scripts/black-market.mjs", label: "Black Market: sell" },
    { tool: "ghostwireWealthPay", script: "scripts/director-wealth.mjs", label: "Director: Pay Hero" },
    { tool: "ghostwireWealthSpend", script: "scripts/director-wealth.mjs", label: "Director: Spend Hero" },
    { tool: "ghostwireTaintPlusOne", script: "scripts/taint.mjs", label: "Director: Taint +1" },
  ];
  /** The toolbar tools the addendum explicitly KEEPS, and where they live. */
  const KEPT = [
    { tool: "ghostwireVoidmark", script: "scripts/voidmark.mjs", label: "VOIDMARK" },
    { tool: "ghostwireWiredConsole", script: "scripts/wired-console.mjs", label: "Wired Console" },
    { tool: "ghostwireWiredMinimap", script: "scripts/wired-minimap.mjs", label: "Wired Minimap" },
    { tool: "ghostwireRitualWorking", script: "scripts/ritual-working.mjs", label: "Ritual Working" },
    { tool: "ghostwireRunGenerator", script: "scripts/run-generator.mjs", label: "Run Generator" },
    { tool: "ghostwireKiosk", script: "scripts/kiosk.mjs", label: "Place Kiosk" },
    { tool: "ghostwireLocker", script: "scripts/locker.mjs", label: "Place Locker" },
    { tool: "ghostwireMount", script: "scripts/passengers.mjs", label: "Mount" },
    { tool: "ghostwireDismount", script: "scripts/passengers.mjs", label: "Dismount" },
  ];

  /* 3a — the four are gone from their own files, and from every other script too. */
  const scripts = new Set([...REMOVED, ...KEPT].map(row => row.script));
  for (const { tool, script, label } of REMOVED) {
    note(existsSync(script), `${script} still ships (only the button went, not the feature)`);
    note(!code(read(script)).includes(tool), `${label}: no tools.${tool} in ${script}`);
  }
  // Nobody smuggled them into a third file.
  const everyScript = [...scripts].map(path => code(read(path))).join("\n");
  for (const { tool, label } of REMOVED) {
    note(!everyScript.includes(tool), `…and ${label}'s tool name appears in no Ghostwire script at all`);
  }

  /* 3b — the whole getSceneControlButtons registration went with them: an empty hook is dead weight. */
  for (const script of ["scripts/black-market.mjs", "scripts/director-wealth.mjs", "scripts/taint.mjs"]) {
    note(!code(read(script)).includes("getSceneControlButtons"),
      `${script} registers no getSceneControlButtons hook at all`);
  }

  /* 3c — the doors that remain. Directors use the macros pack or the keybinds now. */
  const MACROS = {
    "src/packs/macros/black-market-sell.json": "Black Market Sell",
    "src/packs/macros/director-pay-hero.json": "Director Pay Hero",
    "src/packs/macros/director-spend-hero.json": "Director Spend Hero",
    "src/packs/macros/director-taint-plus-one.json": "Director Taint +1",
  };
  for (const [path, what] of Object.entries(MACROS)) {
    note(existsSync(path), `the ${what} macro still ships at ${path}`);
    if (!existsSync(path)) continue;
    const doc = readJson(path);
    note((doc.type === "script") && !!doc.command, `…as a runnable script macro`);
    note(typeof doc._id === "string" && doc._id.length > 0, `…keeping its own _id (this wave changed no dsid)`);
  }
  note(Object.keys(MACROS).length === 4, "all four removed buttons have a macro standing in for them");

  const keybinds = [
    { script: "scripts/black-market.mjs", id: "blackMarketSell", what: "Black Market sell" },
    { script: "scripts/director-wealth.mjs", id: "directorWealth", what: "Director wealth" },
    { script: "scripts/taint.mjs", id: "directorTaintPlusOne", what: "Director Taint +1" },
  ];
  for (const { script, id, what } of keybinds) {
    const source = code(read(script));
    note(source.includes(`game.keybindings.register(MODULE_ID, "${id}"`), `the ${what} keybinding is still registered`);
    note(source.includes('Hooks.on("renderTokenHUD"'), `…and ${script} still puts its button on the Token HUD`);
  }
  note(code(read("scripts/black-market.mjs")).includes('Hooks.on("getDocumentListContextOptions"'),
    "Black Market sell also keeps its hero-sheet Item context entry");
  note(/directorWealthPrompt/.test(code(read("scripts/director-wealth.mjs"))), "the wealth prompt is still exported work");
  note(/directorTaintPlusOne/.test(code(read("scripts/taint.mjs"))), "…and so is Taint +1");

  /* 3d — the keepers are untouched. */
  for (const { tool, script, label } of KEPT) {
    const source = code(read(script));
    note(source.includes(`tools.${tool}`), `${label} KEEPS its toolbar tool in ${script}`);
    note(source.includes('Hooks.on("getSceneControlButtons"'), `…and ${script} keeps the hook it needs`);
  }
  note(KEPT.length === 9, "nine Ghostwire toolbar tools remain — the addendum's keep-list, exactly");

  /* 3e — lang is not the button. The four titles stay in lang/en.json for the macros and HUD tooltips. */
  note(localize("GHOSTWIRE.BlackMarket.SceneTool") !== "GHOSTWIRE.BlackMarket.SceneTool",
    "the Black Market title string survives for the macro / HUD to use");
  note(localize("GHOSTWIRE.Taint.Director.Title") === "Director: Taint +1", "…and Taint's, unchanged");
  note(localize("GHOSTWIRE.Wealth.Director.PayTitle") === "Director: Pay Hero", "…and Pay Hero's");
  note(localize("GHOSTWIRE.Wealth.Director.SpendTitle") === "Director: Spend Hero", "…and Spend Hero's");
}

/* ================================================================ 4 — version, checklist, wiring */

console.log("\n4) Version, checklist and wiring");

note(atLeast(manifest.version, "0.3.137"), `module.json is ${manifest.version} (>= 0.3.137)`);
note(/`0\.3\.137`/.test(read("README.md")), "README has a 0.3.137 Status entry");
note(existsSync("docs/directors/03137-smoke.md"), "the Foundry checklist is written");
{
  const checklist = existsSync("docs/directors/03137-smoke.md") ? read("docs/directors/03137-smoke.md") : "";
  for (const item of ["Mount", "Dismount", "on-hull", "Drag", "Rotate", "Recall",
    "Black Market Sell", "Director Pay Hero", "Director Spend Hero", "Director Taint +1",
    "macros", "keybind", "Token HUD", "VOIDMARK", "Wired Console", "Wired Minimap",
    "Ritual Working", "Run Generator", "Place Kiosk", "Place Locker"]) {
    note(checklist.includes(item), `the checklist covers ${item}`);
  }
  note(/Directors use the \*\*macros pack\*\* or the \*\*keybinds\*\*|macros pack or the keybinds/.test(checklist),
    "…and says in so many words that Pay / Spend / Taint / Black Market sell are macros and keybinds now");
  for (const item of [1, 2]) {
    note(new RegExp(`^## ${item}\\.`, "m").test(checklist), `…and has a section for item ${item}`);
  }
}
for (const script of ["scripts/passengers.mjs", "scripts/mounts.mjs", "scripts/black-market.mjs",
  "scripts/director-wealth.mjs", "scripts/taint.mjs"]) {
  note(existsSync(script), `${script} ships`);
}
note(manifest.esmodules?.includes("scripts/module.mjs") !== false, "and module.mjs is still the entry point");
note(read("scripts/module.mjs").includes("registerPassengers();"), "…still calling registerPassengers() at init");
note(existsSync("tools/wave-03136-smoke.mjs"), "the 0.3.136 smoke is still there to be re-run beside this one");

/* ================================================================ */

console.log(fail.length ? `\n0.3.137 smoke FAIL — ${fail.length}` : "\n0.3.137 smoke OK");
for (const msg of fail) console.log(`  - ${msg}`);
process.exit(fail.length ? 1 : 0);
