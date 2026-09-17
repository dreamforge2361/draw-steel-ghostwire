# Spike B20d — Deck / RCC program slots + effects

**Repo:** draw-steel-ghostwire  
**Do NOT commit or push.** Leave ready for Michael to Foundry-verify.  
**Bump** module.json one patch from current (read disk; was 0.1.48).

## Problem (confirmed)
B20c install tracker works for `flags.*.mod` onto gear/vehicle/**matrix hosts**.

Decks & RCCs are already hosts:
- decks: `modFamily: ["deck"]`, modSlots 1–5 (Scrapdeck → Fairlight Ghost)
- rccs: `modFamily: ["rcc"]`, modSlots 1–5

But installable software is **broken for install**:
- **Programs** (7): only `flags.matrix.role: "program"` — **no slotCost / hosts** → `getModData` returns null → cannot Install
- **Autosofts** (4): `matrix.slotCost: 1` + `matrix.host: "rcc"` — still not under `flags.mod`, so installer ignores them
- **Payloads** (6): consumables (Zap, Crash, …) — not permanent slot fillers; leave as use-from-inventory unless chapter says otherwise
- **Zero Active Effects** on any program/autosoft — effects are description-only today

Also clarify two different “Program” words:
- **Class Programs** = Hacker Bandwidth abilities in the classes pack (already abilities) — out of scope
- **Matrix catalog programs** = deck software Items in `src/packs/matrix/programs/` — **this spike**

## Goal
1. Install a catalog **program** onto a **deck** → uses slots; host shows used/max; list names.
2. Install an **autosoft** onto an **RCC** → same.
3. Wrong family blocked (program↛RCC, autosoft↛deck unless data says both).
4. Uninstall frees slots.
5. **Active / inactive** toggle for installed software (field toggle per `14-mods.md`).
6. **Mechanical effects** when active — at least the clear Edge cases via AE and/or roll hooks (see below).

## Data model

### Keep matrix catalog flag
Leave `flags.draw-steel-ghostwire.matrix` for ¥ / echelon / role / tags (sheet catalog line).

### Add install fields (required for programs + autosofts)
Either:
- **A (preferred):** also set `flags.draw-steel-ghostwire.mod = { slotCost: 1, hosts: ["deck"]|["rcc"], … }` so B20c works unchanged, **or**
- **B:** extend `getModData` / `normalizeHosts` in `scripts/mods.mjs` to treat `matrix.role` in `program|autosoft` with `matrix.slotCost` + `matrix.host(s)` as a mod.

Pick one and migrate all 7 programs + 4 autosofts consistently.

Default host map:
| Role | hosts | slotCost |
|---|---|---|
| program | `["deck"]` | 1 (unless description says otherwise) |
| autosoft | `["rcc"]` | 1 (already on matrix flag) |

Payloads: **do not** become permanent mods in v1 (Consumable tag). Optional later: “load into deck” as ammo — skip unless trivial.

### Active flag
`flags.draw-steel-ghostwire.mod.active = true|false` (default true on install). Inactive installed software still **occupies slots** but does not apply effects (matches field toggle without uninstall).

## Effects (v1)

Read each Item’s lang Description Effect line. Implement what Foundry can do cleanly:

| Item | Effect (from catalog) | v1 implementation |
|---|---|---|
| Reader | Edge on Scan/Sniff | Hook Matrix Verb use: if active on a deck on the actor → +1 edge when verb is scan/sniff |
| Skeleton | Edge on Breach/Intrude (conditional) | Edge on breach/intrude verbs when active (simplify: always while active for v1; note conditional Rating band in description) |
| Sneak | Edge on staying undetected / softens Alert on middle | Edge on sneak-related Wired rolls if identifiable; else AE note + description |
| Guardian | Edge resisting ICE / warn on Alert | Description + optional AE stub; Alert warn can be Console note later |
| Mirror / Overlord / Scrubber | per description | Description-first + AE stub if no clean hook |
| Targeting Autosoft | Edge on Gunnery via linked drone | AE or skill edge if DS supports; else description + hook if gunnery verb exists |
| Evade / Clearsight / Repair-Tick | per description | Same pattern |

**Minimum bar for “fully functional”:** install/slots/active toggle work for all programs+autosofts; **at least Reader + Skeleton + Targeting Autosoft** apply a real edge (or documented AE) while active. Others may ship AE stubs labeled from description if roll hooks are ambiguous — list any deferred in the plan.

Reuse Matrix Verb hook pattern already in `scripts/module.mjs` (connection state edges/banes).

## UX
- Context menu Install/Uninstall already from B20c — must list Street Deck etc. for programs once data is fixed.
- Add **Activate / Deactivate** on installed mod context menu (toggles `mod.active`, enables/disables linked AEs).
- Host sheet: `Mod slots: used/max` + “Installed: Sneak (on), Reader (off)”.
- Deck/RCC description already mentions filling slots with Matrix programs — keep consistent.

## Docs
- Short note in `14-mods.md` / STATUS / FOUNDRY-BUILD-PLAN: B20d Deck/RCC software install.
- Update spike checklist pending Foundry verification.

## Out of scope
- Hacker class Program abilities (Bandwidth costs)
- Payload consumable automation
- Full ICE simulation
- Commit / push

## Done when
1. Add Street Deck + Sneak + Reader to a hero → Install both onto deck → `2/2` (or `1/2` then `2/2`).
2. Third program blocked.
3. Try install Sneak onto Fleet Deck (RCC) → blocked (wrong family).
4. Install Targeting Autosoft onto Fleet Deck → OK; onto Street Deck → blocked.
5. Deactivate Sneak → still listed/occupies slot; edge no longer applies; Activate restores.
6. Uninstall → slots free.
7. Version bumped; docs pending verify; **no git commit**.

## Foundry test checklist (print when finished)
1. Street Deck + Sneak install → used/max updates.
2. Reader install → Scan/Sniff gains edge while active (or AE visible).
3. Deactivate Reader → edge gone; slot still used.
4. Autosoft on RCC only.
5. Overfill blocked; Uninstall cleans both flags.
