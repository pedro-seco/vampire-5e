import { useState } from 'react';
import disciplinesData from '../../data/disciplines.json';
import { useCharacter } from '../../context/CharacterContext';
import { useConfirm } from '../../context/ConfirmContext';
import type { DisciplineEntry, DisciplinePower } from '../../types/character';
import { AddDisciplineModal } from '../modals/AddDisciplineModal';
import { AddPowerModal } from '../modals/AddPowerModal';

const POWERS = disciplinesData as DisciplinePower[];

function PowerCard({ discName, powerName, onDelete }: { discName: string; powerName: string; onDelete: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const p = POWERS.find((d) => d.name === powerName && d.discipline === discName) || POWERS.find((d) => d.name === powerName);

  return (
    <div
      className={'disc-power' + (collapsed ? ' collapsed' : '')}
      onClick={(e) => { if (!(e.target as HTMLElement).closest('button')) setCollapsed((c) => !c); }}
    >
      {p ? (
        <>
          <div className="dp-level">
            {p.discipline} {'●'.repeat(p.level)}
            {p.requirements ? ' · Req: ' + p.requirements : ''}
          </div>
          <div className="dp-name">{p.name}</div>
          {p.pool && p.pool !== '—' && <div className="dp-pool">Pool: {p.pool}</div>}
          <div className="dp-desc">{p.description}</div>
          <div className="dp-meta">
            <span><span className="dp-ml">Cost </span><span className="dp-mv">{p.cost}</span></span>
            <span><span className="dp-ml">Duration </span><span className="dp-mv">{p.duration}</span></span>
          </div>
        </>
      ) : (
        <div className="dp-name">{powerName}</div>
      )}
      <button className="btn-delete" onClick={onDelete}>×</button>
    </div>
  );
}

function DisciplineGroup({ disc, di, onAddPower }: { disc: DisciplineEntry; di: number; onAddPower: () => void }) {
  const { editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();
  const [collapsed, setCollapsed] = useState(false);

  const setLevel = (delta: number) => {
    if (!editMode) return;
    const next = disc.level + delta;
    if (next < 1 || next > 5) return;
    update((d) => { d.disciplines[di].level = next; });
  };

  return (
    <div className={'disc-group' + (collapsed ? ' collapsed' : '')}>
      <div
        className="disc-header"
        onClick={(e) => { if (!(e.target as HTMLElement).closest('button')) setCollapsed((c) => !c); }}
      >
        <span className="disc-arr">▾</span>
        <span>{disc.name}</span>
        <button className="btn-delete disc-lvl-adj" title="Decrease level" onClick={(e) => { e.stopPropagation(); setLevel(-1); }}>−</button>
        <span className="disc-level">{'●'.repeat(disc.level)}</span>
        <button className="btn-delete disc-lvl-adj" title="Increase level" onClick={(e) => { e.stopPropagation(); setLevel(1); }}>+</button>
        <button
          className="btn-delete disc-lvl-adj"
          style={{ color: 'rgba(255,255,255,.7)', fontSize: 16, marginLeft: 10 }}
          title="Add power"
          onClick={(e) => { e.stopPropagation(); onAddPower(); }}
        >
          ＋
        </button>
        <button
          className="btn-delete"
          onClick={() =>
            confirmDelete('Remove discipline "' + disc.name + '" and all its powers?', () =>
              update((d) => { d.disciplines.splice(di, 1); })
            )
          }
        >
          ×
        </button>
      </div>
      {disc.powers.map((powerName, pi) => (
        <PowerCard
          key={pi + powerName}
          discName={disc.name}
          powerName={powerName}
          onDelete={() =>
            confirmDelete('Remove power "' + powerName + '"?', () =>
              update((d) => { d.disciplines[di].powers.splice(pi, 1); })
            )
          }
        />
      ))}
    </div>
  );
}

export function Disciplines() {
  const { character, editMode } = useCharacter();
  const [addDiscOpen, setAddDiscOpen] = useState(false);
  const [powerDisc, setPowerDisc] = useState<number | null>(null);

  return (
    <div className="disciplines">
      <div className="sh">
        Disciplines
        <button className="sh-add" title="Add discipline" onClick={() => editMode && setAddDiscOpen(true)}>＋</button>
      </div>
      <div id="disciplines-list">
        {character.disciplines.map((disc, di) => (
          <DisciplineGroup key={di + disc.name} disc={disc} di={di} onAddPower={() => setPowerDisc(di)} />
        ))}
      </div>
      {/* Remount per opening so the search box starts empty, like the legacy closeModal(). */}
      {addDiscOpen && <AddDisciplineModal open onClose={() => setAddDiscOpen(false)} />}
      {powerDisc !== null && <AddPowerModal discIdx={powerDisc} onClose={() => setPowerDisc(null)} />}
    </div>
  );
}
