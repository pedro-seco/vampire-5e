export interface PowerEntry {
  name: string;
  discipline: string;
  level: number;
  source: string;
  cost: string;
  pool: string;
  duration: string;
  prerequisite: string;
  amalgam: string;
  body: string;
  system: string;
}

export type RitualKind = 'ritual' | 'ceremony' | 'formula';

export interface RitualEntry {
  name: string;
  discipline: string;
  kind: RitualKind;
  level: number;
  source: string;
  cost: string;
  castingTime: string;
  ingredients: string;
  pool: string;
  process: string;
  duration: string;
  prerequisite: string;
  body: string;
  system: string;
}

export interface RitualDiscipline {
  kind: RitualKind;
  singular: string;
  plural: string;
}

export const RITUAL_DISCIPLINES: Record<string, RitualDiscipline> = {
  'Blood Sorcery': { kind: 'ritual', singular: 'ritual', plural: 'Rituais' },
  Oblivion: { kind: 'ceremony', singular: 'cerimônia', plural: 'Cerimônias' },
  'Thin-blood Alchemy': { kind: 'formula', singular: 'fórmula', plural: 'Fórmulas' },
};

const powerModules = import.meta.glob<PowerEntry[]>('./powers/*.json', { eager: true, import: 'default' });
const ritualModules = import.meta.glob<RitualEntry[]>('./rituals/*.json', { eager: true, import: 'default' });

type CatalogEntry = { name: string; discipline: string; body: string; system: string };

const textLength = (entry: CatalogEntry) => entry.body.length + entry.system.length;

function mergeModules<Entry extends CatalogEntry>(modules: Record<string, Entry[]>): Entry[] {
  const merged = new Map<string, Entry>();
  for (const path of Object.keys(modules).sort()) {
    for (const entry of modules[path]) {
      const key = entry.discipline + '/' + entry.name.trim().toLowerCase();
      const existing = merged.get(key);
      if (!existing || textLength(entry) > textLength(existing)) merged.set(key, entry);
    }
  }
  return [...merged.values()];
}

export const POWERS = mergeModules(powerModules);
export const RITUALS = mergeModules(ritualModules);

export const DISCIPLINE_NAMES = [...new Set([...POWERS.map((power) => power.discipline), ...Object.keys(RITUAL_DISCIPLINES)])].sort((first, second) =>
  first.localeCompare(second)
);

const normalize = (name: string) => name.trim().toLowerCase();

export const powersOf = (discipline: string) => POWERS.filter((power) => power.discipline === discipline);
export const ritualsOf = (discipline: string) => RITUALS.filter((ritual) => ritual.discipline === discipline);

export function findPower(discipline: string, name: string): PowerEntry | undefined {
  const key = normalize(name);
  return POWERS.find((power) => power.discipline === discipline && normalize(power.name) === key)
    ?? POWERS.find((power) => normalize(power.name) === key);
}

export function findRitual(discipline: string, name: string): RitualEntry | undefined {
  const key = normalize(name);
  return RITUALS.find((ritual) => ritual.discipline === discipline && normalize(ritual.name) === key)
    ?? RITUALS.find((ritual) => normalize(ritual.name) === key);
}
