# Chest / Locker — player-locked storage

**Module 0.3.113 · backlog F10 · `scripts/locker.mjs`, `templates/locker.hbs`**
**Smoke:** `node tools/f10-locker-smoke.mjs`

A **locker** is a placeable stash on the Scene: a wall locker in a squat, a floor safe behind the bar, a welded crate in the back of a garage. It is a Ghostwire Summons Actor (`kind: locker`), the same shape as a kiosk (B118) — so it opens the same way the crew already opens a vendor.

It is **not a shop**. No ¥ changes hands, there are no listings, no prices, and no presets. A locker moves **Items** between a hero's inventory and its own shelf, both directions, in stack-sized piles.

## Place one

1. Token controls › **box-archive** icon (Director only).
2. Name it, pick an **Owner** (a player user, or leave it Director-only), and optionally tick **Party key**.
3. Or drag **Locker** out of Ghostwire Summons & Machines › **Lockers** and set ownership on the Actor sheet by hand.

The token art is the core `icons/svg/chest.svg` plate, so it renders on a stock Foundry install with no module assets. Swap it for anything you like — nothing in the code reads the texture.

Token name display defaults to **Owner hover**: players who do not have a key do not see a label advertising the stash.

## Who can open it

Checked in this order:

| Route | Condition |
|---|---|
| **Director** | Always. |
| **Owner** | The user has Foundry **Owner** ownership on the locker Actor. |
| **Unlocked** | `flags.draw-steel-ghostwire.locked` is `false` — an open crate anyone can rummage. |
| **Party key** | `partyShare` is on: everybody can open it. Toggle from the panel footer. |
| **Shared key** | The user's id is in the `shared` list. Set it by hand on the Actor flags, or give them Owner ownership instead. |

Anyone else gets a refusal notification and a locked panel. **Proximity is deliberately not a gate** — a locker is a lock, not a counter, so you can open your own stash from across the map (or from no map at all).

Note the one sharp edge: setting the Actor's **default** ownership to Owner opens the locker to every player. That is a legitimate choice for a crew safehouse, but it is a choice — the shipped pack stub is `default: 0`.

## Deposit and withdraw

Double-click the token (or the token HUD button) to open the panel.

- Top half — **In the locker**. Each row has a count box and **Take**.
- Bottom half — **Carried by \<hero\>**. Each row has a count box and **Stow**.
- The hero selector at the top picks which of your heroes is loading and unloading.
- Dragging an Item onto the panel stashes it (a Director convenience for dropping loot straight into a crate).

Moving a pile does the obvious thing: it merges into a matching stack on the far side when there is one (matched by `_dsid`, falling back to name), otherwise it starts a new stack. Taking the whole stack removes the source Item; taking part of it leaves the remainder behind. Every move posts a chat line naming the hero, the pile, and the locker.

**What can go in:** `treasure`, `equipment`, `consumable`, `item` — i.e. gear, loot, mods, chips, ammunition.
**What cannot:** chrome (it is in the body), implant-granted abilities, and everything that is character build rather than kit — class, ancestry, career, culture, kit, perks, features.

You need write access to **both** sides to move something. That is normal Foundry ownership: a player who owns their hero and has a key to the locker can load and unload freely; a player with a shared read-only view sees a read-only panel.

## At the table

- **A crew safehouse.** One locker, party key on, dropped on the safehouse Scene. Everything the crew cannot carry through a checkpoint lives there between Runs.
- **A personal stash.** One locker per runner, owner set to that player, no party key. Nobody reads anybody else's hole in the wall.
- **Loot you have not split yet.** Director-only locker (no owner), dropped where the score happened. Open it on the session the crew comes back for it.
- **A stash the crew loses.** It is an Actor. Delete the token, move it to another Scene, or change its ownership — the shelf survives, the access does not.

## What it does not do

- No ¥, no buying, no selling. That is the kiosk (`scene-kiosk-merchant.md`) and the black market.
- No encumbrance or capacity limit. If you want a small crate, say so at the table.
- No audit log beyond the chat lines each transfer posts.
