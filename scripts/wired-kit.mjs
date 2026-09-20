// Wire Kit — Matrix Verbs (B115, B117).
// Dropping this feature (Ghostwire Matrix › Support) onto an NPC marks them Wire-capable.
// It does not stamp Matrix Verb abilities — all nine fire from the node applet (B117).
// Heroes use the same applet. Meat-only opposition stays clean. No bestiary default.

import { MATRIX_VERBS, WIRE_KIT_DSID, WIRE_KIT_UUID } from "./wired-verbs.mjs";

const MODULE_ID = "draw-steel-ghostwire";

export const isWireKit = item =>
  item?.system?._dsid === WIRE_KIT_DSID
  || item?.flags?.[MODULE_ID]?.kind === "wire-kit"
  || item?.getFlag?.(MODULE_ID, "kind") === "wire-kit";

export const isWireKitVerb = item =>
  item?.type === "ability"
  && !!(item?.flags?.[MODULE_ID]?.wireKitGranted || item?.getFlag?.(MODULE_ID, "wireKitGranted"));

const actorHasKit = actor => [...(actor?.items ?? [])].some(isWireKit);

/**
 * B117: Matrix Verbs live on the node applet. Wire Kit does not stamp abilities.
 * @returns {Promise<number>} always 0
 */
export async function grantMatrixVerbs() {
  return 0;
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
 * Stamp Wire Kit onto an NPC (or any non-hero). Does not copy Matrix Verb abilities.
 * Idempotent: a second click does not duplicate the kit feature.
 */
export async function addWireKit(actor, { notify = true } = {}) {
  if (!actor) return { kit: false, verbs: 0 };
  if (!game.user.isGM && !actor.isOwner) return { kit: false, verbs: 0 };
  if (actor.getFlag(MODULE_ID, "kind") === "node") return { kit: false, verbs: 0 };

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
  if (notify) {
    if (kit) ui.notifications.info(game.i18n.format("GHOSTWIRE.WiredKit.Granted", { actor: actor.name }));
    else ui.notifications.info(game.i18n.format("GHOSTWIRE.WiredKit.Already", { actor: actor.name }));
  }
  return { kit, verbs: 0 };
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
    .filter(actor => actor && actor.type !== "hero" && actor.getFlag(MODULE_ID, "kind") !== "node");
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
    // B117: kit marks Wire-capable NPCs. Verbs fire from the node applet — do not stamp abilities.
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
    if (actor.getFlag(MODULE_ID, "kind") === "node") return;
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
      };
    }
  });
}
