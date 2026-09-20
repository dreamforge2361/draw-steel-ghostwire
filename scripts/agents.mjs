// Hacker Agents: Compile / Decompile, the deck-side twin of Technomancer sprites
// (docs/raw/19-hacker.md, docs/spikes/B120-HACKER-AGENTS.md).
//
// Agents are software constructs / deck daemons — not Resonance sprites. They do not share sprite Actors.
// The Compile Agent *ability* is the sheet-side handle. Compiling stamps one of the twelve band Actors from
// Ghostwire Summons & Machines › Agents into a linked world Actor, re-stamps its Stamina from the live Hacker,
// and places a token beside them. Abilities-tab **Use** (AbilityModel#use) is the player-facing compile path:
// Overlay/Jacked In + under cap opens the archetype picker and places the token; at cap, Use is command-only
// (power roll, no second Agent). Item-sheet Compile / row-menu still compile without going through Use.
// The link lives in flags on both sides:
// - Agent Actor: flags.<module> = { kind: "agent", archetype, hybridTier, compiler: <actorUuid>, dsid, compiledAtLevel }
// - Hacker: flags.<module>.compiledAgent = { uuids: [...] } — a roster mirror. The world scan by `compiler`
//   is what actually decides the cap, so a hand-deleted Agent can never wedge it.
//
// Compile requires Overlay or Jacked In (Linked refuses — Agents need immersion). Cost is 3 Bandwidth in combat
// (mirrors Compile Sprite's 3 Resonance Enhance). Outside combat, Hacker Programs fire without spending.

import { isFullyConnected, WIRED_STATUS_DEFS } from "./wired-state.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const PACK_ID = `${MODULE_ID}.summons`;
const UI = "GHOSTWIRE.Summons.Agents.UI";

const COMPILE_DSID = "compile-agent";
const DECOMPILE_DSID = "decompile-agent";
const ARCHETYPES = ["probe", "spike", "daemon", "watchdog"];

/** 3 Bandwidth — same number as Compile Sprite's Enhance / Ghost Signal. Michael can tune later. */
export const COMPILE_BANDWIDTH = 3;

// Agent Stat Block Reference (19-hacker.md): Stamina = archetype base + (Logic × level), per band.
// Parallel to sprite Data / Attack / Machine / Ward bases. Must match src/packs/summons/agents/.
const STAMINA_BASE = {
  probe: { minor: 8, intermediate: 14, advanced: 20 },
  spike: { minor: 12, intermediate: 18, advanced: 26 },
  daemon: { minor: 10, intermediate: 16, advanced: 22 },
  watchdog: { minor: 10, intermediate: 16, advanced: 22 },
};

/** The hybrid band a Hacker of this level compiles into: minor L1–3, intermediate L4–7, advanced L8–10. */
export function agentBand(level) {
  if (level >= 8) return "advanced";
  if (level >= 4) return "intermediate";
  return "minor";
}

const isHacker = actor => (actor?.type === "hero") && (actor.system.class?.system._dsid === "hacker");
const casterLevel = actor => Number(actor?.system.level) || 1;
/** Logic is the Draw Steel Reason characteristic under a Ghostwire name. */
const casterLogic = actor => Number(actor?.system.characteristics?.reason?.value) || 0;

export const compileAbility = actor =>
  actor?.items.find(i => (i.type === "ability") && (i.system._dsid === COMPILE_DSID)) ?? null;
const isCompileAbility = item =>
  (item?.type === "ability") && (item.system?._dsid === COMPILE_DSID) && isHacker(item.parent);
const isDecompileAbility = item =>
  (item?.type === "ability") && (item.system?._dsid === DECOMPILE_DSID) && isHacker(item.parent);

/**
 * How many Agents this Hacker may command at once.
 * v1: same baseline as a non-Weaver Technomancer (2 → 3@5 → 4@8). No Controller Weaver-style bump.
 */
export function agentCap(actor) {
  const level = casterLevel(actor);
  let cap = 2;
  if (level >= 5) cap = 3;
  if (level >= 8) cap = 4;
  return cap;
}

/** Stamina for an Agent of this archetype and band compiled by this caster, right now. */
export function agentStamina(archetype, band, actor) {
  return (STAMINA_BASE[archetype]?.[band] ?? 10) + (casterLogic(actor) * casterLevel(actor));
}

/** Overlay or Jacked In. Linked refuses — Agents need immersion. */
export function compileAllowedAtState(state) {
  return isFullyConnected(state);
}

/** Resolve Wired state from statuses, then the flag mirror. Defaults to disconnected. */
export function actorWiredState(actor) {
  const statuses = actor?.statuses;
  if (statuses?.has?.(WIRED_STATUS_DEFS.jackedIn.id)) return "jackedIn";
  if (statuses?.has?.(WIRED_STATUS_DEFS.overlay.id)) return "overlay";
  if (statuses?.has?.(WIRED_STATUS_DEFS.linked.id)) return "linked";
  const flag = actor?.getFlag?.(MODULE_ID, "wired")?.state
    ?? actor?.flags?.[MODULE_ID]?.wired?.state;
  if (flag === "jackedIn" || flag === "overlay" || flag === "linked" || flag === "disconnected") return flag;
  return "disconnected";
}

/**
 * Pure compile gate (Node-smokeable). Returns a UI key suffix, or null when the compile is legal.
 * @returns {string|null} NotHacker | LinkedRefuses | NeedImmersion | NoScene | NoPermission | AtCap | null
 */
export function compileAgentGate({ hacker, state, count, cap, hasScene, canCreate }) {
  if (!hacker) return "NotHacker";
  if (!compileAllowedAtState(state)) return (state === "linked") ? "LinkedRefuses" : "NeedImmersion";
  if (!hasScene) return "NoScene";
  if (!canCreate) return "NoPermission";
  if (count >= cap) return "AtCap";
  return null;
}

/**
 * What Abilities-tab Use of Compile Agent should do. Compile Agent is one card with two jobs:
 * compile (main, under cap) or command (at cap). Linked / disconnected still refuse the whole Use.
 * At-cap command does not need a Scene or create permission.
 * @returns {{ mode: "compile"|"command"|"refuse", gate: string|null }}
 */
export function sheetUseCompilePlan({ hacker, state, count, cap, hasScene, canCreate }) {
  if (!hacker) return { mode: "refuse", gate: "NotHacker" };
  if (!compileAllowedAtState(state)) {
    return { mode: "refuse", gate: (state === "linked") ? "LinkedRefuses" : "NeedImmersion" };
  }
  if (count >= cap) return { mode: "command", gate: "AtCap" };
  const gate = compileAgentGate({ hacker, state, count, cap, hasScene, canCreate });
  if (gate) return { mode: "refuse", gate };
  return { mode: "compile", gate: null };
}

/** Every Agent currently compiled by this Hacker. The world is the source of truth, so deletes self-heal. */
export function compiledAgents(actor) {
  if (!actor?.uuid) return [];
  return game.actors.filter(a => (a.getFlag(MODULE_ID, "kind") === "agent") && (a.getFlag(MODULE_ID, "compiler") === actor.uuid));
}

/** The Hacker who compiled an Agent Actor, or null. */
export function agentCompiler(agent) {
  const uuid = (agent?.getFlag(MODULE_ID, "kind") === "agent") ? agent.getFlag(MODULE_ID, "compiler") : null;
  const actor = uuid ? fromUuidSync(uuid) : null;
  return actor instanceof Actor ? actor : null;
}

async function syncRoster(actor) {
  if (!actor?.isOwner) return;
  const uuids = compiledAgents(actor).map(s => s.uuid).sort();
  const current = [...(actor.getFlag(MODULE_ID, "compiledAgent")?.uuids ?? [])].sort();
  if (uuids.join("|") !== current.join("|")) await actor.setFlag(MODULE_ID, "compiledAgent", { uuids });
}

function refreshSheets(actor) {
  const ability = compileAbility(actor);
  if (ability?.sheet?.rendered) ability.sheet.render();
}

async function templateFor(archetype, band) {
  const pack = game.packs.get(PACK_ID);
  if (!pack) return null;
  const index = await pack.getIndex({ fields: [`flags.${MODULE_ID}.dsid`] });
  const dsid = `agent-${archetype}-${band}`;
  const entry = index.find(e => foundry.utils.getProperty(e, `flags.${MODULE_ID}.dsid`) === dsid);
  return entry ? pack.getDocument(entry._id) : null;
}

async function compileFolder() {
  const name = game.i18n.localize(`${UI}.Folder`);
  return game.folders.find(f => (f.type === "Actor") && f.getFlag(MODULE_ID, "compiledAgents"))
    ?? Folder.create({ name, type: "Actor", flags: { [MODULE_ID]: { compiledAgents: true } } });
}

const RING = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

function placement(caster, index) {
  const grid = canvas.grid.size;
  const token = caster?.getActiveTokens?.()[0]?.document;
  const [dx, dy] = RING[index % RING.length];
  if (token) return { x: token.x + (dx * Math.max(token.width, 1) * grid), y: token.y + (dy * Math.max(token.height, 1) * grid) };
  const { x, y } = canvas.stage.pivot;
  return { x: (Math.round(x / grid) + dx) * grid, y: (Math.round(y / grid) + dy) * grid };
}

async function promptArchetype(caster, band) {
  const options = ARCHETYPES.map((archetype, index) => {
    const label = game.i18n.localize(`${UI}.Archetype.${archetype}`);
    const line = game.i18n.format(`${UI}.ArchetypeLine`, {
      stamina: agentStamina(archetype, band, caster),
      hint: game.i18n.localize(`${UI}.ArchetypeHint.${archetype}`),
    });
    return `<option value="${archetype}"${index === 0 ? " selected" : ""}>${label} — ${line}</option>`;
  });
  return foundry.applications.api.DialogV2.prompt({
    window: { title: game.i18n.localize(`${UI}.CompileTitle`) },
    content: `<p>${game.i18n.format(`${UI}.CompilePrompt`, {
      name: foundry.utils.escapeHTML(caster.name),
      band: game.i18n.localize(`${UI}.Band.${band}`),
      level: casterLevel(caster),
      logic: casterLogic(caster),
      cost: COMPILE_BANDWIDTH,
    })}</p><div class="form-group"><label>${game.i18n.localize(`${UI}.ArchetypeLabel`)}</label>`
      + `<select name="archetype">${options.join("")}</select></div>`,
    ok: { label: game.i18n.localize(`${UI}.Compile`), callback: (event, button) => button.form.elements.archetype.value },
    rejectClose: false,
  });
}

/** Pick one compiled Agent, or the whole roster, for Decompile Agent Use. */
async function promptDecompileTarget(caster) {
  const agents = compiledAgents(caster);
  if (!agents.length) return warn("None", { name: caster.name });
  if (agents.length === 1) return agents[0];
  const options = agents.map((agent, index) =>
    `<option value="${agent.id}"${index === 0 ? " selected" : ""}>${foundry.utils.escapeHTML(agent.name)}</option>`);
  options.push(`<option value="all">${game.i18n.localize(`${UI}.DecompileAll`)}</option>`);
  const picked = await foundry.applications.api.DialogV2.prompt({
    window: { title: game.i18n.localize(`${UI}.DecompileTitle`) },
    content: `<p>${game.i18n.format(`${UI}.DecompilePrompt`, {
      name: foundry.utils.escapeHTML(caster.name),
    })}</p><div class="form-group"><label>${game.i18n.localize(`${UI}.DecompileLabel`)}</label>`
      + `<select name="agent">${options.join("")}</select></div>`,
    ok: { label: game.i18n.localize(`${UI}.Decompile`), callback: (event, button) => button.form.elements.agent.value },
    rejectClose: false,
  });
  if (picked === "all") return "all";
  return agents.find(agent => agent.id === picked) ?? null;
}

function warn(key, data) {
  ui.notifications.warn(game.i18n.format(`${UI}.${key}`, data ?? {}));
  return null;
}

/**
 * Spend 3 Bandwidth in combat. Outside combat, Hacker Programs (and this compile) fire without spending
 * (19-hacker.md — once until Victory / respite is table discipline, not a Foundry counter).
 */
async function spendBandwidth(caster) {
  if (!caster.inCombat) return true;
  const path = "system.hero.primary.value";
  const current = Number(foundry.utils.getProperty(caster, path)) || 0;
  if (current < COMPILE_BANDWIDTH) {
    warn("NotEnoughBandwidth", { name: caster.name, cost: COMPILE_BANDWIDTH, current });
    return false;
  }
  await caster.update({ [path]: current - COMPILE_BANDWIDTH });
  return true;
}

/**
 * Compile one Agent for a Hacker: band from their current level, Stamina stamped from live Logic × level.
 * @param {Actor} caster
 * @param {object} [options]
 * @param {string} [options.archetype]    probe | spike | daemon | watchdog; prompts when omitted.
 * @param {object} [options.position]     {x, y} instead of the ring beside the caster.
 * @param {boolean} [options.silent]
 * @param {boolean} [options.skipSpend]   Level-refresh swaps already paid; don't charge again.
 * @returns {Promise<Actor|null>}
 */
export async function compileAgent(caster, { archetype, position, silent = false, skipSpend = false } = {}) {
  if (!isHacker(caster)) return warn("NotHacker");
  const state = actorWiredState(caster);
  const cap = agentCap(caster);
  const current = compiledAgents(caster);
  const gate = compileAgentGate({
    hacker: true, state, count: current.length, cap,
    hasScene: !!canvas.scene,
    canCreate: game.user.can("ACTOR_CREATE") && game.user.can("TOKEN_CREATE"),
  });
  if (gate) {
    return warn(gate, { name: caster.name, cap, count: current.length, state: game.i18n.localize(`GHOSTWIRE.Wired.States.${state}`) });
  }

  const level = casterLevel(caster);
  const band = agentBand(level);
  archetype ??= await promptArchetype(caster, band);
  if (!ARCHETYPES.includes(archetype)) return null;

  if (!skipSpend && !(await spendBandwidth(caster))) return null;

  const template = await templateFor(archetype, band);
  if (!template) return ui.notifications.error(game.i18n.format(`${UI}.NoTemplate`, { dsid: `agent-${archetype}-${band}` }));

  const stamina = agentStamina(archetype, band, caster);
  const ownership = { default: 0 };
  for (const [userId, ownershipLevel] of Object.entries(caster.ownership ?? {})) {
    if ((userId !== "default") && (ownershipLevel >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)) ownership[userId] = ownershipLevel;
  }

  const data = game.actors.fromCompendium(template);
  foundry.utils.mergeObject(data, {
    folder: (await compileFolder())?.id ?? null, ownership,
    "system.stamina": { value: stamina, max: stamina, temporary: 0 },
    "system.characteristics.reason.value": casterLogic(caster),
    "system.monster.level": level,
    "prototypeToken.actorLink": true,
    "prototypeToken.disposition": CONST.TOKEN_DISPOSITIONS.FRIENDLY,
    [`flags.${MODULE_ID}`]: {
      kind: "agent", archetype, hybridTier: band, compiler: caster.uuid,
      dsid: `agent-${archetype}-${band}`, compiledAtLevel: level,
    },
  });
  const actor = await Actor.create(data);
  if (!actor) return null;

  const tokenDocument = await actor.getTokenDocument({ ...(position ?? placement(caster, current.length)), actorLink: true });
  await canvas.scene.createEmbeddedDocuments("Token", [tokenDocument.toObject()]);
  await syncRoster(caster);
  refreshSheets(caster);
  if (!silent) {
    ui.notifications.info(game.i18n.format(`${UI}.Compiled`, {
      agent: actor.name, stamina, count: current.length + 1, cap,
      band: game.i18n.localize(`${UI}.Band.${band}`),
    }));
  }
  return actor;
}

/** Decompile one Agent: delete its tokens on every Scene, then the Actor. */
export async function decompileAgent(agent, { silent = false } = {}) {
  if (!(agent instanceof Actor)) return;
  const caster = agentCompiler(agent);
  const name = agent.name;
  for (const scene of game.scenes) {
    const ids = scene.tokens.filter(t => t.actorId === agent.id).map(t => t.id);
    if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
  }
  await agent.delete({ ghostwireDecompile: true });
  await syncRoster(caster);
  refreshSheets(caster);
  if (!silent) ui.notifications.info(game.i18n.format(`${UI}.Decompiled`, { agent: name }));
}

/**
 * Command is the Compile Agent maneuver at the table (not a second spawn).
 * Opens the existing Compile Agent sheet handle; does not call compileAgent.
 * @returns {Promise<Item|null>}
 */
export async function commandAgent(agent, { notify = true } = {}) {
  const caster = agentCompiler(agent);
  const ability = compileAbility(caster);
  if (!ability) {
    if (notify) ui.notifications.warn(game.i18n.localize(`${UI}.CommandMissing`));
    return null;
  }
  await ability.sheet?.render({ force: true });
  if (notify) {
    ui.notifications.info(game.i18n.format(`${UI}.CommandHint`, {
      agent: agent?.name ?? "",
      name: caster?.name ?? "",
    }));
  }
  return ability;
}

/** Decompile the whole roster — the free maneuver, and what end of encounter does on its own. */
export async function decompileAllAgents(caster, { silent = false } = {}) {
  const agents = compiledAgents(caster);
  for (const agent of agents) await decompileAgent(agent, { silent: true });
  await syncRoster(caster);
  refreshSheets(caster);
  if (!silent && agents.length) ui.notifications.info(game.i18n.format(`${UI}.DecompiledAll`, { name: caster.name, count: agents.length }));
  return agents.length;
}

/**
 * Re-stamp a live roster to the caster's current level: Stamina in place, or swap the Actor when the band moved.
 */
export async function refreshAgents(caster, { silent = false } = {}) {
  const agents = compiledAgents(caster);
  if (!agents.length) return 0;
  const level = casterLevel(caster);
  const band = agentBand(level);
  const canSwap = !!canvas.scene && game.user.can("ACTOR_CREATE") && game.user.can("TOKEN_CREATE")
    && (agentCap(caster) >= agents.length);
  let changed = 0;
  let deferred = 0;
  for (const agent of agents) {
    const archetype = agent.getFlag(MODULE_ID, "archetype");
    if (!ARCHETYPES.includes(archetype)) continue;
    const stamina = agentStamina(archetype, band, caster);
    const sameBand = agent.getFlag(MODULE_ID, "hybridTier") === band;
    if (!sameBand && !canSwap) { deferred++; continue; }
    if (sameBand) {
      if ((agent.system.stamina.max === stamina) && (agent.getFlag(MODULE_ID, "compiledAtLevel") === level)) continue;
      const gain = Math.max(0, stamina - agent.system.stamina.max);
      await agent.update({
        "system.stamina.max": stamina,
        "system.stamina.value": Math.min(stamina, agent.system.stamina.value + gain),
        "system.characteristics.reason.value": casterLogic(caster),
        "system.monster.level": level,
        [`flags.${MODULE_ID}.compiledAtLevel`]: level,
      });
    } else {
      const token = agent.getActiveTokens()[0]?.document;
      const position = token ? { x: token.x, y: token.y } : null;
      await decompileAgent(agent, { silent: true });
      await compileAgent(caster, { archetype, position, silent: true, skipSpend: true });
    }
    changed++;
  }
  if (deferred) ui.notifications.warn(game.i18n.format(`${UI}.RefreshDeferred`, { name: caster.name, count: deferred }));
  if (changed && !silent) {
    ui.notifications.info(game.i18n.format(`${UI}.Refreshed`, {
      name: caster.name, count: changed, level, band: game.i18n.localize(`${UI}.Band.${band}`),
    }));
  }
  return changed;
}

function liveCompilePlan(caster) {
  return sheetUseCompilePlan({
    hacker: isHacker(caster),
    state: actorWiredState(caster),
    count: compiledAgents(caster).length,
    cap: agentCap(caster),
    hasScene: !!canvas.scene,
    canCreate: game.user.can("ACTOR_CREATE") && game.user.can("TOKEN_CREATE"),
  });
}

function warnPlan(caster, gate) {
  return warn(gate, {
    name: caster?.name,
    cap: agentCap(caster),
    count: compiledAgents(caster).length,
    state: game.i18n.localize(`GHOSTWIRE.Wired.States.${actorWiredState(caster)}`),
  });
}

/**
 * Abilities-tab Use: pick archetype (under cap) then power-roll, then place the token.
 * Stock Use already spends Compile Agent's 3 Bandwidth, so compileAgent skipSpend.
 * At cap, Use is the command roll only — no second Agent.
 */
async function useCompileFromSheet(model, use, config, dialogOptions, messageOptions) {
  const caster = model.actor;
  const plan = liveCompilePlan(caster);
  if (plan.mode === "refuse") return warnPlan(caster, plan.gate);

  let archetype;
  if (plan.mode === "compile") {
    archetype = await promptArchetype(caster, agentBand(casterLevel(caster)));
    if (!ARCHETYPES.includes(archetype)) return null;
  }

  const message = await use.call(model, config, dialogOptions, messageOptions);
  if (!message) return message;
  if (plan.mode === "compile") await compileAgent(caster, { archetype, skipSpend: true });
  return message;
}

/** Abilities-tab Use of Decompile Agent: pick a target (or all), then dismiss after the card posts. */
async function useDecompileFromSheet(model, use, config, dialogOptions, messageOptions) {
  const caster = model.actor;
  const target = await promptDecompileTarget(caster);
  if (!target) return null;
  const message = await use.call(model, config, dialogOptions, messageOptions);
  if (!message) return message;
  if (target === "all") await decompileAllAgents(caster);
  else await decompileAgent(target);
  return message;
}

function patchAbilityUse() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? ds.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; Compile Agent sheet Use will not place a token`);
    return;
  }
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    const item = this.parent;
    if (isCompileAbility(item)) return useCompileFromSheet(this, use, config, dialogOptions, messageOptions);
    if (isDecompileAbility(item)) return useDecompileFromSheet(this, use, config, dialogOptions, messageOptions);
    return use.call(this, config, dialogOptions, messageOptions);
  };
}

export function registerAgents() {
  patchAbilityUse();
  Hooks.on("getDocumentListContextOptions", (app, menuItems) => {
    if (typeof app._getEmbeddedDocument !== "function") return;
    const compile = target => {
      const item = app._getEmbeddedDocument(target);
      return (isCompileAbility(item) && item.isOwner) ? item : null;
    };
    const decompile = target => {
      const item = app._getEmbeddedDocument(target);
      return (isDecompileAbility(item) && item.isOwner) ? item : null;
    };
    menuItems.push(
      {
        label: `${UI}.Compile`, icon: "fa-solid fa-microchip",
        visible: target => !!compile(target),
        onClick: (event, target) => compileAgent(compile(target)?.parent),
      },
      {
        label: `${UI}.DecompileAll`, icon: "fa-solid fa-xmark",
        visible: target => {
          const item = compile(target) ?? decompile(target);
          return !!item && (compiledAgents(item.parent).length > 0);
        },
        onClick: (event, target) => decompileAllAgents((compile(target) ?? decompile(target))?.parent),
      },
    );
  });

  Hooks.on("renderDrawSteelItemSheet", (app, element) => {
    const item = app.document;
    element.querySelector(".ghostwire-agent-controls")?.remove();
    if (!isCompileAbility(item) && !isDecompileAbility(item)) return;
    const header = element.querySelector(".sheet-header .header-center") ?? element.querySelector(".sheet-header");
    if (!header) return;

    const caster = item.parent;
    const cap = agentCap(caster);
    const agents = compiledAgents(caster);
    const band = agentBand(casterLevel(caster));

    const controls = document.createElement("div");
    controls.className = "ghostwire-agent-controls flexcol";
    const status = document.createElement("span");
    status.className = "hint";
    status.textContent = game.i18n.format(`${UI}.Status`, {
      count: agents.length, cap, level: casterLevel(caster), band: game.i18n.localize(`${UI}.Band.${band}`),
    });

    const row = document.createElement("div");
    row.className = "flexrow";
    if (isCompileAbility(item)) {
      const compile = document.createElement("button");
      compile.type = "button";
      compile.innerHTML = `<i class="fa-solid fa-microchip"></i> ${game.i18n.localize(`${UI}.Compile`)}`;
      compile.disabled = !item.isOwner || (agents.length >= cap);
      compile.addEventListener("click", async event => {
        event.preventDefault();
        compile.disabled = true;
        try { await compileAgent(caster); } finally { refreshSheets(caster); }
      });
      row.append(compile);
    }

    if (agents.length) {
      const dismissAll = document.createElement("button");
      dismissAll.type = "button";
      dismissAll.innerHTML = `<i class="fa-solid fa-xmark"></i> ${game.i18n.localize(`${UI}.DecompileAll`)}`;
      dismissAll.disabled = !item.isOwner;
      dismissAll.addEventListener("click", async event => {
        event.preventDefault();
        dismissAll.disabled = true;
        try { await decompileAllAgents(caster); } finally { refreshSheets(caster); }
      });
      row.append(dismissAll);
    }
    controls.append(status, row);

    for (const agent of agents) {
      const line = document.createElement("div");
      line.className = "flexrow";
      const label = document.createElement("span");
      label.className = "hint";
      label.textContent = `${agent.name} — ${agent.system.stamina.value} / ${agent.system.stamina.max}`;
      const dismiss = document.createElement("button");
      dismiss.type = "button";
      dismiss.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
      dismiss.dataset.tooltip = game.i18n.localize(`${UI}.Decompile`);
      dismiss.disabled = !item.isOwner;
      dismiss.addEventListener("click", async event => {
        event.preventDefault();
        dismiss.disabled = true;
        try { await decompileAgent(agent); } finally { refreshSheets(caster); }
      });
      line.append(label, dismiss);
      controls.append(line);
    }
    header.append(controls);
  });

  Hooks.on("updateActor", async (actor, changes) => {
    if (!game.users.activeGM?.isSelf) return;
    if (actor.getFlag(MODULE_ID, "kind") !== "agent") return;
    const value = foundry.utils.getProperty(changes, "system.stamina.value");
    if ((value === undefined) || (value > 0)) return;
    ui.notifications.warn(game.i18n.format(`${UI}.Destroyed`, { agent: actor.name }));
    await decompileAgent(actor, { silent: true });
  });

  Hooks.on("deleteActor", async (actor, options, userId) => {
    if ((userId !== game.user.id) || options.ghostwireDecompile) return;
    if (actor.getFlag(MODULE_ID, "kind") !== "agent") return;
    for (const scene of game.scenes) {
      const ids = scene.tokens.filter(t => t.actorId === actor.id).map(t => t.id);
      if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
    }
    const caster = agentCompiler(actor);
    await syncRoster(caster);
    refreshSheets(caster);
  });

  Hooks.on("deleteCombat", async () => {
    if (!game.users.activeGM?.isSelf) return;
    for (const caster of game.actors.filter(isHacker)) await decompileAllAgents(caster, { silent: true });
  });

  Hooks.on("updateItem", async (item, changes, options, userId) => {
    if ((userId !== game.user.id) || (item.type !== "class") || (item.system._dsid !== "hacker")) return;
    if (foundry.utils.getProperty(changes, "system.level") === undefined) return;
    await refreshAgents(item.parent);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      compileAgent, decompileAgent, decompileAllAgents, refreshAgents, commandAgent,
      compiledAgents, agentCompiler, agentCap, agentBand, agentStamina, compileAbility,
      compileAllowedAtState, actorWiredState, compileAgentGate, sheetUseCompilePlan, COMPILE_BANDWIDTH,
    };
  }
  console.log(`${MODULE_ID} | Agents: Compile / Decompile registered (sheet Use, hero sheet row menu, Compile Agent item sheet)`);
}
