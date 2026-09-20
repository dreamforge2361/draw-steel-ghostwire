# Wired node token library

Foundry tokens for Wired Console nodes. Generic Track 1/2 templates (`summons/node-token-track-*.webp`) stay the default for hand-placed nodes with no `tokenStyle`.

## B113 defaults (locked)

| Id (`tokenStyle` / `autoKind`) | PNG source | Foundry WebP |
|---|---|---|
| `light-control` | `node-light-control.png` (1254², Michael YES) | `node-light-control.webp` (1024²) |
| `maglock` | `node-maglock.png` (1254², Michael YES) | `node-maglock.webp` (1024²) |

Auto-nodes from Scene always stamp these. Do not rename the files.

## Drop-in (B116)

Michael will send more styles. Until the Console picker ships:

1. Drop `<id>.png` (source) and `<id>.webp` (1024², Foundry `img` / token) in this folder.
2. Append one object to `library.json` `styles[]` (`id`, `name`, `file`, `png`). Use `id` as the filename stem for new styles.
3. Optional now: set board node `tokenStyle` to that `id`. **Place on canvas** resolves `assets/tokens/wired/<id>.webp` (locked ids use the B113 filenames above).

Picker UI is `docs/spikes/B116-NODE-TOKEN-LIBRARY.md` — not in 0.3.48.
