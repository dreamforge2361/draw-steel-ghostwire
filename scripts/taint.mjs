// B80 Taint track (docs/spikes/B80-CORRUPTION-TAINT-TRACK.md, docs/raw/27-corruption-taint.md):
// Shared hero stain 0–12 on flags.<module>.taint. Bands Clean / Marked / Stained / Claimed / Hollowed.
// Sheet field only this pass — no rest hook, no chrome hook, no band Active Effects.

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

export function registerTaint() {
  Hooks.on("preCreateActor", (actor, data, options, userId) => {
    if ((userId !== game.user.id) || (actor.type !== "hero")) return;
    const stats = data._stats ?? {};
    if (stats.duplicateSource || stats.compendiumSource || stats.exportSource) return;
    if (foundry.utils.getProperty(data, `flags.${MODULE_ID}.taint`) !== undefined) return;
    actor.updateSource({ [`flags.${MODULE_ID}.taint`]: TAINT_MIN });
  });

  // Hero sheet: Taint 0–12 + band label under Body Integrity. Chrome / rest never write this flag.
  Hooks.on("renderDrawSteelHeroSheet", (app, element) => {
    const stats = element.querySelector("section.tab[data-tab='stats']");
    if (!stats || stats.querySelector(".ghostwire-taint")) return;
    const actor = app.document;
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
    const input = document.createElement("input");
    Object.assign(input, {
      type: "number",
      min: String(TAINT_MIN),
      max: String(TAINT_MAX),
      step: 1,
      value,
      disabled: !app.isEditable,
    });
    input.addEventListener("change", event => {
      event.stopPropagation();
      const next = clampTaint(input.value);
      input.value = String(next);
      actor.update({ [`flags.${MODULE_ID}.taint`]: next });
    });
    group.append(label, input);
    fieldset.append(group);

    const bandLine = document.createElement("p");
    bandLine.className = "ghostwire-taint-band hint";
    bandLine.textContent = game.i18n.format("GHOSTWIRE.Taint.BandLine", {
      band: game.i18n.localize(`GHOSTWIRE.Taint.Bands.${band}`),
      value,
      max: TAINT_MAX,
    });
    fieldset.append(bandLine);

    const anchor = stats.querySelector(".ghostwire-integrity") ?? stats.querySelector("fieldset.resources");
    if (anchor) anchor.after(fieldset);
    else stats.prepend(fieldset);
  });

  console.log(`${MODULE_ID} | Taint: hero sheet 0–${TAINT_MAX} registered (flags.${MODULE_ID}.taint)`);
}
