// F18 (0.3.117) — Base workshop benches: Project aids.
//
// Michael lock 2026-09-23: a bench is bought, expensive, placeable, and gives exactly two things.
//
//   1. **+1 Lifestyle project slot** while a bench is available at the crew's base or on the scene
//      for that respite — capped at **+1 in total**, however many benches are placed. Six benches
//      are not six slots. RAW: docs/raw/26-lifestyle-downtime.md.
//   2. **One edge** on a Project Power Roll whose craft family matches the bench. A wrong-family
//      bench gives nothing, and several matching benches still give one edge.
//
// A bench never waives ¥, Body Integrity, or Availability, and it is not the Facility Rigger's Home
// Ground / Safehouse Beacon — that stays its own system (`16`, `23`).
//
// Shape (E1 Base Assets pattern, reused rather than reinvented): a `treasure` Item in the vehicles
// pack carrying `flags.draw-steel-ghostwire.vehicle.baseAsset` — so scripts/machines.mjs Deploy
// already places it as a dual Item + Actor with no new placement code — plus a
// `flags.draw-steel-ghostwire.workshopBench` block that is this module's whole data contract:
//
//     workshopBench: { family, grantsExtraProjectSlot: true, slotCap: 1, edge: 1 }
//
// The auto-edge, honestly. A Draw Steel Project is a world Item a player types a name into; nothing
// on it says which craft family it belongs to, and guessing from its name would silently hand out
// (or silently withhold) an edge on the strength of a string match. So the edge is automated only
// once somebody has *said* what the Project is: a Director tags the Project from its context menu,
// which writes `flags.draw-steel-ghostwire.craftFamily`, and from then on
// `ProjectModel#rollPrompt` — the system's own seam, which already takes a `config.modifiers` bag —
// is pre-seeded with the edge. An untagged Project rolls untouched and the dialog is one click from
// the same edge, which is what the F18 brief asks for as the fallback.
//
// Everything above the "runtime" divider is Foundry-free so tools/f18-workshop-benches-smoke.mjs can
// import and execute it under Node.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.WorkshopBench";

/** The six shipped craft families. A bench's `family` is one of these; a Project's tag likewise. */
export const BENCH_FAMILIES = Object.freeze(["armor", "weapons", "chrome", "matrix", "vehicles", "ritual"]);

/** The Michael cap: benches add at most this many project slots, no matter how many are placed. */
export const BENCH_SLOT_CAP = 1;

/** One edge, never two, however many matching benches sit in the room. */
export const BENCH_EDGE = 1;

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? doc?.flags?.["draw-steel-ghostwire"] ?? {};

/** The `workshopBench` block on an Item or a deployed Actor, or null. */
export function benchData(doc) {
  const data = gwFlags(doc).workshopBench;
  if (!data || !BENCH_FAMILIES.includes(String(data.family))) return null;
  return data;
}

export function isWorkshopBench(doc) {
  return !!benchData(doc);
}

export function benchFamily(doc) {
  return benchData(doc)?.family ?? null;
}

/**
 * Extra Lifestyle project slots from a set of benches.
 * The cap is the whole rule: one bench and six benches both give +1, and none give 0.
 * @param {Iterable<object>} benches  Bench Items / Actors, or anything else (ignored).
 * @returns {number} 0 or 1.
 */
export function extraProjectSlots(benches) {
  for (const bench of benches ?? []) {
    const data = benchData(bench);
    if (data?.grantsExtraProjectSlot) return BENCH_SLOT_CAP;
  }
  return 0;
}

/**
 * The edge a Project of `family` gets from a set of benches.
 * @param {object} options
 * @param {string|null} options.family   The Project's craft family; null when it is untagged.
 * @param {Iterable<object>} options.benches
 * @returns {number} 0 or 1.
 */
export function benchEdge({ family, benches } = {}) {
  if (!family || !BENCH_FAMILIES.includes(String(family))) return 0;
  for (const bench of benches ?? []) {
    if (benchFamily(bench) === family) return BENCH_EDGE;
  }
  return 0;
}

/** Which families this set of benches covers, de-duplicated and in ship order. */
export function benchFamilies(benches) {
  const found = new Set();
  for (const bench of benches ?? []) {
    const family = benchFamily(bench);
    if (family) found.add(family);
  }
  return BENCH_FAMILIES.filter(family => found.has(family));
}

/**
 * What a crew's benches are worth this respite, as one object the director note and the chat card
 * both read.
 * @param {Iterable<object>} benches
 * @returns {{slots: number, families: string[], count: number, capped: boolean}}
 */
export function benchSummary(benches) {
  const rows = [...(benches ?? [])].filter(isWorkshopBench);
  const families = benchFamilies(rows);
  return {
    slots: extraProjectSlots(rows),
    families,
    count: rows.length,
    capped: rows.length > BENCH_SLOT_CAP,
  };
}

/** The Ghostwire craft family tagged onto a Project Item, or null when nobody has tagged it. */
export function projectFamily(project) {
  const family = gwFlags(project).craftFamily;
  return BENCH_FAMILIES.includes(String(family)) ? String(family) : null;
}

/* ============================================ runtime (not imported by the smoke) */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const familyLabel = family => game.i18n.localize(`${L}.Families.${family}`);

/**
 * Benches in reach of an actor this respite.
 *
 * Two places count, and deliberately only two: a bench Item the hero (or a crewmate on the same
 * scene) is carrying, and a bench Actor already placed on the viewed scene. That is "available at
 * the crew's base or on the scene", and it is why the cap matters — a crew that has parked all six
 * benches on one map still gets one slot.
 */
export function benchesFor(actor) {
  const rows = [];
  for (const item of actor?.items ?? []) if (isWorkshopBench(item)) rows.push(item);
  const scene = canvas?.scene ?? game.scenes?.viewed ?? null;
  for (const token of scene?.tokens ?? []) {
    const placed = token.actor;
    if (placed && isWorkshopBench(placed)) rows.push(placed);
  }
  return rows;
}

/**
 * The roll edge. `ProjectModel#rollPrompt(config, dialogOptions)` builds its dialog from
 * `config.modifiers`, so seeding an edge there puts it in the dialog *before* the dice move, where
 * the player can see it and the Director can clear it. Same philosophy as F13 and F14: never
 * silently change a number after the fact.
 */
function patchProjectRoll() {
  const ProjectModel = CONFIG.Item.dataModels?.project;
  if (!ProjectModel?.prototype.rollPrompt) {
    console.warn(`${MODULE_ID} | ProjectModel#rollPrompt not found; workshop benches add no automatic edge`);
    return;
  }
  const prior = ProjectModel.prototype.rollPrompt;
  ProjectModel.prototype.rollPrompt = function(config = {}, dialogOptions = {}) {
    const family = projectFamily(this.parent);
    if (family) {
      const edges = benchEdge({ family, benches: benchesFor(this.actor) });
      if (edges) {
        config = { ...config, modifiers: { ...(config.modifiers ?? {}) } };
        config.modifiers.edges = (Number(config.modifiers.edges) || 0) + edges;
      }
    }
    return prior.call(this, config, dialogOptions);
  };
}

/** Item sheet: what this bench actually gives, under the catalog ¥ line. */
function injectBenchLine(app, element) {
  const item = app.document;
  element.querySelector(".ghostwire-bench-line")?.remove();
  const data = benchData(item);
  if (!data) return;
  const anchor = element.querySelector(".ghostwire-chrome-line") ?? element.querySelector(".sheet-header .document-name");
  if (!anchor) return;
  const line = document.createElement("div");
  line.className = "ghostwire-bench-line";
  line.textContent = loc("SheetLine", { family: familyLabel(data.family), cap: BENCH_SLOT_CAP });
  anchor.after(line);
}

/** A Project's craft family, so the bench edge knows what it is looking at. */
async function promptProjectFamily(project) {
  if (!project) return null;
  const current = projectFamily(project) ?? "";
  const options = [`<option value="">${loc("Prompt.None")}</option>`]
    .concat(BENCH_FAMILIES.map(family =>
      `<option value="${family}"${family === current ? " selected" : ""}>${familyLabel(family)}</option>`))
    .join("");
  const data = await foundry.applications.api.DialogV2.input({
    window: { title: loc("Prompt.Title"), icon: "fa-solid fa-screwdriver-wrench" },
    content: `<p>${loc("Prompt.Hint", { name: foundry.utils.escapeHTML(project.name) })}</p>`
      + `<div class="form-group"><label>${loc("Prompt.Family")}</label><select name="family">${options}</select></div>`,
    ok: { label: `${L}.Prompt.Confirm`, icon: "fa-solid fa-check" },
  });
  if (!data) return null;
  const family = BENCH_FAMILIES.includes(data.family) ? data.family : null;
  await project.setFlag(MODULE_ID, "craftFamily", family);
  ui.notifications.info(family
    ? loc("Notify.Tagged", { name: project.name, family: familyLabel(family) })
    : loc("Notify.Untagged", { name: project.name }));
  return family;
}

/** Post what the crew's benches are worth this respite. Director-facing bookkeeping, in one card. */
export async function reportBenches(actor) {
  const summary = benchSummary(benchesFor(actor));
  const families = summary.families.length
    ? summary.families.map(familyLabel).join(", ")
    : loc("Report.NoFamilies");
  const capped = summary.capped ? `<p class="hint">${loc("Report.Capped", { count: summary.count })}</p>` : "";
  await ChatMessage.create({
    speaker: actor ? ChatMessage.getSpeaker({ actor }) : undefined,
    content: `<div class="ghostwire-bench-card"><h3>${loc("Report.Title")}</h3>`
      + `<p>${loc("Report.Slots", { slots: summary.slots, count: summary.count })}</p>`
      + `<p>${loc("Report.Edges", { families })}</p>${capped}`
      + `<p class="hint">${loc("Report.Hint")}</p></div>`,
    flags: { [MODULE_ID]: { benchReport: true } },
  });
  return summary;
}

function benchContextMenu(app, menuItems) {
  if (typeof app._getEmbeddedDocument !== "function") return;
  const docOf = target => app._getEmbeddedDocument(target);
  menuItems.push(
    {
      label: `${L}.Menu.Family`, icon: "fa-solid fa-screwdriver-wrench",
      visible: target => {
        const doc = docOf(target);
        return (doc?.type === "project") && (doc.isOwner || game.user.isGM);
      },
      onClick: (event, target) => promptProjectFamily(docOf(target)),
    },
    {
      label: `${L}.Menu.Report`, icon: "fa-solid fa-clipboard-list",
      visible: target => isWorkshopBench(docOf(target)),
      onClick: (event, target) => reportBenches(docOf(target)?.parent instanceof Actor ? docOf(target).parent : null),
    },
  );
}

export function registerWorkshopBenches() {
  Hooks.once("ready", () => {
    patchProjectRoll();
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        workshopBenches: {
          BENCH_FAMILIES,
          BENCH_SLOT_CAP,
          isWorkshopBench,
          benchFamily,
          benchesFor,
          benchEdge,
          benchSummary,
          extraProjectSlots,
          projectFamily,
          reportBenches,
        },
      };
    }
    console.log(`${MODULE_ID} | F18 Workshop benches: +${BENCH_SLOT_CAP} project slot (capped) + matching-family edge`);
  });

  Hooks.on("getDocumentListContextOptions", benchContextMenu);
  Hooks.on("renderDrawSteelItemSheet", injectBenchLine);
}
