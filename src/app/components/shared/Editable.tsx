import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { moveCursorToEnd } from './selectAll';

interface EditableProps {
  value: string;
  editable: boolean;
  onCommit: (value: string) => void;
  as?: 'span' | 'div';
  id?: string;
  className?: string;
  style?: CSSProperties;
  maxLength?: number;
  placeholder?: string;
}

export function Editable({ value, editable, onCommit, as = 'span', id, className, style, maxLength, placeholder }: EditableProps) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    const isBeingEdited = document.activeElement === element;
    if (element && !isBeingEdited && element.textContent !== value) element.textContent = value;
  }, [value]);

  const enforceMaxLength = (event: FormEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const text = element.textContent || '';
    if (!maxLength || text.length <= maxLength) return;
    element.textContent = text.slice(0, maxLength);
    moveCursorToEnd(element);
  };

  const commit = () => {
    const text = (ref.current?.textContent || '').trim();
    if (text !== value) onCommit(text);
  };

  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      id={id}
      className={className}
      style={style}
      contentEditable={editable}
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onInput={enforceMaxLength}
      onBlur={commit}
    />
  );
}
