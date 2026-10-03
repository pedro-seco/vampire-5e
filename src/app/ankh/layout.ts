import type { ReactNode } from 'react';
import type { Attributes } from '../types/character';
import type { Side } from './SheetItems';
import { leftOffsetBeside, rightOffsetBeside } from './stage';

export type RowKind = 'title' | 'group' | 'attribute' | 'skill' | 'power' | 'field' | 'name' | 'aliases' | 'text';

export interface Row {
  key: string;
  side: Side;
  top: number;
  offset: number;
  kind: RowKind;
  content: ReactNode;
}

export const SPACING: Record<RowKind, number> = { title: 50, group: 32, attribute: 40, skill: 28, power: 27, field: 44, name: 66, aliases: 44, text: 29 };
export const GROUP_NUDGE = 8;
export const UPPER_START = 92;
export const LOWER_START = 930;
export const BLOOD_LEFT = 1012;
export const TRACKERS_TOP = 806;
export const STAGE_BOTTOM_ROOM = 90;
export const STAGE_TOP_CROP = 56;

export const ATTRIBUTE_GROUPS: { label: string; attributes: [keyof Attributes, string][] }[] = [
  { label: 'FÍSICOS', attributes: [['strength', 'Strength'], ['dexterity', 'Dexterity'], ['stamina', 'Stamina']] },
  { label: 'SOCIAIS', attributes: [['charisma', 'Charisma'], ['manipulation', 'Manipulation'], ['composure', 'Composure']] },
  { label: 'MENTAIS', attributes: [['intelligence', 'Intelligence'], ['wits', 'Wits'], ['resolve', 'Resolve']] },
];

export const SKILL_GROUP_TITLES = { physical: 'FÍSICAS', social: 'SOCIAIS', mental: 'MENTAIS' } as const;

export const PROFILE_FIELDS = [
  { field: 'clan', label: 'CLÃ' },
  { field: 'predatorType', label: 'PREDATOR' },
  { field: 'faction', label: 'FACÇÃO' },
  { field: 'embrace', label: 'ABRAÇO' },
  { field: 'sire', label: 'SIRE' },
] as const;

export function createColumn(side: Side, start: number) {
  const rows: Row[] = [];
  let top = start;
  const place = side === 'left' ? rightOffsetBeside : leftOffsetBeside;

  const add = (kind: RowKind, key: string, content: ReactNode) => {
    const rowTop = kind === 'group' ? top + GROUP_NUDGE : top;
    rows.push({ key: side + key, side, top: rowTop, offset: place(top), kind, content });
    top += SPACING[kind];
  };

  return { rows, add, bottom: () => top };
}
