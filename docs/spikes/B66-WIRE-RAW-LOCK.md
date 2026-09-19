# Spike B66 — Wire chapter RAW-lock

**Status:** **Done 2026-09-18** — `docs/raw/21-the-wire.md` **RAW-locked**  
**Bump:** module **0.2.4**  
**Journals:** **not** regenerated (manuscript hold)

## Goal

Polish The Wire toward manuscript RAW-lock: scrub orphan biofeedback multiplier, lock Trace Alert middle defaults, align with shipped Foundry, mark chapter locked. No new Matrix subsystems; no Lifestyle expand; no full rewrite.

## As built

### `docs/raw/21-the-wire.md`
- Header → `**RAW status:** locked (2026-09-18, B66)`
- **Orphan scrub:** removed ×1 “wired-direct” biofeedback multiplier (no such connection state). Only **Overlay ×0.5** (round down, min 1) and **Jacked In ×1.5** (round up). Overlay table no longer says “wireless/wired-direct exposure.”
- **Trace Alert defaults locked:**

  | Result | Default Alert |
  |---|---|
  | Low ≤11 | +1 |
  | Middle 12–16 | **no raise** (ability text may override) |
  | High 17+ | never |

  No separate “noisy Track 2” Alert tax beyond the roll bands.
- **Connected** defined (Overlay or Jacked In); payload **Run** requires Connected (matches B51c).
- Anyone-vs-Hacker gap spelled out (Matrix Verbs / suites-payloads vs Bandwidth Programs).
- Node Rating **1–5** System Stat Card, suites vs payloads, Integrity ≠ Body Integrity — unchanged numbers, light prose polish.
- Director tools note stays rules-only (no Foundry UI manual).

### Status / TOC / plans
- `docs/rulebook/STATUS.md` — Stage 4 Wire → RAW-locked B66
- `docs/rulebook/FOUNDRY-BUILD-PLAN.md` — Stage 4 Wire row + backlog checklist flipped
- `docs/rulebook/TOC-PROPOSAL.md` — inventory + blocker B marked done
- `docs/spikes/B42-RAW-REVIEW-FLAGS.md` — §21 flags resolved
- `docs/raw/00-INDEX.md` — Wire row + status note
- `docs/manuscript/TOC.md` + `README.md` — Wire RAW-locked notes

## Checklist

- [x] Orphan ×1 wired-direct scrubbed from Biofeedback Value + Overlay wording
- [x] Trace Alert middle = no Alert by default (explicit table)
- [x] Chapter header RAW-locked
- [x] Foundry align: Overlay/Jacked In, Connected gate, Rating 1–5, suites vs payloads
- [x] Ghostwire-original prose polish (no DS Heroes paste; no new subsystems)
- [x] STATUS / FOUNDRY-BUILD-PLAN / TOC-PROPOSAL / manuscript notes
- [x] module.json **0.2.4**
- [x] **No** journal regen
- [ ] Next assemble-manuscript run will pick up locked Wire (optional follow-on)

## Out of scope
Lifestyle; Veil/Machines lock; journal regen; inventing Matrix subsystems; rewriting Hacker/Technomancer class chapters.
