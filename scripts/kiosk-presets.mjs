// B119 — kiosk type presets. Foundry-free so tools/kiosk-smoke.mjs can resolve stock lists
// from src/packs JSON. Armor/Weapons/Drones match kind or folder glob; Food/Chems match
// folder + StreetFood/Chem tags so new SKUs auto-include.

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
  drones: "HSPY6qKApuVToghV",
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
 * Runtime Foundry rows omit path and match kind / tags / folder / drone flag.
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

  const kind = item.system?.kind;
  if (match.kinds?.length && match.kinds.includes(kind)) return true;

  const flags = gwFlags(item);
  if (match.vehicleDrone && flags.vehicle?.drone) return true;

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
