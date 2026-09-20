# The Veil

**RAW status:** draft (B43 Ritual Working locked 2026-09-18; §C3 Summon Entities locked 2026-09-18)  
**Sources:** `docs/rulebook/06-elementalist.md`, `docs/rulebook/07-street-priest.md`, `docs/rulebook/12-chrome.md`, `docs/rulebook/09-species.md`, `docs/rulebook/17-perks.md`, `docs/masters/GHOSTWIRE_GEAR_MASTER.md` (Category 6), `docs/directors/veil-rituals-exploration.md` (B43)

---

## What this chapter covers

The **Veil** is the boundary Ghostwire's magic reaches across. Encounter casting lives in the Veil-casting classes — **Elementalist** (`17`) and **Street Priest** (`18`). This chapter collects shared rules, including **Ritual Workings** (long-form Project magic), and points to the rest.

The **Technomancer** (`20`) is not a Veil caster — their power works through the Wired — but it is still Magic for Arcane Severance. They may **lead Wire-flavored Ritual Workings** (same Magnitude ladder).

## Magic keyword

An ability with the **Magic** keyword draws on the Veil. Magic abilities use the same action types, Power Rolls, and targeting as other abilities in this book (`03`, `04`). Cyborg Arcane Severance and chrome erosion apply (`05`, `09`).

## Who can't use magic

**Arcane Severance:** a **Cyborg** can't use Magic-keyword abilities and can't take the Elementalist, Street Priest, or Technomancer class. Cyborgs can still be targeted, harmed, and protected by magic (`05`). Cyborgs cannot **lead** a Ritual Working.

## Chrome erodes magic

Every point of Body Integrity a living caster spends on chrome shrinks their casting-resource **maximum** (Essence, Conviction, Resonance):

| Chrome grade | Casting-resource maximum reduced by |
|---|---|
| Standard | 1 per 2 Integrity spent (round down) |
| Soft / Bioware | 1 per 3 Integrity spent |
| Salvage | 1 per 1 Integrity spent |

Every caster uses this one formula, the Technomancer included — there are no class-specific erosion models (`09`, `17`, `18`, `20`). Soft-cap Weave Strain (`09`) is a separate cliff on top of erosion.

> **In Foundry**
> Living casters see soft-cap and erosion hints on the hero sheet **Body Integrity** fieldset (`09`): **Chrome spent X / 5**, the **Weave Strain** Active Effect when over, and the casting-resource cap line after erosion. Resource gains clamp to the eroded cap automatically. Cyborgs remain Arcane Severance-blocked at the sheet.


## Shared Veil-caster rules

| Rule | Elementalist | Street Priest |
|---|---|---|
| **Sensing the Veil** | *Read the Weave* signature: senses the Veil's thinness and present magic, and on better results reads a working's rank and nature | *Sense the Veil / Discern Spirits* signature: reads a spirit's rank and nature, senses the Veil's thinness, detects corruption |
| **Sustaining a working** | Persistent workings cost resource every turn: **Persistent 1 = -2**, **Persistent 2 = -4** | Same throttle: **-2 / -4** Conviction per turn |
| **Summoning** | Summon and bind elementals; a **Bind Power Roll (2d10 + Logic)** limits control | *Invoke the Pact* summons pact aid; middle = extension of your turn, high = independent figure |
| **Alignment** | — | **Light** or **Dark** pact; failures and backlash differ by pact |

Full rules, numbers, and exceptions are in each class chapter.

## Veil gear

**Foci** are the caster's gear: bound or crafted implements that grant edges on specific workings. Each class chapter lists its foci; the gear catalog adds shared ritual tools, material components, and reagent packages (`08`). A caster can have one **signature-focus bond**, the only gear that directly improves a class ability.

## Supernatural perks

Any runner can take a **supernatural perk** (`11`): small Veil and Signal gifts, not spellcasting. Veil Trick has the Magic keyword, so a Cyborg can't use it.

---

## Ritual Workings (LOCKED 2026-09-18 — B43)

Encounter abilities (Essence / Conviction / Resonance) are the fight toolkit. A **Ritual Working** is long-form big magic: a **Project** chain (`03`) on the same §Craft downtime spine as Invent a Mod (`08`, `10`). It spends yen, lore, reagents, and **Veil Price / spirit-attention**, and pays out effects encounter casting should not cheaply do.

Rituals are **between runs** (or a dedicated session beat). They never replace combat resource economy.

### Who leads and who assists

| Role | Who |
|---|---|
| **Leader** | Must know the rite. Normally **Elementalist**, **Street Priest**, or **Technomancer** (Wire-rites). Director may allow a cult NPC leader. |
| **Assistants** | Any hero (including non-casters): grant edges or Project Points on sealing per Director. |
| **Fund only** | A crew **without** a caster may hire/fund an NPC leader who knows the rite (yen + favor / debt). |
| **Barred** | Cyborgs cannot lead (Arcane Severance). |

### Magnitude

Replaces SR-style Force. Caps by leader **echelon** and sanctum rating (sanctum rating must be greater than or equal to Magnitude).

| Magnitude | Rough echelon | Example payoffs |
|---|---|---|
| 1 | E1 | Personal charm/rune (session), watcher-spirit hours, ward a room |
| 2 | E1-2 | Enchant a street focus, remote viewing with spotter, seal a flat |
| 3 | E2-3 | Permanent item (Availability Restricted+), block-scale ward, short thin-path |
| 4 | E3-4 | Prototype relic, district gateway, bind a named spirit to a site |
| 5 | E4 / campaign | Apex gate, unmake a major seal (Director veto heavy) |

**Wire-rites** (Technomancer-led) use this **same** Magnitude ladder — no separate Resonance track.

### Stages (one Project chain)

1. **Lore** — Acquire or decode the rite (library, mentor, stolen grimoire, thin-place vision). Project Power Roll (**Logic** or **Instinct**; Rituals / Occult / Religion / Matrix Theory as appropriate grant edge). Goal points scale with Magnitude.
2. **Components** — Spend yen + Availability-gated reagents/foci parts. Optional **run** to steal a unique reagent (adventure hook). Extra reagents later grant edges or blunt Price.
3. **Sanctum** — Claim or build working space (days about equal to Magnitude; yen for materials).
   - **Temporary (default):** lasts until next dawn/dusk or until one sealing completes; costs more reagents if rushed.
   - **Permanent:** crew/world asset (safehouse upgrade). Requires upfront yen + ongoing lifestyle/upkeep; rating can rise with further Projects. Sanctum rating must meet or exceed Magnitude to seal that Magnitude.
4. **Sealing** — Leader + participants commit a downtime block or short climax scene. One collaborative Power Roll (leader's tradition characteristic: Logic / Persona / as printed; assistants grant edges or Project Points). Then **Price** resolves and **spirit-attention** ticks (Magnitude-scaled into Malice fuel).
5. **Payoff** — Effect lands; components consumed; temporary sanctum spent (or permanent lodge remains with upkeep).

### Effect families

| Family | Examples | Notes |
|---|---|---|
| **Artifice** | Enchant weapon/armor/focus, carve runes | Output = one-off Item with Veil flags (catalog SKUs later) |
| **Ward** | Room/flat/block barrier, anti-spirit, anti-Wire bleed | Printed duration or upkeep |
| **Reach** | Remote sense/strike via spotter | Spotter must Overlay / Jacked In / astral-equivalent; can be traced |
| **Calling** | Long bind, site guardian, watcher | Persistent Price while bound |
| **Threshold** | Open/close thin places, short gates | High heat; Concord/corps notice |
| **Unmaking** | Break curses, scrub **Taint**, collapse a ward | Often Magnitude at least the original. Taint cleanse ladder and Magnitude gates live in `27-corruption-taint.md` |

### Detection (buildup is a clock)

Each stage past **Lore** accumulates **Veil pressure** about equal to Magnitude (Director track).

| Magnitude | Leak range |
|---|---|
| 1-2 | **District** — local casters, thin-place sensitive, nearby Overlay |
| 3 | Hive **whisper** — sensitive casters across the Reach may notice |
| 4-5 | Hive-wide / faction clocks — Concord, corps, rival ritualists |

**Overlay / Jacked In** grants an edge to notice **Wire-rites** in the **district**. Citywide Overlay detection only at Magnitude **4+**.

Success on a notice check reveals: working underway, rough Magnitude band, tradition flavor, direction/distance band — not the rite name unless high success or prior Lore.

Quiet Lore + shopping: little leak. Sanctum raised: detectable per table. Sealing night: loud — nearby casters get a free notice check.

### Countermagic

Not a free dispel. Buildup and standing effects use Project / scene tools.

**Before seal:** spoil components; break sanctum; contest Lore (false grimoire gives the leader a bane on sealing); starve assistants.

**During sealing — Counterseal (universal Veil verb):** any Elementalist or Street Priest in the climax scene may spend encounter resource (Essence or Conviction; Director: typically 3+) as an action and make a contested Power Roll vs the leader. Success aborts or corrupts the payoff; failure feeds backlash. Technomancer **Wired spoof** (Scrambler / hostile ICE into the glyph-layer) is the Wire-rite analogue — Logic/Hacking contested roll, same stakes.

**After payoff:** Unmaking family Projects; destroy/unbond artifice; every permanent ward/gate should list a **printed counter condition**.

Price and spirit-attention already spent are **not** erased by a successful counter.

### Failure and heat

- Low sealing roll: partial effect, hung ritual (time bomb), or hostile attention.
- Interrupt mid-seal: backlash + components lost + Malice tick.
- Extra reagents / assistants / longer sanctum prep: edges or reduced Price.

---

## Sample rites (v1 catalog)

Numbers are starting points for playtest. Director may scale yen and Goal points with Availability and Magnitude.

### 1. Ward the Room (Ward, Magnitude 1)

- **Leader:** Elementalist or Street Priest.
- **Stages:** Lore easy (common rite); Components cheap incense/salt/circuit-chalk (Street Availability); Sanctum = the room itself for one night; Sealing = one downtime evening.
- **Payoff:** The room is a weak Veil barrier until next dawn — spirits and Magic-keyword remote targeting take a bane to enter or pierce. **Counter:** salt circle broken, or Unmaking Mag 1.
- **Price:** Negligible personal; spirit-attention +1 if sealing in a thin place.

### 2. Street-Focus Charm (Artifice, Magnitude 2)

- **Leader:** Elementalist or Street Priest (focus tradition matches).
- **Payoff:** One existing focus or light weapon gains a **session-long** edge on one named Magic ability, or a one-off Veil-tagged Item (unique flags — not a catalog SKU yet).
- **Price:** Light fatigue / minor corruption mark until next respite.
- **Counter:** Unbond (downtime Project Mag 2) or destroy the item.

### 3. Remote Sense (Reach, Magnitude 2)

- **Leader:** Any ritual leader; **requires a spotter** Overlay, Jacked In, or otherwise present at the target.
- **Payoff:** For one scene, leader perceives through the spotter's senses (or a tagged camera/spirit) within Reach/Wired range as printed.
- **Risk:** Failed sealing or contested trace can reverse the link for a round.
- **Price:** Spotter takes biofeedback-like jolt on a low roll.

### 4. Watcher (Calling, Magnitude 2)

- **Leader:** Street Priest (Light or Dark) or Elementalist.
- **Payoff:** A minor watcher-spirit or elemental extension guards a marked site for hours equal to 4 times Persona (or until dismissed). Alerts the leader once when triggered.
- **Price:** No Persistent cost out of combat; if ignored when it screams, spirit-attention increases by Magnitude.
- **Counter:** Banish / Unmaking Mag 2; or kill the watcher in a scene.

### 5. Thin-Path (Threshold, Magnitude 3)

- **Leader:** Elementalist preferred; Street Priest in a consecrated thin place.
- **Payoff:** Open a short path between two known thin places for one traversal (crew-sized). Closes behind unless Magnitude 4+ and permanent sanctum.
- **Heat:** Automatic district notice; Concord/corp clocks advance on Mag 3+ Threshold rites in the Reach.
- **Price:** Each traveler pays a personal toll (Stamina or recovery debt — Director).
- **Counter:** Collapse from either end (Unmaking Mag 3 or higher) or destroy either thin-place anchor.

### 6. Site Bind (Calling, Magnitude 4)

- **Leader:** Street Priest or Elementalist; named spirit/elemental must be known (prior Lore or encounter).
- **Payoff:** Bind a named spirit or elemental as a **site guardian** tied to a permanent sanctum (rating 4 or higher). Guardian uses B53 summon scaling as a floor for Stamina.
- **Price:** Ongoing favor/debt while bound; slipped leash feeds Incursion/Malice.
- **Counter:** Printed — break the sanctum's keystone, or Unmaking Mag 4 contested with the binder.

---

---

## §C3 Summon Entities (LOCKED 2026-09-18)

Shared Stamina and bind-count rules for Elementalist elementals and Street Priest pact spirits. Class chapters (`17`, `18`) and Foundry (`scripts/veil-summons.mjs`, B53/B60) follow these numbers. Persistent costs, bind unlocks, companion / Rank 1 / spirit strike bands already printed in RAW are **final**, not provisional.

**Pet Stamina (LOCKED).** Hit points for compiled / summoned pets are ordinary **Stamina**. There is no separate “pet HP” unit. **Sprites** (`20`), **Agents** (`19`), and **independent spirits** (this chapter / `18`) take damage against their own Stamina and drop at 0. **Extension spirits** have **no separate pool** — they act on the caster’s turn; a token number is table convenience only, and the Director may treat the extension as untargetable. Elemental rank bases stay in the table below.

> **In Foundry**
> Elementalist and Street Priest summon abilities spawn linked Actors from the **Summons & Machines** pack (B53). Open the summon ability’s Item sheet for the live roster, manual **Summon** / **Dismiss**, and per-pet dismiss. Using the ability can auto-summon when the module setting allows; pets drop at 0 Stamina. Technomancer sprites use the same pack pattern on **Compile Sprite** (`20`). Hacker **Agents** (Probe / Spike / Daemon / Watchdog) use **Compile Agent** (`19`) — software, not Resonance, not a sprite SKU.


### Elemental Stamina

**Formula:** rank base + (**Logic × Level**). Companions use Rank 1.

| Rank | Base | Notes |
|---|---|---|
| 1 | **15** | Companions (Ember / Zephyr / Boulder) and Summon Elemental R1 (extension) |
| 2 | **25** | Summon Elemental from 5th level (independent) |
| 3 | **35** | Summon Elemental from 7th level |
| 4 | **50** | Greater Elemental Summon |
| 5 | **65** | Greater Elemental Summon at echelon 4 (level 10) |

**Bind unlocks (Summon Elemental max rank):** Rank 1 from 1st level, Rank 2 from 5th, Rank 3 from 7th.

**Bound count:** at most **2** non-companion bound elementals at once. A new bind **releases the oldest**.

### Spirit Stamina

**Formula:** form base + (**Persona × Level**).

| Form | Base | Notes |
|---|---|---|
| Extension | **20** | RAW: no Stamina track of its own. Token pool is table convenience; Director may treat extension as untargetable |
| Independent | **30** | Own figure and turn |

Spirit strike (extension and independent): **4 / 7 / 10 + Persona** (holy or corruption by pact) — final.

### Deferred (explicitly out of this lock)

Leave unset until a later Veil pass:

- Rank 2+ / Greater / Rank 5 **strike damage ladders**
- **Defense stamps** on Veil Actors (Wired / Reflex / Physique, etc.)

Until those land, use Rank 1 / companion / spirit strike bands already printed in the class chapters, and Director judgment for higher-rank strike damage and defenses. Template Actors bake **base-only** Stamina; live summon stamps apply Logic×Level / Persona×Level.

## Corruption & Taint

The shared hero **Taint** track (0–12; Clean / Marked / Stained / Claimed / Hollowed) lives in `27-corruption-taint.md`. Class text that says "corruption" as a Price means **Taint** on that track. Unmaking workings above are the cleanse family; rest never cleanses; chrome does not raise Taint. Pact Prices ignore the +1-per-scene cap.

## Not yet written

Thin-place gazetteer mechanics and fuller Veil entity stat cards (beyond §C3 Stamina / bind-cap) remain open. The hero Taint ladder is **B80** (`27`). Ritual Workings above are the B43 lock; §C3 Summon Entities (Stamina + bind count) is locked 2026-09-18 — see above. Deferred from §C3: Rank 2+ strike ladders and defense stamps. Foundry automation of Persistent drain / Command edge remains a later build.
