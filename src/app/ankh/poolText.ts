import { SKILL_LABELS } from '../types/character';
import type { Attributes, Character, Pool, SkillKey } from '../types/character';

type PoolRecipe = Omit<Pool, 'title'>;

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function describePool(character: Character, pool: PoolRecipe): string {
  const parts: string[] = [];
  let total = 0;
  const add = (label: string, dice: number) => {
    parts.push(label);
    total += dice;
  };

  const attribute = character.attributes[pool.attr as keyof Attributes];
  if (pool.attr && attribute !== undefined) add(capitalize(pool.attr), attribute);

  const skill = character.skills[pool.skill as SkillKey];
  if (pool.skill && skill) add(SKILL_LABELS[pool.skill as SkillKey] || pool.skill, skill.value);

  if (pool.specialty) add(pool.specialty, 1);

  const discipline = (character.disciplines || []).find((entry) => entry.name === pool.disc);
  if (pool.disc && discipline?.level) add(pool.disc, discipline.level);

  return parts.length ? parts.join(' + ') + ' = ' + total : '—';
}
