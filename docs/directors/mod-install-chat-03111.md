# Mod Install chat card and Jump-In denial — 0.3.111

**Lock:** Michael smoke on Allfather after 0.3.110. Install onto… put Heavy Hardpoint on the Bulldog sheet and the toast fired. The chat card did not.

## Cause

`installMod` did call `announceModInstalled`. `ChatMessage.create({ speaker, content })` succeeded. Nothing swallowed the error, the speaker matched the other Ghostwire cards, and the CSS does not hide the card. There is no second install path: the sheet prompt calls `installMod`, which is the only writer of `mod.installedOn`. Magazines skip this card on purpose and post Load from `payload-use.mjs`.

Draw Steel 1.2 registers one ChatMessage subtype, `standard`. That model renders `system.parts` and `DrawSteelChatMessage#visible` is false when no part is visible. `content` is drawn only by a part of type `content`. A part-less message is stored and never added to the log.

## What 0.3.111 does

A successful Install onto… posts `type: "standard"`, style OTHER (so v14 does not turn it into a token speech bubble), and `system.parts: [{ type: "content" }]`. The card still names who, the mod, the host, the slots, and the fielded machine when one is already out. Failures stay notifications.

## In Foundry

1. Update to **0.3.111** and F5.
2. On a hero, Install onto… **Heavy Hardpoint** on a **Bulldog**. The chat log shows the card (who, mod, host, slots). The toast can still appear. If the Bulldog is already fielded, the card names that machine.
3. A refused install (no slots, wrong family) stays a notification and does not post a card.

## Jump-In on a non-capable vehicle

**Lock:** Same smoke. Jump-In on a Bulldog with Jump-In Capable unchecked and no Rigger Cocoon rolled, showed no denial, and did not set Jacked In.

The Machine sheet button and `jumpIn()` already warn. Two other paths rolled anyway:

- **Jump-In (Signature Platform)** (`jump-in-signature-platform`) is a Draw Steel power roll. Nothing called `jumpIn`.
- **Deploy & Command** opened the picker, `jumpIn` could warn, then the ability's power roll still ran.

Both now stop before that roll. A single targeted or fielded machine that is not capable shows `JumpInNotCapable`. Drones still pass. A vehicle with the flag or a Rigger Cocoon still sets Jacked In and meat inert (the signature ability does that after its test completes; the picker does it directly and does not also roll).

4. Field a **Bulldog**. Leave Jump-In Capable off. Do not install Rigger Cocoon. Use **Jump-In (Signature Platform)**, and use Deploy & Command → Jump-In. Each shows the denial. No power-roll card. Jacked In stays off.
5. Tick Jump-In Capable, or install **Rigger Cocoon**, and Jump-In again. The pilot is Jacked In and meat-inert.
6. A drone still Jump-Ins with the flag off.

## Deploy & Command while Jacked In

**Lock:** After a Cocoon Jump-In, Deploy & Command would not fire. Jacked In refuses every non-Wired power roll (`JackedInPhysical` in `scripts/module.mjs`). Deploy & Command rolls, and it is not a Wired ability, so the meat lock caught it. The meat-inert effect stays; it is not what turned the ability off.

Seat abilities stay usable while Jacked In: Deploy & Command, Rigged Fire, Field Repair, Focus Fire, Override Ping, and the Wrench fleet / platform / building actions. A personal weapon or another class's power roll still gets the inert-body warning.

7. Jump into the Bulldog (Cocoon or the flag). Use **Deploy & Command**. The picker opens and the ability is not refused as a meat action. **Rigged Fire** likewise. A personal weapon still warns and does not roll.

## Empty fleet returns to Linked

**Lock:** With every drone and vehicle Recalled or deleted, the Wrench stayed Jacked In, or Recall dropped a fleet-command Linked pilot to Disconnected.

Recall, last-token delete, and deleting the deployed Actor all go through `clearFleetLinkedIfIdle`. When `fieldedMachineCount` hits 0 (base assets count, same as Fleet Size), Jump-Out clears meat inert and the jumped-into flags, then `ensureFleetLinked` stamps **Linked**. Already Linked stays Linked. Overlay stays Overlay. A hero who was never Linked or Jacked In stays disconnected.

Only a real machine seat is left. The seat is read off the `jumpedInto` flag and the meat-inert effect, not off the Jacked In status: **Jacked In** is also reachable with no machine at all, from Connect or the Toggle Connection State ladder (Linked → Overlay → Jacked In). A Wrench deep in the Matrix who Recalls their last drone stays Jacked In — an empty fleet never drops a wire state the pilot chose.

8. Jump into a fielded Bulldog. Recall it (or delete its token or Actor) so nothing is fielded. Jacked In and meat inert are gone. The pilot is **Linked**.
9. Deploy while Disconnected, then Recall the last machine. The pilot stays **Linked**.
10. A hero who never Deployed and is not on the wire stays disconnected after an unrelated delete.
11. Jack into the Matrix with Toggle Connection State (no Jump-In), with one drone fielded. Recall it. The pilot stays **Jacked In** — no "drops Jump-In" toast.
