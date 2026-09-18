# Backlog exploration — Veil Rituals as Draw Steel Projects (B43)

**Status:** LOCKED 2026-09-18 by Michael — locks accepted; Ritual Working + 6 sample rites drafted into docs/raw/22-the-veil.md. Foundry automation later. Exploration notes below remain design history.
**Question:** Can Shadowrun-style ritual magic become Ghostwire **long-form big magic** using Draw Steel **Projects** (the same §Craft downtime spine as Invent a Mod)?

## Short answer
**Yes — it fits cleanly.** Encounter magic (Essence / Conviction / Resonance abilities) stays the fight toolkit. Rituals become **multi-stage downtime Projects** that spend ¥, lore, reagents, and **Veil Price / spirit-attention**, and pay out effects encounter casting should never cheaply do: permanent items, runes, remote workings, wards, gateways.

Do **not** invent a parallel “ritual skill.” Use Projects + existing skills (Logic/Persona research; tradition-flavored Power Rolls) and the Veil risk loop.

---

## What Shadowrun rituals are doing (pattern, not a port)
From SR5-style ritual spellcasting (public summaries):

| Beat | Shadowrun | Ghostwire candidate |
|---|---|---|
| Scope | Bigger / farther / longer than instant spells | Effects above class ability ceilings |
| Place | **Lodge** ≥ ritual Force (days + ¥ materials, or temp reagents) | **Sanctum / Circle / Thin-place claim** |
| Stuff | **Reagents** consumed; extras blunt Drain | **Ritual components** (Gear Cat already nods at foci & ritual components) |
| People | Leader + participants; optional **spotter** for remote targets | Leader (must know the rite) + assistants; spotter / Wired observer / bound spirit |
| Time | Minutes–hours (Force-scaled) | Project Points / downtime days + optional climax scene |
| Cost | **Drain** on everyone after seal | **Price** (corruption / task / essence debt) + **spirit-attention → Malice** + personal backlash |
| Fail | Lodge broken / leave early → fail | Interrupt, failed Power Roll, slipped bind, Concord/Incursion notice |

We steal the **shape**, not Force×¥ tables or SR spell lists.

---

## How it sits on our locked rules
- **§Craft = Project procedure** (`11-economy.md`, `14-mods.md`) — already the downtime chassis for invent/install.
- **Veil** — summon/bind/command/banish, Price, spirit-attention (Elementalist / Street Priest; Technomancer Resonance adjacent).
- **Encounter casters** keep Persistent drains and 1–11 cost abilities; rituals are **between runs** (or a dedicated session beat), not a way to skip Adrenaline/Essence economy in combat.
- **Who can lead:** Elementalist, Street Priest primarily; Technomancer for Wire-ritual hybrids (data-wards, deep-net bindings); non-casters can **assist** or fund, rarely lead (Director exception for cult NPCs like Choirmother).

---

## Proposed structure — **Veil Working (Ritual Project)**

### Stages (one Project chain, or linked Projects)
1. **Lore** — Acquire or decode the rite (Library / mentor / stolen grimoire / thin-place vision). Project Power Roll (Logic or Instinct). Goal points scale with rite **Magnitude** (see below).
2. **Components** — Spend ¥ + Availability-gated reagents/foci parts; optional **run** to steal a unique reagent (adventure hook, not a shop SKU).
3. **Sanctum** — Claim or build a working space (days ≈ Magnitude; ¥ for materials). Acts as weak mana/Veil barrier while active. Temporary sanctum = more reagents, lasts until next dawn/dusk or one sealing.
4. **Sealing** — Leader + participants commit a downtime block or a short scene. One collaborative Power Roll (leader’s tradition characteristic + assistants grant edges / Project Points). Then **Price** resolves and **spirit-attention** ticks (Magnitude-scaled).
5. **Payoff** — Effect lands; components gone; sanctum may be spent or left as a permanent lodge (ongoing upkeep?).

### Magnitude (replaces SR Force — align to echelon, not old tier)
| Magnitude | Rough echelon | Example payoffs |
|---|---|---|
| 1 | E1 | Personal charm/rune (session), watcher-spirit hours, ward a room |
| 2 | E1–2 | Enchant a street focus, remote viewing with spotter, seal a flat |
| 3 | E2–3 | Permanent item (Availability Restricted+), block-scale ward, open a short thin-path |
| 4 | E3–4 | Military/prototype relic, district gateway, bind a named spirit to a site |
| 5 | E4 / campaign | Apex: lasting gate, unmake a Quiet Floor seal (Director veto heavy) |

Magnitude caps by leader **level/echelon** and sanctum rating (sanctum ≥ Magnitude).

### Effect families (catalog later)
| Family | Examples | Notes |
|---|---|---|
| **Artifice** | Enchant weapon/armor/focus, carve runes | Output = Gear/Chrome-adjacent Item with Veil tag; Availability gated |
| **Ward** | Sanctum barrier, anti-spirit, anti-Wire bleed | Stacks with Street Priest / Elementalist zones? Define once |
| **Reach** | Remote strike/sense via spotter | Spotter must Overlay/Jacked or astral-equivalent; ICE/Veil can trace back |
| **Calling** | Long bind, site guardian, watcher | Persistent Price while bound; slipped leash = Incursion fuel |
| **Threshold** | Open/close thin places, short gates | Deadfall / Outer Wall dangerous; Concord and corps notice |
| **Unmaking** | Break curses, scrub corruption, collapse a node-ward | High spirit-attention; never free |

### Failure & heat (keep Ghostwire tone)
- Low sealing roll → partial effect, hung ritual (time bomb), or hostile attention.
- Interrupt mid-seal → backlash + components lost + Malice tick.
- Extra reagents / assistants / longer sanctum prep → edges or reduced Price (mirror SR “extra reagents blunt Drain”).
- Corp / Concord / Hollow Men as **competing ritualists** — same system for NPC clocks.

---

## Foundry sketch (future)
- Item type or Journal rite cards: Magnitude, stages, component list, Price.
- Hero sheet **Projects** (stock DS) already track Project Points — rite = multi-phase Project or folder of linked Projects.
- Optional Director app later (not B39) for sanctum clock.

---

---

## Detection — feeling the buildup (rules + fiction hooks)

A ritual in progress should be a **clock the table can interact with**, not a secret that only resolves at payoff.

### What leaks
Each stage past **Lore** accumulates **Veil pressure** equal to Magnitude (Director track). Fiction by tradition:
- **Street Priest / Conviction:** cold spots, wrong hymns, cameras glitching into stained-glass static, animals refusing the block.
- **Elementalist / Essence:** weather that does not match hive HVAC, element tasting wrong, thin-place shimmer, metal singing.
- **Technomancer / Wire-rite:** sprite flocks fleeing or swarming, Trace-like noise without a decker, Overlay glyphs on walls, Watchdog ICE waking early.
- **Any high Magnitude:** spirit-attention ticks that feed **Malice** even before sealing — the war notices the prep.

### Who can notice
| Who | How | Typical roll |
|---|---|---|
| Street Priest / Exorcist lean | Sense Veil / corruption | Instinct or Persona; edge in thin places |
| Elementalist | Attunement wrong element | Instinct; edge if attuned element matches leak |
| Technomancer / Hacker on Overlay | Data-weather / sprites | Logic or Hacking; edge Jacked In near sanctum |
| Scout / mundane | Secondary signs only | Insight; bane unless Magnitude 3+ |
| Corp / Aureole / Concord | Sensors, clergy, wardens | Background clock if pressure sits too long |

Success reveals: working underway, rough Magnitude band, tradition flavor, direction/distance band — not the rite name unless high success or prior lore. Potency scales with Magnitude and how open the sanctum is.

### Buildup as a Director clock
- **Quiet prep (Lore + shopping):** little or no leak.
- **Sanctum raised:** detectable in the district (Magnitude 1-2) or hive-wide whisper (4-5).
- **Sealing night:** loud — nearby casters get a free notice check; complications can crash the party.

Crews hunting a ritual get a progress clock (discover, locate sanctum, interrupt or infiltrate sealing). Same system when PCs are the ones cooking a big working.

---

## Countermagic — stopping or spoiling the working

Countermagic is **not** a free dispel button for ritual-scale effects. It is its own Project / scene toolkit.

### During buildup (before seal)
| Move | Effect |
|---|---|
| Spoil components | Steal/destroy reagents — stage 2 resets or Magnitude drops |
| Break sanctum | Trash the circle / claim the thin place — stage 3 fails; leak spikes once then dies |
| Contest Lore | False grimoire / counter-rite — leader takes bane on sealing |
| Starve participants | Arrest, bribe, or frighten assistants off — fewer edges / Project Points |

### During sealing (climax scene)
| Move | Effect |
|---|---|
| Interrupt | Force leader out of sanctum, silence, or kill focus — sealing fails; backlash on casters |
| Counterseal | Opposing caster spends encounter resource + action; contested Power Roll vs leader; success aborts or corrupts payoff |
| Banish / Ward spike | Street Priest tools force spirit-attention to lash the ritualists |
| Wired spoof | Hacker dumps Scrambler/Black ICE into Overlay glyph-layer (Wire-rites) |

### After payoff (standing effects)
- **Unmaking** family — downtime Project to scrub a ward, break a rune, close a gate (often Magnitude at least the original).
- **Item artifice:** destroy or unbond the focus; not a cantrip.
- Permanent gates/wards should list a **printed counter condition** so Directors are not inventing every time.

### Design tension (LOCKED intent)
Detection without countermagic makes rituals unfair to the hunted. Countermagic without buildup detection makes big magic unstoppable. **Both are required** for B43. Price/spirit-attention stay on the casters even when they win — countering does not erase what the Veil already noticed.

## Open questions for Michael

0. Detection range by Magnitude — district vs hive? Can Overlay see Wire-rites citywide?
0b. Is Counterseal a class ability (Priest/Elementalist pick) or a universal Veil verb?
1. Permanent **Sanctums** as world assets (crew safehouse upgrade) vs always temporary?
2. Can a **crew without a caster** fund a rite led by an NPC (Cassavir finds a hexer)?
3. Artifice output: new Item in Gear pack vs one-off unique flags?
4. Wire-only rites (Technomancer) — same Magnitude ladder or separate Resonance track?
5. Ship in **Veil RAW chapter** (`docs/raw/22-the-veil.md`) before any Foundry?

## Recommendation
**Done for docs:** Ritual Working + 6 sample rites are in docs/raw/22-the-veil.md (B43). Playtest as downtime between runs; Foundry widgets later.

## Out of scope for now
Full Street Grimoire port; alchemy preparations as a second subsystem; replacing encounter casting.