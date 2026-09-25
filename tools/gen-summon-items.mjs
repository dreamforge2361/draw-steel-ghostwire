#!/usr/bin/env node
/**
 * 0.3.134 (G8) — fill the data gaps the eight summon rules exposed.
 *
 * The lock (docs/raw/22-the-veil.md §"How to command summons") says a Rank 2 elemental's signature
 * strike does 6/9/12 + Logic, a Rank 3 does 9/12/15 + Logic, and a Greater does 11/15/20 + Logic.
 * All three pack rows shipped with **no items at all** — you could summon a Rank 3 elemental and it
 * had nothing to do on its turn. The Guardian spirit had Warding Aegis and no strike. And nothing
 * anywhere carried the Command roll every one of them needs a card for.
 *
 * This tool writes those items into the existing Actor rows **in place**: it never touches the
 * Actor's `_id`, its flags, its Stamina or any item it does not own, and every id it mints is a hash
 * of the row's dsid so re-running produces byte-identical output. (`tools/gen-hacker-agents.mjs`
 * reassigns ids on every run; this one deliberately does not.)
 *
 * Damage **types** are left empty on purpose. A Rank 2 elemental is not a fire elemental until it is
 * summoned as one — `typeSummonStrikes` in scripts/veil-summons.mjs stamps the chosen element onto
 * every untyped tier at summon time (0.3.134 G7).
 *
 * Run: node tools/gen-summon-items.mjs   then   node tools/build-packs.mjs summons   (Foundry closed)
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const MODULE_ID = "draw-steel-ghostwire";
const DIR = "src/packs/summons";
const B62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
/** Deterministic 16-char id from a dsid, so a regenerate is a no-op. */
const itemId = seed => [...createHash("sha256").update(`gw-summon-item:${seed}`).digest()].slice(0, 16).map(b => B62[b % 62]).join("");

const LANG = "lang/en.json";
const lang = JSON.parse(readFileSync(LANG, "utf8"));

/** `system.power.effects` for one damage ladder. */
function damageEffect(seed, [low, mid, high]) {
  const id = itemId(`${seed}#damage`);
  return {
    [id]: {
      _id: id, type: "damage", name: "", img: null, sort: 0,
      damage: {
        tier1: { value: `${low} + @chr`, types: [], potency: { value: "@potency.weak", characteristic: "none" }, ignoredImmunities: [] },
        tier2: { value: `${mid} + @chr`, types: [], potency: { value: "@potency.average", characteristic: "" }, ignoredImmunities: [] },
        tier3: { value: `${high} + @chr`, types: [], potency: { value: "@potency.strong", characteristic: "" }, ignoredImmunities: [] },
      },
    },
  };
}

function ability({ actorId, dsid, langKey, img, page, kind = "main", category = "signature", keywords, distance, target, characteristic, ladder = null, effects = {} }) {
  const id = itemId(dsid);
  return {
    _id: id,
    _key: `!actors.items!${actorId}.${id}`,
    name: `${langKey}.Name`,
    type: "ability",
    img,
    system: {
      type: kind,
      category,
      keywords,
      distance,
      target,
      damageDisplay: distance.type === "melee" ? "melee" : "ranged",
      power: {
        roll: ladder
          ? { formula: "@chr", characteristics: [characteristic], reactive: false }
          : { formula: "", characteristics: [], reactive: false },
        effects: ladder ? damageEffect(dsid, ladder) : {},
      },
      source: { book: "Ghostwire Core Rulebook", page, license: "Draw Steel Creator License" },
      _dsid: dsid,
      story: "",
      resource: null,
      trigger: "",
      effects,
      prerequisites: { value: "", dsid: [], level: null },
    },
    effects: [],
    folder: null,
    sort: 0,
    flags: {},
    ownership: { default: 0 },
  };
}

const baseEffect = (id, description) => ({
  [id]: { _id: id, type: "base", description, name: "", img: null, sort: 0, before: false },
});

/* ---------------------------------------------------------------- the rows */

const ELEMENTAL_LADDER = { 2: [6, 9, 12], 3: [9, 12, 15], greater: [11, 15, 20] };
const ELEM_IMG = "icons/magic/fire/elemental-creature-horse.webp";

/**
 * The Greater elemental's four forms. Each gets one maneuver and one area ability, as the lock says.
 * Roaring Storm's area is the one with a printed rider: lightning damage **and dazed**.
 */
const GREATER_FORMS = [
  { key: "AncientFlame", slug: "ancient-flame", label: "Ancient Flame" },
  { key: "RoaringStorm", slug: "roaring-storm", label: "Roaring Storm" },
  { key: "LivingMountain", slug: "living-mountain", label: "Living Mountain" },
  { key: "DevouringVoid", slug: "devouring-void", label: "Devouring Void" },
];

const FORM_TEXT = {
  "ancient-flame": {
    label: "Ancient Flame",
    maneuver: { name: "Stoke the Furnace", text: "<p><strong>Maneuver.</strong> The Ancient Flame burns hotter. Until the end of its next turn, its signature strike deals <strong>+3 fire damage</strong> and it sheds bright light 5 squares.</p>" },
    area: { name: "Conflagration", text: "<p><strong>Main action · 3 burst.</strong> Fire fills the burst. Each enemy in it takes the elemental's tier damage as <strong>fire</strong>; each ally in it may shift 1 square out of the flames for free.</p>" },
  },
  "roaring-storm": {
    label: "Roaring Storm",
    maneuver: { name: "Gather the Charge", text: "<p><strong>Maneuver.</strong> The storm draws in. Until the end of its next turn, the Roaring Storm's signature strike is <strong>lightning</strong> damage and it gains an edge on strikes against a target already <strong>dazed</strong>.</p>" },
    area: { name: "Thunderhead", text: "<p><strong>Main action · 3 burst.</strong> Each enemy in the burst takes the elemental's tier damage as <strong>lightning</strong> and is <strong>dazed</strong> (save ends).</p>" },
  },
  "living-mountain": {
    label: "Living Mountain",
    maneuver: { name: "Set the Foundation", text: "<p><strong>Maneuver.</strong> The Living Mountain plants itself. Until it moves, it cannot be force-moved and adjacent allies gain <strong>+1 stability</strong>.</p>" },
    area: { name: "Fault Line", text: "<p><strong>Main action · 5 × 1 line.</strong> The ground splits. Each creature in the line takes the elemental's tier damage and is knocked <strong>prone</strong> on a tier 2 or tier 3 result.</p>" },
  },
  "devouring-void": {
    label: "Devouring Void",
    maneuver: { name: "Swallow the Light", text: "<p><strong>Maneuver.</strong> The Void drinks. Until the end of its next turn, the Devouring Void has <strong>concealment</strong> and any creature that starts its turn adjacent to it takes 2 <strong>corruption</strong> damage.</p>" },
    area: { name: "Collapse", text: "<p><strong>Main action · 3 burst.</strong> Each enemy in the burst takes the elemental's tier damage as <strong>corruption</strong> and is pulled 2 squares toward the elemental.</p>" },
  },
};

/**
 * The Guardian spirit's light strike. Numbers chosen, and recorded, rather than invented silently:
 * the Warrior spirit's Pact Blade is the Templar's *signature* strike, and a Shepherd's Guardian is
 * explicitly the defensive ministry — so its strike sits one full band below the Warrior's on the
 * same ladder the extension summons use (2/4/6 + Persona against the Warrior's 4/7/10).
 */
const GUARDIAN_LADDER = [2, 4, 6];

const COMMAND_TEXT = "GHOSTWIRE.Summons.Command.Effect";

function commandAbility(actorId, dsid, characteristic, img, page) {
  return ability({
    actorId,
    dsid,
    langKey: "GHOSTWIRE.Summons.Command",
    img,
    page,
    kind: "maneuver",
    category: "",
    keywords: ["magic"],
    distance: { type: "ranged", primary: "10", secondary: "1", tertiary: "1" },
    target: { type: "self", value: null, custom: "" },
    characteristic,
    ladder: null,
    effects: baseEffect("summonCommand000", COMMAND_TEXT),
  });
}

/* ---------------------------------------------------------------- write */

const written = [];

function patch(path, mutate) {
  const doc = JSON.parse(readFileSync(path, "utf8"));
  mutate(doc);
  writeFileSync(path, `${JSON.stringify(doc, null, 2)}\n`);
}

/** Replace items this tool owns (by dsid), keep everything else exactly as it was. */
function setItems(doc, items) {
  const owned = new Set(items.map(i => i.system._dsid));
  doc.items = [...(doc.items ?? []).filter(i => !owned.has(i.system?._dsid)), ...items];
}

// --- Rank 2 and Rank 3 bound elementals: a signature strike, stability = rank, a Command card.
for (const rank of [2, 3]) {
  const path = `${DIR}/elementals/elemental-rank-${rank}.json`;
  patch(path, doc => {
    const actorId = doc._id;
    const key = `GHOSTWIRE.Summons.Elementals.ElementalRank${rank}`;
    const strike = ability({
      actorId,
      dsid: `elemental-rank-${rank}-elemental-lash`,
      langKey: `${key}.Strike`,
      img: ELEM_IMG,
      page: "06-elementalist",
      keywords: ["magic", "melee", "strike"],
      distance: { type: "melee", primary: "1", secondary: "1", tertiary: "1" },
      target: { type: "creatureObject", value: 1, custom: "" },
      characteristic: "reason",
      ladder: ELEMENTAL_LADDER[rank],
      effects: baseEffect("after00000000000", `${key}.Strike.Effect`),
    });
    setItems(doc, [strike, commandAbility(actorId, `elemental-rank-${rank}-command`, "reason", ELEM_IMG, "06-elementalist")]);
    // Rule 7: stability equals rank.
    doc.system.combat.stability = rank;
    written.push(`${path}: strike ${ELEMENTAL_LADDER[rank].join("/")} + Logic, Command, stability ${rank}`);
  });
  const key = `GHOSTWIRE.Summons.Elementals.ElementalRank${rank}`;
  const [low, mid, high] = ELEMENTAL_LADDER[rank];
  const node = key.split(".").slice(1).reduce((o, part) => (o[part] ??= {}), lang.GHOSTWIRE);
  node.Strike = {
    Name: "Elemental Lash",
    Effect: `<p><strong>Signature strike.</strong> ${low} / ${mid} / ${high} damage + the summoner's Logic, in the element this elemental was called with. Commanding it to make this strike costs the summoner a <strong>maneuver</strong>; on the turn it is summoned the strike is included.</p>`,
  };
}

// --- The Greater elemental: a signature strike, four forms, stability 4, a Command card.
patch(`${DIR}/elementals/elemental-greater.json`, doc => {
  const actorId = doc._id;
  const key = "GHOSTWIRE.Summons.Elementals.ElementalGreater";
  const items = [
    ability({
      actorId,
      dsid: "elemental-greater-elemental-lash",
      langKey: `${key}.Strike`,
      img: ELEM_IMG,
      page: "06-elementalist",
      keywords: ["magic", "melee", "strike"],
      distance: { type: "melee", primary: "1", secondary: "1", tertiary: "1" },
      target: { type: "creatureObject", value: 1, custom: "" },
      characteristic: "reason",
      ladder: ELEMENTAL_LADDER.greater,
      effects: baseEffect("after00000000000", `${key}.Strike.Effect`),
    }),
    commandAbility(actorId, "elemental-greater-command", "reason", ELEM_IMG, "06-elementalist"),
  ];
  for (const form of GREATER_FORMS) {
    items.push(ability({
      actorId,
      dsid: `elemental-greater-${form.slug}-maneuver`,
      langKey: `${key}.Forms.${form.key}.Maneuver`,
      img: ELEM_IMG,
      page: "06-elementalist",
      kind: "maneuver",
      category: "",
      keywords: ["magic"],
      distance: { type: "self", primary: "", secondary: "1", tertiary: "1" },
      target: { type: "self", value: null, custom: "" },
      characteristic: "reason",
      ladder: null,
      effects: baseEffect("greaterManeuver0", `${key}.Forms.${form.key}.Maneuver.Effect`),
    }));
    items.push(ability({
      actorId,
      dsid: `elemental-greater-${form.slug}-area`,
      langKey: `${key}.Forms.${form.key}.Area`,
      img: ELEM_IMG,
      page: "06-elementalist",
      kind: "main",
      category: "",
      keywords: ["area", "magic"],
      distance: { type: "burst", primary: "3", secondary: "1", tertiary: "1" },
      target: { type: "creatureObject", value: null, custom: "" },
      characteristic: "reason",
      ladder: null,
      effects: baseEffect("greaterArea00000", `${key}.Forms.${form.key}.Area.Effect`),
    }));
  }
  setItems(doc, items);
  doc.system.combat.stability = 4;
  written.push(`${DIR}/elementals/elemental-greater.json: strike ${ELEMENTAL_LADDER.greater.join("/")} + Logic, ${GREATER_FORMS.length} forms (maneuver + area each), Command, stability 4`);
});

{
  const [low, mid, high] = ELEMENTAL_LADDER.greater;
  const node = lang.GHOSTWIRE.Summons.Elementals.ElementalGreater;
  node.Strike = {
    Name: "Elemental Lash",
    Effect: `<p><strong>Signature strike.</strong> ${low} / ${mid} / ${high} damage + the summoner's Logic, in the element this elemental was called with. Commanding it to make this strike costs the summoner a <strong>maneuver</strong>; on the turn it is summoned the strike is included.</p>`,
  };
  node.Forms = {};
  for (const form of GREATER_FORMS) {
    const text = FORM_TEXT[form.slug];
    node.Forms[form.key] = {
      Maneuver: { Name: `${text.label}: ${text.maneuver.name}`, Effect: text.maneuver.text },
      Area: { Name: `${text.label}: ${text.area.name}`, Effect: text.area.text },
    };
  }
}

// --- Rank 1 elemental: stability 1 and a Command card, so every rank reads the same way.
patch(`${DIR}/elementals/elemental-rank-1.json`, doc => {
  const actorId = doc._id;
  setItems(doc, [commandAbility(actorId, "elemental-rank-1-command", "reason", ELEM_IMG, "06-elementalist")]);
  doc.system.combat.stability = 1;
  written.push(`${DIR}/elementals/elemental-rank-1.json: Command, stability 1`);
});

// --- The three pact spirits: a Command card; the Guardian also gets the light strike it never had.
const SPIRIT_IMG = {
  "spirit-guardian": "icons/magic/holy/barrier-shield-winged-blue.webp",
  "spirit-warrior": "icons/magic/holy/angel-winged-humanoid-blue.webp",
  "spirit-hunter": "icons/magic/holy/projectile-flame-blue.webp",
};
for (const [dsid, key] of [["spirit-guardian", "SpiritGuardian"], ["spirit-warrior", "SpiritWarrior"], ["spirit-hunter", "SpiritHunter"]]) {
  const path = `${DIR}/spirits/${dsid}.json`;
  patch(path, doc => {
    const actorId = doc._id;
    const img = SPIRIT_IMG[dsid] ?? doc.img;
    const items = [commandAbility(actorId, `${dsid}-command`, "intuition", img, "07-street-priest")];
    if (dsid === "spirit-guardian") {
      items.push(ability({
        actorId,
        dsid: "spirit-guardian-warding-strike",
        langKey: `GHOSTWIRE.Summons.Spirits.${key}.Strike`,
        img,
        page: "07-street-priest",
        keywords: ["magic", "melee", "strike"],
        distance: { type: "melee", primary: "1", secondary: "1", tertiary: "1" },
        target: { type: "creatureObject", value: 1, custom: "" },
        characteristic: "presence",
        ladder: GUARDIAN_LADDER,
        effects: baseEffect("after00000000000", `GHOSTWIRE.Summons.Spirits.${key}.Strike.Effect`),
      }));
    }
    setItems(doc, items);
    written.push(`${path}: Command${dsid === "spirit-guardian" ? `, light strike ${GUARDIAN_LADDER.join("/")} + Persona` : ""}`);
  });
}

{
  const [low, mid, high] = GUARDIAN_LADDER;
  lang.GHOSTWIRE.Summons.Spirits.SpiritGuardian.Strike = {
    Name: "Warding Blow",
    Effect: `<p><strong>Light signature strike.</strong> ${low} / ${mid} / ${high} damage + the priest's Persona. The Guardian is the defensive ministry's spirit: it hits one band below the Warrior's Pact Blade, and its job is <strong>Warding Aegis</strong>, not the damage. Commanding this strike costs the priest a <strong>maneuver</strong>.</p>`,
  };
}

lang.GHOSTWIRE.Summons.Command = {
  Name: "Command",
  Effect: "<p><strong>Maneuver.</strong> Order this summon to act. Roll <strong>2d10 + Logic</strong> (Elementalist) or <strong>2d10 + Instinct</strong> (Street Priest).</p><ul><li><strong>Low result:</strong> it ignores the order this round.</li><li><strong>Middle result:</strong> it obeys.</li><li><strong>High result:</strong> it obeys, and gains an <strong>edge</strong> on the action you ordered.</li></ul><p>You do not need to roll to move it — it moves free on your turn. You do need the maneuver (and, for a signature strike, this roll) to make it act. On the turn you summon it, its first signature strike is included and costs no extra maneuver.</p>",
};

writeFileSync(LANG, `${JSON.stringify(lang, null, 2)}\n`);
console.log(`summon items: ${written.length} row(s) updated`);
for (const line of written) console.log(`  ${line}`);
