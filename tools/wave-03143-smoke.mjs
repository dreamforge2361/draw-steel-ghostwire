#!/usr/bin/env node
/**
 * 0.3.143 wave smoke — the node applet's ICE package.
 *
 *   A  **Never silent Stamina.** Every bite the applet spots ends in a Director confirm card, and
 *      every Apply goes back through the 0.3.142 pipeline. `scripts/wired-ice.mjs` writes no
 *      Stamina of its own, imports the shared helpers rather than re-typing the arithmetic, and
 *      refuses to raise a card at all for a Linked or Disconnected runner.
 *   B  **The four triggers, as predicates.** Low (≤11) vs active ICE at R3+, a failed breach under
 *      a Rating 4+ host's Breach DC, the Alert 9–11 hunt bite at end of turn, the Malice surge.
 *      Executed here rather than described: this file runs the real functions.
 *   C  **The Alert strip.** 5 / 9 / 12 announce Malice / hunt / counter-trace, crossings are upward
 *      only, and the node panel draws the marks.
 *   D  **The seams.** The roll bites hang off the Console's own `consoleVerb` chat flag and the real
 *      power-roll total (not the tier); the hunt bite hangs off `combatTurnChange`; the Alert
 *      announcements hang off `preUpdateScene` / `updateScene`. No parallel dice system, no parallel
 *      Alert track, no second Stamina path.
 *   E  **Soft refuses.** Every gate reason has a WHY sentence and a next-verb hint, Ping refuses on
 *      Track 2, and the refuse posts to chat as well as to a toast.
 *   F  **The Wire run checklist.** The North Substation spine in order, guidance only, per user.
 *   G  Version, README, lang, CSS, the committed checklists, no `_id` / `_dsid` movement, 0.3.142
 *      still green, and none of the Specials / Chase package mixed in.
 *
 * Dialogs, ChatMessage and Actor#update cannot run in Node, so that wiring is checked by scanning
 * comment-stripped source — a header that *names* a call is not the call.
 *
 * Run: `node tools/wave-03143-smoke.mjs`
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

import { atLeast } from "./lib/module-version.mjs";
import { retrieve } from "../scripts/voidmark-rag.mjs";
import { ICE_TRIGGERS, resolveBiofeedback } from "../scripts/director-biofeedback.mjs";
import { RATING } from "../scripts/wired-node-templates.mjs";
import {
  consoleVerbGate, pingRefusedOnTrack, powerRollTotalFromMessage, verbRefusalCopy,
  VERB_REFUSAL_REASONS,
} from "../scripts/wired-console-verbs.mjs";
import {
  ALERT_ANNOUNCE_KEYS, ALERT_ANNOUNCE_STEPS, BREACH_VERB_DSIDS, FAILED_BREACH_MIN_RATING,
  HUNT_ALERT_MAX, HUNT_ALERT_MIN, ICE_ACTIVE_MIN_RATING, LOW_ROLL_MAX, WIRE_RUN_CHECKLIST,
  WIRE_RUN_CHECKLIST_IDS, alertAnnounceKey, alertBandAt, alertCrossings, biteKey, bitePreview,
  breachDcForRating, checklistView, exposedToBite, failedBreachFires, hostHasActiveIce,
  huntBiteFires, huntHostFor, lowRollBiteFires, maliceSurgeFires, normalizeChecklistStep,
  rollTotal, rollTriggers, toggleChecklistStep,
} from "../scripts/wired-ice.mjs";

const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = path => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const readJson = path => JSON.parse(read(path));
/** Source with every comment line dropped — a header that *names* a call is not the call. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");

const manifest = readJson("module.json");
const lang = readJson("lang/en.json");
const localize = key => {
  let node = lang;
  for (const part of String(key).split(".")) {
    if (!node || (typeof node !== "object") || !(part in node)) return null;
    node = node[part];
  }
  return node;
};

const iceSrc = read("scripts/wired-ice.mjs");
const ice = code(iceSrc);
const panel = code(read("scripts/wired-node-verbs.mjs"));
const consoleSrc = code(read("scripts/wired-console.mjs"));
const verbsSrc = code(read("scripts/wired-console-verbs.mjs"));
const moduleSrc = code(read("scripts/module.mjs"));
const hbs = read("templates/wired-node-panel.hbs");
const wire = read("docs/raw/21-the-wire.md");

/* ================================================================ A — never silent Stamina */

console.log("\nA) never silent Stamina");

note(/import \{[^}]*directorApplyBiofeedback/s.test(ice), "wired-ice imports directorApplyBiofeedback from the 0.3.142 module");
note(/from "\.\/director-biofeedback\.mjs"/.test(ice), "…and that is where it comes from");
note(/resolveBiofeedback/.test(ice), "…and it reuses resolveBiofeedback for the card's numbers");
note(/detectResistance/.test(ice) && /detectWiredState/.test(ice), "…and the macro's own auto-detect for resistance and state");
note(!/system\.stamina\.value/.test(ice), "wired-ice never writes system.stamina.value itself");
note(!/\.update\(\s*\{[^}]*stamina/s.test(ice), "…and has no Actor#update carrying a Stamina change");
note(!/system\.stamina/.test(panel), "the node applet never touches Stamina either");
note(/confirmBite\(/.test(ice), "…there is a confirm card");
note(/DialogV2\.wait/.test(ice), "…raised as a real DialogV2 with buttons, not a notification");
note(/return answer === "apply"/.test(ice), "…and only the Apply button answers true");
note(/const ok = await confirmBite\(/.test(ice) && /if \(!ok\) return null;/.test(ice), "confirmAndApplyBite asks first and bails on Cancel");
note(
  ice.indexOf("const ok = await confirmBite(") < ice.indexOf("return directorApplyBiofeedback("),
  "…and the ask comes before the apply, in that order",
);
note(/if \(!exposedToBite\(resolvedState\)\) return null;/.test(ice), "a Linked or Disconnected runner never even sees a card");
note(/offered\.add\(key\);/.test(ice), "…and a bite already offered is not offered twice");
note(
  ice.indexOf("offered.add(key)") < ice.indexOf("const ok = await confirmBite("),
  "…marked before the await, so a second hook pass cannot open a second dialog",
);

// The one place in the module that writes Stamina from a bite is still the 0.3.142 module.
const bfSrc = code(read("scripts/director-biofeedback.mjs"));
note(/ghostwireBiofeedback: true/.test(bfSrc), "director-biofeedback still owns the tagged Stamina write");
note(!/ghostwireBiofeedback/.test(ice + panel), "…and 0.3.143 did not grow a second one");

console.log("\nA) the card's numbers are the pipeline's numbers");
{
  // The North Substation Act 2 line, straight through the preview the card renders.
  const act2 = bitePreview({ rating: 3, state: "overlay", resistance: 2, stamina: 21, staminaMax: 21 });
  const truth = resolveBiofeedback({ rating: 3, state: "overlay", resistance: 2, stamina: 21, staminaMax: 21 });
  note(JSON.stringify(act2) === JSON.stringify(truth), "bitePreview is resolveBiofeedback, not a second implementation");
  note(act2.base === 8 && act2.scaled === 4 && act2.damage === 2 && act2.staminaAfter === 19, "…so the card shows 8 → 4 → 2, Stamina 21 → 19");
  const act4 = bitePreview({ rating: 3, state: "jackedIn", resistance: 2, stamina: 19, staminaMax: 21 });
  note(act4.damage === 10 && act4.staminaAfter === 9, "…and Jacked In shows 10, Stamina 19 → 9");
  const floored = bitePreview({ rating: 3, state: "jackedIn", resistance: 2, stamina: 6, staminaMax: 21 });
  note(floored.floored === true && floored.staminaAfter === 1, "…and the Winded floor is on the card before it is on the sheet");
  const linked = bitePreview({ rating: 5, state: "linked", resistance: 0, stamina: 30, staminaMax: 30 });
  note(linked.damage === 0, "…and Linked previews 0, which is why it never gets asked");
}

/* ================================================================ B — the four triggers */

console.log("\nB) trigger 1 — a low roll against active ICE");

note(LOW_ROLL_MAX === 11, "low is 11 or under");
note(ICE_ACTIVE_MIN_RATING === 3, "active ICE starts at Rating 3");
note(hostHasActiveIce({ track: 2, rating: 3 }), "a Track 2 Rating 3 host has active ICE");
note(!hostHasActiveIce({ track: 2, rating: 2 }), "…a Rating 2 host does not — passive layers are flavour");
note(!hostHasActiveIce({ track: 1, rating: 5 }), "…and a Track 1 object has no ICE at any Rating");
note(lowRollBiteFires({ total: 11, track: 2, rating: 3, state: "overlay" }), "11 on a Rating 3 host, Overlaid, bites");
note(lowRollBiteFires({ total: 4, track: 2, rating: 5, state: "jackedIn" }), "…and 4 on a Rating 5 host, Jacked In, bites");
note(!lowRollBiteFires({ total: 12, track: 2, rating: 3, state: "overlay" }), "12 does not — that is tier 2");
note(!lowRollBiteFires({ total: 3, track: 2, rating: 2, state: "overlay" }), "…a low roll on a Rating 2 host does not");
note(!lowRollBiteFires({ total: 3, track: 1, rating: 4, state: "overlay" }), "…nor on a Track 1 object");
note(!lowRollBiteFires({ total: 3, track: 2, rating: 5, state: "linked" }), "Linked never fires, at any Rating");
note(!lowRollBiteFires({ total: 3, track: 2, rating: 5, state: "disconnected" }), "…and neither does Disconnected");
note(!lowRollBiteFires({ total: null, track: 2, rating: 3, state: "overlay" }), "an unresolved roll fires nothing — null is not a roll of 0");
note(!lowRollBiteFires({ total: "", track: 2, rating: 3, state: "overlay" }), "…and neither is an empty total");
note(!failedBreachFires({ total: null, dsid: "matrix-read-write", track: 2, rating: 4, state: "jackedIn" }), "…on the breach trigger either");
note(rollTotal(0) === 0 && rollTotal(null) === null && rollTotal("14") === 14, "rollTotal keeps a real 0 and refuses a missing one");

console.log("\nB) trigger 2 — a failed breach at Rating 4+");

note(FAILED_BREACH_MIN_RATING === 4, "the failed-breach trigger starts at Rating 4");
note(breachDcForRating(4) === RATING[4].breachDC && breachDcForRating(5) === RATING[5].breachDC, "the Breach DC comes off the System Stat Card (17 / 19)");
note(breachDcForRating(9) === 0, "…and an unreadable Rating has no DC");
note(BREACH_VERB_DSIDS.join(",") === "matrix-navigate,matrix-search,matrix-read-write", "a breach is Navigate / Search / Read-Write");
note(failedBreachFires({ total: 16, dsid: "matrix-read-write", track: 2, rating: 4, state: "jackedIn" }), "16 against a Rating 4 host (DC 17) is a failed breach");
note(!failedBreachFires({ total: 17, dsid: "matrix-read-write", track: 2, rating: 4, state: "jackedIn" }), "…17 makes it");
note(failedBreachFires({ total: 18, dsid: "matrix-search", track: 2, rating: 5, state: "overlay" }), "18 against a Rating 5 host (DC 19) still fails");
note(!failedBreachFires({ total: 5, dsid: "matrix-read-write", track: 2, rating: 3, state: "jackedIn" }), "a Rating 3 host carries no failed-breach bite");
note(!failedBreachFires({ total: 5, dsid: "matrix-scan", track: 2, rating: 5, state: "jackedIn" }), "Scan is observation, not a breach");
note(!failedBreachFires({ total: 5, dsid: "matrix-broadcast", track: 2, rating: 5, state: "jackedIn" }), "…and Broadcast is talk");
note(!failedBreachFires({ total: 5, dsid: "matrix-read-write", track: 2, rating: 5, state: "linked" }), "Linked takes none of this either");
note(failedBreachFires({ total: 9, dsid: "matrix-navigate", track: 2, rating: 4, state: "overlay", breachDC: 10 }), "a Director's custom DC is honoured");

console.log("\nB) one trigger, one bite — and two triggers, two bites");
{
  const both = rollTriggers({ total: 6, dsid: "matrix-read-write", track: 2, rating: 4, state: "jackedIn" });
  note(both.join(",") === "low-roll,failed-breach", "a 6 against a Rating 4 host is two different triggers, so two cards");
  const one = rollTriggers({ total: 6, dsid: "matrix-read-write", track: 2, rating: 3, state: "jackedIn" });
  note(one.join(",") === "low-roll", "…against a Rating 3 host it is one");
  note(rollTriggers({ total: 15, dsid: "matrix-search", track: 2, rating: 3, state: "overlay" }).length === 0, "…and a clean roll is none");
  note(rollTriggers({ total: 6, dsid: "matrix-read-write", track: 2, rating: 4, state: "linked" }).length === 0, "Linked is none, always");
  note(both.every(t => ICE_TRIGGERS.includes(t)), "every trigger the applet raises is one of the four the macro already knows");
}
note(biteKey({ trigger: "low-roll", runner: "a", node: "b", scope: "m1" }) === "low-roll|a|b|m1", "a bite's identity is trigger + runner + node + scope");
note(
  biteKey({ trigger: "low-roll", runner: "a", node: "b", scope: "m1" }) !== biteKey({ trigger: "failed-breach", runner: "a", node: "b", scope: "m1" }),
  "…so two different triggers on one roll are two keys, not one",
);

console.log("\nB) trigger 3 — the Alert 9–11 hunt bite");

note(HUNT_ALERT_MIN === 9 && HUNT_ALERT_MAX === 11, "the hunt band is 9–11");
note(huntBiteFires({ alert: 9, state: "overlay" }), "Alert 9, Overlaid, bites");
note(huntBiteFires({ alert: 11, state: "jackedIn" }), "…and Alert 11, Jacked In");
note(!huntBiteFires({ alert: 8, state: "jackedIn" }), "Alert 8 does not — that band is Malice, not teeth");
note(!huntBiteFires({ alert: 12, state: "jackedIn" }), "…and 12 is lockout and counter-trace, which is its own row");
note(!huntBiteFires({ alert: 10, state: "linked" }), "stepping back to Linked stops the bites");
note(!huntBiteFires({ alert: 10, state: "disconnected" }), "…and so does Jacking Out");
{
  const nodes = [
    { id: "a", name: "Cold node", track: 2, alert: 3 },
    { id: "b", name: "Substation", track: 2, alert: 9 },
    { id: "c", name: "Uplink", track: 2, alert: 11 },
    { id: "d", name: "Maglock", track: 1, alert: 11 },
  ];
  note(huntHostFor(nodes)?.id === "c", "the hunt host is the hottest Track 2 node in the band");
  note(huntHostFor(nodes.filter(n => n.id !== "c"))?.id === "b", "…then the next one down");
  note(huntHostFor([nodes[0], nodes[3]]) === null, "…and a Track 1 object at Alert 11 is not a host");
  note(huntHostFor([]) === null, "…no hot node, no bite");
}

console.log("\nB) trigger 4 — the Director's Malice surge");

note(maliceSurgeFires({ state: "overlay" }) && maliceSurgeFires({ state: "jackedIn" }), "the surge lands on Overlay and Jacked In");
note(!maliceSurgeFires({ state: "linked" }) && !maliceSurgeFires({ state: "disconnected" }), "…and on nothing else");
note(/export async function maliceIceSurge/.test(ice), "there is a Malice surge entry point");
note(/maliceSurge: WiredNodePanel\.#onMaliceSurge/.test(panel), "…wired to a node panel action");
note(/data-action="maliceSurge"/.test(hbs), "…with a button on the node template");
note(/canSurge: isGM && \(node\.track === 2\)/.test(panel), "…Director-only, and only on a Track 2 host");
note(/pickSurgeTarget/.test(panel), "…which picks a target first");
note(/exposedToBite\(row\.state\)/.test(panel), "…offering only runners a bite can actually land on");
note(/currentMalice/.test(ice) && !/game\.settings\.set\(.*malice/.test(ice), "Malice is read, never written");
note(/does not spend it for you/i.test(localize("GHOSTWIRE.WiredIce.Surge.ChatTrackHint") ?? ""), "…and the chat card says so out loud");
note(/trigger: "malice-surge"/.test(ice), "…and it is applied as the malice-surge trigger");

/* ================================================================ C — the Alert strip */

console.log("\nC) the Alert strip announces 5 / 9 / 12");

note(ALERT_ANNOUNCE_STEPS.join(",") === "5,9,12", "the announced steps are 5, 9 and 12");
note(alertAnnounceKey(5) === "Malice" && alertAnnounceKey(9) === "Hunt" && alertAnnounceKey(12) === "CounterTrace", "…Malice, hunt, counter-trace");
note(Object.keys(ALERT_ANNOUNCE_KEYS).length === 3, "…and nothing else is announced");
note(alertCrossings(4, 5).join(",") === "5", "4 → 5 announces Malice");
note(alertCrossings(4, 9).join(",") === "5,9", "4 → 9 announces both, in order — the Director banked Malice *and* woke the hunt");
note(alertCrossings(0, 12).join(",") === "5,9,12", "0 → 12 announces all three");
note(alertCrossings(5, 8).length === 0, "climbing inside a band announces nothing");
note(alertCrossings(11, 9).length === 0, "coming back down announces nothing — a reset is bookkeeping, not a beat");
note(alertCrossings(9, 9).length === 0, "…and standing still announces nothing");
note(alertBandAt(0) === "quiet" && alertBandAt(4) === "stir" && alertBandAt(5) === "malice" && alertBandAt(9) === "hunting" && alertBandAt(12) === "lockout", "the band ladder is the Console's ladder");

for (const step of ALERT_ANNOUNCE_STEPS) {
  const text = localize(`GHOSTWIRE.WiredIce.Alert.${alertAnnounceKey(step)}`) ?? "";
  note(text.includes(String(step)), `the step ${step} announcement names the step`);
  note(typeof localize(`GHOSTWIRE.WiredIce.Strip.${alertAnnounceKey(step)}`) === "string", `…and the strip has a short label for it`);
}
note(/\+1 Malice/.test(localize("GHOSTWIRE.WiredIce.Alert.Malice") ?? ""), "step 5 says +1 Malice");
note(/hunting/i.test(localize("GHOSTWIRE.WiredIce.Alert.Hunt") ?? ""), "step 9 says the ICE is hunting");
note(/counter-trace/i.test(localize("GHOSTWIRE.WiredIce.Alert.CounterTrace") ?? ""), "step 12 says counter-trace");
note(/reset/i.test(localize("GHOSTWIRE.WiredIce.Alert.CounterTrace") ?? ""), "…and that the track then resets");

note(/mark: ALERT_ANNOUNCE_STEPS\.includes/.test(panel), "the node panel marks those three steps on the strip");
note(/alertMarks:/.test(panel), "…and lists what each one means");
note(/\{\{#each alertMarks\}\}/.test(hbs), "…which the template renders");
note(/\{\{#if mark\}\} mark\{\{\/if\}\}/.test(hbs), "…and the strip cells carry the mark class");
note(/hunting: huntBiteFires/.test(panel), "…and the panel says out loud when the runner is standing in the hunt band");
note(/wn-hunt-notice/.test(hbs) && /wn-hunt-notice/.test(read("styles/ghostwire.css")), "…with a style for that notice");

/* ================================================================ D — the seams */

console.log("\nD) the seams — no parallel systems");

note(/Hooks\.on\("combatTurnChange"/.test(ice), "the hunt bite hangs off combatTurnChange");
note(/handleTurnEndHuntBite\(combat, prior\)/.test(ice), "…and reads `prior`, which is the turn that just ended");
note(/Hooks\.on\("createChatMessage"/.test(ice) && /Hooks\.on\("updateChatMessage"/.test(ice), "the roll bites hang off the chat hooks, beside the existing soft-Trace pass");
note(/consoleVerb/.test(ice), "…reading the Console's own consoleVerb flag rather than a second dice system");
note(!/new Roll\(|Roll\.create|2d10/.test(ice), "…and wired-ice rolls nothing of its own");
note(/Hooks\.on\("preUpdateScene"/.test(ice) && /Hooks\.on\("updateScene"/.test(ice), "the Alert announcements hang off the Scene board flag the Console already writes");
note(/ghostwireAlertBefore/.test(ice), "…with a before-picture stashed on the update options");
note(/wiredBoard/.test(ice), "…reading the one board flag, not a second Alert track");
note(/registerWiredIce\(\{ getWiredState, rollTotalFromMessage: powerRollTotalFromMessage \}\)/.test(moduleSrc), "the entrypoint registers it with getWiredState and the roll-total reader");
note(/import \{ registerWiredIce \} from "\.\/wired-ice\.mjs"/.test(moduleSrc), "…and imports it from wired-ice");
note(/isBiteDirector/.test(ice) && /game\.users\?\.activeGM/.test(ice), "only one GM raises the card, so a three-Director table sees one dialog");

console.log("\nD) the roll total, not the tier");
{
  const powerRoll = (total, formula = "2d10 + 3") => ({ total, formula, product: 1 });
  const message = {
    system: { parts: [{ type: "abilityResult", tier: 3, rolls: [powerRoll(9)] }] },
  };
  note(powerRollTotalFromMessage(message) === 9, "the total comes off the abilityResult part's own roll");
  note(
    powerRollTotalFromMessage({ system: { parts: [{ type: "abilityResult", rolls: [powerRoll(14), powerRoll(8)] }] } }) === 8,
    "…the worst of several, the same rule the tier reader uses",
  );
  note(
    powerRollTotalFromMessage({ system: { parts: [{ type: "abilityResult", rolls: [{ total: 22, formula: "3d6" }] }] } }) === null,
    "…a damage roll is not a power roll",
  );
  note(powerRollTotalFromMessage({ rolls: [powerRoll(11)] }) === 11, "…and a bare message's rolls are the fallback");
  note(powerRollTotalFromMessage({}) === null, "…an unresolved card has no total");
  // This is the whole reason the tier is not good enough: a double bane moves the tier, not the roll.
  note(
    powerRollTotalFromMessage({ system: { parts: [{ type: "abilityResult", tier: 1, rolls: [powerRoll(15)] }] } }) === 15,
    "a tier 1 card that actually rolled 15 reports 15 — a double bane moves the tier, not the roll",
  );
}

/* ================================================================ E — soft refuses */

console.log("\nE) soft refuses say WHY and what next");

note(VERB_REFUSAL_REASONS.length >= 9, `${VERB_REFUSAL_REASONS.length} refusal reasons carry copy`);
for (const reason of VERB_REFUSAL_REASONS) {
  const copy = verbRefusalCopy(reason);
  const why = localize(`GHOSTWIRE.WiredConsole.${copy.why}`);
  const hint = localize(`GHOSTWIRE.WiredConsole.${copy.hint}`);
  note(typeof why === "string" && why.length > 25, `${reason}: the WHY is a sentence, not a label`);
  note(typeof hint === "string" && hint.length > 15, `…and ${reason} has a next-step hint`);
}
note(verbRefusalCopy("Immersion").hintVerb === "matrix-toggle-connection-state", "Linked → the hint points at Toggle Connection State");
note(verbRefusalCopy("Disconnected").hintVerb === "matrix-connect", "Disconnected → the hint points at Connect");
note(verbRefusalCopy("AlreadyConnected").hintVerb === "matrix-toggle-connection-state", "already on-net → the hint points at Toggle");
note(verbRefusalCopy("Track").hintVerb === "matrix-read-write", "Ping on Track 2 → the hint points at Read/Write");
note(verbRefusalCopy("nonsense") === null, "an unknown reason has no copy rather than a blank card");
note(/\{next\}/.test(localize("GHOSTWIRE.WiredConsole.VerbHintImmersion") ?? ""), "the Immersion hint names the verb by key, not by a re-typed word");
note(/Overlay or Jacked In/.test(localize("GHOSTWIRE.WiredConsole.VerbNeedImmersion") ?? ""), "…and the WHY names the two states that work");
note(/soft presence/.test(localize("GHOSTWIRE.WiredConsole.VerbNeedImmersion") ?? ""), "…and says why Linked is not one of them");

console.log("\nE) Ping is Track 1 only");

note(pingRefusedOnTrack("matrix-ping", 2), "Ping on a Track 2 host refuses");
note(!pingRefusedOnTrack("matrix-ping", 1), "…Ping on a Track 1 object does not");
note(!pingRefusedOnTrack("matrix-ping", null), "…and an unknown Track is not refused on a guess");
note(!pingRefusedOnTrack("matrix-read-write", 2), "…Read/Write on Track 2 is exactly the right tool");
{
  const base = { actorUuid: "Actor.x", owned: true, nodeId: "n1", isGM: true, state: "overlay" };
  note(consoleVerbGate({ ...base, dsid: "matrix-ping", track: 2 }).reason === "Track", "the gate reports Track");
  note(consoleVerbGate({ ...base, dsid: "matrix-ping", track: 1 }).ok, "…and passes Ping on Track 1");
  note(consoleVerbGate({ ...base, dsid: "matrix-read-write", track: 2 }).ok, "…and Read/Write on Track 2");
  note(consoleVerbGate({ ...base, dsid: "matrix-ping", track: 2, state: "linked" }).reason === "Immersion", "Linked still refuses on immersion first — the deeper problem wins");
}
note(/Track 1 only/i.test(wire) && /Ping does not bypass or defeat ICE/.test(wire), "the RAW still says Ping is Track 1 only and never defeats ICE");
note(/Track 2 host/.test(localize("GHOSTWIRE.WiredConsole.VerbNeedTrack") ?? ""), "the refuse copy says the host is Track 2");
note(/where the ICE lives/.test(localize("GHOSTWIRE.WiredConsole.VerbNeedTrack") ?? ""), "…and why that matters");

console.log("\nE) the refuse reaches the player, not just the log");

note(/export async function softRefuseVerb/.test(consoleSrc), "there is one soft-refuse path");
note(/await softRefuseVerb\(\{ actor, node, dsid, reason: gate\.reason \}\)/.test(consoleSrc), "…and the verb gate goes through it");
note(/ui\.notifications\.warn\(why\)/.test(consoleSrc), "…it raises the toast");
note(/ChatMessage\.implementation\.create/.test(consoleSrc), "…and posts a card");
note(/whisper/.test(consoleSrc), "…whispered, so a table of five does not watch one runner learn the ladder");
note(/gw-refuse-why/.test(consoleSrc) && /gw-refuse-hint/.test(consoleSrc), "…carrying both halves");
note(/ghostwire-verb-refuse/.test(read("styles/ghostwire.css")), "…with a style block");
note(typeof localize("GHOSTWIRE.WiredConsole.VerbRefused") === "string", "…and a title");
note(/verbRefusalCopy\(gate\.reason\)/.test(consoleSrc), "the greyed-out button's tooltip uses the same copy");
note(/tooltip = hint \? `\$\{why\} \$\{hint\}` : why;/.test(consoleSrc), "…showing WHY then the hint");
note(/track: node\?\.track \?\? null/.test(consoleSrc), "useConsoleVerb passes the node's Track to the gate");
note(/track: selected\?\.track \?\? null/.test(consoleSrc), "…and so does the Console strip");
note(/track: node\.track/.test(panel), "…and the node applet");
note(/reason: "Track"/.test(verbsSrc), "the gate has a Track reason, so the lang smoke locks its copy");

/* ================================================================ F — the Wire run checklist */

console.log("\nF) the Wire run checklist");

note(WIRE_RUN_CHECKLIST_IDS.join(",") === "connect,toggle,scan,tracks,lows,integrity,alert,out", "the spine is in North Substation order");
note(WIRE_RUN_CHECKLIST.length === 8, "…eight steps");
for (const step of WIRE_RUN_CHECKLIST) {
  note(typeof localize(step.label) === "string", `${step.id} has a label`);
  note(typeof localize(step.hint) === "string", `…and a cue`);
}
const phrase = (id, re, what) => note(re.test(localize(`GHOSTWIRE.WiredIce.Checklist.${id}.Label`) + " " + localize(`GHOSTWIRE.WiredIce.Checklist.${id}.Hint`)), what);
phrase("connect", /Connect/, "step 1 is Connect → Linked → Broadcast");
phrase("connect", /Linked/, "…and names Linked");
phrase("connect", /Broadcast/, "…and Broadcast");
phrase("toggle", /Overlay/, "step 2 is Toggle to Overlay");
phrase("scan", /Deep Scan/, "step 3 is Scan / Deep Scan");
phrase("tracks", /Track 1/, "step 4 is Track 1 vs Track 2");
phrase("tracks", /Track 2/, "…both of them");
phrase("lows", /11 or under/, "step 5 is watching lows against ICE");
phrase("lows", /Rating 3\+/, "…and names the Rating that bites");
phrase("integrity", /Integrity/, "step 6 is Integrity");
phrase("alert", /1–4/, "step 7 is the Alert bands");
phrase("alert", /5–8/, "…5–8");
phrase("alert", /9–11/, "…9–11");
phrase("alert", /12/, "…and 12");
phrase("out", /Decompile/, "step 8 is Decompile / Jack Out");
phrase("out", /Jack Out/, "…Jack Out");
phrase("out", /Trace Alert does not/, "…and the Alert persists");

note(normalizeChecklistStep("connect") === "connect" && normalizeChecklistStep("nope") === null, "only spine ids are stored");
note(toggleChecklistStep([], "scan").join(",") === "scan", "ticking a step stores it");
note(toggleChecklistStep(["scan"], "scan").length === 0, "…and ticking it again clears it");
note(toggleChecklistStep(["scan", "junk"], "lows").join(",") === "scan,lows", "…and junk in the store is dropped on the way out");
note(checklistView(["scan"]).filter(s => s.done).map(s => s.id).join(",") === "scan", "the view applies the ticks");
note(checklistView([]).map(s => s.id).join(",") === WIRE_RUN_CHECKLIST_IDS.join(","), "…and never reorders the spine");

note(/data-action="toggleChecklist"/.test(hbs), "the checklist collapses");
note(/aria-expanded=/.test(hbs), "…accessibly");
note(/data-action="checkStep"/.test(hbs), "…and each step can be ticked");
note(/scope: "client"/.test(panel), "ticks are per user, not written onto the Scene");
note(/config: false/.test(panel), "…and stay out of the settings menu");
note(!/useConsoleVerb|consoleVerbGate/.test(code(read("scripts/wired-ice.mjs")).split("Checklist")[1] ?? ""), "the checklist gates nothing");
note(/Guidance only/.test(localize("GHOSTWIRE.WiredIce.Checklist.Hint") ?? ""), "…and the panel says so");
note(/blocks nothing/.test(localize("GHOSTWIRE.WiredIce.Checklist.Hint") ?? ""), "…in those words");

/* ================================================================ G — version, docs, hygiene */

console.log("\nG) version, docs and scope");

note(manifest.version === "0.3.143", `module.json is ${manifest.version}`);
note(atLeast(manifest.version, "0.3.143"), "…and the version pin agrees");
const readme = read("README.md");
note(/- `0\.3\.143` — \*\*The node applet notices the ICE/.test(readme), "README carries a 0.3.143 Status entry");
note(/Nothing is ever applied silently/.test(readme), "…and leads with the hard rule");

note(/In Foundry: the node applet runs the four triggers, and asks first/.test(wire), "the Wire chapter has the matching In Foundry note");
note(/Cancel leaves Stamina exactly where it is/.test(wire), "…which says Cancel changes nothing");
note(/Wire run checklist/.test(wire), "…and names the checklist");
note(/Ghostwire does \*\*not\*\* spend your Malice/.test(wire), "…and that Malice is not spent for you");

const wireJournal = readJson("src/packs/rulebook/ghostwire-systems/21-the-wire.json");
const wirePage = wireJournal.pages.find(p => p.name === "The Wired System");
note(/node applet runs the four triggers/.test(wirePage?.text?.markdown ?? ""), "the Rulebook page carries the note too");
note(/node applet runs the four triggers/.test(wirePage?.text?.content ?? ""), "…in the rendered HTML beside it");

const index = readJson("data/voidmark-rules-index.json");
note(index.chunks.some(c => /node applet runs the four triggers/.test(String(c.text ?? ""))), "VOIDMARK indexes it");
note(
  retrieve(index, "does the node applet apply biofeedback automatically", { k: 5 })
    .some(h => /ICE attack triggers/i.test(String(h.heading ?? ""))),
  "…and 'does the node applet apply biofeedback automatically' retrieves it",
);
note(index.entityCounts?.ability === 420, `${index.entityCounts?.ability} ability entries (unchanged — this wave ships no abilities)`);
note(index.entityCounts?.summon === 74, `${index.entityCounts?.summon} summon entries (unchanged)`);

for (const path of ["docs/directors/03143-smoke.md", "docs/directors/03142-03143-smoke.md"]) {
  note(existsSync(path), `${path} is committed`);
}
const checklist = existsSync("docs/directors/03143-smoke.md") ? read("docs/directors/03143-smoke.md") : "";
for (const item of [1, 2, 3, 4, 5, 6, 7]) note(new RegExp(`^## ${item}\\.`, "m").test(checklist), `…with a section for check ${item}`);
note(/wave-03143-smoke/.test(checklist), "…and points at this smoke");
const combined = existsSync("docs/directors/03142-03143-smoke.md") ? read("docs/directors/03142-03143-smoke.md") : "";
note(/0\.3\.142/.test(combined) && /0\.3\.143/.test(combined), "the combined guide covers both waves");
note(/Director: Apply Biofeedback/.test(combined), "…the 0.3.142 macro");
note(/North Substation/.test(combined), "…North Substation");
note(/Malice ICE surge/.test(combined), "…and the 0.3.143 surge button");

console.log("\nG) ids, and the packages this wave is not");

let baseRef = null;
for (const ref of ["origin/main", "main"]) {
  try { execFileSync("git", ["rev-parse", "--verify", "--quiet", ref], { stdio: "pipe" }); baseRef = ref; break; } catch { /* next */ }
}
if (baseRef) {
  const changed = execFileSync("git", ["diff", "--name-only", baseRef, "--", "src/packs"], { encoding: "utf8" })
    .split("\n").filter(f => f.endsWith(".json"));
  const idsOf = doc => JSON.stringify([
    doc._id, doc.system?._dsid, doc.flags?.["draw-steel-ghostwire"]?.dsid,
    ...(doc.pages ?? []).map(p => p._id), ...(doc.items ?? []).map(i => [i._id, i.system?._dsid]),
    ...(doc.effects ?? []).map(e => e._id),
  ]);
  let moved = 0;
  for (const file of changed) {
    let before = null;
    try { before = JSON.parse(execFileSync("git", ["show", `${baseRef}:${file}`], { encoding: "utf8" })); } catch { continue; }
    if (!existsSync(file)) { moved += 1; continue; }
    const after = readJson(file);
    const beforeIds = JSON.parse(idsOf(before)).flat(2).filter(Boolean);
    const afterIds = new Set(JSON.parse(idsOf(after)).flat(2).filter(Boolean));
    if (!beforeIds.every(id => afterIds.has(id))) moved += 1;
  }
  note(!moved, `${changed.length} changed pack source file(s) against ${baseRef}; no _id / dsid moved`);

  const allChanged = execFileSync("git", ["diff", "--name-only", baseRef], { encoding: "utf8" }).split("\n").filter(Boolean);
  note(!allChanged.some(f => f.startsWith("src/packs/summons/")), "no summon Actor touched — Specials token scale 0.5 is still a later wave");
  note(!allChanged.some(f => f === "scripts/chase-hud.mjs"), "the Chase HUD is untouched — Pilot-first seats are still a later wave");
  note(!allChanged.some(f => f.startsWith("docs/directors/_")), "no director scratch file staged for commit");
} else {
  console.log("  · no main ref to diff against; id and scope checks skipped");
}

note(!/Decompile Specials/i.test(iceSrc + panel + wire), "nothing ships a Decompile Specials verb");
note(!/tokenScale|texture\.scaleX/.test(iceSrc + panel), "…and nothing rescales a Specials token");

/* ================================================================ */

console.log(fail.length ? `\n0.3.143 smoke FAIL — ${fail.length}` : "\n0.3.143 smoke OK");
for (const msg of fail) console.log(`  - ${msg}`);
process.exit(fail.length ? 1 : 0);
