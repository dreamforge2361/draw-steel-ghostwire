// B94 — Street Eye / Companion Link (docs/spikes/B94-STREET-EYE-COMPANION-LINK.md).
//
// A hero who carries a qualifying v1 air scout drone gets one Street Eye ability.
// Remove the last qualifier and the ability leaves the sheet.
// Mirrors B49 equipment-use (inventory create/delete → grant/revoke) and chrome
// grantChromeItems (compendium copy + grant flag). Does not replace Wrench Deploy
// & Command or machines.mjs Deploy / Recall.
const MODULE_ID = "draw-steel-ghostwire";
const STREET_EYE_ID = "GwStreetEyeB9401";
const STREET_EYE_UUID = `Compendium.${MODULE_ID}.abilities.Item.${STREET_EYE_ID}`;
export const STREET_EYE_DSID = "street-eye";

const SCOUT_TAGS = new Set(["recon", "mark", "decoy"]);

const vehicleFlags = item =>
  item?.flags?.[MODULE_ID]?.vehicle
  ?? item?.getFlag?.(MODULE_ID, "vehicle")
  ?? null;

const startsWith = (value, prefix) => String(value ?? "").toLowerCase().startsWith(prefix);

/** Personal / Light only — Vehicle-scale combat frames stay out of v1. */
const isPersonalOrLight = scale => {
  const value = String(scale ?? "").toLowerCase();
  return value.startsWith("personal") || value.startsWith("light");
};

const hasScoutTag = tags => (Array.isArray(tags) ? tags : []).some(tag => SCOUT_TAGS.has(String(tag).toLowerCase()));

/** Is this a v1 qualifying air scout drone (Personal/Light Air + Recon/Mark/Decoy)? */
export function isQualifyingScoutDrone(item) {
  const vehicle = vehicleFlags(item);
  if (!vehicle?.drone) return false;
  if (!startsWith(vehicle.domain, "air")) return false;
  if (!isPersonalOrLight(vehicle.scale)) return false;
  return hasScoutTag(vehicle.tags);
}

export const isStreetEyeAbility = item =>
  item?.type === "ability"
  && (
    item.system?._dsid === STREET_EYE_DSID
    || item?.flags?.[MODULE_ID]?.streetEyeGranted
    || item?.getFlag?.(MODULE_ID, "streetEyeGranted")
  );

export const actorHasQualifyingDrone = actor => (actor?.items ?? []).some(isQualifyingScoutDrone);

const isHero = actor => actor?.type === "hero";

const streetEyeCopies = actor => [...(actor?.items ?? [])].filter(isStreetEyeAbility);

/**
 * Bring one hero's Street Eye ability into agreement with inventory.
 * Idempotent. Owning client does the writes.
 * @returns {Promise<{added: number, removed: number}>}
 */
export async function syncStreetEye(actor, { notify = false } = {}) {
  if (!isHero(actor) || !actor.isOwner) return { added: 0, removed: 0 };

  const qualify = actorHasQualifyingDrone(actor);
  const existing = streetEyeCopies(actor);

  if (!qualify) {
    if (!existing.length) return { added: 0, removed: 0 };
    await actor.deleteEmbeddedDocuments("Item", existing.map(i => i.id));
    if (notify) {
      ui.notifications.info(game.i18n.format("GHOSTWIRE.StreetEye.Revoked", { actor: actor.name }));
    }
    return { added: 0, removed: existing.length };
  }

  if (existing.length > 1) {
    await actor.deleteEmbeddedDocuments("Item", existing.slice(1).map(i => i.id));
  }
  if (existing.length >= 1) return { added: 0, removed: Math.max(0, existing.length - 1) };

  const source = await fromUuid(STREET_EYE_UUID);
  if (!source) {
    console.warn(`${MODULE_ID} | Street Eye is missing from the abilities pack (${STREET_EYE_UUID})`);
    return { added: 0, removed: 0 };
  }
  const data = game.items.fromCompendium(source, { clearFolder: true });
  foundry.utils.setProperty(data, `flags.${MODULE_ID}.streetEyeGranted`, true);
  await actor.createEmbeddedDocuments("Item", [data]);
  if (notify) {
    ui.notifications.info(game.i18n.format("GHOSTWIRE.StreetEye.Granted", { actor: actor.name }));
  }
  return { added: 1, removed: 0 };
}

const shouldWatch = item => {
  if (isStreetEyeAbility(item) || isQualifyingScoutDrone(item)) return true;
  return !!vehicleFlags(item)?.drone;
};

export function registerStreetEye() {
  Hooks.once("ready", async () => {
    let added = 0;
    let removed = 0;
    for (const actor of game.actors) {
      if (!actor.isOwner) continue;
      const result = await syncStreetEye(actor);
      added += result.added;
      removed += result.removed;
    }
    if (added || removed) console.log(`${MODULE_ID} | Street Eye: +${added} / -${removed}`);
  });

  Hooks.on("createItem", (item, options, userId) => {
    if (userId !== game.user.id || !isHero(item.parent) || !shouldWatch(item)) return;
    syncStreetEye(item.parent, { notify: true });
  });

  Hooks.on("deleteItem", (item, options, userId) => {
    if (userId !== game.user.id || !isHero(item.parent) || !shouldWatch(item)) return;
    syncStreetEye(item.parent, { notify: true });
  });

  Hooks.on("updateItem", (item, changes, options, userId) => {
    if (userId !== game.user.id || !isHero(item.parent)) return;
    if (!foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.vehicle`) && !shouldWatch(item)) return;
    syncStreetEye(item.parent, { notify: true });
  });

  Hooks.on("createActor", (actor, options, userId) => {
    if (userId !== game.user.id) return;
    syncStreetEye(actor);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      isQualifyingScoutDrone,
      syncStreetEye,
      STREET_EYE_DSID,
    };
  }
  console.log(`${MODULE_ID} | Street Eye: inventory grant/revoke registered`);
}
