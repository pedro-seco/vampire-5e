import type { CSSProperties, ReactNode } from 'react';
import type { SkillKey } from '../types/character';
import { SKILL_LABELS } from '../types/character';
import { powerReference, skillReference } from './references';
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
  const levelText = reference.levels && value > 0 ? reference.levels[value - 1] : '';

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

export function PowerWindow({ discipline, power, style, onClose }: PowerWindowProps) {
  const reference = powerReference(discipline, power);

  return (
    <WindowFrame title={reference.title} label="Detalhes do poder" style={style} onClose={onClose}>
      <div className="ankh-window__meta">
        <span className="ankh-window__subtitle">{reference.subtitle}</span>
        <span className="ankh-window__source">{reference.source}</span>
      </div>
      <p className="ankh-window__body">{reference.body}</p>
      <div className="ankh-window__facts">
        <p className="ankh-window__line"><span className="ankh-window__key">COST</span> {reference.cost}</p>
        <p className="ankh-window__line"><span className="ankh-window__key">DICE POOL</span> {reference.pool}</p>
        <p className="ankh-window__line"><span className="ankh-window__key">SYSTEM</span> {reference.system}</p>
      </div>
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
