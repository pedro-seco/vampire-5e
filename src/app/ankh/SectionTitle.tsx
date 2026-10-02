import type { ReactNode } from 'react';

function Ornament({ side }: { side: 'left' | 'right' }) {
  if (side === 'left') {
    return (
      <svg className="ankh-ornament" viewBox="0 0 64 14" aria-hidden="true">
        <path d="M0 7 H50" className="ankh-ornament__line" />
        <circle cx="5" cy="7" r="2" className="ankh-ornament__bead" />
        <path d="M57 1 L63 7 L57 13 L51 7 Z" className="ankh-ornament__gem" />
      </svg>
    );
  }
  return (
    <svg className="ankh-ornament" viewBox="0 0 64 14" aria-hidden="true">
      <path d="M14 7 H64" className="ankh-ornament__line" />
      <circle cx="59" cy="7" r="2" className="ankh-ornament__bead" />
      <path d="M7 1 L13 7 L7 13 L1 7 Z" className="ankh-ornament__gem" />
    </svg>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <span className="ankh-title">
      <Ornament side="left" />
      <span className="ankh-title__text">{children}</span>
      <Ornament side="right" />
      {action}
    </span>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button type="button" className="ankh-add" aria-label={label} title={label} onClick={onClick}>＋</button>;
}

export function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button type="button" className="ankh-remove" aria-label={label} title={label} onClick={onClick}>×</button>;
}
