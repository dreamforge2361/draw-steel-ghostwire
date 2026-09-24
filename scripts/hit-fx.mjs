// 0.3.127 (D) / 0.3.128 (A) — Ghostwire's own hit FX: two beats for a gun, a spell, a melee swing
// and a grenade.
//
// **The point of this file is that it depends on nothing.** Automated Animations, Sequencer, JB2A,
// socketlib and ds-aa-bridge are all installed on Michael's box and every one of them is optional
// here. Ghostwire ships its own sounds (assets/sfx/, already on disk for B40) and draws its own
// flash with PIXI, so a table with none of those modules still sees and hears a hit. A table with
// Sequencer and JB2A gets the prettier version of the same moments, and nothing else changes.
//
// Three decisions worth writing down:
//
//  1. **Sound is never optional; video always is.** The sounds are module assets, so they cannot
//     fail to resolve. The Sequencer path is tried first and, if Sequencer is absent or the file
//     will not resolve, the built-in PIXI beats run instead — not a no-op. "Graceful degradation"
//     that degrades to nothing is just a dependency with extra steps.
//  2. **This is beside B40, not on top of it.** scripts/sfx.mjs fires on `abilityUse` — the moment
//     you *use* the thing. This fires on `abilityResult` — the moment it *lands*. A burst from a
//     Streetsweeper is therefore two sounds: the muzzle (B40) and the impact (here). Neither file
//     knows about the other, and turning either off leaves the other working.
//  3. **The classifier still says no a lot, and it says it on purpose.** A bow, a Matrix Verb, a
//     Commander's shout and a Take Cover maneuver are all `null` and get nothing.
//
// 0.3.128 (A) is the second beat and the third kind:
//
//  * **A2 — origin → target, then impact.** 0.3.127 drew one burst at the target and nothing left
//    the shooter. A gun now throws a tracer from the firer's token, a spell throws a bolt, a melee
//    strike lunges, and *then* each of them lands. `drawHitFx` runs the travel phase and the impact
//    phase off one ticker so there is one object to clean up rather than two.
//  * **A — spells are a kind now.** 0.3.127's `classifyHit` returned `null` for every Elementalist
//    bolt, Street Priest smite and Technomancer working, because it only knew the three facts a
//    weapon SKU stamps. It now also reads the ability's keywords, and a `magic` / `psionic` ability
//    resolves to `spell` with a flavour (fire / lightning / dark / arcane) picked off its name, so
//    Hurl Element cracks and Dark Blast does not sound like a fireball.
//  * **A1 — a gun ability is a gun.** Controlled Pair carries no gear stamp: it is the Operator's
//    ability, not the Workhorse's. `AMMO_ABILITY_COSTS` (0.3.128 B) is already the authoritative
//    list of abilities that fire the hero's own gun, so `kindForAbility` reads it rather than
//    guessing from `ranged` + `weapon`, which would also have caught every bow in the Reach.
//  * **A3 — the grenade stopped ringing.** The old boom was `spell-fire-blast.ogg`, 8.8 seconds of
//    it, still going while the next hero took their turn. `grenade-boom.ogg` is the same sample
//    trimmed to 1.25 s with a fade.
//  * **A4 — no new dependency.** Melee takes its cue from what Automated Animations and JB2A do
//    (swing arc, then impact) but draws its own, and the sounds are Ghostwire's own assets. The
//    Sequencer file lists are still tried first and are still allowed to all be missing.
//
// Everything above the "Foundry registration" divider is Foundry-free so
// tools/wave-03127-smoke.mjs and tools/wave-03128-smoke.mjs can run it under Node.

import { ammoCostForDsid } from "./ammo.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.HitFx";
const SFX = `modules/${MODULE_ID}/assets/sfx`;

/** The moments this file covers. 0.3.128 adds `spell`. */
export const HIT_FX_KINDS = Object.freeze(["gun", "spell", "melee", "grenade"]);

/**
 * Ability keywords that mean "this is a working, not a weapon".
 *
 * Draw Steel's own two supernatural keywords. `tech` is deliberately **not** here: a Wrench's drone
 * deploy and a Technomancer's construct both carry it, and a tool bag is not a bolt of anything. A
 * Technomancer's damaging workings carry `magic` alongside it and are caught by that.
 */
export const SPELL_KEYWORDS = Object.freeze(["magic", "psionic"]);

/**
 * What each kind looks and sounds like.
 *
 * `sound` is a module asset and always plays. `sequencerFiles` are JB2A paths tried in order when
 * Sequencer is present; every one of them may be absent, and the built-in `travel` + `style` run
 * instead. `travel` is the origin→target beat and is skipped when there is no origin to throw from
 * (a grenade has none — it goes off where it lands).
 */
export const HIT_FX_PROFILES = Object.freeze({
  gun: {
    sound: `${SFX}/arrow-hit.ogg`,
    sequencerFiles: ["jb2a.impact.005.orange", "jb2a.impact.001.blue"],
    travelFiles: ["jb2a.bullet.01.orange", "jb2a.ranged.03.projectile.01.orange"],
    travel: "tracer",
    travelMs: 150,
    style: "spark",
    color: 0xffcc66,
  },
  spell: {
    sound: `${SFX}/spell-lightning.ogg`,
    sequencerFiles: ["jb2a.impact.005.blue", "jb2a.impact.001.blue"],
    travelFiles: ["jb2a.magic_missile.blue", "jb2a.energy_strands.range.standard.blue.01"],
    travel: "bolt",
    travelMs: 260,
    style: "burst",
    color: 0x8fd6ff,
  },
  melee: {
    sound: `${SFX}/punch.ogg`,
    sequencerFiles: ["jb2a.melee_generic.slash.01.orange", "jb2a.impact.005.orange"],
    travelFiles: ["jb2a.melee_attack.01.trail.01.white", "jb2a.melee_generic.slash.01.white"],
    travel: "lunge",
    travelMs: 130,
    style: "slash",
    color: 0xffffff,
  },
  grenade: {
    // A3: 1.25 s, trimmed from the 8.8 s spell-fire-blast.ogg 0.3.127 shipped.
    sound: `${SFX}/grenade-boom.ogg`,
    sequencerFiles: ["jb2a.explosion.01.orange", "jb2a.explosion.02.blue"],
    travelFiles: [],
    travel: null,
    travelMs: 0,
    style: "burst",
    color: 0xff7733,
  },
});

/**
 * Spell flavours, in match order. First hit wins, which is why `dark` sits above `lightning`: a Dark
 * Blast is corruption whatever else is in its name, and `fire` sits above both so Fire Blast is fire.
 * `arcane` has no pattern and is the fallback, so every spell has a sound even when its name says
 * nothing about its element (Hurl Element, Kinetic Driver's cousins, a Director's homebrew working).
 */
export const SPELL_FLAVOURS = Object.freeze([
  { key: "fire", match: /fire|flame|ember|pyro|\bburn|scorch|wildfire|incinerat/i, sound: `${SFX}/spell-fireball.ogg`, color: 0xff8a33 },
  { key: "dark", match: /dark|drain|corrupt|curse|pact|penance|judg|void|rot|blight|wither/i, sound: `${SFX}/spell-dark-blast.ogg`, color: 0xb46bff },
  { key: "lightning", match: /lightning|storm|thunder|shock|\barc\b|taser|kinetic|static/i, sound: `${SFX}/spell-lightning.ogg`, color: 0x9fd4ff },
  { key: "arcane", match: null, sound: `${SFX}/spell-lightning.ogg`, color: 0x8fd6ff },
]);

/** A Ghostwire weapon SKU's `gear` stamp reduced to the facts the classifier needs. */
const RANGE_MELEE = "Adjacent";

/**
 * Which flavour a spell is, from its name. Never null — `arcane` is the floor.
 * @param {string} name
 * @returns {{key: string, sound: string, color: number}}
 */
export function spellFlavour(name = "") {
  const text = String(name ?? "");
  for (const flavour of SPELL_FLAVOURS) {
    if (!flavour.match) return flavour;
    if (flavour.match.test(text)) return flavour;
  }
  return SPELL_FLAVOURS[SPELL_FLAVOURS.length - 1];
}

/**
 * The profile for one hit, flavour folded in.
 *
 * Returns a fresh object rather than the frozen profile so a caller can read `sound` and `color`
 * without having to know that only spells vary.
 *
 * @param {string} kind
 * @param {string} [name]  The ability's name, for the spell flavour.
 * @returns {object|null}
 */
export function hitFxProfile(kind, name = "") {
  const profile = HIT_FX_PROFILES[kind];
  if (!profile) return null;
  if (kind !== "spell") return { ...profile, flavour: null };
  const flavour = spellFlavour(name);
  return { ...profile, sound: flavour.sound, color: flavour.color, flavour: flavour.key };
}

/**
 * Which FX an attack is, or `null` for "not this file's business".
 *
 * The order is the whole rule and each step earns its place:
 *
 *  1. A thrown Blast is a grenade even though its band reads Short.
 *  2. An Adjacent-band weapon is melee even though it may be chrome (a Cyber-Spur).
 *  3. A weapon that eats rounds is a gun.
 *  4. An ability on the 0.3.128 ammo allowlist is a gun even with no gear behind it — that is how
 *     Controlled Pair gets a tracer and a bow does not.
 *  5. A `magic` / `psionic` ability is a spell.
 *  6. A melee `strike` with no gear stamp is still a swing.
 *
 * Steps 1–3 are exactly 0.3.127's behaviour, unchanged, so nothing that worked stopped working.
 *
 * @param {object} opts
 * @param {boolean} opts.thrownBlast      The source item carries `gear.thrown` (scripts/grenades.mjs).
 * @param {string}  opts.range            The SKU's `gear.range` band: Adjacent / Short / Medium / ...
 * @param {string|null} opts.ammoFamily   The SKU's `gear.ammoFamily` (0.3.126 B) — set only on guns.
 * @param {boolean} opts.gunAbility       The ability is on `AMMO_ABILITY_COSTS` (0.3.128 B).
 * @param {Iterable<string>} opts.keywords  The ability's `system.keywords`.
 * @param {string} opts.distanceType      The ability's `system.distance.type`.
 * @returns {"gun"|"spell"|"melee"|"grenade"|null}
 */
export function classifyHit({
  thrownBlast = false, range = "", ammoFamily = null,
  gunAbility = false, keywords = [], distanceType = "",
} = {}) {
  if (thrownBlast) return "grenade";
  if (range === RANGE_MELEE) return "melee";
  if (ammoFamily) return "gun";
  if (gunAbility) return "gun";
  const kw = new Set(keywords ?? []);
  if (SPELL_KEYWORDS.some(keyword => kw.has(keyword))) return "spell";
  if (kw.has("strike") && ((distanceType === "melee") || (kw.has("melee") && !kw.has("ranged")))) return "melee";
  return null;
}

/* ============================================ Foundry registration */

const gearFlags = item => item?.flags?.[MODULE_ID]?.gear ?? item?.getFlag?.(MODULE_ID, "gear") ?? null;

/* -------------------------------------------- settings */

function registerSettings() {
  game.settings.register(MODULE_ID, "hitFxEnabled", {
    name: `${L}.Settings.Enabled.Name`, hint: `${L}.Settings.Enabled.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
  });
  game.settings.register(MODULE_ID, "hitFxVolume", {
    name: `${L}.Settings.Volume.Name`, hint: `${L}.Settings.Volume.Hint`,
    scope: "client", config: true, type: Number, default: 0.7,
    range: { min: 0, max: 1, step: 0.05 },
  });
  game.settings.register(MODULE_ID, "hitFxSequencer", {
    name: `${L}.Settings.Sequencer.Name`, hint: `${L}.Settings.Sequencer.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
  });
}

const enabled = () => {
  try {
    return game.settings.get(MODULE_ID, "hitFxEnabled") !== false;
  } catch {
    return false;                                  // asked before `init` registered the setting
  }
};

const volume = () => {
  try {
    return Number(game.settings.get(MODULE_ID, "hitFxVolume") ?? 0.7);
  } catch {
    return 0.7;
  }
};

/* -------------------------------------------- the optional pretty path */

/** Sequencer, if the table has it turned on and this world has not opted out. */
function sequencer() {
  try {
    if (game.settings.get(MODULE_ID, "hitFxSequencer") === false) return null;
  } catch {
    return null;
  }
  if (!game.modules.get("sequencer")?.active) return null;
  return globalThis.Sequence ?? null;
}

/**
 * First JB2A path that actually resolves in Sequencer's database, or null.
 *
 * Every lookup is guarded: `Sequencer.Database` is another module's surface, and a Ghostwire hit
 * must not become an error toast because JB2A shipped a rename.
 */
function sequencerFile(files) {
  const db = globalThis.Sequencer?.Database;
  if (!db?.entryExists) return null;
  for (const file of files ?? []) {
    try {
      if (db.entryExists(file)) return file;
    } catch {
      /* keep trying the next one */
    }
  }
  return null;
}

/* -------------------------------------------- the built-in path */

/**
 * The fallback that needs nothing: two short PIXI beats on `canvas.controls`.
 *
 * `canvas.controls` is where Foundry keeps its own transient canvas furniture (cursors, rulers), so
 * effects drawn there sit above the tokens, never persist, and are never a document anybody has to
 * clean up. Travel runs for `travelMs`, impact for {@link IMPACT_MS}, and then the whole thing
 * destroys itself — one graphics object and one ticker callback for both beats, because two of each
 * is two things that can leak.
 */
const IMPACT_MS = 420;

const lerp = (from, to, t) => ({ x: from.x + ((to.x - from.x) * t), y: from.y + ((to.y - from.y) * t) });

/** The origin→target beat: what leaves the shooter. */
function drawTravel(graphics, { travel, color, from, to, t, size }) {
  if (travel === "tracer") {
    // A short bright segment covering the last third of the flight, plus the muzzle behind it.
    const head = lerp(from, to, t);
    const tail = lerp(from, to, Math.max(0, t - 0.35));
    graphics.lineStyle(3, color, 0.95).moveTo(tail.x, tail.y).lineTo(head.x, head.y);
    graphics.lineStyle(0).beginFill(color, 0.5 * (1 - t)).drawCircle(from.x, from.y, size * 0.35).endFill();
    return;
  }
  if (travel === "bolt") {
    // A beam that grows out of the caster, with a glowing head. Two passes so it reads as a core
    // inside a halo rather than one flat line.
    const head = lerp(from, to, t);
    graphics.lineStyle(7, color, 0.25).moveTo(from.x, from.y).lineTo(head.x, head.y);
    graphics.lineStyle(3, color, 0.9).moveTo(from.x, from.y).lineTo(head.x, head.y);
    graphics.lineStyle(0).beginFill(color, 0.55).drawCircle(head.x, head.y, size * (0.18 + (0.12 * t))).endFill();
    return;
  }
  if (travel === "lunge") {
    // The swing arc Automated Animations draws, drawn here: a blade sweeping across the target's
    // near side, opening as the strike commits.
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const reach = size * (0.9 + (0.5 * t));
    const sweep = (Math.PI * 0.55) * t;
    graphics.lineStyle(5 * (1 - (0.4 * t)) + 1, color, 0.85)
      .arc(to.x, to.y, reach, angle + Math.PI - sweep, angle + Math.PI + sweep);
  }
}

/** The impact beat: what happens where it lands. */
function drawImpact(graphics, { style, color, from, to, t, size }) {
  if (style === "spark") {
    // Radiating shards plus a tightening ring — a bullet strike, not an explosion.
    const ring = size * (0.22 + (0.42 * t));
    graphics.lineStyle(2, color, 0.85).drawCircle(to.x, to.y, ring);
    const spread = size * (0.35 + (0.65 * t));
    const bias = from ? Math.atan2(to.y - from.y, to.x - from.x) : 0;
    for (let i = 0; i < 6; i += 1) {
      const angle = bias + ((Math.PI * 2 * i) / 6) + (t * 0.4);
      graphics.lineStyle(3 * (1 - t) + 1, color, 0.9)
        .moveTo(to.x + (Math.cos(angle) * ring), to.y + (Math.sin(angle) * ring))
        .lineTo(to.x + (Math.cos(angle) * spread), to.y + (Math.sin(angle) * spread));
    }
    return;
  }
  if (style === "slash") {
    const span = size * (0.8 + (0.4 * t));
    graphics.lineStyle((6 * (1 - t)) + 2, color, 0.9)
      .moveTo(to.x - span, to.y - (span * 0.6))
      .quadraticCurveTo(to.x, to.y, to.x + span, to.y + (span * 0.6));
    return;
  }
  const radius = size * (0.5 + (2.2 * t));
  graphics.lineStyle((5 * (1 - t)) + 1, color, 0.95).beginFill(color, 0.28 * (1 - t))
    .drawCircle(to.x, to.y, radius).endFill();
}

/**
 * Run both beats for one target.
 * @returns {PIXI.Graphics|null}
 */
function drawHitFx({ travel = null, travelMs = 0, style = "burst", color = 0xffffff, from = null, to = null, impact = true }) {
  const layer = canvas?.controls;
  if (!layer || !to) return null;
  const graphics = layer.addChild(new PIXI.Graphics());
  graphics.eventMode = "none";
  const size = (canvas?.dimensions?.size ?? 100) / 2;
  const origin = (travel && from) ? from : null;
  const flight = origin ? Math.max(0, Math.floor(Number(travelMs) || 0)) : 0;
  // `impact: false` is the half-and-half case: Sequencer had an impact file but no projectile, so
  // Ghostwire draws only the travel beat and gets out of the way rather than stacking a second flash
  // on top of JB2A's.
  const total = flight + (impact ? IMPACT_MS : 0);
  if (!total) return null;
  const start = performance.now();

  const frame = () => {
    const elapsed = performance.now() - start;
    graphics.clear();
    if (flight && (elapsed < flight)) {
      graphics.alpha = 1;
      drawTravel(graphics, { travel, color, from: origin, to, t: elapsed / flight, size });
    } else if (impact) {
      const t = Math.min(1, (elapsed - flight) / IMPACT_MS);
      graphics.alpha = 1 - t;
      drawImpact(graphics, { style, color, from: origin, to, t, size });
    }
    if (elapsed >= total) {
      canvas.app?.ticker?.remove(frame);
      graphics.destroy();
    }
  };

  canvas.app?.ticker?.add(frame);
  return graphics;
}

/* -------------------------------------------- playback */

function playSound(src) {
  const level = volume();
  if (!src || !(level > 0)) return;
  try {
    foundry.audio.AudioHelper.play({ src, volume: level, loop: false, channel: "interface" }, true);
  } catch (error) {
    console.warn(`${MODULE_ID} | hit FX sound failed`, error);
  }
}

/**
 * Play one hit effect. Never throws, never awaits anything the caller has to care about.
 *
 * @param {"gun"|"spell"|"melee"|"grenade"} kind
 * @param {object} [opts]
 * @param {{x: number, y: number}|null} [opts.from]  The attacker's token centre (travel origin).
 * @param {Array<{x: number, y: number}>} [opts.at]  Where it lands. Empty means "nothing to show".
 * @param {string} [opts.name]  The ability's name, so a spell picks its flavour.
 * @returns {{kind: string, sound: string, flavour: string|null, via: "sequencer"|"builtin"|"none"}|null}
 */
export function playHitFx(kind, { from = null, at = [], name = "" } = {}) {
  const profile = hitFxProfile(kind, name);
  if (!profile || !enabled()) return null;

  playSound(profile.sound);

  const points = (at ?? []).filter(Boolean);
  const result = { kind, sound: profile.sound, flavour: profile.flavour, via: "none" };
  if (!points.length) return result;

  const Seq = sequencer();
  const impactFile = Seq ? sequencerFile(profile.sequencerFiles) : null;
  const travelFile = (Seq && profile.travel && from) ? sequencerFile(profile.travelFiles) : null;
  if (Seq && (impactFile || travelFile)) {
    try {
      const sequence = new Seq();
      for (const point of points) {
        // The travel beat is a stretched-to-fit effect from the shooter to this target; the impact
        // beat lands on it. Either half may be missing from the table's JB2A install, and the
        // built-in beat fills in for whichever one is.
        if (travelFile) sequence.effect().file(travelFile).atLocation(from).stretchTo(point);
        if (impactFile) sequence.effect().file(impactFile).atLocation(point).scale(0.7);
      }
      sequence.play();
      if (!travelFile && profile.travel && from) {
        for (const point of points) {
          drawHitFx({ travel: profile.travel, travelMs: profile.travelMs, color: profile.color, from, to: point, impact: false });
        }
      }
      return { ...result, via: "sequencer" };
    } catch (error) {
      console.warn(`${MODULE_ID} | Sequencer hit FX failed; falling back to the built-in beats`, error);
    }
  }

  for (const point of points) {
    drawHitFx({
      travel: profile.travel, travelMs: profile.travelMs,
      style: profile.style, color: profile.color,
      from, to: point,
    });
  }
  return { ...result, via: "builtin" };
}

/* -------------------------------------------- the attack fire point */

/**
 * The Ghostwire gear behind an ability, when there is any.
 *
 * B49 stamps `fromGearId` on every ability it spawns from a weapon treasure, which is the only
 * link that survives renames, so it is tried first. A class ability comes back null and is then
 * classified from its own keywords and `_dsid` instead (0.3.128 A).
 */
function gearBehind(ability) {
  const gearId = ability?.getFlag?.(MODULE_ID, "fromGearId");
  if (!gearId) return null;
  return ability.actor?.items?.get?.(gearId) ?? null;
}

/** The kind of hit an ability result represents, or null. */
function kindForAbility(ability) {
  if (!ability) return null;
  const flags = gearFlags(gearBehind(ability));
  const system = ability.system ?? {};
  return classifyHit({
    thrownBlast: !!flags?.thrown,
    range: flags?.range ?? "",
    ammoFamily: flags?.ammoFamily ?? null,
    gunAbility: ammoCostForDsid(system._dsid) > 0,
    keywords: system.keywords ?? [],
    distanceType: system.distance?.type ?? "",
  });
}

/** Every `abilityResult` part on a message, read through the ModelCollection trap B40 documents. */
function resultParts(message) {
  const parts = message?.system?.parts;
  if (!parts) return [];
  const list = Array.isArray(parts) ? parts : (parts.contents ?? Object.values(parts));
  return list.filter(part => (part?.type ?? part?.constructor?.TYPE) === "abilityResult");
}

/** Token centres this message was aimed at, falling back to the roller's live targets. */
function targetPoints(message) {
  const tokens = message?.system?.targetTokens ?? [];
  const points = [...tokens].map(doc => doc?.object?.center).filter(Boolean);
  if (points.length) return points;
  return [...(game.user?.targets ?? [])].map(token => token?.center).filter(Boolean);
}

/** The speaker's token centre — where travel starts. */
function speakerPoint(message) {
  const id = message?.speaker?.token;
  if (!id) return null;
  return canvas?.tokens?.get?.(id)?.center ?? null;
}

/* -------------------------------------------- registration */

export function registerHitFx() {
  registerSettings();

  // One client fires it: the one whose action created the message, exactly as B40 does. Every other
  // client hears the sound through AudioHelper's broadcast and draws nothing, which is correct —
  // the beats are a confirmation for the person who rolled.
  Hooks.on("createChatMessage", (message, options, userId) => {
    if (userId !== game.user.id) return;
    if (!enabled()) return;
    for (const part of resultParts(message)) {
      const ability = part.ability ?? (part.abilityUuid ? fromUuidSync(part.abilityUuid) : null);
      const kind = kindForAbility(ability);
      if (!kind) continue;
      playHitFx(kind, { from: speakerPoint(message), at: targetPoints(message), name: ability?.name ?? "" });
      return;                                      // one attack, one bang
    }
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      playHitFx,
      classifyHit,
      spellFlavour,
      hitFxProfile,
      hitFxProfiles: () => HIT_FX_PROFILES,
    };
  }

  console.log(`${MODULE_ID} | hit FX registered (${HIT_FX_KINDS.join(" / ")}; origin→target + impact; Sequencer optional)`);
}
