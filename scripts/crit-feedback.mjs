// F11 (0.3.116) — Critical Roll feedback: SFX, VFX, and a rule card.
//
// Detection point (verified against Draw Steel 1.1.2, not guessed). The system emits no "critical"
// hook, so the signal has to be read off the message:
//   * `PowerRoll#isCritical` is `dice[0].total >= options.criticalThreshold` (default 19), and
//     `PowerRoll#isNat20` is `dice[0].total >= 20`.
//   * An **ability** use pushes an unmodified `baseRoll` PowerRoll onto `messageData.rolls`, then
//     builds one `abilityResult` part per tier holding the per-target PowerRolls. Every one of those
//     shares `terms[0]` with the base roll (`roll.terms[0] = baseRoll.terms[0]`), so the natural
//     result is the same number wherever you read it.
//   * A **test** pushes its single PowerRoll onto `messageData.rolls` *and* into a `test` part.
// So: walk the message's own rolls plus every part's rolls, keep the power-roll-shaped ones, and
// take the best natural 2d10. One read covers both pipelines and patches nothing.
//
// The natural result is the whole rule: edges, banes, bonuses and a target's Cover/Conceal move the
// total but never make or unmake a critical, which is why this reads `dice[0]` and not `total`.
//
// Feedback rides B40's plumbing (scripts/sfx.mjs): the same `createChatMessage` fire point, the same
// `foundry.audio.AudioHelper` interface channel, the same `sfxVolume` client setting. B40's own
// ability-use sound still plays; a critical stacks a second, shorter sting on top of it.
//
// Everything above the "runtime" divider is Foundry-free so tools/crit-feedback-smoke.mjs can
// import and execute it under Node.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Crit";
const FLASH_MS = 900;

/** Draw Steel's default `PowerRoll.DEFAULT_OPTIONS.criticalThreshold`. */
export const CRIT_THRESHOLD = 19;

/** Already in-tree (B40 keyword map). No new audio binary ships for F11. */
export const CRIT_SOUND = `modules/${MODULE_ID}/assets/sfx/sword-crit.ogg`;

/**
 * The two roll pipelines that get crit feedback. A `project` part also exposes `isCritical`, but a
 * project critical is downtime bookkeeping rather than a table moment, so it is deliberately not
 * one of these and gets no sting, no flash and no card.
 */
export const CRIT_KINDS = Object.freeze(["ability", "test"]);

/** Rule-card bullet keys per kind. The prose lives in lang/en.json. */
export const CRIT_CARD_LINES = Object.freeze({
  ability: Object.freeze(["Tier3", "Action", "Stack"]),
  test: Object.freeze(["Tier3", "Reward"]),
});

export function ruleCardLines(kind) {
  return CRIT_CARD_LINES[kind] ?? [];
}

/**
 * Which pipeline produced this message, from its Draw Steel chat-part types.
 * @param {Iterable<string>} partTypes
 * @returns {"ability"|"test"|null}
 */
export function critKindFromParts(partTypes) {
  const types = new Set(partTypes ?? []);
  if (types.has("abilityResult") || types.has("abilityUse")) return "ability";
  if (types.has("test")) return "test";
  return null;
}

/**
 * Does this roll belong to the power-roll family?
 *
 * A message carries damage rolls alongside the power roll, and a 3d6 damage roll can total 19
 * without anything critical having happened. PowerRoll and ProjectRoll both expose `isCritical` and
 * both carry `options.criticalThreshold`; a DamageRoll carries neither.
 */
export function isPowerRollLike(roll) {
  if (!roll) return false;
  if (typeof roll.isCritical === "boolean") return true;
  if (Number.isFinite(Number(roll.options?.criticalThreshold))) return true;
  return /PowerRoll$/.test(roll.constructor?.name ?? "") || roll.class === "PowerRoll";
}

/**
 * The natural result of a roll's first dice term — the 2d10 (or 3d10kh2 / kl2) before any edge,
 * bane or bonus term. Returns null when the roll has no dice or has not been evaluated.
 */
export function naturalFromRoll(roll) {
  if (!roll) return null;
  const die = roll.dice?.[0] ?? roll.terms?.find?.(term => Array.isArray(term?.results));
  if (!die) return null;
  const total = Number(die.total);
  if (Number.isFinite(total)) return total;
  const results = Array.isArray(die.results) ? die.results : null;
  if (!results?.length) return null;
  return results
    .filter(result => result?.active !== false)
    .reduce((sum, result) => sum + (Number(result.result) || 0), 0);
}

/**
 * Is one natural result a critical?
 * @param {number|null} natural
 * @param {number} [threshold]
 * @returns {{critical: boolean, natural: number|null, nat20: boolean}}
 */
export function criticalFromNatural(natural, threshold = CRIT_THRESHOLD) {
  const value = Number(natural);
  if (!Number.isFinite(value)) return { critical: false, natural: null, nat20: false };
  return { critical: value >= threshold, natural: value, nat20: value >= 20 };
}

/** The best of several naturals — a multi-target attack shares one natural, but be safe. */
export function criticalFromNaturals(naturals, threshold = CRIT_THRESHOLD) {
  const values = [...(naturals ?? [])].map(Number).filter(Number.isFinite);
  if (!values.length) return { critical: false, natural: null, nat20: false };
  return criticalFromNatural(Math.max(...values), threshold);
}

/* -------------------------------------------- runtime */

/**
 * Every part on a Draw Steel `standard` message.
 *
 * `system.parts` is a CollectionField, so at runtime it is a ModelCollection (a Map), not a plain
 * object — the same trap B40 documents. Read `.contents` when present.
 */
function messageParts(message) {
  const parts = message?.system?.parts;
  if (!parts) return [];
  if (Array.isArray(parts)) return parts;
  return parts.contents ?? Object.values(parts);
}

function partType(part) {
  return part?.type ?? part?.constructor?.TYPE ?? "";
}

/** The message's own rolls plus every part's rolls, de-duplicated by identity. */
function powerRolls(message) {
  const out = [];
  const seen = new Set();
  const push = roll => {
    if (!roll || seen.has(roll) || !isPowerRollLike(roll)) return;
    seen.add(roll);
    out.push(roll);
  };
  for (const roll of message?.rolls ?? []) push(roll);
  for (const part of messageParts(message)) {
    for (const roll of part?.rolls ?? []) push(roll);
  }
  return out;
}

/**
 * Was this message a Critical Roll, and from which pipeline?
 * `critical` is true only for a recognised kind — see CRIT_KINDS.
 * @returns {{critical: boolean, natural: number|null, nat20: boolean, kind: "ability"|"test"|null}}
 */
export function messageCritical(message) {
  const kind = critKindFromParts(messageParts(message).map(partType));
  if (!kind) return { critical: false, natural: null, nat20: false, kind: null };
  const rolls = powerRolls(message);
  if (!rolls.length) return { critical: false, natural: null, nat20: false, kind };
  // A PowerRoll carries its own threshold in `options.criticalThreshold`; honour the highest one
  // present, so a Director who raises it on a roll does not get a false positive here.
  const thresholds = rolls.map(roll => Number(roll?.options?.criticalThreshold)).filter(Number.isFinite);
  const threshold = thresholds.length ? Math.max(...thresholds) : CRIT_THRESHOLD;
  return { ...criticalFromNaturals(rolls.map(naturalFromRoll), threshold), kind };
}

/* -------------------------------------------- settings */

function registerSettings() {
  game.settings.register(MODULE_ID, "critSfxEnabled", {
    name: `${L}.Settings.Sfx.Name`, hint: `${L}.Settings.Sfx.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
  });
  game.settings.register(MODULE_ID, "critSfxSrc", {
    name: `${L}.Settings.SfxSrc.Name`, hint: `${L}.Settings.SfxSrc.Hint`,
    scope: "world", config: true, type: String, default: CRIT_SOUND,
    filePicker: "audio",
  });
  game.settings.register(MODULE_ID, "critVfxEnabled", {
    name: `${L}.Settings.Vfx.Name`, hint: `${L}.Settings.Vfx.Hint`,
    scope: "client", config: true, type: Boolean, default: true,
  });
  game.settings.register(MODULE_ID, "critRuleCard", {
    name: `${L}.Settings.RuleCard.Name`, hint: `${L}.Settings.RuleCard.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
  });
  game.settings.register(MODULE_ID, "critRuleCardWhisper", {
    name: `${L}.Settings.RuleCardWhisper.Name`, hint: `${L}.Settings.RuleCardWhisper.Hint`,
    scope: "world", config: true, type: Boolean, default: false,
  });
}

/* -------------------------------------------- feedback */

/** B40's playback shape: interface channel, `sfxVolume`, pushed to the other clients. */
function playCrit() {
  if (!game.settings.get(MODULE_ID, "critSfxEnabled")) return;
  const src = String(game.settings.get(MODULE_ID, "critSfxSrc") ?? "").trim();
  if (!src) return;
  const volume = Number(game.settings.get(MODULE_ID, "sfxVolume") ?? 0.8);
  if (!(volume > 0)) return;
  return foundry.audio.AudioHelper.play({ src, volume, loop: false, channel: "interface" }, true);
}

/**
 * The VFX: a short vignette flash over the interface. Pure CSS, no dependency on a VFX module, and
 * every client decides for itself (the setting is client-scoped).
 */
function flash() {
  if (!game.settings.get(MODULE_ID, "critVfxEnabled")) return;
  const host = document.getElementById("interface") ?? document.body;
  if (!host) return;
  const el = document.createElement("div");
  el.className = "ghostwire-crit-flash";
  host.append(el);
  window.setTimeout(() => el.remove(), FLASH_MS);
}

/** The Ghostwire-facing rule card. A paraphrase — no licensed Draw Steel prose is reproduced. */
export function ruleCardContent(kind, { nat20 = false, natural = null } = {}) {
  const title = game.i18n.localize(`${L}.Card.Title`);
  const lead = game.i18n.format(`${L}.Card.Lead`, {
    natural: natural ?? "",
    kind: game.i18n.localize(`${L}.Kinds.${kind}`),
  });
  const body = ruleCardLines(kind).map(key => `<li>${game.i18n.localize(`${L}.Card.${kind}.${key}`)}</li>`).join("");
  const nat = nat20 ? `<p class="ghostwire-crit-nat20">${game.i18n.localize(`${L}.Card.Nat20`)}</p>` : "";
  return `<div class="ghostwire-crit-card"><h3>${title}</h3><p>${lead}</p><ul>${body}</ul>${nat}`
    + `<p class="hint">${game.i18n.localize(`${L}.Card.Natural`)}</p></div>`;
}

async function postRuleCard(message, hit) {
  if (!game.settings.get(MODULE_ID, "critRuleCard")) return;
  const whisper = game.settings.get(MODULE_ID, "critRuleCardWhisper")
    ? [...new Set([message.author?.id, ...game.users.filter(user => user.isGM).map(user => user.id)].filter(Boolean))]
    : [];
  return ChatMessage.create({
    speaker: message.speaker,
    content: ruleCardContent(hit.kind, hit),
    whisper,
    flags: { [MODULE_ID]: { critCard: true } },
  });
}

/* -------------------------------------------- registration */

export function registerCritFeedback() {
  registerSettings();

  // One client fires the sound and posts the card: the one whose roll created the message (B40's
  // rule). Set CONFIG.debug.ghostwireCrit = true in the console to trace detection.
  Hooks.on("createChatMessage", async (message, options, userId) => {
    if (userId !== game.user.id) return;
    if (message.getFlag?.(MODULE_ID, "critCard")) return;
    const hit = messageCritical(message);
    if (!hit.critical) return;
    if (CONFIG.debug?.ghostwireCrit) console.debug(`${MODULE_ID} | critical: natural ${hit.natural}, kind ${hit.kind}`);
    playCrit();
    await postRuleCard(message, hit);
  });

  // The VFX runs wherever the card is drawn, so everyone at the table sees it — but only for a
  // message that just arrived. Scrolling the log back must not re-flash the room.
  Hooks.on("renderChatMessageHTML", (message, html) => {
    if (message.getFlag?.(MODULE_ID, "critCard")) {
      html.classList?.add("ghostwire-crit-rulecard");
      return;
    }
    if (!messageCritical(message).critical) return;
    html.classList?.add("ghostwire-crit");
    if (message._ghostwireCritFlashed) return;
    message._ghostwireCritFlashed = true;
    if ((Date.now() - (message.timestamp ?? 0)) > 10_000) return;
    flash();
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      messageCritical,
      ruleCardContent,
      CRIT_THRESHOLD,
    };
  }
  console.log(`${MODULE_ID} | Critical Roll feedback registered (natural ${CRIT_THRESHOLD}+)`);
}
