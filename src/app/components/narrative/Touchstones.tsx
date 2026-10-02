import { useCharacter } from '../../context/CharacterContext';
import { useConfirm } from '../../context/ConfirmContext';
import type { Touchstone } from '../../types/character';
import { Editable } from '../shared/Editable';

const NEW_TOUCHSTONE: Touchstone = { name: 'New Touchstone', summary: '', linkedConviction: '', description: '' };

const CONVICTION_SELECT_STYLE = {
  background: 'var(--bg-dsc)',
  border: '1px solid var(--brd-s)',
  color: 'var(--acc)',
  fontSize: 13,
  fontStyle: 'italic',
  padding: '2px 4px',
};

interface LinkedConvictionProps {
  touchstone: Touchstone;
  onChange: (conviction: string) => void;
}

function LinkedConviction({ touchstone, onChange }: LinkedConvictionProps) {
  const { character, editMode } = useCharacter();
  const linked = touchstone.linkedConviction;

  if (!editMode) return <span className="ts-link">{linked ? '→ ' + linked : ''}</span>;

  const selected = character.convictions.includes(linked) ? linked : '';
  return (
    <span className="ts-link">
      <select style={CONVICTION_SELECT_STYLE} value={selected} onChange={(event) => onChange(event.target.value)}>
        <option value="">— no conviction —</option>
        {character.convictions.map((conviction, index) => (
          <option key={index} value={conviction}>→ {conviction}</option>
        ))}
      </select>
    </span>
  );
}

function TouchstoneItem({ touchstone, index }: { touchstone: Touchstone; index: number }) {
  const { editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();

  const setField = (field: keyof Touchstone) => (value: string) =>
    update((draft) => { draft.touchstones[index][field] = value; });

  const remove = () =>
    confirmDelete('Remove touchstone "' + touchstone.name + '"?', () =>
      update((draft) => { draft.touchstones.splice(index, 1); })
    );

  return (
    <div className="touchstone-item">
      <div>
        <Editable className="ts-name" value={touchstone.name} editable={editMode} onCommit={setField('name')} />
        <Editable className="ts-summary" value={touchstone.summary} editable={editMode} onCommit={setField('summary')} />
      </div>
      <LinkedConviction touchstone={touchstone} onChange={setField('linkedConviction')} />
      <Editable as="div" className="ts-desc" value={touchstone.description} editable={editMode} onCommit={setField('description')} />
      <button className="btn-delete" onClick={remove}>×</button>
    </div>
  );
}

export function Touchstones() {
  const { character, editMode, update } = useCharacter();

  const addTouchstone = () => {
    if (!editMode) return;
    update((draft) => { draft.touchstones.push({ ...NEW_TOUCHSTONE }); });
  };

  return (
    <div>
      <div className="sh">
        Touchstones
        <button className="sh-add" title="Add touchstone" onClick={addTouchstone}>＋</button>
      </div>
      <div id="touchstones-list">
        {character.touchstones.map((touchstone, index) => (
          <TouchstoneItem key={index} touchstone={touchstone} index={index} />
        ))}
      </div>
    </div>
  );
}
