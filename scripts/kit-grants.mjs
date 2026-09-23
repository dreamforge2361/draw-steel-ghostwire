// G1 — Kit chargen street-band grants (docs/directors/kit-street-band-grants.md).
//
// Doctrine (RAW `08-kits-gear-wealth.md`): a Kit names a *category*, and the hero must OWN an item
// satisfying it or the Kit's bonuses are inert. The free starting Kit therefore arrives with the
// street-band object that makes it live on day one — the Economy side of the doctrine, paid for by
// nobody. Kit doctrine never costs ¥, and this grant never does either.
//
// What this is not: a second economy, or a respite perk. A hero who swaps Kits later buys their own
// qualifying gear through ¥ + Availability. So the gate is narrow — level 1, and this Kit dsid has
// never been street-granted on this actor. Merc (the Operator dual-Kit Origin) needs no special
// case: its advancement grants two kit Items at 1st level, so the hook simply fires twice.
//
// Mirrors module.mjs grantChromeItems (compendium copy + grant flag) and street-eye.mjs for hook
// shape. Unlike Street Eye there is NO ready-hook sweep: granting is one-way Item creation, and
// back-filling every existing hero in a world would dump gear onto sheets nobody asked about.
const MODULE_ID = "draw-steel-ghostwire";
const GEAR_PACK = `${MODULE_ID}.gear`;
const L = "GHOSTWIRE.KitGrants";

/** Stamped on every granted Item so the package is identifiable (and never re-granted). */
export const GRANT_FLAG = "kitStreetGrant";
/** Stamped on the Actor: `{ [kitDsid]: grantedAt }` — the "already had their chargen package" ledger. */
export const LEDGER_FLAG = "kitStreetGrants";

/**
 * Kit `_dsid` → the street-band SKUs that satisfy its `system.equipment`.
 *
 * One armor SKU when the Kit wants armor, Riot Shield when it wants a shield, and one weapon SKU per
 * entry in `system.equipment.weapon`. Everything here is Echelon 1 / Street in `src/packs/gear/`.
 * Never mods, never chrome, never Restricted-or-above.
 *
 * `weapons: []` with a `note` is a deliberate empty package: unarmed Kits fight with fists (already
 * owned, per the RAW improvised-weapon rule), and the Hacker deck-Kits *are* the host the Kit needs —
 * there is no separate object to hand over.
 */
export const KIT_STREET_GRANTS = {
  // --- finesse
  gunslinger: { armor: "secure-threads", shield: null, weapons: ["slugger"] },
  raider: { armor: "secure-threads", shield: "riot-shield", weapons: ["street-blade"] },
  streetsweeper: { armor: "armor-vest", shield: null, weapons: ["boomstick"] },
  // --- heavy
  breacher: { armor: "armor-vest", shield: "riot-shield", weapons: ["scrap-cleaver"] },
  bulldozer: { armor: null, shield: null, weapons: ["slab-hammer"] },
  juggernaut: { armor: "hardshell", shield: null, weapons: ["slab-hammer"] },
  warframe: { armor: "hardshell", shield: "riot-shield", weapons: ["scrap-cleaver"] },
  // --- magic-tech
  "no-kit": { armor: null, shield: null, weapons: [], note: "no-kit" },
  sanctified: { armor: "hardshell", shield: null, weapons: ["popper"] },
  spellblade: { armor: "secure-threads", shield: "riot-shield", weapons: ["scrap-cleaver"] },
  // --- melee
  brawler: { armor: null, shield: null, weapons: [], note: "unarmed" },
  chromeblade: { armor: "armor-vest", shield: null, weapons: ["street-blade", "scrap-cleaver"] },
  duelist: { armor: "secure-threads", shield: null, weapons: ["scrap-cleaver"] },
  mantis: { armor: null, shield: null, weapons: [], note: "unarmed" },
  monowhip: { armor: null, shield: null, weapons: ["chain-lash"] },
  reach: { armor: "armor-vest", shield: null, weapons: ["scaffold-pike"] },
  snarehunter: { armor: "secure-threads", shield: null, weapons: ["weighted-net", "scaffold-pike"] },
  "staff-adept": { armor: "secure-threads", shield: null, weapons: ["scaffold-pike"] },
  // --- ranged
  ghost: { armor: "secure-threads", shield: null, weapons: ["sleeve-gun"] },
  // Hexshot wants a bow/crossbow/dartgun in both the light and medium slots. G1 could only fill the
  // light one; G2 (0.3.100) added the Street-band Scrap-Bow so the medium slot is no longer a gap.
  hexshot: { armor: null, shield: null, weapons: ["street-bow", "scrap-bow"] },
  longshot: { armor: null, shield: null, weapons: ["pipe-rifle"] },
  saturation: { armor: "secure-threads", shield: null, weapons: ["popper", "boomstick"] },
  // --- tech
  "fabricators-bench": { armor: "secure-threads", shield: null, weapons: ["popper"] },
  "ferrum-padlock-6": { armor: null, shield: null, weapons: [], note: "deck-kit" },
  "field-chassis": { armor: "secure-threads", shield: null, weapons: ["popper"] },
  "meridian-lookout": { armor: null, shield: null, weapons: [], note: "deck-kit" },
  "nyx-switchblade": { armor: null, shield: null, weapons: [], note: "deck-kit" },
  "riggers-harness": { armor: "secure-threads", shield: null, weapons: ["popper"] },
};

/** The flat SKU list for one Kit, armor → shield → weapons. */
export function packageDsids(kitDsid) {
  const plan = KIT_STREET_GRANTS[kitDsid];
  if (!plan) return null;
  return [plan.armor, plan.shield, ...plan.weapons].filter(Boolean);
}

/* -------------------------------------------- reading the sheet */

const isHero = actor => actor?.type === "hero";
const isKit = item => item?.type === "kit";

/** A brand-new hero sits at level 0 until a class lands, so chargen is "not past 1st". */
export const isChargenHero = actor => Number(actor?.system?.level ?? 0) <= 1;

const ledgerOf = actor =>
  actor?.getFlag?.(MODULE_ID, LEDGER_FLAG)
  ?? actor?.flags?.[MODULE_ID]?.[LEDGER_FLAG]
  ?? {};

/** Has this actor already taken a chargen package for this Kit? Ledger first, stamped Items second. */
export function hasStreetGrant(actor, kitDsid) {
  if (ledgerOf(actor)[kitDsid]) return true;
  return [...(actor?.items ?? [])].some(i => (i?.flags?.[MODULE_ID]?.[GRANT_FLAG]?.kitDsid ?? null) === kitDsid);
}

/** SKUs the hero already owns need no duplicate — the Kit is live on the object already on the sheet. */
const ownedDsids = actor => new Set([...(actor?.items ?? [])].map(i => i?.system?._dsid).filter(Boolean));

/* -------------------------------------------- the gear pack */

let gearIndex = null;

async function gearIdsByDsid() {
  if (gearIndex) return gearIndex;
  const pack = game.packs.get(GEAR_PACK);
  if (!pack) {
    console.warn(`${MODULE_ID} | Kit grants: the gear pack (${GEAR_PACK}) is not available`);
    return new Map();
  }
  const index = await pack.getIndex({ fields: ["system._dsid"] });
  gearIndex = new Map();
  for (const entry of index) {
    const dsid = foundry.utils.getProperty(entry, "system._dsid");
    if (dsid) gearIndex.set(dsid, entry._id);
  }
  return gearIndex;
}

async function gearDocuments(dsids) {
  const ids = await gearIdsByDsid();
  const pack = game.packs.get(GEAR_PACK);
  const docs = [];
  for (const dsid of dsids) {
    const id = ids.get(dsid);
    if (!id) {
      console.warn(`${MODULE_ID} | Kit grants: no street SKU in the gear pack for "${dsid}"`);
      continue;
    }
    const doc = await pack.getDocument(id);
    if (doc) docs.push(doc);
  }
  return docs;
}

/* -------------------------------------------- the grant */

/**
 * Hand one hero the street-band package for one Kit, once.
 *
 * @param {Actor} actor                The hero taking the Kit.
 * @param {Item} kitItem               The kit Item that just landed.
 * @param {object} [options]
 * @param {boolean} [options.notify]   Post the notification + chat line.
 * @returns {Promise<{granted: string[], skipped: string[], reason: string}|null>}
 */
export async function grantKitStreetPackage(actor, kitItem, { notify = true } = {}) {
  if (!isHero(actor) || !actor.isOwner || !isKit(kitItem)) return null;

  const kitDsid = kitItem.system?._dsid;
  const plan = kitDsid ? KIT_STREET_GRANTS[kitDsid] : null;
  // An unmapped Kit is left alone rather than guessed at — a wrong object is worse than none.
  if (!plan) return null;

  // Ownership rule: a later Kit is the hero's own shopping trip, not a second doctrine handout.
  if (!isChargenHero(actor)) return { granted: [], skipped: [], reason: "past-chargen" };
  if (hasStreetGrant(actor, kitDsid)) return { granted: [], skipped: [], reason: "already-granted" };

  const wanted = packageDsids(kitDsid);
  const grantedAt = new Date().toISOString();

  // Kits whose doctrine needs no purchased object (unarmed, deck-Kits) still take a ledger entry, so
  // the hero is on record as having had their chargen pass.
  if (!wanted.length) {
    await actor.setFlag(MODULE_ID, `${LEDGER_FLAG}.${kitDsid}`, grantedAt);
    if (notify) ui.notifications.info(game.i18n.format(`${L}.NoGear`, { kit: kitItem.name }));
    return { granted: [], skipped: [], reason: plan.note ?? "no-gear" };
  }

  // Already own the SKU (a pregen shipped with it, or an earlier Kit granted it)? Nothing to add.
  const owned = ownedDsids(actor);
  const needed = wanted.filter(dsid => !owned.has(dsid));
  const skipped = wanted.filter(dsid => owned.has(dsid));

  const sources = await gearDocuments(needed);
  const data = sources.map(source => {
    const itemData = game.items.fromCompendium(source, { clearFolder: true });
    foundry.utils.setProperty(itemData, `flags.${MODULE_ID}.${GRANT_FLAG}`, { kitDsid, grantedAt });
    return itemData;
  });

  const created = data.length ? await actor.createEmbeddedDocuments("Item", data) : [];
  await actor.setFlag(MODULE_ID, `${LEDGER_FLAG}.${kitDsid}`, grantedAt);

  const names = created.map(i => i.name);
  if (notify && names.length) announce(actor, kitItem, names);
  return { granted: names, skipped, reason: "granted" };
}

function announce(actor, kitItem, names) {
  const data = { actor: actor.name, kit: kitItem.name, items: names.join(", ") };
  const esc = foundry.utils.escapeHTML;
  ui.notifications.info(game.i18n.format(`${L}.Notify`, data));
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `<p><strong>${esc(game.i18n.format(`${L}.ChatTitle`, data))}</strong></p>`
      + `<p>${esc(game.i18n.format(`${L}.ChatBody`, data))}</p>`
      + `<p class="hint">${esc(game.i18n.localize(`${L}.Ownership`))}</p>`,
    whisper: ChatMessage.getWhisperRecipients("GM").map(u => u.id),
  });
}

export function registerKitGrants() {
  Hooks.on("createItem", (item, options, userId) => {
    if (userId !== game.user.id || !isKit(item) || !isHero(item.parent)) return;
    grantKitStreetPackage(item.parent, item, { notify: true });
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      KIT_STREET_GRANTS,
      packageDsids,
      grantKitStreetPackage,
      hasStreetGrant,
    };
  }
  console.log(`${MODULE_ID} | Kit grants: chargen street-band packages registered`);
}
