# AEQ patrol + LAZ extract NPCs

**Module:** 0.3.78  
**Pack:** Ghostwire Bestiary → **Corp & Security** → **Aequitas Mandate** / **Lazarus Extract**  
**RAW:** `docs/raw/25-opposition.md`  
**Tickers:** `docs/rulebook/MEGACORP-TICKERS.md` (seated Twelve + these bestiary faction filters)

Aequitas Mandate (**AEQ**) and Lazarus Extract (**LAZ**) are seated on the **Twelve Conglomerates** (chairs 11 and 12); their tickers also act as **Director opposition filters** on these Actors. Full profiles live in Ghostwire Lore → **Twelve Conglomerates**.

## Actors

| Slug | Name | Faction | Spine (math) | Band |
|---|---|---|---|---|
| `aeq-trooper` | Mandate Trooper | `aeq` | Corp Security Officer (Human Guard) | L1 minion brute, Sta 5, EV 3 |
| `aeq-sergeant` | Mandate Sergeant | `aeq` | Ironclad Subcommander | L2 horde support, Sta 20, EV 4 |
| `laz-medic` | Extract Medic | `laz` | Street Doc | L1 platoon support, Sta 30, EV 6 |
| `laz-chief-medic` | Extract Chief Medic | `laz` | Rival Commander envelope + Street Doc med kit | L2 elite support, Sta 60, EV 16 |

Same Michael plate on both ranks of each corp (`assets/tokens/bestiary/aeq/aequitas-mandate-officer.webp`, `…/laz/lazarus-combat-medic.webp`). Officer reads helmeted male-presenting; medic reads female. Do not regen.

## Kit

- **AEQ:** stunstick + sidearm, zip-cuffs, Mandate HUD / radio chrome, **Wire Kit**.
- **Sergeant:** Duty Sidearm (4/5/7 + ally free strike), Hold the Line (+3 stability aura), better Stamina than the Trooper.
- **LAZ:** trauma bag, Stabilize, Trauma Patch (heal 15), Stimulant Dart, light stun sidearm, Medical HUD, **Wire Kit**.
- **Chief Medic:** same med numbers + Extract Lead, Lazarus Trauma Package, Sta 60.

All four start **Disconnected**. Connect from the Wired node applet (Wire Kit is the interface). Token **Has Vision** on.

## Smoke (Director)

1. Reload the world after the module update so the Bestiary LevelDB is picked up.
2. Open **Ghostwire Bestiary** → Corp & Security → Aequitas Mandate / Lazarus Extract.
3. Drag each of the four onto a **non–Gold Line** scratch Scene. Sheet portrait = token art. Has Vision on.
4. Open a Wired node → **Connect** on each Actor (should enable; lands **Linked**). Jack Out → Disconnected.
5. Trooper: Stunstick & Sidearm, Zip-Cuffs. Sergeant: Duty Sidearm + Hold the Line.
6. Medic / Chief: Stabilize, Trauma Patch, Stimulant Dart, Stun Sidearm. Chief also shows Extract Lead + Lazarus Trauma Package.

No Gold Line `{ force: true }`. No PDF.
