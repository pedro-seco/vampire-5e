import disciplinesData from '../data/disciplines.json';
import type { DisciplinePower, SkillKey } from '../types/character';
import { CORE_SKILLS } from './coreSkills';
import type { SkillText } from './coreSkills';

export type SkillReference = SkillText;

export interface PowerReference {
  title: string;
  subtitle: string;
  source: string;
  body: string;
  cost: string;
  pool: string;
  system: string;
}

const OFFICIAL_POWERS: Record<string, Omit<PowerReference, 'title'>> = {
  'Bond Famulus': {
    subtitle: 'ANIMALISM ●', source: 'CORE · P. 245',
    body: 'When Blood Bonding an animal, the vampire can make it a famulus, forming a mental link with it and facilitating the use of other Animalism powers. It can follow simple verbal instructions such as “stay” and “come here.”',
    cost: 'The animal must be fed the user’s Blood on three separate nights, each of which requires a Rouse Check',
    pool: 'Charisma + Animal Ken',
    system: 'Feral Whispers and Subsume the Spirit are free when used on the famulus.',
  },
  'Feral Whispers': {
    subtitle: 'ANIMALISM ●●', source: 'CORE · P. 245',
    body: 'The vampire can commune with the beasts of the wild and the city. Feral Whispers allows two-way communication with animals. Vampires can also use Feral Whispers to summon a chosen type of animal.',
    cost: 'One Rouse Check per type of animal chosen for the scene. Free when used on famulus.',
    pool: 'Manipulation + Animalism, Charisma + Animalism',
    system: 'Simple communication requires no dice pool test. Persuading an animal to perform a service requires a Manipulation + Animalism roll.',
  },
  'Unliving Hive': {
    subtitle: 'ANIMALISM ●●● · AMALGAM: OBFUSCATE ●●', source: 'CORE · P. 246',
    body: 'Most often seen amongst the Nosferatu, this unnerving power allows the user to extend their animal influence to swarms of insects such as flies or roaches.',
    cost: 'No additional cost',
    pool: '—',
    system: 'This power extends all powers previously restricted to vertebrates to insect swarms.',
  },
  'Silence of Death': {
    subtitle: 'OBFUSCATE ●', source: 'CORE · P. 260',
    body: 'Popular among the Banu Haqim, this power completely silences the user, nullifying all sound made by them.',
    cost: 'Free',
    pool: '—',
    system: 'Only works on people within earshot and does not fool microphones or other electronic sound detectors.',
  },
  'Unseen Passage': {
    subtitle: 'OBFUSCATE ●●', source: 'CORE · P. 261',
    body: 'With this power, the vampire can now move around while staying hidden. The user is functionally invisible, per the usual Obfuscate limitations.',
    cost: 'One Rouse Check',
    pool: '—',
    system: 'As long as the user emits no overpowering odors and no sound louder than a whisper, this power automatically works.',
  },
  'Rapid Reflexes': {
    subtitle: 'CELERITY ●', source: 'CORE · P. 252',
    body: 'Vampires with this power perceive events instantly and can react to them with superhuman alacrity. They can attempt to dodge arrows and even bullets without available cover.',
    cost: 'Free',
    pool: '—',
    system: 'No penalty to defense pools for lack of cover against Firearms attacks. A minor action worth up to two dice per turn, for free.',
  },
  'Lethal Body': {
    subtitle: 'POTENCE ●', source: 'CORE · P. 263',
    body: 'Using this power, the user is capable of causing horrendous damage to mortals, tearing skin and breaking bones with bare fingers.',
    cost: 'Free',
    pool: '—',
    system: 'Unarmed attacks can now do Aggravated Health damage to mortals, if desired. They also ignore one level of armor per Potence level.',
  },
};

const POWERS = disciplinesData as DisciplinePower[];

export function skillReference(skill: SkillKey): SkillReference {
  return CORE_SKILLS[skill];
}

export function powerReference(discipline: string, powerName: string): PowerReference {
  const official = OFFICIAL_POWERS[powerName];
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
