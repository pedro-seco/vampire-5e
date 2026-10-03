import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useCharacter } from '../context/CharacterContext';

const PAGE_WIDTH_PX = 794;
const PAGE_HEIGHT_PX = 1120;
const MAX_ATTEMPTS = 8;
const SAFETY_FACTOR = 0.99;

export function FitPage({ className, children }: { className: string; children: ReactNode }) {
  const { character } = useCharacter();
  const content = useRef<HTMLDivElement>(null);

  const fit = useCallback(() => {
    const element = content.current;
    if (!element) return;
    element.style.minHeight = '0';
    element.style.zoom = '1';
    let zoom = 1;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      element.style.width = `${PAGE_WIDTH_PX / zoom}px`;
      const visualHeight = element.getBoundingClientRect().height * zoom;
      if (visualHeight <= PAGE_HEIGHT_PX) break;
      zoom *= (PAGE_HEIGHT_PX / visualHeight) * SAFETY_FACTOR;
    }
    element.style.zoom = String(zoom);
    element.style.minHeight = `${PAGE_HEIGHT_PX / zoom}px`;
  }, []);

  useLayoutEffect(() => {
    fit();
    document.fonts?.ready.then(fit);
  }, [character, fit]);

  useEffect(() => {
    window.addEventListener('beforeprint', fit);
    return () => window.removeEventListener('beforeprint', fit);
  }, [fit]);

  return (
    <div className={'print-page ' + className}>
      <div ref={content} className="print-fit">{children}</div>
    </div>
  );
}
