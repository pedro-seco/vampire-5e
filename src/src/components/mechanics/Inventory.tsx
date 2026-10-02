import { useEffect, useRef } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useConfirm } from '../../context/ConfirmContext';
import { Editable } from '../shared/Editable';
import { selectAll } from '../shared/selectAll';

export function Inventory() {
  const { character, editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();
  const listRef = useRef<HTMLDivElement>(null);
  const focusLast = useRef(false);

  // After "＋", focus and select the new last item (legacy behavior).
  useEffect(() => {
    if (!focusLast.current) return;
    focusLast.current = false;
    const rows = listRef.current?.querySelectorAll<HTMLElement>('.inv-name');
    const last = rows?.[rows.length - 1];
    if (last) { last.focus(); selectAll(last); }
  }, [character.inventory.length]);

  const add = () => {
    if (!editMode) return;
    focusLast.current = true;
    update((d) => { d.inventory.push('New item'); });
  };

  return (
    <div className="inventory">
      <div className="sh">
        Inventory
        <button className="sh-add" title="Add item" onClick={add}>＋</button>
      </div>
      <div id="inventory-list" ref={listRef}>
        {character.inventory.map((item, i) => (
          <div className="inv-item" key={i}>
            <Editable
              className="inv-name"
              value={item}
              editable={editMode}
              onCommit={(v) => update((d) => { d.inventory[i] = v; })}
            />
            <button
              className="btn-delete"
              onClick={() => confirmDelete('Remove "' + item + '" from inventory?', () => update((d) => { d.inventory.splice(i, 1); }))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
