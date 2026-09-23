// F14 (0.3.117) — Flanking.
//
// RAW (`docs/raw/04-combat.md`): two allies on opposite sides of a target — adjacent, facing through
// the target — give **melee strikes** against that target an **edge**. Ranged never gets it.
//
// Investigation first, because this one is mostly *not* ours (Draw Steel 1.1.2, read from
// draw-steel.mjs, not guessed):
//   * The system already ships flanking. `DrawSteelToken#isFlanking(target)` walks
//     `getAdjacentAllies`, checks `hasLineOfEffect`, and tests `onOppositeSideOrCorner` by
//     intersecting the attacker→ally segment against the target's bounds. `AbilityModel#getTargetModifiers`
//     already adds `edges += 1` when `keywords.has("melee") && keywords.has("strike") && token.isFlanking(target)`.
//   * `canFlank` refuses defeated actors and anything whose triggered actions are restricted.
//     `canBeFlanked` reads `system.statuses.flankable`, a non-persisted BooleanField that defaults
//     true and is meant to be flipped by an ActiveEffect.
//   * Ghostwire's Mutant **Prehensile Mutation** already carries exactly that change
//     (`system.statuses.flankable` override false), so "can't be flanked" is live today.
//   * B49 weapon-use abilities carry keywords `["melee", "strike", "weapon"]`, so every Ghostwire
//     melee weapon already qualifies for the system's own edge.
//
// So F14 does NOT re-implement flanking, and above all does not add a second edge on top of the
// system's. What it adds is the four things the system does not know about Ghostwire:
//
//   1. `flags.draw-steel-ghostwire.cannotBeFlanked` on an Actor — the generic flag the brief asks
//      for, for anything that is not the Mutant trait (a construct, a Director ruling, a future
//      People). Applied by patching `canBeFlanked`, so it reaches every native call site at once.
//   2. **meat-inert** bodies do not flank. A Rigger Jumped In to a drone leaves a body standing in
//      the room; the system sees a live, undefeated token and would let it hold a side of a target.
//      It is not holding anything. Same for a token whose actor is unconscious or Ghostwire-inert.
//   3. The edge on a melee strike whose attacker token is not the controlled token. The system reads
//      `canvas.tokens.controlled[0]`, so rolling a melee strike from the character sheet with
//      nothing selected silently drops the flank. Ghostwire resolves the attacker's own token and
//      fills that gap — guarded so the edge is never counted twice.
//   4. A computed `ghostwire-flanked` marker on the target token, so the table can see the geometry
//      without opening a roll dialog. Director-side, recomputed on movement, never a player toggle.
//
// Everything above the "runtime" divider is Foundry-free so tools/f14-flanking-smoke.mjs can import
// and execute it under Node. The geometry there is the brief's own square-grid spec, and it is what
// the marker uses; the roll edge defers to the system's richer bounds/line-of-effect test whenever a
// live canvas is available.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Flanking";

/** One edge. Flanking never stacks with itself, however many opposite pairs exist. */
export const FLANKING_EDGES = 1;

/** The computed marker on a flanked target. `_id` must be exactly 16 characters. */
export const FLANKED_STATUS = Object.freeze({
  id: "ghostwire-flanked",
  _id: "gwFlanked0000000",
  name: `${L}.Label`,
  img: "icons/svg/sword.svg",
  order: 4,
});

export const FLANKED_ID = FLANKED_STATUS.id;

/**
 * Statuses that mean a body is standing there but is not holding a side of anything.
 * `dead` is Foundry's `CONFIG.specialStatusEffects.DEFEATED`, which the system's own `canFlank`
 * already refuses; it is repeated here so the computed marker and the system agree without the
 * marker having to reach into the system's getter. `ghostwire-meat-inert` is the Rigger body left
 * standing in the room while its owner is Jumped In (`scripts/rigger-vertical.mjs`).
 */
export const NON_FLANKING_STATUSES = Object.freeze([
  "dead",
  "unconscious",
  "ghostwire-meat-inert",
]);

/**
 * Is this ability a *melee* attack for flanking purposes?
 *
 * Sibling to F13's `isRangedAttack`, and deliberately the same honesty rule. RAW says **melee
 * strikes**, so the `strike` keyword is required — a melee *area* or a melee utility ability is not
 * a strike and gets nothing. A `meleeRanged` weapon reads **false**: nothing in the use pipeline
 * says which mode the player picked, and quietly edging a shot is worse than the Director adding one
 * edge in the dialog, which is one click away.
 *
 * @param {object} ability
 * @param {string} [ability.distanceType]   `system.distance.type`.
 * @param {Iterable<string>} [ability.keywords]
 * @returns {boolean}
 */
export function isMeleeStrike({ distanceType = "", keywords = [] } = {}) {
  const kw = new Set(keywords);
  if (!kw.has("strike")) return false;
  if (kw.has("ranged") && !kw.has("melee")) return false;
  if (distanceType === "ranged") return false;
  if (distanceType === "meleeRanged") return false;
  if (distanceType === "melee") return true;
  return kw.has("melee");
}

/* -------------------------------------------- square-grid geometry */

/**
 * A token's occupied grid squares, as `{col, row}` offsets.
 * Takes the token document shape Foundry uses (pixel `x`/`y` at the top-left, `width`/`height` in
 * squares) so the marker can be computed from documents without touching the canvas placeables.
 * @param {{x?: number, y?: number, width?: number, height?: number}} token
 * @param {number} [gridSize]
 * @returns {{col: number, row: number}[]}
 */
export function occupiedSquares(token, gridSize = 100) {
  const size = Number(gridSize) || 100;
  const col0 = Math.round((Number(token?.x) || 0) / size);
  const row0 = Math.round((Number(token?.y) || 0) / size);
  const w = Math.max(1, Math.round(Number(token?.width) || 1));
  const h = Math.max(1, Math.round(Number(token?.height) || 1));
  const cells = [];
  for (let dc = 0; dc < w; dc += 1) {
    for (let dr = 0; dr < h; dr += 1) cells.push({ col: col0 + dc, row: row0 + dr });
  }
  return cells;
}

/** Chebyshev distance 1 between any occupied square of each token — diagonals included. */
export function isAdjacent(a, b, gridSize = 100) {
  const as = occupiedSquares(a, gridSize);
  const bs = occupiedSquares(b, gridSize);
  for (const x of as) {
    for (const y of bs) {
      const d = Math.max(Math.abs(x.col - y.col), Math.abs(x.row - y.row));
      if (d === 1) return true;
    }
  }
  return false;
}

/** The centre of a token's occupied block, in square units (may be a half-square for even sizes). */
export function centreSquare(token, gridSize = 100) {
  const cells = occupiedSquares(token, gridSize);
  const col = cells.reduce((sum, c) => sum + c.col, 0) / cells.length;
  const row = cells.reduce((sum, c) => sum + c.row, 0) / cells.length;
  return { col, row };
}

/**
 * Do A and B sit on **opposite sides** of T?
 *
 * The brief's rule: the step from A to T and the step from T to B point the same way. Reduce each
 * offset to its sign — that turns any distance into one of the eight compass steps — and the pair
 * flanks when the two steps match and neither is the zero step. Cardinal pairs (N–S, E–W) and
 * diagonal pairs (NW–SE, NE–SW) both count; two allies crowding the same corner do not.
 *
 * @returns {boolean}
 */
export function onOppositeSides(target, a, b, gridSize = 100) {
  const t = centreSquare(target, gridSize);
  const pa = centreSquare(a, gridSize);
  const pb = centreSquare(b, gridSize);
  const step = (from, to) => ({ col: Math.sign(to.col - from.col), row: Math.sign(to.row - from.row) });
  const toTarget = step(pa, t);
  const fromTarget = step(t, pb);
  if (!toTarget.col && !toTarget.row) return false;
  return (toTarget.col === fromTarget.col) && (toTarget.row === fromTarget.row);
}

/**
 * Is `target` flanked, given the attacker and the candidate allies?
 *
 * Pure: every argument is a plain `{x, y, width, height}` token-ish object plus two predicates, so
 * the smoke can drive the whole rule without a canvas.
 *
 * @param {object} options
 * @param {object} options.target
 * @param {object} options.attacker
 * @param {object[]} [options.allies]        Other tokens on the attacker's side.
 * @param {boolean} [options.canBeFlanked]   False for Prehensile / cannotBeFlanked.
 * @param {number} [options.gridSize]
 * @returns {boolean}
 */
export function isFlanked({ target, attacker, allies = [], canBeFlanked = true, gridSize = 100 } = {}) {
  if (!target || !attacker || !canBeFlanked) return false;
  if (!isAdjacent(attacker, target, gridSize)) return false;
  for (const ally of allies) {
    if (!ally || ally === attacker) continue;
    if (!isAdjacent(ally, target, gridSize)) continue;
    if (onOppositeSides(target, attacker, ally, gridSize)) return true;
  }
  return false;
}

/**
 * Edges this ability's roll takes for flanking.
 * @param {object} options
 * @param {boolean} options.melee            isMeleeStrike for the ability being used.
 * @param {boolean} options.flanked          The target is flanked right now.
 * @param {boolean} [options.alreadyGranted] Draw Steel's own getTargetModifiers already added it.
 * @returns {number} 0 or 1.
 */
export function flankingEdges({ melee = false, flanked = false, alreadyGranted = false } = {}) {
  if (!melee || !flanked || alreadyGranted) return 0;
  return FLANKING_EDGES;
}

/** The Ghostwire flag a Director sets on anything that should never be flanked. */
export function cannotBeFlanked(actor) {
  const flags = actor?.flags?.[MODULE_ID] ?? actor?.flags?.["draw-steel-ghostwire"] ?? {};
  return flags.cannotBeFlanked === true;
}

/** A body that is present but not holding a side: defeated, unconscious, meat-inert, Ghostwire-inert. */
export function isNonFlankingBody(statuses) {
  const set = new Set(statuses ?? []);
  return NON_FLANKING_STATUSES.some(id => set.has(id));
}

/* ============================================ runtime (not imported by the smoke) */

/** The attacker's token on the viewed scene: the controlled one if it is theirs, else any of theirs. */
function attackerToken(actor) {
  const controlled = canvas?.tokens?.controlled ?? [];
  const mine = controlled.find(token => token.actor === actor);
  if (mine) return mine;
  return actor?.getActiveTokens?.()[0] ?? null;
}

function abilityIsMeleeStrike(model) {
  return isMeleeStrike({
    distanceType: model?.distance?.type ?? model?.parent?.system?.distance?.type ?? "",
    keywords: model?.keywords ?? model?.parent?.system?.keywords ?? [],
  });
}

/**
 * Did Draw Steel's own `getTargetModifiers` already add the flanking edge for this call?
 * Mirrors the system's condition exactly (draw-steel.mjs, AbilityModel#getTargetModifiers) so the
 * two never stack into a double edge.
 */
function systemGrantedFlank(model, target) {
  const controlled = canvas?.tokens?.controlled?.[0];
  const token = (controlled?.actor === model?.actor) ? controlled : null;
  if (!token) return false;
  const keywords = model?.keywords ?? new Set();
  if (!keywords.has?.("melee") || !keywords.has?.("strike")) return false;
  try {
    return token.isFlanking?.(target) === true;
  } catch {
    return false;
  }
}

/** Ghostwire's own read of the geometry, from token documents. Used when the system did not grant. */
function flankedOnCanvas(targetToken, attacker) {
  if (!targetToken || !attacker) return false;
  const gridSize = canvas?.grid?.size ?? 100;
  const disposition = attacker.document?.disposition;
  const allies = (canvas?.tokens?.placeables ?? []).filter(token => {
    if ((token === attacker) || (token === targetToken)) return false;
    if (token.document?.disposition !== disposition) return false;
    return canFlankToken(token);
  });
  return isFlanked({
    target: targetToken.document,
    attacker: attacker.document,
    allies: allies.map(token => token.document),
    canBeFlanked: canBeFlankedToken(targetToken),
    gridSize,
  });
}

/** Ghostwire's extra "can this token hold a side" rules, on top of the system's `canFlank`. */
function canFlankToken(token) {
  const actor = token?.actor;
  if (!actor) return false;
  if (isNonFlankingBody(actor.statuses ?? [])) return false;
  return token.canFlank !== false;
}

function canBeFlankedToken(token) {
  const actor = token?.actor;
  if (!actor) return false;
  if (cannotBeFlanked(actor)) return false;
  return actor.system?.statuses?.flankable !== false;
}

/**
 * `canBeFlanked` / `canFlank` carry the Ghostwire rules into every native call site at once —
 * the roll edge, opportunity-adjacent code, and anything the system adds later.
 */
function patchTokenFlanking() {
  const TokenClass = CONFIG.Token?.objectClass;
  const proto = TokenClass?.prototype;
  if (!proto || proto._ghostwireFlankPatched) return;
  const priorBeFlanked = Object.getOwnPropertyDescriptor(proto, "canBeFlanked")?.get;
  const priorFlank = Object.getOwnPropertyDescriptor(proto, "canFlank")?.get;
  if (!priorBeFlanked || !priorFlank) {
    console.warn(`${MODULE_ID} | Token#canFlank / #canBeFlanked not found; Flanking ships geometry only`);
    return;
  }
  proto._ghostwireFlankPatched = true;
  Object.defineProperty(proto, "canBeFlanked", {
    configurable: true,
    get() {
      if (cannotBeFlanked(this.actor)) return false;
      return priorBeFlanked.call(this);
    },
  });
  Object.defineProperty(proto, "canFlank", {
    configurable: true,
    get() {
      if (isNonFlankingBody(this.actor?.statuses ?? [])) return false;
      return priorFlank.call(this);
    },
  });
}

/**
 * The roll edge. Same seam as F13 Cover/Conceal — `AbilityModel#getTargetModifiers`, the system's
 * own per-target modifier bag, so the edge lands on the roll for *that target only*, shows in the
 * dialog before the dice move, and the player can clear it if the Director rules otherwise.
 */
function patchTargetModifiers() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? globalThis.ds?.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.getTargetModifiers) {
    console.warn(`${MODULE_ID} | AbilityModel#getTargetModifiers not found; Flanking adds no edge`);
    return;
  }
  const prior = AbilityModel.prototype.getTargetModifiers;
  AbilityModel.prototype.getTargetModifiers = function(target) {
    const modifiers = prior.call(this, target);
    if (!abilityIsMeleeStrike(this)) return modifiers;
    const alreadyGranted = systemGrantedFlank(this, target);
    const attacker = attackerToken(this.actor);
    const edges = flankingEdges({
      melee: true,
      flanked: alreadyGranted || flankedOnCanvas(target, attacker),
      alreadyGranted,
    });
    if (edges) modifiers.edges += edges;
    return modifiers;
  };
}

/* -------------------------------------------- the computed marker */

/** Every token on the scene that is flanked by someone right now. */
function flankedTokenIds() {
  const ids = new Set();
  const tokens = canvas?.tokens?.placeables ?? [];
  for (const target of tokens) {
    if (!canBeFlankedToken(target)) continue;
    const attackers = tokens.filter(token => (token !== target)
      && (token.document?.disposition !== target.document?.disposition)
      && canFlankToken(token));
    const flanked = attackers.some(attacker => flankedOnCanvas(target, attacker));
    if (flanked) ids.add(target.id);
  }
  return ids;
}

/**
 * Sync the marker to the geometry. GM client only: the marker is an ActiveEffect on the target's
 * actor, and a player cannot write one onto an enemy. It is computed, never toggled — the stock
 * HUD palette does not list it, and clicking it off is pointless because the next move restores it.
 */
async function syncFlankedMarkers() {
  if (!game.user.isGM || !canvas?.ready) return;
  if (!game.settings.get(MODULE_ID, "flankingMarker")) return;
  const flanked = flankedTokenIds();
  for (const token of canvas.tokens.placeables) {
    const actor = token.actor;
    if (!actor) continue;
    const has = actor.statuses?.has?.(FLANKED_ID) ?? false;
    const want = flanked.has(token.id);
    if (has === want) continue;
    try {
      await actor.toggleStatusEffect(FLANKED_ID, { active: want, overlay: false });
    } catch (error) {
      console.warn(`${MODULE_ID} | could not sync the flanked marker on ${actor.name}`, error);
    }
  }
}

/** One recompute per animation frame's worth of token movement, not one per token. */
let syncHandle = null;
function scheduleSync() {
  if (syncHandle) return;
  syncHandle = window.setTimeout(() => {
    syncHandle = null;
    syncFlankedMarkers();
  }, 120);
}

function registerSettings() {
  game.settings.register(MODULE_ID, "flankingMarker", {
    name: `${L}.Settings.Marker.Name`, hint: `${L}.Settings.Marker.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
    onChange: () => scheduleSync(),
  });
}

export function registerFlanking() {
  registerSettings();

  // Registered so the marker has a name and an icon wherever Foundry draws statuses. It is not a
  // player toggle: `hud: false` keeps it out of the token HUD palette F13's Cover/Conceal lives in.
  CONFIG.statusEffects[FLANKED_STATUS.id] = { ...FLANKED_STATUS, hud: false };

  Hooks.once("ready", () => {
    patchTokenFlanking();
    patchTargetModifiers();
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        FLANKED_ID,
        isFlanked,
        isMeleeStrike,
        flankingEdges,
        onOppositeSides,
        cannotBeFlanked,
        syncFlankedMarkers,
      };
    }
    scheduleSync();
    console.log(`${MODULE_ID} | F14 Flanking: melee-strike edge on opposite-side allies (auto-detected)`);
  });

  Hooks.on("updateToken", (token, changes) => {
    if (("x" in changes) || ("y" in changes) || ("width" in changes) || ("height" in changes) || ("disposition" in changes)) scheduleSync();
  });
  Hooks.on("createToken", scheduleSync);
  Hooks.on("deleteToken", scheduleSync);
  Hooks.on("canvasReady", scheduleSync);
  Hooks.on("updateCombat", scheduleSync);
  // A body that drops (or wakes, or jumps into a drone) changes who is holding a side.
  const statusChanged = effect => [...(effect?.statuses ?? [])].some(id => NON_FLANKING_STATUSES.includes(id));
  Hooks.on("createActiveEffect", effect => { if (statusChanged(effect)) scheduleSync(); });
  Hooks.on("deleteActiveEffect", effect => { if (statusChanged(effect)) scheduleSync(); });
}
