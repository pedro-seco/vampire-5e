import cassino from './backdrops/cassino.jpg';
import escritorio from './backdrops/escritorio.jpg';
import galeria from './backdrops/galeria.jpg';
import sacada from './backdrops/sacada.jpg';
import terraco from './backdrops/terraco.jpg';

export interface Backdrop {
  id: string;
  label: string;
  url: string;
  width: number;
  height: number;
}

export const BACKDROPS: Backdrop[] = [
  { id: 'terraco', label: 'Terraço', url: terraco, width: 1200, height: 2150 },
  { id: 'cassino', label: 'Cassino', url: cassino, width: 735, height: 919 },
  { id: 'galeria', label: 'Galeria', url: galeria, width: 736, height: 1308 },
  { id: 'sacada', label: 'Sacada', url: sacada, width: 736, height: 1308 },
  { id: 'escritorio', label: 'Escritório', url: escritorio, width: 736, height: 1308 },
];

export const DEFAULT_BACKDROP_ID = 'terraco';

export function backdropFor(id: string | undefined): Backdrop {
  return BACKDROPS.find((backdrop) => backdrop.id === id) || BACKDROPS[0];
}

export const BACKGROUND_ZOOM = 1.03;

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function coverRect(backdrop: Backdrop, box: { width: number; height: number }): Rect {
  const scale = Math.max(box.width / backdrop.width, box.height / backdrop.height) * BACKGROUND_ZOOM;
  const width = backdrop.width * scale;
  const height = backdrop.height * scale;
  return { x: (box.width - width) / 2, y: (box.height - height) / 2, width, height };
}
