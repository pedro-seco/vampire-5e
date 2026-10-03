import { useState } from 'react';
import { powersOf } from '../../data/powerCatalog';
import type { DisciplineEntry } from '../../types/character';
import { useCharacter } from '../../context/CharacterContext';
import { Modal } from '../shared/Modal';
import { SearchDropdown } from '../shared/SearchDropdown';

interface AddPowerModalProps {
  discIdx: number | null;
  onClose: () => void;
}

function availablePowers(discipline: DisciplineEntry) {
  return powersOf(discipline.name)
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
      title={discipline ? `Adicionar poder — ${discipline.name}` : 'Adicionar poder'}
      onCancel={close}
      onConfirm={confirm}
      confirmDisabled={!chosen}
    >
      <SearchDropdown
        placeholder="Buscar poder…"
        items={discipline ? availablePowers(discipline) : []}
        onSelect={(item) => setChosen(item.label)}
      />
    </Modal>
  );
}
