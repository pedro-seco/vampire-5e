import disciplinesData from '../data/disciplines.json';
import type { DisciplinePower, SkillKey } from '../types/character';

export interface SkillReference {
  source: string;
  body: string;
  levels: string[] | null;
  specialties: string;
}

export interface PowerReference {
  title: string;
  subtitle: string;
  source: string;
  body: string;
  cost: string;
  pool: string;
  system: string;
}

const VAULT_SOURCE = 'RESUMO DA VAULT';

const SKILL_SUMMARIES: Record<SkillKey, [string, string]> = {
  athletics: ['Corrida, natação, escalada, acrobacia, saltos. Qualquer esforço físico que não seja combate direto.', 'Corrida, Natação, Escalada, Acrobacia, Parkour, Salto'],
  brawl: ['Combate desarmado — socos, chutes, grappling, mordidas vampíricas como ataque.', 'Boxe, Grappling, Luta de Rua, Mordida, Defesa'],
  craft: ['Criação e reparo de objetos físicos — carpintaria, mecânica, armas, arte plástica, culinária, hacking de hardware.', 'Mecânica, Eletrônica, Armas, Carpintaria, Explosivos, Arte Plástica'],
  drive: ['Operar veículos — carros, motos, barcos, aeronaves leves. Perseguições e manobras evasivas.', 'Carros, Motos, Barcos, Perseguições, Evasão, Aeronaves'],
  firearms: ['Uso de armas de fogo — pistolas, rifles, escopetas, armas automáticas.', 'Pistola, Rifle, Escopeta, Atirador de Elite, Tiro Rápido, Armas Automáticas'],
  larceny: ['Arrombamento, pickpocket, safecracking, vigilância furtiva, roubo planejado.', 'Arrombamento, Pickpocket, Cofres, Alarmes, Vigilância'],
  melee: ['Combate com armas brancas — facas, espadas, bastões, correntes, qualquer objeto contundente ou cortante.', 'Faca, Espada, Bastão, Combate de Dois Pesos, Armas Improvisadas'],
  stealth: ['Movimento furtivo, camuflagem, seguir alvos sem ser detectado, infiltração.', 'Infiltração, Camuflagem, Seguimento, Ambientes Urbanos, Silêncio'],
  survival: ['Sobrevivência em ambientes hostis — floresta, deserto, ártico, zonas urbanas destruídas. Rastrear, encontrar abrigo, orientação.', 'Rastreamento, Floresta, Deserto, Caça, Navegação, Zona Urbana'],
  animalKen: ['Entender, treinar e interagir com animais. Sinergiza com Animalism.', 'Cães, Cavalos, Predadores, Pássaros, Animais Selvagens'],
  etiquette: ['Protocolo social, maneiras, conhecimento de hierarquias e costumes culturais — tanto mortais quanto Kindred.', 'Alta Sociedade, Elysium Kindred, Protocolo Militar, Negócios, Diplomacia'],
  insight: ['Leitura de pessoas — motivações, mentiras, emoções ocultas, intenções reais.', 'Detectar Mentiras, Motivações, Emoções, Linguagem Corporal'],
  intimidation: ['Ameaças, presença física ameaçadora, coerção, terror — tanto físico quanto psicológico.', 'Ameaças Físicas, Coerção Psicológica, Interrogatório, Terror, Chantagem'],
  leadership: ['Inspirar, coordenar e liderar grupos — seja por carisma, autoridade ou competência.', 'Combate, Política, Crise, Inspiração, Coterie'],
  performance: ['Atuação, música, dança, oratória, qualquer forma de expressão artística ao vivo.', 'Música, Teatro, Dança, Oratória, Instrumento Específico'],
  persuasion: ['Convencimento verbal e argumentação — lógica, apelo emocional, negociação, sedução verbal.', 'Sedução, Negociação, Engano, Debate, Discurso Público'],
  streetwise: ['Conhecimento do submundo, redes criminais, linguagem de rua, como se mover em ambientes urbanos perigosos.', 'Tráfico, Informantes, Gangues, Mercado Negro, Territórios'],
  subterfuge: ['Engano ativo — mentir, disfarçar intenções, manipular sem que percebam, atuar como outra pessoa.', 'Mentira, Disfarce, Manipulação, Personas, Interrogatório Reverso'],
  academics: ['Conhecimento formal em humanidades — história, literatura, filosofia, teologia, linguística, direito.', 'História, Filosofia, Teologia, Direito, Literatura, Linguística, Noddismo'],
  awareness: ['Percepção sensorial ativa — notar o que está fora do lugar, sentir que está sendo seguido, detectar armadilhas ou emboscadas.', 'Emboscadas, Vigilância, Presença Sobrenatural, Seguimento, Detalhes'],
  finance: ['Finanças, contabilidade, mercados, lavagem de dinheiro, estruturas corporativas.', 'Contabilidade, Mercado de Ações, Lavagem de Dinheiro, Imóveis, Estruturas Corporativas'],
  investigation: ['Pesquisa, análise de evidências, resolução de quebra-cabeças, interrogatório lógico.', 'Cenas de Crime, Pesquisa em Arquivo, Vigilância, Interrogatório, Ocultismo'],
  medicine: ['Anatomia, primeiros socorros, diagnóstico, cirurgia, farmacologia — e como o corpo humano funciona para alimentação e dano.', 'Cirurgia, Farmacologia, Anatomia, Primeiros Socorros, Toxicologia, Medicina Vampírica'],
  occult: ['Conhecimento do oculto, sobrenatural, Kindred, outras criaturas, magia, rituais — tanto folclore quanto realidade.', 'Kindred, Blood Sorcery, Hecata, Outras Criaturas, Noddismo, Folclore Vampírico'],
  politics: ['Estruturas políticas, jogos de poder, hierarquias formais e informais — tanto mortal quanto Kindred.', 'Política Mortal, Hierarquia Kindred, Elysium, Camarilla, Anarquistas, Sabbat'],
  science: ['Ciências naturais — física, química, biologia, engenharia. Matemática aplicada.', 'Química, Biologia, Física, Engenharia, Forense, Computação'],
  technology: ['Computadores, redes, hacking, sistemas eletrônicos, vigilância digital, contramedidas.', 'Hacking, Redes, Vigilância, Contramedidas, Programação, Engenharia Social'],
};

const OFFICIAL_SKILLS: Partial<Record<SkillKey, SkillReference>> = {
  stealth: {
    source: 'CORE · P. 164',
    body: 'Stealth allows a character to shadow a target, making vampires with this ability superlative hunters. They benefit from the ability to spy, sneak, and blend in with crowds when needed.',
    levels: [
      'Spotting you under the cover of darkness or in camouflage proves difficult.',
      'You can sneak by casual observers and stalk unknowing victims without raising any hackles.',
      'You evade patrolling guards, moving softly and hiding easily.',
      'Your subtle, silent passage could make you a worthy ninja — or a worthy foe for ninja.',
      'The Children of Haqim come to you for advice on stalking and hiding, if they can find you.',
    ],
    specialties: 'Ambushes, Crowds, Disguise, Hiding, Shadowing, Silent Movement, Urban, Wilderness',
  },
};

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
  const official = OFFICIAL_SKILLS[skill];
  if (official) return official;
  const [body, specialties] = SKILL_SUMMARIES[skill];
  return { source: VAULT_SOURCE, body, levels: null, specialties };
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
