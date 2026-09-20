// Random node tables for the Wired Console (B23c). Pure flavor on top of the System Stat Card:
// the generator picks a stratum, a node type, and an owner; Rating (and so every stat) follows from docs/rulebook/08-hacker.md.
// Description = what runners see on Scan (shared to chat on reveal). Notes = Director-only: what's buried inside, how it fights.
// Setting: Ossian Reach strata (Halo → Spires → Grid → Flats → Warrens → Sinks) and the Twelve Conglomerates.

/** Strata the Director can generate for. `ratings` bounds every node rolled there. */
export const STRATA = {
  spires: { ratings: [3, 5] },
  grid: { ratings: [2, 4] },
  flats: { ratings: [1, 3] },
  warrens: { ratings: [1, 3] },
  sinks: { ratings: [1, 2] },
};

/** Who owns the node, and how that owner skins its icons. `bias` nudges the Rating. */
const OWNERS = [
  { name: "HALO Ascendant", strata: ["spires"], bias: 1, skin: [
    "It wears HALO Ascendant’s signature: a thin ring of white light hovering over the icon like a crown.",
    "Everything about it is HALO Ascendant-clean: pale gold light, no seams, a ring sigil turning slowly overhead.",
  ] },
  { name: "Argent Exchange", strata: ["spires", "grid"], bias: 1, skin: [
    "Argent Exchange skins it in polished silver, with live price tickers scrolling around its base.",
    "A silver Argent Exchange mark is stamped on every surface, and every access attempt is quietly billed.",
  ] },
  { name: "Caduceus", strata: ["spires", "grid"], bias: 0, skin: [
    "Caduceus renders it in sterile white and soft teal, with a twin-serpent sigil pulsing like a heartbeat.",
    "It carries the Caduceus sigil and a calm, clinical chime that sounds whenever a Persona gets close.",
  ] },
  { name: "Ferrum Dynastic", strata: ["spires", "grid", "flats"], bias: 1, skin: [
    "Ferrum Dynastic built it heavy: riveted iron plating, forge-red seams, and a dynastic crest cast into the frame.",
    "The icon is blackened iron under Ferrum Dynastic’s crest, old and overbuilt, like the Reach’s foundations.",
  ] },
  { name: "Obsidian Holdings", strata: ["spires", "grid"], bias: 1, skin: [
    "Obsidian Holdings skins it in black volcanic glass that shows your Persona’s reflection a half-second late.",
    "It is a slab of polished obsidian with no visible markings. You only know the owner by the silence around it.",
  ] },
  { name: "Radiant Concord", strata: ["spires", "grid"], bias: 0, skin: [
    "Radiant Concord bathes it in warm, even light, with soothing public-service slogans drifting across its face.",
    "It glows with Radiant Concord’s sunburst sigil, bright enough that the Wired around it looks dim.",
  ] },
  { name: "Ironclad", strata: ["spires", "grid", "flats"], bias: 1, skin: [
    "Ironclad security branding everywhere: gunmetal plates, hazard chevrons, and a contractor ID stenciled on the side.",
    "It is skinned like riot armor in Ironclad gunmetal, with a patrol-response timer counting quietly in one corner.",
  ] },
  { name: "Nyx Cartel", strata: ["grid", "flats", "warrens", "sinks"], bias: 0, skin: [
    "The Nyx Cartel skins it in violet smoke, with a crescent-moon sigil that turns to watch whoever passes.",
    "It looks like a cheap front until you look twice. Then the Nyx Cartel’s crescent surfaces in the static.",
  ] },
  { name: "Municipal Authority", strata: ["grid", "flats"], bias: 0, skin: [
    "It is a flat gray monolith stamped with the civic seal, with a queue number ticking over its head.",
    "It wears the Reach’s civic gray, utilitarian and slightly out of date, and plays a looping compliance notice.",
  ] },
  { name: "a Flats gang", strata: ["flats", "warrens", "sinks"], bias: -1, skin: [
    "Gang tags crawl across its surface like living graffiti, bright, territorial, and redrawn every night.",
    "Someone has skinned it in neon gang colors and a snarling mascot that barks at unfamiliar Personas.",
  ] },
  { name: "a Sinks fixer", strata: ["flats", "warrens", "sinks"], bias: -1, skin: [
    "It is patched together from stolen icons, a corp logo here and a dead brand there, held with glowing staples.",
    "A fixer’s handmade skin: a lantern-lit stall of hanging charms, each one a door to somewhere else.",
  ] },
  { name: "no one, anymore", strata: ["warrens", "sinks"], bias: -1, skin: [
    "Nobody has maintained it in years. The icon is faded, pixel-rotted, and missing whole pieces.",
    "Its owner’s sigil has been scratched out. What is left flickers like a dying fluorescent tube.",
  ] },
];

/**
 * Node types. `strata` limits where the type appears; `ratings` bounds its Rating before the owner bias.
 * `icons` and `uses` go into the Description; `secrets` go into the Director's Notes.
 */
const NODE_TYPES = [
  // ---------- Track 1: objects, systems, infrastructure ----------
  { names: ["Maglock", "Blast Door", "Service Hatch", "Security Gate"], track: 1, ratings: [1, 3], strata: ["spires", "grid", "flats", "warrens", "sinks"],
    icons: ["A padlock of red light spins its tumblers whenever someone walks past.", "A heavy vault-door glyph, its bolts glowing amber, hangs where the door sits in meatspace."],
    uses: ["Seize Control opens, seals, or jams the door. Ping makes it clunk and flash, which is a good distraction.", "Seize Control can lock it behind the crew or trap a patrol on the wrong side."],
    secrets: ["The access log shows a keycard that was used at 3 a.m. and doesn’t belong to any employee.", "Wired to a silent alarm: a low result on Seize Control also pings a patrol two floors away."] },
  { names: ["Security Camera", "Camera Net", "Drone Eye Relay"], track: 1, ratings: [1, 4], strata: ["spires", "grid", "flats"],
    icons: ["An unblinking eye follows passing Personas a little too closely.", "A ring of lenses orbits a slowly turning prism, each one a live feed."],
    uses: ["Seize Control loops the feed, blinds it, or swings it away. Search pulls the last hour of footage.", "Seize Control can feed it a still frame. Search finds which other cameras share its uplink."],
    secrets: ["The footage shows someone else already cased this place yesterday.", "One of the feeds isn’t security. Someone is streaming it to a private buyer."] },
  { names: ["Streetlight Grid", "Neon Sign Bank", "Lighting Array"], track: 1, ratings: [1, 2], strata: ["grid", "flats", "warrens", "sinks"],
    icons: ["A lattice of sodium-orange nodes is strung across the block like beads on a wire.", "A tangle of neon tubes hums in the Wired, each one flickering to a different beat."],
    uses: ["Seize Control kills the lights on the block or strobes them. Ping flickers a single lamp as a signal.", "Seize Control blacks out one street or throws a message across every sign."],
    secrets: ["The grid’s maintenance tunnel map shows a route no one has walked in a decade.", "A gang uses flicker patterns on this grid to signal that a patrol is coming."] },
  { names: ["Holo-Billboard", "Vending Kiosk", "Ad Drone"], track: 1, ratings: [1, 2], strata: ["grid", "flats"],
    icons: ["A holo-ad loops a smiling mascot whose grin glitches if you watch too long.", "A cheerful kiosk icon is shouting deals, with a queue of payment glyphs trailing behind it."],
    uses: ["Seize Control hijacks the screen for a message or a distraction. Search pulls recent card taps and faces.", "Seize Control makes it dispense, scream, or broadcast whatever the crew wants."],
    secrets: ["Its payment logs include a SIN that the crew’s target used an hour ago.", "It is also a Nyx Cartel dead drop, with a coded message waiting in the ad rotation."] },
  { names: ["Elevator Control", "Tram Switch", "Freight Lift"], track: 1, ratings: [2, 4], strata: ["spires", "grid", "flats"],
    icons: ["A column of stacked floor glyphs pulses on the current floor.", "A switching diagram of glowing rails shows every car as a moving bead of light."],
    uses: ["Seize Control calls, stops, or locks a car between floors. Search shows which stops need clearance.", "Seize Control reroutes a car, which can strand pursuers or pick up the crew."],
    secrets: ["There is an unlisted stop between two floors that isn’t on any building plan.", "An executive override is baked in, and using it pings their personal assistant."] },
  { names: ["Power Substation", "Backup Generator", "Grid Transformer"], track: 1, ratings: [2, 4], strata: ["grid", "flats", "sinks"],
    icons: ["A humming cube of blue arcs, each circuit a thread of light.", "An old transformer icon crackles, throwing sparks of corrupted data."],
    uses: ["Seize Control blacks out a section. Search maps what stays on backup power.", "Seize Control can overload a line, loudly and effectively."],
    secrets: ["Half the block’s power is being siphoned off to something unregistered below.", "Cutting power here also kills the life support in a clinic next door."] },
  { names: ["Smartgun Link", "Guard’s Commlink", "Cyberarm Interface"], track: 1, ratings: [1, 3], strata: ["spires", "grid", "flats", "sinks"],
    icons: ["A small crosshair glyph rides on a guard’s shoulder, blinking in time with their pulse.", "A thin wireless tether runs from a person’s chrome, labeled with a service-plan number."],
    uses: ["Seize Control locks the trigger or feeds its smartlink bad targeting. Ping chirps a low-ammo warning.", "Seize Control can mute their comms or make their chrome stutter for a moment."],
    secrets: ["The guard’s commlink holds tonight’s patrol rotation and a passcode.", "The owner is moonlighting. Their messages show they would take a bribe."] },
  { names: ["Automated Turret", "Sentry Gun", "Security Drone"], track: 1, ratings: [2, 4], strata: ["spires", "grid"],
    icons: ["A tight red targeting cone sweeps back and forth, humming with barely restrained intent.", "A drone icon hovers in lazy circles, its IFF tag glowing."],
    uses: ["Seize Control swaps its IFF so it holds fire, or picks new targets.", "Seize Control parks it, turns it, or points it at the door the enemy is coming through."],
    secrets: ["Its IFF whitelist includes a name that should have been deleted when they were fired.", "Firmware is out of date, so the first low result makes it lock up instead of raising Alert."] },
  { names: ["Climate Control", "Fire Suppression", "Air Scrubber"], track: 1, ratings: [1, 3], strata: ["spires", "grid", "flats", "warrens"],
    icons: ["A slow-breathing lung of cool blue vapor, with vents marked as small sighs.", "A web of red valves is waiting for a single spark."],
    uses: ["Seize Control floods a room with heat, cold, or suppression foam.", "Seize Control seals the vents or triggers a false fire alarm that clears the floor."],
    secrets: ["The scrubber logs show someone is sleeping in the ducts.", "Suppression here uses gas, not foam. Triggering it is lethal to anyone unmasked."] },
  { names: ["Delivery Drone Hive", "Parcel Locker", "Courier Dock"], track: 1, ratings: [1, 3], strata: ["grid", "flats"],
    icons: ["A buzzing honeycomb of little drone icons comes and goes in bright trails.", "A wall of locker glyphs flickers open and closed as parcels land."],
    uses: ["Seize Control grounds the drones, opens a locker, or sends a parcel to a new address.", "Seize Control scrambles delivery routes and fills the street with confused drones."],
    secrets: ["One locker has been rented under a fake SIN for a year and has never been opened.", "The hive is carrying Nyx Cartel packages marked as medical supplies."] },

  // ---------- Track 2: ICE, hostile Personas, defended hosts ----------
  { names: ["Corp Host", "Executive Server", "Archive Core"], track: 2, ratings: [3, 5], strata: ["spires", "grid"],
    icons: ["A mirrored tower that reflects your Persona back at you, subtly wrong.", "A vast geometric cathedral whose windows are rows of scrolling records."],
    uses: ["Bring its Integrity to 0 to reach the systems it protects. Search inside finds paydata.", "It holds the keys to every Track 1 node on the floor. Dropping it opens them all to Seize Control."],
    secrets: ["Paydata: a shipping manifest that proves a rival conglomerate is being robbed from inside.", "Paydata: personnel files, including one of the crew’s own contacts on the payroll."] },
  { names: ["Security Hub", "Spider Nest", "Watch Station"], track: 2, ratings: [2, 4], strata: ["spires", "grid", "flats"],
    icons: ["A web of silver threads with every camera and lock on the floor hanging from it.", "A cold command desk where every alarm in the building rings as a tiny bell."],
    uses: ["While it stands, breaching any linked node raises its Trace Alert. At 0 Integrity, linked doors and cameras go quiet.", "It watches the building. Take it down and the Track 1 nodes around it lose their backup."],
    secrets: ["A live security decker sits behind it and jacks out to call a response team if it drops below half Integrity.", "It has a lazy admin account with a reused password written in the notes field."] },
  { names: ["Black ICE Sentry", "Hunter-Killer ICE", "Tar Pit"], track: 2, ratings: [3, 5], strata: ["spires", "grid"],
    icons: ["A black hound of static paces a slow circle, and the Wired around it goes quiet.", "A pool of liquid shadow that doesn’t reflect anything, and doesn’t move until it does."],
    uses: ["It hunts Personas once the Trace Alert reaches 9. Breaching near it risks biofeedback.", "It guards another node. Getting past it without dropping it takes a very quiet run."],
    secrets: ["It was coded by a decker the crew knows, and it has a back door they left for themselves.", "It doesn’t just bite. It records the Persona signature of anyone it hits and sells it."] },
  { names: ["Rival Decker", "Corp Persona", "Freelance Ghost"], track: 2, ratings: [2, 5], strata: ["spires", "grid", "flats", "sinks"],
    icons: ["A masked figure in a coat of scrolling code watches you from across the node.", "A Persona made of cut-up faces rearranges itself mid-sentence."],
    uses: ["It contests the crew’s Programs and hits back. It might talk before it fights.", "It is after the same target. Taking it down is one option. Making a deal is another."],
    secrets: ["It is working for the same fixer who hired the crew.", "It is jacked in from a body two blocks away that isn’t well guarded."] },
  { names: ["Black-Market Host", "Data Haven", "Rumor Mill"], track: 2, ratings: [1, 3], strata: ["flats", "warrens", "sinks"],
    icons: ["A neon bazaar tent crowded with anonymous Personas trading whispers.", "A drowned library: shelves of files floating in dark water."],
    uses: ["Search finds contacts, fences, and rumors. Breaching it makes enemies of its owners.", "Its visitors trade information. A crew that plays nice here can buy intel instead of stealing it."],
    secrets: ["Someone is selling the crew’s names here, right now.", "A corp spy is running a honeypot out of one of the stalls."] },
  { names: ["Rogue AI Fragment", "Ghost Signal", "Orphan Process"], track: 2, ratings: [2, 5], strata: ["grid", "flats", "warrens", "sinks"],
    icons: ["A flock of paper birds reassembles into a face whenever it is watched.", "A child’s drawing of a person, redrawn over and over in fading crayon light."],
    uses: ["It can be bargained with instead of breached, if the crew has something it wants.", "It follows Personas it likes. It tends to be very bad news for Personas it doesn’t."],
    secrets: ["It is a fragment of a decker who flatlined here and never fully left.", "Obsidian Holdings is hunting for it and pays well for its location."] },
  { names: ["Gang Stash Server", "Crew Board", "Turf Beacon"], track: 2, ratings: [1, 3], strata: ["flats", "warrens", "sinks"],
    icons: ["A spray-painted skull that bares its teeth when a stranger connects.", "A wall of polaroid icons, each one a member, a debt, or a threat."],
    uses: ["Search reveals the gang’s runs, debts, and hideouts. Breaching it loudly starts a turf war.", "It tracks every commlink on the gang’s turf, including the crew’s."],
    secrets: ["The gang owes the Nyx Cartel more than it can ever pay.", "One of the members is informing for Ironclad."] },
  { names: ["Municipal Records", "SIN Registry Node", "Transit Authority Host"], track: 2, ratings: [2, 3], strata: ["grid", "flats"],
    icons: ["A flat gray monolith stamped with a civic seal and a ‘please wait’ banner.", "An endless filing cabinet whose drawers open by themselves, very slowly."],
    uses: ["Search pulls SIN records, permits, and addresses. Editing a record takes a clean breach.", "Dropping it lets the crew erase a warrant, or add one."],
    secrets: ["The crew’s target has three SINs registered here, and one of them is dead.", "Its audit trail is monitored by a Radiant Concord compliance bot."] },
  { names: ["Dead Relay", "Signal Hole", "Buried Node"], track: 2, ratings: [1, 2], strata: ["warrens", "sinks"],
    icons: ["A black spot in the Wired where static swallows light and sound.", "A half-buried antenna icon hums a song in no language anyone knows."],
    uses: ["There is no Signal here without it. Holding it gives the crew a working uplink in the Sinks.", "Breaching it lights up the Wired for a block, for everyone, including whatever is listening down here."],
    secrets: ["Something in the deep dark uses this relay to listen, and it has noticed the crew.", "Ferrum Dynastic still pays for its upkeep through a shell company."] },
];

const pick = list => list[Math.floor(Math.random() * list.length)];
const between = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Roll one random node for a stratum ("random" picks one per node).
 * @param {string} stratum  Key of STRATA, or "random".
 * @returns {{ name: string, track: 1|2, rating: number, description: string, notes: string }}
 */
export function rollNode(stratum = "random") {
  const key = STRATA[stratum] ? stratum : pick(Object.keys(STRATA));
  const bounds = STRATA[key].ratings;
  const type = pick(NODE_TYPES.filter(t => t.strata.includes(key)));
  const owner = pick(OWNERS.filter(o => o.strata.includes(key)));
  const rating = clamp(between(...type.ratings) + owner.bias, bounds[0], bounds[1]);

  const name = `${pick(type.names)} ${between(1, 9)}${pick("ABCDEFGHKMNPRX")}`;
  const description = `${pick(type.icons)} ${pick(owner.skin)}\n\n${pick(type.uses)}`;
  const owned = owner.name.startsWith("no one") ? "Owner: none" : `Owner: ${owner.name}`;
  const notes = `${owned}.\nBuried inside: ${pick(type.secrets)}`;
  return { name, track: type.track, rating, description, notes };
}
