import { useState } from 'react';
import disciplinesData from '../../data/disciplines.json';
import type { DisciplinePower } from '../../types/character';
import { useCharacter } from '../../context/CharacterContext';
import { Modal } from '../shared/Modal';
import { SearchDropdown } from '../shared/SearchDropdown';

interface AddPowerModalProps {
  discIdx: number | null;
  onClose: () => void;
}

export function AddPowerModal({ discIdx, onClose }: AddPowerModalProps) {
  const { character, update } = useCharacter();
  const [pending, setPending] = useState<string | null>(null);

  const disc = discIdx !== null ? character.disciplines[discIdx] : null;

  const items = disc
    ? (disciplinesData as DisciplinePower[])
        .filter((d) => d.discipline === disc.name && d.level <= disc.level && !disc.powers.includes(d.name))
        .map((d) => ({ label: d.name, sub: '●'.repeat(d.level) }))
    : [];

  const handleClose = () => {
    setPending(null);
    onClose();
  };

  const handleConfirm = () => {
    if (pending === null || discIdx === null) return;
    update((c) => {
      c.disciplines[discIdx].powers.push(pending);
    });
    handleClose();
  };

  return (
    <Modal
      open={discIdx !== null}
      title={disc ? `Add Power — ${disc.name}` : 'Add Power'}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmDisabled={!pending}
    >
      <SearchDropdown placeholder="Search power…" items={items} onSelect={(item) => setPending(item.label)} />
    </Modal>
  );
}
