const CLAN_ALIASES: Record<string, string> = { 'sangue fraco': 'Thin-blood', 'thin blood': 'Thin-blood', setita: 'Ministry', banu: 'Banu Haqim' };

const normalize = (text: string) => text.toLowerCase().replace(/-/g, ' ').trim();

export function resolveClanName(clan: string | undefined, knownClans: string[]): string | undefined {
  if (!clan) return undefined;
  const name = normalize(clan);
  const alias = Object.keys(CLAN_ALIASES).find((key) => name.includes(key));
  if (alias) return CLAN_ALIASES[alias];
  return knownClans.find((candidate) => name.includes(normalize(candidate)));
}
