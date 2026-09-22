# B122 — Director-only lore filter for VOIDMARK (S6)

**Locked 2026-09-22 (Michael):** Directors must be able to mark a Foundry Journal (or Journal Page) so VOIDMARK **never** shares that text when a **player** asks. Ship as module **0.3.97**.

## Problem
VOIDMARK's RAG index currently includes Director campaign aids (e.g. Quiet Floor outline / pacing under `docs/directors/campaigns/`). Players with Voidmark access (or GM in Runner mode) can retrieve those chunks. World journals have no Ghostwire mark, so Directors have no table-side control.

## Locked UX — how a Director marks a journal

### In Foundry (primary)
1. Open **Journal Entries** sidebar (or open the journal).
2. **Right-click** the Journal Entry **or** a single Journal Page.
3. Choose **VOIDMARK: Mark Director-only**.
   - Entry-level mark covers every page unless a page overrides.
   - Page-level mark can lock one page inside an otherwise player-safe journal.
4. To reverse: **VOIDMARK: Allow for players** (clears the Director-only mark).
5. Visual cue: Director-only journals/pages show a small shield/lock badge or name suffix in the sidebar list (keep it light).

Flag shape (LOCKED):
```
flags.draw-steel-ghostwire.voidmarkAudience = "director" | "player"
```
- Missing flag = inherit: use Foundry ownership — if **no non-GM** has at least LIMITED/OBSERVER, treat as `"director"` for player asks; otherwise `"player"`.
- Explicit `"director"` always hidden from player asks.
- Explicit `"player"` allowed for player asks **only if** Foundry ownership also lets that player observe (never bypass Foundry perms).

### Also filtered (no manual mark required)
Static knowledge index chunks built from:
- `docs/directors/**`
- `docs/manuscript/03-directors/**`
…are tagged `audience: "director"` at build time and excluded from player/Runner retrieve.

Player-safe sources stay `audience: "player"`: `docs/raw/**` (indexed set), `docs/manuscript/01-lore/**`, Reach Handbook, gazetteer, glossary, etc.

## Retrieve rules (LOCKED)
When assembling RAG hits for an ask:
| Asker / mode | Gets `audience: "director"` chunks? | Gets world journals marked Director-only? |
|---|---|---|
| Player (any mode) | **No** | **No** |
| GM, **Runner** mode | **No** | **No** |
| GM, **Director** mode | **Yes** | **Yes** (plus all they own) |

GM in Runner mode stays street-safe so the Director can demo what players hear.

World-journal RAG: include visible Journal Page text in retrieve for the ask (top-k merge with static index), applying the same audience filter. Do not send Director-only page HTML to the model for player/Runner asks.

## Deliverables
- Spike (this file) stays the lock.
- Code: audience on index chunks; filter in `retrieve` / ask path; journal+page context menus; optional badge.
- Rebuild `data/voidmark-rules-index.json`.
- How-to for Directors: `docs/directors/voidmark-director-only-howto.md` (short, step-by-step, screenshots optional).
- Smoke: `tools/voidmark-smoke.mjs` (or new `tools/voidmark-audience-smoke.mjs`) asserts Quiet Floor director chunks excluded for player filter; Switchboard/Flats still hit for player filter; flag helpers pure-tested.
- Foundry checklist: `docs/directors/voidmark-director-only-smoke-0397.md`.
- Version **0.3.97**; update master backlog S6 DONE.

## Out of scope
- Rewriting VOIDMARK persona fiction (B90).
- Canvas token (B89).
- Changing API key / player-access relay (already GM-handled).
