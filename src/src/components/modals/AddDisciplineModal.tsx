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

export function AddDisciplineModal({ open, onClose }: AddDisciplineModalProps) {
  const { character, update } = useCharacter();
  const [pending, setPending] = useState<string | null>(null);

  const items = [...new Set((disciplinesData as DisciplinePower[]).map((d) => d.discipline))].map((name) => ({
    label: name,
  }));

  const handleClose = () => {
    setPending(null);
    onClose();
  };

  const handleConfirm = () => {
    if (!pending) return;
    if (!character.disciplines.find((d) => d.name === pending)) {
      update((c) => {
        c.disciplines.push({ name: pending, level: 1, powers: [] });
      });
    }
    handleClose();
  };

  return (
    <Modal open={open} title="Add Discipline" onCancel={handleClose} onConfirm={handleConfirm} confirmDisabled={!pending}>
      <SearchDropdown placeholder="Search discipline…" items={items} onSelect={(item) => setPending(item.label)} />
    </Modal>
  );
}
