// 0.3.123 (B) — the Elementalist's free **Cantrip**, and the cast-time choice Michael locked for it.
//
// Cantrip is a signature that costs no Essence and can never deal damage. What it *does* is decided at
// the table, when you cast it, so the card cannot enumerate it — which is why this file exists. On use it
// opens one dialog with two modes:
//
//   * **Light** — the same 20-foot glow Street Priest Blessed Light raises, through the same
//     scripts/token-light.mjs helper. Toggling: cast it again to put it out.
//   * **Other utility** — a free-text box. Whatever the player writes is posted under the ability card as
//     the working they just did (clean a coat, flick a switch, still the dust). The Director adjudicates
//     it; nothing mechanical is applied, because "no damage, no combat rider" is the whole point.
//
// The dialog is attached to the chat message the ability itself created rather than replacing the roll, so
// the card, the SFX hook and every other `abilityUse` consumer in the module still see a normal use.
//
// Helpers above the "Foundry registration" divider are Foundry-free so
// tools/sp-el-foundry-wave-03123-smoke.mjs can run them in Node.

import { MODULE_ID, abilityFromMessage, toggleTokenLight, tokenLightSpec } from "./token-light.mjs";

const L = "GHOSTWIRE.Cantrip";

export const CANTRIP_DSID = "cantrip";
export const CANTRIP_FLAG = "cantrip";
export const CANTRIP_MODES = Object.freeze(["light", "other"]);

/** Is this Item the free Cantrip? Flag first, `_dsid` as the fallback for hand-built copies. */
export function isCantrip(item) {
  if (item?.type !== "ability") return false;
  const flag = (typeof item.getFlag === "function")
    ? item.getFlag(MODULE_ID, CANTRIP_FLAG)
    : item?.flags?.[MODULE_ID]?.[CANTRIP_FLAG];
  if (flag) return true;
  return item.system?._dsid === CANTRIP_DSID;
}

/**
 * Normalise what came back from the dialog into what the caster actually did.
 *
 * An "other" cast with an empty box is not a cast at all — there is nothing for the Director to rule on —
 * so it collapses to `{ mode: "none" }` rather than posting a blank line under the card.
 *
 * @param {object} choice
 * @param {string} [choice.mode]
 * @param {string} [choice.description]
 * @returns {{mode: "light"|"other"|"none", description: string}}
 */
export function planCantrip({ mode = "light", description = "" } = {}) {
  const text = String(description ?? "").trim();
  if (mode === "other") return text ? { mode: "other", description: text } : { mode: "none", description: "" };
  if (mode === "light") return { mode: "light", description: "" };
  return { mode: "none", description: "" };
}

/* ============================================ Foundry registration */

/** The Light / Other dialog. Resolves to null when the player closes it. */
async function promptCantrip(actor) {
  const modes = CANTRIP_MODES.map((mode, index) => `<label class="flexrow">`
    + `<input type="radio" name="mode" value="${mode}"${index === 0 ? " checked" : ""}> `
    + `<span><strong>${game.i18n.localize(`${L}.Mode.${mode}`)}</strong> — `
    + `${game.i18n.localize(`${L}.ModeHint.${mode}`)}</span></label>`).join("");
  const content = `<p>${game.i18n.format(`${L}.Prompt`, { name: foundry.utils.escapeHTML(actor?.name ?? "") })}</p>`
    + `<div class="form-group ghostwire-cantrip-modes flexcol">${modes}</div>`
    + `<div class="form-group"><label>${game.i18n.localize(`${L}.DescriptionLabel`)}</label>`
    + `<textarea name="description" rows="3" placeholder="${game.i18n.localize(`${L}.DescriptionPlaceholder`)}"></textarea></div>`;
  return foundry.applications.api.DialogV2.prompt({
    window: { title: game.i18n.localize(`${L}.Title`) },
    content,
    ok: {
      label: game.i18n.localize(`${L}.Cast`),
      callback: (event, button) => ({
        mode: button.form.elements.mode.value,
        description: button.form.elements.description.value,
      }),
    },
    rejectClose: false,
  });
}

/**
 * Run one Cantrip: ask, then do the one thing that was asked for.
 * @param {Item} ability
 * @returns {Promise<{mode: string, description: string}|null>}
 */
export async function castCantrip(ability) {
  const actor = ability?.parent;
  if (!(actor instanceof Actor) || !actor.isOwner) return null;
  const choice = await promptCantrip(actor);
  if (!choice) return null;
  const plan = planCantrip(choice);

  if (plan.mode === "light") {
    const spec = tokenLightSpec(ability) ?? { feet: 20, toggle: true };
    await toggleTokenLight(actor, spec);
  } else if (plan.mode === "other") {
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: `<p class="ghostwire-cantrip-other"><strong>${game.i18n.localize(`${L}.ChatLabel`)}</strong> `
        + `${foundry.utils.escapeHTML(plan.description)}</p>`
        + `<p class="hint">${game.i18n.localize(`${L}.ChatHint`)}</p>`,
    });
  }
  return plan;
}

export function registerCantrip() {
  // The card rolls first (so SFX and the chat card behave normally); the choice runs off its message.
  Hooks.on("createChatMessage", async (message, options, userId) => {
    if (userId !== game.user.id) return;
    const ability = abilityFromMessage(message);
    if (!isCantrip(ability)) return;
    await castCantrip(ability);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) module.api = { ...(module.api ?? {}), castCantrip, isCantrip };
  console.log(`${MODULE_ID} | Elementalist Cantrip registered (Light / described utility)`);
}
