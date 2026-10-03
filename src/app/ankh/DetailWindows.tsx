import type { CSSProperties, ReactNode } from 'react';
import type { Attributes, SkillKey } from '../types/character';
import { SKILL_LABELS } from '../types/character';
import { advantageReference, attributeReference, powerReference, predatorReference, ritualReference, skillReference } from './references';
import type { PowerReference } from './references';
import { TraitDots } from './TraitDots';

interface WindowFrameProps {
  title: string;
  label: string;
  style?: CSSProperties;
  onClose: () => void;
  children: ReactNode;
}

function WindowFrame({ title, label, style, onClose, children }: WindowFrameProps) {
  return (
    <section className="ankh-window" aria-label={label} style={style}>
      <div className="ankh-window__header">
        <h2 className="ankh-window__title">{title}</h2>
        <button type="button" className="ankh-window__close" aria-label="Fechar" onClick={onClose}>×</button>
      </div>
      {children}
    </section>
  );
}

interface SkillWindowProps {
  skill: SkillKey;
  value: number;
  specialty: string;
  style?: CSSProperties;
  onClose: () => void;
}

export function SkillWindow({ skill, value, specialty, style, onClose }: SkillWindowProps) {
  const reference = skillReference(skill);
  const levelText = value > 0 ? reference.levels[value - 1] : '';

  return (
    <WindowFrame title={SKILL_LABELS[skill]} label="Detalhes da perícia" style={style} onClose={onClose}>
      <div className="ankh-window__meta">
        <TraitDots label={SKILL_LABELS[skill]} value={value} editable={false} />
        <span className="ankh-window__source">{reference.source}</span>
      </div>
      <p className="ankh-window__body">{reference.body}</p>
      {levelText && <p className="ankh-window__level">{'●'.repeat(value)} {levelText}</p>}
      {specialty && (
        <p className="ankh-window__line"><span className="ankh-window__key is-accent">ESPECIALIDADE</span> {specialty}</p>
      )}
      <p className="ankh-window__hint">Specialties: {reference.specialties}</p>
    </WindowFrame>
  );
}

interface PowerWindowProps {
  discipline: string;
  power: string;
  style?: CSSProperties;
  onClose: () => void;
}

function ReferenceBody({ reference }: { reference: PowerReference }) {
  return (
    <>
      <div className="ankh-window__meta">
        <span className="ankh-window__subtitle">{reference.subtitle}</span>
        <span className="ankh-window__source">{reference.source}</span>
      </div>
      {reference.body && <p className="ankh-window__body">{reference.body}</p>}
      <div className="ankh-window__facts">
        {reference.facts.map((fact) => (
          <p key={fact.label} className="ankh-window__line"><span className="ankh-window__key">{fact.label}</span> {fact.value}</p>
        ))}
        {reference.system && <p className="ankh-window__line ankh-window__system"><span className="ankh-window__key">SISTEMA</span> {reference.system}</p>}
      </div>
    </>
  );
}

export function PowerWindow({ discipline, power, style, onClose }: PowerWindowProps) {
  const reference = powerReference(discipline, power);

  return (
    <WindowFrame title={reference.title} label="Detalhes do poder" style={style} onClose={onClose}>
      <ReferenceBody reference={reference} />
    </WindowFrame>
  );
}

export function RitualWindow({ discipline, ritual, style, onClose }: { discipline: string; ritual: string; style?: CSSProperties; onClose: () => void }) {
  const reference = ritualReference(discipline, ritual);

  return (
    <WindowFrame title={reference.title} label="Detalhes do ritual" style={style} onClose={onClose}>
      <ReferenceBody reference={reference} />
    </WindowFrame>
  );
}

export function AttributeWindow({ attribute, label, value, style, onClose }: { attribute: keyof Attributes; label: string; value: number; style?: CSSProperties; onClose: () => void }) {
  const reference = attributeReference(attribute);
  const levelText = reference.levels[value - 1];

  return (
    <WindowFrame title={label} label="Detalhes do atributo" style={style} onClose={onClose}>
      <div className="ankh-window__meta">
        <TraitDots label={label} value={value} min={1} editable={false} />
        <span className="ankh-window__source">{reference.source}</span>
      </div>
      <p className="ankh-window__body">{reference.body}</p>
      {levelText && <p className="ankh-window__level">{'●'.repeat(value)} {levelText}</p>}
    </WindowFrame>
  );
}

export function PredatorWindow({ name, style, onClose }: { name: string; style?: CSSProperties; onClose: () => void }) {
  const reference = predatorReference(name);

  return (
    <WindowFrame title={name} label="Detalhes do predator type" style={style} onClose={onClose}>
      <div className="ankh-window__meta">
        <span className="ankh-window__subtitle">PREDATOR TYPE</span>
        <span className="ankh-window__source">{reference.source}</span>
      </div>
      <p className="ankh-window__body">{reference.body}</p>
      {reference.details.length > 0 && (
        <div className="ankh-window__facts">
          {reference.details.map((detail) => <p key={detail} className="ankh-window__line">{detail}</p>)}
        </div>
      )}
    </WindowFrame>
  );
}

interface AdvantageWindowProps {
  name: string;
  level: number;
  note: string;
  style?: CSSProperties;
  onClose: () => void;
}

export function AdvantageWindow({ name, level, note, style, onClose }: AdvantageWindowProps) {
  const reference = advantageReference(name);

  return (
    <WindowFrame title={name} label="Detalhes da vantagem" style={style} onClose={onClose}>
      <div className="ankh-window__meta">
        <span className="ankh-window__subtitle">{reference.kind}</span>
        <span className="ankh-window__source">{reference.source}</span>
      </div>
      <p className="ankh-window__body">{reference.body}</p>
      {reference.levels.length > 0 && (
        <div className="ankh-window__facts">
          {reference.levels.map((entry) => <p key={entry} className="ankh-window__line">{entry}</p>)}
        </div>
      )}
      {note && <p className="ankh-window__line"><span className="ankh-window__key is-accent">NOTA</span> {note}</p>}
      <p className="ankh-window__hint">Nível na ficha: {'●'.repeat(level)}</p>
    </WindowFrame>
  );
}

export function FormWindow({ title, style, onClose, children }: { title: string; style?: CSSProperties; onClose: () => void; children: ReactNode }) {
  return (
    <WindowFrame title={title} label={title} style={style} onClose={onClose}>
      {children}
    </WindowFrame>
  );
}
