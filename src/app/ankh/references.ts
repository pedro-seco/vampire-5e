import advantagesData from '../data/advantages.json';
import { findPower, findRitual } from '../data/powerCatalog';
import type { AdvantageDef, Attributes, SkillKey } from '../types/character';
import { CORE_ADVANTAGES } from './coreAdvantages';
import { CORE_ATTRIBUTES } from './coreAttributes';
import type { AttributeText } from './coreAttributes';
import { PREDATOR_TEXTS } from './predators';
import type { PredatorText } from './predators';
import { CORE_SKILLS } from './coreSkills';
import type { SkillText } from './coreSkills';

export type SkillReference = SkillText;

export interface PowerReference {
  title: string;
  subtitle: string;
  source: string;
  body: string;
  facts: { label: string; value: string }[];
  system: string;
}

const dots = (level: number) => '●'.repeat(level);

export function skillReference(skill: SkillKey): SkillReference {
  return CORE_SKILLS[skill];
}

function factsOf(entries: [string, string][]) {
  return entries.filter(([, value]) => value).map(([label, value]) => ({ label, value }));
}

export function powerReference(discipline: string, powerName: string): PowerReference {
  const power = findPower(discipline, powerName);
  if (!power) return { title: powerName, subtitle: discipline.toUpperCase(), source: '', body: 'Sem texto para este poder.', facts: [], system: '' };

  return {
    title: power.name,
    subtitle: `${power.discipline.toUpperCase()} ${dots(power.level)}`,
    source: power.source.toUpperCase(),
    body: power.body,
    facts: factsOf([
      ['CUSTO', power.cost],
      ['DICE POOL', power.pool],
      ['DURAÇÃO', power.duration],
      ['PRÉ-REQUISITO', power.prerequisite],
      ['AMÁLGAMA', power.amalgam],
    ]),
    system: power.system,
  };
}

export function ritualReference(discipline: string, ritualName: string): PowerReference {
  const ritual = findRitual(discipline, ritualName);
  if (!ritual) return { title: ritualName, subtitle: discipline.toUpperCase(), source: '', body: 'Sem texto para esta entrada.', facts: [], system: '' };

  return {
    title: ritual.name,
    subtitle: `${ritual.discipline.toUpperCase()} ${dots(ritual.level)}`,
    source: ritual.source.toUpperCase(),
    body: ritual.body,
    facts: factsOf([
      ['CUSTO', ritual.cost],
      ['CASTING TIME', ritual.castingTime],
      ['INGREDIENTES', ritual.ingredients],
      ['TESTE', ritual.pool],
      ['PROCESSO', ritual.process],
      ['DURAÇÃO', ritual.duration],
      ['PRÉ-REQUISITO', ritual.prerequisite],
    ]),
    system: ritual.system,
  };
}

export interface AdvantageReference {
  kind: string;
  source: string;
  body: string;
  levels: string[];
}

export function attributeReference(attribute: keyof Attributes): AttributeText {
  return CORE_ATTRIBUTES[attribute];
}

export function predatorReference(name: string): PredatorText {
  return PREDATOR_TEXTS[name] ?? { source: '', body: 'Sem texto oficial para este predator type.', details: [] };
}

export function advantageReference(name: string): AdvantageReference {
  const official = CORE_ADVANTAGES[name];
  if (official) return official;

  const definition = (advantagesData as AdvantageDef[]).find((entry) => entry.name === name);
  return {
    kind: definition ? (definition.type === 1 ? 'ADVANTAGE' : 'FLAW') : 'ADVANTAGE',
    source: 'DADOS DA FICHA',
    body: definition?.description ?? 'Sem texto oficial para esta entrada.',
    levels: [],
  };
}
