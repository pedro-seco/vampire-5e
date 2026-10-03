import { useState } from 'react';
import { DISCIPLINE_NAMES } from '../../data/powerCatalog';
import { useCharacter } from '../../context/CharacterContext';
import { Modal } from '../shared/Modal';
import { SearchDropdown } from '../shared/SearchDropdown';

interface AddDisciplineModalProps {
  open: boolean;
  onClose: () => void;
}

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
    <Modal open={open} title="Adicionar disciplina" onCancel={close} onConfirm={confirm} confirmDisabled={!chosen}>
      <SearchDropdown placeholder="Buscar disciplina…" items={OPTIONS} onSelect={(item) => setChosen(item.label)} />
    </Modal>
  );
}
