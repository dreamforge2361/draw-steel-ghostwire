# GHOSTWIRE — Languages Master

**Status:** Names and knowledge-only picks locked 2026-09-16 (B25). Rules baseline v1 (framework ingested); lore deferred.
**Foundry:** `scripts/languages.mjs` relabels every Draw Steel language key with the Ghostwire name below (lang keys `GHOSTWIRE.Languages.*`). Keys are unchanged, so any Draw Steel ancestry or culture grant still resolves.
**Rulebook:** `docs/rulebook/19-languages.md` (stub).

> **BACKLOG:** Per-language history, purpose, and journal entries deferred. See `docs/rulebook/STATUS.md` → *Language lore & journals*.

---

## Why languages matter

The Reach is megacities, corporate states, supernatural traditions, colonies, and nonhuman peoples. Language choice should matter in **diplomacy, infiltration, Wired forensics, ritual research, and faction play**, without becoming bookkeeping unless a campaign wants that depth.

---

## 1. Rules baseline

- **Trade Cant is everyone’s start.** Every hero begins with Trade Cant (Draw Steel key `caelian`), or another common urban tongue the table agrees fits the campaign’s region.
- **Additional starting languages** come from Background, class, People, education, or perks. Languages aren’t bought one at a time with skill points by default.
- **Machine translation** (v1, no numeric mechanic): a translator is not knowing the language. Translation apps and implants can carry simple communication, but they lose nuance, code phrases, ritual language, and deception-heavy exchanges. The Director decides whether a negotiation, a read on someone, or a deception works through one.
- **Knowledge-only languages** (ancient, sacred, encrypted, extradimensional) require actual knowledge. Translation never substitutes for knowing one: at best it produces a surface gloss, and rites, black-site code, and deep code stay opaque.

### Knowledge-only lock (2026-09-16)

| Knowledge only — translation grants no usable knowledge | Spoken / learnable as normal languages — translation may help, Director’s call on nuance |
|---|---|
| **All Arcane & sacred:** Signal Liturgy, True Signal, Saint-Cant, Rite Speech, Demon Names, Ward Formulae | **Wire Speak** (the spoken exception in Machine & matrix) |
| **Black-Site Code** | **Drift Creole** |
| **Machine & matrix except Wire Speak:** Old Code, Machine Markup, AI Symbolic, Resonance Notation | **Alien Colony Trade** |
| **Deep lore:** Void Cant, Infernal Speech, Old Liturgical, Dead Ops Tongue, Extradimensional Technical | **Everything else** not listed as knowledge only |

---

## 2. Categories

| Category | Function (framework) | Languages (locked names) | Knowledge only |
|---|---|---|---|
| **Common urban** | Trade and street speech: metro dialects, corporate pidgins, undercity slang | Trade Cant, Reach Metro, Flats Cant, Sprawl Argot | None |
| **National / cultural** | Region-specific human languages, legacy tongues, colony dialects | Meridian Standard, Sanctum Formal, Colony Creole, Offworld Trade, Hive Technical, Old Reach | None |
| **Corporate** | Internal corp code-speech, legal shorthand, operations dialects | Corp Cant, Legal Shorthand, Ops Dialects, Black-Site Code | Black-Site Code |
| **Arcane & sacred** | Ritual speech, saint-cant, demon names, liturgical formulae | Signal Liturgy, True Signal, Saint-Cant, Rite Speech, Demon Names, Ward Formulae | All |
| **Machine & matrix** | Old code dialects, machine markup, AI symbolic exchange, resonance notation | Wire Speak, Old Code, Machine Markup, AI Symbolic, Resonance Notation | All but Wire Speak |
| **Ancestral (Peoples)** | Tongues tied to the Peoples and their enclaves, revenant traditions, changer packs, mutant communities | Corran Guild-Tongue, Corran Work-Cant, Elvani High Cant, Elvani Softspeech, Goliar Battle-Cant, Changer Pack-Tongue, Revenant Memory-Speech, Mutant Enclave Cant, Cyborg Frame-Cant, Pure-Line Homily | None |
| **Extradimensional / dead / deep lore** | Infernal speech, void cant, alien colony trade forms, off-world technical creoles | Void Cant, Drift Creole, Infernal Speech, Old Liturgical, Dead Ops Tongue, Alien Colony Trade, Extradimensional Technical | All but Drift Creole and Alien Colony Trade |

---

## 3. Design intent

Languages create **access, secrecy, and flavor**, not constant blockage. Common social scenes proceed in shared tongues; hidden archives, cult rites, corp black sites, and nonhuman enclaves get more interesting because **language expertise opens special doors**.

---

## 4. Cross-links

- **Backgrounds and Professions** (the framework’s Origin & Career layer; `13-backgrounds-professions.md`): most Backgrounds should grant a starting language tied to where the hero was raised — a corp arcology upbringing points to a corporate tongue, the undercity to street argot, an off-world colony to an off-world trade creole, a Wired-native childhood to a machine tongue, a cloister to liturgical speech. Some Professions grant +1 language. *Not implemented yet — see Follow-ups.*
- **Peoples** (`09-species.md`): Ancestral tongues map to the eight Peoples and their communities.
- **Casters and the Veil** (Elementalist, Street-Priest): Arcane & sacred languages gate ritual research and formulae.
- **The Wired** (Hacker, `08-hacker.md`, `18-wired-foundry.md`): Machine & matrix languages matter for Wired forensics and deep intrusion work.
- **Skills** (`GHOSTWIRE_SKILLS_MASTER.md`): languages come from Background, class, People, education, or perks, not a per-language skill-point tax.

*Framework source: `docs/masters/_languages_framework_source.md` (sections 1–4 folded in above). Tongue names in this master are the SoR; the framework’s examples don’t add tongues.*

---

## Key → name map (locked)

Draw Steel key on the left; never rename keys. Lang key is `GHOSTWIRE.Languages.<Suffix>`.

### Common urban
| DS key | Ghostwire name | Suffix |
|---|---|---|
| `caelian` | Trade Cant | `TradeCant` |
| `vasloria` | Reach Metro | `ReachMetro` |
| `riojan` | Flats Cant | `FlatsCant` |
| `vaniric` | Sprawl Argot | `SprawlArgot` |

### National / cultural
| DS key | Ghostwire name | Suffix |
|---|---|---|
| `higaran` | Meridian Standard | `MeridianStandard` |
| `phaedran` | Sanctum Formal | `SanctumFormal` |
| `khemharic` | Colony Creole | `ColonyCreole` |
| `oaxuatl` | Offworld Trade | `OffworldTrade` |
| `uvalic` | Hive Technical | `HiveTechnical` |
| `khoursirian` | Old Reach | `OldReach` |

### Corporate
| DS key | Ghostwire name | Suffix |
|---|---|---|
| `zaliac` | Corp Cant | `CorpCant` |
| `voll` | Legal Shorthand | `LegalShorthand` |
| `variac` | Ops Dialects | `OpsDialects` |
| `rallarian` | Black-Site Code | `BlackSiteCode` |

### Arcane & sacred
| DS key | Ghostwire name | Suffix |
|---|---|---|
| `anjali` | Signal Liturgy | `SignalLiturgy` |
| `theFirstLanguage` | True Signal | `TrueSignal` |
| `yllyric` | Saint-Cant | `SaintCant` |
| `khelt` | Rite Speech | `RiteSpeech` |
| `filliaric` | Demon Names | `DemonNames` |
| `axiomatic` | Ward Formulae | `WardFormulae` |

### Machine & matrix
| DS key | Ghostwire name | Suffix |
|---|---|---|
| `mindspeech` | Wire Speak | `WireSpeak` |
| `protoCtholl` | Old Code | `OldCode` |
| `tholl` | Machine Markup | `MachineMarkup` |
| `kethaic` | AI Symbolic | `AiSymbolic` |
| `urollialic` | Resonance Notation | `ResonanceNotation` |

### Ancestral (Peoples)
| DS key | Ghostwire name | Suffix |
|---|---|---|
| `highKuric` | Corran Guild-Tongue | `CorranGuildTongue` |
| `lowKuric` | Corran Work-Cant | `CorranWorkCant` |
| `hyrallic` | Elvani High Cant | `ElvaniHighCant` |
| `illyvric` | Elvani Softspeech | `ElvaniSoftspeech` |
| `szetch` | Goliar Battle-Cant | `GoliarBattleCant` |
| `kalliak` | Changer Pack-Tongue | `ChangerPackTongue` |
| `vhoric` | Revenant Memory-Speech | `RevenantMemorySpeech` |
| `vastariax` | Mutant Enclave Cant | `MutantEnclaveCant` |
| `zahariax` | Cyborg Frame-Cant | `CyborgFrameCant` |
| `ananjali` | Pure-Line Homily | `PureLineHomily` |

### Extradimensional / dead / deep lore
| DS key | Ghostwire name | Suffix |
|---|---|---|
| `highRhyvian` | Void Cant | `VoidCant` |
| `lowRhivian` | Drift Creole | `DriftCreole` |
| `khamish` | Infernal Speech | `InfernalSpeech` |
| `kheltivari` | Old Liturgical | `OldLiturgical` |
| `oldVariac` | Dead Ops Tongue | `DeadOpsTongue` |
| `phorialtic` | Alien Colony Trade | `AlienColonyTrade` |
| `ullorvic` | Extradimensional Technical | `ExtradimensionalTechnical` |

**Coverage:** 42 of 42 Draw Steel 1.1.2 language keys mapped; no unmapped keys. Languages added at runtime by Draw Steel journal pages keep their own labels (a console warning names any key without a Ghostwire name).

---

## Follow-ups (not B25)

- **Lore pass:** history and purpose for each language → `19-languages.md` gazetteer + Foundry Journal entries.
- **Grants:** Ghostwire Backgrounds / Peoples don’t grant languages automatically yet; add language advancements once the lore pass settles who speaks what.
