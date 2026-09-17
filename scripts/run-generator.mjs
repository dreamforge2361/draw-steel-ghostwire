// Run Generator (B39): a Director-only popup that rolls a Reach run — brief, pay, beats, opposition, support — and writes it to a
// mission Journal. Generation is pure and seeded (scripts/run-tables.mjs); tables live in scripts/data/runs/.
// Opposition resolves by name against the live Ghostwire Bestiary pack. Design: docs/directors/run-generator.md.

import { RUN_TYPES, STRATA_KEYS, HEATS, WIRED, TABLE_FILES, echelonForLevel, newSeed, resolveParams, generateRun } from "./run-tables.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const BESTIARY_PACK = `${MODULE_ID}.bestiary`;
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const loc = (key, data) => (data ? game.i18n.format(`GHOSTWIRE.RunGenerator.${key}`, data) : game.i18n.localize(`GHOSTWIRE.RunGenerator.${key}`));
const esc = text => foundry.utils.escapeHTML(String(text ?? ""));
const yen = value => `¥${Number(value).toLocaleString(game.i18n.lang)}`;

/* ---------- data ---------- */

let tablesPromise = null;
/** Load the run tables once per session. */
function loadTables() {
  tablesPromise ??= Promise.all(TABLE_FILES.map(async file => [file, await foundry.utils.fetchJsonWithTimeout(`modules/${MODULE_ID}/scripts/data/runs/${file}.json`)]))
    .then(Object.fromEntries)
    .catch(error => {
      tablesPromise = null;
      throw error;
    });
  return tablesPromise;
}

/** Bestiary Actors by name: uuid, Draw Steel level, and organization. */
async function bestiaryIndex() {
  const pack = game.packs.get(BESTIARY_PACK);
  const index = new Map();
  if (!pack) return index;
  const entries = await pack.getIndex({ fields: ["system.monster.level", "system.monster.organization"] });
  for (const entry of entries) {
    index.set(entry.name, {
      uuid: entry.uuid ?? `Compendium.${BESTIARY_PACK}.Actor.${entry._id}`,
      level: foundry.utils.getProperty(entry, "system.monster.level") ?? null,
      org: foundry.utils.getProperty(entry, "system.monster.organization") ?? null,
    });
  }
  return index;
}

/** `@UUID[...]{name}` when the Actor is in the pack, otherwise escaped plain text. */
const link = ref => (ref?.uuid ? `@UUID[${ref.uuid}]{${ref.name}}` : esc(ref?.name));

/* ---------- app ---------- */

export class RunGenerator extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "ghostwire-run-generator",
    classes: ["ghostwire-run-generator"],
    window: { title: "GHOSTWIRE.RunGenerator.Title", icon: "fa-solid fa-briefcase", resizable: true },
    position: { width: 900, height: 720 },
    actions: {
      generate: RunGenerator.#onGenerate,
      reroll: RunGenerator.#onReroll,
      createJournal: RunGenerator.#onCreateJournal,
    },
  };

  static PARTS = {
    generator: {
      template: `modules/${MODULE_ID}/templates/run-generator.hbs`,
      scrollable: [".rg-result"],
    },
  };

  /** Raw dial values, kept across renders. */
  dials = { name: "", level: 1, echelon: "auto", type: "extraction", stratum: "flats", heat: "medium", wired: "auto", seed: "" };

  /** The last generated run, or null. */
  result = null;

  /** The last auto-suggested name, so a Director's own name is never overwritten. */
  #autoName = "";

  /** @override */
  async _prepareContext(options) {
    const level = Number(this.dials.level) || 1;
    const option = (value, label, current) => ({ value, label, isSelected: String(value) === String(current) });
    const context = {
      dials: this.dials,
      levelOptions: Array.from({ length: 10 }, (_, i) => option(i + 1, String(i + 1), level)),
      echelonOptions: [option("auto", loc("EchelonAuto", { echelon: echelonForLevel(level) }), this.dials.echelon),
        ...[1, 2, 3, 4].map(e => option(e, String(e), this.dials.echelon))],
      typeOptions: RUN_TYPES.map(t => option(t, loc(`Types.${t}`), this.dials.type)),
      stratumOptions: STRATA_KEYS.map(s => option(s, loc(`Strata.${s}`), this.dials.stratum)),
      heatOptions: HEATS.map(h => option(h, loc(`Heat.${h}`), this.dials.heat)),
      wiredOptions: [option("auto", loc("WiredStates.auto"), this.dials.wired), ...WIRED.map(w => option(w, loc(`WiredStates.${w}`), this.dials.wired))],
      packMissing: !game.packs.get(BESTIARY_PACK),
      hasResult: !!this.result,
    };
    if (this.result) context.run = await this.#resultContext(this.result);
    return context;
  }

  /** Display strings and enriched Actor links for the result panel. */
  async #resultContext(run) {
    const enrich = html => foundry.applications.ux.TextEditor.implementation.enrichHTML(html);
    const p = run.params;
    const ech = p.echelon;
    const tierNote = o => (o.tier === "minion") ? ` <span class="rg-dim">${esc(loc("Squad"))}</span>` : "";
    const actorLine = o => `${link(o)}${o.level ? ` <span class="rg-dim">L${o.level}</span>` : ""}${tierNote(o)}${o.uuid ? "" : ` <span class="rg-missing">${esc(loc("NotInPack"))}</span>`}`;
    return {
      name: p.name || run.autoName,
      summary: loc("Summary", { type: loc(`Types.${run.typeKey}`), stratum: loc(`Strata.${run.stratumKey}`), level: p.level, echelon: ech, heat: loc(`Heat.${p.heat}`), wired: loc(`WiredStates.${p.wired}`), seed: p.seed }),
      patron: await enrich(link(run.patron)),
      pitch: run.patron.pitch,
      meet: run.patron.meet,
      objective: run.objective,
      blurb: run.stratumBlurb,
      objectiveClock: loc("ObjectiveClock", { segments: run.clocks.objective }),
      alertClock: loc("AlertClock", { segments: run.clocks.alert, response: run.clocks.response }),
      payRange: `${yen(run.pay.min)} – ${yen(run.pay.max)}`,
      payMid: loc("SuggestedPay", { amount: yen(run.pay.mid) }),
      payScale: run.pay.scaleLabel,
      payPays: run.pay.pays,
      payExtra: run.pay.extra ? loc("PayExtra", { extra: run.pay.extra }) : null,
      data: run.data && {
        rating: loc("NodeRating", { lo: run.data.ratingLo, hi: run.data.ratingHi }),
        paydata: (run.data.paydataLo != null) ? loc("Paydata", { lo: yen(run.data.paydataLo), hi: yen(run.data.paydataHi) }) : null,
        ladder: await enrich(run.data.ladder.map(link).join(" → ")),
      },
      beats: run.beats.map((beat, i) => ({ n: i + 1, kind: beat.kind, kindLabel: loc(`BeatKinds.${beat.kind}`), text: beat.text })),
      opposition: await enrich(run.opposition.map(o => `<li>${actorLine(o)}</li>`).join("")),
      wiredOpposition: run.wiredOpposition.length ? await enrich(run.wiredOpposition.map(o => `<li>${actorLine(o)}</li>`).join("")) : null,
      escalation: run.escalation.length ? await enrich(run.escalation.map(e => `<li><strong>${esc(loc(`Heat.${e.heat}`))}:</strong> ${e.actors.map(link).join(", ")} — ${esc(e.response)}</li>`).join("")) : null,
      scaleUp: run.scaleUp,
      support: await enrich(run.support.map(s => `<li>${link(s)} — ${esc(s.note)}</li>`).join("")),
      scenes: sceneLines(run),
    };
  }

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
    // Dials update in place; changing the level refreshes the "Auto (echelon)" label.
    for (const input of this.element.querySelectorAll("[data-dial]")) {
      input.addEventListener("change", event => {
        const field = event.currentTarget.dataset.dial;
        this.dials[field] = event.currentTarget.value;
        if (field === "level") this.render();
      });
    }
  }

  /** Read the dials, resolve them, and generate. */
  async #generate({ reroll = false } = {}) {
    if (!game.user.isGM) return;
    let tables;
    try {
      tables = await loadTables();
    } catch (error) {
      console.error(`${MODULE_ID} | Run Generator tables failed to load`, error);
      ui.notifications.error(loc("TablesFailed"));
      return;
    }
    if (reroll || !this.dials.seed) this.dials.seed = newSeed();
    const { params, notes } = resolveParams(tables, this.dials);
    for (const note of notes) {
      if (note === "StratumSwitched") {
        ui.notifications.info(loc("StratumSwitched", { type: loc(`Types.${params.type}`), stratum: loc(`Strata.${params.stratum}`) }));
        this.dials.stratum = params.stratum;
      } else if (note === "StubType") ui.notifications.info(loc("StubType"));
    }
    const run = generateRun(tables, await bestiaryIndex(), params);
    // Keep a Director-typed name; otherwise use (and remember) the rolled one.
    if (!this.dials.name || (this.dials.name === this.#autoName)) {
      this.#autoName = run.autoName;
      this.dials.name = run.autoName;
    }
    run.params.name = this.dials.name;
    this.result = run;
    this.render();
  }

  static async #onGenerate() {
    await this.#generate();
  }

  static async #onReroll() {
    await this.#generate({ reroll: true });
  }

  static async #onCreateJournal() {
    if (!game.user.isGM || !this.result) return;
    const entry = await createRunJournal(this.result);
    if (!entry) return;
    ui.notifications.info(loc("JournalCreated", { name: entry.name }));
    entry.sheet.render({ force: true });
  }
}

/* ---------- journal ---------- */

function sceneLines(run) {
  const lines = [loc("Scenes.Meet", { meet: run.patron.meet }), loc("Scenes.Site", { place: run.place })];
  if (run.params.wired !== "none") lines.push(loc("Scenes.Wired", { stratum: loc(`Strata.${run.stratumKey}`) }));
  lines.push(loc("Scenes.Climax", { place: run.place }), loc("Scenes.Exit"));
  return lines;
}

async function runsFolder() {
  const existing = game.folders.find(f => (f.type === "JournalEntry") && f.getFlag(MODULE_ID, "runsFolder"));
  if (existing) return existing;
  return Folder.implementation.create({ name: loc("JournalFolder"), type: "JournalEntry", color: "#1a1024", flags: { [MODULE_ID]: { runsFolder: true } } });
}

/** Write the run as a Journal Entry (Brief / Pay / Beats / Opposition / Support / Scenes) in the Ghostwire Runs folder. */
export async function createRunJournal(run) {
  const p = run.params;
  const list = items => `<ul>${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
  const heading = key => `<h2>${esc(loc(`Sections.${key}`))}</h2>`;
  const actorLine = o => `${link(o)}${o.level ? ` (L${o.level} ${esc(o.org ?? "")})` : ""}${o.tier === "minion" ? ` — ${esc(loc("Squad"))}` : ""}`;

  const brief = [
    `<p><em>${esc(loc("Summary", { type: loc(`Types.${run.typeKey}`), stratum: loc(`Strata.${run.stratumKey}`), level: p.level, echelon: p.echelon, heat: loc(`Heat.${p.heat}`), wired: loc(`WiredStates.${p.wired}`), seed: p.seed }))}</em></p>`,
    `<p><strong>${esc(loc("Patron"))}:</strong> ${link(run.patron)} — ${esc(run.patron.pitch)}</p>`,
    `<p><strong>${esc(loc("Meet"))}:</strong> ${esc(run.patron.meet)}</p>`,
    `<p><strong>${esc(loc("Objective"))}:</strong> ${esc(run.objective)}</p>`,
    `<p><strong>${esc(loc(`Strata.${run.stratumKey}`))}:</strong> ${esc(run.stratumBlurb)}</p>`,
    `<h3>${esc(loc("Clocks"))}</h3>`,
    list([esc(loc("ObjectiveClock", { segments: run.clocks.objective })), esc(loc("AlertClock", { segments: run.clocks.alert, response: run.clocks.response }))]),
  ].join("");

  const pay = [
    `<p><strong>${esc(`${yen(run.pay.min)} – ${yen(run.pay.max)}`)}</strong> · ${esc(loc("SuggestedPay", { amount: yen(run.pay.mid) }))}</p>`,
    `<p>${esc(run.pay.scaleLabel)}. ${esc(loc("PaysIn", { pays: run.pay.pays }))}</p>`,
    run.pay.extra ? `<p>${esc(loc("PayExtra", { extra: run.pay.extra }))}</p>` : "",
    run.data ? [
      `<h3>${esc(loc("Sections.DataValue"))}</h3>`,
      list([esc(loc("NodeRating", { lo: run.data.ratingLo, hi: run.data.ratingHi })),
        ...(run.data.paydataLo != null ? [esc(loc("Paydata", { lo: yen(run.data.paydataLo), hi: yen(run.data.paydataHi) }))] : []),
        `${esc(loc("IceLadder"))}: ${run.data.ladder.map(link).join(" → ")}`]),
    ].join("") : "",
    `<p><em>${esc(loc("PaySource"))}</em></p>`,
  ].join("");

  const beats = `<ol>${run.beats.map(b => `<li><strong>${esc(loc(`BeatKinds.${b.kind}`))}:</strong> ${esc(b.text)}</li>`).join("")}</ol>`;

  const opposition = [
    list(run.opposition.map(actorLine)),
    run.wiredOpposition.length ? `<h3>${esc(loc("Sections.WiredOpposition"))}</h3>${list(run.wiredOpposition.map(actorLine))}` : "",
    run.escalation.length ? `<h3>${esc(loc("Sections.Escalation"))}</h3>${list(run.escalation.map(e => `<strong>${esc(loc(`Heat.${e.heat}`))}:</strong> ${e.actors.map(link).join(", ")} — ${esc(e.response)}`))}` : "",
    run.scaleUp ? `<p><em>${esc(loc("ScaleUp"))}</em></p>` : "",
  ].join("");

  const support = list(run.support.map(s => `${link(s)} — ${esc(s.note)}`));
  const scenes = `<p>${esc(loc("ScenesHint"))}</p>${list(sceneLines(run).map(esc))}`;

  const page = (key, content, sort) => ({ name: loc(`Sections.${key}`), type: "text", sort, text: { content: heading(key) + content, format: CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML } });
  const folder = await runsFolder();
  return JournalEntry.implementation.create({
    name: p.name || run.autoName,
    folder: folder?.id ?? null,
    pages: [
      page("Brief", brief, 100000), page("Pay", pay, 200000), page("Beats", beats, 300000),
      page("Opposition", opposition, 400000), page("Support", support, 500000), page("Scenes", scenes, 600000),
    ],
    flags: { [MODULE_ID]: { run: { params: { ...p }, generated: Date.now() } } },
  });
}

/* ---------- registration ---------- */

/** Open (or bring to front) the Run Generator. Directors only. */
export function openRunGenerator() {
  if (!game.user.isGM) {
    ui.notifications.warn(loc("GMOnly"));
    return null;
  }
  const existing = foundry.applications.instances.get(RunGenerator.DEFAULT_OPTIONS.id);
  if (existing) return existing.render({ force: true });
  return new RunGenerator().render({ force: true });
}

function toggleRunGenerator() {
  const existing = foundry.applications.instances.get(RunGenerator.DEFAULT_OPTIONS.id);
  if (existing?.rendered) return existing.close();
  return openRunGenerator();
}

/** Register the Run Generator: scene control button (GM only), keybinding, and API. Call during the init hook. */
export function registerRunGenerator() {
  game.keybindings.register(MODULE_ID, "runGenerator", {
    name: "GHOSTWIRE.RunGenerator.Keybinding",
    editable: [],
    restricted: true,
    onDown: () => {
      toggleRunGenerator();
      return true;
    },
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  Hooks.on("getSceneControlButtons", controls => {
    const tools = controls.tokens?.tools;
    if (!tools || !game.user?.isGM) return;
    tools.ghostwireRunGenerator = {
      name: "ghostwireRunGenerator",
      title: "GHOSTWIRE.RunGenerator.Title",
      icon: "fa-solid fa-briefcase",
      order: Object.keys(tools).length,
      button: true,
      visible: true,
      onChange: () => toggleRunGenerator(),
    };
  });

  Hooks.once("ready", () => {
    const module = game.modules.get(MODULE_ID);
    if (module) module.api = { ...(module.api ?? {}), openRunGenerator, createRunJournal };
    game.ghostwire = { ...(game.ghostwire ?? {}), openRunGenerator };
  });
}
