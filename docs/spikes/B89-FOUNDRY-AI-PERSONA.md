# B89 — Foundry AI chat: in-setting super-AI persona (BACKLOG)

**Date:** 2026-09-19  
**Status:** BACKLOG — pairs with B82  
**Ask:** When the module AI chat ships, it roleplays a **named super-AI that exists in Ghostwire** (Reach / AU). GM configures **system instructions** and Grok parameters in Module Configuration so every call stays in persona.

## Why
Players and the Director reach out from Foundry and talk to an in-world oracle / deep-net presence — not a meta "rules chatbot" with no fiction.

## Config surface (Module Configuration)
- Persona **name** / callsign
- **System instructions** (editable text — lore voice, what it knows, what it refuses)
- Model / temperature / max tokens (xAI Grok)
- Access: GM-only vs players
- Optional mode prompts: Rules lookup | Director assist | In-character banter

## Deliverables with B82 v1
1. Name lock with Michael
2. Default system-instruction template (Ghostwire voice, cite RAW, no IP name-checks)
3. Settings form wiring into API system message
4. Short fiction blurb: how the table "connects" (Wired deck, MER host, etc.)

## Non-goals yet
Live bridge to Cursor/Grok Bot agent session; multiple personas UI; spending ¥ / rolling without GM confirm.

## Manuscript / rulebook lore (LOCKED intent — Michael 2026-09-19)

Before or with the Foundry applet, ship **print lore** so the table knows who they are talking to:

1. **Name** (coin with Michael — not locked yet)
2. **Background & history** — origin (corp / Signal / deep Wired / independent), relationship to the Reach and the Ten (esp. **MER** if net-native), what it wants, what it will not do
3. **Where it lives in fiction** — how crews "reach" it (deck ritual, MER host, black-market terminal, etc.)
4. Placement: new short section in lore (L1 expand or L4 Wire-adjacent) **and/or** a Systems sidebar chapter pointer from The Wire (21)
5. **In Foundry sidebar** (B68 pattern): how to open the Ghostwire AI chat, that Module Configuration holds system instructions, GM vs player access — click-notes only, not a second rule

### Deliverables
- docs/manuscript/ or docs/raw/ lore page (TBD path after name lock)
- MANIFEST/TOC entry when drafted
- Cross-link from Wire chapter + slang glossary if the street has a nickname

### Non-goals yet
Full novel; implementing the applet UI (B82); live bridge to Cursor agent.

## Artwork (LOCKED intent — Michael 2026-09-19)

Need **cool Ghostwire-AI art** of the persona for two Foundry surfaces:

1. **Chat box presence** — avatar / header plate in the AI chat ApplicationV2 (square or wide banner; readable at ~128–256px and at retina).
2. **Canvas token** — portrait suitable for an Actor token when the AI "takes presence" on a scene (circular token-friendly crop + optional full bust for the sheet).

### Deliverables when picked up
- Master plate(s) in art SoR + module path e.g. ssets/ai-persona/ (chat avatar, token ring crop, optional sheet portrait)
- ART-STYLE.md nocturne / Signal / Wired lattice cues; credit Ghostwire AI
- Wire into B82 UI defaults + a sample Actor/compendium entry (optional) for dropping on the canvas
- Name lock first (or generate against a working callsign and rename files later)

### Non-goals yet
Full animated portrait; multiple outfit variants; generating before name/persona lock unless Michael asks for concepts.

