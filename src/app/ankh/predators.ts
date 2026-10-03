export interface PredatorText {
  source: string;
  body: string;
  details: string[];
}

export const PREDATOR_TEXTS: Record<string, PredatorText> = {
  'Alleycat': {
    source: 'CORE · P. 175',
    body: 'Um predador combativo que se alimenta por assalto, você persegue, subjuga e bebe de quem puder, quando puder. Você pode ou não tentar ameaçar ou Dominar as vítimas para silenciá-las, ou disfarçar a alimentação como um assalto. Pense em como você chegou a essa abordagem direta de se alimentar e no que o deixa confortável com uma não-vida de perseguir, atacar, se alimentar e escapar. Você pode ter sido um morador de rua, um soldado do SAS, um matador de cartel ou um caçador de grandes presas.',
    details: [
      'Adicione uma especialidade: Intimidation (Stickups) ou Brawl (Grappling)',
      'Ganhe um ponto de Celerity ou Potence',
      'Perca um ponto de Humanity',
      'Ganhe três pontos de Contacts criminosos',
    ],
  },
  'Bagger': {
    source: 'CORE · P. 176',
    body: 'Você rouba, compra ou de algum outro modo obtém sangue frio em vez de caçar, contando com o mercado negro ou com suas habilidades de ladrão ou de abutre de ambulâncias. Talvez você ainda trabalhe no turno da noite do hospital. Ventrue não podem escolher este Predator Type.',
    details: [
      'Adicione uma especialidade: Larceny (Lockpicking) ou Streetwise (Black Market)',
      'Ganhe um ponto de Blood Sorcery (apenas Tremere) ou Obfuscate',
      'Ganhe o Mérito de Feeding: Iron Gullet (•••)',
      'Ganhe o Defeito Enemy: (••) Alguém acredita que você lhe deve algo, ou há outra razão para você ficar longe das ruas.',
    ],
  },
  'Blood Leech': {
    source: 'CORE · P. 176',
    body: 'Você bebe de outros vampiros, seja caçando, coagindo ou tomando Sangue como pagamento - a única forma verdadeiramente moral de se alimentar que você consegue imaginar. Infelizmente, essa prática costuma ser proibida na sociedade Kindred. Ou é arriscada pra caralho, ou exige uma posição de poder invejável.',
    details: [
      'Adicione uma especialidade: Brawl (Kindred) ou Stealth (against Kindred)',
      'Ganhe um ponto de Celerity ou Protean',
      'Perca um ponto de Humanity',
      'Aumente Blood Potency em um',
      'Ganhe o Defeito Dark Secret: (••) Diablerist, ou o Defeito Shunned: (••)',
      'Ganhe o Defeito de Feeding: (••) Prey Exclusion (mortais)',
    ],
  },
  'Cleaver': {
    source: 'CORE · P. 176',
    body: 'Você se alimenta às escondidas da sua família mortal (ou da de outra pessoa) e de amigos com quem ainda mantém laços. Os Cleavers mais extremos adotam crianças, se casam com um humano e tentam manter uma vida familiar pelo maior tempo possível. Adicione sua família ao Mapa de Relacionamentos. Cleavers costumam fazer de tudo para esconder a verdade sobre sua condição da família, mas alguns também mantêm relacionamentos doentios com os próprios parentes. A Camarilla proíbe tomar uma família humana dessa forma e vê os Cleavers com desaprovação, como quebras da Máscara à espera de acontecer. Kindred mais sábios podem massacrar sua família para o seu próprio bem se descobrirem seu segredo e se importarem com o que acontece com você.',
    details: [
      'Adicione uma especialidade: Persuasion (Gaslighting) ou Subterfuge (Coverups)',
      'Ganhe um ponto de Dominate ou Animalism',
      'Ganhe o Defeito Dark Secret: (•) Cleaver',
      'Ganhe a Vantagem Herd (••)',
    ],
  },
  'Consensualist': {
    source: 'CORE · P. 177',
    body: 'Você nunca se alimenta contra a livre vontade da vítima. Você se faz passar por representante de uma campanha de doação de sangue de caridade, por um mestre kinky que bebe sangue na “comunidade de vampiros reais”, ou realmente conta às vítimas o que você é e obtém a permissão delas para se alimentar. A Camarilla chama esse último método de quebra da Máscara, mas muitos filósofos Anarquistas o consideram um risco aceitável. Você poderia ter sido qualquer coisa em vida, mas uma pessoa que trabalhava com sexo, um organizador político ou um advogado teriam todos motivos para desconfiar de se alimentar sem consentimento.',
    details: [
      'Adicione uma especialidade: Medicine (Phlebotomy) ou Persuasion (Victims)',
      'Ganhe um ponto de Auspex ou Fortitude',
      'Ganhe um ponto de Humanity',
      'Ganhe o Defeito Dark Secret: (•) Masquerade Breacher',
      'Ganhe o Defeito de Feeding: (•) Prey Exclusion (non-consenting)',
    ],
  },
  'Farmer': {
    source: 'CORE · P. 177',
    body: 'Você se alimenta apenas de animais. Sua Hunger o corrói o tempo todo, mas você não matou um único ser humano até agora (exceto talvez aquela vez), e pretende continuar assim. Você poderia ter sido qualquer pessoa em vida, mas sua escolha revela alguém obcecado por moralidade. Talvez você tenha sido ativista, padre, trabalhador humanitário ou vegano em vida, mas a decisão de nunca arriscar uma vida humana é uma a que qualquer um poderia chegar e lutar para manter. Ventrue não podem escolher este Predator Type. Você não pode escolher este Predator Type se sua Blood Potency for 3 ou mais.',
    details: [
      'Adicione uma especialidade: Animal Ken (Specific Animal) ou Survival (Hunting)',
      'Ganhe um ponto de Animalism ou Protean',
      'Ganhe um ponto de Humanity',
      'Ganhe o Defeito de Feeding: (••) Vegan',
    ],
  },
  'Osiris': {
    source: 'CORE · P. 177',
    body: 'Você é uma celebridade entre os mortais, ou então comanda um culto, uma igreja ou algo parecido. Você se alimenta de seus fãs ou adoradores, que o tratam como uma divindade. Você sempre tem acesso a sangue fácil, mas seguidores trazem problemas com as autoridades, com a religião organizada e, de fato, com a Camarilla. Em vida, você pode ter sido DJ, escritor, cultista, pregador ou organizador de LARP.',
    details: [
      'Adicione uma especialidade: Occult (specific tradition) ou Performance (specific entertainment field)',
      'Ganhe um ponto de Blood Sorcery (apenas Tremere) ou Presence',
      'Distribua três pontos entre os Backgrounds Fame e Herd',
      'Distribua dois pontos entre os Defeitos Enemies e Mythic',
    ],
  },
  'Sandman': {
    source: 'CORE · P. 177',
    body: 'Você conta com sua Stealth ou com suas Disciplinas para se alimentar de vítimas adormecidas. Se elas nunca acordam durante a alimentação, nunca saberão que você existe. Talvez você fosse muito antissocial em vida; você não se sente talhado para a intensa vida noturna interpessoal nem para a violência física dos caçadores mais extrovertidos.',
    details: [
      'Adicione uma especialidade: Medicine (Anesthetics) ou Stealth (Break-in)',
      'Ganhe um ponto de Auspex ou Obfuscate',
      'Ganhe um ponto de Resources',
    ],
  },
  'Scene Queen': {
    source: 'CORE · P. 178',
    body: 'Você conta com sua familiaridade com certa subcultura e com uma pose bem trabalhada, alimentando-se de uma subcultura exclusiva que acredita que você é um deles. Suas vítimas o adoram pelo seu status na cena, e as que entendem o que você é não são acreditadas. Você pode pertencer às ruas ou ser literalmente da classe alta, abusando dos fracos com falsas esperanças e promessas de levá-los ao próximo nível. Em vida, você quase certamente pertenceu a uma cena semelhante à que persegue agora.',
    details: [
      'Adicione uma especialidade: Etiquette (specific scene), Leadership (specific scene) ou Streetwise (specific scene)',
      'Ganhe um ponto de Dominate ou Potence',
      'Ganhe a Vantagem Fame: (•)',
      'Ganhe a Vantagem Contact: (•)',
      'Ganhe o Defeito Influence: (•) Disliked (fora da sua subcultura) ou o Defeito de Feeding: (•) Prey Exclusion (uma subcultura diferente da sua)',
    ],
  },
  'Siren': {
    source: 'CORE · P. 178',
    body: 'Você se alimenta quase exclusivamente durante o sexo ou fingindo-o, e conta com suas Disciplinas, suas habilidades de sedução ou os apetites insaciáveis dos outros para esconder sua natureza carnívora. Você dominou a arte do sexo casual de uma noite, ou transita pela cena dos clubes de sexo como uma estrela sombria. Você se considera uma fera sexy, mas, em seus momentos mais sombrios, teme ser, na melhor das hipóteses, um amante problemático e, na pior, um estuprador habitual. Um ex-amante que escapou da destruição pode ser seu Touchstone ou seu perseguidor. (Se for o caso, adicione-o ao Mapa de Relacionamentos.) Talvez em vida você fosse um conquistador profissional, produtor de cinema, autor, um glorioso kinkster promíscuo – ou um virgem que pretende compensar o tempo perdido após a morte.',
    details: [
      'Adicione uma especialidade: Persuasion (Seduction) ou Subterfuge (Seduction)',
      'Ganhe um ponto de Fortitude ou Presence',
      'Ganhe o Mérito Looks: (••) Beautiful',
      'Ganhe o Defeito Enemy: (•) Um amante rejeitado ou parceiro ciumento',
    ],
  },
  'Extortionist': {
    source: 'PLAYER’S GUIDE · PP. 107–109',
    body: 'Você força suas vítimas a sangrar por você. Em tese, o sangue vem em troca de serviços como segurança ou vigilância, mas, tantas vezes quanto a necessidade de proteção é real, ela é igualmente uma ficção criada para tornar o acordo aceitável para a vítima.',
    details: [
      'Adicione uma especialidade: Intimidation (Coercion) ou Larceny (Security)',
      'Ganhe um ponto de Dominate ou Potence',
      'Distribua três pontos entre os Backgrounds Contacts e Resources',
      'Ganhe o Defeito Enemy: (••) a polícia ou uma vítima que escapou da sua extorsão e quer vingança',
      'Predator Pool: Strength ou Manipulation + Intimidation',
    ],
  },
  'Graverobber': {
    source: 'PLAYER’S GUIDE · PP. 107–109',
    body: 'Costuma se alimentar de cadáveres frescos, mas também de enlutados em cemitérios e de visitantes e pacientes em hospitais. A Resonance Melancholic no sangue da vítima atrai mais do que qualquer outro humor. Este tipo costuma exigir um Haven numa igreja, hospital ou necrotério, ou conexões com eles.',
    details: [
      'Adicione uma especialidade: Occult (Grave Rituals) ou Medicine (Cadavers)',
      'Ganhe um ponto de Fortitude ou Oblivion',
      'Ganhe o Mérito de Alimentação Iron Gullet: (•••)',
      'Ganhe um ponto no Background Haven',
      'Ganhe o Defeito Herd: (••) Obvious Predator, pois sua frieza sobrenatural faz você agir de modo profundamente perturbador ao caçar',
      'Predator Pool: Resolve + Medicine (vasculhando os mortos atrás de um corpo com sangue rançoso) ou Manipulation + Insight (circulando entre mortais infelizes). Um cadáver frio sacia até 3 Hunger, com as mesmas penalidades do sangue ensacado',
    ],
  },
  'Grim Reaper': {
    source: 'PLAYER’S GUIDE · PP. 107–109',
    body: 'Também chamado de plague rat, você só se alimenta de quem está prestes a morrer. Procura casas de cuidados paliativos, asilos e abrigos, o que significa estar sempre em movimento atrás de novas vítimas no fim da vida, com dificuldade de se estabelecer.',
    details: [
      'Adicione uma especialidade: Awareness (Death) ou Larceny (Forgery)',
      'Ganhe um ponto de Auspex ou Oblivion',
      'Ganhe um ponto nos Backgrounds Allies ou Influence, na comunidade médica',
      'Ganhe um ponto de Humanity',
      'Ganhe o Defeito de Alimentação Prey Exclusion: (•) Healthy Mortals',
      'Predator Pool: Intelligence + Awareness ou Medicine',
    ],
  },
  'Montero': {
    source: 'PLAYER’S GUIDE · PP. 107–109',
    body: 'Desde a Idade Média, aristocratas espanhóis fazem a montería: uma caçada em que equipes de batedores empurram a caça para as lanças (depois, armas de fogo) do montero. Você continua a tradição usando retainers para conduzir as vítimas até você. Sua montería moderna pode ser um golpe longo, um flash mob, um cerco de protesto, um labirinto burocrático interminável ou uma perseguição de gangue aparentemente sem sentido.',
    details: [
      'Adicione uma especialidade: Leadership (Hunting Pack) ou Stealth (Stakeout)',
      'Ganhe um ponto de Dominate ou Obfuscate',
      'Ganhe dois pontos no Background Retainers',
      'Perca um ponto de Humanity',
      'Predator Pool: Intelligence + Stealth (com uma equipe experiente) ou Resolve + Stealth (esperando a presa chegar)',
    ],
  },
  'Pursuer': {
    source: 'PLAYER’S GUIDE · PP. 107–109',
    body: 'Algumas pessoas nunca serão acreditadas; outras nunca serão procuradas. Você estuda a vítima, aprende a rotina e se ela pode desaparecer sem alarde. Depois a persegue pela noite, atacando só quando sua sensibilidade e sua Fome chegam ao ponto mais delicioso.',
    details: [
      'Adicione uma especialidade: Investigation (Profiling) ou Stealth (Shadowing)',
      'Ganhe um ponto de Animalism ou Auspex',
      'Ganhe o Mérito Bloodhound: (•)',
      'Ganhe um ponto de Contacts entre os habitués moralmente flexíveis do seu terreno de caça',
      'Perca um ponto de Humanity',
      'Predator Pool: Intelligence + Investigation ou Stamina + Stealth',
    ],
  },
  'Trapdoor': {
    source: 'PLAYER’S GUIDE · PP. 107–109',
    body: 'Como a aranha trapdoor, você constrói o ninho e atrai as presas até ele. Pode espreitar num trem-fantasma de parque de diversões ou numa casa de banhos turca, assombrar uma casa ou gerir um clube de luta, mas as vítimas vêm ao seu local de poder. Lá você pode brincar com elas em terror, aprisioná-las e drená-las devagar, ou beber fundo e deixá-las ir.',
    details: [
      'Adicione uma especialidade: Persuasion (Marketing) ou Stealth (Ambushes ou Traps)',
      'Ganhe um ponto de Protean ou Obfuscate',
      'Ganhe um ponto no Background Haven',
      'Ganhe um ponto em Retainers ou Herd, ou um segundo ponto de Haven',
      'Ganhe o Defeito de Haven Creepy: (•) ou Haunted: (•)',
      'Predator Pool: Charisma + Stealth ou Dexterity + Stealth',
    ],
  },
};
