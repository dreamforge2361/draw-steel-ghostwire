/**
 * B59 — Pregen advancement level gate.
 *
 * When filling a pregen at class level N, only apply advancement / grant entries
 * whose required level is ≤ N. Shared by tools/pregens-to-actors.mjs and the
 * smoke test so every grant path uses the same rule.
 */

/**
 * Extract the numeric level gate from an advancement, handling the shapes we
 * ship (and a few Draw Steel variants seen in the wild).
 *
 * @returns {number|null} required level, or null when metadata is missing
 */
export function advancementRequiredLevel(adv) {
  if (!adv || typeof adv !== "object") return null;
  const req = adv.requirements ?? {};

  if (typeof req.level === "number") return req.level;

  if (Array.isArray(req.levels) && req.levels.length) {
    const nums = req.levels.filter(n => typeof n === "number");
    if (nums.length) return Math.min(...nums);
  }

  if (typeof adv.unlock === "number") return adv.unlock;
  if (typeof adv.unlock?.level === "number") return adv.unlock.level;
  if (typeof req.unlock === "number") return req.unlock;
  if (typeof req.unlock?.level === "number") return req.unlock.level;

  // Some packs put the gate on the advancement root.
  if (typeof adv.level === "number") return adv.level;

  return null;
}

/**
 * Should this advancement fire when filling a hero at `targetLevel`?
 *
 * Policy for missing level metadata (`null` / absent):
 * - Treat as always-on (effective level 0) and record a warning.
 * - Skip-with-reject would break kit / career / ancestry / culture grants,
 *   which intentionally use `requirements.level: null` in this module.
 * - Class / subclass advancements in Ghostwire always carry a numeric level;
 *   if one ever lacks it, the warning surfaces it for a data fix.
 *
 * @param {object} adv
 * @param {number} targetLevel
 * @param {{ warnings?: string[], label?: string }} [ctx]
 */
export function advancementMeetsLevel(adv, targetLevel, ctx = {}) {
  const need = advancementRequiredLevel(adv);
  if (need == null) {
    const label = ctx.label ?? adv?.name ?? adv?.type ?? "(unnamed)";
    ctx.warnings?.push(`advancement lacks level metadata (treated as always-on): ${label}`);
    return true;
  }
  return need <= targetLevel;
}

/**
 * Build dsid → minimum granting class level from every indexed item's advancements.
 * Abilities / features that never appear in a pool are absent (manual seeds).
 *
 * @param {Map<string, { json: object }>} index  item _id → { json }
 * @param {(uuid: string) => string|undefined} idFromUuid
 */
export function buildGrantLevelByDsid(index, idFromUuid) {
  const map = new Map();
  for (const { json } of index.values()) {
    for (const adv of Object.values(json.system?.advancements ?? {})) {
      const need = advancementRequiredLevel(adv);
      if (need == null) continue; // always-on pools don't constrain seeds
      for (const entry of adv.pool ?? []) {
        const id = idFromUuid(entry.uuid);
        const dsid = index.get(id)?.json?.system?._dsid;
        if (!dsid) continue;
        const prev = map.get(dsid);
        if (prev == null || need < prev) map.set(dsid, need);
      }
    }
  }
  return map;
}

/**
 * True when a roster ability dsid may be seeded at `targetLevel`.
 * Manual seeds (not in any advancement pool) are allowed.
 */
export function abilityAllowedAtLevel(dsid, targetLevel, grantLevelByDsid) {
  const need = grantLevelByDsid.get(dsid);
  if (need == null) return true;
  return need <= targetLevel;
}
