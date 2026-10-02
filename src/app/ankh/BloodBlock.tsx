import bpData from '../data/bp.json';
import { useCharacter } from '../context/CharacterContext';
import type { BPLevel } from '../types/character';
import { Editable } from '../components/shared/Editable';
import { range } from '../components/shared/range';

const POTENCY_BARS = 10;
const RESONANCES = ['Sanguine', 'Choleric', 'Melancholic', 'Phlegmatic', 'Empty'];
const MAX_POTENCY_BY_GENERATION: Record<number, number> = { 4: 9, 5: 8, 6: 7, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2, 12: 2, 13: 1, 14: 0, 15: 0, 16: 0 };

function generationNumber(generation: string): number | null {
  const digits = generation.match(/\d+/);
  return digits ? Number(digits[0]) : null;
}

function barState(bar: number, potency: number, max: number | null) {
  if (bar < potency) return 'is-filled';
  if (max === null || bar < max) return 'is-available';
  return 'is-blocked';
}

export function BloodBlock({ showResonance = true }: { showResonance?: boolean }) {
  const { character, editMode, update } = useCharacter();
  const { bp } = character.trackers;
  const generation = generationNumber(character.generation);
  const max = generation === null ? null : MAX_POTENCY_BY_GENERATION[generation] ?? null;
  const effects = (bpData as BPLevel[]).find((level) => level.level === bp);

  const setPotency = (bar: number) => {
    if (!editMode) return;
    const clicked = bar + 1;
    update((draft) => { draft.trackers.bp = draft.trackers.bp === clicked ? clicked - 1 : clicked; });
  };

  const setGeneration = (value: string) => update((draft) => { draft.generation = value; });

  return (
    <div className="ankh-blood">
      <span className="ankh-group">SANGUE</span>
      <div className="ankh-blood__main">
        <div className="ankh-blood__generation">
          <span className="ankh-field-label">GERAÇÃO</span>
          {editMode ? (
            <Editable className="ankh-blood__numeral" value={character.generation} editable maxLength={6} onCommit={setGeneration} />
          ) : (
            <span className="ankh-blood__numeral">{generation === null ? character.generation : generation + 'ª'}</span>
          )}
        </div>
        <div className="ankh-blood__potency">
          <span className="ankh-field-label">BLOOD POTENCY {bp}</span>
          <span className="ankh-bars">
            {range(POTENCY_BARS).map((bar) => (
              <button
                key={bar}
                type="button"
                className={'ankh-bar ' + barState(bar, bp, max)}
                aria-label={`Blood Potency ${bar + 1}`}
                disabled={!editMode}
                onClick={() => setPotency(bar)}
              />
            ))}
          </span>
          {max !== null && <span className="ankh-blood__max">máx. {max} na {generation}ª geração</span>}
        </div>
      </div>
      {effects && (
        <span className="ankh-blood__effects">
          Blood Surge {effects.bloodSurge} · Mend {effects.damageHealed} · Rouse re-roll: {effects.rouseRoll}
        </span>
      )}
      {showResonance && <ResonancePicker />}
    </div>
  );
}

export function ResonancePicker() {
  const { character, update } = useCharacter();
  const resonance = character.trackers.resonance;
  const setResonance = (value: string) => update((draft) => { draft.trackers.resonance = value; });

  return (
    <span className="ankh-resonance">
      <span className="ankh-field-label">RESONANCE</span>
      {RESONANCES.map((value) => (
        <button
          key={value}
          type="button"
          className={'ankh-resonance__option' + (value === resonance ? ' is-selected' : '')}
          aria-pressed={value === resonance}
          onClick={() => setResonance(value)}
        >
          {value}
        </button>
      ))}
    </span>
  );
}
