# VOIDMARK Director-only lore filter — Foundry checklist (0.3.97 / S6, B122)

Node smoke first, in the module folder with Foundry **closed**:

```
node tools/build-voidmark-index.mjs
node tools/voidmark-audience-smoke.mjs
node tools/voidmark-smoke.mjs
```

Both smokes must print `passed`. Then open the world and walk the list below.

Code: `scripts/voidmark-audience.mjs` (pure helpers), `scripts/voidmark-journal.mjs` (mark UI + world-journal RAG), `scripts/voidmark-rag.mjs` (audience filter), `scripts/voidmark.mjs` (ask path). Registered from `scripts/module.mjs`.
Director how-to: `docs/directors/voidmark-director-only-howto.md`.
Lock: `docs/spikes/B122-DIRECTOR-ONLY-LORE-VOIDMARK.md`.

---

## The rules this filter holds to

- **Flag:** `flags.draw-steel-ghostwire.voidmarkAudience` = `"director"` | `"player"`.
- **Page beats entry.** Entry mark covers all pages; a page mark overrides it either way.
- **No mark = ownership decides.** Nothing a non-GM can see at LIMITED or better reads as Director-only.
- **Ownership is never bypassed.** An "Allow for players" mark only opens a page to a player who could already open it in Foundry (OBSERVER or better).
- **Only GM + Director mode hears secrets.** GM in Runner mode, and every player in any mode, gets the player channel.
- **Relay asks are forced to the player channel** — a player's client cannot claim Director mode to widen what the GM's key retrieves for them.
- **Static index:** everything under `docs/directors/**` and `docs/manuscript/03-directors/**` ships tagged `audience: "director"` (28 chunks at 0.3.97).

---

## In Foundry

### 1. The menu exists

- [ ] Journal Entries sidebar → **right-click any journal**. The menu shows **VOIDMARK: Mark Director-only** and **VOIDMARK: Allow for players**.
- [ ] Open a journal → **right-click a page** in the table of contents. Same two entries appear.
- [ ] After marking, the same right-click offers **VOIDMARK: Clear mark (use ownership)**.
- [ ] Log in as a player: neither menu entry appears (GM-only).

### 2. The mark sticks and shows

- [ ] Mark a journal Director-only. A shield icon appears next to its name in the sidebar, and a chat-free notification confirms it.
- [ ] Right-click → **Allow for players**. Icon clears.
- [ ] Mark an **entry** Director-only, then open it: the pages show the shield too (inherited).
- [ ] Mark one **page** inside that entry **Allow for players**: only that page loses the shield.
- [ ] Reload the world (F5). Marks survive.

### 3. Director hears the secret

Set up: a journal named e.g. **Quiet Floor — prep** with a page holding a fact that appears nowhere else (e.g. "the auditor is a Hollowed double"). Mark it **Director-only**.

- [ ] GM, VOIDMARK window, mode **Director** → ask about that fact. VOIDMARK answers with it.
- [ ] Ask a Director-aid question: *"What's the Quiet Floor session budget?"* — the answer reflects the Quiet Floor pacing aid.

### 4. Runner mode goes street-safe

- [ ] Same GM, same window, flip to **Runner** → ask the same secret question. VOIDMARK does **not** state the fact (it should say the packet is not on this channel, or answer only from public lore).
- [ ] Ask the Quiet Floor pacing question in Runner mode. No Director aid in the answer.
- [ ] Ask a public question in Runner mode — *"What is the Switchboard?"* — still answered fully, with citations.

### 5. Players get the player channel

Turn on **VOIDMARK player access** in Module Configuration if it is off, with a GM client connected to carry the relay.

- [ ] Player client, VOIDMARK window → ask the secret question. The fact does **not** appear.
- [ ] Player flips their own window to **Director** mode and asks again. Still nothing — mode does not widen a player ask.
- [ ] Player asks about a world journal they **can** open and is not marked (e.g. a table handout). VOIDMARK uses it.
- [ ] Player asks about a journal they have **no ownership** on and which carries no mark at all. VOIDMARK does not read it back.
- [ ] Player asks *"What is the Switchboard?"* — full public answer.

### 6. Nothing else regressed

- [ ] GM Director mode still cites Ghostwire chapter titles under the answer.
- [ ] Rules questions (Overlay vs Jacked In, combat round, Compile Agent) still answer from RAW for both GM and player.
- [ ] No console errors on world load, on opening the Journal sidebar, or on opening a journal sheet.

---

## Sign-off

- Tester:
- World / date:
- Result: PASS / FAIL
- Notes:
