// F17 — SIN / forged-identity Items.
//
// A SIN (System Identification Number) is the Reach's civic barcode: no SIN, no bank, no clinic,
// no corp lobby. Runners buy one. What they buy is a *forgery*, and forgeries have quality.
//
// Locks (Michael 2026-09-22 → shipping 2026-09-23):
//  1. Purchasable Gear Items in their own Identity folder (`src/packs/gear/identity`), so they are
//     yen-buyable at a kiosk and spendable at Chargen with **no special casing** — they carry a plain
//     `flags.<module>.gear.price`, which is the only thing kiosk.mjs and chargen-wizard.mjs read.
//  2. Quality tiers are echelon-banded. When someone **validates or scans** the identity, the Item
//     hands the bearer an **edge or a bane** by quality: a deep-cover paper trail helps, a ¥400
//     street burn hurts.
//  3. Ghostwire-original names and corps only. No SR product names anywhere near these SKUs.
//
// The scan is announced, not auto-rolled into someone else's test: Draw Steel resolves edges/banes in
// the power-roll dialog, and the checker is usually an NPC. The chat card names the modifier and the
// burn risk so the Director can apply it in one click of the roll dialog.
//
// Helpers above the "Foundry registration" divider are Foundry-free so tools/f17-identity-smoke.mjs
// can run them in Node.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Identity";

/** Quality 1–5. The whole F17 power band lives in this one table. */
export const IDENTITY_QUALITIES = Object.freeze([
  Object.freeze({ quality: 1, band: "burn", echelon: 1, scan: "double-bane", mod: -2, burnRisk: 3 }),
  Object.freeze({ quality: 2, band: "paper", echelon: 1, scan: "bane", mod: -1, burnRisk: 2 }),
  Object.freeze({ quality: 3, band: "broker", echelon: 2, scan: "none", mod: 0, burnRisk: 1 }),
  Object.freeze({ quality: 4, band: "deep", echelon: 3, scan: "edge", mod: 1, burnRisk: 1 }),
  Object.freeze({ quality: 5, band: "seeded", echelon: 4, scan: "double-edge", mod: 2, burnRisk: 0 }),
]);

export const SCAN_OUTCOMES = Object.freeze(["double-bane", "bane", "none", "edge", "double-edge"]);

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? doc?.flags?.["draw-steel-ghostwire"] ?? {};

/**
 * SKUs that predate F17 and are already sitting on pregen sheets. Their pack rows are deliberately
 * left unstamped — they are embedded on three pregens, and `tools/pregen-regen-smoke.mjs` requires the
 * regen round-trip to stay a no-op — so resolve them by `_dsid` instead. An old sheet scans fine.
 */
export const LEGACY_IDENTITY = Object.freeze({
  "fake-sin-basic": Object.freeze({ kind: "sin", quality: 2, band: "paper", scan: "bane", echelon: 1, burnRisk: 2 }),
});

/** An identity Item — SIN or forged credential. */
export function isIdentityItem(item) {
  return !!identityData(item);
}

export function identityData(item) {
  const flag = gwFlags(item).identity;
  if (flag) return flag;
  return LEGACY_IDENTITY[String(item?.system?._dsid ?? "")] ?? null;
}

export function clampQuality(value) {
  const n = Math.floor(Number(value) || 0);
  return Math.min(5, Math.max(1, n));
}

/** The power band row for a quality. Never returns null — quality is clamped into 1–5. */
export function qualityBand(quality) {
  return IDENTITY_QUALITIES[clampQuality(quality) - 1];
}

/** quality → scan modifier. The mapping F17's smoke asserts. */
export function scanOutcome(quality) {
  return qualityBand(quality).scan;
}

/**
 * What a validate/scan does to the bearer's roll.
 * @param {object} options
 * @param {number} options.quality  1–5.
 * @param {boolean} [options.hot]   A hot check (corp lobby gate, Wired-side records pull) — one step worse.
 * @returns {{scan: string, mod: number, band: string, echelon: number, burnRisk: number, quality: number}}
 */
export function planScan({ quality, hot = false } = {}) {
  const row = qualityBand(quality);
  const index = SCAN_OUTCOMES.indexOf(row.scan);
  const shifted = hot ? Math.max(0, index - 1) : index;
  const scan = SCAN_OUTCOMES[shifted];
  return {
    quality: row.quality,
    band: row.band,
    echelon: row.echelon,
    burnRisk: row.burnRisk + (hot ? 1 : 0),
    scan,
    mod: row.mod - (hot ? 1 : 0),
  };
}

/** True once an identity has been burned: it scans at the bottom of the ladder forever after. */
export const isBurned = item => identityData(item)?.burned === true;

/** A burned identity always reads as the worst band, whatever it cost. */
export function effectiveQuality(item) {
  if (!isIdentityItem(item)) return null;
  return isBurned(item) ? 1 : clampQuality(identityData(item).quality);
}

export function scanChatContent({ bearer, identity, scan, mod, burnRisk, hot }) {
  const esc = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
  const sign = mod > 0 ? `+${mod}` : String(mod);
  return `<p><strong>${esc(bearer)}</strong> runs <strong>${esc(identity)}</strong> past a ${hot ? "hot" : "routine"} check — <strong>${esc(scan)}</strong> (${sign}), burn risk ${Math.max(0, Math.floor(Number(burnRisk) || 0))}.</p>`;
}

/* ============================================ Foundry registration (not imported by smoke) */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const scanLabel = scan => game.i18n.localize(`${L}.Scan.${scan}`);

/**
 * Announce a validate/scan on one identity Item.
 * Posts the modifier the Director applies in the power-roll dialog, plus the burn risk.
 */
export async function scanIdentity(item, { hot = false, checker = "" } = {}) {
  if (!isIdentityItem(item)) return { ok: false, reason: "not-identity" };
  const actor = item.parent instanceof Actor ? item.parent : null;
  const plan = planScan({ quality: effectiveQuality(item), hot });
  await ChatMessage.create({
    speaker: actor ? ChatMessage.getSpeaker({ actor }) : undefined,
    content: `<p>${game.i18n.format(`${L}.Chat.Scanned`, {
      bearer: foundry.utils.escapeHTML(actor?.name ?? loc("UnknownBearer")),
      identity: foundry.utils.escapeHTML(item.name),
      checker: foundry.utils.escapeHTML(checker || loc("UnknownChecker")),
      scan: scanLabel(plan.scan),
      band: game.i18n.localize(`${L}.Bands.${plan.band}`),
      burnRisk: plan.burnRisk,
    })}</p><p class="hint">${loc(`Hint.${plan.scan}`)}</p>`,
  });
  ui.notifications.info(loc("Notify.Scanned", { name: item.name, scan: scanLabel(plan.scan) }));
  return { ok: true, ...plan };
}

/** Burn an identity: the record is flagged and it reads as a street forgery from now on. */
export async function burnIdentity(item) {
  if (!isIdentityItem(item) || !item.isOwner) return false;
  if (isBurned(item)) return false;
  await item.setFlag(MODULE_ID, "identity", { ...identityData(item), burned: true });
  await ChatMessage.create({
    speaker: item.parent instanceof Actor ? ChatMessage.getSpeaker({ actor: item.parent }) : undefined,
    content: `<p>${game.i18n.format(`${L}.Chat.Burned`, { identity: foundry.utils.escapeHTML(item.name) })}</p>`,
  });
  return true;
}

export async function unburnIdentity(item) {
  if (!isIdentityItem(item) || !game.user.isGM) return false;
  if (!isBurned(item)) return false;
  const data = { ...identityData(item) };
  delete data.burned;
  await item.setFlag(MODULE_ID, "identity", data);
  return true;
}

async function promptScan(item) {
  if (!item) return null;
  const data = await foundry.applications.api.DialogV2.input({
    window: { title: loc("Prompt.Title"), icon: "fa-solid fa-id-card" },
    content: `
      <p>${loc("Prompt.Hint", { name: foundry.utils.escapeHTML(item.name) })}</p>
      <div class="form-group"><label>${loc("Prompt.Checker")}</label>
        <input type="text" name="checker" placeholder="${loc("Prompt.CheckerHint")}"></div>
      <div class="form-group"><label>${loc("Prompt.Hot")}</label>
        <input type="checkbox" name="hot"></div>`,
    ok: { label: `${L}.Prompt.Confirm`, icon: "fa-solid fa-magnifying-glass" },
  });
  if (!data) return null;
  return scanIdentity(item, { hot: !!data.hot, checker: data.checker ?? "" });
}

function identityContextMenu(app, menuItems) {
  if (typeof app._getEmbeddedDocument !== "function") return;
  const identityOf = target => {
    const item = app._getEmbeddedDocument(target);
    return (isIdentityItem(item) && (item.parent instanceof Actor) && (item.isOwner || game.user.isGM)) ? item : null;
  };
  menuItems.push(
    {
      label: `${L}.Menu.Scan`, icon: "fa-solid fa-id-card",
      visible: target => !!identityOf(target),
      onClick: (event, target) => promptScan(identityOf(target)),
    },
    {
      label: `${L}.Menu.Burn`, icon: "fa-solid fa-fire",
      visible: target => { const item = identityOf(target); return !!item && !isBurned(item) && game.user.isGM; },
      onClick: (event, target) => burnIdentity(identityOf(target)),
    },
    {
      label: `${L}.Menu.Unburn`, icon: "fa-solid fa-rotate-left",
      visible: target => { const item = identityOf(target); return !!item && isBurned(item) && game.user.isGM; },
      onClick: (event, target) => unburnIdentity(identityOf(target)),
    },
  );
}

/** Item sheet: the quality band and what a scan does, under the catalog ¥ line. */
function injectIdentityLine(app, element) {
  const item = app.document;
  element.querySelector(".ghostwire-identity-line")?.remove();
  if (!isIdentityItem(item)) return;
  const anchor = element.querySelector(".ghostwire-chrome-line") ?? element.querySelector(".sheet-header .document-name");
  if (!anchor) return;
  const plan = planScan({ quality: effectiveQuality(item) });
  const line = document.createElement("div");
  line.className = `ghostwire-identity-line ghostwire-identity-${plan.band}`;
  line.textContent = isBurned(item)
    ? loc("SheetLine.Burned", { scan: scanLabel(plan.scan) })
    : loc("SheetLine.Clean", {
      band: game.i18n.localize(`${L}.Bands.${plan.band}`),
      quality: plan.quality,
      scan: scanLabel(plan.scan),
      burnRisk: plan.burnRisk,
    });
  anchor.after(line);
}

export function registerIdentity() {
  Hooks.once("ready", () => {
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        identity: {
          IDENTITY_QUALITIES,
          scanIdentity,
          burnIdentity,
          unburnIdentity,
          planScan,
          scanOutcome,
          isIdentityItem,
          effectiveQuality,
        },
      };
    }
    console.log(`${MODULE_ID} | F17 Identity: SIN / forged-identity scan bands registered`);
  });

  Hooks.on("getDocumentListContextOptions", identityContextMenu);
  Hooks.on("renderDrawSteelItemSheet", injectIdentityLine);
}
