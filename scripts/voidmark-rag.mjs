// VOIDMARK knowledge RAG — embedding-free lexical retrieve over the shipped index.
// No Foundry globals. Used by the chat applet and by tools/voidmark-smoke.mjs.

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

const FILE_HINTS = [
  { re: /wire|wired|matrix|overlay|jack|linked|connect|node|ice|trace|biofeedback|deck|persona|payload|suite|\bping\b/, file: "21-the-wire" },
  { re: /combat|fight|round|stamina|recovery|crisis|strike|fire|maneuver/, file: "04-combat" },
  { re: /power.?roll|test|edge|bane|fortune|characteristic/, file: "03-tests-power-rolls" },
  { re: /chrome|implant|body integrity|weave/, file: "09-chrome-body-integrity" },
  { re: /kit|gear|nuyen|wealth|armor|weapon/, file: "08-kits-gear-wealth" },
  { re: /machine|drone|vehicle|rigger|jump-in|rcc/, file: "23-machines" },
  { re: /hovercraft|altitude limiter|street.?pov|\bpov\b|lane-hopper|star-chopper|hover bike|hover.?car|limiter band/, file: "L1-setting-primer" },
  { re: /hovercraft|altitude limiter|street.?pov|lane-hopper|star-chopper|how the flats move/, file: "03-life-on-the-flats" },
  { re: /hover \/ pov|ground-hauler|\bvtol\b|limiter band/, file: "28-glossary-slang" },
  { re: /mod|autosoft|install/, file: "10-mods" },
  { re: /hacker|bandwidth|program/, file: "19-hacker" },
  { re: /voidmark|the mark|blacklight/, file: "L4-voidmark" },
  { re: /hands off|accord|actuator/, file: "L5-hands-off-accords" },
  { re: /lifestyle|downtime|respite|upkeep/, file: "26-lifestyle-downtime" },
  { re: /veil|essence|pact|sprite/, file: "22-the-veil" },
  { re: /switchboard|cassavir/, file: "04-switchboard" },
  { re: /neon shambles|\bshambles\b/, file: "05-the-neon-shambles" },
  { re: /\bstacks\b/, file: "06-the-stacks" },
  { re: /slackwater/, file: "07-slackwater" },
  { re: /interchange/, file: "08-the-interchange" },
  { re: /cinder market/, file: "09-cinder-market" },
  { re: /spillway/, file: "10-the-spillway" },
  { re: /glasshook/, file: "11-glasshook" },
  { re: /wireside/, file: "12-wireside" },
  { re: /gallows end|\bgallows\b/, file: "13-gallows-end" },
  { re: /cinderhold|outer gate|cael marrow/, file: "14-cinderhold-and-the-outer-gate" },
  { re: /night roster/, file: "15-the-night-roster" },
  { re: /what the flats are|(?:^|\b)the flats\b|ossian reach/, file: "01-what-the-flats-are" },
  { re: /ossian reach|reach color|street color|(?:^|\b)the flats\b/, file: "L3-ossian-reach-color" },
  { re: /wired flats|matrix gazetteer|master node/, file: "wired-flats-gazetteer" },
  { re: /running ossian|session loop|home hive/, file: "27-running-ossian-reach" },
  { re: /peoples|elvani|corran|goliar|founding/, file: "L2-peoples-and-world" },
  { re: /cosmology|the light|dark one|megacorp|the ten/, file: "L1-setting-primer" },
];

/**
 * Multi-word / proper-noun place names. Longer phrases first so
 * "mama cassavir" wins over "cassavir".
 */
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

const LOREISH = /lore|district|hive|gazetteer|who is|what is|where is|ossian|flats|reach handbook|street color/;

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

  if (LOREISH.test(String(query ?? "").toLowerCase()) && (chunk.kind === "lore" || chunk.kind === "setting")) {
    score += 2;
  }

  score *= 1 + (hits / tokens.length);
  return score;
}

/**
 * @param {{ chunks?: object[] } | object[]} index
 * @param {string} query
 * @param {{ k?: number, maxChars?: number }} [options]
 */
export function retrieve(index, query, options = {}) {
  const chunks = Array.isArray(index) ? index : (index?.chunks ?? []);
  const k = Math.max(1, Number(options.k) || 5);
  const maxChars = Math.max(400, Number(options.maxChars) || 5500);
  const ranked = chunks
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
