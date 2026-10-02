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

const ADVANTAGES = advantagesData as AdvantageDef[];

export function AddAdvantageModal({ open, type, onClose }: AddAdvantageModalProps) {
  const { update } = useCharacter();
  const [chosen, setChosen] = useState<string | null>(null);
  const isFlaw = type === 'flaw';

  const options = ADVANTAGES
    .filter((advantage) => (isFlaw ? advantage.type === -1 : advantage.type === 1))
    .map((advantage) => ({ label: advantage.name }));

  const close = () => {
    setChosen(null);
    onClose();
  };

  const confirm = () => {
    if (!chosen) return;
    const entry = { name: chosen, level: 1, note: '' };
    update((draft) => {
      if (isFlaw) draft.flaws.push(entry);
      else draft.advantages.push(entry);
    });
    close();
  };

  return (
    <Modal open={open} title={isFlaw ? 'Add Flaw' : 'Add Advantage'} onCancel={close} onConfirm={confirm} confirmDisabled={!chosen}>
      <SearchDropdown placeholder="Search…" items={options} onSelect={(item) => setChosen(item.label)} />
    </Modal>
  );
}
