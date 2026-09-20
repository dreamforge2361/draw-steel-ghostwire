# Spike B120 — Hacker Agents (Sprite parity)

**Date:** 2026-09-20  
**Module:** **0.3.76** (Agents shipped **0.3.72**; sheet icons **0.3.73**; sheet-Use spawn **0.3.76**)  
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

**v1 Agents:** compiling **one** Agent costs **3 Bandwidth** (same number as that Enhance / Ghost Signal). Charged by Abilities-tab **Use** (Draw Steel `resource: 3`) or by the Compile sheet button / context menu **in combat** (`spendBandwidth`). Outside combat, Hacker Programs fire without spending — Compile Agent follows that. No v1 Enhance for a second Agent in the same action (Controller Weaver-style cap bump is parked). Michael can retune the 3.

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

**0.3.72** shipped sheet-button spawn only (B52 Compile Sprite pattern). Michael smoke: Abilities-tab **Use** ran the stock Draw Steel power roll and never opened the picker or placed a token.

**0.3.76:** wrap `AbilityModel#use` in `scripts/agents.mjs`. Under cap + Overlay/Jacked In: archetype picker **before** the power roll, then place the token (`compileAgent({ skipSpend: true })` — Use already spent the 3 Bandwidth). At cap: Use is command-only (power roll, no second Agent). Linked / Disconnected refuse the whole Use with `LinkedRefuses` / `NeedImmersion` (not a silent no-token). A low result still compiles — RAW unstable means it manifests, it just acts next turn.

**Decompile Agent** Use is intercepted the same way: pick one Agent or the whole roster, then dismiss after the card posts. Item-sheet header controls + hero sheet row context menu stay as fallbacks.

Script: `scripts/agents.mjs`, registered from `module.mjs`. API: `compileAgent`, `decompileAgent`, `decompileAllAgents`, `refreshAgents`, `compiledAgents`, `agentCompiler`, `agentCap`, `agentBand`, `agentStamina`, `compileAbility`, `compileAllowedAtState`, `actorWiredState`, `compileAgentGate`, `sheetUseCompilePlan`, `COMPILE_BANDWIDTH`.

## Out of scope
- Gold Line `{ force: true }`
- PDF / manuscript rebuild
- Controller Weaver-style cap bump
- Michael final token art (placeholders ship)

## Success / Michael checklist
1. Hacker Overlay or Jacked In → **Use Compile Agent** from the Abilities tab → pick Spike → token beside caster; Actor `kind: "agent"`; counts toward cap. (Item-sheet Compile button still works.)
2. Linked refuses with a clear notification (no token).
3. Cap 2 blocks a third compile at L1; Use at cap is command-only (power roll, no extra token).
4. **Use Decompile Agent** / roster ✕ removes token+Actor.
5. End of encounter clears the roster.
6. Module **0.3.76**. Compile Agent / Decompile Agent `img` is `modules/draw-steel-ghostwire/assets/icons/abilities/{compile,decompile}-agent.svg` (not Foundry core `icons/commodities/tech/…`). Abilities-tab Use opens the picker and places the token. Smoke: `node tools/hacker-agents-smoke.mjs`.
7. RAW 19 + Wire + glossary, manuscript L1/slang/chargen, Foundry rulebook **and** lore journals, VOIDMARK index — so the table and VOIDMARK can name Compile Agent / Probe / Spike / Daemon / Watchdog. No PDF.
