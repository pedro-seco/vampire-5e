import type { FocusEvent } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { SKILL_GROUPS, SKILL_LABELS } from '../../types/character';
import type { Attributes, SkillKey } from '../../types/character';
import { clamp } from '../shared/clamp';
import { PlusMinus } from '../shared/PlusMinus';

type Group = 'physical' | 'social' | 'mental';

const GROUP_TITLES: Record<Group, string> = { physical: 'Physical', social: 'Social', mental: 'Mental' };

const ATTRIBUTES: Record<Group, { key: keyof Attributes; label: string }[]> = {
  physical: [
    { key: 'strength', label: 'Strength' },
    { key: 'dexterity', label: 'Dexterity' },
    { key: 'stamina', label: 'Stamina' },
  ],
  social: [
    { key: 'charisma', label: 'Charisma' },
    { key: 'manipulation', label: 'Manipulation' },
    { key: 'composure', label: 'Composure' },
  ],
  mental: [
    { key: 'intelligence', label: 'Intelligence' },
    { key: 'wits', label: 'Wits' },
    { key: 'resolve', label: 'Resolve' },
  ],
};

const SPECIALTY_PLACEHOLDER = '+ specialty';
const EMPTY_SKILL = { value: 0, specialty: '' };

function SpecialtyField({ skill }: { skill: SkillKey }) {
  const { character, editMode, update } = useCharacter();
  const specialty = character.skills[skill]?.specialty || '';

  const clearPlaceholder = (event: FocusEvent<HTMLSpanElement>) => {
    const text = event.currentTarget.textContent || '';
    if (!text.trim() || text === SPECIALTY_PLACEHOLDER) event.currentTarget.textContent = '';
  };

  const commit = (event: FocusEvent<HTMLSpanElement>) => {
    const text = (event.currentTarget.textContent || '').trim();
    if (text === specialty) {
      event.currentTarget.textContent = specialty || SPECIALTY_PLACEHOLDER;
      return;
    }
    update((draft) => { draft.skills[skill].specialty = text; });
  };

  return (
    <span
      key={specialty}
      className="skill-spec edit-ctrl"
      contentEditable={editMode}
      suppressContentEditableWarning
      style={{ color: specialty ? '' : 'var(--txt-e)' }}
      onFocus={clearPlaceholder}
      onBlur={commit}
    >
      {specialty || SPECIALTY_PLACEHOLDER}
    </span>
  );
}

function SkillRow({ skill }: { skill: SkillKey }) {
  const { character, editMode, update } = useCharacter();
  const { value, specialty } = character.skills[skill] || EMPTY_SKILL;
  const isZero = value === 0;
  const zeroClass = isZero ? ' zero' : '';

  const changeBy = (delta: number) => {
    if (!editMode) return;
    update((draft) => {
      const entry = draft.skills[skill];
      entry.value = clamp(entry.value + delta, 0, 5);
      if (entry.value === 0) entry.specialty = '';
    });
  };

  return (
    <div className="skill-row" data-key={skill}>
      <div className="skill-left">
        <span className={'skill-name' + zeroClass}>{SKILL_LABELS[skill]}</span>
        {!isZero && specialty && <span className="skill-spec">({specialty})</span>}
        {!isZero && <SpecialtyField skill={skill} />}
      </div>
      <PlusMinus onMinus={() => changeBy(-1)} onPlus={() => changeBy(1)}>
        <span className={'skill-val' + zeroClass}>{isZero ? '' : value}</span>
      </PlusMinus>
    </div>
  );
}

function AttributeRow({ attribute, label }: { attribute: keyof Attributes; label: string }) {
  const { character, editMode, update } = useCharacter();

  const changeBy = (delta: number) => {
    if (!editMode) return;
    update((draft) => { draft.attributes[attribute] = clamp(draft.attributes[attribute] + delta, 1, 5); });
  };

  return (
    <div className="attr-row">
      <span className="attr-name">{label}</span>
      <PlusMinus onMinus={() => changeBy(-1)} onPlus={() => changeBy(1)}>
        <span className="attr-val" id={'attr-' + attribute}>{character.attributes[attribute]}</span>
      </PlusMinus>
    </div>
  );
}

export function AttributeColumn({ group }: { group: Group }) {
  return (
    <div className="col">
      <div className="sh">{GROUP_TITLES[group]}</div>
      <div className="col-title">Attributes</div>
      {ATTRIBUTES[group].map(({ key, label }) => (
        <AttributeRow key={key} attribute={key} label={label} />
      ))}

      <div className="sk-div">
        <div className="sh" style={{ marginBottom: 4 }}>Skills <span className="sh-tip">(specialty)</span></div>
        <div id={'skills-' + group}>
          {SKILL_GROUPS[group].map((skill) => <SkillRow key={skill} skill={skill} />)}
        </div>
      </div>
    </div>
  );
}
