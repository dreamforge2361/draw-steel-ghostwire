// VOIDMARK knowledge RAG — embedding-free lexical retrieve over the shipped index.
// No Foundry globals. Used by the chat applet and by tools/voidmark-smoke.mjs.
//
// B122 / S6: chunks carry `audience: "player" | "director"`. Pass
// `{ audience: "player" }` to retrieve() and Director campaign aids drop out.

const STOP = new Set([
  "a", "an", "the", "and", "or", "but", "if", "then", "than", "to", "of", "in", "on", "for", "from",
  "with", "without", "as", "at", "by", "is", "are", "was", "were", "be", "been", "being", "it", "its",
  "this", "that", "these", "those", "you", "your", "we", "they", "them", "their", "he", "she", "his",
  "her", "not", "no", "nor", "so", "do", "does", "did", "done", "can", "could", "should", "would",
  "may", "might", "will", "just", "into", "over", "under", "out", "up", "down", "about", "when",
  "what", "which", "who", "how", "why", "also", "only", "more", "most", "some", "any", "each",
  "other", "into", "via", "per", "vs",
]);

/** Street / procedure synonyms so a short table question still hits the right chapter. */
const SYNONYMS = {
  overlay: ["overlay", "overlaid", "connection", "wired", "ar", "linked"],
  jacked: ["jacked", "jack", "immersed", "immersion", "wired"],
  linked: ["linked", "link", "comms", "broadcast", "connection", "wired", "connect"],
  connect: ["connect", "connection", "linked", "overlay", "wired"],
  connection: ["connection", "connect", "linked", "overlay", "wired"],
  wire: ["wire", "wired", "matrix", "node", "host", "ice", "trace", "deck", "persona", "linked"],
  matrix: ["wire", "wired", "node", "verb", "program", "payload", "suite"],
  combat: ["combat", "fight", "round", "turn", "stamina", "recovery", "strike"],
  fight: ["combat", "round", "turn", "stamina"],
  chrome: ["chrome", "implant", "integrity"],
  implant: ["chrome", "integrity"],
  drone: ["machine", "drone", "rigger", "jump"],
  vehicle: ["machine", "vehicle", "drive", "hover"],
  hover: ["hover", "hovercraft", "limiter", "pov"],
  hovercraft: ["hover", "hovercraft", "limiter", "pov"],
  pov: ["pov", "hover", "hovercraft", "street"],
  limiter: ["limiter", "hover", "altitude"],
  chopper: ["chopper", "bike", "hover"],
  hauler: ["hauler", "cargo", "tires", "ground"],
  vtol: ["vtol", "flying", "air"],
  voidmark: ["voidmark", "mark", "mer", "blacklight"],
  accords: ["hands", "accords", "actuator", "ai"],
  hands: ["hands", "accords", "actuator"],
  recovery: ["recovery", "stamina", "combat", "catch"],
  stamina: ["stamina", "combat", "recovery", "crisis"],
  trace: ["trace", "alert", "ice", "wired"],
  ice: ["ice", "wired", "node", "biofeedback"],
  ping: ["ping", "nudge", "verb"],
  agent: ["agent", "agents", "compile", "hacker", "daemon", "probe", "spike", "watchdog", "bandwidth"],
  // 0.3.134 (G7) — the three synonym families the summon questions kept missing.
  // Ghostwire calls `lightning` damage **electrical** on every gear card, so a player asking about
  // their "electrical zephyr" was using the word the game taught them and hitting nothing.
  electrical: ["electrical", "electric", "shock", "lightning", "storm", "arc"],
  electric: ["electric", "electrical", "shock", "lightning"],
  shock: ["shock", "electrical", "lightning", "taser"],
  lightning: ["lightning", "electrical", "electric", "shock", "storm"],
  // "Attack" is the word every player uses; "strike" is the word the rules use.
  attack: ["attack", "strike", "hit", "damage"],
  strike: ["strike", "attack", "signature", "damage"],
  // Summons, by every name a table calls them.
  summon: ["summon", "companion", "pet", "elemental", "spirit", "sprite", "conjure", "bind", "command"],
  companion: ["companion", "summon", "pet", "elemental", "zephyr", "ember", "boulder"],
  pet: ["pet", "companion", "summon", "construct", "drone"],
  elemental: ["elemental", "summon", "companion", "element", "rank", "bound"],
  spirit: ["spirit", "summon", "pact", "guardian", "warrior", "hunter", "companion"],
  zephyr: ["zephyr", "companion", "summon", "elemental", "stormcaller"],
  ember: ["ember", "companion", "summon", "elemental", "pyromancer"],
  boulder: ["boulder", "companion", "summon", "elemental", "geomancer"],
  command: ["command", "order", "maneuver", "summon", "companion"],
  probe: ["probe", "agent", "recon", "hacker", "scan"],
  spike: ["spike", "agent", "integrity", "hacker"],
  daemon: ["daemon", "agent", "puppet", "hacker"],
  watchdog: ["watchdog", "agent", "trace", "hacker"],
  compile: ["compile", "agent", "hacker"],
  decompile: ["decompile", "agent", "hacker"],
  biofeedback: ["biofeedback", "wired", "jacked", "overlay"],
  switchboard: ["switchboard", "cassavir", "fixer"],
  cassavir: ["cassavir", "switchboard", "mama"],
  shambles: ["shambles", "neon"],
  neon: ["neon", "shambles"],
  flats: ["flats", "ossian", "reach", "hive"],
  ossian: ["ossian", "reach", "flats"],
  slackwater: ["slackwater", "docks", "blackwater"],
  cinderhold: ["cinderhold", "gate", "marrow"],
  glasshook: ["glasshook"],
  wireside: ["wireside"],
  gallows: ["gallows"],
  spillway: ["spillway"],
  interchange: ["interchange"],
};

/**
 * Chapter hints: a query that *mentions* a chapter's subject gets that chapter's chunks boosted.
 *
 * 0.3.134 (G7) — **every pattern is word-bounded now.** The first rule's bare `ice` matched "price",
 * "device", "service", "notice" and "voice", so "what's the price of a device" cited The Wire; the
 * combat rule's bare `round` matched "background" and "surrounding"; the mods rule's bare `mod`
 * matched "model", "modern" and "module"; and the Veil rule's bare `pact` matched "impact". Every
 * one of those was a hint firing on a word the asker never typed.
 */
const FILE_HINTS = [
  { re: /\bwired?\b|\bmatrix\b|\boverlay\b|\bjacke?d?\b|\blinked\b|\bconnect(?:ion|ed)?\b|\bnodes?\b|\bice\b|\btraces?\b|\bbiofeedback\b|\bdecks?\b|\bpersonas?\b|\bpayloads?\b|\bsuites?\b|\bping\b/, file: "21-the-wire" },
  { re: /\bcombat\b|\bfights?\b|\brounds?\b|\bstamina\b|\brecover(?:y|ies)\b|\bcrisis\b|\bstrikes?\b|\bfire\b|\bmaneuvers?\b/, file: "04-combat" },
  { re: /power.?roll|\btests?\b|\bedges?\b|\bbanes?\b|\bfortune\b|\bcharacteristics?\b/, file: "03-tests-power-rolls" },
  { re: /\bchrome\b|\bimplants?\b|\bbody integrity\b|\bweave\b/, file: "09-chrome-body-integrity" },
  { re: /\bkits?\b|\bgear\b|\bnuyen\b|\bwealth\b|\barmou?r\b|\bweapons?\b/, file: "08-kits-gear-wealth" },
  { re: /\bmachines?\b|\bdrones?\b|\bvehicles?\b|\briggers?\b|\bjump-?in\b|\brcc\b/, file: "23-machines" },
  { re: /\bhovercraft\b|\baltitude limiter\b|street.?pov|\bpov\b|\blane-hopper\b|\bstar-chopper\b|hover bike|hover.?car|limiter band/, file: "L1-setting-primer" },
  { re: /\bhovercraft\b|\baltitude limiter\b|street.?pov|\blane-hopper\b|\bstar-chopper\b|how the flats move/, file: "03-life-on-the-flats" },
  { re: /\bbulldog\b|heavy hauler|cargo van|ground-hauler/, file: "L1-setting-primer" },
  { re: /hover \/ pov|ground-hauler|\bvtol\b|limiter band/, file: "28-glossary-slang" },
  { re: /\bmods?\b|\bautosofts?\b|\binstall(?:ing|ed)?\b/, file: "10-mods" },
  { re: /\bhackers?\b|\bbandwidth\b|\bprograms?\b|compile agent|decompile agent|\bagents?\b|probe agent|spike agent|daemon agent|watchdog agent|integrity spike/, file: "19-hacker" },
  { re: /\bvoidmark\b|\bthe mark\b|\bblacklight\b/, file: "L4-voidmark" },
  { re: /hands off|\baccords?\b|\bactuators?\b/, file: "L5-hands-off-accords" },
  { re: /\blifestyle\b|\bdowntime\b|\brespite\b|\bupkeep\b/, file: "26-lifestyle-downtime" },
  { re: /\bveil\b|\bessence\b|\bpacts?\b|\bsprites?\b|\brituals?\b|\bmagnitude\b|\bsealing\b/, file: "22-the-veil" },
  // 0.3.134 (G7): the summons pack, rendered into docs/raw by tools/gen-summon-statblocks.mjs. Without
  // this, "how do I make my electrical zephyr attack?" had no chapter to land in at all.
  { re: /\bsummons?\b|\bcompanions?\b|\bzephyrs?\b|\bembers?\b|\bboulders?\b|\belementals?\b|\bspirits?\b|stat.?blocks?|\bwarding aegis\b|\bguardian\b/, file: "29-summon-stat-blocks" },
  { re: /\belementalist\b|\battunement\b|hurl element|elemental shaping/, file: "17-elementalist" },
  { re: /street.?priest|\bconviction\b|invoke the pact|lay on hands/, file: "18-street-priest" },
  { re: /\bconstructs?\b|\bpets?\b|action economy|\bextension\b|\bindependent\b/, file: "28-constructs-pets-faq" },
  { re: /\bswitchboard\b|\bcassavir\b/, file: "04-switchboard" },
  { re: /neon shambles|\bshambles\b/, file: "05-the-neon-shambles" },
  { re: /\bstacks\b/, file: "06-the-stacks" },
  { re: /\bslackwater\b/, file: "07-slackwater" },
  { re: /\binterchange\b/, file: "08-the-interchange" },
  { re: /cinder market/, file: "09-cinder-market" },
  { re: /\bspillway\b/, file: "10-the-spillway" },
  { re: /\bglasshook\b/, file: "11-glasshook" },
  { re: /\bwireside\b/, file: "12-wireside" },
  { re: /gallows end|\bgallows\b/, file: "13-gallows-end" },
  { re: /\bcinderhold\b|outer gate|cael marrow/, file: "14-cinderhold-and-the-outer-gate" },
  { re: /night roster/, file: "15-the-night-roster" },
  { re: /what the flats are|(?:^|\b)the flats\b|ossian reach/, file: "01-what-the-flats-are" },
  { re: /ossian reach|reach color|street color|(?:^|\b)the flats\b/, file: "L3-ossian-reach-color" },
  { re: /wired flats|matrix gazetteer|master node/, file: "wired-flats-gazetteer" },
  { re: /running ossian|session loop|home hive/, file: "27-running-ossian-reach" },
  { re: /\bpeoples?\b|\belvani\b|\bcorran\b|\bgoliar\b|\bfounding\b/, file: "L2-peoples-and-world" },
  { re: /\bcosmology\b|the light\b|dark one\b|\bmegacorps?\b|the ten\b/, file: "L1-setting-primer" },
];

const PLACE_PHRASES = [
  "mama cassavir",
  "neon shambles",
  "ossian reach",
  "gallows end",
  "cinder market",
  "night roster",
  "deadfall nine",
  "quiet floor",
  "the interchange",
  "the spillway",
  "the stacks",
  "the flats",
  "outer gate",
  "black water",
  "switchboard",
  "slackwater",
  "cinderhold",
  "glasshook",
  "wireside",
  "cassavir",
  "ashenreach",
].sort((a, b) => b.length - a.length);

/** Procedure / SKU phrases so “Wire Kit” / “Compile Agent” beat generic Wire chunks. */
const LOCK_PHRASES = [
  "compile agent",
  "decompile agent",
  "watchdog agent",
  "watchdog ice",
  "rigger's harness",
  "rigger’s harness",
  "wire kit",
  "pack drones",
  "pack vehicles",
].sort((a, b) => b.length - a.length);

/** Belt-and-braces: Director source paths, so a stale index without `audience` still filters. */
const DIRECTOR_SOURCE_RE = /^docs\/(?:directors\/|manuscript\/03-directors\/)/;

const LOREISH = /lore|district|hive|gazetteer|who is|what is|where is|ossian|flats|reach handbook|street color/;

/**
 * Audience tag for one chunk. Untagged chunks read as player-safe unless the
 * source path says otherwise (legacy indexes built before B122).
 * @returns {"player"|"director"}
 */
export function chunkAudience(chunk) {
  const tagged = String(chunk?.audience ?? "").toLowerCase();
  if (tagged === "director" || tagged === "player") return tagged;
  const source = String(chunk?.source ?? "").replaceAll("\\", "/");
  return DIRECTOR_SOURCE_RE.test(source) ? "director" : "player";
}

export function tokenize(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .split(/[^a-z0-9]+/g)
    .map(stem)
    .filter(t => t.length > 1 && !STOP.has(t) && !/^\d+$/.test(t));
}

function stem(token) {
  if (token.length <= 3) return token;
  if (token.endsWith("ing") && token.length > 6) return token.slice(0, -3);
  if (token.endsWith("ed") && token.length > 5) return token.slice(0, -2);
  if (token.endsWith("es") && token.length > 5) return token.slice(0, -2);
  if (token.endsWith("s") && !token.endsWith("ss") && token.length > 4) return token.slice(0, -1);
  return token;
}

function expandQuery(tokens) {
  const extra = [];
  for (const token of tokens) {
    const syns = SYNONYMS[token];
    if (syns) extra.push(...syns.map(stem));
  }
  return [...new Set([...tokens, ...extra])];
}

function hintedFiles(query) {
  const q = String(query ?? "").toLowerCase();
  return FILE_HINTS.filter(h => h.re.test(q)).map(h => h.file);
}

/** Place / district phrases present in the query (lowercase). */
export function placePhrases(query) {
  const q = String(query ?? "").toLowerCase();
  return PLACE_PHRASES.filter(p => q.includes(p));
}

function sourceHay(chunk) {
  return `${chunk.file ?? ""} ${chunk.source ?? ""} ${chunk.chapter ?? ""} ${chunk.heading ?? ""}`.toLowerCase();
}

/**
 * Score one index chunk against a query.
 * @param {{ file?: string, source?: string, chapter?: string, heading?: string, text?: string, kind?: string }} chunk
 * @param {string} query
 */
export function scoreChunk(chunk, query) {
  const rawTokens = tokenize(query);
  if (!rawTokens.length) return 0;
  const tokens = expandQuery(rawTokens);
  const textTokens = tokenize(chunk.text);
  if (!textTokens.length) return 0;

  const tf = new Map();
  for (const t of textTokens) tf.set(t, (tf.get(t) ?? 0) + 1);

  const headingTokens = new Set(tokenize(`${chunk.heading ?? ""} ${chunk.chapter ?? ""}`));
  const fileTokens = new Set(tokenize(String(chunk.file ?? "").replace(/\.md$/i, "")));
  const hints = hintedFiles(query);
  const places = placePhrases(query);
  const qLower = String(query ?? "").toLowerCase();
  const locks = LOCK_PHRASES.filter(p => qLower.includes(p));
  const titleHay = sourceHay(chunk);
  const bodyHay = String(chunk.text ?? "").toLowerCase();

  let score = 0;
  let hits = 0;
  let headingHits = 0;
  for (const token of tokens) {
    const n = tf.get(token) ?? 0;
    if (n) {
      hits += 1;
      score += 1 + Math.log2(1 + n);
    }
    if (headingTokens.has(token)) {
      headingHits += 1;
      score += 3;
    }
    if (fileTokens.has(token)) score += 2;
  }
  if (!hits) return 0;
  if (headingHits >= 2) score += 6;
  if (hints.some(h => String(chunk.file ?? "").includes(h) || String(chunk.source ?? "").includes(h))) score += 4;

  for (const place of places) {
    if (titleHay.includes(place)) score += 12;
    else if (bodyHay.includes(place)) score += 5;
  }

  for (const lock of locks) {
    if (titleHay.includes(lock)) score += 12;
    else if (bodyHay.includes(lock)) score += 8;
  }

  if (LOREISH.test(String(query ?? "").toLowerCase()) && (chunk.kind === "lore" || chunk.kind === "setting")) {
    score += 2;
  }

  score *= 1 + (hits / tokens.length);
  return score;
}

/**
 * 0.3.134 (G7) — the string retrieval actually searches on.
 *
 * Three problems, one fix:
 *
 *  * **Follow-ups retrieved nothing useful.** "how do I make my electrical zephyr attack?" followed by
 *    "and how much damage?" searched for *damage* alone, which matches every chapter in the book. The
 *    **previous user turn** is folded in, at lower weight (it is appended once, so it contributes
 *    tokens without out-voting the actual question).
 *  * **The selected token was invisible to retrieve.** A player with an Electrical Zephyr selected and
 *    a question about "it" gave retrieve the word "it". The selected token's **name, actor type and
 *    dsid** are folded in too.
 *  * The *prompt* the model sees is unchanged — this only widens what gets fetched for it.
 *
 * @param {object} spec
 * @param {string} spec.query                 The current message.
 * @param {Array<{role: string, content: string}>} [spec.history]  Oldest-first; the last **user**
 *                                            turn before this one is the one that carries context.
 * @param {{name?: string, type?: string, dsid?: string}|null} [spec.token]  The selected token.
 * @returns {string}
 */
export function retrievalQuery({ query, history = [], token = null } = {}) {
  const parts = [String(query ?? "").trim()];
  const priorUser = [...(history ?? [])].reverse().find(turn => turn?.role === "user" && String(turn.content ?? "").trim());
  if (priorUser) parts.push(String(priorUser.content).trim().slice(0, 400));
  if (token) {
    parts.push([token.name, token.type, token.dsid].filter(Boolean).join(" "));
  }
  return parts.filter(Boolean).join(" ").trim();
}

/**
 * @param {{ chunks?: object[] } | object[]} index
 * @param {string} query
 * @param {{ k?: number, maxChars?: number, audience?: "player"|"all" }} [options]
 *   audience "player" drops Director-only chunks. Default "all" (back-compat).
 */
export function retrieve(index, query, options = {}) {
  const chunks = Array.isArray(index) ? index : (index?.chunks ?? []);
  const k = Math.max(1, Number(options.k) || 5);
  const maxChars = Math.max(400, Number(options.maxChars) || 5500);
  const audience = String(options.audience ?? "all").toLowerCase() === "player" ? "player" : "all";
  const ranked = chunks
    .filter(chunk => audience === "all" || chunkAudience(chunk) !== "director")
    .map(chunk => ({ chunk, score: scoreChunk(chunk, query) }))
    .filter(row => row.score > 0)
    .sort((a, b) => b.score - a.score || String(a.chunk.id).localeCompare(String(b.chunk.id)));

  const picked = [];
  let used = 0;
  for (const row of ranked) {
    if (picked.length >= k) break;
    const text = String(row.chunk.text ?? "");
    if (!text) continue;
    if (text.length > maxChars) continue;
    if (picked.length && (used + text.length > maxChars)) continue;
    picked.push({
      id: row.chunk.id,
      file: row.chunk.file,
      source: row.chunk.source,
      chapter: row.chunk.chapter,
      heading: row.chunk.heading,
      kind: row.chunk.kind ?? "rules",
      audience: chunkAudience(row.chunk),
      text,
      score: Math.round(row.score * 100) / 100,
    });
    used += text.length;
  }
  return picked;
}

/** Director-facing citation chips (Ghostwire chapter titles only). */
export function citationLabels(hits) {
  const seen = new Set();
  const labels = [];
  for (const hit of hits) {
    const label = [hit.chapter, hit.heading].filter(Boolean).join(" — ") || hit.file;
    if (!label || seen.has(label)) continue;
    seen.add(label);
    labels.push(label);
  }
  return labels;
}
