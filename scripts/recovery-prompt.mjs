// 0.3.134 (I/J) — "Spend an immediate recovery?", asked of the person who owns the character.
//
// Two cards need the same thing and neither had it: **Rally the Crew** says every ally in the burst
// "can spend a Recovery" and **Lay On Hands** says "the target can spend a Recovery", and in both
// cases the player whose character it is was never asked. The Director read the card out and
// somebody eventually clicked the recovery button on their own sheet, or nobody did.
//
// So: one helper, shared. It asks the **owner's** client, because `actor.system.spendRecovery()`
// needs a document the caller can update and because being asked is the point — a Rally that spends
// your last Recovery without asking is worse than a Rally that does nothing.
//
// Routing, in order:
//   1. the actor's owner is **this** client       → prompt here.
//   2. an owner is online somewhere else          → ask over the socket, wait for the answer.
//   3. no owner online                            → the active GM is asked instead.
//   4. no recoveries left                         → no dialog at all, just a line on the card.
//
// The socket op mirrors scripts/chrome-damage.mjs (`module.<id>` + an `op` discriminator), with a
// `requestId` added because this one needs a *reply*, not a fire-and-forget relay.

const MODULE_ID = "draw-steel-ghostwire";
const SOCKET = `module.${MODULE_ID}`;
const L = "GHOSTWIRE.RecoveryPrompt";
const ASK = "recoveryPrompt.ask";
const ANSWER = "recoveryPrompt.answer";
/** How long a requester waits for a client that may have wandered off. */
export const RECOVERY_PROMPT_TIMEOUT_MS = 60000;

/* -------------------------------------------- pure */

/**
 * Every outcome a prompt can have. Exported so the chat summary and the smoke use the same words.
 *
 *  * `spent`    — they said yes and a Recovery was spent.
 *  * `declined` — they said no, or closed the dialog.
 *  * `none`     — they had no Recoveries left; nobody was asked.
 *  * `timeout`  — the client never answered.
 *  * `invalid`  — not a hero, or no Recovery track at all (an NPC ally, a construct).
 */
export const RECOVERY_OUTCOMES = Object.freeze(["spent", "declined", "none", "timeout", "invalid"]);

/** Can this actor spend a Recovery at all, and how many has it got? */
export function recoveryState(actor) {
  const recoveries = actor?.system?.recoveries;
  if (!recoveries || !Number.isFinite(Number(recoveries.value))) return { ok: false, value: 0, heals: 0 };
  return {
    ok: Number(recoveries.value) > 0,
    value: Number(recoveries.value),
    heals: Number(recoveries.recoveryValue ?? 0),
  };
}

/**
 * Who should be asked about this actor.
 *
 * Returns a **user id**, or `null` for "nobody is online who can answer" — which the caller turns
 * into the GM fallback. A GM who also owns the character counts as the owner, not as the fallback.
 *
 * @param {object} actor
 * @param {Array<{id: string, active: boolean, isGM: boolean}>} users
 * @param {(userId: string) => boolean} isOwner  Ownership test, injected so this is testable.
 * @returns {{userId: string|null, viaGm: boolean}}
 */
export function askWho(actor, users, isOwner) {
  const active = [...(users ?? [])].filter(user => user?.active);
  const owner = active.find(user => !user.isGM && isOwner(user.id))
    ?? active.find(user => user.isGM && isOwner(user.id));
  if (owner) return { userId: owner.id, viaGm: false };
  const gm = active.filter(user => user.isGM).sort((a, b) => String(a.id).localeCompare(String(b.id)))[0];
  return { userId: gm?.id ?? null, viaGm: true };
}

/* -------------------------------------------- Foundry */

const loc = (key, data) => (data
  ? game.i18n.format(`${L}.${key}`, data)
  : game.i18n.localize(`${L}.${key}`));
const esc = value => foundry.utils.escapeHTML(String(value ?? ""));

const pending = new Map();

/** Show the dialog and, on yes, spend the Recovery. Runs on the client that owns the character. */
async function promptHere(actor, { title, question }) {
  const state = recoveryState(actor);
  if (!state.ok) {
    return { outcome: state.value === 0 && Number.isFinite(state.value) ? "none" : "invalid", healed: 0, left: state.value };
  }
  const confirmed = await foundry.applications.api.DialogV2.confirm({
    window: { title: title || loc("Title"), icon: "fa-solid fa-heart-pulse" },
    content: `<p>${esc(question || loc("Question", { name: actor.name }))}</p>`
      + `<p class="hint">${esc(loc("Hint", { value: state.heals, left: state.value }))}</p>`,
    rejectClose: false,
    modal: false,
  });
  if (!confirmed) return { outcome: "declined", healed: 0, left: state.value };
  await actor.system.spendRecovery();
  return { outcome: "spent", healed: state.heals, left: Math.max(0, state.value - 1) };
}

/**
 * Ask whoever owns this actor whether they want to spend a Recovery.
 *
 * Never throws and never blocks forever: an unanswered prompt resolves `timeout` after
 * {@link RECOVERY_PROMPT_TIMEOUT_MS} so a chat summary still gets written.
 *
 * @param {Actor} actor
 * @param {object} [options]
 * @param {string} [options.title]     Dialog title.
 * @param {string} [options.question]  The question itself.
 * @returns {Promise<{actor: Actor, name: string, outcome: string, healed: number, left: number, viaGm: boolean}>}
 */
export async function requestRecovery(actor, { title = "", question = "" } = {}) {
  const base = { actor, name: actor?.name ?? "", healed: 0, left: 0, viaGm: false };
  if (!actor?.system?.recoveries) return { ...base, outcome: "invalid" };

  const state = recoveryState(actor);
  // Rule: no Recoveries left means no dialog at all. Say so on the card instead of opening a box
  // whose only honest answer is "no".
  if (!state.ok) return { ...base, outcome: "none", left: state.value };

  const { userId, viaGm } = askWho(actor, game.users.contents, id => actor.testUserPermission(game.users.get(id), "OWNER"));
  if (!userId) return { ...base, outcome: "timeout", left: state.value };

  if (userId === game.user.id) {
    const result = await promptHere(actor, { title, question });
    return { ...base, ...result, viaGm };
  }

  const requestId = foundry.utils.randomID();
  const answer = new Promise(resolve => {
    const timer = setTimeout(() => {
      pending.delete(requestId);
      resolve({ outcome: "timeout", healed: 0, left: state.value });
    }, RECOVERY_PROMPT_TIMEOUT_MS);
    pending.set(requestId, payload => {
      clearTimeout(timer);
      pending.delete(requestId);
      resolve({ outcome: payload.outcome, healed: Number(payload.healed) || 0, left: Number(payload.left) || 0 });
    });
  });
  game.socket.emit(SOCKET, {
    op: ASK, requestId, userId, actorUuid: actor.uuid, title, question, from: game.user.id,
  });
  const result = await answer;
  return { ...base, ...result, viaGm };
}

/** Ask a whole list at once. Order is preserved; each answer is independent. */
export async function requestRecoveries(actors, options = {}) {
  return Promise.all([...actors].map(actor => requestRecovery(actor, options)));
}

async function onRecoverySocket(payload) {
  if (payload?.op === ANSWER) {
    pending.get(payload.requestId)?.(payload);
    return;
  }
  if (payload?.op !== ASK) return;
  if (payload.userId !== game.user.id) return;
  const actor = await fromUuid(payload.actorUuid).catch(() => null);
  const result = actor
    ? await promptHere(actor, { title: payload.title, question: payload.question })
    : { outcome: "invalid", healed: 0, left: 0 };
  game.socket.emit(SOCKET, { op: ANSWER, requestId: payload.requestId, ...result });
}

export function registerRecoveryPrompt() {
  Hooks.once("ready", () => game.socket.on(SOCKET, onRecoverySocket));
  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = { ...(module.api ?? {}), recoveryPrompt: { requestRecovery, requestRecoveries, recoveryState, askWho } };
  }
}
