import type { ReactNode } from 'react';
import advantagesData from '../data/advantages.json';
import { useCharacter } from '../context/CharacterContext';
import { useConfirm } from '../context/ConfirmContext';
import { SKILL_LABELS } from '../types/character';
import type { AdvantageDef, Attributes, Character, SkillKey } from '../types/character';
import { Editable } from '../components/shared/Editable';
import { clamp } from '../components/shared/clamp';
import { RemoveButton } from './SectionTitle';
import { TraitDots } from './TraitDots';
import { describePool } from './poolText';

export type Side = 'left' | 'right';

type ProfileField = 'clan' | 'predatorType' | 'faction' | 'embrace' | 'sire' | 'languages';

const DEFAULT_ADVANTAGE_MAX = 5;

function advantageMax(name: string): number {
  const definition = (advantagesData as AdvantageDef[]).find((advantage) => advantage.name === name);
  return definition?.maxLevel || DEFAULT_ADVANTAGE_MAX;
}

const listOf = (character: Character, kind: 'advantage' | 'flaw') => (kind === 'flaw' ? character.flaws : character.advantages);

function Ordered({ side, dots, children }: { side: Side; dots: ReactNode; children: ReactNode }) {
  return side === 'left' ? <>{children}{dots}</> : <>{dots}{children}</>;
}

export function AttributeItem({ attribute, label, side }: { attribute: keyof Attributes; label: string; side: Side }) {
  const { character, editMode, update } = useCharacter();
  const setValue = (value: number) => update((draft) => { draft.attributes[attribute] = clamp(value, 1, 5); });

  return (
    <Ordered side={side} dots={<TraitDots label={label} value={character.attributes[attribute]} min={1} editable={editMode} onChange={setValue} />}>
      <span className="ankh-trait">{label}</span>
    </Ordered>
  );
}

interface SkillItemProps {
  skill: SkillKey;
  side: Side;
  selected: boolean;
  onSelect: () => void;
}

export function SkillItem({ skill, side, selected, onSelect }: SkillItemProps) {
  const { character, editMode, update } = useCharacter();
  const { value, specialty } = character.skills[skill] || { value: 0, specialty: '' };

  const setValue = (next: number) =>
    update((draft) => {
      draft.skills[skill].value = clamp(next, 0, 5);
      if (draft.skills[skill].value === 0) draft.skills[skill].specialty = '';
    });
  const setSpecialty = (text: string) => update((draft) => { draft.skills[skill].specialty = text; });

  const showSpecialty = value > 0 && (editMode || specialty);

  return (
    <span className={'ankh-skill' + (value === 0 && !selected ? ' is-zero' : '')}>
      <Ordered side={side} dots={<TraitDots label={SKILL_LABELS[skill]} value={value} editable={editMode} onChange={setValue} />}>
        <button type="button" className={'ankh-link' + (selected ? ' is-selected' : '')} aria-pressed={selected} onClick={onSelect}>
          {SKILL_LABELS[skill]}
        </button>
        {showSpecialty && (
          <Editable className="ankh-note" value={specialty} editable={editMode} onCommit={setSpecialty} placeholder="especialidade" />
        )}
      </Ordered>
    </span>
  );
}

export function CharacterName() {
  const { character, editMode, update } = useCharacter();
  return (
    <Editable className="ankh-character-name" value={character.name} editable={editMode} maxLength={50} onCommit={(name) => update((draft) => { draft.name = name; })} />
  );
}

export function CharacterAliases() {
  const { character, editMode, update } = useCharacter();
  return (
    <Editable
      className="ankh-aliases"
      value={character.aliases}
      editable={editMode}
      maxLength={80}
      placeholder={editMode ? 'apelidos' : undefined}
      onCommit={(aliases) => update((draft) => { draft.aliases = aliases; })}
    />
  );
}

export function ProfileFieldItem({ field, label }: { field: ProfileField; label: string }) {
  const { character, editMode, update } = useCharacter();
  return (
    <>
      <span className="ankh-field-label ankh-field-label--fixed">{label}</span>
      <Editable className="ankh-field-value" value={character[field]} editable={editMode} maxLength={60} placeholder={editMode ? '—' : undefined} onCommit={(value) => update((draft) => { draft[field] = value; })} />
    </>
  );
}

export function XpItem() {
  const { character, update } = useCharacter();
  const toNumberText = (text: string) => String(Math.max(0, parseInt(text, 10) || 0));

  return (
    <span className="ankh-xp">
      <span className="ankh-field-label">XP</span>
      <label className="ankh-xp__box">
        <span className="ankh-xp__caption">total</span>
        <input type="number" min="0" defaultValue={character.xpTotal} key={'total' + character.id} onBlur={(event) => update((draft) => { draft.xpTotal = toNumberText(event.target.value); })} />
      </label>
      <label className="ankh-xp__box">
        <span className="ankh-xp__caption">gasto</span>
        <input type="number" min="0" defaultValue={character.xpSpent} key={'spent' + character.id} onBlur={(event) => update((draft) => { draft.xpSpent = toNumberText(event.target.value); })} />
      </label>
    </span>
  );
}

interface DisciplineItemProps {
  index: number;
  side: Side;
  onAddPower: () => void;
}

export function DisciplineItem({ index, side, onAddPower }: DisciplineItemProps) {
  const { character, editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();
  const discipline = character.disciplines[index];

  const setLevel = (level: number) => update((draft) => { draft.disciplines[index].level = clamp(level, 1, 5); });
  const remove = () =>
    confirmDelete('Remove discipline "' + discipline.name + '" and all its powers?', () => update((draft) => { draft.disciplines.splice(index, 1); }));

  return (
    <Ordered side={side} dots={<TraitDots label={discipline.name} value={discipline.level} min={1} editable={editMode} onChange={setLevel} />}>
      <span className="ankh-trait">{discipline.name}</span>
      {editMode && (
        <>
          <button type="button" className="ankh-inline-action" onClick={onAddPower}>＋ poder</button>
          <RemoveButton label={'Remover ' + discipline.name} onClick={remove} />
        </>
      )}
    </Ordered>
  );
}

interface PowerItemProps {
  disciplineIndex: number;
  powerIndex: number;
  selected: boolean;
  onSelect: () => void;
}

export function PowerItem({ disciplineIndex, powerIndex, selected, onSelect }: PowerItemProps) {
  const { character, editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();
  const power = character.disciplines[disciplineIndex].powers[powerIndex];

  const remove = () =>
    confirmDelete('Remove power "' + power + '"?', () => update((draft) => { draft.disciplines[disciplineIndex].powers.splice(powerIndex, 1); }));

  return (
    <>
      <button type="button" className={'ankh-link ankh-power' + (selected ? ' is-selected' : '')} aria-pressed={selected} onClick={onSelect}>
        {power}
      </button>
      {editMode && <RemoveButton label={'Remover ' + power} onClick={remove} />}
    </>
  );
}

export function AdvantageItem({ kind, index, side }: { kind: 'advantage' | 'flaw'; index: number; side: Side }) {
  const { character, editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();
  const item = listOf(character, kind)[index];

  const setLevel = (level: number) => update((draft) => { listOf(draft, kind)[index].level = clamp(level, 1, advantageMax(item.name)); });
  const setNote = (note: string) => update((draft) => { listOf(draft, kind)[index].note = note; });
  const remove = () => confirmDelete('Remove "' + item.name + '"?', () => update((draft) => { listOf(draft, kind).splice(index, 1); }));

  return (
    <Ordered side={side} dots={<TraitDots label={item.name} value={item.level} max={advantageMax(item.name)} min={1} editable={editMode} onChange={setLevel} />}>
      <span className={kind === 'flaw' ? 'ankh-trait is-flaw' : 'ankh-trait'}>{item.name}</span>
      {(item.note || editMode) && (
        <Editable className="ankh-note" value={item.note} editable={editMode} placeholder="nota" onCommit={setNote} />
      )}
      {editMode && <RemoveButton label={'Remover ' + item.name} onClick={remove} />}
    </Ordered>
  );
}

export function InventoryItem({ index }: { index: number }) {
  const { character, editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();
  const item = character.inventory[index];

  const rename = (text: string) => update((draft) => { draft.inventory[index] = text; });
  const remove = () => confirmDelete('Remove "' + item + '" from inventory?', () => update((draft) => { draft.inventory.splice(index, 1); }));

  return (
    <>
      <Editable className="ankh-text" value={item} editable={editMode} onCommit={rename} />
      {editMode && <RemoveButton label={'Remover ' + item} onClick={remove} />}
    </>
  );
}

export function PoolItem({ index }: { index: number }) {
  const { character, editMode, update } = useCharacter();
  const pool = character.pools[index];
  const remove = () => update((draft) => { draft.pools.splice(index, 1); });

  return (
    <>
      <span className="ankh-text"><span className="ankh-text__strong">{pool.title || 'Pool'}</span> — {describePool(character, pool)}</span>
      {editMode && <RemoveButton label={'Remover ' + (pool.title || 'pool')} onClick={remove} />}
    </>
  );
}
