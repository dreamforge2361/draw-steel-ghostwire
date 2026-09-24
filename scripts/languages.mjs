// Ghostwire languages (docs/masters/GHOSTWIRE_LANGUAGES.md): relabel every Draw Steel language, keeping its key,
// so ancestry and culture language grants still resolve. Draw Steel localizes ds.CONFIG.languages labels at i18nInit.

/**
 * Trade Cant — the street lingua franca (Draw Steel's `caelian`).
 *
 * Michael lock 2026-09-23: **every hero speaks it, free.** It is not a pick, it is not spent from a
 * culture's language budget, and it is not removed by any of the remaps above — those only change
 * what Draw Steel's existing keys are *called*. Stamped on the create-Actor path in
 * scripts/module.mjs and excluded from the Chargen Wizard's budget in scripts/chargen-wizard.mjs.
 */
export const TRADE_CANT_KEY = "caelian";

/** Draw Steel language key -> GHOSTWIRE.Languages.<suffix> */
export const LANGUAGES = {
  // Common urban
  caelian: "TradeCant", vasloria: "ReachMetro", riojan: "FlatsCant", vaniric: "SprawlArgot",
  // National / cultural
  higaran: "MeridianStandard", phaedran: "SanctumFormal", khemharic: "ColonyCreole", oaxuatl: "OffworldTrade",
  uvalic: "HiveTechnical", khoursirian: "OldReach",
  // Corporate
  zaliac: "CorpCant", voll: "LegalShorthand", variac: "OpsDialects", rallarian: "BlackSiteCode",
  // Arcane & sacred
  anjali: "SignalLiturgy", theFirstLanguage: "TrueSignal", yllyric: "SaintCant", khelt: "RiteSpeech",
  filliaric: "DemonNames", axiomatic: "WardFormulae",
  // Machine & matrix
  mindspeech: "WireSpeak", protoCtholl: "OldCode", tholl: "MachineMarkup", kethaic: "AiSymbolic", urollialic: "ResonanceNotation",
  // Ancestral (Peoples)
  highKuric: "CorranGuildTongue", lowKuric: "CorranWorkCant", hyrallic: "ElvaniHighCant", illyvric: "ElvaniSoftspeech",
  szetch: "GoliarBattleCant", kalliak: "ChangerPackTongue", vhoric: "RevenantMemorySpeech", vastariax: "MutantEnclaveCant",
  zahariax: "CyborgFrameCant", ananjali: "PureLineHomily",
  // Extradimensional / dead / deep lore
  highRhyvian: "VoidCant", lowRhivian: "DriftCreole", khamish: "InfernalSpeech", kheltivari: "OldLiturgical",
  oldVariac: "DeadOpsTongue", phorialtic: "AlienColonyTrade", ullorvic: "ExtradimensionalTechnical",
};

/**
 * Categories for the docs and rulebook only; Draw Steel's language config has no groups.
 * @type {Record<string, string[]>}
 */
export const LANGUAGE_GROUPS = {
  commonUrban: ["caelian", "vasloria", "riojan", "vaniric"],
  national: ["higaran", "phaedran", "khemharic", "oaxuatl", "uvalic", "khoursirian"],
  corporate: ["zaliac", "voll", "variac", "rallarian"],
  arcaneSacred: ["anjali", "theFirstLanguage", "yllyric", "khelt", "filliaric", "axiomatic"],
  machineMatrix: ["mindspeech", "protoCtholl", "tholl", "kethaic", "urollialic"],
  ancestral: ["highKuric", "lowKuric", "hyrallic", "illyvric", "szetch", "kalliak", "vhoric", "vastariax", "zahariax", "ananjali"],
  deepLore: ["highRhyvian", "lowRhivian", "khamish", "kheltivari", "oldVariac", "phorialtic", "ullorvic"],
};

/** Relabel Draw Steel's languages with Ghostwire names. Call during the init hook. */
export function registerGhostwireLanguages() {
  const config = ds.CONFIG.languages;
  for (const [key, labelKey] of Object.entries(LANGUAGES)) {
    if (config[key]) config[key].label = `GHOSTWIRE.Languages.${labelKey}`;
    else console.warn(`draw-steel-ghostwire | missing DS language key: ${key}`);
  }
  for (const key of Object.keys(config)) {
    if (!(key in LANGUAGES)) console.warn(`draw-steel-ghostwire | DS language ${key} has no Ghostwire name`);
  }
}
