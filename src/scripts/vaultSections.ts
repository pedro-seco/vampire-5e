import fs from 'node:fs';
import path from 'node:path';
import { Marked } from 'marked';
import { buildCatalogPages } from './catalogSections.ts';

export interface VaultSection {
  id: string;
  title: string;
  html: string;
  text: string;
  headings: { id: string; text: string }[];
  group?: string;
  label?: string;
  audience: 'jogador' | 'narrador';
  part: 'base' | 'catalogo' | 'lore' | 'extras';
  book: string;
  kind: string;
  level?: 'iniciante';
}

interface VaultNote {
  file: string;
  id: string;
  title: string;
  audience: 'jogador' | 'narrador';
  book: string;
  group?: string;
  label?: string;
  kind: string;
  level?: 'iniciante';
  part?: 'base';
}

const PUBLISHED_FOLDERS = ['Mecânicas', 'Lore', 'Narração', 'Aventuras'];
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function parseFrontmatter(raw: string): Record<string, string> {
  const match = FRONTMATTER.exec(raw);
  if (!match) return {};
  const fields: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator < 0) continue;
    const value = line.slice(separator + 1).trim().replace(/^"(.*)"$/, (_whole, inner: string) => inner.replace(/\\(["\\])/g, '$1'));
    fields[line.slice(0, separator).trim()] = value;
  }
  return fields;
}

function markdownFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(fullPath);
    return entry.name.endsWith('.md') ? [fullPath] : [];
  });
}

export function discoverVaultNotes(vaultDir: string): VaultNote[] {
  const notes: VaultNote[] = [];
  for (const folder of PUBLISHED_FOLDERS) {
    for (const fullPath of markdownFiles(path.join(vaultDir, folder))) {
      const fields = parseFrontmatter(fs.readFileSync(fullPath, 'utf8'));
      if (fields.publicar !== 'true') continue;
      const title = fields.titulo || path.basename(fullPath, '.md');
      notes.push({
        file: path.relative(vaultDir, fullPath).split(path.sep).join('/'),
        id: fields.id || slugify(title),
        title,
        audience: fields.publico === 'narrador' ? 'narrador' : 'jogador',
        book: fields.livro || 'Core',
        group: fields.grupo || undefined,
        label: fields.rotulo || undefined,
        kind: fields.tipo || 'regra',
        level: fields.nivel === 'iniciante' ? 'iniciante' : undefined,
        part: fields.parte === 'base' ? 'base' : undefined,
      });
    }
  }
  return notes;
}

const TABLE_OF_CONTENTS_BLOCK = /```table-of-contents[\s\S]*?```/g;
const EMBED = /!\[\[[^\]]*\]\]/g;
const TAG_ONLY_LINE = /^\s*(#[^\s#][^\s]*\s*)+$/;
const HIGHLIGHT = /==([^=\n]+)==/g;
const CALLOUT_HEADER = /^> \[!(\w+)\][+-]? *(.*)$/gm;
const CALLOUT_LABELS: Record<string, string> = { info: 'Informação', warning: 'Atenção', note: 'Nota', tip: 'Dica', resumo: 'Em 30 segundos', important: 'Importante' };
const WIKILINK = /\[\[([^\]]+?)\]\]/g;
const MARKDOWN_HEADING = /^#{1,6}\s+(.+)$/gm;

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const withoutEmphasis = (heading: string) => heading.replace(/[*_`]/g, '').trim();

function readNote(vaultDir: string, file: string): string {
  return fs.readFileSync(path.join(vaultDir, file), 'utf8').replace(/\r\n?/g, '\n').replace(FRONTMATTER, '');
}

function stripObsidianOnlySyntax(markdown: string): string {
  const withoutBlocks = markdown.replace(TABLE_OF_CONTENTS_BLOCK, '').replace(EMBED, '');
  const withoutTagLines = withoutBlocks
    .split('\n')
    .filter((line) => !TAG_ONLY_LINE.test(line))
    .join('\n');
  return withoutTagLines
    .replace(HIGHLIGHT, '**$1**')
    .replace(CALLOUT_HEADER, (_whole, type: string, title: string) => `> **${title.trim() || CALLOUT_LABELS[type.toLowerCase()] || type}**`);
}

class LinkResolver {
  private notesByName = new Map<string, VaultNote>();
  private headingsByNote = new Map<string, Set<string>>();
  private glossary: VaultNote | undefined;

  constructor(vaultDir: string, notes: VaultNote[]) {
    for (const note of notes) {
      if (path.basename(note.file, '.md') === 'Glossário') this.glossary = note;
      this.notesByName.set(path.basename(note.file, '.md').toLowerCase(), note);
      const headings = new Set<string>();
      for (const match of readNote(vaultDir, note.file).matchAll(MARKDOWN_HEADING)) {
        headings.add(slugify(withoutEmphasis(match[1])));
      }
      this.headingsByNote.set(note.id, headings);
    }
  }

  glossaryRoute(term: string): string | undefined {
    if (!this.glossary) return undefined;
    const slug = slugify(term);
    return this.headingsByNote.get(this.glossary.id)?.has(slug) ? `#/vault/${this.glossary.id}/${this.glossary.id}-${slug}` : undefined;
  }

  findNote(name: string): VaultNote | undefined {
    return this.notesByName.get(name.toLowerCase());
  }

  routeFor(note: VaultNote, heading?: string): string {
    const base = '#/vault/' + note.id;
    if (!heading) return base;
    const slug = slugify(heading);
    return this.headingsByNote.get(note.id)?.has(slug) ? base + '/' + note.id + '-' + slug : base;
  }
}

function renderWikilinks(markdown: string, currentNote: VaultNote, links: LinkResolver): string {
  return markdown.replace(WIKILINK, (_match, inner: string) => {
    const [target, alias] = inner.split(/\\?\|/);
    const [notePart, heading] = target.split('#');
    const noteName = path.basename(notePart.trim()).replace(/\.md$/i, '');
    const label = escapeHtml((alias || heading || noteName).trim());
    const destination = noteName ? links.findNote(noteName) : currentNote;

    if (!destination) {
      const glossaryRoute = noteName ? links.glossaryRoute(noteName) : undefined;
      return glossaryRoute ? `<a class="wiki-link" href="${glossaryRoute}">${label}</a>` : `<span class="wiki-ref">${label}</span>`;
    }
    return `<a class="wiki-link" href="${links.routeFor(destination, heading?.trim())}">${label}</a>`;
  });
}

function markdownRenderer(note: VaultNote): Marked {
  const timesUsed = new Map<string, number>();

  const uniqueHeadingId = (headingText: string) => {
    const base = note.id + '-' + slugify(withoutEmphasis(headingText));
    const count = timesUsed.get(base) || 0;
    timesUsed.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };

  return new Marked({
    gfm: true,
    breaks: true,
    renderer: {
      heading({ tokens, depth, text }) {
        return `<h${depth} id="${uniqueHeadingId(text)}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
      },
    },
  });
}

const partOf = (note: VaultNote): 'base' | 'catalogo' | 'lore' | 'extras' => {
  if (note.part) return note.part;
  if (note.kind === 'lore') return 'lore';
  return note.group ? 'extras' : 'base';
};

const PART_ORDER = { base: 0, catalogo: 1, lore: 2, extras: 3 } as const;

const sortKey = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function compareSections(first: VaultSection, second: VaultSection): number {
  if (first.part !== second.part) return PART_ORDER[first.part] - PART_ORDER[second.part];
  const firstTop = sortKey(first.group ?? first.title);
  const secondTop = sortKey(second.group ?? second.title);
  if (firstTop !== secondTop) return firstTop < secondTop ? -1 : 1;
  if (Boolean(first.group) !== Boolean(second.group)) return first.group ? 1 : -1;
  return sortKey(first.label ?? first.title).localeCompare(sortKey(second.label ?? second.title));
}

const HTML_ENTITIES: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };

function plainTextOf(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, (entity) => HTML_ENTITIES[entity])
    .replace(/\s+/g, ' ')
    .trim();
}

const HEADING_TAG = /<h[1-6] id="([^"]+)">([\s\S]*?)<\/h[1-6]>/g;

function headingsOf(html: string): { id: string; text: string }[] {
  return Array.from(html.matchAll(HEADING_TAG), (match) => ({ id: match[1], text: plainTextOf(match[2]) }));
}

export function buildVaultSections(vaultDir: string): VaultSection[] {
  const notes = discoverVaultNotes(vaultDir);
  const links = new LinkResolver(vaultDir, notes);

  const catalogDirectory = path.resolve(vaultDir, '../src/app/data');
  const catalog: VaultSection[] = buildCatalogPages(catalogDirectory).map((page) => {
    const html = markdownRenderer({ id: page.id } as VaultNote).parse(page.markdown, { async: false });
    return {
      id: page.id,
      title: page.title,
      html,
      text: plainTextOf(html),
      headings: headingsOf(html),
      group: 'Catálogo',
      label: page.label,
      audience: 'jogador',
      part: 'catalogo',
      book: 'Catálogo',
      kind: 'catálogo',
    };
  });

  const documented = notes.map((note) => {
    const markdown = renderWikilinks(stripObsidianOnlySyntax(readNote(vaultDir, note.file)), note, links);
    const html = markdownRenderer(note).parse(markdown, { async: false });
    return {
      id: note.id,
      title: note.title,
      html,
      text: plainTextOf(html),
      headings: headingsOf(html),
      group: note.group,
      label: note.label,
      audience: note.audience,
      part: partOf(note),
      book: note.book,
      kind: note.kind,
      level: note.level,
    };
  });

  return [...documented, ...catalog].sort(compareSections);
}
