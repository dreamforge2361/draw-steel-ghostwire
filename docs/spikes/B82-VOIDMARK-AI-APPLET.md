# B82 — VOIDMARK in-module AI chat (v1 playtest)

**Date:** 2026-09-19  
**Module:** **0.3.27**  
**Status:** IMPLEMENTED — first playtestable cut  
**Persona LOCKED:** VOIDMARK (street: the Mark). Lore: `docs/manuscript/01-lore/L4-voidmark.md` (B90). Accords: L5 (B91).  
**Pairs with:** B89 (token art / canvas presence — **not** this PR), backlog note `B82-FOUNDRY-GHOSTWIRE-AI-APPLET.md`

## What this is

A **Foundry-native** ApplicationV2 chat so the Director (and optionally players) talk to **VOIDMARK** through an OpenAI-compatible Chat Completions API (default: xAI Grok). Answers to rules questions are grounded in a **shipped Ghostwire RAW index**, not generic model memory.

This is **not** a live bridge to Cursor / Grok Bot agents.

## Scope (this cut)

| Ship | Skip |
|---|---|
| Module settings: endpoint, secret API key, model, temperature, max tokens, editable system instructions, enable, player access | Live Cursor/Grok Bot bridge |
| ApplicationV2 chat + Token control + keybinding | Canvas token possession (B89) |
| VOIDMARK avatar from the approved L4 plate | New Switchboard / Mama video |
| Offline lexical RAG over `docs/raw/**` (+ L4/L5 lore chips) | Embeddings / vector DB |
| Provider-agnostic `POST {base}/chat/completions` | Perfect citation UX |

## Settings keys (`draw-steel-ghostwire`)

All **world** scope. The API key is registered `secret: true` so Foundry should not sync it to player clients. **Never log the key.**

| Key | Type | Config | Default | Notes |
|---|---|---|---|---|
| `voidmarkEnabled` | Boolean | yes | `true` | Master switch |
| `voidmarkPlayerAccess` | Boolean | yes | `false` | Off = GM-only |
| `voidmarkApiBaseUrl` | String | yes | `https://api.x.ai/v1` | No trailing slash required |
| `voidmarkApiKey` | String | yes, **secret** | `""` | xAI or compatible |
| `voidmarkModel` | String | yes | `grok-3` | Any chat-completions model id |
| `voidmarkTemperature` | Number | yes | `0.7` | 0–2 |
| `voidmarkMaxTokens` | Number | yes | `1200` | Optional cap |
| `voidmarkSystemInstructions` | String | menu textarea | seeded VOIDMARK prompt | Editable without code |

`game.settings.registerMenu` → **VOIDMARK configuration** opens an ApplicationV2 form with the long system-instruction textarea (the default Configure Settings row is a poor fit for a multi-paragraph prompt).

### xAI (Grok) setup for Michael

1. Configure Settings → **Draw Steel - Ghostwire Build**.
2. **API base URL:** `https://api.x.ai/v1`
3. **API key:** xAI key (password field). Do not paste it into chat or the console.
4. **Model:** `grok-3` (or current Grok chat id).
5. Open VOIDMARK (Token controls → ghost, or Configure Controls keybinding).
6. Ask a Wire or Combat question.

Any other OpenAI-compatible host works the same: set base URL to the provider’s `…/v1` (or whatever prefix owns `/chat/completions`) and the matching model id.

## Architecture

```
scripts/voidmark.mjs            ApplicationV2 + settings + sockets + scene control
scripts/voidmark-rag.mjs        lexical retrieve (no Foundry globals)
scripts/voidmark-prompt.mjs     default system prompt + message assembly
scripts/voidmark-client.mjs     OpenAI-compatible request builder / fetch
data/voidmark-rules-index.json  build-time chunks
assets/ai-persona/voidmark.webp chat avatar (copy of print-art filler plate)
templates/voidmark-chat.hbs
templates/voidmark-settings.hbs
tools/build-voidmark-index.mjs
tools/voidmark-smoke.mjs
```

Stock Draw Steel is untouched. Registration is `registerVoidmark()` from `scripts/module.mjs` on `init`, same pattern as Wired Console / Run Generator.

### Chat

- Client ApplicationV2 (`ghostwire-voidmark-chat`).
- Per-user thread on `flags.draw-steel-ghostwire.voidmarkThread` (mode + messages).
- Modes: **Runner** (in-voice, no out-of-world citations) and **Director** (may name Ghostwire chapter titles from retrieved sources).
- Avatar: `modules/draw-steel-ghostwire/assets/ai-persona/voidmark.webp`. Token-ring crop is a B89 hook (`assets/ai-persona/README.md`).

### Secret key + player access

Players never receive the world API key. If player access is on, the asking client emits `module.draw-steel-ghostwire` `{ op: "voidmark.ask" }`; the **lowest-id active GM** runs the fetch and replies `{ op: "voidmark.reply" }`. No GM online → players are told the Mark has no handler. GM clients call the API directly.

### RAG

Build (dev / bump):

```bash
node tools/build-voidmark-index.mjs
```

Sources:

- `docs/raw/*.md` **except** `00-INDEX.md` (assemble notes) and `00-front-matter.md` (Draw Steel / Heroes / MCDM naming — front-matter only per B92).
- Lore chips: `docs/manuscript/01-lore/L4-voidmark.md`, `L5-hands-off-accords.md`.

Strip: status/source header lines, `> **In Foundry**` callouts, images. Chunk on `##` / `###`, split long sections. Retrieve top-k by embedding-free lexical score (query TF + heading/chapter/file boosts + a small Ghostwire synonym map). No native deps.

Player-facing answers must stay **Ghostwire-only** after front matter: the system prompt forbids citing Draw Steel Heroes / MCDM / a second rulebook. Smoke asserts retrieved rule chunks do not contain `Draw Steel Heroes`.

Re-index when RAW/manuscript updates.

### API

`POST {baseUrl}/chat/completions` with `Authorization: Bearer <key>`, `model`, `temperature`, optional `max_tokens`, and `messages` (system + recent thread + user). Errors are surfaced in the transcript with `Bearer` tokens stripped. The key is never written to `console`.

Desktop Foundry (Electron) can usually reach `api.x.ai` from the client. A browser-tab client may hit CORS — point the base URL at a compatible proxy if that happens.

## How to test (Foundry closed for this agent)

**Offline (this PR):**

```bash
node tools/build-voidmark-index.mjs
node tools/voidmark-smoke.mjs
```

Expect: Wire / Combat queries retrieve `21-the-wire` / `04-combat`; assembled messages include VOIDMARK voice + retrieved RAW; no `Draw Steel Heroes` in rule chunks; request serializer redacts the key.

**On wake (Michael, Foundry 14.367 + Draw Steel 1.1.2+):**

1. Enable the module. Confirm **VOIDMARK** on Token controls (ghost).
2. Paste xAI (or compatible) key; leave players off.
3. Runner mode: “What’s the difference between Overlay and Jacked In?”
4. Director mode: “How does a combat round budget actions?”
5. Confirm answers stay in VOIDMARK voice, cite Ghostwire chapters only in Director mode, and do not mention Draw Steel Heroes.
6. Toggle player access; confirm a player client can open the window and get a reply while a GM is connected.
7. Confirm the key never appears in F12 / the chat log.

## Out of scope

Live agent bridge · canvas token possession · embeddings · shipping Switchboard/Mama videos · writing world journals from the Mark.

## Files / bump

- Module **0.3.27**
- i18n `GHOSTWIRE.Voidmark.*`
- CSS `.ghostwire-voidmark-chat` / `.ghostwire-voidmark-settings`
- API: `game.modules.get("draw-steel-ghostwire").api.openVoidmark` and `.voidmark.retrieve`
