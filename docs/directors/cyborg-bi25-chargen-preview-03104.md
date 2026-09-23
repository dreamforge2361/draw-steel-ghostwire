# Cyborg BI25 + chargen spend preview — 0.3.104

**Module:** `draw-steel-ghostwire` **0.3.104**  
**For:** Michael (Allfather / Foundry)  
**Locks:** LOCK A Cyborg Body Integrity 25 + living Chrome · LOCK B Chargen early-spend Item preview  
**Date:** 2026-09-23 (ET)

## Automated

```bash
node tools/chargen-wizard-smoke.mjs
```

Expect green. No pack rebuild required (JS / lang / templates / docs only). Foundry may stay open — F5 / reload module after `git pull` on Allfather.

## Foundry checklist

### LOCK A — Cyborg BI25 + living Chrome

1. Reload world on **0.3.104**.
2. **New Cyborg:** Chargen → People **Cyborg** → Integrity step shows **25/25** (not N/A). Stats tab Body Integrity shows **25 / 25** editable inputs (not “Not used”).
3. **Chrome install:** From Ghostwire Chrome, drag **Cyber-Eyes** (or buy in Early Spends). Notice spends Integrity; Cyborg is **not** blocked. Removal refunds 75%.
4. **Living control:** Non-Cyborg still starts **20/20**; chrome still debits.
5. **Arcane Severance unchanged:** Cyborg cannot take Elementalist / Street Priest / Technomancer.
6. **Cortical Firewall unchanged:** psychic immunity = level still on the Cyborg ancestry package.
7. **Existing Cyborg actor:** on ready, if Integrity was missing / N/A-path / max 20, migrates to max **25** (+5 headroom if value was below 20). Living heroes untouched.

### LOCK B — Early-spend preview-before-buy

1. Chargen → **Early spends**.
2. Each row: click the **name** or the **eye** icon → Item sheet / card opens. **Buy** is separate and does not fire.
3. Confirm for gear, matrix/Programs, foci, vehicles, and chrome filters.
4. Buy still debits ¥ (and Integrity for chrome) only when Buy is pressed.

## Docs / stub

- RAW `09-chrome-body-integrity.md`, species, how-to-play, README Chrome section updated.
- **Frame Modules** = deferred later retag of chrome SKUs — no new Frame Modules pack in this ship.

## Blockers

- Pack rebuild: **not required**.
- Allfather `git pull` after merge if the module folder tracks `main`.
