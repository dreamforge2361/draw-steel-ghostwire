// Ghostwire Machine sheet — pared Actor UI for drone / vehicle / baseAsset.
// Required (Michael 2026-09-23): Description, Notes, Image/portrait + token art.
//
// Foundry v14 facts that drove the 0.3.106 hot-fix:
// - ApplicationV2 intercepts data-action="tab" BEFORE options.actions, routing it to _onClickTab →
//   changeTab(tab, group). A custom `tab` action is therefore never called, so this sheet uses the core
//   tab machinery (static TABS + tabGroups) instead of re-rendering on every tab click.
// - DocumentSheetV2#_processSubmitData receives an ALREADY-EXPANDED submitData object, not a
//   FormDataExtended. Per-field massaging belongs in _processFormData, which runs before validation.
// - The Draw Steel NPC sheet extends DocumentSheetV2 directly, NOT ActorSheetV2, so renderActorSheetV2
//   never fires for it. Sheet preference is stamped into flags.core.sheetClass instead, which
//   ClientDocument#_getSheetClass honours and which makes core swap an already-open sheet for us.

import { jumpIn, jumpOut, isJumpedInto } from "./rigger-vertical.mjs";
import { isJumpInCapable, machineKindOf } from "./machines.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const SHEET_CLASS_NAME = "GhostwireMachineSheet";
const UI = "GHOSTWIRE.Summons.Machines.UI";

/** The DocumentSheetConfig id for this sheet; also the value stamped into flags.core.sheetClass. */
export const MACHINE_SHEET_ID = `${MODULE_ID}.${SHEET_CLASS_NAME}`;

export const MACHINE_KINDS = ["drone", "vehicle", "baseAsset"];

const TAB_IDS = ["combat", "control", "build", "inventory", "links", "story"];
const tabLabel = id => `${UI}.Tab${id.charAt(0).toUpperCase()}${id.slice(1)}`;

export function isMachineActor(actor) {
  if (!(actor instanceof Actor)) return false;
  const kind = actor.getFlag(MODULE_ID, "kind") ?? actor.getFlag(MODULE_ID, "machine")?.kind;
  return MACHINE_KINDS.includes(kind);
}

export function defineMachineSheet() {
  const { HandlebarsApplicationMixin } = foundry.applications.api;
  const ActorSheetV2 = foundry.applications.sheets.ActorSheetV2
    ?? foundry.applications.api.DocumentSheetV2;

  return class GhostwireMachineSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
    static DEFAULT_OPTIONS = {
      classes: ["ghostwire", "ghostwire-machine-sheet"],
      position: { width: 640, height: 740 },
      window: { resizable: true, contentClasses: ["standard-form"] },
      form: { submitOnChange: false, closeOnSubmit: false },
      actions: {
        jumpIn: GhostwireMachineSheet.#onJumpIn,
        jumpOut: GhostwireMachineSheet.#onJumpOut,
        openItem: GhostwireMachineSheet.#onOpenItem,
        deleteItem: GhostwireMachineSheet.#onDeleteItem,
        createItem: GhostwireMachineSheet.#onCreateItem,
      },
    };

    // One tab group, driven by core: nav buttons carry data-action="tab" data-group="primary", panels
    // carry class="tab" data-group="primary". Core toggles .active without a re-render, so every tab's
    // fields stay in the form and a Save from any tab writes the whole sheet.
    static TABS = {
      primary: {
        tabs: TAB_IDS.map(id => ({ id, label: tabLabel(id) })),
        initial: "combat",
      },
    };

    static PARTS = {
      body: {
        template: `modules/${MODULE_ID}/templates/machine-sheet.hbs`,
        root: true,
      },
    };

    get title() {
      return `${this.document.name} — ${game.i18n.localize(`${UI}.SheetTitle`)}`;
    }

    async _prepareContext(options) {
      // super also prepares `tabs` for the single TABS group.
      const context = await super._prepareContext(options);
      const actor = this.document;
      const machine = foundry.utils.mergeObject({
        kind: "drone",
        sizeScale: "",
        movementMode: "walk",
        jumpInCapable: false,
        controlMode: "remote",
        handling: "standard",
        domain: "",
        modSlots: 0,
        installedModsText: "",
        cargo: "",
        mounts: "",
        sensors: "",
        stations: "",
        hardpoints: "",
        homeGround: false,
        beacon: false,
        profile: "",
        tags: "",
      }, actor.getFlag(MODULE_ID, "machine") ?? {}, { inplace: false });
      if (!machine.kind) machine.kind = actor.getFlag(MODULE_ID, "kind") ?? "drone";
      // Drones are always Jump-In capable. The checkbox shows that even when an older Actor never stored the flag.
      if (machineKindOf(actor) === "drone") machine.jumpInCapable = true;
      const ownerUuid = actor.getFlag(MODULE_ID, "ownerUuid") ?? "";
      const jumpedIn = isJumpedInto(actor);
      return {
        ...context,
        actor,
        machine,
        band: actor.getFlag(MODULE_ID, "band") ?? "",
        echelon: actor.getFlag(MODULE_ID, "echelon") ?? 1,
        ownerUuid,
        gearItemUuid: actor.getFlag(MODULE_ID, "gearItemUuid") ?? "",
        tags: Array.isArray(machine.tags) ? machine.tags.join(", ") : (machine.tags ?? ""),
        stamina: actor.system.stamina ?? { value: 0, max: 0 },
        movement: actor.system.movement ?? { value: 0 },
        biography: actor.system.biography?.value ?? "",
        notes: actor.system.biography?.director ?? "",
        enrichedBiography: await (foundry.applications?.ux?.TextEditor?.implementation?.enrichHTML
          ?? TextEditor.enrichHTML).call(
          foundry.applications?.ux?.TextEditor?.implementation ?? TextEditor,
          actor.system.biography?.value ?? "",
          { async: true, relativeTo: actor, secrets: actor.isOwner },
        ),
        enrichedNotes: game.user.isGM
          ? await (foundry.applications?.ux?.TextEditor?.implementation?.enrichHTML
            ?? TextEditor.enrichHTML).call(
            foundry.applications?.ux?.TextEditor?.implementation ?? TextEditor,
            actor.system.biography?.director ?? "",
            { async: true, relativeTo: actor, secrets: true },
          )
          : "",
        isGM: game.user.isGM,
        tokenImg: actor.prototypeToken?.texture?.src ?? actor.img,
        jumpedIn,
        canJumpIn: isJumpInCapable(actor) && !jumpedIn && !!ownerUuid,
        inventoryItems: [...actor.items]
          .map(item => {
            const typeKey = `TYPES.Item.${item.type}`;
            const typeLabel = game.i18n.has(typeKey) ? game.i18n.localize(typeKey) : item.type;
            const quantity = item.system?.quantity;
            return {
              id: item.id,
              uuid: item.uuid,
              name: item.name,
              img: item.img,
              type: item.type,
              typeLabel,
              quantity: (quantity != null && Number(quantity) !== 1) ? Number(quantity) : null,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name, game.i18n.lang)),
      };
    }

    /**
     * Normalise the expanded form object before core validates and writes it.
     * What arrives downstream in _processSubmitData is already expanded — never reach for formData.object there.
     */
    _processFormData(event, form, formData) {
      const submitData = super._processFormData(event, form, formData);
      const machine = foundry.utils.getProperty(submitData, `flags.${MODULE_ID}.machine`);
      if (!machine || (typeof machine !== "object")) return submitData;
      if (typeof machine.tags === "string") {
        machine.tags = machine.tags.split(",").map(s => s.trim()).filter(Boolean);
      }
      // Keep the top-level kind flag — what isMachineActor and the sheet preference read — in step.
      if (machine.kind) foundry.utils.setProperty(submitData, `flags.${MODULE_ID}.kind`, machine.kind);
      return submitData;
    }

    static async #onJumpIn() {
      const ownerUuid = this.document.getFlag(MODULE_ID, "ownerUuid");
      const owner = ownerUuid ? await fromUuid(ownerUuid) : null;
      if (!owner) return ui.notifications.warn(game.i18n.localize(`${UI}.NoOwner`));
      await jumpIn(owner, this.document);
      this.render();
    }

    static async #onJumpOut() {
      const ownerUuid = this.document.getFlag(MODULE_ID, "ownerUuid");
      const owner = ownerUuid ? await fromUuid(ownerUuid) : game.user.character;
      if (!owner) return;
      await jumpOut(owner);
      this.render();
    }
    static async #onOpenItem(event, target) {
      const itemId = target.dataset.itemId || target.closest("[data-item-id]")?.dataset.itemId;
      const item = this.document.items.get(itemId);
      if (!item) return;
      item.sheet?.render(true);
    }

    static async #onDeleteItem(event, target) {
      event.preventDefault?.();
      event.stopPropagation?.();
      if (!this.isEditable) return;
      const itemId = target.dataset.itemId || target.closest("[data-item-id]")?.dataset.itemId;
      const item = this.document.items.get(itemId);
      if (!item) return;
      const confirmed = await foundry.applications.api.DialogV2.confirm({
        window: { title: game.i18n.localize(`${UI}.DeleteItem`) },
        content: `<p>${game.i18n.format(`${UI}.DeleteItemConfirm`, { name: item.name })}</p>`,
      });
      if (!confirmed) return;
      await item.delete();
      this.render();
    }

    static async #onCreateItem() {
      if (!this.isEditable) return;
      const cls = getDocumentClass("Item");
      await cls.createDialog({}, { parent: this.document, pack: null, renderSheet: true });
    }

    /** Right-click Open / Delete on inventory rows (AppV2 ContextMenu). */
    _getInventoryContextOptions() {
      return [
        {
          label: `${UI}.OpenItem`,
          icon: "<i class=\"fa-solid fa-eye\"></i>",
          onClick: (_event, target) => {
            const item = this.document.items.get(target.dataset.itemId || target.closest("[data-item-id]")?.dataset.itemId);
            item?.sheet?.render(true);
          },
        },
        {
          label: `${UI}.DeleteItem`,
          icon: "<i class=\"fa-solid fa-trash\"></i>",
          visible: () => this.isEditable,
          onClick: async (_event, target) => {
            const item = this.document.items.get(target.dataset.itemId || target.closest("[data-item-id]")?.dataset.itemId);
            if (!item) return;
            const confirmed = await foundry.applications.api.DialogV2.confirm({
              window: { title: game.i18n.localize(`${UI}.DeleteItem`) },
              content: `<p>${game.i18n.format(`${UI}.DeleteItemConfirm`, { name: item.name })}</p>`,
            });
            if (!confirmed) return;
            await item.delete();
            this.render();
          },
        },
      ];
    }

    async _onFirstRender(context, options) {
      await super._onFirstRender(context, options);
      this._createContextMenu(this._getInventoryContextOptions.bind(this), ".gw-m-item", {
        fixed: true,
      });
    }

  };
}

// One attempt per Actor per session, so a failed write can never spin the render hook.
const attempted = new WeakSet();

/**
 * Make the Ghostwire Machine sheet this Actor's sheet by stamping the per-Actor sheet preference.
 * Core's ClientDocument#_onUpdate sees flags.core.sheetClass change and re-opens on the new class.
 * @returns {Promise<boolean>} Whether the preference was written.
 */
export async function ensureMachineSheetPreference(actor) {
  if (!isMachineActor(actor) || !actor.isOwner) return false;
  if (actor.getFlag("core", "sheetClass") === MACHINE_SHEET_ID) return false;
  if (attempted.has(actor)) return false;
  attempted.add(actor);
  await actor.setFlag("core", "sheetClass", MACHINE_SHEET_ID);
  return true;
}

/** Back-fill the sheet preference on machines deployed before 0.3.106. GM only, once per load. */
async function sweepMachineSheetPreference() {
  if (!game.user.isGM) return 0;
  const updates = game.actors
    .filter(actor => isMachineActor(actor) && (actor.getFlag("core", "sheetClass") !== MACHINE_SHEET_ID))
    .map(actor => ({ _id: actor.id, "flags.core.sheetClass": MACHINE_SHEET_ID }));
  if (!updates.length) return 0;
  await Actor.updateDocuments(updates);
  console.log(`${MODULE_ID} | Machine sheet preference stamped on ${updates.length} machine Actor(s)`);
  return updates.length;
}

export function registerMachineSheet() {
  const Sheet = defineMachineSheet();
  const SheetConfig = foundry.applications.apps.DocumentSheetConfig;
  SheetConfig.registerSheet(CONFIG.Actor.documentClass, MODULE_ID, Sheet, {
    types: ["npc"],
    label: `${UI}.SheetTitle`,
    makeDefault: false,
  });

  Hooks.once("ready", () => sweepMachineSheetPreference());
  Hooks.on("createActor", actor => ensureMachineSheetPreference(actor));

  // Belt and braces: if a machine still opens on another sheet (stale cached instance, or a sheet opened by
  // another module), stamp the preference — core swaps it — or swap it by hand when the flag is already right.
  Hooks.on("renderDocumentSheetV2", async app => {
    if (app.constructor.name === SHEET_CLASS_NAME) return;
    const actor = app.document;
    if (!isMachineActor(actor)) return;
    if (await ensureMachineSheetPreference(actor)) return;
    if (actor.getFlag("core", "sheetClass") !== MACHINE_SHEET_ID) return;
    await app.close({ force: true });
    actor._sheet = null;
    actor.sheet?.render(true);
  });

  console.log(`${MODULE_ID} | Ghostwire Machine sheet registered (${MACHINE_SHEET_ID})`);
  return Sheet;
}
