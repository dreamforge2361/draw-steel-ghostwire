// VOIDMARK knowledge RAG — embedding-free lexical retrieve over the shipped index.
// No Foundry globals. Used by the chat applet and by tools/voidmark-smoke.mjs.
//
// B122 / S6: chunks carry `audience: "player" | "director"`. Pass
// `{ audience: "player" }` to retrieve() and Director campaign aids drop out.
//
// 0.3.135 (3) — four changes, all of them about **the question in front of you**:
//
//   * **Current-query-first retrieval** (`retrieveConversational`). 0.3.134 folded the previous user
//     turn into one search string, which fixed bare follow-ups ("and how much damage?") and broke
//     topic changes: ask about a summon and then ask "what does ward the room do?", and the summon
//     words out-scored the Working by four to one — Ward came back fourth behind three summon chunks,
//     and the table's workaround was to hit **Clear thread** between topics. Michael's lock is that no
//     Clear should ever be required. So the current question is scored **on its own** and gets the top
//     slots reserved; continuity from prior turns only fills what is left.
//   * **Per-source quotas**, so one topic — one chapter, one card — cannot eat all five chunks.
//   * **Class-aware routing** (`classRoute`). "Spirit" means a pact spirit to a Street Priest and a
//     bound elemental to an Elementalist, and the flat `spirit` synonym list sent every Elementalist
//     asking about their electrical spirit to the Guardian / Hunter / Warrior pact blocks.
//   * **Clarifying questions** (`clarification`). When the top hits are weak or tied and the asker
//     never named a card, "did you mean X, or Y?" is the honest answer — not a guess, and not "that
//     packet is not on this channel", which is for an empty retrieve and nothing else.

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

/* ------------------------------------------------------------------ 0.3.135 (3c) class routing */

/**
 * The summons an **Elementalist** can be talking about, and the ones they cannot.
 *
 * These are name fragments matched against a chunk's file / chapter / heading, not dsids, because the
 * same creature is described in three places — the generated stat-block chapter, the class chapter and
 * the pack entry — and all three should move together.
 */
const ELEMENTALIST_SUMMONS = Object.freeze([
  "bound elemental", "greater elemental", "elemental rank", "zephyr", "ember companion", "boulder companion",
]);
/** With an electrical / lightning question, the Zephyr and the bound elemental are the whole answer. */
const ELECTRICAL_SUMMONS = Object.freeze([
  "zephyr", "bound elemental", "elemental rank", "greater elemental", "stormcaller",
]);
/** Street Priest pact spirits. Never the answer to an Elementalist's question. */
const PACT_SPIRITS = Object.freeze(["guardian spirit", "hunter spirit", "warrior spirit", "pact spirit"]);

const ELEMENTALIST_RE = /\belementalist\b|\battunement\b|\battuned\b|\bhurl element\b|\belemental shaping\b|\bbound elemental\b|\bstormcaller\b|\bpyromancer\b|\bgeomancer\b|\bessence\b/;
const PRIEST_RE = /street.?priest\b|\bpriest\b|invoke (?:the )?pact\b|\bconviction\b|\bpact spirits?\b|lay on hands\b|\bshepherd\b/;
const SUMMONISH_RE = /\bspirits?\b|\bsummon(?:s|ed|ing)?\b|\belementals?\b|\bcompanions?\b|\bzephyrs?\b|\bembers?\b|\bboulders?\b/;
const ELECTRICAL_RE = /\belectric(?:al)?\b|\blightning\b|\bshock\b|\bstorm\b|\barc\b|\bzephyr\b|\bthunder\b/;

/**
 * Phrases that name an Elementalist summon on their own, whether or not the class is mentioned.
 *
 * Locked aliases for 0.3.135 (3c). No Street Priest pact spirit is electrical — Guardian, Hunter and
 * Warrior are Light/Dark pact creatures — so "my electrical spirit" can only be a Zephyr or a bound
 * elemental, and a player who says it should not have to add "I am an elementalist" first. Michael's
 * own question did add it; the alias is what makes the short form work too.
 */
const ELEMENTAL_ALIAS_RE = /\belectrical spirit\b|\belectric spirit\b|\blightning spirit\b|\bshock spirit\b|\bstorm spirit\b|\belectrical zephyr\b|\blightning zephyr\b|\belectrical elemental\b/;

/**
 * Which summon family a question is about, or `null` when it is not that kind of question.
 *
 * @param {string} query
 * @returns {{kind: string, boost: readonly string[], demote: readonly string[], terms: string[]}|null}
 */
export function classRoute(query) {
  const q = String(query ?? "").toLowerCase();
  const alias = ELEMENTAL_ALIAS_RE.test(q);
  const priest = PRIEST_RE.test(q);
  const elementalist = alias || ELEMENTALIST_RE.test(q);
  const summonish = alias || SUMMONISH_RE.test(q);
  if (!summonish) return null;
  // Priest context wins when it is explicit: a Shepherd asking about "my spirit" means their pact.
  if (priest && !alias) {
    return { kind: "pactSpirit", boost: PACT_SPIRITS, demote: [], terms: ["pact", "spirit", "conviction"] };
  }
  if (!elementalist) return null;
  const electrical = alias || ELECTRICAL_RE.test(q);
  return {
    kind: "elementalistSummon",
    boost: electrical ? ELECTRICAL_SUMMONS : ELEMENTALIST_SUMMONS,
    demote: PACT_SPIRITS,
    terms: electrical
      ? ["zephyr", "elemental", "bound", "electrical", "lightning", "attunement"]
      : ["elemental", "companion", "bound", "attunement"],
  };
}

/** The synonym words a class route takes *off* the table — the other class's vocabulary. */
const ROUTE_DROPS = Object.freeze({
  elementalistSummon: Object.freeze(["pact", "guardian", "warrior", "hunter"]),
  pactSpirit: Object.freeze(["elemental", "zephyr", "ember", "boulder"]),
});

/**
 * Does `query` contain `phrase` as whole words? Used for exact-entity matching, where a substring hit
 * ("rally" inside "rallying") would boost the wrong card.
 *
 * Index arithmetic rather than a built regex: this runs once per chunk per query, 2000+ times a turn.
 */
export function phraseInQuery(query, phrase) {
  const hay = String(query ?? "").toLowerCase();
  const needle = String(phrase ?? "").toLowerCase().trim();
  if (needle.length < 5 || !hay) return false;
  const edge = char => !char || !/[a-z0-9]/.test(char);
  for (let at = hay.indexOf(needle); at !== -1; at = hay.indexOf(needle, at + 1)) {
    if (edge(hay[at - 1]) && edge(hay[at + needle.length])) return true;
  }
  return false;
}

/** `elemental-rank-3` → `elemental rank 3`, so a dsid can be matched against a printed heading. */
const dsidWords = dsid => String(dsid ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

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

/**
 * Query tokens plus their synonyms, with the other class's vocabulary removed.
 *
 * 0.3.135 (3c): `SYNONYMS.spirit` expands to `pact`, `guardian`, `warrior` and `hunter`, which is
 * right for a Street Priest and exactly backwards for an Elementalist — those four words are what put
 * the Hunter Spirit block at the top of "my electrical spirit" every time. The route says which class
 * is asking; the expansion follows it.
 *
 * @param {string[]} tokens
 * @param {object|null} [route]  From {@link classRoute}.
 */
function expandQuery(tokens, route = null) {
  const drop = new Set(ROUTE_DROPS[route?.kind] ?? []);
  const extra = [];
  for (const token of tokens) {
    const syns = SYNONYMS[token];
    if (syns) extra.push(...syns.filter(syn => !drop.has(syn)).map(stem));
  }
  if (route?.terms?.length) extra.push(...route.terms.map(stem));
  // A word the asker typed themselves is never dropped — only the synonyms we added for them.
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
 *
 * @param {{ file?: string, source?: string, chapter?: string, heading?: string, text?: string,
 *           kind?: string, entity?: string, entityDsid?: string }} chunk
 * @param {string} query
 * @param {{ route?: object|null, token?: {name?: string, type?: string, dsid?: string}|null }} [options]
 *   `route` from {@link classRoute} — passed in by `retrieve` / `retrieveConversational` so it is
 *   computed once per query rather than once per chunk. `token` is the asker's selected token.
 */
export function scoreChunk(chunk, query, options = {}) {
  const rawTokens = tokenize(query);
  if (!rawTokens.length) return 0;
  const route = (options.route === undefined) ? classRoute(query) : options.route;
  const tokens = expandQuery(rawTokens, route);
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

  // 0.3.135 (3a) — the asker named this card. A pack entry carries the printed name in `entity`, and a
  // question that contains it whole ("what does **ward the room** do?") should not have to out-score
  // three paragraphs of Veil prose on word frequency alone.
  if (chunk.entity && phraseInQuery(qLower, chunk.entity)) score += 25;

  // 0.3.135 (3c) — the selected token. An exact `dsid` match is the strongest signal there is: the
  // asker is looking at the thing. A dsid whose words appear in the heading ("elemental rank 3") is
  // the same creature reached from the generated chapter rather than the pack entry.
  const selected = options.token ?? null;
  if (selected?.dsid) {
    const dsid = String(selected.dsid).toLowerCase();
    if (chunk.entityDsid && (String(chunk.entityDsid).toLowerCase() === dsid)) score += 22;
    else {
      const words = dsidWords(dsid);
      const titleWords = titleHay.replace(/[^a-z0-9]+/g, " ").trim();
      if (words && words.length > 4 && titleWords.includes(words)) score += 10;
    }
  }

  // 0.3.135 (3c) — route the summon question to the right class's creatures.
  if (route) {
    if (route.boost.some(name => titleHay.includes(name))) score += 16;
    else if (route.boost.some(name => bodyHay.includes(name))) score += 5;
  }

  score *= 1 + (hits / tokens.length);

  // The other class's creatures are not wrong, they are somebody else's answer: pushed down, not out,
  // so a Director asking a comparative question can still reach them.
  if (route?.demote?.length && route.demote.some(name => titleHay.includes(name))) score *= 0.2;
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

/** One ranked chunk as the shape every consumer (prompt, citations, smoke) reads. */
function asHit(chunk, score, origin) {
  return {
    id: chunk.id,
    file: chunk.file,
    source: chunk.source,
    chapter: chunk.chapter,
    heading: chunk.heading,
    kind: chunk.kind ?? "rules",
    audience: chunkAudience(chunk),
    entity: chunk.entity ?? null,
    entityDsid: chunk.entityDsid ?? null,
    origin,
    text: String(chunk.text ?? ""),
    score: Math.round(score * 100) / 100,
  };
}

/**
 * Take rows into `state` until `limit` slots are full, respecting the char budget and the quota.
 *
 * The quota key is the **card** for a pack entry and the **chapter file** for everything else, which
 * is the diversity rule in one line: five different abilities is five answers, five chunks of one
 * chapter is one answer wearing a hat.
 */
function takeRows(rows, limit, state, { maxChars, perSource, origin }) {
  for (const row of rows) {
    if (state.picked.length >= limit) break;
    const { chunk } = row;
    const text = String(chunk.text ?? "");
    if (!text || state.ids.has(chunk.id)) continue;
    if (text.length > maxChars) continue;
    if (state.picked.length && ((state.used + text.length) > maxChars)) continue;
    const key = chunk.entity || chunk.file || chunk.source || "";
    if ((state.quota.get(key) ?? 0) >= perSource) continue;
    state.ids.add(chunk.id);
    state.quota.set(key, (state.quota.get(key) ?? 0) + 1);
    state.used += text.length;
    state.picked.push(asHit(chunk, row.score, origin));
  }
}

/** Rank every eligible chunk against one query string. */
function rankChunks(chunks, query, { audience, token }) {
  const route = classRoute(query);
  return chunks
    .filter(chunk => audience === "all" || chunkAudience(chunk) !== "director")
    .map(chunk => ({ chunk, score: scoreChunk(chunk, query, { route, token }) }))
    .filter(row => row.score > 0)
    .sort((a, b) => b.score - a.score || String(a.chunk.id).localeCompare(String(b.chunk.id)));
}

/**
 * @param {{ chunks?: object[] } | object[]} index
 * @param {string} query
 * @param {{ k?: number, maxChars?: number, audience?: "player"|"all", perSource?: number,
 *           token?: object|null }} [options]
 *   audience "player" drops Director-only chunks. Default "all" (back-compat).
 */
export function retrieve(index, query, options = {}) {
  const chunks = Array.isArray(index) ? index : (index?.chunks ?? []);
  const k = Math.max(1, Number(options.k) || 5);
  const maxChars = Math.max(400, Number(options.maxChars) || 5500);
  const audience = String(options.audience ?? "all").toLowerCase() === "player" ? "player" : "all";
  const perSource = Math.max(1, Number(options.perSource) || k);
  const ranked = rankChunks(chunks, query, { audience, token: options.token ?? null });
  const state = { picked: [], used: 0, ids: new Set(), quota: new Map() };
  takeRows(ranked, k, state, { maxChars, perSource, origin: "query" });
  return state.picked;
}

/** Slots reserved for the **current** question when a thread has history. Locked 0.3.135 (3b). */
export const CURRENT_QUERY_SLOTS = 3;
/** Chunks one card / chapter may contribute before the next one gets a turn. */
export const PER_SOURCE_QUOTA = 2;

/**
 * Retrieve for a threaded conversation: current question first, continuity second.
 *
 * Three passes, and the order is the whole fix:
 *
 *  1. **The current question alone**, up to `currentSlots` of `k`. Nothing from the thread can take
 *     these, which is what makes "what does ward the room do?" work as the fourth message of a
 *     conversation about summons — and what removes any need to Clear the thread between topics.
 *  2. **The continuity search** (`retrievalQuery`: this question + the previous user turn + the
 *     selected token) for the remaining slots. This is where a bare follow-up — "and how much
 *     damage?" — still finds the chapter the thread is about, which is why 0.3.134 added it.
 *  3. **The current question again**, quota relaxed, if the budget still has room. A question whose
 *     best five hits all come from one chapter should still get five hits.
 *
 * @param {{ chunks?: object[] } | object[]} index
 * @param {{ query: string, history?: Array<{role: string, content: string}>, token?: object|null }} spec
 * @param {{ k?: number, maxChars?: number, audience?: "player"|"all", currentSlots?: number,
 *           perSource?: number }} [options]
 * @returns {object[]} hits, each tagged `origin: "current" | "context"`
 */
export function retrieveConversational(index, spec = {}, options = {}) {
  const chunks = Array.isArray(index) ? index : (index?.chunks ?? []);
  const k = Math.max(1, Number(options.k) || 5);
  const maxChars = Math.max(400, Number(options.maxChars) || 5500);
  const audience = String(options.audience ?? "all").toLowerCase() === "player" ? "player" : "all";
  const perSource = Math.max(1, Number(options.perSource) || PER_SOURCE_QUOTA);
  const currentSlots = Math.min(k, Math.max(1, Number(options.currentSlots) || CURRENT_QUERY_SLOTS));

  const query = String(spec.query ?? "").trim();
  const token = spec.token ?? null;
  const current = rankChunks(chunks, query, { audience, token });
  const contextQuery = retrievalQuery({ query, history: spec.history ?? [], token });
  const context = (contextQuery === query) ? [] : rankChunks(chunks, contextQuery, { audience, token });

  const state = { picked: [], used: 0, ids: new Set(), quota: new Map() };
  takeRows(current, currentSlots, state, { maxChars, perSource, origin: "current" });
  takeRows(context, k, state, { maxChars, perSource, origin: "context" });
  takeRows(current, k, state, { maxChars, perSource: k, origin: "current" });
  return state.picked;
}

/* --------------------------------------------------- 0.3.135 (3d) "did you mean X?" */

/** Below this, the best hit is a shrug rather than an answer. */
export const CLARIFY_SCORE_FLOOR = 14;
/** Within this fraction of the top score, second place is a tie and not a runner-up. */
export const CLARIFY_CLOSE_RATIO = 0.88;

/**
 * Should VOIDMARK ask which thing the asker meant, and what are the candidates?
 *
 * The old behaviour had two bad modes and no good one: a confident wrong answer off a weak top hit, or
 * "that packet is not on this channel" for a card that is right there in the compendium. Both come from
 * the same missing step — noticing that the retrieve is *uncertain* rather than *empty*.
 *
 * Returns `null` (ask nothing) when the asker named a card outright, when the top hit is clearly ahead,
 * or when there is only one candidate to offer — a single candidate is an answer, not a question.
 *
 * @param {object[]} hits  From `retrieve` / `retrieveConversational`, best first.
 * @param {string} query
 * @param {{ floor?: number, closeRatio?: number }} [options]
 * @returns {{ask: true, reason: "weak"|"close", candidates: string[]}|null}
 */
export function clarification(hits, query, options = {}) {
  const rows = (hits ?? []).filter(hit => hit && hit.text);
  if (!rows.length) return null;                     // nothing retrieved is a different problem
  const floor = Number(options.floor ?? CLARIFY_SCORE_FLOOR);
  const closeRatio = Number(options.closeRatio ?? CLARIFY_CLOSE_RATIO);
  // The asker typed the card's name. There is nothing to disambiguate.
  if (rows.some(hit => hit.entity && phraseInQuery(query, hit.entity))) return null;
  const top = Number(rows[0].score) || 0;
  const second = Number(rows[1]?.score) || 0;
  const weak = top < floor;
  const close = (second > 0) && (second >= (top * closeRatio));
  if (!weak && !close) return null;
  const candidates = [...new Set(rows.map(hit => hit.entity || hit.heading).filter(Boolean))].slice(0, 3);
  if (candidates.length < 2) return null;
  return { ask: true, reason: weak ? "weak" : "close", candidates };
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
