// B119 — kiosk type presets. Foundry-free so tools/kiosk-smoke.mjs can resolve stock lists
// from src/packs JSON. Armor/Weapons/Drones match kind or folder glob; Food/Chems match
// folder + StreetFood/Chem tags so new SKUs auto-include.
// 0.3.77 — Vehicles (crewed, inverse of Drones), Decks (Cat 4A), Programs (4B suites +
// 4C payloads on one shelf), Ammo (gear/general/ammunition magazines — not Ammo Bin mods).
// 0.3.98 (S8) — Mods (the chop shop): every Mods-pack SKU, vehicle/drone §5F kits plus
// the weapon / armor / gadget families. Matches on flags.mod so new SKUs auto-stock.

export const MODULE_ID = "draw-steel-ghostwire";

export const FOLDER_IDS = Object.freeze({
  consumables: "GwConsumables000",
  food: "GwFoodFolder0000",
  chems: "GwChemFolder0000",
  medical: "6OQ8YIl853VINDDp",
  infiltration: "us3Nn6wMMvEiw9Gi",
  sensors: "IckOgPn0rpSzzCzh",
  survival: "qSfpu7tiC7qo9mKV",
  armor: "A7Gw6BuWxXH2Vp6l",
  weapons: "XLspd2sc9I6l34wi",
  ammunition: "ahyua5QA62c6lUKF",
  drones: "HSPY6qKApuVToghV",
  vehiclesGround: "lR5kGzV7snDN9arQ",
  vehiclesAir: "a7XeWmGqPhQSlDcK",
  vehiclesWater: "NowzLYKCGDkEWIwh",
  vehiclesSpace: "UDrdYfXpBDCUE3Tr",
  decks: "7PqOYWHMxEowPWJc",
  programs: "PTNQJZBUr1ZFR36p",
  payloads: "rPSzM2YqrQBEstrv",
  modsVehicles: "aQqOJpCpotlt5MEY",
  modsArmor: "B4auJ3Tjl5Ueylf3",
  modsWeapons: "lS0Fe0Hu8lN3LKEC",
  modsGadgets: "WPSNKYe2217TSF7m",
});

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? doc?.flags?.["draw-steel-ghostwire"] ?? {};

export function packItemUuid(pack, id) {
  return `Compendium.${MODULE_ID}.${pack}.Item.${id}`;
}

export const KIOSK_PRESETS = Object.freeze([
  {
    id: "food",
    langKey: "Food",
    match: {
      packs: ["gear"],
      pathPrefixes: ["consumables/food"],
      folderIds: [FOLDER_IDS.food],
      tagsAny: ["StreetFood"],
      shelves: ["food"],
    },
  },
  {
    id: "medical",
    langKey: "Medical",
    match: {
      packs: ["gear"],
      pathPrefixes: ["consumables/chems", "general/medical"],
      folderIds: [FOLDER_IDS.chems, FOLDER_IDS.medical],
      tagsAny: ["Chem"],
      shelves: ["chem"],
    },
  },
  {
    id: "tools",
    langKey: "Tools",
    match: {
      packs: ["gear"],
      pathPrefixes: ["general/infiltration", "general/sensors", "general/survival"],
      folderIds: [FOLDER_IDS.infiltration, FOLDER_IDS.sensors, FOLDER_IDS.survival],
    },
  },
  {
    id: "armor",
    langKey: "Armor",
    match: {
      packs: ["gear"],
      pathPrefixes: ["armor"],
      kinds: ["armor"],
    },
  },
  {
    id: "weapons",
    langKey: "Weapons",
    match: {
      packs: ["gear"],
      pathPrefixes: ["weapons"],
      kinds: ["weapon"],
    },
  },
  {
    id: "drones",
    langKey: "Drones",
    match: {
      packs: ["vehicles"],
      pathPrefixes: ["drones"],
      vehicleDrone: true,
      folderIds: [FOLDER_IDS.drones],
    },
  },
  {
    id: "vehicles",
    langKey: "Vehicles",
    match: {
      packs: ["vehicles"],
      pathPrefixes: ["ground", "air", "water", "space"],
      vehicleCrewed: true,
      excludeTags: ["Plot"],
      folderIds: [
        FOLDER_IDS.vehiclesGround,
        FOLDER_IDS.vehiclesAir,
        FOLDER_IDS.vehiclesWater,
        FOLDER_IDS.vehiclesSpace,
      ],
    },
  },
  {
    id: "decks",
    langKey: "Decks",
    match: {
      packs: ["matrix"],
      pathPrefixes: ["decks"],
      matrixRoles: ["deck"],
      folderIds: [FOLDER_IDS.decks],
    },
  },
  {
    // Cat 4B persistent suites + Cat 4C attack payloads share one Programs shelf in v1.
    // Both are buyable matrix Items that fill deck slots. Autosofts (drone/RCC software)
    // also carry the Program tag, so this preset keys on role + programs/payloads folders
    // — never tagsAny: ["Program"]. Hacker class Program abilities live in classes, not here.
    id: "programs",
    langKey: "Programs",
    match: {
      packs: ["matrix"],
      pathPrefixes: ["programs", "payloads"],
      matrixRoles: ["program", "payload"],
      folderIds: [FOLDER_IDS.programs, FOLDER_IDS.payloads],
    },
  },
  {
    id: "ammo",
    langKey: "Ammo",
    match: {
      packs: ["gear"],
      pathPrefixes: ["general/ammunition"],
      folderIds: [FOLDER_IDS.ammunition],
    },
  },
  {
    // 0.3.98 (S8) — the chop shop. Every buyable mod in the Mods pack: vehicle/drone
    // §5F kits first-class, plus the already-packed weapon / armor / gadget families.
    // `modAny` keys on flags.mod so a new SKU under src/packs/mods/** auto-stocks with
    // no listing edit, in Foundry index rows as well as the Node smoke catalog.
    id: "mods",
    langKey: "Mods",
    match: {
      packs: ["mods"],
      pathPrefixes: ["vehicles", "weapons", "armor", "gadgets"],
      modAny: true,
      folderIds: [
        FOLDER_IDS.modsVehicles,
        FOLDER_IDS.modsWeapons,
        FOLDER_IDS.modsArmor,
        FOLDER_IDS.modsGadgets,
      ],
    },
  },
  {
    // 0.3.100 (G2) — the two wearable-side vendors, now that §2F and §1H are published families.
    // The Chop Shop still carries every mod; these are the focused shelves a Director drops when
    // the crew walks into an armorer's back room or a gadget fence, not a garage. Deliberately
    // NOT `modAny` — that matches every mod in the pack; folder + path is what narrows the shelf.
    id: "armorMods",
    langKey: "ArmorMods",
    match: {
      packs: ["mods"],
      pathPrefixes: ["armor"],
      folderIds: [FOLDER_IDS.modsArmor],
    },
  },
  {
    id: "gadgetMods",
    langKey: "GadgetMods",
    match: {
      packs: ["mods"],
      pathPrefixes: ["gadgets"],
      folderIds: [FOLDER_IDS.modsGadgets],
    },
  },
]);

export function listPresets() {
  return KIOSK_PRESETS.map(preset => ({ id: preset.id, langKey: preset.langKey }));
}

export function getPreset(id) {
  return KIOSK_PRESETS.find(preset => preset.id === id) ?? null;
}

function tagsOf(item) {
  const gear = gwFlags(item).gear ?? {};
  return Array.isArray(gear.tags) ? gear.tags : [];
}

function shelfOf(item) {
  return String(gwFlags(item).gear?.kioskShelf ?? "");
}

function pathOf(item) {
  return String(item?.path ?? item?.srcPath ?? "").replaceAll("\\", "/");
}

function packOf(item) {
  return String(item?.pack ?? item?.packName ?? "");
}

function folderOf(item) {
  const folder = item?.folder;
  if (folder && typeof folder === "object") return folder.id ?? folder._id ?? "";
  return String(folder ?? "");
}

/**
 * True when a catalog row belongs on this preset shelf.
 * `path` is the src-relative file path without `.json` (Node smoke).
 * Runtime Foundry rows omit path and match kind / tags / folder / drone /
 * crewed-vehicle / matrix.role flags.
 */
export function matchPresetItem(item, preset) {
  if (!item || !preset?.match) return false;
  const match = preset.match;
  const pack = packOf(item);
  if (match.packs?.length && pack && !match.packs.includes(pack)) return false;
  if (item.type && item.type !== "treasure" && item.type !== "Item") {
    // Pack index entries have no document type string sometimes; only reject known non-items.
    if (item.documentName && item.documentName !== "Item") return false;
  }

  const flags = gwFlags(item);
  const allTags = [
    ...tagsOf(item),
    ...(Array.isArray(flags.vehicle?.tags) ? flags.vehicle.tags : []),
    ...(Array.isArray(flags.matrix?.tags) ? flags.matrix.tags : []),
    ...(Array.isArray(flags.mod?.tags) ? flags.mod.tags : []),
  ];
  if (match.excludeTags?.some(tag => allTags.includes(tag))) return false;

  const kind = item.system?.kind;
  if (match.kinds?.length && match.kinds.includes(kind)) return true;
  if (match.vehicleDrone && flags.vehicle?.drone) return true;
  if (match.vehicleCrewed) {
    if (flags.vehicle?.drone) return false;
    if (flags.vehicle) return true;
  }
  if (match.matrixRoles?.length && match.matrixRoles.includes(flags.matrix?.role)) return true;
  if (match.modAny && flags.mod) return true;

  const tags = tagsOf(item);
  if (match.tagsAny?.some(tag => tags.includes(tag))) return true;
  if (match.shelves?.includes(shelfOf(item))) return true;

  const path = pathOf(item);
  if (path && match.pathPrefixes?.some(prefix => path === prefix || path.startsWith(`${prefix}/`))) return true;

  if (match.folderIds?.includes(folderOf(item))) return true;

  return false;
}

export function listingsFromItems(items, presetId, { listingId } = {}) {
  const preset = typeof presetId === "string" ? getPreset(presetId) : presetId;
  if (!preset) return [];
  const makeId = typeof listingId === "function" ? listingId : (index => `preset-${preset.id}-${index}`);
  const rows = [];
  const seen = new Set();
  let n = 0;
  for (const item of items) {
    if (!matchPresetItem(item, preset)) continue;
    const uuid = item.uuid || (item.id ? packItemUuid(packOf(item) || preset.match.packs[0], item.id) : "");
    if (!uuid || seen.has(uuid)) continue;
    seen.add(uuid);
    rows.push({ id: makeId(n), uuid, price: null });
    n += 1;
  }
  return rows;
}
