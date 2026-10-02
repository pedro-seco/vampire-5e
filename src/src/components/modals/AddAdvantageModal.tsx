import { useState } from 'react';
import advantagesData from '../../data/advantages.json';
import type { AdvantageDef } from '../../types/character';
import { useCharacter } from '../../context/CharacterContext';
import { Modal } from '../shared/Modal';
import { SearchDropdown } from '../shared/SearchDropdown';

interface AddAdvantageModalProps {
  open: boolean;
  type: 'advantage' | 'flaw';
  onClose: () => void;
}

export function AddAdvantageModal({ open, type, onClose }: AddAdvantageModalProps) {
  const { update } = useCharacter();
  const [pending, setPending] = useState<string | null>(null);

  const items = (advantagesData as AdvantageDef[])
    .filter((a) => (type === 'flaw' ? a.type === -1 : a.type === 1))
    .map((a) => ({ label: a.name }));

  const handleClose = () => {
    setPending(null);
    onClose();
  };

  const handleConfirm = () => {
    if (!pending) return;
    update((c) => {
      const entry = { name: pending, level: 1, note: '' };
      if (type === 'flaw') c.flaws.push(entry);
      else c.advantages.push(entry);
    });
    handleClose();
  };

  return (
    <Modal
      open={open}
      title={type === 'flaw' ? 'Add Flaw' : 'Add Advantage'}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmDisabled={!pending}
    >
      <SearchDropdown placeholder="Search…" items={items} onSelect={(item) => setPending(item.label)} />
    </Modal>
  );
}
