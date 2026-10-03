import { useEffect, useRef } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useConfirm } from '../../context/ConfirmContext';
import { Editable } from '../shared/Editable';
import { focusAndSelect } from '../shared/selectAll';

const MAX_CONVICTIONS = 5;
const NEW_CONVICTION_TEXT = 'Nova Conviction.';
const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V'];

const toRoman = (position: number) => ROMAN_NUMERALS[position - 1] || String(position);

export function Convictions() {
  const { character, editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();
  const list = useRef<HTMLDivElement>(null);
  const shouldFocusNewConviction = useRef(false);

  useEffect(() => {
    if (!shouldFocusNewConviction.current) return;
    shouldFocusNewConviction.current = false;
    const items = list.current?.querySelectorAll<HTMLElement>('.conv-text');
    focusAndSelect(items?.[items.length - 1]);
  }, [character.convictions.length]);

  const addConviction = () => {
    if (!editMode || character.convictions.length >= MAX_CONVICTIONS) return;
    shouldFocusNewConviction.current = true;
    update((draft) => { draft.convictions.push(NEW_CONVICTION_TEXT); });
  };

  const editConviction = (index: number) => (text: string) => update((draft) => { draft.convictions[index] = text; });

  const removeConviction = (index: number) =>
    confirmDelete('Remover esta Conviction?', () => update((draft) => { draft.convictions.splice(index, 1); }));

  return (
    <div>
      <div className="sh">
        Convictions
        <button className="sh-add" title="Adicionar Conviction" onClick={addConviction}>＋</button>
      </div>
      <div id="convictions-list" ref={list}>
        {character.convictions.map((conviction, index) => (
          <div className="conviction-item" key={index}>
            <span className="conv-num">{toRoman(index + 1)}</span>
            <Editable className="conv-text" value={conviction} editable={editMode} onCommit={editConviction(index)} />
            <button className="btn-delete" onClick={() => removeConviction(index)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
