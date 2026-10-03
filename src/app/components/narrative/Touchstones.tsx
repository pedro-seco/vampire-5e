import { useCharacter } from '../../context/CharacterContext';
import { useConfirm } from '../../context/ConfirmContext';
import type { Touchstone } from '../../types/character';
import { Editable } from '../shared/Editable';
import { ImageSlot } from './ImageSlot';

const NEW_TOUCHSTONE: Touchstone = { name: 'Novo Touchstone', summary: '', linkedConviction: '', description: '' };

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
        <option value="">— sem Conviction —</option>
        {character.convictions.map((conviction, index) => (
          <option key={index} value={conviction}>→ {conviction}</option>
        ))}
      </select>
    </span>
  );
}

function TouchstoneStory({ touchstone, index }: { touchstone: Touchstone; index: number }) {
  const { editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();

  const setField = (field: 'name' | 'summary' | 'linkedConviction' | 'description') => (value: string) =>
    update((draft) => { draft.touchstones[index][field] = value; });

  const setImage = (image: string | undefined) =>
    update((draft) => {
      if (image) draft.touchstones[index].image = image;
      else delete draft.touchstones[index].image;
    });

  const remove = () =>
    confirmDelete('Remover o Touchstone "' + touchstone.name + '"?', () =>
      update((draft) => { draft.touchstones.splice(index, 1); })
    );

  return (
    <article className={'paper-story' + (index % 2 === 1 ? ' is-flipped' : '')}>
      <ImageSlot image={touchstone.image} onChange={setImage} />
      <div className="paper-text">
        <h2><Editable className="ts-name" value={touchstone.name} editable={editMode} onCommit={setField('name')} /></h2>
        <Editable as="div" className="ts-summary" value={touchstone.summary} editable={editMode} onCommit={setField('summary')} />
        <LinkedConviction touchstone={touchstone} onChange={setField('linkedConviction')} />
        <Editable as="div" className="ts-desc" value={touchstone.description} editable={editMode} onCommit={setField('description')} />
      </div>
      <button className="btn-delete" onClick={remove}>×</button>
    </article>
  );
}

export function Touchstones() {
  const { character, editMode, update } = useCharacter();

  const addTouchstone = () => {
    if (!editMode) return;
    update((draft) => { draft.touchstones.push({ ...NEW_TOUCHSTONE }); });
  };

  return (
    <section className="paper-touchstones">
      <div className="sh">
        Touchstones
        <button className="sh-add" title="Adicionar Touchstone" onClick={addTouchstone}>＋</button>
      </div>
      {character.touchstones.map((touchstone, index) => (
        <TouchstoneStory key={index} touchstone={touchstone} index={index} />
      ))}
    </section>
  );
}
