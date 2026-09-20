# Spike B120 — Hacker Agents (Sprite parity)

**Date:** 2026-09-20  
**Module:** **0.3.72**  
**Status:** **SHIPPED / DESIGN LOCKED** (pending Michael Foundry-verify; he can tune later)  
**Lock:** Michael LOCK 2026-09-20 — *Hacker Agents as pets — implement and ship*

**Pairs with:** B52 Compile Sprite (`scripts/sprites.mjs`, `docs/raw/20-technomancer.md`), Linked connection state, Hacker RAW `docs/raw/19-hacker.md`

## Goal

Mirror Technomancer **Compile Sprite** with a Hacker deck-side twin. Agents are **software constructs / deck daemons** — not Resonance sprites. Different art, different language, **do not share sprite Actors**.

## Design lock (propose + ship)

### Name
**Agents.**

### Compile flow
New Hacker ability **Compile Agent**. Dialog picks **archetype**, spawns the matching Actor from Summons › Agents, token beside the caster (same 8-square ring as sprites), bidirectional flags:

```text
Agent Actor: flags.draw-steel-ghostwire = {
  kind: "agent", archetype, hybridTier, compiler: <casterUuid>, dsid, compiledAtLevel
}
Hacker: flags.draw-steel-ghostwire.compiledAgent = { uuids: [...] }
```

Cap is decided by a **world scan on `compiler`**, not the roster mirror.

### Bandwidth cost
Shipped Compile Sprite: base compile is **free** (signature); **3 Resonance** is the Enhance that compiles a *second* sprite.

**v1 Agents:** compiling **one** Agent costs **3 Bandwidth** (same number as that Enhance / Ghost Signal). Charged by the Compile sheet button / context menu **in combat**. Outside combat, Hacker Programs fire without spending — Compile Agent follows that. No v1 Enhance for a second Agent in the same action (Controller Weaver-style cap bump is parked). Michael can retune the 3.

### Archetypes (4)
| Agent | Sprite twin | Job |
|---|---|---|
| **Probe** | Data | recon / Deep Scan twin |
| **Spike** | Attack | intrusion / Integrity strike |
| **Daemon** | Machine | system control / Track 1 puppet |
| **Watchdog** | Ward | defend / Trace scrub / screen |

### Bands
Minor L1–3 / Intermediate L4–7 / Advanced L8–10 (same as sprites).

**Stamina** = archetype base + (Logic × Level). Bases match the sprite twins: Probe 8/14/20, Spike 12/18/26, Daemon 10/16/22, Watchdog 10/16/22.

### Cap
**2** base → **3** at 5th → **4** at 8th. Same baseline as a non-Weaver Technomancer. No Controller Weaver bump in v1.

### Dismiss
**Decompile Agent** (free maneuver) removes token + Actor. Per-Agent ✕ on the Compile Agent roster, or Decompile All. End of encounter cleanup like sprites (`deleteCombat`). 0 Stamina auto-decompiles.

### Requirements
Hero is **Hacker**. Compile requires **Overlay or Jacked In**. **Linked refuses** — Agents need immersion. Decompile does **not** require immersion (tearing down your own software). Compile Agent carries the `wired` keyword so the existing AbilityModel gate also blocks Linked.

### Distinct from Sprites
Separate `kind: "agent"` flags, separate `src/packs/summons/agents/` Actors, Hacker-flavored lang, placeholder token art (cyan Probe / magenta Spike / amber Daemon / green Watchdog). Do not reuse sprite SKUs.

## Foundry path

Mirrors sprites: **sheet-button spawn**, not `abilityUse`. Compile Agent is one card with two jobs (compile / command); firing a spawn on every use would compile on a command and on a low result. Same B52 rejection.

Entry points: Compile Agent (and Decompile Agent) Item-sheet header controls + hero sheet row context menu.

Script: `scripts/agents.mjs`, registered from `module.mjs`. API: `compileAgent`, `decompileAgent`, `decompileAllAgents`, `refreshAgents`, `compiledAgents`, `agentCompiler`, `agentCap`, `agentBand`, `agentStamina`, `compileAbility`, `compileAllowedAtState`, `actorWiredState`, `compileAgentGate`, `COMPILE_BANDWIDTH`.

## Out of scope
- Gold Line `{ force: true }`
- PDF / manuscript rebuild
- Controller Weaver-style cap bump
- Michael final token art (placeholders ship)

## Success / Michael checklist
1. Hacker Overlay or Jacked In → Compile Agent → pick Spike → token beside caster; Actor `kind: "agent"`; counts toward cap.
2. Linked refuses with a clear notification.
3. Cap 2 blocks a third compile at L1.
4. Decompile Agent / roster ✕ removes token+Actor.
5. End of encounter clears the roster.
6. Module **0.3.72**. Smoke: `node tools/hacker-agents-smoke.mjs`.
7. RAW 19 + Wire + glossary, manuscript L1/slang/chargen, Foundry rulebook **and** lore journals, VOIDMARK index — so the table and VOIDMARK can name Compile Agent / Probe / Spike / Daemon / Watchdog. No PDF.
