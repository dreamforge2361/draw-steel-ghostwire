/**
 * Linkify assembled Ghostwire manuscript (post-art-inject).
 * TOC + unambiguous chapter pointers become markdown links to heading #ids.
 */
import { buildChapterRegistry, lookupFilename, lookupPrintCh, lookupRawId, lookupTitle, lookupUniqueHeading } from "./chapter-registry.mjs";

const HOLD = (n) => `\0H${n}\0`;
const HOLD_RE = /\0H(\d+)\0/g;

function escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function protectRegions(md) {
  const held = [];
  const hold = (s) => {
    const key = HOLD(held.length);
    held.push(s);
    return key;
  };
  let text = String(md);
  text = text.replace(/^```[\s\S]*?^```/gm, hold);
  text = text.replace(/<!--[\s\S]*?-->/g, hold);
  text = text.replace(/<figure\b[\s\S]*?<\/figure>/gi, hold);
  text = text.replace(/<div\b[\s\S]*?<\/div>/gi, hold);
  text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, hold);
  text = text.replace(/\[[^\]]+\]\([^)]+\)/g, hold);
  return {
    text,
    restore(t) {
      return String(t).replace(HOLD_RE, (_, n) => held[Number(n)] ?? "");
    },
  };
}

function mapUnprotected(text, fn) {
  const parts = String(text).split(/(!?\[[^\]]*\]\([^)]+\))/);
  return parts.map((part, i) => (i % 2 === 1 ? part : fn(part))).join("");
}

function mdLink(label, href) {
  if (!href) return label;
  const id = href.startsWith("#") ? href : `#${href}`;
  return `[${label}](${id})`;
}

function isRulebookPath(s) {
  return /docs\/(rulebook|masters|spikes|directors)\//i.test(s);
}

function buildSeeTitles(registry) {
  const titles = new Set();
  for (const ch of registry.chapters) {
    if (!ch.href) continue;
    if (ch.headingText) titles.add(ch.headingText);
    if (ch.title) titles.add(ch.title);
    if (ch.headingText && /^the\s+/i.test(ch.headingText)) {
      titles.add(ch.headingText.replace(/^the\s+/i, ""));
    }
    if (ch.title && /^the\s+/i.test(ch.title)) {
      titles.add(ch.title.replace(/^the\s+/i, ""));
    }
  }
  return [...titles]
    .filter((t) => t && t.replace(/[^a-z0-9]+/gi, "").length >= 4)
    .sort((a, b) => b.length - a.length);
}

function buildUniqueHeadingTitles(registry) {
  return [...registry.uniqueHeading.keys()]
    .filter((k) => k.length >= 8)
    .sort((a, b) => b.length - a.length);
}

function linkifyRawFilenames(text, registry, stats) {
  return text.replace(/`((?:docs\/raw\/)?\d{2}-[a-z0-9-]+\.md)`/gi, (all, name) => {
    if (isRulebookPath(all)) return all;
    const ch = lookupFilename(registry, name);
    if (!ch?.href) {
      stats.skipped += 1;
      return all;
    }
    stats.filenames += 1;
    return mdLink(all, ch.href);
  });
}

function linkifyRawIds(text, registry, stats) {
  return text.replace(/`(\d{2})`/g, (all, id) => {
    const ch = lookupRawId(registry, id);
    if (!ch?.href) {
      stats.skipped += 1;
      return all;
    }
    stats.rawIds += 1;
    return mdLink(all, ch.href);
  });
}

function linkifyAppendix(text, registry, stats) {
  return text.replace(/\bAppendix\s+([AB])\b/g, (all, letter) => {
    const ch = registry.appendix.get(letter.toLowerCase());
    if (!ch?.href) {
      stats.skipped += 1;
      return all;
    }
    stats.appendix += 1;
    return mdLink(all, ch.href);
  });
}

function linkifyPrintCh(text, registry, stats) {
  return text.replace(/\bprint Ch\.?\s+(\d+)(?!\s*[–-]\s*\d+)/g, (all, n) => {
    const ch = lookupPrintCh(registry, n);
    if (!ch?.href) {
      stats.skipped += 1;
      return all;
    }
    stats.printCh += 1;
    return mdLink(all, ch.href);
  });
}

function linkifyBareChapter(text, registry, stats) {
  return text.replace(/\b(?:Ch\.|Chapter|chapter)\s+(\d+)(?!\s*[–-]\s*\d+)/g, (all, n) => {
    const ch = lookupPrintCh(registry, n);
    if (!ch?.href) {
      stats.skipped += 1;
      return all;
    }
    stats.printCh += 1;
    return mdLink(all, ch.href);
  });
}

function linkifySeeTitles(text, registry, stats) {
  const titles = buildSeeTitles(registry);
  let out = text;
  for (const title of titles) {
    const re = new RegExp(`\\b([Ss]ee)\\s+(${escapeRe(title)})\\b`, "g");
    out = out.replace(re, (all, see, matched) => {
      const ch = lookupTitle(registry, matched);
      if (!ch?.href) return all;
      stats.seeTitles += 1;
      return `${see} ${mdLink(matched, ch.href)}`;
    });
  }
  return out;
}

function linkifyArrowTargets(text, registry, stats) {
  return text.replace(
    /([A-Z][A-Za-z0-9 &'/().,-]+?)\s*→\s*([A-Z][A-Za-z0-9 &'/().,-]+?)(?=\s*(?:\(|$|[,.;]))/g,
    (all, left, right) => {
      const leftCh = lookupTitle(registry, left.trim());
      const rightHref = lookupUniqueHeading(registry, right.trim());
      if (!leftCh?.href && !rightHref) return all;
      const leftBit = leftCh?.href ? mdLink(left.trim(), leftCh.href) : left;
      const rightBit = rightHref ? mdLink(right.trim(), rightHref) : right;
      stats.arrows += 1;
      return `${leftBit} → ${rightBit}`;
    },
  );
}

function linkifyExactTableCells(line, registry, stats) {
  if (!line.includes("|")) return line;
  const parts = line.split("|");
  return parts
    .map((cell) => {
      const t = cell.trim();
      if (!t || t.startsWith("[") || t.startsWith("\0")) return cell;
      const untick = t.replace(/^`|`$/g, "");
      const byFile = lookupFilename(registry, untick);
      if (byFile?.href && /^\d{2}-[a-z0-9-]+(?:\.md)?$/i.test(untick)) {
        stats.toc += 1;
        return cell.replace(t, mdLink(t, byFile.href));
      }
      const byTitle = lookupTitle(registry, t.replace(/\*+/g, ""));
      if (byTitle?.href && t.replace(/[*_`]/g, "").length >= 4) {
        stats.toc += 1;
        return cell.replace(t, mdLink(t, byTitle.href));
      }
      return cell;
    })
    .join("|");
}

function generateContents(registry) {
  const lines = [
    "<!-- chapter: Contents -->",
    "<!-- source: generated by tools/linkify-manuscript.mjs from MANIFEST.yml -->",
    "",
    "# Contents",
    "",
    "Click a line to jump. **Print chapter numbers** follow the locked TOC. Backtick file numbers in the rules (`21` = the Wire) are RAW filenames and do not always match print Ch.",
    "",
  ];

  // Group from kind / print_ch bands (MANIFEST assemble order).
  const groups = [
    { title: "Front", test: (c) => c.kind === "front" },
    { title: "Lore Harvest", test: (c) => c.kind === "lore" },
    { title: "Part I — Core Rules", test: (c) => c.printCh != null && c.printCh <= 5 },
    { title: "Part II — Peoples & Making a Hero", test: (c) => c.printCh >= 6 && c.printCh <= 13 },
    { title: "Part III — Classes", test: (c) => c.printCh >= 14 && c.printCh <= 22 },
    { title: "Part IV — Systems", test: (c) => c.printCh >= 23 && c.printCh <= 25 },
    { title: "Part V — Directors", test: (c) => c.printCh >= 26 && c.printCh <= 27 },
    { title: "Part VI — Appendix", test: (c) => c.printCh >= 28 },
  ];

  const used = new Set();
  for (const group of groups) {
    const rows = registry.chapters.filter((c) => !used.has(c) && group.test(c) && c.href);
    if (!rows.length) continue;
    rows.forEach((c) => used.add(c));
    lines.push(`## ${group.title}`, "");
    for (const c of rows) {
      let label = c.headingText || c.title;
      if (c.kind === "lore" && c.id) label = `${c.id} — ${label}`;
      if (c.printCh != null) {
        let extra = "";
        if (c.printCh === 28) extra = " / Appendix A";
        if (c.printCh === 29) extra = " / Appendix B";
        label = `Ch ${c.printCh}${extra} — ${c.headingText || c.title}`;
      }
      lines.push(`- ${mdLink(label, c.href)}`);
    }
    lines.push("");
  }

  // Unused (shouldn't happen)
  const leftover = registry.chapters.filter((c) => !used.has(c) && c.href);
  if (leftover.length) {
    lines.push("## Other", "");
    for (const c of leftover) lines.push(`- ${mdLink(c.headingText || c.title, c.href)}`);
    lines.push("");
  }

  return lines.join("\n");
}

function insertContents(md, contentsMd) {
  if (/<!--\s*chapter:\s*Contents\s*-->/.test(md)) return { md, inserted: false };
  const lorePart = md.indexOf("<!-- PART: Lore Harvest");
  if (lorePart >= 0) {
    return { md: `${md.slice(0, lorePart)}${contentsMd.trimEnd()}\n\n${md.slice(lorePart)}`, inserted: true };
  }
  const howTo = md.indexOf("<!-- chapter: How to Use This Book");
  if (howTo >= 0) {
    const next = md.indexOf("<!-- PART:", howTo + 10);
    const at = next >= 0 ? next : md.indexOf("<!-- chapter:", howTo + 10);
    if (at > howTo) {
      return { md: `${md.slice(0, at)}${contentsMd.trimEnd()}\n\n${md.slice(at)}`, inserted: true };
    }
  }
  return { md: `${contentsMd.trimEnd()}\n\n${md}`, inserted: true };
}

/**
 * @param {string} md
 * @param {object[]} manifestEntries
 * @returns {{ markdown: string, stats: object, registry: object }}
 */
export function linkifyManuscript(md, manifestEntries) {
  const stats = {
    toc: 0,
    rawIds: 0,
    filenames: 0,
    printCh: 0,
    appendix: 0,
    seeTitles: 0,
    arrows: 0,
    skipped: 0,
    contentsInserted: false,
  };

  const registry = buildChapterRegistry(manifestEntries, md);
  const contents = generateContents(registry);
  const inserted = insertContents(md, contents);
  let body = inserted.md;
  stats.contentsInserted = inserted.inserted;
  if (inserted.inserted) stats.toc += registry.chapters.filter((c) => c.href).length;

  const protectedMd = protectRegions(body);
  let text = protectedMd.text;

  // One pattern per pass so newly created [label](#id) links are skipped next.
  text = mapUnprotected(text, (c) => linkifyRawFilenames(c, registry, stats));
  text = mapUnprotected(text, (c) => linkifyRawIds(c, registry, stats));
  text = mapUnprotected(text, (c) => linkifyAppendix(c, registry, stats));
  text = mapUnprotected(text, (c) => linkifyPrintCh(c, registry, stats));
  text = mapUnprotected(text, (c) => linkifyBareChapter(c, registry, stats));
  text = mapUnprotected(text, (c) => linkifySeeTitles(c, registry, stats));
  text = mapUnprotected(text, (c) => linkifyArrowTargets(c, registry, stats));

  text = text
    .split(/\r?\n/)
    .map((line) => (line.includes("|") ? linkifyExactTableCells(line, registry, stats) : line))
    .join("\n");

  const markdown = protectedMd.restore(text);
  stats.total =
    stats.toc +
    stats.rawIds +
    stats.filenames +
    stats.printCh +
    stats.appendix +
    stats.seeTitles +
    stats.arrows;
  return { markdown, stats, registry };
}

export { generateContents, insertContents };
