// 0.3.89 — Ritual Formula study: right-click an owned Formula Item → Mark Learned (Mark Unlearned for the
// Director), with a chat card naming the student. Owning a Formula never lets you cast — the learned flag is
// the gate the Ritual Workings cards ask for, set once the Director says the study is done.
// Foundry-free helpers at the top so tools/ritual-learn-smoke.mjs can check the gate without a world.

export const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Ritual";

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? {};

/** The ritual flag block of a Formula Item, or null for anything else. The gear tag is the fallback gate. */
export function ritualData(item) {
  if (!item) return null;
  const gw = gwFlags(item);
  if (gw.ritual?.formula === true) return gw.ritual;
  return gw.gear?.tags?.includes("RitualFormula") ? (gw.ritual ?? {}) : null;
}

export const isRitualFormula = item => !!ritualData(item);
export const isLearned = item => ritualData(item)?.learned === true;

/** "Ward · Magnitude 1 · General" from the formula's flags; "" when the card carried none of it. */
export function formulaSubtitle(item) {
  const ritual = ritualData(item);
  if (!ritual) return "";
  const magnitude = ritual.magnitudeText ?? (ritual.magnitude != null ? String(ritual.magnitude) : "");
  return [ritual.family, magnitude ? `Magnitude ${magnitude}` : "", ritual.leaders].filter(Boolean).join(" · ");
}

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
// Pack names and descriptions are lang keys until Foundry resolves them; fall back to the raw value.
const label = doc => (doc?.name && game.i18n.has(doc.name) ? game.i18n.localize(doc.name) : (doc?.name ?? ""));

/**
 * Flip a Formula Item's learned gate and announce it in chat.
 * @param {Item} item     A Ritual Formula Item owned by an Actor.
 * @param {boolean} learned
 */
export async function setFormulaLearned(item, learned = true) {
  if (!isRitualFormula(item)) return null;
  if (isLearned(item) === learned) return item;
  await item.setFlag(MODULE_ID, "ritual.learned", learned);

  const actor = item.parent instanceof Actor ? item.parent : null;
  const data = { actor: actor?.name ?? "", item: foundry.utils.escapeHTML(label(item)) };
  const subtitle = formulaSubtitle(item);
  const content = loc(learned ? "Chat.Learned" : "Chat.Unlearned", data)
    + (subtitle ? `<p class="hint">${foundry.utils.escapeHTML(subtitle)}</p>` : "");
  await ChatMessage.create({
    speaker: actor ? ChatMessage.getSpeaker({ actor }) : ChatMessage.getSpeaker(),
    content,
  });
  ui.notifications.info(loc(learned ? "Learned" : "Unlearned", data));
  return item;
}

export function registerRituals() {
  // Hero sheet: right-click a Formula row (or its ⋮) → Mark Learned / Mark Unlearned. Mirrors mods.mjs.
  Hooks.on("getDocumentListContextOptions", (app, menuItems) => {
    if (typeof app._getEmbeddedDocument !== "function") return;
    const formulaItem = target => {
      const item = app._getEmbeddedDocument(target);
      return (isRitualFormula(item) && (item.parent instanceof Actor) && item.isOwner) ? item : null;
    };
    menuItems.push(
      {
        label: `${L}.Menu.MarkLearned`, icon: "fa-solid fa-book-sparkles",
        visible: target => { const item = formulaItem(target); return !!item && !isLearned(item); },
        onClick: (event, target) => setFormulaLearned(formulaItem(target), true),
      },
      {
        label: `${L}.Menu.MarkUnlearned`, icon: "fa-solid fa-book-skull",
        visible: target => { const item = formulaItem(target); return !!item && isLearned(item) && game.user.isGM; },
        onClick: (event, target) => setFormulaLearned(formulaItem(target), false),
      },
    );
  });

  // Item sheet: "Learned — may be sealed" / "Not learned — study required" under an owned Formula's header.
  Hooks.on("renderDrawSteelItemSheet", (app, element) => {
    const item = app.document;
    element.querySelector(".ghostwire-ritual-learned")?.remove();
    if (!isRitualFormula(item) || !(item.parent instanceof Actor)) return;
    const anchor = element.querySelector(".ghostwire-chrome-line") ?? element.querySelector(".sheet-header .document-name");
    if (!anchor) return;
    const line = document.createElement("div");
    line.className = "ghostwire-ritual-learned hint";
    line.textContent = loc(isLearned(item) ? "SheetLearned" : "SheetNotLearned");
    anchor.after(line);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = { ...(module.api ?? {}), isRitualFormula, isLearned, ritualData, formulaSubtitle, setFormulaLearned };
  }
}
