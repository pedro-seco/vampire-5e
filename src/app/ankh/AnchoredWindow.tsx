import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

const ROW_OFFSET = 18;
const SCREEN_MARGIN = 16;
const STAGE_TOP_LIMIT = 80;
const STAGE_BOTTOM_MARGIN = 30;
const MIN_HEIGHT = 240;

interface AnchoredWindowProps {
  anchorTop: number;
  left: number;
  stageHeight: number;
  scale: number;
  children: ReactNode;
}

function visibleStageRange(stage: HTMLElement, scale: number) {
  const stageTop = stage.getBoundingClientRect().top;
  const navBottom = document.querySelector('.tabnav')?.getBoundingClientRect().bottom ?? 0;
  return {
    top: (navBottom - stageTop) / scale,
    bottom: (window.innerHeight - stageTop) / scale,
  };
}

export function AnchoredWindow({ anchorTop, left, stageHeight, scale, children }: AnchoredWindowProps) {
  const slot = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<{ top: number; maxHeight?: number }>({ top: anchorTop - ROW_OFFSET });

  useLayoutEffect(() => {
    const element = slot.current;
    const stage = element?.parentElement;
    if (!element || !stage) return;

    const visible = visibleStageRange(stage, scale);
    const highest = Math.max(visible.top + SCREEN_MARGIN / scale, STAGE_TOP_LIMIT);
    const floor = Math.min(visible.bottom - SCREEN_MARGIN / scale, stageHeight - STAGE_BOTTOM_MARGIN);
    const maxHeight = Math.max(floor - highest, MIN_HEIGHT);
    const height = Math.min(element.scrollHeight, maxHeight);
    const top = Math.max(highest, Math.min(anchorTop - ROW_OFFSET, floor - height));

    setPlacement({ top, maxHeight });
  }, [anchorTop, stageHeight, scale]);

  return (
    <div ref={slot} className="ankh-window-slot" style={{ top: placement.top, left, maxHeight: placement.maxHeight }}>
      {children}
    </div>
  );
}
