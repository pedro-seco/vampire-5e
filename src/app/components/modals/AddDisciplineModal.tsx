import { useState } from 'react';
import disciplinesData from '../../data/disciplines.json';
import type { DisciplinePower } from '../../types/character';
import { useCharacter } from '../../context/CharacterContext';
import { Modal } from '../shared/Modal';
import { SearchDropdown } from '../shared/SearchDropdown';

interface AddDisciplineModalProps {
  open: boolean;
  onClose: () => void;
}

const DISCIPLINE_NAMES = [...new Set((disciplinesData as DisciplinePower[]).map((power) => power.discipline))];
const OPTIONS = DISCIPLINE_NAMES.map((name) => ({ label: name }));

export function AddDisciplineModal({ open, onClose }: AddDisciplineModalProps) {
  const { character, update } = useCharacter();
  const [chosen, setChosen] = useState<string | null>(null);

  const close = () => {
    setChosen(null);
    onClose();
  };

  const confirm = () => {
    if (!chosen) return;
    const alreadyKnown = character.disciplines.some((discipline) => discipline.name === chosen);
    if (!alreadyKnown) update((draft) => { draft.disciplines.push({ name: chosen, level: 1, powers: [] }); });
    close();
  };

  return (
    <Modal open={open} title="Add Discipline" onCancel={close} onConfirm={confirm} confirmDisabled={!chosen}>
      <SearchDropdown placeholder="Search discipline…" items={OPTIONS} onSelect={(item) => setChosen(item.label)} />
    </Modal>
  );
}
