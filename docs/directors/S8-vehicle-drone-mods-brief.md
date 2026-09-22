# S8 — Vehicle / drone / mods build-out (LOCKED brief 2026-09-22)

**When:** After S6 (Voidmark Director lore filter). After 0.3.95 F8+F6.
**Doctrine:** Claude on Allfather; Ghostwire voice; SR books = structure/feel reference only.

## Goals
1. **Robust selection** of vehicles and drones in Foundry (not a thin sample pack).
2. **Mods** for vehicles and drones as first-class gear (slots, compatibility, install).
3. **¥ on every SKU** — buy price (and any install fee / parts cost) explicit.
4. **Project downtime** — fabricating a mod, installing a mod, or converting a chassis uses Draw Steel **Project** notes (goal, progress bands) so it fits Lifestyle project slots.
5. **Rules updated** — RAW (`docs/raw`), journals, manuscript stay in sync with the packs.
6. **Table vendors restocked** — the shop kiosks Directors drop on scenes must sell the new lines.

## Table vendors (REQUIRED)
Existing kiosk presets already cover **Drones** and **Vehicles** (`scripts/kiosk-presets.mjs` — folder/globs auto-include new SKUs under `src/packs/vehicles/…`). S8 must:

| Vendor | Preset / Actor | Duty |
|---|---|---|
| **Drone vendor** | preset `drones` | Stock expands with every new drone SKU (¥ priced, shoppable). |
| **Vehicle vendor** | preset `vehicles` | Stock expands with every new crewed vehicle SKU (exclude Plot-only). |
| **Mod vendor** | **add or harden** preset for mods (vehicle + drone mods at minimum; armor/weapon/gadget mods as already packed) | Every new mod SKU appears on the mod shop shelf. |

Also ship / refresh **placable kiosk Actors** (or documented Director kit) for those three vendor types so they can be dropped on the table at various points in a run. Verify with smoke that preset resolution picks up new pack JSON without hand-editing each listing UUID.

## Process (Ghostwire)
- Mine Rigger Black Book / Arsenal / Man & Machine for categories and feel → rename + reprice into Ghostwire.
- Each Item/Actor: name, description, ¥, echelon/availability, tags, Project fields where build/install applies.
- Packs: `vehicles/` (+ drones), `mods/vehicles` (+ drone-compatible mods), kiosk presets + any vendor Actor templates.
- Smoke: price on all new SKUs; Project docs linked; **drone / vehicle / mod kiosk presets list the new UUIDs**; manuscript chapter(s) updated.

## Out of scope for S8 first cut
- Full Rideable replacement (separate I4).
- Brand-new cosmic/setting vehicles with no SR analog (can add later as greenfield).
