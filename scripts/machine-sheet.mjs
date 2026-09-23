// Ghostwire Machine sheet — pared Actor UI for drone / vehicle / baseAsset.
// Required (Michael 2026-09-23): Description, Notes, Image/portrait + token art.

import { jumpIn, jumpOut, isJumpedInto } from "./rigger-vertical.mjs";

const MODULE_ID = "draw-steel-ghostwire";

export function isMachineActor(actor) {
  if (!(actor instanceof Actor)) return false;
  const kind = actor.getFlag(MODULE_ID, "kind") ?? actor.getFlag(MODULE_ID, "machine")?.kind;
  return ["drone", "vehicle", "baseAsset"].includes(kind);
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
        tab: GhostwireMachineSheet.#onTab,
        editImage: GhostwireMachineSheet.#onEditImage,
        editToken: GhostwireMachineSheet.#onEditToken,
        jumpIn: GhostwireMachineSheet.#onJumpIn,
        jumpOut: GhostwireMachineSheet.#onJumpOut,
      },
    };

    static PARTS = {
      body: {
        template: `modules/${MODULE_ID}/templates/machine-sheet.hbs`,
        root: true,
      },
    };

    #tab = "combat";

    get title() {
      return `${this.document.name} — ${game.i18n.localize("GHOSTWIRE.Summons.Machines.UI.SheetTitle")}`;
    }

    async _prepareContext(options) {
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
        homeGround: false,
        beacon: false,
        profile: "",
        tags: "",
      }, actor.getFlag(MODULE_ID, "machine") ?? {}, { inplace: false });
      if (!machine.kind) machine.kind = actor.getFlag(MODULE_ID, "kind") ?? "drone";
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
        tokenImg: actor.prototypeToken?.texture?.src ?? actor.img,
        tab: this.#tab,
        jumpedIn,
        canJumpIn: !!machine.jumpInCapable && !jumpedIn && !!ownerUuid,
      };
    }

    async _processSubmitData(_event, _form, formData) {
      const data = foundry.utils.expandObject(formData.object);
      const tags = data.flags?.[MODULE_ID]?.machine?.tags;
      if (typeof tags === "string") {
        data.flags[MODULE_ID].machine.tags = tags.split(",").map(s => s.trim()).filter(Boolean);
      }
      if (data.flags?.[MODULE_ID]?.machine?.kind) {
        data.flags[MODULE_ID].kind = data.flags[MODULE_ID].machine.kind;
      }
      await this.document.update(data);
    }

    static #onTab(_event, target) {
      this.#tab = target.dataset.tab || "combat";
      this.render();
    }

    static async #onEditImage() {
      const fp = new FilePicker({
        type: "image",
        current: this.document.img,
        callback: async path => {
          await this.document.update({ img: path });
          this.render();
        },
      });
      return fp.browse();
    }

    static async #onEditToken() {
      const current = this.document.prototypeToken?.texture?.src ?? this.document.img;
      const fp = new FilePicker({
        type: "image",
        current,
        callback: async path => {
          await this.document.update({ "prototypeToken.texture.src": path });
          this.render();
        },
      });
      return fp.browse();
    }

    static async #onJumpIn() {
      const ownerUuid = this.document.getFlag(MODULE_ID, "ownerUuid");
      const owner = ownerUuid ? await fromUuid(ownerUuid) : null;
      if (!owner) return ui.notifications.warn(game.i18n.localize("GHOSTWIRE.Summons.Machines.UI.NoOwner"));
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
  };
}

export function registerMachineSheet() {
  const Sheet = defineMachineSheet();
  DocumentSheetConfig.registerSheet(CONFIG.Actor.documentClass, MODULE_ID, Sheet, {
    types: ["npc"],
    label: "GHOSTWIRE.Summons.Machines.UI.SheetTitle",
    makeDefault: false,
  });

  const openMachine = async actor => {
    if (!isMachineActor(actor)) return false;
    new Sheet({ document: actor }).render(true);
    return true;
  };

  const redirect = async app => {
    if (!isMachineActor(app.document)) return;
    if (app.constructor.name === "GhostwireMachineSheet") return;
    await app.close({ force: true });
    await openMachine(app.document);
  };

  Hooks.on("renderActorSheetV2", redirect);
  Hooks.on("renderActorSheet", redirect);
  console.log(`${MODULE_ID} | Ghostwire Machine sheet registered`);
  return Sheet;
}
