import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties, FormEvent } from 'react';

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

/**
 * contentEditable field, matching the legacy sheet's markup: sheet.css styles
 * `[contenteditable="true"]` in edit mode and uses `:empty` for placeholders,
 * so this can't be an <input>. The DOM text is owned by the element while it
 * has focus; it's only rewritten from `value` when not being edited.
 */
export function Editable({ value, editable, onCommit, as = 'span', id, className, style, maxLength, placeholder }: EditableProps) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.textContent !== value) el.textContent = value;
  }, [value]);

  // Legacy setupFieldLimits(): truncate and put the cursor back at the end.
  const handleInput = (e: FormEvent<HTMLElement>) => {
    const el = e.currentTarget;
    if (!maxLength || (el.textContent || '').length <= maxLength) return;
    el.textContent = (el.textContent || '').slice(0, maxLength);
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const handleBlur = () => {
    const next = (ref.current?.textContent || '').trim();
    if (next !== value) onCommit(next);
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
      onInput={handleInput}
      onBlur={handleBlur}
    />
  );
}

