// Technomancer sprites: Compile / Decompile, the summoner twin of the Wrench's Deploy / Recall in machines.mjs
// (docs/raw/20-technomancer.md, docs/spikes/B52-TECHNOMANCER-ABILITIES-SPRITES.md).
//
// A sprite has no Item side — it is conjured from Resonance, not bought — so the Compile Sprite *ability* is the
// sheet-side handle. Compiling stamps one of the twelve band Actors from Ghostwire Summons & Machines › Sprites into
// a linked world Actor, re-stamps its Stamina from the live caster, and places a token beside them. The link lives
// in flags on both sides:
// - Sprite Actor: flags.<module> = { kind: "sprite", archetype, hybridTier, compiler: <actorUuid>, dsid, compiledAtLevel }
// - Technomancer: flags.<module>.compiledSprite = { uuids: [...] } — a roster mirror for macros and trackers. The
//   world scan by `compiler` is what actually decides the cap, so a hand-deleted sprite can never wedge it.
//
// Level scaling is the point of the feature: band, Stamina and the sprite's own attack all come from the caster's
// *current* level, and a level-up while the congregation is out re-compiles it into the right band.

import { abilityFromMessage } from "./token-light.mjs";
import {
  ACTIONS_BY_TIER, PURPOSE_MAX, SPECIAL_ARCHETYPE, SPECIAL_SPRITE_DSID, SPECIAL_SPRITE_RESONANCE,
  SPECIAL_STAMINA_BASE, actionsForTier, compileArchetypeOptions, normalizePurpose, reshapeArchetypes,
  specialSpendPlan, specialSummonDescription, specialSummonLabel, tierFromMessage,
} from "./special-summons.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const PACK_ID = `${MODULE_ID}.summons`;
const UI = "GHOSTWIRE.Summons.Sprites.UI";

const COMPILE_DSID = "compile-sprite";
const RECOMPILE_DSID = "recompile";
const ARCHETYPES = ["data", "attack", "machine", "ward"];
/**
 * Every archetype a compile may stamp, and — since 0.3.140 (A) — the exact option list the Compile
 * Sprite picker offers, Special last. Special keeps its own ability as a second entry path.
 */
const ALL_ARCHETYPES = compileArchetypeOptions(ARCHETYPES);
/** What a Recompile may reshape or rebuild into: the published four. A Special is built once, on purpose. */
const RESHAPE_ARCHETYPES = reshapeArchetypes(ALL_ARCHETYPES);

/** Where a hero's heroic resource (Resonance, for a Technomancer) lives on the Actor. */
const RESOURCE_PATH = "system.hero.primary.value";

/**
 * C5 (0.3.123) — Recompile's "at reduced power" (docs/raw/20-technomancer.md, 1-cost band).
 * Rebuilding a sprite that was destroyed a moment ago brings it back on half its Stamina; *reshaping* a
 * sprite that is still standing is not reduced, because nothing was lost to bring back.
 */
export const REDUCED_POWER = 0.5;

/** Where the caster remembers the sprite that just died, so Recompile has something to rebuild. */
export const DESTROYED_FLAG = "lastDestroyedSprite";

/** Stamina for a sprite rebuilt at reduced power. Never below 1 — a 0-Stamina sprite is just dead again. */
export function reducedStamina(stamina) {
  return Math.max(1, Math.ceil((Number(stamina) || 0) * REDUCED_POWER));
}

/**
 * What one Recompile can act on right now.
 *
 * @param {object} opts
 * @param {Array<{uuid: string, name: string, archetype: string}>} opts.sprites  Live congregation.
 * @param {{archetype: string}|null} opts.destroyed  The remembered just-destroyed sprite.
 * @returns {Array<{value: string, kind: "reshape"|"rebuild", archetype: string, name: string}>}
 */
export function recompileTargets({ sprites = [], destroyed = null } = {}) {
  const rows = sprites
    .filter(sprite => RESHAPE_ARCHETYPES.includes(sprite.archetype))
    .map(sprite => ({ value: sprite.uuid, kind: "reshape", archetype: sprite.archetype, name: sprite.name }));
  if (destroyed && RESHAPE_ARCHETYPES.includes(destroyed.archetype)) {
    rows.push({ value: "destroyed", kind: "rebuild", archetype: destroyed.archetype, name: destroyed.name ?? "" });
  }
  return rows;
}

// Sprite Stat Block Reference (20-technomancer.md): Stamina = archetype base + (Logic × level), per band.
// These must match the shipped templates in src/packs/summons/sprites/.
const STAMINA_BASE = {
  data: { minor: 8, intermediate: 14, advanced: 20 },
  attack: { minor: 12, intermediate: 18, advanced: 26 },
  machine: { minor: 10, intermediate: 16, advanced: 22 },
  ward: { minor: 10, intermediate: 16, advanced: 22 },
  // 0.3.139 (A): the purpose-built Special Sprite sits on the middle base, like Machine and Ward.
  [SPECIAL_ARCHETYPE]: { ...SPECIAL_STAMINA_BASE },
};

/** The hybrid band a Technomancer of this level compiles into: minor L1–3, intermediate L4–7, advanced L8–10. */
export function spriteBand(level) {
  if (level >= 8) return "advanced";
  if (level >= 4) return "intermediate";
  return "minor";
}

const isTechnomancer = actor => (actor?.type === "hero") && (actor.system.class?.system._dsid === "technomancer");
const isSpriteWeaver = actor => [...(actor?.system.subclasses ?? [])].some(s => s.system._dsid === "sprite-weaver");
const casterLevel = actor => Number(actor?.system.level) || 1;
/** Logic is the Draw Steel Reason characteristic under a Ghostwire name. */
const casterLogic = actor => Number(actor?.system.characteristics?.reason?.value) || 0;

/** The hero's Compile Sprite ability: the sheet-side handle for the whole congregation. */
export const compileAbility = actor =>
  actor?.items.find(i => (i.type === "ability") && (i.system._dsid === COMPILE_DSID)) ?? null;
const isCompileAbility = item =>
  (item?.type === "ability") && (item.system?._dsid === COMPILE_DSID) && isTechnomancer(item.parent);
/** 0.3.139 (A) — Special Sprite: roll first, tier buys Actions, then the player writes the purpose. */
const isSpecialAbility = item =>
  (item?.type === "ability") && (item.system?._dsid === SPECIAL_SPRITE_DSID) && isTechnomancer(item.parent);

/**
 * How many sprites this Technomancer may command at once.
 * Caps never stack (20-technomancer.md): every feature *sets* the cap, so take the single highest one earned.
 */
export function spriteCap(actor) {
  const level = casterLevel(actor);
  let cap = 2;                                   // 1st level baseline
  if (level >= 5) cap = 3;                       // baseline, all disciplines
  if (level >= 8) cap = 4;                       // baseline, all disciplines
  if (isSpriteWeaver(actor)) {
    let weaver = 3;                              // 1st: Wide Compile
    if (level >= 5) weaver = 4;                  // 5th: The Widening Gyre
    if (level >= 7) weaver = 5;                  // 7th: Legion of the Current
    if (level >= 8) weaver = 6;                  // 8th: Unbroken Congregation
    cap = Math.max(cap, weaver);
  }
  return cap;
}

/** Stamina for a sprite of this archetype and band compiled by this caster, right now. */
export function spriteStamina(archetype, band, actor) {
  return (STAMINA_BASE[archetype]?.[band] ?? 10) + (casterLogic(actor) * casterLevel(actor));
}

/** Every sprite currently compiled by this Technomancer. The world is the source of truth, so deletes self-heal. */
export function compiledSprites(actor) {
  if (!actor?.uuid) return [];
  return game.actors.filter(a => (a.getFlag(MODULE_ID, "kind") === "sprite") && (a.getFlag(MODULE_ID, "compiler") === actor.uuid));
}

/** The Technomancer who compiled a sprite Actor, or null. */
export function spriteCompiler(sprite) {
  const uuid = (sprite?.getFlag(MODULE_ID, "kind") === "sprite") ? sprite.getFlag(MODULE_ID, "compiler") : null;
  const actor = uuid ? fromUuidSync(uuid) : null;
  return actor instanceof Actor ? actor : null;
}

/** Mirror the live roster onto the caster so macros and trackers can read it without a world scan. */
async function syncRoster(actor) {
  if (!actor?.isOwner) return;
  const uuids = compiledSprites(actor).map(s => s.uuid).sort();
  const current = [...(actor.getFlag(MODULE_ID, "compiledSprite")?.uuids ?? [])].sort();
  if (uuids.join("|") !== current.join("|")) await actor.setFlag(MODULE_ID, "compiledSprite", { uuids });
}

// The roster lives on the Actor, so the Compile Sprite Item sheet has to be told to redraw itself.
function refreshSheets(actor) {
  const ability = compileAbility(actor);
  if (ability?.sheet?.rendered) ability.sheet.render();
}

async function templateFor(archetype, band) {
  const pack = game.packs.get(PACK_ID);
  if (!pack) return null;
  const index = await pack.getIndex({ fields: [`flags.${MODULE_ID}.dsid`] });
  const dsid = `sprite-${archetype}-${band}`;
  const entry = index.find(e => foundry.utils.getProperty(e, `flags.${MODULE_ID}.dsid`) === dsid);
  return entry ? pack.getDocument(entry._id) : null;
}

async function compileFolder() {
  const name = game.i18n.localize(`${UI}.Folder`);
  return game.folders.find(f => (f.type === "Actor") && f.getFlag(MODULE_ID, "compiledSprites"))
    ?? Folder.create({ name, type: "Actor", flags: { [MODULE_ID]: { compiledSprites: true } } });
}

/**
 * D (0.3.124) — a sprite is half a square.
 *
 * The twelve templates under src/packs/summons/sprites/ carry this on `prototypeToken`, so a fresh
 * compile inherits it from `game.actors.fromCompendium(template)`. It is written again in
 * {@link compileSprite}'s mergeObject for the world that still holds a pre-0.3.124 copy of a
 * template: nothing else in this file ever touches token size, and a sprite that placed at 1×1
 * would sit on the caster's own footprint.
 */
export const SPRITE_TOKEN_SIZE = 0.5;

// A ring of squares around the caster, so a congregation of 2–6 doesn't stack on one tile.
const RING = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

function placement(caster, index) {
  const grid = canvas.grid.size;
  const token = caster?.getActiveTokens?.()[0]?.document;
  const [dx, dy] = RING[index % RING.length];
  if (token) return { x: token.x + (dx * Math.max(token.width, 1) * grid), y: token.y + (dy * Math.max(token.height, 1) * grid) };
  const { x, y } = canvas.stage.pivot;
  return { x: (Math.round(x / grid) + dx) * grid, y: (Math.round(y / grid) + dy) * grid };
}

/**
 * The archetype picker: one dialog, with the band and the Stamina it will stamp shown up front.
 *
 * 0.3.140 (A) — **Special Sprite** is an option here, last in the list. Michael opened Compile Sprite
 * expecting to find it and 0.3.139 had shipped it as a separate ability only. Picking it does not
 * stamp a sprite from this dialog: {@link compileSprite} hands off to the roll → Actions → purpose
 * flow first, and only compiles once the player has written what the sprite is for.
 */
async function promptArchetype(caster, band) {
  const options = ALL_ARCHETYPES.map((archetype, index) => {
    const label = game.i18n.localize(`${UI}.Archetype.${archetype}`);
    const line = game.i18n.format(`${UI}.ArchetypeLine`, {
      stamina: spriteStamina(archetype, band, caster),
      hint: game.i18n.localize(`${UI}.ArchetypeHint.${archetype}`),
    });
    return `<option value="${archetype}"${index === 0 ? " selected" : ""}>${label} — ${line}</option>`;
  });
  return foundry.applications.api.DialogV2.prompt({
    window: { title: game.i18n.localize(`${UI}.CompileTitle`) },
    content: `<p>${game.i18n.format(`${UI}.CompilePrompt`, {
      name: foundry.utils.escapeHTML(caster.name),
      band: game.i18n.localize(`${UI}.Band.${band}`),
      level: casterLevel(caster),
      logic: casterLogic(caster),
    })}</p><div class="form-group"><label>${game.i18n.localize(`${UI}.ArchetypeLabel`)}</label>`
      + `<select name="archetype">${options.join("")}</select></div>`,
    ok: { label: game.i18n.localize(`${UI}.Compile`), callback: (event, button) => button.form.elements.archetype.value },
    rejectClose: false,
  });
}

/**
 * Compile one sprite for a Technomancer: band from their current level, Stamina stamped from live Logic × level.
 * @param {Actor} caster                  The Technomancer.
 * @param {object} [options]
 * @param {string} [options.archetype]    data | attack | machine | ward | special; prompts when omitted.
 * @param {object} [options.position]     {x, y} to place the token at, instead of the ring beside the caster.
 * @param {boolean} [options.silent]      Skip the "compiled" notification (used by the level refresh).
 * @param {boolean} [options.reduced]     C5: rebuild at reduced power (half Stamina).
 * @param {{actions: number, purpose: string}} [options.special]  0.3.139 (A): the Special Sprite's
 *   action budget and the purpose the player wrote after seeing it. Stamped onto the summoned Actor's
 *   description as `Actions (N): …purpose…` and kept in flags so a band swap can re-stamp it.
 * @param {object} [options.message]      0.3.140 (A): the Compile Sprite card this compile came from.
 *   Its Power Roll is the tier that buys the action budget when the player picks Special out of the
 *   archetype dropdown, so that path never rolls twice.
 * @returns {Promise<Actor|null>}
 */
export async function compileSprite(caster, { archetype, position, silent = false, reduced = false, special = null, message = null } = {}) {
  if (!isTechnomancer(caster)) return ui.notifications.warn(game.i18n.localize(`${UI}.NotTechnomancer`));
  if (!canvas.scene) return ui.notifications.warn(game.i18n.localize(`${UI}.NoScene`));
  if (!game.user.can("ACTOR_CREATE") || !game.user.can("TOKEN_CREATE")) return ui.notifications.warn(game.i18n.localize(`${UI}.NoPermission`));

  const cap = spriteCap(caster);
  const current = compiledSprites(caster);
  if (current.length >= cap) {
    ui.notifications.warn(game.i18n.format(`${UI}.AtCap`, { name: caster.name, cap, count: current.length }));
    return null;
  }

  const level = casterLevel(caster);
  const band = spriteBand(level);
  // Whether the player chose this archetype just now decides what an un-budgeted Special means.
  const picked = (archetype === undefined) || (archetype === null);
  archetype ??= await promptArchetype(caster, band);
  if (!ALL_ARCHETYPES.includes(archetype)) return null;
  // A Special Sprite without a budget and a purpose is not a Special Sprite.
  if ((archetype === SPECIAL_ARCHETYPE) && !special) {
    // A *caller* that asks for one without a payload still gets null: the level refresh and Recompile
    // must never open a prompt. A player who picked it off the dropdown gets the flow it needs —
    // roll → Actions → purpose → spend — and then compiles with the payload in hand.
    if (!picked) return null;
    const payload = await specialSpritePayload(caster, message);
    if (!payload) return null;
    return compileSprite(caster, { archetype, position, silent, reduced, special: payload });
  }

  const template = await templateFor(archetype, band);
  if (!template) return ui.notifications.error(game.i18n.format(`${UI}.NoTemplate`, { dsid: `sprite-${archetype}-${band}` }));

  const full = spriteStamina(archetype, band, caster);
  const stamina = reduced ? reducedStamina(full) : full;
  // The Technomancer's players own their sprites, so they can move the tokens and track Stamina themselves.
  const ownership = { default: 0 };
  for (const [userId, ownershipLevel] of Object.entries(caster.ownership ?? {})) {
    if ((userId !== "default") && (ownershipLevel >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)) ownership[userId] = ownershipLevel;
  }

  const data = game.actors.fromCompendium(template);
  foundry.utils.mergeObject(data, {
    folder: (await compileFolder())?.id ?? null, ownership,
    "system.stamina": { value: stamina, max: stamina, temporary: 0 },
    "system.characteristics.reason.value": casterLogic(caster),
    "system.monster.level": level,
    "prototypeToken.actorLink": true,
    "prototypeToken.disposition": CONST.TOKEN_DISPOSITIONS.FRIENDLY,
    // D (0.3.124): sprites place at half a square. Stated here as well as on the template so a
    // world carrying an older compendium copy still gets the size Michael locked.
    "prototypeToken.width": SPRITE_TOKEN_SIZE,
    "prototypeToken.height": SPRITE_TOKEN_SIZE,
    [`flags.${MODULE_ID}`]: {
      kind: "sprite", archetype, hybridTier: band, compiler: caster.uuid,
      dsid: `sprite-${archetype}-${band}`, compiledAtLevel: level, reduced,
      ...(special ? { special: { actions: special.actions, purpose: normalizePurpose(special.purpose) } } : {}),
    },
  });
  // LOCKED: the action cap is annotated on the summoned Actor's description, not only in a flag.
  if (special) {
    data.system ??= {};
    data.system.biography ??= {};
    data.system.biography.value = specialSummonDescription({
      actions: special.actions,
      purpose: special.purpose,
      lead: game.i18n.localize(`${UI}.SpecialLead`),
    });
  }
  const actor = await Actor.create(data);
  if (!actor) return null;

  const tokenDocument = await actor.getTokenDocument({ ...(position ?? placement(caster, current.length)), actorLink: true });
  await canvas.scene.createEmbeddedDocuments("Token", [tokenDocument.toObject()]);
  await syncRoster(caster);
  refreshSheets(caster);
  if (!silent) {
    ui.notifications.info(game.i18n.format(special ? `${UI}.SpecialCompiled` : `${UI}.Compiled`, {
      sprite: actor.name, stamina, count: current.length + 1, cap,
      band: game.i18n.localize(`${UI}.Band.${band}`),
      budget: special ? specialSummonLabel(special) : "",
    }));
  }
  return actor;
}

/** Decompile one sprite: delete its tokens on every Scene, then the Actor. */
export async function decompileSprite(sprite, { silent = false } = {}) {
  if (!(sprite instanceof Actor)) return;
  const caster = spriteCompiler(sprite);
  const name = sprite.name;
  for (const scene of game.scenes) {
    const ids = scene.tokens.filter(t => t.actorId === sprite.id).map(t => t.id);
    if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
  }
  await sprite.delete({ ghostwireDecompile: true });
  await syncRoster(caster);
  refreshSheets(caster);
  if (!silent) ui.notifications.info(game.i18n.format(`${UI}.Decompiled`, { sprite: name }));
}

/**
 * Command is the Compile Sprite maneuver at the table (not a second spawn).
 * Opens the existing Compile Sprite sheet handle; does not call compileSprite.
 * @returns {Promise<Item|null>}
 */
export async function commandSprite(sprite, { notify = true } = {}) {
  const caster = spriteCompiler(sprite);
  const ability = compileAbility(caster);
  if (!ability) {
    if (notify) ui.notifications.warn(game.i18n.localize(`${UI}.CommandMissing`));
    return null;
  }
  await ability.sheet?.render({ force: true });
  if (notify) {
    ui.notifications.info(game.i18n.format(`${UI}.CommandHint`, {
      sprite: sprite?.name ?? "",
      name: caster?.name ?? "",
    }));
  }
  return ability;
}

/** Decompile the whole congregation — the free maneuver, and what end of encounter does on its own. */
export async function decompileAll(caster, { silent = false } = {}) {
  const sprites = compiledSprites(caster);
  for (const sprite of sprites) await decompileSprite(sprite, { silent: true });
  await syncRoster(caster);
  refreshSheets(caster);
  if (!silent && sprites.length) ui.notifications.info(game.i18n.format(`${UI}.DecompiledAll`, { name: caster.name, count: sprites.length }));
  return sprites.length;
}

/**
 * Bring a live congregation back in line with the caster's current level: re-stamp Stamina, and re-compile any
 * sprite whose band has moved, so a 4th-level Technomancer never fights on 3rd-level sprite math.
 */
export async function refreshSprites(caster, { silent = false } = {}) {
  const sprites = compiledSprites(caster);
  if (!sprites.length) return 0;
  const level = casterLevel(caster);
  const band = spriteBand(level);
  // A band change swaps the whole stat block, so it deletes one Actor and creates another. Only attempt it when
  // that second half is certain to succeed — a decompile we can't undo would silently eat the congregation.
  const canSwap = !!canvas.scene && game.user.can("ACTOR_CREATE") && game.user.can("TOKEN_CREATE")
    && (spriteCap(caster) >= sprites.length);
  let changed = 0;
  let deferred = 0;
  for (const sprite of sprites) {
    const archetype = sprite.getFlag(MODULE_ID, "archetype");
    if (!ALL_ARCHETYPES.includes(archetype)) continue;
    // 0.3.139 (A): a Special Sprite carries its budget and purpose across a band swap. Re-rolling for
    // a new budget on level-up would take back something the player already bought with a Power Roll.
    const special = sprite.getFlag(MODULE_ID, "special") ?? null;
    // A sprite rebuilt by Recompile stays rebuilt: levelling re-stamps its *reduced* pool, not a full one.
    const reduced = sprite.getFlag(MODULE_ID, "reduced") === true;
    const full = spriteStamina(archetype, band, caster);
    const stamina = reduced ? reducedStamina(full) : full;
    const sameBand = sprite.getFlag(MODULE_ID, "hybridTier") === band;
    if (!sameBand && !canSwap) { deferred++; continue; }
    if (sameBand) {
      if ((sprite.system.stamina.max === stamina) && (sprite.getFlag(MODULE_ID, "compiledAtLevel") === level)) continue;
      // Keep damage already taken: the pool grows by exactly as much as the maximum did.
      const gain = Math.max(0, stamina - sprite.system.stamina.max);
      await sprite.update({
        "system.stamina.max": stamina,
        "system.stamina.value": Math.min(stamina, sprite.system.stamina.value + gain),
        "system.characteristics.reason.value": casterLogic(caster),
        "system.monster.level": level,
        [`flags.${MODULE_ID}.compiledAtLevel`]: level,
      });
    } else {
      const token = sprite.getActiveTokens()[0]?.document;
      const position = token ? { x: token.x, y: token.y } : null;
      await decompileSprite(sprite, { silent: true });
      await compileSprite(caster, { archetype, position, silent: true, reduced, special });
    }
    changed++;
  }
  if (deferred) ui.notifications.warn(game.i18n.format(`${UI}.RefreshDeferred`, { name: caster.name, count: deferred }));
  if (changed && !silent) {
    ui.notifications.info(game.i18n.format(`${UI}.Refreshed`, {
      name: caster.name, count: changed, level, band: game.i18n.localize(`${UI}.Band.${band}`),
    }));
  }
  return changed;
}

/* -------------------------------------------- C5: Recompile */

/** The Recompile ability on this hero, if they took it. */
export const recompileAbility = actor =>
  actor?.items.find(i => (i.type === "ability") && (i.system._dsid === RECOMPILE_DSID)) ?? null;

const isRecompileAbility = item =>
  (item?.type === "ability") && (item.system?._dsid === RECOMPILE_DSID) && isTechnomancer(item.parent);

/** The just-destroyed sprite this caster can still rebuild, or null. */
export function destroyedSprite(caster) {
  const record = caster?.getFlag?.(MODULE_ID, DESTROYED_FLAG) ?? null;
  return RESHAPE_ARCHETYPES.includes(record?.archetype) ? record : null;
}

/**
 * Remember a sprite that just died, so Recompile has something to reach for. Overwrites the previous
 * record: "just-destroyed" is the last one, not a graveyard.
 */
async function rememberDestroyed(sprite) {
  const caster = spriteCompiler(sprite);
  if (!caster?.isOwner) return;
  const token = sprite.getActiveTokens()[0]?.document;
  await caster.setFlag(MODULE_ID, DESTROYED_FLAG, {
    archetype: sprite.getFlag(MODULE_ID, "archetype") ?? null,
    band: sprite.getFlag(MODULE_ID, "hybridTier") ?? null,
    name: sprite.name,
    sceneId: token?.parent?.id ?? canvas.scene?.id ?? null,
    x: token?.x ?? null,
    y: token?.y ?? null,
    at: game.time?.worldTime ?? 0,
  });
}

/** The Recompile dialog: which sprite, and what to shape it into. */
async function promptRecompile(caster, targets) {
  const UIL = key => game.i18n.localize(`${UI}.${key}`);
  const targetOptions = targets.map((row, index) => {
    const label = (row.kind === "rebuild")
      ? game.i18n.format(`${UI}.RecompileRebuildOption`, { name: row.name || UIL(`Archetype.${row.archetype}`) })
      : game.i18n.format(`${UI}.RecompileReshapeOption`, { name: row.name });
    return `<option value="${row.value}"${index === 0 ? " selected" : ""}>${label}</option>`;
  }).join("");
  // Special is never a reshape target: it is built once, for a job the player wrote after the dice.
  const archetypeOptions = RESHAPE_ARCHETYPES.map((archetype, index) =>
    `<option value="${archetype}"${index === 0 ? " selected" : ""}>${UIL(`Archetype.${archetype}`)}</option>`).join("");
  return foundry.applications.api.DialogV2.prompt({
    window: { title: UIL("RecompileTitle") },
    content: `<p>${game.i18n.format(`${UI}.RecompilePrompt`, { name: foundry.utils.escapeHTML(caster.name) })}</p>`
      + `<div class="form-group"><label>${UIL("RecompileTargetLabel")}</label>`
      + `<select name="target">${targetOptions}</select></div>`
      + `<div class="form-group"><label>${UIL("ArchetypeLabel")}</label>`
      + `<select name="archetype">${archetypeOptions}</select></div>`
      + `<p class="hint">${UIL("RecompileHint")}</p>`,
    ok: {
      label: UIL("Recompile"),
      callback: (event, button) => ({
        target: button.form.elements.target.value,
        archetype: button.form.elements.archetype.value,
      }),
    },
    rejectClose: false,
  });
}

/**
 * Recompile (1 Resonance, maneuver): reshape a compiled sprite into another archetype, **or** rebuild the
 * one that was just destroyed at reduced power. Both paths end with a real Actor and a real token on the
 * canvas — the card used to be a roll and nothing else.
 *
 * @param {Actor} caster
 * @param {object} [options]
 * @param {string} [options.target]     A sprite uuid, or "destroyed".
 * @param {string} [options.archetype]  What to shape it into; prompts when omitted.
 * @returns {Promise<Actor|null>}
 */
export async function recompileSprite(caster, { target, archetype } = {}) {
  if (!isTechnomancer(caster)) return ui.notifications.warn(game.i18n.localize(`${UI}.NotTechnomancer`));
  const destroyed = destroyedSprite(caster);
  const targets = recompileTargets({
    sprites: compiledSprites(caster).map(sprite => ({
      uuid: sprite.uuid, name: sprite.name, archetype: sprite.getFlag(MODULE_ID, "archetype"),
    })),
    destroyed,
  });
  if (!targets.length) {
    ui.notifications.warn(game.i18n.format(`${UI}.RecompileNothing`, { name: caster.name }));
    return null;
  }
  if (!target || !archetype) {
    const choice = await promptRecompile(caster, targets);
    if (!choice) return null;
    target = choice.target;
    archetype = choice.archetype;
  }
  if (!RESHAPE_ARCHETYPES.includes(archetype)) return null;
  const row = targets.find(t => t.value === target);
  if (!row) return null;

  if (row.kind === "rebuild") {
    // Reduced power, and back where it fell if we still know where that was.
    const position = (destroyed?.x !== null && destroyed?.y !== null && (destroyed?.sceneId === canvas.scene?.id))
      ? { x: destroyed.x, y: destroyed.y }
      : undefined;
    const actor = await compileSprite(caster, { archetype, position, reduced: true, silent: true });
    if (!actor) return null;
    await caster.unsetFlag(MODULE_ID, DESTROYED_FLAG);
    ui.notifications.info(game.i18n.format(`${UI}.Rebuilt`, {
      sprite: actor.name, stamina: actor.system.stamina.max, name: caster.name,
    }));
    refreshSheets(caster);
    return actor;
  }

  // Reshape: the sprite is still standing, so this is a swap at full power in the same square.
  const sprite = fromUuidSync(row.value);
  if (!(sprite instanceof Actor)) return null;
  const token = sprite.getActiveTokens()[0]?.document;
  const position = token ? { x: token.x, y: token.y } : undefined;
  const wasReduced = sprite.getFlag(MODULE_ID, "reduced") === true;
  await decompileSprite(sprite, { silent: true });
  const actor = await compileSprite(caster, { archetype, position, reduced: wasReduced, silent: true });
  if (actor) {
    ui.notifications.info(game.i18n.format(`${UI}.Reshaped`, { sprite: actor.name, name: caster.name }));
  }
  refreshSheets(caster);
  return actor;
}

/**
 * 0.3.139 (A) — the purpose prompt. Shown **after** the Power Roll, so the number in the label is the
 * budget the dice actually bought.
 * @returns {Promise<string|null>} The typed purpose, or null if the player backed out.
 */
async function promptSpecialPurpose(caster, actions) {
  const typed = await foundry.applications.api.DialogV2.prompt({
    window: { title: game.i18n.localize(`${UI}.SpecialTitle`) },
    content: `<p>${game.i18n.format(`${UI}.SpecialPrompt`, {
      name: foundry.utils.escapeHTML(caster.name),
      actions,
    })}</p><div class="form-group"><label>${game.i18n.localize(`${UI}.SpecialLabel`)}</label>`
      + `<input type="text" name="purpose" maxlength="${PURPOSE_MAX}" placeholder="${game.i18n.localize(`${UI}.SpecialPlaceholder`)}"></div>`,
    ok: {
      label: game.i18n.localize(`${UI}.SpecialCompile`),
      callback: (event, button) => button.form.elements.purpose.value,
    },
    rejectClose: false,
  });
  if (typed === null || typed === undefined) return null;
  const purpose = normalizePurpose(typed);
  return purpose || game.i18n.localize(`${UI}.SpecialNoPurpose`);
}

/**
 * 0.3.140 (A) — the Power Roll for a Special picked somewhere no card was posted: the ⋮ menu on the
 * Compile Sprite row, or the Compile button on its sheet. Both of those call {@link compileSprite}
 * directly, so there is no `abilityResult` to read a tier off — and a budget handed out without dice
 * would be the one thing this feature is not allowed to do. Same 2d10 + Logic the ability rolls, and
 * it posts, so the table sees the roll that bought the Actions.
 *
 * @returns {Promise<number>} The tier the dice landed on.
 */
async function rollSpecialTier(caster) {
  const roll = new ds.rolls.PowerRoll("2d10 + @logic", { logic: casterLogic(caster) }, {
    type: "ability",
    flavor: game.i18n.format(`${UI}.SpecialRollFlavor`, { name: caster.name }),
  });
  await roll.evaluate();
  await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: caster }) });
  return Number(roll.product) || 1;
}

/**
 * The whole Special Sprite half, up to but not including the Actor: check, roll, budget, purpose, pay.
 *
 * Shared by both entry paths — the standalone **Special Sprite** ability (which arrives with its own
 * card, so the tier is already rolled) and **Compile Sprite**'s archetype dropdown (0.3.140 A). The
 * order is the feature and it is LOCKED, so it is written once:
 *
 *   roll → tier buys Actions → player writes the purpose → pay → the sprite manifests annotated.
 *
 * Cost is 3 Resonance **in combat only**; out of combat the sprite is free, so neither ability card
 * carries a stock `resource` and this is the only thing that writes Resonance for them.
 *
 * @param {Actor} caster
 * @param {object|null} message  The card that already rolled, or null to roll here.
 * @returns {Promise<{actions: number, purpose: string}|null>} null when the player backed out or cannot pay.
 */
async function specialSpritePayload(caster, message) {
  const current = Number(foundry.utils.getProperty(caster, RESOURCE_PATH)) || 0;
  const plan = specialSpendPlan({ inCombat: !!caster.inCombat, current, cost: SPECIAL_SPRITE_RESONANCE });
  if (!plan.ok) {
    ui.notifications.warn(game.i18n.format(`${UI}.NotEnoughResonance`, {
      name: caster.name, cost: SPECIAL_SPRITE_RESONANCE, current,
    }));
    return null;
  }
  if (compiledSprites(caster).length >= spriteCap(caster)) {
    ui.notifications.warn(game.i18n.format(`${UI}.AtCap`, {
      name: caster.name, cap: spriteCap(caster), count: compiledSprites(caster).length,
    }));
    return null;
  }

  // 1 — the roll, then 2 — the tier buys the budget. A card that came in already rolled is never re-rolled.
  const actions = actionsForTier(message ? tierFromMessage(message) : await rollSpecialTier(caster));
  // 3 — only now does the player write what it is for.
  const purpose = await promptSpecialPurpose(caster, actions);
  if (purpose === null) return null;

  // 4 — pay. Out of combat there is no spend at all — not a spend of 0.
  if (plan.spend > 0) await caster.update({ [RESOURCE_PATH]: plan.next });
  return { actions, purpose };
}

/**
 * **Special Sprite**, driven off the card the ability just posted. The order falls out of the seam:
 * the hook only runs *after* the Power Roll, so the tier is already on the message when
 * {@link specialSpritePayload} computes the budget and asks for the purpose.
 */
async function compileSpecialSprite(caster, message) {
  const special = await specialSpritePayload(caster, message);
  if (!special) return null;
  return compileSprite(caster, { archetype: SPECIAL_ARCHETYPE, special });
}

export function registerSprites() {
  // C4 / C5 (0.3.123): using the *card* is what a player actually does at the table, and until this wave
  // it only rolled. Compile Sprite now opens the archetype picker and puts a sprite on the canvas;
  // Recompile reshapes or rebuilds one. Same seam scripts/veil-summons.mjs uses, same opt-out setting.
  game.settings.register(MODULE_ID, "spriteCompileOnUse", {
    name: `${UI}.Setting.Name`, hint: `${UI}.Setting.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
  });

  Hooks.on("createChatMessage", async (message, options, userId) => {
    if ((userId !== game.user.id) || !game.settings.get(MODULE_ID, "spriteCompileOnUse")) return;
    const ability = abilityFromMessage(message);
    const caster = ability?.parent;
    if (!(caster instanceof Actor) || !caster.isOwner || !isTechnomancer(caster)) return;
    // 0.3.140 (A): the card is passed through — if the player picks Special out of the dropdown,
    // the Power Roll that just posted is the tier that buys its Actions.
    if (ability.system?._dsid === COMPILE_DSID) await compileSprite(caster, { message });
    else if (ability.system?._dsid === SPECIAL_SPRITE_DSID) await compileSpecialSprite(caster, message);
    else if (ability.system?._dsid === RECOMPILE_DSID) await recompileSprite(caster);
  });

  // Hero sheet: right-click the Compile Sprite row (or its ⋮ control) → Compile Sprite / Decompile All.
  Hooks.on("getDocumentListContextOptions", (app, menuItems) => {
    if (typeof app._getEmbeddedDocument !== "function") return;
    const ability = target => {
      const item = app._getEmbeddedDocument(target);
      return (isCompileAbility(item) && item.isOwner) ? item : null;
    };
    menuItems.push(
      {
        label: `${UI}.Compile`, icon: "fa-solid fa-diagram-project",
        visible: target => !!ability(target),
        onClick: (event, target) => compileSprite(ability(target)?.parent),
      },
      {
        label: `${UI}.DecompileAll`, icon: "fa-solid fa-xmark",
        visible: target => { const item = ability(target); return !!item && (compiledSprites(item.parent).length > 0); },
        onClick: (event, target) => decompileAll(ability(target)?.parent),
      },
      {
        label: `${UI}.Recompile`, icon: "fa-solid fa-rotate",
        visible: target => {
          const item = app._getEmbeddedDocument(target);
          return isRecompileAbility(item) && item.isOwner;
        },
        onClick: (event, target) => recompileSprite(app._getEmbeddedDocument(target)?.parent),
      },
    );
  });

  // Compile Sprite Item sheet: the congregation roster, a Compile button, and a ✕ per sprite (rebuilt every render).
  Hooks.on("renderDrawSteelItemSheet", (app, element) => {
    const item = app.document;
    element.querySelector(".ghostwire-sprite-controls")?.remove();
    if (!isCompileAbility(item) && !isSpecialAbility(item)) return;
    const header = element.querySelector(".sheet-header .header-center") ?? element.querySelector(".sheet-header");
    if (!header) return;

    const caster = item.parent;
    const cap = spriteCap(caster);
    const sprites = compiledSprites(caster);
    const band = spriteBand(casterLevel(caster));

    const controls = document.createElement("div");
    controls.className = "ghostwire-sprite-controls flexcol";
    const status = document.createElement("span");
    status.className = "hint";
    status.textContent = game.i18n.format(`${UI}.Status`, {
      count: sprites.length, cap, level: casterLevel(caster), band: game.i18n.localize(`${UI}.Band.${band}`),
    });

    const row = document.createElement("div");
    row.className = "flexrow";
    const compile = document.createElement("button");
    compile.type = "button";
    compile.innerHTML = `<i class="fa-solid fa-diagram-project"></i> ${game.i18n.localize(`${UI}.Compile`)}`;
    compile.disabled = !item.isOwner || (sprites.length >= cap);
    compile.addEventListener("click", async event => {
      event.preventDefault();
      compile.disabled = true;
      try { await compileSprite(caster); } finally { refreshSheets(caster); }
    });
    row.append(compile);

    if (sprites.length) {
      const dismissAll = document.createElement("button");
      dismissAll.type = "button";
      dismissAll.innerHTML = `<i class="fa-solid fa-xmark"></i> ${game.i18n.localize(`${UI}.DecompileAll`)}`;
      dismissAll.disabled = !item.isOwner;
      dismissAll.addEventListener("click", async event => {
        event.preventDefault();
        dismissAll.disabled = true;
        try { await decompileAll(caster); } finally { refreshSheets(caster); }
      });
      row.append(dismissAll);
    }
    controls.append(status, row);

    for (const sprite of sprites) {
      const line = document.createElement("div");
      line.className = "flexrow";
      const label = document.createElement("span");
      label.className = "hint";
      label.textContent = `${sprite.name} — ${sprite.system.stamina.value} / ${sprite.system.stamina.max}`;
      const dismiss = document.createElement("button");
      dismiss.type = "button";
      dismiss.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
      dismiss.dataset.tooltip = game.i18n.localize(`${UI}.Decompile`);
      dismiss.disabled = !item.isOwner;
      dismiss.addEventListener("click", async event => {
        event.preventDefault();
        dismiss.disabled = true;
        try { await decompileSprite(sprite); } finally { refreshSheets(caster); }
      });
      line.append(label, dismiss);
      controls.append(line);
    }
    header.append(controls);
  });

  // A sprite at 0 Stamina is destroyed, and a destroyed sprite decompiles (20-technomancer.md, Decompile Rules).
  // Deleting an Actor is a GM right, so exactly one GM client does it however the damage was applied.
  Hooks.on("updateActor", async (actor, changes) => {
    if (!game.users.activeGM?.isSelf) return;
    if (actor.getFlag(MODULE_ID, "kind") !== "sprite") return;
    const value = foundry.utils.getProperty(changes, "system.stamina.value");
    if ((value === undefined) || (value > 0)) return;
    ui.notifications.warn(game.i18n.format(`${UI}.Destroyed`, { sprite: actor.name }));
    // C5: remember it before it goes, so Recompile has a "just-destroyed" sprite to rebuild.
    await rememberDestroyed(actor);
    await decompileSprite(actor, { silent: true });
  });

  // Deleting a sprite Actor by hand (or from its token) still has to free a slot on the caster's roster.
  Hooks.on("deleteActor", async (actor, options, userId) => {
    if ((userId !== game.user.id) || options.ghostwireDecompile) return;
    if (actor.getFlag(MODULE_ID, "kind") !== "sprite") return;
    for (const scene of game.scenes) {
      const ids = scene.tokens.filter(t => t.actorId === actor.id).map(t => t.id);
      if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
    }
    const caster = spriteCompiler(actor);
    await syncRoster(caster);
    refreshSheets(caster);
  });

  // End of encounter: the congregation doesn't persist between fights, so the next Compile picks the current band.
  Hooks.on("deleteCombat", async () => {
    if (!game.users.activeGM?.isSelf) return;
    for (const caster of game.actors.filter(isTechnomancer)) {
      await decompileAll(caster, { silent: true });
      // "Just-destroyed" does not survive the fight it died in.
      if (caster.getFlag(MODULE_ID, DESTROYED_FLAG)) await caster.unsetFlag(MODULE_ID, DESTROYED_FLAG);
    }
  });

  // A level-up mid-session must not leave the old band's math on the table.
  Hooks.on("updateItem", async (item, changes, options, userId) => {
    if ((userId !== game.user.id) || (item.type !== "class") || (item.system._dsid !== "technomancer")) return;
    if (foundry.utils.getProperty(changes, "system.level") === undefined) return;
    await refreshSprites(item.parent);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      compileSprite, decompileSprite, decompileAll, refreshSprites, commandSprite, recompileSprite,
      compiledSprites, spriteCompiler, spriteCap, spriteBand, spriteStamina, compileAbility,
      recompileAbility, destroyedSprite, recompileTargets, reducedStamina,
      // 0.3.139 (A) — Special Sprite
      compileSpecialSprite, actionsForTier, specialSummonDescription, specialSpendPlan, tierFromMessage,
      SPECIAL_SPRITE_RESONANCE, SPECIAL_SPRITE_DSID, SPECIAL_ARCHETYPE, ACTIONS_BY_TIER,
      // 0.3.140 (A) — Special Sprite is in the Compile picker too; Recompile still refuses it.
      compileArchetypeOptions, reshapeArchetypes, ARCHETYPES: [...ARCHETYPES],
      PICKER_ARCHETYPES: [...ALL_ARCHETYPES], RESHAPE_ARCHETYPES: [...RESHAPE_ARCHETYPES],
    };
  }
  console.log(`${MODULE_ID} | Sprites: Compile / Special / Decompile registered (hero sheet row menu and Compile Sprite item sheet)`);
}
