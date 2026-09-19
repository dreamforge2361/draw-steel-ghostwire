/**
 * Small Markdown → HTML for the Ghostwire print draft.
 * Handles ATX headings, GFM tables, lists, blockquotes, fences, images,
 * raw HTML (figures), and emphasis. Not a full CommonMark parser.
 */

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function inline(s) {
  let out = "";
  let i = 0;
  while (i < s.length) {
    if (s.startsWith("`", i)) {
      const end = s.indexOf("`", i + 1);
      if (end > i) {
        out += `<code>${escapeHtml(s.slice(i + 1, end))}</code>`;
        i = end + 1;
        continue;
      }
    }
    if (s.startsWith("![", i)) {
      const m = s.slice(i).match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      if (m) {
        out += `<img src="${escapeHtml(m[2])}" alt="${escapeHtml(m[1])}" />`;
        i += m[0].length;
        continue;
      }
    }
    if (s.startsWith("[", i)) {
      const m = s.slice(i).match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (m) {
        out += `<a href="${escapeHtml(m[2])}">${inline(m[1])}</a>`;
        i += m[0].length;
        continue;
      }
    }
    if (s.startsWith("**", i) || s.startsWith("__", i)) {
      const mark = s.slice(i, i + 2);
      const end = s.indexOf(mark, i + 2);
      if (end > i) {
        out += `<strong>${inline(s.slice(i + 2, end))}</strong>`;
        i = end + 2;
        continue;
      }
    }
    if ((s[i] === "*" || s[i] === "_") && s[i + 1] && s[i + 1] !== " " && s[i + 1] !== s[i]) {
      const mark = s[i];
      const end = s.indexOf(mark, i + 1);
      if (end > i) {
        out += `<em>${inline(s.slice(i + 1, end))}</em>`;
        i = end + 1;
        continue;
      }
    }
    if (s[i] === "<") {
      const end = s.indexOf(">", i);
      if (end > i) {
        out += s.slice(i, end + 1);
        i = end + 1;
        continue;
      }
    }
    const ch = s[i];
    if (ch === "&") out += "&amp;";
    else if (ch === ">") out += "&gt;";
    else out += ch;
    i++;
  }
  return out;
}

function isTableSep(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function splitRow(line) {
  let t = line.trim();
  if (t.startsWith("|")) t = t.slice(1);
  if (t.endsWith("|")) t = t.slice(0, -1);
  return t.split("|").map((c) => c.trim());
}

export function markdownToHtml(md) {
  const lines = String(md).replace(/^\uFEFF/, "").split(/\r?\n/);
  const out = [];
  let i = 0;
  let para = [];

  const flushPara = () => {
    if (!para.length) return;
    const text = para.join(" ").trim();
    if (text) out.push(`<p>${inline(text)}</p>`);
    para = [];
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      flushPara();
      const fence = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        fence.push(escapeHtml(lines[i]));
        i++;
      }
      out.push(`<pre><code>${fence.join("\n")}</code></pre>`);
      i++;
      continue;
    }

    if (line.startsWith("<!--")) {
      flushPara();
      let chunk = line;
      while (!chunk.includes("-->") && i + 1 < lines.length) {
        i++;
        chunk += "\n" + lines[i];
      }
      out.push(chunk);
      i++;
      continue;
    }

    if (/^\s*<figure[\s>]/.test(line) || /^\s*<div[\s>]/.test(line)) {
      flushPara();
      const tag = /^\s*<figure/.test(line) ? "figure" : "div";
      let chunk = line;
      const close = `</${tag}>`;
      while (!chunk.toLowerCase().includes(close) && i + 1 < lines.length) {
        i++;
        chunk += "\n" + lines[i];
      }
      out.push(chunk);
      i++;
      continue;
    }

    if (/^\s*[-*_]{3,}\s*$/.test(line)) {
      flushPara();
      out.push("<hr />");
      i++;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushPara();
      const level = heading[1].length;
      const text = heading[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      i++;
      continue;
    }

    if (line.includes("|") && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      flushPara();
      const headers = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes("|") && !isTableSep(lines[i])) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      const thead = `<thead><tr>${headers.map((h) => `<th>${inline(h)}</th>`).join("")}</tr></thead>`;
      const tbody = `<tbody>${rows
        .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
        .join("")}</tbody>`;
      out.push(`<table>${thead}${tbody}</table>`);
      continue;
    }

    if (/^\s*>/.test(line)) {
      flushPara();
      const q = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) {
        q.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      const first = (q[0] || "").replace(/[*_]/g, "").trim().toLowerCase();
      const cls = first.startsWith("street tip")
        ? ' class="gw-street"'
        : first.startsWith("in foundry")
          ? ' class="gw-foundry"'
          : "";
      out.push(`<blockquote${cls}>${markdownToHtml(q.join("\n"))}</blockquote>`);
      continue;
    }

    const ul = line.match(/^\s*[-*+]\s+(.+)$/);
    if (ul) {
      flushPara();
      out.push("<ul>");
      while (i < lines.length) {
        const m = lines[i].match(/^\s*[-*+]\s+(.+)$/);
        if (!m) break;
        const check = m[1].match(/^\[([ xX])\]\s+(.*)$/);
        if (check) {
          const checked = check[1] !== " ";
          out.push(
            `<li class="gw-check"><input type="checkbox" disabled${checked ? " checked" : ""} /> ${inline(check[2])}</li>`,
          );
        } else {
          out.push(`<li>${inline(m[1])}</li>`);
        }
        i++;
      }
      out.push("</ul>");
      continue;
    }

    const ol = line.match(/^\s*(\d+)\.\s+(.+)$/);
    if (ol) {
      flushPara();
      out.push("<ol>");
      while (i < lines.length) {
        const m = lines[i].match(/^\s*\d+\.\s+(.+)$/);
        if (!m) break;
        out.push(`<li>${inline(m[1])}</li>`);
        i++;
      }
      out.push("</ol>");
      continue;
    }

    if (!line.trim()) {
      flushPara();
      i++;
      continue;
    }

    para.push(line.trim());
    i++;
  }
  flushPara();
  return out.join("\n");
}
