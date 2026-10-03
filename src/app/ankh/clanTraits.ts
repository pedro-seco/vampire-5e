import { resolveClanName } from './clanNames';

export interface ClanTrait {
  name: string;
  text: string;
}

export interface ClanTraits {
  bane: ClanTrait;
  compulsion: ClanTrait;
}

export const CLAN_TRAITS: Record<string, ClanTraits> = {
  Brujah: {
    bane: { name: 'Violent Temper', text: 'Subtrai Bane Severity dados em testes para resistir ao Frenesi de Fúria (mínimo de 1 dado).' },
    compulsion: { name: 'Rebelião', text: '−2 dados em todas as rolagens até desafiar ordens ou expectativas, ou mudar a opinião de alguém.' },
  },
  Gangrel: {
    bane: { name: 'Bestial Features', text: 'Em frenesi, ganha traços animais (quantidade igual à Bane Severity), cada um −1 em um Atributo, por mais uma noite. Ao Surfar a Onda, escolhe só um.' },
    compulsion: { name: 'Impulsos Animais', text: 'Por uma cena, −3 dados em Manipulation e Intelligence e só fala frases de uma palavra.' },
  },
  Malkavian: {
    bane: { name: 'Fractured Perspective', text: 'Em Bestial Failure ou Compulsão, −Bane Severity dados em uma categoria de pool (Físico, Social ou Mental) durante a cena.' },
    compulsion: { name: 'Delírio', text: 'Por uma cena, −2 dados em Dexterity, Manipulation, Composure e Wits, e para resistir ao frenesi de terror.' },
  },
  Nosferatu: {
    bane: { name: 'Repulsiveness', text: 'Tem o Flaw Repulsive (−2) e não aumenta Aparência. Disfarçar-se de humano sofre −Bane Severity dados (inclui Obfuscate).' },
    compulsion: { name: 'Cryptophilia', text: '−2 dados em ações que não busquem um segredo, até aprender um segredo útil.' },
  },
  Toreador: {
    bane: { name: 'Aesthetic Fixation', text: 'Em ambientes que não são belos, −Bane Severity dados nas pools de Disciplinas.' },
    compulsion: { name: 'Obsessão', text: 'Fixa-se em algo belo: −2 dados em qualquer outra ação, até perder o objeto de vista ou a cena acabar.' },
  },
  Tremere: {
    bane: { name: 'Deficient Blood', text: 'Não forma Blood Bond com Kindred. Para vincular mortais e ghouls, a vitae deve ser dada Bane Severity vezes a mais.' },
    compulsion: { name: 'Perfeccionismo', text: '−2 dados em todos os testes até um sucesso crítico em Skill ou o fim da cena. Ao repetir a ação a penalidade cai para −1 e depois some.' },
  },
  Ventrue: {
    bane: { name: 'Rarefied Tastes', text: 'Só se alimenta da sua preferência. Beber outro sangue custa Willpower igual à Bane Severity, ou volta como vômito.' },
    compulsion: { name: 'Arrogância', text: '−2 dados em ações sem relação com liderança, até alguém obedecer a uma ordem dele (sem poderes sobrenaturais).' },
  },
  'Banu Haqim': {
    bane: { name: 'Blood Addiction', text: 'Saciar Hunger com vitae vampírica exige teste de hunger frenzy (Dif. 2 + Bane Severity). Falhar arrisca diablerie.' },
    compulsion: { name: 'Judgment', text: 'Pune quem age contra uma Conviction dele, saciando Hunger dessa pessoa. Senão, −3 dados em tudo até cumprir ou a cena acabar.' },
  },
  Hecata: {
    bane: { name: 'Painful Kiss', text: 'Só faz harmful drinks. A vítima passa em Stamina + Resolve (Dif. 2 + Bane Severity) para não se debater de dor.' },
    compulsion: { name: 'Morbidity', text: '−2 dados em ações que não encerrem ou ressuscitem algo, até matar ou devolver à vida alguma coisa.' },
  },
  Lasombra: {
    bane: { name: 'Distorted Image', text: 'Reflexo e gravações distorcidos. Tecnologia de comunicação exige Technology (Dif. 2 + Bane Severity).' },
    compulsion: { name: 'Ruthlessness', text: 'Após a próxima falha, −2 dados em todas as rolagens até uma nova tentativa da mesma ação ter sucesso ou a cena acabar.' },
  },
  Ministry: {
    bane: { name: 'Abhors the Light', text: 'Luz direta dá −Bane Severity dados em todas as pools. Soma Bane Severity ao dano agravado do sol.' },
    compulsion: { name: 'Transgression', text: '−2 dados em pools que não visem seduzir alguém a quebrar um Tenet ou Conviction. Termina ao causar 1 Stain.' },
  },
  Ravnos: {
    bane: { name: 'Doomed', text: 'Dormir no mesmo local mais de uma vez em 7 noites: rola Bane Severity dados e sofre dano agravado por cada 10.' },
    compulsion: { name: 'Tempting Fate', text: 'Soluções que não sejam a mais ousada ou perigosa sofrem −2 dados, até o problema ser resolvido.' },
  },
  Salubri: {
    bane: { name: 'Hunted', text: 'O terceiro olho chora vitae ao usar Disciplinas e o sangue Salubri provoca hunger frenzy em outros Kindred.' },
    compulsion: { name: 'Affective Empathy', text: '−2 dados em tudo que não alivie o problema de alguém na cena.' },
  },
  Tzimisce: {
    bane: { name: 'Grounded', text: 'Deve passar o daysleep cercado pela sua charge. Senão, sofre dano agravado de Willpower igual à Bane Severity.' },
    compulsion: { name: 'Covetousness', text: '−2 dados em ações que não visem possuir algo da cena, até a posse ser estabelecida ou ficar inalcançável.' },
  },
  Caitiff: {
    bane: { name: 'Sem Bane de clã', text: 'Começa com o Flaw Suspect (•) e sem Status positivo.' },
    compulsion: { name: 'Sem Compulsão de clã', text: '' },
  },
  'Thin-blood': {
    bane: { name: 'Sem Bane de clã', text: 'Só tem Bane se escolher o Flaw Clan Curse.' },
    compulsion: { name: 'Sem Compulsão de clã', text: '' },
  },
};

export function clanTraitsFor(clan: string | undefined): ClanTraits | undefined {
  const name = resolveClanName(clan, Object.keys(CLAN_TRAITS));
  return name ? CLAN_TRAITS[name] : undefined;
}
