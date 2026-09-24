#!/usr/bin/env node
/**
 * Authoring helper: write the three locked Magical Societies contact Actors into
 * src/packs/bestiary/magical-societies/ — Senior Examiner Edda Marr (Measure
 * Collegium), Tavi Sorn (Wickkeepers) and Field Coordinator Daska Venn (Ash Survey),
 * plus the folder they live in.
 *
 * Canon of record, both LOCKED 2026-09-22:
 *   docs/directors/lore-research/2026-09-22-magical-societies-canon-three.md
 *   docs/directors/lore-research/2026-09-22-magical-societies-symbols-hq.md
 * and the three lore journals shipped in 0.3.93 under Ghostwire Lore →
 * Magical Societies. Nothing here may contradict them:
 *   - Edda is a Corran Elementalist who CAN cast, and is NOT the sole leader.
 *   - Tavi is Pure Human with NO casting ability, coordinating one site.
 *   - Daska is a full-conversion Cyborg who CANNOT cast — Arcane Severance
 *     applies to her exactly as written; membership never waives it.
 * These stat blocks add no new source, prices, ward strengths or casting permissions.
 *
 * Ancestry (Corran, Pure Human) lives in the biography prose and the bestiary
 * flags, never in system.monster.keywords: that list is a system enum
 * (humanoid / human / cyborg / undead / …) and a stray value renders wrong.
 *
 * Token art is Michael's 2026-09-22 drop, staged into
 * assets/tokens/bestiary/magical-societies/<slug>.webp — one plate per contact,
 * used for both the Actor portrait and the prototype token texture.
 *
 * Run from repo root:  node tools/gen-magical-societies-cast.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { keepLoot } from "./lib/keep-loot.mjs";
import { NO_DAMAGE_MOD, itemId, makeNpcKit } from "./lib/npc-kit.mjs";

const MODULE = "draw-steel-ghostwire";
const OUT = "src/packs/bestiary/magical-societies";
const FOLDER_ID = "gwBestiaryMagSoc";
/** Top-level Actor folder, sorted with the other Reach folders (Streets 100000, Critters 150000). */
const FOLDER_SORT = 175000;
const SOURCE = {
  book: "Ghostwire Core Rulebook",
  page: "25-opposition",
  license: "Draw Steel Creator License",
};
/** The three society journals shipped in 0.3.93 (src/packs/lore/magical-societies). */
const JOURNAL = {
  collegium: "Compendium.draw-steel-ghostwire.lore.JournalEntry.2VPrYRQCdrZ45Cdh",
  wickkeepers: "Compendium.draw-steel-ghostwire.lore.JournalEntry.Avl7X1CKsjuCInNJ",
  survey: "Compendium.draw-steel-ghostwire.lore.JournalEntry.J0DWDaXDVehDMZHc",
};
const plate = slug => `modules/${MODULE}/assets/tokens/bestiary/magical-societies/${slug}.webp`;

const read = p => JSON.parse(readFileSync(p, "utf8"));
const write = (p, doc) => {
  mkdirSync(dirname(p), { recursive: true });
  // 0.3.127 (E): a regen owns identity, tools/bestiary-loot.mjs owns the pockets. keepLoot() is
  // how the second survives the first — see tools/lib/keep-loot.mjs.
  writeFileSync(p, `${JSON.stringify(keepLoot(p, doc), null, 2)}\n`);
};
const clone = v => structuredClone(v);

/** A shipped named-bestiary NPC lends its prototypeToken chassis (Has Vision ON, neutral). */
const tokenSpine = read("src/packs/bestiary/mama-club/madame-quill.json").prototypeToken;
const { feature, strike, ensureWireKit } = makeNpcKit({ module: MODULE, source: SOURCE });

// ---------------------------------------------------------------- ability helpers

/**
 * Bolt a forced-movement rider onto a strike built by npc-kit's strike().
 * Shape mirrors the stock Rival Elementalist's slide rider.
 */
function addForced(ability, actorId, { movement, distances }) {
  const id = `${actorId.slice(0, 12)}Frc0`;
  // Every shipped ability stores damage as "melee" regardless of distance; keep the pack uniform.
  ability.system.damageDisplay = "melee";
  const tier = i => ({
    movement: [movement],
    display: "{{forced}}",
    distance: String(distances[i]),
    properties: [],
    potency: { value: `@potency.${["weak", "average", "strong"][i]}`, characteristic: i === 0 ? "none" : "" },
  });
  ability.system.power.effects[id] = {
    name: movement,
    img: null,
    type: "forced",
    _id: id,
    forced: { tier1: tier(0), tier2: tier(1), tier3: tier(2) },
    sort: 0,
  };
  return ability;
}

/** A non-strike ability (area cast, maneuver) built to the stock NPC ability shape. */
function ability({ id, n, name, img, dsid, story, keywords, type, category, resource, distance, target, characteristic, tiers, applied, afterHtml, sort = 0 }) {
  const effects = {};
  if (tiers) {
    const damage = {};
    ["tier1", "tier2", "tier3"].forEach((tier, i) => {
      damage[tier] = {
        value: String(tiers[i]),
        types: [],
        potency: { value: `@potency.${["weak", "average", "strong"][i]}`, characteristic: i === 0 ? "none" : "" },
        ignoredImmunities: [],
      };
    });
    effects[`${id.slice(0, 12)}Dmg0`] = {
      name: "Damage", img: null, type: "damage", _id: `${id.slice(0, 12)}Dmg0`, damage, sort: 0,
    };
  }
  if (applied) {
    const appliedTier = i => ({
      display: applied.display?.[i] ?? "",
      effects: applied.tiers[i]
        ? { [applied.status]: { condition: applied.condition ?? "always", end: applied.end ?? "turn", properties: [] } }
        : {},
      potency: { value: `@potency.${["weak", "average", "strong"][i]}`, characteristic: i === 0 ? (applied.characteristic ?? "none") : "" },
    });
    effects[`${id.slice(0, 12)}App0`] = {
      name: applied.name ?? "", img: null, type: "applied", _id: `${id.slice(0, 12)}App0`,
      applied: { tier1: appliedTier(0), tier2: appliedTier(1), tier3: appliedTier(2) }, sort: 0,
    };
  }

  return {
    name,
    type: "ability",
    _id: itemId(id, n),
    img,
    system: {
      type,
      source: SOURCE,
      _dsid: dsid,
      story: story ?? "",
      keywords,
      category,
      resource: resource ?? null,
      trigger: "",
      distance,
      damageDisplay: "melee",
      target,
      power: characteristic
        ? { roll: { formula: "@chr", characteristics: [characteristic], reactive: false }, effects }
        : { roll: { formula: "", characteristics: [], reactive: false }, effects },
      effects: afterHtml
        ? {
            after00000000000: {
              _id: "after00000000000", type: "base", description: afterHtml,
              name: "", img: null, sort: 0, before: false,
            },
          }
        : {},
      prerequisites: { value: "", dsid: [], level: null },
    },
    effects: [],
    folder: null,
    sort,
    ownership: { default: 0 },
    flags: {},
    _key: `!actors.items!${id}.${itemId(id, n)}`,
  };
}

// ---------------------------------------------------------------- actor builder

function contact(entry) {
  const id = entry.id;
  const img = plate(entry.slug);

  const prototypeToken = clone(tokenSpine);
  prototypeToken.name = entry.name;
  prototypeToken.texture.src = img;
  prototypeToken.sight.enabled = true;   // Has Vision ON (0.3.67 rule)
  prototypeToken.disposition = 0;        // contacts are neutral, not hostile
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
        size: { value: 1, letter: "M" },
        stability: entry.stability ?? 0,
        turns: 1,
      },
      biography: { value: entry.bio, director: entry.hook, languages: [] },
      movement: { value: entry.speed, types: ["walk"], hover: false, disengage: 1 },
      damage: { immunities: { ...NO_DAMAGE_MOD }, weaknesses: { ...NO_DAMAGE_MOD } },
      source: SOURCE,
      negotiation: {
        interest: entry.negotiation[0],
        patience: entry.negotiation[1],
        motivations: entry.motivations,
        pitfalls: entry.pitfalls,
        impression: entry.negotiation[2],
      },
      monster: {
        freeStrike: entry.freeStrike,
        keywords: entry.keywords,
        level: entry.level,
        role: entry.role,
        organization: entry.organization,
      },
      ev: entry.ev,
      statuses: { immunities: [] },
    },
    prototypeToken,
    items: ensureWireKit(id, entry.items(id)),
    effects: [],
    sort: entry.sort,
    ownership: { default: 0 },
    flags: {
      [MODULE]: {
        bestiary: {
          region: "magical-societies",
          society: entry.society,
          slug: entry.slug,
          handbookName: entry.name,
          station: entry.station,
          people: entry.people,
          sex: entry.sex,
          casting: entry.casting,
          loreJournal: entry.journal,
          wired: true,
        },
      },
    },
    _key: `!actors!${id}`,
  };
}

// ---------------------------------------------------------------- the three contacts

const ROSTER = [
  {
    // Measure Collegium — Corran Elementalist, CAN cast.
    id: "gwBesEddaMarr000",
    slug: "edda-marr",
    name: "Edda Marr",
    society: "measure-collegium",
    station: "Senior Examiner — Datum House",
    people: "Corran",
    sex: "F",
    casting: true,
    journal: JOURNAL.collegium,
    sort: 100,
    level: 2, role: "controller", organization: "elite",
    stamina: 60, ev: 16, freeStrike: 4, speed: 5,
    keywords: ["humanoid"],
    chr: [0, 0, 2, 2, 1],
    negotiation: [6, 6, 2],
    motivations: ["discovery"],
    pitfalls: ["authority"],
    bio: "<p>A Corran woman in a charcoal survey coat, cuffs inked, a worn brass measuring loop clipped where a corp badge would sit. She sets her instruments down before she shakes a hand, and she reads the maintenance plate on a door before she reads the room.</p>"
      + "<p>She is an Elementalist — Essence, trained, supervised and logged, the Collegium way — and she will tell you the casting is the least interesting part of the job. What matters is whether the ward that was installed matches the ward that was certified. Testimony is what people remember. Measurements are what happened.</p>",
    hook: "<p><strong>Role:</strong> Senior Examiner of the Measure Collegium and the crew's field contact at <strong>Datum House</strong>. She is <strong>not</strong> the sole leader of the Collegium and cannot overrule every sponsor, inspector and property owner in the Reach.</p>"
      + "<p><strong>Drive:</strong> Discovery — get the real number. <strong>Pitfall:</strong> Authority. Several Collegium inspectors have approved failing wards because an honest closure order would put thousands of residents on the street. She knows. It is the one place her courage runs out: she is brave in front of physical and magical danger, and much less brave when the evidence threatens the institution that trained her.</p>"
      + "<p><strong>What she can do:</strong> open a classroom, arrange specialist consultation, get a damaged component into the Test Bay intact, ask a crew to recover records, point at the Failure Archive. <strong>What she cannot do:</strong> certify a building safe on her signature alone, launder the Metermen, waive anyone's Arcane Severance, or promise a site can be cleansed.</p>"
      + "<p><strong>Posture:</strong> she does not start fights and does not run from measurable danger. She retreats from a political one. If it goes loud she anchors the ground and gets civilians off the floor; she is an examiner, not a war-caster.</p>"
      + "<p><strong>If pressed:</strong> “The arch is not the claim. The line is the claim.” / “I can tell you what is there. I cannot tell you it is safe.” / “Bring it to me intact, or do not bring it.”</p>"
      + "<p><strong>Director tags:</strong> Architecture, Magic, Interrogation, Search. Wire Kit — Linked by default; she logs, she does not intrude.</p>"
      + `<p><strong>Canon:</strong> @UUID[${JOURNAL.collegium}]{The Measure Collegium}. Hooks, escalation ladders and job seeds in that journal are play fuel, not settled history.</p>`,
    items: id => [
      feature({
        id, n: 1, sort: 0,
        name: "The True Measure",
        img: "icons/sundries/documents/blueprint.webp",
        dsid: "the-true-measure",
        html: "<p>Edda carries the Collegium's guild mark — brass caliper arch, silver plumb, one cyan datum line — on her coat patch and her instrument case. She has an edge on tests to be admitted to a site as an inspector, to read an annotated maintenance plate, or to tell a genuine certification from a forged badge or an expired one.</p>"
          + "<p>The mark identifies a claimed affiliation. It does not prove an inspector is honest, and it never declares a building safe.</p>",
      }),
      feature({
        id, n: 2, sort: 10,
        name: "Measurements Over Testimony",
        img: "icons/skills/trades/academics-investigation-study-blue.webp",
        dsid: "measurements-over-testimony",
        html: "<p>Given an hour, her instruments and access to the installed work, Edda can say whether a ward matches the work it was certified for, and roughly how it is failing. She has an edge on Reason tests to reproduce a known ward failure or to spot a component that has been swapped for an identical-looking part that will pass.</p>"
          + "<p>She will not state a conclusion she has not measured, and she will say so out loud rather than guess for a client.</p>",
      }),
      feature({
        id, n: 3, sort: 20,
        name: "The Institution That Trained Her",
        img: "icons/sundries/books/book-embossed-clasp-gold-brown.webp",
        dsid: "the-institution-that-trained-her",
        html: "<p><strong>Director-facing.</strong> Any negotiation that asks Edda to publish against the Collegium itself, name a sponsor, or hand an inspection ledger to someone who will use it for mass eviction loses 1 Patience immediately and cannot reach its final tier on the first attempt.</p>"
          + "<p>Show her the residents' side of the closure order — who sleeps where tonight — and the pitfall lifts for that scene.</p>",
      }),
      addForced(strike({
        id, n: 4, sort: 30,
        name: "Plumb Drop",
        img: "icons/magic/earth/projectile-stone-ball-orange.webp",
        dsid: "plumb-drop",
        story: "She lets the line out and the weight finds true. Whatever was standing between is no longer standing.",
        keywords: ["magic", "ranged", "strike"],
        distance: { type: "ranged", primary: "10", secondary: "1", tertiary: "1" },
        characteristic: "reason",
        tiers: [6, 9, 12],
        applied: "slowed",
        appliedHtml: "<p>The target is slowed (EoT), and the square it occupies is marked with a cyan datum line until the end of the encounter.</p>",
      }), id, { movement: "slide", distances: [1, 2, 3] }),
      ability({
        id, n: 5, sort: 40,
        name: "Bring It to True",
        img: "icons/magic/earth/barrier-stone-explosion-debris.webp",
        dsid: "bring-it-to-true",
        story: "Brass threshold lines snap across the floor. The ground stops lying about which way is down.",
        keywords: ["area", "magic", "ranged"],
        type: "main", category: "heroic", resource: 3,
        distance: { type: "cube", primary: "3", secondary: "10", tertiary: "1" },
        target: { type: "enemy", value: null, custom: "Each enemy in the area" },
        characteristic: "reason",
        tiers: [3, 5, 8],
        applied: { status: "slowed", tiers: [false, true, true], condition: "failure", end: "turn", display: ["", "slowed (EoT)", "slowed (EoT)"], name: "Slowed" },
        afterHtml: "<p>The area is difficult terrain for enemies until the end of the encounter. Allies who start their turn in the area ignore that difficult terrain — the datum lines read the same for everyone who knows what they are for.</p>",
      }),
    ],
  },
  {
    // Wickkeepers — Pure Human, NO casting ability at all.
    id: "gwBesTaviSorn000",
    slug: "tavi-sorn",
    name: "Tavi Sorn",
    society: "wickkeepers",
    station: "Kitchen organizer — the Last Kettle",
    people: "Pure Human",
    sex: "F",
    casting: false,
    journal: JOURNAL.wickkeepers,
    sort: 200,
    level: 1, role: "support", organization: "platoon",
    stamina: 30, ev: 6, freeStrike: 2, speed: 5,
    keywords: ["humanoid", "human"],
    chr: [1, 0, 1, 2, 2],
    negotiation: [7, 6, 2],
    motivations: ["benevolence"],
    pitfalls: ["authority"],
    bio: "<p>A Pure Human woman with flour on one sleeve and a pencil behind her ear, working the Night Window of <strong>the Last Kettle</strong> — a converted laundromat and night kitchen under an old lift concourse in the Flats. She takes no testimony and asks for no confession. She asks how many, and whether anyone is hurt.</p>"
      + "<p>She has no casting ability of any kind and has never claimed one. The little amber lamp mark is inside the doorway, where you only notice it after you have already decided to step in.</p>",
    hook: "<p><strong>Role:</strong> Wickkeeper kitchen organizer and the crew's local contact at the Last Kettle. She coordinates <strong>this site</strong> through persuasion, work and local trust — a request from her does not obligate any other cell in the Reach, and she cannot order a distant group to accept a guest.</p>"
      + "<p><strong>Drive:</strong> Benevolence — keep someone else here until morning. <strong>Pitfall:</strong> Authority. Arrive with a badge, a registry, a list or an offer of official help and she goes polite and useless: in her experience, official help is what arrives just before people stop coming back.</p>"
      + "<p><strong>What she can do:</strong> a hot meal, dry clothes, a wash, a bench out of the rain, an introduction to someone who owes her, a bed upstairs if a bed is free, and a quiet route out through the Service Passage. <strong>What she cannot do:</strong> certify anyone holy, grant Conviction, speak for the Light, command the network, promise a bed she does not have, or ward a room — she is not a caster and the Wickkeepers are not a church.</p>"
      + "<p><strong>Pressure right now:</strong> a growing queue against shrinking fuel and food. Help offered on generous terms arrives with invasive conditions, and the restricted aid agreement on the shelf grants more access to delivery and recipient records than her volunteers understood.</p>"
      + "<p><strong>Posture:</strong> she does not fight. She empties the room, puts the counter between the trouble and the queue, and remembers every face for later.</p>"
      + "<p><strong>If pressed:</strong> “Sit down, eat, and then tell me.” / “I can feed forty. I have four beds. Ask me the honest question.” / “I do not keep a list. That is the whole point of me.”</p>"
      + "<p><strong>Director tags:</strong> Streetwise, Insight, Persuasion, Cooking, Rumours. Wire Kit — Linked, for deliveries and a handset. No deck, no payloads.</p>"
      + `<p><strong>Canon:</strong> @UUID[${JOURNAL.wickkeepers}]{The Wickkeepers}. Choirmother is a separate established character, not the Wickkeepers' founder; Mama and Brother Ash are optional connections, not members.</p>`,
    items: id => [
      feature({
        id, n: 1, sort: 0,
        name: "Remembers Every Name",
        img: "icons/sundries/books/book-worn-brown.webp",
        dsid: "remembers-every-name",
        html: "<p>Tavi can name everyone who has come through the Night Window in the last two years, what they needed, who they came in with, and roughly when they stopped coming — and why. She has an edge on tests to recognise a face, place a stranger in the neighbourhood, or notice that someone in the queue does not belong to it.</p>"
          + "<p>She keeps it in her head on purpose. There is no citywide shelter directory, and the Back Table holds current needs, not a master list.</p>",
      }),
      feature({
        id, n: 2, sort: 10,
        name: "The Night Window",
        img: "icons/consumables/food/bowl-ribs-meat-rice-mash-brown-white.webp",
        dsid: "the-night-window",
        html: "<p>Between scenes, Tavi can give one group of travellers a hot meal, a wash, dry clothes and a dry bench without cost or conditions. No testimony, conversion or confession is required, and she does not ask what the job was.</p>"
          + "<p><strong>Upstairs is finite.</strong> The Last Kettle has a handful of temporary beds behind plain curtains. When they are full, somebody is turned away, and the Director decides who — that choice is the scene, not a die roll.</p>",
      }),
      feature({
        id, n: 3, sort: 20,
        name: "No Casting, No Claim",
        img: "icons/skills/social/wave-halt-stop.webp",
        dsid: "no-casting-no-claim",
        html: "<p>Tavi is Pure Human with no casting ability whatsoever. She cannot ward a room, cleanse Taint, bless a door, grant Conviction or certify anyone holy, and no Wickkeeper authority can do those things on her behalf. Casters exist in the network; they are a minority, not a ruling caste.</p>"
          + "<p>If a scene needs a ward, she knows who to send you to. That is the help she has.</p>",
      }),
      feature({
        id, n: 4, sort: 30,
        name: "Until Morning",
        img: "icons/skills/social/diplomacy-peace-alliance.webp",
        dsid: "until-morning",
        html: "<p><strong>Maneuver · social.</strong> Tavi makes a Presence test (Persuasion or Insight) to talk one frightened, hurt or cornered creature at the Kettle into staying put and accepting help.</p>"
          + "<ul><li><strong>≤11:</strong> they stay for the meal and nothing more; she has spent something she will not get back tonight.</li>"
          + "<li><strong>12–16:</strong> they stay until morning, and will answer questions the crew asks gently.</li>"
          + "<li><strong>17+:</strong> they stay, and they name the person they are actually running from.</li></ul>"
          + "<p>She will not use this on someone who is safer leaving.</p>",
      }),
      strike({
        id, n: 5, sort: 40,
        name: "The Nearest Heavy Thing",
        img: "icons/containers/kitchenware/tray-wood-brown.webp",
        dsid: "the-nearest-heavy-thing",
        story: "A full kettle, a serving tray, the edge of the counter. Last resort, and she hates it.",
        keywords: ["melee", "strike"],
        distance: { type: "melee", primary: "1", secondary: "1", tertiary: "1" },
        characteristic: "might",
        tiers: [2, 3, 5],
        appliedHtml: "<p>After the strike, Tavi shifts 1 square to put herself between the trouble and the queue. That is always where she goes.</p>",
      }),
    ],
  },
  {
    // Ash Survey — full-conversion Cyborg, CANNOT cast (Arcane Severance).
    id: "gwBesDaskaVenn00",
    slug: "daska-venn",
    name: "Daska Venn",
    society: "ash-survey",
    station: "Field Coordinator — the Cinder Yard",
    people: "Cyborg (full conversion)",
    sex: "F",
    casting: false,
    journal: JOURNAL.survey,
    sort: 300,
    level: 2, role: "defender", organization: "elite",
    stamina: 80, ev: 16, freeStrike: 4, speed: 5, stability: 2,
    keywords: ["humanoid", "cyborg"],
    chr: [2, 1, 2, 1, 1],
    negotiation: [5, 7, 2],
    motivations: ["protection"],
    pitfalls: ["greed"],
    bio: "<p>A full-conversion Cyborg in a patched weather shell over a sealed frame, a dull mineral sample case at her hip and the gantry lamp catching the seams. She coordinates departures and returns at <strong>the Cinder Yard</strong>: who goes out, by which route, who comes back, and what comes back with them.</p>"
      + "<p>She cannot cast. Arcane Severance applies to her exactly as written, and she has no interest in being anyone's exception. She runs logistics, extraction and the wash-down line, and she keeps the living members of the team alive.</p>",
    hook: "<p><strong>Role:</strong> Field Coordinator of the Ash Survey and the crew's contact at the Cinder Yard. Her authority comes from field experience and an independently preserved archive, not from permission to override civic or corporate law.</p>"
      + "<p><strong>Drive:</strong> Protection — everyone who went out comes back, and the casualty list stays as written. <strong>Pitfall:</strong> Greed. Offer her money to release an original sample early, shave a passenger count, or let a sponsor edit a report, and the negotiation is over.</p>"
      + "<p><strong>What she can do:</strong> reconnaissance support, field equipment, a planned extraction, heavy labour negotiated through the Rust Saints, and a straight answer about what a site did to the last team. <strong>What she cannot do:</strong> cast anything, cleanse contamination, guarantee a site is clear, or declare a property safe. “A clean report is not a clean site.”</p>"
      + "<p><strong>Pressure right now:</strong> a sponsor wants an original sample back before the comparison test finishes, and the Dispatch Loft holds evidence that the Survey's best emergency corridor crosses a site that was never fully cleared. Closing it protects future travellers and strands the people who currently depend on it.</p>"
      + "<p><strong>Posture:</strong> she fights only to break contact. She takes the hit, clears the lane, and gets the meat out; the yard is not an armoury and she does not hold ground for its own sake.</p>"
      + "<p><strong>If pressed:</strong> “Dirty lane is left. Do not improvise.” / “I will write what happened. You can decide what to do about it.” / “You are paying for the test, not for the answer.”</p>"
      + "<p><strong>Director tags:</strong> Nature, Search, Repair, Drive, Endurance. Wire Kit — Linked; route work, telemetry and the Dispatch Loft board.</p>"
      + `<p><strong>Canon:</strong> @UUID[${JOURNAL.survey}]{The Ash Survey}. Rust Saints cooperation is negotiated per job; no standing contract with Verdant, Kestrel or Lazarus is established.</p>`,
    items: id => [
      feature({
        id, n: 1, sort: 0,
        name: "Arcane Severance",
        img: "icons/magic/control/silhouette-aura-energy.webp",
        dsid: "arcane-severance-daska-venn",
        html: "<p>Daska is a full-conversion Cyborg. She <strong>cannot cast</strong> — no Essence, no Conviction, no Resonance, no ritual role beyond hands and logistics — and membership in the Ash Survey does not waive that or any other casting restriction.</p>"
          + "<p>She is not evidence of a magical exception for Cyborgs. She is evidence that the Survey cares about expertise, courage and responsibility in people who will never wield magic at all.</p>",
      }),
      feature({
        id, n: 2, sort: 10,
        name: "Sealed Frame",
        img: "icons/commodities/tech/robotics-frame-steel-blue.webp",
        dsid: "sealed-frame",
        html: "<p>Daska's shell is rated for the Dirty Return. She ignores the need to breathe, eat, drink or sleep, and airborne contaminants, smoke and foul atmosphere do not force her out of a space that would drive a living team back.</p>"
          + "<p>This buys her time in a bad room. It does not make the room safe, does not detect what is in it, and grants no resistance to anything the sheet does not already list.</p>",
      }),
      feature({
        id, n: 3, sort: 20,
        name: "The Dirty Return",
        img: "icons/commodities/tech/console-steel.webp",
        dsid: "the-dirty-return",
        html: "<p>Exposed teams and equipment come back down a separate lane: check-in, isolation, wash-down, then documented transfer into the Sample Lock. Daska runs it personally.</p>"
          + "<p>She has an edge on tests to plan an extraction route, to bring an exposed crew back inside without spreading what they picked up, or to notice that a returning carrier's passenger count does not match the one she dispatched. The procedure is ordinary mechanical segregation and trained handling — there is no cleansing arch, and nothing here cures contamination.</p>",
      }),
      feature({
        id, n: 4, sort: 30,
        name: "A Clean Report Is Not a Clean Site",
        img: "icons/sundries/documents/document-sealed-signatures-red.webp",
        dsid: "a-clean-report-is-not-a-clean-site",
        html: "<p><strong>Director-facing.</strong> Daska preserves the original findings and the original samples, and she will not let a sponsor rewrite the casualties. Any offer that asks her to soften a report, release an original sample before its comparison test, or lose a name from a list ends the negotiation at once — treat it as her Greed pitfall, triggered.</p>"
          + "<p>She will trade almost anything else: routes, gear, labour, her own time in a corridor she barely escaped.</p>",
      }),
      addForced(strike({
        id, n: 5, sort: 40,
        name: "Winch Line",
        img: "icons/sundries/survival/rope-wrapped-loops-grey.webp",
        dsid: "winch-line",
        story: "The gantry hook goes out, bites, and the drum takes up the slack. It was built to pull carriers.",
        keywords: ["ranged", "strike", "weapon"],
        distance: { type: "ranged", primary: "5", secondary: "1", tertiary: "1" },
        characteristic: "might",
        tiers: [5, 8, 11],
        appliedHtml: "<p>Daska can pull the target toward her instead of dragging it clear — she uses this to get people <em>out</em> far more often than to put anyone down.</p>",
      }), id, { movement: "pull", distances: [1, 2, 3] }),
    ],
  },
];

// ---------------------------------------------------------------- emit

write(join(OUT, "_folder.json"), {
  _id: FOLDER_ID,
  _key: `!folders!${FOLDER_ID}`,
  name: "GHOSTWIRE.Bestiary.Folders.MagicalSocieties",
  type: "Actor",
  folder: null,
  sort: FOLDER_SORT,
  flags: {},
  color: null,
  description: "",
  sorting: "a",
});
console.log(`${OUT}/_folder.json  (${FOLDER_ID}, sort ${FOLDER_SORT})`);

for (const entry of ROSTER) {
  const actor = contact(entry);
  write(join(OUT, `${entry.slug}.json`), actor);
  console.log(
    `${OUT}/${entry.slug}.json`.padEnd(52)
    + `${actor._id}  L${entry.level} ${entry.organization.padEnd(7)} ${entry.role.padEnd(10)} `
    + `sta=${String(entry.stamina).padEnd(3)} ev=${String(entry.ev).padEnd(2)} `
    + `${entry.casting ? "CASTS    " : "no casting"} ${entry.people}`
  );
}
console.log(`\n${ROSTER.length} Magical Societies contacts written. Next: node tools/build-packs.mjs bestiary (Foundry closed).`);
