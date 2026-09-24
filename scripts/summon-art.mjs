// 0.3.133 (A) — summon token art, and the one-way sync that brings existing world copies along.
//
// The pack rows under src/packs/summons/ now wear Michael's art: one WebP per *family*, not per tier
// (agent-probe.webp for all three Probe bands, sprite-ward.webp for all three Ward bands, and so on),
// plus the three bound-elemental ranks, the Greater Living Mountain and the three pact spirits.
// Rebuilding the pack fixes the compendium. It does not fix a world that already stamped a Probe off
// the old row — that Actor keeps the placeholder PNG forever, and so does every token of it on every
// scene. This file is the pass that fixes those.
//
// Two rules make it safe to run on every `ready`:
//
//  1. **It only ever replaces art it shipped itself.** Each dsid carries the exact list of paths the
//     module has ever pointed it at (`LEGACY_SUMMON_ART`); anything else — a Director's own portrait,
//     a token someone repainted — is left alone. This is the same shape `normalizeWorldKiosk` in
//     scripts/kiosk.mjs uses for the kiosk art, deliberately.
//  2. **It never touches tint.** Pact spirits are grayscale tint-ready bases and the Light / Dark
//     tint is owned by scripts/veil-summons.mjs at summon time and `syncPactTint` in
//     scripts/module.mjs thereafter. A world sync that "helpfully" reset texture.tint would strip
//     the pact off every spirit already on the table.
//
// The GM-only world setting `summonArtSyncVersion` records the last version that ran, so the scan is
// one pass per upgrade rather than one per boot. Helpers above the Foundry divider are Foundry-free
// so tools/wave-03133-smoke.mjs can walk them in Node.

const MODULE_ID = "draw-steel-ghostwire";
const ART_DIR = `modules/${MODULE_ID}/assets/tokens/summons/`;
/** Bump when a new art generation ships, so the `ready` pass runs exactly once more. */
export const SUMMON_ART_SYNC_VERSION = "0.3.133";
export const SUMMON_ART_SETTING = "summonArtSyncVersion";

const art = file => `${ART_DIR}${file}`;

const AGENTS = ["probe", "spike", "daemon", "watchdog"];
const SPRITES = ["data", "attack", "machine", "ward"];
const BANDS = ["minor", "intermediate", "advanced"];

/** The core icons each row wore before it had art of its own. */
const OLD_CORE_ICON = {
  "sprite-data-advanced": "icons/magic/perception/eye-ringed-glow-angry-small-teal.webp",
  "sprite-attack-advanced": "icons/magic/lightning/bolt-strike-blue.webp",
  "sprite-machine-advanced": "icons/magic/life/cross-worn-green.webp",
  "sprite-ward-advanced": "icons/magic/defensive/shield-barrier-glowing-triangle-blue.webp",
  "elemental-rank-2": "icons/magic/air/wind-tornado-wall-blue.webp",
  "elemental-rank-3": "icons/magic/earth/projectile-stone-landslide.webp",
  "elemental-greater": "icons/magic/fire/explosion-fireball-large-red-orange.webp",
};

/** dsid → the art it wears now. Matches src/packs/summons/** exactly; the smoke asserts it. */
export const SUMMON_ART = Object.freeze(Object.fromEntries([
  ...AGENTS.flatMap(a => BANDS.map(b => [`agent-${a}-${b}`, art(`agent-${a}.webp`)])),
  ...SPRITES.flatMap(s => BANDS.map(b => [`sprite-${s}-${b}`, art(`sprite-${s}.webp`)])),
  ["elemental-rank-1", art("bound-elemental-rank-1.webp")],
  ["elemental-rank-2", art("bound-elemental-rank-2.webp")],
  ["elemental-rank-3", art("bound-elemental-rank-3.webp")],
  ["elemental-greater", art("greater-living-mountain.webp")],
  ["spirit-guardian", art("pact-spirit-guardian.webp")],
  ["spirit-warrior", art("pact-spirit-warrior.webp")],
  ["spirit-hunter", art("pact-spirit-hunter.webp")],
  // The three Companions keep their filenames — the *files* were replaced, so a world copy is
  // already showing the new art and there is nothing to migrate.
  ["companion-ember", art("companion-ember.webp")],
  ["companion-zephyr", art("companion-zephyr.webp")],
  ["companion-boulder", art("companion-boulder.webp")],
]));

/** dsid → every path this module has previously shipped for it. Only these are ever overwritten. */
export const LEGACY_SUMMON_ART = Object.freeze(Object.fromEntries([
  ...AGENTS.flatMap(a => BANDS.map(b => [`agent-${a}-${b}`, [art(`agent-${a}-${b}.png`)]])),
  ...SPRITES.flatMap(s => BANDS.map(b => [
    `sprite-${s}-${b}`,
    [art(`sprite-${s}-${b}.webp`), OLD_CORE_ICON[`sprite-${s}-${b}`]].filter(Boolean),
  ])),
  ["elemental-rank-1", [art("elemental-rank-1.webp")]],
  ["elemental-rank-2", [OLD_CORE_ICON["elemental-rank-2"]]],
  ["elemental-rank-3", [OLD_CORE_ICON["elemental-rank-3"]]],
  ["elemental-greater", [OLD_CORE_ICON["elemental-greater"]]],
  ["spirit-guardian", [art("spirit-guardian.webp")]],
  ["spirit-warrior", [art("spirit-warrior.webp")]],
  ["spirit-hunter", [art("spirit-hunter.webp")]],
  ["companion-ember", []],
  ["companion-zephyr", []],
  ["companion-boulder", []],
]));

/** The four summon families this pass owns. Anything else (machine, node, kiosk, locker) is not ours. */
export const SUMMON_ART_KINDS = Object.freeze(["agent", "sprite", "elemental", "spirit"]);

/**
 * Should this path be replaced?
 * True only for a path the module itself shipped — never for art the Director chose, and never for
 * the art already in place.
 *
 * @param {string} dsid
 * @param {string|null|undefined} current
 * @returns {boolean}
 */
export function isLegacySummonArt(dsid, current) {
  const next = SUMMON_ART[dsid];
  if (!next || !current || (current === next)) return false;
  return (LEGACY_SUMMON_ART[dsid] ?? []).includes(current);
}

/**
 * The Actor update one summon needs, or `{}` when it needs none.
 * Tint is deliberately absent — see the header.
 *
 * @param {object} summon
 * @param {string} summon.dsid
 * @param {string} [summon.kind]        flags.<module>.kind; a foreign kind is refused outright.
 * @param {string} [summon.img]         Actor portrait.
 * @param {string} [summon.tokenSrc]    prototypeToken.texture.src.
 * @returns {Record<string, string>}
 */
export function summonArtUpdate({ dsid, kind = null, img = null, tokenSrc = null } = {}) {
  const next = SUMMON_ART[dsid];
  if (!next) return {};
  if (kind && !SUMMON_ART_KINDS.includes(kind)) return {};
  const update = {};
  if (isLegacySummonArt(dsid, img)) update.img = next;
  if (isLegacySummonArt(dsid, tokenSrc)) update["prototypeToken.texture.src"] = next;
  return update;
}

/* ============================================ Foundry registration */

function registerSettings() {
  game.settings.register(MODULE_ID, SUMMON_ART_SETTING, {
    scope: "world", config: false, type: String, default: "",
  });
}

const dsidOf = actor => actor?.getFlag?.(MODULE_ID, "dsid") ?? null;
const kindOf = actor => actor?.getFlag?.(MODULE_ID, "kind") ?? null;

/**
 * Bring one world Actor and every token of it, on every scene, onto the current art.
 * @returns {Promise<number>} documents actually updated.
 */
export async function syncSummonArtFor(actor) {
  const dsid = dsidOf(actor);
  const next = dsid ? SUMMON_ART[dsid] : null;
  if (!next) return 0;
  let touched = 0;
  const update = summonArtUpdate({
    dsid, kind: kindOf(actor),
    img: actor.img,
    tokenSrc: actor.prototypeToken?.texture?.src ?? null,
  });
  if (!foundry.utils.isEmpty(update)) {
    await actor.update(update);
    touched++;
  }
  for (const scene of game.scenes ?? []) {
    for (const token of scene.tokens ?? []) {
      if (token.actorId !== actor.id) continue;
      if (!isLegacySummonArt(dsid, token.texture?.src)) continue;
      await token.update({ "texture.src": next });
      touched++;
    }
  }
  return touched;
}

/** The whole world, once per art generation. GM only — everyone else has no write there anyway. */
async function syncSummonArt() {
  if (!game.user.isGM) return;
  if (game.settings.get(MODULE_ID, SUMMON_ART_SETTING) === SUMMON_ART_SYNC_VERSION) return;
  let touched = 0;
  for (const actor of game.actors ?? []) {
    // Compendium-backed rows in a pack are the pack's business, not the world's.
    if (actor.pack) continue;
    touched += await syncSummonArtFor(actor);
  }
  await game.settings.set(MODULE_ID, SUMMON_ART_SETTING, SUMMON_ART_SYNC_VERSION);
  if (touched) console.log(`${MODULE_ID} | summon art sync ${SUMMON_ART_SYNC_VERSION}: ${touched} document(s) repointed`);
}

export function registerSummonArt() {
  registerSettings();
  Hooks.once("ready", () => syncSummonArt());

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      SUMMON_ART,
      LEGACY_SUMMON_ART,
      isLegacySummonArt,
      summonArtUpdate,
      syncSummonArt,
      syncSummonArtFor,
    };
  }
  console.log(`${MODULE_ID} | summon art registered (${Object.keys(SUMMON_ART).length} dsids · sync ${SUMMON_ART_SYNC_VERSION})`);
}
