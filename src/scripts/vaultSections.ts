/**
 * Build-time conversion of the Obsidian notes in ../vault into the sections the
 * web vault renders. Exposed to the app as the virtual module `virtual:vault-sections`
 * (see vite.config.ts), so editing a .md file updates the site on the next build
 * (and live in `npm run dev`).
 *
 * Obsidian syntax handled: [[Note]], [[Note|alias]], [[Note#Heading|alias]], [[#Heading]],
 * `\|` inside tables, ![[embeds]] (dropped), ```table-of-contents``` (dropped),
 * tag-only lines like `#rules #dice` (dropped), ==highlight== (rendered bold).
 */
import fs from 'node:fs';
import path from 'node:path';
import { Marked } from 'marked';

export interface VaultSection {
  id: string;
  title: string;
  html: string;
}

/** Which notes the web vault shows, in order, with their display titles. */
export const VAULT_NOTES: { file: string; id: string; title: string }[] = [
  { file: 'Mecânicas/Regras Fundamentais.md', id: 'regras-fundamentais', title: 'Regras Fundamentais' },
  { file: 'Mecânicas/Entendendo Dados e Ficha.md', id: 'entendendo-dados-e-ficha', title: 'Entendendo Dados e Ficha' },
  { file: 'Mecânicas/Exemplos de Testes.md', id: 'exemplos-de-testes', title: 'Exemplos de Testes' },
  { file: 'Mecânicas/Regras Avançadas.md', id: 'regras-avancadas', title: 'Regras Avançadas' },
  { file: 'Mecânicas/Dificuldade, Contests e Conflitos.md', id: 'dificuldade-contests-e-conflitos', title: 'Dificuldade, Contests e Conflitos' },
  { file: 'Mecânicas/Dano.md', id: 'dano', title: 'Dano' },
  { file: 'Mecânicas/Character.md', id: 'personagem', title: 'Personagem' },
  { file: 'Mecânicas/Skills.md', id: 'skills', title: 'Skills' },
  { file: 'Mecânicas/Advantages.md', id: 'advantages-e-flaws', title: 'Advantages e Flaws' },
  { file: 'Mecânicas/Clãs.md', id: 'clas', title: 'Clãs' },
  { file: 'Mecânicas/Disciplinas.md', id: 'disciplinas', title: 'Disciplinas' },
  { file: 'Mecânicas/Loresheets.md', id: 'loresheets', title: 'Loresheets' },
  { file: 'Mecânicas/Gerações e Potência.md', id: 'geracoes-e-potencia', title: 'Gerações e Potência' },
  { file: 'Mecânicas/Fome.md', id: 'fome', title: 'Fome' },
  { file: 'Mecânicas/Frenzy.md', id: 'frenzy', title: 'Frenzy' },
  { file: 'Mecânicas/Humanidade.md', id: 'humanidade', title: 'Humanidade' },
  { file: 'Mecânicas/Hunting and Feeding.md', id: 'hunting-and-feeding', title: 'Hunting and Feeding' },
  { file: 'Mecânicas/Predator Type.md', id: 'predator-types', title: 'Predator Types' },
  { file: 'Mecânicas/Resonance.md', id: 'resonance', title: 'Resonance' },
  { file: 'Mecânicas/Dyscrasias.md', id: 'dyscrasias', title: 'Dyscrasias' },
  { file: 'Mecânicas/Diablerie, Blood Bond, Ghouls.md', id: 'diablerie-blood-bond-e-ghouls', title: 'Diablerie, Blood Bond e Ghouls' },
  { file: 'Mecânicas/Perigos do Sangue.md', id: 'perigos-do-sangue', title: 'Perigos do Sangue' },
  { file: 'Mecânicas/Sangue Fraco.md', id: 'sangue-fraco', title: 'Sangue Fraco' },
  { file: 'Mecânicas/XP.md', id: 'xp-e-avanco', title: 'XP e Avanço' },
];

export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Heading text as written in the .md (minus markdown emphasis), for anchor matching. */
const headingPlain = (s: string) => s.replace(/[*_`]/g, '').trim();

function readNote(vaultDir: string, file: string): string {
  return fs.readFileSync(path.join(vaultDir, file), 'utf8').replace(/\r\n?/g, '\n');
}

function cleanObsidian(md: string): string {
  return md
    .replace(/```table-of-contents[\s\S]*?```/g, '')
    .replace(/!\[\[[^\]]*\]\]/g, '')
    .split('\n')
    .filter((line) => !/^\s*(#[^\s#][^\s]*\s*)+$/.test(line))
    .join('\n')
    .replace(/==([^=\n]+)==/g, '**$1**');
}

export function buildVaultSections(vaultDir: string): VaultSection[] {
  const byName = new Map<string, (typeof VAULT_NOTES)[number]>();
  for (const n of VAULT_NOTES) byName.set(path.basename(n.file, '.md').toLowerCase(), n);

  // Heading anchors present in each note, so links can point at a real id or fall back to the section.
  const headings = new Map<string, Set<string>>();
  for (const n of VAULT_NOTES) {
    const set = new Set<string>();
    for (const m of readNote(vaultDir, n.file).matchAll(/^#{1,6}\s+(.+)$/gm)) set.add(slugify(headingPlain(m[1])));
    headings.set(n.id, set);
  }

  const linkTo = (sectionId: string, heading?: string) => {
    if (!heading) return sectionId;
    const slug = slugify(heading);
    return headings.get(sectionId)?.has(slug) ? sectionId + '-' + slug : sectionId;
  };

  return VAULT_NOTES.map((note) => {
    let md = cleanObsidian(readNote(vaultDir, note.file));

    md = md.replace(/\[\[([^\]]+?)\]\]/g, (_, inner: string) => {
      const [target, alias] = inner.split(/\\?\|/);
      const [notePart, heading] = target.split('#');
      const noteName = path.basename(notePart.trim()).replace(/\.md$/i, '');
      const text = escapeHtml((alias || heading || noteName).trim());
      const dest = noteName ? byName.get(noteName.toLowerCase()) : note;
      if (!dest) return `<span class="wiki-ref">${text}</span>`;
      return `<a class="wiki-link" href="#${linkTo(dest.id, heading?.trim())}">${text}</a>`;
    });

    const used = new Map<string, number>();
    const marked = new Marked({
      gfm: true,
      breaks: true,
      renderer: {
        heading({ tokens, depth, text }) {
          const inner = this.parser.parseInline(tokens);
          const base = note.id + '-' + slugify(headingPlain(text));
          const n = used.get(base) || 0;
          used.set(base, n + 1);
          const id = n ? `${base}-${n + 1}` : base;
          return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
        },
      },
    });

    return { id: note.id, title: note.title, html: marked.parse(md, { async: false }) };
  });
}
