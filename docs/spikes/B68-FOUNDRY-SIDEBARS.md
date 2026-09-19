# Spike B68 — RAW “In Foundry” sidebars

**Status:** Done 2026-09-18 — first-pass sidebars in Stage-3 / locked RAW  
**Bump:** module **0.2.6**  
**Journals:** **not** regenerated (manuscript hold)

## Goal

Give players and Directors a consistent, instructional callout in RAW chapters that points at **shipped** Ghostwire module UI (through ~0.2.5 features). Sidebars are how-to-click notes, not lore. Do not invent menus.

## Pattern (LOCK)

Use this markdown callout in `docs/raw/` chapters:

```markdown
> **In Foundry**
> …2–6 short sentences or a tiny numbered list: which module UI/tool, where it lives, what the player/Director clicks. No screenshots. Name real shipped features only.
```

Rules:

- **Instructional only** — no setting fiction, no second rules pass.
- **Shipped only** — soft-cap / Weave Strain, magic erosion, B41/B41b minimap + wires, B51c Connected gate, B50 form picker + art, B52/B53 summons, B40 SFX, Integrity flags/sheet, B49 equipment use, B44c free-strike strip, Wired Console + Overlay/Jacked In statuses.
- **No screenshots**, no fake Settings paths, no “coming soon” UI.
- Keep Ghostwire-original chapter prose; the callout sits beside the rules it illustrates.

## First pass (this bump)

| File | Sidebar focus |
|---|---|
| `01-how-to-play.md` | World load: Draw Steel system + Ghostwire module; hero sheet Stats (Integrity, Wired, wealth) |
| `03-tests-power-rolls.md` | Roll abilities from the sheet → abilityUse chat card; module auto edges/banes |
| `04-combat.md` | Combat tracker (stock); B49 Fire/Strike with; B44c free-strike suppress |
| `09-chrome-body-integrity.md` | Integrity fieldset; Weave Strain effect + soft-cap line; erosion cap hint |
| `21-the-wire.md` | Overlay/Jacked In statuses; Wired Console; minimap + wires; payload Run Connected gate |
| `22-the-veil.md` | Soft-cap / erosion sheet hints; Veil summon roster on ability sheets (B53) |
| `26-lifestyle-downtime.md` | No Lifestyle automation — manual / Director tracks ¥ |
| `05-ancestries.md` | Changer form picker + art swap (B50) |

## Out of scope

- Journal regen (`tools/raw-to-journals.mjs`)
- Inventing Foundry manuals as print chapters (TOC non-goal unchanged)
- Features not yet shipped
