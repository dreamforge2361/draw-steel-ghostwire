# Rigger token-delete / fleet / Story HTML smoke — 0.3.107

**Lock:** Michael 2026-09-23. Deploy→Linked PASS on 0.3.106 (do not regress).

## Code

| Area | Change |
|------|--------|
| Token delete | Last machine token deleted → `recallMachine` (clear Item `deployed`, delete Actor). `ghostwireRecall` guards recursion. |
| Stale flag | Broken Actor UUID or Actor with zero tokens → unset / Recall, Deploy allowed. |
| Fleet Size | Base **1/2/3/4** @ L1/L4/L7/L10. Wide Band **+1**. Endless Swarm **+2** (wired into `fleetSizeCap`). Redoubled no cap. |
| Token size | `machineTokenSize(band)` stamps `system.combat.size` + prototypeToken/Token width/height on Deploy. drone-micro/small=1, medium=2, bike=2, car/air/water/space=3, heavy=4. |
| Story tab | ProseMirror `{{editor}}` + enrichHTML for Description / Director Notes. |
| Wired Console | Fielded machine under on-net owner (Linked/Overlay/Jacked In) displays **LINKED**. |

## Automated

```bash
node tools/rigger-vertical-smoke.mjs
```

Expect fleet asserts: L1→1, L4→2, L7→3, L10→4; Wide Band L1→2; Endless Swarm L7+WB→6.

## In Foundry

1. **Delete last token** — Deploy a drone. Delete its token from the scene (not Recall). Item shows Stowed; Deploy works again. Actor gone from sidebar.
2. **Stale flag** — Junk `deployed.actorUuid` or delete Actor from sidebar. Deploy clears and succeeds.
3. **Recall button** — Deploy, Recall from Item sheet: still works.
4. **Fly size** — Deploy Fly / drone-small: token ≈ 1 square (hero-sized), not vehicle-car huge.
5. **Vehicle size** — Deploy a car-band vehicle: token stays large (3).
6. **Fleet** — Wrench without Wide Band: 2nd Deploy at L1 refuses. Vira (DJ + Wide Band): cap 2 at L1.
7. **Story HTML** — Story tab renders rich text, not raw tags. Save preserves HTML.
8. **Console LINKED** — Deploy while pilot Linked: Connections shows machine **LINKED**. Jack Out / Recall → not stuck Linked.
9. **Deploy→Linked** — First Deploy while Disconnected still promotes pilot to Linked (0.3.106 PASS).

## Notes

- Endless Swarm `+2` was previously RAW-only; `fleetSizeCap` now counts `_dsid: endless-swarm`.
- Base ladder lock: 1/2/3/4 (was 3/4/5/6). Wide Band lock: +1 (was +2).
