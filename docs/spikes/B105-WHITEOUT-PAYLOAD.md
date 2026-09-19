# Spike B105 — Whiteout payload

**Date:** 2026-09-19  
**Module:** **0.3.34**  
**Status:** **LOCKED 2026-09-19 — shipped.** Kind = payload magazine (not a Bandwidth Program, not a suite). Pending Michael Foundry-verify (Kessic sheet + Wired Console Trace).  
**Pairs with:** B51 / B51b / B51c (`docs/spikes/B51-PROGRAM-PAYLOAD-EXECUTE.md`), gear master §4C, `docs/raw/21-the-wire.md`

## Lock (do not redesign)

| Field | Value |
|---|---|
| Kind | Payload (consumable magazine) |
| Name | Whiteout · Trace-Scrub · alert-wash packet |
| Echelon | **1** (do not remap through T3→E2) |
| Availability | Restricted |
| Cost | ¥3,500 per chip |
| Craft | §Craft Project, skill **Hacking**, **steep / hard** |
| Tags | Program, Consumable, Wired |
| Run | Must be **Connected** (Overlay or Jacked In); spends 1 fire; Power Roll **Logic / Reason** |
| Target | Host whose Trace Alert you scrub (within Reach) |

**Results**

| Band | Effect |
|---|---|
| Low (≤11) | Fire spent; Trace **unchanged** (overrides default low +1) |
| Middle (12–16) | Trace −1 (min 0) |
| High (17+) | Trace −1 **and** cancel the next Trace increase before the end of your next turn (once) |

Global Trace rules still apply (per-round caps, 1–12 ladder, lockout reset to 6). Foundry v1 does **not** write the Wired Console track — the Director clicks Trace down / notes a Whiteout hold.

**Pregen:** Kessic Draye starts with a Whiteout magazine **2 fires**, compiled on Switchblade / Street Deck (`installedOn` the Street Deck item; uses 1 of 2 mod slots). Crash stays a loose chip (B51 pattern). Technomancer does **not** get Whiteout (no deck).

2 fires is a playtest starting load, not a Craft-tier result (those stay 1 / 3 / 5).

## As built

| Layer | Change |
|---|---|
| Gear master §4C | Row + lock footnote († E1 Restricted; steep/hard Craft; Run bands) |
| RAW | `21-the-wire.md` examples + Whiteout Trace override; `10-mods.md` / `14-mods.md` Craft pointer |
| Doctrine | Payload list includes Whiteout |
| Foundry SKU | `src/packs/matrix/payloads/whiteout.json` — Crash/Zap schema; `matrix.role: payload`; `mod.magazine`; `craftDifficulty: "hard"` |
| Lang | `GHOSTWIRE.Matrix.Items.Whiteout.*` + `GHOSTWIRE.PayloadUse.Payloads.Whiteout.*` |
| B51 | `scripts/data/payload-use-templates.json` `whiteout` entry; Craft stand-in applies **1 bane** when `craftDifficulty === "hard"` |
| Pregen | `src/packs/pregens/kessic-draye.json` — quantity 2, `mod.installedOn` = Street Deck `6XVXN8DuHNp3HkDH`, `active: true`. Run Whiteout spawns on import/`ready` (B51 sync). |
| Deadhead | `docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md` — Kessic brings Whiteout×2 |
| Packs | `node tools/build-packs.mjs matrix pregens` |

## Foundry notes (Director)

1. Drag **Whiteout** from Ghostwire Matrix → Intrusion & Attack Payloads onto a decked hero → loose chip, no Run.
2. **Load magazine (Craft)…** → Reason roll with Hacking edge **and a bane** (steep/hard). Tier → 1 / 3 / 5 fires; **Run Whiteout** appears.
3. Disconnected → Run refuses (B51c); magazine stays loaded.
4. Run card: low = Trace unchanged; middle = −1; high = −1 + one-shot hold. **Click Wired Console Trace** to match. No automation in v1.
5. Drag **Kessic Draye** from Pregens → Street Deck slot 1/2 used; Whiteout quantity 2; **Run Whiteout** after sync. Crash is still loose.
6. **Sabbat** (Technomancer) has no Whiteout and no deck.

## Out of scope

Auto-writing Wired Console Trace; cancel-next-increase AE; Technomancer default grant; journal regen of the whole rulebook pack (RAW markdown is the pointer; next B98-style regen picks it up).
