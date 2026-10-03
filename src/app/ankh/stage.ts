import { ANKH_HALF_WIDTH_START, ANKH_HALF_WIDTH_STEP, ANKH_HALF_WIDTHS } from './geometry';

export const STAGE_WIDTH = 1440;
export const STAGE_MIN_HEIGHT = 1980;
export const STAGE_CENTER = STAGE_WIDTH / 2;
export const TEXT_GAP = 34;
export const BLADE_TIP = 1880;

export const ANKH_TRANSFORM = 'translate(327.18 69.41) scale(1.0588)';

export const PORTRAIT_RECT = { x: 530, y: 182, width: 384, height: 474 };

export function ankhHalfWidthAt(y: number): number {
  const index = Math.round((y - ANKH_HALF_WIDTH_START) / ANKH_HALF_WIDTH_STEP);
  return ANKH_HALF_WIDTHS[Math.max(0, Math.min(ANKH_HALF_WIDTHS.length - 1, index))];
}

const ROW_SAMPLE_OFFSETS = [0, 14, 28];

function halfWidthAcrossRow(top: number): number {
  return Math.max(...ROW_SAMPLE_OFFSETS.map((offset) => ankhHalfWidthAt(top + offset)));
}

export function rightOffsetBeside(top: number): number {
  return Math.round(STAGE_WIDTH - (STAGE_CENTER - halfWidthAcrossRow(top) - TEXT_GAP));
}

export function leftOffsetBeside(top: number): number {
  return Math.round(STAGE_CENTER + halfWidthAcrossRow(top) + TEXT_GAP);
}
