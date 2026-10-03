import { useId } from 'react';
import { ANKH_HOLE_PATH, ANKH_PATH } from './geometry';
import { ANKH_TRANSFORM, PORTRAIT_RECT } from './stage';
import type { Rect } from './backdrops';

interface AnkhArtProps {
  backdropUrl: string;
  backdropRect: Rect;
  portrait?: string;
  showLoop?: boolean;
}

const OUTLINE_COLOR = '#0c0a0a';

function safeId(raw: string) {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '');
}

export function AnkhArt({ backdropUrl, backdropRect, portrait, showLoop = true }: AnkhArtProps) {
  const prefix = safeId(useId());
  const shapeId = `${prefix}-shape`;
  const clipId = `${prefix}-clip`;
  const holeId = `${prefix}-hole`;

  return (
    <>
      <defs>
        <path id={shapeId} transform={ANKH_TRANSFORM} fillRule="evenodd" clipRule="evenodd" d={ANKH_PATH} />
        <clipPath id={clipId}><use href={`#${shapeId}`} /></clipPath>
        <clipPath id={holeId}><path transform={ANKH_TRANSFORM} d={ANKH_HOLE_PATH} /></clipPath>
      </defs>

      {showLoop && portrait && (
        <image
          href={portrait}
          x={PORTRAIT_RECT.x}
          y={PORTRAIT_RECT.y}
          width={PORTRAIT_RECT.width}
          height={PORTRAIT_RECT.height}
          preserveAspectRatio="xMidYMin slice"
          clipPath={`url(#${holeId})`}
        />
      )}

      <g clipPath={`url(#${clipId})`}>
        <image
          href={backdropUrl}
          x={backdropRect.x}
          y={backdropRect.y}
          width={backdropRect.width}
          height={backdropRect.height}
          preserveAspectRatio="none"
        />
      </g>
      <use href={`#${shapeId}`} fill="none" stroke={OUTLINE_COLOR} strokeWidth={3} />
    </>
  );
}
