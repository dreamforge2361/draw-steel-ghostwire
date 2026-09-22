# Magical Societies contact Actors — Foundry smoke checklist (0.3.94)

**Ship:** the three locked society contacts as playable NPC Actors in a new **Magical Societies** folder under **Ghostwire Bestiary** — Senior Examiner **Edda Marr** (Measure Collegium), **Tavi Sorn** (Wickkeepers) and Field Coordinator **Daska Venn** (Ash Survey). F7.
**Automated:** `node tools/magical-societies-cast-smoke.mjs` — folder shape, stable ids, canon locks (who casts and who does not), lore-journal links, Wire Kit / Connect, Has Vision, plates on disk, and a byte-for-byte generator round trip. Passes before commit. Also green: `bestiary-humanoid-wire-smoke`, `mama-club-cast-smoke`, `aeq-laz-npc-smoke`, `corp-security-wire-smoke`.
**This list:** the in-Foundry pass. **The bestiary pack was rebuilt** (`node tools/build-packs.mjs bestiary`) with Foundry closed — reload the world after updating to 0.3.94.

`token-vision-smoke.mjs` still fails on a stale pinned-version assertion (`module.json is 0.3.67`), exactly as `journal-regen-smoke.mjs` (`0.3.24`) and `taint-smoke.mjs` (`0.3.58`) do. Those pins are exact-equality checks written against old releases; the failure predates this release and every other assertion in all three files passes.

---

## 1. The folder exists and reads in plain English

Compendium sidebar → **Ghostwire Bestiary**.

- [ ] A top-level folder **Magical Societies** sits between **Reach Critters** and **Corp & Security**.
- [ ] It reads as words, not as `GHOSTWIRE.Bestiary.Folders.MagicalSocieties` — a raw key means the lang file did not load.
- [ ] It holds exactly three Actors: **Edda Marr**, **Tavi Sorn**, **Daska Venn** (in that order).
- [ ] Each has its own portrait — a charcoal-coated Corran examiner, a Flats kitchen organizer, a full-conversion Cyborg in a weather shell. No broken-image icons.

## 2. Edda Marr — she casts, and she is not in charge

Open **Edda Marr**.

- [ ] Header: **Level 2 Elite Controller**, Stamina **60**, EV **16**, free strike 4, speed 5, size 1M.
- [ ] Characteristics read Might 0 / Agility 0 / **Reason 2** / **Intuition 2** / Presence 1.
- [ ] Biography names her a **Corran** woman and an **Elementalist** whose casting is trained, supervised and logged.
- [ ] Director tab: the **Role** line says she is **not** the sole leader of the Collegium, and the **What she cannot do** line refuses to certify a building safe, launder the Metermen, or waive anyone's Arcane Severance.
- [ ] Features: **The True Measure**, **Measurements Over Testimony**, **The Institution That Trained Her**.
- [ ] Abilities: **Plumb Drop** (signature, keywords *magic · ranged · strike*, Reason, 6/9/12, slowed + slide) and **Bring It to True** (heroic, 3 Malice, 3-cube within 10, 3/5/8, slowed on tier 2–3, difficult terrain after).
- [ ] Roll **Plumb Drop** at a target token: the power roll uses Reason, the damage tiers post, and the slide rider appears. No console errors.
- [ ] Negotiation shows Interest 6 / Patience 6 / Impression 2, motivation **Discovery**, pitfall **Authority**.
- [ ] The Director tab's canon link opens **The Measure Collegium** journal in Ghostwire Lore.

## 3. Tavi Sorn — Pure Human, no casting, one site

Open **Tavi Sorn**.

- [ ] Header: **Level 1 Platoon Support**, Stamina **30**, EV **6**, free strike 2.
- [ ] Biography names her **Pure Human** and says she has **no casting ability of any kind**.
- [ ] Feature **No Casting, No Claim** is on the sheet and says plainly she cannot ward a room, cleanse Taint, bless a door, grant Conviction or certify anyone holy.
- [ ] **No ability on her sheet carries the `magic` or `supernatural` keyword.** Her only strike is *The Nearest Heavy Thing* (melee, Might, 2/3/5).
- [ ] Features **Remembers Every Name**, **The Night Window** (and its *upstairs is finite* line) and the social maneuver **Until Morning** are present and readable.
- [ ] Director tab keeps her a **local** coordinator: a request from her does not obligate any other Wickkeeper cell.
- [ ] Negotiation shows motivation **Benevolence**, pitfall **Authority**.
- [ ] Canon link opens **The Wickkeepers** journal.

## 4. Daska Venn — full-conversion Cyborg, Arcane Severance intact

Open **Daska Venn**.

- [ ] Header: **Level 2 Elite Defender**, Stamina **80**, EV **16**, free strike 4, **stability 2**.
- [ ] `cyborg` appears in her monster keywords beside `humanoid`.
- [ ] Feature **Arcane Severance** is the first item and states she **cannot cast** — no Essence, no Conviction, no Resonance — and that **membership does not waive it**, and that she is **not** evidence of a magical exception for Cyborgs.
- [ ] **No ability on her sheet carries the `magic` keyword.**
- [ ] Features **Sealed Frame**, **The Dirty Return** and **A Clean Report Is Not a Clean Site** are present; Sealed Frame grants no resistance the sheet does not already list.
- [ ] Ability **Winch Line** (ranged 5, Might, 5/8/11, pull 1/2/3) rolls clean and the pull rider appears.
- [ ] Negotiation shows motivation **Protection**, pitfall **Greed**.
- [ ] Canon link opens **The Ash Survey** journal.

## 5. Tokens on a scene

Drag each contact onto any scene.

- [ ] The token renders its own plate — no blank square, no stretched art.
- [ ] Each token is **1×1**, **Has Vision ON**, and **Neutral** disposition (yellow), not hostile.
- [ ] Token name matches the Actor name and displays on hover.
- [ ] Stamina bar shows the right maximum (60 / 30 / 80).

## 6. The Wire

- [ ] Each contact's sheet carries exactly one **Wire Kit** item, reading as *Wire Kit* and not as a raw lang key.
- [ ] Right-click token → the Ghostwire **Connect** verb is available on all three (the humanoid Connect pass covers them).

## 7. Nothing was promoted to settled history

- [ ] No sheet claims a Collegium/Wickkeeper/Survey alliance, enmity, shared headquarters or chain of command.
- [ ] No sheet establishes the Quiet Relay, First Ledger Society, Ninth Knot, Gilt Table or Closed Hand.
- [ ] No sheet creates a new magical source, certification price, ward strength or casting permission.
- [ ] Edda's institutional cover-up, Tavi's aid agreement and Daska's uncleared corridor are still framed as **pressure**, not as events the crew missed.

---

**If all boxes tick:** 0.3.94 passes. Report PASS and F7 closes.
**If a box fails:** note the Actor, the box number and what rendered instead. The generator is `tools/gen-magical-societies-cast.mjs`; fix the roster there and re-run it plus `node tools/build-packs.mjs bestiary` with Foundry closed.
