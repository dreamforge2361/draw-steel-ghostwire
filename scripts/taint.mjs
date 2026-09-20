// B80 Taint track (docs/spikes/B80-CORRUPTION-TAINT-TRACK.md, docs/raw/27-corruption-taint.md):
// Visible hero-sheet control: Stats tab under Body Integrity + compact header row.
// Flag: flags.<module>.taint (0–12). Bands Clean / Marked / Stained / Claimed / Hollowed.
// Owner + GM edit; observers read. No rest hook, no chrome hook, no band Active Effects.

export const MODULE_ID = "draw-steel-ghostwire";
export const TAINT_MIN = 0;
export const TAINT_MAX = 12;
export const TAINT_BANDS = Object.freeze([
  { id: "clean", min: 0, max: 0 },
  { id: "marked", min: 1, max: 3 },
  { id: "stained", min: 4, max: 6 },
  { id: "claimed", min: 7, max: 9 },
  { id: "hollowed", min: 10, max: 12 },
]);

/** Clamp to the locked 0–12 integer track. Non-numbers become 0. */
export function clampTaint(value) {
  const number = Math.floor(Number(value));
  if (!Number.isFinite(number)) return TAINT_MIN;
  return Math.min(TAINT_MAX, Math.max(TAINT_MIN, number));
}

/** Band id for a Taint score. */
export function taintBandId(value) {
  const n = clampTaint(value);
  return TAINT_BANDS.find(band => n >= band.min && n <= band.max)?.id ?? "clean";
}

/** Read the actor flag. Accepts a leftover object `{ value }` if one ever lands. */
export function getTaint(actor) {
  const flag = actor?.getFlag?.(MODULE_ID, "taint") ?? actor?.flags?.[MODULE_ID]?.taint;
  if (flag && typeof flag === "object") return clampTaint(flag.value);
  return clampTaint(flag);
}

function sheetRoot(app, element) {
  if (element?.querySelector) return element;
  if (element?.[0]?.querySelector) return element[0];
  if (app?.element?.querySelector) return app.element;
  return null;
}

function isHeroActor(actor) {
  return actor?.type === "hero";
}

function canEditTaint(app, actor) {
  if (app?.isEditable) return true;
  if (game.user?.isGM) return true;
  return Boolean(actor?.isOwner);
}

function bandLabel(bandId) {
  return game.i18n.localize(`GHOSTWIRE.Taint.Bands.${bandId}`);
}

function paintBand(host, value) {
  const band = taintBandId(value);
  host.classList.remove("band-clean", "band-marked", "band-stained", "band-claimed", "band-hollowed");
  host.classList.add(`band-${band}`);
  const chip = host.querySelector(".ghostwire-taint-band");
  if (chip) chip.textContent = bandLabel(band);
  return band;
}

function bindInput(input, host, actor, editable) {
  input.addEventListener("input", event => {
    event.stopPropagation();
    paintBand(host, clampTaint(input.value));
  });
  input.addEventListener("change", event => {
    event.stopPropagation();
    const next = clampTaint(input.value);
    input.value = String(next);
    paintBand(host, next);
    if (!editable) return;
    actor.update({ [`flags.${MODULE_ID}.taint`]: next });
  });
}

function numberInput(value, editable) {
  const input = document.createElement("input");
  Object.assign(input, {
    type: "number",
    min: String(TAINT_MIN),
    max: String(TAINT_MAX),
    step: 1,
    value: String(value),
    disabled: !editable,
  });
  input.setAttribute("aria-label", game.i18n.localize("GHOSTWIRE.Taint.Label"));
  return input;
}

function injectStatsFieldset(root, actor, editable) {
  if (root.querySelector(".ghostwire-taint")) return;
  const stats = root.querySelector("section.tab[data-tab='stats']")
    ?? root.querySelector("[data-tab='stats']")
    ?? root.querySelector("[data-application-part='stats']");
  if (!stats) return false;

  const value = getTaint(actor);
  const band = taintBandId(value);
  const fieldset = document.createElement("fieldset");
  fieldset.className = `ghostwire-taint flexrow band-${band}`;

  const legend = document.createElement("legend");
  legend.textContent = game.i18n.localize("GHOSTWIRE.Taint.Label");
  legend.dataset.tooltip = game.i18n.localize("GHOSTWIRE.Taint.Hint");
  fieldset.append(legend);

  const group = document.createElement("div");
  group.className = "form-group stacked";
  const label = document.createElement("label");
  label.textContent = game.i18n.localize("GHOSTWIRE.Taint.Current");
  const input = numberInput(value, editable);
  group.append(label, input);
  fieldset.append(group);

  const chip = document.createElement("span");
  chip.className = "ghostwire-taint-band";
  chip.textContent = bandLabel(band);
  chip.dataset.tooltip = game.i18n.localize("GHOSTWIRE.Taint.BandHint");
  fieldset.append(chip);

  bindInput(input, fieldset, actor, editable);

  const anchor = stats.querySelector(".ghostwire-integrity")
    ?? stats.querySelector("fieldset.resources")
    ?? stats.querySelector("fieldset");
  if (anchor) anchor.after(fieldset);
  else stats.prepend(fieldset);
  return true;
}

function injectHeaderControl(root, actor, editable) {
  if (root.querySelector(".ghostwire-taint-header")) return;
  const header = root.querySelector("[data-application-part='header']")
    ?? root.querySelector(".sheet-header")
    ?? root.querySelector(".window-content .profile");
  if (!header) return false;

  const value = getTaint(actor);
  const band = taintBandId(value);
  const row = document.createElement("div");
  row.className = `ghostwire-taint-header band-${band}`;
  row.dataset.tooltip = game.i18n.localize("GHOSTWIRE.Taint.Hint");

  const label = document.createElement("label");
  label.textContent = game.i18n.localize("GHOSTWIRE.Taint.Label");
  const input = numberInput(value, editable);
  const chip = document.createElement("span");
  chip.className = "ghostwire-taint-band";
  chip.textContent = bandLabel(band);
  row.append(label, input, chip);
  bindInput(input, row, actor, editable);

  const name = header.querySelector(".document-name") ?? header.querySelector("h1");
  if (name) name.after(row);
  else header.append(row);
  return true;
}

function getCorruptionHistory(actor) {
  const flag = actor?.getFlag?.(MODULE_ID, "corruptionHistory") ?? actor?.flags?.[MODULE_ID]?.corruptionHistory;
  return flag == null ? "" : String(flag);
}

function persistCorruptionHistory(actor, html) {
  return actor.update({ [`flags.${MODULE_ID}.corruptionHistory`]: String(html ?? "") });
}

function biographyTab(root) {
  return root.querySelector("section.tab[data-tab='biography']")
    ?? root.querySelector("[data-application-part='biography']")
    ?? root.querySelector("[data-tab='biography'].tab")
    ?? [...root.querySelectorAll("[data-tab='biography']")].find(el => el.matches("section, .tab, [data-application-part]"));
}

function createHistoryEditor(html, editable, actor) {
  const name = `flags.${MODULE_ID}.corruptionHistory`;
  if (editable && customElements.get("prose-mirror")) {
    const editor = document.createElement("prose-mirror");
    editor.setAttribute("name", name);
    editor.setAttribute("toggled", "");
    editor.value = html;
    const save = event => {
      event.stopPropagation();
      persistCorruptionHistory(actor, editor.value);
    };
    editor.addEventListener("change", save);
    editor.addEventListener("save", save);
    return editor;
  }

  const area = document.createElement("textarea");
  area.name = name;
  area.rows = 6;
  area.value = html;
  area.placeholder = game.i18n.localize("GHOSTWIRE.Taint.History.Placeholder");
  area.disabled = !editable;
  if (editable) {
    area.addEventListener("change", event => {
      event.stopPropagation();
      persistCorruptionHistory(actor, area.value);
    });
  }
  return area;
}

function injectCorruptionHistory(root, actor, editable) {
  if (root.querySelector(".ghostwire-corruption-history")) return true;
  const tab = biographyTab(root);
  if (!tab) return false;

  const html = getCorruptionHistory(actor);
  const fieldset = document.createElement("fieldset");
  fieldset.className = "ghostwire-corruption-history";
  const legend = document.createElement("legend");
  legend.textContent = game.i18n.localize("GHOSTWIRE.Taint.History.Label");
  legend.dataset.tooltip = game.i18n.localize("GHOSTWIRE.Taint.History.Hint");
  const hint = document.createElement("p");
  hint.className = "hint";
  hint.textContent = game.i18n.localize("GHOSTWIRE.Taint.History.Hint");
  fieldset.append(legend, hint);

  if (!editable && html) {
    const view = document.createElement("div");
    view.className = "ghostwire-corruption-history-view";
    const enrich = foundry.applications?.ux?.TextEditor?.implementation?.enrichHTML
      ?? globalThis.TextEditor?.enrichHTML?.bind(globalThis.TextEditor);
    if (enrich) {
      Promise.resolve(enrich(html, { async: true, secrets: actor.isOwner, relativeTo: actor }))
        .then(enriched => { view.innerHTML = enriched; });
    } else {
      view.textContent = html;
    }
    fieldset.append(view);
  } else {
    fieldset.append(createHistoryEditor(html, editable, actor));
  }

  const director = [...tab.querySelectorAll("prose-mirror, textarea, [name*='biography.director']")]
    .find(el => /biography\.director/i.test(el.getAttribute("name") ?? ""));
  const anchor = director?.closest("fieldset") ?? tab.querySelector("fieldset:last-of-type");
  if (anchor) anchor.after(fieldset);
  else tab.append(fieldset);
  return true;
}

function watchBiographyTab(root, inject) {
  if (root.dataset.ghostwireTaintBioWatch) return;
  root.dataset.ghostwireTaintBioWatch = "1";
  root.addEventListener("click", event => {
    const tab = event.target?.closest?.("[data-tab='biography']");
    if (!tab) return;
    requestAnimationFrame(() => inject());
  });
}

function injectTaintControls(app, element) {
  const actor = app?.document ?? app?.actor;
  if (!isHeroActor(actor)) return;
  const root = sheetRoot(app, element);
  if (!root) return;
  const editable = canEditTaint(app, actor);
  injectStatsFieldset(root, actor, editable);
  injectHeaderControl(root, actor, editable);
  injectCorruptionHistory(root, actor, editable);
  watchBiographyTab(root, () => injectCorruptionHistory(sheetRoot(app, app.element) ?? root, actor, editable));
}

export function registerTaint() {
  Hooks.on("preCreateActor", (actor, data, options, userId) => {
    if ((userId !== game.user.id) || (actor.type !== "hero")) return;
    const stats = data._stats ?? {};
    if (stats.duplicateSource || stats.compendiumSource || stats.exportSource) return;
    const updates = {};
    if (foundry.utils.getProperty(data, `flags.${MODULE_ID}.taint`) === undefined) {
      updates[`flags.${MODULE_ID}.taint`] = TAINT_MIN;
    }
    if (foundry.utils.getProperty(data, `flags.${MODULE_ID}.corruptionHistory`) === undefined) {
      updates[`flags.${MODULE_ID}.corruptionHistory`] = "";
    }
    if (Object.keys(updates).length) actor.updateSource(updates);
  });

  // World heroes imported before B80: stamp 0 once so the sheet reads a real flag.
  Hooks.once("ready", async () => {
    const pending = [];
    for (const actor of game.actors) {
      if (actor.type !== "hero") continue;
      if (actor.getFlag(MODULE_ID, "taint") !== undefined) continue;
      pending.push(actor.update({ [`flags.${MODULE_ID}.taint`]: TAINT_MIN }));
    }
    if (pending.length) {
      await Promise.all(pending);
      console.log(`${MODULE_ID} | stamped Taint 0 onto ${pending.length} hero(es)`);
    }
  });

  // Same overlay family as Body Integrity / Wired (Draw Steel hero sheet, AppV2).
  Hooks.on("renderDrawSteelHeroSheet", injectTaintControls);
  // Fallback if a world still fires the generic actor-sheet hook for heroes.
  Hooks.on("renderActorSheet", (app, element) => {
    if (!isHeroActor(app?.document ?? app?.actor)) return;
    injectTaintControls(app, element);
  });

  console.log(`${MODULE_ID} | Taint: hero sheet 0–${TAINT_MAX} registered (flags.${MODULE_ID}.taint)`);
}
