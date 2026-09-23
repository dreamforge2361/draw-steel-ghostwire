# Mod Install chat card — 0.3.111

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
