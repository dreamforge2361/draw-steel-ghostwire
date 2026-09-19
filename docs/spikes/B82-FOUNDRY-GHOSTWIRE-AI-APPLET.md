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
