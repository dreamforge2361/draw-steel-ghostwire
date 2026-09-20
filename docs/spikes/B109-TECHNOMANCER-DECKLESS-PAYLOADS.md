# Spike B109 — Technomancer deckless payloads (Whiteout parity)

**Date:** 2026-09-20  
**Module:** **0.3.45**  
**Status:** **SHIPPED** (pending Michael Foundry-verify)  
**Pairs with:** B105 (`docs/spikes/B105-WHITEOUT-PAYLOAD.md`), B51 / B51b / B51c

## Design lock

Technomancers compile one-shot Wire payloads **without a cyberdeck**. Resonance / **Wired Native** / body-as-interface is the host. **Do not** auto-grant Whiteout to every Technomancer — compile path + **Sabbat Vane** pregen only.

| Field | Value |
|---|---|
| Host families | `deck` (Hackers) **and** `resonance` / `body` (Technomancer) |
| Host item | **Wired Native** class feature (`wired-native`) — `matrix.modSlots: 2`, `modFamily: ["resonance","body"]` |
| Fallback | `mod.installedOn` = `"self"` or the actor id still counts as loaded if Wired Native is present |
| Run | Same B51c Connected gate (Overlay or Jacked In) |
| Sabbat | Whiteout magazine **quantity 2**, compiled on Wired Native (`bo3o1nPpbkYDocLz`), not a deck |

## As built

| Layer | Change |
|---|---|
| SKU | `src/packs/matrix/payloads/whiteout.json` hosts include `deck`, `resonance`, `body`. Other payload SKUs get the same host families so any magazine can compile onto Wired Native. |
| Class | `src/packs/classes/technomancer/wired-native.json` is a 2-slot resonance/body host |
| payload-use | Host picker includes Wired Native; stamps catalog on existing heroes at sync/load; `isLoaded` treats body compile as loaded |
| Pregen | Sabbat Whiteout ×2 compiled on Wired Native. Kessic stays on Street Deck. |
| RAW | `docs/raw/21-the-wire.md` Technomancer compile note |
| B105 | addendum below / in that spike |
| Packs | `node tools/build-packs.mjs matrix pregens classes` |

## Out of scope

Granting Whiteout to all Technomancers; auto Trace on Run; changing Craft fires 1 / 3 / 5; player Wire pings (B106).

## Foundry notes (Director)

1. Drag **Whiteout** onto a Technomancer → loose chip.
2. **Load magazine (Craft)…** → host is **Wired Native** (no deck needed) → Reason roll (steep/hard bane) → fires 1 / 3 / 5 and **Run Whiteout**.
3. Drag **Sabbat Vane** from Pregens → Whiteout quantity 2 compiled on Wired Native; after sync, **Run Whiteout** while Connected.
4. Other Technomancers do **not** start with Whiteout.
