import { useEffect, useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import type { Character } from '../../types/character';
import { Editable } from '../shared/Editable';

type HeaderField = 'clan' | 'generation' | 'predatorType' | 'faction' | 'embrace' | 'sire' | 'languages';

// Labels and per-field character limits from the legacy sheet (setupFieldLimits).
const META: { field: HeaderField; id: string; label: string; max: number }[] = [
  { field: 'clan', id: 'hv-clan', label: 'Clan', max: 30 },
  { field: 'generation', id: 'hv-gen', label: 'Generation', max: 6 },
  { field: 'predatorType', id: 'hv-pred', label: 'Predator Type', max: 25 },
  { field: 'faction', id: 'hv-faction', label: 'Faction', max: 25 },
  { field: 'embrace', id: 'hv-embrace', label: 'Embrace', max: 35 },
  { field: 'sire', id: 'hv-sire', label: 'Sire', max: 45 },
  { field: 'languages', id: 'hv-lang', label: 'Languages', max: 100 },
];

/** XP boxes are always editable (no edit mode), and clamp to a non-negative integer. */
function XpBox({ id, value, onCommit }: { id: string; value: Character['xpTotal']; onCommit: (v: string) => void }) {
  const [draft, setDraft] = useState(String(value ?? ''));
  useEffect(() => setDraft(String(value ?? '')), [value]);

  const commit = () => {
    const clean = String(Math.max(0, parseInt(draft, 10) || 0));
    setDraft(clean);
    if (clean !== String(value ?? '')) onCommit(clean);
  };

  return (
    <input
      className="xp-box"
      id={id}
      type="number"
      min="0"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
    />
  );
}

export function CharHeader() {
  const { character: c, editMode, update } = useCharacter();

  return (
    <div className="char-header">
      <div className="char-name-row">
        <Editable
          className="char-name"
          id="char-name"
          value={c.name}
          editable={editMode}
          maxLength={50}
          onCommit={(v) => update((d) => { d.name = v; })}
        />
        <Editable
          className="char-aliases"
          id="char-aliases"
          value={c.aliases}
          editable={editMode}
          maxLength={80}
          onCommit={(v) => update((d) => { d.aliases = v; })}
        />
      </div>
      <div className="hdeco" />
      <div className="hmeta">
        {META.map((m) => (
          <div className="hmi" key={m.field}>
            <span className="hlbl">{m.label}</span>
            <Editable
              className="hval"
              id={m.id}
              value={c[m.field]}
              editable={editMode}
              maxLength={m.max}
              onCommit={(v) => update((d) => { d[m.field] = v; })}
            />
          </div>
        ))}
        <div className="hmi-xp">
          <div className="xp-item">
            <span className="hlbl">XP Total</span>
            <XpBox id="xp-total" value={c.xpTotal} onCommit={(v) => update((d) => { d.xpTotal = v; })} />
          </div>
          <div className="xp-item">
            <span className="hlbl">XP Spent</span>
            <XpBox id="xp-spent" value={c.xpSpent} onCommit={(v) => update((d) => { d.xpSpent = v; })} />
          </div>
        </div>
      </div>
    </div>
  );
}
