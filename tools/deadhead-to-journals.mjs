#!/usr/bin/env node
/**
 * Builds Ghostwire Runs → Deadhead Director journal source from the locked SoR
 * + cargo remap sidecar. Numbers and rules stay identical to the markdown.
 *
 * Run:  node tools/deadhead-to-journals.mjs
 * Then: node tools/build-packs.mjs runs   (Foundry closed)
 *
 * Does not write Scene JSON, gold-line-scene.mjs, or gold-line-map.json.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { markdownToHtml } from "./lib/md-to-html.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const FOLDER_ID = "gwRunsDeadhead00";
const ENTRY_ID = "gwDeadheadDirJrn";
const OUT = "src/packs/runs/deadhead/deadhead-director.json";
const SOR = "docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md";
const REMAP = "docs/directors/runs/deadhead/GOLD-LINE-CARGO-REMAP.md";

const UUID = {
  mapNotes: `@UUID[Compendium.${MODULE_ID}.runs.JournalEntry.gwDeadheadGoldLn]{Gold Line — Map Notes}`,
  enforcer: `@UUID[Compendium.${MODULE_ID}.bestiary.Actor.h3LR6HHADCpyFMsN]{ARG Corporate Enforcer}`,
  security: `@UUID[Compendium.${MODULE_ID}.bestiary.Actor.DVEibxfpEWA5RoCn]{ARG Security Officer}`,
  lieutenant: `@UUID[Compendium.${MODULE_ID}.bestiary.Actor.g7LC1G0K20UnYzkr]{ARG Response Lieutenant}`,
  watchdog: `@UUID[Compendium.${MODULE_ID}.bestiary.Actor.dNEBSb47qSV9lRRH]{Watchdog ICE}`,
  mamaBrief: `@UUID[Compendium.${MODULE_ID}.gear.Item.gwMamaBriefWafer]{Mama’s Deadhead Brief (Gold Line)}`,
  argCapsule: `@UUID[Compendium.${MODULE_ID}.gear.Item.gwArgCourierCap0]{ARG Courier Capsule (Gold Line)}`,
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
  Beat5: "Beat 5 — Choice",
  Items: "Items",
  Opposition: "Opposition",
  FoundryChecklist: "Foundry Checklist",
};

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

const sor = readFileSync(SOR, "utf8").replace(/\r\n/g, "\n");
const remap = readFileSync(REMAP, "utf8").replace(/\r\n/g, "\n");

must(/cargo maglev/i.test(sor) && /not a passenger train/i.test(sor), "SoR must lock cargo maglev (not passenger)");
must(/AFT FREIGHT/.test(sor) && /freight Enforcers/.test(sor), "SoR must use cargo remap consist");
must(!/\bPASSENGER\b/.test(sor) && !/passenger PA/i.test(sor), "SoR still has passenger-train wording");
must(/¥8,000/.test(sor) && /¥14,000/.test(sor) && /¥2,000/.test(sor), "SoR pay table missing");
must(/\+1 per round/.test(sor) && /call-home/.test(sor), "SoR Trace lock missing");

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
const opposition = headingBlock(remap, "Opposition");
const foundryNotes = headingBlock(remap, "Foundry Director notes");

const pages = [
  page(ENTRY_ID, 0, "Overview", [
    "**Deadhead on the Gold Line** — Ghostwire playtest · **~4 hours** · Director journal.",
    "",
    "**Cargo maglev — not a passenger train.** ARG freight consist on dual Hammerhead chambers **L1–R3**. Plate notes: " + UUID.mapNotes + ".",
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
    "One Trace Alert on the Gold Line **train host** (Wired Console). Track **0–12**. Bands: quiet (0) · stir (1–4) · malice (5–8) · hunting (9–11) · lockout (12).",
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
    "Hull **20 ft** wide, **5 ft** furniture. Play surface = **2 × 3 Hammerhead chambers** plus coupler. Crew boards **aft (L1)** and works **upstream** (rightward, nose right). Capsule is **R1**.",
    "",
    chambers,
    "",
    "### Wire",
    "",
    wire,
    "",
    "Plate paths and roof/tile notes: " + UUID.mapNotes + ".",
  ].join("\n")),

  page(ENTRY_ID, 3, "Beat0", [
    "**Block 0 · 45–60m · Scenes: Deadhead Hangout → Mama’s Club.** Intel only. Fail = go in blind, not blocked.",
    "",
    "### Setup",
    "",
    "Start at **Scenes → Deadhead → Deadhead Hangout — Shady Workshop** (wrecked block: street stall, containers, and the crew’s open-roof workshop). The module injects it on first GM load; walls and lights are yours. Hand **Mama’s Deadhead Brief**. Then run the brief / return at **Mama’s Club** (reuse the club plate). Call **Nox** before you leave the Flats — the crew **borrows** the garbage-truck-sized trash freighter. Scratch it = buy it; lose it = explain to Mama.",
    "",
    "### Discovery table",
    "",
    discovery,
    "",
    "### Say to the table (Ghostwire)",
    "",
    "> Mama’s wafer is warm in someone’s pocket. Gold Line cargo run, Spire depot to Switchboard terminus. Live ARG transaction wafer in a sealed courier capsule. Lift it on the Wire, get off the consist before ARG answers the stop — then decide who eats.",
    "",
    "Do **not** name the capsule chamber unless they earned **★**. Do **not** put Watchdog / R2 cam numbers, the wafer-out tick, or the corp/Signal doors on the wafer until the matching intel lands.",
  ].join("\n")),

  page(ENTRY_ID, 4, "Beat1", [
    "**Block 1 · 30–40m · Scene: Gold Line — roofs → drop into L1.** Canyon approach is **narrated** — there is no canyon plate.",
    "",
    "**Board:** Deploy/Recall; Agility/Might board rolls; mixed = Alert +1; Jacked In can’t make physical board rolls.",
    "",
    "### Setup",
    "",
    "1. Canyon approach / drone sling — **narrate it, no map**. Nox’s trash freighter is **garbage-truck-sized** — keep it in the fiction as the bird they Recall later.",
    "2. Open **Gold Line** (Michael’s world Scene). **Show** the **Roofs (overhead)** tile for the board.",
    "3. Sling onto the **roof**, then drop **aft into L1** (left aft cargo / AFT FREIGHT). That is the board chamber. Work **upstream** (right) from here.",
    "4. Once the crew is **inside**, **hide the Roofs (overhead) tile**. Do not wait on Surface occlusion as the play instruction.",
    "",
    "L1 is freight, not a coach. **2** ARG Corporate Enforcers + cams cover **L1–L2**. Do not emergency-stop while the wafer is still nested.",
    "",
    "### Say to the table (Ghostwire)",
    "",
    "> Mid-canyon. The Gold Line is a silver freight spine, not a commuter. Nox’s bird matches pace. Roof, then the aft hatch. Inside is crates and maglock glow — ARG cargo, sealed and moving.",
    "",
    "Walls / lights / tiles on Gold Line are **Michael’s live Scene**. Do not restamp or overwrite them.",
  ].join("\n")),

  page(ENTRY_ID, 5, "Beat2", [
    "**Block 2 · 40–50m · Scene: Gold Line interior (roofs hidden). Freight crawl → L3 security nest.**",
    "",
    "**Crawl:** Stealth vs violence through aft freight (**L1–L2**); cams; ARG firearms; don’t emergency-stop while nested. Search if no ★ chamber intel.",
    "",
    "### Chamber walk (aft → forward)",
    "",
    "| Zone | Play | Meat |",
    "|---|---|---|",
    "| **L1** AFT FREIGHT | Board chamber; crate stacks | Freight Enforcers + cams |",
    "| **L2** FREIGHT | Connector clutter; keep moving upstream | Freight Enforcers + cams |",
    "| **L3** SECURITY | Mid cab = sealed ARG booth / Lt nest; play the cargo bay | **4** ARG Security Officers + **1** ARG Response Lieutenant |",
    "| *(coupler)* | Synthetic join | Non-walkable or Maglock gangway (Director call) |",
    "",
    "This is **not** a passenger crawl. No civilian clutter beat. If they lack ★ intel, they **search** upstream toward **R1** (capsule is not in L3).",
    "",
    "Hard rule still holds: no intentional early emergency stop while the prize is nested. Loud meat can be tied to the host (optional; prefer Wire triggers). Trace **+1 max per round**.",
    "",
    "### Say to the table (Ghostwire)",
    "",
    "> Freight smell: ozone, packing foam, hot mag-rail. Cams tick. The next bay hardens — ARG uniforms, a booth that does not want visitors. Whatever they’re here to lift is further up the consist.",
  ].join("\n")),

  page(ENTRY_ID, 6, "Beat3", [
    "**Block 3 · 30–40m · Scene: Gold Line interior. Wire + R1 courier.**",
    "",
    "**Wire:** Overlay / Jacked In; Console nodes; Watchdog; open case starts the post-extract clock; wipe if the train stops while nested. Call-home if Trace **~7–8**.",
    "",
    "### Nodes on this plate",
    "",
    "| Node | Chamber | Role |",
    "|---|---|---|",
    "| Track 1 | **R2** | Cams / doors |",
    "| Track 2 | **R1** | Capsule lock + Watchdog ICE |",
    "| Trace host | **R3** | Cab / train host |",
    "",
    "**R1** is the courier bay — sealed capsule stacks. Courier stays sealed until Alert. Watchdog lives on Track 2. If you need a clean sixth room, split **R2** as its own Wire chase between courier and cab.",
    "",
    "Opening the case (wafer **out**) starts the post-extract clock. After extract the train **will** stop — that stop is expected. If the train stops **while the live wafer is still inside its carry capsule**, the wafer is **wiped and fragged**.",
    "",
    "Use Wired Console **Wire ping/spoof** (GM short text + Send) at Trace 6–7 for the call-home telegraph. Chat: public, or whisper to Overlay / Jacked In. Does **not** auto-move Trace. Hacker or Technomancer monitoring: **Detect**, then **Block**. Block success: packet dies; **Trace −1**. Fail / nobody monitoring: off-train scream / early ARG attention (optional meat Alert +1) — **not** an auto +1 Trace.",
    "",
    "### Say to the table (Ghostwire)",
    "",
    "> Courier bay. Faraday hush around a sealed capsule. On the Wire the lock is a second door, and something in the stack is already listening.",
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
    "Nox drone condition is a fiction string you carry into Beat 5 (scratched = they bought it; lost = they explain to Mama).",
    "",
    "### Say to the table (Ghostwire)",
    "",
    "> The wafer is live in someone’s hand. The consist is going to stop. Recall the bird, hit the roof, and be air before ARG paints the canyon.",
  ].join("\n")),

  page(ENTRY_ID, 8, "Beat5", [
    "**Block 5 · 20–30m · Scene: Mama’s Club (return) or Deadhead Hangout.** Moral choice.",
    "",
    "**Choice:** Mama / corp / Signal; Nox drone condition as fiction string.",
    "",
    "| End choice | Pay | Fallout |",
    "|---|---|---|",
    "| Deliver to **Mama** | **¥8,000** | Clean contract; low heat if Trace stayed quiet |",
    "| **Corp sell** (ARG reclaim or rival flip) | **¥14,000** | Mama pissed; ARG/SAN heat |",
    "| **Signal / Hands Off** contact | **¥2,000 + weird** (Trace scrub, Soft favor, or SIN forget) | Political heat; MER/Signal notice; Mama cool |",
    "",
    "Half base only if the prize was **wiped/lost** — not for picking Signal. Discovery never added cash.",
    "",
    "Faction doors are real if they earned **D** in discovery; otherwise Mama is the contract they walked in with, and corp/Signal are still legal table choices if someone pushes.",
    "",
    "### Say to the table (Ghostwire)",
    "",
    "> Three doors. Mama’s money is clean. Corp money is louder. Signal pays in weird — a scrub, a Soft, a SIN that forgets your name. The wafer does not care who eats. The Reach will.",
  ].join("\n")),

  page(ENTRY_ID, 9, "Items", [
    "Director notes for the two plot wafers. **B104 Gear SKUs shipped 0.3.52.** Drag from **Ghostwire Gear → Plot & Run Hooks** (Deadhead gallery art; do not regenerate). Hand " + UUID.mamaBrief + " at Beat 0. The prize is " + UUID.argCapsule + " (Faraday; wipe if the train stops while the live wafer is nested).",
    "",
    "### Mama’s Deadhead Brief (Gold Line)",
    "",
    brief,
    "",
    "### ARG courier capsule / live wafer",
    "",
    "**Name:** ARG courier capsule / live transaction wafer (ghost ledger mirror)  ",
    "**Type:** Plot prize (carry capsule + live wafer)  ",
    "**Wipe:** If the train **stops while the live wafer is still inside its carry capsule**, the wafer is **wiped and fragged** (prize destroyed).",
    "",
    "After the wafer is **removed** from the capsule, the train **will** stop. That post-extract stop is expected. The crew must be off the consist before ARG rapid response arrives.",
    "",
    "| Buyer | What they want | Table pay if the crew sells there |",
    "|---|---|---|",
    "| **Mama Cassavir** | The contract. Ghost ledger mirror for her books. | **¥8,000** |",
    "| **Corp** (ARG reclaim or rival flip) | Re-cage the wafer or flip it. | **¥14,000** |",
    "| **Signal / Hands Off** | Break the ledger’s certainty. Pays weird. | **¥2,000 + weird** |",
    "",
    "Wafer-out tick (**+1 Trace / 2 rounds**) is **not** written on Mama’s brief. Do not tell the table the exact chamber unless they earned **★**.",
  ].join("\n")),

  page(ENTRY_ID, 10, "Opposition", [
    "**Placement cheat sheet.** No **Passenger** opposition band. No civilian clutter beat. ARG uniforms (reusable Security + Lieutenant look).",
    "",
    opposition,
    "",
    "| Zone | Count | Drop |",
    "|---|---|---|",
    "| **L1–L2** aft freight | Cams + **2** " + UUID.enforcer + " | Board / crawl |",
    "| **L3** security nest | **4** " + UUID.security + " + **1** " + UUID.lieutenant + " | Mid consist; play the cargo bay, treat the Hammerhead mid-cab as a sealed ARG booth |",
    "| **R1** courier | Sealed until Alert; " + UUID.watchdog + " on Track 2 | Wire beat |",
    "| **R2** | Cams / doors node (Track 1) | Meat only if you wake it |",
    "| **R3** cab | Trace host fiction | Drive end; not a second fight unless you need it |",
    "",
    "Courier stays sealed until Alert. Watchdog is Wire, not a meat token unless you want a Console piece on R1.",
    "",
    "Tokens still to drop on the Gold Line Scene (Michael’s plate): ARG Security, Lieutenant, Enforcers, Nox freighter. Wired Console preset (nodes + Trace 0–12) is still a backlog item — narrate nodes until it ships.",
  ].join("\n")),

  page(ENTRY_ID, 11, "FoundryChecklist", [
    "Compendium home: **Ghostwire Runs → Deadhead**. This journal + " + UUID.mapNotes + ".",
    "",
    "### Scenes Michael needs",
    "",
    "| Scene | Status | Director note |",
    "|---|---|---|",
    "| **Crew hangout** | **Shipped 0.3.43** | **Scenes → Deadhead → Deadhead Hangout — Shady Workshop** (`assets/maps/battlemaps/map-deadhead-hangout.webp`, 1920×1080, grid 80 = 5 ft). Injected on **new** worlds only; existing `deadheadHangoutScene` worlds are never rewritten. Still plate — no loop. Walls / lights / tokens are yours. Beat 0 start. |",
    "| **Mama’s Club** | Reuse | Club plate already in-module (`assets/maps/battlemaps/mama-cassavir-club.webp` / `-loop.webm`). Brief + Beat 5 return. |",
    "| **Canyon / drone sling** | **SKIPPED** | No plate and none planned — **narrate** the mid-canyon approach and cut straight to the Gold Line roofs. |",
    "| **Gold Line** | **Michael’s live world Scene** | **Scenes → Deadhead → Gold Line.** Walls, lights, and tiles are sacred. Do **not** inject, restamp, force-refresh, or overwrite them. Hide **Roofs (overhead)** when playing inside; show roofs for board and Recall. |",
    "",
    foundryNotes,
    "",
    "### Gear SKUs (shipped 0.3.52)",
    "",
    "- " + UUID.mamaBrief + " — `assets/items/deadhead/item-mama-brief-wafer.webp`",
    "- " + UUID.argCapsule + " — `assets/items/deadhead/item-arg-courier-capsule.webp`",
    "",
    "### Still open (do not invent in play)",
    "",
    "- Splash art (freighter + four runners over a moving consist).",
    "- Tokens on the Gold Line Scene; Nox freight-drone token.",
    "- Wired Console board preset (Track 1 **R2**, Track 2 **R1** + Watchdog, Trace host **R3**).",
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

const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
lang.GHOSTWIRE.Runs.Journals.DeadheadDirector = "Deadhead — Director";
lang.GHOSTWIRE.Runs.Pages = { ...lang.GHOSTWIRE.Runs.Pages, ...LANG_PAGES };
writeFileSync("lang/en.json", JSON.stringify(lang, null, 2) + "\n", { encoding: "utf8" });

console.log(`deadhead: 1 journal, ${pages.length} pages → ${OUT}`);
