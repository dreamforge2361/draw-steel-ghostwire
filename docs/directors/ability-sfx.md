# B40 — Ability / weapon / gear sound effects (backlog)

**Status:** Spike live 2026-09-17 — `docs/spikes/B40-ABILITY-SFX.md`. v1 uses Foundry core placeholders.  
**Depends on:** Stable ability use hooks (Draw Steel + Ghostwire items); Michael supplies sound assets.  
**Do NOT implement until Michael prioritizes** (after B38c firearms pass / bestiary verify is a natural time).

## Goal
When a hero or NPC **uses an ability, fires a weapon, or activates gear**, play a matching sound (gunshot, laser, spell cast, chrome whir, ICE bite, etc.). Bring the Reach to life without requiring manual playlist clicks.

## UX
1. **Module settings** (Configure Settings → Draw Steel - Ghostwire Build):
   - Master enable: `Enable ability/weapon SFX` (default on for GM, respect client mute / Foundry audio).
   - Volume slider (or use Foundry playlists volume).
   - Optional: “Play for GM only” vs “All clients who can hear the speaker.”
2. **Per-item / per-ability override** (Item sheet or ability config):
   - Sound path (FilePicker) or pack key from a Ghostwire SFX library.
   - Optional sound for crit / miss / power-roll tier if cheap.
3. **Fallback table** in settings or `src/data/sfx-map.json`: map by keywords / item type / ability category (e.g. `pistol` → `sounds/guns/pistol-01.ogg`, `laser` → `…`, `spell` / Veil → `…`).

## Asset pipeline
- Michael provides files (ogg/webm preferred for Foundry).
- Land under `modules/draw-steel-ghostwire/assets/sfx/` (guns, energy, chrome, veil, wire, ui).
- Document naming convention in this file when assets arrive.
- Do **not** commit huge binaries without Michael OK; optional Git LFS later.

## Implementation sketch
- Hook Draw Steel ability use / attack roll (confirm exact hook on DS 1.1.2 — hypothesis: ability use chat message or system hook; verify, don’t guess in code).
- `scripts/sfx.mjs` — resolve sound from item flag → type map → default; `foundry.audio.AudioHelper.play` (or current V14 API).
- Flags: `flags.draw-steel-ghostwire.sfx = { src, volume?, exclusive? }`.
- Respect Foundry “Disable audio” and per-client settings.

## Out of scope (v1)
Full Foley for footsteps/doors; music stingers; Animated Spell Effects dependency; auto-generating sounds.

## Done when (future spike)
Settings toggle works; sample pistol + laser + one Veil ability play on use; override on one Item; docs + STATUS; Foundry-verify; no commit until Michael says.

## Foundry core placeholders (testing until custom pack)
Reference root-relative core paths — do **not** copy into the module. Swap to `modules/draw-steel-ghostwire/assets/sfx/` when Michael’s files land.

| Keyword family | Placeholder `src` |
|---|---|
| Generic / UI | `sounds/notify.wav` |
| Mechanical / chrome click | `sounds/lock.wav` |
| Impact / heavy hit | `sounds/drums.wav` or `sounds/combat/epic-turn-1hit.ogg` |
| Tech / laser-ish | `sounds/doors/futuristic/open-fast.ogg`, `…/open-forcefield.ogg` |
| Spell / Veil | `sounds/doors/magic/door-open.ogg`, `…/wall-open.ogg` |
| Industrial | `sounds/doors/industrial/open.ogg`, `sounds/doors/metal/heavy-sliding-open.ogg` |

Core Foundry does **not** ship gunshots — pistols/SMGs/rifles stay on tech placeholders until custom SFX arrive.


---

## As built (B40, module 0.1.66 — pending Foundry-verify)

### The hook, and why this one

Draw Steel 1.1.2 emits **no ability-use hook** of its own: the only `Hooks.callAll` calls in the system are
`ds.ready`, the `ds.prepare*Data` family and combat-turn hooks. Verified by reading `draw-steel.mjs`, not guessed.

What actually happens when anything is used from a sheet: `DrawSteelAbility#use()` (around line 6336 of
`draw-steel.mjs`) ends by creating a **ChatMessage** of type `"standard"` whose `system.parts` contains a part with:

```js
{ type: "abilityUse", abilityUuid: "<the ability Item's uuid>", effects: [...] }
```

So the module listens to **`createChatMessage`** and looks for that `abilityUse` part. This is the single
reliable fire point, and because Draw Steel resolves weapon attacks and gear-driven actions *as abilities*,
one hook covers abilities, weapons and gear alike. The later `abilityResult` part carries the power roll —
we deliberately fire on **use**, not on result, so the sound lands with the action.

**Gotcha that cost a first cut (fixed in 0.1.67).** `system.parts` is declared as a `CollectionField`, so at
runtime it is a **ModelCollection — a Foundry Collection (Map), not a plain object**. `Object.values(parts)`
returns an empty array against it, so the handler found no `abilityUse` part and returned silently: the dice
rolled and nothing played, while the sheet's preview button still worked because it never touches the message.
Read `parts.contents` (falling back to array and plain-object shapes for raw source data), match the part on
`part.type ?? part.constructor.TYPE`, and take the Item from the part's synchronous `ability` getter.
Set `CONFIG.debug.ghostwireSfx = true` in the console to trace resolution.

Only the client whose action created the message plays the sound; it then pushes to the other clients via
`AudioHelper.play(data, socketOptions)`, so nobody hears it twice.

### Settings (module scope `draw-steel-ghostwire`)

| Key | Scope | Default | Effect |
|---|---|---|---|
| `sfxEnabled` | world | `true` | Master switch |
| `sfxVolume` | client | `0.8` | Per-player multiplier, on top of Foundry's interface volume |
| `sfxGmOnly` | world | `false` | Only Director clients hear ability sounds |

Sounds play on the **`interface` audio channel**, so Foundry's own mute and interface-volume controls apply
without extra code.

### Resolution order

1. The ability's own override — `flags.draw-steel-ghostwire.sfx.src`, set with the FilePicker on its sheet.
2. The keyword map, `scripts/data/sfx-map.json`: first matching rule wins, matching either the ability's
   `system.keywords` or a regex against its name.
3. The map's `default` (`sounds/notify.wav`).

Rule order is **wired → veil → firearm → chrome → tech → impact → command**. Wired sits ahead of Veil on
purpose: Technomancer sprite work is tagged `magic` *and* `wired`, and it should sound like the Wire.

Checked against all 412 ability Items in the packs: 349 match a rule, 63 fall through to the default.

### Per-ability override

An ability sheet gains a **Ghostwire SFX** block: a path field, a FilePicker button, a preview button and a
clear button. The hint line names which map rule the ability currently matches, so you can hear what you are
overriding. Cleared overrides fall straight back to the map.

### Adding custom sounds

1. Drop files under `assets/sfx/` in this module.
2. Either point one ability at a file with the sheet's FilePicker, or edit `scripts/data/sfx-map.json` and
   change a rule's `src` to `modules/draw-steel-ghostwire/assets/sfx/<file>`.
3. No code change is needed; the map is read at `ready`.

**v1 ships no audio binaries** — every path above is a Foundry core sound, and all seven were verified to
exist in the installed Foundry. Core has no gunshot, so firearms sit on a futuristic-door placeholder until
real gunshots land.

## As-built — custom OGG pack (0.1.70)

Shipped 40 mono OGG Vorbis (q2) files under ssets/sfx/ (~1.3 MB). scripts/data/sfx-map.json points family rules at modules/draw-steel-ghostwire/assets/sfx/*.ogg (wired, veil, firearms, chrome, tech, medic, toxin, impact, command). Foundry-verified by Michael 2026-09-17. Raw WAV/MP3 kept only in local _sfx-raw-backup/ (gitignored).

