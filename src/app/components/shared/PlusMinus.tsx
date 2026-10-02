import type { ReactNode } from 'react';

interface PlusMinusProps {
  onMinus: () => void;
  onPlus: () => void;
  children: ReactNode;
}

export function PlusMinus({ onMinus, onPlus, children }: PlusMinusProps) {
  return (
    <>
      <div className="edit-ctrl"><button className="btn-pm" onClick={onMinus}>−</button></div>
      {children}
      <div className="edit-ctrl"><button className="btn-pm" onClick={onPlus}>+</button></div>
    </>
  );
}
