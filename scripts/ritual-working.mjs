// 0.3.91 — Ritual Working applet (N2): the five stages of a Working (Study → Components → Sanctum → Seal →
// Payoff) in one panel, openable by every player. Rules: docs/raw/22-the-veil.md.
//
// Three locks shape this file:
//   1. Stages that are Projects are *stock Draw Steel Project Items* on the Ritual Leader — goal, progress and
//      the low1 / middle2 / high3 roll all come from the system (`item.system.roll()`), and they eat the hero's
//      Lifestyle project slots like any other Project. There is no parallel tracker.
//   2. The Ritual Leader is whoever owns the Formula Item and selects it here. Every Project roll, the sealing
//      Power Roll and the ¥ debit land on that Actor.
//   3. Resource firewall: a Working never spends Essence, Conviction or Resonance. The only resource this file
//      touches is `system.hero.wealth` (the kiosk's ¥ path), and only when a player presses Pay.
//
// Helpers above the app class are Foundry-free so tools/ritual-working-smoke.mjs can check the ladder in Node.

import { WEALTH_PATH, formatYen, getWealth } from "./kiosk.mjs";
import { formulaSubtitle, isLearned, isRitualFormula, ritualData, setFormulaLearned } from "./rituals.mjs";

export const MODULE_ID = "draw-steel-ghostwire";
export const WORKINGS_FLAG = "ritualWorkings";
export const PROJECT_FLAG = "ritualWorking";
export const STAGES = Object.freeze(["study", "components", "sanctum", "seal", "payoff"]);
/** A temporary sanctum tops out at rating 3, so Magnitude 4–5 always needs a built one (`22`, Sanctum). */
export const TEMP_SANCTUM_CAP = 3;
export const SANCTUM_MODES = Object.freeze(["temporary", "built"]);
export const SEAL_CHARACTERISTICS = Object.freeze(["reason", "intuition", "presence"]);

const L = "GHOSTWIRE.RitualWorking";

/* -------------------------------------------- pure rules */

/** Study is a Project at goal Magnitude × 2. */
export const studyGoal = magnitude => Math.max(1, clampMagnitude(magnitude) * 2);
/** A built sanctum is a Project at goal Magnitude × 3. */
export const sanctumGoal = magnitude => Math.max(1, clampMagnitude(magnitude) * 3);
/** Magnitude 4+ cannot be sealed out of a claimed room — the sanctum must be built. */
export const needsBuiltSanctum = magnitude => clampMagnitude(magnitude) > TEMP_SANCTUM_CAP;

export function clampMagnitude(value) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return 1;
  return Math.min(5, Math.max(1, n));
}

/** Veil pressure leaks about equal to Magnitude once study is done (`22`, Detection). */
export function leakBand(magnitude) {
  const m = clampMagnitude(magnitude);
  if (m <= 2) return "district";
  return (m === 3) ? "hive" : "hivewide";
}

/** `"¥1,200"` → `1200`; fetch reagents (`"¥ —"`) and anything unpriced → `null`. */
export function parseYen(text) {
  const digits = String(text ?? "").replace(/[^0-9]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

/** The Magnitude window this Formula copy may be written at, from `flags.…ritual`. */
export function magnitudeRange(ritual) {
  const min = clampMagnitude(ritual?.magnitude ?? 1);
  const max = Math.max(min, clampMagnitude(ritual?.magnitudeMax ?? min));
  return { min, max };
}

/**
 * The Components totals a card prints, normalized.
 *
 * Cards use the list two ways and the shape tells them apart: a **ladder** (one total per Magnitude in an open
 * range — Scrub the Stain prints five) versus **paths** (one total per component path at a fixed Magnitude —
 * Ward the Room prints ¥75 Veil / ¥40 Wire-chalk skin).
 *
 * @returns {{index: number, text: string, amount: number|null, magnitude: number|null}[]}
 */
export function componentOptions(ritual) {
  const totals = Array.isArray(ritual?.componentsTotal) ? ritual.componentsTotal
    : (ritual?.componentsTotal ? [ritual.componentsTotal] : []);
  const { min, max } = magnitudeRange(ritual);
  const ladder = (max > min) && (totals.length === (max - min + 1));
  return totals.map((text, index) => ({
    index,
    text: String(text),
    amount: parseYen(text),
    magnitude: ladder ? (min + index) : null,
  }));
}

export const isMagnitudeLadder = ritual => componentOptions(ritual).some(option => option.magnitude !== null);

/**
 * The Components total this Working owes. On a ladder the chosen Magnitude picks it; otherwise the chosen path does.
 * @returns {{index: number, text: string, amount: number|null, magnitude: number|null}|null}
 */
export function componentsFor(ritual, { magnitude, index = 0 } = {}) {
  const options = componentOptions(ritual);
  if (!options.length) return null;
  const byMagnitude = options.find(option => option.magnitude === clampMagnitude(magnitude));
  if (byMagnitude) return byMagnitude;
  return options[Math.min(options.length - 1, Math.max(0, Math.round(Number(index)) || 0))];
}

/**
 * The sealing Power Roll's characteristic (Draw Steel keys; Ghostwire labels them Logic / Instinct / Persona).
 * A tradition-locked card names the tradition, so it wins; a General card falls back to the leader's class.
 */
export function traditionCharacteristic({ leaders = "", classDsid = "", className = "" } = {}) {
  const named = String(leaders ?? "").toLowerCase();
  if (named.includes("street priest")) return "presence";
  if (named.includes("elementalist") || named.includes("technomancer")) return "reason";
  const own = `${classDsid} ${className}`.toLowerCase();
  if (own.includes("street-priest") || own.includes("street priest")) return "presence";
  // Elementalist and Technomancer both seal on Logic (Matrix Theory applies for Wire-rites), and so does
  // anyone leading a General Working without a caster class to name.
  return "reason";
}

/** The tradition a card is locked to, or null when it is General / open. */
export function lockedTradition(leaders) {
  const named = String(leaders ?? "").toLowerCase();
  if (!named.includes("only")) return null;
  if (named.includes("street priest")) return "street-priest";
  if (named.includes("elementalist")) return "elementalist";
  if (named.includes("technomancer")) return "technomancer";
  return null;
}

/** False when the card is locked to a tradition the leader does not have — a warning, never a block. */
export function leaderMatchesTradition({ leaders = "", classDsid = "", className = "" } = {}) {
  const locked = lockedTradition(leaders);
  if (!locked) return true;
  const own = `${classDsid} ${className}`.toLowerCase().replace(/\s+/g, "-");
  return own.includes(locked);
}

export function newWorkingId() {
  const rnd = globalThis.foundry?.utils?.randomID;
  if (typeof rnd === "function") return rnd();
  return `rw${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** A fresh Working record. Nothing here is a Project yet — the stages create those on demand. */
export function newWorking({ formulaUuid = null, formulaName = "", ritual = {}, magnitude = null } = {}) {
  const { min, max } = magnitudeRange(ritual);
  const chosen = Math.min(max, Math.max(min, clampMagnitude(magnitude ?? min)));
  return normalizeWorking({
    id: newWorkingId(),
    formulaUuid,
    formulaName,
    family: ritual.family ?? "",
    leaders: ritual.leaders ?? "",
    magnitude: chosen,
    magnitudeMin: min,
    magnitudeMax: max,
    sanctumMode: needsBuiltSanctum(chosen) ? "built" : "temporary",
    started: Date.now(),
  });
}

/** Fill in every field a record may be missing, and keep Magnitude inside the card's window. */
export function normalizeWorking(raw = {}) {
  const magnitudeMin = clampMagnitude(raw.magnitudeMin ?? raw.magnitude ?? 1);
  const magnitudeMax = Math.max(magnitudeMin, clampMagnitude(raw.magnitudeMax ?? raw.magnitude ?? magnitudeMin));
  const magnitude = Math.min(magnitudeMax, Math.max(magnitudeMin, clampMagnitude(raw.magnitude ?? magnitudeMin)));
  const mode = SANCTUM_MODES.includes(raw.sanctumMode) ? raw.sanctumMode : "temporary";
  const tier = [1, 2, 3].includes(Number(raw.sealTier)) ? Number(raw.sealTier) : null;
  return {
    id: String(raw.id ?? newWorkingId()),
    formulaUuid: raw.formulaUuid ?? null,
    formulaName: String(raw.formulaName ?? ""),
    family: String(raw.family ?? ""),
    leaders: String(raw.leaders ?? ""),
    magnitude,
    magnitudeMin,
    magnitudeMax,
    studyProjectUuid: raw.studyProjectUuid ?? null,
    sanctumProjectUuid: raw.sanctumProjectUuid ?? null,
    // A Magnitude 4+ Working can never ride a claimed room, whatever an older record said.
    sanctumMode: needsBuiltSanctum(magnitude) ? "built" : mode,
    sanctumReady: raw.sanctumReady === true,
    componentsIndex: Math.max(0, Math.round(Number(raw.componentsIndex)) || 0),
    componentsPaid: raw.componentsPaid === true,
    componentsPaidAmount: Math.max(0, Math.round(Number(raw.componentsPaidAmount)) || 0),
    sealTier: tier,
    sealCharacteristic: SEAL_CHARACTERISTICS.includes(raw.sealCharacteristic) ? raw.sealCharacteristic : null,
    started: Number(raw.started) || 0,
    completed: Number(raw.completed) || null,
  };
}

/** low / middle / high, and whether the Director is holding a hung ritual. */
export function sealOutcome(tier) {
  const t = Number(tier);
  if (![1, 2, 3].includes(t)) return null;
  return { tier: t, key: ["low", "middle", "high"][t - 1], hung: t === 1 };
}

/**
 * Where the Working stands. Every "done" here is read off a document — a Project's points, the Formula's
 * learned flag, the paid stamp — never off a stage counter this module keeps in step by hand.
 *
 * @param {object} working
 * @param {object} facts   `{ learned, studyPoints, hasStudyProject, sanctumPoints, hasSanctumProject }`
 * @returns {{stages: object[], current: string, outcome: object|null}}
 */
export function stageState(working, facts = {}) {
  const w = normalizeWorking(working);
  const learned = facts.learned === true;
  const studyPts = Math.max(0, Number(facts.studyPoints) || 0);
  const sanctumPts = Math.max(0, Number(facts.sanctumPoints) || 0);
  const sGoal = studyGoal(w.magnitude);
  const cGoal = sanctumGoal(w.magnitude);
  const built = w.sanctumMode === "built";

  const study = {
    key: "study", goal: sGoal, points: studyPts,
    hasProject: facts.hasStudyProject === true,
    goalMet: facts.hasStudyProject === true && studyPts >= sGoal,
    done: learned,
  };
  const components = {
    key: "components",
    paid: w.componentsPaid,
    amount: w.componentsPaidAmount,
    done: w.componentsPaid,
  };
  const sanctum = {
    key: "sanctum", mode: w.sanctumMode, built, required: w.magnitude,
    forcedBuilt: needsBuiltSanctum(w.magnitude),
    goal: cGoal, points: sanctumPts,
    hasProject: facts.hasSanctumProject === true,
    done: built ? (facts.hasSanctumProject === true && sanctumPts >= cGoal) : w.sanctumReady,
  };
  const seal = {
    key: "seal", tier: w.sealTier,
    ready: study.done && components.done && sanctum.done,
    done: w.sealTier !== null,
  };
  const payoff = { key: "payoff", ready: seal.done, done: w.completed !== null };

  const stages = [study, components, sanctum, seal, payoff];
  const current = stages.find(stage => !stage.done)?.key ?? "payoff";
  for (const stage of stages) stage.current = stage.key === current;
  return { stages, current, outcome: sealOutcome(w.sealTier) };
}

/* -------------------------------------------- Foundry helpers */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const esc = value => foundry.utils.escapeHTML(String(value ?? ""));
// Pack names are lang keys until Foundry resolves them; world copies carry the resolved string.
const label = doc => (doc?.name && game.i18n.has(doc.name) ? game.i18n.localize(doc.name) : (doc?.name ?? ""));
const characteristicLabel = key => game.i18n.localize(`DRAW_STEEL.Actor.characteristics.${key}.full`);

export const isHero = actor => actor?.type === "hero";

/** Every Working stored on an Actor, normalized. */
export function workingsOf(actor) {
  const raw = actor?.flags?.[MODULE_ID]?.[WORKINGS_FLAG];
  return Array.isArray(raw) ? raw.map(normalizeWorking) : [];
}

async function writeWorkings(actor, list) {
  return actor.update({ [`flags.${MODULE_ID}.${WORKINGS_FLAG}`]: list.map(normalizeWorking) });
}

async function patchWorking(actor, id, patch) {
  const list = workingsOf(actor);
  const index = list.findIndex(working => working.id === id);
  if (index < 0) return null;
  list[index] = normalizeWorking({ ...list[index], ...patch });
  await writeWorkings(actor, list);
  return list[index];
}

/** The embedded Item a stored uuid points at, without a round trip through the uuid resolver. */
function embeddedFrom(actor, uuid) {
  if (!actor || !uuid) return null;
  return actor.items.get(String(uuid).split(".").pop()) ?? null;
}

const formulaOf = (actor, working) => embeddedFrom(actor, working?.formulaUuid);
const projectPoints = project => Math.max(0, Number(project?.system?.points) || 0);

/** The class `_dsid` / name the tradition default reads, tolerating a hero with no class Item. */
function classIdentity(actor) {
  const cls = actor?.system?.class ?? null;
  return { classDsid: cls?.system?._dsid ?? "", className: label(cls) };
}

/** Hero Actors this user may act for: their own, plus everything for the Director. */
export function ownedHeroes(user = game.user) {
  return (game.actors ?? []).filter(actor => isHero(actor) && (user.isGM || actor.isOwner));
}

/** Every Ritual Formula on a hero this user owns, as picker rows. */
export function formulaChoices(user = game.user) {
  const rows = [];
  for (const actor of ownedHeroes(user)) {
    for (const item of actor.items) {
      if (!isRitualFormula(item)) continue;
      rows.push({ item, actor, learned: isLearned(item) });
    }
  }
  return rows.sort((a, b) => (a.actor.name.localeCompare(b.actor.name) || label(a.item).localeCompare(label(b.item))));
}

/** Facts `stageState` needs, read off the live documents on the leader. */
function factsFor(leader, working) {
  const study = embeddedFrom(leader, working.studyProjectUuid);
  const sanctum = embeddedFrom(leader, working.sanctumProjectUuid);
  const formula = formulaOf(leader, working);
  return {
    learned: isLearned(formula),
    studyPoints: projectPoints(study),
    hasStudyProject: !!study,
    sanctumPoints: projectPoints(sanctum),
    hasSanctumProject: !!sanctum,
    study, sanctum, formula,
  };
}

/* -------------------------------------------- actions on documents */

/** Create the Study or Sanctum Project on the leader and link it to the Working. */
export async function ensureStageProject(leader, working, stage) {
  if (!leader?.isOwner) return null;
  const key = stage === "study" ? "studyProjectUuid" : "sanctumProjectUuid";
  const existing = embeddedFrom(leader, working[key]);
  if (existing) return existing;

  const formula = formulaOf(leader, working);
  const name = working.formulaName || label(formula) || loc("Unknown");
  const study = stage === "study";
  const [created] = await leader.createEmbeddedDocuments("Item", [{
    name: loc(study ? "Project.StudyName" : "Project.SanctumName", { formula: name }),
    type: "project",
    img: formula?.img ?? "icons/svg/book.svg",
    system: {
      type: study ? "research" : "crafting",
      goal: study ? studyGoal(working.magnitude) : sanctumGoal(working.magnitude),
      points: 0,
      projectSource: name,
      // Study rolls Logic or Instinct; raising a sanctum adds Persona (`22`, Study / Sanctum).
      rollCharacteristic: study ? ["reason", "intuition"] : ["reason", "intuition", "presence"],
      description: { value: `<p>${esc(loc(study ? "Project.StudyHint" : "Project.SanctumHint", { formula: name, magnitude: working.magnitude }))}</p>` },
    },
    flags: { [MODULE_ID]: { [PROJECT_FLAG]: { id: working.id, stage, formulaUuid: working.formulaUuid } } },
  }]);
  if (created) await patchWorking(leader, working.id, { [key]: created.uuid });
  return created ?? null;
}

/**
 * Debit the Components total from the leader's ¥ and stamp the Working paid.
 * The only wealth this module ever moves, and only from a player's own press.
 * @returns {Promise<{ok: boolean, reason: string|null, amount: number, wealth: number, wealthAfter: number}>}
 */
export async function payComponents(leader, working) {
  const formula = formulaOf(leader, working);
  const ritual = ritualData(formula) ?? {};
  const option = componentsFor(ritual, { magnitude: working.magnitude, index: working.componentsIndex });
  const wealth = getWealth(leader);
  const amount = option?.amount ?? null;
  if (!leader?.isOwner) return { ok: false, reason: "no-permission", amount: amount ?? 0, wealth, wealthAfter: wealth };
  if (amount === null) return { ok: false, reason: "no-price", amount: 0, wealth, wealthAfter: wealth };
  if (wealth < amount) return { ok: false, reason: "insufficient", amount, wealth, wealthAfter: wealth };

  await leader.update({ [WEALTH_PATH]: wealth - amount });
  await patchWorking(leader, working.id, { componentsPaid: true, componentsPaidAmount: amount });
  await postCard(leader, loc("Chat.Paid", {
    leader: esc(leader.name),
    formula: esc(working.formulaName || label(formula)),
    price: formatYen(amount),
  }));
  return { ok: true, reason: null, amount, wealth, wealthAfter: wealth - amount };
}

async function postCard(actor, html) {
  return ChatMessage.implementation.create({
    speaker: ChatMessage.implementation.getSpeaker({ actor }),
    content: `<div class="ghostwire-ritual-card">${html}</div>`,
  });
}

const leakLine = magnitude => `<p class="hint">${esc(loc(`Leak.${leakBand(magnitude)}`, { magnitude }))}</p>`;

/**
 * Open a Working for a Formula the user owns, or return the one already running for it.
 * @param {Item} formula   A Ritual Formula Item on a hero.
 */
export async function startWorking(formula) {
  const leader = formula?.parent instanceof Actor ? formula.parent : null;
  if (!isRitualFormula(formula) || !leader?.isOwner) return null;
  const open = workingsOf(leader).find(w => (w.formulaUuid === formula.uuid) && (w.completed === null));
  if (open) return open;

  const ritual = ritualData(formula) ?? {};
  const working = newWorking({ formulaUuid: formula.uuid, formulaName: label(formula), ritual });
  await writeWorkings(leader, [...workingsOf(leader), working]);
  await postCard(leader, loc("Chat.Started", {
    leader: esc(leader.name),
    formula: esc(working.formulaName),
    magnitude: working.magnitude,
  }) + leakLine(working.magnitude));
  return working;
}

/* -------------------------------------------- app */

let RitualWorkingApp = null;
const APP_ID = "ghostwire-ritual-working";

function defineRitualWorkingApp() {
  const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

  return class GhostwireRitualWorking extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
      id: APP_ID,
      classes: ["ghostwire-ritual-working"],
      window: { title: `${L}.Title`, icon: "fa-solid fa-hexagon-nodes", resizable: true },
      position: { width: 560, height: 720 },
      actions: {
        startWorking: GhostwireRitualWorking.#onStart,
        createProject: GhostwireRitualWorking.#onCreateProject,
        rollProject: GhostwireRitualWorking.#onRollProject,
        openDoc: GhostwireRitualWorking.#onOpenDoc,
        markLearned: GhostwireRitualWorking.#onMarkLearned,
        payComponents: GhostwireRitualWorking.#onPayComponents,
        claimSanctum: GhostwireRitualWorking.#onClaimSanctum,
        seal: GhostwireRitualWorking.#onSeal,
        completeWorking: GhostwireRitualWorking.#onComplete,
        abandonWorking: GhostwireRitualWorking.#onAbandon,
        resetStage: GhostwireRitualWorking.#onResetStage,
      },
    };

    static PARTS = {
      panel: {
        template: `modules/${MODULE_ID}/templates/ritual-working.hbs`,
        scrollable: [".gw-rw-stages"],
      },
    };

    /** The Formula Item uuid the panel is pointed at — the pick that names the Ritual Leader. */
    formulaUuid = null;

    select(formula) {
      this.formulaUuid = formula?.uuid ?? null;
      return this;
    }

    /** The Formula Item, or null when nothing is picked. */
    get formula() {
      return this.formulaUuid ? fromUuidSync(this.formulaUuid) : null;
    }

    /** Whoever owns the picked Formula. Every roll, Project and ¥ spend in this panel lands here. */
    get leader() {
      const parent = this.formula?.parent;
      return parent instanceof Actor ? parent : null;
    }

    /** The open Working for the picked Formula, or null. */
    get working() {
      const leader = this.leader;
      if (!leader || !this.formulaUuid) return null;
      return workingsOf(leader).find(w => (w.formulaUuid === this.formulaUuid) && (w.completed === null))
        ?? workingsOf(leader).findLast(w => w.formulaUuid === this.formulaUuid)
        ?? null;
    }

    /** @override */
    async _prepareContext() {
      const choices = formulaChoices();
      if (this.formulaUuid && !choices.some(row => row.item.uuid === this.formulaUuid)) this.formulaUuid = null;
      const context = {
        isGM: game.user.isGM,
        hasFormulas: choices.length > 0,
        noFormulasHint: loc("NoFormulas"),
        formulas: choices.map(row => ({
          uuid: row.item.uuid,
          name: label(row.item),
          actor: row.actor.name,
          learned: row.learned,
          selected: row.item.uuid === this.formulaUuid,
        })),
      };

      const formula = this.formula;
      const leader = this.leader;
      if (!formula || !leader) return { ...context, pickHint: loc("PickHint") };

      const ritual = ritualData(formula) ?? {};
      const identity = classIdentity(leader);
      const working = this.working;
      context.formulaName = label(formula);
      context.formulaImg = formula.img;
      context.subtitle = formulaSubtitle(formula);
      context.leaderName = leader.name;
      context.wealthLabel = formatYen(getWealth(leader));
      context.learned = isLearned(formula);
      context.traditionWarning = leaderMatchesTradition({ leaders: ritual.leaders, ...identity })
        ? null
        : loc("TraditionWarning", { leaders: ritual.leaders, actor: leader.name });
      context.canAct = leader.isOwner;

      if (!working) {
        return { ...context, canStart: leader.isOwner, startHint: loc("StartHint") };
      }

      const facts = factsFor(leader, working);
      const state = stageState(working, facts);
      const option = componentsFor(ritual, { magnitude: working.magnitude, index: working.componentsIndex });
      const options = componentOptions(ritual);
      const stageCtx = Object.fromEntries(state.stages.map(stage => [stage.key, stage]));

      return {
        ...context,
        working,
        hasWorking: true,
        completed: working.completed !== null,
        // A closed Working stays on the panel as a record; the Formula may be worked again from here.
        canRestart: leader.isOwner && working.completed !== null,
        magnitudeOptions: Array.from({ length: working.magnitudeMax - working.magnitudeMin + 1 }, (_, i) => {
          const value = working.magnitudeMin + i;
          return { value, selected: value === working.magnitude };
        }),
        // Magnitude sets both Project goals, so it locks once a Project exists — the Director may still move it.
        magnitudeLocked: !game.user.isGM && (!!facts.study || !!facts.sanctum || state.stages[0].done),
        leak: loc(`Leak.${leakBand(working.magnitude)}`, { magnitude: working.magnitude }),
        current: state.current,
        stages: state.stages.map((stage, index) => ({
          ...stage,
          step: index + 1,
          label: loc(`Stage.${stage.key}.Name`),
          hint: loc(`Stage.${stage.key}.Hint`),
        })),
        study: {
          ...stageCtx.study,
          projectUuid: facts.study?.uuid ?? null,
          progress: loc("Progress", { points: stageCtx.study.points, goal: stageCtx.study.goal }),
        },
        components: {
          ...stageCtx.components,
          ladder: isMagnitudeLadder(ritual),
          // A card with no printed total is settled at the table, not here — offer no Pay button and no warning.
          hasPrice: typeof option?.amount === "number",
          priceLabel: typeof option?.amount === "number" ? formatYen(option.amount) : loc("NoPrice"),
          priceText: option?.text ?? "",
          paidLabel: formatYen(working.componentsPaidAmount),
          canAfford: typeof option?.amount !== "number" || option.amount <= getWealth(leader),
          choices: options.map(row => ({
            index: row.index,
            selected: row.index === (option?.index ?? 0),
            label: row.magnitude !== null
              ? loc("ComponentsLadderOption", { magnitude: row.magnitude, price: row.text })
              : loc("ComponentsPathOption", { index: row.index + 1, price: row.text }),
          })),
          showChoices: options.length > 1 && !isMagnitudeLadder(ritual),
        },
        sanctum: {
          ...stageCtx.sanctum,
          projectUuid: facts.sanctum?.uuid ?? null,
          progress: loc("Progress", { points: stageCtx.sanctum.points, goal: stageCtx.sanctum.goal }),
          modes: SANCTUM_MODES.map(mode => ({
            value: mode,
            label: loc(`Sanctum.${mode}`),
            selected: mode === working.sanctumMode,
            locked: stageCtx.sanctum.forcedBuilt && mode === "temporary",
          })),
          forcedHint: stageCtx.sanctum.forcedBuilt ? loc("Sanctum.ForcedBuilt", { magnitude: working.magnitude }) : null,
        },
        seal: {
          ...stageCtx.seal,
          characteristic: working.sealCharacteristic ?? traditionCharacteristic({ leaders: ritual.leaders, ...identity }),
          characteristics: SEAL_CHARACTERISTICS.map(key => ({
            value: key,
            label: characteristicLabel(key),
            selected: key === (working.sealCharacteristic ?? traditionCharacteristic({ leaders: ritual.leaders, ...identity })),
          })),
          blockedHint: stageCtx.seal.ready ? null : loc("Seal.Blocked"),
          assistHint: loc("Seal.Assistants"),
          outcome: state.outcome ? loc(`Seal.Outcome.${state.outcome.key}`) : null,
          hung: state.outcome?.hung === true,
        },
        payoff: {
          ...stageCtx.payoff,
          outcome: state.outcome ? loc(`Payoff.${state.outcome.key}`) : null,
          upkeep: loc("Payoff.Upkeep"),
        },
        firewall: loc("Firewall"),
      };
    }

    /** @override */
    _onRender(context, options) {
      super._onRender(context, options);
      const root = this.element;
      root.querySelector("[data-formula-pick]")?.addEventListener("change", event => {
        this.formulaUuid = event.currentTarget.value || null;
        this.render();
      });
      root.querySelector("[data-magnitude]")?.addEventListener("change", event => this.#setField({ magnitude: clampMagnitude(event.currentTarget.value) }));
      root.querySelector("[data-components-index]")?.addEventListener("change", event => this.#setField({ componentsIndex: Number(event.currentTarget.value) || 0 }));
      root.querySelector("[data-sanctum-mode]")?.addEventListener("change", event => this.#setField({ sanctumMode: event.currentTarget.value }));
      root.querySelector("[data-seal-characteristic]")?.addEventListener("change", event => this.#setField({ sealCharacteristic: event.currentTarget.value }));
    }

    async #setField(patch) {
      const leader = this.leader;
      const working = this.working;
      if (!leader?.isOwner || !working) return;
      await patchWorking(leader, working.id, patch);
      this.render();
    }

    static async #onStart() {
      const formula = this.formula;
      if (!formula) return;
      await startWorking(formula);
      this.render();
    }

    static async #onCreateProject(event, target) {
      const leader = this.leader;
      const working = this.working;
      if (!leader || !working) return;
      const project = await ensureStageProject(leader, working, target.dataset.stage);
      if (project) ui.notifications.info(loc("ProjectCreated", { name: project.name }));
      this.render();
    }

    static async #onRollProject(event, target) {
      const leader = this.leader;
      const working = this.working;
      if (!leader || !working) return;
      const key = target.dataset.stage === "study" ? "studyProjectUuid" : "sanctumProjectUuid";
      const project = embeddedFrom(leader, working[key]);
      if (!project) return ui.notifications.warn(loc("NoProject"));
      // Stock Project roll: the system's dialog, its low1 / middle2 / high3 tiers, its progress update.
      await project.system.roll();
      this.render();
    }

    static #onOpenDoc(event, target) {
      const doc = fromUuidSync(target.dataset.uuid);
      doc?.sheet?.render({ force: true });
    }

    static async #onMarkLearned() {
      const leader = this.leader;
      const working = this.working;
      const formula = formulaOf(leader, working);
      if (!formula) return ui.notifications.warn(loc("NoFormulaItem"));
      await setFormulaLearned(formula, true);
      this.render();
    }

    static async #onPayComponents() {
      const leader = this.leader;
      const working = this.working;
      if (!leader || !working) return;
      const result = await payComponents(leader, working);
      if (!result.ok) {
        if (result.reason === "insufficient") {
          ui.notifications.warn(loc("Insufficient", { actor: leader.name, price: formatYen(result.amount), wealth: formatYen(result.wealth) }));
        } else if (result.reason === "no-price") ui.notifications.warn(loc("NoPrice"));
        else ui.notifications.warn(loc("NoPermission"));
      }
      this.render();
    }

    static async #onClaimSanctum() {
      const leader = this.leader;
      const working = this.working;
      if (!leader || !working) return;
      await patchWorking(leader, working.id, { sanctumReady: true });
      await postCard(leader, loc("Chat.Sanctum", {
        leader: esc(leader.name),
        formula: esc(working.formulaName),
        magnitude: working.magnitude,
      }) + leakLine(working.magnitude));
      this.render();
    }

    static async #onSeal() {
      const leader = this.leader;
      const working = this.working;
      if (!leader || !working) return;
      const facts = factsFor(leader, working);
      const state = stageState(working, facts);
      if (!state.stages.find(stage => stage.key === "seal").ready) return ui.notifications.warn(loc("Seal.Blocked"));
      if (!facts.formula) return ui.notifications.warn(loc("NoFormulaItem"));

      const ritual = ritualData(facts.formula) ?? {};
      const characteristic = working.sealCharacteristic
        ?? traditionCharacteristic({ leaders: ritual.leaders, ...classIdentity(leader) });
      const title = loc("Seal.RollTitle", { formula: working.formulaName || label(facts.formula) });
      // One collaborative Power Roll on the leader. Assistants bring edges in the dialog — no resource is spent.
      const message = await leader.system.rollCharacteristic?.(characteristic, {}, { window: { title } }, { data: { title } });
      const tier = message?.rolls?.[0]?.product ?? null;
      const outcome = sealOutcome(tier);
      if (!outcome) return;

      await patchWorking(leader, working.id, { sealTier: outcome.tier, sealCharacteristic: characteristic });
      await postCard(leader, loc("Chat.Sealed", {
        leader: esc(leader.name),
        formula: esc(working.formulaName || label(facts.formula)),
        magnitude: working.magnitude,
        characteristic: esc(characteristicLabel(characteristic)),
        outcome: esc(loc(`Seal.Outcome.${outcome.key}`)),
      }) + `<p>${esc(loc(`Payoff.${outcome.key}`))}</p>`
        + `<p class="hint">${esc(loc("Chat.Attention", { magnitude: working.magnitude }))}</p>`
        + leakLine(working.magnitude));
      this.render();
    }

    static async #onComplete() {
      const leader = this.leader;
      const working = this.working;
      if (!leader || !working || working.sealTier === null) return;
      await patchWorking(leader, working.id, { completed: Date.now() });
      await postCard(leader, loc("Chat.Payoff", {
        leader: esc(leader.name),
        formula: esc(working.formulaName),
        outcome: esc(loc(`Seal.Outcome.${sealOutcome(working.sealTier).key}`)),
      }) + `<p class="hint">${esc(loc("Payoff.Upkeep"))}</p>`);
      this.render();
    }

    static async #onAbandon() {
      const leader = this.leader;
      const working = this.working;
      if (!leader?.isOwner || !working) return;
      const confirmed = await foundry.applications.api.DialogV2.confirm({
        window: { title: loc("Abandon") },
        content: `<p>${esc(loc("AbandonHint", { formula: working.formulaName }))}</p>`,
      });
      if (!confirmed) return;
      await writeWorkings(leader, workingsOf(leader).filter(row => row.id !== working.id));
      this.render();
    }

    /** Director-only unwind of a stage stamp (a paid total, a claimed sanctum, a seal result). */
    static async #onResetStage(event, target) {
      const leader = this.leader;
      const working = this.working;
      if (!game.user.isGM || !leader || !working) return;
      const patch = {
        components: { componentsPaid: false, componentsPaidAmount: 0 },
        sanctum: { sanctumReady: false },
        seal: { sealTier: null },
        payoff: { completed: null },
      }[target.dataset.stage];
      if (!patch) return;
      await patchWorking(leader, working.id, patch);
      this.render();
    }
  };
}

/* -------------------------------------------- registration */

const instance = () => foundry.applications.instances.get(APP_ID) ?? null;

function rerender() {
  const app = instance();
  if (app?.rendered) app.render();
}

/** Open the Ritual Working panel, optionally on a Formula the user owns. Every player may. */
export function openRitualWorking(formula = null) {
  RitualWorkingApp ??= defineRitualWorkingApp();
  const app = instance() ?? new RitualWorkingApp();
  if (formula) app.select(formula);
  return app.render({ force: true });
}

function toggleRitualWorking() {
  const app = instance();
  if (app?.rendered) return app.close();
  return openRitualWorking();
}

/** Study finished on the sheet? Offer the learned stamp instead of making the player hunt for the menu. */
async function offerLearned(project) {
  const link = project?.flags?.[MODULE_ID]?.[PROJECT_FLAG];
  if (link?.stage !== "study") return;
  const leader = project.parent;
  if (!(leader instanceof Actor) || !leader.isOwner) return;
  const goal = Number(project.system?.goal) || 0;
  if (!goal || projectPoints(project) < goal) return;
  const formula = embeddedFrom(leader, link.formulaUuid);
  if (!formula || isLearned(formula)) return;
  const confirmed = await foundry.applications.api.DialogV2.confirm({
    window: { title: loc("Study.Complete") },
    content: `<p>${esc(loc("Study.CompleteHint", { formula: label(formula), actor: leader.name }))}</p>`,
  });
  if (confirmed) await setFormulaLearned(formula, true);
  rerender();
}

/** Scene control (all players), keybinding, Formula context menu, API. Call during init. */
export function registerRitualWorking() {
  game.keybindings.register(MODULE_ID, "ritualWorking", {
    name: `${L}.Keybinding`,
    editable: [],
    restricted: false,
    onDown: () => {
      toggleRitualWorking();
      return true;
    },
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  Hooks.on("getSceneControlButtons", controls => {
    const tools = controls.tokens?.tools;
    if (!tools) return;
    tools.ghostwireRitualWorking = {
      name: "ghostwireRitualWorking",
      title: `${L}.Title`,
      icon: "fa-solid fa-hexagon-nodes",
      order: Object.keys(tools).length,
      button: true,
      visible: true,
      onChange: () => toggleRitualWorking(),
    };
  });

  // Right-click a Formula on a hero sheet → Start Ritual Working, with that Formula's owner as Ritual Leader.
  Hooks.on("getDocumentListContextOptions", (app, menuItems) => {
    if (typeof app._getEmbeddedDocument !== "function") return;
    const formulaItem = target => {
      const item = app._getEmbeddedDocument(target);
      return (isRitualFormula(item) && (item.parent instanceof Actor) && item.isOwner) ? item : null;
    };
    menuItems.push({
      label: `${L}.Menu.Start`,
      icon: "fa-solid fa-hexagon-nodes",
      visible: target => !!formulaItem(target),
      onClick: async (event, target) => {
        const formula = formulaItem(target);
        if (!formula) return;
        await startWorking(formula);
        openRitualWorking(formula);
      },
    });
  });

  Hooks.on("updateItem", (item, changes, options, userId) => {
    // Only the client that moved the progress asks — otherwise every owner of the hero gets the same dialog.
    if ((userId === game.userId) && (item.type === "project") && foundry.utils.hasProperty(changes, "system.points")) offerLearned(item);
    rerender();
  });
  Hooks.on("updateActor", (actor, changes) => {
    if (!instance()?.rendered) return;
    if (foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.${WORKINGS_FLAG}`) || foundry.utils.hasProperty(changes, WEALTH_PATH)) rerender();
  });
  Hooks.on("createItem", rerender);
  Hooks.on("deleteItem", rerender);

  Hooks.once("ready", () => {
    RitualWorkingApp ??= defineRitualWorkingApp();
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        openRitualWorking, startWorking, ensureStageProject, payComponents,
        workingsOf, stageState, componentOptions, componentsFor, traditionCharacteristic,
        studyGoal, sanctumGoal, needsBuiltSanctum,
      };
    }
    game.ghostwire = { ...(game.ghostwire ?? {}), openRitualWorking };
    console.log(`${MODULE_ID} | Ritual Working: five-stage applet registered (Projects on the Ritual Leader)`);
  });
}
