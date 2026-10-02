import { useId } from 'react';
import { ANKH_HOLE_PATH, ANKH_PATH } from './geometry';
import { CLAN_ICON_PATHS } from './clanIcons';
import { ANKH_TRANSFORM, CLAN_ICON_RECT, PORTRAIT_RECT } from './stage';
import type { Rect } from './backdrops';

interface AnkhArtProps {
  backdropUrl: string;
  backdropRect: Rect;
  portrait?: string;
  clan?: string;
  showLoop?: boolean;
}

const ICON_COLOR = '#7a0d14';
const OUTLINE_COLOR = '#0c0a0a';

function safeId(raw: string) {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '');
}

const CLAN_ALIASES: Record<string, string> = { 'sangue fraco': 'Thin-blood', 'thin blood': 'Thin-blood', setita: 'Ministry', 'banu': 'Banu Haqim' };

const normalize = (text: string) => text.toLowerCase().replace(/-/g, ' ').trim();

function clanIconPath(clan: string | undefined): string | undefined {
  if (!clan) return undefined;
  const name = normalize(clan);
  const alias = Object.keys(CLAN_ALIASES).find((key) => name.includes(key));
  if (alias) return CLAN_ICON_PATHS[CLAN_ALIASES[alias]];
  const key = Object.keys(CLAN_ICON_PATHS).find((candidate) => name.includes(normalize(candidate)));
  return key ? CLAN_ICON_PATHS[key] : undefined;
}

function ClanMark({ clan }: { clan?: string }) {
  const path = clanIconPath(clan);
  if (!path) return null;
  const scale = CLAN_ICON_RECT.size / 512;
  return <path transform={`translate(${CLAN_ICON_RECT.x} ${CLAN_ICON_RECT.y}) scale(${scale})`} d={path} fill={ICON_COLOR} />;
}

export function AnkhArt({ backdropUrl, backdropRect, portrait, clan, showLoop = true }: AnkhArtProps) {
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
      {showLoop && !portrait && <ClanMark clan={clan} />}

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
