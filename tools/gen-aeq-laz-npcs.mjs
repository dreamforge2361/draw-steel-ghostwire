#!/usr/bin/env node
/**
 * One-shot authoring helper: write AEQ / LAZ conglomerate NPC Actors
 * from existing Ghostwire bestiary spines. Run from repo root.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { keepLoot } from "./lib/keep-loot.mjs";

const MODULE = "draw-steel-ghostwire";
const ART = {
  aeq: `modules/${MODULE}/assets/tokens/bestiary/aeq/aequitas-mandate-officer.webp`,
  laz: `modules/${MODULE}/assets/tokens/bestiary/laz/lazarus-combat-medic.webp`,
};

const read = p => JSON.parse(readFileSync(p, "utf8"));
const write = (p, doc) => {
  mkdirSync(dirname(p), { recursive: true });
  // 0.3.127 (E): a regen owns identity, tools/bestiary-loot.mjs owns the pockets. keepLoot() is
  // how the second survives the first — see tools/lib/keep-loot.mjs.
  writeFileSync(p, `${JSON.stringify(keepLoot(p, doc), null, 2)}\n`);
};

const officer = read("src/packs/bestiary/corp-security/corp-security-officer.json");
const sub = read("src/packs/bestiary/corp-security/ironclad-subcommander.json");
const doc = read("src/packs/bestiary/reach-streets/street-doc.json");
const commander = read("src/packs/bestiary/rivals/rival-commander-echelon1.json");

function clone(v) {
  return structuredClone(v);
}

function retoken(actor, { id, nameKey, img, folder, sort, faction, corp, slug, decision, dsSourceId, dsSourceName, handbookName }) {
  actor._id = id;
  actor._key = `!actors!${id}`;
  actor.folder = folder;
  actor.sort = sort;
  actor.name = nameKey;
  actor.img = img;
  actor.system.biography.value = nameKey.replace(/\.Name$/, ".Description");
  actor.system.biography.director = nameKey.replace(/\.Name$/, ".Director");
  actor.system.source = {
    book: "Ghostwire Core Rulebook",
    page: "25-opposition",
    license: "Draw Steel Creator License",
  };
  if (actor.prototypeToken) {
    actor.prototypeToken.name = nameKey;
    actor.prototypeToken.texture.src = img;
    actor.prototypeToken.sight.enabled = true;
    actor.prototypeToken.sight.range ??= 0;
    actor.prototypeToken.sight.angle ??= 360;
  }
  actor.flags = {
    [MODULE]: {
      faction,
      bestiary: {
        dsSourceId,
        dsSourceName,
        decision,
        region: "corp",
        faction,
        corp,
        slug,
        handbookName,
        echelon: 1,
      },
    },
  };
  actor.ownership = { default: 0 };
  return actor;
}

function rekeyItem(item, actorId, itemId) {
  const next = clone(item);
  next._id = itemId;
  next._key = `!actors.items!${actorId}.${itemId}`;
  next.folder = null;
  next.ownership = { default: 0 };
  next.flags ??= {};
  if (next.system?.source) {
    next.system.source = {
      book: "Ghostwire Core Rulebook",
      page: "25-opposition",
      license: "Draw Steel Creator License",
    };
  }
  return next;
}

function wireKit(actorId, itemId) {
  return {
    name: "GHOSTWIRE.Matrix.Items.WireKit.Name",
    type: "feature",
    img: "icons/commodities/tech/cable-end.webp",
    system: {
      description: {
        value: "GHOSTWIRE.Matrix.Items.WireKit.Description",
        director: "",
      },
      source: {
        book: "Ghostwire Core Rulebook",
        page: "21-the-wire",
        license: "Draw Steel Creator License",
      },
      _dsid: "wire-kit-matrix-verbs",
      advancements: {},
      prerequisites: { value: "", dsid: [], level: null },
    },
    effects: [],
    folder: null,
    sort: 9000,
    ownership: { default: 0 },
    flags: {
      [MODULE]: {
        kind: "wire-kit",
        dsid: "wire-kit-matrix-verbs",
        wired: { connectInterface: true },
      },
    },
    _id: itemId,
    _key: `!actors.items!${actorId}.${itemId}`,
  };
}

function feature({ actorId, itemId, name, img, dsid, html, sort = 0 }) {
  return {
    name,
    type: "feature",
    _id: itemId,
    img,
    system: {
      description: { value: html, director: "" },
      source: {
        book: "Ghostwire Core Rulebook",
        page: "25-opposition",
        license: "Draw Steel Creator License",
      },
      _dsid: dsid,
      advancements: {},
      prerequisites: { value: "", dsid: [], level: null },
    },
    effects: [],
    folder: null,
    sort,
    ownership: { default: 0 },
    flags: {},
    _key: `!actors.items!${actorId}.${itemId}`,
  };
}

function stabilizeAbility(actorId, itemId, who) {
  return {
    name: "Stabilize",
    type: "ability",
    _id: itemId,
    img: "icons/magic/life/heart-cross-strong-flame-green.webp",
    system: {
      type: "maneuver",
      source: {
        book: "Ghostwire Core Rulebook",
        page: "25-opposition",
        license: "Draw Steel Creator License",
      },
      _dsid: "stabilize",
      story: "",
      keywords: ["melee"],
      category: "",
      resource: null,
      trigger: "",
      distance: { type: "melee", primary: "1", secondary: "1", tertiary: "1" },
      damageDisplay: "melee",
      target: { type: "creature", value: 1, custom: "One dying or 0-Stamina ally" },
      power: { roll: { formula: "@chr", characteristics: [], reactive: false }, effects: {} },
      effects: {
        before0000000000: {
          _id: "before0000000000",
          type: "base",
          description: `<p>The ${who} works the trauma bag. The target is stabilized and may spend a Recovery (or regain [[/heal @monster.freeStrike]] if they have no Recoveries).</p>`,
          before: true,
          name: "",
          img: null,
          sort: 0,
        },
      },
      prerequisites: { value: "", dsid: [], level: null },
    },
    effects: [],
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _key: `!actors.items!${actorId}.${itemId}`,
  };
}

function humanMalice(actorId) {
  const exploit = officer.items.find(i => i.system?._dsid === "exploit-opening");
  const staying = officer.items.find(i => i.system?._dsid === "staying-power");
  return [
    rekeyItem(exploit, actorId, "LYYyN9iD2PjepIFo"),
    rekeyItem(staying, actorId, "vxocmPyA9uKwrgEq"),
  ];
}

function hudFeature(actorId, itemId, { who, medical = false, sergeant = false }) {
  const radio = sergeant
    ? "squad-net radio with a command channel"
    : "encrypted patrol radio";
  const extra = medical
    ? " The medical HUD paints vitals, trauma tags, and nearby ally Stamina on the visor."
    : " The helmet suite paints IDs, cuff-status, and nearby squad pips on the visor.";
  return feature({
    actorId,
    itemId,
    name: medical ? "Medical HUD Suite" : "Mandate HUD Suite",
    img: medical
      ? "icons/commodities/tech/watch-luminous.webp"
      : "icons/commodities/tech/electronics-sensor-eye.webp",
    dsid: medical ? "medical-hud-suite" : "mandate-hud-suite",
    html: `<p>Helmet / wrist chrome: targeting HUD, ${radio}, and a Wire jack.${extra} Counts as the sensory/comms chrome this ${who} is issued — not a second Connect interface (that is the Wire Kit).</p>`,
  });
}

function cuffsFeature(actorId, itemId, who) {
  return feature({
    actorId,
    itemId,
    name: "Zip-Cuffs",
    img: "icons/sundries/survival/cuffs.webp",
    dsid: "zip-cuffs",
    html: `<p>The ${who} carries polymer restraints. After they reduce a creature to 0 Stamina or grab a willing/helpless target, they can cuff that creature (restrained until freed or cut). Fiction only — no extra damage.</p>`,
  });
}

// --- AEQ Trooper -----------------------------------------------------------
const TROOPER = "GwAeqTrooper0001";
const trooper = retoken(clone(officer), {
  id: TROOPER,
  nameKey: "GHOSTWIRE.Bestiary.Actors.MandateTrooper.Name",
  img: ART.aeq,
  folder: "gwBestiaryAeq000",
  sort: 10000,
  faction: "aeq",
  corp: "Aequitas Mandate",
  slug: "aeq-trooper",
  decision: "Adapt",
  dsSourceId: officer.flags[MODULE].bestiary.dsSourceId,
  dsSourceName: "Human Guard → Corp Security Officer",
  handbookName: "Mandate Trooper",
});
const tStrike = rekeyItem(
  officer.items.find(i => i.system?._dsid === "halberd"),
  TROOPER,
  "GwAeqTrpStrike01",
);
tStrike.name = "Stunstick & Sidearm";
tStrike.system.story = "Issued LE sidearm and a charged baton — book them if you can, drop them if you can't.";
trooper.items = [
  tStrike,
  hudFeature(TROOPER, "GwAeqTrpHud00001", { who: "trooper" }),
  cuffsFeature(TROOPER, "GwAeqTrpCuffs001", "trooper"),
  wireKit(TROOPER, "GwAeqTrpWire0001"),
  ...humanMalice(TROOPER),
];
if (trooper.effects?.[0]) {
  const fx = trooper.effects[0];
  fx.origin = `Actor.${TROOPER}`;
  fx._id = "GwAeqTrpCaptn001";
  fx._key = `!actors.effects!${TROOPER}.GwAeqTrpCaptn001`;
  trooper.system.monster.withCaptainEffect = "GwAeqTrpCaptn001";
}

// --- AEQ Sergeant ----------------------------------------------------------
const SGT = "GwAeqSergeant001";
const sergeant = retoken(clone(sub), {
  id: SGT,
  nameKey: "GHOSTWIRE.Bestiary.Actors.MandateSergeant.Name",
  img: ART.aeq,
  folder: "gwBestiaryAeq000",
  sort: 20000,
  faction: "aeq",
  corp: "Aequitas Mandate",
  slug: "aeq-sergeant",
  decision: "Adapt",
  dsSourceId: sub.flags[MODULE].bestiary.dsSourceId,
  dsSourceName: "War Dog Subcommander → Ironclad Subcommander",
  handbookName: "Mandate Sergeant",
});
sergeant.system.monster.keywords = ["humanoid", "human"];
delete sergeant.system.monster.withCaptainEffect;
const hold = rekeyItem(
  sub.items.find(i => i.system?._dsid === "the-iron-saint-does-not-recognize-retreat"),
  SGT,
  "GwAeqSgtHold0001",
);
hold.name = "Hold the Line";
hold.img = "icons/skills/social/intimidation-impressing.webp";
hold.system._dsid = "hold-the-line";
hold.system.description.value = "<p>Each ally within 5 squares of the sergeant gains a +3 bonus to stability.</p>";
const sStrike = rekeyItem(
  sub.items.find(i => i.system?._dsid === "command-saber"),
  SGT,
  "GwAeqSgtStrike01",
);
sStrike.name = "Duty Sidearm";
sStrike.system.story = "Heavier issued pistol than the trooper's — tags the target on the squad net.";
sStrike.system.effects.after00000000000.description =
  "<p>The sergeant tags the target on the squad net. One ally within 5 squares of the sergeant can make a free strike against the target.</p>";
sergeant.items = [
  hold,
  sStrike,
  hudFeature(SGT, "GwAeqSgtHud00001", { who: "sergeant", sergeant: true }),
  cuffsFeature(SGT, "GwAeqSgtCuffs001", "sergeant"),
  wireKit(SGT, "GwAeqSgtWire0001"),
  ...humanMalice(SGT),
];
sergeant.effects = [];

// --- LAZ Medic -------------------------------------------------------------
const MEDIC = "GwLazMedic000001";
const medic = retoken(clone(doc), {
  id: MEDIC,
  nameKey: "GHOSTWIRE.Bestiary.Actors.ExtractMedic.Name",
  img: ART.laz,
  folder: "gwBestiaryLaz000",
  sort: 10000,
  faction: "laz",
  corp: "Lazarus Extract",
  slug: "laz-medic",
  decision: "Adapt",
  dsSourceId: doc.flags[MODULE].bestiary.dsSourceId,
  dsSourceName: "Orc Godcaller → Street Doc",
  handbookName: "Extract Medic",
});
const implant = rekeyItem(
  doc.items.find(i => i.system?._dsid === "relentless"),
  MEDIC,
  "GwLazMedImplnt01",
);
implant.name = "Trauma Damper";
implant.system._dsid = "trauma-damper";
implant.system.description.value =
  "<p>If the medic is reduced to 0 Stamina, an implanted trauma damper fires and they can make a [[/damage @monster.freeStrike]]{Free Strike} before dying. If the target of the free strike is reduced to 0 Stamina, the medic is reduced to 1 Stamina instead.</p>";
const mStrike = rekeyItem(
  doc.items.find(i => i.system?._dsid === "power-chord"),
  MEDIC,
  "GwLazMedStrike01",
);
mStrike.name = "Stun Sidearm";
mStrike.system.story = "Light defensive pistol — not a gun truck. Issued to keep the bag-carrier alive.";
const dart = rekeyItem(
  doc.items.find(i => i.system?._dsid === "cadenza"),
  MEDIC,
  "GwLazMedDart0001",
);
dart.name = "Stimulant Dart";
dart.system.effects.spend00000000000.description = "<p>The medic targets a second ally.</p>";
dart.system.effects.before0000000000.description =
  "<p>The medic fires a stimulant dart into the target. The target moves up to their speed and can use a main action.</p>";
const patch = rekeyItem(
  doc.items.find(i => i.system?._dsid === "rallying-ostinato"),
  MEDIC,
  "GwLazMedPatch001",
);
patch.name = "Trauma Patch";
patch.system.effects.before0000000000.description =
  "<p>The medic slaps coagulant patches and painkillers on each target. Each target regains [[/heal 15]] and ignores difficult terrain until the end of the encounter.</p>";
medic.items = [
  implant,
  mStrike,
  dart,
  patch,
  stabilizeAbility(MEDIC, "GwLazMedStab0001", "medic"),
  hudFeature(MEDIC, "GwLazMedHud00001", { who: "medic", medical: true }),
  feature({
    actorId: MEDIC,
    itemId: "GwLazMedChrome01",
    name: "Field Trauma Weave",
    img: "icons/tools/medical/medkit-heavy.webp",
    dsid: "field-trauma-weave",
    html: "<p>Issued medical chrome: wound-seal weave and a toxin scrubber in the trauma bag’s injector rail. Patient-monitor feed rides the Medical HUD. Soft/bioware-leaning — the street cousin of the Lazarus Trauma Package.</p>",
  }),
  wireKit(MEDIC, "GwLazMedWire0001"),
  ...humanMalice(MEDIC),
];
medic.effects = [];

// --- LAZ Chief Medic -------------------------------------------------------
const CHIEF = "GwLazChiefMed001";
const chief = retoken(clone(doc), {
  id: CHIEF,
  nameKey: "GHOSTWIRE.Bestiary.Actors.ExtractChiefMedic.Name",
  img: ART.laz,
  folder: "gwBestiaryLaz000",
  sort: 20000,
  faction: "laz",
  corp: "Lazarus Extract",
  slug: "laz-chief-medic",
  decision: "Adapt",
  dsSourceId: commander.flags[MODULE].bestiary?.dsSourceId ?? "rival-commander",
  dsSourceName: "Rival Tactician (stam/org) + Street Doc (med kit)",
  handbookName: "Extract Chief Medic",
});
// Combat envelope from Rival Commander (elite one step up). Med kit stays Street Doc math.
chief.system.stamina = clone(commander.system.stamina);
chief.system.combat.stability = commander.system.combat.stability;
chief.system.monster.level = commander.system.monster.level;
chief.system.monster.role = "support";
chief.system.monster.organization = commander.system.monster.organization;
chief.system.monster.freeStrike = commander.system.monster.freeStrike;
chief.system.ev = commander.system.ev;
chief.system.characteristics.might.value = 2;
chief.system.characteristics.reason.value = 1;
const cImplant = rekeyItem(implant, CHIEF, "GwLazChfImplnt01");
cImplant.name = "Lazarus Trauma Package";
cImplant.system._dsid = "lazarus-trauma-package";
cImplant.system.description.value =
  "<p>If the chief medic is reduced to 0 Stamina, the Lazarus Trauma Package (secondary heart / trauma damper + toxin scrubber + wound-seal weave) fires and they can make a [[/damage @monster.freeStrike]]{Free Strike} before dying. If the target of the free strike is reduced to 0 Stamina, the chief medic is reduced to 1 Stamina instead.</p>";
const cStrike = rekeyItem(mStrike, CHIEF, "GwLazChfStrike01");
const cDart = rekeyItem(dart, CHIEF, "GwLazChfDart0001");
cDart.system.effects.spend00000000000.description = "<p>The chief medic targets a second ally.</p>";
cDart.system.effects.before0000000000.description =
  "<p>The chief medic fires a stimulant dart into the target. The target moves up to their speed and can use a main action.</p>";
const cPatch = rekeyItem(patch, CHIEF, "GwLazChfPatch001");
cPatch.system.effects.before0000000000.description =
  "<p>The chief medic slaps the upgraded extract suite on each target. Each target regains [[/heal 15]] and ignores difficult terrain until the end of the encounter.</p>";
const lead = rekeyItem(hold, CHIEF, "GwLazChfLead0001");
lead.name = "Extract Lead";
lead.system._dsid = "extract-lead";
lead.system.description.value =
  "<p>Each ally within 5 squares of the chief medic gains a +3 bonus to stability.</p>";
chief.items = [
  cImplant,
  lead,
  cStrike,
  cDart,
  cPatch,
  stabilizeAbility(CHIEF, "GwLazChfStab0001", "chief medic"),
  hudFeature(CHIEF, "GwLazChfHud00001", { who: "chief medic", medical: true, sergeant: true }),
  feature({
    actorId: CHIEF,
    itemId: "GwLazChfSuite001",
    name: "Chief Med Suite",
    img: "icons/tools/medical/needle-leech.webp",
    dsid: "chief-med-suite",
    html: "<p>Field-lead bag: extra coagulants, a second stimulant rail, and a squad vitals overlay on the Medical HUD. Same Trauma Patch numbers as the Extract Medic (Street Doc math) — the upgrade is stamina, command, and kit fiction, not a new heal ladder.</p>",
  }),
  wireKit(CHIEF, "GwLazChfWire0001"),
  ...humanMalice(CHIEF),
];
chief.effects = [];

write("src/packs/bestiary/aequitas/_folder.json", {
  _id: "gwBestiaryAeq000",
  _key: "!folders!gwBestiaryAeq000",
  name: "GHOSTWIRE.Bestiary.Folders.AequitasMandate",
  type: "Actor",
  folder: "gwBestiaryCorp00",
  sort: 100000,
  flags: {},
  color: "#1e4d7b",
  description: "",
  sorting: "a",
});
write("src/packs/bestiary/lazarus/_folder.json", {
  _id: "gwBestiaryLaz000",
  _key: "!folders!gwBestiaryLaz000",
  name: "GHOSTWIRE.Bestiary.Folders.LazarusExtract",
  type: "Actor",
  folder: "gwBestiaryCorp00",
  sort: 110000,
  flags: {},
  color: "#8b1e2d",
  description: "",
  sorting: "a",
});
write("src/packs/bestiary/aequitas/aeq-trooper.json", trooper);
write("src/packs/bestiary/aequitas/aeq-sergeant.json", sergeant);
write("src/packs/bestiary/lazarus/laz-medic.json", medic);
write("src/packs/bestiary/lazarus/laz-chief-medic.json", chief);

for (const [label, actor] of [
  ["trooper", trooper],
  ["sergeant", sergeant],
  ["medic", medic],
  ["chief", chief],
]) {
  const ids = [actor._id, ...actor.items.map(i => i._id), ...(actor.effects ?? []).map(e => e._id)];
  const bad = ids.filter(id => !/^[A-Za-z0-9]{16}$/.test(id));
  if (bad.length) throw new Error(`${label} bad ids: ${bad.join(", ")}`);
  console.log(`${label}: ${actor._id} items=${actor.items.length} stam=${actor.system.stamina.max} org=${actor.system.monster.organization}`);
}
