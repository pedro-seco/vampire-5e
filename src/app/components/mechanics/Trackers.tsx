import bpData from '../../data/bp.json';
import { useCharacter } from '../../context/CharacterContext';
import type { BPLevel } from '../../types/character';
import { clamp } from '../shared/clamp';
import { range } from '../shared/range';

type DamageTrack = 'health' | 'willpower';

const RESONANCES = ['Sanguine', 'Choleric', 'Melancholic', 'Phlegmatic', 'Empty'];
const HUNGER_BOXES = 5;
const HUMANITY_BOXES = 10;
const BLOOD_POTENCY_BOXES = 10;
const MAX_TRACK_SIZE = 15;
const DAMAGE_STATES = 3;

const DAMAGE_CLASS = ['', ' superficial', ' aggravated'];
const SIZE_KEY = { health: 'healthMax', willpower: 'willpowerMax' } as const;

function DamageBoxes({ track }: { track: DamageTrack }) {
  const { character, update } = useCharacter();
  const size = character.trackers[SIZE_KEY[track]];
  const states = character.trackers[track];

  const cycle = (box: number) =>
    update((draft) => { draft.trackers[track][box] = ((draft.trackers[track][box] || 0) + 1) % DAMAGE_STATES; });

  return (
    <div id={track + '-boxes'}>
      {range(size).map((box) => (
        <div key={box} className={'box' + DAMAGE_CLASS[states[box] || 0]} onClick={() => cycle(box)} />
      ))}
    </div>
  );
}

function TrackSizeButtons({ track }: { track: DamageTrack }) {
  const { editMode, update } = useCharacter();
  const sizeKey = SIZE_KEY[track];

  const shrink = () => {
    if (!editMode) return;
    update((draft) => {
      if (draft.trackers[sizeKey] <= 1) return;
      draft.trackers[sizeKey]--;
      draft.trackers[track] = draft.trackers[track].slice(0, draft.trackers[sizeKey]);
    });
  };

  const grow = () => {
    if (!editMode) return;
    update((draft) => { draft.trackers[sizeKey] = Math.min(MAX_TRACK_SIZE, draft.trackers[sizeKey] + 1); });
  };

  return (
    <div className="trk-size-ctrl">
      <button className="btn-pm" onClick={shrink}>−</button>
      <button className="btn-pm" onClick={grow}>+</button>
    </div>
  );
}

function HungerBoxes() {
  const { character, update } = useCharacter();
  const hunger = character.trackers.hunger;

  const toggle = (box: number) => update((draft) => { draft.trackers.hunger[box] = draft.trackers.hunger[box] ? 0 : 1; });

  return (
    <div className="trk-boxes" id="hunger-boxes">
      {range(HUNGER_BOXES).map((box) => (
        <div key={box} className={'box' + (hunger[box] ? ' hunger-on' : '')} onClick={() => toggle(box)} />
      ))}
    </div>
  );
}

function HumanityBoxes() {
  const { character, editMode, update } = useCharacter();
  const { humanity, humanityStains } = character.trackers;
  const firstStainBox = HUMANITY_BOXES - humanityStains;

  const toggleStain = (box: number) =>
    update((draft) => {
      const trackers = draft.trackers;
      const isStain = box >= HUMANITY_BOXES - trackers.humanityStains;
      trackers.humanityStains = isStain
        ? Math.max(0, trackers.humanityStains - 1)
        : Math.min(HUMANITY_BOXES - trackers.humanity, trackers.humanityStains + 1);
    });

  const changeHumanityBy = (delta: number) => {
    if (!editMode) return;
    update((draft) => { draft.trackers.humanity = clamp(draft.trackers.humanity + delta, 0, 10); });
  };

  return (
    <div id="humanity-boxes">
      <div className="hum-wrap">
        {range(HUMANITY_BOXES).map((box) =>
          box < humanity ? (
            <div key={box} className="box hum-filled" style={{ cursor: 'default' }} />
          ) : (
            <div key={box} className={'box' + (box >= firstStainBox ? ' stain' : '')} onClick={() => toggleStain(box)} />
          )
        )}
      </div>
      <div className="edit-ctrl">
        <button className="btn-pm" onClick={() => changeHumanityBy(-1)}>−</button>
        <button className="btn-pm" onClick={() => changeHumanityBy(1)}>+</button>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return <div className="bp-row"><span className="bp-k">{label}</span><span className="bp-v">{value}</span></div>;
}

function BloodPotency() {
  const { character, editMode, update } = useCharacter();
  const { bp, resonance } = character.trackers;
  const effects = (bpData as BPLevel[]).find((level) => level.level === bp);

  const setBloodPotency = (box: number) => {
    if (!editMode) return;
    const clicked = box + 1;
    update((draft) => { draft.trackers.bp = draft.trackers.bp === clicked ? clicked - 1 : clicked; });
  };

  const setResonance = (value: string) => update((draft) => { draft.trackers.resonance = value; });

  return (
    <div className="bp-panel">
      <div className="bp-head">
        <span className="bp-title">Blood Potency</span>
        <div className="trk-boxes" id="bp-boxes">
          {range(BLOOD_POTENCY_BOXES).map((box) => (
            <div key={box} className={'box bp-box' + (box < bp ? ' bp-filled' : '')} onClick={() => setBloodPotency(box)} />
          ))}
        </div>
        <div className="resonance-row">
          <span className="res-label">Resonance</span>
          {RESONANCES.map((value) => (
            <button key={value} className={'res-btn' + (value === resonance ? ' selected' : '')} onClick={() => setResonance(value)}>
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="bp-cols" id="bp-stats">
        {effects && (
          <>
            <div>
              <StatRow label="Blood Surge" value={effects.bloodSurge} />
              <StatRow label="Mend / Rouse Check" value={effects.damageHealed} />
              <StatRow label="Discipline Bonus" value={effects.disciplineBonus} />
            </div>
            <div>
              <StatRow label="Rouse Re-Roll" value={effects.rouseRoll} />
              <StatRow label="Bane Severity" value={effects.bane} />
              <StatRow label="Feeding Penalty" value={effects.penalty} />
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
          <TrackSizeButtons track="health" />
        </div>

        <div></div>

        <span className="trk-label">Willpower</span>
        <div className="trk-boxes">
          <DamageBoxes track="willpower" />
          <TrackSizeButtons track="willpower" />
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
