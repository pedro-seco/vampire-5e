import { useEffect, useState } from 'react';
import { DesktopSheet } from './DesktopSheet';
import { MobileSheet } from './MobileSheet';
import { STAGE_WIDTH } from './stage';
import './ankh.css';

const MOBILE_BREAKPOINT = 820;

function useViewportWidth() {
  const [width, setWidth] = useState(() => document.documentElement.clientWidth);
  useEffect(() => {
    const handleResize = () => setWidth(document.documentElement.clientWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

export function AnkhSheet() {
  const width = useViewportWidth();
  if (width <= MOBILE_BREAKPOINT) return <MobileSheet />;
  return <DesktopSheet scale={Math.min(1, width / STAGE_WIDTH)} />;
}
