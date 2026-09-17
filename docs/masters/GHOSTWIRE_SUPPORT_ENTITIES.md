# GHOSTWIRE — Support Entities Master

**Status:** Phase 0 complete + design locks — 2026-09-17  
**Purpose:** Single inventory for every class support piece that is not the class item itself: sprites, summoned spirits/elementals, drones, vehicles, ICE/node templates.  
**Foundry Actor packs:** Phase 1+ (this file does not ship Actors yet).

---

## 1. Shared doctrines

| Doctrine | Rule |
|---|---|
| **Conjured vs fielded** | Sprites, elementals, and pact spirits are **conjured** (class power / BP side). Drones and vehicles are **fielded gear** (¥ + Availability). Never mix those economies. |
| **Hybrid-by-tier** | Extension (acts on caster’s turn) → Ordered (own turn, standing orders) → Independent (own initiative). Used by Technomancer sprites and Veil-style summons. |
| **Firewall** | ¥ buys hardware and foci. Class resources (Resonance, Essence, Conviction, Uptime, Bandwidth) run conjured presence or command. Chrome never manufactures those resources. |
| **Power Rolls** | DS print order everywhere: **≤11 / 12–16 / 17+**. Do not ship inverted “Outcome Tier 1 = 17+” text into Foundry. |
| **Cyborg bars** | Elementalist, Street Priest, Technomancer: Cyborgs cannot take the class. Technomancer **can heal** Cyborgs. Hacker/Wrench/Operator/etc. remain chrome-positive. |
| **Decompile / dismiss** | Conjured entities end at encounter end unless a feature says otherwise (e.g. Sprite-Weaver Unbroken Congregation). Gear persists between scenes. |

---


### Dual representation (LOCKED 2026-09-17) — drones & vehicles

Anything that occupies space and moves on the Scene is an **Actor + token**, not Item-only.

| Layer | Role |
|---|---|
| **Item** (`vehicles` pack) | Ownership, ¥, Availability, mod slots, Echelon grade, garage/inventory |
| **Actor** (`summons` pack, `machines/` folders) | Scene token, size, Integrity/Stamina, speed, weapons, Jump-In / crew |

**Deploy** (Wrench Deploy & Command, or anyone’s single-drone link) spawns or links the Actor to the Item + owner via `flags.draw-steel-ghostwire` (`ownerUuid`, `gearItemUuid`, `kind: drone|vehicle`). **Recall / wreck** removes or parks the Actor; the Item remains.

**v1 stamping:** prefer scale-band Actor templates (micro/small/medium drone; bike/car/truck/…) stamped from Item data on Deploy, then expand to 1:1 SKU Actors. Conjured sprites/elementals/spirits remain **Actor-only** (no Item).


## 2. Shared Foundry schema (proposed)

New pack (Phase 1+): `summons` (Actors — DS NPC/monster model + Ghostwire flags).  
Keep **drones/vehicles** in existing `vehicles` (and/or dedicated drone folder) as Items ± Actor tokens later.

| Field | Notes |
|---|---|
| `id` / `_dsid` | Stable slug, e.g. `sprite-attack-minor` |
| `name` | Display name |
| `class` | technomancer / elementalist / street-priest / wrench / hacker |
| `kind` | sprite / elemental / companion / pact-spirit / drone / vehicle / ice / node |
| `tier` or `rank` | minor\|intermediate\|advanced **or** Rank 1–5 **or** Echelon 1–4 |
| `stamina_or_integrity` | Formula or flat pool |
| `defenses` | Wired / Reflex / Physique as applicable |
| `speed` / movement | If any |
| `actions` | Short list of strikes / verbs |
| `summon_cost` | Resonance / Essence / Conviction / Uptime / — |
| `sustain` | Persistent rating or — |
| `decompile_rules` | End of encounter / dismiss / wreck |
| `flags.draw-steel-ghostwire` | `{ class, kind, tier, archetype, pact }` |

---

## 3. Inventories by class

### 3.1 Technomancer — Sprites (Phase 1) — **12 SKUs**

Compile cost: **3 Resonance** base (**2** Sprite-Weaver). Cap: **2** base (Weaver **3+** per discipline ladder).  
HP formulas below are **playtest placeholders** (Technomancer Known Bugs #13) — ship for Foundry v1 unless Michael holds them.

| SKU `_dsid` | Archetype | Hybrid tier | Sprite HP | Primary effect |
|---|---|---|---|---|
| `sprite-data-minor` | Data | Minor (L1–3) | 8 + (Logic × Level) | Edge on 1 roll type/round |
| `sprite-data-intermediate` | Data | Intermediate (L4–7) | 14 + (Logic × Level) | Edge on 2 roll types/round |
| `sprite-data-advanced` | Data | Advanced (L8–10) | 20 + (Logic × Level) | Edge on all Wired rolls it can see |
| `sprite-attack-minor` | Attack | Minor | 12 + (Logic × Level) | Strike 2d10 + Logic |
| `sprite-attack-intermediate` | Attack | Intermediate | 18 + (Logic × Level) | 2d10 + Logic + 1d6 |
| `sprite-attack-advanced` | Attack | Advanced | 26 + (Logic × Level) | 3d10 + Logic |
| `sprite-machine-minor` | Machine | Minor | 10 + (Logic × Level) | Mend 1 Recovery-worth |
| `sprite-machine-intermediate` | Machine | Intermediate | 16 + (Logic × Level) | Mend + optional +1 target |
| `sprite-machine-advanced` | Machine | Advanced | 22 + (Logic × Level) | Mend as full Resonance Mending |
| `sprite-ward-minor` | Ward | Minor | 10 + (Logic × Level) | +1 defense to self |
| `sprite-ward-intermediate` | Ward | Intermediate | 16 + (Logic × Level) | +1 defense, self + 1 adjacent ally |
| `sprite-ward-advanced` | Ward | Advanced | 22 + (Logic × Level) | +2 defense, self + all adjacent allies |

**Defenses (all):** Wired defense = Technomancer Persona; Reflex/Physique baseline **10** (code, not flesh).

### 3.2 Elementalist — Companions & elementals (Phase 2)

| SKU | Notes |
|---|---|
| `companion-ember` | Pyromancer signature summon (Rank 1 fire, extension, sustain-free short duration) |
| `companion-zephyr` | Stormcaller air/water companion |
| `companion-boulder` | Geomancer earth companion (name per chapter) |
| `elemental-rank-1` … scaffolds | **Summon Elemental** (5 Essence, Persistent 2 = −4/turn) — Rank by Echelon / bind cap (Veil §C3 still backlog for full Stamina tables) |
| `elemental-greater` / Twin / etc. | Greater Elemental Summon (11, Persistent 6 = −12/turn) and other named greater forms from 9/11 bands |

Ship **3 companions** first; Rank ladder + greaters as scaffolds until Veil chapter locks entity Stamina.

### 3.3 Street Priest — Pact spirits (Phase 3) — **recommend 3 + pact tint**

| SKU | Ministry | Role |
|---|---|---|
| `spirit-guardian` | Shepherd | Warding / ally screen |
| `spirit-warrior` | Templar | Combatant angelic/infernal |
| `spirit-hunter` | Exorcist | Track / bind hostile spirits |

**Light vs Dark:** one Actor each + Active Effect / flag tint (Holy vs Corruption damage, creed fiction). Prefer **3 Actors**, not 6 duplicates.

### 3.4 Wrench — Drones & vehicles (Phase 4)

SoR: `docs/rulebook/15-drones.md` (**36** chassis by Echelon) and `16-vehicles.md` (**32** entries).  
Foundry: **Item catalog** stays in `vehicles` pack; **Actor templates** live under `summons/machines` (dual representation — see lock above). Phase 4 ships Item sync + Deploy-spawns-token pipeline.

### 3.5 Hacker — Nodes & ICE (Phase 5) — **10 Director templates**

From `08-hacker.md` Node Rating card:

| Rating | Integrity (Track 2) | Biofeedback | ICE sketch |
|---|---|---|---|
| R1 | 12 | 3 | 1 passive |
| R2 | 18 | 5 | 2 passive |
| R3 | 26 | 8 | passive + 1 active |
| R4 | 36 | 13 | passive + 2 active + biofeedback on fail |
| R5 | 50 | 22 | full suite + counter-trace |

**5× Track 1** (breach-only, no Integrity) + **5× Track 2** (Integrity + ICE) = **10** templates. Wire to Wired Console node tools where possible.

### 3.6 No summon line

Operator, Scout, Commander, Medic — narrative contacts/followers only (Commander later); no Actor pack in this program.

---

## 4. Foundry delivery

| Pack | Contents |
|---|---|
| **`summons`** (Actor pack) | Technomancer sprites; Elementalist companions/elementals; Street Priest spirits; **drone/vehicle Actor templates** under `machines/`; optional later hacker node Actors |
| **`vehicles`** (Item pack, existing) | Drone + vehicle **gear catalog** (¥, mods, ownership) |
| **Hacker templates (v1)** | Journal + Wired Console (Actors later) |

`module.json` pack registration + `src/packs/summons/**` + `node tools/build-packs.mjs` in Phase 1+.

Class abilities link by Compendium UUID (drag/grant) the same way Kits/Programs do.

---

## 5. Build order (locked recommendation)

| Phase | Spike | Deliverable |
|---|---|---|
| **0** | B32 | This master (done) |
| **1** | B33 | Technomancer 12 sprite Actors |
| **2** | B34 | Elementalist companions + elemental scaffolds |
| **3** | B35 | Street Priest 3 spirits + pact tint |
| **4** | B36 | Wrench drones/vehicles pack sync |
| **5** | B37 | Hacker node/ICE Director templates |

---

## 6. Design locks (Michael 2026-09-17)

1. **Sprite compile cost:** Signature **Compile Sprite** stays **0 Resonance** at base. Congregation cost **3 Resonance** (**2** Sprite-Weaver) applies to **extra compiles / enhance-for-second-sprite / swarm spends** — not a tax on the free signature compile.
2. **Sprite HP table:** **Ship Known Bugs #13 placeholders** into Phase 1 Foundry Actors; adjust after playtest.
3. **Street Priest:** **3 spirits + Light/Dark pact tint** (not 6 duplicate Actors).
4. **Summon Elemental:** **Both** forms — early extension, later independent (hybrid ladder parity with Technomancer sprites). Rank Stamina tables wait on Veil §C3 scaffolds.
5. **Hacker nodes (v1):** **Journal + Wired Console** data first; placable Actor tokens deferred to a later pass.
## 7. Source index

- `GHOSTWIRE_TECHNOMANCER_DEVELOPMENT_MASTER.md`
- `06-elementalist.md`, `07-street-priest.md`, `08-hacker.md`, `05-wrench.md`
- `15-drones.md`, `16-vehicles.md`
- Class packs live under `src/packs/classes/*` (abilities text-only until Phases 1–5)
