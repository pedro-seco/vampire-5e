import advantagesData from '../data/advantages.json';
import disciplinesData from '../data/disciplines.json';
import type { AdvantageDef, Attributes, DisciplinePower, SkillKey } from '../types/character';
import { CORE_ADVANTAGES } from './coreAdvantages';
import { CORE_ATTRIBUTES } from './coreAttributes';
import type { AttributeText } from './coreAttributes';
import { CORE_POWERS } from './coreDisciplinePowers';
import type { CorePower } from './coreDisciplinePowers';
import { CORE_PREDATORS } from './corePredators';
import type { PredatorText } from './corePredators';
import { CORE_SKILLS } from './coreSkills';
import type { SkillText } from './coreSkills';

export type SkillReference = SkillText;

export interface PowerReference extends CorePower {
  title: string;
}

const POWERS = disciplinesData as DisciplinePower[];

export function skillReference(skill: SkillKey): SkillReference {
  return CORE_SKILLS[skill];
}

export function powerReference(discipline: string, powerName: string): PowerReference {
  const official = CORE_POWERS[discipline + '/' + powerName] ?? CORE_POWERS[powerName];
  if (official) return { title: powerName, ...official };

  const power = POWERS.find((entry) => entry.name === powerName && entry.discipline === discipline)
    || POWERS.find((entry) => entry.name === powerName);
  if (!power) return { title: powerName, subtitle: discipline.toUpperCase(), source: '', body: '', cost: '—', pool: '—', system: '—' };

  return {
    title: power.name,
    subtitle: `${power.discipline.toUpperCase()} ${'●'.repeat(power.level)}`,
    source: 'DADOS DA FICHA',
    body: power.description,
    cost: power.cost,
    pool: power.pool,
    system: power.requirements ? 'Amalgam: ' + power.requirements : '—',
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
  return CORE_PREDATORS[name] ?? { source: '', body: 'Sem texto oficial para este predator type.', details: [] };
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
