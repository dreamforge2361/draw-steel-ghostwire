# Spike B53 — Summon scaling for spirits & elementals

**Status:** implemented 2026-09-17, module **0.1.78**, **awaiting Michael's Foundry verify (not committed).**
**Design lock (Michael, 2026-09-17):** pets get stronger as the caster levels, the same *fantasy* as Technomancer sprites, but **follow each class RAW**. No sprite 4×3 Actor matrix clone.

## Sprites (reference, B52, untouched)
Hybrid bands L1–3 / L4–7 / L8–10, Stamina = archetype base + (Logic × Level), encounter-end decompile. `scripts/sprites.mjs` is not modified by B53. Drones (`scripts/machines.mjs`) aren't modified either.

## As-built

### Code
- **`scripts/veil-summons.mjs`** (new), registered from `scripts/module.mjs` right after `registerSprites()`. It covers both classes because they share one pattern: template → linked world Actor → live stamp → token → roster.
- **Trigger = the real abilities, no parallel menu.** Draw Steel emits no ability-use hook. As in `sfx.mjs`, the signal is the `createChatMessage` that `DrawSteelAbility#use()` creates. Its `abilityUse` part names the ability, and its `abilityResult` part(s) carry the **Bind roll tier** (the lowest tier if targets split the roll). The client that rolled does the work.
- Hooked ability `_dsid`s (existing, unchanged in packs):

| Class | `_dsid` | What it places |
|---|---|---|
| Elementalist (Pyromancer) | `ember-companion` | `companion-ember` |
| Elementalist (Stormcaller) | `zephyr-companion` | `companion-zephyr` |
| Elementalist (Geomancer) | `boulder-companion` | `companion-boulder` |
| Elementalist | `summon-elemental` | `elemental-rank-1/2/3` (rank picked up to the bind cap) |
| Elementalist | `twin-elemental-summon` | two `elemental-rank-*` |
| Elementalist | `greater-elemental-summon` | `elemental-greater` (Rank 4, Rank 5 at echelon 4) |
| Street Priest | `invoke-the-pact` | `spirit-guardian` (Shepherd) / `spirit-warrior` (Templar) / `spirit-hunter` (Exorcist) |

- **Not hooked:** `sentinel-spirit`. RAW: size-2, *cannot be harmed*, lasts until the end of your next turn. No durable pet, so no Actor spawns (as the brief asked).
- **World setting** `veilSummonOnUse` (default on): turn it off to summon only from the sheet button.
- **Ability Item sheet** (those 7 abilities, on the right class): a status line with the current scaling, a roster (Stamina value / max, form), a **Summon** button (manual path, treated as a clean bind; Invoke the Pact asks extension vs independent), **Dismiss All**, and ✕ per summon.
- **API:** `game.modules.get("draw-steel-ghostwire").api` gains `summonVeil, summonFromAbility, dismissVeil, dismissAllVeil, refreshVeilSummons, veilSummons, veilSummoner, bindCapRank, greaterRank, elementalStamina, spiritStamina`.
- **No pack JSON changed**, so **no pack rebuild is needed**. Templates keep their baked Stamina; the script stamps over it. Template descriptions (lang) now state the live formula.

### Flags
- Pet: `flags.draw-steel-ghostwire = { kind, subtype|ministry, element, rank, hybridTier, dsid, summoner, ownerUuid, sourceAbility, summonedAtLevel, formula, bind, scaleRank, expires, pact }`. `summoner` and `ownerUuid` are the caster Actor uuid. `formula` is `elemental-rank-N` or `spirit-extension|independent`. `bind` is `clean|resists|broken|null`. `expires` is `{ combat, round }` or null.
- Caster: `flags.draw-steel-ghostwire.veilSummons = { uuids }`, a mirror. The world scan by `summoner` is the truth, so a hand-deleted pet self-heals. Plus `companionCombat` (the combat id of the last companion call).

## Provisional formulas (until Veil §C3)

### Elementalist: rank base + (Logic × Level)
| Rank | Base | Source |
|---|---|---|
| 1 (incl. Ember / Zephyr / Boulder) | 15 | Summon Elemental R1, companions |
| 2 | 25 | Summon Elemental from L5 |
| 3 | 35 | Summon Elemental from L7 |
| 4 | 50 | Greater Elemental Summon |
| 5 | 65 | Greater Elemental Summon at echelon 4 (L10) |

Examples: L1 Logic 2, R1 = 17. L5 Logic 3, R2 = 40. L7 Logic 4, R3 = 63. L8 Logic 4, R4 = 82. L10 Logic 5, R5 = 115.

**Bind cap (max rank for Summon Elemental), by level, not echelon:** R1 at L1–4, R2 at L5–6, R3 at L7+. RAW: "a 1st-level Elementalist starts with a Rank 1 extension only; a 5th-level Elementalist unlocks Rank 2 independent", and independents are "levels 7–10 / later echelons". The pack's unlock levels (R2 = L5, R3 = L7) agree. An echelon mapping would have unlocked R2 at L4, against the printed 5th-level line. The caster may bind *below* the cap (RAW "up to your bind cap"); a dialog lists each rank with its Stamina. Rank 1 is the extension; Rank 2+ is independent (template `hybridTier`).

**Bind roll tier** (Summon / Twin / Greater, 2d10 + Logic):
- high → `bind: clean`
- middle → `bind: resists`
- low → `bind: broken`: the elemental is placed **hostile**, is Director-owned, and expires after 1 round (RAW "hostile and free for one round before the Veil pulls it back")

The Twin's single roll applies to both, so a broken Twin flips both.

**Twin Elemental Summon:** two Rank 1 extensions; at **echelon 3+** a dialog offers "cap-rank independent + Rank 1 extension" instead.

**Bind cap on count (provisional, table rule):** at most **2** bound (non-companion, non-broken) elementals at once, the Twin apex. A new bind over the cap **releases the oldest**, rather than blocking, so Essence already spent never fizzles.

**Companions:** Rank 1 extension, no bind roll, `expires` = 3 rounds when summoned in a started combat. One live companion per caster (a re-call replaces it). Once per encounter is **warned, not blocked**: RAW has a "1/encounter refresh", and the table owns refreshes.

### Street Priest: form base + (Persona × Level)
| Form (Bind Check 2d10 + Instinct) | Base | Notes |
|---|---|---|
| low (≤11) | — | failed bind; no Actor. Notification: Light = bane (save ends); Dark = the entity strikes the priest for 4 + Persona |
| middle: extension | 20 | RAW: no Stamina track of its own. The token's pool is a table convenience so its strike is rollable; the Director may rule it untargetable |
| high: independent | 30 | own figure and turn; Persistent 2 |

Examples: L3 Persona 2 → 26 / 36. L10 Persona 5 → 70 / 80.

- Ministry → spirit: Shepherd → Guardian, Templar → Warrior, Exorcist → Hunter. With no subclass yet, a dialog asks.
- **Pact tint:** the priest's `light-pact` / `dark-pact` feature is read at summon. The matching Pact effect is enabled and the other disabled in the created data, plus `flags.pact` and `prototypeToken.texture.tint`. The spirit arrives tinted, and the existing `module.mjs` pact hooks keep handling manual toggles.
- One invoked entity per priest: a new invocation replaces the last.
- Stamped characteristics: Presence = caster Persona, Intuition = caster Instinct, monster level = caster level. Elementals get Reason = caster Logic.

## Lifecycle
| Event | Companions | Bound elementals | Broken binds | Pact spirits |
|---|---|---|---|---|
| 0 Stamina (GM client) | dismissed | dismissed | dismissed | dismissed |
| Round advance | gone after 3 rounds | — | gone after 1 round | — |
| Encounter end (`deleteCombat`) | dismissed | **kept** (sustained, not encounter-scoped; Weave Mastery standing binds) | dismissed | dismissed (RAW "for the rest of the encounter") |
| Level up (class `system.level`) / Logic / Persona / Instinct change | Stamina re-stamped | re-stamped; a Summon Elemental held **at the old cap** (`scaleRank`) re-binds at the new cap rank (delete + create at the same spot, same safety as the sprite band swap: deferred with a warning if no Scene or no create permission) | — | re-stamped |
| Greater at L10 | — | Rank 4 → 5 re-stamp (same template) | — | — |

Re-stamps keep damage taken: the pool grows by exactly as much as the maximum did.

## Out of scope / follow-ons
- **Veil §C3** entity tables (Stamina, strikes for Rank 2+, defenses): replace `ELEMENTAL_BASE` / `SPIRIT_BASE` when locked.
- **Persistent Essence / Conviction drain** for sustained binds isn't automated. The Summoned notification and template text carry the Persistent value.
- **Heavy-hit bind break** (Persona save) and **Command roll** edge/resist: flags only (`bind`), no automation.
- Weave Mastery / Ascendant Weave standing binds: bound elementals already persist across encounters; there's no special handling.
- Ability JSON text is unchanged.

## Foundry verify checklist (Michael)
1. Module 0.1.78 loads; console shows `Veil summons: elementals and pact spirits registered`. Settings list **Veil summons: place on ability use**.
2. **Pyromancer L1 (Logic 2):** use Ember Companion from the sheet. The Ember token appears beside the hero, friendly, **17 Stamina**, in the *Veil Summons* folder. Start combat, use it again: the "already called" warning, and the old companion is replaced. Advance 3 rounds: it expires.
3. Level the Elementalist 1 → 2: the companion's max goes 17 → 19 (keeping damage).
4. **Summon Elemental** at L1: no dialog, R1 placed. Roll a **low**: a hostile, Director-owned elemental that disappears on the next round. At L5: the dialog offers R2 / R1. With R1 held at L4 (at cap), level to 5: it re-binds as Rank 2 independent at the same spot.
5. Summon a third bound elemental: the oldest is released (notification).
6. **Twin** at L6: two R1s. At L7: the dialog offers R3 independent + R1 extension.
7. **Greater** at L8: Rank 4, 50 + Logic×8. Level to 10: rank flag 5, Stamina re-stamped to 65 + Logic×10.
8. End combat: companions gone, bound elementals stay.
9. **Street Priest (Templar, Light pact) L3 Persona 2:** Invoke the Pact. Middle → Warrior Spirit extension, 26 Stamina, gold tint, Pact: Light effect on. High → independent, 36. Low → no token, bane warning. Dark pact → purple tint; low → "strikes you for 4 + Persona".
10. End combat → spirit dismissed. Reduce any summon to 0 Stamina → dismissed and the roster cleared. Delete one by hand → the ability sheet roster updates.
11. Regression: Compile Sprite and Wrench Deploy / Recall behave as before.
