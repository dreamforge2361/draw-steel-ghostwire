// 0.3.144 — ground vehicles wear their maker's name, the way firearms have since 0.3.134.
//
// This is the vehicle twin of `scripts/weapon-rename.mjs`, and it is split the same three ways:
//
//  1. **The table.** `VEHICLE_MAKERS` says which Ghostwire motor house builds each ground chassis and
//     what that house calls the model. `tools/vehicles-rename-lang.mjs` rewrites the
//     `GHOSTWIRE.Vehicles.Items.*` and `GHOSTWIRE.Summons.Machines.*` strings from this table, so a
//     regenerate keeps the catalog name instead of quietly reverting it, and
//     `tools/wave-03144-smoke.mjs` asserts against the same constants rather than re-typing them.
//
//  2. **The art.** `art` is the webp stem under `assets/tokens/vehicles/`. The Item `img`, the Machine
//     Actor portrait and its `prototypeToken.texture.src` all point at the same plate, so a Deploy and
//     a dragged template show the same machine. Ground **Rustbucket** is the one stem that is not its
//     street key: `rustbucket-ground`, because `assets/tokens/drones/rustbucket-drone.webp` is a
//     different machine that happens to share a street name.
//
//  3. **The world migration.** Rebuilding a pack fixes the compendium and *nothing already in a world*.
//     `migrateVehicleNames` walks world Items, embedded copies on every Actor, and the Machine Actors
//     themselves, renaming only the ones still wearing a 0.3.143 name — matched by `_dsid` first, by
//     the old printed name second, and **never** when the current name is neither (a Director who
//     called their Getaway "Bessie" keeps Bessie).
//
// Nothing here changes an `_id` or a `_dsid`. Street stems stay street stems: the dsid is `brick`, the
// file is `brick.json`, and only the printed name moves. Handling, Integrity, mod slots, tags, price
// and echelon are untouched by this wave — this table carries no numbers on purpose.
//
// Everything above the "Foundry registration" divider is Foundry-free so the smoke can run it in Node.

const MODULE_ID = "draw-steel-ghostwire";

/**
 * The Ghostwire motor houses.
 *
 * Several of these names also appear in `scripts/weapon-rename.mjs` MAKERS — Ferrum, Grey Ledger, Nyx,
 * IW, White Door and Kestrel all build more than guns. The `lore` line here is the *motor division's*,
 * not the arms division's, which is why this is its own table rather than an import: a card for a
 * hauler should not open by telling you the house sells rifles.
 */
export const MAKERS = Object.freeze({
  ferrum: {
    full: "Ferrum Forgeworks", short: "Ferrum Forgeworks", parent: "Ferrum Dynastic",
    lore: "Ferrum Forgeworks (Ferrum Dynastic) has been pressing hulls since before the lanes were stacked, and still ships every chassis with a paper manual nobody reads.",
  },
  greyledger: {
    full: "Grey Ledger", short: "Grey Ledger", parent: "Sanctum Assurance",
    lore: "Grey Ledger (Sanctum Assurance) files its vehicles under “asset recovery transport” and bills the ride to whoever is in the back.",
  },
  nyx: {
    full: "Nyx Undermarket", short: "Nyx", parent: "Nyx Cartel",
    lore: "Nyx Undermarket (Nyx Cartel) welds its chassis out of whatever the yard coughed up, sells it the same night, and honours no warranty of any kind.",
  },
  kestrel: {
    full: "Kestrel Aerodyne", short: "Kestrel", parent: "Kestrel Dynamics",
    lore: "Kestrel Aerodyne (Kestrel Dynamics) builds lift, not wheels — every frame it sells rides on a limiter band and a very expensive fan.",
  },
  velvet: {
    full: "Velvet Motors", short: "Velvet Motors", parent: "Obsidian Holdings",
    lore: "Velvet Motors (Obsidian Holdings) sells quiet, fast, beautifully upholstered cars to people who need to leave somewhere quickly and look unbothered doing it.",
  },
  whitedoor: {
    full: "White Door Tactical", short: "White Door", parent: "Lazarus Extract",
    lore: "White Door Tactical (Lazarus Extract) builds extraction bodies: armour rated for getting someone out, never for staying to fight.",
  },
  iw: {
    full: "Iron Writ Arms", short: "IW", parent: "Ironclad Martial",
    lore: "IW = Iron Writ Arms, Ironclad Martial’s arms division: plain, tough machines sold to anyone with a signed contract — and a standing grudge that Nyx copies every one of them.",
  },
  lanetransit: {
    full: "Lane Transit", short: "Laneline", parent: "",
    lore: "Lane Transit runs the Flats public lanes under the Laneline plate, and sells its retired bodies to anyone who can get one off the depot apron.",
  },
  sealwarden: {
    full: "Seal Warden Motor Pool", short: "Seal Warden", parent: "Aequitas Mandate",
    lore: "The Seal Warden Motor Pool (Aequitas Mandate) stamps every hull with a warrant number, and the number is how the Mandate finds the car again.",
  },
});

/**
 * Every ground chassis this wave renames, by `_dsid`.
 *
 *  * `key`        — the `GHOSTWIRE.Vehicles.Items.<key>` lang entry the pack Item points at.
 *  * `machineKey` — the `GHOSTWIRE.Summons.Machines.<key>` entry, when a Machine Actor also exists.
 *                   Most of the fourteen named chassis are **Items only**; Deploy stamps their Actor
 *                   from a scale-band template, so there is nothing else to rename.
 *  * `old`        — the 0.3.143 printed name the migration matches on, and the street nickname the
 *                   maker paragraph keeps ("The street still calls it a Brick").
 *  * `name`       — the catalog name.
 *  * `maker`      — a key of {@link MAKERS}.
 *  * `model`      — the house's own designation, printed after the house's short name.
 *  * `role`       — replaces the third field of the flavour line. Present on the fourteen new-art
 *                   chassis only; a polish row keeps whatever "what it is" phrase its card already had,
 *                   because that phrase is load-bearing lore ("four-seat street hovercar").
 *  * `art`        — webp stem under `assets/tokens/vehicles/`.
 */
export const VEHICLE_MAKERS = Object.freeze({
  // ---- the fourteen named ground chassis with new 512² plates
  "brick": { key: "Brick", old: "Brick", name: "Ferrum Bastion", maker: "ferrum", model: "Bastion", role: "armored troop / ground-hauler", art: "brick" },
  "cage": { key: "Cage", old: "Cage", name: "Grey Ledger Lockbox", maker: "greyledger", model: "Lockbox", role: "prisoner / secure cargo", art: "cage" },
  "clunker": { key: "Clunker", old: "Clunker", name: "Nyx Rattlecrate", maker: "nyx", model: "Rattlecrate", role: "cheap beater hauler", art: "clunker" },
  "crotch-rocket": { key: "CrotchRocket", old: "Crotch-Rocket", name: "Kestrel Stiletto", maker: "kestrel", model: "Stiletto", role: "courier hover-bike", art: "crotch-rocket" },
  "flatbed": { key: "Flatbed", old: "Flatbed", name: "Ferrum Deckplate", maker: "ferrum", model: "Deckplate", role: "open cargo flatbed", art: "flatbed" },
  "getaway": { key: "Getaway", old: "Getaway", name: "Velvet Afterburn", maker: "velvet", model: "Afterburn", role: "fast crew sedan", art: "getaway" },
  "grey-cab": { key: "GreyCab", old: "Grey Cab", name: "Grey Ledger Meter", maker: "greyledger", model: "Meter", role: "covert taxi", art: "grey-cab" },
  "hardtop": { key: "Hardtop", old: "Hardtop", name: "White Door Cradle", maker: "whitedoor", model: "Cradle", role: "armored extraction", art: "hardtop" },
  "iron-giant": { key: "IronGiant", old: "Iron Giant", name: "IW Colossus", maker: "iw", model: "Colossus", role: "heavy combat walker", art: "iron-giant" },
  // The ground Rustbucket and the Rustbucket drone are two different machines with one street name.
  // This one is the car; `assets/tokens/drones/rustbucket-drone.webp` is the quadrotor and stays put.
  "rustbucket": { key: "Rustbucket", old: "Rustbucket", name: "Nyx Primer", maker: "nyx", model: "Primer", role: "patched utility", art: "rustbucket-ground" },
  "scrap-bike": { key: "ScrapBike", old: "Scrap-Bike", name: "Nyx Boneframe", maker: "nyx", model: "Boneframe", role: "scavenged bike", art: "scrap-bike" },
  "spider-frame": { key: "SpiderFrame", old: "Spider-Frame", name: "Ferrum Arachnid", maker: "ferrum", model: "Arachnid", role: "six-leg industrial walker", art: "spider-frame" },
  "warbike": { key: "Warbike", old: "Warbike", name: "IW Lance", maker: "iw", model: "Lance", role: "military armored bike", art: "warbike" },
  "workhorse": { key: "Workhorse", old: "Workhorse", name: "Ferrum Yardboss", maker: "ferrum", model: "Yardboss", role: "workshop / utility van", art: "workhorse" },

  // ---- polish: catalog name only, art already shipped
  "bulldog": { key: "Bulldog", machineKey: "Bulldog", old: "Bulldog", name: "IW Bulldog", maker: "iw", model: "Bulldog", art: "bulldog" },
  "ash-crawler": { key: "AshCrawler", old: "Ash-Crawler", name: "Ferrum Ash-Crawler", maker: "ferrum", model: "Ash-Crawler", art: "ash-crawler" },
  "lane-bus": { key: "LaneBus", old: "Lane Bus", name: "Laneline Omnibus", maker: "lanetransit", model: "Omnibus", art: "lane-bus" },
  "lane-hopper": { key: "LaneHopper", machineKey: "LaneHopper", old: "Lane-Hopper", name: "Laneline Hopper", maker: "lanetransit", model: "Hopper", art: "lane-hopper" },
  "seal-cruiser": { key: "SealCruiser", machineKey: "SealCruiser", old: "Seal Cruiser", name: "Seal Warden Cruiser", maker: "sealwarden", model: "Warden Cruiser", art: "seal-cruiser" },
  "star-chopper": { key: "StarChopper", machineKey: "StarChopper", old: "Star-Chopper", name: "Kestrel Star-Chopper", maker: "kestrel", model: "Star-Chopper", art: "star-chopper" },
  "white-door": { key: "WhiteDoor", machineKey: "WhiteDoor", old: "White Door", name: "White Door Quiet Room", maker: "whitedoor", model: "Quiet Room", art: "white-door" },
});

/**
 * The three ground scale-band templates.
 *
 * These are Machine Actors with no Item and no maker: a band template is not a thing a house sells, it
 * is the shape Deploy stamps when a hero fields a chassis of that scale. They get a catalog-shaped
 * name and their own plate, and no "the street still calls it" line — nobody on the street calls a
 * category anything.
 */
export const CHASSIS_TEMPLATES = Object.freeze({
  "machine-vehicle-bike": { machineKey: "VehicleBike", old: "Vehicle (Bike)", name: "Chassis — Bike", art: "vehicle-bike", file: "machine-vehicle-bike" },
  "machine-vehicle-car": { machineKey: "VehicleCar", old: "Vehicle (Car)", name: "Chassis — Car", art: "vehicle-car", file: "machine-vehicle-car" },
  "machine-vehicle-heavy": { machineKey: "VehicleHeavy", old: "Vehicle (Heavy Ground)", name: "Chassis — Heavy Ground", art: "vehicle-heavy-ground", file: "machine-vehicle-heavy" },
});

/** Every dsid this wave renames → `{ old, name, key, machineKey }`, chassis templates included. */
export const VEHICLE_RENAMES = Object.freeze(Object.fromEntries([
  ...Object.entries(VEHICLE_MAKERS),
  ...Object.entries(CHASSIS_TEMPLATES),
].map(([dsid, row]) => [dsid, Object.freeze({ old: row.old, name: row.name, key: row.key ?? null, machineKey: row.machineKey ?? null })])));

/** The fourteen chassis that got new plates this wave, in table order. */
export const NEW_ART_DSIDS = Object.freeze([
  "brick", "cage", "clunker", "crotch-rocket", "flatbed", "getaway", "grey-cab",
  "hardtop", "iron-giant", "rustbucket", "scrap-bike", "spider-frame", "warbike", "workhorse",
]);

/** Module-relative path to a chassis plate. */
export const artPath = stem => `modules/${MODULE_ID}/assets/tokens/vehicles/${stem}.webp`;

/** The `<em>` flavour line a vehicle card opens with: `Catalog Name · Maker · what it is`. */
export function flavourLine(dsid, { kind = "" } = {}) {
  const row = VEHICLE_MAKERS[dsid];
  if (!row) return "";
  const maker = MAKERS[row.maker];
  // A chassis already named for its house ("Ferrum Bastion") would otherwise read
  // "Ferrum Bastion · Ferrum Forgeworks Bastion". When the printed name already opens with the
  // house, the middle field is just the house; otherwise it is the house plus its designation.
  const housed = row.name.split(/\s+/)[0] === maker.short.split(/\s+/)[0];
  const middle = housed ? maker.full : `${maker.short} ${row.model}`;
  return [row.name, middle, row.role || kind].filter(Boolean).join(" · ");
}

/**
 * Is this the stock 0.3.143 name for this chassis (so the migration may rewrite it)?
 *
 * True for the old printed name, the new one, and the i18n key the pack row stores, and **only** those:
 * any other string is a name somebody chose, and a migration that overwrites a chosen name is a bug.
 */
export function isStockVehicleName(dsid, current) {
  const row = VEHICLE_RENAMES[dsid];
  if (!row) return false;
  const text = String(current ?? "").trim();
  if (!text) return false;
  if (text === row.old || text === row.name) return true;
  if (row.key && text === `GHOSTWIRE.Vehicles.Items.${row.key}.Name`) return true;
  if (row.machineKey && text === `GHOSTWIRE.Summons.Machines.${row.machineKey}.Name`) return true;
  return false;
}

/**
 * The rename this document needs, or null. Works for a vehicle Item and for a Machine Actor alike.
 *
 * Match order is the whole rule:
 *  1. `_dsid` / `flags.<module>.dsid` — survives a rename, survives a Director's edit, and is what
 *     mods, mounts and the Chase HUD key off. Even here the *current* name has to still be a stock
 *     one, so "Bessie" stays Bessie.
 *  2. The old printed name, for a world copy old enough to have lost its dsid.
 */
export function vehicleRenameFor(doc) {
  const current = String(doc?.name ?? "").trim();
  if (!current) return null;
  const dsid = doc?.system?._dsid ?? doc?.flags?.[MODULE_ID]?.dsid ?? null;
  if (dsid && VEHICLE_RENAMES[dsid]) {
    const row = VEHICLE_RENAMES[dsid];
    if (current === row.name) return null;                        // already renamed
    if (!isStockVehicleName(dsid, current)) return null;          // a Director named it
    return { dsid, from: current, to: row.name };
  }
  if (dsid) return null;                                          // a dsid we do not rename
  for (const [key, row] of Object.entries(VEHICLE_RENAMES)) {
    if (current === row.old) return { dsid: key, from: current, to: row.name };
  }
  return null;
}

/* ============================================ Foundry registration */

const SETTING = "vehicleRenameVersion";
export const VEHICLE_RENAME_VERSION = "0.3.144";

/**
 * Rename every world Item, embedded Actor item and Machine Actor still wearing a 0.3.143 chassis name.
 *
 * Idempotent twice over: the setting gate means one pass per upgrade, and `vehicleRenameFor` returns
 * null for anything already renamed, so running it by hand from the console changes nothing the
 * second time.
 *
 * @param {object} [options]
 * @param {boolean} [options.force]  Run even when the setting says this version already ran.
 * @returns {Promise<number>} documents touched.
 */
export async function migrateVehicleNames({ force = false } = {}) {
  if (!game.user.isGM) return 0;
  if (!force && (game.settings.get(MODULE_ID, SETTING) === VEHICLE_RENAME_VERSION)) return 0;

  let touched = 0;

  const worldItemUpdates = [];
  for (const item of game.items) {
    const plan = vehicleRenameFor(item);
    if (plan) worldItemUpdates.push({ _id: item.id, name: plan.to });
  }
  if (worldItemUpdates.length) {
    await Item.updateDocuments(worldItemUpdates);
    touched += worldItemUpdates.length;
  }

  const actorUpdates = [];
  for (const actor of game.actors) {
    if (!actor.isOwner) continue;
    const plan = vehicleRenameFor(actor);
    if (plan) actorUpdates.push({ _id: actor.id, name: plan.to });
    const embedded = [];
    for (const item of actor.items ?? []) {
      const itemPlan = vehicleRenameFor(item);
      if (itemPlan) embedded.push({ _id: item.id, name: itemPlan.to });
    }
    if (embedded.length) {
      await actor.updateEmbeddedDocuments("Item", embedded);
      touched += embedded.length;
    }
  }
  if (actorUpdates.length) {
    await Actor.updateDocuments(actorUpdates);
    touched += actorUpdates.length;
  }

  await game.settings.set(MODULE_ID, SETTING, VEHICLE_RENAME_VERSION);
  if (touched) console.log(`${MODULE_ID} | vehicle rename ${VEHICLE_RENAME_VERSION}: ${touched} document(s) renamed`);
  return touched;
}

export function registerVehicleRename() {
  game.settings.register(MODULE_ID, SETTING, {
    scope: "world", config: false, type: String, default: "",
  });
  Hooks.once("ready", async () => {
    try {
      await migrateVehicleNames();
    } catch (error) {
      console.error(`${MODULE_ID} | vehicle rename migration failed`, error);
    }
  });
  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      vehicleRename: { MAKERS, VEHICLE_MAKERS, VEHICLE_RENAMES, CHASSIS_TEMPLATES, migrateVehicleNames, vehicleRenameFor },
    };
  }
}
