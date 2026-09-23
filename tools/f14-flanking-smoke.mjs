#!/usr/bin/env node
/**
 * F14 smoke (0.3.117): Flanking — one edge, melee strikes only, auto-detected from token positions.
 *
 * The geometry in scripts/flanking.mjs is Foundry-free by design, so this runs the real rule rather
 * than a paraphrase of it: every token below is the `{x, y, width, height}` shape a TokenDocument
 * carries, on a 100px grid, and `isFlanked` is the same function the marker and the roll edge call.
 *
 * Run: node tools/f14-flanking-smoke.mjs
 * Does not need live Foundry.
 */
import { readFileSync } from "node:fs";
import {
  FLANKED_ID,
  FLANKED_STATUS,
  FLANKING_EDGES,
  NON_FLANKING_STATUSES,
  cannotBeFlanked,
  centreSquare,
  flankingEdges,
  isAdjacent,
  isFlanked,
  isMeleeStrike,
  isNonFlankingBody,
  occupiedSquares,
  onOppositeSides,
} from "../scripts/flanking.mjs";
import { COVER_CONCEAL_ID, COVER_CONCEAL_STATUS } from "../scripts/cover-conceal.mjs";
import { atLeast } from "./lib/module-version.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const module = JSON.parse(readFileSync("module.json", "utf8"));
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const src = readFileSync("scripts/flanking.mjs", "utf8");
const boot = readFileSync("scripts/module.mjs", "utf8");
const combat = readFileSync("docs/raw/04-combat.md", "utf8");

/** A token document on a 100px grid, addressed by grid square rather than by pixel. */
const at = (col, row, size = 1) => ({ x: col * 100, y: row * 100, width: size, height: size });

console.log("F14 Flanking smoke (0.3.117)\n");

console.log("1) Ship surface");
note(atLeast(module.version, "0.3.117"), `module.json is >= 0.3.117 (got ${module.version})`);
note(boot.includes("registerFlanking()"), "module.mjs registers registerFlanking");
note(boot.includes('import { registerFlanking } from "./flanking.mjs"'), "and imports it");

console.log("\n2) One edge, and only one");
note(FLANKING_EDGES === 1, `exactly one edge (got ${FLANKING_EDGES})`);
note(flankingEdges({ melee: true, flanked: true }) === 1, "melee strike on a flanked target: 1 edge");
note(flankingEdges({ melee: true, flanked: false }) === 0, "melee strike on an unflanked target: no edge");
note(flankingEdges({ melee: false, flanked: true }) === 0, "RANGED at a flanked target: no edge");
note(flankingEdges({ melee: false, flanked: false }) === 0, "ranged at an unflanked target: no edge");
note(flankingEdges({}) === 0, "no arguments: no edge");
note(flankingEdges({ melee: true, flanked: true, alreadyGranted: true }) === 0,
  "Draw Steel already granted it: Ghostwire adds nothing — the edge is never counted twice");

console.log("\n3) Melee, decided from the ability");
note(isMeleeStrike({ distanceType: "melee", keywords: ["melee", "strike", "weapon"] }), "a Ghostwire melee weapon is a melee strike");
note(!isMeleeStrike({ distanceType: "ranged", keywords: ["ranged", "strike", "weapon"] }), "a gun is not");
note(isMeleeStrike({ keywords: ["melee", "strike"] }), "the melee keyword alone is enough");
note(!isMeleeStrike({ distanceType: "melee", keywords: ["melee", "area"] }),
  "a melee AREA ability is not a strike — RAW says melee strikes");
note(!isMeleeStrike({ distanceType: "melee", keywords: ["melee"] }), "nor is a melee utility ability");
note(!isMeleeStrike({ distanceType: "meleeRanged", keywords: ["melee", "ranged", "strike"] }),
  "a melee-AND-ranged weapon does NOT auto-edge — the use pipeline never says which mode was picked");
note(!isMeleeStrike({ distanceType: "self", keywords: ["strike"] }), "a self-targeted ability is not a melee strike");
note(!isMeleeStrike({}) && !isMeleeStrike(), "nothing-shaped is not a melee strike");

console.log("\n4) The grid");
note(occupiedSquares(at(5, 5)).length === 1, "a size-1 token holds one square");
note(occupiedSquares(at(5, 5, 2)).length === 4, "a Large token holds four");
note(centreSquare(at(5, 5)).col === 5 && centreSquare(at(5, 5)).row === 5, "a size-1 centre is its square");
note(centreSquare(at(5, 5, 2)).col === 5.5, "a Large centre sits on the half-square between them");
note(isAdjacent(at(4, 5), at(5, 5)), "orthogonally adjacent");
note(isAdjacent(at(4, 4), at(5, 5)), "diagonally adjacent");
note(!isAdjacent(at(3, 5), at(5, 5)), "two squares away is not adjacent");
note(!isAdjacent(at(5, 5), at(5, 5)), "a token is not adjacent to itself");

console.log("\n5) Opposite sides — the brief's acceptance list");
const target = at(5, 5);
const flank = (a, b, rest = {}) => isFlanked({ target, attacker: a, allies: [b], ...rest });
note(flank(at(4, 5), at(6, 5)), "W + E: opposite cardinal → flanked");
note(flank(at(5, 4), at(5, 6)), "N + S: opposite cardinal → flanked");
note(flank(at(4, 4), at(6, 6)), "NW + SE: opposite diagonal → flanked");
note(flank(at(6, 4), at(4, 6)), "NE + SW: opposite diagonal → flanked");
note(!flank(at(4, 5), at(5, 4)), "W + N: adjacent but not opposite → NOT flanked");
note(!flank(at(4, 4), at(4, 6)), "NW + SW: same side, two corners → NOT flanked");
note(!flank(at(4, 5), at(4, 5)), "two bodies in the same square are not two sides");
note(!flank(at(4, 5), at(7, 5)), "an ally on the right line but out of reach does not flank");
note(!flank(at(3, 5), at(6, 5)), "an attacker who is not adjacent is not flanking anything");
note(!isFlanked({ target, attacker: at(4, 5), allies: [] }), "an attacker with nobody opposite is not flanking");
note(isFlanked({ target, attacker: at(4, 5), allies: [at(5, 4), at(6, 6), at(6, 5)] }),
  "one opposite pair inside a crowd is enough");
note(!isFlanked({ target, attacker: at(4, 5), allies: [at(5, 4), at(5, 6), at(4, 4)] }),
  "a three-token wedge with no opposite pair is not a flank");
note(!isFlanked({ target, attacker: at(4, 5), allies: [at(6, 5)], canBeFlanked: false }),
  "cannotBeFlanked / Prehensile: geometry is perfect and there is still no flank");
note(!isFlanked({ target: null, attacker: at(4, 5), allies: [at(6, 5)] }), "no target, no flank");
note(!isFlanked({}) && !isFlanked(), "nothing-shaped is not a flank");

// Large bodies use the centre of the squares they occupy, as the brief asks. An even-sided token's
// centre lands on a half-square, so a Large ally flanks when the line through the target really does
// pass through both centres — the honest cost of the simple test, and it is asserted, not assumed.
const bigAlly = at(6, 4, 2);
note(isAdjacent(bigAlly, target), "a Large ally is adjacent from any square it spans");
note(onOppositeSides(target, at(4, 6), bigAlly), "and holds the far side when its centre is on the line");

console.log("\n6) Who is not holding a side");
note(NON_FLANKING_STATUSES.includes("dead"), "a defeated body does not flank");
note(NON_FLANKING_STATUSES.includes("unconscious"), "nor an unconscious one");
note(NON_FLANKING_STATUSES.includes("ghostwire-meat-inert"),
  "nor a Rigger's meat body left standing while its owner is Jumped In");
note(isNonFlankingBody(["ghostwire-meat-inert"]), "isNonFlankingBody reads a status set");
note(isNonFlankingBody(new Set(["dead", "prone"])), "and a real Set");
note(!isNonFlankingBody(["prone", "grabbed"]), "prone and grabbed still hold a side");
note(!isNonFlankingBody([]) && !isNonFlankingBody(), "an empty / absent status set is a live body");
note(cannotBeFlanked({ flags: { "draw-steel-ghostwire": { cannotBeFlanked: true } } }), "the Ghostwire flag reads");
note(!cannotBeFlanked({ flags: { "draw-steel-ghostwire": { cannotBeFlanked: false } } }), "and reads false");
note(!cannotBeFlanked({}) && !cannotBeFlanked(), "an actor with no flags can be flanked");
note(src.includes("canBeFlanked") && src.includes("system.statuses.flankable"),
  "it rides Draw Steel's own canBeFlanked / statuses.flankable rather than inventing a second gate");

console.log("\n7) The computed marker — not a player toggle");
note(FLANKED_ID === "ghostwire-flanked", `status id is ${FLANKED_ID}`);
note(FLANKED_STATUS._id.length === 16, `_id is exactly 16 characters (got "${FLANKED_STATUS._id}", ${FLANKED_STATUS._id.length})`);
note(/^[A-Za-z0-9]+$/.test(FLANKED_STATUS._id), "_id is a plain alphanumeric document id");
note(FLANKED_STATUS.name === "GHOSTWIRE.Flanking.Label", "the status name is a lang key");
note(FLANKED_ID !== COVER_CONCEAL_ID, "the id does not collide with F13 Cover/Conceal");
note(FLANKED_STATUS._id !== COVER_CONCEAL_STATUS._id, "nor does the _id");
note(src.includes("hud: false"), "it is kept out of the token HUD palette — a player cannot claim a flank");
note(src.includes("game.user.isGM"), "and only the GM writes it");
note(/Hooks\.on\("updateToken"/.test(src), "it recomputes when a token moves");
note(/Hooks\.on\("deleteToken"/.test(src) && /Hooks\.on\("createToken"/.test(src), "and when tokens come and go");
note(/Hooks\.on\("(createActiveEffect|deleteActiveEffect)"/.test(src), "and when a body drops or wakes");
note(src.includes("setTimeout"), "moves are debounced into one recompute, not one per token");

console.log("\n8) The seam, shared with F13");
note(src.includes("getTargetModifiers"), "the edge rides AbilityModel#getTargetModifiers, like Cover/Conceal");
note(src.includes("modifiers.edges += edges"), "it adds edges to that per-target bag");
note(src.includes("systemGrantedFlank"), "and checks whether the system already granted the edge first");
note(!/modifiers\.banes/.test(src), "F14 never touches banes — that is F13's direction");

console.log("\n9) Lang");
const L = lang.GHOSTWIRE.Flanking;
note(!!L, "GHOSTWIRE.Flanking exists");
note(typeof L?.Label === "string" && L.Label.length > 0, "the marker has a label");
note(typeof L?.Settings?.Marker?.Name === "string", "the marker setting has a name");
note(/not a toggle/i.test(L?.Settings?.Marker?.Hint ?? ""), "and a hint that says it is computed, not toggled");
note(/edge applies either way/i.test(L?.Settings?.Marker?.Hint ?? ""), "and that turning the marker off does not turn the rule off");

console.log("\n10) RAW");
note(/two allies stand on opposite sides of a target/.test(combat), "the player-facing flanking sentence is unchanged");
note(/north–south, east–west, or either diagonal/.test(combat), "RAW spells out what opposite sides means");
note(/Ranged strikes never gain the flanking edge/.test(combat), "and that ranged never gets it");
note(/Prehensile Mutation/.test(combat), "and names the can't-be-flanked case");
note(/f14-flanking\.md/.test(combat), "and points at the director note");

console.log("\n11) Director note");
const director = readFileSync("docs/directors/f14-flanking.md", "utf8");
note(director.length > 1500, "docs/directors/f14-flanking.md exists and is not a stub");
note(/auto-detect/i.test(director), "the note says it is auto-detected");
note(/melee/i.test(director) && /ranged/i.test(director), "and which attacks get it");
note(/cannotBeFlanked/.test(director), "and names the Director flag");
note(/meat-inert/i.test(director), "and the meat-inert body rule");

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
