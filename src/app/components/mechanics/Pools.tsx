import { useEffect, useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { SKILL_GROUPS, SKILL_LABELS } from '../../types/character';
import type { Attributes, Character, Pool, SkillKey } from '../../types/character';

type PoolRecipe = Omit<Pool, 'title'>;

const EMPTY_FORM: Pool = { title: '', attr: '', skill: '', specialty: '', disc: '' };
const SKILL_GROUP_ORDER = ['physical', 'social', 'mental'] as const;

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

function describePool(character: Character, pool: PoolRecipe): string {
  const parts: string[] = [];
  let total = 0;
  const add = (label: string, dice: number) => {
    parts.push(`${label} (${dice})`);
    total += dice;
  };

  const attribute = character.attributes[pool.attr as keyof Attributes];
  if (pool.attr && attribute !== undefined) add(capitalize(pool.attr), attribute);

  const skill = character.skills[pool.skill as SkillKey];
  if (pool.skill && skill) add(SKILL_LABELS[pool.skill as SkillKey] || pool.skill, skill.value);

  if (pool.specialty) {
    parts.push(pool.specialty + ' (+1)');
    total += 1;
  }

  const discipline = (character.disciplines || []).find((entry) => entry.name === pool.disc);
  if (pool.disc && discipline?.level) add(pool.disc, discipline.level);

  return parts.length ? parts.join(' + ') + ' = ' + total : '—';
}

function PoolForm({ onClose }: { onClose: () => void }) {
  const { character, update } = useCharacter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState(false);

  const setField = (field: keyof Pool) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (field !== 'title') setTouched(true);
  };

  const save = () => {
    if (!form.attr || !form.skill) {
      alert('Atributo e Skill são obrigatórios.');
      return;
    }
    const pool: Pool = { ...form, title: form.title.trim() || 'Pool', specialty: form.specialty.trim() };
    update((draft) => {
      if (!draft.pools) draft.pools = [];
      draft.pools.push(pool);
    });
    onClose();
  };

  const preview = touched ? describePool(character, { ...form, specialty: form.specialty.trim() }) : '';

  return (
    <>
      <input type="text" className="pool-field" placeholder="Título…" value={form.title} onChange={(event) => setField('title')(event.target.value)} />

      <select className="pool-field" value={form.attr} onChange={(event) => setField('attr')(event.target.value)}>
        <option value="">— Atributo —</option>
        {(Object.keys(character.attributes) as (keyof Attributes)[]).map((key) => (
          <option key={key} value={key}>{capitalize(key)} ({character.attributes[key]})</option>
        ))}
      </select>

      <select className="pool-field" value={form.skill} onChange={(event) => setField('skill')(event.target.value)}>
        <option value="">— Skill —</option>
        {SKILL_GROUP_ORDER.map((group) => (
          <optgroup key={group} label={capitalize(group)}>
            {SKILL_GROUPS[group].map((key) => (
              <option key={key} value={key}>{SKILL_LABELS[key]} ({character.skills[key]?.value ?? 0})</option>
            ))}
          </optgroup>
        ))}
      </select>

      <input
        type="text"
        className="pool-field"
        placeholder="Especialidade (opcional, +1)"
        value={form.specialty}
        onChange={(event) => setField('specialty')(event.target.value)}
      />

      <select className="pool-field" value={form.disc} onChange={(event) => setField('disc')(event.target.value)}>
        <option value="">— Disciplina (opcional) —</option>
        {(character.disciplines || []).map((discipline) => (
          <option key={discipline.name} value={discipline.name}>{discipline.name} ({discipline.level})</option>
        ))}
      </select>

      <div className="pool-preview">{preview}</div>
      <div className="pool-form-btns">
        <button className="btn-sm" onClick={save}>Adicionar</button>
        <button className="btn-sm" onClick={onClose}>Cancelar</button>
      </div>
    </>
  );
}

export function Pools() {
  const { character, editMode, update } = useCharacter();
  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!editMode) setFormOpen(false);
  }, [editMode]);

  const openForm = () => {
    if (!editMode) return;
    setFormKey((key) => key + 1);
    setFormOpen(true);
  };

  const removePool = (index: number) => update((draft) => { draft.pools.splice(index, 1); });

  return (
    <div className="mech-card pools-card">
      <div className="sh">🎲 Cola para dados <button className="sh-add" onClick={openForm}>＋</button></div>

      <div id="pools-list">
        {(character.pools || []).map((pool, index) => (
          <div className="pool-entry" key={index}>
            <div className="pool-entry-title">{pool.title || 'Pool'}</div>
            <div className="pool-entry-formula">
              <span>{describePool(character, pool)}</span>
              <button className="pool-del edit-ctrl" title="Remover" onClick={() => removePool(index)}>✕</button>
            </div>
          </div>
        ))}
      </div>

      <div className="pool-add-form" style={formOpen ? undefined : { display: 'none' }}>
        <PoolForm key={formKey} onClose={() => setFormOpen(false)} />
      </div>
    </div>
  );
}
