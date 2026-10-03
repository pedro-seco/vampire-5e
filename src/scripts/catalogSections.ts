import fs from 'node:fs';
import path from 'node:path';

interface CatalogEntry {
  name: string;
  discipline: string;
  level: number;
  source: string;
  cost: string;
  duration: string;
  prerequisite: string;
  body: string;
  system: string;
  pool?: string;
  amalgam?: string;
  kind?: string;
  castingTime?: string;
  ingredients?: string;
  process?: string;
}

export interface CatalogPage {
  id: string;
  title: string;
  label: string;
  markdown: string;
}

const textLength = (entry: CatalogEntry) => entry.body.length + entry.system.length;

function loadMerged(directory: string): CatalogEntry[] {
  if (!fs.existsSync(directory)) return [];
  const merged = new Map<string, CatalogEntry>();
  for (const fileName of fs.readdirSync(directory).filter((name) => name.endsWith('.json')).sort()) {
    const entries = JSON.parse(fs.readFileSync(path.join(directory, fileName), 'utf8')) as CatalogEntry[];
    for (const entry of entries) {
      const key = entry.discipline + '/' + entry.name.trim().toLowerCase();
      const existing = merged.get(key);
      if (!existing || textLength(entry) > textLength(existing)) merged.set(key, entry);
    }
  }
  return [...merged.values()];
}

const slug = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const dots = (level: number) => '●'.repeat(level);
const cell = (text: string) => (text || '—').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ');

const FACTS: [keyof CatalogEntry, string][] = [
  ['cost', 'Custo'],
  ['castingTime', 'Casting Time'],
  ['ingredients', 'Ingredientes'],
  ['pool', 'Dice Pool'],
  ['process', 'Processo'],
  ['duration', 'Duração'],
  ['prerequisite', 'Pré-requisito'],
  ['amalgam', 'Amálgama'],
];

function entryMarkdown(entry: CatalogEntry): string {
  const lines = [`### ${entry.name}`, '', `*${entry.discipline} ${dots(entry.level)} · ${entry.source}*`, ''];
  if (entry.body) lines.push(entry.body, '');
  for (const [field, label] of FACTS) {
    const value = entry[field];
    if (typeof value === 'string' && value) lines.push(`- **${label}:** ${value.replace(/\n+/g, ' ')}`);
  }
  if (entry.system) lines.push('', '**Sistema**', '', entry.system);
  lines.push('');
  return lines.join('\n');
}

function pageFor(id: string, title: string, label: string, intro: string, entries: CatalogEntry[]): CatalogPage {
  const sorted = [...entries].sort((first, second) => first.level - second.level || first.name.localeCompare(second.name));
  const table = [
    '| Nome | Nível | Custo | Fonte |',
    '| --- | --- | --- | --- |',
    ...sorted.map((entry) => `| [${cell(entry.name)}](#/vault/${id}/${id}-${slug(entry.name)}) | ${dots(entry.level)} | ${cell(entry.cost)} | ${cell(entry.source)} |`),
  ];
  const body = sorted.map(entryMarkdown).join('\n');
  return { id, title, label, markdown: `# ${title}\n\n${intro}\n\n${table.join('\n')}\n\n${body}` };
}

const INTRO = '> Página gerada a partir dos mesmos dados da ficha: corrigir um dado corrige a ficha e esta página. Fontes e páginas estão em cada item.';

export function buildCatalogPages(dataDirectory: string): CatalogPage[] {
  const pages: CatalogPage[] = [];
  const powers = loadMerged(path.join(dataDirectory, 'powers'));
  const rituals = loadMerged(path.join(dataDirectory, 'rituals'));

  const disciplines = [...new Set(powers.map((power) => power.discipline))].sort((first, second) => first.localeCompare(second));
  for (const discipline of disciplines) {
    const id = `catalogo-poderes-${slug(discipline)}`;
    pages.push(pageFor(id, `Poderes de ${discipline}`, `Poderes — ${discipline}`, INTRO, powers.filter((power) => power.discipline === discipline)));
  }

  const ritualPages: [string, string, string, string][] = [
    ['Blood Sorcery', 'Rituais de Blood Sorcery', 'Rituais — Blood Sorcery', 'ritual'],
    ['Oblivion', 'Cerimônias de Oblivion', 'Cerimônias — Oblivion', 'ceremony'],
    ['Thin-blood Alchemy', 'Fórmulas de Thin-blood Alchemy', 'Fórmulas — Thin-blood Alchemy', 'formula'],
  ];
  for (const [discipline, title, label] of ritualPages) {
    const id = `catalogo-${slug(title)}`;
    const entries = rituals.filter((ritual) => ritual.discipline === discipline);
    if (entries.length > 0) pages.push(pageFor(id, title, label, INTRO, entries));
  }
  return pages;
}
