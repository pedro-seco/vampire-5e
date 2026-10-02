import { useEffect, useRef } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useConfirm } from '../../context/ConfirmContext';
import { Editable } from '../shared/Editable';
import { focusAndSelect } from '../shared/selectAll';

const NEW_ITEM_TEXT = 'New item';

export function Inventory() {
  const { character, editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();
  const list = useRef<HTMLDivElement>(null);
  const shouldFocusNewItem = useRef(false);

  useEffect(() => {
    if (!shouldFocusNewItem.current) return;
    shouldFocusNewItem.current = false;
    const items = list.current?.querySelectorAll<HTMLElement>('.inv-name');
    focusAndSelect(items?.[items.length - 1]);
  }, [character.inventory.length]);

  const addItem = () => {
    if (!editMode) return;
    shouldFocusNewItem.current = true;
    update((draft) => { draft.inventory.push(NEW_ITEM_TEXT); });
  };

  const renameItem = (index: number) => (text: string) => update((draft) => { draft.inventory[index] = text; });

  const removeItem = (index: number, item: string) =>
    confirmDelete('Remove "' + item + '" from inventory?', () => update((draft) => { draft.inventory.splice(index, 1); }));

  return (
    <div className="inventory">
      <div className="sh">
        Inventory
        <button className="sh-add" title="Add item" onClick={addItem}>＋</button>
      </div>
      <div id="inventory-list" ref={list}>
        {character.inventory.map((item, index) => (
          <div className="inv-item" key={index}>
            <Editable className="inv-name" value={item} editable={editMode} onCommit={renameItem(index)} />
            <button className="btn-delete" onClick={() => removeItem(index, item)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
