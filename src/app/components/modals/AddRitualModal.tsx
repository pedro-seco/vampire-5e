import { useState } from 'react';
import { RITUAL_DISCIPLINES, ritualsOf } from '../../data/powerCatalog';
import type { DisciplineEntry } from '../../types/character';
import { useCharacter } from '../../context/CharacterContext';
import { Modal } from '../shared/Modal';
import { SearchDropdown } from '../shared/SearchDropdown';

interface AddRitualModalProps {
  discIdx: number | null;
  onClose: () => void;
}

function availableRituals(discipline: DisciplineEntry) {
  return ritualsOf(discipline.name)
    .filter((ritual) => ritual.level <= discipline.level)
    .filter((ritual) => !(discipline.rituals ?? []).includes(ritual.name))
    .map((ritual) => ({ label: ritual.name, sub: '●'.repeat(ritual.level) }));
}

export function AddRitualModal({ discIdx, onClose }: AddRitualModalProps) {
  const { character, update } = useCharacter();
  const [chosen, setChosen] = useState<string | null>(null);
  const discipline = discIdx !== null ? character.disciplines[discIdx] : null;
  const noun = discipline ? RITUAL_DISCIPLINES[discipline.name]?.singular ?? 'ritual' : 'ritual';

  const close = () => {
    setChosen(null);
    onClose();
  };

  const confirm = () => {
    if (chosen === null || discIdx === null) return;
    update((draft) => {
      const target = draft.disciplines[discIdx];
      target.rituals = [...(target.rituals ?? []), chosen];
    });
    close();
  };

  return (
    <Modal
      open={discIdx !== null}
      title={discipline ? `Adicionar ${noun} — ${discipline.name}` : `Adicionar ${noun}`}
      onCancel={close}
      onConfirm={confirm}
      confirmDisabled={!chosen}
    >
      <SearchDropdown
        placeholder={`Buscar ${noun}…`}
        items={discipline ? availableRituals(discipline) : []}
        onSelect={(item) => setChosen(item.label)}
      />
    </Modal>
  );
}
