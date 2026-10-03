import type { Character, SkillKey, Skills } from '../types/character';

export const DEFAULT_CHARACTER: Character = {
  id: 'khalil',
  name: 'Khalil Mansour',
  aliases: '"O Dragomano" · "Ibn al-Zill" · "Oberon-7"',
  clan: 'Nosferatu',
  generation: '9th',
  predatorType: 'Alleycat',
  faction: 'Anarquistas',
  embrace: '1916 · Cairo',
  sire: 'al-Musawwir',
  languages: 'Arabic · French · Turkish · English',
  xpTotal: '',
  xpSpent: '',
  attributes: {
    strength: 2, dexterity: 4, stamina: 2,
    charisma: 1, manipulation: 3, composure: 3,
    intelligence: 2, wits: 3, resolve: 2,
  },
  skills: {
    athletics: { value: 1, specialty: '' },
    brawl: { value: 3, specialty: '' },
    craft: { value: 0, specialty: '' },
    drive: { value: 0, specialty: '' },
    firearms: { value: 0, specialty: '' },
    larceny: { value: 2, specialty: '' },
    melee: { value: 0, specialty: '' },
    stealth: { value: 4, specialty: 'Infiltration' },
    survival: { value: 0, specialty: '' },
    animalKen: { value: 2, specialty: '' },
    etiquette: { value: 0, specialty: '' },
    insight: { value: 0, specialty: '' },
    intimidation: { value: 0, specialty: '' },
    leadership: { value: 0, specialty: '' },
    performance: { value: 0, specialty: '' },
    persuasion: { value: 0, specialty: '' },
    streetwise: { value: 1, specialty: '' },
    subterfuge: { value: 3, specialty: '' },
    academics: { value: 0, specialty: '' },
    awareness: { value: 3, specialty: '' },
    finance: { value: 0, specialty: '' },
    investigation: { value: 2, specialty: '' },
    medicine: { value: 0, specialty: '' },
    occult: { value: 0, specialty: '' },
    politics: { value: 1, specialty: '' },
    science: { value: 0, specialty: '' },
    technology: { value: 0, specialty: '' },
  },
  advantages: [
    { name: 'Contacts', level: 3, note: 'Criminosos' },
    { name: 'Haven', level: 1, note: '' },
    { name: 'Linguistics', level: 2, note: '' },
    { name: 'Mask', level: 2, note: '' },
    { name: 'Resources', level: 2, note: '' },
    { name: 'Status', level: 2, note: 'Anarch' },
  ],
  flaws: [
    { name: 'Adversary', level: 2, note: 'Sire — al-Musawwir (Sabbat)' },
    { name: 'Dark Secret', level: 1, note: '' },
    { name: 'Enemy', level: 1, note: '' },
  ],
  trackers: {
    healthMax: 5,
    health: [0, 0, 0, 0, 0],
    willpowerMax: 5,
    willpower: [0, 0, 0, 0, 0],
    hunger: [0, 0, 0, 0, 0],
    humanity: 5,
    humanityStains: 0,
    bp: 3,
    resonance: '',
  },
  disciplines: [
    { name: 'Animalism', level: 3, powers: ['Bond Famulus', 'Feral Whispers', 'Unliving Hive'] },
    { name: 'Obfuscate', level: 2, powers: ['Silence of Death', 'Unseen Passage'] },
    { name: 'Celerity', level: 1, powers: ['Rapid Reflexes'] },
    { name: 'Potence', level: 1, powers: ['Lethal Body'] },
  ],
  inventory: ['Celular descartável', 'Gazuas', 'Identidade falsa (Samir Haddad)'],
  pools: [
    { title: 'Strike (Brawl)', attr: 'strength', skill: 'brawl', specialty: '', disc: 'Potence' },
    { title: 'Stealth', attr: 'dexterity', skill: 'stealth', specialty: 'Infiltration', disc: '' },
  ],
  convictions: [
    'Nunca deixar rastros.',
    'Homens mortos não resolvem nada.',
    'Desconfie de quem lhe pede para fazer o que ele mesmo não faria.',
  ],
  touchstones: [
    {
      name: 'Peter Hollis',
      summary: '†1953 · Espião · MI6',
      linkedConviction: 'Nunca deixar rastros.',
      description:
        'Analista do MI6 que testemunhou o sobrenatural durante uma das operações de Khalil em 1916. Não foi silenciado — foi desacreditado. Viveu de 1919 a 1953 em instituições psiquiátricas, descrevendo com precisão cirúrgica coisas em que ninguém acreditava. Khalil o visitou uma vez, em 1931. Nunca voltou.',
    },
    {
      name: 'Hassan el-Amin',
      summary: 'Mortal · Empresário',
      linkedConviction: 'Homens mortos não resolvem nada.',
      description:
        'Dono de uma rede de bares e restaurantes. Uma fachada logística involuntária — ele não sabe que é. Khalil o conhece há décadas sob identidades diferentes. Hassan acredita ter uma sorte excepcional nos negócios. Representa o custo humano invisível de um século de operações.',
    },
    {
      name: 'Edmund Ashford',
      summary: 'Kindred · Tremere · Abraçado em 1915',
      linkedConviction: 'Desconfie de quem lhe pede para fazer o que ele mesmo não faria.',
      description:
        'Orientalista britânico. Conheceram-se no Cairo em 1916, ambos no Arab Bureau por razões diferentes. Reencontraram-se décadas depois e reconheceram algo imediato — a textura de alguém que estava vivo naquela época. Uma troca operacional duradoura: ocultismo por trabalho de campo. O que nenhum dos dois diz em voz alta é que, quando o outro desaparece por anos sem dar notícia, ele percebe.',
    },
  ],
  background:
    'Nascido em 1883 em Damasco, filho de uma família de dragomanos — intérpretes profissionais que sobreviveram sendo úteis a quem detinha o poder. Trabalhou como intérprete e agente duplo durante as Guerras Balcânicas (1912–13) e a Primeira Guerra Mundial, operando entre o Arab Bureau britânico e a inteligência otomana no Cairo. Abraçado em 1916 por al-Musawwir, um ancião Nosferatu alinhado ao Sabbat, que queria um agente infiltrado no Bureau. Desertou em 1917 forjando a própria destruição. Al-Musawwir ainda acredita que o childe morreu. Desde então atua como "O Dragomano" na contrainteligência do Movimento Anarquista, acumulando um século de operações em Berlim, Paris, Cairo, Buenos Aires e outros centros.',
  notes: '',
};

const EMPTY_SKILL = { value: 0, specialty: '' };

export function blankCharacter(id: string): Character {
  const skills = Object.fromEntries(
    (Object.keys(DEFAULT_CHARACTER.skills) as SkillKey[]).map((skill) => [skill, { ...EMPTY_SKILL }])
  ) as Skills;

  return {
    id,
    name: 'Novo Personagem',
    aliases: '',
    clan: '',
    generation: '',
    predatorType: '',
    faction: '',
    embrace: '',
    sire: '',
    languages: '',
    xpTotal: 0,
    xpSpent: 0,
    attributes: {
      strength: 1, dexterity: 1, stamina: 1,
      charisma: 1, manipulation: 1, composure: 1,
      intelligence: 1, wits: 1, resolve: 1,
    },
    skills,
    advantages: [],
    flaws: [],
    trackers: {
      healthMax: 4, health: [0, 0, 0, 0],
      willpowerMax: 2, willpower: [0, 0],
      hunger: [0, 0, 0, 0, 0],
      humanity: 7, humanityStains: 0, bp: 0, resonance: '',
    },
    disciplines: [],
    inventory: [],
    pools: [],
    convictions: [],
    touchstones: [],
    background: '',
    notes: '',
  };
}
