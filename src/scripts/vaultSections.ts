import fs from 'node:fs';
import path from 'node:path';
import { Marked } from 'marked';

export interface VaultSection {
  id: string;
  title: string;
  html: string;
  group?: string;
  label?: string;
  audience: 'jogador' | 'narrador';
}

interface VaultNote {
  file: string;
  id: string;
  title: string;
}

export const VAULT_NOTES: VaultNote[] = [
  { file: 'Mecânicas/Book of Nod - Blood Sorcery Powers.md', id: 'book-of-nod-blood-sorcery-powers', title: 'Book of Nod - Blood Sorcery Powers' },
  { file: 'Mecânicas/Book of Nod - Blood Sorcery Rituals.md', id: 'book-of-nod-blood-sorcery-rituals', title: 'Book of Nod - Blood Sorcery Rituals' },
  { file: 'Mecânicas/Book of Nod - Gehenna Cults Loresheet.md', id: 'book-of-nod-gehenna-cults-loresheet', title: 'Book of Nod - Gehenna Cults Loresheet' },
  { file: 'Mecânicas/Book of Nod - Machinations of Saulot Loresheet.md', id: 'book-of-nod-machinations-of-saulot-loresheet', title: 'Book of Nod - Machinations of Saulot Loresheet' },
  { file: 'Mecânicas/Book of Nod - Servitor of Irad Loresheet.md', id: 'book-of-nod-servitor-of-irad-loresheet', title: 'Book of Nod - Servitor of Irad Loresheet' },
  { file: 'Mecânicas/Book of Nod - The Book of Nod Loresheet.md', id: 'book-of-nod-the-book-of-nod-loresheet', title: 'Book of Nod - The Book of Nod Loresheet' },
  { file: 'Mecânicas/Book of Nod - Traditions and Laws.md', id: 'book-of-nod-traditions-and-laws', title: 'Book of Nod - Traditions and Laws' },
  { file: 'Mecânicas/Chicago by Night - Homesteading e City Systems.md', id: 'chicago-by-night-homesteading-e-city-systems', title: 'Chicago by Night - Homesteading e City Systems' },
  { file: 'Mecânicas/Children of the Blood - Bloodline Milliner (Grudge Masters).md', id: 'children-of-the-blood-bloodline-milliner-grudge-masters', title: 'Children of the Blood - Bloodline Milliner (Grudge Masters)' },
  { file: 'Mecânicas/Children of the Blood - Bloodline Rossellini (Little Siblings).md', id: 'children-of-the-blood-bloodline-rossellini-little-siblings', title: 'Children of the Blood - Bloodline Rossellini (Little Siblings)' },
  { file: 'Mecânicas/Children of the Blood - Cult Coterie Types.md', id: 'children-of-the-blood-cult-coterie-types', title: 'Children of the Blood - Cult Coterie Types' },
  { file: 'Mecânicas/Children of the Blood - Loresheet Amaranthan.md', id: 'children-of-the-blood-loresheet-amaranthan', title: 'Children of the Blood - Loresheet Amaranthan' },
  { file: 'Mecânicas/Children of the Blood - Loresheet Cleopatras.md', id: 'children-of-the-blood-loresheet-cleopatras', title: 'Children of the Blood - Loresheet Cleopatras' },
  { file: 'Mecânicas/Children of the Blood - Loresheet Meneleans.md', id: 'children-of-the-blood-loresheet-meneleans', title: 'Children of the Blood - Loresheet Meneleans' },
  { file: 'Mecânicas/Children of the Blood - Loresheet Starfall Ranch.md', id: 'children-of-the-blood-loresheet-starfall-ranch', title: 'Children of the Blood - Loresheet Starfall Ranch' },
  { file: 'Mecânicas/Children of the Blood - Loresheet The Ashfinders.md', id: 'children-of-the-blood-loresheet-the-ashfinders', title: 'Children of the Blood - Loresheet The Ashfinders' },
  { file: 'Mecânicas/Children of the Blood - Loresheet The One True Way.md', id: 'children-of-the-blood-loresheet-the-one-true-way', title: 'Children of the Blood - Loresheet The One True Way' },
  { file: 'Mecânicas/Children of the Blood - Merits and Flaws.md', id: 'children-of-the-blood-merits-and-flaws', title: 'Children of the Blood - Merits and Flaws' },
  { file: 'Mecânicas/Clãs do Player\'s Guide — Banes e Compulsões.md', id: 'clas-do-player-s-guide-banes-e-compulsoes', title: 'Clãs do Player\'s Guide — Banes e Compulsões' },
  { file: 'Mecânicas/Cults of the Blood Gods - Bahari e Rituals.md', id: 'cults-of-the-blood-gods-bahari-e-rituals', title: 'Cults of the Blood Gods - Bahari e Rituals' },
  { file: 'Mecânicas/Cults of the Blood Gods - Church of Set (Serpents).md', id: 'cults-of-the-blood-gods-church-of-set-serpents', title: 'Cults of the Blood Gods - Church of Set (Serpents)' },
  { file: 'Mecânicas/Cults of the Blood Gods - Coterie Types.md', id: 'cults-of-the-blood-gods-coterie-types', title: 'Cults of the Blood Gods - Coterie Types' },
  { file: 'Mecânicas/Cults of the Blood Gods - Cult of Shalim.md', id: 'cults-of-the-blood-gods-cult-of-shalim', title: 'Cults of the Blood Gods - Cult of Shalim' },
  { file: 'Mecânicas/Cults of the Blood Gods - Hecata Bloodlines e Family Reunion.md', id: 'cults-of-the-blood-gods-hecata-bloodlines-e-family-reunion', title: 'Cults of the Blood Gods - Hecata Bloodlines e Family Reunion' },
  { file: 'Mecânicas/Cults of the Blood Gods - Mithraic Mysteries.md', id: 'cults-of-the-blood-gods-mithraic-mysteries', title: 'Cults of the Blood Gods - Mithraic Mysteries' },
  { file: 'Mecânicas/Cults of the Blood Gods - Predator Types.md', id: 'cults-of-the-blood-gods-predator-types', title: 'Cults of the Blood Gods - Predator Types' },
  { file: 'Mecânicas/Fall of London - London Under London (Loresheet).md', id: 'fall-of-london-london-under-london-loresheet', title: 'Fall of London - London Under London (Loresheet)' },
  { file: 'Mecânicas/Fall of London - Loresheets.md', id: 'fall-of-london-loresheets', title: 'Fall of London - Loresheets' },
  { file: 'Mecânicas/Fall of London - Ritual of Transferring the Soul.md', id: 'fall-of-london-ritual-of-transferring-the-soul', title: 'Fall of London - Ritual of Transferring the Soul' },
  { file: 'Mecânicas/Fall of London - Threat Levels.md', id: 'fall-of-london-threat-levels', title: 'Fall of London - Threat Levels' },
  { file: 'Mecânicas/Forbidden Religions - Loresheets.md', id: 'forbidden-religions-loresheets', title: 'Forbidden Religions - Loresheets' },
  { file: 'Mecânicas/Forbidden Religions - Merits e Flaws.md', id: 'forbidden-religions-merits-e-flaws', title: 'Forbidden Religions - Merits e Flaws' },
  { file: 'Mecânicas/Forbidden Religions - Poderes de Disciplina.md', id: 'forbidden-religions-poderes-de-disciplina', title: 'Forbidden Religions - Poderes de Disciplina' },
  { file: 'Mecânicas/Forbidden Religions - Rituais de Blood Sorcery.md', id: 'forbidden-religions-rituais-de-blood-sorcery', title: 'Forbidden Religions - Rituais de Blood Sorcery' },
  { file: 'Mecânicas/Player\'s Guide — Antagonistas Consolidados.md', id: 'player-s-guide-antagonistas-consolidados', title: 'Player\'s Guide — Antagonistas Consolidados' },
  { file: 'Mecânicas/Player\'s Guide — Backgrounds, Merits e Flaws.md', id: 'player-s-guide-backgrounds-merits-e-flaws', title: 'Player\'s Guide — Backgrounds, Merits e Flaws' },
  { file: 'Mecânicas/Player\'s Guide — Blood Sorcery e Thin-Blood Alchemy.md', id: 'player-s-guide-blood-sorcery-e-thin-blood-alchemy', title: 'Player\'s Guide — Blood Sorcery e Thin-Blood Alchemy' },
  { file: 'Mecânicas/Player\'s Guide — Castoffs.md', id: 'player-s-guide-castoffs', title: 'Player\'s Guide — Castoffs' },
  { file: 'Mecânicas/Player\'s Guide — Coteries.md', id: 'player-s-guide-coteries', title: 'Player\'s Guide — Coteries' },
  { file: 'Mecânicas/Player\'s Guide — Criação Rápida e Referências de Personagem.md', id: 'player-s-guide-criacao-rapida-e-referencias-de-personagem', title: 'Player\'s Guide — Criação Rápida e Referências de Personagem' },
  { file: 'Mecânicas/Player\'s Guide — Domínio e Merits de Clã de Coterie.md', id: 'player-s-guide-dominio-e-merits-de-cla-de-coterie', title: 'Player\'s Guide — Domínio e Merits de Clã de Coterie' },
  { file: 'Mecânicas/Player\'s Guide — Loresheets e Bloodlines Hecata.md', id: 'player-s-guide-loresheets-e-bloodlines-hecata', title: 'Player\'s Guide — Loresheets e Bloodlines Hecata' },
  { file: 'Mecânicas/Player\'s Guide — Memoriam, Projects e Touchstones.md', id: 'player-s-guide-memoriam-projects-e-touchstones', title: 'Player\'s Guide — Memoriam, Projects e Touchstones' },
  { file: 'Mecânicas/Player\'s Guide — Oblivion e Cerimônias.md', id: 'player-s-guide-oblivion-e-cerimonias', title: 'Player\'s Guide — Oblivion e Cerimônias' },
  { file: 'Mecânicas/Player\'s Guide — Poderes de Disciplina.md', id: 'player-s-guide-poderes-de-disciplina', title: 'Player\'s Guide — Poderes de Disciplina' },
  { file: 'Mecânicas/Segunda Inquisição - Antagonistas Físicos (Hitters e Operators).md', id: 'segunda-inquisicao-antagonistas-fisicos-hitters-e-operators', title: 'Segunda Inquisição - Antagonistas Físicos (Hitters e Operators)' },
  { file: 'Mecânicas/Segunda Inquisição - Antagonistas Mentais (Techies e Sleuths).md', id: 'segunda-inquisicao-antagonistas-mentais-techies-e-sleuths', title: 'Segunda Inquisição - Antagonistas Mentais (Techies e Sleuths)' },
  { file: 'Mecânicas/Segunda Inquisição - Antagonistas Sobrenaturais e Turncoats.md', id: 'segunda-inquisicao-antagonistas-sobrenaturais-e-turncoats', title: 'Segunda Inquisição - Antagonistas Sobrenaturais e Turncoats' },
  { file: 'Mecânicas/Segunda Inquisição - Antagonistas Sociais (Fixers e Faces).md', id: 'segunda-inquisicao-antagonistas-sociais-fixers-e-faces', title: 'Segunda Inquisição - Antagonistas Sociais (Fixers e Faces)' },
  { file: 'Mecânicas/Segunda Inquisição - Armas, Munição e XTechnology.md', id: 'segunda-inquisicao-armas-municao-e-xtechnology', title: 'Segunda Inquisição - Armas, Munição e XTechnology' },
  { file: 'Mecânicas/Segunda Inquisição - OPFOR e Construção de Forças de Caça.md', id: 'segunda-inquisicao-opfor-e-construcao-de-forcas-de-caca', title: 'Segunda Inquisição - OPFOR e Construção de Forças de Caça' },
  { file: 'Mecânicas/Under the Skin - Coterie Pré-gerada.md', id: 'under-the-skin-coterie-pre-gerada', title: 'Under the Skin - Coterie Pré-gerada' },
  { file: 'Mecânicas/Under the Skin - Jo Roth.md', id: 'under-the-skin-jo-roth', title: 'Under the Skin - Jo Roth' },
  { file: 'Narração/Book of Nod - Oblivion Ceremonies.md', id: 'book-of-nod-oblivion-ceremonies', title: 'Book of Nod - Oblivion Ceremonies' },
  { file: 'Narração/Cults of the Blood Gods - Styx and Bones (München).md', id: 'cults-of-the-blood-gods-styx-and-bones-munchen', title: 'Cults of the Blood Gods - Styx and Bones (München)' },
  { file: 'Narração/Fall of London - Artefatos de Mithras.md', id: 'fall-of-london-artefatos-de-mithras', title: 'Fall of London - Artefatos de Mithras' },
  { file: 'Narração/Fall of London - Operation Antigen.md', id: 'fall-of-london-operation-antigen', title: 'Fall of London - Operation Antigen' },
  { file: 'Narração/Fall of London - Personagens Pré-gerados.md', id: 'fall-of-london-personagens-pre-gerados', title: 'Fall of London - Personagens Pré-gerados' },
  { file: 'Narração/Fall of London - The Blooding Ritual.md', id: 'fall-of-london-the-blooding-ritual', title: 'Fall of London - The Blooding Ritual' },
  { file: 'Narração/Under the Skin - Antagonistas e NPCs.md', id: 'under-the-skin-antagonistas-e-npcs', title: 'Under the Skin - Antagonistas e NPCs' },
  { file: 'Narração/Under the Skin - Sangue Inefável e Condução.md', id: 'under-the-skin-sangue-inefavel-e-conducao', title: 'Under the Skin - Sangue Inefável e Condução' },
  { file: 'Narração/Coteries.md', id: 'coteries', title: 'Coteries' },
  { file: 'Narração/Dicas.md', id: 'dicas-de-narracao', title: 'Dicas de Narração' },
  { file: 'Narração/Guia do Narrador.md', id: 'guia-do-narrador', title: 'Guia do Narrador' },
  { file: 'Mecânicas/Anarch - Loresheets.md', id: 'anarch-loresheets', title: 'Anarch - Loresheets' },
  { file: 'Mecânicas/Anarch - Ministry e Cura de Thin-Bloods.md', id: 'anarch-ministry-e-cura-de-thin-bloods', title: 'Anarch - Ministry e Cura de Thin-Bloods' },
  { file: 'Mecânicas/Anarch - Response Algorithm.md', id: 'anarch-response-algorithm', title: 'Anarch - Response Algorithm' },
  { file: 'Mecânicas/Camarilla - Banu Haqim.md', id: 'camarilla-banu-haqim', title: 'Camarilla - Banu Haqim' },
  { file: 'Mecânicas/Camarilla - Conflito Institucional.md', id: 'camarilla-conflito-institucional', title: 'Camarilla - Conflito Institucional' },
  { file: 'Mecânicas/Camarilla - Loresheets.md', id: 'camarilla-loresheets', title: 'Camarilla - Loresheets' },
  { file: 'Mecânicas/Advantages de Ghoul e Mortal.md', id: 'advantages-de-ghoul-e-mortal', title: 'Advantages de Ghoul e Mortal' },
  { file: 'Mecânicas/Advantages.md', id: 'advantages-e-flaws', title: 'Advantages e Flaws' },
  { file: 'Mecânicas/Blood Sigils - A Cena Blood Craft.md', id: 'blood-sigils-a-cena-blood-craft', title: 'Blood Sigils - A Cena Blood Craft' },
  { file: 'Mecânicas/Blood Sigils - Antagonistas e Criaturas.md', id: 'blood-sigils-antagonistas-e-criaturas', title: 'Blood Sigils - Antagonistas e Criaturas' },
  { file: 'Mecânicas/Blood Sigils - Artefatos, Tomos e Mistérios.md', id: 'blood-sigils-artefatos-tomos-e-misterios', title: 'Blood Sigils - Artefatos, Tomos e Mistérios' },
  { file: 'Mecânicas/Blood Sigils - Criação de Rituais, Fórmulas e Efeitos Colaterais.md', id: 'blood-sigils-criacao-de-rituais-formulas-e-efeitos-colaterais', title: 'Blood Sigils - Criação de Rituais, Fórmulas e Efeitos Colaterais' },
  { file: 'Mecânicas/Blood Sigils - Crônica, Tenets e Loresheets.md', id: 'blood-sigils-cronica-tenets-e-loresheets', title: 'Blood Sigils - Crônica, Tenets e Loresheets' },
  { file: 'Mecânicas/Blood Sigils - Fórmulas de Thin-Blood Alchemy.md', id: 'blood-sigils-formulas-de-thin-blood-alchemy', title: 'Blood Sigils - Fórmulas de Thin-Blood Alchemy' },
  { file: 'Mecânicas/Blood Sigils - Rituais de Blood Sorcery.md', id: 'blood-sigils-rituais-de-blood-sorcery', title: 'Blood Sigils - Rituais de Blood Sorcery' },
  { file: 'Mecânicas/Clãs.md', id: 'clas', title: 'Clãs' },
  { file: 'Mecânicas/Clãs do Companion.md', id: 'clas-do-companion', title: 'Clãs do Companion' },
  { file: 'Mecânicas/Clãs do Player\'s Guide — Banes e Compulsões.md', id: 'clas-do-player-s-guide-banes-e-compulsoes', title: 'Clãs do Player\'s Guide — Banes e Compulsões' },
  { file: 'Mecânicas/Dano.md', id: 'dano', title: 'Dano' },
  { file: 'Mecânicas/Diablerie, Blood Bond, Ghouls.md', id: 'diablerie-blood-bond-e-ghouls', title: 'Diablerie, Blood Bond e Ghouls' },
  { file: 'Mecânicas/Dificuldade, Contests e Conflitos.md', id: 'dificuldade-contests-e-conflitos', title: 'Dificuldade, Contests e Conflitos' },
  { file: 'Mecânicas/Disciplinas.md', id: 'disciplinas', title: 'Disciplinas' },
  { file: 'Mecânicas/Dyscrasias.md', id: 'dyscrasias', title: 'Dyscrasias' },
  { file: 'Mecânicas/Entendendo Dados e Ficha.md', id: 'entendendo-dados-e-ficha', title: 'Entendendo Dados e Ficha' },
  { file: 'Mecânicas/Errata do Companion.md', id: 'errata-do-companion', title: 'Errata do Companion' },
  { file: 'Mecânicas/Exemplos de Testes.md', id: 'exemplos-de-testes', title: 'Exemplos de Testes' },
  { file: 'Mecânicas/Fome.md', id: 'fome', title: 'Fome' },
  { file: 'Mecânicas/Frenzy.md', id: 'frenzy', title: 'Frenzy' },
  { file: 'Mecânicas/Gerações e Potência.md', id: 'geracoes-e-potencia', title: 'Gerações e Potência' },
  { file: 'Mecânicas/Humanidade.md', id: 'humanidade', title: 'Humanidade' },
  { file: 'Mecânicas/Hunting and Feeding.md', id: 'hunting-and-feeding', title: 'Hunting and Feeding' },
  { file: 'Mecânicas/Loresheets.md', id: 'loresheets', title: 'Loresheets' },
  { file: 'Mecânicas/Merits de Coterie por Clã.md', id: 'merits-de-coterie-por-cla', title: 'Merits de Coterie por Clã' },
  { file: 'Mecânicas/Mortais e Ghouls Jogáveis.md', id: 'mortais-e-ghouls-jogaveis', title: 'Mortais e Ghouls Jogáveis' },
  { file: 'Mecânicas/Perigos do Sangue.md', id: 'perigos-do-sangue', title: 'Perigos do Sangue' },
  { file: 'Mecânicas/Character.md', id: 'personagem', title: 'Personagem' },
  { file: 'Mecânicas/Player\'s Guide — Antagonistas Consolidados.md', id: 'player-s-guide-antagonistas-consolidados', title: 'Player\'s Guide — Antagonistas Consolidados' },
  { file: 'Mecânicas/Player\'s Guide — Backgrounds, Merits e Flaws.md', id: 'player-s-guide-backgrounds-merits-e-flaws', title: 'Player\'s Guide — Backgrounds, Merits e Flaws' },
  { file: 'Mecânicas/Player\'s Guide — Blood Sorcery e Thin-Blood Alchemy.md', id: 'player-s-guide-blood-sorcery-e-thin-blood-alchemy', title: 'Player\'s Guide — Blood Sorcery e Thin-Blood Alchemy' },
  { file: 'Mecânicas/Player\'s Guide — Castoffs.md', id: 'player-s-guide-castoffs', title: 'Player\'s Guide — Castoffs' },
  { file: 'Mecânicas/Player\'s Guide — Coteries.md', id: 'player-s-guide-coteries', title: 'Player\'s Guide — Coteries' },
  { file: 'Mecânicas/Player\'s Guide — Criação Rápida e Referências de Personagem.md', id: 'player-s-guide-criacao-rapida-e-referencias-de-personagem', title: 'Player\'s Guide — Criação Rápida e Referências de Personagem' },
  { file: 'Mecânicas/Player\'s Guide — Domínio e Merits de Clã de Coterie.md', id: 'player-s-guide-dominio-e-merits-de-cla-de-coterie', title: 'Player\'s Guide — Domínio e Merits de Clã de Coterie' },
  { file: 'Mecânicas/Player\'s Guide — Loresheets e Bloodlines Hecata.md', id: 'player-s-guide-loresheets-e-bloodlines-hecata', title: 'Player\'s Guide — Loresheets e Bloodlines Hecata' },
  { file: 'Mecânicas/Player\'s Guide — Memoriam, Projects e Touchstones.md', id: 'player-s-guide-memoriam-projects-e-touchstones', title: 'Player\'s Guide — Memoriam, Projects e Touchstones' },
  { file: 'Mecânicas/Player\'s Guide — Oblivion e Cerimônias.md', id: 'player-s-guide-oblivion-e-cerimonias', title: 'Player\'s Guide — Oblivion e Cerimônias' },
  { file: 'Mecânicas/Player\'s Guide — Poderes de Disciplina.md', id: 'player-s-guide-poderes-de-disciplina', title: 'Player\'s Guide — Poderes de Disciplina' },
  { file: 'Mecânicas/Poderes do Companion.md', id: 'poderes-do-companion', title: 'Poderes do Companion' },
  { file: 'Mecânicas/Predator Type.md', id: 'predator-types', title: 'Predator Types' },
  { file: 'Mecânicas/Regras Avançadas.md', id: 'regras-avancadas', title: 'Regras Avançadas' },
  { file: 'Mecânicas/Regras Fundamentais.md', id: 'regras-fundamentais', title: 'Regras Fundamentais' },
  { file: 'Mecânicas/Resonance.md', id: 'resonance', title: 'Resonance' },
  { file: 'Mecânicas/Sabbat — Antagonistas.md', id: 'sabbat-antagonistas', title: 'Sabbat — Antagonistas' },
  { file: 'Mecânicas/Sabbat — Paths of Enlightenment.md', id: 'sabbat-paths-of-enlightenment', title: 'Sabbat — Paths of Enlightenment' },
  { file: 'Mecânicas/Sabbat — Poderes de Disciplina.md', id: 'sabbat-poderes-de-disciplina', title: 'Sabbat — Poderes de Disciplina' },
  { file: 'Mecânicas/Sabbat — Ritae.md', id: 'sabbat-ritae', title: 'Sabbat — Ritae' },
  { file: 'Mecânicas/Sabbat — Rituais, Cerimônias e Alquimia.md', id: 'sabbat-rituais-cerimonias-e-alquimia', title: 'Sabbat — Rituais, Cerimônias e Alquimia' },
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

const GROUP_OVERRIDES: Record<string, { group: string; label: string }> = {
  "Clãs do Player's Guide — Banes e Compulsões": { group: "Player's Guide", label: 'Clãs — Banes e Compulsões' },
  'Clãs do Companion': { group: 'Companion', label: 'Clãs' },
  'Errata do Companion': { group: 'Companion', label: 'Errata' },
  'Poderes do Companion': { group: 'Companion', label: 'Poderes' },
  'Mortais e Ghouls Jogáveis': { group: 'Companion', label: 'Mortais e Ghouls Jogáveis' },
  'Advantages de Ghoul e Mortal': { group: 'Companion', label: 'Advantages de Ghoul e Mortal' },
  'Merits de Coterie por Clã': { group: 'Companion', label: 'Merits de Coterie por Clã' },
};

const NARRATOR_TITLES = new Set([
  'Chicago by Night - Homesteading e City Systems',
  'Cults of the Blood Gods - Cult of Shalim',
  'Fall of London - Threat Levels',
  'Segunda Inquisição - Antagonistas Físicos (Hitters e Operators)',
  'Segunda Inquisição - Antagonistas Mentais (Techies e Sleuths)',
  'Segunda Inquisição - Antagonistas Sobrenaturais e Turncoats',
  'Segunda Inquisição - Antagonistas Sociais (Fixers e Faces)',
  'Segunda Inquisição - Armas, Munição e XTechnology',
  'Segunda Inquisição - OPFOR e Construção de Forças de Caça',
  'Book of Nod - Oblivion Ceremonies',
  'Cults of the Blood Gods - Styx and Bones (München)',
  'Fall of London - Artefatos de Mithras',
  'Fall of London - Operation Antigen',
  'Fall of London - Personagens Pré-gerados',
  'Fall of London - The Blooding Ritual',
  'Under the Skin - Antagonistas e NPCs',
  'Under the Skin - Sangue Inefável e Condução',
  'Coteries',
  'Dicas de Narração',
  'Guia do Narrador',
  "Player's Guide — Antagonistas Consolidados",
  'Blood Sigils - A Cena Blood Craft',
  'Blood Sigils - Antagonistas e Criaturas',
  'Blood Sigils - Artefatos, Tomos e Mistérios',
  'Blood Sigils - Crônica, Tenets e Loresheets',
  'Sabbat — Antagonistas',
  'Camarilla - Conflito Institucional',
  'Anarch - Response Algorithm',
]);

const audienceOf = (title: string): 'jogador' | 'narrador' => (NARRATOR_TITLES.has(title) ? 'narrador' : 'jogador');

const GROUP_PREFIX = /^(.+?) [—-] (.+)$/;

function groupOf(title: string): { group?: string; label?: string } {
  const override = GROUP_OVERRIDES[title];
  if (override) return override;
  const prefixed = GROUP_PREFIX.exec(title);
  return prefixed ? { group: prefixed[1], label: prefixed[2] } : {};
}

const sortKey = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function compareSections(first: VaultSection, second: VaultSection): number {
  const firstTop = sortKey(first.group ?? first.title);
  const secondTop = sortKey(second.group ?? second.title);
  if (firstTop !== secondTop) return firstTop < secondTop ? -1 : 1;
  return sortKey(first.label ?? first.title).localeCompare(sortKey(second.label ?? second.title));
}

export function buildVaultSections(vaultDir: string): VaultSection[] {
  const links = new LinkResolver(vaultDir);

  return VAULT_NOTES.map((note) => {
    const markdown = renderWikilinks(stripObsidianOnlySyntax(readNote(vaultDir, note.file)), note, links);
    const html = markdownRenderer(note).parse(markdown, { async: false });
    return { id: note.id, title: note.title, html, audience: audienceOf(note.title), ...groupOf(note.title) };
  }).sort(compareSections);
}
