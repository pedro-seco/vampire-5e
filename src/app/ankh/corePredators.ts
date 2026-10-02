export interface PredatorText {
  source: string;
  body: string;
  details: string[];
}

export const CORE_PREDATORS: Record<string, PredatorText> = {
  'Alleycat': {
    source: 'CORE · P. 175',
    body: 'A combative assault-feeder, you stalk, overpower, and drink from whomever you can, when you can. You may or may not attempt to threaten or Dominate victims into silence or mask the feeding as a robbery. Think about how you arrived at this direct approach to feeding and what makes you comfortable with an unlife of stalking, attacking, feeding, and escaping. You could have been homeless, an SAS soldier, a cartel hit-man, or a big-game hunter.',
    details: [
      'Add a specialty: Intimidation (Stickups) or Brawl (Grappling)',
      'Gain one dot of Celerity or Potence',
      'Lose one dot of Humanity',
      'Gain three dots of criminal Contacts',
    ],
  },
  'Bagger': {
    source: 'CORE · P. 176',
    body: 'You steal, buy, or otherwise procure cold blood rather than hunt, relying on the black market or your skills as a burglar or ambulance chaser. Perhaps you still work the night shift at the hospital. Ventrue may not pick this Predator type.',
    details: [
      'Add a specialty: Larceny (Lockpicking) or Streetwise (Black Market)',
      'Gain one dot of Blood Sorcery (Tremere only) or Obfuscate',
      'Gain the Feeding Merit: Iron Gullet (•••)',
      'Gain the Enemy Flaw: (••)Either someone believes you owe them, or there’s another reason you keep off the streets.',
    ],
  },
  'Blood Leech': {
    source: 'CORE · P. 176',
    body: 'You drink from other vampires, either by hunting, coercion or by taking Blood as payment - the only truly moral way of feeding you can think of. Unfortunately, this practice is usually forbidden in Kindred society. It is either risky as all fuck or requires a position of enviable power.',
    details: [
      'Add a specialty: Brawl (Kindred) or Stealth (against Kindred)',
      'Gain one dot of Celerity or Protean',
      'Lose one dot of Humanity',
      'Increase Blood Potency by one',
      'Gain the Dark Secret Flaw: (••) Diablerist, or the Shunned Flaw: (••)',
      'Gain the Feeding Flaw: (••) Prey Exclusion (mortals)',
    ],
  },
  'Cleaver': {
    source: 'CORE · P. 176',
    body: 'You feed covertly from your (or someone’s) mortal family and friends with whom you still maintain ties. The most extreme cleavers adopt children, marry a human, and try to maintain a family life for as long as they can. Add your family to the Relationship Map. Cleavers often go to great lengths to keep the truth of their condition from their family, but some also maintain unwholesome relationships with their own kin. The Camarilla forbids taking a human family in this fashion, and it frowns on cleavers as Masquerade breaches waiting to happen. Wiser Kindred may massacre your family for your own good if they find out your secret and care what happens to you.',
    details: [
      'Add a specialty: Persuasion (Gaslighting) or Subterfuge (Coverups)',
      'Gain one dot of Dominate or Animalism',
      'Gain the Dark Secret Flaw: (•)Cleaver',
      'Gain the Herd Advantage (••)',
    ],
  },
  'Consensualist': {
    source: 'CORE · P. 177',
    body: 'You never feed against your victim’s free will. You masquerade as a representative of a charity blood drive, as a blood-drinking kink-lord in the “real vampire community,” or by actually telling your victims what you are and getting their permission to feed. The Camarilla call that last method a Masquerade breach, but many Anarch philosophers consider it an acceptable risk. You could have been anything in life, but a sex-worker, a political organizer, or a lawyer could all be wary of feeding without consent.',
    details: [
      'Add a specialty: Medicine (Phlebotomy) or Persuasion (Victims)',
      'Gain one dot of Auspex or Fortitude',
      'Gain one dot of Humanity',
      'Gain the Dark Secret Flaw: (•) Masquerade Breacher',
      'Gain the Feeding Flaw: (•) Prey Exclusion (non-consenting)',
    ],
  },
  'Farmer': {
    source: 'CORE · P. 177',
    body: 'You only feed from animals. Your Hunger constantly gnaws at you, but you have not killed a single human being so far (except perhaps that one time), and you intend to keep it that way. You could have been anyone in life, but your choice speaks to someone obsessed by morality. Perhaps you were an activist, priest, aidworker, or vegan in life, but the choice never to risk a human life is one anyone could arrive at and struggle to maintain. Ventrue may not pick this Predator type. You cannot pick this Predator type if your Blood Potency is 3 or higher.',
    details: [
      'Add a specialty: Animal Ken (Specific Animal) or Survival (Hunting)',
      'Gain one dot of Animalism or Protean',
      'Gain one dot of Humanity',
      'Gain the Feeding Flaw: (••) Vegan',
    ],
  },
  'Osiris': {
    source: 'CORE · P. 177',
    body: 'You are a celebrity among mortals or else you run a cult, a church, or something similar. You feed from your fans or worshippers, who treat you as a deity. You always have access to easy blood, but followers breed problems with the authorities, organized religion, and indeed the Camarilla. In life, you might have been a DJ, a writer, a cultist, a preacher, or a LARP organizer.',
    details: [
      'Add a specialty: Occult (specific tradition) or Performance (specific entertainment field)',
      'Gain one dot of Blood Sorcery (Tremere only) or Presence',
      'Spend three dots between the Fame and Herd Backgrounds',
      'Spend two dots between the Enemies and Mythic Flaws',
    ],
  },
  'Sandman': {
    source: 'CORE · P. 177',
    body: 'You rely on your stealth or Disciplines to feed from sleeping victims. If they never wake during the feeding, they won’t know you exist. Perhaps you were very anti-social in life; you don’t feel cut out for the intense interpersonal nightlife or physical violence of more extroverted hunters.',
    details: [
      'Add a specialty: Medicine (Anesthetics) or Stealth (Break-in)',
      'Gain one dot of Auspex or Obfuscate',
      'Gain one dot of Resources',
    ],
  },
  'Scene Queen': {
    source: 'CORE · P. 178',
    body: 'You rely on your familiarity with a certain subculture and a well-crafted pose, feeding on an exclusive subculture that believes you to be one of them. Your victims adore you for your status in the scene, and the ones who understand what you are disbelieved. You may belong to the street or be literal upper-class, abusing the weak with false hope and promises of taking them to the next level. In life, you almost certainly belonged to a scene similar to the one you stalk now.',
    details: [
      'Add a specialty: Etiquette (specific scene), Leadership (specific scene), or Streetwise (specific scene)',
      'Gain one dot of Dominate or Potence',
      'Gain the Fame Advantage: (•)',
      'Gain the Contact Advantage: (•)',
      'Gain either the Influence Flaw: (•) Disliked (outside your subculture) or the Feeding Flaw: (•) Prey Exclusion (a different subculture from yours)',
    ],
  },
  'Siren': {
    source: 'CORE · P. 178',
    body: 'You feed almost exclusively during or while feigning sex, and you rely on your Disciplines, seduction skills, or the unquenchable appetites of others to conceal your carnivorous nature. You have mastered the art of the one-night stand or move through the sex-club scene like a dark star. You think of yourself as a sexy beast, but in your darkest moments, you fear that you\'re at best a problematic lover, at worst a habitual rapist. A former lover who escaped destruction might be your Touchstone or your stalker. (If so, add them to the Relationship Map.) Maybe in life you were a pick-up artist, movie producer, author, a glorious slutty kinkster – or a virgin who intends to make up for lost time post-mortem.',
    details: [
      'Add a specialty: Persuasion (Seduction) or Subterfuge (Seduction)',
      'Gain one dot of Fortitude or Presence',
      'Gain the Looks Merit: (••) Beautiful',
      'Gain the Enemy Flaw: (•) A spurned lover or jealous partner',
    ],
  },
};
