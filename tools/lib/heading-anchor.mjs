/**
 * Shared heading-anchor helpers for the Ghostwire print HTML path.
 * md-to-html and linkify MUST use the same slug + collision rules.
 */

/** Strip markdown links so slugs stay stable if a heading is later linkified. */
export function headingIdSource(text) {
  return String(text).replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

/** Same algorithm md-to-html used before B97 (plus empty fallback). */
export function slugifyHeading(text) {
  const id = String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return id || "section";
}

/**
 * Allocate stable heading IDs in document order.
 * First "Combat" → combat; second → combat-2.
 */
export function createIdAllocator() {
  const used = new Map();
  return (text) => {
    const base = slugifyHeading(text);
    const n = used.get(base) || 0;
    used.set(base, n + 1);
    return n === 0 ? base : `${base}-${n + 1}`;
  };
}

/**
 * Scan ATX headings in the same encounter order markdownToHtml uses
 * (fences skipped; blockquote markers stripped so quoted headings count).
 */
export function scanAtxHeadings(md) {
  const lines = String(md).replace(/^\uFEFF/, "").split(/\r?\n/);
  const headings = [];
  let i = 0;
  let inFence = false;

  while (i < lines.length) {
    const raw = lines[i];
    if (raw.startsWith("```")) {
      inFence = !inFence;
      i++;
      continue;
    }
    if (inFence) {
      i++;
      continue;
    }
    if (raw.startsWith("<!--")) {
      let chunk = raw;
      while (!chunk.includes("-->") && i + 1 < lines.length) {
        i++;
        chunk += "\n" + lines[i];
      }
      i++;
      continue;
    }
    const line = raw.replace(/^(\s*>\s?)+/, "");
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      headings.push({
        level: heading[1].length,
        text: heading[2].trim(),
        line: i,
      });
    }
    i++;
  }
  return headings;
}

/** Assign collision-aware IDs to a heading list (document order). */
export function assignHeadingIds(headings) {
  const alloc = createIdAllocator();
  return headings.map((h) => ({ ...h, id: alloc(headingIdSource(h.text)) }));
}
