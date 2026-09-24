#!/usr/bin/env node
/**
 * One-shot authoring helper: write the Mama's Club floor cast (16 Actors) into
 * src/packs/bestiary/mama-club/ from existing Ghostwire street spines.
 *
 * Mama Cassavir herself already exists in reach-streets and is NOT touched here.
 * Names are plain English (Director readability) rather than GHOSTWIRE.* lang keys.
 * Every club Actor ships a Wire Kit (0.3.85 humanoid Connect pass). Soft Trace
 * remains the info broker; the rest of the floor can Connect too.
 *
 * Ancestry (Goliar, Elvani, Corran, Rat-Changer, Revenant) lives in the biography
 * prose and the bestiary flags, never in system.monster.keywords: that list is a
 * system enum (humanoid / human / cyborg / undead / …) and a stray value renders wrong.
 *
 * Token art is Michael's club drop (_art-incoming/mama-club), staged into
 * assets/tokens/bestiary/mama-club/<slug>.{png,webp}: 1254² RGBA originals beside
 * 1024² WebPs, one plate per slug. Foundry points at the WebP.
 *
 * Run from repo root:  node tools/gen-mama-club-cast.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { keepLoot } from "./lib/keep-loot.mjs";
import { MELEE, NO_DAMAGE_MOD, RANGED, captainId, makeNpcKit } from "./lib/npc-kit.mjs";

const MODULE = "draw-steel-ghostwire";
const OUT = "src/packs/bestiary/mama-club";
const FOLDER_ID = "gwBestiaryMama00";
const PARENT_FOLDER = "gwBestiaryStreet";
const SOURCE = {
  book: "Ghostwire Core Rulebook",
  page: "25-opposition",
  license: "Draw Steel Creator License",
};
const art = file => `modules/${MODULE}/assets/tokens/bestiary/${file}`;
/** One circular plate per slug, from Michael's club drop. */
const clubPlate = slug => art(`mama-club/${slug}.webp`);

const read = p => JSON.parse(readFileSync(p, "utf8"));
const write = (p, doc) => {
  mkdirSync(dirname(p), { recursive: true });
  // 0.3.127 (E): a regen owns identity, tools/bestiary-loot.mjs owns the pockets. keepLoot() is
  // how the second survives the first — see tools/lib/keep-loot.mjs.
  writeFileSync(p, `${JSON.stringify(keepLoot(p, doc), null, 2)}\n`);
};
const clone = v => structuredClone(v);

const minionSpine = read("src/packs/bestiary/reach-streets/gang-raider.json");
const platoonSpine = read("src/packs/bestiary/reach-streets/street-punk.json");

/** Foundry ids are 16 chars. Derive stable, readable ones from the short name. */
const actorId = key => `GwMama${key}`.padEnd(16, "0").slice(0, 16);
const { feature, strike, wireKit, ensureWireKit, captainEffect } = makeNpcKit({ module: MODULE, source: SOURCE, minionSpine });

// ---------------------------------------------------------------- actor builder

/**
 * Build one club Actor. Organization decides which street spine lends its
 * prototypeToken chassis; minions additionally carry the "With Captain" rider.
 */
function clubActor(entry) {
  const id = actorId(entry.key);
  const spine = entry.organization === "minion" ? minionSpine : platoonSpine;
  const img = clubPlate(entry.slug);

  const prototypeToken = clone(spine.prototypeToken);
  prototypeToken.name = entry.name;
  prototypeToken.texture.src = img;
  prototypeToken.sight.enabled = true;   // Has Vision ON (0.3.67 rule)
  prototypeToken.sight.range ??= 0;
  prototypeToken.sight.angle ??= 360;
  prototypeToken.disposition = 0;        // the club floor is neutral, not hostile
  prototypeToken.width = 1;
  prototypeToken.height = 1;
  prototypeToken.flags = {};

  return {
    folder: FOLDER_ID,
    name: entry.name,
    type: "npc",
    _id: id,
    img,
    system: {
      stamina: { value: entry.stamina, max: entry.stamina, temporary: 0 },
      characteristics: {
        might: { value: entry.chr[0] },
        agility: { value: entry.chr[1] },
        reason: { value: entry.chr[2] },
        intuition: { value: entry.chr[3] },
        presence: { value: entry.chr[4] },
      },
      combat: {
        save: { threshold: 6, bonus: "" },
        size: { value: 1, letter: entry.sizeLetter ?? "M" },
        stability: entry.stability ?? 0,
        turns: 1,
      },
      biography: { value: entry.bio, director: entry.hook, languages: [] },
      movement: { value: entry.speed, types: ["walk"], hover: false, disengage: 1 },
      damage: {
        immunities: { ...NO_DAMAGE_MOD, ...(entry.immunities ?? {}) },
        weaknesses: { ...NO_DAMAGE_MOD, ...(entry.weaknesses ?? {}) },
      },
      source: SOURCE,
      negotiation: {
        interest: entry.negotiation[0],
        patience: entry.negotiation[1],
        motivations: [],
        pitfalls: [],
        impression: entry.negotiation[2],
      },
      monster: {
        freeStrike: entry.freeStrike,
        keywords: entry.keywords,
        level: entry.level,
        role: entry.role,
        organization: entry.organization,
        ...(entry.organization === "minion" ? { withCaptainEffect: captainId(id) } : {}),
      },
      ev: entry.ev,
      statuses: { immunities: [] },
    },
    prototypeToken,
    items: ensureWireKit(id, entry.items(id)),
    effects: entry.organization === "minion" ? [captainEffect(id)] : [],
    sort: entry.sort,
    ownership: { default: 0 },
    flags: {
      [MODULE]: {
        bestiary: {
          dsSourceId: spine._id,
          dsSourceName: entry.spineName,
          decision: "Adapt",
          region: "streets",
          venue: "mama-cassavir-club",
          slug: entry.slug,
          handbookName: entry.name,
          station: entry.station,
          people: entry.people,
          sex: entry.sex,
          wired: true,
        },
      },
    },
    _key: `!actors!${id}`,
  };
}

// ------------------------------------------------- generic-patron shared kit
// The three unnamed patrons are crowd texture, not characters: one flavour
// feature and one improvised strike each, on the plain L1 minion band. They are
// patrons, so they get none of Dren Holt's barback kit.

const patronFeature = id => feature({
  id, n: 1,
  name: "Face in the Crowd",
  img: "icons/environment/people/commoner.webp",
  dsid: "face-in-the-crowd",
  html: "<p>Just another body on the floor. The patron is easy to overlook and easy to talk to, and they remember faces far better than names — which makes them the witness a Director reaches for.</p>",
});

const coldRegular = id => feature({
  id, n: 1,
  name: "Cold Regular",
  img: "icons/magic/death/hand-undead-skeleton-fire-green.webp",
  dsid: "cold-regular",
  html: "<p>The drink is for the look of the thing. This patron does not breathe and does not warm his glass, and he has been coming here longer than the staff have noticed.</p>",
});

const improvisedSwing = id => strike({
  id, n: 2,
  name: "Improvised Swing",
  img: "icons/consumables/drinks/alcohol-bottle-glass-fancy-blue.webp",
  dsid: "improvised-swing",
  story: "Whatever is on the table, swung once.",
  keywords: ["melee", "strike"],
  distance: MELEE,
  characteristic: "might",
  tiers: [1, 2, 3],
  sort: 10,
});

// ---------------------------------------------------------------- the roster

const ROSTER = [
  // ------------------------------------------------------------------- STAFF
  {
    key: "Vexa",
    slug: "vexa-brick-mol",
    name: "Vexa “Brick” Mol",
    station: "Lead Bartender",
    people: "Goliar",
    sex: "F",
    spineName: "Human Knave → Street Punk",
    level: 2, organization: "platoon", role: "support",
    stamina: 50, ev: 8, freeStrike: 4, speed: 5, stability: 1,
    chr: [2, 0, 1, 2, 1],
    keywords: ["humanoid", "human"],
    negotiation: [6, 6, 2],
    sort: 100,
    bio: "<p>A Goliar woman built like a loading door, running the long bar at Mama Cassavir's club. Vexa keeps the tabs, the cuts, and the temperature of the room. She pours fast, listens faster, and has never once raised her voice — the stun baton clipped under the bar has done all her shouting for eleven years.</p><p>Nobody gets up the loft stairs without Vexa deciding they should.</p>",
    hook: "<p><strong>Plot hook:</strong> Vexa owns the bar math — she knows exactly which runners skipped a Soft Trace bill and how deep they are. A favour, a straight answer, or a very good tip gets the heroes a nod, and a nod from Vexa opens the VIP loft.</p><p><strong>Running her:</strong> Neutral. Not a fight unless the club is the fight. If it goes loud she covers the bar and the wait staff, not the door.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Owns the Bar Math",
        img: "icons/skills/social/diplomacy-handshake.webp",
        dsid: "owns-the-bar-math",
        html: "<p>Vexa carries every open tab, cut, and unpaid favour in her head. She always knows who in the room owes money and to whom, and she can name the figure without checking a screen.</p>",
      }),
      feature({
        id, n: 2,
        name: "Mama's Nod",
        img: "icons/environment/settlement/watchtower-cliff.webp",
        dsid: "mamas-nod",
        html: "<p>The loft stairs open on Vexa's say-so. While she vouches for a creature, Unit-7 and the rest of the floor treat them as a guest of the house. While she has not, they do not.</p>",
        sort: 10,
      }),
      strike({
        id, n: 3,
        name: "Stun Baton",
        img: "icons/weapons/clubs/club-baton-blue.webp",
        dsid: "stun-baton",
        story: "The short black stick that lives under the register.",
        keywords: ["melee", "strike", "weapon"],
        distance: MELEE,
        characteristic: "might",
        tiers: [4, 6, 9],
        applied: "dazed",
        appliedHtml: "<p>The target is dazed (EoT).</p>",
        sort: 20,
      }),
    ],
  },
  {
    key: "Halo",
    slug: "unit-7-halo",
    name: "Unit-7 “Halo”",
    station: "Stair Guard",
    people: "Cyborg",
    sex: "M",
    spineName: "Human Knave → Street Punk",
    level: 2, organization: "platoon", role: "defender",
    stamina: 55, ev: 8, freeStrike: 4, speed: 5, stability: 2,
    chr: [2, 0, 0, 1, -1],
    keywords: ["humanoid", "cyborg"],
    negotiation: [3, 7, 1],
    sort: 200,
    bio: "<p>A male-presenting cyborg in a heavy chrome faceplate, with a single gold ring burning around the iris — the halo that gave him his name. He stands at the top of the loft stairs and does not sit down. Ever.</p><p>Unit-7 speaks maybe forty words a night. Thirty of them are “not tonight.”</p>",
    hook: "<p><strong>Plot hook:</strong> There is an old Ironclad serial still under that chrome, and somebody is quietly buying up scrap code that matches it. Halo does not know he is being reassembled on paper by a stranger. Whoever tells him first owns a very large favour.</p><p><strong>Running him:</strong> Neutral until the stairs are threatened, then immovable. He defends the loft, not the floor — Vexa handles the floor.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Top of the Stairs",
        img: "icons/environment/settlement/gate-stone.webp",
        dsid: "top-of-the-stairs",
        html: "<p>While Unit-7 holds a doorway, stair, or other narrow space, enemies who start their turn adjacent to him cannot shift, and he can make a free strike against any creature that moves past him into the space he guards.</p>",
      }),
      feature({
        id, n: 2,
        name: "Halo Iris",
        img: "icons/commodities/tech/electronics-sensor-eye.webp",
        dsid: "supernatural-insight",
        html: "<p>The gold ring around Unit-7's eye is a filter array. He ignores concealment granted by a supernatural effect, and he never mistakes a Veil glamour for a paying customer.</p>",
        sort: 10,
      }),
      strike({
        id, n: 3,
        name: "Chrome Fists",
        img: "icons/skills/melee/unarmed-punch-fist.webp",
        dsid: "chrome-fists",
        story: "Plated knuckles — nothing on him to confiscate at the door.",
        keywords: ["melee", "strike"],
        distance: MELEE,
        characteristic: "might",
        tiers: [5, 8, 11],
        applied: "taunted",
        appliedHtml: "<p>The target is taunted (EoT).</p>",
        sort: 20,
      }),
    ],
  },
  {
    key: "Nyx",
    slug: "nyx-vale",
    name: "Nyx Vale",
    station: "Static Veil — Vocals",
    people: "Elvani",
    sex: "F",
    spineName: "Human Raider → Gang Raider",
    level: 1, organization: "minion", role: "support",
    stamina: 4, ev: 3, freeStrike: 1, speed: 6,
    chr: [0, 1, 0, 1, 3],
    keywords: ["humanoid", "human"],
    negotiation: [7, 4, 2],
    sort: 300,
    bio: "<p>Elvani frontwoman for <strong>Static Veil</strong>, the house band. Nyx sings like a broken transmitter finding a signal, and the Thursday crowd comes for her specifically. She is not a fighter and has no interest in becoming one.</p>",
    hook: "<p><strong>Plot hook (band-wide):</strong> Meridian Signal scouted Static Veil last month. A signing would put Mama's stage — and everything said in front of it — under corp eyes. Nyx wants the deal. Jax and Rook are not sure. Mama has not been told.</p><p><strong>Running her:</strong> Noncombatant. If the club goes loud, she gets off the stage and behind the bar.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Frontwoman",
        img: "icons/tools/instruments/lute-gold-brown.webp",
        dsid: "frontwoman",
        html: "<p>While Nyx is performing, the room's attention is on the stage. Creatures in the club have a bane on tests to notice anything happening away from it — which is exactly why deals get done during her set.</p>",
      }),
      strike({
        id, n: 2,
        name: "Mic Stand",
        img: "icons/tools/instruments/horn-simple-blue.webp",
        dsid: "mic-stand",
        story: "Swung once, badly, and only when cornered.",
        keywords: ["melee", "strike", "weapon"],
        distance: MELEE,
        characteristic: "agility",
        tiers: [1, 2, 3],
        sort: 10,
      }),
    ],
  },
  {
    key: "Jax",
    slug: "jax-coil",
    name: "Jax Coil",
    station: "Static Veil — Synth",
    people: "Pure Human",
    sex: "M",
    spineName: "Human Raider → Gang Raider",
    level: 1, organization: "minion", role: "support",
    stamina: 4, ev: 3, freeStrike: 1, speed: 5,
    chr: [0, 1, 2, 1, 1],
    keywords: ["humanoid", "human"],
    negotiation: [5, 5, 1],
    sort: 310,
    bio: "<p>Static Veil's synth and keys — a quiet pure human hunched over a rack of salvaged boards he rebuilds between sets. Jax does the band's books, the band's patches, and most of the band's worrying.</p>",
    hook: "<p><strong>Plot hook (band-wide):</strong> Jax read the Meridian Signal contract properly, which is more than Nyx did. He is looking for someone who can explain what “perpetual performance capture” means before anyone signs.</p><p><strong>Running him:</strong> Noncombatant. Will hide behind his own gear rather than abandon it.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Salvage Rig",
        img: "icons/commodities/tech/console-steel.webp",
        dsid: "salvage-rig",
        html: "<p>Jax's synth rack is ten dead machines in a trench coat. He can strip a working part out of almost any consumer electronics in a few minutes, and he reads a spec sheet better than most fixers read a face.</p>",
      }),
      strike({
        id, n: 2,
        name: "Patch Cable Whip",
        img: "icons/commodities/tech/cable-red.webp",
        dsid: "patch-cable-whip",
        story: "A metre of stiff cable, swung in a panic.",
        keywords: ["melee", "strike", "weapon"],
        distance: MELEE,
        characteristic: "agility",
        tiers: [1, 2, 3],
        sort: 10,
      }),
    ],
  },
  {
    key: "Rook",
    slug: "rook-anvil",
    name: "Rook Anvil",
    station: "Static Veil — Drum-Deck",
    people: "Corran",
    sex: "M",
    spineName: "Human Raider → Gang Raider",
    level: 1, organization: "minion", role: "harrier",
    stamina: 5, ev: 3, freeStrike: 1, speed: 6,
    chr: [2, 1, 0, 1, 0],
    keywords: ["humanoid", "human"],
    negotiation: [5, 6, 1],
    sort: 320,
    bio: "<p>Corran percussionist, built low and wide, playing a drum-deck he welded himself out of transit plating. Rook is the only member of Static Veil who can throw a punch, and the only one who does not want to.</p>",
    hook: "<p><strong>Plot hook (band-wide):</strong> Rook flatly does not trust the Meridian Signal scout, and he has been following her home. He has an address. He has not decided what to do with it — and he would rather hand it to somebody else.</p><p><strong>Running him:</strong> Noncombatant, but he will put himself between Nyx and trouble.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Drum-Deck",
        img: "icons/tools/instruments/drum-hand-tan.webp",
        dsid: "drum-deck",
        html: "<p>Welded transit plating and contact mics. Rook can make the club's floor shake on cue — useful as a signal, a distraction, or a way to drown out a conversation the wrong person is recording.</p>",
      }),
      strike({
        id, n: 2,
        name: "Kick-Drum Shove",
        img: "icons/skills/melee/shield-block-bash-yellow.webp",
        dsid: "kick-drum-shove",
        story: "Shoulder first, apologising the whole way.",
        keywords: ["melee", "strike"],
        distance: MELEE,
        characteristic: "might",
        tiers: [1, 2, 3],
        sort: 10,
      }),
    ],
  },
  {
    key: "Pip",
    slug: "pip-tray-riss",
    name: "Pip “Tray” Riss",
    station: "Floor Wait",
    people: "Rat-Changer",
    sex: "F",
    spineName: "Human Raider → Gang Raider",
    level: 1, organization: "minion", role: "harrier",
    stamina: 4, ev: 3, freeStrike: 1, speed: 7,
    sizeLetter: "S",
    chr: [0, 3, 1, 1, 0],
    keywords: ["humanoid", "human"],
    negotiation: [6, 4, 1],
    sort: 400,
    bio: "<p>A small, fast Rat-Changer who covers the whole floor without ever seeming to hurry. Pip has never dropped a tray and has never been caught with her hand in a pocket, because her hands do not go in pockets.</p>",
    hook: "<p><strong>Plot hook:</strong> Pip steals nothing valuable — she steals <em>rumours</em>, and she sells them to Kira “Soft Trace” Bell at the corner table for drink money. Anything the heroes say on the club floor is in Soft Trace's hands within the hour.</p><p><strong>Running her:</strong> Noncombatant. Very hard to corner.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Steals Rumours",
        img: "icons/skills/social/theft-pickpocket-bribery-brown.webp",
        dsid: "steals-rumours",
        html: "<p>Pip hears everything said within a few paces of a tray. She has a double edge on tests to overhear a conversation in a crowded room, and she remembers it verbatim for about a day — long enough to sell it.</p>",
      }),
      strike({
        id, n: 2,
        name: "Hot Tray",
        img: "icons/containers/kitchenware/tray-wood-brown.webp",
        dsid: "hot-tray",
        story: "Edge-on to the shin, then gone.",
        keywords: ["melee", "strike", "weapon"],
        distance: MELEE,
        characteristic: "agility",
        tiers: [1, 2, 3],
        sort: 10,
      }),
    ],
  },
  {
    key: "Dren",
    slug: "dren-holt",
    name: "Dren Holt",
    station: "Barback",
    people: "Pure Human",
    sex: "M",
    spineName: "Human Raider → Gang Raider",
    level: 1, organization: "minion", role: "brute",
    stamina: 5, ev: 3, freeStrike: 1, speed: 5,
    chr: [2, 1, 0, 0, 0],
    keywords: ["humanoid", "human"],
    negotiation: [7, 3, 1],
    sort: 410,
    bio: "<p>Barback. Pure human, mid-twenties, hauls kegs and ice and does not talk much. Vexa likes him because he shows up. Everyone else barely registers him, which is the problem.</p>",
    hook: "<p><strong>Plot hook:</strong> Dren owes Lazarus Extract for a botched White Door run on his sister, and the interest is eating him alive. He is desperate enough to take any cash job offered to him — including one that ends with the club's back door propped open.</p><p><strong>Running him:</strong> Noncombatant, but he is the easiest leak in the building to buy.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Keg Haul",
        img: "icons/commodities/materials/barrel-wood.webp",
        dsid: "keg-haul",
        html: "<p>Dren knows every service corridor, cold room, and delivery hatch behind the club, and he has a key to most of them. He can move a body's worth of weight through the back of the building without being seen.</p>",
      }),
      strike({
        id, n: 2,
        name: "Empty Bottle",
        img: "icons/consumables/drinks/alcohol-bottle-glass-fancy-blue.webp",
        dsid: "empty-bottle",
        story: "Grabbed off the rail, swung once.",
        keywords: ["melee", "strike", "weapon"],
        distance: MELEE,
        characteristic: "might",
        tiers: [1, 2, 3],
        sort: 10,
      }),
    ],
  },
  {
    key: "Sable",
    slug: "sable-quen",
    name: "Sable Quen",
    station: "VIP Wait",
    people: "Elvani",
    sex: "F",
    spineName: "Human Raider → Gang Raider",
    level: 1, organization: "minion", role: "ambusher",
    stamina: 5, ev: 3, freeStrike: 2, speed: 6,
    chr: [0, 2, 1, 1, 2],
    keywords: ["humanoid", "human"],
    negotiation: [5, 5, 2],
    sort: 420,
    bio: "<p>Dark-street Elvani, umbral-leaning, working the VIP loft where the tips are larger and the questions are fewer. Sable is the only wait staff allowed above the stairs, and she keeps a holdout blade in her apron that Vexa pretends not to know about.</p>",
    hook: "<p><strong>Plot hook:</strong> Sable carries envelopes between loft tables for a cut and never opens them. One envelope this week is Aequitas <strong>Writ</strong> paper — she has not looked, she does not know, and she is walking it across the floor tonight.</p><p><strong>Running her:</strong> Noncombatant, but she will not be robbed quietly.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Loft Envelopes",
        img: "icons/sundries/documents/envelope-sealed-red.webp",
        dsid: "loft-envelopes",
        html: "<p>Sable moves paper between VIP tables for a flat cut and a firm rule: she never reads it. She knows who handed her what and in which order, and she will trade that sequence — but not the contents.</p>",
      }),
      strike({
        id, n: 2,
        name: "Holdout Blade",
        img: "icons/weapons/daggers/dagger-straight-blood.webp",
        dsid: "holdout-blade",
        story: "Apron pocket, three inches, never drawn twice.",
        keywords: ["melee", "strike", "weapon"],
        distance: MELEE,
        characteristic: "agility",
        tiers: [2, 3, 4],
        sort: 10,
      }),
    ],
  },
  // ---------------------------------------------------------------- REGULARS
  {
    key: "Quill",
    slug: "madame-quill",
    name: "Madame Quill",
    station: "Regular — Corner Booth",
    people: "Revenant",
    sex: "F",
    spineName: "Human Knave → Street Punk",
    level: 2, organization: "platoon", role: "controller",
    stamina: 50, ev: 8, freeStrike: 4, speed: 5,
    chr: [1, 0, 2, 2, 2],
    keywords: ["humanoid", "undead"],
    immunities: { corruption: 2, poison: 2, psychic: 2 },
    negotiation: [6, 8, 2],
    sort: 500,
    bio: "<p>A Revenant woman in coffin-hotel chic — good tailoring over grave-grey skin, gloves that never come off, a drink she orders and never touches. Madame Quill has held the same corner booth for nine years and pays her tab in advance, in cash, monthly.</p><p>She is not a pushover. Do not mistake the manners for frailty.</p>",
    hook: "<p><strong>Plot hook:</strong> Quill is a standing contact for undead solidarity in the Reach. She knows an all-Revenant crew working the east blocks who need living allies for daylight work — and she will make the introduction for anyone who treats her like a person and not a condition.</p><p><strong>Running her:</strong> Neutral, patient, hard to rattle. She does not start fights; she finishes conversations.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Coffin-Hotel Chic",
        img: "icons/magic/death/hand-undead-skeleton-fire-green.webp",
        dsid: "coffin-hotel-chic",
        html: "<p>Quill does not breathe, tire, or bleed in any way that helps an interrogator. She ignores the need to eat, drink, or sleep, and effects that would read her vital signs simply return nothing.</p>",
      }),
      feature({
        id, n: 2,
        name: "Nine Years in That Booth",
        img: "icons/sundries/books/book-worn-brown.webp",
        dsid: "nine-years-in-that-booth",
        html: "<p>Quill has watched this floor longer than most of the staff have been alive. She can name every regular, every regular's usual, and roughly when each of them stopped coming in — and why.</p>",
        sort: 10,
      }),
      strike({
        id, n: 3,
        name: "Grave-Cold Grip",
        img: "icons/magic/death/hand-undead-skeleton-fire-blue.webp",
        dsid: "grave-cold-grip",
        story: "The gloves come off exactly once.",
        keywords: ["melee", "strike", "supernatural"],
        distance: MELEE,
        characteristic: "presence",
        tiers: [4, 6, 9],
        applied: "weakened",
        appliedHtml: "<p>The target is weakened (EoT).</p>",
        sort: 20,
      }),
    ],
  },
  {
    key: "Torque",
    slug: "torque-gasket-venn",
    name: "Torque “Gasket” Venn",
    station: "Regular — Scrap Table",
    people: "Cyborg",
    sex: "M",
    spineName: "Human Knave → Street Punk",
    level: 2, organization: "horde", role: "support",
    stamina: 30, ev: 6, freeStrike: 3, speed: 5,
    chr: [1, 1, 2, 1, 0],
    keywords: ["humanoid", "cyborg"],
    negotiation: [6, 5, 1],
    sort: 510,
    bio: "<p>Industrial chrome, not the pretty kind — exposed hydraulics, a forearm that is mostly clamp, and a permanent smell of coolant. Torque is a retired wrench who now drinks at the same two-top every night with a case of drone scrap open on the table.</p>",
    hook: "<p><strong>Plot hook:</strong> Torque sells drone parts and Soft Trace's leftovers at cost, and he hates Ironclad with his whole chest — they fitted him with a compliance collar that nearly took his spine out. Say the word “Ironclad” and he will talk for an hour, most of it useful.</p><p><strong>Running him:</strong> He still carries a Wire Kit (0.3.85) even though his rigger days ended with the collar — he will tell you the collar story at length, kit or not.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Scrap Table",
        img: "icons/commodities/tech/cog-steel.webp",
        dsid: "scrap-table",
        html: "<p>Torque's case of drone parts is open every night. He can identify the make, model, and likely owner of almost any drone chassis on sight, and he will sell a matching part for beer money.</p>",
      }),
      feature({
        id, n: 2,
        name: "Collar Scars",
        img: "icons/skills/wounds/injury-body-pain-gray.webp",
        dsid: "collar-scars",
        html: "<p>Ironclad fitted Torque with a compliance collar once. He knows what one looks like under a coat, how it is keyed, and roughly how long a wearer has before it starts taking pieces. He shares that knowledge freely and bitterly.</p>",
        sort: 10,
      }),
      strike({
        id, n: 3,
        name: "Pneumatic Wrench",
        img: "icons/tools/smithing/hammer-sledge-steel-grey.webp",
        dsid: "pneumatic-wrench",
        story: "Forearm clamp, one torque cycle, done.",
        keywords: ["melee", "strike", "weapon"],
        distance: MELEE,
        characteristic: "might",
        tiers: [4, 6, 8],
        applied: "grabbed",
        appliedHtml: "<p>The target is grabbed.</p>",
        sort: 20,
      }),
    ],
  },
  {
    key: "Luma",
    slug: "luma-glass",
    name: "Luma Glass",
    station: "Regular — Bar Rail",
    people: "Pure Human",
    sex: "F",
    spineName: "Human Raider → Gang Raider",
    level: 1, organization: "minion", role: "support",
    stamina: 5, ev: 3, freeStrike: 1, speed: 5,
    chr: [0, 1, 2, 2, 2],
    keywords: ["humanoid", "human"],
    negotiation: [4, 6, 2],
    sort: 520,
    bio: "<p>A sharp corporate suit worn under club mesh, which fools nobody and is not meant to. Luma drinks at the bar rail two nights a week, tips correctly, and tells anyone who asks that she is “just off the clock.”</p>",
    hook: "<p><strong>Plot hook:</strong> Luma is a Meridian Signal junior, and she is not off the clock at all — she is logging Mama Switchboard traffic from the bar rail and filing it upstairs. Vexa suspects. Mama has not decided whether Luma is a problem or a channel.</p><p><strong>Running her:</strong> Noncombatant. She works the bar rail off a consumer handset and notes — her Wire Kit (0.3.85) is the cheap street stamp, not a deck, so a search still finds nothing interesting.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Just Off the Clock",
        img: "icons/sundries/documents/blueprint.webp",
        dsid: "just-off-the-clock",
        html: "<p>Luma's cover is deliberately thin — she reads as a bored corp kid slumming it, which is close enough to true that nobody digs. She has an edge on tests to be dismissed as harmless.</p>",
      }),
      feature({
        id, n: 2,
        name: "Filing It Upstairs",
        img: "icons/commodities/tech/tube-chip-circuit.webp",
        dsid: "filing-it-upstairs",
        html: "<p>Everything Luma sees at the bar rail is in a Meridian Signal report by morning. She works off a consumer handset and her own notes — no deck, no kit, nothing to find if she is searched.</p>",
        sort: 10,
      }),
      strike({
        id, n: 3,
        name: "Handset Edge",
        img: "icons/commodities/tech/tool-nutdriver.webp",
        dsid: "handset-edge",
        story: "Swung flat, mostly to buy a step back.",
        keywords: ["melee", "strike", "weapon"],
        distance: MELEE,
        characteristic: "agility",
        tiers: [1, 2, 3],
        sort: 20,
      }),
    ],
  },
  {
    key: "Ash",
    slug: "brother-ash",
    name: "Brother Ash",
    station: "Regular — Back Wall",
    people: "Goliar",
    sex: "M",
    spineName: "Human Knave → Street Punk",
    level: 2, organization: "platoon", role: "support",
    stamina: 55, ev: 8, freeStrike: 4, speed: 5, stability: 1,
    chr: [2, 0, 1, 2, 2],
    keywords: ["humanoid", "human"],
    negotiation: [7, 6, 1],
    sort: 530,
    bio: "<p>A Goliar man with a street-priest's lean — not ordained, not licensed, not quite a class. Brother Ash works the back wall with a censer on a chain and a voice pitched exactly low enough that people lean in to hear it.</p>",
    hook: "<p><strong>Plot hook:</strong> Ash soft-recruits for a Veil cult that still drinks at this club. He never pushes, never names the group, and always finds the person in the room who has just lost something. Mama tolerates him — until she doesn't.</p><p><strong>Running him:</strong> Neutral and warm right up to the moment he isn't. He is genuinely dangerous and genuinely kind, in that order.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Street Pulpit",
        img: "icons/magic/holy/prayer-hands-glowing-yellow.webp",
        dsid: "street-pulpit",
        html: "<p>Ash finds the grieving person in any room within minutes. He has a double edge on tests to open a conversation with someone who has recently suffered a loss, and they rarely notice they are being read.</p>",
      }),
      feature({
        id, n: 2,
        name: "Tolerated, For Now",
        img: "icons/environment/people/cleric-grey.webp",
        dsid: "tolerated-for-now",
        html: "<p>Brother Ash keeps his recruiting quiet enough that the house looks the other way. He will not preach on the floor, will not name the Veil aloud, and will leave the moment Vexa asks — the first time.</p>",
        sort: 10,
      }),
      strike({
        id, n: 3,
        name: "Censer Chain",
        img: "icons/weapons/maces/mace-round-spiked-gold.webp",
        dsid: "censer-chain",
        story: "Three feet of chain and a hot brass bowl.",
        keywords: ["melee", "strike", "weapon"],
        distance: MELEE,
        characteristic: "might",
        tiers: [4, 6, 9],
        applied: "frightened",
        appliedHtml: "<p>The target is frightened (EoT).</p>",
        sort: 20,
      }),
    ],
  },
  {
    key: "Bell",
    slug: "kira-soft-trace-bell",
    name: "Kira “Soft Trace” Bell",
    station: "Regular — Info Broker",
    people: "Pure Human",
    sex: "F",
    wired: true,
    spineName: "Human Knave → Street Punk",
    level: 2, organization: "platoon", role: "support",
    stamina: 40, ev: 8, freeStrike: 3, speed: 5,
    chr: [0, 1, 3, 2, 1],
    keywords: ["humanoid", "human"],
    negotiation: [8, 5, 2],
    sort: 540,
    bio: "<p>Hacker-adjacent, pure human, and the only regular in the building with a deck under the table. Kira works the corner two-top most nights with a cold coffee and a Wire Kit, buying rumours off Pip and selling node maps to anyone who can pay.</p><p>They call her Soft Trace because she has never once left a hard one.</p>",
    hook: "<p><strong>Plot hook:</strong> Soft Trace is the club's info broker. She will trade a node map, a building's Wire layout, or a name — but she prices in favours, not cash, and she keeps a ledger. Several runners on this floor are already in it.</p><p><strong>Running her:</strong> <strong>Wired.</strong> Soft Trace is still the club's info broker — she prices node maps in favours and keeps a ledger — and she ships a Wire Kit like everyone else on this floor (0.3.85).</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Node Maps for Favours",
        img: "icons/sundries/documents/document-sealed-brown-red.webp",
        dsid: "node-maps-for-favours",
        html: "<p>Kira keeps current Wire layouts for most of the Reach's mid-tier buildings. She will trade one for a favour owed rather than money, and she always collects.</p>",
      }),
      feature({
        id, n: 2,
        name: "Never a Hard Trace",
        img: "icons/commodities/tech/circuit-board-green.webp",
        dsid: "never-a-hard-trace",
        html: "<p>Kira runs cold and short. She has an edge on tests to avoid leaving a log, an owner ID, or a recoverable route behind her on the Wire — which is why she is still drinking here and not in an Ironclad cell.</p>",
        sort: 10,
      }),
      strike({
        id, n: 3,
        name: "Deck Jolt",
        img: "icons/magic/lightning/bolt-strike-blue.webp",
        dsid: "deck-jolt",
        story: "A discharge off the deck's capacitor bank, at arm's length.",
        keywords: ["ranged", "strike", "weapon"],
        distance: RANGED,
        characteristic: "reason",
        tiers: [3, 5, 7],
        applied: "dazed",
        appliedHtml: "<p>The target is dazed (EoT).</p>",
        sort: 20,
      }),
      wireKit(id, 4),
    ],
  },
  // ------------------------------------------------- GENERIC PATRONS (filler)
  // Unnamed crowd texture from the same art drop. Deliberately lighter than the
  // named cast: a one-line bio, a filler-seat hook, and plain L1 minion math.
  // They sort after the named cast (600+) so the sidebar order stays readable.
  {
    key: "PatMale",
    slug: "club-patron-male",
    name: "Club Patron (Male)",
    station: "Floor Regular",
    people: "Pure Human",
    sex: "M",
    spineName: "Human Raider → Gang Raider",
    level: 1, organization: "minion", role: "harrier",
    stamina: 4, ev: 3, freeStrike: 1, speed: 5,
    chr: [2, 1, 0, 0, 0],
    keywords: ["humanoid", "human"],
    negotiation: [5, 5, 1],
    sort: 600,
    bio: "<p>A Flats regular who drinks midweek and never asks for Mama. Smiles easy, tips mid, knows every bartender by first name and none of their real ones.</p>",
    hook: "<p><strong>Plot hook:</strong> Filler seat / crowd texture. If the room needs a witness who saw the runners come in, he is the one.</p>",
    items: id => [patronFeature(id), improvisedSwing(id)],
  },
  {
    key: "PatFem",
    slug: "club-patron-female-corran",
    name: "Club Patron (Female Corran)",
    station: "Floor Regular",
    people: "Corran",
    sex: "F",
    spineName: "Human Raider → Gang Raider",
    level: 1, organization: "minion", role: "harrier",
    stamina: 4, ev: 3, freeStrike: 1, speed: 5,
    chr: [2, 1, 0, 0, 0],
    keywords: ["humanoid"],
    negotiation: [5, 5, 1],
    sort: 610,
    bio: "<p>A stocky Corran woman in a studded denim vest, blue drink always half-gone. Laughs loud at the band and tips Pip in hard cash.</p>",
    hook: "<p><strong>Plot hook:</strong> Filler seat. If a Corran Deepworks angle comes up later, she has cousins on a FER crew — she will not volunteer that.</p>",
    items: id => [patronFeature(id), improvisedSwing(id)],
  },
  {
    key: "PatRev",
    slug: "club-patron-revenant",
    name: "Club Patron (Revenant)",
    station: "Floor Regular",
    people: "Revenant",
    sex: "M",
    spineName: "Human Raider → Gang Raider",
    level: 1, organization: "minion", role: "harrier",
    stamina: 4, ev: 3, freeStrike: 1, speed: 5,
    chr: [2, 1, 0, 0, 0],
    keywords: ["humanoid", "undead"],
    immunities: { corruption: 1, poison: 1 },
    negotiation: [5, 5, 1],
    sort: 620,
    bio: "<p>Pale velvet and gold liquor. He does not blink often. Madame Quill nods to him once a night and that is the whole conversation.</p>",
    hook: "<p><strong>Plot hook:</strong> Filler seat with undead texture. A soft contact for Madame Quill, or for a Reach Revenant crew if the table goes that way.</p>",
    items: id => [coldRegular(id), improvisedSwing(id)],
  },
];

// ---------------------------------------------------------------- write

write(join(OUT, "_folder.json"), {
  _id: FOLDER_ID,
  _key: `!folders!${FOLDER_ID}`,
  name: "GHOSTWIRE.Bestiary.Folders.MamasClub",
  type: "Actor",
  folder: PARENT_FOLDER,
  sort: 120000,
  flags: {},
  color: "#7b1e5a",
  description: "",
  sorting: "a",
});

const built = ROSTER.map(entry => ({ entry, actor: clubActor(entry) }));

const seen = new Set();
for (const { entry, actor } of built) {
  const ids = [actor._id, ...actor.items.map(i => i._id), ...actor.effects.map(e => e._id)];
  const bad = ids.filter(id => !/^[A-Za-z0-9]{16}$/.test(id));
  if (bad.length) throw new Error(`${entry.slug} bad ids: ${bad.join(", ")}`);
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`${entry.slug} duplicate id: ${id}`);
    seen.add(id);
  }
  write(join(OUT, `${entry.slug}.json`), actor);
}

console.log(`Mama's Club floor cast -> ${OUT}\n`);
for (const { entry, actor } of built) {
  const kit = actor.items.some(i => i.system?._dsid === "wire-kit-matrix-verbs") ? "WIRED" : "meat ";
  console.log(
    `${entry.slug.padEnd(22)} ${actor._id}  ${kit}  L${entry.level} ${entry.organization.padEnd(7)} `
    + `${entry.role.padEnd(10)} sta=${String(entry.stamina).padEnd(3)} ev=${String(entry.ev).padEnd(2)} `
    + `${entry.sex} ${entry.people.padEnd(11)} ${entry.station}`
  );
}
console.log(`\n${built.length} Actors written (Mama Cassavir untouched).`);
