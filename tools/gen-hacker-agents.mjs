#!/usr/bin/env node
/**
 * One-shot generator for B120 Hacker Agent pack JSON.
 *
 * 0.3.133 (A): the placeholder token PNGs this used to draw are gone. Every tier of an archetype now
 * wears Michael's family art — `agent-<archetype>.webp` — so a regenerate no longer reverts the art
 * to a coloured disc. `writePng` / `tokenRgba` were deleted with them; the `color` on each archetype
 * is kept for the Wired minimap, and `icon` is the core icon each agent's own feature / strike Item
 * wears (the family art is the *actor and token*, never the Item icon).
 *
 * WARNING — this generator is stale against the committed pack rows and re-running it is
 * DESTRUCTIVE. `stableId` no longer reproduces the `_id`s in src/packs/summons/agents/ (every actor
 * and every embedded Item would be reassigned a new id, orphaning world copies). It is kept as the
 * record of how the twelve agents were built and as the place art decisions are recorded; the rows
 * themselves are hand-maintained. Fix the ids before you run it again.
 * Run: node tools/gen-hacker-agents.mjs   (DO NOT — see above)
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const B62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const stableId = seed => [...createHash("sha256").update("gw-agents-b120:" + seed).digest()].slice(0, 16)
  .map(b => B62[b % 62]).join("");

const FOLDER_ID = "gwSummonsAgents0";
const ARCHETYPES = {
  probe: { role: "hexer", art: "agent-probe.webp", icon: "icons/magic/perception/eye-ringed-glow-angry-small-teal.webp", color: [0, 196, 210] },
  spike: { role: "harrier", art: "agent-spike.webp", icon: "icons/magic/lightning/bolt-strike-purple.webp", color: [232, 48, 120] },
  daemon: { role: "support", art: "agent-daemon.webp", icon: "icons/commodities/tech/cog-steel.webp", color: [232, 168, 32] },
  watchdog: { role: "defender", art: "agent-watchdog.webp", icon: "icons/magic/defensive/shield-barrier-glowing-triangle-green.webp", color: [48, 196, 96] },
};
const BANDS = {
  minor: { level: 1, logic: 2, sortAdd: 0 },
  intermediate: { level: 4, logic: 3, sortAdd: 1000 },
  advanced: { level: 8, logic: 4, sortAdd: 2000 },
};
const STAMINA_BASE = {
  probe: { minor: 8, intermediate: 14, advanced: 20 },
  spike: { minor: 12, intermediate: 18, advanced: 26 },
  daemon: { minor: 10, intermediate: 16, advanced: 22 },
  watchdog: { minor: 10, intermediate: 16, advanced: 22 },
};
const ARCH_SORT = { probe: 0, spike: 3000, daemon: 6000, watchdog: 9000 };
const SPIKE_DMG = { minor: "2d10 + @chr", intermediate: "2d10 + @chr + 1d6", advanced: "3d10 + @chr" };
const SPIKE_DMG_ID = { minor: "gwAgtSpkMinDmg00", intermediate: "gwAgtSpkIntDmg00", advanced: "gwAgtSpkAdvDmg00" };

const FEATURE = {
  probe: { nameKey: "Feature", dsid: "probe-sweep" },
  spike: { nameKey: "Strike", dsid: "integrity-spike" },
  daemon: { nameKey: "Feature", dsid: "puppet-thread" },
  watchdog: { nameKey: "Feature", dsid: "watchdog-screen" },
};

/** Every tier of an archetype wears the family art (0.3.133 A). */
const agentArt = archetype => `modules/draw-steel-ghostwire/assets/tokens/summons/${ARCHETYPES[archetype].art}`;

function langKey(archetype, band) {
  return `Agent${archetype[0].toUpperCase()}${archetype.slice(1)}${band[0].toUpperCase()}${band.slice(1)}`;
}

function baseActor({ archetype, band, actorId, stamina, img }) {
  const key = langKey(archetype, band);
  const dsid = `agent-${archetype}-${band}`;
  const { level, logic, sortAdd } = BANDS[band];
  return {
    _id: actorId,
    _key: `!actors!${actorId}`,
    name: `GHOSTWIRE.Summons.Agents.${key}.Name`,
    type: "npc",
    img,
    system: {
      stamina: { value: stamina, max: stamina, temporary: 0 },
      characteristics: {
        might: { value: 0 }, agility: { value: 0 }, reason: { value: logic },
        intuition: { value: 0 }, presence: { value: 0 },
      },
      combat: { save: { threshold: 6, bonus: "" }, size: { value: 1, letter: "T" }, stability: 0, turns: 1 },
      movement: { value: 5, types: ["fly"], hover: true, disengage: 1 },
      damage: {
        immunities: { all: 0, acid: 0, cold: 0, corruption: 0, fire: 0, holy: 0, lightning: 0, poison: 0, psychic: 0, sonic: 0 },
        weaknesses: { all: 0, acid: 0, cold: 0, corruption: 0, fire: 0, holy: 0, lightning: 0, poison: 0, psychic: 0, sonic: 0 },
      },
      biography: { value: `GHOSTWIRE.Summons.Agents.${key}.Description`, director: "", languages: [] },
      source: { book: "Ghostwire Core Rulebook", page: "19-hacker", license: "Draw Steel Creator License" },
      negotiation: { interest: 5, patience: 5, motivations: [], pitfalls: [], impression: 1 },
      monster: { freeStrike: 0, keywords: ["construct"], level, role: ARCHETYPES[archetype].role, organization: "minion" },
      ev: 0,
      statuses: { immunities: [] },
    },
    prototypeToken: {
      name: `GHOSTWIRE.Summons.Agents.${key}.Name`,
      displayName: 20, actorLink: false, width: 1, height: 1, lockRotation: true, rotation: 0, alpha: 1,
      disposition: 1, displayBars: 20,
      bar1: { attribute: "stamina" }, bar2: { attribute: "hero.resources" },
      light: {
        negative: false, priority: 0, alpha: 0.5, angle: 360, bright: 0, color: null, coloration: 1, dim: 0,
        attenuation: 0.5, luminosity: 0.5, saturation: 0, contrast: 0, shadows: 0,
        animation: { type: null, speed: 5, intensity: 5, reverse: false }, darkness: { min: 0, max: 1 },
      },
      sight: { enabled: true, range: 0, angle: 360, visionMode: "basic", color: null, attenuation: 0.1, brightness: 0, saturation: 0, contrast: 0 },
      detectionModes: {}, occludable: { radius: 0 },
      ring: { enabled: false, colors: { ring: null, background: null }, effects: 1, subject: { scale: 1, texture: null } },
      turnMarker: { mode: 1, animation: null, src: null, disposition: false },
      movementAction: null, flags: {}, randomImg: false, appendNumber: false, prependAdjective: false, depth: 1,
      texture: { src: img, anchorX: 0.5, anchorY: 0.5, fit: "contain", scaleX: 1, scaleY: 1, tint: "#ffffff", alphaThreshold: 0.75 },
    },
    items: [],
    effects: [],
    folder: FOLDER_ID,
    sort: ARCH_SORT[archetype] + sortAdd,
    ownership: { default: 0 },
    flags: {
      "draw-steel-ghostwire": { kind: "agent", archetype, hybridTier: band, ownerUuid: null, dsid },
    },
  };
}

function featureItem(actorId, archetype, band) {
  const key = langKey(archetype, band);
  const itemId = stableId(`feature:${archetype}:${band}`);
  const spec = FEATURE[archetype];
  return {
    _id: itemId,
    _key: `!actors.items!${actorId}.${itemId}`,
    name: `GHOSTWIRE.Summons.Agents.${key}.${spec.nameKey}.Name`,
    type: "feature",
    img: ARCHETYPES[archetype].icon,
    system: {
      description: { value: `GHOSTWIRE.Summons.Agents.${key}.${spec.nameKey}.Description`, director: "" },
      source: { book: "Ghostwire Core Rulebook", page: "19-hacker", license: "Draw Steel Creator License" },
      _dsid: `agent-${archetype}-${band}-${spec.dsid}`,
      advancements: {},
      prerequisites: { value: "", dsid: [], level: null },
    },
    effects: [], folder: null, sort: 0, flags: {}, ownership: { default: 0 },
  };
}

function spikeStrike(actorId, band) {
  const key = langKey("spike", band);
  const itemId = stableId(`strike:spike:${band}`);
  const dmgId = SPIKE_DMG_ID[band];
  const otherId = stableId(`strike-other:spike:${band}`);
  return {
    _id: itemId,
    _key: `!actors.items!${actorId}.${itemId}`,
    name: `GHOSTWIRE.Summons.Agents.${key}.Strike.Name`,
    type: "ability",
    img: ARCHETYPES.spike.icon,
    system: {
      type: "main", category: "signature",
      keywords: ["tech", "strike", "wired"],
      distance: { type: "special", primary: "", secondary: "1", tertiary: "1" },
      target: { type: "creatureObject", value: 1, custom: "" },
      damageDisplay: "melee",
      power: {
        roll: { formula: "@chr", characteristics: ["reason"], reactive: false },
        effects: {
          [dmgId]: {
            _id: dmgId, type: "damage", name: "", img: null, sort: 0,
            damage: {
              tier1: { value: "0", types: [], ignoredImmunities: [], potency: { value: "@potency.weak", characteristic: "none" } },
              tier2: { value: SPIKE_DMG[band], types: [], ignoredImmunities: [], potency: { value: "@potency.average", characteristic: "" } },
              tier3: { value: SPIKE_DMG[band], types: [], ignoredImmunities: [], potency: { value: "@potency.strong", characteristic: "" } },
            },
          },
          [otherId]: {
            _id: otherId, type: "other", name: "", img: null, sort: 100,
            other: {
              tier1: { display: `GHOSTWIRE.Summons.Agents.${key}.Strike.Tier1`, potency: { value: "@potency.weak", characteristic: "none" } },
              tier2: { display: `GHOSTWIRE.Summons.Agents.${key}.Strike.Tier2`, potency: { value: "@potency.average", characteristic: "" } },
              tier3: { display: `GHOSTWIRE.Summons.Agents.${key}.Strike.Tier3`, potency: { value: "@potency.strong", characteristic: "" } },
            },
          },
        },
      },
      source: { book: "Ghostwire Core Rulebook", page: "19-hacker", license: "Draw Steel Creator License" },
      _dsid: `agent-spike-${band}-integrity-spike`,
      story: "", resource: null, trigger: "",
      effects: {
        before0000000000: {
          _id: "before0000000000", type: "base",
          description: `GHOSTWIRE.Summons.Agents.${key}.Strike.Effect`,
          name: "", img: null, sort: 0, before: true,
        },
      },
      prerequisites: { value: "", dsid: [], level: null },
    },
    effects: [], folder: null, sort: 0, flags: {}, ownership: { default: 0 },
  };
}

mkdirSync("src/packs/summons/agents", { recursive: true });

writeFileSync(join("src/packs/summons/agents", "_folder.json"), JSON.stringify({
  _id: FOLDER_ID,
  _key: `!folders!${FOLDER_ID}`,
  name: "Agents",
  type: "Actor",
  folder: null,
  sort: 50000,
  flags: {},
  color: "#00C4D2",
  description: "",
}, null, 2) + "\n");

for (const archetype of Object.keys(ARCHETYPES)) {
  for (const band of Object.keys(BANDS)) {
    const dsid = `agent-${archetype}-${band}`;
    const img = agentArt(archetype);
    const actorId = stableId(`actor:${dsid}`);
    const stamina = STAMINA_BASE[archetype][band] + BANDS[band].logic * BANDS[band].level;
    const actor = baseActor({ archetype, band, actorId, stamina, img });
    actor.items = [archetype === "spike" ? spikeStrike(actorId, band) : featureItem(actorId, archetype, band)];
    writeFileSync(join("src/packs/summons/agents", `${dsid}.json`), JSON.stringify(actor, null, 2) + "\n");
    console.log(`wrote ${dsid} (${actorId}) stamina ${stamina}`);
  }
}

console.log("folder", FOLDER_ID);
console.log("compile", stableId("item:compile-agent"));
console.log("decompile", stableId("item:decompile-agent"));
console.log("advancement", stableId("adv:hacker-agents"));
