# Linked Wire connection state — docs + VOIDMARK (0.3.57)

**Status:** Code shipped **0.3.56** (PR #42). This spike is the **docs / SoR / VOIDMARK** follow-up (**0.3.57**).
**SoR:** `docs/raw/21-the-wire.md` (Connection States). Foundry implementer’s notes: `docs/rulebook/18-wired-foundry.md`.
**No Gold Line `{ force: true }`.** No new art. No PDF redo.

## Four states

| State | Role |
|---|---|
| **Disconnected** | Off-net. Radio is a jammable backup. Only **Connect**. |
| **Linked** | On-net for comms / ID / packets. Meat rolls normal. No Jacked In Wired edge. **Broadcast** works. Intrusion verbs / Programs / payload Runs **refuse**. Soft presence — Wire-discoverable. |
| **Overlay** | Partial immersion. Meat Power Rolls take a **bane**. Biofeedback ×0.5 (min 1). |
| **Jacked In** | Full immersion. Wired Power Rolls gain an **edge**. Body inert. Biofeedback ×1.5. |

**Connect** (from Disconnected, with a Wire interface) → **Linked**.
**Toggle** (one direction): Linked → Overlay → Jacked In → Linked.
**Jack Out** from any on-net state → Disconnected.

**On-net** = Linked / Overlay / Jacked In. **Connected** (full) = Overlay / Jacked In only. Features that say “Jacked In or Overlaid” still mean those two.

## What 0.3.57 completes

0.3.56 already wrote Linked into `21-the-wire.md`, Foundry notes, lang status labels, and the runtime. This bump audits remaining readers:

- RAW `03` (Power Roll modifiers), `04` (combat), `19` (Hacker pointer)
- Matching rulebook journals (`tools/raw-to-journals.mjs` + `build-packs.mjs rulebook`)
- Hacker doctrine (`docs/rulebook/08-hacker.md`, development master connection-states listing)
- Manuscript glossary + Director Reach pointer
- VOIDMARK: rebuild `data/voidmark-rules-index.json`; RAG synonyms for `linked`; smoke that Overlay / Jacked In / Connect / connection-state queries retrieve Linked
- Lang ping empty-whisper copy (on-net includes Linked)
- STATUS / FOUNDRY-BUILD-PLAN / B66 / B82 / B117 / B51c addenda

## Verify (Foundry closed)

```bash
node tools/build-voidmark-index.mjs
node tools/voidmark-smoke.mjs
node tools/linked-wire-state-smoke.mjs
```

Ask VOIDMARK (Director mode): “What are the Wire connection states?” / “What is Linked?” / “Overlay vs Jacked In?” / “What does Connect do?” — answers must name **Linked**, Connect→Linked, and that intrusion needs Overlay or Jacked In.
