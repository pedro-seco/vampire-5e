import { useCharacter } from '../context/CharacterContext';
import { AdvantagesColumn } from '../components/mechanics/AdvantagesColumn';
import { AttributeColumn } from '../components/mechanics/AttributeColumn';
import { CharHeader } from '../components/mechanics/CharHeader';
import { Disciplines } from '../components/mechanics/Disciplines';
import { Inventory } from '../components/mechanics/Inventory';
import { Pools } from '../components/mechanics/Pools';
import { Trackers } from '../components/mechanics/Trackers';
import { Editable } from '../components/shared/Editable';

export function MechanicsTab() {
  const { character, editMode, update } = useCharacter();

  return (
    <div className="page">
      <CharHeader />

      {/* 4 columns: Physical | Social | Mental | Advantages + Flaws */}
      <div className="four">
        <AttributeColumn group="physical" />
        <AttributeColumn group="social" />
        <AttributeColumn group="mental" />
        <AdvantagesColumn />
      </div>

      {/* Bottom: notes / inventory + pools / trackers, then disciplines full width */}
      <div className="mech-bottom">
        <div className="mech-notes-col">
          <div className="mech-card">
            <div className="sh">Notes</div>
            <Editable
              as="div"
              id="notes-text"
              className="notes-content"
              placeholder="Anotações livres…"
              value={character.notes || ''}
              editable={editMode}
              onCommit={(v) => update((d) => { d.notes = v; })}
            />
          </div>
        </div>

        <div className="mech-col-left">
          <Inventory />
          <Pools />
        </div>

        <div className="mech-col-right">
          <Trackers />
        </div>

        <Disciplines />
      </div>
    </div>
  );
}
