// 0.3.127 (D) — Ghostwire's own hit FX: a gun hit, a melee hit, a grenade going off.
//
// **The point of this file is that it depends on nothing.** Automated Animations, Sequencer, JB2A,
// socketlib and ds-aa-bridge are all installed on Michael's box and every one of them is optional
// here. Ghostwire ships its own sounds (assets/sfx/, already on disk for B40) and draws its own
// flash with PIXI, so a table with none of those modules still sees and hears a hit. A table with
// Sequencer and JB2A gets the prettier version of the same three moments, and nothing else changes.
//
// Three decisions worth writing down:
//
//  1. **Sound is never optional; video always is.** The sounds are module assets, so they cannot
//     fail to resolve. The Sequencer path is tried first and, if Sequencer is absent or the file
//     will not resolve, the built-in PIXI burst runs instead — not a no-op. "Graceful degradation"
//     that degrades to nothing is just a dependency with extra steps.
//  2. **This is beside B40, not on top of it.** scripts/sfx.mjs fires on `abilityUse` — the moment
//     you *use* the thing. This fires on `abilityResult` — the moment it *lands*. A burst from a
//     Streetsweeper is therefore two sounds: the muzzle (B40) and the impact (here). Neither file
//     knows about the other, and turning either off leaves the other working.
//  3. **Three kinds, and the classifier says no a lot.** First slice is gun, melee and grenade.
//     A Ghostwire weapon that eats rounds (`gear.ammoFamily`, 0.3.126 B) is a gun; an Adjacent-band
//     weapon is melee; a thrown Blast grenade is a grenade; a bow, a spell, a Matrix Verb and a
//     Commander's shout are all `null` and get nothing. Widening that set is a later wave's job, not
//     an accident of a loose regex.
//
// Everything above the "Foundry registration" divider is Foundry-free so
// tools/wave-03127-smoke.mjs can run it under Node.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.HitFx";

/** The three moments this slice covers. */
export const HIT_FX_KINDS = Object.freeze(["gun", "melee", "grenade"]);

/**
 * What each kind looks and sounds like.
 *
 * `sound` is a module asset and always plays. `sequencerFiles` are JB2A paths tried in order when
 * Sequencer is present; every one of them may be absent, and the built-in `style` runs instead.
 */
export const HIT_FX_PROFILES = Object.freeze({
  gun: {
    sound: `modules/${MODULE_ID}/assets/sfx/arrow-hit.ogg`,
    sequencerFiles: ["jb2a.impact.005.orange", "jb2a.impact.001.blue"],
    style: "tracer",
    color: 0xffcc66,
  },
  melee: {
    sound: `modules/${MODULE_ID}/assets/sfx/punch.ogg`,
    sequencerFiles: ["jb2a.melee_generic.slash.01.orange", "jb2a.impact.005.orange"],
    style: "slash",
    color: 0xffffff,
  },
  grenade: {
    sound: `modules/${MODULE_ID}/assets/sfx/spell-fire-blast.ogg`,
    sequencerFiles: ["jb2a.explosion.01.orange", "jb2a.explosion.02.blue"],
    style: "burst",
    color: 0xff7733,
  },
});

/** A Ghostwire weapon SKU's `gear` stamp reduced to the three facts the classifier needs. */
const RANGE_MELEE = "Adjacent";

/**
 * Which of the three FX an attack is, or `null` for "not this file's business".
 *
 * Deliberately narrow, and the order matters: a thrown Blast grenade is a grenade even though its
 * band reads Short, and a Cyber-Spur is melee even though it is chrome.
 *
 * @param {object} opts
 * @param {boolean} opts.thrownBlast  The source item carries `gear.thrown` (scripts/grenades.mjs).
 * @param {string}  opts.range        The SKU's `gear.range` band: Adjacent / Short / Medium / ...
 * @param {string|null} opts.ammoFamily  The SKU's `gear.ammoFamily` (0.3.126 B) — set only on guns.
 * @returns {"gun"|"melee"|"grenade"|null}
 */
export function classifyHit({ thrownBlast = false, range = "", ammoFamily = null } = {}) {
  if (thrownBlast) return "grenade";
  if (range === RANGE_MELEE) return "melee";
  if (ammoFamily) return "gun";
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
 * The fallback that needs nothing: a short PIXI flash on `canvas.controls`.
 *
 * `canvas.controls` is where Foundry keeps its own transient canvas furniture (cursors, rulers), so
 * a burst drawn there sits above the tokens, never persists, and is never a document anybody has to
 * clean up. The whole thing lasts {@link FX_MS} and then destroys itself.
 */
const FX_MS = 420;

function drawBurst({ style, color, from, to }) {
  const layer = canvas?.controls;
  if (!layer || !to) return null;
  const graphics = layer.addChild(new PIXI.Graphics());
  graphics.eventMode = "none";
  const size = (canvas?.dimensions?.size ?? 100) / 2;
  const start = performance.now();

  const frame = () => {
    const t = Math.min(1, (performance.now() - start) / FX_MS);
    graphics.clear();
    graphics.alpha = 1 - t;

    if (style === "tracer" && from) {
      graphics.lineStyle(3 + (4 * (1 - t)), color, 0.9).moveTo(from.x, from.y).lineTo(to.x, to.y);
      graphics.lineStyle(2, color, 0.8).drawCircle(to.x, to.y, size * (0.25 + (0.5 * t)));
    } else if (style === "slash") {
      const span = size * (0.8 + (0.4 * t));
      graphics.lineStyle(6 * (1 - t) + 2, color, 0.9)
        .moveTo(to.x - span, to.y - (span * 0.6))
        .quadraticCurveTo(to.x, to.y, to.x + span, to.y + (span * 0.6));
    } else {
      const radius = size * (0.5 + (2.2 * t));
      graphics.lineStyle(5 * (1 - t) + 1, color, 0.95).beginFill(color, 0.28 * (1 - t))
        .drawCircle(to.x, to.y, radius).endFill();
    }

    if (t >= 1) {
      canvas.app?.ticker?.remove(frame);
      graphics.destroy();
      return;
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
 * @param {"gun"|"melee"|"grenade"} kind
 * @param {object} [opts]
 * @param {{x: number, y: number}|null} [opts.from]  The attacker's token centre (tracer origin).
 * @param {Array<{x: number, y: number}>} [opts.at]  Where it lands. Empty means "nothing to show".
 * @returns {{kind: string, sound: string, via: "sequencer"|"builtin"|"none"}|null}
 */
export function playHitFx(kind, { from = null, at = [] } = {}) {
  const profile = HIT_FX_PROFILES[kind];
  if (!profile || !enabled()) return null;

  playSound(profile.sound);

  const points = (at ?? []).filter(Boolean);
  if (!points.length) return { kind, sound: profile.sound, via: "none" };

  const Seq = sequencer();
  const file = Seq ? sequencerFile(profile.sequencerFiles) : null;
  if (Seq && file) {
    try {
      const sequence = new Seq();
      for (const point of points) sequence.effect().file(file).atLocation(point).scale(0.7);
      sequence.play();
      return { kind, sound: profile.sound, via: "sequencer" };
    } catch (error) {
      console.warn(`${MODULE_ID} | Sequencer hit FX failed; falling back to the built-in burst`, error);
    }
  }

  for (const point of points) drawBurst({ style: profile.style, color: profile.color, from, to: point });
  return { kind, sound: profile.sound, via: "builtin" };
}

/* -------------------------------------------- the attack fire point */

/**
 * The Ghostwire gear behind an ability, when there is any.
 *
 * B49 stamps `fromGearId` on every ability it spawns from a weapon treasure, which is the only
 * link that survives renames, so it is tried first. A Director who hand-built an attack ability and
 * a Draw Steel class ability both come back null, and get no FX — which is the scope lock.
 */
function gearBehind(ability) {
  const gearId = ability?.getFlag?.(MODULE_ID, "fromGearId");
  if (!gearId) return null;
  return ability.actor?.items?.get?.(gearId) ?? null;
}

/** The kind of hit an ability result represents, or null. */
function kindForAbility(ability) {
  const gear = gearBehind(ability);
  const flags = gearFlags(gear);
  if (!flags) return null;
  return classifyHit({
    thrownBlast: !!flags.thrown,
    range: flags.range ?? "",
    ammoFamily: flags.ammoFamily ?? null,
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

/** The speaker's token centre — where a tracer starts. */
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
  // the burst is a confirmation for the person who rolled.
  Hooks.on("createChatMessage", (message, options, userId) => {
    if (userId !== game.user.id) return;
    if (!enabled()) return;
    for (const part of resultParts(message)) {
      const ability = part.ability ?? (part.abilityUuid ? fromUuidSync(part.abilityUuid) : null);
      const kind = kindForAbility(ability);
      if (!kind) continue;
      playHitFx(kind, { from: speakerPoint(message), at: targetPoints(message) });
      return;                                      // one attack, one bang
    }
  });

  const module = game.modules.get(MODULE_ID);
  if (module) module.api = { ...(module.api ?? {}), playHitFx, classifyHit, hitFxProfiles: () => HIT_FX_PROFILES };

  console.log(`${MODULE_ID} | hit FX registered (gun / melee / grenade; Sequencer optional)`);
}
