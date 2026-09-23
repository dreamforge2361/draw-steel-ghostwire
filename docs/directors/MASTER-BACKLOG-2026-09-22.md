# Ghostwire master backlog - triage 2026-09-22 (updated evening)

**Module now:** **0.3.100** on main (Michael Foundry smoke **PASS** — G2 armor/gadget mods + G1 Kit street-band grants).  
**Just shipped:** G2 armor / gadget mod families + Hexshot's Street medium bow (0.3.100); G1 Kit chargen street-band grants + Static Crow Mark drop (0.3.99); S8 vehicle / drone / mods build-out (0.3.98); S6 Voidmark Director-only lore filter (0.3.97); F9 Black Market sell (0.3.96); F8 Ritual Seal artifacts + F6 Director Pay / Spend Hero (0.3.95).  
**Next picks:** **G3** lang + style tokens, then **S1**, then **L1** (locked queue) · DJ1 district journals · F2 ritual applet polish · S2 broader SR gear reskin (now unblocked).  
**Playtest:** Deadhead Saturday; Quiet Floor after. **PDF reprint DONE 2026-09-22** (N4) — 0.4.0 @ 0.3.100, 316 pages.  
**Next print queue:** N5 player-facing reference scrub.
**Doctrine:** Claude Code on Allfather first; Cursor only if no choice.

---

## Now / in flight

| # | Item | Notes |
|---|---|---|
| N1 | ~~Mark Learned~~ | **DONE** 0.3.89 — right-click Formula → Mark learned / Mark unlearned + chat. |
| N2 | ~~Ritual Working applet~~ | **DONE** 0.3.91 — all players can open; the Formula owner who selects it is **Ritual Leader** (Project rolls, sealing roll, ¥); Pay Components off `system.hero.wealth`; Study and built-sanctum stages are stock Draw Steel Project Items. Smoke `node tools/ritual-working-smoke.mjs`; Foundry checklist `docs/directors/ritual-working-applet-smoke-0391.md`. |
| N3 | ~~Foundry smoke 0.3.88 rituals~~ | **DONE** — Michael signed off. |
| N4 | ~~**PDF reprint**~~ | **DONE 2026-09-22.** `node tools/build-pdf.mjs` → `docs/manuscript/build/Ghostwire-Rulebook-0.4.0.pdf` — **95.4 MB / 316 pages** (Sep-18 build was 75.6 MB / 249 — **+67 pages**). Print version stays **0.4.0**: a reprint of the official edition, **not** a new number. Because rules chapters assemble by pointer at `docs/raw/*.md`, the reprint picked up everything since the first print with no manuscript forking: Ritual Workings / Formula / Magnitude (Ch 24), Machines — drones / vehicles / mods (Ch 25, S8), Kit street-band chargen grants (Ch 9, G1), wearable armor/shield **§2F** + gadget **§1H** families **Published** (Ch 12, G2), Constructs & Pets FAQ (Ch 30), and lore L6–L8 **with faction plates placed**. Front matter told the truth (title page + manuscript README → "through 0.3.100"); no marketing rewrite. Art: **54/55 slots placed**, one standing gap — `wire-opener` (Ch 23 filler) — not a blocker. Two deliberate non-changes recorded in the note: `27-corruption-taint.md` stays out of the MANIFEST (locked TOC calls Taint a pointer inside Ch 24, "not a new print-Ch number"), and **Scrap-Bow is absent by design** (RAW Ch 9 lists Kits + gear *categories*, never SKUs — so a SKU-name grep will always fail; grep the grant procedure instead). Packs untouched, journals not regenerated. Note `docs/directors/n4-pdf-reprint-03100.md`; log `docs/directors/_claude-n4-pdf-reprint-log.txt`. |
| N5 | **PDF rulebook player-facing reference scrub** | Next PDF reprint: remove all document/director references from the shipped PDF — markdown paths/links, `docs/directors` mentions, and any other outside/internal references that should not appear in the player-facing book. Keep those references in the markdown sources only. Backlogged 2026-09-22 (Michael). |

---

## Next Foundry pushes

| # | Item | Notes |
|---|---|---|
| F1 | ~~**Plot & Run** top-level Gear folder~~ | **DONE** 0.3.92 — `gwGearPlot000000` promoted to top level (sort 20000, after Weapons); source moved to `src/packs/gear/plot/`; lang key re-keyed `Gear.Folders.PlotRun` = “Plot & Run”. Gear pack rebuilt. |
| F2 | Ritual applet polish | Hung/fail, party-fund ¥, assistants, upkeep clocks. |
| F3 | Formula Item art | Beyond stock scroll icon. |
| F4 | ~~Pregen regenerate pipeline~~ | **DONE** 0.3.93 — `node tools/pregens-to-actors.mjs` is safe to re-run: portraits / Changer form art / class level from the ROSTER, installed matrix mods from `loadouts.json`, Taint + Corruption History from the new `docs/masters/pregens/post-patches.json`. Reproduces `src/packs/pregens/` byte for byte; Ward the Room stays learned on Kaïs / Vessa / Sabbat. Smoke: `node tools/pregen-regen-smoke.mjs`. |
| F5 | ~~Magical societies in Foundry + ¥250 pregens~~ | **DONE** 0.3.93 — **Magical Societies** folder in **Ghostwire Lore** with The Measure Collegium / The Wickkeepers / The Ash Survey (symbols + HQ plates + read-alouds, 0 art gaps); sources `docs/manuscript/01-lore/L6–L8`. All seven pregens start at **¥250** (`START_WEALTH`). Checklist: `docs/directors/magical-societies-foundry-smoke-0393.md`. |
| F6 | ~~**Director Pay / Spend Hero macro**~~ | **DONE** 0.3.95 — `scripts/director-wealth.mjs`. Director-only **Pay** / **Spend** on the targeted or selected heroes (the Director Taint +1 collect), a DialogV2 asking direction / amount / reason, and a chat card naming who, which way, ¥ how much, why, and **before → after**. Pay always credits; **spend refuses what the purse cannot cover** and writes nothing — ¥ never goes negative. One wealth path only (`WEALTH_PATH` from `kiosk.mjs`). Doors: two GM scene-control tools, a GM token-HUD ¥ button, a Director-restricted keybinding, two Ghostwire Macros (`gwDirPayHero0001` / `gwDirSpendHero01`), and `directorPayHero` / `directorSpendHero` / `directorAdjustWealth` / `directorWealthPrompt` on `module.api` + `game.ghostwire`. Macros pack rebuilt. Smoke: `node tools/director-wealth-smoke.mjs`. Checklist: `docs/directors/director-wealth-smoke-0395.md`. |
| F7 | ~~Magical Societies contact Actors~~ | **DONE** 0.3.94 — new top-level **Magical Societies** folder (`gwBestiaryMagSoc`, sort 175000) in **Ghostwire Bestiary** with three playable NPC sheets: **Edda Marr** (`gwBesEddaMarr000`, L2 elite controller, Corran Elementalist who **casts**), **Tavi Sorn** (`gwBesTaviSorn000`, L1 platoon support, Pure Human, **no casting** — *No Casting, No Claim*) and **Daska Venn** (`gwBesDaskaVenn00`, L2 elite defender, full-conversion Cyborg, **Arcane Severance** never waived). Michael's tokens on portrait + prototype token, Wire Kit on all three, Director hooks with negotiation drives / pitfalls and `@UUID` links to the 0.3.93 lore journals. Generated by `node tools/gen-magical-societies-cast.mjs` (byte-for-byte regen). Smoke: `node tools/magical-societies-cast-smoke.mjs`. Checklist: `docs/directors/magical-societies-contacts-smoke-0394.md`. |
| F8 | ~~**Ritual Seal artifacts**~~ | **DONE** 0.3.95 — `scripts/ritual-seal.mjs`, hooked from the applet's `#onSeal`. A **held (tier 2) or clean (tier 3)** seal stamps a **Ritual Effect** (`flags.draw-steel-ghostwire.ritualEffect`: Working, Formula, family, Magnitude, Leader, sealedAt, expires, scope, tier, outcome) onto an artifact chosen by the Formula's **family**, not by rite name: **Ward / Threshold** → a neutral, turn-less marker Actor + Token beside the Leader in a new **Ritual Effects** folder; **Calling** → `veil-summons.mjs` when the card names `ritual.summonDsid`, else an Active Effect on the Leader and a chat line handing the placing to the Director (**TODO:** no Calling card names a template yet); **Artifice** → a linked Item on the Leader; **Reach** → an Active Effect, no token; **Unmaking** → chat only. A **hung (tier 1) seal leaves nothing**. The Director's stage-4 **Reset** and **Abandon Working** clear the artifact off every Scene. Resource firewall untouched. Smoke: `node tools/ritual-seal-smoke.mjs`. Checklist: `docs/directors/ritual-seal-smoke-0395.md`. |
| F9 | ~~**Black Market sell**~~ | **DONE** 0.3.96 — `scripts/black-market.mjs`. Player or Director liquidates owned Items for **¥**. **List price = `catalogPrice()` from `kiosk.mjs`** (the gear / chrome / matrix / mod / vehicle / focus `.price` flag); a SKU with **no catalog ¥ refuses the sale** — no price is ever invented. Base payout **50% of list**, floored. Optional **haggle** = one stock Draw Steel Power Roll (Presence by default; Intuition / Reason offered): **low 50%**, **middle 55%**, **high 60%**; dismissing the roll cancels the sale. Stacks: a line's list price is catalog ¥ × quantity sold, so 3 of 5 grenades pays for three and leaves two. Items are removed first and ¥ credited second — a failed purse write **restores every Item**. One purse only (`WEALTH_PATH`). Sellers are the hero's **owner** or the **Director** (targeted/selected collect shared with F6). Doors: hero-sheet Item context menu **Black Market: Sell…**, a Token scene-control tool, a token-HUD sack, an unrestricted keybinding, the **Black Market: Sell** macro (`gwBlackMktSell01`), and `blackMarketPrompt` / `blackMarketSellPrompt` / `executeSale` / `sellItem` on `module.api` + `game.ghostwire`. Macros pack rebuilt. Smoke: `node tools/black-market-smoke.mjs`. Checklist: `docs/directors/black-market-smoke-0396.md`. |
| F10 | **Chest / Locker inventory** | Map token like a Kiosk, but **player-locked** storage: hold equipment, loot, mods, and gear found or stolen. Deposit/withdraw Item piles (not ¥ shop). Owner (or Director) opens; others refused unless shared. Backlogged 2026-09-22 (Michael). |

---

## Adventure

| # | Item | Notes |
|---|---|---|
| A1 | **Quiet Floor (QF-01)** resume | Scene 1 + transit + Scene 2. |
| A2 | Deadhead post-Saturday pass | Into QF + template. |
| A3 | Run Comp folder ownership | Ongoing hygiene. |

---

## Systems

| # | Item | Notes |
|---|---|---|
| S1 | Ritual echelon gating | Hard vs soft Magnitude caps. |
| S2 | SR gear reskin | Arsenal / M&M / Rigger — **vehicles/drones/mods shipped in S8 (0.3.98)**; S2 remains the broader gear pass and is now unblocked. |
| S3 | Broader SR References reskin | Sprawl Sites, Threats, etc. |
| S4 | ~~Sprite/Agent Lock A~~ | **DONE**. |
| S5 | Wired Console ↔ Journal research | 3-tier topic journals. |
| S6 | ~~Director-only Voidmark lore filter~~ | **DONE** 0.3.97 — B122. Right-click a Journal Entry or page → **VOIDMARK: Mark Director-only** (`flags.draw-steel-ghostwire.voidmarkAudience`); page beats entry, unmarked falls back to Foundry ownership. Static index chunks under `docs/directors/**` + `docs/manuscript/03-directors/**` tagged `audience: director`. Only **GM + Director mode** retrieves them — GM in Runner mode and every player ask (relay included) stay on the player channel; world-journal RAG honours the mark **and** ownership. Smoke `node tools/voidmark-audience-smoke.mjs`; how-to `docs/directors/voidmark-director-only-howto.md`; Foundry checklist `docs/directors/voidmark-director-only-smoke-0397.md`. |
| S7 | ~~Agent/Sprite/Spirit action-economy FAQ~~ | **DONE** 0.3.90 — `docs/raw/28-constructs-pets-faq.md`. |
| S8 | **Vehicle / drone build-out** (Rigger + equipment refs) | **DONE 0.3.98.** Crewed 40→47, drones 36→40, vehicle/drone mods 14→24, ¥ on every SKU (Nox ¥0→¥2,800), stock Draw Steel Project fields on every chassis + mod, new **Mods** kiosk preset (Chop Shop). Smoke `node tools/s8-machines-smoke.mjs`; checklist `docs/directors/s8-machines-smoke-0398.md`. **LOCKED scope 2026-09-22.** Robust vehicles + drones; **vehicle/drone mods** first-class; **¥ on every SKU**; fabricate/install via **Project downtime**; RAW/journals/manuscript updated. **Restock table vendors:** drone vendor + vehicle vendor (existing kiosk presets) + **mod vendor** (add/harden preset) so new SKUs auto-appear on shops Directors place on scenes. After S6 (**done 0.3.97**). Brief: docs/directors/S8-vehicle-drone-mods-brief.md. |

---

## Gear / chargen

| # | Item | Notes |
|---|---|---|
| G1 | ~~**Kit street-band auto-grants**~~ | **DONE 0.3.99** — `scripts/kit-grants.mjs`. All **28** Kits map to street SKUs; the free starting Kit copies its package onto the sheet at chargen so the Kit is live on day one. Gate: kit Item on a `hero`, mapped `_dsid`, `system.level <= 1`, and never granted before for that `_dsid` (ledger `flags.draw-steel-ghostwire.kitStreetGrants` + per-Item `kitStreetGrant` stamp). **Merc** needs no special case — its Kits advancement is `chooseN: 2`, so both packages land. Later Kits grant nothing; the **ownership rule still bites** (sell it, Kit goes inert). **Never** mods, chrome, or anything above Street; owned SKUs are skipped, not duplicated; **no back-fill sweep**. Unarmed Kits (Brawler, Mantis) get nothing — fists qualify by rule — and the three Hacker **deck-Kits** + **Rigger's Harness** get no host, because the Kit *is* the host. Needed a gear floor: **street weapons 7 → 14** (Slugger, Pipe Rifle, Scrap Cleaver, Slab-Hammer, Scaffold Pike, Chain Lash, Weighted Net — all E1/Street/1 slot) because the Street column had no heavy, polearm, whip, ensnaring, medium-melee or medium sidearm, and `polearm` existed at **no** Availability. Table `docs/directors/kit-street-band-grants.md`; smoke `node tools/kit-grants-smoke.mjs` (467 checks); checklist `docs/directors/kit-grants-smoke-0399.md`. |
| G2 | ~~**Armor / gadget mod families**~~ | **DONE 0.3.100.** Both remaining unpublished host families ship: wearable **armor / shields** → Gear master **§2F** (7 stubs → **14** SKUs) and **gadgets** → **§1H** (8 → **17**), Mods pack **47 → 63**, every SKU with ¥ + stock Draw Steel **Project** fields (E1 150 / E2 300 / E3 450 / E4 600) and a real **Street → Prototype** spread. RAW `10-mods.md` flipped to **Published** and lost every “treat wearable armor modSlots as 0” / “do not invent liners” instruction. **The lock held: no wearable mod adds Stamina** — asserted on the flag, in every AE change key, and in the card text. Only **Thermoptic Skin** and **Deep Optics** carry an AE (Stealth / Perception edge, shipped **off**, the Stealth Weave pattern); every other row is a Director card, no invented Power Roll math. Five **exclusiveKit** groups refuse to double up (*inner liner*, *outer camouflage layer*, *active-denial cell*, *optical stage*, *lock-cracking package*). New `tools/regen-mod-slot-cards.mjs` derives the **Mod slots (N)** paragraph on all **89** host gear cards (it reproduced the 47 weapon cards byte-for-byte first). Kiosk presets **11 → 13**: **Armorer** + **Gadgeteer**. **Part B closed G1's last gap** — **Scrap-Bow** (¥300, medium band, E1/Street/1 slot) in §3F, and `kit-grants.mjs` grants Hexshot both bows; the G1 smoke's documented-gap list is now empty. Also fixed a latent repo-wide bug the bump exposed: **18 smokes compared `module.version` as a string**, so 0.3.99 → 0.3.100 read `"1" < "9"` — they now share `tools/lib/module-version.mjs`. Smoke `node tools/g2-armor-gadget-mods-smoke.mjs` (792 checks); checklist `docs/directors/g2-armor-gadget-mods-smoke-03100.md`; log `docs/directors/_claude-g2-armor-gadget-mods-log.txt`. |
| G3 | lang + style tokens | **Suggested next** (then S1, then L1). N4 PDF reprint is done and no longer ahead of it in the queue. |

## Art
**R0** **Hero sheet Ghostwire skin** — color, logo, and sheet styling so the Draw Steel Hero sheet *feels* Ghostwire (chrome/neon grit, GW wordmark/mark, tab chrome, not a stock DS reskin). Design pass + CSS/theme tokens; complements G3 lang/style tokens. Backlogged 2026-09-22 (Michael).
**R1** inside-cover · **R2** round pregen tokens · **R3** B103 palette/gender · **R4** B89 Foundry token · **R5** Reach Events thumbs · **R6** wire-opener

## Lore
**L1** language gazetteer · **L2** Pandora wilds · **L3** cosmos art · **L4** Prime maps · **L5** criminal factions (+ all-Revenant) · **L6** news ticker

## Infra
**I1** Foundry 14.368 · **I2** chargen wizard · **I3** Deadfall module · **I4** Rideable replacement · **I5** old smoke debt

---

## Recently shipped
- **0.3.100** **G2 wearable armor / shield (§2F, 14) + gadget (§1H, 17) mod families published** + **Scrap-Bow** closes Hexshot's medium slot
- **0.3.99** **G1 Kit chargen street-band grants** + 7 new Street weapon SKUs + **Static Crow drops Mark**
- **0.3.98** S8 vehicle / drone / mods build-out
- **0.3.95** **Ritual Seal artifacts (F8)** + **Director Pay / Spend Hero (F6)**
- **0.3.92** **Plot & Run** promoted to a top-level Ghostwire Gear folder
- **0.3.91** **Ritual Working applet** — five stages on linked Draw Steel Projects
- **0.3.90** S7 Constructs & Pets FAQ + Voidmark reindex (Appendix ch30)
- **0.3.89** Mark Learned / Unlearned on Ritual Formulas
- **0.3.88** Ritual Workings catalog + 46 Formula Items (smoke OK)
- **0.3.87** Deadhead Foundry push
- **S4** Lock A / B121 Constructs closed

---

## Suggested next pick
**Ship lane clear.** G2 armor / gadget mod families shipped (**0.3.100**) and the **N4 PDF reprint is out** (0.4.0 @ 0.3.100, 316 pages — `docs/directors/n4-pdf-reprint-03100.md`). Michael Foundry smoke **PASS** on G2 (`g2-armor-gadget-mods-smoke-03100.md`) and G1 (`kit-grants-smoke-0399.md`). Still optional / deferred: `docs/directors/s8-machines-smoke-0398.md` (S8), `docs/directors/voidmark-director-only-smoke-0397.md` (S6 — already signed earlier).
**Next:** **G3** lang + style tokens — then **S1**, then **L1**. Module stays **0.3.100**.
**Then:** DJ1 district journals.
Also open: **F10 Chest/Locker inventory**; **R0 Hero sheet Ghostwire skin**; LR2 gangs, DJ1 district journals, A1 Quiet Floor after Deadhead Saturday, `wire-opener` art gap (Ch 23 filler).

---

## Lore research queue (from 2026-09-22 Shadowrun inspiration brief)

Source: `docs/directors/lore-research/2026-09-22-shadowrun-inspiration-magical-factions.md` (proposal, not canon).

| # | Item | Notes |
|---|---|---|
| LR1 | ~~**Measure Collegium, Wickkeepers, Ash Survey**~~ | **LOCKED canon** 2026-09-22 — profiles + contacts (`2026-09-22-magical-societies-canon-three.md`) **and** symbol names, HQ names, layouts + art (`2026-09-22-magical-societies-symbols-hq.md`, locked 2026-09-22): True Measure / Datum House, Sheltered Wick / The Last Kettle, Held Fault / The Cinder Yard. **Shipped to Foundry in 0.3.93.** Open: exact atlas addresses; hooks stay optional. |
| LR2 | **Deepen existing gangs** (Ninth Ward Kings, Rust Saints, Glass Vipers, Metermen, Skinjobs, Nightshift; Hollow Men keep horror role) | **ADOPTED backlog** 2026-09-22 — seven-field template: income / service / dependent / forbidden / internal split / outside patron / current pressure. Do before minting new gang names. |
| LR3 | Who teaches magic outside corp employment? | Immediate lore gap |
| LR4 | Who maintains/pays neighborhood wards? | Rent, labor, gang power |
| LR5 | Magical society offer/demand sheets | Membership as recurring choice |
| LR6 | How institutions treat Resonance users, Revenants, magically implicated witnesses | Civil rights / testing / sanctuary |
| LR7 | Five–eight public Reach events (shared history template) | Near term |
| LR8 | Hold in reserve: Quiet Relay, First Ledger, Ninth Knot, Gilt Table, Closed Hand | Introduce when earned |

---

## Campaign chapter order (LOCKED 2026-09-22)

| # | Chapter | Status |
|---|---|---|
| 1 | **Deadhead** (Gold Line) | Shipped / playtest weekend |
| 2 | **Quiet Floor (QF-01)** | Resume after Deadhead |
| 3 | **Price of a Safe Night** | LOCKED after Quiet Floor — **new district** (not Mama's / Slackwater / Deadhead Gold Line path) to spread hive exposure; onstage Collegium / Wickkeepers / Ash Survey; canon TBD |

Source brief: `docs/directors/lore-research/2026-09-22-shadowrun-inspiration-magical-factions.md` (proposal until faction dossiers lock).

---

## District player journals (LOCKED ask 2026-09-22)

| # | Item | Notes |
|---|---|---|
| DJ1 | **Player-facing district lore cards** | For each district already visited (and future ones): culture, perspective, style, lived details. Sections: Rumors, Gangs, Police-like actions, Corporate rumors. Ship as Foundry Journal entries placeable on district maps as clickable Journal cards. |
| DJ2 | Template for district journal | Standard headings so every district card matches; Director-secret vs player page split if needed. |

