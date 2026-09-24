// Builds the eight B44 pregen Hero Actors (src/packs/pregens/) at Level 1 / Echelon 1 from the
// shipped Ghostwire packs. The dossier PDF's old "Tier 5" sheet math is NOT used — see BUILD-NOTES.md.
//
// B44b: the actors are now "robust filled" — every Level 1 advancement grant on their class,
// subclass, kit, ancestry, background and profession is resolved and embedded (so nothing waits on
// Foundry's advancement dialog), and concrete gear / chrome / languages come from
// docs/masters/pregens/loadouts.json (see LOADOUTS.md for why each pick).
//
// B59: advancement recursion and roster ability seeds are level-gated (see tools/lib/pregen-level-gate.mjs).
// Smoke: node tools/pregen-level-gate-smoke.mjs
//
// F4 (0.3.93): a regen is safe to re-run. Everything that used to be hand-patched onto the built
// actors — portraits, Changer form art, class level, Taint/Corruption History, Sabbat's installed
// Whiteout — now comes from this roster, docs/masters/pregens/loadouts.json or
// docs/masters/pregens/post-patches.json, so this script reproduces src/packs/pregens/ byte for
// byte. Smoke: node tools/pregen-regen-smoke.mjs
//
// R2 (0.3.121): portrait and canvas token are no longer the same file. `img` keeps the square
// dossier plate under assets/pregens/; `prototypeToken.texture.src` takes the round transparent
// WebP under assets/tokens/pregens/ built by tools/pregen-round-tokens.mjs. Changer flags carry
// both halves (`humanArt`/`hybridArt`/`beastArt` vs `humanToken`/`hybridToken`/`beastToken`).
// Smoke: node tools/r2-pregen-round-tokens-smoke.mjs
//
// 0.3.124: three changes live here. (E) the display Name is the hero's full name and nothing else —
// the street handle moved into the Biography, where it belongs. (F) Renn Solace-Ward (Medic /
// Pure Human) and Kade Orrin-Vex (Operator / Cyborg) joined the roster, and Kade is the first
// Cyborg pregen, so Body Integrity is no longer hard-coded at 20 (see INTEGRITY_BY_ANCESTRY).
// (A2) a choice pool now honours `flags.draw-steel-ghostwire.pact`, the same gate
// `patchPactFilter()` applies in chargen, so a Light priest is never handed Sacrificial Offer.
//
// Run:  node tools/pregens-to-actors.mjs   then   node tools/build-packs.mjs   (Foundry closed)
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import {
  advancementMeetsLevel,
  abilityAllowedAtLevel,
  buildGrantLevelByDsid,
} from "./lib/pregen-level-gate.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const OUT = "src/packs/pregens";
const LOADOUTS = "docs/masters/pregens/loadouts.json";
const POST_PATCHES = "docs/masters/pregens/post-patches.json";
const DEFAULT_ITEMS = "docs/masters/pregens/default-items.json";
// Starting yen on every pregen sheet. scripts/kiosk.mjs spends system.hero.wealth against Gear
// prices, so this is a balance the table can actually shop with, not a Draw Steel wealth tier.
const START_WEALTH = 250;
/**
 * Body Integrity a hero walks in with, by People. Living bodies get 20; a Cyborg frame gets 25,
 * the same CYBORG_INTEGRITY_START scripts/module.mjs stamps when the ancestry lands on a sheet.
 * Anything not listed is living.
 */
const INTEGRITY_START = 20;
const INTEGRITY_BY_ANCESTRY = { cyborg: 25 };
const integrityMaxFor = ancestry => INTEGRITY_BY_ANCESTRY[ancestry] ?? INTEGRITY_START;
const B62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const stableId = seed => [...createHash("sha256").update("gw-pregens:" + seed).digest()].slice(0, 16).map(b => B62[b % 62]).join("");
const read = p => JSON.parse(readFileSync(p, "utf8"));

// Level-1 characteristic array (Draw Steel standard spread), 2s on the class's core characteristics.
const ARRAY = [2, 2, 1, 1, 0];
const ALL_CHARS = ["might", "agility", "reason", "intuition", "presence"];

const ROSTER = [
  {
    key: "Vessa", slug: "vessa-corran-dov", name: "Vessa Corran-Dov", handle: "the Preacher of Ninth",
    cls: "street-priest", subclass: "shepherd", ancestry: "corran",
    traits: ["great-fortitude-trait", "stand-tough-trait"],
    kit: "magic-tech/sanctified", background: "faith-district", profession: "acolyte",
    skills: ["religion", "rituals", "insight", "medicine"],
    bio: "A Corran Street Priest of the Shepherd ministry, holding a lamp-lit corner at Ninth-and-Fold in the Flats. Her Light pact buys mercy and protection, and costs her every time she spends it.",
    // 0.3.123: Smite / Rebuke was consolidated into **Rebuke**, and Vessa is Light pact, so Rebuke is
    // the free strike her Pact Strike grant lands on. Dark priests get Drain instead (scripts/pact-strike.mjs).
    abilities: ["rebuke", "lay-on-hands", "faith-is-our-armor"],
  },
  {
    key: "Kaes", slug: "kaes-vahn-estal", name: "Kaïs Vahn-Estal", handle: "the Static Saint",
    cls: "elementalist", subclass: "stormcaller", ancestry: "elvani",
    traits: ["high-senses-trait", "otherworldly-grace-trait"],
    kit: "ranged/hexshot", background: "corp-arcology", profession: "entertainer",
    skills: ["spellcraft", "rituals", "perception", "persuasion"],
    bio: "An Elvani Stormcaller who came down off the Glass Tier and stayed down. He runs no chrome — the current he channels will not share a body with metal.",
    abilities: ["bolt-barrage", "hurl-element", "elemental-shaping"],
  },
  {
    key: "Barak", slug: "barak-voss-hallor", name: "Barak Voss-Hallor", handle: "the Foreman",
    cls: "commander", subclass: "street-fixer", ancestry: "goliar",
    traits: ["relentless-trait", "nonstop-trait"],
    // Juggernaut is not in the Commander class kit pool (no heavy kits) — Saturation is the
    // closest legal fit for a heavy-firearm fixer. See BUILD-NOTES.md.
    kit: "ranged/saturation", background: "sprawl-district", profession: "fixer",
    skills: ["command", "negotiation", "streetwise", "intimidation"],
    bio: "Nine feet of grey demolition plate and a voice that gets crews paid. The Foreman brokers work in the sprawl and expects the word he gives to be kept.",
    // 0.1.92: Battle Cry is the Street Fixer's table presence; Command Persona / Fearful Awe was
    // stripped off the built actor by hand. Dropping it here keeps a regen from re-adding it.
    abilities: ["a-word", "battle-cry"],
  },
  {
    key: "Wren", slug: "wren-sable-corvin", name: "Wren Sable-Corvin", handle: "the Kite",
    cls: "scout", subclass: "hunter", ancestry: "changer",
    traits: ["changer-forms-trait", "raven-lineage-trait", "beast-movement-trait"],
    kit: "ranged/longshot", background: "transit-hub", profession: "courier",
    skills: ["stealth", "perception", "survival", "acrobatics"],
    changerArt: { hybrid: "wren-sable-corvin-hybrid", beast: "wren-sable-corvin-beast" },
    bio: "A Changer of the Raven lineage who works the rooftops and the sightlines above the Flats. She sees the run before the crew walks into it.",
    abilities: ["quarry", "steady-the-scope"], // careful-observation is L3 (B59 level-gate)
  },
  {
    key: "Sabbat", slug: "sabbat-vane", name: "Sabbat Vane", handle: "the Dead Frequency",
    cls: "technomancer", subclass: "sprite-weaver", ancestry: "revenant",
    traits: ["bloodless-trait", "undead-influence-trait", "tough-but-withered-trait"],
    kit: "magic-tech/no-kit", background: "undercity-barrens", profession: "deck-jockey",
    skills: ["resonance", "rituals", "matrixTheory", "occult"],
    bio: "A Revenant who came back wrong and wired, compiling sprites out of a coffin-motel cell. The dead net answers when he calls, which is not the same as obeying.",
    abilities: ["compile-sprite", "resonance-mending", "resonance-strike"],
  },
  {
    key: "Vira", slug: "vira-kellis-nade", name: "Vira Kellis-Nade", handle: "the Warren-Wire",
    cls: "wrench", subclass: "drone-jockey", ancestry: "changer",
    traits: ["changer-forms-trait", "rat-lineage-trait", "beast-hide-trait"],
    // 0.1.92: Rigger's Harness -> Fabricator's Bench for the Drone Jockey (was a hand-edit on the
    // built actor; it lives here now so a regen keeps it). See PREGEN-WALKTHROUGH-AUDIT.md.
    kit: "tech/fabricators-bench", background: "undercity-barrens", profession: "rig-tech",
    skills: ["rigging", "gunnery", "repair", "electronics"],
    art: "vira-kellis-nade-human",
    changerArt: { hybrid: "vira-kellis-nade-hybrid", beast: "vira-kellis-nade-beast" },
    bio: "A Changer of the Rat lineage who fights through a fleet she built herself, in warrens she knows nine ways out of. Every drone is a door she left open.",
    abilities: ["deploy-and-command", "rigged-fire", "field-repair"],
  },
  {
    key: "Kessic", slug: "kessic-draye", name: "Kessic Draye", handle: "Null",
    cls: "hacker", subclass: "disruptor", ancestry: "mutant",
    traits: ["taint-sight-trait", "aberrant-rapport-trait"],
    // His deck is his kit: the Nyx "Switchblade" decker kit, not the caster no-kit placeholder.
    kit: "tech/nyx-switchblade", background: "sprawl-district", profession: "deck-jockey",
    skills: ["hacking", "electronics", "matrixTheory", "securitySystems"],
    bio: "An Aberrant-strain Mutant deckhead who turns a site's own defences against the people who paid for them. The taint that marks him is also how he reads a system.",
    abilities: ["deep-scan"], // dual-boot L6 / backdoor-override L8 gated out at L1 (B59)
    extras: ["src/packs/matrix/decks/street-deck.json"],
  },
  {
    // F1 (0.3.124). Michael locked Medic = Pure Human and left the rest to match the siblings:
    // Gunslinger is the class's own Quick Build kit and the only light kit a trauma doc would
    // carry a bag alongside, and Street Doc is a profession the pack already ships.
    key: "Renn", slug: "renn-solace-ward", name: "Renn Solace-Ward", handle: "Patchwire",
    cls: "medic", subclass: "street-doc", ancestry: "pure-human",
    traits: ["determination-trait", "perseverance-trait", "staying-power-trait"],
    kit: "finesse/gunslinger", background: "sprawl-district", profession: "street-doc",
    skills: ["medicine", "medicineLore", "insight", "contacts"],
    bio: "A Pure Human Street-Doc who works out of a folding table and whatever the block can spare, stitching runners back together for whatever they have on them. No chrome, no licence, no questions — and a waiting list either way.",
    // Signatures (First Aid / Administer Dose / Diagnose) and the three Reagent bands all come
    // from the class's own L1 grants; the pools' first entries are already the Quick Build.
    abilities: [],
  },
  {
    // F2 (0.3.124) + the brief's ADDENDUM: the first Cyborg pregen, and Michael wants him read as
    // mostly chrome. Body Integrity 25, all 25 spent — see docs/masters/pregens/loadouts.json.
    key: "Kade", slug: "kade-orrin-vex", name: "Kade Orrin-Vex", handle: "Hardframe",
    cls: "operator", subclass: "corp-milspec", ancestry: "cyborg",
    // Cortical Firewall and Arcane Severance are the Cyborg signature traits and land automatically;
    // these three are the purchased picks a milspec frame would have been issued.
    traits: ["predictive-sensors-trait", "auxiliary-limbs-combat-trait", "installed-suite-trait"],
    kit: "heavy/warframe", background: "corp-arcology", profession: "merc-recruit",
    skills: ["perception", "athletics", "firearms", "command"],
    bio: "A Cyborg Operator off a corp milspec line that never got the offboarding scrub. Matte plating under the skin, a replacement arm with servo seams, an optic cluster that reads a room in bands his handlers never authorised, an aural suite, a cranial datajack and a nervous system wired faster than the body it came in. Laced bone underneath all of it. He still moves like he is on someone's clock.",
    abilities: [],
  },
];

// ---- Index every shipped item by _id so grant UUIDs resolve to source JSON.
const INDEX = new Map();
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".json") && e.name !== "_folder.json") {
      let j; try { j = read(p); } catch { continue; }
      if (j?._id && j?.type) INDEX.set(j._id, { path: p, json: j });
    }
  }
})("src/packs");

/** Find an item JSON under a class folder (abilities/, origins/<subclass>/, or the class root). */
function findInClass(cls, dsid) {
  const roots = [`src/packs/classes/${cls}`, `src/packs/classes/${cls}/abilities`];
  for (const dir of readdirSync(`src/packs/classes/${cls}/origins`, { withFileTypes: true }).filter(d => d.isDirectory()))
    roots.push(`src/packs/classes/${cls}/origins/${dir.name}`);
  for (const root of roots) {
    const p = join(root, `${dsid}.json`);
    if (existsSync(p)) return read(p);
  }
  return null;
}

const idFromUuid = uuid => uuid?.split(".").pop();

/** dsid → minimum advancement level that grants it (class/subclass/etc. pools). */
const GRANT_LEVEL_BY_DSID = buildGrantLevelByDsid(INDEX, idFromUuid);

/** Default fill level; class item `system.level` overrides when present on the seed. */
const DEFAULT_TARGET_LEVEL = 1;

/**
 * 0.3.127 (C) — the default abilities every hero walks in with.
 *
 * Draw Steel grants these through `ds.CONFIG.hero.defaultItems`, a live Set that Foundry copies onto
 * an Actor at creation time. The pregens are not created in Foundry, so for nine builds they simply
 * never got any: no Catch Breath, no Stand Up, no Grab. A player handed Vira's dossier could not
 * spend a Recovery from her own sheet.
 *
 * Two halves, both read from disk so a regen stays reproducible with no Foundry and no Draw Steel
 * system present:
 *
 *  * **Kept stock defaults** — Catch Breath, Escape Grab, Grab, Knockback, Stand Up, Advance,
 *    Disengage — from the committed snapshot in docs/masters/pregens/default-items.json
 *    (refreshed by tools/ds-default-items.mjs).
 *  * **Ghostwire's five swaps** — Drive, Rush, Take Cover, Patch Up, Spot Target — the module's own
 *    Items under src/packs/abilities/, exactly the compendium ids `DEFAULT_ITEM_SWAPS` in
 *    scripts/module.mjs substitutes for Ride / Charge / Defend / Heal / Aid Attack at `init`. The
 *    ids are asserted below rather than assumed, so the two files cannot drift apart silently.
 *
 * What is **not** here is as deliberate: the two generic Free Strikes (B44c strips them everywhere,
 * because every Ghostwire weapon spawns its own attack) and the Matrix Verbs (B117 fires those from
 * the node applet, not from a sheet).
 */
const GW_SWAP_ABILITIES = [
  ["Xc5MebcXHYG1hdQR", "src/packs/abilities/spot-target.json"],
  ["Od6u2idYoCRmoDYD", "src/packs/abilities/rush.json"],
  ["1W0HIoL2SAcbTU6W", "src/packs/abilities/take-cover.json"],
  ["pJY4ybZUtkH9HDxy", "src/packs/abilities/patch-up.json"],
  ["Lc7LhoqWg9ydP5Jm", "src/packs/abilities/drive.json"],
];

/** Abilities that must never reach a pregen sheet, whatever else changes. */
const FORBIDDEN_DEFAULT_DSIDS = new Set(["melee-free-strike", "ranged-free-strike"]);

function defaultAbilities() {
  if (!existsSync(DEFAULT_ITEMS)) {
    throw new Error(`${DEFAULT_ITEMS} is missing — run \`node tools/ds-default-items.mjs\` (Foundry closed) first.`);
  }
  const stock = read(DEFAULT_ITEMS).items ?? [];
  const swaps = GW_SWAP_ABILITIES.map(([, path]) => read(path));
  // The swap ids are the contract between this file and scripts/module.mjs. Sorted, because the
  // pairing above is by *file*, and a hand-edit that re-pairs them is exactly the mistake to catch.
  const expected = GW_SWAP_ABILITIES.map(([id]) => id).sort().join(",");
  const found = swaps.map(item => item._id).sort().join(",");
  if (expected !== found) throw new Error(`DEFAULT_ITEM_SWAPS drift: expected ${expected}, found ${found}`);

  const items = [...stock, ...swaps];
  const bad = items.filter(item => FORBIDDEN_DEFAULT_DSIDS.has(item.system?._dsid));
  if (bad.length) throw new Error(`default abilities must not include ${bad.map(i => i.system._dsid).join(", ")}`);
  return items;
}

/**
 * Walk advancements of every item the hero holds (≤ targetLevel) and collect what they grant:
 * items (recursively), skills and languages. Choices (`chooseN`) are taken in pool order and
 * every one is reported so LOADOUTS.md can record it.
 *
 * B59: every grant path is gated by {@link advancementMeetsLevel} so L1 fills never embed
 * Dual Boot (L6), Backdoor Override (L8), Careful Observation (L3), etc.
 */
function resolveGrants(seed, hero, log, targetLevel = DEFAULT_TARGET_LEVEL) {
  const items = new Map(seed.map(i => [i._id, i]));
  const skills = new Set(hero.skills);
  const languages = new Set();
  const queue = [...seed];
  log.levelWarnings ??= [];

  /**
   * 0.3.124 (A2) — the pact this hero has sworn, read off whatever Pact Alignment feature is
   * already in hand. The class lists Pact Alignment (sort 6000) before Signature Abilities
   * (sort 10000), so by the time a pact-gated pool is walked the answer exists.
   */
  const pactSworn = () => {
    for (const item of items.values()) {
      const alignment = item.flags?.[MODULE_ID]?.pactAlignment;
      if (alignment) return alignment;
    }
    return null;
  };

  while (queue.length) {
    const item = queue.shift();
    for (const adv of Object.values(item.system?.advancements ?? {})) {
      const label = `${String(item.name).split(".").pop()}/${adv.name || adv.type}`;
      if (!advancementMeetsLevel(adv, targetLevel, { warnings: log.levelWarnings, label })) continue;

      if (adv.type === "itemGrant") {
        const alignment = pactSworn();
        // Same rule as patchPactFilter() in scripts/module.mjs: a row flagged for the other pact is
        // not an option. Unflagged rows, and heroes with no pact, are unaffected.
        const pool = (adv.pool ?? []).map(p => idFromUuid(p.uuid)).filter(id => {
          const pact = INDEX.get(id)?.json?.flags?.[MODULE_ID]?.pact;
          if (!pact || !alignment || (pact === alignment)) return true;
          log.choices.push(`${label}: skipped ${INDEX.get(id)?.json?.system?._dsid ?? id} (${pact} pact only)`);
          return false;
        });
        // A choice pool must land on the roster's own kit / subclass / lineage / traits / abilities
        // before it falls back to pool order, or Krow ends up a Gunslinger Corp-Milspec.
        const preferred = pool.filter(id => hero.prefer.has(INDEX.get(id)?.json?.system?._dsid));
        const take = adv.chooseN == null
          ? pool
          : [...preferred, ...pool.filter(id => !preferred.includes(id))].slice(0, adv.chooseN);
        if (adv.chooseN != null && pool.length > adv.chooseN)
          log.choices.push(`${label}: took ${take.map(id => INDEX.get(id)?.json?.system?._dsid ?? id).join(", ")} (of ${pool.length} options)`);
        for (const id of take) {
          const found = INDEX.get(id);
          if (!found) { log.skipped.push("grant target lives in the Draw Steel system compendium, not this module"); continue; }
          if (items.has(id)) continue;
          items.set(id, found.json);
          queue.push(found.json);
        }
      } else if (adv.type === "skill") {
        const choices = adv.skills?.choices ?? [];
        const take = adv.chooseN == null ? choices : choices.slice(0, adv.chooseN);
        take.forEach(s => skills.add(s));
        if (adv.chooseN != null && !choices.length)
          log.open.push(`${label}: free pick of ${adv.chooseN} from ${(adv.skills?.groups ?? []).join("/") || "any"} — using the roster's skills`);
        else if (adv.chooseN != null && choices.length > adv.chooseN)
          log.choices.push(`${label}: skill ${take.join(", ")} (of ${choices.join(", ")})`);
      } else if (adv.type === "language") {
        (adv.languages ?? []).forEach(l => languages.add(l));
        if (adv.chooseN) log.open.push(`${label}: ${adv.chooseN} language pick(s) — using the loadout list`);
      } else if (adv.type === "effectGrant") {
        log.skipped.push("effectGrant targets the Draw Steel system compendium; Foundry applies it at runtime");
      }
      // "characteristic" advancements are ignored: the Level 1 array is set directly.
    }
  }
  return { items: [...items.values()], skills: [...skills], languages: [...languages] };
}

function embed(actorId, source, warn) {
  if (!source) { warn.push("missing item"); return null; }
  const { _key, effects = [], ...item } = source;
  return {
    ...item,
    effects: effects.map(({ _key: ek, ...e }) => ({ ...e, _key: `!actors.items.effects!${actorId}.${item._id}.${e._id}` })),
    _key: `!actors.items!${actorId}.${item._id}`,
  };
}

/**
 * Portrait art lives in assets/pregens/. It shipped as PNG and was compressed to WebP in 0.1.87, and a
 * hero may point at a file that is not <slug> (Vira's portrait is her Changer human form). Trying both
 * extensions, and honouring `hero.art`, is what stops a regen from stamping every sheet with
 * mystery-man — the single worst thing a re-run used to do. (F4)
 */
function artPath(base) {
  if (!base) return null;
  const stem = String(base).replace(/\.(webp|png)$/i, "");
  for (const ext of [".webp", ".png"]) if (existsSync(`assets/pregens/${stem}${ext}`)) return `modules/${MODULE_ID}/assets/pregens/${stem}${ext}`;
  return null;
}

/**
 * R2 (0.3.121): canvas token art is a *different file* from the sheet portrait — a 1024² circular
 * WebP with alpha under assets/tokens/pregens/, cut by tools/pregen-round-tokens.mjs, matching the
 * bestiary / ARG / mule-bot plates. Before R2 both fields pointed at the same square dossier plate,
 * which read as a photo dropped on the battle map.
 *
 * Falls back to the portrait when a stem has no round token yet, so a new pregen still builds.
 */
function tokenPath(base) {
  if (!base) return null;
  const stem = String(base).replace(/\.(webp|png)$/i, "");
  for (const ext of [".webp", ".png"]) if (existsSync(`assets/tokens/pregens/${stem}${ext}`)) return `modules/${MODULE_ID}/assets/tokens/pregens/${stem}${ext}`;
  return null;
}

/** Recursive object merge used by the post-patch step; arrays and scalars replace wholesale. */
function deepMerge(target, patch) {
  for (const [k, v] of Object.entries(patch ?? {})) {
    if (v && typeof v === "object" && !Array.isArray(v)) target[k] = deepMerge(target[k] && typeof target[k] === "object" && !Array.isArray(target[k]) ? target[k] : {}, v);
    else target[k] = v;
  }
  return target;
}

const DEFAULT_ABILITIES = defaultAbilities();
const loadouts = existsSync(LOADOUTS) ? read(LOADOUTS) : {};
if (!existsSync(LOADOUTS)) console.log(`(no ${LOADOUTS} — building without gear, chrome or languages)`);
// F4: post-build field patches that are not gear and not roster identity (Taint, Corruption History,
// anything a future pass would otherwise hand-edit onto the built JSON). `_all` applies to every
// hero, then the per-slug block. See post-patches.json's own `_note`.
const postPatches = existsSync(POST_PATCHES) ? read(POST_PATCHES) : {};

mkdirSync(OUT, { recursive: true });
for (const entry of readdirSync(OUT)) rmSync(join(OUT, entry), { recursive: true, force: true });

const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const actorsLang = {};
const report = [];

for (const [i, hero] of ROSTER.entries()) {
  const warn = [];
  const log = { choices: [], open: [], skipped: [] };
  const actorId = stableId(hero.slug);
  const kit = read(`src/packs/kits/${hero.kit}.json`);
  const cls = read(`src/packs/classes/${hero.cls}/${hero.cls}.json`);
  // Level source of truth: class item system.level, else generator config / default 1.
  const targetLevel = Number(cls.system?.level) > 0
    ? Number(cls.system.level)
    : Number(hero.level) > 0 ? Number(hero.level) : DEFAULT_TARGET_LEVEL;

  const seed = [
    read(`src/packs/origins/${hero.ancestry}/${hero.ancestry}.json`),
    ...hero.traits.map(t => {
      const p = `src/packs/origins/${hero.ancestry}/${t}.json`;
      if (!existsSync(p)) { warn.push(`trait ${t} not found`); return null; }
      return read(p);
    }),
    cls,
    findInClass(hero.cls, hero.subclass),
    kit,
    read(`src/packs/backgrounds/${hero.background}.json`),
    read(`src/packs/professions/${hero.profession}.json`),
    ...hero.abilities.map(a => {
      const found = findInClass(hero.cls, a);
      if (!found) { warn.push(`ability ${a} not found`); return null; }
      // B59: roster seeds must not bypass the level gate (old bug: Dual Boot / Careful Observation).
      if (!abilityAllowedAtLevel(a, targetLevel, GRANT_LEVEL_BY_DSID)) {
        const need = GRANT_LEVEL_BY_DSID.get(a);
        warn.push(`skipped ability ${a}: granted at L${need} > target L${targetLevel}`);
        return null;
      }
      return found;
    }),
    ...(hero.extras ?? []).map(p => (existsSync(p) ? read(p) : (warn.push(`extra ${p} missing`), null))),
  ].filter(Boolean);

  // B44b: pull in everything the target level actually grants, steering every choice pool toward the
  // roster's own picks (this hero's kit, subclass, lineage, traits and signature abilities).
  hero.prefer = new Set([...seed.map(s => s.system?._dsid), ...(hero.prefers ?? [])].filter(Boolean));
  const granted = resolveGrants(seed, hero, log, targetLevel);

  // B44b: concrete gear and chrome from the committed loadout file.
  const loadout = loadouts[hero.slug] ?? {};
  const kitItems = [
    ...(loadout.armor ? [loadout.armor] : []),
    ...(loadout.weapons ?? []), ...(loadout.gear ?? []),
    ...(loadout.chrome ?? []).map(c => c.path),
  ].map(p => {
    if (!existsSync(p)) { warn.push(`loadout item ${p} missing`); return null; }
    return read(p);
  }).filter(Boolean);
  // 0.3.88: Ritual Formula Items the caster has already studied (flagged learned).
  for (const p of loadout.rituals ?? []) {
    if (!existsSync(p)) { warn.push(`loadout ritual ${p} missing`); continue; }
    const formula = read(p);
    formula.flags[MODULE_ID].ritual.learned = true;
    kitItems.push(formula);
  }
  // F4 (0.3.93): matrix mods/payloads that ship already installed on a host Item the hero holds —
  // Sabbat's Whiteout magazine sits in his Wired Native slot (0.3.45), which used to be a hand-edit.
  for (const m of loadout.mods ?? []) {
    if (!existsSync(m.path)) { warn.push(`loadout mod ${m.path} missing`); continue; }
    const mod = read(m.path);
    if (m.quantity != null) mod.system.quantity = m.quantity;
    Object.assign(mod.flags[MODULE_ID].mod, {
      ...(m.installedOn ? { installedOn: m.installedOn } : {}),
      ...(m.active != null ? { active: m.active } : {}),
    });
    if (m.installedOn && !kitItems.some(k => k._id === m.installedOn) && !granted.items.some(g => g._id === m.installedOn))
      warn.push(`mod ${mod.system._dsid} installs on ${m.installedOn}, which this hero does not hold`);
    kitItems.push(mod);
  }

  const core = cls.system.characteristics?.core ?? [];
  const ordered = [...core, ...ALL_CHARS.filter(c => !core.includes(c))];
  const characteristics = Object.fromEntries(ordered.map((c, n) => [c, { value: ARRAY[n] ?? 0 }]));

  const kitStamina = Number(kit.system?.bonuses?.stamina ?? 0) || 0;
  const stamina = Number(cls.system.stamina?.starting ?? 20) + kitStamina;
  const recoveries = Number(cls.system.recoveries ?? 8);

  const img = artPath(hero.art ?? hero.slug) ?? "icons/svg/mystery-man.svg";
  if (img.endsWith("mystery-man.svg")) warn.push("no portrait — placeholder art");
  const token = tokenPath(hero.art ?? hero.slug) ?? img;
  if (token === img && !img.endsWith("mystery-man.svg")) warn.push("no round token — canvas falls back to the square portrait");

  const nameKey = `GHOSTWIRE.Pregens.Actors.${hero.key}.Name`;
  actorsLang[hero.key] = {
    // E (0.3.124): the Name field is the hero's name. It used to read
    // `Barak Voss-Hallor — “the Foreman”`, which put a street handle in every actor list, every
    // token nameplate and every chat speaker. The handle is fiction, so it opens the Biography.
    Name: hero.name,
    Description: `Street name: “${hero.handle}.” ${hero.bio}`,
  };

  const languages = [...new Set([...(loadout.languages ?? []), ...granted.languages])];
  // 0.3.127 (C): the DS/GW default ability set, last so a class grant of the same id wins the slot.
  const held = new Set([...granted.items, ...kitItems].map(i => i._id));
  const defaults = DEFAULT_ABILITIES.filter(item => !held.has(item._id));
  const items = [...granted.items, ...kitItems, ...defaults].map(s => embed(actorId, s, warn)).filter(Boolean);
  // Draw Steel stores the hero's level on the class Item, not the Actor. This used to run *after*
  // writeFileSync, so it never reached disk (0.1.89 patched the built JSON by hand and 0.1.91 lost
  // it again on Kessic) — it has to happen before the Actor is assembled. (F4)
  for (const it of items) if (it.type === "class") it.system = { ...(it.system ?? {}), level: targetLevel };
  const biSpent = (loadout.chrome ?? []).reduce((n, c) => n + Number(c.bi ?? 0), 0);
  const integrityMax = integrityMaxFor(hero.ancestry);
  if (biSpent > integrityMax) warn.push(`chrome spends ${biSpent} Body Integrity — over the ${integrityMax} cap`);

  const actor = {
    _id: actorId, _key: `!actors!${actorId}`,
    name: nameKey, type: "hero", img, folder: null, sort: (i + 1) * 100000,
    system: {
      stamina: { value: stamina, temporary: 0 },
      characteristics,
      combat: { save: { threshold: 6, bonus: "" }, size: { value: 1, letter: "M" }, stability: 0, turns: 1 },
      biography: {
        value: `GHOSTWIRE.Pregens.Actors.${hero.key}.Description`, director: "",
        languages, height: { value: 0, units: "inches" }, weight: { value: 0, units: "pounds" }, age: "",
      },
      movement: { value: 5, types: ["walk"], hover: false, disengage: 1 },
      damage: { immunities: {}, weaknesses: {} },
      source: { book: "Ghostwire Dossiers & Fiction", page: hero.name, license: "Draw Steel Creator License" },
      negotiation: { interest: 5, patience: 5, motivations: [], pitfalls: [], impression: 1 },
      recoveries: { value: recoveries },
      // 0.3.93: every hero walks in with ¥250 of spending money (Michael's lock). Wealth 1 is the
      // Draw Steel starting *tier*; Ghostwire sheets read this field as yen, so the roster carries
      // cash a crew can actually spend between runs. Living here keeps a regen from resetting it.
      hero: { primary: { value: 0 }, epic: { value: 0 }, surges: 0, xp: 0, victories: 0, renown: 1, wealth: START_WEALTH },
      skills: { value: granted.skills },
      statuses: { immunities: [] },
    },
    prototypeToken: {
      name: nameKey, displayName: 20, actorLink: true, width: 1, height: 1,
      texture: { src: token, scaleX: 1, scaleY: 1 },
      sight: { enabled: true }, disposition: 1,
    },
    items, effects: [],
    flags: {
      [MODULE_ID]: {
        pregen: hero.slug,
          biSpent,
          biRemaining: integrityMax - biSpent,
          // Sheet reads integrity.value/max (not biRemaining alone) — keep both in sync.
          integrity: { value: integrityMax - biSpent, max: integrityMax },
        // Changer form art: the sheet portrait and the canvas token are two different files per
        // form (R2, 0.3.121). `*Art` is the square dossier plate the Hero sheet shows; `*Token` is
        // the round WebP the canvas uses. syncChangerFormArt (B50) reads both and never forces one
        // onto the other. A form with no round token yet simply has no `*Token` key, and the
        // runtime falls back to that form's `*Art`.
        ...(hero.changerArt ? { changer: {
          humanArt: img,
          ...(artPath(hero.changerArt.hybrid) ? { hybridArt: artPath(hero.changerArt.hybrid) } : {}),
          ...(artPath(hero.changerArt.beast) ? { beastArt: artPath(hero.changerArt.beast) } : {}),
          humanToken: token,
          ...(tokenPath(hero.changerArt.hybrid) ? { hybridToken: tokenPath(hero.changerArt.hybrid) } : {}),
          ...(tokenPath(hero.changerArt.beast) ? { beastToken: tokenPath(hero.changerArt.beast) } : {}),
        } } : {}),
      },
    },
  };
  // F4: `_all` first, then this hero's block, so a per-hero value wins.
  deepMerge(actor, postPatches._all ?? {});
  deepMerge(actor, postPatches[hero.slug] ?? {});

  writeFileSync(join(OUT, `${hero.slug}.json`), JSON.stringify(actor, null, 2) + "\n");

  report.push({ hero: hero.name, stamina, items: items.length, defaults: defaults.length, skills: granted.skills.length, languages: languages.length, biSpent, integrityMax, warn, log });
}

lang.GHOSTWIRE.COMPENDIUM.pregens = "Ghostwire Pregens";
lang.GHOSTWIRE.Pregens = { ...(lang.GHOSTWIRE.Pregens ?? {}), Actors: actorsLang };
writeFileSync("lang/en.json", JSON.stringify(lang, null, 2) + "\n");

for (const r of report) {
  console.log(`${r.hero}: Sta ${r.stamina} · ${r.items} items (${r.defaults} default abilities) · ${r.skills} skills · ${r.languages} languages · BI spent ${r.biSpent}/${r.integrityMax}`);
  for (const c of r.log.choices) console.log(`    choice: ${c}`);
  for (const o of r.log.open) console.log(`    open:   ${o}`);
  if (r.warn.length) console.log(`    ! ${r.warn.join("; ")}`);
}
const levelWarns = report.flatMap(r => r.log.levelWarnings ?? []);
if (levelWarns.length) {
  const uniq = [...new Set(levelWarns)];
  console.log(`\nB59 level-metadata notes (${uniq.length} unique, ${levelWarns.length} hits):`);
  for (const w of uniq.slice(0, 20)) console.log(`    ~ ${w}`);
  if (uniq.length > 20) console.log(`    … ${uniq.length - 20} more`);
}
const skipped = new Set(report.flatMap(r => r.log.skipped));
if (skipped.size) console.log(`\nleft to Foundry at runtime:\n  ` + [...skipped].join("\n  "));
