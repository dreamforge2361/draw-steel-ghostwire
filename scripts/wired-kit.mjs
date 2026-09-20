// Wire Kit — Matrix Verbs (B115, B117).
// Heroes already get SHEET_VERBS via ds.CONFIG.hero.defaultItems. NPCs do not.
// Dropping this feature (Ghostwire Matrix › Support) onto an NPC stamps Connect / Jack Out / Toggle.
// Scan / Ping / Navigate fire from the Wired Console (B117). Meat-only opposition stays clean. No bestiary default.

import { MATRIX_VERBS, SHEET_VERBS, WIRE_KIT_DSID, WIRE_KIT_UUID } from "./wired-verbs.mjs";

const MODULE_ID = "draw-steel-ghostwire";

export const isWireKit = item =>
  item?.system?._dsid === WIRE_KIT_DSID
  || item?.flags?.[MODULE_ID]?.kind === "wire-kit"
  || item?.getFlag?.(MODULE_ID, "kind") === "wire-kit";

export const isWireKitVerb = item =>
  item?.type === "ability"
  && !!(item?.flags?.[MODULE_ID]?.wireKitGranted || item?.getFlag?.(MODULE_ID, "wireKitGranted"));

const actorHasKit = actor => [...(actor?.items ?? [])].some(isWireKit);

function ownedDsids(actor) {
  return new Set([...(actor?.items ?? [])].map(i => i.system?._dsid).filter(Boolean));
}

/**
 * Copy missing sheet Matrix Verbs (Connect / Jack Out / Toggle) onto an actor. Idempotent.
 * Flags copies `wireKitGranted`. Scan / Ping / Navigate fire from the Wired Console (B117).
 * @returns {Promise<number>} how many abilities were created
 */
export async function grantMatrixVerbs(actor, { notify = false } = {}) {
  if (!actor) return 0;
  const verbs = (await Promise.all(SHEET_VERBS.map(uuid => fromUuid(uuid)))).filter(Boolean);
  if (verbs.length !== SHEET_VERBS.length) {
    console.warn(`${MODULE_ID} | Some sheet Matrix Verbs are missing from the abilities pack`);
  }
  const owned = ownedDsids(actor);
  const missing = verbs.filter(v => !owned.has(v.system._dsid)).map(v => {
    const data = game.items.fromCompendium(v, { clearFolder: true });
    foundry.utils.setProperty(data, `flags.${MODULE_ID}.wireKitGranted`, true);
    return data;
  });
  if (missing.length) await actor.createEmbeddedDocuments("Item", missing);
  if (notify && missing.length) {
    ui.notifications.info(game.i18n.format("GHOSTWIRE.WiredKit.Granted", { actor: actor.name, count: missing.length }));
  }
  return missing.length;
}

async function kitSource() {
  const source = await fromUuid(WIRE_KIT_UUID);
  if (!source) {
    console.warn(`${MODULE_ID} | Wire Kit is missing from the matrix pack (${WIRE_KIT_UUID})`);
    return null;
  }
  const data = game.items.fromCompendium(source, { clearFolder: true });
  foundry.utils.setProperty(data, `flags.${MODULE_ID}.kind`, "wire-kit");
  return data;
}

/**
 * Stamp Wire Kit + Matrix Verbs onto an NPC (or any non-hero). Heroes already have verbs.
 * Idempotent: a second click does not duplicate.
 */
export async function addWireKit(actor, { notify = true } = {}) {
  if (!actor) return { kit: false, verbs: 0 };
  if (!game.user.isGM && !actor.isOwner) return { kit: false, verbs: 0 };

  if (actor.type === "hero") {
    if (notify) ui.notifications.info(game.i18n.format("GHOSTWIRE.WiredKit.HeroSkip", { actor: actor.name }));
    return { kit: false, verbs: 0 };
  }

  let kit = false;
  if (!actorHasKit(actor)) {
    const data = await kitSource();
    if (data) {
      await actor.createEmbeddedDocuments("Item", [data], { ghostwireWireKit: true });
      kit = true;
    }
  }
  const verbs = await grantMatrixVerbs(actor, { notify: false });
  if (notify) {
    if (kit || verbs) ui.notifications.info(game.i18n.format("GHOSTWIRE.WiredKit.Granted", { actor: actor.name, count: verbs }));
    else ui.notifications.info(game.i18n.format("GHOSTWIRE.WiredKit.Already", { actor: actor.name }));
  }
  return { kit, verbs };
}

/** Remove kit-granted verbs when the kit item leaves the sheet. Manual verbs stay. */
export async function revokeWireKitVerbs(actor) {
  if (!actor || actorHasKit(actor)) return 0;
  const granted = [...actor.items].filter(isWireKitVerb);
  if (!granted.length) return 0;
  await actor.deleteEmbeddedDocuments("Item", granted.map(i => i.id));
  return granted.length;
}

/** Selected canvas tokens that can take a Wire Kit (NPC actors). */
export function selectedKitTargets() {
  return [...(canvas?.tokens?.controlled ?? [])]
    .map(token => token.actor)
    .filter(actor => actor && actor.type !== "hero");
}

export async function addWireKitToSelected() {
  if (!game.user.isGM) return [];
  const targets = selectedKitTargets();
  if (!targets.length) {
    ui.notifications.warn(game.i18n.localize("GHOSTWIRE.WiredKit.NoSelection"));
    return [];
  }
  const results = [];
  const seen = new Set();
  for (const actor of targets) {
    if (seen.has(actor.id)) continue;
    seen.add(actor.id);
    results.push({ actor: actor.name, ...(await addWireKit(actor)) });
  }
  return results;
}

export function registerWiredKit() {
  Hooks.on("createItem", (item, options, userId) => {
    if (userId !== game.user.id || options.ghostwireWireKit) return;
    const actor = item.parent;
    if (!(actor instanceof Actor) || actor.type === "hero") return;
    if (!isWireKit(item)) return;
    grantMatrixVerbs(actor, { notify: true });
  });

  Hooks.on("deleteItem", (item, options, userId) => {
    if (userId !== game.user.id) return;
    const actor = item.parent;
    if (!(actor instanceof Actor) || !isWireKit(item)) return;
    revokeWireKitVerbs(actor);
  });

  Hooks.on("renderTokenHUD", (hud, html) => {
    if (!game.user.isGM) return;
    const actor = hud.object?.actor;
    if (!actor || actor.type === "hero") return;
    const root = html?.rootElement ?? html?.[0] ?? html;
    if (!root?.querySelector) return;
    const col = root.querySelector(".col.right") ?? root.querySelector(".right");
    if (!col || col.querySelector(".ghostwire-wire-kit")) return;
    const btn = document.createElement("div");
    btn.className = "control-icon ghostwire-wire-kit";
    btn.dataset.tooltip = game.i18n.localize("GHOSTWIRE.WiredKit.Hud");
    btn.innerHTML = `<i class="fa-solid fa-network-wired"></i>`;
    btn.addEventListener("click", event => {
      event.preventDefault();
      addWireKit(actor);
    });
    col.appendChild(btn);
  });

  Hooks.once("ready", () => {
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        addWireKit,
        addWireKitToSelected,
        grantMatrixVerbs,
        WIRE_KIT_UUID,
        MATRIX_VERBS,
        SHEET_VERBS,
      };
    }
  });
}
