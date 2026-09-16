// Ghostwire skills (docs/masters/GHOSTWIRE_SKILLS_MASTER.md): 44 skills in 6 groups replace the Draw Steel list.
// Draw Steel localizes ds.CONFIG.skills labels at i18nInit, after the module's init hook.

export const SKILL_GROUPS = ["action", "technical", "knowledge", "social", "vehicle", "magic"];

export const SKILLS = {
  action: ["athletics", "brawl", "melee", "firearms", "heavyWeapons", "stealth", "acrobatics", "perception", "survival"],
  technical: ["hacking", "electronics", "engineering", "repair", "cybertech", "medicine", "demolitions", "securitySystems"],
  knowledge: ["streetwise", "corporate", "history", "occult", "religion", "matrixTheory", "medicineLore", "xenology"],
  social: ["negotiation", "persuasion", "deception", "intimidation", "command", "insight", "performance", "contacts"],
  vehicle: ["driving", "piloting", "rigging", "gunnery", "navigation"],
  magic: ["spellcraft", "rituals", "warding", "resonance", "corruption", "summoning"],
};

// Draw Steel skill -> Ghostwire skill, so stock Backgrounds, Professions, and classes still grant sensible skills.
export const LEGACY_SKILLS = {
  alchemy: "medicineLore", architecture: "engineering", blacksmithing: "repair", carpentry: "engineering", cooking: "survival",
  fletching: "repair", forgery: "deception", jewelry: "electronics", mechanics: "repair", tailoring: "repair",
  climb: "athletics", drive: "driving", endurance: "athletics", gymnastics: "acrobatics", heal: "medicine",
  jump: "athletics", lift: "athletics", navigate: "navigation", ride: "driving", swim: "athletics",
  brag: "performance", empathize: "insight", flirt: "persuasion", gamble: "negotiation", handleAnimals: "survival",
  interrogate: "intimidation", intimidate: "intimidation", lead: "command", lie: "deception", music: "performance",
  perform: "performance", persuade: "persuasion", readPerson: "insight",
  alertness: "perception", concealObject: "stealth", disguise: "deception", eavesdrop: "perception", escapeArtist: "acrobatics",
  hide: "stealth", pickLock: "securitySystems", pickPocket: "stealth", sabotage: "demolitions", search: "perception",
  sneak: "stealth", track: "survival",
  culture: "history", criminalUnderworld: "streetwise", history: "history", magic: "occult", monsters: "occult",
  nature: "survival", psionics: "resonance", religion: "religion", rumors: "streetwise", society: "corporate",
  strategy: "command", timescape: "matrixTheory",
};

const capitalize = key => key.charAt(0).toUpperCase() + key.slice(1);

/**
 * Replace Draw Steel's skill groups and list with Ghostwire's, and teach skill advancements to translate
 * Draw Steel skill and group keys. Call during the init hook.
 */
export function registerGhostwireSkills() {
  const config = ds.CONFIG.skills;

  // Draw Steel group -> the Ghostwire skills its skills map to (captured before replacing the list)
  const legacyGroups = {};
  for (const [key, { group }] of Object.entries(config.list)) {
    const target = LEGACY_SKILLS[key];
    if (target) (legacyGroups[group] ??= new Set()).add(target);
  }

  const groups = {};
  const list = {};
  for (const group of SKILL_GROUPS) {
    groups[group] = { label: `GHOSTWIRE.Skills.Groups.${capitalize(group)}` };
    for (const skill of SKILLS[group]) list[skill] = { label: `GHOSTWIRE.Skills.List.${capitalize(skill)}`, group };
  }
  config.groups = groups;
  config.list = list;

  const SkillAdvancement = ds.CONFIG.Advancement?.skill?.documentClass;
  if (!SkillAdvancement) {
    console.warn("draw-steel-ghostwire | SkillAdvancement not found; Draw Steel skill grants won't translate to Ghostwire skills");
    return;
  }
  // All options this advancement grants, with Draw Steel keys translated. Never depends on what the actor owns,
  // because Draw Steel also reads traitOptions/isChoice during actor data preparation.
  const baseOptions = advancement => {
    const skills = ds.CONFIG.skills;
    const allowedGroups = new Set();
    const allowedSkills = new Set();
    for (const group of advancement.skills.groups) {
      if (group in skills.groups) allowedGroups.add(group);
      else for (const skill of legacyGroups[group] ?? []) allowedSkills.add(skill);
    }
    for (const skill of advancement.skills.choices) {
      if (skill in skills.list) allowedSkills.add(skill);
      else if (LEGACY_SKILLS[skill]) allowedSkills.add(LEGACY_SKILLS[skill]);
    }
    const any = !advancement.skills.groups.size && !advancement.skills.choices.size;
    return Object.entries(skills.list).reduce((options, [value, { label, group }]) => {
      if (any || allowedGroups.has(group) || allowedSkills.has(value)) options.push({ label, group: skills.groups[group].label, value, groupKey: group });
      return options;
    }, []);
  };
  const isRealChoice = advancement => (advancement.chooseN != null) && (advancement.chooseN < baseOptions(advancement).length);

  // While a skill picker is open, `pickerScope` names that advancement and the skills to leave out.
  let pickerScope = null;

  // Options for an open picker: drop owned skills; if that leaves no real choice, pad with other unowned skills
  // from the same Ghostwire groups (then from any group) so the picker still offers more than chooseN options.
  const filteredOptions = (advancement, owned) => {
    const base = baseOptions(advancement);
    const options = base.filter(o => !owned.has(o.value));
    if (options.length > advancement.chooseN) return options;
    const skills = ds.CONFIG.skills;
    const groups = new Set(base.map(o => o.groupKey));
    const candidates = Object.entries(skills.list)
      .filter(([value]) => !owned.has(value) && !options.some(o => o.value === value))
      .sort(([, a], [, b]) => Number(groups.has(b.group)) - Number(groups.has(a.group)));
    for (const [value, { label, group }] of candidates) {
      if (options.length > advancement.chooseN) break;
      options.push({ label, group: skills.groups[group].label, value, groupKey: group });
    }
    return options;
  };

  Object.defineProperty(SkillAdvancement.prototype, "traitOptions", {
    configurable: true,
    get() {
      if (pickerScope?.advancement === this) return filteredOptions(this, pickerScope.owned);
      return baseOptions(this);
    },
  });

  // Skills the hero already has or has picked elsewhere in this advancement chain, excluding this advancement's own picks.
  const ownedSkills = (advancement, node) => {
    const actor = node?.chain?.actor ?? advancement.document?.actor;
    const owned = new Set(actor?.system.skills?.value ?? []);
    if (advancement.document?.isEmbedded) {
      for (const skill of advancement.document.getFlag("draw-steel", `advancement.${advancement.id}.selected`) ?? []) owned.delete(skill);
    }
    for (const other of node?.chain?.activeNodes() ?? []) {
      if ((other === node) || (other.advancement.type !== "skill")) continue;
      for (const skill of other.chosenSelection ?? []) owned.add(skill);
    }
    return owned;
  };

  const configure = SkillAdvancement.prototype.configureAdvancement;
  SkillAdvancement.prototype.configureAdvancement = async function(node = null) {
    const advancement = node?.advancement ?? this;
    if (!isRealChoice(advancement)) return configure.call(this, node);
    pickerScope = { advancement, owned: ownedSkills(advancement, node) };
    try {
      return await configure.call(this, node);
    } finally {
      pickerScope = null;
    }
  };

  // Chain leaves must cover any skill the filtered picker might offer (same-group padding included).
  const createLeaves = SkillAdvancement.prototype.createLeaves;
  SkillAdvancement.prototype.createLeaves = async function(node) {
    await createLeaves.call(this, node);
    if (!isRealChoice(this)) return;
    const Leaf = Object.values(node.choices)[0]?.constructor;
    if (!Leaf) return;
    const skills = ds.CONFIG.skills;
    const groups = new Set(baseOptions(this).map(o => o.groupKey));
    for (const [value, { label, group }] of Object.entries(skills.list)) {
      if (groups.has(group) && !node.choices[value]) node.choices[value] = new Leaf(node, value, label);
    }
  };
}
