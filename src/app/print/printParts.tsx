import { range } from '../components/shared/range';

export type BoxMark = 'filled' | 'superficial' | 'aggravated' | 'stain';

const DAMAGE_MARKS: (BoxMark | undefined)[] = [undefined, 'superficial', 'aggravated'];
const DOT_MAX = 5;

export function Dots({ value, max = DOT_MAX }: { value: number; max?: number }) {
  return <span className="print-dots">{'●'.repeat(value)}{'○'.repeat(Math.max(0, max - value))}</span>;
}

export function Box({ mark }: { mark?: BoxMark }) {
  return (
    <svg className="print-box" viewBox="0 0 26 26" aria-hidden="true">
      <rect x="1" y="1" width="24" height="24" fill={mark === 'filled' ? '#000' : '#fff'} stroke="#000" strokeWidth="2" />
      {(mark === 'superficial' || mark === 'stain') && <path d="M6 20 L20 6" stroke="#000" strokeWidth="2.4" />}
      {mark === 'aggravated' && <path d="M6 6 L20 20 M20 6 L6 20" stroke="#000" strokeWidth="2.4" />}
    </svg>
  );
}

export function DamageBoxes({ size, states }: { size: number; states: number[] }) {
  return <>{range(size).map((box) => <Box key={box} mark={DAMAGE_MARKS[states[box] || 0]} />)}</>;
}
