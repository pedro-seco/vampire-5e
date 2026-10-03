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
  part: 'base' | 'extras';
}

interface VaultNote {
  file: string;
  id: string;
  title: string;
}

export const VAULT_NOTES: VaultNote[] = [
  { file: 'Mecânicas/Chicago by Night - Locais de Chicago (Modificadores e Elysium).md', id: 'chicago-by-night-locais-de-chicago-modificadores-e-elysium', title: 'Chicago by Night - Locais de Chicago (Modificadores e Elysium)' },
  { file: 'Mecânicas/Chicago by Night - Loresheets (Organizações e Locais).md', id: 'chicago-by-night-loresheets-organizacoes-e-locais', title: 'Chicago by Night - Loresheets (Organizações e Locais)' },
  { file: 'Mecânicas/Chicago by Night - Loresheets (Personagens).md', id: 'chicago-by-night-loresheets-personagens', title: 'Chicago by Night - Loresheets (Personagens)' },
  { file: 'Mecânicas/Chicago by Night - Regras Expandidas de Coteries.md', id: 'chicago-by-night-regras-expandidas-de-coteries', title: 'Chicago by Night - Regras Expandidas de Coteries' },
  { file: 'Mecânicas/Chicago by Night - Spirit of the City (Tabelas de Eventos).md', id: 'chicago-by-night-spirit-of-the-city-tabelas-de-eventos', title: 'Chicago by Night - Spirit of the City (Tabelas de Eventos)' },
  { file: "Mecânicas/Clãs do Player's Guide — Banes e Compulsões.md", id: "clas-do-player-s-guide-banes-e-compulsoes", title: "Clãs do Player's Guide — Banes e Compulsões" },
  { file: 'Mecânicas/Companion - Conceitos, Arquétipos e Condução de Mortais e Ghouls.md', id: 'companion-conceitos-arquetipos-e-conducao-de-mortais-e-ghouls', title: 'Companion - Conceitos, Arquétipos e Condução de Mortais e Ghouls' },
  { file: 'Mecânicas/Core - Armas, Armaduras e Itens.md', id: 'core-armas-armaduras-e-itens', title: 'Core - Armas, Armaduras e Itens' },
  { file: 'Mecânicas/Core - Caça, Hunting Grounds e Sangue Contaminado.md', id: 'core-caca-hunting-grounds-e-sangue-contaminado', title: 'Core - Caça, Hunting Grounds e Sangue Contaminado' },
  { file: 'Mecânicas/Core - Cenas, Modos de Jogo e Ritmo.md', id: 'core-cenas-modos-de-jogo-e-ritmo', title: 'Core - Cenas, Modos de Jogo e Ritmo' },
  { file: 'Mecânicas/Core - Conflito Avançado (Advance, Três Trocas e Concessões).md', id: 'core-conflito-avancado-advance-tres-trocas-e-concessoes', title: 'Core - Conflito Avançado (Advance, Três Trocas e Concessões)' },
  { file: 'Mecânicas/Core - Criação de Personagem.md', id: 'core-criacao-de-personagem', title: 'Core - Criação de Personagem' },
  { file: 'Mecânicas/Core - Haven Merits e Mortal Templates.md', id: 'core-haven-merits-e-mortal-templates', title: 'Core - Haven Merits e Mortal Templates' },
  { file: 'Mecânicas/Core - Intimidade Kindred e Compulsion Variants.md', id: 'core-intimidade-kindred-e-compulsion-variants', title: 'Core - Intimidade Kindred e Compulsion Variants' },
  { file: 'Mecânicas/Core - Jogo Consciente (Considerate Play).md', id: 'core-jogo-consciente-considerate-play', title: 'Core - Jogo Consciente (Considerate Play)' },
  { file: 'Mecânicas/Core - Loresheets (parte 1).md', id: 'core-loresheets-parte-1', title: 'Core - Loresheets (parte 1)' },
  { file: 'Mecânicas/Core - Loresheets (parte 2).md', id: 'core-loresheets-parte-2', title: 'Core - Loresheets (parte 2)' },
  { file: 'Mecânicas/Core - Loresheets (parte 3).md', id: 'core-loresheets-parte-3', title: 'Core - Loresheets (parte 3)' },
  { file: 'Mecânicas/Core - Marks e Hitting the Streets.md', id: 'core-marks-e-hitting-the-streets', title: 'Core - Marks e Hitting the Streets' },
  { file: 'Mecânicas/Core - Memoriam.md', id: 'core-memoriam', title: 'Core - Memoriam' },
  { file: 'Mecânicas/Core - Prestation e Boons.md', id: 'core-prestation-e-boons', title: 'Core - Prestation e Boons' },
  { file: 'Mecânicas/Core - Projects.md', id: 'core-projects', title: 'Core - Projects' },
  { file: 'Mecânicas/Core - Standard Feats.md', id: 'core-standard-feats', title: 'Core - Standard Feats' },
  { file: 'Mecânicas/Core - Tipos de Coterie.md', id: 'core-tipos-de-coterie', title: 'Core - Tipos de Coterie' },
  { file: 'Mecânicas/Core - Verdades e Mentiras sobre Vampiros e Ways Out.md', id: 'core-verdades-e-mentiras-sobre-vampiros-e-ways-out', title: 'Core - Verdades e Mentiras sobre Vampiros e Ways Out' },
  { file: 'Mecânicas/Cults of the Blood Gods - Ashfinders (Ashe e Alchemy).md', id: 'cults-of-the-blood-gods-ashfinders-ashe-e-alchemy', title: 'Cults of the Blood Gods - Ashfinders (Ashe e Alchemy)' },
  { file: 'Mecânicas/Cults of the Blood Gods - Construção de Cultos (Estrutura e Backgrounds).md', id: 'cults-of-the-blood-gods-construcao-de-cultos-estrutura-e-backgrounds', title: 'Cults of the Blood Gods - Construção de Cultos (Estrutura e Backgrounds)' },
  { file: 'Mecânicas/Cults of the Blood Gods - Construção de Cultos (Tabelas).md', id: 'cults-of-the-blood-gods-construcao-de-cultos-tabelas', title: 'Cults of the Blood Gods - Construção de Cultos (Tabelas)' },
  { file: 'Mecânicas/Cults of the Blood Gods - Nephilim (Vitae de Michael e Convictions).md', id: 'cults-of-the-blood-gods-nephilim-vitae-de-michael-e-convictions', title: 'Cults of the Blood Gods - Nephilim (Vitae de Michael e Convictions)' },
  { file: "Mecânicas/Player's Guide — Antagonistas Consolidados.md", id: "player-s-guide-antagonistas-consolidados", title: "Player's Guide — Antagonistas Consolidados" },
  { file: "Mecânicas/Player's Guide — Backgrounds, Merits e Flaws.md", id: "player-s-guide-backgrounds-merits-e-flaws", title: "Player's Guide — Backgrounds, Merits e Flaws" },
  { file: "Mecânicas/Player's Guide — Blood Sorcery e Thin-Blood Alchemy.md", id: "player-s-guide-blood-sorcery-e-thin-blood-alchemy", title: "Player's Guide — Blood Sorcery e Thin-Blood Alchemy" },
  { file: "Mecânicas/Player's Guide — Castoffs.md", id: "player-s-guide-castoffs", title: "Player's Guide — Castoffs" },
  { file: "Mecânicas/Player's Guide — Coteries.md", id: "player-s-guide-coteries", title: "Player's Guide — Coteries" },
  { file: "Mecânicas/Player's Guide — Criação Rápida e Referências de Personagem.md", id: "player-s-guide-criacao-rapida-e-referencias-de-personagem", title: "Player's Guide — Criação Rápida e Referências de Personagem" },
  { file: "Mecânicas/Player's Guide — Domínio e Merits de Clã de Coterie.md", id: "player-s-guide-dominio-e-merits-de-cla-de-coterie", title: "Player's Guide — Domínio e Merits de Clã de Coterie" },
  { file: "Mecânicas/Player's Guide — Loresheets e Bloodlines Hecata.md", id: "player-s-guide-loresheets-e-bloodlines-hecata", title: "Player's Guide — Loresheets e Bloodlines Hecata" },
  { file: "Mecânicas/Player's Guide — Memoriam, Projects e Touchstones.md", id: "player-s-guide-memoriam-projects-e-touchstones", title: "Player's Guide — Memoriam, Projects e Touchstones" },
  { file: "Mecânicas/Player's Guide — Oblivion e Cerimônias.md", id: "player-s-guide-oblivion-e-cerimonias", title: "Player's Guide — Oblivion e Cerimônias" },
  { file: "Mecânicas/Player's Guide — Poderes de Disciplina.md", id: "player-s-guide-poderes-de-disciplina", title: "Player's Guide — Poderes de Disciplina" },
  { file: 'Narração/Book of Nod - Prompts de Aventura.md', id: 'book-of-nod-prompts-de-aventura', title: 'Book of Nod - Prompts de Aventura' },
  { file: 'Narração/Chicago by Night - Coteries de Chicago.md', id: 'chicago-by-night-coteries-de-chicago', title: 'Chicago by Night - Coteries de Chicago' },
  { file: 'Narração/Chicago by Night - Ganchos de Crônica (Capítulo 7).md', id: 'chicago-by-night-ganchos-de-cronica-capitulo-7', title: 'Chicago by Night - Ganchos de Crônica (Capítulo 7)' },
  { file: 'Narração/Chicago by Night - Smoke and Mirrors e Status dos SPCs.md', id: 'chicago-by-night-smoke-and-mirrors-e-status-dos-spcs', title: 'Chicago by Night - Smoke and Mirrors e Status dos SPCs' },
  { file: 'Narração/Chicago by Night - SPCs Banu Haqim e Brujah.md', id: 'chicago-by-night-spcs-banu-haqim-e-brujah', title: 'Chicago by Night - SPCs Banu Haqim e Brujah' },
  { file: 'Narração/Chicago by Night - SPCs Caitiff, Gangrel e Thin-Bloods.md', id: 'chicago-by-night-spcs-caitiff-gangrel-e-thin-bloods', title: 'Chicago by Night - SPCs Caitiff, Gangrel e Thin-Bloods' },
  { file: 'Narração/Chicago by Night - SPCs dos Capítulos 7 e 8 e Modelos Genéricos.md', id: 'chicago-by-night-spcs-dos-capitulos-7-e-8-e-modelos-genericos', title: 'Chicago by Night - SPCs dos Capítulos 7 e 8 e Modelos Genéricos' },
  { file: 'Narração/Chicago by Night - SPCs Lasombra, Malkavian e Ministry.md', id: 'chicago-by-night-spcs-lasombra-malkavian-e-ministry', title: 'Chicago by Night - SPCs Lasombra, Malkavian e Ministry' },
  { file: 'Narração/Chicago by Night - SPCs Nosferatu, Toreador e Tremere.md', id: 'chicago-by-night-spcs-nosferatu-toreador-e-tremere', title: 'Chicago by Night - SPCs Nosferatu, Toreador e Tremere' },
  { file: 'Narração/Chicago by Night - SPCs Ventrue.md', id: 'chicago-by-night-spcs-ventrue', title: 'Chicago by Night - SPCs Ventrue' },
  { file: 'Narração/Chicago by Night - The Sacrifice (Estrutura e Testes).md', id: 'chicago-by-night-the-sacrifice-estrutura-e-testes', title: 'Chicago by Night - The Sacrifice (Estrutura e Testes)' },
  { file: 'Narração/Core - Antagonistas.md', id: 'core-antagonistas', title: 'Core - Antagonistas' },
  { file: 'Narração/Core - Cidades e Domínios.md', id: 'core-cidades-e-dominios', title: 'Core - Cidades e Domínios' },
  { file: 'Narração/Core - Conceitos de Crônica Prontos.md', id: 'core-conceitos-de-cronica-prontos', title: 'Core - Conceitos de Crônica Prontos' },
  { file: 'Narração/Core - Crônicas - Conduzindo o Jogo.md', id: 'core-cronicas-conduzindo-o-jogo', title: 'Core - Crônicas - Conduzindo o Jogo' },
  { file: 'Narração/Core - Crônicas - Planejamento e Estilos.md', id: 'core-cronicas-planejamento-e-estilos', title: 'Core - Crônicas - Planejamento e Estilos' },
  { file: 'Narração/Core - Segunda Inquisição em Crônicas.md', id: 'core-segunda-inquisicao-em-cronicas', title: 'Core - Segunda Inquisição em Crônicas' },
  { file: 'Narração/Cults of the Blood Gods - Ashfinders (Beast Shards, Amber e Mortius).md', id: 'cults-of-the-blood-gods-ashfinders-beast-shards-amber-e-mortius', title: 'Cults of the Blood Gods - Ashfinders (Beast Shards, Amber e Mortius)' },
  { file: 'Narração/Cults of the Blood Gods - Cultos Mortais (House of Anteros e Church of Means).md', id: 'cults-of-the-blood-gods-cultos-mortais-house-of-anteros-e-church-of-means', title: 'Cults of the Blood Gods - Cultos Mortais (House of Anteros e Church of Means)' },
  { file: 'Narração/Cults of the Blood Gods - Cultos Mortais (Leah, Eligos e Broken Branch).md', id: 'cults-of-the-blood-gods-cultos-mortais-leah-eligos-e-broken-branch', title: 'Cults of the Blood Gods - Cultos Mortais (Leah, Eligos e Broken Branch)' },
  { file: 'Narração/Cults of the Blood Gods - Nephilim (Annatoliya e Angels of Vengeance).md', id: 'cults-of-the-blood-gods-nephilim-annatoliya-e-angels-of-vengeance', title: 'Cults of the Blood Gods - Nephilim (Annatoliya e Angels of Vengeance)' },
  { file: 'Narração/Fall of London - Cenas e Testes (Cap. 3 - Family Matters).md', id: 'fall-of-london-cenas-e-testes-cap-3-family-matters', title: 'Fall of London - Cenas e Testes (Cap. 3 - Family Matters)' },
  { file: 'Narração/Fall of London - Cenas e Testes (Cap. 4 - What Hides Beneath).md', id: 'fall-of-london-cenas-e-testes-cap-4-what-hides-beneath', title: 'Fall of London - Cenas e Testes (Cap. 4 - What Hides Beneath)' },
  { file: 'Narração/Fall of London - Cenas e Testes (Cap. 5 - Red Lists and Red Caps).md', id: 'fall-of-london-cenas-e-testes-cap-5-red-lists-and-red-caps', title: 'Fall of London - Cenas e Testes (Cap. 5 - Red Lists and Red Caps)' },
  { file: 'Narração/Fall of London - Cenas e Testes (Cap. 6 e Epílogo).md', id: 'fall-of-london-cenas-e-testes-cap-6-e-epilogo', title: 'Fall of London - Cenas e Testes (Cap. 6 e Epílogo)' },
  { file: 'Narração/Fall of London - Cenas e Testes (Caps. 1-2).md', id: 'fall-of-london-cenas-e-testes-caps-1-2', title: 'Fall of London - Cenas e Testes (Caps. 1-2)' },
  { file: 'Narração/Fall of London - Ganchos de História (Stories Told by Night).md', id: 'fall-of-london-ganchos-de-historia-stories-told-by-night', title: 'Fall of London - Ganchos de História (Stories Told by Night)' },
  { file: 'Narração/Forbidden Religions - Dreams of Golconda.md', id: 'forbidden-religions-dreams-of-golconda', title: 'Forbidden Religions - Dreams of Golconda' },
  { file: 'Narração/Forbidden Religions - Eschatological Thought.md', id: 'forbidden-religions-eschatological-thought', title: 'Forbidden Religions - Eschatological Thought' },
  { file: 'Narração/Forbidden Religions - NPCs e Estatísticas.md', id: 'forbidden-religions-npcs-e-estatisticas', title: 'Forbidden Religions - NPCs e Estatísticas' },
  { file: 'Narração/Forbidden Religions - Pathways to Power.md', id: 'forbidden-religions-pathways-to-power', title: 'Forbidden Religions - Pathways to Power' },
  { file: 'Narração/Forbidden Religions - Ruinous Beliefs.md', id: 'forbidden-religions-ruinous-beliefs', title: 'Forbidden Religions - Ruinous Beliefs' },
  { file: 'Narração/Segunda Inquisição - Cinco Tochas e Parceiros (Cap. 4).md', id: 'segunda-inquisicao-cinco-tochas-e-parceiros-cap-4', title: 'Segunda Inquisição - Cinco Tochas e Parceiros (Cap. 4)' },
  { file: 'Narração/Segunda Inquisição - Estruturas de Crônica e Temas (Cap. 5).md', id: 'segunda-inquisicao-estruturas-de-cronica-e-temas-cap-5', title: 'Segunda Inquisição - Estruturas de Crônica e Temas (Cap. 5)' },
  { file: 'Narração/Segunda Inquisição - Farm Teams (Cap. 4).md', id: 'segunda-inquisicao-farm-teams-cap-4', title: 'Segunda Inquisição - Farm Teams (Cap. 4)' },
  { file: 'Narração/Segunda Inquisição - Táticas Investigativas e de Canalização (Cap. 3).md', id: 'segunda-inquisicao-taticas-investigativas-e-de-canalizacao-cap-3', title: 'Segunda Inquisição - Táticas Investigativas e de Canalização (Cap. 3)' },
  { file: 'Narração/Segunda Inquisição - Táticas Operacionais, Projetos e Response Algorithm (Cap. 3).md', id: 'segunda-inquisicao-taticas-operacionais-projetos-e-response-algorithm-cap-3', title: 'Segunda Inquisição - Táticas Operacionais, Projetos e Response Algorithm (Cap. 3)' },
  { file: 'Narração/Segunda Inquisição - Veículos, XTech e Artefatos.md', id: 'segunda-inquisicao-veiculos-xtech-e-artefatos', title: 'Segunda Inquisição - Veículos, XTech e Artefatos' },
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
  'Book of Nod - Prompts de Aventura',
  'Chicago by Night - Coteries de Chicago',
  'Chicago by Night - Ganchos de Crônica (Capítulo 7)',
  'Chicago by Night - Smoke and Mirrors e Status dos SPCs',
  'Chicago by Night - SPCs Banu Haqim e Brujah',
  'Chicago by Night - SPCs Caitiff, Gangrel e Thin-Bloods',
  'Chicago by Night - SPCs dos Capítulos 7 e 8 e Modelos Genéricos',
  'Chicago by Night - SPCs Lasombra, Malkavian e Ministry',
  'Chicago by Night - SPCs Nosferatu, Toreador e Tremere',
  'Chicago by Night - SPCs Ventrue',
  'Chicago by Night - The Sacrifice (Estrutura e Testes)',
  'Core - Antagonistas',
  'Core - Cidades e Domínios',
  'Core - Conceitos de Crônica Prontos',
  'Core - Crônicas - Conduzindo o Jogo',
  'Core - Crônicas - Planejamento e Estilos',
  'Core - Segunda Inquisição em Crônicas',
  'Cults of the Blood Gods - Ashfinders (Beast Shards, Amber e Mortius)',
  'Cults of the Blood Gods - Cultos Mortais (House of Anteros e Church of Means)',
  'Cults of the Blood Gods - Cultos Mortais (Leah, Eligos e Broken Branch)',
  'Cults of the Blood Gods - Nephilim (Annatoliya e Angels of Vengeance)',
  'Fall of London - Cenas e Testes (Cap. 3 - Family Matters)',
  'Fall of London - Cenas e Testes (Cap. 4 - What Hides Beneath)',
  'Fall of London - Cenas e Testes (Cap. 5 - Red Lists and Red Caps)',
  'Fall of London - Cenas e Testes (Cap. 6 e Epílogo)',
  'Fall of London - Cenas e Testes (Caps. 1-2)',
  'Fall of London - Ganchos de História (Stories Told by Night)',
  'Forbidden Religions - Dreams of Golconda',
  'Forbidden Religions - Eschatological Thought',
  'Forbidden Religions - NPCs e Estatísticas',
  'Forbidden Religions - Pathways to Power',
  'Forbidden Religions - Ruinous Beliefs',
  'Segunda Inquisição - Cinco Tochas e Parceiros (Cap. 4)',
  'Segunda Inquisição - Estruturas de Crônica e Temas (Cap. 5)',
  'Segunda Inquisição - Farm Teams (Cap. 4)',
  'Segunda Inquisição - Táticas Investigativas e de Canalização (Cap. 3)',
  'Segunda Inquisição - Táticas Operacionais, Projetos e Response Algorithm (Cap. 3)',
  'Segunda Inquisição - Veículos, XTech e Artefatos',
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

const BASE_GROUPS = new Set(['Core']);

const GROUP_PREFIX = /^(.+?) [—-] (.+)$/;

function groupOf(title: string): { group?: string; label?: string } {
  const override = GROUP_OVERRIDES[title];
  if (override) return override;
  const prefixed = GROUP_PREFIX.exec(title);
  if (!prefixed) return {};
  if (BASE_GROUPS.has(prefixed[1])) return { label: prefixed[2] };
  return { group: prefixed[1], label: prefixed[2] };
}

const partOf = (group?: string): 'base' | 'extras' => (group ? 'extras' : 'base');

const sortKey = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function compareSections(first: VaultSection, second: VaultSection): number {
  if (first.part !== second.part) return first.part === 'base' ? -1 : 1;
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
    const grouping = groupOf(note.title);
    return { id: note.id, title: note.title, html, audience: audienceOf(note.title), part: partOf(grouping.group), ...grouping };
  }).sort(compareSections);
}
