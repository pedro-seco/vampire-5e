import { useState } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { SKILL_GROUPS, SKILL_LABELS } from '../types/character';
import type { Attributes, Pool } from '../types/character';
import { describePool } from './poolText';

const EMPTY_FORM: Pool = { title: '', attr: '', skill: '', specialty: '', disc: '' };
const SKILL_GROUP_ORDER = ['physical', 'social', 'mental'] as const;

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function PoolForm({ onClose }: { onClose: () => void }) {
  const { character, update } = useCharacter();
  const [form, setForm] = useState(EMPTY_FORM);

  const setField = (field: keyof Pool) => (value: string) => setForm((current) => ({ ...current, [field]: value }));

  const save = () => {
    if (!form.attr || !form.skill) return;
    const pool: Pool = { ...form, title: form.title.trim() || 'Pool', specialty: form.specialty.trim() };
    update((draft) => {
      if (!draft.pools) draft.pools = [];
      draft.pools.push(pool);
    });
    onClose();
  };

  const isComplete = Boolean(form.attr && form.skill);

  return (
    <div className="ankh-form">
      <label className="ankh-form__field">
        <span className="ankh-field-label">TÍTULO</span>
        <input type="text" value={form.title} placeholder="Strike, Stealth…" onChange={(event) => setField('title')(event.target.value)} />
      </label>
      <label className="ankh-form__field">
        <span className="ankh-field-label">ATRIBUTO</span>
        <select value={form.attr} onChange={(event) => setField('attr')(event.target.value)}>
          <option value="">—</option>
          {(Object.keys(character.attributes) as (keyof Attributes)[]).map((key) => (
            <option key={key} value={key}>{capitalize(key)} ({character.attributes[key]})</option>
          ))}
        </select>
      </label>
      <label className="ankh-form__field">
        <span className="ankh-field-label">SKILL</span>
        <select value={form.skill} onChange={(event) => setField('skill')(event.target.value)}>
          <option value="">—</option>
          {SKILL_GROUP_ORDER.map((group) => (
            <optgroup key={group} label={capitalize(group)}>
              {SKILL_GROUPS[group].map((key) => (
                <option key={key} value={key}>{SKILL_LABELS[key]} ({character.skills[key]?.value ?? 0})</option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <label className="ankh-form__field">
        <span className="ankh-field-label">ESPECIALIDADE (+1)</span>
        <input type="text" value={form.specialty} onChange={(event) => setField('specialty')(event.target.value)} />
      </label>
      <label className="ankh-form__field">
        <span className="ankh-field-label">DISCIPLINA</span>
        <select value={form.disc} onChange={(event) => setField('disc')(event.target.value)}>
          <option value="">—</option>
          {(character.disciplines || []).map((discipline) => (
            <option key={discipline.name} value={discipline.name}>{discipline.name} ({discipline.level})</option>
          ))}
        </select>
      </label>
      <p className="ankh-form__preview">{describePool(character, { ...form, specialty: form.specialty.trim() })}</p>
      <div className="ankh-form__actions">
        <button type="button" className="ankh-button" onClick={save} disabled={!isComplete}>Adicionar</button>
        <button type="button" className="ankh-button is-quiet" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
