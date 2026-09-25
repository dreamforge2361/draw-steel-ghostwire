// 0.3.134 (I/J) — the two support cards that printed a list and then did nothing.
//
// **Rally the Crew** (Commander, 5 Influence, 5 burst) says every ally in the area "ends one
// condition on themselves, can spend a Recovery, gains temporary Stamina, and gains an edge on their
// next power roll" — four separate things, none of which happened. The Director read them out and
// the table did them by hand, badly, or not at all.
//
// **Lay On Hands** (Street Priest) says "the target can spend a Recovery" and never asked anybody.
//
// Both now resolve automatically, and both go through the one shared helper in
// scripts/recovery-prompt.mjs so the *owner* of each character is the one who decides whether to
// burn a Recovery. Everything above the "Foundry registration" divider is Foundry-free so
// tools/wave-03134-smoke.mjs can run the rules in Node.

import { requestRecovery } from "./recovery-prompt.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Rally";

export const RALLY_DSID = "rally-the-crew";
export const LAY_ON_HANDS_DSID = "lay-on-hands";
/** Rally the Crew is a 5 burst; the radius is measured from the Commander, who is included. */
export const RALLY_BURST = 5;
/** Draw Steel's temporary Stamina does not stack — you keep the higher number. Rally offers 2. */
export const RALLY_TEMP_STAMINA = 2;
/** `flags.<module>.<RALLY_EDGE_FLAG>` marks the one-shot edge effect so it can be found and cleared. */
export const RALLY_EDGE_FLAG = "rallyEdge";
export const RALLY_EDGE_ID = "gwRallyEdge00000";

/**
 * The negative conditions Rally can lift, **worst first**.
 *
 * Locked 0.3.134. Exactly one is removed — the worst one present — and the list is negative
 * conditions only: Hidden, cover, a Marked edge and every other beneficial state are untouched, on
 * purpose. A Rally that strips your own Conceal is a Rally nobody uses.
 */
export const RALLY_CONDITIONS = Object.freeze([
  "dazed", "restrained", "frightened", "weakened", "bleeding", "slowed", "taunted", "grabbed", "prone",
]);

/** The five characteristics the one-shot edge touches, so it applies to any power roll. */
export const EDGE_CHARACTERISTICS = Object.freeze(["might", "agility", "reason", "intuition", "presence"]);

/**
 * The single condition Rally lifts from this set, or `null` when none of them is present.
 * @param {Iterable<string>} statuses  The actor's current status ids.
 * @returns {string|null}
 */
export function worstCondition(statuses) {
  const present = new Set([...(statuses ?? [])].map(s => String(s).toLowerCase()));
  return RALLY_CONDITIONS.find(condition => present.has(condition)) ?? null;
}

/**
 * Temporary Stamina after a Rally. Draw Steel's rule is that temp Stamina does not stack: you keep
 * whichever is higher, so a hero already sitting on 5 temp keeps 5 rather than dropping to 2.
 * @param {number} current
 * @param {number} [offered]
 * @returns {number}
 */
export function rallyTempStamina(current, offered = RALLY_TEMP_STAMINA) {
  const now = Number(current) || 0;
  return Math.max(now, Number(offered) || 0);
}

/**
 * Is this token in the Rally?
 *
 * Friendly disposition, within `radius` squares of the Commander, and the Commander themself always
 * counts. Distance is in **squares** — grid units — not pixels, so it reads the same on any map.
 *
 * @param {object} spec
 * @param {{x: number, y: number, width?: number, height?: number, disposition?: number}} spec.token
 * @param {{x: number, y: number, width?: number, height?: number}} spec.origin  The Commander's token.
 * @param {number} spec.gridSize   Pixels per square.
 * @param {number} [spec.radius]
 * @param {boolean} [spec.isSelf]
 * @param {number} [spec.friendly]  The disposition value that counts as friendly.
 * @returns {boolean}
 */
export function inRally({ token, origin, gridSize, radius = RALLY_BURST, isSelf = false, friendly = 1 }) {
  if (isSelf) return true;                                     // the Commander is always in their own Rally
  if (!token || !origin || !(gridSize > 0)) return false;
  if (Number(token.disposition) !== Number(friendly)) return false;
  const centre = doc => ({
    x: Number(doc.x) + (((Number(doc.width) || 1) * gridSize) / 2),
    y: Number(doc.y) + (((Number(doc.height) || 1) * gridSize) / 2),
  });
  const a = centre(token);
  const b = centre(origin);
  // Draw Steel measures distance as the longer of the two axes (Chebyshev), not as the hypotenuse.
  const squares = Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)) / gridSize;
  return squares <= radius;
}

/**
 * One row of the summary card, as plain data. Rendered by {@link rallyCardHtml}.
 * @typedef {{name: string, condition: string|null, recovery: string, healed: number,
 *            temp: number, tempKept: boolean, edge: boolean}} RallyRow
 */

/* ============================================ Foundry registration */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const esc = value => foundry.utils.escapeHTML(String(value ?? ""));

/** The one-shot edge Active Effect. Five changes so it fires on whatever the hero rolls next. */
function edgeEffectData() {
  return {
    _id: RALLY_EDGE_ID,
    name: loc("Edge.Name"),
    img: "icons/magic/control/buff-flight-wings-runes-blue-white.webp",
    origin: null,
    disabled: false,
    transfer: false,
    changes: EDGE_CHARACTERISTICS.map(characteristic => ({
      key: `system.characteristics.${characteristic}.edges`,
      mode: CONST.ACTIVE_EFFECT_MODES.ADD,
      value: "1",
      priority: 20,
    })),
    description: loc("Edge.Description"),
    flags: { [MODULE_ID]: { [RALLY_EDGE_FLAG]: true } },
  };
}

const hasRallyEdge = actor => !!actor?.effects?.get?.(RALLY_EDGE_ID);

/** Put the one-shot edge on one actor, replacing any it already has rather than stacking. */
async function grantRallyEdge(actor) {
  if (!actor?.isOwner) return false;
  if (hasRallyEdge(actor)) await actor.deleteEmbeddedDocuments("ActiveEffect", [RALLY_EDGE_ID]);
  await actor.createEmbeddedDocuments("ActiveEffect", [edgeEffectData()], { keepId: true });
  return true;
}

/** Lift the worst negative condition, and only that one. */
async function liftWorstCondition(actor) {
  const statuses = [...(actor?.statuses ?? [])];
  const worst = worstCondition(statuses);
  if (!worst) return null;
  // `toggleStatusEffect` is the supported route and it handles the token/actor split for us.
  await actor.toggleStatusEffect(worst, { active: false });
  return worst;
}

/** Raise temporary Stamina to at least 2 without ever lowering it. */
async function bumpTempStamina(actor) {
  const current = Number(actor?.system?.stamina?.temporary) || 0;
  const next = rallyTempStamina(current);
  if (next === current) return { temp: current, kept: true };
  await actor.update({ "system.stamina.temporary": next });
  return { temp: next, kept: false };
}

/** Everything the Rally touches: friendly tokens within 5 squares, the Commander included. */
function rallyTargets(commander) {
  const origin = commander?.getActiveTokens?.()?.[0]?.document ?? null;
  const gridSize = canvas?.grid?.size ?? 0;
  const out = new Map();
  if (commander) out.set(commander.id, commander);
  if (!origin || !gridSize || !canvas?.scene) return [...out.values()];
  for (const token of canvas.scene.tokens) {
    const actor = token.actor;
    if (!actor || out.has(actor.id)) continue;
    if (!inRally({
      token, origin, gridSize,
      isSelf: token.id === origin.id,
      friendly: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
    })) continue;
    out.set(actor.id, actor);
  }
  return [...out.values()];
}

/** The one card the table reads afterwards. */
function rallyCardHtml(commanderName, rows) {
  const body = rows.map(row => {
    const bits = [
      row.condition ? loc("Row.Condition", { condition: esc(conditionLabel(row.condition)) }) : loc("Row.NoCondition"),
      loc(`Row.Recovery.${row.recovery}`, { healed: row.healed }),
      row.tempKept ? loc("Row.TempKept", { temp: row.temp }) : loc("Row.Temp", { temp: row.temp }),
      row.edge ? loc("Row.Edge") : "",
    ].filter(Boolean);
    return `<li><strong>${esc(row.name)}</strong> — ${bits.join(" · ")}</li>`;
  }).join("");
  return `<div class="ghostwire-rally"><p><strong>${esc(loc("Card.Title", { name: commanderName }))}</strong></p><ul>${body}</ul></div>`;
}

const conditionLabel = condition => {
  const key = `DRAW_STEEL.ActiveEffect.Conditions.${condition.charAt(0).toUpperCase()}${condition.slice(1)}.name`;
  return game.i18n.has(key) ? game.i18n.localize(key) : condition;
};

/**
 * Resolve one Rally the Crew.
 * @param {Actor} commander
 * @returns {Promise<RallyRow[]>}
 */
export async function resolveRally(commander) {
  const actors = rallyTargets(commander);
  const rows = [];
  for (const actor of actors) {
    const condition = actor.isOwner ? await liftWorstCondition(actor) : null;
    const recovery = await requestRecovery(actor, {
      title: loc("Prompt.Title"),
      question: loc("Prompt.Question", { name: actor.name }),
    });
    const temp = actor.isOwner ? await bumpTempStamina(actor) : { temp: Number(actor.system?.stamina?.temporary) || 0, kept: true };
    const edge = actor.isOwner ? await grantRallyEdge(actor) : false;
    rows.push({
      name: actor.name,
      condition,
      recovery: recovery.outcome,
      healed: recovery.healed,
      temp: temp.temp,
      tempKept: temp.kept,
      edge,
    });
  }
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: commander }),
    content: rallyCardHtml(commander?.name ?? "", rows),
    flags: { [MODULE_ID]: { rally: { rows: rows.map(row => ({ ...row })) } } },
  });
  return rows;
}

/** Resolve one Lay On Hands: ask the target's owner, then say what happened. */
export async function resolveLayOnHands(priest, targets) {
  const rows = [];
  for (const actor of targets) {
    const recovery = await requestRecovery(actor, {
      title: loc("Hands.Title"),
      question: loc("Hands.Question", { name: actor.name }),
    });
    rows.push({ name: actor.name, recovery: recovery.outcome, healed: recovery.healed });
  }
  if (!rows.length) return rows;
  const body = rows.map(row => `<li><strong>${esc(row.name)}</strong> — ${loc(`Row.Recovery.${row.recovery}`, { healed: row.healed })}</li>`).join("");
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: priest }),
    content: `<div class="ghostwire-rally"><p><strong>${esc(loc("Hands.Card", { name: priest?.name ?? "" }))}</strong></p><ul>${body}</ul></div>`,
    flags: { [MODULE_ID]: { layOnHands: { rows } } },
  });
  return rows;
}

/** Everything the caster had targeted when they hit the button. */
const targetActors = () => [...(game.user?.targets ?? [])].map(token => token.actor).filter(Boolean);

function patchSupportCards() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? globalThis.ds?.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; Rally the Crew and Lay On Hands are unwired`);
    return;
  }
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    const dsid = this.parent?.system?._dsid ?? "";
    if ((dsid !== RALLY_DSID) && (dsid !== LAY_ON_HANDS_DSID)) {
      return use.call(this, config, dialogOptions, messageOptions);
    }
    // Targets are read *before* the roll, because using the ability clears the target set.
    const targets = targetActors();
    // The card fires first — including its SFX, which Rally keeps unchanged (`command-rally`).
    const message = await use.call(this, config, dialogOptions, messageOptions);
    try {
      if (dsid === RALLY_DSID) await resolveRally(this.actor);
      else await resolveLayOnHands(this.actor, targets.length ? targets : [this.actor]);
    } catch (error) {
      console.error(`${MODULE_ID} | ${dsid} automation failed`, error);
    }
    return message;
  };
}

export function registerRally() {
  patchSupportCards();

  // The edge is one-shot: the first power roll the hero makes eats it. `createChatMessage` is the
  // same signal scripts/sfx.mjs and scripts/hit-fx.mjs use — the system emits no roll hook.
  Hooks.on("createChatMessage", async (message, options, userId) => {
    if (userId !== game.user.id) return;
    const actor = message?.speaker?.actor ? game.actors.get(message.speaker.actor) : null;
    if (!actor?.isOwner || !hasRallyEdge(actor)) return;
    const parts = message?.system?.parts;
    const list = !parts ? [] : (Array.isArray(parts) ? parts : (parts.contents ?? Object.values(parts)));
    const rolled = list.some(part => (part?.type ?? part?.constructor?.TYPE) === "abilityResult");
    if (!rolled && !message.rolls?.length) return;
    await actor.deleteEmbeddedDocuments("ActiveEffect", [RALLY_EDGE_ID]);
    ui.notifications.info(loc("Edge.Spent", { name: actor.name }));
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      rally: { resolveRally, resolveLayOnHands, worstCondition, rallyTempStamina, inRally, RALLY_CONDITIONS },
    };
  }
  console.log(`${MODULE_ID} | Rally the Crew and Lay On Hands registered (shared recovery prompt)`);
}
