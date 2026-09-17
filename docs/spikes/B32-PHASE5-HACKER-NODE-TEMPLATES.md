# Spike B32 Phase 5 — Hacker Node / ICE Director templates (10)

**Repo:** draw-steel-ghostwire  
**Do NOT commit or push.** Leave ready for Michael to Foundry-verify.  
**Bump** module.json one patch from current (read disk; Phase 4 was 0.1.43, B20c 0.1.44 — use next).

## Context (already on main)
- Phases 1–4 support entities done; B20c mod install done (`d3ea304`).
- Wired Console (B23b): `scripts/wired-console.mjs` + `scripts/wired-node-table.mjs`.
- Board: `flags.draw-steel-ghostwire.wiredBoard = { nodes, stratum, updated }`.
- System Stat Card already in console (`RATING` 1–5): Integrity, breach DC, biofeedback, ICE sketch.
- Random node roller already exists (flavor). Phase 5 is **Director preset templates**, not reinventing the Console.
- Phase 0 lock: Hacker v1 = Journal + Wired Console data; placable Actor tokens optional/deferred under `summons/nodes`.
- SoR: `docs/masters/GHOSTWIRE_SUPPORT_ENTITIES.md` §3.5; `docs/rulebook/08-hacker.md` Node Rating card.

## Goal — 10 Director templates

| ID | Track | Rating | Integrity | Biofeedback | ICE sketch (from console RATING) |
|---|---|---|---|---|---|
| node-t1-r1 … node-t1-r5 | Track 1 (breach-only, no Integrity bar) | 1–5 | n/a (or hide) | per RATING | per RATING |
| node-t2-r1 … node-t2-r5 | Track 2 (Integrity + ICE) | 1–5 | 12 / 18 / 26 / 36 / 50 | 3 / 5 / 8 / 13 / 22 | 1p → full suite + counter-trace |

Use the **same numbers** as `RATING` in `wired-console.mjs` (single source of truth — export RATING from one module and import in both console and templates if duplicated today).

## Deliverables

### A) Template data (required)
Ship a clear template table in code, e.g. `scripts/wired-node-templates.mjs` exporting `NODE_TEMPLATES` (10 entries) with:
`id, name, track, rating, integrityMax (null for Track 1), biofeedback, ice, description, notes`

Names: e.g. "Track 1 Node · Rating 3", "Track 2 Node · Rating 5" (Director can rename after add).

### B) Wired Console: "Add from template" (required)
On the Console node list (GM): button or menu **Add template…** → pick one of the 10 → pushes a normalized node onto `wiredBoard.nodes` (same shape as `#onAddNode` / `normalizeBoard`). Pre-fill integrity, track, rating, description/notes from template.

Do not break existing Add Node / Random Node.

### C) Journal pack OR Journal pages (required for Director reference)
Either:
- New Journal pages in a Ghostwire journals pack if one exists, OR
- Markdown under `docs/directors/wired-node-templates.md` plus a Foundry Journal pack if the module already has journals — **inspect repo**; if no journal pack yet, ship the markdown Director reference and Console templates only (do not invent a whole journals pipeline). Prefer Console + docs if journals pack is absent.

### D) Optional Actor scaffolds (nice, not blocking)
Under `src/packs/summons/nodes/`: 2–10 minimal npc Actors flagged `kind: "node"`, `track`, `rating` for future token placement. Mark deferred in README. Skip if timebox — Console templates are the Phase 5 success criteria.

### E) Docs
- FOUNDRY-BUILD-PLAN + STATUS: Phase 5 **pending Foundry verification**
- Brief note in SUPPORT_ENTITIES §3.5 that templates ship via Console + RATING table

## Out of scope
- B23c vision tints (next after this verifies)
- Placable node tokens on meatspace Scene (unless optional D)
- Rewriting random node tables
- Commit / push

## Done when
1. Console GM can Add template → each of 10 appears with correct track/rating/Integrity/ICE text.
2. Track 1 nodes have no Integrity combat (or Integrity hidden / N/A); Track 2 show Integrity max from table.
3. Existing Random Node / Add Node still work.
4. Version bumped; docs pending verify; **no git commit**.

## Foundry test checklist (print when finished)
1. Open Wired Console on a Scene as GM.
2. Add template Track 2 Rating 1 → Integrity 12, biofeedback 3, ICE "1 passive…".
3. Add template Track 1 Rating 3 → Track 1, no Integrity bar (or N/A).
4. Add template Track 2 Rating 5 → Integrity 50, full ICE suite text.
5. Random Node still rolls.
6. Reload world — board nodes persist on Scene flags.
