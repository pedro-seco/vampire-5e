interface TraitDotsProps {
  label: string;
  value: number;
  max?: number;
  min?: number;
  editable: boolean;
  onChange?: (value: number) => void;
}

export function TraitDots({ label, value, max = 5, min = 0, editable, onChange }: TraitDotsProps) {
  const dots = Array.from({ length: max }, (_unused, index) => index + 1);

  const choose = (dot: number) => {
    const next = dot === value ? dot - 1 : dot;
    onChange?.(Math.max(min, next));
  };

  if (!editable || !onChange) {
    return (
      <span className="ankh-dots" aria-label={`${label}: ${value} de ${max}`}>
        {dots.map((dot) => <span key={dot} className={dot <= value ? 'is-filled' : ''}>●</span>)}
      </span>
    );
  }

  return (
    <span className="ankh-dots is-editable">
      {dots.map((dot) => (
        <button key={dot} type="button" className={dot <= value ? 'is-filled' : ''} aria-label={`${label}: ${dot}`} onClick={() => choose(dot)}>
          ●
        </button>
      ))}
    </span>
  );
}
