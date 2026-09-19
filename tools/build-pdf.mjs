#!/usr/bin/env node
/**
 * Ghostwire print PDF pipeline (B88).
 *
 *   node tools/assemble-manuscript.mjs
 *   node tools/inject-print-art.mjs
 *   node tools/linkify-manuscript.mjs
 *   node tools/build-pdf.mjs
 *
 * Or one shot from repo root:
 *   node tools/build-pdf.mjs
 *
 * Engine: Chrome/Edge headless HTML→PDF (this VM has no Pandoc). If `pandoc`
 * is on PATH it can emit HTML, but PDF still goes through Chrome so ART-STYLE
 * CSS stays attached. Windows: same script after copying print-art.
 *
 * Usage:
 *   node tools/build-pdf.mjs
 *   node tools/build-pdf.mjs --skip-assemble --skip-inject --skip-linkify
 *   node tools/build-pdf.mjs --sample
 *   node tools/build-pdf.mjs --html-only
 */
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { markdownToHtml } from "./lib/md-to-html.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BUILD = join(ROOT, "docs/manuscript/build");
const ASSEMBLED = join(BUILD, "Ghostwire-Manuscript.md");
const WITH_ART = join(BUILD, "Ghostwire-Manuscript.with-art.md");
const WITH_LINKS = join(BUILD, "Ghostwire-Manuscript.with-links.md");
const HTML_OUT = join(BUILD, "Ghostwire-Rulebook-DRAFT.html");
const PDF_OUT = join(BUILD, "Ghostwire-Rulebook-DRAFT.pdf");
const SAMPLE_PDF = join(BUILD, "Ghostwire-Rulebook-SAMPLE.pdf");
const CSS = join(ROOT, "docs/manuscript/print/ghostwire-print.css");

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function runNode(script, extraArgs = []) {
  const r = spawnSync(process.execPath, [join(ROOT, script), ...extraArgs], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (r.status !== 0) {
    throw new Error(`${script} failed with status ${r.status}`);
  }
}

function which(names) {
  for (const name of names) {
    if (!name) continue;
    if (existsSync(name)) return name;
    const r = spawnSync(process.platform === "win32" ? "where" : "which", [name], {
      encoding: "utf8",
    });
    if (r.status === 0) {
      const line = String(r.stdout || "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .find(Boolean);
      if (line) return line;
    }
  }
  return null;
}

function findChrome() {
  const env = process.env.CHROME_PATH || process.env.EDGE_PATH;
  const candidates =
    process.platform === "win32"
      ? [
          env,
          "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
          "C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
          "C:\\\\Program Files\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe",
          "chrome",
          "msedge",
        ]
      : [
          env,
          "/usr/local/bin/google-chrome",
          "/usr/local/bin/chrome",
          "/usr/bin/google-chrome",
          "/usr/bin/google-chrome-stable",
          "/usr/bin/chromium",
          "/usr/bin/chromium-browser",
          "google-chrome",
          "chrome",
          "chromium",
        ];
  return which(candidates);
}

function toFileUrl(absPath) {
  const resolved = resolve(absPath).replaceAll("\\", "/");
  if (/^[A-Za-z]:\//.test(resolved)) {
    return `file:///${resolved}`;
  }
  return `file://${resolved}`;
}

function rewriteImgSrc(html) {
  return html.replace(/(<img\b[^>]*\bsrc=")([^"]+)(")/g, (all, a, src, c) => {
    if (/^(file:|https?:|data:)/i.test(src)) return all;
    const abs = resolve(ROOT, src);
    return `${a}${toFileUrl(abs)}${c}`;
  });
}

function sampleMarkdown(md) {
  const start = md.indexOf("<!-- chapter: Title Page");
  const lore = md.indexOf("<!-- chapter: Setting Primer");
  const ch27 = md.indexOf("<!-- chapter: Running Ossian Reach");
  const parts = [];
  parts.push(md.slice(0, Math.max(0, start)));
  if (start >= 0) {
    const endCredits = md.indexOf("<!-- chapter: How to Use This Book");
    parts.push(md.slice(start, endCredits > start ? endCredits : start + 8000));
  }
  if (lore >= 0) {
    parts.push("\n\n<!-- SAMPLE: L1 opening only -->\n\n");
    parts.push(md.slice(lore, lore + 12000));
  }
  if (ch27 >= 0) {
    parts.push("\n\n<!-- SAMPLE: Ch 27 maps -->\n\n");
    parts.push(md.slice(ch27, ch27 + 16000));
  }
  return parts.join("\n");
}

function wrapHtml(bodyHtml, title) {
  const cssHref = toFileUrl(CSS);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<meta name="author" content="Ghostwire" />
<link rel="stylesheet" href="${cssHref}" />
</head>
<body>
<aside class="gw-print-banner">
  <strong>Draft PDF</strong> — assembled from <code>docs/manuscript/</code> + ART-PLACEMENT.yml.
  Artwork credit: Ghostwire AI (AI-generated). Journals not regenerated.
</aside>
<main class="gw-rulebook">
${bodyHtml}
</main>
</body>
</html>
`;
}

function chromePrint(chrome, htmlPath, pdfPath) {
  const userData = join(BUILD, ".chrome-profile");
  mkdirSync(userData, { recursive: true });
  if (existsSync(pdfPath)) {
    try {
      unlinkSync(pdfPath);
    } catch {
      /* ignore */
    }
  }
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-extensions",
    "--disable-background-networking",
    "--disable-sync",
    "--disable-default-apps",
    "--disable-component-update",
    "--no-first-run",
    "--no-default-browser-check",
    "--allow-file-access-from-files",
    `--user-data-dir=${userData}`,
    "--hide-scrollbars",
    "--no-pdf-header-footer",
    "--export-tagged-pdf",
    "--generate-pdf-document-outline",
    "--virtual-time-budget=60000",
    `--print-to-pdf=${pdfPath}`,
    toFileUrl(htmlPath),
  ];
  console.log(`Chrome: ${chrome}`);
  // Headless Chrome often writes the PDF then hangs on this VM. Wait for a
  // valid %EOF, then kill. spawnSync timeout is the backstop.
  const timeoutMs = hasFlag("--sample") ? 90_000 : 300_000;
  const r = spawnSync(chrome, args, {
    cwd: ROOT,
    stdio: "inherit",
    timeout: timeoutMs,
    killSignal: "SIGTERM",
  });
  if (!existsSync(pdfPath)) {
    throw new Error(`Chrome print failed (status ${r.status}, signal ${r.signal}) — no PDF`);
  }
  const tail = readFileSync(pdfPath).subarray(-32).toString("latin1");
  if (!tail.includes("%%EOF")) {
    throw new Error(`Chrome wrote an incomplete PDF (status ${r.status}, signal ${r.signal})`);
  }
  if (r.status !== 0 && r.signal) {
    console.log(`Chrome exited after PDF write (${r.signal}) — treating as success.`);
  }
}

function main() {
  const sample = hasFlag("--sample");
  const htmlOnly = hasFlag("--html-only");
  mkdirSync(BUILD, { recursive: true });

  if (!hasFlag("--skip-assemble")) {
    runNode("tools/assemble-manuscript.mjs");
  } else if (!existsSync(ASSEMBLED)) {
    throw new Error(`Missing ${ASSEMBLED} — run assemble or drop --skip-assemble`);
  }

  if (!hasFlag("--skip-inject")) {
    runNode("tools/inject-print-art.mjs");
  } else if (!existsSync(WITH_ART)) {
    throw new Error(`Missing ${WITH_ART} — run inject or drop --skip-inject`);
  }

  if (!hasFlag("--skip-linkify")) {
    runNode("tools/linkify-manuscript.mjs");
  } else if (!existsSync(WITH_LINKS) && !existsSync(WITH_ART)) {
    throw new Error(`Missing ${WITH_LINKS} — run linkify or drop --skip-linkify`);
  }

  if (!existsSync(CSS)) throw new Error(`Missing print CSS: ${CSS}`);

  const sourceMd = !hasFlag("--skip-linkify") && existsSync(WITH_LINKS) ? WITH_LINKS : WITH_ART;
  let md = readFileSync(sourceMd, "utf8");
  if (sample) md = sampleMarkdown(md);
  const body = rewriteImgSrc(markdownToHtml(md));
  const html = wrapHtml(body, sample ? "Ghostwire Rulebook SAMPLE" : "Ghostwire Rulebook DRAFT");
  const htmlPath = sample ? join(BUILD, "Ghostwire-Rulebook-SAMPLE.html") : HTML_OUT;
  writeFileSync(htmlPath, html, "utf8");
  console.log(`Wrote ${htmlPath}`);

  if (htmlOnly) {
    console.log("HTML only — skip PDF.");
    return;
  }

  const chrome = findChrome();
  if (!chrome) {
    console.error("No Chrome/Edge on PATH. HTML is ready; print it locally:");
    console.error(`  ${htmlPath}`);
    process.exit(2);
  }
  const pdfPath = sample ? SAMPLE_PDF : PDF_OUT;
  chromePrint(chrome, htmlPath, pdfPath);
  console.log(`Wrote ${pdfPath}`);
}

try {
  main();
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
