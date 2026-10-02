import { useEffect, useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { SKILL_GROUPS, SKILL_LABELS } from '../../types/character';
import type { Attributes, Character, Pool, SkillKey } from '../../types/character';

const attrLabel = (k: string) => k.charAt(0).toUpperCase() + k.slice(1);

/** "Strength (2) + Brawl (3) + Potence (1) = 6" — legacy _poolFormula(). */
function poolFormula(c: Character, p: Omit<Pool, 'title'>): string {
  const parts: string[] = [];
  let total = 0;

  const attrVal = c.attributes[p.attr as keyof Attributes];
  if (p.attr && attrVal !== undefined) {
    parts.push(attrLabel(p.attr) + ' (' + attrVal + ')');
    total += attrVal;
  }
  const sk = c.skills[p.skill as SkillKey];
  if (p.skill && sk) {
    parts.push((SKILL_LABELS[p.skill as SkillKey] || p.skill) + ' (' + sk.value + ')');
    total += sk.value;
  }
  if (p.specialty) {
    parts.push(p.specialty + ' (+1)');
    total += 1;
  }
  if (p.disc) {
    const d = (c.disciplines || []).find((dd) => dd.name === p.disc);
    const v = d ? d.level : 0;
    if (v) { parts.push(p.disc + ' (' + v + ')'); total += v; }
  }

  if (!parts.length) return '—';
  return parts.join(' + ') + ' = ' + total;
}

const EMPTY_FORM = { title: '', attr: '', skill: '', specialty: '', disc: '' };

export function Pools() {
  const { character: c, editMode, update } = useCharacter();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState(false);

  // Leaving edit mode hides the add form.
  useEffect(() => { if (!editMode) setFormOpen(false); }, [editMode]);

  const openForm = () => {
    if (!editMode) return;
    setForm(EMPTY_FORM);
    setTouched(false);
    setFormOpen(true);
  };

  const set = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (field !== 'title') setTouched(true);
  };

  const save = () => {
    if (!form.attr || !form.skill) { alert('Atributo e Skill são obrigatórios.'); return; }
    const p: Pool = { ...form, title: form.title.trim() || 'Pool', specialty: form.specialty.trim() };
    update((d) => { if (!d.pools) d.pools = []; d.pools.push(p); });
    setFormOpen(false);
  };

  return (
    <div className="mech-card pools-card">
      <div className="sh">🎲 Cola para dados <button className="sh-add" onClick={openForm}>＋</button></div>
      <div id="pools-list">
        {(c.pools || []).map((p, i) => (
          <div className="pool-entry" key={i}>
            <div className="pool-entry-title">{p.title || 'Pool'}</div>
            <div className="pool-entry-formula">
              <span>{poolFormula(c, p)}</span>
              <button className="pool-del edit-ctrl" title="Remover" onClick={() => update((d) => { d.pools.splice(i, 1); })}>✕</button>
            </div>
          </div>
        ))}
      </div>
      <div className="pool-add-form" style={formOpen ? undefined : { display: 'none' }}>
        <input type="text" className="pool-field" placeholder="Título…" value={form.title} onChange={(e) => set('title', e.target.value)} />
        <select className="pool-field" value={form.attr} onChange={(e) => set('attr', e.target.value)}>
          <option value="">— Atributo —</option>
          {Object.keys(c.attributes).map((k) => (
            <option key={k} value={k}>{attrLabel(k)} ({c.attributes[k as keyof Attributes]})</option>
          ))}
        </select>
        <select className="pool-field" value={form.skill} onChange={(e) => set('skill', e.target.value)}>
          <option value="">— Skill —</option>
          {(['physical', 'social', 'mental'] as const).map((grp) => (
            <optgroup key={grp} label={attrLabel(grp)}>
              {SKILL_GROUPS[grp].map((k) => (
                <option key={k} value={k}>{SKILL_LABELS[k]} ({(c.skills[k] || { value: 0 }).value})</option>
              ))}
            </optgroup>
          ))}
        </select>
        <input
          type="text"
          className="pool-field"
          placeholder="Especialidade (opcional, +1)"
          value={form.specialty}
          onChange={(e) => set('specialty', e.target.value)}
        />
        <select className="pool-field" value={form.disc} onChange={(e) => set('disc', e.target.value)}>
          <option value="">— Disciplina (opcional) —</option>
          {(c.disciplines || []).map((d) => (
            <option key={d.name} value={d.name}>{d.name} ({d.level})</option>
          ))}
        </select>
        <div className="pool-preview">{touched ? poolFormula(c, { ...form, specialty: form.specialty.trim() }) : ''}</div>
        <div className="pool-form-btns">
          <button className="btn-sm" onClick={save}>Adicionar</button>
          <button className="btn-sm" onClick={() => setFormOpen(false)}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
