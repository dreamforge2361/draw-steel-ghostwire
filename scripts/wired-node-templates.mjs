// Wired node Director templates (B32 Phase 5): the System Stat Card by Node Rating, and ten preset nodes built from it.
// RATING is the single source of truth for the Wired Console (scripts/wired-console.mjs) and these templates.
// Rules: docs/rulebook/08-hacker.md (System Stat Card). Director reference: docs/directors/wired-node-templates.md.
// Track 1 (objects/systems) uses only Rating, Description, Breach DC, and Alert: no Integrity pool, ICE, or biofeedback.
// Track 2 (defended nodes, ICE, rival Personas) uses the full card.

/** System Stat Card, indexed by Node Rating 1–5. */
export const RATING = {
  1: { integrity: 12, breachDC: 10, biofeedback: 3, ice: "1 passive layer" },
  2: { integrity: 18, breachDC: 12, biofeedback: 5, ice: "2 passive layers" },
  3: { integrity: 26, breachDC: 15, biofeedback: 8, ice: "Passive + 1 active ICE" },
  4: { integrity: 36, breachDC: 17, biofeedback: 13, ice: "Passive + 2 active ICE; biofeedback on a failed breach" },
  5: { integrity: 50, breachDC: 19, biofeedback: 22, ice: "Full active ICE suite; automatic counter-trace on any high (17+) roll against it" },
};

// Player-facing Description (what a Scan shows; shared to chat on reveal) and Director Notes, by Track and Rating.
const TRACK1 = {
  1: {
    description: "A street-grade system: a cheap maglock, a lobby camera, a vending kiosk. Its security is a factory default nobody changed.",
    notes: "Breach DC 10. One power roll breaches and acts on it in the same activation; a low (≤11) result raises Trace Alert as usual.",
  },
  2: {
    description: "A professional-grade system: a keycard door, a parking-garage camera loop, a building’s lighting grid. Patched, logged, and mostly ignored.",
    notes: "Breach DC 12. Single power roll, no Integrity pool. Logged access means a low (≤11) result is noticed sooner.",
  },
  3: {
    description: "A restricted system: a secure-floor door, a corp elevator bank, a monitored camera net. Access attempts leave audit trails.",
    notes: "Breach DC 15. Single power roll. A good anchor for a heist beat: the door is Track 1, but the host watching it may be a Track 2 node.",
  },
  4: {
    description: "A military-grade system: a vault door, perimeter turrets on safe mode, a blast-shutter network. Hardened and watched in real time.",
    notes: "Breach DC 17. Single power roll, but treat every low (≤11) result as loud. Pair with a Rating 3–4 Track 2 host if it should fight back.",
  },
  5: {
    description: "An alpha-corp system: a core vault, an arcology lockdown grid, a sealed data-archive door. Nothing about it is off the shelf.",
    notes: "Breach DC 19. Single power roll. There is no ICE on the object itself; if the table needs a fight, the Rating 5 Track 2 host behind it provides one.",
  },
};
const TRACK2 = {
  1: {
    description: "A street-grade host: a bodega’s back-office server or a gang’s repeater, wrapped in one thin, passive firewall.",
    notes: "One passive ICE layer. Integrity 12; biofeedback 3 if something bites back. A soft target for a first Program.",
  },
  2: {
    description: "A professional host: a clinic records server or a small business network, sitting behind two passive layers.",
    notes: "Two passive ICE layers. Integrity 18; biofeedback 5. Nothing actively hunts yet, but the logs are reviewed.",
  },
  3: {
    description: "A corp departmental host with one active ICE construct patrolling behind its passive barrier.",
    notes: "Passive layer + 1 active ICE. Integrity 26; biofeedback 8 (12 Jacked In). The worked example host from 08-hacker.md.",
  },
  4: {
    description: "A secure corp host: layered passive barriers and two active ICE constructs that respond to intrusion within moments.",
    notes: "Passive + 2 active ICE; biofeedback on a failed breach. Integrity 36; biofeedback 13. Failed breaches hurt the runner, not just the Alert track.",
  },
  5: {
    description: "An alpha-corp core: a full active ICE suite that answers any serious intrusion with a counter-trace.",
    notes: "Full active ICE suite; automatic counter-trace on any high (17+) roll against it. Integrity 50; biofeedback 22 (33 Jacked In). Plan the exit before the entry.",
  },
};

/** The ten Director templates: Track 1 and Track 2 at Node Rating 1–5. */
export const NODE_TEMPLATES = [1, 2].flatMap(track => [1, 2, 3, 4, 5].map(rating => {
  const card = RATING[rating];
  const text = (track === 1 ? TRACK1 : TRACK2)[rating];
  return {
    id: `node-t${track}-r${rating}`,
    name: `Track ${track} Node · Rating ${rating}`,
    track,
    rating,
    integrityMax: (track === 2) ? card.integrity : null,
    biofeedback: (track === 2) ? card.biofeedback : null,
    ice: (track === 2) ? card.ice : null,
    breachDC: card.breachDC,
    description: text.description,
    notes: text.notes,
  };
}));
