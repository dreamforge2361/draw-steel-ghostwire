#!/usr/bin/env node
/**
 * One-shot authoring helper: write the Deadhead cast into the GM-only
 * `deadhead` Actor pack (Ghostwire Runs — Deadhead Actors):
 *
 *   src/packs/deadhead/nightjar-market/  Iona Vale · Rhen Calder · Nim
 *   src/packs/deadhead/rack-rest/        Vesper Drift · Tam Kade · Sera Nix ·
 *                                        Cousin Vell · Juno Halve
 *
 * Specs: docs/directors/runs/deadhead/FOUNDRY-NEXT-PUSH-DEADHEAD.md (Appendix —
 * Nightjar buyers) and DEADHEAD-SESSION-CHAPTERS.md (Rack & Rest Faces lock).
 * Buyers are L1 platoon contacts, not boss fights; the Faces are L1 social color
 * on the Mama's Club ambience band. Every Actor ships a Wire Kit (0.3.85
 * humanoid Connect pass). The Rack & Rest pentagram drawer is set dressing only
 * — no ritual rules ride on Vesper.
 *
 * Ancestry lives in biography prose and flags, never as a bespoke keyword:
 * system.monster.keywords is a system enum, so Elvani / unrecorded peoples use
 * humanoid + human and Revenants humanoid + undead, as the club cast does.
 *
 * Proposed ids in the push checklist were 15 characters; Foundry needs 16, so
 * each is right-padded with 0 (gwDhIonaVale000 → gwDhIonaVale0000).
 *
 * Token art: Michael's staged drop in assets/tokens/deadhead/ — 1254² RGBA PNG
 * originals beside 1024² WebPs. Foundry points at the WebP.
 *
 * Run from repo root:  node tools/gen-deadhead-cast.mjs
 * Then:                node tools/build-packs.mjs deadhead   (Foundry closed)
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { MELEE, NO_DAMAGE_MOD, captainId, makeNpcKit } from "./lib/npc-kit.mjs";

const MODULE = "draw-steel-ghostwire";
const OUT = "src/packs/deadhead";
const SOURCE = {
  book: "Ghostwire Deadhead (Gold Line)",
  page: "Session Chapters",
  license: "Draw Steel Creator License",
};
const FOLDERS = {
  nightjar: { _id: "gwDeadheadNtjar0", dir: "nightjar-market", name: "GHOSTWIRE.Deadhead.Folders.NightjarMarket", sort: 200000, color: "#1f6f8b" },
  rackRest: { _id: "gwDeadheadRackRs", dir: "rack-rest", name: "GHOSTWIRE.Deadhead.Folders.RackRest", sort: 300000, color: "#6b4f9e" },
};
const token = slug => `modules/${MODULE}/assets/tokens/deadhead/${slug}.webp`;
const payload = (id, label) => `@UUID[Compendium.${MODULE}.matrix.Item.${id}]{${label}}`;

const read = p => JSON.parse(readFileSync(p, "utf8"));
const write = (p, doc) => {
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, `${JSON.stringify(doc, null, 2)}\n`);
};

const minionSpine = read("src/packs/bestiary/reach-streets/gang-raider.json");
const platoonSpine = read("src/packs/bestiary/reach-streets/street-punk.json");
const { feature, strike, ensureWireKit, captainEffect } = makeNpcKit({ module: MODULE, source: SOURCE, minionSpine });

/** Checklist ids, padded to Foundry's 16. */
const actorId = proposed => proposed.padEnd(16, "0");

// ---------------------------------------------------------------- actor builder

function castActor(entry) {
  const id = actorId(entry.proposedId);
  const spine = entry.organization === "minion" ? minionSpine : platoonSpine;
  const img = token(entry.token);
  const folder = FOLDERS[entry.folder];

  const prototypeToken = structuredClone(spine.prototypeToken);
  prototypeToken.name = entry.name;
  prototypeToken.texture.src = img;
  prototypeToken.sight.enabled = true;   // Has Vision ON (0.3.67 rule)
  prototypeToken.sight.range ??= 0;
  prototypeToken.sight.angle ??= 360;
  prototypeToken.disposition = 0;        // contacts and Faces are neutral, not hostile
  prototypeToken.width = 1;
  prototypeToken.height = 1;
  prototypeToken.flags = {};

  return {
    folder: folder._id,
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
        stability: 0,
        turns: 1,
      },
      biography: { value: entry.bio, director: entry.director, languages: [] },
      movement: { value: entry.speed, types: ["walk"], hover: false, disengage: entry.disengage ?? 1 },
      damage: {
        immunities: { ...NO_DAMAGE_MOD, ...(entry.immunities ?? {}) },
        weaknesses: { ...NO_DAMAGE_MOD, ...(entry.weaknesses ?? {}) },
      },
      source: SOURCE,
      negotiation: {
        interest: entry.negotiation[0],
        patience: entry.negotiation[1],
        motivations: entry.motivations ?? [],
        pitfalls: entry.pitfalls ?? [],
        impression: entry.negotiation[2],
      },
      monster: {
        freeStrike: entry.freeStrike,
        keywords: entry.keywords,
        level: 1,
        role: entry.role,
        organization: entry.organization,
        ...(entry.organization === "minion" ? { withCaptainEffect: captainId(id) } : {}),
      },
      ev: entry.ev,
      statuses: { immunities: entry.statusImmunities ?? [] },
    },
    prototypeToken,
    items: ensureWireKit(id, entry.items(id)),
    effects: entry.organization === "minion" ? [captainEffect(id)] : [],
    sort: entry.sort,
    ownership: { default: 0 },
    flags: {
      [MODULE]: {
        deadhead: {
          run: "deadhead",
          scene: folder.dir,
          role: entry.castRole,
          slug: entry.token,
          proposedId: entry.proposedId,
          people: entry.people,
          sex: entry.sex,
          wired: true,
        },
      },
    },
    _key: `!actors!${id}`,
  };
}

// ---------------------------------------------------------------- the roster

const ROSTER = [
  // ------------------------------------------------------- NIGHTJAR BUYERS
  {
    proposedId: "gwDhIonaVale000",
    token: "iona-vale-token",
    name: "Iona Vale",
    folder: "nightjar",
    castRole: "Buyer — Mama",
    people: "Pure Human",
    sex: "F",
    organization: "platoon", role: "support",
    stamina: 30, ev: 6, freeStrike: 2, speed: 5,
    chr: [1, 1, 0, 2, 2],
    keywords: ["humanoid", "human"],
    negotiation: [5, 4, 2],
    motivations: ["greed"],
    sort: 100000,
    bio: "<p>A calm, middle-aged Flats courier in an olive-grey rain shell, one dull-silver street optic catching the fluorescents. Pure Human; the eye is record-grade street chrome, not a combat suite. She carries a grocery basket like it is the whole story — noodles, caff, ordinary cans — and keeps it between whatever she is buying and the street glass.</p><p>Short, practical sentences. She never says a boss's name at the table.</p>",
    director: "<p><strong>Role:</strong> Mama Cassavir's deniable hand at Nightjar Market — the default Mama-path buyer. Pays <strong>¥8,000</strong> clean. Not a Torc, not a fighter.</p><p><strong>Drive:</strong> clean delivery and Switchboard deniability (Greed, soft — get paid and gone). <strong>Pitfall:</strong> naming Mama, the Switchboard, or the Gold Line chamber at the table; flashing the wafer at the front glass.</p><p><strong>Posture:</strong> Disengage and aisle cover; never stands to trade fire. <strong>Retreat:</strong> any serious meat threat, or the front glass goes loud → stockroom and west bay with the basket. She abandons the meet before she paints Mama's booth.</p><p><strong>Tells:</strong> the chrome eye ticks once when she prices risk; she buys something ordinary if the meet goes long.</p><p><strong>If pressed:</strong> “I am a courier. I buy groceries. That is the whole story.” / “If you wanted the booth, you should have stayed at the club. She does not.” / “Someone has been sitting on that glass too long. Finish or walk.”</p><p><strong>Director tags:</strong> Streetwise, Perception, Stealth, Negotiation, Insight. Wire Kit — Linked by default; Overlay only to price risk. No deck, no payloads. Do not force her seat if the crew chose corp or Signal.</p><p><strong>Purchased traits (fiction):</strong> Perseverance, Staying Power. Signature Detect the Supernatural is color only.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Grocery Cover",
        img: "icons/containers/misc/basket-handle-woven-gold.webp",
        dsid: "grocery-cover",
        html: "<p>Iona has an edge on tests to be dismissed as a late-shift shopper. The basket is the cover story, and she will not drop it.</p>",
      }),
      feature({
        id, n: 2,
        name: "Street Optic Tick",
        img: "icons/magic/perception/eye-ringed-green.webp",
        dsid: "street-optic-tick",
        html: "<p>Once per scene, Iona has an edge on an Intuition Perception test to notice a tell on the glass or a watcher at the west bay. This feeds the Nightjar watcher procedure; it never starts a fight on its own.</p>",
        sort: 10,
      }),
      feature({
        id, n: 3,
        name: "Finish or Walk",
        img: "icons/skills/social/diplomacy-handshake-yellow.webp",
        dsid: "finish-or-walk",
        html: "<p><strong>Maneuver · social.</strong> Iona makes a Presence test (Negotiation or Insight) against one creature at the meet.</p><ul><li><strong>≤11:</strong> she cools. A second low puts the meet at walk risk.</li><li><strong>12–16:</strong> the creature accepts her terms or leaves the meet.</li><li><strong>17+:</strong> the creature leaves, and the watcher's sightline softens.</li></ul>",
        sort: 20,
      }),
      strike({
        id, n: 4,
        name: "Basket Edge",
        img: "icons/containers/misc/basket-handle-woven-gold.webp",
        dsid: "basket-edge",
        story: "A handset or a loaded basket, swung once. Last resort.",
        keywords: ["melee", "strike"],
        distance: MELEE,
        characteristic: "agility",
        tiers: [1, 2, 3],
        appliedHtml: "<p>After the strike, Iona can shift 1 square toward cover. This is never her plan.</p>",
        sort: 30,
      }),
    ],
  },
  {
    proposedId: "gwDhRhenCalder0",
    token: "rhen-calder-token",
    name: "Rhen Calder",
    folder: "nightjar",
    castRole: "Buyer — Corp",
    people: "Elvani",
    sex: "M",
    organization: "platoon", role: "controller",
    stamina: 30, ev: 6, freeStrike: 2, speed: 5, disengage: 2,
    chr: [0, 1, 1, 2, 3],
    keywords: ["humanoid", "human"],
    negotiation: [4, 5, 2],
    motivations: ["authority"],
    pitfalls: ["justice"],
    sort: 200000,
    bio: "<p>An Elvani man in his early forties, tall and narrow, warm bronze skin and sharply tapered ears, close dark hair with one precise silver streak, pale gold glamor eyes. Charcoal raincoat over an ivory collarless suit, black gloves, a restrained ARG-gold pin. He carries a ledger slate and a sealed payment case, and no visible weapon.</p><p>Courteous, distant, ledger-polite. “Fourteen. Heat is yours. Curb or counter. Your clock.”</p>",
    director: "<p><strong>Role:</strong> the corp buyer at Nightjar Market — ARG reclaim or a rival flip. Pays <strong>~¥14,000</strong>; Mama is pissed after, and ARG/SAN heat sticks to SINs and pads. Meets at the counter, in a sealed Grey Cab on the south road, or at the west bay.</p><p><strong>Drive:</strong> reclaim or flip the wafer and contain the ARG/SAN story. <strong>Pitfall:</strong> justice — exposing the Switchboard as dirty; the crew flashing chamber intel as leverage.</p><p><strong>Posture:</strong> defensive withdrawal. He logs SINs and calls security; he never draws a heavy weapon. <strong>Retreat:</strong> the first solid hit on him, or the crew drawing firearms in a public aisle → sealed Grey Cab or west bay extract, with ARG/SAN heat later.</p><p><strong>Secret:</strong> rival flip or ARG reclaim is his call — the crew may never learn which.</p><p><strong>Director tags:</strong> Corporate, Negotiation, Persuasion, Insight, Perception. Wire Kit — stays Linked for meter and hail chrome; Overlay is rare. No offensive Wire kit. Will not pay Signal-weird.</p><p><strong>Purchased traits (fiction):</strong> High Senses, Graceful Retreat.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Corp Glamor",
        img: "icons/magic/perception/eye-ringed-green.webp",
        dsid: "corp-glamor",
        html: "<p>Rhen has an edge on Presence tests that use Persuasion. His appearance engages, but he never appears as anyone but himself.</p>",
      }),
      feature({
        id, n: 2,
        name: "Ledger Terms",
        img: "icons/sundries/documents/document-sealed-signatures-red.webp",
        dsid: "ledger-terms",
        html: "<p><strong>Maneuver · social.</strong> Rhen makes a Presence test (Negotiation) against the crew's speaker.</p><ul><li><strong>≤11:</strong> he cools.</li><li><strong>12–16:</strong> +¥1,000, or a cleaner drop.</li><li><strong>17+:</strong> +¥2,000.</li></ul><p>He will not pay Signal-weird at any result.</p>",
        sort: 10,
      }),
      feature({
        id, n: 3,
        name: "Graceful Withdrawal",
        img: "icons/skills/movement/feet-winged-boots-brown.webp",
        dsid: "graceful-withdrawal",
        html: "<p><strong>Triggered.</strong> When Rhen is targeted by a strike or the aisle goes loud, he can shift up to 2 squares, then move toward the cab or the bay. He has an edge on his next Stealth or Deception test this round to break line of sight.</p>",
        sort: 20,
      }),
      feature({
        id, n: 4,
        name: "Call Security",
        img: "icons/commodities/tech/cable-end.webp",
        dsid: "call-security",
        html: "<p><strong>Maneuver · once per scene · noncombat.</strong> Rhen marks the crew for ARG/SAN follow-up. The Director may feed this into the Nightjar heat table. It never spawns the Gold Line roster at Nightjar, and it is not an attack.</p>",
        sort: 30,
      }),
    ],
  },
  {
    proposedId: "gwDhNim00000000",
    token: "nim-token",
    name: "Nim",
    folder: "nightjar",
    castRole: "Buyer — Signal / Hands Off",
    people: "Revenant (former Pure Human)",
    sex: "X",
    organization: "platoon", role: "controller",
    stamina: 30, ev: 6, freeStrike: 2, speed: 5,
    chr: [0, 1, 3, 2, 1],
    keywords: ["humanoid", "undead"],
    immunities: { cold: 1, corruption: 1, lightning: 1, poison: 1 },
    weaknesses: { fire: 5 },
    statusImmunities: ["bleeding"],
    negotiation: [6, 3, 1],
    motivations: ["freedom"],
    pitfalls: ["greed"],
    sort: 300000,
    bio: "<p>Androgynous and slim, ash-brown skin with faint cyan memory seams at the temples and one hand, short uneven black hair, dark eyes ringed in blue-white static. An oversized graphite hooded raincoat with cyan repair stitching, an old single-ear receiver and a throat transceiver, an insulated shopping bag. Uncanny and political — not monstrous.</p><p>Soft and sideways. “Two thousand. And we make the train forget you a little.”</p>",
    director: "<p><strong>Role:</strong> the Signal / Hands Off buyer at Nightjar Market — a frequency more than a chair, often listening from the east <strong>BREAKING NEWS</strong> building. Pays <strong>~¥2,000 + weird</strong> (Trace scrub, a Soft favor, or a SIN forget). Political heat; MER/Signal notice; Mama cool. May never take Iona's seat.</p><p><strong>Drive:</strong> move the wafer into Hands Off custody and deniability. <strong>Pitfall:</strong> corp ¥ matching; painting MER Blacklight; forcing a meat fight in the aisle.</p><p><strong>Posture:</strong> avoids meat. Spoof, scrub, Static, gone. <strong>Retreat:</strong> any sustained meat pressure or fire damage → jack out and leave by the east intersection.</p><p><strong>Secret:</strong> Nim may already be listening on the east crawl before the crew arrives.</p><p><strong>Director tags:</strong> Hacking (Wired edge), Matrix Theory, Stealth, Deception, Insight, Streetwise. Wire Kit + Street Deck fiction; Overlay for the meet, Jacked In only if the body is hidden. Will not match corp ¥.</p><p><strong>Kit by reference</strong> (do not duplicate Items): " + payload("wHt0uT7mAgK3s1cQ", "Whiteout") + " (Trace scrub weird pay) · " + payload("OepS68mz9km9j8EU", "Static") + " (local jam escape).</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Tough But Withered",
        img: "icons/magic/death/hand-undead-skeleton-fire-green.webp",
        dsid: "tough-but-withered",
        html: "<p>Nim has immunity 1 to cold, corruption, lightning, and poison, and fire weakness 5. At negative winded Stamina, Nim is inert rather than dying; fire damage while inert destroys the body. <strong>Bloodless:</strong> Nim can't be made bleeding.</p>",
      }),
      feature({
        id, n: 2,
        name: "Soft Frequency",
        img: "icons/magic/sonic/scream-wail-shout-teal.webp",
        dsid: "soft-frequency",
        html: "<p><strong>Maneuver · social / Wire.</strong> While on Overlay or Jacked In, Nim hushes one runner over Broadcast or Linked, then makes a Presence or Reason test (Deception) to sell Signal terms.</p><ul><li><strong>≤11:</strong> Nim cools.</li><li><strong>12–16:</strong> a weird-package tease — one scrub flavor, still ~¥2,000.</li><li><strong>17+:</strong> a fuller weird package — two of Trace scrub, Soft favor, SIN forget — still ~¥2,000.</li></ul>",
        sort: 10,
      }),
      feature({
        id, n: 3,
        name: "Trace Scrub Offer",
        img: "icons/magic/time/hourglass-tilted-glowing-gold.webp",
        dsid: "trace-scrub-offer",
        html: "<p><strong>Procedure.</strong> If the deal closes, the Director can run one Whiteout-style scrub (" + payload("wHt0uT7mAgK3s1cQ", "Whiteout") + ") on a named host log or on the crew's Trace fiction, moving Trace or logs by hand. This is a farewell weird, not a mid-fight program.</p>",
        sort: 20,
      }),
      feature({
        id, n: 4,
        name: "Static Escape",
        img: "icons/magic/lightning/bolt-strike-blue.webp",
        dsid: "static-escape",
        html: "<p><strong>Main action or maneuver · Wire.</strong> While Connected on Overlay or Jacked In, Nim runs " + payload("OepS68mz9km9j8EU", "Static") + " by reference: suppress one enemy device, camera, smartlink, or watcher ping for a round (a strong result may hit several). Nim then shifts and leaves by the east intersection. A low Wire result is a soft civic scrape, never live-train Trace.</p>",
        sort: 30,
      }),
    ],
  },

  // ----------------------------------------------------- RACK & REST FACES
  {
    proposedId: "gwDhVesperDrift0",
    token: "rack-rest-vesper-drift-token",
    name: "Vesper Drift",
    folder: "rackRest",
    castRole: "Face — primary interrupt (pentagram pod)",
    people: "Unrecorded",
    sex: "X",
    organization: "minion", role: "controller",
    stamina: 4, ev: 3, freeStrike: 1, speed: 5,
    chr: [0, 1, 1, 2, 2],
    keywords: ["humanoid", "human"],
    negotiation: [4, 4, 2],
    sort: 100000,
    bio: "<p>A pale thrift coat over a dark liner, cuffs rubbed bright by too many doors. Vesper sits beside the red circle painted on their coffin-pod floor as if it were a drawer label. Their voice is low, polite, and one degree wrong.</p><p>“Do you sleep close to the rails because you trust the noise, or because you need it to drown the questions?”</p>",
    director: "<p><strong>Role:</strong> the default <strong>primary</strong> patron interrupt at Rack & Rest — grit tactical weird, not slapstick. Social; not a fight.</p><p><strong>If pressed:</strong> “Four coffins. Four warm names. Something under the blue strip is counting the ways a body can leave.” Vesper never gets the Job Stick or a chamber number.</p><p><strong>Exit:</strong> a small nod toward the ritual drawer. “Close what you opened. I will know if the room gets louder.” They retreat into the pod without making the hatch sound.</p><p>The painted circle is set dressing — no ritual rules run on Vesper tonight. Soft rumor or color only; never a free ★. Failure is interrupt heat, not intel.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "One Degree Wrong",
        img: "icons/magic/perception/eye-ringed-green.webp",
        dsid: "one-degree-wrong",
        html: "<p>Vesper's questions land a little too close. A creature who answers one honestly feels watched until the end of the scene; a creature who lies has a bane on their next Presence test against Vesper. The effect is social — it never touches the Job Stick or the job.</p>",
      }),
    ],
  },
  {
    proposedId: "gwDhTamKade0000",
    token: "rack-rest-tam-kade-token",
    name: "Tam Kade",
    folder: "rackRest",
    castRole: "Face — pipe-wrench noise / comedy",
    people: "Unrecorded",
    sex: "X",
    organization: "minion", role: "brute",
    stamina: 5, ev: 3, freeStrike: 1, speed: 5,
    chr: [2, 0, 1, 0, 0],
    keywords: ["humanoid", "human"],
    negotiation: [5, 4, 1],
    sort: 200000,
    bio: "<p>A street Wrench in a thrift jacket, grease-black nails, a fat red pipe wrench held upright like evidence in a trial nobody scheduled. Tam covers nerves with busybody certainty.</p><p>“This was in my pod. Your crew brought the noise, so you can tell me whose noise it is.”</p>",
    director: "<p><strong>Role:</strong> light patron interrupt at Rack & Rest (the pipe-wrench pod) — noise and comedy.</p><p><strong>If pressed:</strong> “I heard a maglock three times. First time was the hotel. Second time was the Wire. Third time knew my name.” Tam trades the story for a hot bowl and an apology.</p><p><strong>Exit:</strong> Tam plants the wrench beside the hatch. “If it moves, I am charging rent.” Then they vanish into the pod, still muttering at the lock.</p><p>Soft rumor or color only; never a free ★.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Trade the Story",
        img: "icons/consumables/food/bowl-ribs-meat-rice-mash-brown-white.webp",
        dsid: "trade-the-story",
        html: "<p>A hot bowl from the Street Food Kiosk and a sincere apology buy Tam's maglock story and end the interrupt. Nothing Tam says is a discovery result.</p>",
      }),
      strike({
        id, n: 2,
        name: "Pipe Wrench",
        img: "icons/tools/hand/wrench-adjustable.webp",
        dsid: "pipe-wrench",
        story: "The fat red wrench from the pod, swung once if the crew starts it.",
        keywords: ["melee", "strike", "weapon"],
        distance: MELEE,
        characteristic: "might",
        tiers: [1, 2, 3],
        sort: 10,
      }),
    ],
  },
  {
    proposedId: "gwDhSeraNix0000",
    token: "rack-rest-sera-nix-token",
    name: "Sera Nix",
    folder: "rackRest",
    castRole: "Face — pink-inflatable comedy",
    people: "Unrecorded",
    sex: "X",
    organization: "minion", role: "support",
    stamina: 4, ev: 3, freeStrike: 1, speed: 5,
    chr: [0, 1, 0, 2, 1],
    keywords: ["humanoid", "human"],
    negotiation: [6, 3, 1],
    sort: 300000,
    bio: "<p>A street Float in damp clothes with bright eyes. When Sera speaks, a pink pool-float ghost keeps trying to sit on their mouth — an Overlay bleed that does not belong in a coffin hotel, absurd and strangely intimate.</p><p>“The float says the room is deeper than it looks.”</p>",
    director: "<p><strong>Role:</strong> light patron interrupt at Rack & Rest (the pink-inflatable pod) — comedy.</p><p><strong>If pressed:</strong> “Noodles make it stop. Or maybe the noodles make me stop noticing.” Sera wants a bowl from the Street Food Kiosk, not a fight and not the wafer.</p><p><strong>Exit:</strong> once bought off, Sera follows the kiosk glow, the floaty fading from face to shoulder. “Tell the red drawer it can keep its secrets.”</p><p>Soft rumor or color only; never a free ★.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Float Ghost",
        img: "icons/magic/water/bubbles-air-water-pink.webp",
        dsid: "float-ghost",
        html: "<p>Anyone on Overlay near Sera sees the pink pool-float ghost riding their speech. It is hotel-chrome bleed, not a live node. A kiosk bowl ends the interrupt.</p>",
      }),
    ],
  },
  {
    proposedId: "gwDhCousinVell0",
    token: "rack-rest-cousin-vell-token",
    name: "Cousin Vell",
    folder: "rackRest",
    castRole: "Face — optional Torc-adjacent social heat",
    people: "Unrecorded",
    sex: "X",
    organization: "minion", role: "harrier",
    stamina: 4, ev: 3, freeStrike: 1, speed: 6,
    chr: [0, 1, 1, 1, 2],
    keywords: ["humanoid", "human"],
    negotiation: [4, 5, 2],
    sort: 400000,
    bio: "<p>Narrow shoulders under a rain-dark Torc scarf, one gold tooth, a smile that arrives before the rest of their face. Vell has already clocked that four coffins came from Mama's direction.</p><p>“No need to show me freight. I can hear it in the way you are not talking about it.”</p>",
    director: "<p><strong>Role:</strong> optional social-heat interrupt at Rack & Rest — Torc-adjacent, friendly only from a distance. Also the Torc / Flats cousin face on the Nightjar heat table (d6 = 4).</p><p><strong>If pressed:</strong> “I want a face, a rumor, or a reason to forget this room. I do not want your prize.” Bluff, buy silence, scare, or eject.</p><p><strong>Exit:</strong> Vell taps two fingers to the table. “We are cousins when it helps. Strangers when it does not.” Then they melt back toward the stairs.</p><p>Vell never grants a free discovery star.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Cousins When It Helps",
        img: "icons/skills/social/diplomacy-handshake-yellow.webp",
        dsid: "cousins-when-it-helps",
        html: "<p>Vell wants a face, a rumor, or a reason to forget the room. Pay one and Vell stays quiet; refuse and the crew picks up Torc-adjacent social heat for a later scene. No ¥ changes hands on the job.</p>",
      }),
    ],
  },
  {
    proposedId: "gwDhJunoHalve00",
    token: "rack-rest-juno-halve-token",
    name: "Juno Halve",
    folder: "rackRest",
    castRole: "Face — check-in desk color",
    people: "Unrecorded",
    sex: "X",
    organization: "minion", role: "support",
    stamina: 4, ev: 3, freeStrike: 1, speed: 5,
    chr: [0, 0, 1, 1, 1],
    keywords: ["humanoid", "human"],
    negotiation: [5, 6, 1],
    sort: 500000,
    bio: "<p>The Rack & Rest night clerk: a vest, chipped silver nail polish, and a check-in terminal that reaches ninety-eight percent, sighs, and forgets itself.</p><p>“Welcome to Rack & Rest. Your drawer is waiting. The terminal is not.”</p>",
    director: "<p><strong>Role:</strong> check-in desk ambience only. Do not turn the desk into another encounter.</p><p><strong>If pressed:</strong> “I do not know your plan. I know the desk, the rent, and which hatch leaks.” Juno points to the Street Food Kiosk without looking up.</p><p><strong>Exit:</strong> the terminal rolls back to its boot glyph; Juno turns the volume down and returns to the void.</p>",
    items: id => [
      feature({
        id, n: 1,
        name: "Ninety-Eight Percent",
        img: "icons/commodities/tech/cable-end.webp",
        dsid: "ninety-eight-percent",
        html: "<p>The check-in terminal never finishes booting. The hotel node behind it is a joke — guest SINs and overdue invoices, nothing worth cracking.</p>",
      }),
    ],
  },
];

// ---------------------------------------------------------------- write

for (const folder of Object.values(FOLDERS)) {
  write(join(OUT, folder.dir, "_folder.json"), {
    _id: folder._id,
    _key: `!folders!${folder._id}`,
    name: folder.name,
    type: "Actor",
    folder: null,
    sort: folder.sort,
    flags: {},
    color: folder.color,
    description: "",
    sorting: "m",
  });
}

const built = ROSTER.map(entry => ({ entry, actor: castActor(entry) }));

const seen = new Set();
for (const { entry, actor } of built) {
  const ids = [actor._id, ...actor.items.map(i => i._id), ...actor.effects.map(e => e._id)];
  const bad = ids.filter(id => !/^[A-Za-z0-9]{16}$/.test(id));
  if (bad.length) throw new Error(`${entry.token} bad ids: ${bad.join(", ")}`);
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`${entry.token} duplicate id: ${id}`);
    seen.add(id);
  }
  const slug = entry.token.replace(/^rack-rest-/, "").replace(/-token$/, "");
  write(join(OUT, FOLDERS[entry.folder].dir, `${slug}.json`), actor);
}

console.log(`Deadhead cast -> ${OUT}\n`);
for (const { entry, actor } of built) {
  const kit = actor.items.some(i => i.system?._dsid === "wire-kit-matrix-verbs") ? "WIRED" : "meat ";
  console.log(
    `${entry.name.padEnd(14)} ${actor._id}  ${kit}  L1 ${entry.organization.padEnd(7)} `
    + `${entry.role.padEnd(10)} sta=${String(entry.stamina).padEnd(3)} ev=${String(entry.ev).padEnd(2)} ${entry.castRole}`
  );
}
console.log(`\n${built.length} Actors written.`);
