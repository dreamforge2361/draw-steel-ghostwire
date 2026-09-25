// 0.3.139 (C) — Skillwires and skillsofts. The one place a soft chip lives.
//
// What this replaces: **RCC autosofts**. Until this wave a "soft" was deck software that filled a mod
// slot on a Rigger Command Console and was loaded with a downtime §Craft Project. That was two systems
// wearing one word — the chrome implant **Skillwires** had a Repair edge welded into the implant itself,
// and the only four softs in the game lived on the RCC instead. Now there is one system:
//
// - **Skillwires** (chrome, BI 4, ¥5,000, Restricted, Head / Neural) is the **socket** and nothing else.
//   It grants no edge of its own. (It is *not* the Hacker's **Encephalon / Cerebral Datastore**, which
//   is a separate Wired implant and stays separate.)
// - A **skillsoft** is a chip in inventory. Heroes may own as many as they can pay for.
// - Only **active** softs do anything. Capacity is by hero echelon: **E1–E2 = 1**, **E3 = 2**, **E4 = 3**.
// - Loading, unloading and swapping a soft is a **short field action out of combat**. It is **not** a
//   Craft Project, and it **cannot** be done during a fight.
// - A matching active soft **auto-applies** its edge: the chip's Active Effect writes
//   `system.skills.modifiers.<skill>.edges`, so the edge is already on the Power Roll. There is no
//   per-roll toggle to remember.
// - Chrome edges still do not stack with other chrome edges on the same skill — every change is an
//   `upgrade` to 1, so two sources of the same edge are still one edge.
//
// The pure half (cap, plan, ordering) takes no Foundry globals, so `tools/wave-03139-smoke.mjs` can
// drive it offline.

import { echelonForLevel } from "./reagents.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Skillsofts";

/** The chrome implant that provides the socket. */
export const SKILLWIRES_DSID = "skillwires";

/** The host token a skillsoft publishes. Nothing else in the catalog uses it. */
export const SKILLSOFT_HOST = "skillwires";

/** LOCKED (Michael 2026-09-25): active soft capacity by hero echelon. */
export const SOFT_CAP_BY_ECHELON = Object.freeze({ 1: 1, 2: 1, 3: 2, 4: 3 });

/** How many softs a hero of this echelon may run at once. Out-of-range echelons clamp to 1–4. */
export function softCapForEchelon(echelon) {
  const tier = Math.min(4, Math.max(1, Math.floor(Number(echelon) || 1)));
  return SOFT_CAP_BY_ECHELON[tier];
}

/** Same, from a level, for the callers that only have one. */
export function softCapForLevel(level) {
  return softCapForEchelon(echelonForLevel(level));
}

/**
 * Whether a load / unload is legal right now, and why not when it isn't.
 *
 * @param {object} opts
 * @param {"load"|"unload"} opts.action
 * @param {boolean} opts.hasSkillwires  Does the hero have the Skillwires implant?
 * @param {boolean} opts.inCombat       A swap in a fight is never allowed.
 * @param {boolean} opts.active         Is this chip already active?
 * @param {number}  opts.activeCount    How many softs are active right now (this one included when active).
 * @param {number}  opts.cap            softCapForEchelon(...)
 * @returns {{ok: boolean, reason: string|null}} reason is a `GHOSTWIRE.Skillsofts.Blocked.*` key.
 */
export function softLoadPlan({ action = "load", hasSkillwires = false, inCombat = false, active = false, activeCount = 0, cap = 1 } = {}) {
  if (action === "unload") {
    if (!active) return { ok: false, reason: "NotActive" };
    if (inCombat) return { ok: false, reason: "InCombat" };
    return { ok: true, reason: null };
  }
  if (!hasSkillwires) return { ok: false, reason: "NoSkillwires" };
  if (active) return { ok: false, reason: "AlreadyActive" };
  if (inCombat) return { ok: false, reason: "InCombat" };
  if (activeCount >= cap) return { ok: false, reason: "AtCap" };
  return { ok: true, reason: null };
}

/**
 * Which of a hero's active softs actually run, given the cap.
 *
 * A hero who levels *down* into a smaller cap, or who loses Skillwires to chrome damage, must not keep
 * three edges running. Rather than silently unloading chips the player chose, the surplus is ignored:
 * the first `cap` active softs in catalog order run, the rest read as suppressed.
 *
 * @param {Array<{id: string, sort?: number}>} activeSofts  Active chips, in sheet order.
 * @param {number} cap
 * @returns {string[]} The ids that are actually running.
 */
export function runningSoftIds(activeSofts = [], cap = 1) {
  const limit = Math.max(0, Math.floor(Number(cap) || 0));
  return [...activeSofts]
    .sort((a, b) => (Number(a.sort ?? 0) - Number(b.sort ?? 0)) || String(a.id).localeCompare(String(b.id)))
    .slice(0, limit)
    .map(soft => soft.id);
}

/* ================================================================ the Foundry half */

/** The skillsoft catalog data of an Item, or null. */
export const getSoftData = item => item?.getFlag?.(MODULE_ID, "skillsoft") ?? null;
export const isSkillsoft = item => !!getSoftData(item);

/** A chip the player has switched on. Owning a chip does nothing; loading it is what counts. */
export const isSoftActive = item => getSoftData(item)?.active === true;

/** Does this Actor have the Skillwires socket installed? */
export function hasSkillwires(actor) {
  return !!actor?.items?.some(item => item.system?._dsid === SKILLWIRES_DSID);
}

/** Every skillsoft on this Actor. */
export function ownedSofts(actor) {
  return actor?.items?.filter(isSkillsoft) ?? [];
}

/** Every skillsoft the player has switched on — including any over the cap. */
export function activeSofts(actor) {
  return ownedSofts(actor).filter(isSoftActive);
}

/** This hero's active-soft capacity, from their echelon (the system exposes it) or their level. */
export function softCap(actor) {
  const echelon = Number(actor?.system?.echelon);
  if (Number.isFinite(echelon) && echelon >= 1) return softCapForEchelon(echelon);
  return softCapForLevel(actor?.system?.level);
}

/** Active, within cap, and socketed. Only these apply their edge. */
export function isRunningSoft(item) {
  const actor = item?.parent;
  if (!(actor instanceof Actor) || !isSkillsoft(item) || !isSoftActive(item)) return false;
  if (!hasSkillwires(actor)) return false;
  const ids = runningSoftIds(activeSofts(actor).map(soft => ({ id: soft.id, sort: soft.sort })), softCap(actor));
  return ids.includes(item.id);
}

/**
 * Edges a running skillsoft grants a named ability — the seam `scripts/mods.mjs` used to own for
 * RCC autosofts, so Targeting Soft still gives drone gunnery its edge.
 */
export function skillsoftEdges(actor, abilityDsid) {
  if (!abilityDsid || !actor?.items) return 0;
  return actor.items.filter(item => (getSoftData(item)?.edgeAbilities ?? []).includes(abilityDsid) && isRunningSoft(item)).length;
}

const warn = (key, data) => ui.notifications.warn(game.i18n.format(`${L}.Blocked.${key}`, data ?? {}));

function livePlan(item, action) {
  const actor = item?.parent;
  return softLoadPlan({
    action,
    hasSkillwires: hasSkillwires(actor),
    inCombat: !!actor?.inCombat,
    active: isSoftActive(item),
    activeCount: activeSofts(actor).length,
    cap: softCap(actor),
  });
}

/**
 * Load or unload one soft. The short field action, out of combat only.
 * @returns {Promise<boolean>} whether the chip changed state.
 */
export async function setSoftActive(item, active) {
  const action = active ? "load" : "unload";
  const plan = livePlan(item, action);
  if (!plan.ok) {
    warn(plan.reason, {
      soft: item?.name ?? "", name: item?.parent?.name ?? "",
      cap: softCap(item?.parent), count: activeSofts(item?.parent).length,
    });
    return false;
  }
  await item.setFlag(MODULE_ID, "skillsoft", { ...getSoftData(item), active });
  ui.notifications.info(game.i18n.format(`${L}.${active ? "Loaded" : "Unloaded"}`, {
    soft: item.name, name: item.parent?.name ?? "",
    count: activeSofts(item.parent).length, cap: softCap(item.parent),
  }));
  return true;
}

// A skillsoft's Active Effect applies only while the chip is loaded, socketed and inside the cap.
// Same seam scripts/mods.mjs uses for deck software, and deliberately a *separate* flag: a soft is not
// a mod any more, and must not be reachable from Install onto….
function patchSkillsoftSuppression() {
  const EffectClass = CONFIG.ActiveEffect.documentClass;
  let proto = EffectClass.prototype;
  let descriptor = null;
  while (proto && !(descriptor = Object.getOwnPropertyDescriptor(proto, "isSuppressed"))) proto = Object.getPrototypeOf(proto);
  if (!descriptor?.get) {
    console.warn(`${MODULE_ID} | ActiveEffect#isSuppressed not found; skillsoft effects always apply`);
    return;
  }
  Object.defineProperty(EffectClass.prototype, "isSuppressed", {
    configurable: true,
    get() {
      if (this.getFlag?.(MODULE_ID, "skillsoft") && (this.parent instanceof Item) && !isRunningSoft(this.parent)) return true;
      return descriptor.get.call(this);
    },
  });
}

export function registerSkillsofts() {
  patchSkillsoftSuppression();

  // Hero sheet: right-click a soft row (or its ⋮) → Load soft / Unload soft.
  Hooks.on("getDocumentListContextOptions", (app, menuItems) => {
    if (typeof app._getEmbeddedDocument !== "function") return;
    const soft = target => {
      const item = app._getEmbeddedDocument(target);
      return (isSkillsoft(item) && item.isOwner && (item.parent instanceof Actor)) ? item : null;
    };
    menuItems.push(
      {
        label: `${L}.Load`, icon: "fa-solid fa-download",
        visible: target => { const item = soft(target); return !!item && !isSoftActive(item); },
        onClick: (event, target) => setSoftActive(soft(target), true),
      },
      {
        label: `${L}.Unload`, icon: "fa-solid fa-eject",
        visible: target => { const item = soft(target); return !!item && isSoftActive(item); },
        onClick: (event, target) => setSoftActive(soft(target), false),
      },
    );
  });

  // Soft Item sheet: one button, and a line that says why it is or is not running.
  Hooks.on("renderDrawSteelItemSheet", (app, element) => {
    const item = app.document;
    element.querySelector(".ghostwire-skillsoft-controls")?.remove();
    if (!isSkillsoft(item) || !(item.parent instanceof Actor)) return;
    const header = element.querySelector(".sheet-header .header-center") ?? element.querySelector(".sheet-header");
    if (!header) return;

    const actor = item.parent;
    const controls = document.createElement("div");
    controls.className = "ghostwire-skillsoft-controls flexcol";

    const status = document.createElement("span");
    status.className = "hint";
    status.textContent = game.i18n.format(`${L}.Status`, {
      count: activeSofts(actor).length,
      cap: softCap(actor),
      state: game.i18n.localize(`${L}.State.${isRunningSoft(item) ? "Running" : (isSoftActive(item) ? "Idle" : "Stowed")}`),
    });

    const button = document.createElement("button");
    button.type = "button";
    const loading = !isSoftActive(item);
    button.innerHTML = `<i class="fa-solid fa-${loading ? "download" : "eject"}"></i> `
      + game.i18n.localize(`${L}.${loading ? "Load" : "Unload"}`);
    button.disabled = !item.isOwner || !livePlan(item, loading ? "load" : "unload").ok;
    button.addEventListener("click", async event => {
      event.preventDefault();
      button.disabled = true;
      await setSoftActive(item, loading);
      if (app.rendered) app.render();
    });

    controls.append(status, button);
    header.append(controls);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      isSkillsoft, isSoftActive, isRunningSoft, hasSkillwires, ownedSofts, activeSofts,
      softCap, softCapForEchelon, softCapForLevel, softLoadPlan, runningSoftIds, setSoftActive,
      skillsoftEdges, SOFT_CAP_BY_ECHELON, SKILLSOFT_HOST, SKILLWIRES_DSID,
    };
  }
  console.log(`${MODULE_ID} | Skillsofts registered (Skillwires socket, echelon cap ${JSON.stringify(SOFT_CAP_BY_ECHELON)})`);
}
