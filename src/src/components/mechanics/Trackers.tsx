import bpData from '../../data/bp.json';
import { useCharacter } from '../../context/CharacterContext';
import type { BPLevel } from '../../types/character';

const RESONANCES = ['Sanguine', 'Choleric', 'Melancholic', 'Phlegmatic', 'Empty'];
const HUMANITY_BOXES = 10;
const BP_BOXES = 10;

/** Health / Willpower: each box cycles empty → superficial → aggravated → empty. */
function DamageBoxes({ track }: { track: 'health' | 'willpower' }) {
  const { character, update } = useCharacter();
  const max = track === 'health' ? character.trackers.healthMax : character.trackers.willpowerMax;
  const states = character.trackers[track];

  return (
    <div id={track === 'health' ? 'health-boxes' : 'willpower-boxes'}>
      {Array.from({ length: max }, (_, i) => {
        const s = states[i] || 0;
        return (
          <div
            key={i}
            className={'box' + (s === 1 ? ' superficial' : '') + (s === 2 ? ' aggravated' : '')}
            onClick={() => update((d) => { d.trackers[track][i] = ((d.trackers[track][i] || 0) + 1) % 3; })}
          />
        );
      })}
    </div>
  );
}

function SizeCtrl({ track }: { track: 'health' | 'willpower' }) {
  const { editMode, update } = useCharacter();
  const maxKey = track === 'health' ? 'healthMax' : 'willpowerMax';

  const minus = () => {
    if (!editMode) return;
    update((d) => {
      if (d.trackers[maxKey] <= 1) return;
      d.trackers[maxKey]--;
      d.trackers[track] = d.trackers[track].slice(0, d.trackers[maxKey]);
    });
  };
  const plus = () => {
    if (!editMode) return;
    update((d) => { d.trackers[maxKey] = Math.min(15, d.trackers[maxKey] + 1); });
  };

  return (
    <div className="trk-size-ctrl">
      <button className="btn-pm" onClick={minus}>−</button>
      <button className="btn-pm" onClick={plus}>+</button>
    </div>
  );
}

function HungerBoxes() {
  const { character, update } = useCharacter();
  return (
    <div className="trk-boxes" id="hunger-boxes">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className={'box' + (character.trackers.hunger[i] ? ' hunger-on' : '')}
          onClick={() => update((d) => { d.trackers.hunger[i] = d.trackers.hunger[i] ? 0 : 1; })}
        />
      ))}
    </div>
  );
}

/**
 * Humanity: filled boxes from the left = current Humanity; Stains fill the empty
 * boxes from the right. Clicking an empty box adds a Stain, clicking a Stain removes one.
 */
function HumanityBoxes() {
  const { character, editMode, update } = useCharacter();
  const { humanity, humanityStains } = character.trackers;
  const stainFrom = HUMANITY_BOXES - humanity - humanityStains;

  const clickEmpty = (i: number) =>
    update((d) => {
      const t = d.trackers;
      const eI = i - t.humanity;
      const sF = HUMANITY_BOXES - t.humanity - t.humanityStains;
      if (eI >= sF) t.humanityStains = Math.max(0, t.humanityStains - 1);
      else t.humanityStains = Math.min(HUMANITY_BOXES - t.humanity, t.humanityStains + 1);
    });

  return (
    <div id="humanity-boxes">
      <div className="hum-wrap">
        {Array.from({ length: HUMANITY_BOXES }, (_, i) =>
          i < humanity ? (
            <div key={i} className="box hum-filled" style={{ cursor: 'default' }} />
          ) : (
            <div key={i} className={'box' + (i - humanity >= stainFrom ? ' stain' : '')} onClick={() => clickEmpty(i)} />
          )
        )}
      </div>
      <div className="edit-ctrl">
        <button className="btn-pm" onClick={() => editMode && update((d) => { d.trackers.humanity = Math.max(0, d.trackers.humanity - 1); })}>−</button>
        <button className="btn-pm" onClick={() => editMode && update((d) => { d.trackers.humanity = Math.min(10, d.trackers.humanity + 1); })}>+</button>
      </div>
    </div>
  );
}

function BloodPotency() {
  const { character, editMode, update } = useCharacter();
  const { bp, resonance } = character.trackers;
  const data = (bpData as BPLevel[]).find((d) => d.level === bp);

  const clickBox = (i: number) => {
    if (!editMode) return;
    const clicked = i + 1;
    update((d) => { d.trackers.bp = d.trackers.bp === clicked ? clicked - 1 : clicked; });
  };

  return (
    <div className="bp-panel">
      <div className="bp-head">
        <span className="bp-title">Blood Potency</span>
        <div className="trk-boxes" id="bp-boxes">
          {Array.from({ length: BP_BOXES }, (_, i) => (
            <div key={i} className={'box bp-box' + (i < bp ? ' bp-filled' : '')} onClick={() => clickBox(i)} />
          ))}
        </div>
        <div className="resonance-row">
          <span className="res-label">Resonance</span>
          {RESONANCES.map((r) => (
            <button
              key={r}
              className={'res-btn' + (r === resonance ? ' selected' : '')}
              onClick={() => update((d) => { d.trackers.resonance = r; })}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="bp-cols" id="bp-stats">
        {data && (
          <>
            <div>
              <div className="bp-row"><span className="bp-k">Blood Surge</span><span className="bp-v">{data.bloodSurge}</span></div>
              <div className="bp-row"><span className="bp-k">Mend / Rouse Check</span><span className="bp-v">{data.damageHealed}</span></div>
              <div className="bp-row"><span className="bp-k">Discipline Bonus</span><span className="bp-v">{data.disciplineBonus}</span></div>
            </div>
            <div>
              <div className="bp-row"><span className="bp-k">Rouse Re-Roll</span><span className="bp-v">{data.rouseRoll}</span></div>
              <div className="bp-row"><span className="bp-k">Bane Severity</span><span className="bp-v">{data.bane}</span></div>
              <div className="bp-row"><span className="bp-k">Feeding Penalty</span><span className="bp-v">{data.penalty}</span></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function Trackers() {
  return (
    <div className="trk">
      <div className="trk-grid">
        <span className="trk-label">Health</span>
        <div className="trk-boxes">
          <DamageBoxes track="health" />
          <SizeCtrl track="health" />
        </div>

        <div></div>

        <span className="trk-label">Willpower</span>
        <div className="trk-boxes">
          <DamageBoxes track="willpower" />
          <SizeCtrl track="willpower" />
        </div>

        <span className="trk-label">Humanity</span>
        <div className="trk-boxes">
          <HumanityBoxes />
          <div className="trk-size-ctrl" style={{ display: 'none' }}></div>
        </div>

        <div></div>

        <span className="trk-label">Hunger</span>
        <HungerBoxes />
      </div>

      <BloodPotency />
    </div>
  );
}
