// Hero / NPC token Has Vision (prototypeToken.sight.enabled).
// Michael lock 2026-09-20: every Ghostwire hero and NPC is created with Token Vision on.
// Scope is Actor type hero + npc. Skip infrastructure / machines: kind node, node-template,
// kiosk, vehicle, drone. Only flips `sight.enabled` — range / angle / visionMode stay as-is.
//
// Helpers below are Foundry-free so tools/token-vision-smoke.mjs can run them in Node.

export const MODULE_ID = "draw-steel-ghostwire";
export const TOKEN_VISION_SETTING = "tokenVisionMigrated";
export const SKIP_TOKEN_VISION_KINDS = Object.freeze(["node", "node-template", "kiosk", "vehicle", "drone"]);

const SKIP = new Set(SKIP_TOKEN_VISION_KINDS);

export function ghostwireKind(doc) {
  if (!doc) return null;
  if (typeof doc.getFlag === "function") {
    const flagged = doc.getFlag(MODULE_ID, "kind");
    if (flagged != null) return flagged;
  }
  const flags = doc.flags?.["draw-steel-ghostwire"] ?? doc.flags?.[MODULE_ID] ?? {};
  return flags.kind ?? null;
}

export function actorWantsTokenVision(actor) {
  const type = actor?.type;
  if (type !== "hero" && type !== "npc") return false;
  return !SKIP.has(ghostwireKind(actor));
}

export function needsSightEnabled(sight) {
  return sight?.enabled !== true;
}

/** Actor create / prototypeToken patch. Null when already on or out of scope. */
export function actorVisionUpdate(actor) {
  if (!actorWantsTokenVision(actor)) return null;
  if (!needsSightEnabled(actor.prototypeToken?.sight)) return null;
  return { "prototypeToken.sight.enabled": true };
}

/** Placed-token patch. `actor` is the Token's actor (may be null). */
export function tokenVisionUpdate(token, actor) {
  const subject = actor ?? token?.actor;
  if (!actorWantsTokenVision(subject)) return null;
  if (!needsSightEnabled(token?.sight)) return null;
  return { "sight.enabled": true };
}

export function registerTokenVision() {
  game.settings.register(MODULE_ID, TOKEN_VISION_SETTING, {
    scope: "world",
    config: false,
    type: Boolean,
    default: false,
  });

  // World create, import from pack, drag from compendium — keep existing range/angle.
  Hooks.on("preCreateActor", (actor, data, options, userId) => {
    if (userId !== game.user.id) return;
    const update = actorVisionUpdate({
      type: actor.type ?? data.type,
      flags: actor.flags ?? data.flags,
      prototypeToken: actor.prototypeToken ?? data.prototypeToken,
    });
    if (update) actor.updateSource(update);
  });

  // Dropping a token copies prototypeToken; force Has Vision if the actor is in scope.
  Hooks.on("preCreateToken", (token, data, options, userId) => {
    if (userId !== game.user.id) return;
    const actor = token.actor
      ?? game.actors?.get(token.actorId ?? data.actorId)
      ?? null;
    const update = tokenVisionUpdate({ sight: token.sight ?? data.sight }, actor);
    if (update) token.updateSource(update);
  });

  Hooks.once("ready", migrateTokenVision);
}

/** One-time GM pass: existing world heroes/NPCs + placed tokens with vision still off. */
export async function migrateTokenVision() {
  if (!game.user.isGM) return;
  if (game.settings.get(MODULE_ID, TOKEN_VISION_SETTING)) return;

  let actors = 0;
  let tokens = 0;
  for (const actor of game.actors) {
    const update = actorVisionUpdate(actor);
    if (!update) continue;
    await actor.update(update);
    actors += 1;
  }
  for (const scene of game.scenes) {
    const updates = [];
    for (const token of scene.tokens) {
      const update = tokenVisionUpdate(token, token.actor);
      if (!update) continue;
      updates.push({ _id: token.id, ...update });
    }
    if (updates.length) {
      await scene.updateEmbeddedDocuments("Token", updates);
      tokens += updates.length;
    }
  }
  await game.settings.set(MODULE_ID, TOKEN_VISION_SETTING, true);
  if (actors || tokens) {
    console.log(`${MODULE_ID} | enabled token vision on ${actors} actor prototype(s) and ${tokens} placed token(s)`);
  }
}
