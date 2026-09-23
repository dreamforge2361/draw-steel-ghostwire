// F11 — Critical Roll feedback and automation: SFX, VFX, a rule card, a chat badge, and the
// extra-main-action affordance.
//
// 0.3.117 (Michael lock 2026-09-23): Ghostwire Criticals ARE Draw Steel Criticals. A natural 19 or
// 20 is always read at **tier 3**, and a critical on a **main-action** ability hands the roller
// another main action on the same turn. Natural doubles are retired from RAW and mean nothing here.
//
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

/**
 * The tier a critical is always read at. Draw Steel's own `PowerRoll#product` already returns this
 * (`if (this.isCritical) return 3;`), so the system rolls tier-3 damage and builds a tier-3
 * `abilityResult` part on its own. Ghostwire does not re-roll damage behind it — it reads the tier
 * the system reported and says so out loud, and `criticalTierProblems` below is the tripwire for the
 * day that contract changes.
 */
export const CRIT_TIER = 3;

/** `system.type` of an ability that costs a main action — the one type that earns another one. */
export const MAIN_ACTION_TYPE = "main";

/**
 * Does this critical hand back a main action?
 * Only an **ability** used as a main action does. A test critical does not, a maneuver does not, and
 * a triggered or free action does not.
 * @param {object} options
 * @param {"ability"|"test"|null} options.kind
 * @param {string} [options.abilityType]  `ability.system.type`.
 * @returns {boolean}
 */
export function grantsExtraMainAction({ kind, abilityType } = {}) {
  return (kind === "ability") && (abilityType === MAIN_ACTION_TYPE);
}

/**
 * The tier a result should be read at once the critical is known.
 * @param {boolean} critical
 * @param {number|string|null} reportedTier  The tier the system put on the chat part.
 * @returns {number}
 */
export function criticalTier(critical, reportedTier) {
  if (critical) return CRIT_TIER;
  const n = Math.floor(Number(reportedTier));
  return Number.isFinite(n) ? Math.min(3, Math.max(1, n)) : 1;
}

/**
 * Ability-result tiers on a critical message that are NOT tier 3.
 *
 * Under Draw Steel 1.1.2 this is always empty: `AbilityModel#use` groups its per-target rolls by
 * `roll.product`, and `product` short-circuits to 3 for a critical, so the only part a critical can
 * produce is `tier3Result00000`. Keeping the check means a future system that stopped doing that
 * would announce itself on the table instead of quietly paying tier-1 damage on a natural 20.
 * @param {Iterable<{type?: string, tier?: number|string}>} parts
 * @returns {number[]} The offending tiers, in order.
 */
export function criticalTierProblems(parts) {
  const bad = [];
  for (const part of parts ?? []) {
    if ((part?.type ?? "") !== "abilityResult") continue;
    const tier = Math.floor(Number(part.tier));
    if (Number.isFinite(tier) && (tier !== CRIT_TIER)) bad.push(tier);
  }
  return bad;
}

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
  const parts = messageParts(message);
  const kind = critKindFromParts(parts.map(partType));
  if (!kind) return { critical: false, natural: null, nat20: false, kind: null, tier: null, tierProblems: [], abilityUuid: null };
  const rolls = powerRolls(message);
  const abilityUuid = parts.map(abilityUuidOf).find(Boolean) ?? null;
  if (!rolls.length) return { critical: false, natural: null, nat20: false, kind, tier: null, tierProblems: [], abilityUuid };
  // A PowerRoll carries its own threshold in `options.criticalThreshold`; honour the highest one
  // present, so a Director who raises it on a roll does not get a false positive here.
  const thresholds = rolls.map(roll => Number(roll?.options?.criticalThreshold)).filter(Number.isFinite);
  const threshold = thresholds.length ? Math.max(...thresholds) : CRIT_THRESHOLD;
  const hit = { ...criticalFromNaturals(rolls.map(naturalFromRoll), threshold), kind, abilityUuid };
  // The tier is the automation half of F11: a critical is read at tier 3 whatever the dice totalled,
  // and `criticalTierProblems` names any ability result the system did not already put there.
  const reported = parts.map(part => ({ type: partType(part), tier: part?.tier }));
  hit.tier = hit.critical ? CRIT_TIER : criticalTier(false, reported.find(p => p.type === "abilityResult")?.tier);
  hit.tierProblems = hit.critical ? criticalTierProblems(reported) : [];
  return hit;
}

/** The ability a message used, when it used one. */
function abilityUuidOf(part) {
  const type = partType(part);
  if ((type !== "abilityUse") && (type !== "abilityResult")) return null;
  return part?.abilityUuid ?? null;
}

/**
 * `ability.system.type` for a message, or "" when there is no resolvable ability.
 * Read synchronously: the ability is an Item the roller owns or a compendium document already in
 * the index, and the chat hook is not a place to await a pack load.
 */
export function messageAbilityType(message) {
  const uuid = messageCritical(message).abilityUuid;
  if (!uuid) return "";
  const item = fromUuidSync(uuid);
  return String(item?.system?.type ?? "");
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
export function ruleCardContent(kind, { nat20 = false, natural = null, extraMainAction = false, tierProblems = [] } = {}) {
  const title = game.i18n.localize(`${L}.Card.Title`);
  const lead = game.i18n.format(`${L}.Card.Lead`, {
    natural: natural ?? "",
    kind: game.i18n.localize(`${L}.Kinds.${kind}`),
  });
  const body = ruleCardLines(kind).map(key => `<li>${game.i18n.localize(`${L}.Card.${kind}.${key}`)}</li>`).join("");
  const nat = nat20 ? `<p class="ghostwire-crit-nat20">${game.i18n.localize(`${L}.Card.Nat20`)}</p>` : "";
  // The affordance: one button the roller presses when they take the main action the critical owes
  // them, so the rest of the table sees it happen instead of taking their word for the turn order.
  const extra = extraMainAction
    ? `<p class="ghostwire-crit-extra"><button type="button" data-ghostwire-crit-extra>`
      + `<i class="fa-solid fa-rotate-right"></i> ${game.i18n.localize(`${L}.Card.ExtraAction`)}</button></p>`
    : "";
  const warn = tierProblems.length
    ? `<p class="ghostwire-crit-warn">${game.i18n.format(`${L}.Card.TierWarning`, { tiers: tierProblems.join(", "), tier: CRIT_TIER })}</p>`
    : "";
  return `<div class="ghostwire-crit-card"><h3>${title}</h3><p>${lead}</p><ul>${body}</ul>${extra}${nat}${warn}`
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
    flags: { [MODULE_ID]: { critCard: true, extraMainAction: hit.extraMainAction } },
  });
}

/**
 * The Critical badge on the roll's own chat card.
 * Draw Steel already marks a critical power roll's dice tooltip with its `critical` CSS class; this
 * is the word, on the message header, where someone scanning the log can read it.
 */
function injectBadge(message, html, hit) {
  if (html.querySelector(".ghostwire-crit-badge")) return;
  const host = html.querySelector(".message-header") ?? html.querySelector(".message-content") ?? html;
  const badge = document.createElement("span");
  badge.className = "ghostwire-crit-badge";
  badge.textContent = game.i18n.format(`${L}.Badge`, { natural: hit.natural ?? "", tier: CRIT_TIER });
  badge.dataset.tooltip = game.i18n.localize(`${L}.BadgeHint`);
  host.prepend(badge);
}

/** Announce the extra main action the critical owed, from the card's own button. */
async function announceExtraMainAction(card) {
  const speaker = card?.speaker ?? ChatMessage.getSpeaker();
  return ChatMessage.create({
    speaker,
    content: `<p class="ghostwire-crit-extra-taken">${game.i18n.format(`${L}.Chat.ExtraTaken`, {
      name: foundry.utils.escapeHTML(speaker?.alias ?? game.user.name),
    })}</p>`,
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
    hit.extraMainAction = grantsExtraMainAction({ kind: hit.kind, abilityType: messageAbilityType(message) });
    if (CONFIG.debug?.ghostwireCrit) console.debug(`${MODULE_ID} | critical: natural ${hit.natural}, kind ${hit.kind}, tier ${hit.tier}`);
    // Draw Steel's own PowerRoll#product returns 3 for a critical, so the tier-3 damage and the
    // tier-3 ability result are already on the message. This only fires if that ever stops being true.
    if (hit.tierProblems.length) {
      console.warn(`${MODULE_ID} | critical reported tier ${hit.tierProblems.join(", ")} instead of ${CRIT_TIER}`);
    }
    playCrit();
    await postRuleCard(message, hit);
  });

  // The VFX runs wherever the card is drawn, so everyone at the table sees it — but only for a
  // message that just arrived. Scrolling the log back must not re-flash the room.
  Hooks.on("renderChatMessageHTML", (message, html) => {
    if (message.getFlag?.(MODULE_ID, "critCard")) {
      html.classList?.add("ghostwire-crit-rulecard");
      // The affordance button only belongs to the roller and the Director; everyone else reads it.
      const button = html.querySelector("[data-ghostwire-crit-extra]");
      if (button) {
        if (!game.user.isGM && (message.author?.id !== game.user.id)) button.disabled = true;
        else button.addEventListener("click", () => announceExtraMainAction(message), { once: true });
      }
      return;
    }
    const hit = messageCritical(message);
    if (!hit.critical) return;
    html.classList?.add("ghostwire-crit");
    injectBadge(message, html, hit);
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
      messageAbilityType,
      ruleCardContent,
      grantsExtraMainAction,
      criticalTier,
      criticalTierProblems,
      CRIT_THRESHOLD,
      CRIT_TIER,
    };
  }
  console.log(`${MODULE_ID} | Critical Roll feedback registered (natural ${CRIT_THRESHOLD}+ → tier ${CRIT_TIER})`);
}
