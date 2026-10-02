import { useCharacter } from '../../context/CharacterContext';
import { SKILL_GROUPS, SKILL_LABELS } from '../../types/character';
import type { Attributes, SkillKey } from '../../types/character';

const SPEC_PLACEHOLDER = '+ specialty';

const ATTRS: Record<'physical' | 'social' | 'mental', { key: keyof Attributes; label: string }[]> = {
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

const GROUP_TITLES = { physical: 'Physical', social: 'Social', mental: 'Mental' };

/** The editable specialty next to a skill: shows "+ specialty" in a faint color when empty. */
function SpecialtyField({ skill }: { skill: SkillKey }) {
  const { character, editMode, update } = useCharacter();
  const specialty = character.skills[skill]?.specialty || '';

  return (
    <span
      key={specialty}
      className="skill-spec edit-ctrl"
      contentEditable={editMode}
      suppressContentEditableWarning
      style={{ color: specialty ? '' : 'var(--txt-e)' }}
      onFocus={(e) => {
        const t = e.currentTarget.textContent || '';
        if (!t.trim() || t === SPEC_PLACEHOLDER) e.currentTarget.textContent = '';
      }}
      onBlur={(e) => {
        const next = (e.currentTarget.textContent || '').trim();
        if (next === specialty) {
          e.currentTarget.textContent = specialty || SPEC_PLACEHOLDER;
          return;
        }
        update((d) => { d.skills[skill].specialty = next; });
      }}
    >
      {specialty || SPEC_PLACEHOLDER}
    </span>
  );
}

function SkillRow({ skill }: { skill: SkillKey }) {
  const { character, editMode, update } = useCharacter();
  const sk = character.skills[skill] || { value: 0, specialty: '' };
  const zero = sk.value === 0;

  const change = (delta: number) => {
    if (!editMode) return;
    update((d) => {
      const s = d.skills[skill];
      s.value = Math.max(0, Math.min(5, s.value + delta));
      if (s.value === 0) s.specialty = '';
    });
  };

  return (
    <div className="skill-row" data-key={skill}>
      <div className="skill-left">
        <span className={'skill-name' + (zero ? ' zero' : '')}>{SKILL_LABELS[skill]}</span>
        {!zero && sk.specialty && <span className="skill-spec">({sk.specialty})</span>}
        {!zero && <SpecialtyField skill={skill} />}
      </div>
      <div className="edit-ctrl"><button className="btn-pm" onClick={() => change(-1)}>−</button></div>
      <span className={'skill-val' + (zero ? ' zero' : '')}>{sk.value > 0 ? sk.value : ''}</span>
      <div className="edit-ctrl"><button className="btn-pm" onClick={() => change(1)}>+</button></div>
    </div>
  );
}

export function AttributeColumn({ group }: { group: 'physical' | 'social' | 'mental' }) {
  const { character, editMode, update } = useCharacter();

  const change = (key: keyof Attributes, delta: number) => {
    if (!editMode) return;
    update((d) => { d.attributes[key] = Math.max(1, Math.min(5, d.attributes[key] + delta)); });
  };

  return (
    <div className="col">
      <div className="sh">{GROUP_TITLES[group]}</div>
      <div className="col-title">Attributes</div>
      {ATTRS[group].map((a) => (
        <div className="attr-row" key={a.key}>
          <span className="attr-name">{a.label}</span>
          <div className="edit-ctrl"><button className="btn-pm" onClick={() => change(a.key, -1)}>−</button></div>
          <span className="attr-val" id={'attr-' + a.key}>{character.attributes[a.key]}</span>
          <div className="edit-ctrl"><button className="btn-pm" onClick={() => change(a.key, 1)}>+</button></div>
        </div>
      ))}
      <div className="sk-div">
        <div className="sh" style={{ marginBottom: 4 }}>Skills <span className="sh-tip">(specialty)</span></div>
        <div id={'skills-' + group}>
          {SKILL_GROUPS[group].map((k) => <SkillRow key={k} skill={k} />)}
        </div>
      </div>
    </div>
  );
}
