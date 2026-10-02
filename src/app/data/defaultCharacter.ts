import type { Character } from '../types/character';

export const DEFAULT_CHARACTER: Character = {
  id: 'khalil',
  name: 'Khalil Mansour',
  aliases: '"O Dragomano" · "Ibn al-Zill" · "Oberon-7"',
  clan: 'Nosferatu',
  generation: '9th',
  predatorType: 'Alleycat',
  faction: 'Anarchist',
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
    { name: 'Contacts', level: 3, note: 'Criminal' },
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
  inventory: ['Burner phone', 'Lock picks', 'Fake ID (Samir Haddad)'],
  pools: [
    { title: 'Golpe (corpo a corpo)', attr: 'strength', skill: 'brawl', specialty: '', disc: 'Potence' },
    { title: 'Furtividade', attr: 'dexterity', skill: 'stealth', specialty: 'Infiltration', disc: '' },
  ],
  convictions: [
    'Never leave a trace.',
    'Dead men fix nothing.',
    "Distrust anyone who asks you to do what they wouldn't do themselves.",
  ],
  touchstones: [
    {
      name: 'Peter Hollis',
      summary: '†1953 · Spy · MI6',
      linkedConviction: 'Never leave a trace.',
      description:
        "MI6 analyst who witnessed the supernatural during one of Khalil's 1916 operations. He was not silenced — he was discredited. Lived from 1919 to 1953 in psychiatric institutions, describing with surgical precision things no one believed. Khalil visited once, in 1931. He never went back.",
    },
    {
      name: 'Hassan el-Amin',
      summary: 'Mortal · Businessman',
      linkedConviction: 'Dead men fix nothing.',
      description:
        "Owner of a chain of bars and restaurants. An unwitting logistical front — he doesn't know he is. Khalil has known him for decades under different identities. Hassan believes he has exceptional luck in business. He represents the invisible human cost of a century of operations.",
    },
    {
      name: 'Edmund Ashford',
      summary: 'Kindred · Tremere · Embraced 1915',
      linkedConviction: "Distrust anyone who asks you to do what they wouldn't do themselves.",
      description:
        'British orientalist. They met in Cairo in 1916, both at the Arab Bureau for different reasons. They met again decades later and recognized something immediate — the texture of someone who was alive in that era. A lasting operational exchange: occultism for field work. What neither says aloud is that when the other disappears for years without word, he notices.',
    },
  ],
  background:
    'Born in 1883 in Damascus, son of a family of dragomans — professional interpreters who survived by being useful to whoever held power. He worked as an interpreter and double agent during the Balkan Wars (1912–13) and World War I, operating between the British Arab Bureau and Ottoman intelligence in Cairo. Embraced in 1916 by al-Musawwir, a Nosferatu elder aligned with the Sabbat, who wanted an asset inside the Bureau. Deserted in 1917 by faking his own destruction. Al-Musawwir still believes the childe died. Since then he has operated as "The Dragoman" in Anarchist Movement counter-intelligence, accumulating a century of operations in Berlin, Paris, Cairo, Buenos Aires, and other centers.',
  notes: '',
};

const EMPTY_SKILL = { value: 0, specialty: '' };

export function blankCharacter(id: string): Character {
  const character = structuredClone(DEFAULT_CHARACTER);
  const skillKeys = Object.keys(character.skills) as (keyof typeof character.skills)[];

  character.id = id;
  character.name = 'New Character';
  character.aliases = '';
  character.trackers = {
    healthMax: 5, health: [0, 0, 0, 0, 0],
    willpowerMax: 5, willpower: [0, 0, 0, 0, 0],
    hunger: [0, 0, 0, 0, 0],
    humanity: 7, humanityStains: 0, bp: 1, resonance: '',
  };
  character.attributes = {
    strength: 1, dexterity: 1, stamina: 1,
    charisma: 1, manipulation: 1, composure: 1,
    intelligence: 1, wits: 1, resolve: 1,
  };
  for (const skill of skillKeys) character.skills[skill] = { ...EMPTY_SKILL };
  character.advantages = [];
  character.flaws = [];
  character.disciplines = [];
  character.inventory = [];
  character.convictions = [];
  character.touchstones = [];
  character.background = '';
  return character;
}
