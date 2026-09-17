# Spike B46 — The Wired — The Flats Matrix Gazetteer Journals

**Repo:** draw-steel-ghostwire  
**Depends on:** stub `docs/directors/wired-flats-gazetteer.md`; markdown SoR `docs/setting/wired-flats-gazetteer.md` (extracted from Dropbox Word).  
**Do NOT commit** until Michael Foundry-verifies.  
Bump **one** module patch; rebuild packs with Foundry closed.

## Goal
Ship a Foundry **Journal** compendium for the Flats matrix gazetteer so crews can open district master nodes, corp fortresses, POI swarm, and GM notes in-world — lore setting material, **not** RAW.

## Source of truth
1. `docs/setting/wired-flats-gazetteer.md` (already on disk; ~19k chars from the Word SoR).  
2. Local Word (do not re-upload):  
   `C:\Users\mfran\Dropbox\ai-brain\projects\draw steel\GHOSTWIRE — The Wired  The Flats (Matrix Gazetteer).docx`  
   (em-dash after GHOSTWIRE; two spaces before “The Flats”).

If the md is missing, re-extract from that docx before building.

## Pack
- `name`: `wired-flats` (or `setting-wired-flats` if clearer)
- `label`: `GHOSTWIRE.COMPENDIUM.wiredFlats` → “Ghostwire — The Wired: Flats”
- `type`: `JournalEntry`
- `path`: `packs/wired-flats`
- `system`: `draw-steel`
- Ownership: `PLAYER: OBSERVER`, `ASSISTANT: OWNER` (same as Rulebook)

Register in `module.json`. Source under `src/packs/wired-flats/`. Rebuild with `node tools/build-packs.mjs`.

## Structure (LOCKED)
Prefer **one Journal Entry with pages** (or a small set of Journals + folders), matching gazetteer sections:

| Page / Journal | Content |
|---|---|
| How to Read | E1–E4 ICE posture table + vertical rule (Flats vs Grid Barrier) |
| I. Grid & Barrier | The Grid; Black ICE Barrier / uplink |
| II. District Master Nodes | Switchboard, Stacks, Neon Shambles, Glasshook, Slackwater, Interchange, Wireside, Cinder Market, … + Cinderhold / Undernet |
| III. Corporate Fortress-Nodes | Corp fortress entries |
| IV. POI Swarm | Street-level nodes |
| V. Running the Matrix-scape | GM notes |

Use compendium folders if splitting into multiple Journal Entries (e.g. one Journal per major section). Match B42b page-split style if one mega-journal gets unwieldy — either is fine if navigable.

## Content rules
1. Keep **fiction**, node names, owners, vibes, plot hooks, E1–E4 security posture.
2. Light scrub only: strip leftover **old rules** numbers / “tier” hero language if any. Echelon here = **ICE intrusion grade / Node Rating**, not hero progression — say so once in How to Read.
3. Do **not** invent new nodes or rewrite Wire RAW (`docs/raw/21-the-wire.md`).
4. Cross-link in short Director notes where names match: Mama Cassavir, Warden Krael, Ferryman, bestiary, Run Generator strata, Wired Console templates — plain text pointers, not broken `@UUID` unless easy.
5. No art/map binary import this spike (map Scene / image journals = later with B45).
6. 16-char alphanumeric `_id`s; lang keys for pack label + journal names.

## Implementation notes
- Optional: `tools/wired-flats-to-journals.mjs` that reads `docs/setting/wired-flats-gazetteer.md` and writes `src/packs/wired-flats/**` (mirrors `raw-to-journals.mjs`) so the md stays SoR.
- Convert md → Foundry journal HTML the same way as B42b.
- Update stub status + STATUS + FOUNDRY-BUILD-PLAN.

## Out of scope
Node Actors for every POI; B41 minimap; Scene map import; B45 Handbook; dumping into `docs/raw/`; commit/push.

## Done when
- Compendium visible; How to Read + District Masters + one POI page spot-check clean.
- E1–E4 framed as ICE/Node Rating; no hero-tier ladder.
- Pack rebuilds; module patch bumped; checklist printed; **no commit**.

## Michael checklist
1. Compendium **Ghostwire — The Wired: Flats** (or chosen label) appears; players Observer.
2. How to Read shows E1–E4 + vertical rule.
3. Switchboard / Cassavir (or another master node) readable.
4. One corp fortress + one POI swarm entry present.
5. GM notes page present.
6. Not inside the Rulebook pack; RAW unchanged.