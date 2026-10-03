import { CLAN_TRAITS } from './clanTraits';
import { PREDATOR_TEXTS } from './predators';

export const PROFILE_OPTIONS: Partial<Record<string, string[]>> = {
  clan: Object.keys(CLAN_TRAITS).sort((first, second) => first.localeCompare(second)),
  predatorType: Object.keys(PREDATOR_TEXTS).sort((first, second) => first.localeCompare(second)),
  faction: ['Camarilla', 'Sabbat', 'Anarquistas', 'Independente'],
};
