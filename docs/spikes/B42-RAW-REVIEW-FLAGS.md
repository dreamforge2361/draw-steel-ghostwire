# B42 — RAW review flags

**For:** Michael’s review of `docs/raw/` (first full assemble, 2026-09-17).  
**What this is:** every rules problem found while assembling the RAW tree. None of these were fixed in RAW text — assembly only removed lore, dev notes, and Foundry notes, and never changed numbers. Decide each item, then fix the rulebook source and re-assemble (or fix RAW directly once it is the source of record).

**How RAW was assembled:**
- **Hand-written** (original wording, Draw Steel by reference plus remap tables): `00`, `01`, `02`, `03`, `04`, `07`, `22`, `24`, `25`.
- **Assembled from rulebook sources**, with lore, fiction openers, review checklists, open-question sections, Foundry notes, and design rationale removed: `05`, `06`, `09`, `10`, `21`, `23`.
- **Kits, gear, and wealth** (`08`) was assembled from the Kits and Economy chapters, plus a Gear section re-expressed by Echelon + Availability per the Gear master’s DS alignment override.
- **Perks** (`11`) come from the perk chapter plus all 47 perks and 3 perk abilities from the Perks pack.
- **Class chapters** (`12`–`20`) were assembled by script, then given an editorial scrub. Table rows and numbers were diffed before and after; every removed number was checked and belonged to dev text.

---

## A. Book-wide decisions

1. **DEFERRED — Pass B (A1): DS-compatible trait wording may stand for now; optional original-voice pass later.** **Copyright check — ancestry trait text.** Many purchased-trait and signature descriptions in `05-ancestries.md` follow Draw Steel Heroes wording closely (for example Detect the Supernatural and Staying Power). Several class abilities also carry Heroes-adapted text (Operator 7/9/11-cost bands). Confirm the Creator License covers this, or rewrite in original wording.
2. **DONE — Pass B (B42d).** **License attribution statement** is a placeholder in `00-front-matter.md`. Insert MCDM’s required Draw Steel Creator License wording.
3. **DONE — Pass A (B42c).** **Body Integrity contradiction.** `09-chrome-body-integrity.md` says every living hero starts at **20**. The Operator, Elementalist, and Hacker chrome sections — and the old Wire text — used **`6 + Physique + Echelon`** (removed from `21`, still implied in class chrome notes). Pick one.
4. **DONE — Pass A (B42c).** **Chrome grades.** Chrome uses Salvage / Standard / Soft. The Hacker chrome section uses “E1 Salvage / E2 Standard / E3 Milspec / E4 Bioware.” Pick one scheme.
5. **DONE — Pass A (B42c).** **Magic erosion model.** Chrome chapter: −1 cap per 2 / 3 / 1 Integrity by grade. Technomancer: “beyond a free allowance of 2.” Street Priest: “chrome-load essence above a sliver” (unit undefined). Decide whether casters share one model.
6. **DONE — Pass A (B42c).** **“Persona” means two things:** the characteristic, and your presence in the Wired. The glossary distinguishes them; consider renaming the Wired one (for example “Wired persona” → “avatar” or “icon”).
7. **DONE — Pass A (B42c).** **“BP” / “SP”** (build points / skill points) appear in class text and the Economy firewall but Draw Steel has no such currency. Define (as the glossary now does) or reword to “character power.”
8. **DONE — Pass A (B42c).** **Surge definition conflict.** Scout and Elementalist: a surge is +2…+5 damage by echelon, in inverted echelon order. Commander: surges grant temporary Stamina. Draw Steel defines surges by reference; pick the Draw Steel rule and fix both.
9. **DONE — Pass A (B42c).** **Gear damage tags vs Draw Steel damage types.** Gear tags damage kinetic / AP / electrical / fire / toxin; Draw Steel types are acid, cold, corruption, fire, holy, lightning, poison, psychic, sonic. Confirm the mapping (electrical → lightning? toxin → poison? kinetic and AP → untyped?).
10. **DONE — Pass A (B42c).** **Weapon damage bands.** The Gear master says weapon base damage is “the Tier-2 standard hit” and is scaled by old Outcome-Tier riders (inverted language). `08` prints only the base bands. Decide how result bands scale weapon base damage in Draw Steel order.
11. **DONE — Pass A (B42c).** **Armor-as-Stamina has two Echelon 1 columns** (Street and Professional). Decide which one a 1st–3rd level hero uses.
12. **DONE — Pass B (B42d).** **Remaining tier language** (means echelon, cost band, or result) — see chapter lists below. Also the Technomancer’s “Hybrid Tier” sprite grammar and “Cost Tiers” headings.
13. **DONE — Pass B (B42d).** **Inverted echelon or result order** appears in several abilities (flagged below).
14. **DONE — Pass B (B42d).** **DC-based saves and to-hit language** (Technomancer sprites and biofeedback, Wrench “+1 to hit”) don’t match Draw Steel. Convert to potency / saving throw / edge-bane.
15. **Missing shared chapters** that class text points to: Followers & Contacts, Lifestyle, Downtime Projects (beyond §Craft), a full Veil chapter (spirit ranks, “Veil §C3”), vehicle-combat ramming detail, hostile-environment rules.

---

## B. Chapter flags

### 02 Heroes and Characteristics
- Operator epic resource: chassis says **Combat Legend**; the 10th-level feature grants **Overclock** (also the Wrench’s epic resource name). Shown as “Combat Legend (Overclock).”

### 05 Ancestries
- Arcane Severance: source bullet listed only Elementalist and Street Priest; RAW now lists Technomancer too (matches `09-species.md` constraints). Confirm.
- Cyborg **System Crisis** and **tech-only recovery** have no table or procedure.

### 08 Kits, Gear and Wealth
- Kit bonus lines and signatures are provisional benchmarks.
- Merc (Operator) dual-Kit stacking rule is still undefined.
- Background/Profession ¥ bonus: RAW says “a Director may grant a small ¥ bonus”; amount open.
- No lifestyle table; no bribe or Wired-access price points.

### 09 Chrome and Body Integrity
- Implant ¥ prices, Availability, and package totals are not published.
- Frame Module list, hardpoint caps, and prices are not published.
- Called-shot and anti-cyber numbers are not published.

### 11 Perks
- Only Operator and Scout perk grants are listed in the perk table; other classes list theirs in class chapters.

### 12 Operator
- Signature abilities: “rolled with Reflex” vs “@chr always means Physique.”
- “Every Operator knows both signatures” vs the progression table’s “choose 1 of 2.”
- Missing effects: Kinetic Redirect, Wired Reflexes, Contract Fulfilled, Crossfire, Overclock Nerves; Danger Close has no damage line.
- Doctrine abilities carry the Magic keyword and corruption / psychic damage in a mundane class (Killer Rep, Target Marked, Last Word, Saturation Fire).
- Leftover Draw Steel names: “Harbinger of the Primordial Chaos” (9th), “Veteran of the Sprawl” template wording.
- Gutter Instinct: “gain Adrenaline” with no amount.
- Progression table level 2: “Perk (any) | Perk (choice)” may double-count.

### 13 Scout
- Potency letters use Draw Steel initials (A / M / R / I / P) — map to Physique / Reflex / Logic / Instinct / Persona.
- Range Discipline: inverted echelon order and mismatch with Quarry doubling.
- Subclass terms still say “College” / “Shadow College” (Draw Steel Shadow).
- Called Shot (Comm-link): “per §D4” and “Wired-side biofeedback” undefined here.
- Overwatch Lane triggers “Precision Strike” (an Operator feature).
- The Grate: “On a critical hit” undefined.
- Longshot range: Sensor-Fusion Smartlink “up from Ranged 5” vs Longshot Kit already Ranged 20.
- Overclock Cascade now carries its chrome **prerequisite** in the effect text; this contradicts “all heroic abilities are available to every Scout.”

### 14 Commander / Face
- Inverted result order (high → low): Fearful Awe, Battle Cry, Concussive Command, Coordinated Strike, Break Their Nerve, Speak With One Voice.
- Doctrine ability costs still in Draw Steel **Focus** (“5-focus”, “9-focus”, “11-focus”) — convert to Influence.
- Tier language: “auto-Tier-1 on Kit signatures” (level 9), “The tier of success determines” (Command Presence), “Tier” column in doctrine tables.
- Missing action types: Battle Cry, Concussive Command, Coordinated Strike, Break Formation.
- “Command Persona / Fearful Awe” vs inner mode name “Command Presence.”
- Break Their Nerve: unclear who rolls. Speak With One Voice: “Instinct-scaled resistance” undefined.
- Skills row: “spend half your starting Skill Points” — no skill points exist.
- Outside-combat wording “once each per rest or Victory” differs from other classes.
- Doctrine feature levels: text says 1/2/3/5/6/8/9; tables also grant at 7.
- Command (epic): carry-over model differs from other classes’ XP-at-respite epic resources.
- Master of Voice: “roll 3 dice, keep the best 2” is non-standard.
- Worked example misapplies the Right Word benefit.
- Covert Operations, Studied Commander, Discover Lore named but not defined.

### 15 Medic
- Reagent restock cost and procedure undefined (“tied to nuyen and crafting”).
- Tier language: “your tier’s kit capacity”, “at higher tiers”, “one rare implant per tier”, subclass table “Tier” column holding levels.
- Undefined numbers: Toxic Cloud, Chemical Warfare, Nerve Agent, Full Kit Purge, Chemical Interrogation (“Director’s table”).
- Field Synthesis Antidote: “½ step” unresolved.
- Field Synthesis “once per encounter, no exceptions” vs Street-Doc Make Do “twice per encounter.”
- Trash-Bin Chemistry adds Toxin access that base Field Synthesis already allows.
- Field Synthesis listed at 2nd level, but 1st-level features assume it.
- Crash rider is a single −1 roll, yet Corp-Medtech “reduces crash duration by 1 round.”
- Nano-Adrenal Auto-Injector: “burn 30 Reagents” exceeds the 8th-level cap; reset cadence undefined and conflicts with “once per session.”
- Scrounger’s Eye / The Doc Who Never Left: time cost and restock roll undefined.
- Medical Consumables table: Tier and Avail columns look swapped (descending grades); Stim Patch crash differs from class rule.

### 16 Wrench
- **All Uptime, cost, damage, slot, fleet, and buffer numbers were marked estimates** — provisional.
- Nuyen Cost Bands use placeholder ¥ symbols; no prices.
- Attribute Doctrine table keeps a legacy Draw Steel attribute column — keep or drop.
- Uptime drain from body damage has no amount; jam drain “typically 2–4.”
- Jump-In: “moderate difficulty” — no difficulty set.
- Cross-scale rule: damage-multiplier steps undefined.
- Lifestyle Hook depends on a Lifestyle system that doesn’t exist.
- “see Nuyen Economy Doctrine, below” — no such section.
- Ram: “per the vehicle-combat ramming rules” — none in the chapter.
- Band labels vs costs: “7-Cost Band” abilities cost 2–5, “9-Cost Band” cost 4–9.
- Signatures: “choose from” vs level 1 grants all four.
- Fleet Size “base 3 at 1st level” vs table “online at 2nd.”
- Drone Jockey auto-Suppress granted at 1st and again at 2nd.
- Rig-Pilot discounts reference Deploy / Jump-In costs that are 0.
- Facility Rigger: “Turn the Building” and “The Building Remembers” each appear twice with different effects.
- Rigged Fire low result: “+1 to hit” (not Draw Steel).
- Total Swarm Protocol / One Machine One Will: no result tables.
- Unbreakable Hive: “d6, 4+” non-standard.
- Uptime Economy Mastery: +2 flat is worse than the normal drip with 3+ machines.
- Characteristic increases have no values; no Potency row.

### 17 Elementalist
- 7/9/11-cost bands are marked **provisional** in their headings.
- Cap: “level 10 may reach 24” vs Essence Cap +4 (7th) — possible double count.
- Inverted echelon order: Burn On, surge box (also mentions a nonexistent Echelon 5), Kinetic Enlargement, Rolling Thunder, Riptide Grab, Stone Shield.
- Subclass tables: “2nd tier / 6th tier / 9th-band” (Living Sun and Ashen Wake say 9th-band but cost 11).
- “1st-tier feature and a contact hook” — no contact hooks defined.
- Sanctum Stone: “2-round zone” vs Persistent 2 sustain.
- Summon Elemental extension vs independent forms both present — unsettled; cites “Veil rules §C3.”
- World-Sundering: “No damage roll” but was noted as keyed off Logic.
- Pointers to Gear Catalog 6A, Hostile-Env rules, Followers & Contacts, and a “Kits and Chrome” section that doesn’t exist.
- Signature Bond: “Costs 1 BP/SP.”

### 18 Street Priest
- Conviction cap “+4 per tier (E4=8, E3=12, E2=16, E1=20)” — descending echelon labels.
- Earning Conviction table keeps a design Rationale column.
- Signatures and most heroic abilities list “Holy or corruption damage” with **no damage values** (Smite/Rebuke, Call the Thunder Down, Penance, …).
- Smite/Rebuke name collision with a chosen Rebuke.
- Tier language: Minor Rebuke table “Tier”, Violence Will Not Aid Thee “tier value”, Faith Is Our Armor “by your tier”, Dark failed bind “entity’s tier’s damage”, subclass “Tier” columns.
- Invoke the Pact middle/high numbers incomplete (“per Veil §C3”).
- Judgment, Warden’s Grace, Priest’s Ward: amounts undefined.
- Subclass ladder levels vs progression table mismatch.
- Minor Miracle says “downgrade” but describes an upgrade.
- Most Faithful: “removed entirely” vs “reroll once.”
- Foci table: Tier / Avail columns look swapped.
- Creed-brand focus “softens backlash” vs “the gamble never causes backlash.”
- A removed Draw Steel note said the other 6 Conduit signatures stay available for retraining (Director’s call) — decide whether that’s a rule.

### 19 Hacker
- Cyberdeck signature damage uses Foundry `@chr` syntax — say “+ Logic” (or the roll’s characteristic).
- Flatline Jab “regardless of tier”; Root Access “+2/+2 at every tier.”
- Programs: “every Program is a signature ability” vs Programs costing 2–11 Bandwidth.

### 20 Technomancer
- Hybrid Tier / cost-tier language throughout.
- Attack-sprite uses attack-vs-defense and flat 2d10 damage; sprites have “flat 10 defense.”
- Decompile rule sprite HP formula contradicts the stat table.
- Biofeedback uses DC saves (12–20); Rewire Reality / The Weaver’s Web “DC 18.”
- Biofeedback at 0 Stamina “Winded instead of Dying”; “Winded, save ends” used as a condition.
- Advanced sprites “roll their own initiative.”
- Compile Sprite: free signature vs “costs 3 Resonance.”
- Resonance Strike: no damage values; adds a skill to the roll; references a nonexistent Hacker “Feedback Spike.”
- Resonance Mending: action type, self-target, and base heal inconsistent between signature and Deep Dive.
- Sprite HP “tier” steps undefined.
- Worked example arithmetic inconsistent; calls the 7-cost ability “7th-level.”
- Progression table “Echelon (gear-tier ref only)” column.
- Sprite cap: Sprite-Weaver 6 at 8th vs baseline 4 at 8th — stacking unclear.

### 21 The Wire
- Trace Alert increase on middle results is ability-specific; confirm no default.
- Old reconciliation note (Overlay ≈ baseline wireless / wired-direct; “×1 if wired-direct”) removed; the Biofeedback row still lists a ×1 wired-direct multiplier that has no connection state.

### 22 The Veil
- Chapter is intentionally thin; a shared Veil chapter is not yet written.

### 23 Machines
- Drone and vehicle Integrity / Speed / Armor numbers are not published (qualitative profiles only).
- Wrench chapter slot counts by Scale band vs Gear-master Availability slot counts differ (removed note).

---

## Pass A — LOCKED 2026-09-17 (Michael)

| # | Decision |
|---|---|
| A3 | **Body Integrity** starts at **20** for every living non-Cyborg. Scrub `6 + Physique + Echelon` (and any Wire leftovers) everywhere. |
| A4 | **Chrome grades** = **Salvage / Standard / Soft (Bioware)** only. Do not use Milspec/Bioware as grade labels; Milspec stays an **Availability** band. |
| A5 | **Magic erosion** = shared Chrome formula for all casters: −1 cast-resource cap per **2** Integrity (Standard), per **3** Soft, per **1** Salvage. Remove Technomancer “free allowance of 2” and Street Priest “sliver” as separate models. |
| A6 | Wired presence renamed **avatar** (never “persona” alone). Characteristic stays **Persona**. Glossary + Wire/Hacker/Technomancer scrub. |
| A7 | No **BP/SP** currency. Reword to chargen picks / character power / skill picks. Economy firewall stays “¥ never buys character power.” |
| A8 | **Surges** = Draw Steel Heroes by reference. Scrub Scout/Elementalist inverted echelon surge-damage boxes and Commander “surge = temp Stamina” unless that is true DS wording — do not invent a Ghostwire surge. |
| A9 | Gear damage tags map: **electrical → lightning**, **toxin → poison**, **fire → fire**, **kinetic / AP → untyped** (AP remains a gear note: ignores/reduces armor-as-Stamina per gear rules, not a DS damage type). |
| A10 | Weapon Power Roll results print **low / middle / high** (DS order). Base weapon numbers in `08` are the middle band unless a line explicitly gives all three; scrub inverted Outcome-Tier language. |
| A11 | **Armor-as-Stamina Echelon 1** default column = **Street**. Professional is the upgraded E1 shopping tier when Availability allows — not the default for levels 1–3. |

**Still open (not Pass A):** A1–A2 Creator License / ancestry copyright wording; A12–A15 tier scrub backlog, DC→potency conversion, missing shared chapters — Pass B+.

**Apply to:** `docs/raw/` (SoR for Journals) **and** matching `docs/rulebook/` / masters sources so the next `raw-to-journals` rebuild stays clean.

### Pass A — applied 2026-09-17 (B42c, pending Michael review)

| # | Status | RAW (`docs/raw/`) | Sources synced |
|---|---|---|---|
| A3 | **Done** | `12`, `17`, `19` | rulebook `01`, `06`, `08`; Operator / Elementalist / Hacker masters |
| A4 | **Done** | `19` | rulebook `08`; Hacker master |
| A5 | **Done** | `09`, `17`, `18`, `20`, `22` | rulebook `06`, `07`, `12`, `20`; Chrome, Elementalist, Street Priest, Technomancer masters |
| A6 | **Done** | `00` (glossary: **Avatar**), `19`, `21`, `25` | rulebook `08`; Gear master (deck rows) |
| A7 | **Done** | `00` (glossary: **Character power**), `08`, `09`, `13`, `15`, `16`, `17`, `18`, `20` | rulebook `02`–`07`, `09`, `10`, `11`, `12`, `20`, `SPECIES-DS-MAP`; Chrome, Gear, Kits, Species masters |
| A8 | **Done** | `13`, `14`, `17` | rulebook `02`, `03`, `06`; Scout, Commander, Elementalist masters |
| A9 | **Done** | `04` (mapping table), `08`, `15` (Toxin compounds deal poison damage) | rulebook `04`; Gear master |
| A10 | **Done** | `08` | Gear master, Kits master (weapon/Kit Outcome-Tier language → low / middle / high) |
| A11 | **Done** | `08` (Street = E1 default note) | Gear master armor table |

**Journals:** `tools/raw-to-journals.mjs` + `build-packs.mjs` re-run; module 0.1.56.

**Left for Pass B (not Pass A):**
- Class-ability hybrid damage types that aren’t gear tags: Operator “corrosive” / “kinetic-feedback” (Overclocked Adrenaline, Combat Form, Warzone Incarnate); Scout “thermal-kinetic” (Kicked Sparks, The Grate).
- Species master: retired BP pool costs relabelled **Minor / Standard / Signature** (legacy 2 / 4 / 6); `09-species` now says ancestry points are the only species budget. Confirm the relabel.
- Class development masters still carry BP firewall wording and non-weapon Outcome-Tier ability text (dev history; A12 backlog).
- `Corp-Milspec` (Operator subclass name) and “Avail. milspec” item labels kept — Availability, not chrome grade.

---

## Pass B — LOCKED 2026-09-17 (Michael)

| # | Decision |
|---|---|
| A2 | Insert required Creator License attribution in `docs/raw/00-front-matter.md` (and keep for PDF/storefront later): **“Draw Steel - Ghostwire Build is an independent product published under the DRAW STEEL Creator License and is not affiliated with MCDM Productions, LLC. DRAW STEEL © 2024 MCDM Productions, LLC.”** Link reference: https://mcdm.gg/ds-license / https://www.mcdmproductions.com/draw-steel-creator-license |
| A1 | **No full ancestry rewrite this pass.** Under Creator License, DS-compatible trait wording may remain for now; flag A1 as **deferred** (optional original-voice pass later). Do not paste new long Heroes excerpts. |
| A12 | Scrub remaining **tier** language: say **echelon**, **cost band** (1–5 / 7 / 9 / 11), **Power Roll result** (low/middle/high), or **Node Rating** — never bare “tier.” Technomancer “Hybrid Tier” → **hybrid band** (or “sprite rank”); “Cost Tiers” → **cost bands**. |
| A13 | Fix **inverted** echelon or result order wherever still present (print low→high / E1→E4). |
| A14 | Convert **DC saves** and **“+1 to hit”** / attack-vs-defense language to Draw Steel **potency / saving throws / edge–bane**. Especially Technomancer sprites + biofeedback, Wrench Rigged Fire. |

**Out of Pass B:** A15 missing chapters (Followers, Lifestyle, full Veil, etc.) → later content pass. Class holes with missing numbers (Priest damage, Wrench estimates) → Pass C.

### Pass B — applied 2026-09-17 (B42d, pending Michael review)

| # | Status | What changed |
|---|---|---|
| A2 | **Done** | `00-front-matter` carries the exact Creator License statement, plus a note that the compatibility logo is allowed but not required (no logo asset this pass). |
| A1 | **Deferred** | No ancestry rewrite. `05-ancestries` untouched. |
| A12 | **Done** | Bare “tier” gone from `13`–`21`. Now: **echelon** (hero progression), **cost band** (ability costs), **Power Roll result** (outcomes), **Node Rating** (Wired), **Level** (subclass table columns), **sprite rank** / **hybrid band** (Technomancer), **Crash step** (Medic), **chassis band** / **Nuyen cost band** (Wrench), **rank** (Veil entities). |
| A13 | **Done** | Commander’s six high→low ability tables now print low / middle / high. Descending echelon ladders relabelled E1→E4 (Scout Range Discipline, Street Priest Conviction cap, Elementalist Burn On / Kinetic Enlargement / Rolling Thunder / Riptide Grab / Stone Shield; “Echelon 5” dropped). Medic Minor Miracle “downgrade” → “upgrade”. **No values changed, only their labels.** |
| A14 | **Done** | Technomancer biofeedback DCs → Draw Steel tests (5-cost easy · 7-cost medium · 9-cost hard · 11-cost hard with a bane; discipline DC∓2 → edge / bane). Enemy DC saves → potency (`Persona < STRONG`). Sprite attack-vs-defense and “flat 10 defense” → strikes with no defense numbers. Wrench Rigged Fire “+1 to hit” → edge. Wire “Breach DC” → **Breach difficulty** (R1 easy · R2 easy with a bane · R3 medium · R4 hard · R5 hard with a bane). Commander “5-focus/9-focus/11-focus” → Influence. |

**Locked label conversions (legacy item tier → echelon, per `10-mods` 5→1, 4→1, 3→2, 2→3, 1→4):** Street Priest foci table (8 rows) and Medic consumables table (5 rows); both tables also had their swapped **Availability** / **Echelon** columns fixed. Prices and benefits unchanged.

**Allowed leftovers:** the legacy-conversion notes themselves (`24-advancement`, `10-mods`, `25-opposition`, `00-INDEX`, `08`, `00-front-matter` / `01` “no tier ladder”), `08`’s “no to-hit-versus-defense roll” statement, and one in-fiction place name (“the chop-shop on Fourth Tier”, `16-wrench`).

**Journals:** `tools/raw-to-journals.mjs` + `build-packs.mjs` re-run; module 0.1.57.

### Pass C backlog (found during Pass B, not fixed — missing numbers and rules holes)
- **Street Priest:** no damage values on Smite/Rebuke, Call the Thunder Down, Penance, Beacon of Grace, Drag the Unworthy; Faith Is Our Armor prints 3 values for 4 echelons; Invoke the Pact defers to a Veil §C3 that doesn’t exist; Judgment / Warden’s Grace / Priest’s Ward amounts undefined.
- **Medic:** Toxic Cloud, Chemical Warfare, Nerve Agent, Full Kit Purge, Chemical Interrogation magnitudes; restock cost; Field Synthesis “½ step”; Nano-Adrenal “burn 30 Reagents” over the 8th-level cap.
- **Technomancer:** Sprite HP “rank” is an undefined unit; Ward-sprite “+1/+2 defense” and Harmonic Adjustment “+2 defense” need a Draw Steel equivalent; attack-sprite has one damage line and no result spread; Decompile benchmark contradicts the sprite table; Winded-instead-of-Dying; sprites rolling their own initiative; Compile Sprite free vs 3 Resonance.
- **Elementalist:** five 9th-level specialization abilities cost 11 while the 11-cost band unlocks at 8th; World-Fissure duplicated; Essence cap possible double count.
- **Wrench:** “four cost tracks” vs five table rows; Jump-In “moderate difficulty”; d6 and flat-threshold rolls (Unbreakable Hive, Systems Purge); Turn the Building / The Building Remembers each defined twice.
- **Commander:** missing action types; “Skill Points”; Master of Voice 3d10-keep-2; worked example misapplies The Right Word.
- **Book-wide:** flat “+1 / +2 to a roll” bonuses that Draw Steel would express as edge / bane (Medic, Wrench, Commander Kit and feature lines) — not covered by A14 as written.

---

## Pass C — applied 2026-09-17 (B42e, pending Michael review)

Source-of-truth order used everywhere: **Development Master → shipped Foundry pack (`src/packs/**`) → Draw Steel spine by reference**. No combat math was invented; anything unresolvable carries an inline `[PASS-C NEEDS MICHAEL: …]` marker in the RAW chapter.

| Chapter | Filled (source) | Still open |
|---|---|---|
| **18 Street Priest** | ~25 abilities got their low/middle/high damage and rider values from the class pack (Smite / Rebuke, Blessed Light, Call the Thunder Down, Penance 4/7/11, Beacon of Grace 8/13/17+Persona, Drag the Unworthy 9/13/18+Persona, Curse of Terror, Soul Siphon, …). Warden’s Grace = Persona score; Priest’s Ward = 2 temporary Stamina; Judgment fully defined; Invoke the Pact’s “per Veil §C3” replaced with the pack’s extension-form strike (4/7/10+Persona); unnamed L5/L8 subclass bumps named; Most Faithful = reroll once; Creed-brand vs backlash; subclass ladder rebuilt from pack advancements (features L1/4/5/7/8/9, ability picks L1/2/6, L9 auto-granted). | 4 markers: independent-form stat block, failed-bind strike damage, Judgment’s optional damage rider, and **Faith Is Our Armor** (see below). |
| **15 Medic** | Toxic Cloud, Nerve Agent, Chemical Interrogation (now `Physique < AVERAGE` potency), Full Kit Purge targeting — all from the pack. Field Synthesis “½ step” = suppress 1 step; Field Synthesis is a **2nd-level** feature and Make Do raises it to twice per encounter; Trash-Bin Chemistry reworded to a guarantee; Nano-Adrenal reset = once per session, and its 30-Reagent cost is printed as deliberately unreachable until Echelon 4; restock is never a roll. | 3 markers: restock ¥ cost/procedure, Full Kit Purge magnitude, crash-rider duration vs Pharmaceutical Grade. |
| **20 Technomancer** | “Sprite HP rank” replaced by ordinary **Stamina** (shipped sprite Actors); per-archetype Stamina formulas cited; attack-sprite low/middle/high spread printed; Resonance Strike roll (2d10 + Logic) and damage filled, “Feedback Spike” corrected to the Hacker’s **Flatline Jab**; Resonance Mending signature entry aligned to the pack (maneuver, self allowed, one Recovery); Decompile settled in favour of the stat table; Compile Sprite base is **free** and 3 Resonance is the Enhance cost; sprite caps don’t stack; sprites take their own turn (no initiative roll); worked example now reconciles (5 / 9 / 6). | 1 marker: “Winded, save ends” has no end state. |
| **17 Elementalist** | Five 9th-level specialization abilities at cost 11 confirmed correct (grants, not band picks — master + pack agree); World-Fissure is one ability at cost 9; Essence Cap +4 at 7th **is** the Echelon 3 step, not an extra; Sanctum Stone = Persistent 2; World-Sundering = no Power Roll; Fortress Stance = Physique test. | 1 marker: what grants the level-10 cap of 24 (vs Echelon 4 = 20). “Provisional” stays on the 7/9/11 bands — the master has **not** locked them. |
| **16 Wrench** | “Four cost tracks” → five; Jump-In = **medium** Logic or Reflex test with the frame’s Handling as edge/bane, failure total 5 or lower; Systems Purge reshaped as a Power Roll (same odds); Unbreakable Hive → a Draw Steel saving throw (same 50%); Turn the Building collapsed to one definition; The Building Remembers split into feature + **Apex** per the pack; jam drain 2–4 Uptime; body-damage drain is the pack’s Director’s call. | 1 marker: what one damage-multiplier step is worth across scale bands. |
| **14 Commander** | Action types for Battle Cry (maneuver), Concussive Command, Coordinated Strike (main), Break Formation (maneuver); Break Their Nerve and Speak With One Voice now say **the hero rolls once**; doctrine ladder gains its level-7 rung; Covert Operations / Studied Commander / Discover Lore defined by reference to the Draw Steel Tactician; worked example now applies The Right Word as written; Influence-outside-combat uses the house paragraph. | 2 markers: the Command Persona / Command Presence name clash, and whether Master of Voice keeps its 3-dice-keep-2 capstone. |
| **Book-wide** | Flat “+1 / +2 to a roll” → **edge** (Medic Slap-Injector / Focus Serum / Wonder Drug / Combat Stims / Field Partner; Wrench Kit lines; Commander A Word / The Right Word / The Signature Beat). Flat bonuses to Stamina, damage, distance and Handling stay numbers. **“Skill Points” retired from the last three Skills rows** (Medic, Street Priest, Technomancer), rebuilt from each class pack’s level-1 skill advancements. | Medic crash rider **−1/−2** deliberately not converted: the magnitude is load-bearing (Reduced Comedown caps it at −1). |

### Michael decisions carried in RAW (12 `[PASS-C NEEDS MICHAEL]` markers)
`14-commander` ×2 · `15-medic` ×3 · `16-wrench` ×1 · `17-elementalist` ×1 · `18-street-priest` ×4 · `20-technomancer` ×1.

**Two calls worth a second look** (filled, not marked — both are derivations rather than printed numbers):
1. **Medic Chemical Warfare** = enhanced Toxin dose (4 + Instinct over 2 rounds), derived from the chapter’s own locked Compounds table, not printed anywhere.
2. **Technomancer** sprite “+1 / +2 defense” → **bane / double bane**, and Bone Deep Communion’s advanced-sprite bonus Stamina (**+6**, or **+8** for Attack) derived from the shipped sprite Actors’ intermediate→advanced step.

**Also contradicting the spike brief:** `18-street-priest` **Faith Is Our Armor** — the spike asked for four echelon values, but the shipped pack makes 5 / 10 / 15 Power Roll result bands (weak/average/strong potency) and no source offers a fourth. RAW prints the result-band reading and carries a marker.

### Foundry-sync backlog (packs NOT edited — needs its own spike)
The shipped packs still carry pre-Pass-A/B text in several places: Technomancer `light-chrome-tolerance.json` (old name and old erosion model), Technomancer and sprite strings using DC saves / “tier” / “+N defense”, Street Priest foci Availability labels and a `saints-relic` description that still says “BP/SP”, several `Provisional magnitude` notes whose numbers are now printed, Medic and Commander “+1 / +2 to a roll” strings that RAW now calls edge, Wrench `UnbreakableHive` d6 and “attack roll” strings, and Street Priest action types that differ from the master. Where RAW and a pack disagreed, RAW followed the master and the pack was left alone.


---

## Pass C — Michael locks 2026-09-17 — **APPLIED 2026-09-17 (B42e1), pending Michael verify**

All twelve `[PASS-C NEEDS MICHAEL]` markers are resolved in `docs/raw/` and **zero markers remain** (`grep -rn "PASS-C NEEDS MICHAEL" docs/raw` → no hits). Journals regenerated from RAW. Pack/lang renames — including the Commander **Command Persona** mode string in `lang/en.json` — ride **B47 Foundry-sync**; no pack JSON was edited here.

How each lock landed in the text:

| # | Chapter | Now reads |
|---|---|---|
| 1 | `14-commander` | First mode renamed **Command Persona**; ability title still Command Persona / Fearful Awe. |
| 2 | `14-commander` | Master of Voice keeps **3 dice, choose 2**; the "Deliberate exception" note stays and says it is locked as written. |
| 3 | `18-street-priest` | Faith Is Our Armor prints **5 / 10 / 15** temporary Stamina as low / middle / high result bands, with the note that these are result bands, not echelons. |
| 4 | `15-medic` | Restock is a **lifestyle / downtime-project** activity; the Director quotes the cost and the four discounts apply to that quote; no ¥ table until the Economy lifestyle chapter. |
| 5 | `15-medic` | Full Kit Purge at 11 = The Doctor Is In's effect (Recovery ×2, clear all conditions, revive in the freshly-killed line); **each Reagent past 11 = +1 Recovery value of healing per target**. |
| 6 | `15-medic` | Crash lasts **1 round** (base, −1) / **2 rounds** (enhanced, −2) and applies to every Power Roll in that window; **Pharmaceutical Grade cuts 1 round** (feature text aligned); magnitude and Reduced Comedown's −1 cap unchanged. |
| 7 | `16-wrench` | One scale-band gap = one edge/bane step **and ×2 damage down / ×½ up** (round down); two gaps = ×4 / ×¼. |
| 8 | `17-elementalist` | Essence cap tops out at **20** at Echelon 4; the orphan "may reach 24" line is gone. |
| 9 | `20-technomancer` | Resonance Slam and The Weaver's Web inflict **weakened (save ends)**; the Winded note now says nothing in the chapter inflicts Winded — it is the biofeedback floor only. |
| 10 | `18-street-priest` | Invoke the Pact's independent form uses the shipped **Guardian / Warrior / Hunter Spirit** template by ministry (Shepherd / Templar / Exorcist); strike stays 4 / 7 / 10 + Persona; a Veil Entities pass may refine. |
| 11 | `18-street-priest` | Dark failed-bind strike deals **4 + Persona**. |
| 12 | `18-street-priest` | Judgment is **bane + Conviction bank** only; the optional bonus-damage rider is gone. |

| # | Chapter | Lock |
|---|---|---|
| 1 | Commander | Ability title stays **Command Persona / Fearful Awe**. Rename first mode **Command Presence → Command Persona**. |
| 2 | Commander | **Master of Voice** keeps **3 dice, choose 2** as deliberate L10 Power Roll exception. |
| 3 | Street Priest | **Faith Is Our Armor** = **5 / 10 / 15** temporary Stamina as Power Roll **low / middle / high** result bands (not an echelon ladder). |
| 4 | Medic | Reagent **restock** = **lifestyle / project abstraction** at respite. Director quotes the cost; Scrounger's Eye / Corporate Requisition / Regular Customer / Doc Who Never Left discounts apply to that quoted cost. No ¥ table until Economy/lifestyle chapter. |
| 5 | Medic | **Full Kit Purge** at minimum 11 = same as **The Doctor Is In** (Recovery ×2 heal, clear all conditions, revive in freshly-killed line). Each Reagent beyond 11 = **+1 Recovery value of healing** to each target. |
| 6 | Medic | Crash lasts **1 round** (base) / **2 rounds** (enhanced); penalty applies to Power Rolls during that window. **Pharmaceutical Grade** cuts **1 round**. Magnitude stays **−1 / −2** (Reduced Comedown still caps at −1). |
| 7 | Wrench | One scale-band gap = one edge/bane step **and** **×2 / ×½** damage per band gap. |
| 8 | Elementalist | Essence cap at Echelon 4 = **20**. Drop the orphan “may reach 24” line (no L10 +4 feature exists). |
| 9 | Technomancer | Resonance Slam / The Weaver's Web inflict **Weakened (save ends)**, not Winded-as-condition. Winded remains Stamina-threshold / biofeedback floor only. |
| 10 | Street Priest | Invoke the Pact **independent form** uses shipped **summons/spirits** templates (Guardian / Warrior / Hunter by subclass); strike stays **4 / 7 / 10 + Persona**. Veil Entities pass may refine later. |
| 11 | Street Priest | Dark failed-bind strike = **4 + Persona** (extension-form low). |
| 12 | Street Priest | **Judgment** = **bane + Conviction bank** only. Drop optional bonus-damage rider. |
