import { useState } from 'react';
import disciplinesData from '../../data/disciplines.json';
import type { DisciplineEntry, DisciplinePower } from '../../types/character';
import { useCharacter } from '../../context/CharacterContext';
import { Modal } from '../shared/Modal';
import { SearchDropdown } from '../shared/SearchDropdown';

interface AddPowerModalProps {
  discIdx: number | null;
  onClose: () => void;
}

const POWERS = disciplinesData as DisciplinePower[];

function availablePowers(discipline: DisciplineEntry) {
  return POWERS
    .filter((power) => power.discipline === discipline.name)
    .filter((power) => power.level <= discipline.level)
    .filter((power) => !discipline.powers.includes(power.name))
    .map((power) => ({ label: power.name, sub: '●'.repeat(power.level) }));
}

export function AddPowerModal({ discIdx, onClose }: AddPowerModalProps) {
  const { character, update } = useCharacter();
  const [chosen, setChosen] = useState<string | null>(null);
  const discipline = discIdx !== null ? character.disciplines[discIdx] : null;

  const close = () => {
    setChosen(null);
    onClose();
  };

  const confirm = () => {
    if (chosen === null || discIdx === null) return;
    update((draft) => { draft.disciplines[discIdx].powers.push(chosen); });
    close();
  };

  return (
    <Modal
      open={discIdx !== null}
      title={discipline ? `Add Power — ${discipline.name}` : 'Add Power'}
      onCancel={close}
      onConfirm={confirm}
      confirmDisabled={!chosen}
    >
      <SearchDropdown
        placeholder="Search power…"
        items={discipline ? availablePowers(discipline) : []}
        onSelect={(item) => setChosen(item.label)}
      />
    </Modal>
  );
}
