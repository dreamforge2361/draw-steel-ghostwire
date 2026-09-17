# Spike B44 — Pregen Heroes from Dossiers & Fiction

**Repo:** draw-steel-ghostwire  
**Depends on:** stub `docs/directors/pregens-dossiers.md`; current class / ancestry / kit packs on main (0.1.61+).  
**Do NOT commit** until Michael Foundry-verifies.  
Bump **one** module patch; rebuild packs with Foundry closed.

## Goal
1. **Preserve** dossier portraits and the eight origin short stories.  
2. Build eight Foundry **Hero** Actors at **Level 1 / Echelon 1** on the **current** Ghostwire stack (discard old “Tier 5” sheet math).  
3. Ship stories as a **Pregens** Journal pack (art inline where practical).

## Sources
| File | Role |
|---|---|
| `docs/masters/pregens/GHOSTWIRE-Dossiers-Fiction.pdf` | SoR PDF (~13 MB; already on disk) |
| `docs/masters/pregens/dossiers-extract.txt` | Plain-text extract for search |
| Stub roster | `docs/directors/pregens-dossiers.md` |

Optional: extract portraits with `pypdf` / `pymupdf` / `pdfimages` into `assets/pregens/`. Prefer committing art + extract notes; **leave the PDF untracked** unless Michael asks to commit it (large binary).

## Roster (LOCKED — 8)
| Street name | Class / subclass | Ancestry | Story |
|---|---|---|---|
| Vessa Corran-Dov, “the Preacher of Ninth” | Street Priest (Shepherd) | Corran | The Lamp on Ninth |
| Kaës Vahn-Estal, “the Static Saint” | Elementalist (Stormcaller) | Elvani | Rain on the Glass Tier |
| KRV-9 “Krow” | Operator (Warframe / street-vet) | Cyborg | Serial Number |
| Barak Voss-Hallor, “the Foreman” | Commander (Street-Fixer) | Goliar | The Weight of the Word |
| Wren Sable-Corvin, “the Kite” | Scout (Hunter) | Changer — Raven lineage | The Long Sight |
| Sabbat Vane, “the Dead Frequency” | Technomancer (Sprite-Weaver) | Revenant | The Dead Frequency |
| Vira Kellis-Nade, “the Warren-Wire” | Wrench (Drone / swarm) | Changer — Rat lineage | Nine Ways Out |
| Kessic Draye, “Null” | Hacker (Disruptor) | Mutant | Turn Their Own Guns Around |

No Medic pregen — do not invent one.

## Build rules
- **Level 1** only. Old Tier 5 = street-band fiction flavor, not mechanical tier.
- Characteristics: Physique / Reflex / Logic / Instinct / Persona — take dossier numbers when present; otherwise assign from class primary/secondary doctrine and note assumptions in `docs/masters/pregens/BUILD-NOTES.md`.
- Ancestries = current Ghostwire Peoples packages (Corran, Elvani, Cyborg, Goliar, Changer with lineage, Revenant, Mutant). Changer: lock **Raven** (Wren) / **Rat** (Vira) per Changer B6c.
- Classes = existing Ghostwire class Items + subclass features already in `src/packs/classes/`.
- Kits from Ghostwire Kits pack; street-band gear; chrome within **BI 20** and Pass A grades.
- Biography = dossier blurb (short); full origin story goes in Journals, not pasted into the sheet.
- Portrait = extracted art when available; placeholder token OK if art extract fails for one character (flag it).

## Packs
1. **Actors** — `name`: `pregens`, `type`: `Actor`, label e.g. “Ghostwire Pregens”, `PLAYER: OBSERVER` (or LIMITED if preferred — default OBSERVER like other content packs). Path `packs/pregens`. Source `src/packs/pregens/`.
2. **Journals** — either folder inside `pregens` if mixed packs unsupported, **or** separate `pregen-fiction` JournalEntry pack (prefer separate, mirror B46): eight story pages + optional index. Ownership Observer.

Register both in `module.json`. Rebuild with `node tools/build-packs.mjs`.

## Extract / notes
Write `docs/masters/pregens/ROSTER.md` (final stats summary per hero) and `BUILD-NOTES.md` (assumptions, missing dossier numbers, art failures). Story prose can live as md under `docs/masters/pregens/stories/` if that helps the journal generator.

## Out of scope
Medic invent; rewriting RAW; B45 Handbook; full anthology beyond the eight paired stories; advancing heroes past L1; inventing subclasses that do not exist in the packs.

## Done when
- Eight Hero Actors open in Foundry; sheets show correct class/ancestry/kit; abilities usable.
- Eight origin stories readable in the Pregens journal pack.
- Portraits present or flagged; BI/chrome legal; module patch bumped; checklist printed; **no commit**.

## Michael checklist
1. Compendium Ghostwire Pregens shows 8 Heroes.
2. Spot Vessa (Street Priest / Corran / Shepherd) and Krow (Operator / Cyborg).
3. Spot Wren Raven Changer + Vira Rat Changer lineages.
4. Drag two onto a Scene; sheets open; one ability usable each.
5. Journal pack shows eight stories (Lamp on Ninth, etc.).
6. No Tier-5 mechanical leftovers; Level 1 / Echelon 1 only.