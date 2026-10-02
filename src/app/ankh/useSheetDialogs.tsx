import { useState } from 'react';
import { AddAdvantageModal } from '../components/modals/AddAdvantageModal';
import { AddDisciplineModal } from '../components/modals/AddDisciplineModal';
import { AddPowerModal } from '../components/modals/AddPowerModal';
import type { Attributes, SkillKey } from '../types/character';

export type Selection =
  | { kind: 'skill'; skill: SkillKey }
  | { kind: 'power'; discipline: string; power: string }
  | { kind: 'attribute'; attribute: keyof Attributes }
  | { kind: 'predator' }
  | { kind: 'advantage'; list: 'advantage' | 'flaw'; index: number }
  | { kind: 'pool-form' };

type Dialog = { kind: 'discipline' } | { kind: 'power'; disciplineIndex: number } | { kind: 'advantage' | 'flaw' };

export function isSkillSelected(selection: Selection | null, skill: SkillKey) {
  return selection?.kind === 'skill' && selection.skill === skill;
}

export function isAttributeSelected(selection: Selection | null, attribute: keyof Attributes) {
  return selection?.kind === 'attribute' && selection.attribute === attribute;
}

export function isAdvantageSelected(selection: Selection | null, list: 'advantage' | 'flaw', index: number) {
  return selection?.kind === 'advantage' && selection.list === list && selection.index === index;
}

export function isPowerSelected(selection: Selection | null, discipline: string, power: string) {
  return selection?.kind === 'power' && selection.discipline === discipline && selection.power === power;
}

export function useSheetDialogs() {
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const close = () => setDialog(null);

  const dialogs = (
    <>
      {dialog?.kind === 'discipline' && <AddDisciplineModal open onClose={close} />}
      {dialog?.kind === 'power' && <AddPowerModal discIdx={dialog.disciplineIndex} onClose={close} />}
      {(dialog?.kind === 'advantage' || dialog?.kind === 'flaw') && <AddAdvantageModal open type={dialog.kind} onClose={close} />}
    </>
  );

  return {
    dialogs,
    addDiscipline: () => setDialog({ kind: 'discipline' }),
    addPower: (disciplineIndex: number) => setDialog({ kind: 'power', disciplineIndex }),
    addAdvantage: (kind: 'advantage' | 'flaw') => setDialog({ kind }),
  };
}
