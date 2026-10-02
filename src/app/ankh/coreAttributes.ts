import type { Attributes } from '../types/character';

export interface AttributeText {
  source: string;
  body: string;
  levels: string[];
}

export const CORE_ATTRIBUTES: Record<keyof Attributes, AttributeText> = {
  strength: {
    source: 'CORE · P. 155',
    body: 'Strength governs how big a mortal you can lift, how hard you can hit them, and how much force you can push your dead body to exert. (The rough amount you can deadlift without an Attribute test appears in parentheses below.)',
    levels: [
      'You can easily crush a beer can. (20 kg: a Christmas tree, a stop sign)',
      'You are physically average. (45 kg: a toilet)',
      'You might be able to break open a wooden door. (115 kg: a large human, an empty coffin, a refrigerator)',
      'You are a prime physical specimen, likely with very visible musculature. (180 kg: a full coffin, an empty dumpster)',
      'You are a true powerhouse and can likely break open a metal fire door, tear open a chain-link fence, or snap open a chained gate. (250 kg: a motorcycle, a piano)',
    ],
  },
  dexterity: {
    source: 'CORE · P. 155',
    body: 'Dexterity governs your agility and grace, how swiftly you dodge that stake to your heart, and how much fine motor control you possess when up against the clock.',
    levels: [
      'You can run, but balance and dodging are a challenge.',
      'Your sprint is solid, and sometimes you appear graceful.',
      'Your agility is impressive, and your coordination is as good as any trained amateur.',
      'You could excel at acrobatics and move in a way few humans can.',
      'Your movements are liquid and hypnotic – almost superhuman.',
    ],
  },
  stamina: {
    source: 'CORE · P. 155',
    body: 'Your physical resistance: Stamina absorbs physical harm, such as a speeding bullet or a hunter’s blade, and lets you persevere through hazards and arduous effort. Your Stamina + 3 equals your Health.',
    levels: [
      'Even lesser exertions make you winded.',
      'You can take a beating, but consider suing for peace.',
      'Several days of hard hiking with a backpack is no problem for you.',
      'You could win a marathon or take copious amounts of pain, at least physically.',
      'Even if you were a mortal, you’d never break a sweat.',
    ],
  },
  charisma: {
    source: 'CORE · P. 156',
    body: 'Charisma measures your natural charm, grace, and sex appeal. If you have it, it draws people to you, making feeding a hell of a lot easier. Charisma doesn’t depend on good looks, which are their own Merit (See Looks, p. 179).',
    levels: [
      'You can speak clearly, though few people tend to listen.',
      'Generally likeable despite your undead nature, you may even have friends.',
      'People trust you implicitly, and you easily make friends.',
      'You possess significant personal magnetism and draw followers like flies.',
      'You could lead a city in rebellion, if you so choose.',
    ],
  },
  manipulation: {
    source: 'CORE · P. 156',
    body: 'Manipulation is your ability to twist others to your point of view, lie convincingly, and walk away after duping a mark without anyone being any the wiser.',
    levels: [
      'As long as you stay honest, you can convince people to do what you want.',
      'Your ability to deceive surpasses the will of the weak-willed and simple-minded.',
      'You never have to pay full price for anything.',
      'You could be a cult leader – or a politician.',
      'You could convince the Prince to invest in desert property, or maybe even to call off the Blood Hunt on your head.',
    ],
  },
  composure: {
    source: 'CORE · P. 156',
    body: 'Composure allows you to remain calm, to command your emotions, and to put others at ease despite anxiety. It is also represents your ability to stay cool in everything from firefights to intimate encounters. Your Composure + Resolve equals your Willpower (p. 157).',
    levels: [
      'The slightest insult or confrontation could drive you to frenzy.',
      'You can subdue your predatory instincts in most nonhostile situations.',
      'Others look to you for guidance when the blood spatter hits the fan.',
      'You can effortlessly bluff at cards and can manage your Beast to some extent.',
      'The Beast is your pet.',
    ],
  },
  intelligence: {
    source: 'CORE · P. 156',
    body: 'Intelligence measures your ability to reason, research, and apply logic. You can recall and analyze information from books or from your senses. No puzzle or mystery can elude the truly intelligent.',
    levels: [
      'You can read and write competently, though some terms confound you.',
      'You are smart enough to realize your limitations.',
      'You are enlightened, able to piece together clues without difficulty.',
      'You’re likely consulted by members of Clan Tremere for your wisdom.',
      'Genius does not cover the depths and range of your intellect.',
    ],
  },
  wits: {
    source: 'CORE · P. 156',
    body: 'Wits are for thinking quickly and reacting correctly on little information. “You hear a sound” is Wits; “You hear two guards coming” is Intelligence. Wits let you smell an ambush or answer the Harpy back at court right away, instead of thinking of the best response the next night.',
    levels: [
      'You get the point eventually, but it takes explaining.',
      'You can bet the odds in poker or apply the emergency brakes in time. Usually.',
      'You can analyze a situation and quickly work out the best escape route.',
      'You are never caught on the back foot and always come up with a smart riposte.',
      'You think and respond more quickly than most people can comprehend.',
    ],
  },
  resolve: {
    source: 'CORE · P. 157',
    body: 'Resolve provides focus and determination, and measures concentration and mental fortitude. Resolve powers all-night watches and blocks out distractions. Your Composure + Resolve equals your Willpower.',
    levels: [
      'You have minimal attention for all but the most pressing things.',
      'You can settle in for the long haul, as long as it’s not too long.',
      'Distracting you takes more effort than most other people want to spend.',
      'You can brute-force your way to a deduction past any obstacles.',
      'You can think in a gunfight or watch the door in a blood orgy and then clean up every shell casing or spilled droplet.',
    ],
  },
};
