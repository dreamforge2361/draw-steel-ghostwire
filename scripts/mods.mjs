// B20c mod install tracker (docs/spikes/B20c-MOD-INSTALL-TRACKER.md, docs/rulebook/14-mods.md): a mod Item is installed onto
// a host Item on the same Actor.
// - host: flags.<module>.installedMods = [modItemId, ...]  (display/list only; no slotCost copies)
// - mod:  flags.<module>.mod.installedOn = hostItemId | null
// Used slots are computed on the fly from the Actor's mods whose mod.installedOn is the host. Capacity and families come from the
// host's catalog flag (matrix, vehicle, or gear — whichever publishes modSlots > 0); the mod's hosts must overlap modFamily.
// Install / uninstall write each Item once, in one embedded update, so the hero sheet re-renders once.
// B20d: installed mods have a field toggle (mod.active, default on). Deck programs and RCC autosofts are mods too; their transferred
// software Active Effect is suppressed unless installed and on, and mod.edgeAbilities lists ability _dsids that roll with an edge.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Mods.Install";
// Matrix items read the matrix flag, vehicles the vehicle flag, everything else gear.
const HOST_FLAGS = ["matrix", "vehicle", "gear"];

/** The mod catalog data of an Item, or null. */
export function getModData(item) {
  return item?.getFlag(MODULE_ID, "mod") ?? null;
}

/** A mod's host families: hosts and host (string or array), normalized to one array. */
export function normalizeHosts(mod) {
  const data = getModData(mod);
  return [...new Set([data?.hosts, data?.host].flat().filter(Boolean))];
}

/** A host's catalog: { key, modSlots, modFamily }, or null if the Item takes no mods. Mods are never hosts. */
export function getHostCatalog(item) {
  if (!item || getModData(item)) return null;
  for (const key of HOST_FLAGS) {
    const catalog = item.getFlag(MODULE_ID, key);
    if (Number(catalog?.modSlots) > 0) return { key, modSlots: Number(catalog.modSlots), modFamily: catalog.modFamily ?? [] };
  }
  return null;
}

const slotCost = mod => Math.max(0, Number(getModData(mod)?.slotCost ?? 1));

/** The mods on the host's Actor whose mod.installedOn is this host. */
export function installedMods(host) {
  const actor = host?.parent;
  if (!(actor instanceof Actor)) return [];
  return actor.items.filter(item => getModData(item)?.installedOn === host.id);
}

/** The host a mod is installed on (on the same Actor), or null. */
export function installedHost(mod) {
  const id = getModData(mod)?.installedOn;
  const host = id ? mod.parent?.items?.get(id) : null;
  return getHostCatalog(host) ? host : null;
}

export const usedSlots = host => installedMods(host).reduce((total, mod) => total + slotCost(mod), 0);
export const freeSlots = host => (getHostCatalog(host)?.modSlots ?? 0) - usedSlots(host);

/** An installed mod is on unless switched off in the field (mod.active === false). */
export const isActive = mod => getModData(mod)?.active !== false;

/** Installed on a host and switched on. */
export const isRunning = mod => !!installedHost(mod) && isActive(mod);

/** Edges software grants a roll: running mods on the Actor whose edgeAbilities list the ability's _dsid. */
export function softwareEdges(actor, abilityDsid) {
  if (!abilityDsid || !actor?.items) return 0;
  return actor.items.filter(item => (getModData(item)?.edgeAbilities ?? []).includes(abilityDsid) && isRunning(item)).length;
}

/** @returns {{ ok: boolean, reason?: string }} reason is a GHOSTWIRE.Mods.Install.Blocked.* key. */
export function canInstall(mod, host) {
  if (!getModData(mod)) return { ok: false, reason: "NotMod" };
  const catalog = getHostCatalog(host);
  if (!catalog) return { ok: false, reason: "NotHost" };
  if (!(mod.parent instanceof Actor) || (mod.parent !== host.parent)) return { ok: false, reason: "SameActor" };
  if (installedHost(mod)) return { ok: false, reason: "AlreadyInstalled" };
  if (!normalizeHosts(mod).some(family => catalog.modFamily.includes(family))) return { ok: false, reason: "WrongFamily" };
  if (usedSlots(host) + slotCost(mod) > catalog.modSlots) return { ok: false, reason: "NoSlots" };
  return { ok: true };
}

const blocked = (reason, mod, host) => ui.notifications.warn(game.i18n.format(`${L}.Blocked.${reason}`, {
  mod: mod?.name ?? "", host: host?.name ?? "", cost: slotCost(mod), free: host ? freeSlots(host) : 0,
  families: normalizeHosts(mod).join(", "), hostFamilies: (getHostCatalog(host)?.modFamily ?? []).join(", "),
}));

/** Install a mod onto a host on the same Actor. */
export async function installMod(mod, host) {
  const check = canInstall(mod, host);
  if (!check.ok) return blocked(check.reason, mod, host);
  const ids = installedMods(host).map(m => m.id);
  await mod.parent.updateEmbeddedDocuments("Item", [
    { _id: host.id, [`flags.${MODULE_ID}.installedMods`]: [...ids, mod.id] },
    { _id: mod.id, [`flags.${MODULE_ID}.mod.installedOn`]: host.id, [`flags.${MODULE_ID}.mod.active`]: true },
  ]);
  ui.notifications.info(game.i18n.format(`${L}.Installed`, { mod: mod.name, host: host.name, used: usedSlots(host), slots: getHostCatalog(host).modSlots }));
}

/** Uninstall a mod: clear mod.installedOn and remove it from the host's installedMods. */
export async function uninstallMod(mod) {
  const actor = mod?.parent;
  if (!(actor instanceof Actor)) return;
  const hostId = getModData(mod)?.installedOn;
  const host = hostId ? actor.items.get(hostId) : null;
  const updates = [];
  if (host) updates.push({ _id: host.id, [`flags.${MODULE_ID}.installedMods`]: installedMods(host).map(m => m.id).filter(id => id !== mod.id) });
  updates.push({ _id: mod.id, [`flags.${MODULE_ID}.mod.installedOn`]: null });
  await actor.updateEmbeddedDocuments("Item", updates);
  ui.notifications.info(game.i18n.format(`${L}.Uninstalled`, { mod: mod.name, host: host?.name ?? "—" }));
}

/** Field toggle: switch an installed mod on or off. It keeps its slot either way. */
export async function setModActive(mod, active) {
  const host = installedHost(mod);
  if (!host) return blocked("NotInstalled", mod);
  await mod.update({ [`flags.${MODULE_ID}.mod.active`]: !!active });
  ui.notifications.info(game.i18n.format(`${L}.${active ? "Activated" : "Deactivated"}`, { mod: mod.name, host: host.name }));
}

// Pick a host on the mod's Actor. Hosts that pass every check are listed first; the rest are listed disabled with the reason.
async function promptInstall(mod) {
  const actor = mod.parent;
  if (installedHost(mod)) return blocked("AlreadyInstalled", mod, installedHost(mod));
  const hosts = actor.items.filter(item => getHostCatalog(item))
    .map(host => ({ host, check: canInstall(mod, host) }))
    .sort((a, b) => (b.check.ok - a.check.ok) || a.host.name.localeCompare(b.host.name));
  if (!hosts.some(h => h.check.ok)) {
    const reason = hosts.some(h => h.check.reason === "NoSlots") ? "NoSlots" : (hosts.length ? "NoFamilyHost" : "NoHosts");
    return blocked(reason, mod, hosts.find(h => h.check.reason === "NoSlots")?.host);
  }
  const escape = foundry.utils.escapeHTML;
  const options = hosts.map(({ host, check }, index) => {
    const { modSlots, modFamily } = getHostCatalog(host);
    const note = check.ok ? "" : ` — ${game.i18n.localize(`${L}.Short.${check.reason}`)}`;
    return `<option value="${host.id}"${index === 0 ? " selected" : ""}${check.ok ? "" : " disabled"}>${escape(host.name)} (${escape(modFamily.join(", "))}; ${usedSlots(host)} / ${modSlots})${note}</option>`;
  });
  const hostId = await foundry.applications.api.DialogV2.prompt({
    window: { title: game.i18n.format(`${L}.Title`, { mod: mod.name }) },
    content: `<p>${game.i18n.format(`${L}.Prompt`, { mod: escape(mod.name), cost: slotCost(mod), families: escape(normalizeHosts(mod).join(", ")) })}</p>`
      + `<div class="form-group"><label>${game.i18n.localize(`${L}.Host`)}</label><select name="host">${options.join("")}</select></div>`,
    ok: { label: game.i18n.localize(`${L}.Confirm`), callback: (event, button) => button.form.elements.host.value },
    rejectClose: false,
  });
  if (hostId) return installMod(mod, actor.items.get(hostId));
}

/** Catalog line override for an owned host: "Mod slots {used} / {max}", or null to keep the default. */
export function modSlotsLabel(item) {
  const catalog = getHostCatalog(item);
  if (!catalog || !(item.parent instanceof Actor)) return null;
  return game.i18n.format("GHOSTWIRE.Gear.SheetLine.ModSlotsUsed", { used: usedSlots(item), slots: catalog.modSlots });
}

const stateLabel = mod => game.i18n.localize(`${L}.${isActive(mod) ? "On" : "Off"}`);

// Software Active Effects (flags.software) apply only while their Item is installed and on; otherwise they read as suppressed.
function patchSoftwareSuppression() {
  const EffectClass = CONFIG.ActiveEffect.documentClass;
  let proto = EffectClass.prototype;
  let descriptor = null;
  while (proto && !(descriptor = Object.getOwnPropertyDescriptor(proto, "isSuppressed"))) proto = Object.getPrototypeOf(proto);
  if (!descriptor?.get) {
    console.warn(`${MODULE_ID} | ActiveEffect#isSuppressed not found; software effects always apply`);
    return;
  }
  Object.defineProperty(EffectClass.prototype, "isSuppressed", {
    configurable: true,
    get() {
      if (this.getFlag?.(MODULE_ID, "software") && (this.parent instanceof Item) && !isRunning(this.parent)) return true;
      return descriptor.get.call(this);
    },
  });
}

export function registerMods() {
  patchSoftwareSuppression();

  // Hero sheet: right-click a mod row (or its ⋮) → Install onto… / Uninstall mod.
  Hooks.on("getDocumentListContextOptions", (app, menuItems) => {
    if (typeof app._getEmbeddedDocument !== "function") return;
    const modItem = target => {
      const item = app._getEmbeddedDocument(target);
      return (getModData(item) && (item.parent instanceof Actor) && item.isOwner) ? item : null;
    };
    menuItems.push(
      {
        label: `${L}.Menu.Install`, icon: "fa-solid fa-screwdriver-wrench",
        visible: target => { const mod = modItem(target); return !!mod && !installedHost(mod); },
        onClick: (event, target) => promptInstall(modItem(target)),
      },
      {
        label: `${L}.Menu.Uninstall`, icon: "fa-solid fa-link-slash",
        visible: target => { const mod = modItem(target); return !!mod && !!installedHost(mod); },
        onClick: (event, target) => uninstallMod(modItem(target)),
      },
      {
        label: `${L}.Menu.Activate`, icon: "fa-solid fa-toggle-on",
        visible: target => { const mod = modItem(target); return !!mod && !!installedHost(mod) && !isActive(mod); },
        onClick: (event, target) => setModActive(modItem(target), true),
      },
      {
        label: `${L}.Menu.Deactivate`, icon: "fa-solid fa-toggle-off",
        visible: target => { const mod = modItem(target); return !!mod && !!installedHost(mod) && isActive(mod); },
        onClick: (event, target) => setModActive(modItem(target), false),
      },
    );
  });

  // Item sheet: "Installed: …" under an owned host's catalog line; "Installed on: …" under an installed mod's. Rebuilt every render.
  Hooks.on("renderDrawSteelItemSheet", (app, element) => {
    const item = app.document;
    element.querySelector(".ghostwire-mod-install")?.remove();
    if (!(item.parent instanceof Actor)) return;
    let text = "";
    if (getHostCatalog(item)) {
      const mods = installedMods(item);
      if (mods.length) text = game.i18n.format(`${L}.SheetInstalled`, { mods: mods.map(mod => `${mod.name} (${stateLabel(mod)})`).join(", ") });
    } else if (getModData(item)) {
      const host = installedHost(item);
      if (host) text = game.i18n.format(`${L}.SheetInstalledOn`, { host: `${host.name} (${stateLabel(item)})` });
    }
    if (!text) return;
    const anchor = element.querySelector(".ghostwire-chrome-line") ?? element.querySelector(".sheet-header .document-name");
    if (!anchor) return;
    const line = document.createElement("div");
    line.className = "ghostwire-mod-install hint";
    line.textContent = text;
    anchor.after(line);
  });

  // Deleting an installed mod frees its host's list entry; deleting a host uninstalls its mods.
  Hooks.on("deleteItem", (item, options, userId) => {
    const actor = item.parent;
    if ((userId !== game.user.id) || !(actor instanceof Actor)) return;
    const updates = [];
    const hostId = getModData(item)?.installedOn;
    const host = hostId ? actor.items.get(hostId) : null;
    if (host) updates.push({ _id: host.id, [`flags.${MODULE_ID}.installedMods`]: (host.getFlag(MODULE_ID, "installedMods") ?? []).filter(id => id !== item.id) });
    if (getHostCatalog(item)) {
      for (const mod of actor.items.filter(i => getModData(i)?.installedOn === item.id)) {
        updates.push({ _id: mod.id, [`flags.${MODULE_ID}.mod.installedOn`]: null });
      }
    }
    if (updates.length) actor.updateEmbeddedDocuments("Item", updates);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = { ...(module.api ?? {}), normalizeHosts, getHostCatalog, getModData, usedSlots, freeSlots, canInstall, installMod, uninstallMod, installedMods, installedHost, isActive, isRunning, setModActive, softwareEdges };
  }
}
