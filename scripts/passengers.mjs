// Passengers (0.3.137) — Ghostwire-native **Mount / Dismount**: hero tokens ride a machine token.
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
// **Where riders sit.** On the *hull rim*, not on top and not out in the road. Riders shrink to half
// art scale and sit on an **ellipse** that follows the mount token's own footprint — `(w/2)·cos` by
// `(h/2)·sin`, pulled in to `SEAT_RING` (0.9) of it — so a 3-square Bulldog with four heroes aboard
// reads as a crewed truck rather than a pile of overlapping portraits, and a 1×4 flatbed does not park
// its crew two squares off its flanks the way a circle of `max(w, h)/2` did through 0.3.136. The seat
// offset is worked out in the mount's own frame and then turned by the mount's rotation, so turning
// the truck carries its crew around with it.
//
// **Following the mount (0.3.137).** Foundry 13/14 push a drag through the MovementManager, so
// `updateToken` can fire with the x/y the crew needed missing from `changes`. Three things fix that:
// the follow hook also listens to `moveToken` / `stopToken`, every follow re-reads geometry off the
// **live** TokenDocument instead of trusting `changes`, and the last geometry the crew was seated
// against is remembered per mount so *any* update that leaves the mount somewhere else re-seats them
// even when `changes` says nothing useful. Rider writes ask for the `displace` movement action, so a
// carried passenger is *placed* in its seat rather than walked there along a wall-constrained path —
// the v13 `{ teleport: true }` shorthand does the same thing but logs a deprecation warning per seat.
//
// **Capacity.** No Ghostwire chassis carries a crew-seat number in its data — `vehicle.stations` is
// declared in `machines.mjs` and empty on every shipped SKU — so the band decides, per the 0.3.136
// brief's default: Micro cannot carry, Small carries 1, Medium carries 2, and vehicles carry by band.
// A Director who wants a different number sets `flags.<module>.machine.seats` on the machine Actor.
//
// Everything above `registerPassengers` is Foundry-free so `tools/wave-03136-smoke.mjs` and
// `tools/wave-03137-smoke.mjs` can run the real seat maths, the real follow test and the real capacity
// table offline.

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
 * How far out along the hull a seat sits, as a fraction of the mount's own half-width / half-height.
 *
 * **0.3.137 fix.** Seats used the mount's bounding *circle* at ring 1, which is right on a square
 * token and wrong on every long one: a 1×4 flatbed put its crew `2` squares off its flanks, clear of
 * the painted chassis, which is the "rider off to the side" bug Michael screenshotted on 0.3.136.
 * Just inside the footprint (0.9) reads as *on* the hull at every aspect ratio — the brief's 0.85–0.95.
 */
export const SEAT_RING = 0.9;

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
 * The rim is an **ellipse** on the mount's own footprint, not a circle on its longest side: the seat
 * offset is `(ring · w/2 · cos θ, ring · h/2 · sin θ)` in the mount's *unrotated* frame, and that
 * offset is then turned by the mount's rotation. A long chassis therefore seats its crew along the
 * hull instead of throwing the flank seats out past the art.
 *
 * `ring` scales the offset: 1 is the edge of the footprint, `SEAT_RING` is the seat used by Mount and
 * follow, and `dismountPosition` pushes it out past the hull.
 *
 * @returns {{x: number, y: number}} integer pixels, top-left, the shape a TokenDocument update wants.
 */
export function rimSeatPosition({
  mountX = 0, mountY = 0, mountWidth = 1, mountHeight = 1,
  riderWidth = 1, riderHeight = 1,
  seatIndex = 0, seatCount = 1, rotation = 0, grid = 100, ring = 1,
} = {}) {
  const size = Math.max(1, Number(grid) || 100);
  const halfW = (Number(mountWidth) || 1) * size / 2;
  const halfH = (Number(mountHeight) || 1) * size / 2;
  const centreX = Number(mountX) + halfW;
  const centreY = Number(mountY) + halfH;
  const scale = Number(ring) || 1;
  // Seat angle in the mount's own frame, then rotate the offset with the hull.
  const theta = seatAngle(seatIndex, seatCount, 0);
  const localX = scale * halfW * Math.cos(theta);
  const localY = scale * halfH * Math.sin(theta);
  const spin = ((Number(rotation) || 0) * Math.PI) / 180;
  const cos = Math.cos(spin);
  const sin = Math.sin(spin);
  return {
    x: Math.round(centreX + (localX * cos) - (localY * sin) - ((Number(riderWidth) || 1) * size / 2)),
    y: Math.round(centreY + (localX * sin) + (localY * cos) - ((Number(riderHeight) || 1) * size / 2)),
  };
}

/**
 * Where a rider actually sits — the one seating function **both** Mount and follow-the-mount use, so
 * the first mount cannot land somewhere the first move then corrects.
 *
 * Same options as `rimSeatPosition`; the only difference is that `ring` defaults to `SEAT_RING`.
 */
export function seatPosition(options = {}) {
  return rimSeatPosition({ ...options, ring: Number(options?.ring) || SEAT_RING });
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

/* ============================================ Following the mount (0.3.137, Foundry 14.367) */

/**
 * Token fields that move a seat. Kept as one exported list so the hook and the smoke agree.
 *
 * This is the **fast path**, not the only one: on Foundry 14.367 a drag is a MovementManager
 * operation, and `updateToken` can arrive without the keys the crew needed in `changes`. See
 * `shouldFollowMount`.
 */
export const MOUNT_GEOMETRY_KEYS = ["x", "y", "rotation", "elevation", "width", "height"];

/** The six numbers a seat is worked out from, read off a live TokenDocument (never off `changes`). */
export function mountGeometry(tokenDoc) {
  return {
    x: Number(tokenDoc?.x) || 0,
    y: Number(tokenDoc?.y) || 0,
    width: Number(tokenDoc?.width) || 1,
    height: Number(tokenDoc?.height) || 1,
    rotation: Number(tokenDoc?.rotation) || 0,
    elevation: Number(tokenDoc?.elevation) || 0,
  };
}

/** True when two geometries would seat the crew in the same place. */
export function sameGeometry(a, b) {
  if (!a || !b) return false;
  return MOUNT_GEOMETRY_KEYS.every(key => (Number(a[key]) || 0) === (Number(b[key]) || 0));
}

/**
 * Should the crew be re-seated?
 *
 * **0.3.137 fix.** Through 0.3.136 this was only "does `changes` mention x/y/rotation/elevation/size",
 * which is the bug Michael screenshotted: Foundry 13/14 route a drag through the MovementManager, the
 * `updateToken` that comes out of it need not carry those keys, and the crew stayed where it was while
 * the truck drove off. Three independent ways in now, cheapest first:
 *
 * 1. `movement` — a `moveToken` / `stopToken` hook fired, so the mount definitely moved.
 * 2. `changes` names a geometry key (the old fast path; still the common case for a rotate or a resize).
 * 3. The live geometry differs from the geometry the crew was last seated against — which catches
 *    *any* update at all that left the mount somewhere else, whatever `changes` happened to say.
 *
 * A mount we have never seated is always followed, so a fresh session re-seats on first contact.
 *
 * @param {{changes?: object, geometry?: object|null, seated?: object|null, movement?: boolean}} options
 */
export function shouldFollowMount({ changes = {}, geometry = null, seated = null, movement = false } = {}) {
  if (movement) return true;
  if (MOUNT_GEOMETRY_KEYS.some(key => key in (changes ?? {}))) return true;
  if (!seated) return true;
  return !sameGeometry(geometry, seated);
}

/**
 * Which client writes the seats. Exactly one, or four heroes get moved four times.
 *
 * The active GM owns the write whenever one is connected — that is Michael's solo-GM table, where the
 * active GM *is* the client that dragged the truck. With no GM connected, the user who caused the
 * update does it. `stopToken` hands us no user at all, so that last case falls back to "a GM, if this
 * client is one" rather than letting every spectator write.
 *
 * @param {{userId?: string|null, activeGmId?: string|null, selfId?: string|null, selfIsGM?: boolean}} options
 */
export function shouldHandleRide({ userId = null, activeGmId = null, selfId = null, selfIsGM = false } = {}) {
  if (activeGmId) return activeGmId === selfId;
  if (userId) return userId === selfId;
  return !!selfIsGM;
}

/**
 * The `movement` operation a rider write carries, so a carried passenger is **displaced** into its
 * seat instead of walking there.
 *
 * This matters more than it sounds: a plain x/y write is a normal move, and Foundry 14 constrains a
 * normal move against walls and regions. A rider seated on the far side of a wall from its own last
 * square would be stopped short of the seat — the truck drives through the gate, the crew piles up
 * against it. `action: "displace"` is the non-deprecated way to say "put it there"; the v13 shorthand
 * `{ teleport: true }` still works but logs a deprecation warning on every single seat.
 */
export function rideMovement(updates = []) {
  const movement = {};
  for (const update of updates ?? []) {
    if (!update?._id) continue;
    // An update that does not name a square is not a move; do not invent a stand-still waypoint for it.
    if (!Number.isFinite(update.x) && !Number.isFinite(update.y)) continue;
    movement[update._id] = {
      method: "api",
      autoRotate: false,
      showRuler: false,
      waypoints: [{
        x: update.x, y: update.y, elevation: update.elevation,
        action: "displace", snapped: false, explicit: false, checkpoint: true,
      }],
    };
  }
  return movement;
}

/* ================================================================ Foundry side */

/** One client does the writing: the active GM, or the user who moved the mount when there is none. */
function shouldHandle(userId) {
  return shouldHandleRide({
    userId: userId ?? null,
    activeGmId: game.users?.activeGM?.id ?? null,
    selfId: game.user?.id ?? null,
    selfIsGM: !!game.user?.isGM,
  });
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
 * One rider's seat on one mount, off the mount's **live** TokenDocument.
 *
 * The single place either code path works out a seat: `mountRiders` seats the first mount through it
 * and `followMount` re-seats through it, so the first mount cannot land somewhere the first move then
 * silently corrects — the 0.3.136 "rider off to the side" report was partly exactly that.
 */
function seatFor(mount, rider, { seatIndex = 0, seatCount = 1 } = {}) {
  const geometry = mountGeometry(mount);
  return seatPosition({
    mountX: geometry.x, mountY: geometry.y, mountWidth: geometry.width, mountHeight: geometry.height,
    riderWidth: rider?.width, riderHeight: rider?.height,
    seatIndex, seatCount, rotation: geometry.rotation, grid: gridSize(mount),
  });
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
    const spot = seatFor(mount, rider, { seatIndex, seatCount: capacity });
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
  await scene.updateEmbeddedDocuments("Token", updates, {
    ghostwireRide: true, movement: rideMovement(updates),
  });
  await mount.setFlag(MODULE_ID, RIDERS_FLAG, [...occupied, ...plan.seated]);
  // 0.3.137: run the follow path once now, so the seat the table sees on the first Mount is the same
  // seat the first drag would have produced. Everyone aboard gets re-checked, not just the new arrivals.
  await followMount(mount);

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
    // Displace, same as a seat write: a hero stepping off a truck against a wall must land in the
    // square we picked for them, not be stopped short of it by a pathfinding constraint.
    await scene.updateEmbeddedDocuments("Token", updates, {
      ghostwireRide: true, movement: rideMovement(updates),
    });
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

/**
 * The geometry each mount's crew was last seated against, by token id.
 *
 * Not persisted and not meant to be: it is the memory that lets *any* `updateToken` re-seat a crew
 * whose mount has drifted, even when `changes` says nothing a seat depends on. A forgotten entry costs
 * one extra follow, which is the safe direction to be wrong in.
 */
const seatedGeometry = new Map();

/** Move every rider to its seat after the mount has moved, turned or changed elevation. */
async function followMount(mount) {
  const scene = mount?.parent;
  const seats = ridersOf(mount);
  if (!scene || !seats.length) { if (mount?.id) seatedGeometry.delete(mount.id); return; }
  const capacity = tokenSeatCapacity(mount) || seats.length;
  const geometry = mountGeometry(mount);
  const updates = [];
  const orphaned = [];
  for (const seat of seats) {
    const rider = scene.tokens.get(seat.tokenId);
    if (!rider) { orphaned.push(seat.tokenId); continue; }
    const spot = seatFor(mount, rider, { seatIndex: seat.seatIndex, seatCount: capacity });
    updates.push({ _id: rider.id, ...spot, elevation: geometry.elevation });
  }
  if (updates.length) {
    await scene.updateEmbeddedDocuments("Token", updates, {
      ghostwireRide: true, animate: true, movement: rideMovement(updates),
    });
  }
  seatedGeometry.set(mount.id, geometry);
  // A rider token deleted out from under us leaves a dead seat; drop it rather than carry a ghost.
  if (orphaned.length) {
    const kept = seats.filter(seat => !orphaned.includes(seat.tokenId));
    if (kept.length) await mount.setFlag(MODULE_ID, RIDERS_FLAG, kept);
    else await mount.unsetFlag(MODULE_ID, RIDERS_FLAG);
  }
}

/**
 * The gate in front of `followMount`: is this mount carrying anybody, and has anything a seat depends
 * on actually changed? Shared by the `updateToken` and the Foundry 14 movement hooks.
 */
async function followIfMoved(mount, { changes = {}, movement = false } = {}) {
  if (!mount?.id) return;
  const seats = ridersOf(mount);
  if (!seats.length) { seatedGeometry.delete(mount.id); return; }
  const geometry = mountGeometry(mount);
  if (!shouldFollowMount({ changes, geometry, seated: seatedGeometry.get(mount.id) ?? null, movement })) return;
  await followMount(mount);
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

  // The mount moved, turned or climbed: carry the crew. `changes` is only the fast path — see
  // `shouldFollowMount` for why, and note that the seat itself is always worked out from the live
  // TokenDocument, never from `changes`.
  Hooks.on("updateToken", async (tokenDoc, changes, options, userId) => {
    if (options?.ghostwireRide || !shouldHandle(userId)) return;
    await followIfMoved(tokenDoc, { changes: changes ?? {} });
  });

  // Foundry 14.367 pushes a drag / keyboard step through the MovementManager and announces it here:
  // `moveToken(document, movement, operation, user)` fires after the document holds its destination,
  // and `stopToken(document)` fires when a constrained move is cut short (one argument, no user). This
  // is the hook that was missing through 0.3.136, which is why a dragged truck left its crew behind.
  Hooks.on("moveToken", async (tokenDoc, _movement, operation, user) => {
    if (operation?.ghostwireRide) return;
    if (!shouldHandle(user?.id ?? operation?.user?.id ?? null)) return;
    await followIfMoved(tokenDoc, { movement: true });
  });
  Hooks.on("stopToken", async tokenDoc => {
    if (!shouldHandle(null)) return;
    await followIfMoved(tokenDoc, { movement: true });
  });

  // Recall, undeploy or a plain delete frees the crew. Recall deletes the mount's token first, so the
  // riders are read off the doomed document's own flags while they are still on it.
  Hooks.on("preDeleteToken", tokenDoc => {
    const seats = ridersOf(tokenDoc);
    if (seats.length) tokenDoc._ghostwireRiders = seats;
  });
  Hooks.on("deleteToken", async (tokenDoc, _options, userId) => {
    seatedGeometry.delete(tokenDoc.id);
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
        seatPosition,
        dismountPosition,
        mountPlan,
        followMount,
        SEAT_CAPACITY,
        SEAT_RING,
        MOUNTED_RIDER_SCALE,
      },
    };
  }
  console.log(`${MODULE_ID} | Passengers: Mount / Dismount registered (ellipse hull seats, `
    + `Foundry 14 movement hooks; weapon hardpoints untouched)`);
}

/** The lang root this file owns. `GHOSTWIRE.Mounts.*` belongs to weapon hardpoints and stays there. */
export const PASSENGER_LANG_ROOT = L;
