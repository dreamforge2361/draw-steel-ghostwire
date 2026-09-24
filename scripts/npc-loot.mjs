// 0.3.128 (C) — the loot on a body is visible on the body.
//
// 0.3.127 (E) embedded role-appropriate gear on 51 bestiary NPCs as real `treasure` Items, so
// "search the body" finally had an answer. Then nobody could see it: **Draw Steel's NPC sheet has no
// Equipment tab.** `DrawSteelNPCSheet.PARTS` is header / tabs / stats / features / abilities /
// effects / biography, and `treasure` appears in none of them. A Corp Enforcer was carrying a
// Workhorse, a box of rounds and a company handset, and the Director's only route to any of it was
// the console.
//
// Three decisions:
//
//  1. **A Ghostwire panel, not a restored Equipment tab.** The brief allows either and the panel is
//     cleaner: a tab means injecting a nav button into an ApplicationV2 tab group and keeping it
//     alive across every partial re-render, to show a list that is usually four rows long. The panel
//     goes at the top of the **Features** tab — which is already "what this creature has" — and is
//     rebuilt from scratch on each render, so there is no state to desynchronise.
//  2. **Every `treasure` on the sheet, not only the loot-stamped ones.** `flags.<module>.loot` marks
//     what tools/bestiary-loot.mjs wrote, and Mama Cassavir's seven hand-embedded implants carry no
//     such flag precisely so a restamp never eats them. Showing only the flagged rows would hide the
//     one NPC who had gear before this system existed. Both show; the flagged ones get a marker, so
//     a Director can still tell table-stamped loot from something they placed by hand.
//  3. **Drag is bound here, not borrowed.** `DSDocumentSheet` binds its `.draggable` handlers in
//     `_onRender`, element by element, *before* this hook fires — so a row injected afterwards would
//     look draggable and do nothing. The panel sets `draggable` and its own `dragstart` listener,
//     and hands over exactly what the sheet would have: `Item#toDragData()`. That is what makes the
//     row droppable on a hero sheet, the Items directory and the Ghostwire Locker.
//
// Heroes are untouched: this hook is `renderDrawSteelNPCSheet` only, and a hero's treasure already
// has an Equipment tab to live in.
//
// Helpers above the "Foundry registration" divider are Foundry-free so
// tools/wave-03128-smoke.mjs can run them under Node.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.NpcLoot";

/** The flag tools/bestiary-loot.mjs stamps on everything it writes. */
export const LOOT_FLAG = "loot";

/** Item types that are a physical object somebody could take off a body. */
export const LOOTABLE_TYPES = Object.freeze(["treasure"]);

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? doc?.flags?.["draw-steel-ghostwire"] ?? {};

/** Was this Item written by the bestiary loot table, or placed by hand? */
export function isStampedLoot(item) {
  if (typeof item?.getFlag === "function") return item.getFlag(MODULE_ID, LOOT_FLAG) === true;
  return gwFlags(item)[LOOT_FLAG] === true;
}

/** Is this Item a physical object the panel should list? */
export function isLootableItem(item) {
  return LOOTABLE_TYPES.includes(String(item?.type ?? ""));
}

/**
 * The panel's rows, in the order they are drawn.
 *
 * Stamped loot first, then anything hand-placed, each group alphabetical — so a restamp never
 * reorders the list and the Director's own additions stay together at the bottom.
 *
 * @param {Array} items  Live Items or raw embedded rows.
 * @returns {Array<{id: string, name: string, img: string|null, quantity: number, stamped: boolean}>}
 */
export function lootRows(items = []) {
  return [...items]
    .filter(isLootableItem)
    .map(item => ({
      id: item.id ?? item._id ?? null,
      uuid: item.uuid ?? null,
      name: String(item.name ?? ""),
      img: item.img ?? null,
      quantity: Math.max(0, Math.floor(Number(item.system?.quantity) || 0)),
      stamped: isStampedLoot(item),
    }))
    .sort((a, b) => (Number(b.stamped) - Number(a.stamped)) || a.name.localeCompare(b.name));
}

/**
 * The one-line count under the panel heading.
 *
 * `items` is how many rows there are; `pieces` sums the quantities, because "4 items" and "4 items,
 * 63 rounds among them" are different facts and the second one is the one a Director wants.
 */
export function lootSummary(rows = []) {
  const items = rows.length;
  const pieces = rows.reduce((sum, row) => sum + Math.max(1, row.quantity), 0);
  return { items, pieces, empty: items === 0 };
}

/* ============================================ Foundry registration */

const esc = text => foundry.utils.escapeHTML(String(text ?? ""));
const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));

function registerSettings() {
  game.settings.register(MODULE_ID, "npcLootPanel", {
    name: `${L}.Settings.Enabled.Name`, hint: `${L}.Settings.Enabled.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
  });
}

const enabled = () => {
  try {
    return game.settings.get(MODULE_ID, "npcLootPanel") !== false;
  } catch {
    return true;                                   // asked before `init` registered it: show the panel
  }
};

/** Where the panel goes: the Features tab, then the stats tab, then whatever form there is. */
function panelHost(root) {
  return root?.querySelector?.("section.tab[data-tab='features']")
    ?? root?.querySelector?.("[data-tab='features'].tab")
    ?? root?.querySelector?.("section.tab[data-tab='stats']")
    ?? root?.querySelector?.(".window-content form")
    ?? root?.querySelector?.(".window-content")
    ?? null;
}

/** One row of the panel. */
function rowHtml(row) {
  const quantity = row.quantity > 1
    ? `<span class="gw-loot-qty">${loc("Quantity", { quantity: row.quantity })}</span>`
    : "";
  const stamped = row.stamped
    ? ` <i class="fa-solid fa-box-open gw-loot-stamp" data-tooltip="${esc(loc("Stamped"))}"></i>`
    : "";
  return `<li class="item gw-loot-row draggable" data-document-uuid="${esc(row.uuid)}" data-item-id="${esc(row.id)}" draggable="true">
    <img class="item-image gw-loot-img" src="${esc(row.img ?? "icons/svg/item-bag.svg")}" alt="${esc(row.name)}">
    <span class="gw-loot-name">${esc(row.name)}${stamped}</span>
    ${quantity}
    <a class="gw-loot-open" data-tooltip="${esc(loc("Open"))}"><i class="fa-solid fa-up-right-from-square"></i></a>
  </li>`;
}

/**
 * Build and insert the panel. Removes its own previous copy first, so a partial re-render never
 * leaves two.
 */
function injectLootPanel(app, element) {
  const actor = app?.document ?? app?.actor;
  if (actor?.type !== "npc") return;
  const root = element ?? app?.element;
  root?.querySelectorAll?.(".ghostwire-npc-loot").forEach(node => node.remove());
  if (!enabled()) return;
  // Dragging an owned Item off a sheet is an owner's action, and a player who is not one has no
  // business reading an enemy's pockets from the sheet either.
  if (!actor.isOwner) return;
  const host = panelHost(root);
  if (!host) return;

  const rows = lootRows(actor.items ?? []);
  const summary = lootSummary(rows);
  const panel = document.createElement("section");
  panel.className = "ghostwire-npc-loot";
  panel.innerHTML = `
    <header class="gw-loot-head">
      <h3><i class="fa-solid fa-sack-dollar"></i> ${esc(loc("Title"))}</h3>
      <span class="gw-loot-count">${esc(summary.empty
        ? loc("None")
        : loc("Count", { items: summary.items, pieces: summary.pieces }))}</span>
    </header>
    ${summary.empty
      ? `<p class="hint gw-loot-empty">${esc(loc("EmptyHint"))}</p>`
      : `<ol class="item-list gw-loot-list">${rows.map(rowHtml).join("")}</ol>
         <p class="hint gw-loot-hint">${esc(loc("DragHint"))}</p>`}`;

  host.prepend(panel);

  // C2 — drag. DSDocumentSheet bound its own `.draggable` handlers before this hook ran, so these
  // rows need their own; the payload is the same `toDragData()` the sheet would have produced.
  for (const node of panel.querySelectorAll(".gw-loot-row")) {
    const item = actor.items.get(node.dataset.itemId);
    if (!item) continue;
    node.addEventListener("dragstart", event => {
      try {
        event.dataTransfer.setData("text/plain", JSON.stringify(item.toDragData()));
      } catch (error) {
        console.warn(`${MODULE_ID} | could not start a loot drag for ${item.name}`, error);
      }
    });
    node.querySelector(".gw-loot-open")?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      item.sheet?.render({ force: true });
    });
  }
}

export function registerNpcLoot() {
  registerSettings();

  Hooks.on("renderDrawSteelNPCSheet", injectLootPanel);
  // A world that still routes NPCs through the generic actor-sheet hook gets it too; the `npc` type
  // check inside is what keeps heroes out either way.
  Hooks.on("renderActorSheet", (app, element) => {
    if ((app?.document ?? app?.actor)?.type === "npc") injectLootPanel(app, element);
  });

  Hooks.once("ready", () => {
    const module = game.modules.get(MODULE_ID);
    if (module) module.api = { ...(module.api ?? {}), lootRows, lootSummary, isStampedLoot };
  });

  console.log(`${MODULE_ID} | NPC loot panel registered (Draw Steel strips the NPC Equipment tab)`);
}
