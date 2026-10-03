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
import { RITUAL_DISCIPLINES, powersOf } from '../data/powerCatalog';
import { describePool } from './poolText';
import { PROFILE_OPTIONS } from './profileOptions';

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

interface SelectionProps {
  selected?: boolean;
  onSelect?: () => void;
}

function TraitLabel({ className, selected, onSelect, children }: SelectionProps & { className: string; children: ReactNode }) {
  if (!onSelect) return <span className={className}>{children}</span>;
  return (
    <button type="button" className={`${className} ankh-link${selected ? ' is-selected' : ''}`} aria-pressed={selected} onClick={onSelect}>
      {children}
    </button>
  );
}

export function AttributeItem({ attribute, label, side, selected, onSelect }: { attribute: keyof Attributes; label: string; side: Side } & SelectionProps) {
  const { character, editMode, update } = useCharacter();
  const setValue = (value: number) => update((draft) => { draft.attributes[attribute] = clamp(value, 1, 5); });

  return (
    <Ordered side={side} dots={<TraitDots label={label} value={character.attributes[attribute]} min={1} editable={editMode} onChange={setValue} />}>
      <TraitLabel className="ankh-trait" selected={selected} onSelect={onSelect}>{label}</TraitLabel>
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
  const specialtyField = showSpecialty && (
    <Editable className="ankh-note" value={specialty} editable={editMode} onCommit={setSpecialty} placeholder="especialidade" />
  );

  return (
    <span className={'ankh-skill' + (value === 0 && !selected ? ' is-zero' : '')}>
      <Ordered side={side} dots={<TraitDots label={SKILL_LABELS[skill]} value={value} editable={editMode} onChange={setValue} />}>
        {side === 'left' && specialtyField}
        <button type="button" className={'ankh-link' + (selected ? ' is-selected' : '')} aria-pressed={selected} onClick={onSelect}>
          {SKILL_LABELS[skill]}
        </button>
        {side !== 'left' && specialtyField}
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

export function ProfileFieldItem({ field, label, selected, onSelect }: { field: ProfileField; label: string } & SelectionProps) {
  const { character, editMode, update } = useCharacter();
  const showLink = onSelect && !editMode && character[field];
  const options = PROFILE_OPTIONS[field];
  const setValue = (value: string) => update((draft) => { draft[field] = value; });
  const current = character[field];
  const choices = options && current && !options.includes(current) ? [current, ...options] : options;
  return (
    <>
      <span className="ankh-field-label ankh-field-label--fixed">{label}</span>
      {choices && editMode ? (
        <select className="ankh-select" value={current} aria-label={label} onChange={(event) => setValue(event.target.value)}>
          <option value="">—</option>
          {choices.map((choice) => <option key={choice} value={choice}>{choice}</option>)}
        </select>
      ) : showLink ? (
        <TraitLabel className="ankh-field-value" selected={selected} onSelect={onSelect}>{character[field]}</TraitLabel>
      ) : (
      <Editable className="ankh-field-value" value={character[field]} editable={editMode} maxLength={60} placeholder={editMode ? label.toLowerCase() : undefined} onCommit={(value) => update((draft) => { draft[field] = value; })} />
      )}
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
        <input type="text" inputMode="numeric" pattern="[0-9]*" defaultValue={character.xpTotal} key={'total' + character.id} onBlur={(event) => update((draft) => { draft.xpTotal = toNumberText(event.target.value); })} />
      </label>
      <label className="ankh-xp__box">
        <span className="ankh-xp__caption">gasto</span>
        <input type="text" inputMode="numeric" pattern="[0-9]*" defaultValue={character.xpSpent} key={'spent' + character.id} onBlur={(event) => update((draft) => { draft.xpSpent = toNumberText(event.target.value); })} />
      </label>
    </span>
  );
}

interface DisciplineItemProps {
  index: number;
  side: Side;
  onAddPower: () => void;
  onAddRitual: () => void;
}

export function DisciplineItem({ index, side, onAddPower, onAddRitual }: DisciplineItemProps) {
  const { character, editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();
  const discipline = character.disciplines[index];

  const setLevel = (level: number) => update((draft) => { draft.disciplines[index].level = clamp(level, 1, 5); });
  const ritualKind = RITUAL_DISCIPLINES[discipline.name];
  const hasPowers = powersOf(discipline.name).length > 0;
  const remove = () =>
    confirmDelete('Remover a disciplina "' + discipline.name + '" e todos os seus poderes?', () => update((draft) => { draft.disciplines.splice(index, 1); }));

  return (
    <Ordered side={side} dots={<TraitDots label={discipline.name} value={discipline.level} min={1} editable={editMode} onChange={setLevel} />}>
      <span className="ankh-trait">{discipline.name}</span>
      {editMode && (
        <>
          {hasPowers && <button type="button" className="ankh-inline-action" onClick={onAddPower}>＋ poder</button>}
          {ritualKind && <button type="button" className="ankh-inline-action" onClick={onAddRitual}>＋ {ritualKind.singular}</button>}
          <RemoveButton label={'Remover ' + discipline.name} onClick={remove} />
        </>
      )}
    </Ordered>
  );
}

interface RitualItemProps {
  disciplineIndex: number;
  ritualIndex: number;
  selected: boolean;
  onSelect: () => void;
}

export function RitualItem({ disciplineIndex, ritualIndex, selected, onSelect }: RitualItemProps) {
  const { character, editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();
  const ritual = (character.disciplines[disciplineIndex].rituals ?? [])[ritualIndex];

  const remove = () =>
    confirmDelete('Remover "' + ritual + '"?', () => update((draft) => { draft.disciplines[disciplineIndex].rituals?.splice(ritualIndex, 1); }));

  return (
    <>
      <button type="button" className={'ankh-link ankh-power ankh-ritual' + (selected ? ' is-selected' : '')} aria-pressed={selected} onClick={onSelect}>
        {ritual}
      </button>
      {editMode && <RemoveButton label={'Remover ' + ritual} onClick={remove} />}
    </>
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
    confirmDelete('Remover o poder "' + power + '"?', () => update((draft) => { draft.disciplines[disciplineIndex].powers.splice(powerIndex, 1); }));

  return (
    <>
      <button type="button" className={'ankh-link ankh-power' + (selected ? ' is-selected' : '')} aria-pressed={selected} onClick={onSelect}>
        {power}
      </button>
      {editMode && <RemoveButton label={'Remover ' + power} onClick={remove} />}
    </>
  );
}

export function AdvantageItem({ kind, index, side, selected, onSelect }: { kind: 'advantage' | 'flaw'; index: number; side: Side } & SelectionProps) {
  const { character, editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();
  const item = listOf(character, kind)[index];

  const setLevel = (level: number) => update((draft) => { listOf(draft, kind)[index].level = clamp(level, 1, advantageMax(item.name)); });
  const setNote = (note: string) => update((draft) => { listOf(draft, kind)[index].note = note; });
  const remove = () => confirmDelete('Remover "' + item.name + '"?', () => update((draft) => { listOf(draft, kind).splice(index, 1); }));

  return (
    <Ordered side={side} dots={<TraitDots label={item.name} value={item.level} max={advantageMax(item.name)} min={1} editable={editMode} onChange={setLevel} />}>
      <TraitLabel className={kind === 'flaw' ? 'ankh-trait is-flaw' : 'ankh-trait'} selected={selected} onSelect={onSelect}>{item.name}</TraitLabel>
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
  const remove = () => confirmDelete('Remover "' + item + '" do inventário?', () => update((draft) => { draft.inventory.splice(index, 1); }));

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
