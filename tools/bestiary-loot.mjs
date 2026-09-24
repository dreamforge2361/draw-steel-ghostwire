#!/usr/bin/env node
/**
 * 0.3.127 (E) — stamp role-appropriate lootable gear + ammo onto the bestiary NPCs.
 *
 * Before this, exactly one actor in src/packs/bestiary/** carried any Item a crew could take off it:
 * Mama Cassavir, and only because her chrome was hand-embedded in an earlier wave. Every ganger,
 * every corp shooter and every Lazarus medic in the Reach had a gun in their ability text and an
 * empty inventory tab, so "search the body" had no answer.
 *
 * Three decisions, all of them about *not* doing more:
 *
 *  1. **Embedded Items, not a roll table.** Loot lives on the Actor as real treasure documents with
 *     real quantities, so drag-to-loot, the loot sheet and `system.quantity` all just work, and the
 *     Director can see what is on a body before they kill it. A table would have been one more
 *     thing to open.
 *  2. **The table is the source of truth, and this tool is idempotent.** Every Item it writes is
 *     flagged `flags.draw-steel-ghostwire.loot`; a re-run strips those and re-embeds from
 *     docs/masters/bestiary/loot.json. Hand-embedded content (Mama's chrome) carries no such flag
 *     and is never touched, which is how her seven implants survive a restamp.
 *  3. **Most actors get nothing, on purpose.** Beasts, ICE, the risen and most of the club cast are
 *     absent from the table and stay empty. The lock says no filler junk, and a Scrap-Hound with a
 *     box of rounds in it is the exact failure mode.
 *
 * Nothing here spawns abilities: scripts/equipment-use.mjs (B49) and scripts/grenades.mjs both gate
 * their sync on `actor.type === "hero"`, so a gun on an NPC is inventory and nothing else — their
 * stat-block attacks stay the attacks they ship with.
 *
 * Run with Foundry closed, then rebuild:
 *   node tools/bestiary-loot.mjs && node tools/build-packs.mjs bestiary
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MODULE_ID = "draw-steel-ghostwire";
const BESTIARY = "src/packs/bestiary";
const TABLE = "docs/masters/bestiary/loot.json";
const LOOT_FLAG = "loot";

const read = path => JSON.parse(readFileSync(path, "utf8"));
const isLoot = item => item?.flags?.[MODULE_ID]?.[LOOT_FLAG] === true;

/**
 * A deterministic embedded id for one SKU on one actor.
 *
 * Not the SKU's own compendium `_id`: a role may hand the same actor two of a thing under different
 * quantities one day, and more importantly re-using the compendium id would collide with the
 * hand-embedded chrome on Mama Cassavir the moment a role wanted the same implant. Seeded on the
 * actor so a restamp reproduces the file byte for byte.
 */
const B62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const stableId = seed => [...createHash("sha256").update(`gw-bestiary-loot:${seed}`).digest()]
  .slice(0, 16).map(byte => B62[byte % 62]).join("");

const table = read(TABLE);
const roles = table.roles ?? {};
const assignments = table.actors ?? {};

/** Every bestiary actor on disk, keyed `folder/slug`. */
const actors = new Map();
for (const folder of readdirSync(BESTIARY)) {
  for (const file of readdirSync(join(BESTIARY, folder))) {
    if (!file.endsWith(".json") || file === "_folder.json") continue;
    actors.set(`${folder}/${file.replace(/\.json$/, "")}`, join(BESTIARY, folder, file));
  }
}

const problems = [];
for (const key of Object.keys(assignments)) {
  if (!actors.has(key)) problems.push(`loot.json names ${key}, which is not an actor on disk`);
  if (!roles[assignments[key]]) problems.push(`${key} wants role "${assignments[key]}", which is not defined`);
}
for (const [name, role] of Object.entries(roles)) {
  for (const row of role.items ?? []) {
    if (!existsSync(row.path)) problems.push(`role ${name}: ${row.path} does not exist`);
  }
  if (!role.why) problems.push(`role ${name}: no "why" — every role has to justify itself`);
}
if (problems.length) {
  console.error(`bestiary-loot: refusing to write\n  ${problems.join("\n  ")}`);
  process.exit(1);
}

/** Cache the SKU reads: a dozen roles want the same box of standard rounds. */
const skus = new Map();
const sku = path => {
  if (!skus.has(path)) skus.set(path, read(path));
  return skus.get(path);
};

/**
 * One SKU as an embedded Item on one Actor.
 *
 * Mirrors `embed()` in tools/pregens-to-actors.mjs — same `_key` shape, same effect re-keying — and
 * adds the loot flag and the quantity override. `folder` goes to null because an embedded Item is
 * not in a compendium folder, whatever its source row said.
 */
function embedLoot(actorId, row, sort) {
  const { _key, effects = [], folder, ...source } = sku(row.path);
  const dsid = source.system?._dsid ?? row.path;
  const id = stableId(`${actorId}:${dsid}`);
  const quantity = row.quantity ?? source.system?.quantity ?? 1;
  return {
    ...source,
    _id: id,
    _key: `!actors.items!${actorId}.${id}`,
    folder: null,
    sort,
    system: { ...source.system, quantity },
    effects: effects.map(({ _key: effectKey, ...effect }) => ({
      ...effect,
      _key: `!actors.items.effects!${actorId}.${id}.${effect._id}`,
    })),
    flags: {
      ...(source.flags ?? {}),
      [MODULE_ID]: { ...(source.flags?.[MODULE_ID] ?? {}), [LOOT_FLAG]: true },
    },
  };
}

const report = [];
for (const [key, path] of actors) {
  const actor = read(path);
  const kept = (actor.items ?? []).filter(item => !isLoot(item));
  const roleName = assignments[key];
  const role = roleName ? roles[roleName] : null;

  let stamped = [];
  if (role) {
    const taken = new Set(kept.map(item => item._id));
    const base = Math.max(0, ...kept.map(item => Number(item.sort) || 0)) + 100000;
    stamped = (role.items ?? []).map((row, i) => embedLoot(actor._id, row, base + (i * 1000)));
    const clash = stamped.filter(item => taken.has(item._id));
    if (clash.length) {
      console.error(`${key}: loot id collides with an existing item (${clash.map(c => c._id).join(", ")})`);
      process.exit(1);
    }
  }

  const next = { ...actor, items: [...kept, ...stamped] };
  const before = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  const after = JSON.stringify(next, null, 2) + "\n";
  if (after !== before) writeFileSync(path, after);
  if (stamped.length) report.push({ key, role: roleName, stamped });
}

const total = report.reduce((n, r) => n + r.stamped.length, 0);
console.log(`bestiary loot: ${report.length} actors, ${total} items\n`);
for (const row of report) {
  const names = row.stamped.map(item => {
    const qty = Number(item.system?.quantity ?? 1);
    return `${item.system?._dsid}${qty > 1 ? ` ×${qty}` : ""}`;
  });
  console.log(`  ${row.key.padEnd(38)} ${String(row.role).padEnd(22)} ${names.join(", ")}`);
}
const empty = [...actors.keys()].filter(key => !assignments[key]);
console.log(`\n${empty.length} actors carry nothing by design (beasts, ICE, the risen, most of the club).`);
