// Builds the eight B44 pregen Hero Actors (src/packs/pregens/) at Level 1 / Echelon 1 from the
// shipped Ghostwire packs. The dossier PDF's old "Tier 5" sheet math is NOT used — see BUILD-NOTES.md.
//
// B44b: the actors are now "robust filled" — every Level 1 advancement grant on their class,
// subclass, kit, ancestry, background and profession is resolved and embedded (so nothing waits on
// Foundry's advancement dialog), and concrete gear / chrome / languages come from
// docs/masters/pregens/loadouts.json (see LOADOUTS.md for why each pick).
//
// Run:  node tools/pregens-to-actors.mjs   then   node tools/build-packs.mjs   (Foundry closed)
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const MODULE_ID = "draw-steel-ghostwire";
const OUT = "src/packs/pregens";
const LOADOUTS = "docs/masters/pregens/loadouts.json";
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
    abilities: ["smite-rebuke", "lay-on-hands", "faith-is-our-armor"],
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
    abilities: ["a-word", "battle-cry", "command-presence"],
  },
  {
    key: "Wren", slug: "wren-sable-corvin", name: "Wren Sable-Corvin", handle: "the Kite",
    cls: "scout", subclass: "hunter", ancestry: "changer",
    traits: ["changer-forms-trait", "raven-lineage-trait", "beast-movement-trait"],
    kit: "ranged/longshot", background: "transit-hub", profession: "courier",
    skills: ["stealth", "perception", "survival", "acrobatics"],
    beastArt: "wren-sable-corvin-beast.webp",
    bio: "A Changer of the Raven lineage who works the rooftops and the sightlines above the Flats. She sees the run before the crew walks into it.",
    abilities: ["quarry", "steady-the-scope", "careful-observation"],
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
    kit: "tech/riggers-harness", background: "undercity-barrens", profession: "rig-tech",
    skills: ["rigging", "gunnery", "repair", "electronics"],
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
    abilities: ["deep-scan", "dual-boot", "backdoor-override"], extras: ["src/packs/matrix/decks/street-deck.json"],
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

const atLevel1 = adv => adv.requirements?.level == null || adv.requirements.level === 1;
const idFromUuid = uuid => uuid?.split(".").pop();

/**
 * Walk the Level 1 advancements of every item the hero holds and collect what they grant:
 * items (recursively), skills and languages. Choices (`chooseN`) are taken in pool order and
 * every one is reported so LOADOUTS.md can record it.
 */
function resolveGrants(seed, hero, log) {
  const items = new Map(seed.map(i => [i._id, i]));
  const skills = new Set(hero.skills);
  const languages = new Set();
  const queue = [...seed];

  while (queue.length) {
    const item = queue.shift();
    for (const adv of Object.values(item.system?.advancements ?? {})) {
      if (!atLevel1(adv)) continue;
      const label = `${String(item.name).split(".").pop()}/${adv.name || adv.type}`;

      if (adv.type === "itemGrant") {
        const pool = (adv.pool ?? []).map(p => idFromUuid(p.uuid));
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

const loadouts = existsSync(LOADOUTS) ? read(LOADOUTS) : {};
if (!existsSync(LOADOUTS)) console.log(`(no ${LOADOUTS} — building without gear, chrome or languages)`);

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
      if (!found) warn.push(`ability ${a} not found`);
      return found;
    }),
    ...(hero.extras ?? []).map(p => (existsSync(p) ? read(p) : (warn.push(`extra ${p} missing`), null))),
  ].filter(Boolean);

  // B44b: pull in everything Level 1 actually grants, steering every choice pool toward the
  // roster's own picks (this hero's kit, subclass, lineage, traits and signature abilities).
  hero.prefer = new Set([...seed.map(s => s.system?._dsid), ...(hero.prefers ?? [])].filter(Boolean));
  const granted = resolveGrants(seed, hero, log);

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

  const core = cls.system.characteristics?.core ?? [];
  const ordered = [...core, ...ALL_CHARS.filter(c => !core.includes(c))];
  const characteristics = Object.fromEntries(ordered.map((c, n) => [c, { value: ARRAY[n] ?? 0 }]));

  const kitStamina = Number(kit.system?.bonuses?.stamina ?? 0) || 0;
  const stamina = Number(cls.system.stamina?.starting ?? 20) + kitStamina;
  const recoveries = Number(cls.system.recoveries ?? 8);

  const img = existsSync(`assets/pregens/${hero.slug}.png`) ? `modules/${MODULE_ID}/assets/pregens/${hero.slug}.png` : "icons/svg/mystery-man.svg";
  if (img.endsWith("mystery-man.svg")) warn.push("no portrait — placeholder art");

  const nameKey = `GHOSTWIRE.Pregens.Actors.${hero.key}.Name`;
  actorsLang[hero.key] = {
    // A street name already in quotes (KRV-9 “Krow”) reads badly with a second quoted handle.
    Name: hero.name.includes("“") ? `${hero.name}, ${hero.handle}` : `${hero.name} — “${hero.handle}”`,
    Description: hero.bio,
  };

  const languages = [...new Set([...(loadout.languages ?? []), ...granted.languages])];
  const items = [...granted.items, ...kitItems].map(s => embed(actorId, s, warn)).filter(Boolean);
  const biSpent = (loadout.chrome ?? []).reduce((n, c) => n + Number(c.bi ?? 0), 0);
  if (biSpent > 20) warn.push(`chrome spends ${biSpent} Body Integrity — over the 20 cap`);

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
      hero: { primary: { value: 0 }, epic: { value: 0 }, surges: 0, xp: 0, victories: 0, renown: 1, wealth: 1 },
      skills: { value: granted.skills },
      statuses: { immunities: [] },
    },
    prototypeToken: {
      name: nameKey, displayName: 20, actorLink: true, width: 1, height: 1,
      texture: { src: img, scaleX: 1, scaleY: 1 },
      sight: { enabled: true }, disposition: 1,
    },
    items, effects: [],
    flags: {
      [MODULE_ID]: {
        pregen: hero.slug,
          biSpent,
          biRemaining: 20 - biSpent,
          // Sheet reads integrity.value/max (not biRemaining alone) — keep both in sync.
          integrity: { value: 20 - biSpent, max: 20 },
        // Changer form art: the sheet and default token use the human portrait; Beast form art
        // lives here so a form-change pass (or a Director) can swap the token texture to it.
        ...(hero.beastArt ? { changer: { humanArt: img, beastArt: `modules/${MODULE_ID}/assets/pregens/${hero.beastArt}` } } : {}),
      },
    },
  };
  writeFileSync(join(OUT, `${hero.slug}.json`), JSON.stringify(actor, null, 2) + "\n");
  // Ensure Draw Steel class level is 1 (DS stores level on the class item, not the actor).
  for (const it of items) {
    if (it.type === "class") it.system = { ...(it.system ?? {}), level: 1 };
  }

  report.push({ hero: hero.name, stamina, items: items.length, skills: granted.skills.length, languages: languages.length, biSpent, warn, log });
}

lang.GHOSTWIRE.COMPENDIUM.pregens = "Ghostwire Pregens";
lang.GHOSTWIRE.Pregens = { ...(lang.GHOSTWIRE.Pregens ?? {}), Actors: actorsLang };
writeFileSync("lang/en.json", JSON.stringify(lang, null, 2) + "\n");

for (const r of report) {
  console.log(`${r.hero}: Sta ${r.stamina} · ${r.items} items · ${r.skills} skills · ${r.languages} languages · BI spent ${r.biSpent}`);
  for (const c of r.log.choices) console.log(`    choice: ${c}`);
  for (const o of r.log.open) console.log(`    open:   ${o}`);
  if (r.warn.length) console.log(`    ! ${r.warn.join("; ")}`);
}
const skipped = new Set(report.flatMap(r => r.log.skipped));
if (skipped.size) console.log(`\nleft to Foundry at runtime:\n  ` + [...skipped].join("\n  "));
