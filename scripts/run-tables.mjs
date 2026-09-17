// Run Generator core (B39): pure, seeded run generation from the tables in scripts/data/runs/.
// No Foundry globals here, so the same seed + params always produce the same run (and it can be tested outside Foundry).
// The app (scripts/run-generator.mjs) loads the tables, builds the bestiary index, and renders the result.
// Design: docs/directors/run-generator.md. Pay bands: docs/rulebook/11-economy.md § Run payouts.

export const RUN_TYPES = ["extraction", "dataSteal", "sabotage", "protection", "wetwork", "courier", "recon", "exorcism", "wildsSurvey"];
export const STRATA_KEYS = ["crown", "spires", "grid", "flats", "sinks", "deadfall", "cinderhold", "wastes"];
export const HEATS = ["low", "medium", "high", "extreme"];
export const WIRED = ["none", "overlay", "jackedIn"];
export const TABLE_FILES = ["run-types", "strata", "patrons", "pay", "opposition-map"];

export const echelonForLevel = level => (level <= 3 ? 1 : level <= 6 ? 2 : level <= 9 ? 3 : 4);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/* ---------- seeded PRNG ---------- */

/** cyrb53 string hash → 32-bit seed. */
function hashString(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0) ^ (h1 >>> 0);
}

/** mulberry32: small, fast, good enough for table rolls. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeRng(key) {
  const next = mulberry32(hashString(key));
  const rng = {
    next,
    pick: list => list[Math.floor(next() * list.length)],
    weighted(entries) {
      const total = entries.reduce((sum, e) => sum + e.weight, 0);
      if (total <= 0) return null;
      let roll = next() * total;
      for (const entry of entries) {
        roll -= entry.weight;
        if (roll < 0) return entry;
      }
      return entries.at(-1);
    },
    /** Pick up to `count` distinct items. */
    sample(list, count) {
      const pool = [...list];
      const out = [];
      while (pool.length && (out.length < count)) out.push(pool.splice(Math.floor(next() * pool.length), 1)[0]);
      return out;
    },
  };
  return rng;
}

/** A short random seed for a fresh roll. */
export const newSeed = () => Math.random().toString(36).slice(2, 8).toUpperCase();

/* ---------- generation ---------- */

const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (match, key) => vars[key] ?? match);
const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);
const roundTo = (value, step) => Math.max(step, Math.round(value / step) * step);
const tierOf = org => ({ minion: "minion", leader: "leader", solo: "boss" })[org] ?? "core";

/**
 * Normalize dial params: clamp numbers, resolve auto echelon / Wired intensity, and move stratum-limited run types
 * (Wilds Survey) to an allowed stratum.
 * @returns {{ params: object, notes: string[] }} resolved params plus note keys for the UI
 */
export function resolveParams(tables, raw) {
  const notes = [];
  const level = clamp(Math.floor(Number(raw.level) || 1), 1, 10);
  const type = RUN_TYPES.includes(raw.type) ? raw.type : "extraction";
  let stratum = STRATA_KEYS.includes(raw.stratum) ? raw.stratum : "flats";
  const typeData = tables["run-types"].types[type];
  if (typeData.strata && !typeData.strata.includes(stratum)) {
    stratum = typeData.strata.at(-1);
    notes.push("StratumSwitched");
  }
  const heat = HEATS.includes(raw.heat) ? raw.heat : "medium";
  const echelon = (raw.echelon === "auto" || !raw.echelon) ? echelonForLevel(level) : clamp(Number(raw.echelon) || 1, 1, 4);
  let wired = raw.wired;
  if (!WIRED.includes(wired)) {
    const allowed = tables.strata[stratum].wired;
    wired = allowed.includes(typeData.wired) ? typeData.wired : allowed.at(-1);
  }
  if (typeData.stub) notes.push("StubType");
  return {
    params: { name: (raw.name ?? "").trim(), level, echelon, echelonAuto: raw.echelon === "auto" || !raw.echelon, type, stratum, heat, wired, wiredAuto: !WIRED.includes(raw.wired), seed: String(raw.seed ?? "").trim() },
    notes,
  };
}

/**
 * Generate a run.
 * @param {object} tables  { "run-types", strata, patrons, pay, "opposition-map" } as loaded from scripts/data/runs/
 * @param {Map<string, {uuid: string, level: number, org: string}>} index  bestiary Actors by name
 * @param {object} params  resolved params (see resolveParams); params.seed must be set
 */
export function generateRun(tables, index, params) {
  const { level, echelon, type, stratum, heat, wired, seed } = params;
  const rng = makeRng([seed, type, stratum, heat, level, echelon, wired].join("|"));
  const typeData = tables["run-types"].types[type];
  const common = tables["run-types"].common;
  const stratumData = tables.strata[stratum];
  const opp = tables["opposition-map"];
  const heatIdx = HEATS.indexOf(heat);

  const autoName = `${rng.pick(common.nameFirst)} ${rng.pick(common.nameSecond)}`;
  const place = rng.pick(stratumData.places);
  // Objectives name the target in full; beats use the short form ("the bookkeeper").
  const targetEntry = rng.pick(typeData.targets);
  const target = targetEntry.name;
  const vars = { place, target, short: targetEntry.short, Short: capitalize(targetEntry.short), stratum: stratumData.name };

  // Patron: stratum weight × run-type bias.
  const patronEntries = tables.patrons
    .map(p => ({ item: p, weight: (p.weights[stratum] ?? 0) * (p.typeBias[type] ?? 1) }))
    .filter(e => e.weight > 0);
  const patron = (rng.weighted(patronEntries) ?? { item: tables.patrons[0] }).item;
  const pitch = rng.pick(patron.pitch);
  const objective = fill(rng.pick(typeData.objectives), vars);

  // Beats: approach, Wired, obstacles, Veil, twist, climax, exit — capped at six.
  const b = typeData.beats;
  const obstacles = rng.sample(b.obstacle, heatIdx >= 2 ? 2 : 1);
  const beatList = [{ phase: "approach", ...rng.pick(b.approach) }];
  if ((wired !== "none") && common.wired[wired]) beatList.push({ phase: "wired", ...rng.pick(common.wired[wired]) });
  obstacles.forEach(beat => beatList.push({ phase: "obstacle", ...beat }));
  if ((stratum === "deadfall") && (type !== "exorcism")) beatList.push({ phase: "veil", ...rng.pick(common.veil) });
  const twistPool = [...common.twist, ...stratumData.complications.map(text => ({ kind: "social", text }))];
  const twistRoll = rng.next();
  if ((heatIdx >= 1) || (twistRoll < 0.5)) beatList.push({ phase: "twist", ...rng.pick(twistPool) });
  beatList.push({ phase: "climax", ...rng.pick(b.climax) });
  beatList.push({ phase: "exit", ...rng.pick(b.exit) });
  while (beatList.length > 6) {
    const drop = [...beatList].reverse().find(beat => beat.phase === "obstacle") ?? beatList.find(beat => beat.phase === "twist");
    beatList.splice(beatList.indexOf(drop), 1);
  }
  const beats = beatList.map(beat => ({ phase: beat.phase, kind: beat.kind, text: capitalize(fill(beat.text, vars)) }));

  // Pay: the larger of the run type's scale and the stratum's floor, × echelon × heat.
  const payTable = tables.pay;
  const order = payTable.scaleOrder;
  const scaleKey = order[Math.max(order.indexOf(typeData.scale), order.indexOf(stratumData.scaleFloor))];
  const band = payTable.scales[scaleKey];
  const mult = payTable.echelon[echelon] * payTable.heat[heat];
  const payMin = roundTo(band.min * mult, payTable.round);
  const payMax = roundTo(band.max * mult, payTable.round);
  const extraRoll = rng.next();
  const pay = {
    scale: scaleKey, scaleLabel: band.label, min: payMin, max: payMax,
    mid: roundTo((payMin + payMax) / 2, payTable.round),
    extra: ((heatIdx >= 2) || (extraRoll < 0.4)) ? rng.pick(payTable.extras) : null,
    pays: patron.pays,
  };

  // Wired: node Rating band (stratum ∩ echelon) and paydata value for data runs; ICE ladder whenever the run touches the Wired.
  let data = null;
  if (wired !== "none") {
    const [sLo, sHi] = stratumData.nodeRatings;
    const [eLo, eHi] = payTable.dataValue.ratingByEchelon[echelon];
    let lo = Math.max(sLo, eLo), hi = Math.min(sHi, eHi);
    if (lo > hi) lo = hi = clamp(eLo, sLo, sHi);
    const ladder = (wired === "jackedIn") ? opp.iceLadder : opp.iceLadder.slice(0, 1);
    data = {
      ratingLo: lo, ratingHi: hi,
      paydataLo: (type === "dataSteal") ? roundTo(lo * payTable.dataValue.perRating * payTable.heat[heat], payTable.round) : null,
      paydataHi: (type === "dataSteal") ? roundTo(hi * payTable.dataValue.perRating * payTable.heat[heat], payTable.round) : null,
      ladder: ladder.map(name => actorRef(index, name)),
    };
  }

  // Opposition: stratum pool (weight 1) + run-type pool (typeWeight), filtered by level reach, filled by tier.
  const weights = new Map();
  for (const name of opp.strata[stratum] ?? []) weights.set(name, Math.max(weights.get(name) ?? 0, 1));
  for (const name of opp.types[type] ?? []) weights.set(name, Math.max(weights.get(name) ?? 0, opp.typeWeight));
  const maxLevel = level + opp.levelReach[heat];
  const candidates = [...weights].map(([name, weight]) => ({ ...actorRef(index, name), weight }));
  const inReach = candidates.filter(c => (c.level ?? 1) <= maxLevel);
  const composition = opp.composition[heat];
  const chosen = [];
  const take = (pool, count) => {
    for (let i = 0; i < count; i++) {
      const pick = rng.weighted(pool.filter(c => !chosen.includes(c)));
      if (pick) chosen.push(pick);
    }
  };
  for (const tier of ["minion", "core", "leader"]) take(inReach.filter(c => tierOf(c.org) === tier), composition[tier]);
  if (composition.boss) {
    const bosses = inReach.filter(c => tierOf(c.org) === "boss");
    if (bosses.length) take(bosses, composition.boss);
    else {
      // No solo in reach: the toughest remaining non-minion stands in.
      const heavy = inReach.filter(c => !chosen.includes(c) && (tierOf(c.org) !== "minion")).sort((x, y) => (y.level ?? 0) - (x.level ?? 0))[0];
      if (heavy) chosen.push(heavy);
    }
  }
  if (!chosen.length && candidates.length) chosen.push([...candidates].sort((x, y) => (x.level ?? 0) - (y.level ?? 0))[0]);
  const tierOrder = { minion: 0, core: 1, leader: 2, boss: 3 };
  const opposition = chosen
    .sort((x, y) => (tierOrder[tierOf(x.org)] - tierOrder[tierOf(y.org)]) || ((x.level ?? 0) - (y.level ?? 0)))
    .map(c => ({ name: c.name, uuid: c.uuid, level: c.level, org: c.org, tier: tierOf(c.org) }));
  const topLevel = Math.max(0, ...opposition.map(o => o.level ?? 0));
  const scaleUp = (level - topLevel) >= 3;

  // Wired opposition: ICE within reach (Watchdog always; the whole ladder at extreme heat).
  const wiredOpposition = (wired === "none") ? [] : (opp.wired[wired] ?? [])
    .map(name => actorRef(index, name))
    .filter((ice, i) => (i === 0) || (heat === "extreme") || ((ice.level ?? 1) <= maxLevel));

  // Escalation: the stratum's response ladder above the current heat.
  const ladderData = opp.ladders[stratumData.ladder] ?? {};
  const escalation = HEATS.slice(heatIdx + 1)
    .filter(h => ladderData[h])
    .map(h => ({ heat: h, actors: ladderData[h].map(name => actorRef(index, name)), response: stratumData.response[h] }));

  // Support: the stratum's contacts, minus the patron.
  const support = stratumData.support
    .filter(s => !s.actor || (s.actor !== patron.actor))
    .map(s => ({ ...(s.actor ? actorRef(index, s.actor) : { name: s.label, uuid: null }), note: s.note }));

  const clocks = {
    objective: 4 + heatIdx,
    alert: clamp(8 - stratumData.security - heatIdx - (typeData.heatBias ?? 0), 3, 8),
    response: stratumData.response[heat],
  };

  return {
    params: { ...params }, autoName,
    typeKey: type, stratumKey: stratum, stratumName: stratumData.name, stratumBlurb: stratumData.blurb,
    patron: { name: patron.name, ...(patron.actor ? actorRef(index, patron.actor) : { uuid: null }), meet: patron.meet, pitch },
    place, target, objective, beats, pay, data, opposition, wiredOpposition, escalation, support, clocks, scaleUp,
  };
}

function actorRef(index, name) {
  const entry = index.get(name);
  return { name, uuid: entry?.uuid ?? null, level: entry?.level ?? null, org: entry?.org ?? null };
}
