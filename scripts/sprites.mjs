// Technomancer sprites: Compile / Decompile, the summoner twin of the Wrench's Deploy / Recall in machines.mjs
// (docs/raw/20-technomancer.md, docs/spikes/B52-TECHNOMANCER-ABILITIES-SPRITES.md).
//
// A sprite has no Item side — it is conjured from Resonance, not bought — so the Compile Sprite *ability* is the
// sheet-side handle. Compiling stamps one of the twelve band Actors from Ghostwire Summons & Machines › Sprites into
// a linked world Actor, re-stamps its Stamina from the live caster, and places a token beside them. The link lives
// in flags on both sides:
// - Sprite Actor: flags.<module> = { kind: "sprite", archetype, hybridTier, compiler: <actorUuid>, dsid, compiledAtLevel }
// - Technomancer: flags.<module>.compiledSprite = { uuids: [...] } — a roster mirror for macros and trackers. The
//   world scan by `compiler` is what actually decides the cap, so a hand-deleted sprite can never wedge it.
//
// Level scaling is the point of the feature: band, Stamina and the sprite's own attack all come from the caster's
// *current* level, and a level-up while the congregation is out re-compiles it into the right band.

const MODULE_ID = "draw-steel-ghostwire";
const PACK_ID = `${MODULE_ID}.summons`;
const UI = "GHOSTWIRE.Summons.Sprites.UI";

const COMPILE_DSID = "compile-sprite";
const ARCHETYPES = ["data", "attack", "machine", "ward"];

// Sprite Stat Block Reference (20-technomancer.md): Stamina = archetype base + (Logic × level), per band.
// These must match the shipped templates in src/packs/summons/sprites/.
const STAMINA_BASE = {
  data: { minor: 8, intermediate: 14, advanced: 20 },
  attack: { minor: 12, intermediate: 18, advanced: 26 },
  machine: { minor: 10, intermediate: 16, advanced: 22 },
  ward: { minor: 10, intermediate: 16, advanced: 22 },
};

/** The hybrid band a Technomancer of this level compiles into: minor L1–3, intermediate L4–7, advanced L8–10. */
export function spriteBand(level) {
  if (level >= 8) return "advanced";
  if (level >= 4) return "intermediate";
  return "minor";
}

const isTechnomancer = actor => (actor?.type === "hero") && (actor.system.class?.system._dsid === "technomancer");
const isSpriteWeaver = actor => [...(actor?.system.subclasses ?? [])].some(s => s.system._dsid === "sprite-weaver");
const casterLevel = actor => Number(actor?.system.level) || 1;
/** Logic is the Draw Steel Reason characteristic under a Ghostwire name. */
const casterLogic = actor => Number(actor?.system.characteristics?.reason?.value) || 0;

/** The hero's Compile Sprite ability: the sheet-side handle for the whole congregation. */
export const compileAbility = actor =>
  actor?.items.find(i => (i.type === "ability") && (i.system._dsid === COMPILE_DSID)) ?? null;
const isCompileAbility = item =>
  (item?.type === "ability") && (item.system?._dsid === COMPILE_DSID) && isTechnomancer(item.parent);

/**
 * How many sprites this Technomancer may command at once.
 * Caps never stack (20-technomancer.md): every feature *sets* the cap, so take the single highest one earned.
 */
export function spriteCap(actor) {
  const level = casterLevel(actor);
  let cap = 2;                                   // 1st level baseline
  if (level >= 5) cap = 3;                       // baseline, all disciplines
  if (level >= 8) cap = 4;                       // baseline, all disciplines
  if (isSpriteWeaver(actor)) {
    let weaver = 3;                              // 1st: Wide Compile
    if (level >= 5) weaver = 4;                  // 5th: The Widening Gyre
    if (level >= 7) weaver = 5;                  // 7th: Legion of the Current
    if (level >= 8) weaver = 6;                  // 8th: Unbroken Congregation
    cap = Math.max(cap, weaver);
  }
  return cap;
}

/** Stamina for a sprite of this archetype and band compiled by this caster, right now. */
export function spriteStamina(archetype, band, actor) {
  return (STAMINA_BASE[archetype]?.[band] ?? 10) + (casterLogic(actor) * casterLevel(actor));
}

/** Every sprite currently compiled by this Technomancer. The world is the source of truth, so deletes self-heal. */
export function compiledSprites(actor) {
  if (!actor?.uuid) return [];
  return game.actors.filter(a => (a.getFlag(MODULE_ID, "kind") === "sprite") && (a.getFlag(MODULE_ID, "compiler") === actor.uuid));
}

/** The Technomancer who compiled a sprite Actor, or null. */
export function spriteCompiler(sprite) {
  const uuid = (sprite?.getFlag(MODULE_ID, "kind") === "sprite") ? sprite.getFlag(MODULE_ID, "compiler") : null;
  const actor = uuid ? fromUuidSync(uuid) : null;
  return actor instanceof Actor ? actor : null;
}

/** Mirror the live roster onto the caster so macros and trackers can read it without a world scan. */
async function syncRoster(actor) {
  if (!actor?.isOwner) return;
  const uuids = compiledSprites(actor).map(s => s.uuid).sort();
  const current = [...(actor.getFlag(MODULE_ID, "compiledSprite")?.uuids ?? [])].sort();
  if (uuids.join("|") !== current.join("|")) await actor.setFlag(MODULE_ID, "compiledSprite", { uuids });
}

// The roster lives on the Actor, so the Compile Sprite Item sheet has to be told to redraw itself.
function refreshSheets(actor) {
  const ability = compileAbility(actor);
  if (ability?.sheet?.rendered) ability.sheet.render();
}

async function templateFor(archetype, band) {
  const pack = game.packs.get(PACK_ID);
  if (!pack) return null;
  const index = await pack.getIndex({ fields: [`flags.${MODULE_ID}.dsid`] });
  const dsid = `sprite-${archetype}-${band}`;
  const entry = index.find(e => foundry.utils.getProperty(e, `flags.${MODULE_ID}.dsid`) === dsid);
  return entry ? pack.getDocument(entry._id) : null;
}

async function compileFolder() {
  const name = game.i18n.localize(`${UI}.Folder`);
  return game.folders.find(f => (f.type === "Actor") && f.getFlag(MODULE_ID, "compiledSprites"))
    ?? Folder.create({ name, type: "Actor", flags: { [MODULE_ID]: { compiledSprites: true } } });
}

// A ring of squares around the caster, so a congregation of 2–6 doesn't stack on one tile.
const RING = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

function placement(caster, index) {
  const grid = canvas.grid.size;
  const token = caster?.getActiveTokens?.()[0]?.document;
  const [dx, dy] = RING[index % RING.length];
  if (token) return { x: token.x + (dx * Math.max(token.width, 1) * grid), y: token.y + (dy * Math.max(token.height, 1) * grid) };
  const { x, y } = canvas.stage.pivot;
  return { x: (Math.round(x / grid) + dx) * grid, y: (Math.round(y / grid) + dy) * grid };
}

/** The archetype picker: one dialog, with the band and the Stamina it will stamp shown up front. */
async function promptArchetype(caster, band) {
  const options = ARCHETYPES.map((archetype, index) => {
    const label = game.i18n.localize(`${UI}.Archetype.${archetype}`);
    const line = game.i18n.format(`${UI}.ArchetypeLine`, {
      stamina: spriteStamina(archetype, band, caster),
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
    })}</p><div class="form-group"><label>${game.i18n.localize(`${UI}.ArchetypeLabel`)}</label>`
      + `<select name="archetype">${options.join("")}</select></div>`,
    ok: { label: game.i18n.localize(`${UI}.Compile`), callback: (event, button) => button.form.elements.archetype.value },
    rejectClose: false,
  });
}

/**
 * Compile one sprite for a Technomancer: band from their current level, Stamina stamped from live Logic × level.
 * @param {Actor} caster                  The Technomancer.
 * @param {object} [options]
 * @param {string} [options.archetype]    data | attack | machine | ward; prompts when omitted.
 * @param {object} [options.position]     {x, y} to place the token at, instead of the ring beside the caster.
 * @param {boolean} [options.silent]      Skip the "compiled" notification (used by the level refresh).
 * @returns {Promise<Actor|null>}
 */
export async function compileSprite(caster, { archetype, position, silent = false } = {}) {
  if (!isTechnomancer(caster)) return ui.notifications.warn(game.i18n.localize(`${UI}.NotTechnomancer`));
  if (!canvas.scene) return ui.notifications.warn(game.i18n.localize(`${UI}.NoScene`));
  if (!game.user.can("ACTOR_CREATE") || !game.user.can("TOKEN_CREATE")) return ui.notifications.warn(game.i18n.localize(`${UI}.NoPermission`));

  const cap = spriteCap(caster);
  const current = compiledSprites(caster);
  if (current.length >= cap) {
    ui.notifications.warn(game.i18n.format(`${UI}.AtCap`, { name: caster.name, cap, count: current.length }));
    return null;
  }

  const level = casterLevel(caster);
  const band = spriteBand(level);
  archetype ??= await promptArchetype(caster, band);
  if (!ARCHETYPES.includes(archetype)) return null;

  const template = await templateFor(archetype, band);
  if (!template) return ui.notifications.error(game.i18n.format(`${UI}.NoTemplate`, { dsid: `sprite-${archetype}-${band}` }));

  const stamina = spriteStamina(archetype, band, caster);
  // The Technomancer's players own their sprites, so they can move the tokens and track Stamina themselves.
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
      kind: "sprite", archetype, hybridTier: band, compiler: caster.uuid,
      dsid: `sprite-${archetype}-${band}`, compiledAtLevel: level,
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
      sprite: actor.name, stamina, count: current.length + 1, cap,
      band: game.i18n.localize(`${UI}.Band.${band}`),
    }));
  }
  return actor;
}

/** Decompile one sprite: delete its tokens on every Scene, then the Actor. */
export async function decompileSprite(sprite, { silent = false } = {}) {
  if (!(sprite instanceof Actor)) return;
  const caster = spriteCompiler(sprite);
  const name = sprite.name;
  for (const scene of game.scenes) {
    const ids = scene.tokens.filter(t => t.actorId === sprite.id).map(t => t.id);
    if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
  }
  await sprite.delete({ ghostwireDecompile: true });
  await syncRoster(caster);
  refreshSheets(caster);
  if (!silent) ui.notifications.info(game.i18n.format(`${UI}.Decompiled`, { sprite: name }));
}

/** Decompile the whole congregation — the free maneuver, and what end of encounter does on its own. */
export async function decompileAll(caster, { silent = false } = {}) {
  const sprites = compiledSprites(caster);
  for (const sprite of sprites) await decompileSprite(sprite, { silent: true });
  await syncRoster(caster);
  refreshSheets(caster);
  if (!silent && sprites.length) ui.notifications.info(game.i18n.format(`${UI}.DecompiledAll`, { name: caster.name, count: sprites.length }));
  return sprites.length;
}

/**
 * Bring a live congregation back in line with the caster's current level: re-stamp Stamina, and re-compile any
 * sprite whose band has moved, so a 4th-level Technomancer never fights on 3rd-level sprite math.
 */
export async function refreshSprites(caster, { silent = false } = {}) {
  const sprites = compiledSprites(caster);
  if (!sprites.length) return 0;
  const level = casterLevel(caster);
  const band = spriteBand(level);
  // A band change swaps the whole stat block, so it deletes one Actor and creates another. Only attempt it when
  // that second half is certain to succeed — a decompile we can't undo would silently eat the congregation.
  const canSwap = !!canvas.scene && game.user.can("ACTOR_CREATE") && game.user.can("TOKEN_CREATE")
    && (spriteCap(caster) >= sprites.length);
  let changed = 0;
  let deferred = 0;
  for (const sprite of sprites) {
    const archetype = sprite.getFlag(MODULE_ID, "archetype");
    if (!ARCHETYPES.includes(archetype)) continue;
    const stamina = spriteStamina(archetype, band, caster);
    const sameBand = sprite.getFlag(MODULE_ID, "hybridTier") === band;
    if (!sameBand && !canSwap) { deferred++; continue; }
    if (sameBand) {
      if ((sprite.system.stamina.max === stamina) && (sprite.getFlag(MODULE_ID, "compiledAtLevel") === level)) continue;
      // Keep damage already taken: the pool grows by exactly as much as the maximum did.
      const gain = Math.max(0, stamina - sprite.system.stamina.max);
      await sprite.update({
        "system.stamina.max": stamina,
        "system.stamina.value": Math.min(stamina, sprite.system.stamina.value + gain),
        "system.characteristics.reason.value": casterLogic(caster),
        "system.monster.level": level,
        [`flags.${MODULE_ID}.compiledAtLevel`]: level,
      });
    } else {
      const token = sprite.getActiveTokens()[0]?.document;
      const position = token ? { x: token.x, y: token.y } : null;
      await decompileSprite(sprite, { silent: true });
      await compileSprite(caster, { archetype, position, silent: true });
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

export function registerSprites() {
  // Hero sheet: right-click the Compile Sprite row (or its ⋮ control) → Compile Sprite / Decompile All.
  Hooks.on("getDocumentListContextOptions", (app, menuItems) => {
    if (typeof app._getEmbeddedDocument !== "function") return;
    const ability = target => {
      const item = app._getEmbeddedDocument(target);
      return (isCompileAbility(item) && item.isOwner) ? item : null;
    };
    menuItems.push(
      {
        label: `${UI}.Compile`, icon: "fa-solid fa-diagram-project",
        visible: target => !!ability(target),
        onClick: (event, target) => compileSprite(ability(target)?.parent),
      },
      {
        label: `${UI}.DecompileAll`, icon: "fa-solid fa-xmark",
        visible: target => { const item = ability(target); return !!item && (compiledSprites(item.parent).length > 0); },
        onClick: (event, target) => decompileAll(ability(target)?.parent),
      },
    );
  });

  // Compile Sprite Item sheet: the congregation roster, a Compile button, and a ✕ per sprite (rebuilt every render).
  Hooks.on("renderDrawSteelItemSheet", (app, element) => {
    const item = app.document;
    element.querySelector(".ghostwire-sprite-controls")?.remove();
    if (!isCompileAbility(item)) return;
    const header = element.querySelector(".sheet-header .header-center") ?? element.querySelector(".sheet-header");
    if (!header) return;

    const caster = item.parent;
    const cap = spriteCap(caster);
    const sprites = compiledSprites(caster);
    const band = spriteBand(casterLevel(caster));

    const controls = document.createElement("div");
    controls.className = "ghostwire-sprite-controls flexcol";
    const status = document.createElement("span");
    status.className = "hint";
    status.textContent = game.i18n.format(`${UI}.Status`, {
      count: sprites.length, cap, level: casterLevel(caster), band: game.i18n.localize(`${UI}.Band.${band}`),
    });

    const row = document.createElement("div");
    row.className = "flexrow";
    const compile = document.createElement("button");
    compile.type = "button";
    compile.innerHTML = `<i class="fa-solid fa-diagram-project"></i> ${game.i18n.localize(`${UI}.Compile`)}`;
    compile.disabled = !item.isOwner || (sprites.length >= cap);
    compile.addEventListener("click", async event => {
      event.preventDefault();
      compile.disabled = true;
      try { await compileSprite(caster); } finally { refreshSheets(caster); }
    });
    row.append(compile);

    if (sprites.length) {
      const dismissAll = document.createElement("button");
      dismissAll.type = "button";
      dismissAll.innerHTML = `<i class="fa-solid fa-xmark"></i> ${game.i18n.localize(`${UI}.DecompileAll`)}`;
      dismissAll.disabled = !item.isOwner;
      dismissAll.addEventListener("click", async event => {
        event.preventDefault();
        dismissAll.disabled = true;
        try { await decompileAll(caster); } finally { refreshSheets(caster); }
      });
      row.append(dismissAll);
    }
    controls.append(status, row);

    for (const sprite of sprites) {
      const line = document.createElement("div");
      line.className = "flexrow";
      const label = document.createElement("span");
      label.className = "hint";
      label.textContent = `${sprite.name} — ${sprite.system.stamina.value} / ${sprite.system.stamina.max}`;
      const dismiss = document.createElement("button");
      dismiss.type = "button";
      dismiss.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
      dismiss.dataset.tooltip = game.i18n.localize(`${UI}.Decompile`);
      dismiss.disabled = !item.isOwner;
      dismiss.addEventListener("click", async event => {
        event.preventDefault();
        dismiss.disabled = true;
        try { await decompileSprite(sprite); } finally { refreshSheets(caster); }
      });
      line.append(label, dismiss);
      controls.append(line);
    }
    header.append(controls);
  });

  // A sprite at 0 Stamina is destroyed, and a destroyed sprite decompiles (20-technomancer.md, Decompile Rules).
  // Deleting an Actor is a GM right, so exactly one GM client does it however the damage was applied.
  Hooks.on("updateActor", async (actor, changes) => {
    if (!game.users.activeGM?.isSelf) return;
    if (actor.getFlag(MODULE_ID, "kind") !== "sprite") return;
    const value = foundry.utils.getProperty(changes, "system.stamina.value");
    if ((value === undefined) || (value > 0)) return;
    ui.notifications.warn(game.i18n.format(`${UI}.Destroyed`, { sprite: actor.name }));
    await decompileSprite(actor, { silent: true });
  });

  // Deleting a sprite Actor by hand (or from its token) still has to free a slot on the caster's roster.
  Hooks.on("deleteActor", async (actor, options, userId) => {
    if ((userId !== game.user.id) || options.ghostwireDecompile) return;
    if (actor.getFlag(MODULE_ID, "kind") !== "sprite") return;
    for (const scene of game.scenes) {
      const ids = scene.tokens.filter(t => t.actorId === actor.id).map(t => t.id);
      if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
    }
    const caster = spriteCompiler(actor);
    await syncRoster(caster);
    refreshSheets(caster);
  });

  // End of encounter: the congregation doesn't persist between fights, so the next Compile picks the current band.
  Hooks.on("deleteCombat", async () => {
    if (!game.users.activeGM?.isSelf) return;
    for (const caster of game.actors.filter(isTechnomancer)) await decompileAll(caster, { silent: true });
  });

  // A level-up mid-session must not leave the old band's math on the table.
  Hooks.on("updateItem", async (item, changes, options, userId) => {
    if ((userId !== game.user.id) || (item.type !== "class") || (item.system._dsid !== "technomancer")) return;
    if (foundry.utils.getProperty(changes, "system.level") === undefined) return;
    await refreshSprites(item.parent);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      compileSprite, decompileSprite, decompileAll, refreshSprites,
      compiledSprites, spriteCompiler, spriteCap, spriteBand, spriteStamina, compileAbility,
    };
  }
  console.log(`${MODULE_ID} | Sprites: Compile / Decompile registered (hero sheet row menu and Compile Sprite item sheet)`);
}
