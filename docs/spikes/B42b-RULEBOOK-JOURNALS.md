# Spike B42b — Foundry Journal rulebook pack from `docs/raw/`

**Repo:** draw-steel-ghostwire  
**Depends on:** B42 RAW on main (`49c8c48`) — `docs/raw/` is draft SoR (see `docs/spikes/B42-RAW-REVIEW-FLAGS.md`; do **not** block Journal on flag resolution).  
**Do NOT commit or push.** Leave ready for Michael Foundry-verify.  
**Bump** module.json one patch from current (read disk).

## Goal
Ship a Foundry **Journal** compendium **Ghostwire Rulebook** whose contents mirror `docs/raw/` page-for-page (no lore, no art) so the table can open RAW rules in-world.

## Pack
- `name`: `rulebook`
- `label`: `GHOSTWIRE.COMPENDIUM.rulebook` → “Ghostwire Rulebook”
- `type`: `JournalEntry`
- `path`: `packs/rulebook`
- `system`: `draw-steel`
- Ownership: `PLAYER: OBSERVER`, `ASSISTANT: OWNER` (players can read; only GM edits)

Register in `module.json`. Source JSON under `src/packs/rulebook/`. Rebuild with `node tools/build-packs.mjs` (Foundry closed).

## Structure (LOCKED)
**One Journal Entry per RAW chapter file** (not one mega-journal), so Directors can drag a single chapter into a folder or pin it.

Folders (compendium folders via `_folder.json`):
1. **Front Matter** — `00-INDEX` (optional short “how to use”), `00-front-matter`
2. **Shared Core** — `01` … `04`, `24`
3. **Hero Building** — `05` … `11`
4. **Classes** — `12` … `20`
5. **Ghostwire Systems** — `21` … `23`, `25`

Map file → Journal:
| RAW file | Journal name (lang key) |
|---|---|
| `00-front-matter.md` | Front Matter |
| `01-how-to-play.md` | How to Play |
| … | Title from H1 of the md |
| `21-the-wire.md` | The Wire |
| `25-opposition.md` | Opposition |

Skip shipping `00-INDEX.md` as a Journal **or** ship a one-page “Rulebook Index” that lists chapters (no duplicate of full index doctrine). Prefer a short Index journal in Front Matter.

## Content rules
1. Body = markdown from `docs/raw/<file>` converted to Foundry journal page HTML (or markdown page type if DS/Foundry 14 supports it — use whatever the stock draw-steel / Foundry 14 journal pages use in this stack).
2. Strip RAW status/Sources headers from the **player-visible** page body **or** keep a collapsed Director note — prefer **keep Sources line** at top in italics for draft transparency.
3. Do **not** pull ART-STYLE, lore books, or `docs/rulebook/18-wired-foundry.md` UI manuals.
4. 16-char alphanumeric `_id`s; folder field matches `_folder.json`.
5. Lang keys for journal **names** under `GHOSTWIRE.Rulebook.Journals.*` (and folder labels).

## Implementation notes
- Prefer a small build script `tools/raw-to-journals.mjs` that reads `docs/raw/*.md` and writes `src/packs/rulebook/**/*.json`, then run `build-packs.mjs` — so RAW stays single source of truth.
- If pages use `text.content` HTML, convert md → HTML safely (headings, tables, code). Tables from RAW must remain readable.
- Module `esmodules` unchanged unless a tiny “open rulebook” menu is trivial; **out of scope** unless free: scene control button.

## Out of scope
Resolving `B42-RAW-REVIEW-FLAGS.md`; PDF; lore journals; B40/B41; editing RAW numbers.

## Docs
STATUS + FOUNDRY-BUILD-PLAN: B42b pending Foundry-verify. Point Journal pack at `docs/raw/`.

## Done when
- Compendium **Ghostwire Rulebook** shows folders + one Journal per chapter.
- Spot-check How to Play, Power Rolls, Operator, The Wire — content matches RAW, no lore/art chapters.
- Pack rebuilds clean; checklist printed; **no commit**.

## Foundry test checklist (print when finished)
1. Compendium Ghostwire Rulebook visible; players can open/observe.
2. Folders match structure above; chapter count matches `docs/raw/` (minus optional index policy).
3. Open How to Play + Tests and Power Rolls — remap tables readable.
4. Open Operator — ability/cost tables intact.
5. Open The Wire — Matrix rules present; not a Foundry Console manual.
6. No ART-STYLE / lore gazetteer journals in the pack.