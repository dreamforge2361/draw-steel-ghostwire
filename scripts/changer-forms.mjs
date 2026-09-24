// Changer forms — the Foundry-free half (B50b art keys, 0.3.122 Beast-form token footprint).
//
// scripts/module.mjs owns the hooks and the writes; everything here is pure so
// tools/changer-beast-size-smoke.mjs can run it in Node.

/** The three forms, in sheet order. Exactly one is active at a time. */
export const CHANGER_FORMS = Object.freeze(["human", "hybrid", "beast"]);

/** Square sheet portraits (R2: deliberately NOT the same files as the round tokens). */
export const CHANGER_ART_KEYS = Object.freeze({ human: "humanArt", hybrid: "hybridArt", beast: "beastArt" });

/** Round canvas tokens (R2). */
export const CHANGER_TOKEN_KEYS = Object.freeze({ human: "humanToken", hybrid: "hybridToken", beast: "beastToken" });

/**
 * Beast-Form canvas footprint by lineage (0.3.122; Raven added 0.3.125).
 *
 * Rat lineage already overrides `system.combat.size.letter` to **1S** on its own trait
 * (src/packs/origins/changer/rat-lineage-trait.json), which is the *rules* size. This is the canvas
 * half of the same fact: a rat that walks onto a 100px grid as a full square reads as a person.
 *
 * 0.3.125 (C2): a **raven** has the same problem and the same answer. A bird on a full square is a
 * person-sized bird; half a square is what the Rat Beast and the compiled sprites
 * (scripts/sprites.mjs) already use for "small thing on the canvas". Wolf is deliberately still
 * absent — a wolf really is roughly a person's footprint — and a lineage with no entry keeps
 * whatever footprint the Director gave the token.
 */
export const BEAST_TOKEN_SIZES = Object.freeze({ rat: 0.5, raven: 0.5 });

/** The Beast-Form footprint for a lineage, or null when that lineage does not resize. */
export function beastTokenSize(lineage) {
  const size = BEAST_TOKEN_SIZES[lineage];
  return Number.isFinite(size) && size > 0 ? size : null;
}

/** A width/height pair, sane-defaulted to 1×1. */
function normalizeSize(size) {
  const width = Number(size?.width);
  const height = Number(size?.height);
  return {
    width: Number.isFinite(width) && width > 0 ? width : 1,
    height: Number.isFinite(height) && height > 0 ? height : 1,
  };
}

/**
 * The canvas footprint a Changer's token should have right now.
 *
 * Beast + a resizing lineage shrinks; **every other form restores `base`**, which is the footprint
 * snapshotted before the first Beast swap rather than a hard-coded 1×1 — a Goliar-sized Changer or a
 * Director's own 2×2 frame comes back the size it was.
 *
 * With **no snapshot at all** — a Changer who has never been in Beast form — a non-Beast form writes
 * **nothing**. Defaulting to 1×1 there would let a plain "click Human" quietly normalise a token the
 * Director had sized by hand, for a form swap that never shrank it in the first place.
 *
 * @param {object} opts
 * @param {string|null} opts.lineage  flags.<module>.changerLineage from the lineage trait Item.
 * @param {string} opts.form          human | hybrid | beast.
 * @param {{width: number, height: number}} [opts.base]  Pre-Beast footprint.
 * @returns {{width: number, height: number}|null}  null when nothing should be written.
 */
export function changerFormTokenSize({ lineage = null, form = "human", base } = {}) {
  const beast = beastTokenSize(lineage);
  if (!beast) return null;
  if (form === "beast") return { width: beast, height: beast };
  if (!base) return null;
  return normalizeSize(base);
}

/** Should the pre-Beast footprint be snapshotted before this swap? */
export function shouldSnapshotBeastSize({ lineage = null, form = "human", stored = null, current } = {}) {
  if (form !== "beast") return false;
  if (!beastTokenSize(lineage)) return false;
  if (stored) return false;
  const beast = beastTokenSize(lineage);
  const { width, height } = normalizeSize(current);
  // Already shrunk (a half-finished earlier swap): snapshotting now would freeze 0.5 as "normal".
  return !((width === beast) && (height === beast));
}
