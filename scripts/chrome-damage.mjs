// F12 — Chrome Damage: Suppressed / Damaged / Destroyed on chrome Items.
//
// Read first: docs/spikes/F12-CHROME-DAMAGE-INVENTORY.md and docs/raw/09-chrome-body-integrity.md
// § Suppress / Damage / Destroy. Before this pass nothing in packs wrote a chrome Item condition:
// Static/Zap are device + biofeedback fiction, Resonance Mending mends in prose only.
//
// Locks (Michael 2026-09-23):
//  1. Three states live on the chrome Item under `flags.<module>.chromeState` — *adjacent* to the
//     catalog flag `flags.<module>.chrome`, never inside it, so a pack SKU's grade/price/integrity
//     stay the immutable catalog row and the condition stays per-copy world data.
//  2. **Destroyed NEVER deletes the Item.** Deleting a chrome Item runs module.mjs's remove hook,
//     which refunds 75% of its Body Integrity — exactly the wrong outcome for an implant that was
//     blown apart. Destroyed = benefits off + Integrity locked out + Item stays on the sheet.
//     `chromeDeleteBlocked()` is what module.mjs and the preDelete guard below both consult.
//  3. Soft (bioware) is *harder* to EMP: one step milder. Salvage is more fragile: one step worse.
//  4. Suppressed is short (reboot / start of next turn). Damaged is a downtime Craft Project.
//     Destroyed is rare and expensive (repair-or-replace Project).
//
// Helpers above the "Foundry registration" divider are Foundry-free so
// tools/f12-chrome-damage-smoke.mjs can run them in Node.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.ChromeDamage";
const SOCKET = `module.${MODULE_ID}`;

/** The per-copy condition flag. Deliberately NOT inside `flags.<module>.chrome` (the catalog row). */
export const CHROME_STATE_FLAG = "chromeState";

/** Worst-to-best is rank order: a hit takes the max, a repair walks down. */
export const CHROME_STATES = Object.freeze(["ok", "suppressed", "damaged", "destroyed"]);
export const STATE_RANK = Object.freeze({ ok: 0, suppressed: 1, damaged: 2, destroyed: 3 });

/** Grade → ladder shift. Soft/bioware shrugs EMP; salvage cooks. */
export const GRADE_SHIFT = Object.freeze({ soft: -1, standard: 0, salvage: 1 });

/** Every chrome-strike program declares a tier1/tier2/tier3 ladder; these are the shipped three. */
export const STRIKE_LADDERS = Object.freeze({
  suppress: Object.freeze(["ok", "suppressed", "suppressed"]),
  damage: Object.freeze(["suppressed", "damaged", "damaged"]),
  destroy: Object.freeze(["damaged", "damaged", "destroyed"]),
});

/** Repair paths. `mend` = Resonance Mending 1 enhancement; `mendDeep` = its 2-Resonance line. */
export const REPAIR_PATHS = Object.freeze(["reboot", "mend", "mendDeep", "rite", "project"]);

/** Ability _dsids that mend chrome today (docs/raw/20-technomancer.md). */
export const MEND_ABILITIES = Object.freeze({
  "resonance-mending": "mendDeep",
  "machine-gods-rite": "rite",
  "resonance-pulse": null,
  "chrome-sunder": null,
});

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? doc?.flags?.["draw-steel-ghostwire"] ?? {};

/* -------------------------------------------- reading */

/** A chrome implant Item — the catalog flag is what install/remove keys on in module.mjs. */
export function isChromeItem(item) {
  return !!gwFlags(item).chrome;
}

export function chromeCatalog(item) {
  return gwFlags(item).chrome ?? null;
}

export function chromeGrade(item) {
  const grade = String(chromeCatalog(item)?.grade ?? "standard").toLowerCase();
  return Object.hasOwn(GRADE_SHIFT, grade) ? grade : "standard";
}

export function normalizeState(value) {
  const state = String(value ?? "ok").toLowerCase();
  return CHROME_STATES.includes(state) ? state : "ok";
}

/**
 * The condition on one chrome Item.
 * @returns {{state: string, rank: number, source: string, note: string, since: number|null}}
 */
export function readChromeState(item) {
  const raw = gwFlags(item)[CHROME_STATE_FLAG] ?? {};
  const state = normalizeState(typeof raw === "string" ? raw : raw.state);
  const since = Number(raw?.since);
  return {
    state,
    rank: STATE_RANK[state],
    source: String(raw?.source ?? ""),
    note: String(raw?.note ?? ""),
    since: Number.isFinite(since) ? since : null,
  };
}

export const isSuppressed = item => readChromeState(item).state === "suppressed";
export const isDamaged = item => readChromeState(item).state === "damaged";
export const isDestroyed = item => readChromeState(item).state === "destroyed";
/** Suppressed and Destroyed take the benefit offline; Damaged keeps it at a penalty. */
export const benefitsOffline = item => ["suppressed", "destroyed"].includes(readChromeState(item).state);

/* -------------------------------------------- the ladder */

export function stepState(state, steps) {
  const rank = STATE_RANK[normalizeState(state)] ?? 0;
  const next = Math.min(CHROME_STATES.length - 1, Math.max(0, rank + (Number(steps) || 0)));
  return CHROME_STATES[next];
}

/**
 * What a chrome strike does to one implant, before the current condition is folded in.
 * @param {{grade?: string, ladder?: string[]|string, tier?: number}} options
 *   `ladder` is a three-state array or a STRIKE_LADDERS key ("suppress" | "damage" | "destroy").
 * @returns {{state: string, shift: number, grade: string, tier: number, resisted: boolean}}
 */
export function resolveChromeHit({ grade = "standard", ladder = "suppress", tier = 2 } = {}) {
  const rungs = Array.isArray(ladder) ? ladder : STRIKE_LADDERS[ladder];
  if (!rungs?.length) return { state: "ok", shift: 0, grade: "standard", tier: 2, resisted: true };
  const t = Math.min(3, Math.max(1, Math.floor(Number(tier) || 1)));
  const g = Object.hasOwn(GRADE_SHIFT, grade) ? grade : "standard";
  const shift = GRADE_SHIFT[g];
  const base = normalizeState(rungs[t - 1]);
  const state = stepState(base, shift);
  return { state, shift, grade: g, tier: t, resisted: state === "ok" };
}

/** A hit never heals: the worse of current and incoming wins. */
export function escalateState(current, incoming) {
  const a = normalizeState(current);
  const b = normalizeState(incoming);
  return STATE_RANK[a] >= STATE_RANK[b] ? a : b;
}

/**
 * Full strike plan for one implant.
 * @returns {{from: string, to: string, changed: boolean, resisted: boolean, shift: number, tier: number, grade: string}}
 */
export function planChromeStrike({ current = "ok", grade = "standard", ladder = "suppress", tier = 2 } = {}) {
  const hit = resolveChromeHit({ grade, ladder, tier });
  const from = normalizeState(current);
  const to = escalateState(from, hit.state);
  return { from, to, changed: to !== from, resisted: hit.resisted, shift: hit.shift, tier: hit.tier, grade: hit.grade };
}

/**
 * What a repair path leaves behind.
 * reboot  — Suppressed only (free at the start of your next turn, or a Reboot maneuver).
 * mend    — Resonance Mending base/1-enhancement: clears Suppressed.
 * mendDeep— Resonance Mending 2 Resonance ("minimal function"): clears Damaged, Destroyed → Damaged.
 * rite    — Machine God's Rite (≥5 min ritual): clears everything.
 * project — downtime Craft Project (Wrench / Medic / Technomancer): clears everything.
 */
export function resolveRepair({ current = "ok", path = "reboot" } = {}) {
  const from = normalizeState(current);
  switch (path) {
    case "reboot":
    case "mend":
      return from === "suppressed" ? "ok" : from;
    case "mendDeep":
      if (from === "destroyed") return "damaged";
      return "ok";
    case "rite":
    case "project":
      return "ok";
    default:
      return from;
  }
}

export function planRepair({ current = "ok", path = "reboot" } = {}) {
  const from = normalizeState(current);
  const to = resolveRepair({ current: from, path });
  return { from, to, changed: to !== from, path };
}

/**
 * Downtime Craft Project recipe for a battle-damaged implant (docs/directors/f12-chrome-damage.md).
 * Damaged is a normal repair; Destroyed is repair-or-replace and costs roughly a re-buy.
 * @returns {{goal: number, cost: number, skills: string[], state: string}|null}
 */
export function repairProject(item, state = readChromeState(item).state) {
  const catalog = chromeCatalog(item);
  const current = normalizeState(state);
  if (!catalog || (current === "ok") || (current === "suppressed")) return null;
  const integrity = Math.max(1, Math.floor(Number(catalog.integrity) || 1));
  const price = Math.max(0, Math.floor(Number(catalog.price) || 0));
  const destroyed = current === "destroyed";
  return {
    state: current,
    goal: destroyed ? (60 + (integrity * 20)) : (30 + (integrity * 10)),
    cost: Math.floor(price * (destroyed ? 0.6 : 0.25)),
    skills: ["repair", "electronics", "medicine"],
  };
}

/**
 * Body Integrity that Destroyed implants hold hostage. Spent Integrity is *not* returned while an
 * implant is Destroyed — that is the whole point of never deleting it.
 */
export function lockedIntegrity(items = []) {
  let total = 0;
  for (const item of items) {
    if (!isChromeItem(item) || !isDestroyed(item)) continue;
    total += Math.max(0, Math.floor(Number(chromeCatalog(item)?.integrity) || 0));
  }
  return total;
}

/**
 * The no-delete lock. Destroyed chrome cannot be pulled off the sheet for a 75% Integrity refund;
 * the Director replaces it (which sets `ghostwireChromeReplace`, and refunds nothing).
 */
export function chromeDeleteBlocked(item, options = {}) {
  if (!isChromeItem(item) || !isDestroyed(item)) return false;
  return !options?.ghostwireChromeReplace;
}

/** module.mjs asks this before refunding Integrity on delete. A replaced wreck returns nothing. */
export function chromeRefundBlocked(item, options = {}) {
  return isChromeItem(item) && isDestroyed(item);
}

/** A chrome-strike program (matrix payload) declares its ladder under `flags.<module>.chromeStrike`. */
export function chromeStrikeOf(item) {
  const strike = gwFlags(item).chromeStrike;
  if (!strike) return null;
  const key = String(strike.ladder ?? strike.intent ?? "suppress");
  const ladder = Array.isArray(strike.tiers) ? strike.tiers.map(normalizeState) : STRIKE_LADDERS[key];
  if (!ladder?.length) return null;
  return {
    ladder: [...ladder],
    intent: key,
    wirelessOnly: strike.wirelessOnly !== false,
    label: String(strike.label ?? ""),
  };
}

/* ============================================ Foundry registration (not imported by smoke) */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const stateLabel = state => game.i18n.localize(`${L}.States.${normalizeState(state)}`);

const isHero = actor => actor?.type === "hero";
const chromeItemsOf = actor => (actor?.items?.filter?.(isChromeItem) ?? []);

/**
 * Benefits online/offline. Suppressed and Destroyed switch every ActiveEffect the implant carries
 * off; Damaged leaves them on (the implant "works at a penalty" — the bane is the Director's call,
 * announced on the chat card and shown on the sheet).
 */
async function syncChromeEffects(item) {
  const offline = benefitsOffline(item);
  const updates = [];
  for (const effect of item.effects ?? []) {
    if (!!effect.disabled === offline) continue;
    updates.push({ _id: effect.id, disabled: offline });
  }
  if (updates.length) await item.updateEmbeddedDocuments("ActiveEffect", updates);
  // Implant-granted abilities (Implant Weapon → Spur Strike) go with the benefit, but the grant is
  // never deleted: it is restored when the implant is repaired.
  const actor = item.parent;
  if (!(actor instanceof Actor)) return;
  const granted = actor.items.filter(i => i.getFlag(MODULE_ID, "grantedBy") === item.id);
  for (const grant of granted) {
    const grantUpdates = (grant.effects ?? [])
      .filter(effect => !!effect.disabled !== offline)
      .map(effect => ({ _id: effect.id, disabled: offline }));
    if (grantUpdates.length) await grant.updateEmbeddedDocuments("ActiveEffect", grantUpdates);
  }
}

function chromeChat(item, { from, to, source }) {
  const actor = item.parent;
  const key = STATE_RANK[to] > STATE_RANK[from] ? "Chat.Worsened" : "Chat.Repaired";
  return ChatMessage.create({
    speaker: actor ? ChatMessage.getSpeaker({ actor }) : undefined,
    content: `<p>${game.i18n.format(`${L}.${key}`, {
      actor: foundry.utils.escapeHTML(actor?.name ?? ""),
      name: foundry.utils.escapeHTML(item.name),
      from: stateLabel(from),
      to: stateLabel(to),
      source: foundry.utils.escapeHTML(source ?? loc("UnknownSource")),
    })}</p>`,
  });
}

/**
 * Write a condition onto one chrome Item. The single writer — every path below funnels here.
 * @returns {Promise<{ok: boolean, reason?: string, from?: string, to?: string}>}
 */
export async function setChromeState(item, next, { source = "", note = "", silent = false } = {}) {
  if (!isChromeItem(item)) return { ok: false, reason: "not-chrome" };
  if (!item.isOwner) return { ok: false, reason: "no-permission" };
  const from = readChromeState(item).state;
  const to = normalizeState(next);
  if (from === to) return { ok: true, from, to };
  await item.setFlag(MODULE_ID, CHROME_STATE_FLAG, {
    state: to,
    source: String(source ?? ""),
    note: String(note ?? ""),
    since: Number(game.time?.worldTime ?? 0),
  });
  await syncChromeEffects(item);
  if (!silent) {
    await chromeChat(item, { from, to, source });
    ui.notifications.info(loc("Notify.Changed", { name: item.name, state: stateLabel(to) }));
  }
  return { ok: true, from, to };
}

/** Apply a strike ladder to one implant (grade shift + never-heal escalation included). */
export async function strikeChrome(item, { ladder = "suppress", tier = 2, source = "" } = {}) {
  if (!isChromeItem(item)) return { ok: false, reason: "not-chrome" };
  const plan = planChromeStrike({ current: readChromeState(item).state, grade: chromeGrade(item), ladder, tier });
  if (!plan.changed) {
    if (plan.resisted) {
      ui.notifications.info(loc("Notify.Resisted", { name: item.name, grade: game.i18n.localize(`GHOSTWIRE.Chrome.Grades.${plan.grade}`) }));
    }
    return { ok: true, ...plan };
  }
  const result = await setChromeState(item, plan.to, { source });
  return { ...plan, ...result };
}

/** Walk one implant back down the ladder. */
export async function repairChrome(item, path = "reboot", { source = "" } = {}) {
  if (!isChromeItem(item)) return { ok: false, reason: "not-chrome" };
  const plan = planRepair({ current: readChromeState(item).state, path });
  if (!plan.changed) return { ok: true, ...plan };
  const result = await setChromeState(item, plan.to, { source: source || loc(`Paths.${path}`) });
  return { ...plan, ...result };
}

/**
 * Replace a Destroyed implant. The only sanctioned delete — and it refunds **no** Integrity, because
 * the flesh is still carrying the wreck's cost until a fresh implant goes in.
 */
export async function replaceDestroyedChrome(item) {
  if (!isChromeItem(item) || !isDestroyed(item)) return false;
  if (!game.user.isGM && !item.isOwner) return false;
  const ok = await foundry.applications.api.DialogV2.confirm({
    window: { title: loc("Replace.Title"), icon: "fa-solid fa-screwdriver-wrench" },
    content: `<p>${loc("Replace.Content", { name: foundry.utils.escapeHTML(item.name) })}</p>`,
    rejectClose: false,
  });
  if (!ok) return false;
  await item.delete({ ghostwireChromeReplace: true });
  ui.notifications.info(loc("Notify.Replaced", { name: item.name }));
  return true;
}

/* -------------------------------------------- strike prompt + GM relay */

function targetedChrome() {
  const rows = [];
  const seen = new Set();
  const add = actor => {
    if (!isHero(actor) || seen.has(actor.id)) return;
    seen.add(actor.id);
    for (const item of chromeItemsOf(actor)) rows.push({ actor, item });
  };
  for (const token of game.user.targets ?? []) add(token.actor);
  if (!rows.length) for (const token of canvas?.tokens?.controlled ?? []) add(token.actor);
  return rows;
}

/** Player without write access on the victim: hand the strike to the first active GM. */
function relayStrike(payload) {
  const gm = game.users.find(u => u.isGM && u.active);
  if (!gm) {
    ui.notifications.warn(loc("Notify.NoGm"));
    return false;
  }
  game.socket.emit(SOCKET, { op: "chromeDamage.strike", ...payload });
  ui.notifications.info(loc("Notify.Relayed"));
  return true;
}

async function onChromeSocket(payload) {
  if (payload?.op !== "chromeDamage.strike" || !game.user.isGM) return;
  const gm = game.users.find(u => u.isGM && u.active);
  if (!gm || gm.id !== game.user.id) return;
  const item = await fromUuid(payload.itemUuid).catch(() => null);
  if (!item || !isChromeItem(item)) return;
  await strikeChrome(item, { ladder: payload.ladder, tier: payload.tier, source: payload.source });
}

/**
 * Pick a target implant and a power-roll tier, then apply (or relay to the Director).
 * `strike` is a `chromeStrikeOf()` row; `source` names the program on the chat card.
 */
export async function promptChromeStrike(strike, { source = "" } = {}) {
  const rows = targetedChrome();
  if (!rows.length) return ui.notifications.warn(loc("Notify.NoTarget"));
  const options = rows.map(({ actor, item }) => {
    const state = readChromeState(item).state;
    const grade = game.i18n.localize(`GHOSTWIRE.Chrome.Grades.${chromeGrade(item)}`);
    const label = `${actor.name} — ${item.name} (${grade}${state === "ok" ? "" : `, ${stateLabel(state)}`})`;
    return `<option value="${item.uuid}">${foundry.utils.escapeHTML(label)}</option>`;
  }).join("");
  const data = await foundry.applications.api.DialogV2.input({
    window: { title: loc("Strike.Title"), icon: "fa-solid fa-bolt" },
    content: `
      <p>${loc("Strike.Hint", { source: foundry.utils.escapeHTML(source || loc("UnknownSource")) })}</p>
      <div class="form-group"><label>${loc("Strike.Target")}</label>
        <select name="uuid">${options}</select></div>
      <div class="form-group"><label>${loc("Strike.Tier")}</label>
        <select name="tier">
          <option value="1">${loc("Strike.Tier1")}</option>
          <option value="2" selected>${loc("Strike.Tier2")}</option>
          <option value="3">${loc("Strike.Tier3")}</option>
        </select></div>`,
    ok: { label: `${L}.Strike.Confirm`, icon: "fa-solid fa-bolt" },
  });
  if (!data?.uuid) return null;
  const item = await fromUuid(data.uuid).catch(() => null);
  if (!item) return null;
  const tier = Number(data.tier) || 2;
  if (!item.isOwner) return relayStrike({ itemUuid: item.uuid, ladder: strike.ladder, tier, source });
  return strikeChrome(item, { ladder: strike.ladder, tier, source });
}

/** Pick one damaged implant on an ally and run a mend path. */
export async function promptChromeMend(path, { source = "" } = {}) {
  const rows = [];
  const seen = new Set();
  const add = actor => {
    if (!isHero(actor) || seen.has(actor.id)) return;
    seen.add(actor.id);
    for (const item of chromeItemsOf(actor)) {
      if (readChromeState(item).state !== "ok") rows.push({ actor, item });
    }
  };
  for (const token of game.user.targets ?? []) add(token.actor);
  for (const token of canvas?.tokens?.controlled ?? []) add(token.actor);
  if (!rows.length) return null;
  const options = rows.map(({ actor, item }) =>
    `<option value="${item.uuid}">${foundry.utils.escapeHTML(`${actor.name} — ${item.name} (${stateLabel(readChromeState(item).state)})`)}</option>`).join("");
  const data = await foundry.applications.api.DialogV2.input({
    window: { title: loc("Mend.Title"), icon: "fa-solid fa-wand-magic-sparkles" },
    content: `
      <p>${loc(`Mend.Hint.${path}`)}</p>
      <div class="form-group"><label>${loc("Mend.Target")}</label>
        <select name="uuid">${options}</select></div>`,
    ok: { label: `${L}.Mend.Confirm`, icon: "fa-solid fa-wand-magic-sparkles" },
  });
  if (!data?.uuid) return null;
  const item = await fromUuid(data.uuid).catch(() => null);
  if (!item) return null;
  if (!item.isOwner) return ui.notifications.warn(loc("Notify.MendNoPermission", { name: item.name }));
  return repairChrome(item, path, { source });
}

/* -------------------------------------------- ability-use wiring */

/** Same read as scripts/sfx.mjs: `system.parts` is a ModelCollection at runtime, not a plain object. */
function abilityFromMessage(message) {
  const parts = message?.system?.parts;
  if (!parts) return null;
  const list = Array.isArray(parts) ? parts : (parts.contents ?? Object.values(parts));
  const part = list.find(p => (p?.type ?? p?.constructor?.TYPE) === "abilityUse" && p?.abilityUuid);
  if (!part) return null;
  try {
    return part.ability ?? fromUuidSync(part.abilityUuid) ?? null;
  } catch {
    return null;
  }
}

/** The matrix payload behind a "Run {Payload}" ability, if it is still on the sheet. */
function payloadBehind(ability) {
  const id = ability?.getFlag?.(MODULE_ID, "fromPayloadId");
  return id ? (ability.parent?.items?.get(id) ?? null) : null;
}

async function onAbilityMessage(message, options, userId) {
  if (userId !== game.user.id) return;
  const ability = abilityFromMessage(message);
  if (!ability) return;

  // Hacker 1-shot programs: the strike rides the payload chip, not the generated Run ability.
  const payload = payloadBehind(ability);
  const strike = chromeStrikeOf(payload) ?? chromeStrikeOf(ability);
  if (strike) return promptChromeStrike(strike, { source: payload?.name ?? ability.name });

  // Technomancer: Resonance Mending / Machine God's Rite clear the flags they already clear in prose.
  const path = MEND_ABILITIES[ability.system?._dsid ?? ""];
  if (path) return promptChromeMend(path, { source: ability.name });
}

/* -------------------------------------------- sheet + menus */

function injectConditionLine(app, element) {
  const item = app.document;
  element.querySelector(".ghostwire-chrome-condition")?.remove();
  if (!isChromeItem(item)) return;
  const { state } = readChromeState(item);
  if (state === "ok") return;
  const anchor = element.querySelector(".ghostwire-chrome-line") ?? element.querySelector(".sheet-header .document-name");
  if (!anchor) return;
  const line = document.createElement("div");
  line.className = `ghostwire-chrome-condition ghostwire-chrome-${state}`;
  const project = repairProject(item, state);
  line.textContent = project
    ? loc("SheetLine.WithProject", { state: stateLabel(state), goal: project.goal, cost: project.cost })
    : loc("SheetLine.Plain", { state: stateLabel(state) });
  anchor.after(line);
}

function chromeContextMenu(app, menuItems) {
  if (typeof app._getEmbeddedDocument !== "function") return;
  const chromeOf = target => {
    const item = app._getEmbeddedDocument(target);
    return (isChromeItem(item) && (item.parent instanceof Actor) && (item.isOwner || game.user.isGM)) ? item : null;
  };
  const stateOf = target => readChromeState(chromeOf(target) ?? {}).state;
  menuItems.push(
    {
      label: `${L}.Menu.Reboot`, icon: "fa-solid fa-power-off",
      visible: target => stateOf(target) === "suppressed",
      onClick: (event, target) => repairChrome(chromeOf(target), "reboot"),
    },
    {
      label: `${L}.Menu.Repair`, icon: "fa-solid fa-screwdriver-wrench",
      visible: target => ["damaged", "destroyed"].includes(stateOf(target)) && game.user.isGM,
      onClick: (event, target) => repairChrome(chromeOf(target), "project"),
    },
    {
      label: `${L}.Menu.Replace`, icon: "fa-solid fa-trash-can-arrow-up",
      visible: target => stateOf(target) === "destroyed",
      onClick: (event, target) => replaceDestroyedChrome(chromeOf(target)),
    },
    {
      label: `${L}.Menu.SetState`, icon: "fa-solid fa-sliders",
      visible: target => !!chromeOf(target) && game.user.isGM,
      onClick: (event, target) => promptSetState(chromeOf(target)),
    },
  );
}

async function promptSetState(item) {
  if (!item) return null;
  const current = readChromeState(item).state;
  const options = CHROME_STATES.map(state =>
    `<option value="${state}"${state === current ? " selected" : ""}>${stateLabel(state)}</option>`).join("");
  const data = await foundry.applications.api.DialogV2.input({
    window: { title: loc("Menu.SetState"), icon: "fa-solid fa-sliders" },
    content: `
      <p>${loc("SetState.Hint", { name: foundry.utils.escapeHTML(item.name) })}</p>
      <div class="form-group"><label>${loc("SetState.Label")}</label>
        <select name="state">${options}</select></div>`,
    ok: { label: `${L}.SetState.Confirm`, icon: "fa-solid fa-check" },
  });
  if (!data?.state) return null;
  return setChromeState(item, data.state, { source: loc("Paths.director") });
}

/** Hero sheet: a "Chrome damage" line under Body Integrity when anything is locked out. */
function injectLockedIntegrity(app, element) {
  const fieldset = element.querySelector(".ghostwire-integrity");
  element.querySelector(".ghostwire-chrome-locked")?.remove();
  if (!fieldset) return;
  const locked = lockedIntegrity(app.document.items ?? []);
  if (!locked) return;
  const line = document.createElement("p");
  line.className = "ghostwire-chrome-locked hint";
  line.textContent = loc("LockedIntegrity", { locked });
  fieldset.append(line);
}

export function registerChromeDamage() {
  Hooks.once("ready", () => {
    game.socket.on(SOCKET, onChromeSocket);
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        chromeDamage: {
          CHROME_STATES,
          readChromeState,
          setChromeState,
          strikeChrome,
          repairChrome,
          replaceDestroyedChrome,
          promptChromeStrike,
          promptChromeMend,
          planChromeStrike,
          planRepair,
          repairProject,
          lockedIntegrity,
          chromeDeleteBlocked,
        },
      };
    }
    console.log(`${MODULE_ID} | F12 Chrome Damage: Suppressed / Damaged / Destroyed registered (no-delete lock on Destroyed)`);
  });

  // The no-delete lock. Destroyed chrome stays on the sheet until the Director repairs or replaces it;
  // a bare delete would hand back 75% Body Integrity through module.mjs's remove hook.
  Hooks.on("preDeleteItem", (item, options, userId) => {
    if (!chromeDeleteBlocked(item, options)) return;
    if (userId === game.user.id) ui.notifications.warn(loc("Notify.DeleteBlocked", { name: item.name }));
    return false;
  });

  Hooks.on("createChatMessage", onAbilityMessage);
  Hooks.on("renderDrawSteelItemSheet", injectConditionLine);
  Hooks.on("renderDrawSteelHeroSheet", injectLockedIntegrity);
  Hooks.on("getDocumentListContextOptions", chromeContextMenu);
}
