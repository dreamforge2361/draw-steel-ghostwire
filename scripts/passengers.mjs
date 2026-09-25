// Passengers (0.3.136) — Ghostwire-native **Mount / Dismount**: hero tokens ride a machine token.
//
// The third-party Rideable module was doing this badly, so Ghostwire owns it now. The whole feature
// is two flags and one rule:
//
//   rider token:  flags.<module>.riding = { mountId, mountUuid, sceneId, seatIndex, seatCount,
//                                           savedScale, savedElevation }
//   mount token:  flags.<module>.riders = [{ tokenId, seatIndex }, …]
//
//   …and while `riding` is set, the rider does not move on its own. The mount moves it.
//
// **Naming.** `scripts/mounts.mjs` is *weapon hardpoints* (0.3.112) — a gun bolted to a Turret Ring.
// Nothing in this file touches it, imports it, or shares a lang key with it. Weapon Mount / Unmount
// keeps `GHOSTWIRE.Mounts.*`; passengers get `GHOSTWIRE.Ride.*`.
//
// **Where riders sit.** On the *rim*, not on top. Riders shrink to half art scale and orbit the mount
// token's bounding circle at a fixed seat angle, so a 3-square Bulldog with four heroes aboard reads
// as a crewed truck rather than a pile of overlapping portraits. The seat angle is relative to the
// mount's rotation, so turning the truck carries its crew around with it.
//
// **Capacity.** No Ghostwire chassis carries a crew-seat number in its data — `vehicle.stations` is
// declared in `machines.mjs` and empty on every shipped SKU — so the band decides, per the 0.3.136
// brief's default: Micro cannot carry, Small carries 1, Medium carries 2, and vehicles carry by band.
// A Director who wants a different number sets `flags.<module>.machine.seats` on the machine Actor.
//
// Everything above `registerPassengers` is Foundry-free so `tools/wave-03136-smoke.mjs` can run the
// real seat maths and the real capacity table offline.

import { isMachineKindDocument } from "./machines.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Ride";

/** Flag on a rider token while it is aboard something. */
export const RIDING_FLAG = "riding";
/** Flag on a mount token listing who is aboard. */
export const RIDERS_FLAG = "riders";

/** Art scale a rider is drawn at while aboard. The token footprint never changes. */
export const MOUNTED_RIDER_SCALE = 0.5;

/**
 * Passenger seats per machine band. **Default rule, 0.3.136** — no shipped chassis carries a seat
 * count, so the band answers for it.
 *
 * Drones follow the brief's lock: a Micro drone is a flying camera and carries nobody, a Small drone
 * is a Guard-Dog you can stand on for one square of ride, a Medium drone is a Mule-Bot with room for
 * two. Vehicles are read off their own band the obvious way — a bike takes a pillion, a car takes a
 * crew, a heavy takes a squad.
 */
export const SEAT_CAPACITY = Object.freeze({
  "drone-micro": 0,
  "drone-small": 1,
  "drone-medium": 2,
  "vehicle-bike": 2,
  "vehicle-car": 4,
  "vehicle-heavy": 6,
  "vehicle-air": 4,
  "vehicle-water": 4,
  "vehicle-space": 4,
});

/**
 * How many riders a machine can carry.
 *
 * Order of authority, most specific first: an explicit `seats` override the Director set, a numeric
 * `stations` / `crewStations` string from the chassis data, then the band table. A base asset — a
 * Door Lock, a workshop bench — is furniture and carries nobody whatever band it borrowed.
 *
 * @param {string|null} band       `flags.<module>.band` on the machine Actor.
 * @param {object} [machine]       `flags.<module>.machine` from the machine Actor.
 * @returns {number} seats, never negative, never fractional.
 */
export function seatCapacity(band, machine = null) {
  if (machine?.baseAsset || machine?.kind === "baseAsset") return 0;
  const explicit = Number(machine?.seats);
  if (Number.isFinite(explicit)) return Math.max(0, Math.trunc(explicit));
  const stations = String(machine?.stations ?? machine?.crewStations ?? "").match(/\d+/);
  if (stations) return Math.max(0, Number(stations[0]));
  return SEAT_CAPACITY[String(band ?? "").replace(/^machine-/, "")] ?? 0;
}

/**
 * The angle, in radians, of a seat on the rim. Seat 0 is the mount's nose (straight up on an
 * unrotated token); the rest run clockwise, evenly spaced over the *capacity*, not over the riders
 * actually aboard — so seat 2 of 4 is the same place whether one hero is up there or four.
 *
 * @param {number} seatIndex
 * @param {number} seatCount    the mount's capacity
 * @param {number} [rotation]   the mount token's rotation in degrees
 */
export function seatAngle(seatIndex, seatCount, rotation = 0) {
  const count = Math.max(1, Math.trunc(Number(seatCount)) || 1);
  const raw = Math.trunc(Number(seatIndex)) || 0;
  const i = ((raw % count) + count) % count;
  const spin = ((Number(rotation) || 0) * Math.PI) / 180;
  return (-Math.PI / 2) + ((2 * Math.PI * i) / count) + spin;
}

/**
 * Top-left pixel position for a rider sitting on a mount's rim.
 *
 * `ring` scales the orbit radius: 1 puts the rider centred on the mount's bounding circle (aboard),
 * and `dismountPosition` pushes it out past the hull.
 *
 * @returns {{x: number, y: number}} integer pixels, top-left, the shape a TokenDocument update wants.
 */
export function rimSeatPosition({
  mountX = 0, mountY = 0, mountWidth = 1, mountHeight = 1,
  riderWidth = 1, riderHeight = 1,
  seatIndex = 0, seatCount = 1, rotation = 0, grid = 100, ring = 1,
} = {}) {
  const size = Math.max(1, Number(grid) || 100);
  const centreX = Number(mountX) + ((Number(mountWidth) || 1) * size / 2);
  const centreY = Number(mountY) + ((Number(mountHeight) || 1) * size / 2);
  const radius = (Math.max(Number(mountWidth) || 1, Number(mountHeight) || 1) * size / 2) * (Number(ring) || 1);
  const theta = seatAngle(seatIndex, seatCount, rotation);
  return {
    x: Math.round(centreX + (radius * Math.cos(theta)) - ((Number(riderWidth) || 1) * size / 2)),
    y: Math.round(centreY + (radius * Math.sin(theta)) - ((Number(riderHeight) || 1) * size / 2)),
  };
}

/**
 * Where a rider is put down when it dismounts: one clear rider-square past the rim, on its own seat
 * angle, snapped to the grid — so four heroes stepping off a truck end up in four different squares
 * instead of stacked on the driver's door.
 */
export function dismountPosition(options = {}) {
  const size = Math.max(1, Number(options.grid) || 100);
  const riderWidth = Number(options.riderWidth) || 1;
  const mountSpan = Math.max(Number(options.mountWidth) || 1, Number(options.mountHeight) || 1);
  const ring = (mountSpan + (riderWidth * 2)) / mountSpan;
  const spot = rimSeatPosition({ ...options, ring });
  return { x: Math.round(spot.x / size) * size, y: Math.round(spot.y / size) * size };
}

/**
 * Hand out seats to a batch of would-be riders.
 *
 * Seats fill lowest-index-first around whoever is already aboard, and a rider that finds no seat is
 * **refused**, not silently dropped: the caller tells the table which names did not fit.
 *
 * @param {{capacity?: number, occupied?: Array, incoming?: string[]}} options
 * @returns {{seated: Array<{tokenId: string, seatIndex: number}>, refused: string[], capacity: number, used: number}}
 */
export function mountPlan({ capacity = 0, occupied = [], incoming = [] } = {}) {
  const seats = Math.max(0, Math.trunc(Number(capacity)) || 0);
  const taken = new Set();
  for (const entry of occupied ?? []) {
    const index = Number(entry?.seatIndex ?? entry);
    if (Number.isInteger(index)) taken.add(index);
  }
  const seated = [];
  const refused = [];
  for (const tokenId of incoming ?? []) {
    let seat = null;
    for (let i = 0; i < seats; i += 1) if (!taken.has(i)) { seat = i; break; }
    if (seat === null) { refused.push(tokenId); continue; }
    taken.add(seat);
    seated.push({ tokenId, seatIndex: seat });
  }
  return { seated, refused, capacity: seats, used: taken.size };
}

/** The riders list on a mount token, always an array. */
export function ridersOf(tokenDoc) {
  const list = tokenDoc?.flags?.[MODULE_ID]?.[RIDERS_FLAG]
    ?? (typeof tokenDoc?.getFlag === "function" ? tokenDoc.getFlag(MODULE_ID, RIDERS_FLAG) : null);
  return Array.isArray(list) ? list.filter(entry => entry?.tokenId) : [];
}

/** The `riding` record on a rider token, or null. */
export function ridingRecord(tokenDoc) {
  const record = tokenDoc?.flags?.[MODULE_ID]?.[RIDING_FLAG]
    ?? (typeof tokenDoc?.getFlag === "function" ? tokenDoc.getFlag(MODULE_ID, RIDING_FLAG) : null);
  return (record && typeof record === "object" && record.mountId) ? record : null;
}

/** True when this token is aboard something. */
export function isRiding(tokenDoc) {
  return !!ridingRecord(tokenDoc);
}

/**
 * Whether a rider's own update may go through.
 *
 * **Decision (0.3.136):** dragging a mounted rider is *ignored*, not treated as a Dismount. A stray
 * drag mid-combat must not quietly unseat somebody — the player uses **Dismount** and means it. Our
 * own follow-the-mount writes carry the `ghostwireRide` option and always pass.
 */
export function riderMoveBlocked(tokenDoc, changes = {}, options = {}) {
  if (options?.ghostwireRide) return false;
  if (!isRiding(tokenDoc)) return false;
  return ("x" in changes) || ("y" in changes) || ("elevation" in changes);
}

/* ================================================================ Foundry side */

/** One client does the writing: the active GM, or the user who moved the mount when there is none. */
function shouldHandle(userId) {
  if (game.users?.activeGM) return !!game.users.activeGM.isSelf;
  return userId === game.user?.id;
}

function gridSize(tokenDoc) {
  return tokenDoc?.parent?.grid?.size ?? canvas?.grid?.size ?? 100;
}

/** Band / machine block for a token's Actor, however the Actor was made. */
function machineData(tokenDoc) {
  const actor = tokenDoc?.actor ?? null;
  const flags = actor?.flags?.[MODULE_ID] ?? {};
  return { band: flags.band ?? null, machine: flags.machine ?? {} };
}

/** Seats on the machine this token stands for. Zero for anything that is not a machine. */
export function tokenSeatCapacity(tokenDoc) {
  if (!isMachineKindDocument(tokenDoc?.actor)) return 0;
  const { band, machine } = machineData(tokenDoc);
  return seatCapacity(band, machine);
}

/** True when this token is a machine with at least one seat. */
export function canCarryRiders(tokenDoc) {
  return tokenSeatCapacity(tokenDoc) > 0;
}

function warn(key, data) {
  ui.notifications.warn(data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
  return false;
}

/**
 * Put riders aboard a mount.
 *
 * @param {TokenDocument} mount
 * @param {TokenDocument[]} riders
 * @returns {Promise<boolean>} true when at least one rider was seated.
 */
export async function mountRiders(mount, riders = []) {
  if (!mount) return warn("NotMachine");
  const capacity = tokenSeatCapacity(mount);
  if (!isMachineKindDocument(mount.actor)) return warn("NotMachine");
  if (!capacity) return warn("NoSeats", { name: mount.name });

  const scene = mount.parent;
  const wanted = [];
  for (const rider of riders) {
    if (!rider || (rider.id === mount.id)) continue;
    if (rider.parent?.id !== scene?.id) continue;
    const record = ridingRecord(rider);
    if (record?.mountId === mount.id) continue;         // already aboard this one
    if (record) { warn("AlreadyRiding", { rider: rider.name, mount: mount.name }); continue; }
    wanted.push(rider);
  }
  if (!wanted.length) return warn("NoRiders");

  const occupied = ridersOf(mount);
  const plan = mountPlan({ capacity, occupied, incoming: wanted.map(rider => rider.id) });
  if (!plan.seated.length) return warn("Full", { name: mount.name, capacity });

  const byId = new Map(wanted.map(rider => [rider.id, rider]));
  const updates = [];
  for (const { tokenId, seatIndex } of plan.seated) {
    const rider = byId.get(tokenId);
    const spot = rimSeatPosition({
      mountX: mount.x, mountY: mount.y, mountWidth: mount.width, mountHeight: mount.height,
      riderWidth: rider.width, riderHeight: rider.height,
      seatIndex, seatCount: capacity, rotation: mount.rotation, grid: gridSize(mount),
    });
    updates.push({
      _id: tokenId,
      ...spot,
      elevation: mount.elevation ?? 0,
      "texture.scaleX": MOUNTED_RIDER_SCALE,
      "texture.scaleY": MOUNTED_RIDER_SCALE,
      [`flags.${MODULE_ID}.${RIDING_FLAG}`]: {
        mountId: mount.id,
        mountUuid: mount.uuid,
        sceneId: scene?.id ?? null,
        seatIndex,
        seatCount: capacity,
        savedScale: { x: rider.texture?.scaleX ?? 1, y: rider.texture?.scaleY ?? 1 },
        savedElevation: rider.elevation ?? 0,
      },
    });
  }
  await scene.updateEmbeddedDocuments("Token", updates, { ghostwireRide: true });
  await mount.setFlag(MODULE_ID, RIDERS_FLAG, [...occupied, ...plan.seated]);

  const names = plan.seated.map(seat => byId.get(seat.tokenId)?.name).filter(Boolean).join(", ");
  ui.notifications.info(game.i18n.format(`${L}.Mounted`, {
    riders: names, mount: mount.name, used: occupied.length + plan.seated.length, capacity,
  }));
  for (const tokenId of plan.refused) {
    warn("Refused", { rider: byId.get(tokenId)?.name ?? "", mount: mount.name, capacity });
  }
  return true;
}

/** Restore one rider to its own scale, elevation and a clear square beside the mount. */
function dismountUpdate(rider, mount) {
  const record = ridingRecord(rider);
  const saved = record?.savedScale ?? {};
  const spot = mount
    ? dismountPosition({
      mountX: mount.x, mountY: mount.y, mountWidth: mount.width, mountHeight: mount.height,
      riderWidth: rider.width, riderHeight: rider.height,
      seatIndex: record?.seatIndex ?? 0, seatCount: record?.seatCount ?? 1,
      rotation: mount.rotation, grid: gridSize(rider),
    })
    : null;
  return {
    _id: rider.id,
    ...(spot ?? {}),
    elevation: record?.savedElevation ?? rider.elevation ?? 0,
    "texture.scaleX": Number(saved.x) || 1,
    "texture.scaleY": Number(saved.y) || 1,
    [`flags.${MODULE_ID}.-=${RIDING_FLAG}`]: null,
  };
}

/**
 * Take riders off whatever they are riding.
 *
 * @param {TokenDocument[]} riders
 * @param {{notify?: boolean, mount?: TokenDocument|null}} [options]
 */
export async function dismountRiders(riders = [], { notify = true, mount = null } = {}) {
  const riding = (riders ?? []).filter(rider => isRiding(rider));
  if (!riding.length) {
    if (notify) warn("NotRiding", { rider: riders?.[0]?.name ?? "" });
    return false;
  }
  const byScene = new Map();
  const byMount = new Map();
  for (const rider of riding) {
    const scene = rider.parent;
    if (!scene) continue;
    const record = ridingRecord(rider);
    const host = mount ?? scene.tokens.get(record.mountId) ?? null;
    if (!byScene.has(scene.id)) byScene.set(scene.id, { scene, updates: [] });
    byScene.get(scene.id).updates.push(dismountUpdate(rider, host));
    if (record.mountId) {
      if (!byMount.has(record.mountId)) byMount.set(record.mountId, { host, ids: [] });
      byMount.get(record.mountId).ids.push(rider.id);
    }
  }
  for (const { scene, updates } of byScene.values()) {
    await scene.updateEmbeddedDocuments("Token", updates, { ghostwireRide: true });
  }
  for (const { host, ids } of byMount.values()) {
    if (!host) continue;
    const kept = ridersOf(host).filter(seat => !ids.includes(seat.tokenId));
    if (kept.length) await host.setFlag(MODULE_ID, RIDERS_FLAG, kept);
    else await host.unsetFlag(MODULE_ID, RIDERS_FLAG);
  }
  if (notify) {
    ui.notifications.info(game.i18n.format(`${L}.Dismounted`, {
      riders: riding.map(rider => rider.name).join(", "),
    }));
  }
  return true;
}

/** Everyone off. Used by the HUD and by the mount's own deletion. */
export async function dismountAll(mount, { notify = true } = {}) {
  const scene = mount?.parent;
  const seats = ridersOf(mount);
  if (!scene || !seats.length) {
    if (notify) warn("NoPassengers", { name: mount?.name ?? "" });
    return false;
  }
  const riders = seats.map(seat => scene.tokens.get(seat.tokenId)).filter(Boolean);
  return dismountRiders(riders, { notify, mount });
}

/** Move every rider to its seat after the mount has moved, turned or changed elevation. */
async function followMount(mount) {
  const scene = mount?.parent;
  const seats = ridersOf(mount);
  if (!scene || !seats.length) return;
  const capacity = tokenSeatCapacity(mount) || seats.length;
  const grid = gridSize(mount);
  const updates = [];
  const orphaned = [];
  for (const seat of seats) {
    const rider = scene.tokens.get(seat.tokenId);
    if (!rider) { orphaned.push(seat.tokenId); continue; }
    const spot = rimSeatPosition({
      mountX: mount.x, mountY: mount.y, mountWidth: mount.width, mountHeight: mount.height,
      riderWidth: rider.width, riderHeight: rider.height,
      seatIndex: seat.seatIndex, seatCount: capacity, rotation: mount.rotation, grid,
    });
    updates.push({ _id: rider.id, ...spot, elevation: mount.elevation ?? 0 });
  }
  if (updates.length) await scene.updateEmbeddedDocuments("Token", updates, { ghostwireRide: true, animate: true });
  // A rider token deleted out from under us leaves a dead seat; drop it rather than carry a ghost.
  if (orphaned.length) {
    const kept = seats.filter(seat => !orphaned.includes(seat.tokenId));
    if (kept.length) await mount.setFlag(MODULE_ID, RIDERS_FLAG, kept);
    else await mount.unsetFlag(MODULE_ID, RIDERS_FLAG);
  }
}

/**
 * Work out who is riding what from the user's selection and targets.
 *
 * Right-clicking a token to open its HUD *takes control of it*, which drops whatever else was
 * selected — so "select two heroes, right-click the truck, press Mount" cannot work off the selection
 * alone. **Targets** survive a selection change, so a targeted machine is the mount and everything
 * selected rides it. With nothing targeted, the one controlled machine is the mount and the rest of
 * the selection rides it.
 *
 * Pure: `carries` is injected so the smoke can run the resolution offline.
 *
 * @param {{controlled?: object[], targets?: object[], carries?: (doc: object) => boolean}} options
 * @returns {{mount: object|null, riders: object[]}}
 */
export function resolveRideParty({ controlled = [], targets = [], carries = canCarryRiders } = {}) {
  const machine = list => (list ?? []).filter(doc => doc && carries(doc))[0] ?? null;
  const mount = machine(targets) ?? machine(controlled);
  const pool = [...(controlled ?? []), ...(targets ?? [])];
  const riders = [];
  const seen = new Set();
  for (const doc of pool) {
    if (!doc || (doc.id && seen.has(doc.id))) continue;
    if (mount && (doc.id === mount.id)) continue;
    if (doc.id) seen.add(doc.id);
    riders.push(doc);
  }
  return { mount, riders };
}

/** Controlled token documents on the viewed scene. */
function controlledDocs() {
  return (canvas?.tokens?.controlled ?? []).map(token => token.document).filter(Boolean);
}

/** Targeted token documents on the viewed scene. */
function targetedDocs() {
  return [...(game.user?.targets ?? [])].map(token => token.document).filter(Boolean);
}

/** Riders for a Mount pressed on `mount`'s own HUD: targets first, then the rest of the selection. */
function ridersFor(mount) {
  const targets = targetedDocs().filter(doc => doc.id !== mount?.id);
  if (targets.length) return targets;
  return controlledDocs().filter(doc => doc.id !== mount?.id);
}

/** Scene-control Mount: controlled riders onto the targeted (or single controlled) machine. */
async function mountFromScene() {
  const { mount, riders } = resolveRideParty({ controlled: controlledDocs(), targets: targetedDocs() });
  if (!mount) return warn("NoMount");
  return mountRiders(mount, riders);
}

/** Scene-control Dismount: any selected rider steps off; a selected machine empties out. */
async function dismountFromScene() {
  const selected = [...controlledDocs(), ...targetedDocs()];
  const riders = selected.filter(doc => isRiding(doc));
  if (riders.length) return dismountRiders(riders);
  const mount = selected.find(doc => ridersOf(doc).length);
  if (mount) return dismountAll(mount);
  return warn("NoRiders");
}

function hudButton({ icon, tooltip, className, onClick }) {
  const button = document.createElement("div");
  button.className = `control-icon ${className}`;
  button.dataset.tooltip = tooltip;
  button.innerHTML = `<i class="fa-solid ${icon}"></i>`;
  button.addEventListener("click", event => {
    event.preventDefault();
    onClick();
  });
  return button;
}

function injectRideHud(hud, html) {
  const mount = hud?.object?.document;
  if (!mount) return;
  const root = html?.rootElement ?? html?.[0] ?? html;
  if (!root?.querySelector) return;
  const col = root.querySelector(".col.left") ?? root.querySelector(".left")
    ?? root.querySelector(".col.right") ?? root.querySelector(".right");
  if (!col || col.querySelector(".ghostwire-ride")) return;

  // A rider aboard something gets one button, and it says the one thing it can do.
  if (isRiding(mount)) {
    col.appendChild(hudButton({
      icon: "fa-person-walking-arrow-right",
      tooltip: game.i18n.localize(`${L}.HudDismount`),
      className: "ghostwire-ride ghostwire-ride-off",
      onClick: () => dismountRiders([mount]),
    }));
    return;
  }
  if (!canCarryRiders(mount)) return;
  col.appendChild(hudButton({
    icon: "fa-users-line",
    tooltip: game.i18n.format(`${L}.HudMount`, { capacity: tokenSeatCapacity(mount) }),
    className: "ghostwire-ride ghostwire-ride-on",
    onClick: () => mountRiders(mount, ridersFor(mount)),
  }));
  if (ridersOf(mount).length) {
    col.appendChild(hudButton({
      icon: "fa-person-through-window",
      tooltip: game.i18n.localize(`${L}.HudDismountAll`),
      className: "ghostwire-ride ghostwire-ride-clear",
      onClick: () => dismountAll(mount),
    }));
  }
}

export function registerPassengers() {
  // A mounted rider does not walk. Our own follow-the-mount writes carry `ghostwireRide`.
  Hooks.on("preUpdateToken", (tokenDoc, changes, options) => {
    if (!riderMoveBlocked(tokenDoc, changes, options)) return;
    const record = ridingRecord(tokenDoc);
    const mount = tokenDoc.parent?.tokens?.get(record.mountId);
    ui.notifications.warn(game.i18n.format(`${L}.DragBlocked`, {
      rider: tokenDoc.name, mount: mount?.name ?? game.i18n.localize(`${L}.TheMount`),
    }));
    return false;
  });

  // The mount moved, turned or climbed: carry the crew.
  Hooks.on("updateToken", async (tokenDoc, changes, options, userId) => {
    if (options?.ghostwireRide || !shouldHandle(userId)) return;
    if (!["x", "y", "rotation", "elevation", "width", "height"].some(key => key in changes)) return;
    if (!ridersOf(tokenDoc).length) return;
    await followMount(tokenDoc);
  });

  // Recall, undeploy or a plain delete frees the crew. Recall deletes the mount's token first, so the
  // riders are read off the doomed document's own flags while they are still on it.
  Hooks.on("preDeleteToken", tokenDoc => {
    const seats = ridersOf(tokenDoc);
    if (seats.length) tokenDoc._ghostwireRiders = seats;
  });
  Hooks.on("deleteToken", async (tokenDoc, _options, userId) => {
    if (!shouldHandle(userId)) return;
    const scene = tokenDoc.parent;
    // The mount is gone: free whoever was on it.
    const seats = tokenDoc._ghostwireRiders ?? ridersOf(tokenDoc);
    if (scene && seats.length) {
      const riders = seats.map(seat => scene.tokens.get(seat.tokenId)).filter(Boolean);
      if (riders.length) {
        await dismountRiders(riders, { notify: false, mount: null });
        ui.notifications.info(game.i18n.format(`${L}.Freed`, { mount: tokenDoc.name, count: riders.length }));
      }
    }
    // A rider is gone: free its seat so the mount does not hold one open forever.
    const record = ridingRecord(tokenDoc);
    const mount = record && scene ? scene.tokens.get(record.mountId) : null;
    if (mount) {
      const kept = ridersOf(mount).filter(seat => seat.tokenId !== tokenDoc.id);
      if (kept.length) await mount.setFlag(MODULE_ID, RIDERS_FLAG, kept);
      else await mount.unsetFlag(MODULE_ID, RIDERS_FLAG);
    }
  });

  Hooks.on("renderTokenHUD", injectRideHud);

  // A token-layer tool for the brief's own phrasing: selected riders, targeted mount. It works even
  // when the HUD is not open, and it is the reliable path when a right-click has eaten the selection.
  Hooks.on("getSceneControlButtons", controls => {
    const tools = controls.tokens?.tools;
    if (!tools) return;
    tools.ghostwireMount = {
      name: "ghostwireMount",
      title: `${L}.ToolMount`,
      icon: "fa-solid fa-users-line",
      order: Object.keys(tools).length,
      button: true,
      visible: true,
      onChange: () => mountFromScene(),
    };
    tools.ghostwireDismount = {
      name: "ghostwireDismount",
      title: `${L}.ToolDismount`,
      icon: "fa-solid fa-person-walking-arrow-right",
      order: Object.keys(tools).length + 1,
      button: true,
      visible: true,
      onChange: () => dismountFromScene(),
    };
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      ride: {
        mountRiders,
        dismountRiders,
        dismountAll,
        isRiding,
        ridersOf,
        ridingRecord,
        seatCapacity,
        tokenSeatCapacity,
        canCarryRiders,
        resolveRideParty,
        rimSeatPosition,
        dismountPosition,
        mountPlan,
        SEAT_CAPACITY,
        MOUNTED_RIDER_SCALE,
      },
    };
  }
  console.log(`${MODULE_ID} | Passengers: Mount / Dismount registered (rim seats; weapon hardpoints untouched)`);
}

/** The lang root this file owns. `GHOSTWIRE.Mounts.*` belongs to weapon hardpoints and stays there. */
export const PASSENGER_LANG_ROOT = L;
