# Spike B44b — Robust Pregen fill-out (grants, gear, chrome, languages)

**Repo:** draw-steel-ghostwire  
**Depends on:** B44 v1 already on disk (uncommitted module **0.1.62**): `src/packs/pregens/`, `src/packs/pregen-fiction/`, `assets/pregens/`, `docs/masters/pregens/`, tools.  
**Do NOT commit** until Michael Foundry-verifies.  
Bump **one** module patch after rebuild.

## Problem
v1 embedded class / ancestry / kit / background / profession Items but did **not**:
- apply Level-1 **advancement grants** (full feature/signature sets),
- embed **concrete gear** (kits only store armor/weapon *categories*),
- add **chrome**, **languages**, or a playable street loadout.

Sheets feel empty / weak. Fix in place — same eight Heroes.

## Goal
Each pregen is a **ready-to-drop L1 runner**: full legal L1 grants, fiction-fit armor/weapons/gear, optional Soft/Standard chrome within BI 20, languages filled, kit signature present, abilities usable without opening advancement UI.

## Prose locks (apply this pass)
1. **Spelling:** normalize hero 2 to **Kaïs** book-wide (Actor display/`lang`, ROSTER, BUILD-NOTES, ART-NOTES). Story prose already uses PDF spelling — keep verbatim.  
2. **Epigraph** on story 1: **keep** as blockquote.  
3. **HAND.:** clean layout dash to normal dialogue punctuation; keep the word.  
4. Characteristics: keep L1 **2/2/1/1/0** on class cores (Tier 5 numbers stay discarded).

## Method

### A. Advancement grants
For each Actor, read advancements on embedded ancestry / class / subclass / kit / culture / career Items (and their compendium sources if the embed is thin). At **level 1**, embed every automatic `itemGrant` and resolve fixed pools; for `chooseN` picks, choose fiction-fit options and **record the choice** in `docs/masters/pregens/LOADOUTS.md`.

Must end up with at minimum:
- Full L1 class features + signatures the class would grant
- Subclass L1 feature(s)
- Kit **signature ability** (from kit `itemGrant` pool UUID)
- Ancestry traits completing a legal L1 pick (Wren/Vira keep Raven/Rat)
- Background/profession granted skills / languages / other items those packs define

If Foundry advancement cannot be simulated cleanly from JSON alone, expand `tools/pregens-to-actors.mjs` to copy grant targets by UUID from compendium source JSON (same approach as v1 ability copies). **Do not** leave “open the advancement dialog” as the only path.

### B. Concrete gear (Ghostwire SKUs)
Kits set `system.equipment` categories only. Map those to **items from `src/packs/gear`** (and matrix pack for decks). Prefer **firearms / chrome street loadouts**, not fantasy bows/melee, unless fiction demands a blade as sidearm.

Guidance (Claude picks exact SKUs; document in LOADOUTS.md):

| Hero | Kit / role | Armor direction | Weapons / tools direction |
|---|---|---|---|
| Vessa | Sanctified / Shepherd | Heavy street (plated jacket / vest / ghostplate-class) | Light sidearm + creed focus; avoid milspec |
| Kaïs | Hexshot / Stormcaller | Light / none (caster) | Sidearm optional; Hexshot ranged kit → pistol/SMG or keep kit ranged profile via appropriate GW ranged weapon SKU |
| Krow | Warframe / Street-vet | Heavy + shield if kit says | Primary carbine/SMG/shotgun + pistol; Cyborg suite already covers chrome frame |
| Barak | Juggernaut / Fixer | Heavy demolition plate vibe | Heavy firearm + intimidation gear; soft chrome OK |
| Wren | Longshot / Hunter | Light / none | Longarm (whisper/apex/streetline) + pistol |
| Sabbat | No kit / Sprite-Weaver | Light street | Sidearm optional; no heavy chrome (caster) |
| Vira | Rigger’s Harness / Drone Jockey | Light | Light pistol + tools; datajack-family chrome OK |
| Kessic | Street Deck / Disruptor | Light | Keep Street Deck; light pistol; decker chrome (datajack / cyber-eyes) OK |

Also embed a small **street kit** each: commlink/burner or pocket-sec, stim patch, ammo or one grenade where it fits. Use real pack Items (copy embed), not flavor text.

### C. Chrome
- Soft or Standard grades only; **BI remaining ≥ 0**, start from 20 (Pass A).  
- Cyborg (Krow): no BI spend for being Cyborg; optional extra chrome only if pack rules allow and fiction wants it — default **no extra**.  
- Veil casters (Vessa, Kaïs, Sabbat): prefer **none** or 1 Soft that doesn’t fight erosion fiction.  
- Record every implant + BI cost in LOADOUTS.md.

### D. Languages
Fill actor language fields from GW language list (`lang/en.json` / B25). At least: one common street tongue + fiction-fit extras (Corp, faith, machine, etc.). Match background/profession grants when those Items specify languages.

### E. Docs / tools
- Write **`docs/masters/pregens/LOADOUTS.md`** — per hero: grants applied, gear list, chrome + BI, languages, chooseN decisions.  
- Update ROSTER.md / BUILD-NOTES.md (note B44b; keep Tier 5 decision).  
- Extend `tools/pregens-to-actors.mjs` (or add `tools/pregens-fill-out.mjs`) so rebuild is repeatable.  
- Fiction pack: only Kaïs normalization in bylines/index if needed + HAND dash clean; do not rewrite stories.  
- Rebuild: `node tools/build-packs.mjs` (Foundry closed). PDF stays gitignored.

## Out of scope
Inventing a Medic; leveling past 1; new gear SKUs; changing class pack math; committing/pushing; full Foundry advancement UI automation beyond embedding granted Items.

## Done when
- Each of 8 Actors has: full L1 ability/feature set, kit signature, armor + weapon(s) + street gear embeds, languages, chrome per LOADOUTS (or explicit “none”).  
- LOADOUTS.md complete; BI legal; no Tier 5 leftovers.  
- Module patch bumped; checklist printed; **no commit**.

## Michael checklist
1. Open Vessa — Shepherd features + Sanctified signature + armor/sidearm on sheet.  
2. Open Krow — Warframe signature + heavy loadout + shield if applicable; Cyborg traits intact.  
3. Open Wren / Vira — Raven / Rat + longarm / rigger gear.  
4. Open Kessic — Street Deck + decker chrome/languages.  
5. Spot Kaïs spelling on Actor; story epigraph kept; HAND line cleaned.  
6. Drag two to a Scene; attack / ability / gear usable without advancement popup.  
7. LOADOUTS.md matches what’s on the sheets.