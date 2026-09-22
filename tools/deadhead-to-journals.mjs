#!/usr/bin/env node
/**
 * Builds the Ghostwire Runs → Deadhead journals from the locked markdown:
 *
 *   1. Deadhead — Director (gwDeadheadDirJrn) — rules SoR sidecar from
 *      DEADHEAD-GOLD-LINE.md + GOLD-LINE-CARGO-REMAP.md. Numbers and rules stay
 *      identical to the markdown.
 *   2. Deadhead — Session Chapters (gwDhSessionChap0) — the official Ghostwire
 *      session package, one page per Foundry Scene, stamped from
 *      DEADHEAD-SESSION-CHAPTERS.md, plus a GM-only Gold Line car-by-car page
 *      from GOLD-LINE-CAR-BY-CAR.md.
 *
 * Session Chapters READ ALOUD boxes (Meatspace / Wired) and Beat headings stay
 * player-visible. Everything else — Director lines, If pressed, dials, seats,
 * Director Notes — is wrapped in Foundry secret blocks, so a page shown to
 * players reveals only the boxes.
 *
 * Opposition LOCK (Michael 2026-09-21): 5 security + 1 worker drone; wafer in
 * the second-to-last car; the exchange is the Nightjar Market Scene, never a
 * Gold Line Beat.
 *
 * Run:  node tools/deadhead-to-journals.mjs
 * Then: node tools/build-packs.mjs runs   (Foundry closed)
 *
 * Does not write Scene JSON, gold-line-scene.mjs, nightjar-market-scene.mjs,
 * gold-line-map.json, or gold-line-aerial-recon.json.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { markdownToHtml } from "./lib/md-to-html.mjs";
import { createIdAllocator } from "./lib/heading-anchor.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const FOLDER_ID = "gwRunsDeadhead00";
const ENTRY_ID = "gwDeadheadDirJrn";
const CHAPTERS_ID = "gwDhSessionChap0";
const OUT = "src/packs/runs/deadhead/deadhead-director.json";
const CHAPTERS_OUT = "src/packs/runs/deadhead/deadhead-session-chapters.json";
const SOR = "docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md";
const REMAP = "docs/directors/runs/deadhead/GOLD-LINE-CARGO-REMAP.md";
const CHAPTERS = "docs/directors/runs/deadhead/DEADHEAD-SESSION-CHAPTERS.md";
const CAR_BY_CAR = "docs/directors/runs/deadhead/GOLD-LINE-CAR-BY-CAR.md";

const actor = (pack, id, label) => `@UUID[Compendium.${MODULE_ID}.${pack}.Actor.${id}]{${label}}`;
const CAR_PAGE_ID = "gwDhSessCarByCar";

const UUID = {
  mapNotes: `@UUID[Compendium.${MODULE_ID}.runs.JournalEntry.gwDeadheadGoldLn]{Gold Line — Map Notes}`,
  aerialRecon: `@UUID[Compendium.${MODULE_ID}.runs.JournalEntry.gwDhAerialRecon0]{Gold Line — Aerial Recon}`,
  director: `@UUID[Compendium.${MODULE_ID}.runs.JournalEntry.${ENTRY_ID}]{Deadhead — Director}`,
  chapters: `@UUID[Compendium.${MODULE_ID}.runs.JournalEntry.${CHAPTERS_ID}]{Deadhead — Session Chapters}`,
  carByCar: `@UUID[Compendium.${MODULE_ID}.runs.JournalEntry.${CHAPTERS_ID}.JournalEntryPage.${CAR_PAGE_ID}]{Gold Line — Car-by-Car}`,
  flatsTransit: `@UUID[Compendium.${MODULE_ID}.runs.JournalEntry.gwFlatsTransit00]{Flats Transit — Grey Cab & Veinline}`,
  aerialReconItem: `@UUID[Compendium.${MODULE_ID}.gear.Item.gwGoldLineRecon0]{Gold Line Aerial Recon}`,
  enforcer: actor("bestiary", "h3LR6HHADCpyFMsN", "ARG Corporate Enforcer"),
  security: actor("bestiary", "DVEibxfpEWA5RoCn", "ARG Security Officer"),
  lieutenant: actor("bestiary", "g7LC1G0K20UnYzkr", "ARG Response Lieutenant"),
  watchdog: actor("bestiary", "dNEBSb47qSV9lRRH", "Watchdog ICE"),
  drone: actor("summons", "zrESvaOxNgEPffhF", "Drone (Medium)"),
  mamaBrief: `@UUID[Compendium.${MODULE_ID}.gear.Item.gwMamaBriefWafer]{Mama’s Deadhead Job Stick (Gold Line)}`,
  argCapsule: `@UUID[Compendium.${MODULE_ID}.gear.Item.gwArgCourierCap0]{ARG Courier Capsule (Gold Line)}`,
  noxFreighter: `@UUID[Compendium.${MODULE_ID}.vehicles.Item.gwNoxTrashFrgt00]{Nox’s Trash Freighter}`,
  noxFreighterActor: actor("deadhead", "gwNoxTrashActor0", "Nox’s Trash Freighter"),
  iona: actor("deadhead", "gwDhIonaVale0000", "Iona Vale"),
  rhen: actor("deadhead", "gwDhRhenCalder00", "Rhen Calder"),
  nim: actor("deadhead", "gwDhNim000000000", "Nim"),
  vesper: actor("deadhead", "gwDhVesperDrift0", "Vesper Drift"),
  tam: actor("deadhead", "gwDhTamKade00000", "Tam Kade"),
  sera: actor("deadhead", "gwDhSeraNix00000", "Sera Nix"),
  vell: actor("deadhead", "gwDhCousinVell00", "Cousin Vell"),
  juno: actor("deadhead", "gwDhJunoHalve000", "Juno Halve"),
};

const PAGE_IDS = [
  "gwDhDirOverview0",
  "gwDhDirTrace0000",
  "gwDhDirCastKit00",
  "gwDhDirBeat0Disc",
  "gwDhDirBeat1Bord",
  "gwDhDirBeat2Frgt",
  "gwDhDirBeat3Wire",
  "gwDhDirBeat4Bail",
  "gwDhDirBeat5Morl",
  "gwDhDirItems0000",
  "gwDhDirOppose000",
  "gwDhDirFoundry00",
];

const LANG_PAGES = {
  Overview: "Overview",
  TraceAlert: "Trace Alert",
  CastKit: "Cast & Consist",
  Beat0: "Beat 0 — Discovery",
  Beat1: "Beat 1 — Board",
  Beat2: "Beat 2 — Freight Crawl",
  Beat3: "Beat 3 — Wire",
  Beat4: "Beat 4 — Bail",
  Beat5: "Beat 5 — Nightjar Market",
  Items: "Items",
  Opposition: "Opposition",
  FoundryChecklist: "Foundry Checklist",
};

/** Session Chapters: one page per `## ` section of the markdown (Appendix / Backlog stay out). */
const CHAPTER_PAGES = [
  { id: "gwDhSessOpen0000", key: "SessionOpening", headings: ["Opening — Why tonight", "Session map (Foundry Scenes)"], label: "Opening — Why tonight" },
  { id: "gwDhSessMamas000", key: "SessionMamasClub", headings: ["Scene — Mama's Club"] },
  { id: "gwDhSessTransit0", key: "SessionFlatsTransit", headings: ["Scene — Flats Transit"] },
  { id: "gwDhSessRackRst0", key: "SessionRackRest", headings: ["Scene — Rack & Rest"] },
  { id: "gwDhSessNoxMeet0", key: "SessionFreighterMeet", headings: ["Scene — Freighter Meet (Call Nox)"] },
  { id: "gwDhSessGoldLn00", key: "SessionGoldLine", headings: ["Scene — Gold Line"] },
  { id: "gwDhSessNightjr0", key: "SessionNightjar", headings: ["Scene — Nightjar Market"] },
];
const CHAPTERS_SKIPPED = ["Appendix", "Backlog"];

function must(cond, msg) {
  if (!cond) throw new Error(msg);
}

function headingBlock(md, headingPrefix) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex(l => l.startsWith(`## ${headingPrefix}`));
  must(start >= 0, `Missing SoR heading: ${headingPrefix}`);
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end).join("\n").replace(/^\s*---\s*$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
}

function page(entryId, index, langKey, markdown) {
  const _id = PAGE_IDS[index];
  must(/^[A-Za-z0-9]{16}$/.test(_id), `Bad page id ${_id}`);
  return {
    _id,
    _key: `!journal.pages!${entryId}.${_id}`,
    name: `GHOSTWIRE.Runs.Pages.${langKey}`,
    type: "text",
    sort: (index + 1) * 100000,
    title: { show: true, level: 1 },
    image: {},
    video: { controls: true, volume: 0.5 },
    src: null,
    system: {},
    text: { format: 2, markdown, content: markdownToHtml(markdown) },
    category: null,
    ownership: { default: -1 },
    flags: {},
  };
}

// ---------------------------------------------------------------- SoR guards

const sor = readFileSync(SOR, "utf8").replace(/\r\n/g, "\n");
const remap = readFileSync(REMAP, "utf8").replace(/\r\n/g, "\n");

must(/cargo maglev/i.test(sor) && /not a passenger train/i.test(sor), "SoR must lock cargo maglev (not passenger)");
must(/AFT FREIGHT/.test(sor) && /freight Enforcers/.test(sor), "SoR must use cargo remap consist");
must(!/\bPASSENGER\b/.test(sor) && !/passenger PA/i.test(sor), "SoR still has passenger-train wording");
must(/¥8,000/.test(sor) && /¥14,000/.test(sor) && /¥2,000/.test(sor), "SoR pay table missing");
must(/\+1 per round/.test(sor) && /call-home/.test(sor), "SoR Trace lock missing");
for (const [name, md] of [["SoR", sor], ["remap", remap]]) {
  must(/5 security \+ 1 worker drone/.test(md), `${name} must lock 5 security + 1 worker drone`);
  must(/second-to-last/.test(md), `${name} must seat the wafer in the second-to-last car`);
  must(!/4\*{0,2} ARG Security Officers/.test(md), `${name} still has the 4-Officer nest`);
  must(!/\*\*COURIER\*\* — sealed capsule/.test(md) && !/Capsule is \*\*R1\*\*/.test(md), `${name} still seats the courier in R1`);
}

const logline = headingBlock(sor, "Logline");
const pay = headingBlock(sor, "Pay (crew pool)");
const hardRules = headingBlock(sor, "Hard rules (prize / stop)");
const trace = headingBlock(sor, "Trace Alert");
const cast = headingBlock(sor, "Cast & kit");
const brief = headingBlock(sor, "Mama");
const discovery = headingBlock(sor, "Discovery");
const clock = headingBlock(sor, "4h Director clock");
const whiteout = headingBlock(sor, "L1 Trace tools note");
const chambers = headingBlock(remap, "Dual Hammerhead chambers");
const wire = headingBlock(remap, "Wire");
must(/\*\*2\*\* ARG Corporate Enforcers/.test(headingBlock(remap, "Opposition")), "remap Opposition must seat 2 Enforcers in L1");
const foundryNotes = headingBlock(remap, "Foundry Director notes");

// ---------------------------------------------------------------- Director journal

const pages = [
  page(ENTRY_ID, 0, "Overview", [
    "**Deadhead on the Gold Line** — Ghostwire playtest · **~4 hours** · Director journal (rules sidecar).",
    "",
    "Table prose — READ ALOUD boxes, conversations, Director Notes per Scene — lives in " + UUID.chapters + ". This journal holds the rules the Scenes point at: pay, hard rules, Trace ladder, consist, opposition, items, and the Foundry checklist.",
    "",
    "**Cargo maglev — not a passenger train.** ARG freight consist on the dual Hammerhead plate (L1–R3). Plate notes: " + UUID.mapNotes + ".",
    "",
    "### Logline",
    "",
    logline,
    "",
    "### Pay (crew pool)",
    "",
    pay,
    "",
    "### Hard rules (prize / stop)",
    "",
    hardRules,
    "",
    "### 4h clock",
    "",
    clock.split("### Beat rule callouts")[0].trim(),
    "",
    "Do not invent a rival twist (v1 is a clean heist). Discovery pays **intel only**.",
  ].join("\n")),

  page(ENTRY_ID, 1, "TraceAlert", [
    "One Trace Alert on the Gold Line **train host** (Wired Console; host in the **R3** front cab). Track **0–12**. Bands: quiet (0) · stir (1–4) · malice (5–8) · hunting (9–11) · lockout (12).",
    "",
    trace,
    "",
    "### L1 Trace tools (playtest)",
    "",
    whiteout,
    "",
    "Do **not** invent a class Trace −1 button. Call-home **Block** (and Kessic / Sabbat Whiteout magazines) are the L1 Trace −1 on this run.",
  ].join("\n")),

  page(ENTRY_ID, 2, "CastKit", [
    "**Cargo maglev — not a passenger train.** No civilian coaches. No passenger crawl. Players learn the exact capsule **chamber** only on a **great success** in discovery; otherwise they **search**.",
    "",
    "### Cast & kit",
    "",
    cast.split("### Consist")[0].trim(),
    "",
    "### Consist (Director truth)",
    "",
    "Hull **20 ft** wide, **5 ft** furniture. Six zones on the dual Hammerhead plate, aft → nose: **L1 aft freight → L2 passage → mid console booth → black-container aisle → second-to-last (courier) → R3 front cab**. Crew boards **aft (L1)** and works **upstream** (rightward, nose right). The capsule rides in the **second-to-last** car.",
    "",
    chambers,
    "",
    "### Wire",
    "",
    wire,
    "",
    "Chamber cards (exploitables, Wire ratings, drone dealing): " + UUID.carByCar + ". Plate paths and roof/tile notes: " + UUID.mapNotes + ".",
  ].join("\n")),

  page(ENTRY_ID, 3, "Beat0", [
    "**Block 0 · 55–75m · Scenes: Mama’s Club → Flats Transit → Rack & Rest.** Intel only. Fail = go in blind, not blocked.",
    "",
    "### Setup",
    "",
    "Mama hands " + UUID.mamaBrief + " at the balcony booth in **Mama’s Club**. The crew rides a licensed Grey Cab or Veinline hop (" + UUID.flatsTransit + ") to **Rack & Rest** — Michael’s Cube Hotel world Scene — and runs discovery, Voidmark, prep, and the patron interrupt from the commons. Then they call **Nox**: the crew **borrows** the garbage-truck-sized trash freighter. Scratch it = buy it; lose it = explain to Mama.",
    "",
    "Rack & Rest is a world Scene, not a module inject. The old module-injected crew hangout stays **REMOVED** (0.3.55). Faces for the patron interrupt: " + [UUID.vesper, UUID.tam, UUID.sera, UUID.vell, UUID.juno].join(" · ") + ".",
    "",
    "### Discovery table",
    "",
    discovery,
    "",
    "Research tracks, schedule-mirror nodes, and meat hooks with full result bands live in the Rack & Rest Director Notes of " + UUID.chapters + ".",
    "",
    "### Say to the table (Ghostwire)",
    "",
    "> Mama’s job stick is warm in someone’s pocket. Gold Line cargo run, Spire depot to Switchboard terminus. Live ARG transaction wafer in a sealed courier capsule. Lift it on the Wire, get off the consist before ARG answers the stop — then decide who eats.",
    "",
    "Do **not** name the capsule chamber unless they earned **★**. Do **not** put Watchdog / cam numbers, the wafer-out tick, or the corp/Signal doors on the stick until the matching intel lands.",
    "",
    "If canyon watch / Wire schedule recon / bribe succeeds, show " + UUID.aerialRecon + " (Photo page). Optional sheet copy: " + UUID.aerialReconItem + ". Intel only — no cash. Do not bake the photo into the Gold Line battlemap.",
  ].join("\n")),

  page(ENTRY_ID, 4, "Beat1", [
    "**Block 1 · 30–40m · Scene: Gold Line — roofs → drop into L1.** Canyon approach is **narrated** — there is no canyon plate. Freighter Meet (Call Nox) is narrated too — no phantom Scene.",
    "",
    "**Board:** Deploy/Recall; Agility/Might board rolls; mixed = Alert +1; Jacked In can’t make physical board rolls.",
    "",
    "### Setup",
    "",
    "1. Canyon approach / drone sling — **narrate it, no map**. Nox’s trash freighter is **garbage-truck-sized** — keep it in the fiction as the bird they Recall later. **Place the Actor** " + UUID.noxFreighterActor + " from **Ghostwire Runs — Deadhead Actors** onto Gold Line roofs (suggested token **4×6** squares, grid 208 px = 5 ft; resize; **5×8** if it reads small). Friendly, no ring. Library SKU: " + UUID.noxFreighter + " in **Ghostwire Vehicles → Air**. Do not force-rewrite the live Scene.",
    "2. Open **Gold Line** (Michael’s world Scene). **Show** the **Roofs (overhead)** tile for the board.",
    "3. Sling onto the **roof**, then enter **L1** aft freight — **Path A** twin roof hatches (Track 1 maglock ~3, harder) or **Path B** rear access door (~2, easier). Work **upstream** (right) from here.",
    "4. Once the crew is **inside**, **hide the Roofs (overhead) tile**. Do not wait on Surface occlusion as the play instruction.",
    "",
    "L1 is freight, not a coach. **2** " + UUID.enforcer + " + cams own **L1**; the worker drone leashes **L2**. Do not emergency-stop while the wafer is still nested.",
    "",
    "### Say to the table (Ghostwire)",
    "",
    "> Mid-canyon. The Gold Line is a silver freight spine, not a commuter. Nox’s bird matches pace. Roof, then the aft hatch. Inside is crates and maglock glow — ARG cargo, sealed and moving.",
    "",
    "Walls / lights / tiles on Gold Line are **Michael’s live Scene**. Do not restamp or overwrite them.",
  ].join("\n")),

  page(ENTRY_ID, 5, "Beat2", [
    "**Block 2 · 40–50m · Scene: Gold Line interior (roofs hidden). Freight crawl → mid booth → search upstream.**",
    "",
    "**Crawl:** Stealth vs violence through aft freight; cams; ARG firearms; don’t emergency-stop while nested. Search if no ★ chamber intel.",
    "",
    "### Chamber walk (aft → forward)",
    "",
    "| Zone | Play | Meat |",
    "|---|---|---|",
    "| **L1** AFT FREIGHT | Board chamber; green crate stacks | **2** ARG Corporate Enforcers + cams |",
    "| **L2** FREIGHT PASSAGE | Ridged containers, clear lane | **1** worker drone (Medium, Integrity 24) |",
    "| **Mid console booth** | Sealed ARG booth — local overrides, not the host | **1** ARG Security Officer |",
    "| **Black-container aisle** | Container steel; keep moving | **0** native (spill on Alert) |",
    "| **Second-to-last** COURIER | Green crates; sealed capsule | **1** ARG guard (second Officer token) |",
    "| **R3** FRONT CAB | Drive end; Trace host | **1** ARG Response Lieutenant |",
    "",
    "Six zones — no seventh car. This is **not** a passenger crawl. If they lack ★ intel, they **search** upstream; the capsule is in the **second-to-last** car.",
    "",
    "Hard rule still holds: no intentional early emergency stop while the prize is nested. Loud meat can be tied to the host (optional; prefer Wire triggers). Trace **+1 max per round**.",
    "",
    "### Say to the table (Ghostwire)",
    "",
    "> Freight smell: ozone, packing foam, hot mag-rail. Cams tick. A booth mid-consist that does not want visitors. Whatever they’re here to lift is further up the consist.",
  ].join("\n")),

  page(ENTRY_ID, 6, "Beat3", [
    "**Block 3 · 30–40m · Scene: Gold Line interior. Wire + second-to-last courier.**",
    "",
    "**Wire:** Overlay / Jacked In; Console nodes; Watchdog; open case starts the post-extract clock; wipe if the train stops while nested. Call-home if Trace **~7–8**.",
    "",
    "### Nodes on this plate",
    "",
    "| Node | Chamber | Role |",
    "|---|---|---|",
    "| Track 1 | Every chamber | Maglocks + lights; cams on most (mid booth = local overrides) |",
    "| Track 2 | **Second-to-last** | Capsule lock + " + UUID.watchdog + " (Rating ~3, Integrity 26) |",
    "| Trace host | **R3** | Front cab / train host |",
    "",
    "The **second-to-last** car is the courier chamber — green crates, sealed capsule, one ARG guard. Watchdog lives on Track 2.",
    "",
    "Opening the case (wafer **out**) starts the post-extract clock. After extract the train **will** stop — that stop is expected. If the train stops **while the live wafer is still inside its carry capsule**, the wafer is **wiped and fragged**.",
    "",
    "Use Wired Console **Wire ping/spoof** (GM short text + Send) at Trace 6–7 for the call-home telegraph. Chat: public, or whisper to Overlay / Jacked In. Does **not** auto-move Trace. Hacker or Technomancer monitoring: **Detect**, then **Block**. Block success: packet dies; **Trace −1**. Fail / nobody monitoring: off-train scream / early ARG attention (optional meat Alert +1) — **not** an auto +1 Trace.",
    "",
    "### Say to the table (Ghostwire)",
    "",
    "> Courier chamber. Faraday hush around a sealed capsule. On the Wire the lock is a second door, and something in the stack is already listening.",
  ].join("\n")),

  page(ENTRY_ID, 7, "Beat4", [
    "**Block 4 · 25–35m · Scene: Gold Line (show roofs for Recall) → off the consist.**",
    "",
    "**Bail:** +1 Trace / 2 rounds out of case (respect +1/round cap); Recall the freighter; be gone before stop + ARG response.",
    "",
    "### Clock",
    "",
    "- Wafer **outside** its case: every **2 rounds → +1 Trace**. That tick **is** the round’s +1 if nothing else already raised it.",
    "- Trace **never** rises more than **+1 per round**, no matter how many triggers fire.",
    "- Forced stop at Trace **12**. If the wafer is already **out**, the stop is expected. ARG rapid response hits the consist — the crew must already be **off the train and clear**.",
    "",
    "### Roof Recall",
    "",
    "1. **Show** the **Roofs (overhead)** tile for the bail.",
    "2. Recall Nox’s same bird to the roof. Same Deploy/Recall fiction as the board.",
    "3. Get everyone onto the freighter and **gone** before ARG answers the stop.",
    "",
    "Gold Line ends here. Cut to **Nightjar Market** (short Grey Cab / Veinline hop). Nox drone condition is a fiction string they carry there (scratched = they bought it; lost = they explain to Mama).",
    "",
    "### Say to the table (Ghostwire)",
    "",
    "> The wafer is live in someone’s hand. The consist is going to stop. Recall the bird, hit the roof, and be air before ARG paints the canyon.",
  ].join("\n")),

  page(ENTRY_ID, 8, "Beat5", [
    "**Block 5 · 20–30m · Scene: Nightjar Market** — its own Foundry Scene after Gold Line, **not** a Gold Line Beat and **not** Mama’s club. Moral choice.",
    "",
    "**Choice:** Mama / corp / Signal; Nox drone condition as fiction string. Only one buyer seat is live unless the heat table says otherwise. Do **not** force Iona if the crew chose corp or Signal.",
    "",
    "| End choice | Face at Nightjar | Pay | Fallout |",
    "|---|---|---|---|",
    "| Deliver to **Mama** | " + UUID.iona + " — counter / table, basket cover | **¥8,000** | Clean contract; low heat if Trace stayed quiet |",
    "| **Corp sell** (ARG reclaim or rival flip) | " + UUID.rhen + " — counter, Grey Cab on the south road, or west bay | **¥14,000** | Mama pissed; ARG/SAN heat |",
    "| **Signal / Hands Off** contact | " + UUID.nim + " — east neon listen; a frequency more than a chair | **¥2,000 + weird** (Trace scrub, Soft favor, or SIN forget) | Political heat; MER/Signal notice; Mama cool |",
    "",
    "Half base only if the prize was **wiped/lost** — not for picking Signal. Discovery never added cash.",
    "",
    "Faction doors are real if they earned **D** in discovery; otherwise Mama is the contract they walked in with, and corp/Signal are still legal table choices if someone pushes.",
    "",
    "Watcher foreshadow, the optional 1d6 heat table, exchange Negotiation bands, and exits live in the Nightjar Market Director Notes of " + UUID.chapters + ". Do not reopen Gold Line Trace math at the counter.",
    "",
    "### Say to the table (Ghostwire)",
    "",
    "> Three doors. Mama’s money is clean. Corp money is louder. Signal pays in weird — a scrub, a Soft, a SIN that forgets your name. The wafer does not care who eats. The Reach will.",
  ].join("\n")),

  page(ENTRY_ID, 9, "Items", [
    "Director notes for the plot items. **B104 Gear SKUs shipped 0.3.52.** Drag from **Ghostwire Gear → Plot & Run Hooks** (Deadhead gallery art; do not regenerate). Hand " + UUID.mamaBrief + " at the Mama’s Club balcony. The prize is " + UUID.argCapsule + " (Faraday; wipe if the train stops while the live wafer is nested). Findable recon photo: " + UUID.aerialReconItem + " (sheet copy) + " + UUID.aerialRecon + " (Director handout).",
    "",
    "### Mama’s Deadhead Job Stick (Gold Line)",
    "",
    brief,
    "",
    "### ARG courier capsule / live wafer",
    "",
    "**Name:** ARG courier capsule / live transaction wafer (ghost ledger mirror)  ",
    "**Type:** Plot prize (carry capsule + live wafer)  ",
    "**Where:** second-to-last car, among green crates, one ARG guard  ",
    "**Wipe:** If the train **stops while the live wafer is still inside its carry capsule**, the wafer is **wiped and fragged** (prize destroyed).",
    "",
    "After the wafer is **removed** from the capsule, the train **will** stop. That post-extract stop is expected. The crew must be off the consist before ARG rapid response arrives.",
    "",
    "| Buyer | What they want | Table pay if the crew sells there |",
    "|---|---|---|",
    "| **Mama Cassavir** (via " + UUID.iona + ") | The contract. Ghost ledger mirror for her books. | **¥8,000** |",
    "| **Corp** (via " + UUID.rhen + ", ARG reclaim or rival flip) | Re-cage the wafer or flip it. | **¥14,000** |",
    "| **Signal / Hands Off** (via " + UUID.nim + ") | Break the ledger’s certainty. Pays weird. | **¥2,000 + weird** |",
    "",
    "Wafer-out tick (**+1 Trace / 2 rounds**) is **not** written on Mama’s job stick. Do not tell the table the exact chamber unless they earned **★**.",
  ].join("\n")),

  page(ENTRY_ID, 10, "Opposition", [
    "**Placement cheat sheet — LOCK: 5 security + 1 worker drone.** No **Passenger** opposition band. No civilian clutter beat. ARG uniforms (reusable Security + Lieutenant look).",
    "",
    "| Zone | Count | Actor |",
    "|---|---|---|",
    "| **L1** aft freight | **2** + cams | " + UUID.enforcer + " |",
    "| **L2** passage | **1** worker drone, Integrity/Stamina **24** | " + UUID.drone + " (`machine-drone-medium`) |",
    "| **Mid console booth** | **1** | " + UUID.security + " |",
    "| Black-container aisle | **0** native | Spill only on Alert |",
    "| **Second-to-last** courier | **1** ARG guard + sealed capsule | " + UUID.security + " (second token of the same Actor) · " + UUID.watchdog + " on Track 2 |",
    "| **R3** front cab | **1** — advances when Trace hits Hunting | " + UUID.lieutenant + " |",
    "",
    "**Count check:** Enforcer ×2 + Security Officer ×2 (mid booth + courier guard) + Lieutenant ×1 = **5 security**; drone ×1. No Officer nest. The courier guard is a second Security Officer token, not a separate SKU.",
    "",
    "Watchdog is Wire, not a meat token unless you want a Console piece on the capsule. Nox freighter **Actor** " + UUID.noxFreighterActor + " ships in **Ghostwire Runs — Deadhead Actors** (drag onto roofs; suggested **4×6**). Library Item: " + UUID.noxFreighter + ". Wired Console preset (nodes + Trace 0–12) is still a backlog item — narrate nodes until it ships.",
  ].join("\n")),

  page(ENTRY_ID, 11, "FoundryChecklist", [
    "Compendium home: **Ghostwire Runs → Deadhead** — " + UUID.chapters + " + this journal + " + UUID.mapNotes + " + " + UUID.aerialRecon + ". Actors: **Ghostwire Runs — Deadhead Actors**.",
    "",
    "### Scenes (world Scenes → Deadhead, in order)",
    "",
    "| Scene | Status | Director note |",
    "|---|---|---|",
    "| **Mama’s Club** | Reuse | Club plate already in-module (`assets/maps/battlemaps/mama-cassavir-club.webp` / `-loop.webm`). Balcony booth brief. Do not restamp. |",
    "| *Flats Transit* | Narrate | Grey Cab / Veinline hop — " + UUID.flatsTransit + ". **No phantom Scene.** |",
    "| **Rack & Rest** (Cube Hotel) | **Michael’s world Scene** | Commons = planning board. Drop the Faces Actors; do not force-rewrite the dressed Scene. Not a module inject — the module-injected **crew hangout** stays **REMOVED permanently 0.3.55**. If a world still has an injected hangout Scene, delete it manually. |",
    "| *Freighter Meet (Call Nox)* | Narrate | Pad + flyover in fiction. **No phantom Scene.** |",
    "| *Canyon / drone sling* | **SKIPPED** | No plate — **narrate** the mid-canyon approach and cut straight to the Gold Line roofs. |",
    "| **Gold Line** | **Michael’s live world Scene** | **Scenes → Deadhead → Gold Line.** Walls, lights, and tiles are sacred. Do **not** inject, restamp, force-refresh, or overwrite them. Hide **Roofs (overhead)** when playing inside; show roofs for board and Recall. |",
    "| **Nightjar Market** | **Create-once inject (0.3.87)** | **Scenes → Deadhead → Nightjar Market**, navigation after Gold Line. Plate `assets/maps/battlemaps/nightjar-market/nightjar-market.webp` (1579×915). Created only when no Nightjar Scene exists; never rewritten. Walls / lights / buyer seats are the Director dress pass — do not invent furniture. |",
    "",
    foundryNotes,
    "",
    "### Actors (shipped 0.3.87)",
    "",
    "- **Nightjar Market:** " + [UUID.iona, UUID.rhen, UUID.nim].join(" · ") + " — L1 platoon contacts, Wire Kit, not boss fights.",
    "- **Rack & Rest:** " + [UUID.vesper, UUID.tam, UUID.sera, UUID.vell, UUID.juno].join(" · ") + " — L1 social Faces.",
    "- Nox portrait (`assets/tokens/deadhead/nox-portrait.webp`) rides on the freighter Actor sheet.",
    "",
    "### Gear SKUs (shipped 0.3.52)",
    "",
    "- " + UUID.mamaBrief + " — `assets/items/deadhead/item-mama-brief-wafer.webp`",
    "- " + UUID.argCapsule + " — `assets/items/deadhead/item-arg-courier-capsule.webp`",
    "",
    "### Vehicles (shipped 0.3.54)",
    "",
    "- " + UUID.noxFreighterActor + " — **Ghostwire Runs — Deadhead Actors**. Placeable token (`assets/tokens/vehicles/nox-trash-freighter.webp`). Drag onto Gold Line roofs for Beat 1 board / Beat 4 Recall. Suggested size **4×6** squares (208 px = 5 ft); resize as needed; **5×8** if it reads small. Friendly, no ring. Plot / non-hostile. Integrity 80 / fly 12 are Heavy-air placeholders.",
    "- " + UUID.noxFreighter + " — **Ghostwire Vehicles → Air** library SKU. Tags: Deadhead / Plot / Cargo. Keep this Item; the Actor is the board token.",
    "",
    "Ghostwire **Runs** is JournalEntry-only (Director journals + handouts). Foundry cannot store Actors there, so Deadhead Actors live in the sibling GM-only pack listed next to Runs.",
    "",
    "### Handouts (shipped 0.3.54)",
    "",
    "- " + UUID.aerialRecon + " — Journal in **Ghostwire Runs → Deadhead**. Image page is the aerial recon photo (`assets/items/deadhead/gold-line-aerial-recon.webp`). Show it when canyon watch / Wire schedule recon / bribe succeeds before Beat 1. Discovery intel only (no cash). Do **not** bake into the Gold Line battlemap.",
    "- " + UUID.aerialReconItem + " — optional Plot gear Item (`Ghostwire Gear → Plot & Run Hooks`) so the photo can sit on a character sheet as found evidence.",
    "",
    "### Still open (do not invent in play)",
    "",
    "- Splash art (freighter + four runners over a moving consist).",
    "- Wired Console board preset (Track 1 chambers, Track 2 capsule + Watchdog in the second-to-last car, Trace host **R3**).",
    "- Nightjar Market walls / lights dress pass.",
    "",
    "Art locks when anything new ships: flat top-down; no people on maps; no baked grid; ARG uniform stylization reusable. **Do not** drop a generated train on Gold Line.",
  ].join("\n")),
];

must(pages.length === 12, `Expected 12 pages, got ${pages.length}`);
for (const p of pages) {
  const text = `${p.text.markdown}\n${p.text.content}`;
  must(!/\bPASSENGER\b/.test(text), `${p.name} has PASSENGER consist wording`);
  must(!/passenger PA/i.test(text), `${p.name} has passenger PA`);
  must(!/Draw Steel Heroes|MCDM/i.test(text), `${p.name} is not Ghostwire-only`);
  must(!/\bdecker\b|\bMatrix\b|\bShadowrun\b/i.test(text), `${p.name} uses non-Ghostwire player wording`);
  must(!/Shady Workshop/.test(text), `${p.name} still names Shady Workshop`);
  must(!/map-deadhead-hangout/.test(text), `${p.name} still names hangout plate`);
  must(!/deadheadHangoutScene|registerDeadheadHangoutScene/.test(text), `${p.name} still names hangout inject`);
  must(!/4\*{0,2} ARG Security Officers|Lt nest/.test(text), `${p.name} still seats the 4-Officer nest`);
  must(!/\bR1\*{0,2} courier|courier \*\*R1\*\*|\*\*R1\*\* is the courier/i.test(text), `${p.name} still labels the courier R1`);
  must(!/Mama’s Club \(return\)|return to Mama/i.test(text), `${p.name} still returns the prize to Mama’s club`);
  must(!/Handoff/i.test(text), `${p.name} still names a Handoff beat`);
}

const entry = {
  _id: ENTRY_ID,
  _key: `!journal!${ENTRY_ID}`,
  name: "GHOSTWIRE.Runs.Journals.DeadheadDirector",
  folder: FOLDER_ID,
  sort: 50000,
  categories: [],
  pages,
  ownership: { default: 0 },
  flags: {
    [MODULE_ID]: {
      source: SOR,
      remap: REMAP,
    },
  },
};

writeFileSync(OUT, JSON.stringify(entry, null, 2) + "\n", { encoding: "utf8" });

// ---------------------------------------------------------------- Session Chapters journal

const chaptersMd = readFileSync(CHAPTERS, "utf8").replace(/\r\n/g, "\n");
const carMd = readFileSync(CAR_BY_CAR, "utf8").replace(/\r\n/g, "\n");

/** `## ` sections of a markdown file, keyed by heading text. */
function sections(md) {
  const out = new Map();
  let current = null;
  for (const line of md.split("\n")) {
    const h = line.match(/^## (.+)$/);
    if (h) {
      current = h[1].trim();
      out.set(current, []);
      continue;
    }
    if (current) out.get(current).push(line);
  }
  return out;
}

const DOC_LINKS = {
  "DEADHEAD-GOLD-LINE.md": UUID.director,
  "GOLD-LINE-CAR-BY-CAR.md": UUID.carByCar,
  "GOLD-LINE-CARGO-REMAP.md": UUID.mapNotes,
};
const ID_LINKS = {
  gwMamaBriefWafer: UUID.mamaBrief,
  gwNoxTrashActor0: UUID.noxFreighterActor,
  gwNoxTrashFrgt00: UUID.noxFreighter,
  gwFlatsTransit00: UUID.flatsTransit,
};

/** Journal copy of Session Chapters prose: md links → UUIDs, clean-copy strips. */
function journalCopy(md) {
  let out = md.replace(/\[`([A-Z0-9-]+\.md)`\]\(\.\/[^)]+\)/g, (_, file) => {
    must(DOC_LINKS[file], `Session Chapters links an unmapped doc: ${file}`);
    return DOC_LINKS[file];
  });
  out = out.replace(/`(gw[A-Za-z0-9]{14})`/g, (m, id) => ID_LINKS[id] ?? m);
  out = out.replace(/\*\*\*([^*\n]+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  // Clean-copy doctrine: the art-brief checklist is production material, not table prose.
  out = out.replace(/\*\*Look \/ token art brief[^\n]*\n(?:- [^\n]*\n)+\n?/g, "");
  must(!/\]\(\.\/[^)]*\.md\)/.test(out), "Session Chapters journal copy still has a relative .md link");
  must(!/gw-art-refs|\/workspace\//.test(out), "Session Chapters journal copy still points at gw-art-refs staging");
  return out;
}

/**
 * Split one Scene's markdown into player-visible parts (Beat headings + READ ALOUD
 * boxes) and Director parts (everything else). Director parts become secret blocks.
 */
function chapterBlocks(md) {
  const lines = md.split("\n");
  const blocks = [];
  let inNotes = false;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || /^---\s*$/.test(line)) {
      i++;
      continue;
    }
    if (/^#{1,6} /.test(line)) {
      if (/^#{3} Director Notes/.test(line)) inNotes = true;
      blocks.push({ secret: inNotes, md: line });
      i++;
      continue;
    }
    if (line.startsWith(">")) {
      const quote = [];
      while (i < lines.length && lines[i].startsWith(">")) quote.push(lines[i++]);
      blocks.push({ secret: inNotes || !/READ ALOUD — (Meatspace|Wired)/.test(quote[0]), md: quote.join("\n"), readAloud: !inNotes });
      continue;
    }
    const chunk = [];
    while (i < lines.length && lines[i].trim() && !/^#{1,6} /.test(lines[i]) && !lines[i].startsWith(">")) chunk.push(lines[i++]);
    blocks.push({ secret: true, md: chunk.join("\n") });
  }
  return blocks;
}

function chapterHtml(pageId, md) {
  const allocId = createIdAllocator();
  const groups = [];
  for (const block of chapterBlocks(md)) {
    const last = groups.at(-1);
    if (last && last.secret === block.secret) last.parts.push(block.md);
    else groups.push({ secret: block.secret, parts: [block.md] });
  }
  let n = 0;
  return groups.map(g => {
    const html = markdownToHtml(g.parts.join("\n\n"), { allocId });
    if (!g.secret) return html;
    n += 1;
    return `<section class="secret" id="secret-${pageId.slice(4)}${String(n).padStart(2, "0")}">\n${html}\n</section>`;
  }).join("\n");
}

function readAloudBoxes(md) {
  return chapterBlocks(md).filter(b => b.readAloud && !b.secret).map(b => b.md);
}

const chapterSections = sections(chaptersMd);
const expected = new Set([...CHAPTER_PAGES.flatMap(p => p.headings), ...CHAPTERS_SKIPPED]);
for (const heading of chapterSections.keys()) {
  must(expected.has(heading), `Session Chapters has an unmapped section: ${heading}`);
}

const chapterLang = {};
const chapterPages = CHAPTER_PAGES.map((spec, index) => {
  must(/^[A-Za-z0-9]{16}$/.test(spec.id), `Bad page id ${spec.id}`);
  const md = journalCopy(spec.headings.map((heading, h) => {
    const body = chapterSections.get(heading);
    must(body, `Session Chapters missing section: ${heading}`);
    const text = body.join("\n").trim();
    return h === 0 ? text : `### ${heading}\n\n${text}`;
  }).join("\n\n"));
  const boxes = readAloudBoxes(md);
  must(index === 0 || boxes.length > 0, `${spec.key} has no READ ALOUD box`);
  for (const box of boxes) {
    must(!/Director|Foundry|★|@UUID|Trace ladder|opposition/i.test(box), `${spec.key} READ ALOUD box leaks Director material: ${box.slice(0, 120)}`);
  }
  chapterLang[spec.key] = spec.label ?? spec.headings[0].replace("Mama's", "Mama’s");
  return {
    _id: spec.id,
    _key: `!journal.pages!${CHAPTERS_ID}.${spec.id}`,
    name: `GHOSTWIRE.Runs.Pages.${spec.key}`,
    type: "text",
    sort: (index + 1) * 100000,
    title: { show: true, level: 1 },
    image: {},
    video: { controls: true, volume: 0.5 },
    src: null,
    system: {},
    text: { format: 1, content: chapterHtml(spec.id, md) },
    category: null,
    ownership: { default: -1 },
    flags: { [MODULE_ID]: { sessionScene: spec.headings[0] } },
  };
});

// GM-only chamber cards from the car-by-car sidecar (Director never reads this aloud).
const carSections = sections(carMd);
const carBody = carSections.get("Chamber cards");
must(carBody, "GOLD-LINE-CAR-BY-CAR.md missing ## Chamber cards");
const carText = [
  journalCopy(carBody.join("\n").trim()),
  "",
  "### Drag from",
  "",
  `- ${UUID.enforcer} ×2 · ${UUID.security} ×2 (mid booth + courier guard) · ${UUID.lieutenant} ×1 — **Ghostwire Bestiary**`,
  `- ${UUID.drone} ×1 — **Ghostwire Summons & Machines**`,
  `- ${UUID.watchdog} — Wire / Console piece on the capsule (optional token)`,
  `- ${UUID.noxFreighterActor} — roofs for board / Recall`,
  "",
  `Trace ladder, wipe rule, and call-home: ${UUID.director}.`,
].join("\n");
must(/5 security \+ 1 worker drone/.test(carText) && /second-to-last/i.test(carText), "car-by-car page must carry the 5+1 / second-to-last lock");
must(!/4\*{0,2} ARG Security Officers|R1\*{0,2} COURIER/i.test(carText), "car-by-car page still has the stale R1 / 4-Officer layout");
chapterLang.SessionCarByCar = "Gold Line — Car-by-Car (Director)";
chapterPages.push({
  _id: CAR_PAGE_ID,
  _key: `!journal.pages!${CHAPTERS_ID}.${CAR_PAGE_ID}`,
  name: "GHOSTWIRE.Runs.Pages.SessionCarByCar",
  type: "text",
  sort: (chapterPages.length + 1) * 100000,
  title: { show: true, level: 1 },
  image: {},
  video: { controls: true, volume: 0.5 },
  src: null,
  system: {},
  text: { format: 2, markdown: carText, content: markdownToHtml(carText) },
  category: null,
  // Hard GM-only even if the Director shares the entry with players.
  ownership: { default: 0 },
  flags: { [MODULE_ID]: { directorOnly: true } },
});

const allChapters = chapterPages.map(p => p.text.content).join("\n");
must(!/\bPASSENGER\b|passenger PA/.test(allChapters), "Session Chapters journal has passenger-train wording");
must(!/4\*{0,2} ARG Security Officers/.test(allChapters), "Session Chapters journal seats the 4-Officer nest");
must(/Nightjar Market/.test(allChapters) && /second-to-last/.test(allChapters), "Session Chapters journal lost the Nightjar / second-to-last locks");

const chaptersEntry = {
  _id: CHAPTERS_ID,
  _key: `!journal!${CHAPTERS_ID}`,
  name: "GHOSTWIRE.Runs.Journals.DeadheadSessionChapters",
  folder: FOLDER_ID,
  sort: 25000,
  categories: [],
  pages: chapterPages,
  ownership: { default: 0 },
  flags: {
    [MODULE_ID]: {
      source: CHAPTERS,
      carByCar: CAR_BY_CAR,
      sessionPackage: true,
    },
  },
};

writeFileSync(CHAPTERS_OUT, JSON.stringify(chaptersEntry, null, 2) + "\n", { encoding: "utf8" });

const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
lang.GHOSTWIRE.Runs.Journals.DeadheadDirector = "Deadhead — Director";
lang.GHOSTWIRE.Runs.Journals.DeadheadSessionChapters = "Deadhead — Session Chapters";
lang.GHOSTWIRE.Runs.Pages = { ...lang.GHOSTWIRE.Runs.Pages, ...LANG_PAGES, ...chapterLang };
writeFileSync("lang/en.json", JSON.stringify(lang, null, 2) + "\n", { encoding: "utf8" });

console.log(`deadhead: director journal, ${pages.length} pages → ${OUT}`);
console.log(`deadhead: session chapters journal, ${chapterPages.length} pages → ${CHAPTERS_OUT}`);
