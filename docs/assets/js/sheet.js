/* ═══════════════════════════════════════════════════════════════
   VTM 5e Character Sheet — sheet.js
   All logic: localStorage, tabs, edit mode, trackers,
   disciplines, advantages, inventory, convictions, touchstones,
   export / import.
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── DEFAULT CHARACTER ─────────────────────────────────────── */
const DEFAULT_CHARACTER = {
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
    intelligence: 2, wits: 3, resolve: 2
  },
  skills: {
    athletics:    { value: 1, specialty: '' },
    brawl:        { value: 3, specialty: '' },
    craft:        { value: 0, specialty: '' },
    drive:        { value: 0, specialty: '' },
    firearms:     { value: 0, specialty: '' },
    larceny:      { value: 2, specialty: '' },
    melee:        { value: 0, specialty: '' },
    stealth:      { value: 4, specialty: 'Infiltration' },
    survival:     { value: 0, specialty: '' },
    animalKen:    { value: 2, specialty: '' },
    etiquette:    { value: 0, specialty: '' },
    insight:      { value: 0, specialty: '' },
    intimidation: { value: 0, specialty: '' },
    leadership:   { value: 0, specialty: '' },
    performance:  { value: 0, specialty: '' },
    persuasion:   { value: 0, specialty: '' },
    streetwise:   { value: 1, specialty: '' },
    subterfuge:   { value: 3, specialty: '' },
    academics:    { value: 0, specialty: '' },
    awareness:    { value: 3, specialty: '' },
    finance:      { value: 0, specialty: '' },
    investigation:{ value: 2, specialty: '' },
    medicine:     { value: 0, specialty: '' },
    occult:       { value: 0, specialty: '' },
    politics:     { value: 1, specialty: '' },
    science:      { value: 0, specialty: '' },
    technology:   { value: 0, specialty: '' }
  },
  advantages: [
    { name: 'Contacts',   level: 3, note: 'Criminal' },
    { name: 'Haven',      level: 1, note: '' },
    { name: 'Linguistics',level: 2, note: '' },
    { name: 'Mask',       level: 2, note: '' },
    { name: 'Resources',  level: 2, note: '' },
    { name: 'Status',     level: 2, note: 'Anarch' }
  ],
  flaws: [
    { name: 'Adversary',   level: 2, note: 'Sire — al-Musawwir (Sabbat)' },
    { name: 'Dark Secret', level: 1, note: '' },
    { name: 'Enemy',       level: 1, note: '' }
  ],
  trackers: {
    healthMax: 5,
    health: [0,0,0,0,0],
    willpowerMax: 5,
    willpower: [0,0,0,0,0],
    hunger: [0,0,0,0,0],
    humanity: 5,
    humanityStains: 0,
    bp: 3,
    resonance: ''
  },
  disciplines: [
    { name: 'Animalism', level: 3, powers: ['Bond Famulus','Feral Whispers','Unliving Hive'] },
    { name: 'Obfuscate', level: 2, powers: ['Silence of Death','Unseen Passage'] },
    { name: 'Celerity',  level: 1, powers: ['Rapid Reflexes'] },
    { name: 'Potence',   level: 1, powers: ['Lethal Body'] }
  ],
  inventory: ['Burner phone', 'Lock picks', 'Fake ID (Samir Haddad)'],
  convictions: [
    'Never leave a trace.',
    'Dead men fix nothing.',
    'Distrust anyone who asks you to do what they wouldn\'t do themselves.'
  ],
  touchstones: [
    {
      name: 'Peter Hollis',
      summary: '†1953 · Spy · MI6',
      linkedConviction: 'Never leave a trace.',
      description: 'MI6 analyst who witnessed the supernatural during one of Khalil\'s 1916 operations. He was not silenced — he was discredited. Lived from 1919 to 1953 in psychiatric institutions, describing with surgical precision things no one believed. Khalil visited once, in 1931. He never went back.'
    },
    {
      name: 'Hassan el-Amin',
      summary: 'Mortal · Businessman',
      linkedConviction: 'Dead men fix nothing.',
      description: 'Owner of a chain of bars and restaurants. An unwitting logistical front — he doesn\'t know he is. Khalil has known him for decades under different identities. Hassan believes he has exceptional luck in business. He represents the invisible human cost of a century of operations.'
    },
    {
      name: 'Edmund Ashford',
      summary: 'Kindred · Tremere · Embraced 1915',
      linkedConviction: 'Distrust anyone who asks you to do what they wouldn\'t do themselves.',
      description: 'British orientalist. They met in Cairo in 1916, both at the Arab Bureau for different reasons. They met again decades later and recognized something immediate — the texture of someone who was alive in that era. A lasting operational exchange: occultism for field work. What neither says aloud is that when the other disappears for years without word, he notices.'
    }
  ],
  background: 'Born in 1883 in Damascus, son of a family of dragomans — professional interpreters who survived by being useful to whoever held power. He worked as an interpreter and double agent during the Balkan Wars (1912–13) and World War I, operating between the British Arab Bureau and Ottoman intelligence in Cairo. Embraced in 1916 by al-Musawwir, a Nosferatu elder aligned with the Sabbat, who wanted an asset inside the Bureau. Deserted in 1917 by faking his own destruction. Al-Musawwir still believes the childe died. Since then he has operated as "The Dragoman" in Anarchist Movement counter-intelligence, accumulating a century of operations in Berlin, Paris, Cairo, Buenos Aires, and other centers.'
};

/* ── SKILL DEFINITIONS ─────────────────────────────────────── */
const SKILL_GROUPS = {
  physical: ['athletics','brawl','craft','drive','firearms','larceny','melee','stealth','survival'],
  social:   ['animalKen','etiquette','insight','intimidation','leadership','performance','persuasion','streetwise','subterfuge'],
  mental:   ['academics','awareness','finance','investigation','medicine','occult','politics','science','technology']
};
const SKILL_LABELS = {
  athletics:'Athletics', brawl:'Brawl', craft:'Craft', drive:'Drive',
  firearms:'Firearms', larceny:'Larceny', melee:'Melee', stealth:'Stealth', survival:'Survival',
  animalKen:'Animal Ken', etiquette:'Etiquette', insight:'Insight', intimidation:'Intimidation',
  leadership:'Leadership', performance:'Performance', persuasion:'Persuasion',
  streetwise:'Streetwise', subterfuge:'Subterfuge',
  academics:'Academics', awareness:'Awareness', finance:'Finance', investigation:'Investigation',
  medicine:'Medicine', occult:'Occult', politics:'Politics', science:'Science', technology:'Technology'
};

/* ── INLINE DATA ───────────────────────────────────────────── */
const _BP_DATA   = [{"level":0,"bloodSurge":"None","damageHealed":"1 Superficial","disciplineBonus":"None","rouseRoll":"None","bane":0,"penalty":"None"},{"level":1,"bloodSurge":"+1 die","damageHealed":"1 Superficial","disciplineBonus":"None","rouseRoll":"None","bane":1,"penalty":"None"},{"level":2,"bloodSurge":"+1 die","damageHealed":"1 Superficial","disciplineBonus":"None","rouseRoll":"Level 1 only","bane":1,"penalty":"None"},{"level":3,"bloodSurge":"+2 dice","damageHealed":"2 Superficial","disciplineBonus":"None","rouseRoll":"Level 2 and below","bane":2,"penalty":"Animal / bagged: no Hunger reduction"},{"level":4,"bloodSurge":"+2 dice","damageHealed":"2 Superficial","disciplineBonus":"+1 die","rouseRoll":"Level 2 and below","bane":2,"penalty":"Animal / bagged: no Hunger reduction"},{"level":5,"bloodSurge":"+3 dice","damageHealed":"3 Superficial","disciplineBonus":"+1 die","rouseRoll":"Level 3 and below","bane":2,"penalty":"Animal / bagged: no Hunger reduction"},{"level":6,"bloodSurge":"+3 dice","damageHealed":"3 Superficial","disciplineBonus":"+2 dice","rouseRoll":"Level 3 and below","bane":3,"penalty":"Animal / bagged: no Hunger reduction"},{"level":7,"bloodSurge":"+4 dice","damageHealed":"3 Superficial","disciplineBonus":"+2 dice","rouseRoll":"Level 4 and below","bane":3,"penalty":"Animal / bagged: no Hunger reduction"},{"level":8,"bloodSurge":"+4 dice","damageHealed":"3 Superficial","disciplineBonus":"+3 dice","rouseRoll":"Level 4 and below","bane":3,"penalty":"Animal / bagged: no Hunger reduction"},{"level":9,"bloodSurge":"+5 dice","damageHealed":"4 Superficial","disciplineBonus":"+3 dice","rouseRoll":"Level 5 and below","bane":3,"penalty":"Animal / bagged: no Hunger reduction"},{"level":10,"bloodSurge":"+5 dice","damageHealed":"4 Superficial","disciplineBonus":"+3 dice","rouseRoll":"Level 5 and below","bane":4,"penalty":"Only human: no Hunger reduction"}];
const _DISC_DATA = [{"name":"Bond Famulus","discipline":"Animalism","level":1,"pool":"—","cost":"Free (one-time)","duration":"Permanent","description":"You forge a supernatural bond with one animal, turning it into a loyal Famulus. The animal is unnaturally devoted and obeys simple commands without a roll. It is more resilient than normal animals of its kind. You may have only one Famulus at a time.","requirements":null},{"name":"Sense the Beast","discipline":"Animalism","level":1,"pool":"Wits + Animalism","cost":"Free","duration":"Instant","description":"You sense predatory intent, fear, or suppressed rage in any creature you observe. Success identifies whether a target is in Frenzy, close to it, or harboring hostility. Works on vampires, mortals, and animals alike.","requirements":null},{"name":"Feral Whispers","discipline":"Animalism","level":2,"pool":"Manipulation + Animalism","cost":"Free","duration":"Scene","description":"You communicate with and issue commands to a single animal. You don't speak their language — you impose your will through eye contact and supernatural dominance. The animal follows commands up to its nature; you cannot make a prey animal attack a predator.","requirements":null},{"name":"Animal Succulence","discipline":"Animalism","level":2,"pool":"—","cost":"Free","duration":"Permanent","description":"Your Blood bonds more efficiently with animal vitae. You can satisfy Hunger more fully from animals than other Kindred can. Each drink from an animal reduces Hunger by one additional point for you.","requirements":null},{"name":"Quell the Beast","discipline":"Animalism","level":3,"pool":"Charisma + Animalism","cost":"Free","duration":"Scene","description":"You force a mortal or vampire into emotional suppression, dulling aggression, passion, and the drive to act. Mortals become passive and listless. Vampires have their Frenzy threshold raised. Targets resist with Composure + Resolve.","requirements":null},{"name":"Unliving Hive","discipline":"Animalism","level":3,"pool":"—","cost":"Free","duration":"Permanent","description":"You bond with a swarm of small creatures — insects, spiders, rats — that nests within or around you. The swarm obeys your unspoken will, can scout, carry small objects, distract enemies, or deliver the Kiss. They are harder to destroy than normal swarms.","requirements":null},{"name":"Subsume the Spirit","discipline":"Animalism","level":4,"pool":"Intelligence + Animalism","cost":"1 Rouse Check","duration":"1 hour per success","description":"You project your consciousness into an animal, riding its senses and controlling its body. While subsumed, your own body is catatonic and undefended. You can use your mental Disciplines from within the animal but not physical ones.","requirements":null},{"name":"Animal Dominion","discipline":"Animalism","level":4,"pool":"Charisma + Animalism","cost":"1 Rouse Check","duration":"Scene","description":"You issue commands to all animals of a single species within earshot simultaneously. Unlike Feral Whispers, this affects an entire group at once — every rat in a building, every dog on a block.","requirements":null},{"name":"Drawing Out the Beast","discipline":"Animalism","level":5,"pool":"Manipulation + Animalism","cost":"1 Rouse Check","duration":"Scene","description":"You expel your own Beast into another creature — a mortal, vampire, or animal. The recipient immediately enters Frenzy as your Beast possesses them. You become calm and rational while they rage. Your Beast must return at the end of the scene.","requirements":null},{"name":"Heightened Senses","discipline":"Auspex","level":1,"pool":"—","cost":"Free","duration":"Passive","description":"Your senses operate at supernatural levels at all times. You add your Auspex rating as bonus dice to all Awareness-based Perception rolls. You can detect things at extreme ranges and notice details others miss. Downsides: sensory overload in chaotic environments.","requirements":null},{"name":"Sense the Unseen","discipline":"Auspex","level":1,"pool":"Wits + Auspex","cost":"Free","duration":"Instant","description":"You detect supernatural presences, Obfuscated creatures, spirits, and residual mystical energy. A successful roll reveals the presence (not identity) of hidden things in the area. Resisted by Wits + Obfuscate if the target is actively hiding.","requirements":null},{"name":"Premonition","discipline":"Auspex","level":2,"pool":"Resolve + Auspex","cost":"Free","duration":"Instant","description":"You receive flashes of insight — brief visions of the past or possible futures. The Storyteller provides cryptic glimpses relevant to your current situation. You cannot direct the vision; it comes when the Blood wills it.","requirements":null},{"name":"Aura Perception","discipline":"Auspex","level":2,"pool":"Intelligence + Auspex","cost":"Free","duration":"Instant","description":"You read the emotional aura radiating from a target. Success reveals their current emotional state, whether they are Kindred, ghoul, or mortal, and hints at recent strong experiences. High successes reveal more detail. Resisted by Composure + Subterfuge.","requirements":null},{"name":"The Stolen Moment","discipline":"Auspex","level":3,"pool":"Intelligence + Auspex","cost":"1 Rouse Check","duration":"Instant","description":"You psychically read the last strong impression left on an object or location — a psychic echo of trauma, joy, violence, or intense emotion. The older or more faded the impression, the harder to read.","requirements":null},{"name":"Share the Senses","discipline":"Auspex","level":3,"pool":"Resolve + Auspex","cost":"1 Rouse Check","duration":"Scene","description":"You link your senses to a willing target or to your own Famulus. You experience everything they perceive in real time while retaining your own senses. The link requires concentration to maintain and breaks at range.","requirements":null},{"name":"Lay Open the Mind","discipline":"Auspex","level":4,"pool":"Intelligence + Auspex vs. Wits + Subterfuge","cost":"1 Rouse Check","duration":"Instant","description":"You perform a deep telepathic scan of a target's mind, reading surface thoughts, memories, and intentions. The target is unaware unless they have supernatural defenses. High successes reveal deeper, more protected memories.","requirements":null},{"name":"Telepathy","discipline":"Auspex","level":4,"pool":"Resolve + Auspex vs. Resolve + Subterfuge","cost":"1 Rouse Check","duration":"Scene","description":"You establish two-way mental communication with a target at any range (within city limits). You can transmit thoughts and receive replies. The target must be known to you; you cannot reach strangers.","requirements":null},{"name":"Twilight Projection","discipline":"Auspex","level":5,"pool":"Intelligence + Auspex","cost":"1 Rouse Check","duration":"1 hour per success","description":"You project your consciousness out of your body as an invisible, intangible presence. You can observe anything in your city but cannot interact physically. Your body remains catatonic and vulnerable while you are projected.","requirements":null},{"name":"Corrosive Vitae","discipline":"Blood Sorcery","level":1,"pool":"—","cost":"1 Rouse Check","duration":"Instant","description":"You excrete a small amount of caustic vitae from a wound or your palm. The blood dissolves organic material — wood, flesh, leather, some plastics. Cannot be used as a weapon directly but can destroy locks, bindings, or materials over time.","requirements":null},{"name":"A Taste for Blood","discipline":"Blood Sorcery","level":1,"pool":"Resolve + Blood Sorcery","cost":"Free","duration":"Instant","description":"By tasting a small sample of another's blood, you learn their approximate generation, current Hunger level, and clan. High successes may reveal Discipline levels or other secrets. Cannot be used on yourself.","requirements":null},{"name":"Extinguish Vitae","discipline":"Blood Sorcery","level":2,"pool":"Intelligence + Blood Sorcery vs. Stamina + Resolve","cost":"1 Rouse Check","duration":"Instant","description":"You attack the supernatural vitality within a vampire's blood. Success inflicts 1 Aggravated damage directly. The target feels their blood turn cold and sluggish. Mortals are unaffected.","requirements":null},{"name":"Blood of Potency","discipline":"Blood Sorcery","level":3,"pool":"Resolve + Blood Sorcery","cost":"1 Rouse Check","duration":"Scene","description":"You temporarily elevate your Blood Potency by 1–3 points, gaining the benefits of higher BP (better Rouse re-rolls, stronger Surge, improved healing). The effect cannot raise BP above 10 or past your generation's maximum.","requirements":null},{"name":"Scorpion's Touch","discipline":"Blood Sorcery","level":3,"pool":"Dexterity + Blood Sorcery vs. Stamina","cost":"1 Rouse Check","duration":"Instant","description":"You transmute a portion of your vitae into a paralytic agent. Coating a weapon or your hands, you can deliver the toxin on contact. Mortals are paralyzed; vampires suffer a penalty to all physical actions equal to the attacker's successes.","requirements":null},{"name":"Theft of Vitae","discipline":"Blood Sorcery","level":4,"pool":"Wits + Blood Sorcery vs. Stamina + Resolve","cost":"1 Rouse Check","duration":"Instant","description":"You draw blood from a target at range — up to 10 meters — without touch. The blood flies into your mouth. Each success drains 1 Hunger level from the target and reduces yours by 1.","requirements":null},{"name":"Baal's Caress","discipline":"Blood Sorcery","level":4,"pool":"Dexterity + Blood Sorcery","cost":"1 Rouse Check","duration":"Scene","description":"You transmute your vitae into a potent poison that causes Aggravated damage. Coated weapons deal Aggravated damage. The transmuted blood evaporates after the scene ends.","requirements":null},{"name":"Cauldron of Blood","discipline":"Blood Sorcery","level":5,"pool":"Resolve + Blood Sorcery vs. Stamina + Resolve","cost":"1 Rouse Check","duration":"Instant","description":"You cause the vitae within a target's body to boil. Mortals die. Vampires suffer Aggravated damage equal to your successes as the blood burns through them from within. Cannot be blocked physically.","requirements":null},{"name":"Cat's Grace","discipline":"Celerity","level":1,"pool":"—","cost":"Free","duration":"Passive","description":"Your balance and physical grace are preternatural. You never need to roll for basic acrobatics — climbing, jumping between surfaces, landing after falls. You can add your Celerity rating to Athletics rolls involving agility.","requirements":null},{"name":"Rapid Reflexes","discipline":"Celerity","level":1,"pool":"—","cost":"Free","duration":"Passive","description":"You react to threats before conscious thought. You cannot be surprised or ambushed if you have the slightest warning. Add your Celerity rating as bonus dice to all Wits-based rolls made to detect danger or react first in combat.","requirements":null},{"name":"Fleetness","discipline":"Celerity","level":2,"pool":"—","cost":"1 Rouse Check","duration":"Scene","description":"You move at supernatural speed, blurring to mortal eyes. You can cross a room in the blink of an eye, run at vehicle speeds, and take an additional physical action each turn without the usual split-pool penalty.","requirements":null},{"name":"Blink","discipline":"Celerity","level":3,"pool":"Dexterity + Athletics","cost":"1 Rouse Check","duration":"Instant","description":"You move from your current position to any location within your line of sight in an instant — too fast to track. You appear to teleport. Can be used to escape grapples, flank enemies, or reach elevated positions instantly.","requirements":null},{"name":"Traversal","discipline":"Celerity","level":3,"pool":"—","cost":"1 Rouse Check","duration":"Scene","description":"You move across vertical surfaces and ceilings as easily as the ground. You can run up walls, sprint across a ceiling, and move at full speed in any direction as long as you keep moving. Stopping breaks the effect.","requirements":null},{"name":"Unerring Aim","discipline":"Celerity","level":4,"pool":"—","cost":"1 Rouse Check","duration":"Instant","description":"You slow your perception of time to line up a perfect shot or strike. The next physical attack you make this turn cannot be dodged by mundane means and ignores cover bonuses. Add Celerity rating to the attack roll.","requirements":null},{"name":"Lightning Strike","discipline":"Celerity","level":5,"pool":"Dexterity + Brawl or Melee","cost":"1 Rouse Check","duration":"Instant","description":"You attack with incomprehensible speed — multiple strikes in a fraction of a second. Make one attack roll; if successful, you deal damage multiple times equal to your Celerity rating. Each hit counts separately for resistance.","requirements":null},{"name":"Split Second","discipline":"Celerity","level":5,"pool":"—","cost":"1 Rouse Check","duration":"Instant","description":"You perceive time at a radically slowed rate for one moment. You may rewind one failed action this scene and attempt it again with full dice pool. The rewind cannot be used on damage rolls.","requirements":null},{"name":"Cloud Memory","discipline":"Dominate","level":1,"pool":"Charisma + Dominate vs. Wits + Resolve","cost":"Free","duration":"Permanent","description":"You command a mortal or vampire to forget the last few minutes. The target's memory of recent events becomes hazy and eventually fades entirely. Does not work if the target has been warned or has Dominate resistance.","requirements":null},{"name":"Compel","discipline":"Dominate","level":1,"pool":"Charisma + Dominate vs. Intelligence + Resolve","cost":"Free","duration":"Until satisfied","description":"You issue a single short command that the target must obey immediately. Commands must be physically possible and cannot directly harm the target. The compulsion ends once the order is carried out or becomes impossible.","requirements":null},{"name":"Mesmerize","discipline":"Dominate","level":2,"pool":"Charisma + Dominate vs. Intelligence + Resolve","cost":"Free","duration":"Scene or longer","description":"You plant a post-hypnotic suggestion in a target's mind. The command takes effect when triggered by a specified condition. Complex suggestions require more successes. The target has no memory of receiving the order.","requirements":null},{"name":"Domitor's Favor","discipline":"Dominate","level":2,"pool":"—","cost":"Free","duration":"Permanent","description":"Your Blood Bond is reinforced by supernatural command. Ghouls or mortals under your Bond are more resistant to counter-Dominate and outside influence. They gain bonus dice equal to your Dominate rating when resisting commands from others.","requirements":null},{"name":"The Forgetful Mind","discipline":"Dominate","level":3,"pool":"Charisma + Dominate vs. Intelligence + Resolve","cost":"1 Rouse Check","duration":"Permanent","description":"You reach into a target's mind and rewrite specific memories — altering details, removing events, or implanting false recollections. Each success allows you to modify or replace one clear memory. The target experiences the false memory as genuine.","requirements":null},{"name":"Submerged Directive","discipline":"Dominate","level":3,"pool":"Charisma + Dominate vs. Intelligence + Resolve","cost":"1 Rouse Check","duration":"Until triggered","description":"You plant a deep-seated command that the target will carry out at a future trigger — even years later — with no memory of the instruction. The target is compelled to complete the command, then forget it happened.","requirements":null},{"name":"Rationalize","discipline":"Dominate","level":4,"pool":"Manipulation + Dominate vs. Intelligence + Resolve","cost":"1 Rouse Check","duration":"Permanent","description":"After using any Dominate power, you ensure the target's mind constructs a logical reason for their own behavior. They invent memories or explanations rather than noticing the gap. Eliminates the uncanny feeling that often follows Dominate.","requirements":null},{"name":"Terminus","discipline":"Dominate","level":4,"pool":"Charisma + Dominate vs. Stamina + Resolve","cost":"1 Rouse Check","duration":"Instant","description":"You lock a mortal's mind in place, preventing them from moving, speaking, or taking action. They remain conscious and aware but paralyzed by your will. Lasts until you release them or they break free with exceptional willpower.","requirements":null},{"name":"Mass Manipulation","discipline":"Dominate","level":5,"pool":"Charisma + Dominate","cost":"1 Rouse Check","duration":"Scene","description":"You extend your Dominate to affect an entire crowd simultaneously, issuing the same command to everyone within earshot who meets your gaze. Each target resists individually; those who succeed are immune for the rest of the scene.","requirements":null},{"name":"Still the Mortal Flesh","discipline":"Dominate","level":5,"pool":"Charisma + Dominate vs. Stamina + Resolve","cost":"1 Rouse Check","duration":"Permanent unless reversed","description":"You command a mortal's body to shut down a specific function — heartbeat, breathing, pain response, or motor control for a limb. The effect is permanent until reversed with another use of this power or medical intervention.","requirements":null},{"name":"Resilience","discipline":"Fortitude","level":1,"pool":"—","cost":"Free","duration":"Passive","description":"Your undead flesh resists damage supernaturally. Add your Fortitude rating as bonus dice to all Stamina rolls made to resist damage or injury. This includes soaking wounds that would normally ignore armor.","requirements":null},{"name":"Unswayable Mind","discipline":"Fortitude","level":1,"pool":"—","cost":"Free","duration":"Passive","description":"Your will is fortified against supernatural coercion. Add your Fortitude rating as bonus dice to all resistance rolls against Dominate, Presence, and similar mental powers. Passive; always active.","requirements":null},{"name":"Toughness","discipline":"Fortitude","level":2,"pool":"—","cost":"Free","duration":"Passive","description":"You can downgrade incoming damage. Once per scene, you may reduce one Aggravated damage to Superficial. This reflects your body's resistance to things that would destroy lesser vampires.","requirements":null},{"name":"Enduring Beasts","discipline":"Fortitude","level":2,"pool":"—","cost":"Free","duration":"Passive","description":"Animals sense your supernatural resilience and are reluctant to attack you. If forced to fight, they hesitate — attack rolls against you from animals suffer a penalty equal to your Fortitude rating.","requirements":null},{"name":"Defy Bane","discipline":"Fortitude","level":3,"pool":"Stamina + Fortitude","cost":"1 Rouse Check","duration":"Scene","description":"You temporarily suppress your clan Bane and other supernatural vulnerabilities. For the duration, your Bane Severity is reduced to 0 and you ignore penalties from fire, sunlight, or similar hazards (though damage still applies at normal rate).","requirements":null},{"name":"Fortify the Inner Facade","discipline":"Fortitude","level":3,"pool":"—","cost":"Free","duration":"Passive","description":"Your mind and soul are hardened against the Beckoning and Wassail. Add your Fortitude rating as bonus dice against powers or effects that would force you to follow elders' compulsions or send you into permanent Frenzy.","requirements":null},{"name":"Flesh of Marble","discipline":"Fortitude","level":4,"pool":"—","cost":"1 Rouse Check","duration":"Scene","description":"Your skin becomes like stone. All Superficial damage from physical sources is reduced by your Fortitude rating. Bashing weapons become near-useless against you. You feel impacts but shrug them off.","requirements":null},{"name":"Draught of Endurance","discipline":"Fortitude","level":4,"pool":"—","cost":"1 Rouse Check","duration":"Scene","description":"You push your body beyond its limits, ignoring wound penalties completely. You do not suffer increasing dice penalties as your health track fills. You act at full capacity until Final Death.","requirements":null},{"name":"Suffer the Mortal Coil","discipline":"Fortitude","level":5,"pool":"Stamina + Fortitude","cost":"1 Rouse Check","duration":"Instant","description":"You temporarily become effectively mortal — your undead nature suppressed. Fire and sunlight deal Superficial, not Aggravated. Staking fails (no heart to stop). You can eat food, feel warmth, and pass biometric tests. Lasts until you Rouse Blood again.","requirements":null},{"name":"Cloak of Shadows","discipline":"Obfuscate","level":1,"pool":"—","cost":"Free","duration":"Passive","description":"While you remain still in shadow or cover, you are effectively invisible. Mortals and most Kindred simply fail to notice you. The effect breaks if you move, speak, or draw attention to yourself.","requirements":null},{"name":"Silence of Death","discipline":"Obfuscate","level":1,"pool":"—","cost":"Free","duration":"Passive","description":"You generate no sound. Your footsteps, breathing, and incidental noise disappear. Others cannot hear you approach. Stealthy actions automatically benefit — no additional roll needed for silence. You must still avoid visual detection.","requirements":null},{"name":"Unseen Passage","discipline":"Obfuscate","level":2,"pool":"Wits + Obfuscate vs. Wits + Awareness","cost":"1 Rouse Check","duration":"Scene","description":"You can move while remaining invisible to mortal senses. As long as you avoid drastic actions (attacking, shouting), you remain undetected. Supernatural senses resist with Wits + Awareness.","requirements":null},{"name":"Fata Morgana","discipline":"Obfuscate","level":2,"pool":"Intelligence + Obfuscate","cost":"1 Rouse Check","duration":"Scene","description":"You create an illusory image — a static scene, an object, or a person — that fools mortal senses. The illusion is visual only; it can't make sounds, produce scent, or resist touch. Mortals believe what they see.","requirements":null},{"name":"Ghost in the Machine","discipline":"Obfuscate","level":3,"pool":"Intelligence + Obfuscate","cost":"1 Rouse Check","duration":"Scene","description":"You extend your Obfuscate to electronic detection — cameras, microphones, motion sensors. Recordings show nothing; alarms don't trigger. Works passively while the power is active.","requirements":null},{"name":"Mask of a Thousand Faces","discipline":"Obfuscate","level":3,"pool":"Manipulation + Obfuscate","cost":"1 Rouse Check","duration":"Scene","description":"You cause yourself to appear as a different mortal — average, forgettable, or specifically someone others expect to see. You don't physically change; you alter perception. Cameras may still record your true face.","requirements":null},{"name":"The Familiar Stranger","discipline":"Obfuscate","level":4,"pool":"Manipulation + Obfuscate","cost":"1 Rouse Check","duration":"Scene","description":"You make yourself appear to be a specific, known person to a target. Unlike Mask of a Thousand Faces, this fools even those who know the person well — as long as they don't touch you or interact too closely.","requirements":null},{"name":"Conceal","discipline":"Obfuscate","level":4,"pool":"Intelligence + Obfuscate","cost":"1 Rouse Check","duration":"Scene","description":"You extend your Obfuscate to cover one other object or person. A companion, a vehicle, or a large item becomes as undetectable as you are. The target must remain close to you.","requirements":null},{"name":"Cloak the Gathering","discipline":"Obfuscate","level":5,"pool":"Wits + Obfuscate","cost":"1 Rouse Check","duration":"Scene","description":"You render your entire coterie invisible simultaneously. All subjects within your line of sight benefit from Unseen Passage for the scene. Each additional person beyond the first adds 1 to the Difficulty.","requirements":null},{"name":"Soul Mask","discipline":"Obfuscate","level":5,"pool":"Manipulation + Obfuscate","cost":"1 Rouse Check","duration":"Permanent until dropped","description":"You conceal your aura and vampire nature from supernatural detection. Auspex, Sense the Unseen, and similar powers read you as mortal. Even Blood Bond detection and clan recognition fail. Requires active concentration — you cannot sleep while maintaining it.","requirements":null},{"name":"Shadow Cloak","discipline":"Oblivion","level":1,"pool":"—","cost":"Free","duration":"Passive","description":"You wrap yourself in a personal aura of shadow and dread. In dim conditions, you are supernaturally difficult to see — treat as Cloak of Shadows. Mortals near you feel inexplicable unease, suffering −1 die to Composure rolls.","requirements":null},{"name":"Oblivion's Sight","discipline":"Oblivion","level":1,"pool":"Resolve + Oblivion","cost":"Free","duration":"Scene","description":"You perceive the Underworld and its denizens overlaid on the physical world. You see ghosts, wraiths, and death-resonance in locations. You can communicate with bound or confused spirits that others cannot detect.","requirements":null},{"name":"Arms of Ahriman","discipline":"Oblivion","level":2,"pool":"Strength + Oblivion vs. Dexterity + Athletics","cost":"1 Rouse Check","duration":"Scene","description":"Tendrils of solid shadow extend from your body, up to 3 meters per level of Oblivion. They can grab, restrain, or strike. Grapple attempts use Strength + Oblivion. The tendrils cannot enter sunlight.","requirements":null},{"name":"The Binding Fetter","discipline":"Oblivion","level":2,"pool":"Resolve + Oblivion","cost":"1 Rouse Check","duration":"Scene","description":"You bind a ghost or wraith to a location or object, preventing it from moving or manifesting elsewhere. You can also communicate with and interrogate bound spirits. They may resist if powerful enough.","requirements":null},{"name":"Shadow Step","discipline":"Oblivion","level":3,"pool":"Wits + Oblivion","cost":"1 Rouse Check","duration":"Instant","description":"You step into shadow and emerge from another shadow within your line of sight — or further if you know the destination well. The transit is instantaneous. You cannot pass through areas without shadows.","requirements":null},{"name":"Abyss Mysticism","discipline":"Oblivion","level":3,"pool":"Intelligence + Oblivion","cost":"1 Rouse Check","duration":"Varies","description":"You perform rituals using the power of the Abyss — a ritual system unique to Oblivion, similar in structure to Blood Sorcery Rituals. Rituals must be learned separately and cover a range of necromantic and shadow effects.","requirements":null},{"name":"Where the Shroud Thins","discipline":"Oblivion","level":4,"pool":"Resolve + Oblivion","cost":"1 Rouse Check","duration":"Scene","description":"You weaken the barrier between the living and dead in your immediate area, allowing ghosts and wraiths to manifest more strongly. You can also pull a willing spirit into temporary physical form for the scene.","requirements":null},{"name":"Stygian Shroud","discipline":"Oblivion","level":4,"pool":"Resolve + Oblivion","cost":"1 Rouse Check","duration":"Scene","description":"You drape an area in supernatural darkness — total blackout that no light source penetrates. You can see through it perfectly; others are blind unless they have supernatural night vision. The darkness has weight; those inside feel oppressed and fearful.","requirements":null},{"name":"Tenebrous Avatar","discipline":"Oblivion","level":5,"pool":"Resolve + Oblivion","cost":"1 Rouse Check","duration":"Scene","description":"You partially merge with the Abyss, becoming a creature of living shadow. You become intangible to physical attacks, can pass through solid objects, and your touch deals Aggravated damage. Sunlight forces you back to physical form instantly.","requirements":null},{"name":"Lethal Body","discipline":"Potence","level":1,"pool":"—","cost":"Free","duration":"Passive","description":"Your bare hands deal Aggravated damage to mortals. Against vampires, your unarmed strikes deal Superficial damage but at full roll — not halved. You can crush, tear, and break materials far beyond mortal capability.","requirements":null},{"name":"Soaring Leap","discipline":"Potence","level":1,"pool":"—","cost":"Free","duration":"Passive","description":"You jump with supernatural force. Vertical and horizontal distances achievable with a leap are multiplied dramatically — a few meters becomes a few dozen. You can leap to rooftops, clear obstacles, and land without injury from significant heights.","requirements":null},{"name":"Prowess","discipline":"Potence","level":2,"pool":"—","cost":"1 Rouse Check","duration":"Scene","description":"You temporarily push your physical power to its peak. Add your Potence rating as bonus dice to all Strength-based actions for the scene. Lifting capacity increases dramatically — you can move cars, break down reinforced doors.","requirements":null},{"name":"Brutal Feed","discipline":"Potence","level":3,"pool":"Strength + Potence","cost":"Free","duration":"Instant","description":"You feed with savage force, crushing the victim against you. Dealing physical harm is an option, not a requirement — but those who resist suffer Superficial damage equal to your Potence rating. The Kiss still applies normally.","requirements":null},{"name":"Spark of Rage","discipline":"Potence","level":3,"pool":"Strength + Potence vs. Composure + Resolve","cost":"1 Rouse Check","duration":"Instant","description":"You slam someone with force sufficient to trigger their Beast. A successful hit attempts to force the target into Frenzy. Mortals are simply overwhelmed; vampires must immediately make a Frenzy test at +2 Difficulty.","requirements":null},{"name":"Draught of Might","discipline":"Potence","level":4,"pool":"—","cost":"1 Rouse Check","duration":"Scene","description":"Your attacks carry devastating force. All physical damage you deal this scene is increased by your Potence rating. Punches collapse walls; thrown objects become lethal projectiles.","requirements":null},{"name":"Earthshock","discipline":"Potence","level":5,"pool":"Strength + Potence","cost":"1 Rouse Check","duration":"Instant","description":"You strike the ground with such force that the shockwave extends outward in a radius equal to your Potence rating in meters. Everything in range is knocked prone; structural damage to buildings is possible. Cannot be dodged if in range.","requirements":null},{"name":"Fist of Caine","discipline":"Potence","level":5,"pool":"Strength + Potence","cost":"1 Rouse Check","duration":"Instant","description":"A single strike of impossible power. You may direct this against an object, a mortal (instant death), or a vampire (Aggravated damage equal to your full Potence pool). The blow cannot be soaked by mundane armor.","requirements":null},{"name":"Awe","discipline":"Presence","level":1,"pool":"—","cost":"Free","duration":"Scene","description":"You radiate supernatural magnetism. Add your Presence rating as bonus dice to all Charisma-based social rolls. All in the room are unconsciously drawn to you — they want to please you, trust you, and hear what you have to say.","requirements":null},{"name":"Daunt","discipline":"Presence","level":1,"pool":"—","cost":"Free","duration":"Scene","description":"You project supernatural menace. All who approach you must succeed on a Composure + Resolve roll or suffer −2 dice to all actions against you. Animals flee instinctively. Mortals feel physically ill when threatening you.","requirements":null},{"name":"Lingering Kiss","discipline":"Presence","level":2,"pool":"—","cost":"Free","duration":"Days","description":"Your Bite leaves the target craving another. After feeding, the victim experiences euphoria and longing rather than trauma. They remember the encounter fondly and seek you out. Extended exposure builds obsessive attachment.","requirements":null},{"name":"Dread Gaze","discipline":"Presence","level":2,"pool":"Charisma + Presence vs. Composure + Resolve","cost":"1 Rouse Check","duration":"Instant","description":"You fix a target with a gaze of primal terror. They must immediately flee from you at full speed and take no aggressive actions until they escape your presence or the scene ends. Mortals may faint.","requirements":null},{"name":"Entrancement","discipline":"Presence","level":3,"pool":"Charisma + Presence vs. Composure + Resolve","cost":"1 Rouse Check","duration":"Days","description":"You make a target emotionally devoted to you — not controlled (like Dominate) but truly infatuated. They want to please you, help you, and be near you. They will not act against their core moral principles, but nearly anything else is possible.","requirements":null},{"name":"Summon","discipline":"Presence","level":3,"pool":"Charisma + Presence","cost":"1 Rouse Check","duration":"Until arrival","description":"You send a supernatural compulsion to a target you have met before. They feel an overwhelming urge to find and come to you, dropping what they are doing. They don't know why they are going. The urge intensifies with each passing hour.","requirements":null},{"name":"Irresistible Voice","discipline":"Presence","level":4,"pool":"Charisma + Presence vs. Composure + Resolve","cost":"1 Rouse Check","duration":"Scene","description":"Your voice carries supernatural authority. Any command you speak aloud is treated as Compel (Dominate Level 1) even without eye contact. Those who cannot hear you are immune. Useful across distances and in darkness.","requirements":null},{"name":"Magnet","discipline":"Presence","level":4,"pool":"Charisma + Presence","cost":"1 Rouse Check","duration":"Scene","description":"Everyone in a wide radius is unconsciously drawn to your location and to pleasing you. Crowds form around you, strangers offer help, and conflicts de-escalate in your presence. Each affected individual can resist with Composure + Resolve.","requirements":null},{"name":"Majesty","discipline":"Presence","level":5,"pool":"Charisma + Presence","cost":"1 Rouse Check","duration":"Scene","description":"You radiate divine authority. No one can act against you — mortals prostrate themselves, vampires cannot raise weapons, rivals find themselves unable to attack. Anyone who wishes to act violently against you must spend Willpower to even try.","requirements":null},{"name":"Eyes of the Beast","discipline":"Protean","level":1,"pool":"—","cost":"Free","duration":"Until cancelled","description":"Your eyes shift to feral, glowing orbs that see perfectly in total darkness. You suffer no penalties in darkness of any kind. The transformation is visible and obvious, marking you as inhuman.","requirements":null},{"name":"Weight of the Feather","discipline":"Protean","level":1,"pool":"—","cost":"Free","duration":"Until cancelled","description":"You become supernaturally light, redistributing your mass at will. You can walk on water, on snow without sinking, or on surfaces that cannot normally support your weight. You make no sound while this power is active.","requirements":null},{"name":"Feral Weapons","discipline":"Protean","level":2,"pool":"—","cost":"1 Rouse Check","duration":"Scene","description":"You grow claws, fangs, or other natural weapons from your body. These deal Aggravated damage. You can retract them at will. They can also be used to climb sheer surfaces, dig through soil, or tear through most materials.","requirements":null},{"name":"Earth Meld","discipline":"Protean","level":2,"pool":"—","cost":"1 Rouse Check","duration":"Until you emerge","description":"You meld into natural earth, stone, or soil, becoming completely undetectable while submerged. You can sense basic vibrations on the surface. Emerging takes a moment. You cannot meld into concrete or processed stone.","requirements":null},{"name":"Shapechange","discipline":"Protean","level":3,"pool":"Stamina + Protean","cost":"1 Rouse Check","duration":"Scene","description":"You transform into a specific animal form — determined at time of learning. The form must be roughly your own mass. You gain the animal's physical capabilities and senses. You retain your mind and can use mental Disciplines.","requirements":null},{"name":"Metamorphosis","discipline":"Protean","level":3,"pool":"Stamina + Protean","cost":"1 Rouse Check","duration":"Scene","description":"You can assume multiple animal forms (one per scene) or shift between them. You are not limited to one form — you may have learned several over the centuries. Transformation takes about a turn.","requirements":null},{"name":"Unfettered Heart","discipline":"Protean","level":4,"pool":"—","cost":"1 Rouse Check","duration":"Instant","description":"Your heart detaches from your body and moves freely, making staking impossible — even if your body is staked, the heart isn't there to stop. The heart floats invisibly nearby. It can also be sent as a scout.","requirements":null},{"name":"Horrid Form","discipline":"Protean","level":4,"pool":"Stamina + Protean","cost":"1 Rouse Check","duration":"Scene","description":"You take on a monstrous, bestial form — enlarged, twisted, with natural weapons and terrifying appearance. You gain +2 Strength and +2 Stamina; all social rolls with mortals automatically fail. Attacks deal Aggravated damage.","requirements":null},{"name":"One with the Land","discipline":"Protean","level":5,"pool":"Stamina + Protean","cost":"1 Rouse Check","duration":"Until you emerge","description":"You dissolve into your environment completely — flowing water, mist, storm, living earth. You can travel through the environment in this state, covering great distances. You are undetectable and invulnerable while in this form.","requirements":null}];
const _ADV_DATA  = [{"name":"Allies","type":1,"maxLevel":5,"description":"Mortals who actively support you — politicians, gang members, police officers. Each dot represents one group or individual of significant influence. They act on your behalf but have limits; push too hard and they may withdraw."},{"name":"Contacts","type":1,"maxLevel":5,"description":"Information networks and loose associates. Each dot is a contact pool you can call for tips, rumors, or black-market access in a specific domain. They don't act for you — they talk."},{"name":"Fame","type":1,"maxLevel":3,"description":"Public renown among mortals — celebrity, influencer, notorious criminal. Eases social rolls within your sphere. Lvl 1: local scene. Lvl 2: citywide recognition. Lvl 3: national or international."},{"name":"Haven","type":1,"maxLevel":5,"description":"A secured place to sleep and store your things. Lvl 1: a room with a lock. Lvl 2: a proper apartment or safehouse. Lvl 3: well-hidden with security. Lvl 4: fortified. Lvl 5: castle-level defensible compound."},{"name":"Herd","type":1,"maxLevel":5,"description":"A pool of mortals who willingly offer their blood. Each dot represents a group of regular vessels. Feeding from your Herd is automatic — no roll, no risk of Masquerade breach."},{"name":"Influence","type":1,"maxLevel":5,"description":"Indirect power over a mortal institution — media, finance, police, academia, criminal networks. You don't control individuals; you move the institution. Each dot covers one sphere."},{"name":"Linguistics","type":1,"maxLevel":5,"description":"Additional languages beyond your native tongue. Each dot grants fluency in one language (written and spoken). Khalil example: Arabic (native), French, Turkish, English."},{"name":"Loresheets","type":1,"maxLevel":5,"description":"Ties to specific historical bloodlines, factions, or forbidden knowledge. Specific to loresheet chosen; see rulebook. Grants unique abilities or information tied to that history."},{"name":"Mask","type":1,"maxLevel":3,"description":"A false mortal identity — papers, social media, a cover story. Lvl 1: basic documents. Lvl 2: full legend with job and apartment. Lvl 3: deep cover that withstands serious investigation."},{"name":"Mawla","type":1,"maxLevel":5,"description":"A powerful patron — a vampire or influential mortal who protects and guides you. Each dot reflects their power and how indebted they are to help. A high-level Mawla is rare and comes with obligations."},{"name":"Resources","type":1,"maxLevel":5,"description":"Wealth and liquid assets. Lvl 1: working class. Lvl 2: comfortable. Lvl 3: affluent. Lvl 4: wealthy. Lvl 5: obscenely rich, multiple properties and accounts."},{"name":"Retainer","type":1,"maxLevel":5,"description":"A loyal servant or ghoul who acts on your behalf. Each dot is one Retainer, rated by competence. Retainers need feeding, protection, and management — they are not expendable."},{"name":"Status","type":1,"maxLevel":5,"description":"Formal standing within a faction — Camarilla, Anarch, Sabbat, or mortal institution. Influences how others treat you and what resources you can request. Each dot is one sphere of standing."},{"name":"Thin-blood Alchemy","type":1,"maxLevel":5,"description":"(Thin-bloods only) The ability to brew alchemical formulas using your diluted vitae. Each dot unlocks more powerful and reliable formulas. Requires ingredients and preparation time."},{"name":"Feeding Grounds","type":1,"maxLevel":3,"description":"A territory acknowledged by local Kindred as your exclusive hunting ground. You feed without contest here. Lvl 1: one block. Lvl 2: a neighborhood. Lvl 3: a substantial district."},{"name":"Catenating Blood","type":1,"maxLevel":3,"description":"Your Blood Bond forms faster or stronger than normal. Useful for controlling ghouls and thralls. Each level reduces the number of drinks required to establish a full bond."},{"name":"Adversary","type":-1,"maxLevel":5,"description":"A powerful enemy actively working against you. Lvl 1: a persistent nuisance. Lvl 2: a genuine threat with resources. Lvl 3: an elder or organization. Lvl 4: a Methuselah or major faction. Lvl 5: existential."},{"name":"Addiction","type":-1,"maxLevel":3,"description":"An uncontrollable craving — for a specific type of blood, substance, or experience. Must indulge at least once per session or suffer penalties (Diff +1 to +2 on Composure rolls). Lvl 1: manageable. Lvl 3: debilitating."},{"name":"Archaic","type":-1,"maxLevel":1,"description":"You were Embraced in another era and never fully adapted to the modern world. −2 dice on rolls involving modern technology, social media, contemporary norms, or post-industrial systems."},{"name":"Bestial","type":-1,"maxLevel":2,"description":"Your Beast is particularly close to the surface. Frenzy thresholds are lower — triggers are more common and tests are at higher Difficulty. Lvl 1: +1 Diff to resist Frenzy. Lvl 2: +2 Diff."},{"name":"Blind","type":-1,"maxLevel":5,"description":"You cannot see. All sight-based actions fail automatically without supernatural compensation. Auspex may partially compensate. 5-dot flaw — very rarely taken without Storyteller planning."},{"name":"Clan Enmity","type":-1,"maxLevel":2,"description":"Another clan holds collective grudge or institutional hostility toward you. Social rolls with that clan suffer −2 dice. Lvl 2: open hostility, feeding grounds and territory contested."},{"name":"Dark Secret","type":-1,"maxLevel":3,"description":"You carry a truth that would destroy your reputation or worse if exposed. Lvl 1: embarrassing. Lvl 2: actionable — would cause loss of Status or allies. Lvl 3: would trigger violence or exile."},{"name":"Deficient","type":-1,"maxLevel":2,"description":"One of your Disciplines is capped or absent due to a flaw in your Blood. You cannot learn a specific Discipline (Lvl 2) or cannot exceed level 2 in it (Lvl 1)."},{"name":"Despised","type":-1,"maxLevel":3,"description":"You are widely disliked within Kindred society. Social rolls with Kindred who know your reputation suffer −1 to −3 dice. Others may actively scheme against you."},{"name":"Enemy","type":-1,"maxLevel":5,"description":"A personal adversary with a grudge and means. Unlike Adversary, this is personal. Lvl 1: a mortal with connections. Lvl 3: a vampire with grudge and resources. Lvl 5: elder with a blood hunt issued."},{"name":"Folkloric Bane","type":-1,"maxLevel":2,"description":"You are vulnerable to a folk myth about vampires — garlic, mirrors, holy symbols, running water. Lvl 1: −2 dice when exposed. Lvl 2: you cannot cross or touch the substance without spending Willpower."},{"name":"Haunted","type":-1,"maxLevel":2,"description":"You are plagued by a ghost or spirit tied to your past. It interferes with your activities, reveals secrets at inopportune times, or simply makes your existence miserable. Lvl 2: it can physically affect the world."},{"name":"Hunted","type":-1,"maxLevel":4,"description":"A group is actively pursuing you — Inquisition, rival coterie, mortal agency. Each level reflects their resources and determination. They know where to look and won't stop easily."},{"name":"Infamous","type":-1,"maxLevel":2,"description":"You carry a specific, known disgrace in Kindred history. Your lineage or an act in your past is widely known. Lose Status equal to Flaw level in affected faction. Social rolls with aware Kindred suffer penalties."},{"name":"Obvious Predator","type":-1,"maxLevel":2,"description":"Your vampire nature is hard to conceal. You look, smell, or move wrong. Mortals instinctively distrust you. −2 dice on social rolls with mortals who haven't been Dominated or Bound. Lvl 2: animals also react."},{"name":"Probationary Member","type":-1,"maxLevel":2,"description":"You are on probation within your sect — under observation, limited access to resources, treated with suspicion. Any violation of the rules will result in immediate punishment or expulsion."},{"name":"Repulsive","type":-1,"maxLevel":3,"description":"You are physically or socially repellent to mortals (and sometimes Kindred). −1 to −3 dice on appearance-based social rolls. The Nosferatu clan Bane applies this at level equal to Bane Severity."},{"name":"Stalkers","type":-1,"maxLevel":2,"description":"One or more mortals (or perhaps a Kindred) are obsessed with you and cannot be easily shaken. They may interfere with your operations, compromise your Masquerade, or simply be an endless nuisance."},{"name":"Suspect","type":-1,"maxLevel":2,"description":"Your sect or faction does not fully trust you. You are under informal surveillance. Lvl 1: watched. Lvl 2: actively tested and second-guessed. Any misstep is used against you."},{"name":"Terminal Decree","type":-1,"maxLevel":5,"description":"A powerful Kindred or faction has issued a standing order against you — watch list, blood hunt, or worse. Lvl 5 means the blood hunt is active and broadly known. You have no safe harbor in that domain."},{"name":"Thin Blood","type":-1,"maxLevel":5,"description":"Your vitae is too diluted. You cannot Embrace, struggle with Disciplines, and may have unpredictable blood interactions. Lvl 1–2: minor complications. Lvl 5: near-mortal, barely Kindred."}];

/* ── STATE ─────────────────────────────────────────────────── */
let char     = null;
let bpData   = [];
let discData = [];
let advData  = [];

let pendingDiscName  = null;
let pendingPowerDisc = null;
let pendingPowerName = null;
let pendingAdvType   = null;
let pendingAdvName   = null;
let confirmCallback  = null;

/* ══════════════════════════════════════════════════════════════
   STORAGE
══════════════════════════════════════════════════════════════ */
function storageGet() {
  try { return JSON.parse(localStorage.getItem('vtm5e') || '{}'); } catch(e) { return {}; }
}
function storageSave(store) {
  localStorage.setItem('vtm5e', JSON.stringify(store));
}
function loadStore() {
  let store = storageGet();
  if (!store.characters || store.characters.length === 0) {
    store.characters = [DEFAULT_CHARACTER.id];
    store.active     = DEFAULT_CHARACTER.id;
    store[DEFAULT_CHARACTER.id] = JSON.parse(JSON.stringify(DEFAULT_CHARACTER));
    storageSave(store);
  }
  return store;
}
function saveChar(c) {
  const store = storageGet();
  store[c.id] = c;
  storageSave(store);
}

/* ══════════════════════════════════════════════════════════════
   TABS
══════════════════════════════════════════════════════════════ */
function initTabs() {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.pg').forEach(p => p.classList.remove('visible'));
      btn.classList.add('active');
      document.getElementById('pg-' + btn.dataset.tab).classList.add('visible');
      window.scrollTo(0, 0);
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   EDIT MODE
══════════════════════════════════════════════════════════════ */
let editMode = false;

function setEditMode(on) {
  editMode = on;
  document.body.classList.toggle('edit-mode', on);
  document.getElementById('btn-edit').classList.toggle('active', on);
  document.getElementById('btn-edit').textContent = on ? '✏ Done' : '✏ Edit';
  const editable = ['char-name','char-aliases','hv-clan','hv-gen','hv-pred','hv-faction','hv-embrace','hv-sire','hv-lang','background-text'];
  editable.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.contentEditable = on ? 'true' : 'false';
  });
  if (!on) saveFromDOM();
}

document.getElementById('btn-edit').addEventListener('click', () => setEditMode(!editMode));

/* ══════════════════════════════════════════════════════════════
   RENDER ALL
══════════════════════════════════════════════════════════════ */
function renderAll() {
  if (!char) return;

  setText('char-name',   char.name);
  setText('char-aliases', char.aliases);
  setText('hv-clan',     char.clan);
  setText('hv-gen',      char.generation);
  setText('hv-pred',     char.predatorType);
  setText('hv-faction',  char.faction);
  setText('hv-embrace',  char.embrace);
  setText('hv-sire',     char.sire);
  setText('hv-lang',     char.languages);
  document.getElementById('xp-total').value = char.xpTotal || '';
  document.getElementById('xp-spent').value = char.xpSpent || '';

  const nn = document.getElementById('narr-char-name');
  if (nn) nn.textContent = char.name;
  const na = document.getElementById('narr-aliases');
  if (na) na.textContent = char.aliases;

  Object.keys(char.attributes).forEach(k => {
    const el = document.getElementById('attr-' + k);
    if (el) el.textContent = char.attributes[k];
  });

  renderSkills();
  renderAdvantages();
  renderFlaws();
  renderHealth();
  renderWillpower();
  renderHunger();
  renderHumanity();
  renderBP();

  document.querySelectorAll('.res-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.res === char.trackers.resonance);
  });

  renderDisciplines();
  renderInventory();
  renderConvictions();
  renderTouchstones();
  setText('background-text', char.background);
  renderSwitcher();
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val || '';
}

/* ── SKILLS ────────────────────────────────────────────────── */
function renderSkills() {
  ['physical','social','mental'].forEach(group => {
    const container = document.getElementById('skills-' + group);
    if (!container) return;
    container.innerHTML = '';
    SKILL_GROUPS[group].forEach(key => {
      const sk   = char.skills[key] || { value: 0, specialty: '' };
      const zero = sk.value === 0;
      const row  = document.createElement('div');
      row.className = 'skill-row';
      row.dataset.key = key;

      const left = document.createElement('div');
      left.className = 'skill-left';

      const name = document.createElement('span');
      name.className = 'skill-name' + (zero ? ' zero' : '');
      name.textContent = SKILL_LABELS[key];
      left.appendChild(name);

      if (!zero) {
        const spInput = document.createElement('span');
        spInput.className = 'skill-spec edit-ctrl';
        spInput.contentEditable = editMode ? 'true' : 'false';
        spInput.dataset.specFor = key;
        spInput.textContent = sk.specialty || '+ specialty';
        spInput.style.color = sk.specialty ? '' : 'var(--txt-e)';
        spInput.addEventListener('focus', () => {
          if (!spInput.textContent.trim() || spInput.textContent === '+ specialty') spInput.textContent = '';
        });
        spInput.addEventListener('blur', () => {
          char.skills[key].specialty = spInput.textContent.trim();
          saveChar(char);
          renderSkills();
        });
        left.appendChild(spInput);

        if (sk.specialty) {
          const spLabel = document.createElement('span');
          spLabel.className = 'skill-spec';
          spLabel.textContent = '(' + sk.specialty + ')';
          left.insertBefore(spLabel, spInput);
        }
      }
      row.appendChild(left);

      const ec1 = document.createElement('div');
      ec1.className = 'edit-ctrl';
      const bm = document.createElement('button');
      bm.className = 'btn-pm';
      bm.textContent = '−';
      bm.addEventListener('click', () => changeSkill(key, -1));
      ec1.appendChild(bm);
      row.appendChild(ec1);

      const val = document.createElement('span');
      val.className = 'skill-val' + (zero ? ' zero' : '');
      val.textContent = sk.value > 0 ? sk.value : '';
      row.appendChild(val);

      const ec2 = document.createElement('div');
      ec2.className = 'edit-ctrl';
      const bp_ = document.createElement('button');
      bp_.className = 'btn-pm';
      bp_.textContent = '+';
      bp_.addEventListener('click', () => changeSkill(key, 1));
      ec2.appendChild(bp_);
      row.appendChild(ec2);

      container.appendChild(row);
    });
  });
}

function changeSkill(key, delta) {
  if (!editMode) return;
  const sk = char.skills[key];
  sk.value = Math.max(0, Math.min(5, sk.value + delta));
  if (sk.value === 0) sk.specialty = '';
  saveChar(char);
  renderSkills();
}

/* ── ADVANTAGES / FLAWS ────────────────────────────────────── */
function renderAdvantages() {
  const el = document.getElementById('advantages-list');
  if (!el) return;
  el.innerHTML = '';
  char.advantages.forEach((adv, i) => renderAdvRow(el, adv, i, false));
}
function renderFlaws() {
  const el = document.getElementById('flaws-list');
  if (!el) return;
  el.innerHTML = '';
  char.flaws.forEach((flaw, i) => renderAdvRow(el, flaw, i, true));
}
function renderAdvRow(container, item, idx, isFlaw) {
  const row = document.createElement('div');
  row.className = 'adv-row';

  const left = document.createElement('div');
  left.className = 'adv-left';
  const nameEl = document.createElement('span');
  nameEl.className = isFlaw ? 'flaw-name' : 'adv-name';
  nameEl.textContent = item.name;
  left.appendChild(nameEl);
  if (item.note) {
    const noteEl = document.createElement('span');
    noteEl.className = 'adv-note';
    noteEl.textContent = '(' + item.note + ')';
    left.appendChild(noteEl);
  }
  row.appendChild(left);

  const ec1 = document.createElement('div');
  ec1.className = 'edit-ctrl';
  const bm = document.createElement('button');
  bm.className = 'btn-pm';
  bm.textContent = '−';
  bm.addEventListener('click', () => {
    const arr = isFlaw ? char.flaws : char.advantages;
    arr[idx].level = Math.max(1, arr[idx].level - 1);
    saveChar(char); isFlaw ? renderFlaws() : renderAdvantages();
  });
  ec1.appendChild(bm);
  row.appendChild(ec1);

  const valEl = document.createElement('span');
  valEl.className = 'adv-val';
  valEl.textContent = item.level;
  row.appendChild(valEl);

  const ec2 = document.createElement('div');
  ec2.className = 'edit-ctrl';
  const bp_ = document.createElement('button');
  bp_.className = 'btn-pm';
  bp_.textContent = '+';
  bp_.addEventListener('click', () => {
    const arr = isFlaw ? char.flaws : char.advantages;
    const maxLvl = getAdvMaxLevel(item.name);
    arr[idx].level = Math.min(maxLvl, arr[idx].level + 1);
    saveChar(char); isFlaw ? renderFlaws() : renderAdvantages();
  });
  ec2.appendChild(bp_);
  row.appendChild(ec2);

  const del = document.createElement('button');
  del.className = 'btn-delete';
  del.textContent = '×';
  del.addEventListener('click', () => {
    confirmDelete('Remove "' + item.name + '"?', () => {
      if (isFlaw) char.flaws.splice(idx, 1);
      else char.advantages.splice(idx, 1);
      saveChar(char);
      renderAdvantages();
      renderFlaws();
    });
  });
  row.appendChild(del);
  container.appendChild(row);
}

function getAdvMaxLevel(name) {
  const found = advData.find(a => a.name === name);
  return found ? (found.maxLevel || 5) : 5;
}

/* ── ATTRIBUTE +/- ─────────────────────────────────────────── */
document.querySelectorAll('.btn-pm[data-attr]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!editMode) return;
    const key   = btn.dataset.attr;
    const delta = parseInt(btn.dataset.d, 10);
    char.attributes[key] = Math.max(1, Math.min(5, char.attributes[key] + delta));
    document.getElementById('attr-' + key).textContent = char.attributes[key];
    saveChar(char);
  });
});

/* ══════════════════════════════════════════════════════════════
   TRACKERS
══════════════════════════════════════════════════════════════ */
function makeBox() {
  const b = document.createElement('div');
  b.className = 'box';
  return b;
}

/* Health */
function renderHealth() {
  const c  = document.getElementById('health-boxes');
  const tk = char.trackers;
  c.innerHTML = '';
  for (let i = 0; i < tk.healthMax; i++) {
    const b = makeBox();
    const s = tk.health[i] || 0;
    if (s === 1) b.classList.add('superficial');
    if (s === 2) b.classList.add('aggravated');
    b.addEventListener('click', () => {
      tk.health[i] = ((tk.health[i] || 0) + 1) % 3;
      saveChar(char); renderHealth();
    });
    c.appendChild(b);
  }
}
document.getElementById('health-minus').addEventListener('click', () => {
  if (!editMode) return;
  const tk = char.trackers;
  if (tk.healthMax <= 1) return;
  tk.healthMax--;
  tk.health = tk.health.slice(0, tk.healthMax);
  saveChar(char); renderHealth();
});
document.getElementById('health-plus').addEventListener('click', () => {
  if (!editMode) return;
  char.trackers.healthMax = Math.min(15, char.trackers.healthMax + 1);
  saveChar(char); renderHealth();
});

/* Willpower */
function renderWillpower() {
  const c  = document.getElementById('willpower-boxes');
  const tk = char.trackers;
  c.innerHTML = '';
  for (let i = 0; i < tk.willpowerMax; i++) {
    const b = makeBox();
    const s = tk.willpower[i] || 0;
    if (s === 1) b.classList.add('superficial');
    if (s === 2) b.classList.add('aggravated');
    b.addEventListener('click', () => {
      tk.willpower[i] = ((tk.willpower[i] || 0) + 1) % 3;
      saveChar(char); renderWillpower();
    });
    c.appendChild(b);
  }
}
document.getElementById('wp-minus').addEventListener('click', () => {
  if (!editMode) return;
  const tk = char.trackers;
  if (tk.willpowerMax <= 1) return;
  tk.willpowerMax--;
  tk.willpower = tk.willpower.slice(0, tk.willpowerMax);
  saveChar(char); renderWillpower();
});
document.getElementById('wp-plus').addEventListener('click', () => {
  if (!editMode) return;
  char.trackers.willpowerMax = Math.min(15, char.trackers.willpowerMax + 1);
  saveChar(char); renderWillpower();
});

/* Hunger */
function renderHunger() {
  const c  = document.getElementById('hunger-boxes');
  const tk = char.trackers;
  c.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const b = makeBox();
    if (tk.hunger[i]) b.classList.add('hunger-on');
    b.addEventListener('click', () => {
      tk.hunger[i] = tk.hunger[i] ? 0 : 1;
      saveChar(char); renderHunger();
    });
    c.appendChild(b);
  }
}

/* Humanity */
function renderHumanity() {
  const c  = document.getElementById('humanity-boxes');
  const tk = char.trackers;
  c.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;gap:3px;flex-wrap:wrap;align-items:center;';
  const total = 10;

  for (let i = 0; i < total; i++) {
    const b = makeBox();
    if (i < tk.humanity) {
      b.classList.add('hum-filled');
      b.style.cursor = 'default';
    } else {
      const emptyIdx  = i - tk.humanity;
      const stainFrom = total - tk.humanity - tk.humanityStains;
      if (emptyIdx >= stainFrom) b.classList.add('stain');
      b.addEventListener('click', () => {
        const eI  = i - char.trackers.humanity;
        const sF  = total - char.trackers.humanity - char.trackers.humanityStains;
        if (eI >= sF) char.trackers.humanityStains = Math.max(0, char.trackers.humanityStains - 1);
        else          char.trackers.humanityStains = Math.min(total - char.trackers.humanity, char.trackers.humanityStains + 1);
        saveChar(char); renderHumanity();
      });
    }
    wrap.appendChild(b);
  }

  const ec = document.createElement('div');
  ec.className = 'edit-ctrl';
  const bm = document.createElement('button');
  bm.className = 'btn-pm'; bm.textContent = '−';
  bm.addEventListener('click', () => {
    if (!editMode) return;
    char.trackers.humanity = Math.max(0, char.trackers.humanity - 1);
    saveChar(char); renderHumanity();
  });
  const bp_ = document.createElement('button');
  bp_.className = 'btn-pm'; bp_.textContent = '+';
  bp_.addEventListener('click', () => {
    if (!editMode) return;
    char.trackers.humanity = Math.min(10, char.trackers.humanity + 1);
    saveChar(char); renderHumanity();
  });
  ec.appendChild(bm); ec.appendChild(bp_);
  wrap.appendChild(ec);
  c.appendChild(wrap);
}

/* Blood Potency */
function renderBP() {
  const c  = document.getElementById('bp-boxes');
  const tk = char.trackers;
  c.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    const b = makeBox();
    b.classList.add('bp-box');
    if (i < tk.bp) b.classList.add('bp-filled');
    b.addEventListener('click', () => {
      if (!editMode) return;
      const clicked = i + 1;
      char.trackers.bp = char.trackers.bp === clicked ? clicked - 1 : clicked;
      saveChar(char); renderBP(); renderBPStats();
    });
    c.appendChild(b);
  }
  renderBPStats();
}

function renderBPStats() {
  const el = document.getElementById('bp-stats');
  if (!el) return;
  const lvl  = char.trackers.bp;
  const data = bpData.find(d => d.level === lvl);
  if (!data) { el.innerHTML = ''; return; }
  el.innerHTML =
    '<div>' +
      '<div class="bp-row"><span class="bp-k">Blood Surge</span><span class="bp-v">' + data.bloodSurge + '</span></div>' +
      '<div class="bp-row"><span class="bp-k">Mend / Rouse Check</span><span class="bp-v">' + data.damageHealed + '</span></div>' +
      '<div class="bp-row"><span class="bp-k">Discipline Bonus</span><span class="bp-v">' + data.disciplineBonus + '</span></div>' +
    '</div>' +
    '<div>' +
      '<div class="bp-row"><span class="bp-k">Rouse Re-Roll</span><span class="bp-v">' + data.rouseRoll + '</span></div>' +
      '<div class="bp-row"><span class="bp-k">Bane Severity</span><span class="bp-v">' + data.bane + '</span></div>' +
      '<div class="bp-row"><span class="bp-k">Feeding Penalty</span><span class="bp-v">' + data.penalty + '</span></div>' +
    '</div>';
}

/* Resonance */
document.querySelectorAll('.res-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    char.trackers.resonance = btn.dataset.res;
    saveChar(char);
    document.querySelectorAll('.res-btn').forEach(b =>
      b.classList.toggle('selected', b.dataset.res === char.trackers.resonance));
  });
});

/* ══════════════════════════════════════════════════════════════
   DISCIPLINES
══════════════════════════════════════════════════════════════ */
function renderDisciplines() {
  const container = document.getElementById('disciplines-list');
  if (!container) return;
  container.innerHTML = '';

  char.disciplines.forEach((disc, di) => {
    const group = document.createElement('div');
    group.className = 'disc-group';

    const hdr = document.createElement('div');
    hdr.className = 'disc-header';

    const titleSpan = document.createElement('span');
    titleSpan.textContent = disc.name;
    hdr.appendChild(titleSpan);

    // Level controls (−  ●●●  +) — visible only in edit mode via CSS
    const lvlDown = document.createElement('button');
    lvlDown.className = 'btn-delete disc-lvl-adj';
    lvlDown.textContent = '−';
    lvlDown.title = 'Decrease level';
    lvlDown.addEventListener('click', e => {
      e.stopPropagation();
      if (!editMode) return;
      if (disc.level > 1) { char.disciplines[di].level--; saveChar(char); renderDisciplines(); }
    });
    hdr.appendChild(lvlDown);

    const lvlSpan = document.createElement('span');
    lvlSpan.className = 'disc-level';
    lvlSpan.textContent = '●'.repeat(disc.level);
    hdr.appendChild(lvlSpan);

    const lvlUp = document.createElement('button');
    lvlUp.className = 'btn-delete disc-lvl-adj';
    lvlUp.textContent = '+';
    lvlUp.title = 'Increase level';
    lvlUp.addEventListener('click', e => {
      e.stopPropagation();
      if (!editMode) return;
      if (disc.level < 5) { char.disciplines[di].level++; saveChar(char); renderDisciplines(); }
    });
    hdr.appendChild(lvlUp);

    const addPowBtn = document.createElement('button');
    addPowBtn.className = 'btn-delete disc-lvl-adj';
    addPowBtn.style.cssText = 'color:rgba(255,255,255,.7);font-size:16px;margin-left:10px;';
    addPowBtn.textContent = '＋';
    addPowBtn.title = 'Add power';
    addPowBtn.addEventListener('click', e => { e.stopPropagation(); openAddPower(di); });
    hdr.appendChild(addPowBtn);

    const delDisc = document.createElement('button');
    delDisc.className = 'btn-delete';
    delDisc.textContent = '×';
    delDisc.addEventListener('click', () => {
      confirmDelete('Remove discipline "' + disc.name + '" and all its powers?', () => {
        char.disciplines.splice(di, 1);
        saveChar(char); renderDisciplines();
      });
    });
    hdr.appendChild(delDisc);
    group.appendChild(hdr);

    disc.powers.forEach((powerName, pi) => {
      const pData = discData.find(d => d.name === powerName && d.discipline === disc.name)
                 || discData.find(d => d.name === powerName);
      const card = document.createElement('div');
      card.className = 'disc-power';

      if (pData) {
        card.innerHTML =
          '<div class="dp-level">' + pData.discipline + ' ' + '●'.repeat(pData.level) +
            (pData.requirements ? ' · Req: ' + pData.requirements : '') + '</div>' +
          '<div class="dp-name">' + pData.name + '</div>' +
          (pData.pool && pData.pool !== '—' ? '<div class="dp-pool">Pool: ' + pData.pool + '</div>' : '') +
          '<div class="dp-desc">' + pData.description + '</div>' +
          '<div class="dp-meta">' +
            '<span><span class="dp-ml">Cost </span><span class="dp-mv">' + pData.cost + '</span></span>' +
            '<span><span class="dp-ml">Duration </span><span class="dp-mv">' + pData.duration + '</span></span>' +
          '</div>';
      } else {
        card.innerHTML = '<div class="dp-name">' + powerName + '</div>';
      }

      const delPow = document.createElement('button');
      delPow.className = 'btn-delete';
      delPow.textContent = '×';
      delPow.addEventListener('click', () => {
        confirmDelete('Remove power "' + powerName + '"?', () => {
          char.disciplines[di].powers.splice(pi, 1);
          saveChar(char); renderDisciplines();
        });
      });
      card.appendChild(delPow);
      group.appendChild(card);
    });

    container.appendChild(group);
  });
}

/* Add Discipline modal */
document.getElementById('btn-add-disc').addEventListener('click', () => {
  if (!editMode) return;
  pendingDiscName = null;
  openModal('modal-add-disc');
  setupSearch('disc-search-input', 'disc-search-results',
    [...new Set(discData.map(d => d.discipline))].map(n => ({ label: n })),
    item => { pendingDiscName = item.label; }
  );
});
document.getElementById('btn-disc-confirm').addEventListener('click', () => {
  if (!pendingDiscName) return;
  if (!char.disciplines.find(d => d.name === pendingDiscName)) {
    char.disciplines.push({ name: pendingDiscName, level: 1, powers: [] });
    saveChar(char); renderDisciplines();
  }
  closeModal('modal-add-disc');
});

/* Add Power modal */
function openAddPower(discIdx) {
  pendingPowerDisc = discIdx;
  pendingPowerName = null;
  const disc      = char.disciplines[discIdx];
  const available = discData
    .filter(d => d.discipline === disc.name && d.level <= disc.level && !disc.powers.includes(d.name))
    .map(d => ({ label: d.name, sub: '●'.repeat(d.level) }));
  document.getElementById('modal-power-title').textContent = 'Add Power — ' + disc.name;
  openModal('modal-add-power');
  setupSearch('power-search-input', 'power-search-results', available,
    item => { pendingPowerName = item.label; }
  );
}
document.getElementById('btn-power-confirm').addEventListener('click', () => {
  if (pendingPowerName === null || pendingPowerDisc === null) return;
  char.disciplines[pendingPowerDisc].powers.push(pendingPowerName);
  saveChar(char); renderDisciplines();
  closeModal('modal-add-power');
});

/* ══════════════════════════════════════════════════════════════
   ADVANTAGES MODAL
══════════════════════════════════════════════════════════════ */
function openAdvModal(type) {
  pendingAdvType = type;
  pendingAdvName = null;
  const items = advData
    .filter(a => type === 'flaw' ? a.type === -1 : a.type === 1)
    .map(a => ({ label: a.name }));
  document.getElementById('modal-adv-title').textContent = type === 'flaw' ? 'Add Flaw' : 'Add Advantage';
  openModal('modal-add-adv');
  setupSearch('adv-search-input', 'adv-search-results', items,
    item => { pendingAdvName = item.label; }
  );
}
document.getElementById('btn-add-adv').addEventListener('click',  () => { if (editMode) openAdvModal('advantage'); });
document.getElementById('btn-add-flaw').addEventListener('click', () => { if (editMode) openAdvModal('flaw'); });
document.getElementById('btn-adv-confirm').addEventListener('click', () => {
  if (!pendingAdvName) return;
  const entry = { name: pendingAdvName, level: 1, note: '' };
  if (pendingAdvType === 'flaw') char.flaws.push(entry);
  else char.advantages.push(entry);
  saveChar(char); renderAdvantages(); renderFlaws();
  closeModal('modal-add-adv');
});

/* ══════════════════════════════════════════════════════════════
   INVENTORY
══════════════════════════════════════════════════════════════ */
function renderInventory() {
  const el = document.getElementById('inventory-list');
  if (!el) return;
  el.innerHTML = '';
  char.inventory.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'inv-item';
    const name = document.createElement('span');
    name.className = 'inv-name';
    name.textContent = item;
    name.contentEditable = editMode ? 'true' : 'false';
    name.addEventListener('blur', () => { char.inventory[i] = name.textContent.trim(); saveChar(char); });
    row.appendChild(name);
    const del = document.createElement('button');
    del.className = 'btn-delete';
    del.textContent = '×';
    del.addEventListener('click', () => {
      confirmDelete('Remove "' + item + '" from inventory?', () => {
        char.inventory.splice(i, 1); saveChar(char); renderInventory();
      });
    });
    row.appendChild(del);
    el.appendChild(row);
  });
}
document.getElementById('btn-add-inv').addEventListener('click', () => {
  if (!editMode) return;
  char.inventory.push('New item');
  saveChar(char); renderInventory();
  const rows = document.querySelectorAll('#inventory-list .inv-name');
  if (rows.length) { rows[rows.length-1].focus(); selectAll(rows[rows.length-1]); }
});

/* ══════════════════════════════════════════════════════════════
   CONVICTIONS
══════════════════════════════════════════════════════════════ */
function renderConvictions() {
  const el = document.getElementById('convictions-list');
  if (!el) return;
  el.innerHTML = '';
  char.convictions.forEach((conv, i) => {
    const row = document.createElement('div');
    row.className = 'conviction-item';
    const num = document.createElement('span');
    num.className = 'conv-num';
    num.textContent = toRoman(i + 1);
    row.appendChild(num);
    const txt = document.createElement('span');
    txt.className = 'conv-text';
    txt.textContent = conv;
    txt.contentEditable = editMode ? 'true' : 'false';
    txt.addEventListener('blur', () => {
      char.convictions[i] = txt.textContent.trim();
      saveChar(char); renderTouchstones();
    });
    row.appendChild(txt);
    const del = document.createElement('button');
    del.className = 'btn-delete';
    del.textContent = '×';
    del.addEventListener('click', () => {
      confirmDelete('Remove this conviction?', () => {
        char.convictions.splice(i, 1); saveChar(char); renderConvictions(); renderTouchstones();
      });
    });
    row.appendChild(del);
    el.appendChild(row);
  });
}
document.getElementById('btn-add-conv').addEventListener('click', () => {
  if (!editMode || char.convictions.length >= 5) return;
  char.convictions.push('New conviction.');
  saveChar(char); renderConvictions();
  const items = document.querySelectorAll('#convictions-list .conv-text');
  if (items.length) { items[items.length-1].focus(); selectAll(items[items.length-1]); }
});

/* ══════════════════════════════════════════════════════════════
   TOUCHSTONES
══════════════════════════════════════════════════════════════ */
function renderTouchstones() {
  const el = document.getElementById('touchstones-list');
  if (!el) return;
  el.innerHTML = '';
  char.touchstones.forEach((ts, i) => {
    const item = document.createElement('div');
    item.className = 'touchstone-item';

    const nameRow = document.createElement('div');
    const nameEl  = document.createElement('span');
    nameEl.className = 'ts-name';
    nameEl.textContent = ts.name;
    nameEl.contentEditable = editMode ? 'true' : 'false';
    nameEl.addEventListener('blur', () => { char.touchstones[i].name = nameEl.textContent.trim(); saveChar(char); });
    nameRow.appendChild(nameEl);
    const sumEl = document.createElement('span');
    sumEl.className = 'ts-summary';
    sumEl.textContent = ts.summary;
    sumEl.contentEditable = editMode ? 'true' : 'false';
    sumEl.addEventListener('blur', () => { char.touchstones[i].summary = sumEl.textContent.trim(); saveChar(char); });
    nameRow.appendChild(sumEl);
    item.appendChild(nameRow);

    const linkEl = document.createElement('span');
    linkEl.className = 'ts-link';
    if (editMode) {
      const sel = document.createElement('select');
      sel.style.cssText = 'background:var(--bg-dsc);border:1px solid var(--brd-s);color:var(--acc);font-size:13px;font-style:italic;padding:2px 4px;';
      const blank = document.createElement('option');
      blank.value = ''; blank.textContent = '— no conviction —';
      sel.appendChild(blank);
      char.convictions.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = '→ ' + c;
        if (c === ts.linkedConviction) opt.selected = true;
        sel.appendChild(opt);
      });
      sel.addEventListener('change', () => { char.touchstones[i].linkedConviction = sel.value; saveChar(char); });
      linkEl.appendChild(sel);
    } else {
      linkEl.textContent = ts.linkedConviction ? '→ ' + ts.linkedConviction : '';
    }
    item.appendChild(linkEl);

    const descEl = document.createElement('div');
    descEl.className = 'ts-desc';
    descEl.textContent = ts.description;
    descEl.contentEditable = editMode ? 'true' : 'false';
    descEl.addEventListener('blur', () => { char.touchstones[i].description = descEl.textContent.trim(); saveChar(char); });
    item.appendChild(descEl);

    const del = document.createElement('button');
    del.className = 'btn-delete';
    del.textContent = '×';
    del.addEventListener('click', () => {
      confirmDelete('Remove touchstone "' + ts.name + '"?', () => {
        char.touchstones.splice(i, 1); saveChar(char); renderTouchstones();
      });
    });
    item.appendChild(del);
    el.appendChild(item);
  });
}
document.getElementById('btn-add-ts').addEventListener('click', () => {
  if (!editMode) return;
  char.touchstones.push({ name: 'New Touchstone', summary: '', linkedConviction: '', description: '' });
  saveChar(char); renderTouchstones();
});

/* ══════════════════════════════════════════════════════════════
   CHARACTER SWITCHER
══════════════════════════════════════════════════════════════ */
function renderSwitcher() {
  const store    = storageGet();
  const dropdown = document.getElementById('char-dropdown');
  dropdown.innerHTML = '';
  store.characters.forEach(id => {
    const c    = store[id];
    const item = document.createElement('div');
    item.className = 'char-dropdown-item' + (id === store.active ? ' active' : '');
    item.textContent = c ? c.name : id;
    item.addEventListener('click', () => { switchChar(id); dropdown.classList.remove('open'); });
    dropdown.appendChild(item);
  });
}
document.getElementById('btn-switch').addEventListener('click', e => {
  e.stopPropagation();
  document.getElementById('char-dropdown').classList.toggle('open');
});
document.addEventListener('click', () => document.getElementById('char-dropdown').classList.remove('open'));

function switchChar(id) {
  const store  = storageGet();
  store.active = id;
  storageSave(store);
  char = store[id];
  if (editMode) setEditMode(false);
  renderAll();
}

document.getElementById('btn-new').addEventListener('click', () => {
  const id   = 'char_' + Date.now();
  const newC = JSON.parse(JSON.stringify(DEFAULT_CHARACTER));
  newC.id    = id;
  newC.name  = 'New Character';
  newC.aliases = '';
  newC.trackers = { healthMax:5, health:[0,0,0,0,0], willpowerMax:5, willpower:[0,0,0,0,0], hunger:[0,0,0,0,0], humanity:7, humanityStains:0, bp:1, resonance:'' };
  newC.attributes = { strength:1, dexterity:1, stamina:1, charisma:1, manipulation:1, composure:1, intelligence:1, wits:1, resolve:1 };
  Object.keys(newC.skills).forEach(k => { newC.skills[k] = { value:0, specialty:'' }; });
  newC.advantages = []; newC.flaws = [];
  newC.disciplines = []; newC.inventory = [];
  newC.convictions = []; newC.touchstones = [];
  newC.background = '';
  const store = storageGet();
  store.characters.push(id);
  store.active = id;
  store[id]   = newC;
  storageSave(store);
  char = newC;
  renderAll();
  setEditMode(true);
});

/* ══════════════════════════════════════════════════════════════
   EXPORT / IMPORT
══════════════════════════════════════════════════════════════ */
document.getElementById('btn-export').addEventListener('click', () => {
  if (!char) return;
  const blob = new Blob([JSON.stringify(char, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = (char.name || 'character').replace(/\s+/g, '_') + '.json';
  a.click();
  URL.revokeObjectURL(url);
});
document.getElementById('btn-import').addEventListener('click', () => {
  document.getElementById('import-input').click();
});
document.getElementById('import-input').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const imported = JSON.parse(ev.target.result);
      if (!imported.name) throw new Error('Invalid character file');
      if (!imported.id) imported.id = 'char_' + Date.now();
      const store = storageGet();
      if (!store.characters.includes(imported.id)) store.characters.push(imported.id);
      store[imported.id] = imported;
      store.active       = imported.id;
      storageSave(store);
      char = imported;
      renderAll();
    } catch(err) { alert('Could not import character: ' + err.message); }
  };
  reader.readAsText(file);
  e.target.value = '';
});

/* ══════════════════════════════════════════════════════════════
   SAVE FROM DOM
══════════════════════════════════════════════════════════════ */
function saveFromDOM() {
  if (!char) return;
  char.name         = document.getElementById('char-name').textContent.trim();
  char.aliases      = document.getElementById('char-aliases').textContent.trim();
  char.clan         = document.getElementById('hv-clan').textContent.trim();
  char.generation   = document.getElementById('hv-gen').textContent.trim();
  char.predatorType = document.getElementById('hv-pred').textContent.trim();
  char.faction      = document.getElementById('hv-faction').textContent.trim();
  char.embrace      = document.getElementById('hv-embrace').textContent.trim();
  char.sire         = document.getElementById('hv-sire').textContent.trim();
  char.languages    = document.getElementById('hv-lang').textContent.trim();
  char.xpTotal      = document.getElementById('xp-total').value;
  char.xpSpent      = document.getElementById('xp-spent').value;
  char.background   = document.getElementById('background-text').textContent.trim();
  const na = document.getElementById('narr-aliases');
  if (na) na.textContent = char.aliases;
  const nn = document.getElementById('narr-char-name');
  if (nn) nn.textContent = char.name;
  saveChar(char);
  renderSwitcher();
}
['xp-total','xp-spent'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('change', () => {
    el.value = Math.max(0, parseInt(el.value) || 0);
    char.xpTotal = document.getElementById('xp-total').value;
    char.xpSpent = document.getElementById('xp-spent').value;
    saveChar(char);
  });
  el.addEventListener('blur', () => {
    if (parseInt(el.value) < 0 || el.value === '') el.value = 0;
  });
});

/* ── Field character limits (contentEditable) ── */
(function setupFieldLimits() {
  const LIMITS = {
    'char-name': 50, 'char-aliases': 80,
    'hv-clan': 30,  'hv-gen': 6,
    'hv-pred': 25,  'hv-faction': 25,
    'hv-embrace': 35, 'hv-sire': 45,
    'hv-lang': 100
  };
  Object.entries(LIMITS).forEach(([id, max]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      if (el.textContent.length > max) {
        el.textContent = el.textContent.slice(0, max);
        // restore cursor to end
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  });
})();

/* ══════════════════════════════════════════════════════════════
   MODAL HELPERS
══════════════════════════════════════════════════════════════ */
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  const inp = document.querySelector('#' + id + ' input[type=text]');
  if (inp) inp.value = '';
  const res = document.querySelector('#' + id + ' .search-results');
  if (res) res.classList.remove('open');
}
function confirmDelete(msg, cb) {
  document.getElementById('confirm-msg').textContent = msg;
  confirmCallback = cb;
  document.getElementById('confirm-overlay').classList.add('open');
}
document.getElementById('confirm-ok').addEventListener('click', () => {
  document.getElementById('confirm-overlay').classList.remove('open');
  if (confirmCallback) { confirmCallback(); confirmCallback = null; }
});
document.getElementById('confirm-cancel').addEventListener('click', () => {
  document.getElementById('confirm-overlay').classList.remove('open');
  confirmCallback = null;
});

/* Searchable dropdown */
function setupSearch(inputId, resultsId, items, onSelect) {
  const input   = document.getElementById(inputId);
  const results = document.getElementById(resultsId);
  input.value   = '';
  results.innerHTML = '';
  results.classList.remove('open');

  function showItems(filter) {
    const q     = filter.toLowerCase();
    const match = items.filter(i => i.label.toLowerCase().includes(q));
    results.innerHTML = '';
    match.slice(0, 30).forEach(item => {
      const div  = document.createElement('div');
      div.className = 'search-result-item';
      div.innerHTML = item.label + (item.sub ? '<span class="search-result-sub">' + item.sub + '</span>' : '');
      div.addEventListener('click', () => {
        input.value = item.label;
        results.classList.remove('open');
        onSelect(item);
      });
      results.appendChild(div);
    });
    results.classList.toggle('open', match.length > 0);
  }

  input.addEventListener('input',  () => showItems(input.value));
  input.addEventListener('focus',  () => showItems(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Escape') results.classList.remove('open'); });
}

/* ══════════════════════════════════════════════════════════════
   PROMPT COPY
══════════════════════════════════════════════════════════════ */
function copyPrompt() {
  const text = document.getElementById('creation-prompt').textContent.replace(/Copy|Copied!/g,'').trim();
  const btn  = document.querySelector('.prompt-copy-btn');
  navigator.clipboard.writeText(text).then(() => {
    if (!btn) return;
    btn.textContent = 'Copied!';
    btn.style.color = 'var(--gold)';
    btn.style.borderColor = 'var(--gold)';
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  }).catch(() => {
    if (btn) { btn.textContent = 'Error'; setTimeout(() => { btn.textContent = 'Copy'; }, 2000); }
  });
}

/* ══════════════════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════════════════ */
function toRoman(n) { return ['I','II','III','IV','V'][n-1] || n; }
function selectAll(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */
function init() {
  bpData   = _BP_DATA;
  discData = _DISC_DATA;
  advData  = _ADV_DATA;

  const store = loadStore();
  char = store[store.active];

  initTabs();
  renderAll();
}

init();
