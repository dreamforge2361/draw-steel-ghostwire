// 0.3.134 (B) — firearms wear their maker's name, and no Ghostwire weapon cites a real-world brand.
//
// Two separate jobs live here, and they are separate on purpose:
//
//  1. **The table.** `WEAPON_MAKERS` says which Ghostwire arms house builds each weapon SKU and what
//     that house calls the model; `WEAPON_RENAMES` is the subset whose *display name* changed in
//     0.3.134 (firearms only). `tools/weapons-rename-lang.mjs` rewrites the `GHOSTWIRE.Gear.Items.*`
//     strings from this table, so a regenerate keeps the new text instead of quietly reverting it,
//     and `tools/wave-03134-smoke.mjs` asserts against the same constants rather than re-typing them.
//
//  2. **The world migration.** Rebuilding a pack fixes the compendium and *nothing that is already in
//     a world*. `migrateWeaponNames` walks world Items and every embedded copy on every Actor and
//     renames the ones that are still wearing a 0.3.133 name — matched by `_dsid` first, by the old
//     printed name second, and **never** when the current name is neither (a Director who called
//     their Popper "Lucky" keeps Lucky).
//
// Nothing here changes an `_id` or a `_dsid`. The dsid is the handle the rename is keyed to; losing
// it would make the migration unrepeatable and would orphan ammo, weapon skills and SFX.
//
// Everything above the "Foundry registration" divider is Foundry-free so the smoke can run it in Node.

const MODULE_ID = "draw-steel-ghostwire";

/** The Ghostwire arms houses, their parent corp, and the one line every card of theirs carries. */
export const MAKERS = Object.freeze({
  iw: {
    full: "Iron Writ Arms", short: "IW", parent: "Ironclad Martial",
    lore: "IW = Iron Writ Arms, Ironclad Martial’s arms division: plain, tough guns sold to anyone with a signed contract — and a standing grudge that Nyx copies every one of them.",
  },
  seraph: {
    full: "Seraph Armaments", short: "Seraph", parent: "HALO Ascendant",
    lore: "Seraph Armaments (HALO Ascendant, sister firm to Aureole Security) sells white-polymer “humane” peacekeepers and very quietly sells the lethal settings too.",
  },
  argent: {
    full: "Argent Mint Arms", short: "Argent Mint", parent: "Argent Exchange",
    lore: "Argent Mint Arms (Argent Exchange) stamps every piece with the Exchange mint mark. Debt collectors carry them, and every serial number is a bond.",
  },
  ferrum: {
    full: "Ferrum Forgeworks", short: "Ferrum Forgeworks", parent: "Ferrum Dynastic",
    lore: "Ferrum Forgeworks (Ferrum Dynastic) is an old-money foundry that still insists this is a tool and not a weapon.",
  },
  deepworks: {
    full: "Deepworks Excavation", short: "Deepworks", parent: "Ferrum Dynastic",
    lore: "Deepworks Excavation (Ferrum Dynastic) builds demolition gear; Ferrum denies that anybody fights with it.",
  },
  meridian: {
    full: "Meridian Blacklight", short: "Meridian Blacklight", parent: "Meridian Signal",
    lore: "Meridian Blacklight (Meridian Signal, through Blacklight Systems) builds networked smart gear that uploads every shot you fire.",
  },
  lancet: {
    full: "Lancet Biodefense", short: "Lancet", parent: "Caduceus Vitalis",
    lore: "Lancet Biodefense (Caduceus Vitalis) sells darts, gas and fire as quarantine tools.",
  },
  grafthouse: {
    full: "Grafthouse", short: "Grafthouse", parent: "Caduceus Vitalis",
    lore: "Grafthouse (Caduceus Vitalis) grafts weapons into people and calls the surgery a fitting.",
  },
  greenline: {
    full: "Greenline Outfitters", short: "Greenline", parent: "Verdant Provision",
    lore: "Greenline Outfitters (Verdant Provision) kits out the rangers who cull Incursion beasts out past the fence.",
  },
  velvet: {
    full: "Velvet Arms", short: "Velvet Arms", parent: "Obsidian Holdings",
    lore: "Velvet Arms (Obsidian Holdings) makes elegant concealables, handed out as gifts in the Velvet Room.",
  },
  greyledger: {
    full: "Grey Ledger", short: "Grey Ledger", parent: "Sanctum Assurance",
    lore: "Grey Ledger (Sanctum Assurance) calls its nets, restraints and quiet rifles “compliance gear”.",
  },
  sealwarden: {
    full: "Seal Warden Armory", short: "Seal Warden", parent: "Aequitas Mandate",
    lore: "Seal Warden Armory (Aequitas Mandate) names warrant-service shotguns and batons after courtroom words, without irony.",
  },
  whitedoor: {
    full: "White Door Tactical", short: "White Door", parent: "Lazarus Extract",
    lore: "White Door Tactical (Lazarus Extract) builds extraction kit: compact, light, and sized to ride beside a med-bag.",
  },
  nyx: {
    full: "Nyx Undermarket", short: "Nyx", parent: "Nyx Cartel",
    lore: "Nyx Undermarket (Nyx Cartel) sells cheap, rugged Sinks guns, and most of them are unlicensed copies of somebody else’s design.",
  },
  kestrel: {
    full: "Kestrel Aerodyne", short: "Kestrel", parent: "Kestrel Dynamics",
    lore: "Kestrel Aerodyne (Kestrel Dynamics) builds missiles and drone pods and nothing you can hold.",
  },
});

/**
 * Every weapon SKU, by `_dsid`.
 *
 *  * `key`   — the `GHOSTWIRE.Gear.Items.<key>` lang entry the pack row points at.
 *  * `maker` — a key of {@link MAKERS}.
 *  * `model` — the house's own designation, printed after the maker's short name.
 *  * `old` / `name` — present **only** on the 0.3.134 firearm renames. `old` is the 0.3.133 printed
 *    name the migration matches on; `name` is the new one. A row with no `name` keeps its name and
 *    only has its maker swapped.
 *  * `extra` — one more sentence this particular gun's card carries.
 */
export const WEAPON_MAKERS = Object.freeze({
  // ---- pistols / SMGs (renamed)
  "popper": { key: "Popper", old: "Popper", name: "Ferrum Rivet", maker: "ferrum", model: "Rivet" },
  "workhorse": { key: "Workhorse", old: "Workhorse", name: "IW Journeyman", maker: "iw", model: "Journeyman" },
  "hand-cannon": { key: "HandCannon", old: "Hand-Cannon", name: "Argent Sovereign .50", maker: "argent", model: "Sovereign .50" },
  "slugger": { key: "Slugger", old: "Slugger", name: "Seal Warden Gavel", maker: "sealwarden", model: "Gavel" },
  "sleeve-gun": { key: "SleeveGun", old: "Sleeve-Gun", name: "Velvet Cufflink", maker: "velvet", model: "Cufflink" },
  "ghost-pistol": { key: "GhostPistol", old: "Ghost Pistol", name: "Velvet Nocturne", maker: "velvet", model: "Nocturne" },
  "zapper": { key: "Zapper", old: "Zapper", name: "Seraph Mercy", maker: "seraph", model: "Mercy" },
  "buzz-gun": { key: "BuzzGun", old: "Buzz-Gun", name: "Nyx Wasp-9", maker: "nyx", model: "Wasp-9" },
  "chatter": { key: "Chatter", old: "Chatter", name: "Velvet Murmur", maker: "velvet", model: "Murmur" },
  "streetsweeper-smg": { key: "StreetsweeperSmg", old: "Streetsweeper SMG", name: "Seraph Halcyon", maker: "seraph", model: "Halcyon" },
  // ---- rifles / shotguns (renamed)
  "longshot": { key: "Longshot", old: "Longshot", name: "Greenline Longwatch", maker: "greenline", model: "Longwatch" },
  "milspec-battle-rifle": { key: "MilspecBattleRifle", old: "Milspec Battle Rifle", name: "IW Bastion", maker: "iw", model: "Bastion" },
  "chopper": {
    key: "Chopper", old: "Chopper", name: "Nyx Rattletrap", maker: "nyx", model: "Rattletrap",
    extra: "The Rattletrap is an unlicensed IW copy, pressed in a Sinks shop off stolen Iron Writ tooling — it runs, and IW would rather it did not.",
  },
  "streetline-carbine": { key: "StreetlineCarbine", old: "Streetline Carbine", name: "White Door Lifeline", maker: "whitedoor", model: "Lifeline" },
  "apex-rifle": { key: "ApexRifle", old: "Apex Rifle", name: "Meridian Vector", maker: "meridian", model: "Vector" },
  "whisper-rifle": { key: "WhisperRifle", old: "Whisper Rifle", name: "Grey Ledger Redaction", maker: "greyledger", model: "Redaction" },
  "brush-gun": { key: "BrushGun", old: "Brush-Gun", name: "Greenline Thornback", maker: "greenline", model: "Thornback" },
  "pipe-rifle": { key: "PipeRifle", old: "Pipe Rifle", name: "Nyx Gutterline", maker: "nyx", model: "Gutterline" },
  "autoshotgun": { key: "Autoshotgun", old: "Autoshotgun", name: "Seal Warden Verdict", maker: "sealwarden", model: "Verdict" },
  "boomstick": { key: "Boomstick", old: "Boomstick", name: "Nyx Doorknocker", maker: "nyx", model: "Doorknocker" },
  // ---- heavy (renamed)
  "chatterbox": { key: "Chatterbox", old: "Chatterbox", name: "IW Barrage-12", maker: "iw", model: "Barrage-12" },
  "hand-of-god": { key: "HandOfGod", old: "Hand-of-God", name: "IW Absolution", maker: "iw", model: "Absolution" },
  "wallbreaker": { key: "Wallbreaker", old: "Wallbreaker", name: "Ferrum Mason .60", maker: "ferrum", model: "Mason .60" },
  "tank-cracker": { key: "TankCracker", old: "Tank-Cracker", name: "Ferrum Keystone", maker: "ferrum", model: "Keystone" },
  "siege-missile": { key: "SiegeMissile", old: "Siege Missile", name: "Kestrel Talon", maker: "kestrel", model: "Talon" },
  "grease-gun": { key: "GreaseGun", old: "Grease-Gun", name: "Nyx Grinder", maker: "nyx", model: "Grinder" },
  "dragons-breath": {
    key: "DragonsBreath", old: "Dragon’s Breath", name: "Lancet Cauterizer", maker: "lancet", model: "Cauterizer",
    extra: "Lancet sells the Cauterizer as a quarantine sterilizer, and the invoice says so.",
  },
  // ---- exotic guns (renamed)
  "dart-gun": { key: "DartGun", old: "Dart-Gun", name: "Lancet Hushdart", maker: "lancet", model: "Hushdart" },
  "gauss-needler": { key: "GaussNeedler", old: "Gauss Needler", name: "Seraph Stilling", maker: "seraph", model: "Stilling" },
  "net-gun": { key: "NetGun", old: "Net-Gun", name: "Grey Ledger Lien", maker: "greyledger", model: "Lien" },

  // ---- names kept; maker swapped (melee, thrown, bows, nets)
  "shock-stick": { key: "ShockStick", maker: "sealwarden", model: "Prod" },
  "street-blade": { key: "StreetBlade", maker: "iw", model: "Combat" },
  "monoblade": { key: "Monoblade", maker: "velvet", model: "Edge" },
  "monowhip": { key: "Monowhip", maker: "velvet", model: "Razorline" },
  "cyber-spur": { key: "CyberSpur", maker: "grafthouse", model: "Talon" },
  "slab-hammer": { key: "SlabHammer", maker: "deepworks", model: "Roughneck" },
  "warhammer": { key: "Warhammer", maker: "ferrum", model: "Crusher" },
  "machete": { key: "Machete", maker: "greenline", model: "Bushmaster" },
  "knuckles": { key: "Knuckles", maker: "argent", model: "Persuader" },
  "chain-lash": { key: "ChainLash", maker: "nyx", model: "Coilwork" },
  "powered-greatsword": { key: "PoweredGreatsword", maker: "iw", model: "Paladin" },
  "scaffold-pike": { key: "ScaffoldPike", maker: "nyx", model: "Longstaff" },
  "scrap-cleaver": { key: "ScrapCleaver", maker: "nyx", model: "Warblade" },
  "hand-crossbow": { key: "HandCrossbow", maker: "greenline", model: "Sting" },
  "heavy-crossbow": { key: "HeavyCrossbow", maker: "nyx", model: "Bolt" },
  "hunting-bow": { key: "HuntingBow", maker: "greenline", model: "Draw" },
  "street-bow": { key: "StreetBow", maker: "greenline", model: "Silent" },
  "scrap-bow": { key: "ScrapBow", maker: "nyx", model: "Reclaim Draw" },
  "weighted-net": { key: "WeightedNet", maker: "greyledger", model: "Snarecast" },
  "emp-grenade": { key: "EmpGrenade", maker: "meridian", model: "Nullfield" },
  "firestarter": { key: "Firestarter", maker: "lancet", model: "Ember" },
  "flash-bang-3e": { key: "FlashBang3e", maker: "sealwarden", model: "Dazzle" },
  "frag": { key: "Frag", maker: "iw", model: "Splinter" },
  "gasser": { key: "Gasser", maker: "lancet", model: "Choke" },
  "shaped-charge": { key: "ShapedCharge", maker: "deepworks", model: "Demo" },
  "smart-grenade": { key: "SmartGrenade", maker: "meridian", model: "Airburst" },
  "smoke": { key: "SmokeGrenade", maker: "whitedoor", model: "Screening Canister" },
  "thermite-charge": { key: "ThermiteCharge", maker: "deepworks", model: "Meltdown" },
  "throwing-knife": { key: "ThrowingKnife", maker: "velvet", model: "Fan" },
  // ---- vehicle mounts: names kept, "Ironclad" becomes "IW"
  "ashwalker": { key: "Ashwalker", maker: "ferrum", model: "Hull-Clearer" },
  "crownfire": { key: "Crownfire", maker: "iw", model: "Traverse Autocannon" },
  "godsfinger": { key: "Godsfinger", maker: "ferrum", model: "Breach Cannon" },
  "hailstorm": { key: "Hailstorm", maker: "iw", model: "Rotary Battery" },
  "hornet-pod": { key: "HornetPod", maker: "kestrel", model: "Swarmcaster" },
  "lanternhead": { key: "Lanternhead", maker: "nyx", model: "Streetlight" },
  "quiverframe": { key: "Quiverframe", maker: "kestrel", model: "Guided Rack" },
  "roadspike": { key: "Roadspike", maker: "ferrum", model: "Lane-Sweeper" },
  "streetlash": { key: "Streetlash", maker: "iw", model: "Coaxial Pair" },
});

/** dsid → { old, name, key } for the firearms 0.3.134 renamed. */
export const WEAPON_RENAMES = Object.freeze(Object.fromEntries(
  Object.entries(WEAPON_MAKERS)
    .filter(([, row]) => row.name)
    .map(([dsid, row]) => [dsid, Object.freeze({ old: row.old, name: row.name, key: row.key })]),
));

/**
 * Real-world and Shadowrun brands that must not appear in any Ghostwire weapon text.
 *
 * The smoke greps lang/en.json and docs/raw/08-kits-gear-wealth.md for these; a new SKU that reaches
 * for one goes red rather than shipping somebody else's trademark in a Creator-License product.
 */
export const BANNED_BRANDS = Object.freeze([
  "Ares", "Fichetti", "Renraku", "Shiawase", "Ruger", "Remington", "SternMeyer", "Ingram",
  "Ceska", "Enfield", "Defiance", "Cavalier", "Streek", "Lone Star", "Ranger Arms", "AK-Kalash",
  "Colt", "Beretta", "Browning", "Glock", "Narcoject", "Parashield",
]);

/** The `<em>` flavour line every weapon card opens with: `Name · Maker Model · what it is`. */
export function flavourLine(dsid, { type = "" } = {}) {
  const row = WEAPON_MAKERS[dsid];
  if (!row) return "";
  const maker = MAKERS[row.maker];
  const name = row.name ?? row.old ?? row.key;
  return [name, `${maker.short} ${row.model}`, type].filter(Boolean).join(" · ");
}

/**
 * Is this the stock 0.3.133 name for this weapon (so the migration may rewrite it)?
 *
 * True for the old printed name and for the i18n key the pack row stores, and **only** those: any
 * other string is a name somebody chose, and a migration that overwrites a chosen name is a bug.
 */
export function isStockWeaponName(dsid, current) {
  const row = WEAPON_RENAMES[dsid];
  if (!row) return false;
  const text = String(current ?? "").trim();
  if (!text) return false;
  return (text === row.old) || (text === row.name) || (text === `GHOSTWIRE.Gear.Items.${row.key}.Name`);
}

/**
 * The rename this item needs, or null.
 *
 * Match order is the whole rule:
 *  1. `_dsid` / `flags.<module>.dsid` — survives a rename, survives a Director's edit, and is what
 *     ammo, weapon skills and the SFX map key off. Even here the *current* name has to still be a
 *     stock one, so "Lucky" stays Lucky.
 *  2. The old printed name, for a world copy old enough to have lost its dsid.
 *
 * @param {{name?: string, system?: object, flags?: object}} item  Item data, live or plain.
 * @returns {{dsid: string, from: string, to: string}|null}
 */
export function weaponRenameFor(item) {
  const current = String(item?.name ?? "").trim();
  if (!current) return null;
  const dsid = item?.system?._dsid ?? item?.flags?.[MODULE_ID]?.dsid ?? null;
  if (dsid && WEAPON_RENAMES[dsid]) {
    const row = WEAPON_RENAMES[dsid];
    if (current === row.name) return null;                        // already renamed
    if (!isStockWeaponName(dsid, current)) return null;           // a Director named it
    return { dsid, from: current, to: row.name };
  }
  if (dsid) return null;                                          // a dsid we do not rename
  for (const [key, row] of Object.entries(WEAPON_RENAMES)) {
    if (current === row.old) return { dsid: key, from: current, to: row.name };
  }
  return null;
}

/**
 * Generated weapon-use abilities carry the weapon's printed name ("Fire Popper"), so a world that
 * armed a Popper before 0.3.134 has an ability nobody renamed. The ability keeps its `fromGearId`
 * link and its `gear-use-<dsid>` dsid either way — only the label is stale.
 *
 * @param {string} name   The ability's current name.
 * @returns {string|null} The renamed label, or null when nothing in it is an old weapon name.
 */
export function renameInAbilityLabel(name) {
  let text = String(name ?? "");
  if (!text) return null;
  let hit = false;
  for (const row of Object.values(WEAPON_RENAMES)) {
    // Longest-first is unnecessary here: no old name is a prefix of another old name except
    // "Chatter" / "Chatterbox", which this guard on a trailing word boundary settles.
    const pattern = new RegExp(`(^|\\s)${row.old.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=$|[\\s,.;:)])`, "g");
    if (!pattern.test(text)) continue;
    text = text.replace(pattern, `$1${row.name}`);
    hit = true;
  }
  return hit ? text : null;
}

/* ============================================ Foundry registration */

const SETTING = "weaponRenameVersion";
export const WEAPON_RENAME_VERSION = "0.3.134";

/**
 * Rename every world Item and embedded Actor item still wearing a 0.3.133 weapon name.
 *
 * Idempotent twice over: the setting gate means one pass per upgrade, and `weaponRenameFor` returns
 * null for anything already renamed, so running it by hand from the console changes nothing the
 * second time.
 *
 * @param {object} [options]
 * @param {boolean} [options.force]  Run even when the setting says this version already ran.
 * @returns {Promise<number>} documents touched.
 */
export async function migrateWeaponNames({ force = false } = {}) {
  if (!game.user.isGM) return 0;
  if (!force && (game.settings.get(MODULE_ID, SETTING) === WEAPON_RENAME_VERSION)) return 0;

  let touched = 0;
  const renameIn = async collectionOwner => {
    const updates = [];
    for (const item of collectionOwner.items ?? []) {
      const plan = weaponRenameFor(item);
      if (plan) { updates.push({ _id: item.id, name: plan.to }); continue; }
      const label = renameInAbilityLabel(item.name);
      if (label && (item.type === "ability") && item.getFlag(MODULE_ID, "fromGearId")) {
        updates.push({ _id: item.id, name: label });
      }
    }
    if (!updates.length) return;
    await collectionOwner.updateEmbeddedDocuments("Item", updates);
    touched += updates.length;
  };

  const worldUpdates = [];
  for (const item of game.items) {
    const plan = weaponRenameFor(item);
    if (plan) worldUpdates.push({ _id: item.id, name: plan.to });
  }
  if (worldUpdates.length) {
    await Item.updateDocuments(worldUpdates);
    touched += worldUpdates.length;
  }
  for (const actor of game.actors) {
    if (!actor.isOwner) continue;
    await renameIn(actor);
  }

  await game.settings.set(MODULE_ID, SETTING, WEAPON_RENAME_VERSION);
  if (touched) console.log(`${MODULE_ID} | weapon rename ${WEAPON_RENAME_VERSION}: ${touched} document(s) renamed`);
  return touched;
}

export function registerWeaponRename() {
  game.settings.register(MODULE_ID, SETTING, {
    scope: "world", config: false, type: String, default: "",
  });
  Hooks.once("ready", async () => {
    try {
      await migrateWeaponNames();
    } catch (error) {
      console.error(`${MODULE_ID} | weapon rename migration failed`, error);
    }
  });
  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      weaponRename: { MAKERS, WEAPON_MAKERS, WEAPON_RENAMES, migrateWeaponNames, weaponRenameFor },
    };
  }
}
