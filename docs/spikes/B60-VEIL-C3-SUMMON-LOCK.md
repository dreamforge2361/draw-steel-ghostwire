# Spike B60 — Veil §C3 Summon Entities lock

**Status:** LOCKED 2026-09-18, module **0.1.95**  
**Accepts:** Michael's recommended §C3 package (FINAL)  
**Related:** `B53-SUMMON-SCALING-SPIRITS-ELEMENTALS.md`, `docs/raw/22-the-veil.md` §C3, `scripts/veil-summons.mjs`

## Locked numbers (code already matched — formulas unchanged)

### Elemental Stamina
`ELEMENTAL_BASE` + **Logic × Level**. Companions = Rank 1.

| Rank | Base |
|---|---|
| 1 | 15 |
| 2 | 25 |
| 3 | 35 |
| 4 | 50 |
| 5 | 65 |

### Spirit Stamina
`SPIRIT_BASE` + **Persona × Level**.

| Form | Base |
|---|---|
| Extension | 20 (convenience pool; Director may treat untargetable) |
| Independent | 30 |

### Bind count
`BIND_CAP = 2` non-companion bound elementals; new bind **releases oldest**.

### Already final in RAW (not provisional)
Persistent costs / bind unlocks / companion + Rank 1 + spirit strike bands (`4 / 7 / 10 + Persona` for spirits; light-band for Rank 1 elementals).

## Deferred (explicitly out of this lock)
- Rank 2+ / Greater / R5 **strike ladders**
- **Defense stamps** on Veil Actors

## As-shipped in 0.1.95
1. `scripts/veil-summons.mjs` — comments/constants assert lock; **no formula edits**.
2. RAW + masters + B53 promoted from provisional → final / locked.
3. `src/packs/summons/elementals/` baked bases aligned: R2 30→25, R3 45→35, Greater 60→50 (base-only honesty; live stamp still applies Logic×Level).
4. Spirits remain at extension base 20 in templates (shared Actor; stamp chooses 20 or 30 + Persona×Level).
5. Packs rebuilt; `module.json` **0.1.95**.

## Out of scope (unchanged)
- Automate Persistent drain or Command edge
- Sprite packs / B52
- Invent Rank 2+ strike damage
