import { useCharacter } from '../context/CharacterContext';
import { clamp } from '../components/shared/clamp';
import { range } from '../components/shared/range';

type DamageTrack = 'health' | 'willpower';

const SIZE_KEY = { health: 'healthMax', willpower: 'willpowerMax' } as const;
const TRACK_LABEL = { health: 'HEALTH', willpower: 'WILLPOWER' } as const;
const DAMAGE_STATES = 3;
const MAX_TRACK_SIZE = 15;
const HUMANITY_BOXES = 10;
const HUNGER_BOXES = 5;
const DAMAGE_NAMES = ['vazio', 'superficial', 'agravado'];

function DamageBox({ state }: { state: number }) {
  return (
    <svg className="ankh-box" viewBox="0 0 26 26" aria-hidden="true">
      <rect x="1" y="1" width="24" height="24" className="ankh-box__frame" />
      {state === 1 && <path d="M6 20 L20 6" className="ankh-box__superficial" />}
      {state === 2 && <path d="M6 6 L20 20 M20 6 L6 20" className="ankh-box__aggravated" />}
    </svg>
  );
}

function FilledBox({ filled, stained }: { filled: boolean; stained?: boolean }) {
  return (
    <svg className="ankh-box" viewBox="0 0 26 26" aria-hidden="true">
      <rect x="1" y="1" width="24" height="24" className={filled ? 'ankh-box__frame is-filled' : 'ankh-box__frame'} />
      {stained && <path d="M6 20 L20 6" className="ankh-box__stain" />}
    </svg>
  );
}

export function DamageTrackBoxes({ track }: { track: DamageTrack }) {
  const { character, editMode, update } = useCharacter();
  const sizeKey = SIZE_KEY[track];
  const size = character.trackers[sizeKey];
  const states = character.trackers[track];

  const cycle = (box: number) =>
    update((draft) => { draft.trackers[track][box] = ((draft.trackers[track][box] || 0) + 1) % DAMAGE_STATES; });

  const resize = (delta: number) =>
    update((draft) => {
      const next = clamp(draft.trackers[sizeKey] + delta, 1, MAX_TRACK_SIZE);
      draft.trackers[sizeKey] = next;
      draft.trackers[track] = draft.trackers[track].slice(0, next);
    });

  return (
    <span className="ankh-boxes">
      {range(size).map((box) => (
        <button
          key={box}
          type="button"
          className="ankh-box-button"
          aria-label={`${TRACK_LABEL[track]} ${box + 1}: ${DAMAGE_NAMES[states[box] || 0]}`}
          onClick={() => cycle(box)}
        >
          <DamageBox state={states[box] || 0} />
        </button>
      ))}
      {editMode && (
        <span className="ankh-resize">
          <button type="button" aria-label={`Diminuir ${TRACK_LABEL[track]}`} onClick={() => resize(-1)}>−</button>
          <button type="button" aria-label={`Aumentar ${TRACK_LABEL[track]}`} onClick={() => resize(1)}>+</button>
        </span>
      )}
    </span>
  );
}

export function HumanityBoxes() {
  const { character, editMode, update } = useCharacter();
  const { humanity, humanityStains } = character.trackers;
  const firstStain = HUMANITY_BOXES - humanityStains;

  const toggleStain = (box: number) =>
    update((draft) => {
      const trackers = draft.trackers;
      const isStain = box >= HUMANITY_BOXES - trackers.humanityStains;
      trackers.humanityStains = isStain
        ? Math.max(0, trackers.humanityStains - 1)
        : Math.min(HUMANITY_BOXES - trackers.humanity, trackers.humanityStains + 1);
    });

  const changeHumanity = (delta: number) =>
    update((draft) => { draft.trackers.humanity = clamp(draft.trackers.humanity + delta, 0, HUMANITY_BOXES); });

  return (
    <span className="ankh-boxes">
      {range(HUMANITY_BOXES).map((box) =>
        box < humanity ? (
          <span key={box} className="ankh-box-static"><FilledBox filled /></span>
        ) : (
          <button key={box} type="button" className="ankh-box-button" aria-label={`Stain ${box + 1}`} onClick={() => toggleStain(box)}>
            <FilledBox filled={false} stained={box >= firstStain} />
          </button>
        )
      )}
      {editMode && (
        <span className="ankh-resize">
          <button type="button" aria-label="Diminuir Humanity" onClick={() => changeHumanity(-1)}>−</button>
          <button type="button" aria-label="Aumentar Humanity" onClick={() => changeHumanity(1)}>+</button>
        </span>
      )}
    </span>
  );
}

export function HungerBoxes() {
  const { character, update } = useCharacter();
  const hunger = character.trackers.hunger;

  const toggle = (box: number) => update((draft) => { draft.trackers.hunger[box] = draft.trackers.hunger[box] ? 0 : 1; });

  return (
    <span className="ankh-boxes">
      {range(HUNGER_BOXES).map((box) => (
        <button key={box} type="button" className="ankh-box-button" aria-label={`Hunger ${box + 1}`} onClick={() => toggle(box)}>
          <FilledBox filled={Boolean(hunger[box])} />
        </button>
      ))}
    </span>
  );
}

export function TrackerLabel({ children }: { children: string }) {
  return <span className="ankh-tracker-label">{children}</span>;
}
