/**
 * Chapter / heading registry for print hotlinks.
 * Built from MANIFEST.yml assemble order + a heading scan of assembled MD.
 */
import { basename } from "node:path";
import { assignHeadingIds, scanAtxHeadings, slugifyHeading } from "./heading-anchor.mjs";

const CHAPTER_BANNER = /<!--\s*chapter:\s*(.+?)\s*-->/;

function normTitle(s) {
  return String(s)
    .toLowerCase()
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[–—]/g, "-")
    .trim();
}

function rawIdFromPath(path) {
  const base = basename(String(path || ""));
  const m = base.match(/^(\d{2})[-.]/);
  return m ? m[1] : null;
}

function filenameFromPath(path) {
  return basename(String(path || ""));
}

function parseBannerMeta(bannerInner) {
  const print = bannerInner.match(/\(\s*print Ch\s+(\d+)\s*\)/i);
  const title = bannerInner
    .replace(/\(\s*print Ch\s+\d+\s*\)/i, "")
    .replace(/·\s*kind\s*=\s*\S+/i, "")
    .trim();
  return {
    title,
    printCh: print ? Number(print[1]) : null,
  };
}

/**
 * @param {object[]} manifestEntries MANIFEST.yml entries
 * @param {string} md assembled (or with-art) markdown
 */
export function buildChapterRegistry(manifestEntries, md) {
  const headings = assignHeadingIds(scanAtxHeadings(md));
  const headingByLine = new Map(headings.map((h) => [h.line, h]));

  const lines = String(md).replace(/^\uFEFF/, "").split(/\r?\n/);
  const bannerLines = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(CHAPTER_BANNER);
    if (m) bannerLines.push({ line: i, inner: m[1] });
  }

  const fileEntries = (manifestEntries || []).filter((e) => e && e.type === "file");
  const chapters = [];

  for (let i = 0; i < fileEntries.length; i++) {
    const entry = fileEntries[i];
    const banner = bannerLines[i] || null;
    const regionStart = banner ? banner.line : -1;
    const regionEnd = bannerLines[i + 1] ? bannerLines[i + 1].line : lines.length;
    let primary = null;
    if (regionStart >= 0) {
      for (const h of headings) {
        if (h.line > regionStart && h.line < regionEnd && h.level === 1) {
          primary = h;
          break;
        }
      }
      if (!primary) {
        for (const h of headings) {
          if (h.line > regionStart && h.line < regionEnd) {
            primary = h;
            break;
          }
        }
      }
    }

    const bannerMeta = banner ? parseBannerMeta(banner.inner) : {};
    const path = entry.path || "";
    const filename = filenameFromPath(path);
    const rawId = rawIdFromPath(path);
    const printCh = entry.print_ch != null ? Number(entry.print_ch) : bannerMeta.printCh;
    const title = entry.title || bannerMeta.title || (primary && primary.text) || entry.id;
    const href = primary ? `#${primary.id}` : null;

    chapters.push({
      id: entry.id,
      title,
      path,
      filename,
      rawId,
      printCh,
      kind: entry.kind || null,
      href,
      headingText: primary ? primary.text : null,
      headingId: primary ? primary.id : null,
    });
  }

  const byRawId = new Map();
  const byPrintCh = new Map();
  const byFilename = new Map();
  const byTitle = new Map();
  const uniqueHeading = new Map();
  const headingCounts = new Map();

  for (const h of headings) {
    const key = normTitle(h.text);
    headingCounts.set(key, (headingCounts.get(key) || 0) + 1);
  }
  for (const h of headings) {
    const key = normTitle(h.text);
    if (headingCounts.get(key) === 1) uniqueHeading.set(key, `#${h.id}`);
  }

  function addTitleAlias(map, title, chapter) {
    if (!title || !chapter.href) return;
    const key = normTitle(title);
    if (!key) return;
    if (map.has(key) && map.get(key).href !== chapter.href) {
      map.delete(key);
      return;
    }
    map.set(key, chapter);
  }

  for (const ch of chapters) {
    if (ch.rawId && ch.href) {
      if (byRawId.has(ch.rawId) && byRawId.get(ch.rawId).href !== ch.href) {
        byRawId.delete(ch.rawId);
      } else {
        byRawId.set(ch.rawId, ch);
      }
    }
    if (ch.printCh != null && ch.href) byPrintCh.set(ch.printCh, ch);
    if (ch.filename && ch.href) {
      byFilename.set(ch.filename.toLowerCase(), ch);
      const stem = ch.filename.replace(/\.md$/i, "").toLowerCase();
      byFilename.set(stem, ch);
    }
    addTitleAlias(byTitle, ch.title, ch);
    addTitleAlias(byTitle, ch.headingText, ch);
    if (ch.headingText && /^the\s+/i.test(ch.headingText)) {
      addTitleAlias(byTitle, ch.headingText.replace(/^the\s+/i, ""), ch);
    }
    if (ch.title && /^the\s+/i.test(ch.title)) {
      addTitleAlias(byTitle, ch.title.replace(/^the\s+/i, ""), ch);
    }
  }

  // Explicit print appendix letters (locked TOC / B77 / B93).
  const appendix = new Map();
  if (byPrintCh.get(28)?.href) appendix.set("a", byPrintCh.get(28));
  if (byPrintCh.get(29)?.href) appendix.set("b", byPrintCh.get(29));

  return {
    chapters,
    headings,
    headingByLine,
    byRawId,
    byPrintCh,
    byFilename,
    byTitle,
    uniqueHeading,
    appendix,
    slugifyHeading,
  };
}

export function lookupRawId(registry, rawId) {
  const id = String(rawId).padStart(2, "0");
  return registry.byRawId.get(id) || null;
}

export function lookupPrintCh(registry, n) {
  return registry.byPrintCh.get(Number(n)) || null;
}

export function lookupFilename(registry, name) {
  const base = basename(String(name)).toLowerCase();
  return registry.byFilename.get(base) || registry.byFilename.get(base.replace(/\.md$/i, "")) || null;
}

export function lookupTitle(registry, title) {
  return registry.byTitle.get(normTitle(title)) || null;
}

export function lookupUniqueHeading(registry, title) {
  return registry.uniqueHeading.get(normTitle(title)) || null;
}

export { normTitle };
