# VOIDMARK: keep a journal off the players' channel

**Module 0.3.97 (S6 / B122).** You mark the journal; VOIDMARK stops sharing it.

---

## 1. Mark a journal or page Director-only

**A whole journal**

1. Open the **Journal Entries** sidebar tab.
2. **Right-click** the journal.
3. Click **VOIDMARK: Mark Director-only**.

**One page inside a journal**

1. Open the journal.
2. **Right-click** the page in the left-hand table of contents.
3. Click **VOIDMARK: Mark Director-only**.

A small shield icon appears next to anything you marked. Only GMs see the icon.

**Entry marks cover every page** in that journal. A page mark beats the entry mark — so you can mark one journal Director-only and then set a single page back to **VOIDMARK: Allow for players**, or the reverse.

---

## 2. What players will and won't hear

**Won't hear** — a player asking VOIDMARK gets nothing from:

- Any journal or page you marked **Director-only**.
- Any journal or page they cannot already open in Foundry (ownership is checked too — VOIDMARK never reads them something they are not allowed to see).
- Unmarked journals that no player can see at all. No mark needed: if it's GM-only in Foundry, it's Director-only to VOIDMARK.
- Director campaign aids shipped with the module (Quiet Floor outline and pacing, Running Ossian Reach, everything under `docs/directors/`).

**Will hear** — everything else they can already open: RAW chapters, the Reach Handbook, Flats gazetteer and glossary, lore chips, and any world journal you left player-visible.

---

## 3. Runner vs Director mode (GM reminder)

The mode buttons at the top of the VOIDMARK window change what **you** hear:

| You are | Mode | VOIDMARK uses |
|---|---|---|
| GM | **Director** | Everything — Director-only journals and shipped Director aids included |
| GM | **Runner** | Player-safe material only |
| Player | either | Player-safe material only |

Flip yourself to **Runner** to hear exactly what the table hears. A player switching their own window to Director mode changes nothing — their asks are forced to the player channel, relay included.

---

## 4. Unmark

Right-click the same journal or page again:

- **VOIDMARK: Allow for players** — VOIDMARK may share it with players who can already see it in Foundry.
- **VOIDMARK: Clear mark (use ownership)** — removes your mark entirely and goes back to judging by Foundry ownership.

---

**Lock:** `docs/spikes/B122-DIRECTOR-ONLY-LORE-VOIDMARK.md`
**Foundry checklist:** `docs/directors/voidmark-director-only-smoke-0397.md`
**Flag:** `flags.draw-steel-ghostwire.voidmarkAudience` = `director` | `player`
