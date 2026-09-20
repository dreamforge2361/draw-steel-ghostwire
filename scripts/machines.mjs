// Drones & vehicles: dual Item + Actor (docs/masters/GHOSTWIRE_SUPPORT_ENTITIES.md, GHOSTWIRE_MACHINE_BANDS.md).
// The Item (Ghostwire Vehicles & Drones) is ownership, ¥, mods, and echelon. Deploy stamps a scale-band Actor template from
// Ghostwire Summons & Machines › Drones & Vehicles into a linked world Actor and places its token next to the owner;
// Recall deletes the token and Actor, and the Item stays. The link lives in flags on both sides:
// - Actor: flags.<module> = { kind, band, ownerUuid, gearItemUuid, dsid, gearDsid }
// - Item:  flags.<module>.deployed = { actorUuid }

import { addWireKit } from "./wired-kit.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const PACK_ID = `${MODULE_ID}.summons`;
const UI = "GHOSTWIRE.Summons.Machines.UI";

// Band templates (must match gen-machines.mjs): base Stamina and speed before the Item stamps them.
const BANDS = {
  "drone-micro": { stamina: 5, speed: 6 },
  "drone-small": { stamina: 12, speed: 6 },
  "drone-medium": { stamina: 24, speed: 7 },
  "vehicle-bike": { stamina: 20, speed: 10 },
  "vehicle-car": { stamina: 40, speed: 10 },
  "vehicle-heavy": { stamina: 80, speed: 8 },
  "vehicle-air": { stamina: 40, speed: 12 },
  "vehicle-water": { stamina: 40, speed: 8 },
  "vehicle-space": { stamina: 80, speed: 12 },
};

// Provisional stamping until the Machines numeric pass: Stamina × echelon multiplier, vehicle speed by chapter Speed band.
// Vehicle Items carry flags.vehicle.speedBand (B36b); the table below is the fallback for Items that predate it.
const ECHELON_MULTIPLIER = { 1: 1, 2: 1.5, 3: 2, 4: 2.5 };
const SPEED_BAND_BONUS = { slow: -2, standard: 0, fast: 2, extreme: 4 };
const VEHICLE_SPEED_BANDS = {
  "crotch-rocket": "fast", "warbike": "fast", "getaway": "standard", "hardtop": "standard", "rustbucket": "standard", "workhorse": "slow",
  "brick": "standard", "iron-giant": "standard", "buzzcopter": "fast", "hoverpad": "fast", "tiltjet": "fast", "skyhunter": "fast",
  "ghost-wing": "fast", "skiff": "standard", "cigarette": "fast", "wetsub": "slow", "leviathan": "standard", "pod": "extreme",
  "mule": "extreme", "reaver": "extreme",
};

/** The scale band for a vehicles-pack Item, from its domain / scale / drone flags; null if it isn't a drone or vehicle. */
export function machineBand(item) {
  const vehicle = item?.getFlag(MODULE_ID, "vehicle");
  if (!vehicle) return null;
  const domain = String(vehicle.domain ?? "").toLowerCase();
  const scale = String(vehicle.scale ?? "").toLowerCase();
  if (vehicle.drone) {
    if (scale.startsWith("personal")) return "drone-micro";
    if (scale.startsWith("vehicle")) return "drone-medium";
    return "drone-small";
  }
  if (domain.startsWith("air")) return "vehicle-air";
  if (domain.startsWith("water")) return "vehicle-water";
  if (domain.startsWith("space")) return "vehicle-space";
  if (scale.startsWith("light")) return "vehicle-bike";
  if (scale.startsWith("heavy") || scale.includes("heavy")) return "vehicle-heavy";
  return "vehicle-car";
}

const bandKey = band => band.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join("");

const movementTypes = domain => {
  domain = String(domain ?? "").toLowerCase();
  if (domain.startsWith("air") || domain.startsWith("space")) return ["fly"];
  if (domain.startsWith("water")) return ["swim"];
  return ["walk"];
};

/** The deployed Actor for a gear Item, or null if it isn’t deployed (or its Actor was deleted). */
export function deployedMachine(item) {
  const uuid = item?.getFlag(MODULE_ID, "deployed")?.actorUuid;
  const actor = uuid ? fromUuidSync(uuid) : null;
  return actor instanceof Actor ? actor : null;
}

async function templateFor(band) {
  const pack = game.packs.get(PACK_ID);
  const index = await pack.getIndex({ fields: [`flags.${MODULE_ID}.dsid`] });
  const entry = index.find(e => foundry.utils.getProperty(e, `flags.${MODULE_ID}.dsid`) === `machine-${band}`);
  return entry ? pack.getDocument(entry._id) : null;
}

async function deployFolder() {
  const name = game.i18n.localize(`${UI}.Folder`);
  return game.folders.find(f => (f.type === "Actor") && f.getFlag(MODULE_ID, "deployedMachines"))
    ?? Folder.create({ name, type: "Actor", flags: { [MODULE_ID]: { deployedMachines: true } } });
}

// Next to the owner's token on the viewed Scene, else the centre of the view.
function placement(owner, size) {
  const grid = canvas.grid.size;
  const token = owner?.getActiveTokens?.()[0]?.document;
  if (token) return { x: token.x + (token.width * grid), y: token.y };
  const { x, y } = canvas.stage.pivot;
  return { x: Math.round((x - ((size * grid) / 2)) / grid) * grid, y: Math.round((y - ((size * grid) / 2)) / grid) * grid };
}

/** Deploy a drone or vehicle Item: stamp its band template into a linked Actor and place a token. */
export async function deployMachine(item) {
  const band = machineBand(item);
  if (!band) return ui.notifications.warn(game.i18n.localize(`${UI}.NotMachine`));
  if (!canvas.scene) return ui.notifications.warn(game.i18n.localize(`${UI}.NoScene`));
  if (!game.user.can("ACTOR_CREATE") || !game.user.can("TOKEN_CREATE")) return ui.notifications.warn(game.i18n.localize(`${UI}.NoPermission`));
  const existing = deployedMachine(item);
  if (existing) return ui.notifications.warn(game.i18n.format(`${UI}.AlreadyDeployed`, { name: item.name }));

  const template = await templateFor(band);
  if (!template) return ui.notifications.error(game.i18n.format(`${UI}.NoTemplate`, { band }));

  const vehicle = item.getFlag(MODULE_ID, "vehicle");
  const owner = item.parent instanceof Actor ? item.parent : null;
  const base = BANDS[band];
  const stamina = Math.round(base.stamina * (ECHELON_MULTIPLIER[vehicle.echelon] ?? 1));
  const speedBand = vehicle.speedBand ?? VEHICLE_SPEED_BANDS[item.system._dsid];
  const speed = base.speed + (vehicle.drone ? 0 : (SPEED_BAND_BONUS[speedBand] ?? 0));
  // The owner's players own the machine, so they can move its token and track its Integrity.
  const ownership = { default: 0 };
  for (const [userId, level] of Object.entries(owner?.ownership ?? {})) {
    if ((userId !== "default") && (level >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)) ownership[userId] = level;
  }

  const data = game.actors.fromCompendium(template);
  foundry.utils.mergeObject(data, {
    name: item.name, img: item.img, folder: (await deployFolder())?.id ?? null, ownership,
    "system.stamina": { value: stamina, max: stamina, temporary: 0 },
    "system.movement.value": speed,
    "system.movement.types": movementTypes(vehicle.domain),
    "system.monster.level": vehicle.echelon ?? 1,
    "prototypeToken.name": item.name,
    "prototypeToken.actorLink": true,
    "prototypeToken.texture.src": item.img,
    [`flags.${MODULE_ID}`]: {
      kind: vehicle.drone ? "drone" : "vehicle", band, ownerUuid: owner?.uuid ?? null, gearItemUuid: item.uuid,
      dsid: `machine-${band}`, gearDsid: item.system._dsid ?? null, echelon: vehicle.echelon ?? null, speedBand: speedBand ?? null,
    },
  });
  const actor = await Actor.create(data);
  if (!actor) return;
  if (vehicle.drone) await addWireKit(actor, { notify: false });

  const size = actor.system.combat.size.value;
  const tokenDocument = await actor.getTokenDocument({ ...placement(owner, size), actorLink: true });
  await canvas.scene.createEmbeddedDocuments("Token", [tokenDocument.toObject()]);
  await item.setFlag(MODULE_ID, "deployed", { actorUuid: actor.uuid });
  ui.notifications.info(game.i18n.format(`${UI}.Deployed`, { name: item.name, stamina, speed }));
  return actor;
}

/** Recall a deployed machine: delete its tokens on every Scene and its Actor. The Item stays. */
export async function recallMachine(item, { actor } = {}) {
  actor ??= deployedMachine(item);
  if (actor) {
    for (const scene of game.scenes) {
      const ids = scene.tokens.filter(t => t.actorId === actor.id).map(t => t.id);
      if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
    }
    await actor.delete({ ghostwireRecall: true });
  }
  if (item?.getFlag(MODULE_ID, "deployed")) await item.unsetFlag(MODULE_ID, "deployed");
  if (item) ui.notifications.info(game.i18n.format(`${UI}.Recalled`, { name: item.name }));
}

export function registerMachines() {
  // Hero sheet: right-click a drone or vehicle row (or its ⋮ control) → Deploy / Recall.
  Hooks.on("getDocumentListContextOptions", (app, menuItems) => {
    if (typeof app._getEmbeddedDocument !== "function") return;
    const machineItem = target => {
      const item = app._getEmbeddedDocument(target);
      return (machineBand(item) && (item.parent instanceof Actor) && item.isOwner) ? item : null;
    };
    menuItems.push(
      {
        label: `${UI}.Deploy`, icon: "fa-solid fa-location-dot",
        visible: target => { const item = machineItem(target); return !!item && !deployedMachine(item); },
        onClick: (event, target) => deployMachine(machineItem(target)),
      },
      {
        label: `${UI}.Recall`, icon: "fa-solid fa-arrow-rotate-left",
        visible: target => { const item = machineItem(target); return !!item && !!deployedMachine(item); },
        onClick: (event, target) => recallMachine(machineItem(target)),
      },
    );
  });

  // Item sheet: a Deploy / Recall row inside the header of a drone or vehicle Item that a hero owns (rebuilt every render).
  Hooks.on("renderDrawSteelItemSheet", (app, element) => {
    const item = app.document;
    element.querySelector(".ghostwire-machine-controls")?.remove();
    if (!machineBand(item) || !(item.parent instanceof Actor)) return;
    const header = element.querySelector(".sheet-header .header-center") ?? element.querySelector(".sheet-header");
    if (!header) return;
    const deployed = deployedMachine(item);
    const controls = document.createElement("div");
    controls.className = "ghostwire-machine-controls flexrow";
    const status = document.createElement("span");
    status.className = "hint";
    status.textContent = deployed
      ? game.i18n.format(`${UI}.StatusDeployed`, { band: game.i18n.localize(`GHOSTWIRE.Summons.Machines.${bandKey(machineBand(item))}.Name`) })
      : game.i18n.localize(`${UI}.StatusStowed`);
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = deployed
      ? `<i class="fa-solid fa-arrow-rotate-left"></i> ${game.i18n.localize(`${UI}.Recall`)}`
      : `<i class="fa-solid fa-location-dot"></i> ${game.i18n.localize(`${UI}.Deploy`)}`;
    button.disabled = !item.isOwner;
    button.addEventListener("click", async event => {
      event.preventDefault();
      button.disabled = true;
      try {
        if (deployed) await recallMachine(item);
        else await deployMachine(item);
      } finally {
        // The deployed flag change re-renders the sheets; forcing another render races Draw Steel's async editors.
        button.disabled = false;
      }
    });
    controls.append(status, button);
    header.append(controls);
  });

  // Deleting a deployed Actor (wreck cleanup, or by hand) clears the Item's link; deleting the Item recalls its machine.
  Hooks.on("deleteActor", async (actor, options, userId) => {
    if ((userId !== game.user.id) || options.ghostwireRecall) return;
    const uuid = actor.getFlag(MODULE_ID, "gearItemUuid");
    if (!uuid || !["drone", "vehicle"].includes(actor.getFlag(MODULE_ID, "kind"))) return;
    for (const scene of game.scenes) {
      const ids = scene.tokens.filter(t => t.actorId === actor.id).map(t => t.id);
      if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
    }
    const item = await fromUuid(uuid);
    if (item?.getFlag(MODULE_ID, "deployed")?.actorUuid === actor.uuid) await item.unsetFlag(MODULE_ID, "deployed");
  });
  Hooks.on("deleteItem", async (item, options, userId) => {
    if ((userId !== game.user.id) || !machineBand(item)) return;
    const actor = deployedMachine(item);
    if (actor) await recallMachine(null, { actor });
  });

  // A machine reduced to 0 Stamina is wrecked: say so once, and leave Recall to the table.
  Hooks.on("updateActor", (actor, changes, options, userId) => {
    if ((userId !== game.user.id) || !actor.getFlag(MODULE_ID, "gearItemUuid")) return;
    const value = foundry.utils.getProperty(changes, "system.stamina.value");
    if ((value !== undefined) && (value <= 0)) ui.notifications.warn(game.i18n.format(`${UI}.Wrecked`, { name: actor.name }));
  });

  const module = game.modules.get(MODULE_ID);
  if (module) module.api = { ...(module.api ?? {}), machineBand, deployMachine, recallMachine, deployedMachine };
  console.log(`${MODULE_ID} | Machines: Deploy / Recall registered (hero sheet row menu and Item sheet)`);
}
