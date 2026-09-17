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

1. **Copyright check — ancestry trait text.** Many purchased-trait and signature descriptions in `05-ancestries.md` follow Draw Steel Heroes wording closely (for example Detect the Supernatural and Staying Power). Several class abilities also carry Heroes-adapted text (Operator 7/9/11-cost bands). Confirm the Creator License covers this, or rewrite in original wording.
2. **License attribution statement** is a placeholder in `00-front-matter.md`. Insert MCDM’s required Draw Steel Creator License wording.
3. **Body Integrity contradiction.** `09-chrome-body-integrity.md` says every living hero starts at **20**. The Operator, Elementalist, and Hacker chrome sections — and the old Wire text — used **`6 + Physique + Echelon`** (removed from `21`, still implied in class chrome notes). Pick one.
4. **Chrome grades.** Chrome uses Salvage / Standard / Soft. The Hacker chrome section uses “E1 Salvage / E2 Standard / E3 Milspec / E4 Bioware.” Pick one scheme.
5. **Magic erosion model.** Chrome chapter: −1 cap per 2 / 3 / 1 Integrity by grade. Technomancer: “beyond a free allowance of 2.” Street Priest: “chrome-load essence above a sliver” (unit undefined). Decide whether casters share one model.
6. **“Persona” means two things:** the characteristic, and your presence in the Wired. The glossary distinguishes them; consider renaming the Wired one (for example “Wired persona” → “avatar” or “icon”).
7. **“BP” / “SP”** (build points / skill points) appear in class text and the Economy firewall but Draw Steel has no such currency. Define (as the glossary now does) or reword to “character power.”
8. **Surge definition conflict.** Scout and Elementalist: a surge is +2…+5 damage by echelon, in inverted echelon order. Commander: surges grant temporary Stamina. Draw Steel defines surges by reference; pick the Draw Steel rule and fix both.
9. **Gear damage tags vs Draw Steel damage types.** Gear tags damage kinetic / AP / electrical / fire / toxin; Draw Steel types are acid, cold, corruption, fire, holy, lightning, poison, psychic, sonic. Confirm the mapping (electrical → lightning? toxin → poison? kinetic and AP → untyped?).
10. **Weapon damage bands.** The Gear master says weapon base damage is “the Tier-2 standard hit” and is scaled by old Outcome-Tier riders (inverted language). `08` prints only the base bands. Decide how result bands scale weapon base damage in Draw Steel order.
11. **Armor-as-Stamina has two Echelon 1 columns** (Street and Professional). Decide which one a 1st–3rd level hero uses.
12. **Remaining tier language** (means echelon, cost band, or result) — see chapter lists below. Also the Technomancer’s “Hybrid Tier” sprite grammar and “Cost Tiers” headings.
13. **Inverted echelon or result order** appears in several abilities (flagged below).
14. **DC-based saves and to-hit language** (Technomancer sprites and biofeedback, Wrench “+1 to hit”) don’t match Draw Steel. Convert to potency / saving throw / edge-bane.
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
