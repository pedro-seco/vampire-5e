import { useState } from 'react';
import advantagesData from '../../data/advantages.json';
import { useCharacter } from '../../context/CharacterContext';
import { useConfirm } from '../../context/ConfirmContext';
import type { AdvantageDef, AdvantageEntry, Character } from '../../types/character';
import { AddAdvantageModal } from '../modals/AddAdvantageModal';
import { clamp } from '../shared/clamp';
import { PlusMinus } from '../shared/PlusMinus';

type Kind = 'advantage' | 'flaw';

const DEFAULT_MAX_LEVEL = 5;

function maxLevelOf(name: string): number {
  const definition = (advantagesData as AdvantageDef[]).find((advantage) => advantage.name === name);
  return definition?.maxLevel || DEFAULT_MAX_LEVEL;
}

const listOf = (character: Character, kind: Kind) => (kind === 'flaw' ? character.flaws : character.advantages);

interface AdvantageRowProps {
  item: AdvantageEntry;
  index: number;
  kind: Kind;
}

function AdvantageRow({ item, index, kind }: AdvantageRowProps) {
  const { update } = useCharacter();
  const { confirmDelete } = useConfirm();

  const changeLevelBy = (delta: number) =>
    update((draft) => {
      const entry = listOf(draft, kind)[index];
      entry.level = clamp(entry.level + delta, 1, maxLevelOf(item.name));
    });

  const remove = () =>
    confirmDelete('Remove "' + item.name + '"?', () => update((draft) => { listOf(draft, kind).splice(index, 1); }));

  return (
    <div className="adv-row">
      <div className="adv-left">
        <span className={kind === 'flaw' ? 'flaw-name' : 'adv-name'}>{item.name}</span>
        {item.note && <span className="adv-note">({item.note})</span>}
      </div>
      <PlusMinus onMinus={() => changeLevelBy(-1)} onPlus={() => changeLevelBy(1)}>
        <span className="adv-val">{item.level}</span>
      </PlusMinus>
      <button className="btn-delete" onClick={remove}>×</button>
    </div>
  );
}

export function AdvantagesColumn() {
  const { character, editMode } = useCharacter();
  const [adding, setAdding] = useState<Kind | null>(null);

  const startAdding = (kind: Kind) => {
    if (editMode) setAdding(kind);
  };

  return (
    <div className="col">
      <div className="sh">
        Advantages
        <button className="sh-add" title="Add advantage" onClick={() => startAdding('advantage')}>＋</button>
      </div>
      <div id="advantages-list">
        {character.advantages.map((item, index) => (
          <AdvantageRow key={index + item.name} item={item} index={index} kind="advantage" />
        ))}
      </div>

      <div className="sh" style={{ marginTop: 10 }}>
        Flaws
        <button className="sh-add" title="Add flaw" onClick={() => startAdding('flaw')}>＋</button>
      </div>
      <div id="flaws-list">
        {character.flaws.map((item, index) => (
          <AdvantageRow key={index + item.name} item={item} index={index} kind="flaw" />
        ))}
      </div>

      {adding && <AddAdvantageModal open type={adding} onClose={() => setAdding(null)} />}
    </div>
  );
}
