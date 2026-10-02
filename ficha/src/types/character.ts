export interface Attributes {
  strength: number; dexterity: number; stamina: number;
  charisma: number; manipulation: number; composure: number;
  intelligence: number; wits: number; resolve: number;
}

export type SkillKey =
  | 'athletics' | 'brawl' | 'craft' | 'drive' | 'firearms' | 'larceny' | 'melee' | 'stealth' | 'survival'
  | 'animalKen' | 'etiquette' | 'insight' | 'intimidation' | 'leadership' | 'performance' | 'persuasion' | 'streetwise' | 'subterfuge'
  | 'academics' | 'awareness' | 'finance' | 'investigation' | 'medicine' | 'occult' | 'politics' | 'science' | 'technology';

export interface SkillEntry {
  value: number;
  specialty: string;
}

export type Skills = Record<SkillKey, SkillEntry>;

export interface AdvantageEntry {
  name: string;
  level: number;
  note: string;
}

export interface Trackers {
  healthMax: number;
  health: number[];
  willpowerMax: number;
  willpower: number[];
  hunger: number[];
  humanity: number;
  humanityStains: number;
  bp: number;
  resonance: string;
}

export interface DisciplineEntry {
  name: string;
  level: number;
  powers: string[];
}

export interface Pool {
  title: string;
  attr: string;
  skill: string;
  specialty: string;
  disc: string;
}

export interface Touchstone {
  name: string;
  summary: string;
  linkedConviction: string;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  aliases: string;
  clan: string;
  generation: string;
  predatorType: string;
  faction: string;
  embrace: string;
  sire: string;
  languages: string;
  xpTotal: string | number;
  xpSpent: string | number;
  attributes: Attributes;
  skills: Skills;
  advantages: AdvantageEntry[];
  flaws: AdvantageEntry[];
  trackers: Trackers;
  disciplines: DisciplineEntry[];
  inventory: string[];
  pools: Pool[];
  convictions: string[];
  touchstones: Touchstone[];
  background: string;
  notes: string;
}

export const SKILL_GROUPS: Record<'physical' | 'social' | 'mental', SkillKey[]> = {
  physical: ['athletics', 'brawl', 'craft', 'drive', 'firearms', 'larceny', 'melee', 'stealth', 'survival'],
  social: ['animalKen', 'etiquette', 'insight', 'intimidation', 'leadership', 'performance', 'persuasion', 'streetwise', 'subterfuge'],
  mental: ['academics', 'awareness', 'finance', 'investigation', 'medicine', 'occult', 'politics', 'science', 'technology'],
};

export const SKILL_LABELS: Record<SkillKey, string> = {
  athletics: 'Athletics', brawl: 'Brawl', craft: 'Craft', drive: 'Drive',
  firearms: 'Firearms', larceny: 'Larceny', melee: 'Melee', stealth: 'Stealth', survival: 'Survival',
  animalKen: 'Animal Ken', etiquette: 'Etiquette', insight: 'Insight', intimidation: 'Intimidation',
  leadership: 'Leadership', performance: 'Performance', persuasion: 'Persuasion',
  streetwise: 'Streetwise', subterfuge: 'Subterfuge',
  academics: 'Academics', awareness: 'Awareness', finance: 'Finance', investigation: 'Investigation',
  medicine: 'Medicine', occult: 'Occult', politics: 'Politics', science: 'Science', technology: 'Technology',
};

export interface DisciplinePower {
  name: string;
  discipline: string;
  level: number;
  pool: string;
  cost: string;
  duration: string;
  description: string;
  requirements: string | null;
}

export interface AdvantageDef {
  name: string;
  type: 1 | -1;
  maxLevel: number;
  description: string;
}

export interface BPLevel {
  level: number;
  bloodSurge: string;
  damageHealed: string;
  disciplineBonus: string;
  rouseRoll: string;
  bane: number;
  penalty: string;
}

export interface PredatorType {
  name: string;
  pool: string;
  description: string;
}

export interface ItemDef {
  name: string;
  description: string;
  bonus: string;
}

export interface Store {
  characters: string[];
  active: string;
  [charId: string]: unknown;
}
