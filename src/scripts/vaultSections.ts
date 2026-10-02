import fs from 'node:fs';
import path from 'node:path';
import { Marked } from 'marked';

export interface VaultSection {
  id: string;
  title: string;
  html: string;
}

interface VaultNote {
  file: string;
  id: string;
  title: string;
}

export const VAULT_NOTES: VaultNote[] = [
  { file: 'Mecânicas/Advantages.md', id: 'advantages-e-flaws', title: 'Advantages e Flaws' },
  { file: 'Mecânicas/Clãs.md', id: 'clas', title: 'Clãs' },
  { file: 'Mecânicas/Dano.md', id: 'dano', title: 'Dano' },
  { file: 'Mecânicas/Diablerie, Blood Bond, Ghouls.md', id: 'diablerie-blood-bond-e-ghouls', title: 'Diablerie, Blood Bond e Ghouls' },
  { file: 'Mecânicas/Dificuldade, Contests e Conflitos.md', id: 'dificuldade-contests-e-conflitos', title: 'Dificuldade, Contests e Conflitos' },
  { file: 'Mecânicas/Disciplinas.md', id: 'disciplinas', title: 'Disciplinas' },
  { file: 'Mecânicas/Dyscrasias.md', id: 'dyscrasias', title: 'Dyscrasias' },
  { file: 'Mecânicas/Entendendo Dados e Ficha.md', id: 'entendendo-dados-e-ficha', title: 'Entendendo Dados e Ficha' },
  { file: 'Mecânicas/Exemplos de Testes.md', id: 'exemplos-de-testes', title: 'Exemplos de Testes' },
  { file: 'Mecânicas/Fome.md', id: 'fome', title: 'Fome' },
  { file: 'Mecânicas/Frenzy.md', id: 'frenzy', title: 'Frenzy' },
  { file: 'Mecânicas/Gerações e Potência.md', id: 'geracoes-e-potencia', title: 'Gerações e Potência' },
  { file: 'Mecânicas/Humanidade.md', id: 'humanidade', title: 'Humanidade' },
  { file: 'Mecânicas/Hunting and Feeding.md', id: 'hunting-and-feeding', title: 'Hunting and Feeding' },
  { file: 'Mecânicas/Loresheets.md', id: 'loresheets', title: 'Loresheets' },
  { file: 'Mecânicas/Perigos do Sangue.md', id: 'perigos-do-sangue', title: 'Perigos do Sangue' },
  { file: 'Mecânicas/Character.md', id: 'personagem', title: 'Personagem' },
  { file: 'Mecânicas/Predator Type.md', id: 'predator-types', title: 'Predator Types' },
  { file: 'Mecânicas/Regras Avançadas.md', id: 'regras-avancadas', title: 'Regras Avançadas' },
  { file: 'Mecânicas/Regras Fundamentais.md', id: 'regras-fundamentais', title: 'Regras Fundamentais' },
  { file: 'Mecânicas/Resonance.md', id: 'resonance', title: 'Resonance' },
  { file: 'Mecânicas/Sangue Fraco.md', id: 'sangue-fraco', title: 'Sangue Fraco' },
  { file: 'Mecânicas/Skills.md', id: 'skills', title: 'Skills' },
  { file: 'Mecânicas/XP.md', id: 'xp-e-avanco', title: 'XP e Avanço' },
];

const TABLE_OF_CONTENTS_BLOCK = /```table-of-contents[\s\S]*?```/g;
const EMBED = /!\[\[[^\]]*\]\]/g;
const TAG_ONLY_LINE = /^\s*(#[^\s#][^\s]*\s*)+$/;
const HIGHLIGHT = /==([^=\n]+)==/g;
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
  return fs.readFileSync(path.join(vaultDir, file), 'utf8').replace(/\r\n?/g, '\n');
}

function stripObsidianOnlySyntax(markdown: string): string {
  const withoutBlocks = markdown.replace(TABLE_OF_CONTENTS_BLOCK, '').replace(EMBED, '');
  const withoutTagLines = withoutBlocks
    .split('\n')
    .filter((line) => !TAG_ONLY_LINE.test(line))
    .join('\n');
  return withoutTagLines.replace(HIGHLIGHT, '**$1**');
}

class LinkResolver {
  private notesByName = new Map<string, VaultNote>();
  private headingsByNote = new Map<string, Set<string>>();

  constructor(vaultDir: string) {
    for (const note of VAULT_NOTES) {
      this.notesByName.set(path.basename(note.file, '.md').toLowerCase(), note);
      const headings = new Set<string>();
      for (const match of readNote(vaultDir, note.file).matchAll(MARKDOWN_HEADING)) {
        headings.add(slugify(withoutEmphasis(match[1])));
      }
      this.headingsByNote.set(note.id, headings);
    }
  }

  findNote(name: string): VaultNote | undefined {
    return this.notesByName.get(name.toLowerCase());
  }

  anchorFor(note: VaultNote, heading?: string): string {
    if (!heading) return note.id;
    const slug = slugify(heading);
    return this.headingsByNote.get(note.id)?.has(slug) ? note.id + '-' + slug : note.id;
  }
}

function renderWikilinks(markdown: string, currentNote: VaultNote, links: LinkResolver): string {
  return markdown.replace(WIKILINK, (_match, inner: string) => {
    const [target, alias] = inner.split(/\\?\|/);
    const [notePart, heading] = target.split('#');
    const noteName = path.basename(notePart.trim()).replace(/\.md$/i, '');
    const label = escapeHtml((alias || heading || noteName).trim());
    const destination = noteName ? links.findNote(noteName) : currentNote;

    if (!destination) return `<span class="wiki-ref">${label}</span>`;
    return `<a class="wiki-link" href="#${links.anchorFor(destination, heading?.trim())}">${label}</a>`;
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

export function buildVaultSections(vaultDir: string): VaultSection[] {
  const links = new LinkResolver(vaultDir);

  return VAULT_NOTES.map((note) => {
    const markdown = renderWikilinks(stripObsidianOnlySyntax(readNote(vaultDir, note.file)), note, links);
    const html = markdownRenderer(note).parse(markdown, { async: false });
    return { id: note.id, title: note.title, html };
  });
}
