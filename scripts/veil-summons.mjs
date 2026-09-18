// Veil summons: Elementalist elementals and Street Priest pact spirits that scale with the caster
// (docs/raw/17-elementalist.md, docs/raw/18-street-priest.md, docs/spikes/B53-SUMMON-SCALING-SPIRITS-ELEMENTALS.md).
//
// The sprite pattern (sprites.mjs) — stamp a linked world Actor from a Summons & Machines template, Stamina from
// the live caster, refresh on level-up — but driven by each class's own RAW instead of a sprite band matrix:
// - The summon *abilities* are the handle. Draw Steel emits no ability-use hook, so, as in sfx.mjs, the signal is the
//   chat message DrawSteelAbility#use() creates: its abilityUse part names the ability and its abilityResult part
//   carries the Bind roll's tier. The ability sheets also get a roster with a manual Summon / Dismiss fallback.
// - Elementalist: Ember / Zephyr / Boulder Companion (Rank 1 extension, 3 rounds, no bind roll); Summon Elemental
//   (rank up to the bind cap: R1 from 1st, R2 from 5th, R3 from 7th level); Twin Elemental Summon (two binds, one
//   independent only at echelon 3+); Greater Elemental Summon (Rank 4, Rank 5 at echelon 4).
// - Street Priest: Invoke the Pact. Bind Check low = failed bind (nothing to place), middle = extension, high =
//   independent. The ministry picks the spirit; the priest's pact picks its Light / Dark tint. Sentinel Spirit is
//   not a summon (unharmable, until the end of the next turn), so it stays a token-less ability.
// Stamina locked Veil §C3 (2026-09-18): ELEMENTAL_BASE / SPIRIT_BASE / BIND_CAP — see docs/spikes/B53 and B60.
//
// Links, as with sprites: pet flags.<module> = { kind, subtype, rank, hybridTier, summoner: <actorUuid>, ownerUuid,
// dsid, sourceAbility, summonedAtLevel, formula, bind, scaleRank, expires, pact }; caster
// flags.<module>.veilSummons = { uuids }. The world scan by `summoner` is the truth; the caster flag is a mirror.

const MODULE_ID = "draw-steel-ghostwire";
const PACK_ID = `${MODULE_ID}.summons`;
const UI = "GHOSTWIRE.Summons.Veil.UI";

// §C3 locked: rank base + (Logic × level). Companions are Rank 1.
const ELEMENTAL_BASE = { 1: 15, 2: 25, 3: 35, 4: 50, 5: 65 };
// §C3 locked: form base + (Persona × level). Extension has no Stamina track of its own in RAW; the token pool is a
// convenience so its strike can be rolled — the Director may treat extension as untargetable.
const SPIRIT_BASE = { extension: 20, independent: 30 };

// Bound elementals a caster may sustain at once. Twin Elemental Summon is the RAW apex at two; a new bind over
// the cap releases the oldest, so a summon whose Essence is already spent never fizzles.
const BIND_CAP = 2;
const COMPANION_ROUNDS = 3;   // Ember / Zephyr / Boulder Companion: "3 rounds, sustain-free"
const BROKEN_ROUNDS = 1;      // A low Bind roll: "hostile and free for one round before the Veil pulls it back"

const COMPANIONS = ["ember-companion", "zephyr-companion", "boulder-companion"];
const ELEMENTAL_ABILITIES = [...COMPANIONS, "summon-elemental", "twin-elemental-summon", "greater-elemental-summon"];
const SPIRIT_ABILITIES = ["invoke-the-pact"];
const MINISTRY_SPIRIT = { shepherd: "spirit-guardian", templar: "spirit-warrior", exorcist: "spirit-hunter" };
const SPIRITS = Object.values(MINISTRY_SPIRIT);
const PACT_TINTS = { light: "#fff1b8", dark: "#c9a0ff" };

const classDsid = actor => (actor?.type === "hero") ? actor.system.class?.system._dsid : null;
const isElementalist = actor => classDsid(actor) === "elementalist";
const isStreetPriest = actor => classDsid(actor) === "street-priest";
const casterLevel = actor => Number(actor?.system.level) || 1;
/** Draw Steel echelons: 1 (L1–3), 2 (L4–6), 3 (L7–9), 4 (L10). */
const casterEchelon = actor => {
  const echelon = Number(actor?.system.echelon);
  if (echelon) return echelon;
  const level = casterLevel(actor);
  return (level >= 10) ? 4 : (level >= 7) ? 3 : (level >= 4) ? 2 : 1;
};
/** Logic, Persona and Instinct are Draw Steel's Reason, Presence and Intuition under Ghostwire names. */
const casterLogic = actor => Number(actor?.system.characteristics?.reason?.value) || 0;
const casterPersona = actor => Number(actor?.system.characteristics?.presence?.value) || 0;
const casterInstinct = actor => Number(actor?.system.characteristics?.intuition?.value) || 0;
const subclassDsids = actor => [...(actor?.system.subclasses ?? [])].map(s => s.system._dsid);
const hasDsid = (actor, dsid) => !!actor?.items.some(i => i.system?._dsid === dsid);
const flag = (actor, key) => actor?.getFlag(MODULE_ID, key);

/** The highest rank Summon Elemental can bind: Rank 1 from 1st level, Rank 2 from 5th, Rank 3 from 7th. */
export function bindCapRank(actor) {
  const level = casterLevel(actor);
  if (level >= 7) return 3;
  if (level >= 5) return 2;
  return 1;
}

/** Greater Elemental Summon binds Rank 4, or Rank 5 at echelon 4. */
export const greaterRank = actor => (casterEchelon(actor) >= 4) ? 5 : 4;

export const elementalStamina = (rank, actor) => (ELEMENTAL_BASE[rank] ?? ELEMENTAL_BASE[1]) + (casterLogic(actor) * casterLevel(actor));
export const spiritStamina = (form, actor) => (SPIRIT_BASE[form] ?? SPIRIT_BASE.extension) + (casterPersona(actor) * casterLevel(actor));

/** Which spirit answers this priest: their ministry's, or null if they have none yet. */
const ministrySpirit = actor => subclassDsids(actor).map(d => MINISTRY_SPIRIT[d]).find(Boolean) ?? null;
const casterPact = actor => hasDsid(actor, "light-pact") ? "light" : hasDsid(actor, "dark-pact") ? "dark" : null;

/** Every Veil summon (elemental or spirit) this caster has out. */
export function veilSummons(actor) {
  if (!actor?.uuid) return [];
  return game.actors.filter(a => ["elemental", "spirit"].includes(flag(a, "kind")) && (flag(a, "summoner") === actor.uuid));
}

/** The caster who summoned this elemental or spirit, or null. */
export function veilSummoner(pet) {
  const uuid = ["elemental", "spirit"].includes(flag(pet, "kind")) ? flag(pet, "summoner") : null;
  const actor = uuid ? fromUuidSync(uuid) : null;
  return actor instanceof Actor ? actor : null;
}

const isCompanion = pet => (flag(pet, "kind") === "elemental") && (flag(pet, "subtype") === "companion");
const isBound = pet => (flag(pet, "kind") === "elemental") && (flag(pet, "subtype") === "elemental") && (flag(pet, "bind") !== "broken");

const abilityFamily = dsid => ELEMENTAL_ABILITIES.includes(dsid) ? "elemental" : SPIRIT_ABILITIES.includes(dsid) ? "spirit" : null;
const isVeilAbility = item => {
  if (item?.type !== "ability") return false;
  const family = abilityFamily(item.system?._dsid);
  return ((family === "elemental") && isElementalist(item.parent)) || ((family === "spirit") && isStreetPriest(item.parent));
};

async function syncRoster(actor) {
  if (!actor?.isOwner) return;
  const uuids = veilSummons(actor).map(s => s.uuid).sort();
  const current = [...(flag(actor, "veilSummons")?.uuids ?? [])].sort();
  if (uuids.join("|") !== current.join("|")) await actor.setFlag(MODULE_ID, "veilSummons", { uuids });
}

// The roster lives on the Actor, so the summon abilities' Item sheets have to be told to redraw.
function refreshSheets(actor) {
  for (const item of actor?.items ?? []) if (isVeilAbility(item) && item.sheet?.rendered) item.sheet.render();
}

async function templateFor(dsid) {
  const pack = game.packs.get(PACK_ID);
  if (!pack) return null;
  const index = await pack.getIndex({ fields: [`flags.${MODULE_ID}.dsid`] });
  const entry = index.find(e => foundry.utils.getProperty(e, `flags.${MODULE_ID}.dsid`) === dsid);
  return entry ? pack.getDocument(entry._id) : null;
}

async function summonFolder() {
  const name = game.i18n.localize(`${UI}.Folder`);
  return game.folders.find(f => (f.type === "Actor") && f.getFlag(MODULE_ID, "veilSummons"))
    ?? Folder.create({ name, type: "Actor", flags: { [MODULE_ID]: { veilSummons: true } } });
}

const RING = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

function placement(caster, index) {
  const grid = canvas.grid.size;
  const token = caster?.getActiveTokens?.()[0]?.document;
  const [dx, dy] = RING[index % RING.length];
  if (token) return { x: token.x + (dx * Math.max(token.width, 1) * grid), y: token.y + (dy * Math.max(token.height, 1) * grid) };
  const { x, y } = canvas.stage.pivot;
  return { x: (Math.round(x / grid) + dx) * grid, y: (Math.round(y / grid) + dy) * grid };
}

/** The live Stamina and characteristics a pet should carry for this caster right now. */
function stamp(pet, caster) {
  const kind = flag(pet, "kind");
  const level = casterLevel(caster);
  if (kind === "spirit") {
    const form = flag(pet, "hybridTier");
    return {
      stamina: spiritStamina(form, caster),
      rank: null,
      update: {
        "system.characteristics.presence.value": casterPersona(caster),
        "system.characteristics.intuition.value": casterInstinct(caster),
        "system.monster.level": level,
      },
    };
  }
  const rank = (flag(pet, "sourceAbility") === "greater-elemental-summon") ? greaterRank(caster) : (Number(flag(pet, "rank")) || 1);
  return {
    stamina: elementalStamina(rank, caster),
    rank,
    update: { "system.characteristics.reason.value": casterLogic(caster), "system.monster.level": level },
  };
}

/**
 * Stamp one Veil summon from its template beside the caster.
 * @param {Actor} caster
 * @param {object} spec
 * @param {string} spec.dsid             Template dsid in Ghostwire Summons & Machines.
 * @param {string} spec.sourceAbility    The ability that summoned it.
 * @param {number} [spec.rank]           Elemental rank (Stamina row).
 * @param {string} [spec.hybridTier]     extension | independent; defaults to the template's.
 * @param {string|null} [spec.bind]      clean (high) | resists (middle) | broken (low) | null (no bind roll).
 * @param {number|null} [spec.rounds]    Combat rounds it lasts; null = until dismissed / encounter rule.
 * @param {boolean} [spec.scaleRank]     Re-bind at the new cap rank on level-up (Summon Elemental at its cap).
 * @param {object} [spec.position]      {x, y} instead of the ring beside the caster.
 * @returns {Promise<Actor|null>}
 */
export async function summonVeil(caster, { dsid, sourceAbility, rank = 1, hybridTier, bind = null, rounds = null, scaleRank = false, position } = {}) {
  if (!canvas.scene) { ui.notifications.warn(game.i18n.localize(`${UI}.NoScene`)); return null; }
  if (!game.user.can("ACTOR_CREATE") || !game.user.can("TOKEN_CREATE")) { ui.notifications.warn(game.i18n.localize(`${UI}.NoPermission`)); return null; }
  const template = await templateFor(dsid);
  if (!template) { ui.notifications.error(game.i18n.format(`${UI}.NoTemplate`, { dsid })); return null; }

  const templateFlags = template.flags?.[MODULE_ID] ?? {};
  const kind = templateFlags.kind;
  hybridTier ??= templateFlags.hybridTier ?? "extension";
  const level = casterLevel(caster);
  const broken = bind === "broken";
  const combat = game.combat?.started ? game.combat : null;
  const expires = (combat && rounds) ? { combat: combat.id, round: combat.round + rounds } : null;
  const pact = (kind === "spirit") ? casterPact(caster) : null;

  const flags = {
    ...templateFlags, summoner: caster.uuid, ownerUuid: caster.uuid, sourceAbility, hybridTier, bind, scaleRank,
    summonedAtLevel: level, expires,
  };
  if (kind === "elemental") flags.rank = rank;
  if (kind === "spirit") flags.pact = pact;
  const probe = { getFlag: (scope, key) => flags[key] };
  const { stamina, update } = stamp(probe, caster);
  flags.formula = (kind === "spirit") ? `spirit-${hybridTier}` : `elemental-rank-${rank}`;

  // The caster's players own a bound summon; a broken bind is loose and hostile, so it stays the Director's.
  const ownership = { default: 0 };
  if (!broken) {
    for (const [userId, ownershipLevel] of Object.entries(caster.ownership ?? {})) {
      if ((userId !== "default") && (ownershipLevel >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)) ownership[userId] = ownershipLevel;
    }
  }

  const data = game.actors.fromCompendium(template);
  foundry.utils.mergeObject(data, {
    folder: (await summonFolder())?.id ?? null, ownership,
    "system.stamina": { value: stamina, max: stamina, temporary: 0 },
    "prototypeToken.actorLink": true,
    "prototypeToken.disposition": broken ? CONST.TOKEN_DISPOSITIONS.HOSTILE : CONST.TOKEN_DISPOSITIONS.FRIENDLY,
    [`flags.${MODULE_ID}`]: flags,
  });
  for (const [path, value] of Object.entries(update)) foundry.utils.setProperty(data, path, value);
  // The pact is known at summon time, so the spirit arrives tinted: the matching Pact effect on, the other off.
  if (pact) {
    for (const effect of data.effects ?? []) {
      const tint = effect.flags?.[MODULE_ID]?.pactTint;
      if (tint) effect.disabled = tint !== pact;
    }
    foundry.utils.setProperty(data, "prototypeToken.texture.tint", PACT_TINTS[pact]);
  }
  const actor = await Actor.create(data);
  if (!actor) return null;

  const index = veilSummons(caster).length - 1;
  const tokenDocument = await actor.getTokenDocument({ ...(position ?? placement(caster, index)), actorLink: true });
  await canvas.scene.createEmbeddedDocuments("Token", [tokenDocument.toObject()]);
  await syncRoster(caster);
  refreshSheets(caster);
  return actor;
}

/** Dismiss one Veil summon: its tokens on every Scene, then the Actor. */
export async function dismissVeil(pet, { silent = false } = {}) {
  if (!(pet instanceof Actor)) return;
  const caster = veilSummoner(pet);
  const name = pet.name;
  for (const scene of game.scenes) {
    const ids = scene.tokens.filter(t => t.actorId === pet.id).map(t => t.id);
    if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
  }
  await pet.delete({ ghostwireVeilDismiss: true });
  await syncRoster(caster);
  refreshSheets(caster);
  if (!silent) ui.notifications.info(game.i18n.format(`${UI}.Dismissed`, { name }));
}

/** Dismiss every Veil summon of one family (elemental | spirit), or all of them. */
export async function dismissAllVeil(caster, { family = null, silent = false } = {}) {
  const pets = veilSummons(caster).filter(p => !family || (flag(p, "kind") === family));
  for (const pet of pets) await dismissVeil(pet, { silent: true });
  await syncRoster(caster);
  refreshSheets(caster);
  if (!silent && pets.length) ui.notifications.info(game.i18n.format(`${UI}.DismissedAll`, { name: caster.name, count: pets.length }));
  return pets.length;
}

/* -------------------------------------------- per-ability summon rules */

const BIND_BY_TIER = { 1: "broken", 2: "resists", 3: "clean" };

function choose(title, prompt, options) {
  const html = options.map((o, i) => `<option value="${o.value}"${i === 0 ? " selected" : ""}>${o.label}</option>`).join("");
  return foundry.applications.api.DialogV2.prompt({
    window: { title },
    content: `<p>${prompt}</p><div class="form-group"><select name="choice">${html}</select></div>`,
    ok: { label: game.i18n.localize(`${UI}.Summon`), callback: (event, button) => button.form.elements.choice.value },
    rejectClose: false,
  });
}

const rankLine = (rank, caster, form) => game.i18n.format(`${UI}.RankLine`, {
  rank, stamina: elementalStamina(rank, caster), form: game.i18n.localize(`${UI}.Form.${form}`),
});

/** Make room under the bind cap for `incoming` new binds by releasing the oldest. */
async function makeRoom(caster, incoming) {
  const bound = veilSummons(caster).filter(isBound)
    .sort((a, b) => (a._stats?.createdTime ?? 0) - (b._stats?.createdTime ?? 0));
  const excess = bound.length + incoming - BIND_CAP;
  for (const pet of bound.slice(0, Math.max(0, excess))) {
    ui.notifications.info(game.i18n.format(`${UI}.Released`, { name: pet.name, cap: BIND_CAP }));
    await dismissVeil(pet, { silent: true });
  }
}

/**
 * Resolve one use of a Veil summon ability into Actors on the canvas.
 * @param {Item} ability      The ability Item (embedded on the caster).
 * @param {object} [options]
 * @param {number|null} [options.tier]  The Bind roll's tier (1–3); null for a manual summon from the sheet.
 * @returns {Promise<Actor[]>}
 */
export async function summonFromAbility(ability, { tier = null } = {}) {
  const caster = ability?.parent;
  const dsid = ability?.system?._dsid;
  if (!isVeilAbility(ability)) return [];
  const manual = tier === null;
  const bind = manual ? "clean" : BIND_BY_TIER[tier];
  const summoned = [];
  const name = foundry.utils.escapeHTML(caster.name);

  if (COMPANIONS.includes(dsid)) {
    // 0 Essence, once per encounter: warn on a second use rather than eat it — the refresh is the table's call.
    const combat = game.combat?.started ? game.combat : null;
    if (combat && (flag(caster, "companionCombat") === combat.id)) {
      ui.notifications.warn(game.i18n.format(`${UI}.CompanionUsed`, { name: caster.name }));
    }
    for (const old of veilSummons(caster).filter(isCompanion)) await dismissVeil(old, { silent: true });
    const pet = await summonVeil(caster, {
      dsid: `companion-${dsid.replace("-companion", "")}`, sourceAbility: dsid, rank: 1,
      hybridTier: "extension", rounds: COMPANION_ROUNDS,
    });
    if (pet) {
      summoned.push(pet);
      if (combat && caster.isOwner) await caster.setFlag(MODULE_ID, "companionCombat", combat.id);
    }
  } else if (dsid === "summon-elemental") {
    const cap = bindCapRank(caster);
    let rank = cap;
    if (cap > 1) {
      const options = [];
      for (let r = cap; r >= 1; r--) options.push({ value: r, label: rankLine(r, caster, (r >= 2) ? "independent" : "extension") });
      rank = Number(await choose(ability.name, game.i18n.format(`${UI}.RankPrompt`, { name, level: casterLevel(caster), cap }), options));
      if (!rank) return [];
    }
    await makeRoom(caster, 1);
    const pet = await summonVeil(caster, {
      dsid: `elemental-rank-${rank}`, sourceAbility: dsid, rank, bind,
      rounds: (bind === "broken") ? BROKEN_ROUNDS : null, scaleRank: rank === cap,
    });
    if (pet) summoned.push(pet);
  } else if (dsid === "twin-elemental-summon") {
    // Two extensions, or one independent + one extension (the independent only at echelon 3+). One bind for both.
    let ranks = [1, 1];
    if (casterEchelon(caster) >= 3) {
      const cap = bindCapRank(caster);
      const choice = await choose(ability.name, game.i18n.format(`${UI}.TwinPrompt`, { name }), [
        { value: "mixed", label: game.i18n.format(`${UI}.TwinMixed`, { rank: cap, stamina: elementalStamina(cap, caster), extension: elementalStamina(1, caster) }) },
        { value: "extensions", label: game.i18n.format(`${UI}.TwinExtensions`, { stamina: elementalStamina(1, caster) }) },
      ]);
      if (!choice) return [];
      if (choice === "mixed") ranks = [cap, 1];
    }
    await makeRoom(caster, 2);
    for (const rank of ranks) {
      const pet = await summonVeil(caster, {
        dsid: `elemental-rank-${rank}`, sourceAbility: dsid, rank, bind,
        rounds: (bind === "broken") ? BROKEN_ROUNDS : null,
      });
      if (pet) summoned.push(pet);
    }
  } else if (dsid === "greater-elemental-summon") {
    await makeRoom(caster, 1);
    const pet = await summonVeil(caster, {
      dsid: "elemental-greater", sourceAbility: dsid, rank: greaterRank(caster), hybridTier: "independent", bind,
      rounds: (bind === "broken") ? BROKEN_ROUNDS : null,
    });
    if (pet) summoned.push(pet);
  } else if (dsid === "invoke-the-pact") {
    // low = failed bind (Light: bane; Dark: it strikes the priest) — nothing to place. middle = extension, high = independent.
    let form = (tier === 3) ? "independent" : "extension";
    if (tier === 1) {
      const pact = casterPact(caster);
      ui.notifications.warn(game.i18n.format(`${UI}.PactFailed.${pact ?? "none"}`, { name: caster.name, damage: 4 + casterPersona(caster) }));
      return [];
    }
    if (manual) {
      form = await choose(ability.name, game.i18n.format(`${UI}.FormPrompt`, { name }), ["independent", "extension"].map(f => ({
        value: f, label: game.i18n.format(`${UI}.FormLine`, { form: game.i18n.localize(`${UI}.Form.${f}`), stamina: spiritStamina(f, caster) }),
      })));
      if (!form) return [];
    }
    let spirit = ministrySpirit(caster);
    if (!spirit) {
      spirit = await choose(ability.name, game.i18n.format(`${UI}.MinistryPrompt`, { name }), SPIRITS.map(s => ({
        value: s, label: game.i18n.localize(`${UI}.Spirit.${s}`),
      })));
      if (!spirit) return [];
    }
    // One invoked entity at a time: a new invocation replaces the last.
    for (const old of veilSummons(caster).filter(p => flag(p, "kind") === "spirit")) await dismissVeil(old, { silent: true });
    const pet = await summonVeil(caster, { dsid: spirit, sourceAbility: dsid, hybridTier: form, bind: manual ? null : BIND_BY_TIER[tier] });
    if (pet) summoned.push(pet);
  }

  for (const pet of summoned) {
    const bindKey = flag(pet, "bind") ?? "none";
    ui.notifications.info(game.i18n.format(`${UI}.Summoned`, {
      name: pet.name, stamina: pet.system.stamina.max,
      form: game.i18n.localize(`${UI}.Form.${flag(pet, "hybridTier")}`),
      bind: game.i18n.localize(`${UI}.Bind.${bindKey}`),
    }));
  }
  return summoned;
}

/* -------------------------------------------- level / characteristic refresh */

/**
 * Bring a caster's live Veil summons in line with their current level and characteristics: re-stamp Stamina (keeping
 * damage taken), and re-bind a Summon Elemental held at the old cap at the new cap rank.
 */
export async function refreshVeilSummons(caster, { silent = false } = {}) {
  const pets = veilSummons(caster);
  if (!pets.length) return 0;
  const level = casterLevel(caster);
  const cap = bindCapRank(caster);
  const canSwap = !!canvas.scene && game.user.can("ACTOR_CREATE") && game.user.can("TOKEN_CREATE");
  let changed = 0;
  let deferred = 0;
  for (const pet of pets) {
    const rank = Number(flag(pet, "rank")) || 1;
    if (flag(pet, "scaleRank") && isBound(pet) && (rank !== cap)) {
      if (!canSwap) { deferred++; continue; }
      const token = pet.getActiveTokens()[0]?.document;
      const position = token ? { x: token.x, y: token.y } : undefined;
      const spec = {
        dsid: `elemental-rank-${cap}`, sourceAbility: flag(pet, "sourceAbility"), rank: cap,
        bind: flag(pet, "bind"), scaleRank: true, position,
      };
      await dismissVeil(pet, { silent: true });
      await summonVeil(caster, spec);
      changed++;
      continue;
    }
    const { stamina, rank: liveRank, update } = stamp(pet, caster);
    const sameRank = (liveRank === null) || (liveRank === rank);
    if ((pet.system.stamina.max === stamina) && sameRank && (flag(pet, "summonedAtLevel") === level)) continue;
    const gain = Math.max(0, stamina - pet.system.stamina.max);
    await pet.update({
      ...update,
      "system.stamina.max": stamina,
      "system.stamina.value": Math.min(stamina, pet.system.stamina.value + gain),
      [`flags.${MODULE_ID}.summonedAtLevel`]: level,
      ...(sameRank ? {} : { [`flags.${MODULE_ID}.rank`]: liveRank, [`flags.${MODULE_ID}.formula`]: `elemental-rank-${liveRank}` }),
    });
    changed++;
  }
  if (deferred) ui.notifications.warn(game.i18n.format(`${UI}.RefreshDeferred`, { name: caster.name, count: deferred }));
  if (changed && !silent) ui.notifications.info(game.i18n.format(`${UI}.Refreshed`, { name: caster.name, count: changed, level }));
  refreshSheets(caster);
  return changed;
}

/* -------------------------------------------- chat signal */

function partsOf(message) {
  const parts = message?.system?.parts;
  if (!parts) return [];
  return Array.isArray(parts) ? parts : (parts.contents ?? Object.values(parts));
}
const partType = p => p?.type ?? p?.constructor?.TYPE;

/** The ability used by this message and its Bind tier (the lowest result tier if targets split the roll). */
function useFromMessage(message) {
  const parts = partsOf(message);
  const use = parts.find(p => (partType(p) === "abilityUse") && p?.abilityUuid);
  if (!use) return null;
  let ability = null;
  try { ability = use.ability ?? fromUuidSync(use.abilityUuid); } catch { return null; }
  const tiers = parts.filter(p => partType(p) === "abilityResult").map(p => Number(p.tier)).filter(Boolean);
  return { ability, tier: tiers.length ? Math.min(...tiers) : null };
}

/* -------------------------------------------- sheet */

function sheetStatus(item) {
  const caster = item.parent;
  const dsid = item.system._dsid;
  const level = casterLevel(caster);
  if (COMPANIONS.includes(dsid)) return game.i18n.format(`${UI}.StatusCompanion`, { stamina: elementalStamina(1, caster), rounds: COMPANION_ROUNDS });
  if (dsid === "summon-elemental") {
    const cap = bindCapRank(caster);
    return game.i18n.format(`${UI}.StatusSummon`, { level, cap, stamina: elementalStamina(cap, caster), bindCap: BIND_CAP });
  }
  if (dsid === "twin-elemental-summon") return game.i18n.format(`${UI}.StatusTwin`, { echelon: casterEchelon(caster), stamina: elementalStamina(1, caster) });
  if (dsid === "greater-elemental-summon") {
    const rank = greaterRank(caster);
    return game.i18n.format(`${UI}.StatusGreater`, { rank, stamina: elementalStamina(rank, caster) });
  }
  return game.i18n.format(`${UI}.StatusPact`, {
    extension: spiritStamina("extension", caster), independent: spiritStamina("independent", caster),
    pact: game.i18n.localize(`${UI}.Pact.${casterPact(caster) ?? "none"}`),
  });
}

function button(icon, label, disabled, onClick) {
  const el = document.createElement("button");
  el.type = "button";
  el.innerHTML = `<i class="fa-solid ${icon}"></i>${label ? ` ${label}` : ""}`;
  el.disabled = disabled;
  el.addEventListener("click", async event => {
    event.preventDefault();
    el.disabled = true;
    await onClick();
  });
  return el;
}

export function registerVeilSummons() {
  game.settings.register(MODULE_ID, "veilSummonOnUse", {
    name: `${UI}.Setting.Name`, hint: `${UI}.Setting.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
  });

  // Using a summon ability from the sheet places the summon: the client that rolled it does the work.
  Hooks.on("createChatMessage", async (message, options, userId) => {
    if ((userId !== game.user.id) || !game.settings.get(MODULE_ID, "veilSummonOnUse")) return;
    const use = useFromMessage(message);
    if (!use || !isVeilAbility(use.ability)) return;
    // Companions have no bind roll, so their tier is just their strike; every other summon needs a Bind result.
    const tier = COMPANIONS.includes(use.ability.system._dsid) ? 3 : use.tier;
    if (!tier) return;
    await summonFromAbility(use.ability, { tier });
  });

  // Summon ability Item sheet: the caster's scaling at a glance, the live roster, a manual Summon and ✕ per summon.
  Hooks.on("renderDrawSteelItemSheet", (app, element) => {
    const item = app.document;
    element.querySelector(".ghostwire-veil-controls")?.remove();
    if (!isVeilAbility(item)) return;
    const header = element.querySelector(".sheet-header .header-center") ?? element.querySelector(".sheet-header");
    if (!header) return;
    const caster = item.parent;
    const family = abilityFamily(item.system._dsid);
    const pets = veilSummons(caster).filter(p => flag(p, "kind") === family);

    const controls = document.createElement("div");
    controls.className = "ghostwire-veil-controls flexcol";
    const status = document.createElement("span");
    status.className = "hint";
    status.textContent = sheetStatus(item);
    const row = document.createElement("div");
    row.className = "flexrow";
    row.append(button("fa-hurricane", game.i18n.localize(`${UI}.Summon`), !item.isOwner, async () => {
      try { await summonFromAbility(item); } finally { refreshSheets(caster); }
    }));
    if (pets.length) {
      row.append(button("fa-xmark", game.i18n.localize(`${UI}.DismissAll`), !item.isOwner, async () => {
        try { await dismissAllVeil(caster, { family }); } finally { refreshSheets(caster); }
      }));
    }
    controls.append(status, row);
    for (const pet of pets) {
      const line = document.createElement("div");
      line.className = "flexrow";
      const label = document.createElement("span");
      label.className = "hint";
      label.textContent = `${pet.name} — ${pet.system.stamina.value} / ${pet.system.stamina.max}`
        + ` (${game.i18n.localize(`${UI}.Form.${flag(pet, "hybridTier")}`)})`;
      const dismiss = button("fa-xmark", "", !item.isOwner, async () => {
        try { await dismissVeil(pet); } finally { refreshSheets(caster); }
      });
      dismiss.dataset.tooltip = game.i18n.localize(`${UI}.Dismiss`);
      line.append(label, dismiss);
      controls.append(line);
    }
    header.append(controls);
  });

  // At 0 Stamina a summon drops (the bind ends). Deleting is a GM right, so exactly one GM client does it.
  Hooks.on("updateActor", async (actor, changes) => {
    if (!game.users.activeGM?.isSelf || !veilSummoner(actor)) return;
    const value = foundry.utils.getProperty(changes, "system.stamina.value");
    if ((value === undefined) || (value > 0)) return;
    ui.notifications.warn(game.i18n.format(`${UI}.Destroyed`, { name: actor.name }));
    await dismissVeil(actor, { silent: true });
  });

  Hooks.on("deleteActor", async (actor, options, userId) => {
    if ((userId !== game.user.id) || options.ghostwireVeilDismiss || !flag(actor, "summoner")) return;
    if (!["elemental", "spirit"].includes(flag(actor, "kind"))) return;
    for (const scene of game.scenes) {
      const ids = scene.tokens.filter(t => t.actorId === actor.id).map(t => t.id);
      if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
    }
    const caster = veilSummoner(actor);
    await syncRoster(caster);
    refreshSheets(caster);
  });

  // Timed summons: companions last 3 rounds, a broken bind runs loose for 1.
  Hooks.on("updateCombat", async (combat, changes) => {
    if (!game.users.activeGM?.isSelf || !("round" in changes)) return;
    const expired = game.actors.filter(a => veilSummoner(a) && (flag(a, "expires")?.combat === combat.id)
      && (combat.round >= flag(a, "expires").round));
    for (const pet of expired) {
      ui.notifications.info(game.i18n.format(`${UI}.Expired`, { name: pet.name }));
      await dismissVeil(pet, { silent: true });
    }
  });

  // End of encounter: companions (3 rounds) and pact spirits ("for the rest of the encounter") end, as does anything
  // timed to this combat. A properly bound elemental is sustained, not encounter-scoped, so it stays.
  Hooks.on("deleteCombat", async combat => {
    if (!game.users.activeGM?.isSelf) return;
    const ended = game.actors.filter(a => veilSummoner(a)
      && (isCompanion(a) || (flag(a, "kind") === "spirit") || (flag(a, "expires")?.combat === combat.id)));
    for (const pet of ended) await dismissVeil(pet, { silent: true });
  });

  // A level-up (or a Logic / Persona / Instinct change) must not leave stale Stamina on the table.
  Hooks.on("updateItem", async (item, changes, options, userId) => {
    if ((userId !== game.user.id) || (item.type !== "class") || !["elementalist", "street-priest"].includes(item.system._dsid)) return;
    if (foundry.utils.getProperty(changes, "system.level") === undefined) return;
    await refreshVeilSummons(item.parent);
  });
  Hooks.on("updateActor", async (actor, changes, options, userId) => {
    if ((userId !== game.user.id) || !(isElementalist(actor) || isStreetPriest(actor))) return;
    if (!foundry.utils.hasProperty(changes, "system.characteristics")) return;
    await refreshVeilSummons(actor);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      summonVeil, summonFromAbility, dismissVeil, dismissAllVeil, refreshVeilSummons,
      veilSummons, veilSummoner, bindCapRank, greaterRank, elementalStamina, spiritStamina,
    };
  }
  console.log(`${MODULE_ID} | Veil summons: elementals and pact spirits registered (ability use + summon ability item sheets)`);
}
