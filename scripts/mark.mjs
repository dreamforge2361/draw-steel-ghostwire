// 0.3.128 (D) — one Mark, five sources, and the edge goes to the creatures the ability's text names.
//
// Ghostwire had five abilities that paint a target and not one of them landed anything:
//
//   * **You!** (Corp Enforcer) shipped an Active Effect named `You!` with `showIcon: 1` and *no route
//     to the target at all* — no apply link in its description, no code. Using it printed a maneuver
//     card and nothing happened. That is the bug the Director noticed.
//   * **Spot Target** (the Ghostwire replacement for Aid Attack) had no Active Effect whatsoever. The
//     edge it grants an ally was a sentence in the card text and an honour system.
//   * **Hard Tag** (Scout / Hunter, `quarry`) had an apply link and an effect with `changes: []`, so
//     the icon landed and the mechanics did not.
//   * **Commander Mark** had an apply link and one change: `system.combat.targetModifiers.edges +1`.
//     That is the *wrong scope* and the most interesting bug of the five. Draw Steel reads that key
//     for **every** attacker (draw-steel.mjs, `AbilityModel#getTargetModifiers`), so a Commander's
//     Mark handed an edge to the marked creature's own allies shooting back through it, and to the
//     enemy team, and to a Director's wandering monster. The ability text says "you and allies within
//     your line of effect". A static change on the target cannot express "whose".
//   * **Spotter Lock** (Wrench / Drone Jockey) says a spotter drone marks the target and the next
//     Rigged Fire or Focus Fire against it gains an edge. No effect, no icon, no edge.
//
// Four decisions:
//
//  1. **Scope lives on the applied effect, not in the target's data.** Every mark this file applies
//     carries `flags.<module>.mark = { by, kind, scope, ... }`. `getTargetModifiers` is patched to
//     read those flags and compare the *attacker* against `by`, so "the enforcer and their allies"
//     and "the next ally" are both expressible and neither one leaks to the other team. The blanket
//     `targetModifiers.edges` change comes off the Commander Mark pack row in the same wave, because
//     leaving it would double the edge for the people who should have it and keep giving it to the
//     people who should not.
//  2. **Applying is automatic on use, and the apply link stays.** The `[[/apply …]]` enricher needs
//     the Director to *select* the target's token, which is backwards from how anybody plays — you
//     target with T and then roll. So the mark is applied to the targeted tokens when the ability is
//     used. The links stay in the card text as the manual override, and You! and Spotter Lock gain
//     one they never had.
//  3. **A player marking an enemy goes through the GM.** Foundry will not let a player create an
//     Active Effect on an actor they do not own, and a Commander marking a Corp Enforcer is exactly
//     that. The relay is the same native `game.socket` pattern scripts/chrome-damage.mjs already
//     uses for chrome strikes — no socketlib, no new dependency.
//  4. **Hard Tag is bonus damage, and this file says so rather than faking it.** The printed text
//     grants no edge: it grants direction and distance, and +1/+2/+3/+4 by echelon on the Hunter's
//     first strike against the mark each round. Draw Steel's per-target modifier bag carries edges,
//     banes and a roll bonus — there is no damage seam in it — so the rider is a line on the attack
//     card with the real number and a once-per-round latch, not a silent mutation of somebody else's
//     damage maths. `markEdges` returning 0 for Hard Tag is the lock, not an omission.
//
// Helpers above the "Foundry registration" divider are Foundry-free so
// tools/wave-03128-smoke.mjs can run them under Node.

import { occupiedSquares } from "./flanking.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Mark";
const SOCKET = `module.${MODULE_ID}`;

/** The flag every applied mark carries: `flags.<module>.mark`. */
export const MARK_FLAG = "mark";

/**
 * Who a mark's edge is for.
 *
 *   `source`           — only the creature who placed it (Hard Tag, Spotter Lock).
 *   `allies`           — the marker's allies but not the marker (Spot Target: you called it out *for*
 *                        the crew; the edge is the crew's).
 *   `sourceAndAllies`  — the marker and their allies (You!, Commander Mark).
 */
export const MARK_SCOPES = Object.freeze(["source", "allies", "sourceAndAllies"]);

/** When a mark comes off by itself. `markerTurnStart` is this file's own sweep; the rest are Draw Steel's. */
export const MARK_EXPIRIES = Object.freeze(["markerTurnStart", "combatEnd"]);

/**
 * Every ability that places a Ghostwire Mark, by `_dsid`.
 *
 * `effectId` is the Active Effect on that ability's own pack row — `_id` values, not names, because a
 * name is localized and an id is not. `exclusive` means the marker can only hold one at a time, so
 * placing a new one lifts the old (Commander Mark and Hard Tag both say so in as many words).
 * `consume` means the mark is spent by the first attack that benefits from it. `abilities`, when
 * present, restricts the edge to those ability `_dsid`s.
 */
export const MARK_SOURCES = Object.freeze({
  // Corp Enforcer (bestiary). "Marked until the start of the enforcer's next turn. The enforcer and
  // each of their allies gain an edge on abilities used against targets marked by the enforcer."
  you: Object.freeze({
    kind: "you",
    effectId: "AWkopDFw00pvxBSD",
    scope: "sourceAndAllies",
    edges: 1,
    consume: false,
    exclusive: true,
    expire: "markerTurnStart",
  }),

  // Spot Target — Ghostwire's Aid Attack. "The next ability power roll an ally makes against that
  // creature before the start of your next turn has an edge." One ally, one roll: consumed.
  "aid-attack": Object.freeze({
    kind: "spot",
    effectId: "GWSpotTarget0000",
    scope: "allies",
    edges: 1,
    consume: true,
    exclusive: true,
    expire: "markerTurnStart",
    // 0.3.132 (B). The card reads "choose an enemy **adjacent to you**", and the ability's own
    // `distance` is `melee` / primary 1, so the reach is the card's, not a number invented here.
    requires: Object.freeze({ enemy: true, reach: 1 }),
  }),

  // Hard Tag — Scout / Hunter. Direction and distance, plus first-strike bonus damage each round.
  // No edge: `edges: 0` is what the printed text says.
  quarry: Object.freeze({
    kind: "hardTag",
    effectId: "QR00000000marked",
    scope: "source",
    edges: 0,
    consume: false,
    exclusive: true,
    expire: "combatEnd",
    firstStrikeDamage: true,
  }),

  // Commander Mark. "While a creature Marked by you is within your line of effect, you and allies
  // within your line of effect gain an edge on power rolls made against it."
  mark: Object.freeze({
    kind: "commander",
    effectId: "CMD0000000marked",
    scope: "sourceAndAllies",
    edges: 1,
    consume: false,
    exclusive: true,
    expire: "combatEnd",
  }),

  // Spotter Lock — Wrench / Drone Jockey. "The next Rigged Fire or Focus Fire against it this round
  // gains an edge."
  "spotter-lock": Object.freeze({
    kind: "spotterLock",
    effectId: "WRSpotterLock000",
    scope: "source",
    edges: 1,
    consume: true,
    exclusive: true,
    expire: "markerTurnStart",
    abilities: Object.freeze(["rigged-fire", "focus-fire"]),
  }),
});

/** The `_dsid`s this file owns. */
export const MARK_DSIDS = Object.freeze(Object.keys(MARK_SOURCES));

/** The mark spec for one ability `_dsid`, or null. */
export function markSpecFor(dsid) {
  return MARK_SOURCES[String(dsid ?? "")] ?? null;
}

/** The spec behind an applied mark's `kind`, or null. */
export function markSpecForKind(kind) {
  return Object.values(MARK_SOURCES).find(spec => spec.kind === String(kind ?? "")) ?? null;
}

/**
 * Edges this attack takes because the target is marked.
 *
 * The whole point of the file in eight lines. Returns 0 rather than throwing on anything it does not
 * recognise, because a Director's homebrew flag should make a roll boring, not broken.
 *
 * @param {object} opts
 * @param {object|null} opts.spec              From `markSpecFor` / `markSpecForKind`.
 * @param {boolean} opts.attackerIsSource      The attacker placed this mark.
 * @param {boolean} opts.attackerIsAlly        The attacker is on the marker's side.
 * @param {string}  [opts.abilityDsid]         The `_dsid` of the ability being rolled.
 * @returns {0|1}
 */
export function markEdges({ spec = null, attackerIsSource = false, attackerIsAlly = false, abilityDsid = "" } = {}) {
  if (!spec) return 0;
  if (!(Number(spec.edges) > 0)) return 0;         // Hard Tag: bonus damage, never an edge
  if (spec.abilities?.length && !spec.abilities.includes(String(abilityDsid))) return 0;
  switch (spec.scope) {
    case "source": return attackerIsSource ? 1 : 0;
    case "allies": return (attackerIsAlly && !attackerIsSource) ? 1 : 0;
    case "sourceAndAllies": return (attackerIsSource || attackerIsAlly) ? 1 : 0;
    default: return 0;
  }
}

/**
 * Squares between two tokens, Chebyshev — 0 when they overlap, 1 when they are adjacent.
 *
 * Reuses F14's `occupiedSquares` so a Medium-2 enforcer is measured from its *nearest* square rather
 * than from a centre point, which is the difference between "adjacent" and "adjacent-ish" for
 * anything bigger than one square.
 *
 * @param {{x?: number, y?: number, width?: number, height?: number}} a
 * @param {{x?: number, y?: number, width?: number, height?: number}} b
 * @param {number} [gridSize]
 * @returns {number}
 */
export function squaresApart(a, b, gridSize = 100) {
  if (!a || !b) return Infinity;
  let best = Infinity;
  for (const x of occupiedSquares(a, gridSize)) {
    for (const y of occupiedSquares(b, gridSize)) {
      best = Math.min(best, Math.max(Math.abs(x.col - y.col), Math.abs(x.row - y.row)));
    }
  }
  return best;
}

/**
 * May this mark be placed at all? (0.3.132 B.)
 *
 * **The refusal is the feature.** 0.3.128 shipped Spot Target as "apply to whatever is targeted",
 * which meant three different silences Michael hit in the same sitting: no target at all was a
 * no-op with no message, an *ally* under the crosshair took a mark meant for an enemy, and an enemy
 * across the room took one the card never allowed. All three now come back as a reason string, and
 * the caller turns that into a toast **before** Draw Steel prints a maneuver that was never legal.
 *
 * A spec with no `requires` is unchanged and always passes — Commander Mark, Hard Tag and Spotter
 * Lock place from range by their own text and none of them are this file's problem today.
 *
 * `rows` is deliberately dumb data (`{name, isEnemy, apart}`), so the smoke can drive every branch
 * without a canvas.
 *
 * @param {object} opts
 * @param {object|null} opts.spec        From {@link markSpecFor}.
 * @param {Array<{name?: string, isEnemy?: boolean, apart?: number}>} opts.rows
 * @returns {{ok: boolean, reason: "noTarget"|"notEnemy"|"notAdjacent"|null,
 *            picked: Array<object>, reach: number}}
 */
export function markUseGate({ spec = null, rows = [] } = {}) {
  const requires = spec?.requires ?? null;
  const reach = Math.max(0, Math.floor(Number(requires?.reach ?? 0)) || 0);
  const list = [...(rows ?? [])];
  if (!requires) return { ok: true, reason: null, picked: list, reach };
  if (!list.length) return { ok: false, reason: "noTarget", picked: [], reach };
  const enemies = requires.enemy ? list.filter(row => row.isEnemy) : list;
  if (!enemies.length) return { ok: false, reason: "notEnemy", picked: [], reach };
  const near = reach ? enemies.filter(row => Number(row.apart) <= reach) : enemies;
  if (!near.length) return { ok: false, reason: "notAdjacent", picked: [], reach };
  return { ok: true, reason: null, picked: near, reach };
}

/**
 * Hard Tag's printed rider: +1 at Echelon 1 through +4 at Echelon 4, on the Hunter's **first** strike
 * against the mark each round.
 *
 * Clamps rather than fails, so a homebrew Echelon 5 Hunter gets 4 instead of undefined.
 */
export function hardTagBonusDamage(echelon = 1) {
  const band = Math.max(1, Math.min(4, Math.floor(Number(echelon) || 1)));
  return band;
}

/**
 * Has this round's Hard Tag rider already been spent?
 *
 * The latch is `{ round, combat }` on the applied mark's flags, compared against the encounter now.
 * A new round, or a different encounter, is a fresh first strike.
 */
export function hardTagSpent({ latch = null, round = 0, combat = null } = {}) {
  if (!latch) return false;
  if (String(latch.combat ?? "") !== String(combat ?? "")) return false;
  return Number(latch.round) === Number(round);
}

/**
 * Should a `markerTurnStart` mark be swept now?
 *
 * The mark was placed during the marker's turn in round N. It lasts until the start of the marker's
 * next turn, so it comes off the moment the marker is the active combatant again in a later round —
 * not at the end of the round, which in Draw Steel's alternating initiative is a different moment.
 *
 * @param {object} opts
 * @param {{round: number, combat: string|null}} opts.placed  What the flag recorded.
 * @param {number} opts.round        The encounter's round now.
 * @param {string|null} opts.combat  The encounter's id now.
 * @param {boolean} opts.markerIsActive  The marker is the combatant whose turn just began.
 * @returns {boolean}
 */
export function markExpired({ placed = null, round = 0, combat = null, markerIsActive = false } = {}) {
  if (!placed) return true;                        // no record of when it started: do not keep it forever
  if (String(placed.combat ?? "") !== String(combat ?? "")) return true;
  if (!markerIsActive) return false;
  return Number(round) > Number(placed.round ?? 0);
}

/* ============================================ Foundry registration */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const esc = text => foundry.utils.escapeHTML(String(text ?? ""));

/* -------------------------------------------- reading marks off an actor */

/** The mark payload on one Active Effect, or null. */
function markPayload(effect) {
  const payload = effect?.getFlag?.(MODULE_ID, MARK_FLAG)
    ?? effect?.flags?.[MODULE_ID]?.[MARK_FLAG]
    ?? null;
  return (payload && payload.kind) ? payload : null;
}

/** Every Ghostwire mark currently on this actor, as `{ effect, mark, spec }`. */
export function marksOn(actor) {
  const rows = [];
  for (const effect of actor?.effects ?? []) {
    if (effect.disabled) continue;
    const mark = markPayload(effect);
    if (!mark) continue;
    rows.push({ effect, mark, spec: markSpecForKind(mark.kind) });
  }
  return rows;
}

/** The Actor a mark was placed by, if it is still around. */
function markerOf(mark) {
  if (!mark?.by) return null;
  try {
    const doc = fromUuidSync(mark.by);
    return (doc?.documentName === "Actor") ? doc : (doc?.actor ?? null);
  } catch {
    return null;
  }
}

/**
 * Are these two actors on the same side?
 *
 * Token disposition first, because that is what a Director actually sets and it covers a Director's
 * NPC allies fighting beside the crew. With no token on the scene, heroes count as each other's
 * allies and an NPC counts as an ally of an NPC — the coarse read, used only as a fallback.
 */
function areAllies(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  const disposition = actor => actor.getActiveTokens?.()[0]?.document?.disposition
    ?? actor.prototypeToken?.disposition
    ?? null;
  const da = disposition(a);
  const db = disposition(b);
  if ((da !== null) && (db !== null)) return da === db;
  return a.type === b.type;
}

/* -------------------------------------------- applying */

/** The Active Effect data one mark puts on a target. */
function markEffectData(ability, spec, marker) {
  const template = ability?.effects?.get?.(spec.effectId);
  if (!template) {
    console.warn(`${MODULE_ID} | ${ability?.name} has no effect ${spec.effectId}; no mark applied`);
    return null;
  }
  const data = template.toObject();
  delete data._stats;
  data.transfer = true;
  data.disabled = false;
  data.origin = ability.uuid;
  if (spec.expire === "combatEnd") data.duration = { ...(data.duration ?? {}), expiry: "combatEnd" };
  data.flags = foundry.utils.mergeObject(data.flags ?? {}, {
    [MODULE_ID]: {
      [MARK_FLAG]: {
        kind: spec.kind,
        by: marker.uuid,
        byName: marker.name,
        scope: spec.scope,
        placed: { round: game.combat?.round ?? 0, combat: game.combat?.id ?? null },
        latch: null,
      },
    },
  });
  return data;
}

/**
 * Every actor a mark could currently be sitting on.
 *
 * `game.actors` alone is not enough: an unlinked token (which is most of the bestiary — every
 * Ghostwire NPC ships `actorLink: false`) carries a *synthetic* actor that lives on the token and is
 * not in the world collection. A sweep that only walked `game.actors` would leave the mark on the
 * one enforcer who was actually marked.
 */
function actorsInPlay() {
  const actors = new Set(game.actors ?? []);
  for (const token of canvas?.tokens?.placeables ?? []) {
    if (token.actor) actors.add(token.actor);
  }
  return actors;
}

/** Take the marker's previous mark of this kind off everybody. Exclusive marks only. */
async function liftPreviousMarks(spec, marker, keepActorIds = new Set()) {
  if (!spec.exclusive) return;
  for (const actor of actorsInPlay()) {
    if (keepActorIds.has(actor.id)) continue;
    const stale = marksOn(actor)
      .filter(row => (row.mark.kind === spec.kind) && (row.mark.by === marker.uuid))
      .map(row => row.effect.id);
    if (!stale.length) continue;
    if (!actor.isOwner) continue;                  // the GM's own sweep will get it
    await actor.deleteEmbeddedDocuments("ActiveEffect", stale);
  }
}

/** Put one mark on one target. Relays to a GM when this user cannot write on the target. */
async function placeMark(ability, spec, marker, target) {
  const data = markEffectData(ability, spec, marker);
  if (!data) return false;
  if (!target.isOwner) return relayMark({ abilityUuid: ability.uuid, dsid: ability.system?._dsid, targetUuid: target.uuid, markerUuid: marker.uuid });
  // keepId: re-marking the same target with the same ability replaces rather than stacks.
  const existing = target.effects.get(data._id);
  if (existing) await target.deleteEmbeddedDocuments("ActiveEffect", [data._id]);
  await target.createEmbeddedDocuments("ActiveEffect", [data], { keepId: true });
  return true;
}

/** Apply the mark this ability places to every actor it was aimed at. */
export async function applyMarks(ability, marker, targets = []) {
  const spec = markSpecFor(ability?.system?._dsid);
  if (!spec || !marker || !targets.length) return 0;
  await liftPreviousMarks(spec, marker, new Set(targets.map(actor => actor.id)));
  let placed = 0;
  for (const target of targets) {
    if (!target || (target === marker)) continue;
    if (await placeMark(ability, spec, marker, target)) placed += 1;
  }
  if (placed) {
    ui.notifications.info(loc("Notify.Placed", {
      mark: loc(`Kinds.${spec.kind}`), marker: marker.name, count: placed,
    }));
  }
  return placed;
}

/* -------------------------------------------- the GM relay */

function relayMark(payload) {
  const gm = game.users.find(user => user.isGM && user.active);
  if (!gm) {
    ui.notifications.warn(loc("Notify.NoGm"));
    return false;
  }
  game.socket.emit(SOCKET, { op: "mark.place", ...payload });
  return true;
}

async function onMarkSocket(payload) {
  if (payload?.op !== "mark.place" || !game.user.isGM) return;
  const gm = game.users.find(user => user.isGM && user.active);
  if (!gm || (gm.id !== game.user.id)) return;     // one GM does it, not all of them
  const ability = await fromUuid(payload.abilityUuid).catch(() => null);
  const marker = await fromUuid(payload.markerUuid).catch(() => null);
  const target = await fromUuid(payload.targetUuid).catch(() => null);
  const spec = markSpecFor(ability?.system?._dsid ?? payload.dsid);
  if (!ability || !spec || !target) return;
  const markerActor = (marker?.documentName === "Actor") ? marker : (marker?.actor ?? null);
  if (!markerActor) return;
  await placeMark(ability, spec, markerActor, target);
}

/* -------------------------------------------- the edge */

/**
 * Edges this roll takes from every mark on the target, and the Hard Tag rider if one is due.
 *
 * Marks never stack with themselves: two Commanders who both marked the same creature each give
 * their own side one edge, and one attacker only ever collects one, because Draw Steel's edges cap
 * at a double edge and a stack of four would be nonsense. The maximum across all marks is taken.
 */
function markModifiersFor(attacker, targetActor, abilityDsid) {
  let edges = 0;
  for (const { mark, spec } of marksOn(targetActor)) {
    if (!spec) continue;
    const marker = markerOf(mark);
    if (!marker) continue;
    edges = Math.max(edges, markEdges({
      spec,
      attackerIsSource: marker === attacker,
      attackerIsAlly: areAllies(marker, attacker),
      abilityDsid,
    }));
  }
  return { edges };
}

/**
 * The roll edge. Same seam F13 Cover/Conceal and F14 Flanking already patch —
 * `AbilityModel#getTargetModifiers` — so the edge lands on the roll for *that target only*, shows in
 * the dialog before the dice move, and the Director can clear it if they rule otherwise.
 */
function patchTargetModifiers() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? globalThis.ds?.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.getTargetModifiers) {
    console.warn(`${MODULE_ID} | AbilityModel#getTargetModifiers not found; marks grant no edge`);
    return;
  }
  const prior = AbilityModel.prototype.getTargetModifiers;
  AbilityModel.prototype.getTargetModifiers = function(target) {
    const modifiers = prior.call(this, target);
    const targetActor = target?.actor;
    if (!targetActor || !this.actor) return modifiers;
    try {
      const { edges } = markModifiersFor(this.actor, targetActor, this.parent?.system?._dsid ?? this._dsid);
      if (edges) modifiers.edges += edges;
    } catch (error) {
      console.warn(`${MODULE_ID} | mark edge failed; the roll stands without it`, error);
    }
    return modifiers;
  };
}

/* -------------------------------------------- consuming, and the Hard Tag rider */

/**
 * After an attack resolves: spend the consumable marks it benefited from, and latch Hard Tag's
 * once-per-round rider.
 *
 * @returns {Promise<{consumed: number, riders: Array<{mark: object, damage: number}>}>}
 */
async function settleMarksAfterAttack(attacker, targets, abilityDsid) {
  const riders = [];
  let consumed = 0;
  for (const target of targets) {
    for (const { effect, mark, spec } of marksOn(target)) {
      if (!spec) continue;
      const marker = markerOf(mark);
      if (!marker) continue;
      const attackerIsSource = marker === attacker;
      const attackerIsAlly = areAllies(marker, attacker);

      if (spec.firstStrikeDamage && attackerIsSource) {
        const round = game.combat?.round ?? 0;
        const combat = game.combat?.id ?? null;
        if (!hardTagSpent({ latch: mark.latch, round, combat })) {
          riders.push({ target, damage: hardTagBonusDamage(attacker.system?.echelon) });
          if (target.isOwner) {
            await effect.setFlag(MODULE_ID, MARK_FLAG, { ...mark, latch: { round, combat } });
          }
        }
        continue;
      }

      if (!spec.consume) continue;
      if (!markEdges({ spec, attackerIsSource, attackerIsAlly, abilityDsid })) continue;
      if (!target.isOwner) continue;               // the GM who owns the target sweeps it
      await target.deleteEmbeddedDocuments("ActiveEffect", [effect.id]);
      consumed += 1;
    }
  }
  return { consumed, riders };
}

/** The marker's own token on this scene, for the reach measurement. */
function markerToken(actor) {
  const controlled = canvas?.tokens?.controlled ?? [];
  const mine = controlled.find(token => token.actor === actor);
  return (mine ?? actor?.getActiveTokens?.(false, false)?.[0])?.document ?? null;
}

/**
 * The live gate rows for one use: who is targeted, whose side they are on, how far away.
 *
 * With no token for the marker on this scene there is nothing to measure from, so `apart` is 0 —
 * the reach check passes and the enemy check still has to. Refusing a Director rolling from the
 * sidebar would be a worse bug than the one this closes.
 */
function gateRows(marker, targetTokens) {
  const from = markerToken(marker);
  const grid = canvas?.dimensions?.size ?? canvas?.grid?.size ?? 100;
  return targetTokens.map(token => ({
    token,
    name: token.actor?.name ?? token.name ?? "",
    isEnemy: !areAllies(marker, token.actor),
    apart: from ? squaresApart(from, token.document ?? token, grid) : 0,
  }));
}

/**
 * Patch `AbilityModel#use` to place marks and settle them.
 *
 * Registered after every other `use` patch in scripts/module.mjs, so the ammo, grenade, reagent and
 * consumable patches have all already had their say and this one only ever runs on a use that
 * actually produced a card.
 *
 * 0.3.132 (B) changes two things about that last sentence:
 *
 *  * a spec with `requires` is **gated before `use` is called at all**, so an illegal Spot Target
 *    never becomes a card the table has to walk back; and
 *  * a legal one no longer depends on `use` returning a message. Spot Target is a maneuver with an
 *    empty `power`, and an empty power is exactly the case where the system can hand back nothing
 *    at all — which is how a valid use ended up placing no mark. The mark is the ability; the card
 *    is the receipt. `message === null` still places it.
 */
function patchMarkUse() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? globalThis.ds?.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; marks are apply-link only`);
    return;
  }
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    const actor = this.actor;
    const dsid = this.parent?.system?._dsid ?? this._dsid;
    const spec = markSpecFor(dsid);
    const marksAnything = !!spec;

    // Read targets before the roll: resolving a card can clear the user's targets.
    const targetTokens = [...(game.user?.targets ?? [])].filter(token => token?.actor);
    let targets = targetTokens.map(token => token.actor);

    if (marksAnything && spec.requires && actor) {
      const gate = markUseGate({ spec, rows: gateRows(actor, targetTokens) });
      if (!gate.ok) {
        ui.notifications.warn(loc(`Notify.Refuse.${gate.reason}`, {
          ability: this.parent?.name ?? "", actor: actor.name, reach: gate.reach,
        }));
        return null;
      }
      // Only the legal targets are marked, so one legal pick beside three illegal ones still works.
      targets = gate.picked.map(row => row.token?.actor).filter(Boolean);
    }

    const message = await use.call(this, config, dialogOptions, messageOptions);
    if (!actor) return message;

    try {
      if (marksAnything) {
        await applyMarks(this.parent, actor, targets);
      } else if (message && targets.length) {
        const { riders } = await settleMarksAfterAttack(actor, targets, dsid);
        if (riders.length) await addHardTagRider(message, riders);
      }
    } catch (error) {
      console.warn(`${MODULE_ID} | mark bookkeeping failed; the card stands`, error);
    }
    return message;
  };
}

/** Stamp the Hard Tag rider on the attack card, so the number is on the table and not in a head. */
async function addHardTagRider(message, riders) {
  await message.setFlag?.(MODULE_ID, "hardTagRider", riders.map(row => ({
    target: row.target?.name ?? "",
    damage: row.damage,
  })));
}

function injectHardTagRider(message, html) {
  const riders = message.getFlag?.(MODULE_ID, "hardTagRider");
  if (!riders?.length || html.querySelector(".ghostwire-hardtag-rider")) return;
  const host = html.querySelector(".message-content") ?? html;
  for (const rider of riders) {
    const line = document.createElement("p");
    line.className = "ghostwire-hardtag-rider";
    line.innerHTML = `<em>${loc("Rider.HardTag", { target: esc(rider.target), damage: rider.damage })}</em>`;
    host.append(line);
  }
}

/* -------------------------------------------- expiry */

/**
 * Sweep `markerTurnStart` marks when their marker's turn comes round again.
 *
 * GM only: the marks are on actors a player may not own, and one client doing the sweep is one
 * client's worth of deletions rather than four racing.
 */
async function sweepMarks() {
  if (!game.user.isGM) return 0;
  const combat = game.combat ?? null;
  const round = combat?.round ?? 0;
  const activeActor = combat?.combatant?.actor ?? null;
  let removed = 0;
  for (const actor of actorsInPlay()) {
    if (!actor.isOwner) continue;
    const stale = [];
    for (const { effect, mark, spec } of marksOn(actor)) {
      if (spec?.expire !== "markerTurnStart") continue;
      const marker = markerOf(mark);
      const expired = markExpired({
        placed: mark.placed,
        round,
        combat: combat?.id ?? null,
        markerIsActive: !!marker && (marker === activeActor),
      });
      if (expired) stale.push(effect.id);
    }
    if (!stale.length) continue;
    await actor.deleteEmbeddedDocuments("ActiveEffect", stale);
    removed += stale.length;
  }
  return removed;
}

/* -------------------------------------------- registration */

export function registerMark() {
  Hooks.once("ready", () => {
    patchMarkUse();
    patchTargetModifiers();
    game.socket.on(SOCKET, onMarkSocket);
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        mark: {
          MARK_SOURCES,
          applyMarks,
          marksOn,
          markEdges,
          markSpecFor,
          markUseGate,
          squaresApart,
          hardTagBonusDamage,
          sweepMarks,
        },
      };
    }
    console.log(`${MODULE_ID} | Mark registered (${MARK_DSIDS.join(" / ")}; scoped edges, not a blanket targetModifier)`);
  });

  Hooks.on("combatTurnChange", () => sweepMarks());
  Hooks.on("combatRound", () => sweepMarks());
  Hooks.on("deleteCombat", () => sweepMarks());
  Hooks.on("renderChatMessageHTML", (message, html) => injectHardTagRider(message, html));
}
