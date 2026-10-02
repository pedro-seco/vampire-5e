import { useState } from 'react';
import type { MouseEvent } from 'react';
import disciplinesData from '../../data/disciplines.json';
import { useCharacter } from '../../context/CharacterContext';
import { useConfirm } from '../../context/ConfirmContext';
import type { DisciplineEntry, DisciplinePower } from '../../types/character';
import { AddDisciplineModal } from '../modals/AddDisciplineModal';
import { AddPowerModal } from '../modals/AddPowerModal';

const POWERS = disciplinesData as DisciplinePower[];
const MIN_LEVEL = 1;
const MAX_LEVEL = 5;
const ADD_POWER_BUTTON_STYLE = { color: 'rgba(255,255,255,.7)', fontSize: 16, marginLeft: 10 };

const dots = (level: number) => '●'.repeat(level);

const clickedAButton = (event: MouseEvent) => Boolean((event.target as HTMLElement).closest('button'));

function findPower(discipline: string, power: string) {
  return POWERS.find((candidate) => candidate.name === power && candidate.discipline === discipline)
    || POWERS.find((candidate) => candidate.name === power);
}

function PowerDetails({ power }: { power: DisciplinePower }) {
  const hasPool = power.pool && power.pool !== '—';
  return (
    <>
      <div className="dp-level">
        {power.discipline} {dots(power.level)}
        {power.requirements ? ' · Req: ' + power.requirements : ''}
      </div>
      <div className="dp-name">{power.name}</div>
      {hasPool && <div className="dp-pool">Pool: {power.pool}</div>}
      <div className="dp-desc">{power.description}</div>
      <div className="dp-meta">
        <span><span className="dp-ml">Cost </span><span className="dp-mv">{power.cost}</span></span>
        <span><span className="dp-ml">Duration </span><span className="dp-mv">{power.duration}</span></span>
      </div>
    </>
  );
}

interface PowerCardProps {
  discipline: string;
  powerName: string;
  onDelete: () => void;
}

function PowerCard({ discipline, powerName, onDelete }: PowerCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const power = findPower(discipline, powerName);

  const toggle = (event: MouseEvent) => {
    if (!clickedAButton(event)) setCollapsed((isCollapsed) => !isCollapsed);
  };

  return (
    <div className={'disc-power' + (collapsed ? ' collapsed' : '')} onClick={toggle}>
      {power ? <PowerDetails power={power} /> : <div className="dp-name">{powerName}</div>}
      <button className="btn-delete" onClick={onDelete}>×</button>
    </div>
  );
}

interface DisciplineGroupProps {
  discipline: DisciplineEntry;
  index: number;
  onAddPower: () => void;
}

function DisciplineGroup({ discipline, index, onAddPower }: DisciplineGroupProps) {
  const { editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();
  const [collapsed, setCollapsed] = useState(false);

  const toggle = (event: MouseEvent) => {
    if (!clickedAButton(event)) setCollapsed((isCollapsed) => !isCollapsed);
  };

  const changeLevelBy = (event: MouseEvent, delta: number) => {
    event.stopPropagation();
    const level = discipline.level + delta;
    if (!editMode || level < MIN_LEVEL || level > MAX_LEVEL) return;
    update((draft) => { draft.disciplines[index].level = level; });
  };

  const addPower = (event: MouseEvent) => {
    event.stopPropagation();
    onAddPower();
  };

  const removeDiscipline = () =>
    confirmDelete('Remove discipline "' + discipline.name + '" and all its powers?', () =>
      update((draft) => { draft.disciplines.splice(index, 1); })
    );

  const removePower = (powerIndex: number, powerName: string) =>
    confirmDelete('Remove power "' + powerName + '"?', () =>
      update((draft) => { draft.disciplines[index].powers.splice(powerIndex, 1); })
    );

  return (
    <div className={'disc-group' + (collapsed ? ' collapsed' : '')}>
      <div className="disc-header" onClick={toggle}>
        <span className="disc-arr">▾</span>
        <span>{discipline.name}</span>
        <button className="btn-delete disc-lvl-adj" title="Decrease level" onClick={(event) => changeLevelBy(event, -1)}>−</button>
        <span className="disc-level">{dots(discipline.level)}</span>
        <button className="btn-delete disc-lvl-adj" title="Increase level" onClick={(event) => changeLevelBy(event, 1)}>+</button>
        <button className="btn-delete disc-lvl-adj" style={ADD_POWER_BUTTON_STYLE} title="Add power" onClick={addPower}>＋</button>
        <button className="btn-delete" onClick={removeDiscipline}>×</button>
      </div>

      {discipline.powers.map((powerName, powerIndex) => (
        <PowerCard
          key={powerIndex + powerName}
          discipline={discipline.name}
          powerName={powerName}
          onDelete={() => removePower(powerIndex, powerName)}
        />
      ))}
    </div>
  );
}

export function Disciplines() {
  const { character, editMode } = useCharacter();
  const [addingDiscipline, setAddingDiscipline] = useState(false);
  const [addingPowerTo, setAddingPowerTo] = useState<number | null>(null);

  return (
    <div className="disciplines">
      <div className="sh">
        Disciplines
        <button className="sh-add" title="Add discipline" onClick={() => editMode && setAddingDiscipline(true)}>＋</button>
      </div>

      <div id="disciplines-list">
        {character.disciplines.map((discipline, index) => (
          <DisciplineGroup key={index + discipline.name} discipline={discipline} index={index} onAddPower={() => setAddingPowerTo(index)} />
        ))}
      </div>

      {addingDiscipline && <AddDisciplineModal open onClose={() => setAddingDiscipline(false)} />}
      {addingPowerTo !== null && <AddPowerModal discIdx={addingPowerTo} onClose={() => setAddingPowerTo(null)} />}
    </div>
  );
}
