# B82 — Foundry Ghostwire AI applet (BACKLOG)

**Date:** 2026-09-19  
**Status:** BACKLOG — design later  
**Ask:** Module-configurable chat applet so GM/players can do rule lookups, guidance, scenario help, and optional NPC roleplay from inside Foundry.

## Feasibility lock (working)
- **In-module LLM chat (recommended v1):** ApplicationV2 panel + module.json / settings form; API key in Module Configuration; provider default **xAI Grok** (configurable); RAG over Ghostwire manuscript/journals/packs; GM gates; optional Actor persona mode.
- **Live link to Cursor/Grok Bot agent session:** not native — needs a local/server **bridge**. Optional v2 for Michael's table only.
- **Not** a replacement for RAW SoR; assistant must prefer citing docs/raw / journals and flag uncertainty.

## v1 scope (when picked up)
1. Settings: enable, API provider/key, model, who may open (GM / trusted / all), temperature, max context.
2. Chat UI: thread per user or shared Director thread; insert roll/link helpers.
3. Context packer: selected journal pages + rule chapter titles; optional "current scene / selected tokens".
4. Modes: Rules lookup | Director assist | NPC voice (Actor).
5. Safety: no secrets to players; B78 scrub in system prompt; rate limit.

## Non-goals v1
Full autonomous Director; spending money without GM; writing into world without confirm; bridging to Grok Bot chat.

## Related
Manuscript SoR; journal regen (deferred); Run Generator (B39).

## In-setting persona (LOCKED intent — Michael 2026-09-19)

The chat applet is **not** a naked "help desk LLM." It is a **named super-AI that exists in the Ghostwire setting** (Reach / wider AU), contacted from the table as if the crew or Director were reaching that entity.

### Requirements
- **Persona name** (coin with Michael — working placeholder TBD; e.g. Signal-adjacent / Meridian deep-net / independent oracle — must fit lore, no external-IP echoes).
- **Module Configuration** fields the GM can edit without code:
  - Display name / callsign
  - **System instructions** (full persona + boundaries: RAW cite, no spoiling GM secrets to players, B78/B83 scrub)
  - Optional: temperature, model id, max tokens, who may open (GM / players)
  - Optional: "Director mode" vs "Runner mode" prompt suffixes
- Pass those into **xAI Grok** on every request (system role + mode suffix + RAG context).
- Fiction: players/Director are talking *to that AI in-world* (Wired terminal, HAL/MER host, black-market deck, etc.) — UI chrome can match ART-STYLE.

### Still open
- Exact name + origin (corp-built vs Signal-touched vs Null-ward adjacent)
- Whether one global persona or multiple switchable personas later

