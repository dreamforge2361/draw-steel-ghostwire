/**
 * Numeric version comparison for the smokes' "module.json is ≥ x.y.z" gate.
 *
 * Every smoke used to write `module.version >= "0.3.98"`, which compares *strings*: the moment the
 * module crossed from 0.3.99 to **0.3.100** that read `"1" < "9"` and fifteen green smokes went red
 * at once (G2, 0.3.100). Compare the dotted parts as numbers instead.
 *
 * Trailing non-numeric suffixes (`1.0.0-beta`) compare by their leading number only; that is enough
 * for this repo, which ships plain `major.minor.patch`.
 */
const parts = version => String(version ?? "").split(".").map(part => Number.parseInt(part, 10) || 0);

/** @returns {boolean} whether `version` is at least `minimum` (numeric, per dotted part). */
export function atLeast(version, minimum) {
  if (typeof version !== "string" || !version) return false;
  const a = parts(version);
  const b = parts(minimum);
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    const left = a[i] ?? 0;
    const right = b[i] ?? 0;
    if (left !== right) return left > right;
  }
  return true;
}
