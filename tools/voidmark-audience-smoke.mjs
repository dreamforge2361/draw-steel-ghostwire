#!/usr/bin/env node
/**
 * B122 / S6 smoke: VOIDMARK Director-only audience filter.
 *
 * Covers the static index audience tags, the retrieve() audience filter, and the
 * pure journal-mark helpers (no Foundry, no live key).
 *
 * Run: node tools/voidmark-audience-smoke.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chunkAudience, retrieve } from "../scripts/voidmark-rag.mjs";
import {
  AUDIENCE_FLAG,
  MODULE_ID,
  OWNERSHIP,
  audienceForAsk,
  canVoidmarkUsePage,
  hasExplicitVoidmarkMark,
  isVoidmarkDirectorOnly,
  ownershipLevel,
  readAudienceFlag,
  resolveVoidmarkAudience,
} from "../scripts/voidmark-audience.mjs";
import { journalTextFromHtml, splitJournalText } from "../scripts/voidmark-journal.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INDEX_PATH = join(ROOT, "data/voidmark-rules-index.json");
const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

const index = JSON.parse(readFileSync(INDEX_PATH, "utf8"));
const sourcesOf = hits => hits.map(h => h.source || h.file).join(", ");

console.log("B122 VOIDMARK Director-only audience smoke\n");

console.log("1) Static index audience tags");
ok(index.chunks.every(c => c.audience === "player" || c.audience === "director"), "every chunk carries an audience");
ok(index.audienceCounts?.player > 0 && index.audienceCounts?.director > 0, `counts ${index.audienceCounts?.player} player / ${index.audienceCounts?.director} director`);

const directorChunks = index.chunks.filter(c => c.audience === "director");
const quietFloor = index.chunks.filter(c => /QUIET-FLOOR/.test(c.source));
ok(quietFloor.length > 0, `${quietFloor.length} Quiet Floor chunks indexed`);
ok(quietFloor.every(c => c.audience === "director"), "every Quiet Floor chunk is audience: director");
ok(
  directorChunks.every(c => /^docs\/(directors\/|manuscript\/03-directors\/)/.test(c.source)),
  "director chunks only come from docs/directors or docs/manuscript/03-directors",
);
ok(
  index.chunks.filter(c => /^docs\/directors\//.test(c.source)).every(c => c.audience === "director"),
  "every docs/directors chunk is Director-only",
);
ok(
  index.chunks.filter(c => c.file === "27-running-ossian-reach.md").every(c => c.audience === "director"),
  "Running Ossian Reach (03-directors) is Director-only",
);
ok(
  index.chunks.filter(c => /^docs\/raw\//.test(c.source)).every(c => c.audience === "player"),
  "RAW chapters stay player-facing",
);
ok(
  index.chunks.filter(c => /reach-handbook|01-lore/.test(c.source)).every(c => c.audience === "player"),
  "Reach Handbook + L-chips stay player-facing",
);
ok(index.sources?.director?.some(s => s.includes("QUIET-FLOOR-OUTLINE")), `index lists director sources: ${index.sources?.director?.length}`);

console.log("\n2) chunkAudience() defaults");
ok(chunkAudience({ audience: "director" }) === "director", "explicit director tag");
ok(chunkAudience({ audience: "player" }) === "player", "explicit player tag");
ok(chunkAudience({ source: "docs/raw/21-the-wire.md" }) === "player", "untagged RAW reads player");
ok(chunkAudience({ source: "docs/directors/campaigns/QUIET-FLOOR-OUTLINE.md" }) === "director", "untagged legacy Director path still reads director");
ok(chunkAudience({ source: "docs\\manuscript\\03-directors\\27-running-ossian-reach.md" }) === "director", "windows-slash Director path still reads director");

console.log("\n3) Retrieve filter — Director secrets");
for (const query of [
  "Quiet Floor campaign outline",
  "Quiet Floor session budget and XP pacing",
  "What is the Quiet Floor campaign shape?",
]) {
  const all = retrieve(index, query, { k: 5 });
  const player = retrieve(index, query, { k: 5, audience: "player" });
  ok(all.some(h => /QUIET-FLOOR/.test(h.source)), `Director ask "${query}" reaches Quiet Floor`);
  ok(!player.some(h => /QUIET-FLOOR/.test(h.source)), `player ask "${query}" gets no Quiet Floor (${sourcesOf(player)})`);
  ok(player.every(h => h.audience === "player"), `player ask "${query}" returns only player chunks`);
}

const reachAll = retrieve(index, "How do I run Ossian Reach as Director? session loop home hive", { k: 5 });
const reachPlayer = retrieve(index, "How do I run Ossian Reach as Director? session loop home hive", { k: 5, audience: "player" });
ok(reachAll.some(h => h.file === "27-running-ossian-reach.md"), "Director ask reaches Running Ossian Reach");
ok(!reachPlayer.some(h => h.file === "27-running-ossian-reach.md"), `player ask drops Running Ossian Reach (${sourcesOf(reachPlayer)})`);

console.log("\n4) Retrieve filter — player-safe lore still lands");
const switchboard = retrieve(index, "What is the Switchboard?", { k: 5, audience: "player" });
ok(switchboard.length >= 1, `Switchboard player ask returned ${switchboard.length} hits`);
ok(
  switchboard.some(h => /04-switchboard|L3-ossian-reach|reach-handbook/.test(`${h.file} ${h.source ?? ""}`)),
  `Switchboard player sources: ${sourcesOf(switchboard)}`,
);
const flats = retrieve(index, "What are the Wired Flats?", { k: 5, audience: "player" });
ok(flats.length >= 1, `Flats player ask returned ${flats.length} hits`);
ok(flats.some(h => /flats|ossian|reach/i.test(`${h.file} ${h.source ?? ""}`)), `Flats player sources: ${sourcesOf(flats)}`);
const wire = retrieve(index, "What's the difference between Overlay and Jacked In on the Wire?", { k: 5, audience: "player" });
ok(wire.some(h => h.file.includes("21-the-wire")), `Wire RAW still reaches players: ${sourcesOf(wire)}`);
const advancement = retrieve(index, "How do Victories become XP at a respite?", { k: 5, audience: "player" });
ok(advancement.some(h => h.file.includes("24-advancement")), `RAW advancement still reaches players: ${sourcesOf(advancement)}`);

console.log("\n5) Journal mark helpers — explicit / inherit / override");
const flagged = value => ({ flags: { [MODULE_ID]: { [AUDIENCE_FLAG]: value } } });
const players = [{ id: "u1", isGM: false }, { id: "u2", isGM: false }];
const gm = { id: "gm", isGM: true };
const player = players[0];

ok(readAudienceFlag(flagged("director")) === "director", "reads explicit director flag");
ok(readAudienceFlag(flagged("player")) === "player", "reads explicit player flag");
ok(readAudienceFlag({}) === null, "unflagged doc reads null");
ok(readAudienceFlag(flagged("nonsense")) === null, "junk flag value reads null");
ok(hasExplicitVoidmarkMark(flagged("player")) && !hasExplicitVoidmarkMark({}), "hasExplicitVoidmarkMark distinguishes marked docs");

const sharedEntry = { name: "Street rumours", ownership: { default: OWNERSHIP.OBSERVER }, pages: [] };
const secretEntry = { name: "Director notes", ownership: { default: OWNERSHIP.NONE }, pages: [] };
ok(!isVoidmarkDirectorOnly(sharedEntry, { users: players }), "unmarked + player-observable entry inherits player");
ok(isVoidmarkDirectorOnly(secretEntry, { users: players }), "unmarked + GM-only entry inherits director");
ok(
  !isVoidmarkDirectorOnly({ ownership: { default: OWNERSHIP.NONE, u1: OWNERSHIP.LIMITED } }, { users: players }),
  "one player at LIMITED is enough to inherit player",
);
ok(isVoidmarkDirectorOnly({ ...sharedEntry, ...flagged("director") }, { users: players }), "explicit director beats open ownership");

const openPage = { name: "Open page", ownership: { default: OWNERSHIP.INHERIT } };
ok(!isVoidmarkDirectorOnly(openPage, { parent: sharedEntry, users: players }), "page inherits player from its entry");
ok(isVoidmarkDirectorOnly(openPage, { parent: secretEntry, users: players }), "page inherits director from its entry");
ok(
  isVoidmarkDirectorOnly({ ...openPage, ...flagged("director") }, { parent: sharedEntry, users: players }),
  "page mark overrides a player-safe entry",
);
ok(
  !isVoidmarkDirectorOnly({ ...openPage, ...flagged("player") }, { parent: { ...secretEntry, ...flagged("director") }, users: players }),
  "page mark overrides a Director-only entry",
);
ok(
  resolveVoidmarkAudience({ ...openPage, parent: { ...sharedEntry, ...flagged("director") } }, { users: players }) === "director",
  "resolve falls back to doc.parent when no parent passed",
);

console.log("\n6) Ownership never bypassed");
ok(ownershipLevel(sharedEntry, gm) === OWNERSHIP.OWNER, "GM is always OWNER");
ok(ownershipLevel(openPage, player, { parent: sharedEntry }) === OWNERSHIP.OBSERVER, "page INHERIT resolves to entry ownership");
ok(ownershipLevel(openPage, player, { parent: secretEntry }) === OWNERSHIP.NONE, "page INHERIT off a closed entry is NONE");
ok(ownershipLevel({ ownership: { default: OWNERSHIP.NONE, u1: OWNERSHIP.OWNER } }, player) === OWNERSHIP.OWNER, "per-user ownership wins over default");

console.log("\n7) audienceForAsk() — only GM + Director mode hears secrets");
ok(audienceForAsk({ user: gm, mode: "director" }) === "all", "GM + Director = all");
ok(audienceForAsk({ user: gm, mode: "runner" }) === "player", "GM + Runner = player");
ok(audienceForAsk({ user: player, mode: "director" }) === "player", "player claiming Director mode = player");
ok(audienceForAsk({ user: player, mode: "runner" }) === "player", "player + Runner = player");
ok(audienceForAsk({ user: gm, mode: "director", forcePlayer: true }) === "player", "relay ask forces player audience");

console.log("\n8) canVoidmarkUsePage()");
const openPageOnShared = { name: "Open page", ownership: { default: OWNERSHIP.INHERIT }, parent: sharedEntry };
const markedPage = { name: "Twist", ownership: { default: OWNERSHIP.OBSERVER }, ...flagged("director") };
const limitedPage = { name: "Teaser", ownership: { default: OWNERSHIP.LIMITED } };

ok(canVoidmarkUsePage(player, openPageOnShared, { mode: "runner", entry: sharedEntry, users: players }), "player reads a shared, unmarked page");
ok(!canVoidmarkUsePage(player, markedPage, { mode: "runner", entry: sharedEntry, users: players }), "player never reads a Director-marked page");
ok(!canVoidmarkUsePage(player, markedPage, { mode: "director", entry: sharedEntry, users: players }), "player claiming Director mode still blocked");
ok(!canVoidmarkUsePage(player, limitedPage, { mode: "runner", entry: sharedEntry, users: players }), "LIMITED ownership is not enough to read page text");
ok(!canVoidmarkUsePage(player, { name: "Hidden", ownership: { default: OWNERSHIP.NONE } }, { mode: "runner", entry: secretEntry, users: players }), "unowned page stays hidden");
ok(canVoidmarkUsePage(gm, markedPage, { mode: "director", entry: sharedEntry, users: players }), "GM in Director mode reads the marked page");
ok(!canVoidmarkUsePage(gm, markedPage, { mode: "runner", entry: sharedEntry, users: players }), "GM in Runner mode stays street-safe");
ok(!canVoidmarkUsePage(gm, markedPage, { mode: "director", entry: sharedEntry, users: players, forcePlayer: true }), "relay ask cannot unlock a marked page");
ok(canVoidmarkUsePage(gm, openPageOnShared, { mode: "runner", entry: sharedEntry, users: players }), "GM in Runner mode still reads player-safe pages");
ok(!canVoidmarkUsePage(null, openPageOnShared, { mode: "director" }), "no user = no page");
ok(!canVoidmarkUsePage(gm, null, { mode: "director" }), "no page = no hit");

console.log("\n9) World-journal chunking (pure side)");
ok(journalTextFromHtml("<h2>Twist</h2><p>The floor is <strong>not</strong> quiet.</p>") === "Twist\n\nThe floor is not quiet.", "HTML blocks become paragraph breaks");
ok(journalTextFromHtml("<p>a</p><ul><li>one</li><li>two</li></ul>") === "a\n\none\n\ntwo", "list items separate");
ok(journalTextFromHtml("   ") === "", "blank page yields no text");
const longPage = journalTextFromHtml(`<p>${"a".repeat(1700)}</p><p>${"b".repeat(300)}</p>`);
const longChunks = splitJournalText(longPage);
ok(longChunks.length === 2 && longChunks.every(c => c.length <= 1600), `oversized page splits into ${longChunks.length} chunks`);
ok(longChunks.join("").length >= longPage.replace(/\n/g, "").length - 2, "splitting an oversized page loses nothing");
ok(splitJournalText("The VP is a clone.").length === 1, "a one-line page still produces a chunk");
ok(splitJournalText("").length === 0, "empty text produces no chunks");

console.log("\n10) Merged retrieve — world journal + static index");
const journalChunks = [
  {
    id: "journal.j1.p1#1", file: "journal:Quiet Floor prep", source: "Journal — Quiet Floor prep",
    chapter: "Quiet Floor prep", heading: "The twist", kind: "journal", audience: "director",
    text: "The Quiet Floor auditor is a Hollowed double. Switchboard sold the crew out three nights before the run.",
  },
  {
    id: "journal.j1.p2#1", file: "journal:Table handout", source: "Journal — Table handout",
    chapter: "Table handout", heading: "Job board", kind: "journal", audience: "player",
    text: "Switchboard is hiring for a quiet floor job: a clean extraction, no noise, payment on delivery at Mama Cassavir's.",
  },
];
const mergedAll = retrieve([...index.chunks, ...journalChunks], "Who is the Quiet Floor auditor really?", { k: 5 });
const mergedPlayer = retrieve([...index.chunks, ...journalChunks], "Who is the Quiet Floor auditor really?", { k: 5, audience: "player" });
ok(mergedAll.some(h => h.id === "journal.j1.p1#1"), "Director ask reaches the marked world-journal page");
ok(!mergedPlayer.some(h => h.id === "journal.j1.p1#1"), `player ask never sees the marked page (${sourcesOf(mergedPlayer)})`);
const handout = retrieve([...index.chunks, ...journalChunks], "What job is Switchboard hiring for at the quiet floor?", { k: 5, audience: "player" });
ok(handout.some(h => h.id === "journal.j1.p2#1"), `player ask still reaches the player-safe world journal (${sourcesOf(handout)})`);

console.log("");
if (failures.length) {
  console.error(`FAILED (${failures.length})`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("B122 VOIDMARK audience smoke passed");
