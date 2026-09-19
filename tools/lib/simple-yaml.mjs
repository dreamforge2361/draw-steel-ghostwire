/**
 * Indent-based YAML subset: maps, lists of maps/scalars, quoted strings.
 * Good enough for ART-PLACEMENT.yml / MANIFEST.yml. Not a full YAML 1.1 parser.
 */
export function parseYaml(text) {
  const lines = [];
  for (const raw of String(text).split(/\r?\n/)) {
    const noComment = stripComment(raw);
    if (!noComment.trim()) continue;
    const indent = noComment.match(/^ */)[0].length;
    lines.push({ indent, text: noComment.trimEnd() });
  }
  const root = {};
  parseBlock(lines, 0, 0, root);
  return root;
}

function stripComment(line) {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === "'" && !inDouble) inSingle = !inSingle;
    else if (c === '"' && !inSingle && line[i - 1] !== "\\") inDouble = !inDouble;
    else if (c === "#" && !inSingle && !inDouble) return line.slice(0, i);
  }
  return line;
}

function parseBlock(lines, start, minIndent, into) {
  let i = start;
  let list = Array.isArray(into) ? into : null;
  while (i < lines.length) {
    const { indent, text } = lines[i];
    if (indent < minIndent) break;
    if (text.trimStart().startsWith("- ")) {
      if (!list) throw new Error(`YAML list item at unexpected indent: ${text}`);
      const rest = text.trimStart().slice(2);
      const itemIndent = indent + 2;
      if (!rest) {
        const obj = {};
        list.push(obj);
        i = parseBlock(lines, i + 1, itemIndent, obj);
        continue;
      }
      if (rest.includes(":") && !looksLikeScalarOnly(rest)) {
        const obj = {};
        applyKv(obj, rest);
        list.push(obj);
        i = parseBlock(lines, i + 1, itemIndent, obj);
        continue;
      }
      list.push(coerce(unquote(rest)));
      i++;
      continue;
    }
    const kv = text.match(/^([^:]+):\s*(.*)$/);
    if (!kv) {
      i++;
      continue;
    }
    const key = kv[1].trim();
    const val = kv[2];
    const next = lines[i + 1];
    if (val === "" && next && next.indent > indent) {
      if (next.text.trimStart().startsWith("- ")) {
        const arr = [];
        into[key] = arr;
        i = parseBlock(lines, i + 1, next.indent, arr);
        continue;
      }
      const obj = {};
      into[key] = obj;
      i = parseBlock(lines, i + 1, next.indent, obj);
      continue;
    }
    into[key] = coerce(unquote(val));
    i++;
  }
  return i;
}

function looksLikeScalarOnly(rest) {
  // "foo: bar" is a kv; "https://x" or "Ghostwire AI (AI-generated)" is not a new key.
  return /^\s/.test(rest) === false && !/^[\w.-]+:\s+\S/.test(rest) && !/^[\w.-]+:\s*$/.test(rest);
}

function applyKv(obj, rest) {
  const kv = rest.match(/^([^:]+):\s*(.*)$/);
  if (!kv) return;
  obj[kv[1].trim()] = coerce(unquote(kv[2]));
}

function unquote(s) {
  const t = String(s ?? "").trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

function coerce(v) {
  if (v === "true") return true;
  if (v === "false") return false;
  if (v === "null" || v === "~" || v === "") return v === "" ? "" : null;
  if (/^-?\d+$/.test(v)) return Number(v);
  return v;
}
