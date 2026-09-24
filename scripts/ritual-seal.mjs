// 0.3.95 — Ritual Seal artifacts (F8): what a sealed Working leaves behind so the table can see it is live.
//
// The Ritual Working applet (ritual-working.mjs → #onSeal) ends a Working with a Power Roll. Up to 0.3.94 that
// produced a chat line and nothing else: the Ward was "up" only in the Director's notes. This file turns a
// successful seal into a lasting **Ritual Effect** — one artifact per Formula family, every one of them carrying
// the same `flags.draw-steel-ghostwire.ritualEffect` block so the Director can find, read and clear it later.
//
// Three locks shape this file:
//   1. A hung seal leaves nothing. Tier 1 (low) is the Director's to hold (`22`, Sealing); only middle and high
//      make an artifact. Everything downstream reads `sealSucceeded`.
//   2. The family on the Formula (`flags.…ritual.family`) picks the artifact, not the rite's name. One Ward card
//      working means every Ward card works — no per-rite code.
//   3. Resource firewall, unchanged: a seal artifact never spends Essence, Conviction or Resonance, and never
//      touches ¥. The only wealth path in the ritual stack stays Pay Components.
//
// Family → artifact:
//   Ward / Threshold  non-combat scene marker Actor + Token on the active Scene, beside the Ritual Leader
//   Calling           the existing summons path (veil-summons.mjs) when the card names a template; otherwise the
//                     Ritual Effect rides the Leader and the Director places the called thing by hand
//   Artifice          a linked effect Item on the Leader — the enchanted thing the Working made
//   Reach             an Active Effect on the Leader plus the chat chip; no scene token
//   Unmaking / Other  chat confirmation only
//
// Helpers above the Foundry section are Foundry-free so tools/ritual-seal-smoke.mjs can check the routing in Node.

export const MODULE_ID = "draw-steel-ghostwire";
/** Every artifact this file makes carries the Ritual Effect under this flag key. */
export const RITUAL_EFFECT_FLAG = "ritualEffect";
/** `flags.<module>.kind` on a scene-marker Actor, so the world scan can find markers without a folder. */
export const MARKER_KIND = "ritual-marker";
export const ARTIFACT_KINDS = Object.freeze(["marker", "summon", "item", "effect", "chat"]);
export const SEAL_FAMILIES = Object.freeze(["ward", "threshold", "calling", "artifice", "reach", "unmaking", "other"]);

/** The locked family → artifact table. Anything unrecognised falls to `other` (chat only) rather than guessing. */
export const FAMILY_ARTIFACT = Object.freeze({
  ward: "marker",
  threshold: "marker",
  calling: "summon",
  artifice: "item",
  reach: "effect",
  unmaking: "chat",
  other: "chat",
});

export const MARKER_ART = `modules/${MODULE_ID}/assets/tokens/summons/sprite-ward.webp`;
export const ARTIFICE_ART = "icons/svg/aura.svg";
export const REACH_ART = "icons/svg/daze.svg";

const L = "GHOSTWIRE.RitualSeal";

/* -------------------------------------------- pure routing */

/** `"Ward"` / `" threshold "` / `null` → a key in `SEAL_FAMILIES`; anything unknown → `"other"`. */
export function familyKey(family) {
  const key = String(family ?? "").trim().toLowerCase();
  return SEAL_FAMILIES.includes(key) ? key : "other";
}

/** Which artifact a family leaves behind. One of `ARTIFACT_KINDS`. */
export const artifactForFamily = family => FAMILY_ARTIFACT[familyKey(family)];

/** True when this family drops a token on the Scene (Ward and Threshold). */
export const placesMarker = family => artifactForFamily(family) === "marker";

/**
 * A seal only leaves something behind on middle (2) or high (3).
 * Tier 1 is a hung ritual — the Director holds it, and nothing lasting is made.
 */
export function sealSucceeded(tier) {
  const t = Number(tier);
  return (t === 2) || (t === 3);
}

/** low / middle / high for a tier, or `""` when the seal has not been rolled. */
export const outcomeKeyFor = tier => (["low", "middle", "high"][Number(tier) - 1] ?? "");

/** The lang key holding the short scope line for a family. */
export const scopeKey = family => `Scope.${familyKey(family)}`;

/**
 * The duration a card prints, when it prints one. No shipped Formula carries `duration` yet, so this is null
 * almost everywhere — the Ritual Effect then reads "until broken or dispelled" and the Director rules upkeep.
 */
export function ritualDurationText(ritual) {
  const text = String(ritual?.duration ?? ritual?.expires ?? "").trim();
  return text || null;
}

/** The summon template a Calling card names, or null when no template is wired to it yet. */
export function callingTemplateDsid(ritual) {
  const dsid = String(ritual?.summonDsid ?? ritual?.summon ?? "").trim();
  return dsid || null;
}

function clampMagnitude(value) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return 1;
  return Math.min(5, Math.max(1, n));
}

/**
 * The Ritual Effect block stamped on every artifact.
 * Same shape whatever the family, so one Director scan reads them all.
 *
 * @returns {{workingId: string|null, workingName: string, formulaUuid: string|null, family: string,
 *            familyKey: string, magnitude: number, leaderUuid: string|null, leaderName: string,
 *            sealedAt: string, expires: string|null, scope: string, sealTier: number|null,
 *            outcomeKey: string, artifact: string}}
 */
export function ritualEffectData({
  workingId = null,
  workingName = "",
  formulaUuid = null,
  family = "",
  magnitude = 1,
  leaderUuid = null,
  leaderName = "",
  sealedAt = null,
  expires = null,
  scope = "",
  sealTier = null,
  outcomeKey = "",
} = {}) {
  const tier = [1, 2, 3].includes(Number(sealTier)) ? Number(sealTier) : null;
  return {
    workingId: workingId ? String(workingId) : null,
    workingName: String(workingName ?? ""),
    formulaUuid: formulaUuid ? String(formulaUuid) : null,
    family: String(family ?? ""),
    familyKey: familyKey(family),
    magnitude: clampMagnitude(magnitude),
    leaderUuid: leaderUuid ? String(leaderUuid) : null,
    leaderName: String(leaderName ?? ""),
    sealedAt: sealedAt ? String(sealedAt) : new Date().toISOString(),
    expires: expires ? String(expires) : null,
    scope: String(scope ?? ""),
    sealTier: tier,
    outcomeKey: outcomeKeyFor(tier) || String(outcomeKey ?? ""),
    artifact: artifactForFamily(family),
  };
}

/** The Ritual Effect block on any document, or null. */
export function ritualEffectOf(doc) {
  const payload = doc?.flags?.[MODULE_ID]?.[RITUAL_EFFECT_FLAG];
  return (payload && typeof payload === "object") ? payload : null;
}

/** True when this document is the artifact of that Working. */
export function isSealArtifactOf(doc, workingId) {
  const payload = ritualEffectOf(doc);
  return !!payload && !!workingId && (payload.workingId === String(workingId));
}

/* -------------------------------------------- Foundry helpers */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const esc = value => foundry.utils.escapeHTML(String(value ?? ""));
const familyLabel = family => loc(`Family.${familyKey(family)}`);

/** The short scope line a family prints on its artifact ("this room and its thresholds"). */
export const scopeText = (family, magnitude) => loc(scopeKey(family), { magnitude: clampMagnitude(magnitude) });

/** `Ward: Ward the Room` — the family, then the Working. */
export const artifactName = payload => loc("ArtifactName", {
  family: familyLabel(payload?.familyKey ?? payload?.family),
  working: payload?.workingName || loc("UnknownWorking"),
});

/** The Working / Magnitude / Leader / Scope / Expires block every artifact carries in its description. */
export function ritualEffectHtml(payload) {
  const rows = [
    [loc("Fields.Working"), payload?.workingName || loc("UnknownWorking")],
    [loc("Fields.Family"), familyLabel(payload?.familyKey ?? payload?.family)],
    [loc("Fields.Magnitude"), String(payload?.magnitude ?? 1)],
    [loc("Fields.Leader"), payload?.leaderName || "—"],
    [loc("Fields.Scope"), payload?.scope || "—"],
    [loc("Fields.Expires"), payload?.expires || loc("Expires.None")],
    [loc("Fields.Sealed"), loc(`Outcome.${payload?.outcomeKey || "middle"}`)],
  ];
  return `<div class="ghostwire-ritual-effect"><ul>${
    rows.map(([key, value]) => `<li><strong>${esc(key)}</strong> ${esc(value)}</li>`).join("")
  }</ul></div>`;
}

async function markerFolder() {
  const existing = game.folders.find(f => (f.type === "Actor") && f.getFlag(MODULE_ID, "ritualEffects"));
  if (existing) return existing;
  return Folder.create({
    name: loc("FolderName"),
    type: "Actor",
    flags: { [MODULE_ID]: { ritualEffects: true } },
  });
}

/** The Leader's players see their own Working's marker; nobody else gets a handle on it. */
function artifactOwnership(leader) {
  const ownership = { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE };
  for (const [userId, level] of Object.entries(leader?.ownership ?? {})) {
    if ((userId !== "default") && (level >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)) {
      ownership[userId] = CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
    }
  }
  return ownership;
}

/** One grid square to the Leader's right, or the middle of the view when the Leader has no token here. */
function markerPlacement(leader) {
  const grid = canvas?.grid?.size ?? 100;
  const token = leader?.getActiveTokens?.()?.[0]?.document ?? null;
  if (token) return { x: token.x + (Math.max(Number(token.width) || 1, 1) * grid), y: token.y };
  const pivot = canvas?.stage?.pivot ?? { x: 0, y: 0 };
  return { x: Math.round((pivot.x ?? 0) / grid) * grid, y: Math.round((pivot.y ?? 0) / grid) * grid };
}

/* -------------------------------------------- the artifacts */

/**
 * Ward / Threshold: a lightweight neutral NPC Actor stamped like a summon, with its Token on the active Scene.
 * `system.combat.turns = 0` — it is scenery with a name, not a combatant, and nothing adds it to the tracker.
 */
async function placeSceneMarker(leader, payload) {
  if (!canvas?.scene) return { ok: false, kind: "chat", reason: "no-scene", uuid: null };
  if (!game.user.can("ACTOR_CREATE") || !game.user.can("TOKEN_CREATE")) {
    return { ok: false, kind: "chat", reason: "no-permission", uuid: null };
  }
  const name = artifactName(payload);
  const actor = await Actor.create({
    name,
    type: "npc",
    img: MARKER_ART,
    folder: (await markerFolder())?.id ?? null,
    ownership: artifactOwnership(leader),
    system: {
      stamina: { value: 1, max: 1, temporary: 0 },
      combat: { turns: 0, stability: 0, size: { value: 1, letter: "M" } },
      movement: { value: 0, types: ["walk"], hover: false, disengage: 0 },
      biography: { value: ritualEffectHtml(payload), director: "" },
      monster: { freeStrike: 0, keywords: [], level: 1, role: "", organization: "" },
    },
    prototypeToken: {
      name,
      actorLink: true,
      lockRotation: true,
      alpha: 0.85,
      disposition: CONST.TOKEN_DISPOSITIONS.NEUTRAL,
      displayName: CONST.TOKEN_DISPLAY_MODES.HOVER,
      displayBars: CONST.TOKEN_DISPLAY_MODES.NONE,
      sight: { enabled: false },
      texture: { src: MARKER_ART },
    },
    flags: { [MODULE_ID]: { kind: MARKER_KIND, [RITUAL_EFFECT_FLAG]: payload } },
  });
  if (!actor) return { ok: false, kind: "chat", reason: "no-actor", uuid: null };

  const tokenDocument = await actor.getTokenDocument({ ...markerPlacement(leader), actorLink: true });
  const [token] = await canvas.scene.createEmbeddedDocuments("Token", [tokenDocument.toObject()]);
  return { ok: true, kind: "marker", uuid: actor.uuid, tokenUuid: token?.uuid ?? null, name, scene: canvas.scene.name };
}

/**
 * Calling: the existing summons path, when the card names a template.
 *
 * 0.3.133 (E): **every** shipped Calling Formula now names one. `ritual.summonDsid` is set at the source —
 * `CALLING_SUMMON` in tools/ritual-formulas-to-items.mjs — so regenerating the Formula Items from
 * docs/raw/22-the-veil.md keeps it, and `templateFor` in veil-summons.mjs resolves it against the Summons &
 * Machines pack and then the bestiary. The `no-template` fallback below is what a hand-made or third-party
 * Formula gets, not what the shipped cards get.
 */
async function callSummon(leader, payload, ritual) {
  const dsid = callingTemplateDsid(ritual);
  if (!dsid) return stampLeaderEffect(leader, payload, { kind: "summon", reason: "no-template" });
  const { summonVeil } = await import("./veil-summons.mjs");
  const summoned = await summonVeil(leader, { dsid, sourceAbility: `ritual:${payload.workingId ?? ""}` });
  if (!summoned) return stampLeaderEffect(leader, payload, { kind: "summon", reason: "no-summon" });
  await summoned.update({ [`flags.${MODULE_ID}.${RITUAL_EFFECT_FLAG}`]: payload });
  return { ok: true, kind: "summon", uuid: summoned.uuid, name: summoned.name };
}

/** Artifice: the enchanted thing is the artifact — a linked effect Item on the Leader carrying the block. */
async function stampArtificeItem(leader, payload) {
  if (!leader?.isOwner && !game.user.isGM) return { ok: false, kind: "chat", reason: "no-permission", uuid: null };
  const name = artifactName(payload);
  const [created] = await leader.createEmbeddedDocuments("Item", [{
    name,
    type: "treasure",
    img: ARTIFICE_ART,
    system: {
      description: { value: ritualEffectHtml(payload), director: "" },
      kind: "other",
      category: "trinket",
      echelon: 1,
      quantity: 1,
    },
    flags: { [MODULE_ID]: { kind: MARKER_KIND, [RITUAL_EFFECT_FLAG]: payload } },
  }]);
  if (!created) return { ok: false, kind: "chat", reason: "no-item", uuid: null };
  return { ok: true, kind: "item", uuid: created.uuid, name: created.name };
}

/** Reach: an Active Effect on the Leader — a visible chip on the sheet, no Scene token, no mechanical change. */
async function stampReachEffect(leader, payload) {
  return stampLeaderEffect(leader, payload, { kind: "effect" });
}

/** The shared Active-Effect stamp: Reach uses it outright, Calling falls back to it when no template is wired. */
async function stampLeaderEffect(leader, payload, { kind = "effect", reason = null } = {}) {
  if (!leader?.isOwner && !game.user.isGM) return { ok: false, kind: "chat", reason: "no-permission", uuid: null };
  const name = artifactName(payload);
  const [created] = await leader.createEmbeddedDocuments("ActiveEffect", [{
    name,
    img: REACH_ART,
    description: ritualEffectHtml(payload),
    changes: [],
    transfer: false,
    flags: { [MODULE_ID]: { kind: MARKER_KIND, [RITUAL_EFFECT_FLAG]: payload } },
  }]);
  if (!created) return { ok: false, kind: "chat", reason: reason ?? "no-effect", uuid: null };
  return { ok: true, kind, uuid: created.uuid, name, reason };
}

/* -------------------------------------------- chat */

/** Which chat line a result prints. Pure so the smoke can walk every branch without a world. */
export function sealCardKey({ ok, kind, reason } = {}) {
  if (!ok) {
    if (reason === "no-scene") return "Card.NoScene";
    if (reason === "no-permission") return "Card.NoPermission";
    return "Card.Chat";
  }
  if ((kind === "summon") && (reason === "no-template")) return "Card.SummonPending";
  return { marker: "Card.Marker", summon: "Card.Summon", item: "Card.Item", effect: "Card.Effect" }[kind] ?? "Card.Chat";
}

async function postSealCard(leader, payload, result) {
  const line = loc(sealCardKey(result), {
    working: esc(payload.workingName || loc("UnknownWorking")),
    leader: esc(payload.leaderName),
    scene: esc(result.scene ?? canvas?.scene?.name ?? ""),
    artifact: esc(result.name ?? artifactName(payload)),
  });
  const content = `
      <div class="ghostwire-ritual-card ghostwire-ritual-seal family-${payload.familyKey}">
        <header><i class="fa-solid fa-hexagon-nodes"></i> <span>${esc(loc("ChatTitle"))}</span></header>
        <p>${line}</p>
        ${ritualEffectHtml(payload)}
      </div>`;
  return ChatMessage.implementation.create({
    speaker: ChatMessage.implementation.getSpeaker({ actor: leader }),
    content,
  });
}

/* -------------------------------------------- entry points */

/**
 * Make the Ritual Effect for a Working that just sealed. Called from the applet's #onSeal.
 * A hung or unrolled seal makes nothing and posts nothing — the applet's own Sealed card already said so.
 *
 * @param {Actor} leader              The Ritual Leader.
 * @param {object} working            The Working record (ritual-working.mjs shape).
 * @param {object} [options]
 * @param {object} [options.ritual]   The Formula's `flags.<module>.ritual` block.
 * @param {number} [options.tier]     The seal tier, when it is not yet on the record.
 * @returns {Promise<{ok: boolean, kind: string, uuid: string|null, payload: object|null, reason: string|null}>}
 */
export async function applySealArtifact(leader, working, { ritual = null, tier = null } = {}) {
  const sealTier = tier ?? working?.sealTier ?? null;
  if (!sealSucceeded(sealTier)) return { ok: false, kind: "none", uuid: null, payload: null, reason: "hung" };
  if (!leader) return { ok: false, kind: "none", uuid: null, payload: null, reason: "no-leader" };

  const family = ritual?.family || working?.family || "";
  const payload = ritualEffectData({
    workingId: working?.id ?? null,
    workingName: working?.formulaName ?? "",
    formulaUuid: working?.formulaUuid ?? null,
    family,
    magnitude: working?.magnitude ?? 1,
    leaderUuid: leader.uuid,
    leaderName: leader.name,
    expires: ritualDurationText(ritual),
    scope: scopeText(family, working?.magnitude ?? 1),
    sealTier,
  });

  let result;
  try {
    switch (payload.artifact) {
      case "marker": result = await placeSceneMarker(leader, payload); break;
      case "summon": result = await callSummon(leader, payload, ritual); break;
      case "item": result = await stampArtificeItem(leader, payload); break;
      case "effect": result = await stampReachEffect(leader, payload); break;
      default: result = { ok: true, kind: "chat", uuid: null, reason: null };
    }
  } catch (error) {
    console.error(`${MODULE_ID} | Ritual Seal: ${payload.artifact} artifact failed`, error);
    result = { ok: false, kind: "chat", uuid: null, reason: "error" };
  }

  await postSealCard(leader, payload, result);
  if (!result.ok && result.reason) ui.notifications.warn(loc(sealCardKey(result), { working: payload.workingName }));
  return { ...result, payload, reason: result.reason ?? null };
}

/**
 * Every artifact of one Working: marker Actors in the world, Items and Active Effects on the Leader.
 * @returns {{actors: Actor[], items: Item[], effects: ActiveEffect[]}}
 */
export function sealArtifactsOf(leader, workingId) {
  if (!workingId) return { actors: [], items: [], effects: [] };
  return {
    actors: (game.actors ?? []).filter(actor => isSealArtifactOf(actor, workingId)),
    items: [...(leader?.items ?? [])].filter(item => isSealArtifactOf(item, workingId)),
    effects: [...(leader?.effects ?? [])].filter(effect => isSealArtifactOf(effect, workingId)),
  };
}

/**
 * Clear a Working's artifacts — the Director's seal reset and Abandon both land here, so unwinding a seal on the
 * panel does not leave a Ward token standing on a Scene nobody is looking at.
 * @returns {Promise<number>} how many documents went.
 */
export async function clearSealArtifacts(leader, workingId) {
  const { actors, items, effects } = sealArtifactsOf(leader, workingId);
  let cleared = 0;
  for (const actor of actors) {
    // A player abandoning their own Working may not be allowed to delete the world Actor the marker rides on;
    // say so once and leave it standing rather than throwing halfway through the unwind.
    if (!actor.canUserModify(game.user, "delete")) {
      ui.notifications.warn(loc("ClearBlocked", { artifact: actor.name }));
      continue;
    }
    for (const scene of game.scenes ?? []) {
      const ids = scene.tokens.filter(token => token.actorId === actor.id).map(token => token.id);
      if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
    }
    await actor.delete();
    cleared += 1;
  }
  if (items.length) {
    await leader.deleteEmbeddedDocuments("Item", items.map(item => item.id));
    cleared += items.length;
  }
  if (effects.length) {
    await leader.deleteEmbeddedDocuments("ActiveEffect", effects.map(effect => effect.id));
    cleared += effects.length;
  }
  return cleared;
}

/** Ship surface. Called from registerRitualWorking's ready hook alongside the applet's own API. */
export function registerRitualSeal() {
  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      applySealArtifact, clearSealArtifacts, sealArtifactsOf, ritualEffectOf, ritualEffectData,
      artifactForFamily, sealSucceeded,
    };
  }
  game.ghostwire = { ...(game.ghostwire ?? {}), applySealArtifact, clearSealArtifacts };
  console.log(`${MODULE_ID} | Ritual Seal: family → artifact routing registered (flags.${MODULE_ID}.${RITUAL_EFFECT_FLAG})`);
}
