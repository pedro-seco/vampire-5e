import { useState } from 'react';
import advantagesData from '../../data/advantages.json';
import { useCharacter } from '../../context/CharacterContext';
import { useConfirm } from '../../context/ConfirmContext';
import type { AdvantageDef, AdvantageEntry } from '../../types/character';
import { AddAdvantageModal } from '../modals/AddAdvantageModal';

function maxLevelOf(name: string): number {
  const found = (advantagesData as AdvantageDef[]).find((a) => a.name === name);
  return found ? found.maxLevel || 5 : 5;
}

function AdvRow({ item, idx, isFlaw }: { item: AdvantageEntry; idx: number; isFlaw: boolean }) {
  const { update } = useCharacter();
  const { confirmDelete } = useConfirm();
  const list = (d: { advantages: AdvantageEntry[]; flaws: AdvantageEntry[] }) => (isFlaw ? d.flaws : d.advantages);

  return (
    <div className="adv-row">
      <div className="adv-left">
        <span className={isFlaw ? 'flaw-name' : 'adv-name'}>{item.name}</span>
        {item.note && <span className="adv-note">({item.note})</span>}
      </div>
      <div className="edit-ctrl">
        <button className="btn-pm" onClick={() => update((d) => { list(d)[idx].level = Math.max(1, list(d)[idx].level - 1); })}>−</button>
      </div>
      <span className="adv-val">{item.level}</span>
      <div className="edit-ctrl">
        <button
          className="btn-pm"
          onClick={() => update((d) => { list(d)[idx].level = Math.min(maxLevelOf(item.name), list(d)[idx].level + 1); })}
        >
          +
        </button>
      </div>
      <button
        className="btn-delete"
        onClick={() => confirmDelete('Remove "' + item.name + '"?', () => update((d) => { list(d).splice(idx, 1); }))}
      >
        ×
      </button>
    </div>
  );
}

export function AdvantagesColumn() {
  const { character, editMode } = useCharacter();
  const [modal, setModal] = useState<'advantage' | 'flaw' | null>(null);

  return (
    <div className="col">
      <div className="sh">
        Advantages
        <button className="sh-add" title="Add advantage" onClick={() => editMode && setModal('advantage')}>＋</button>
      </div>
      <div id="advantages-list">
        {character.advantages.map((a, i) => <AdvRow key={i + a.name} item={a} idx={i} isFlaw={false} />)}
      </div>
      <div className="sh" style={{ marginTop: 10 }}>
        Flaws
        <button className="sh-add" title="Add flaw" onClick={() => editMode && setModal('flaw')}>＋</button>
      </div>
      <div id="flaws-list">
        {character.flaws.map((f, i) => <AdvRow key={i + f.name} item={f} idx={i} isFlaw />)}
      </div>
      {/* Remount per opening so the search box starts empty, like the legacy closeModal(). */}
      {modal && <AddAdvantageModal open type={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
