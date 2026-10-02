import { useEffect, useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import type { Character } from '../../types/character';
import { Editable } from '../shared/Editable';

type HeaderField = 'clan' | 'generation' | 'predatorType' | 'faction' | 'embrace' | 'sire' | 'languages';

const HEADER_FIELDS: { field: HeaderField; id: string; label: string; maxLength: number }[] = [
  { field: 'clan', id: 'hv-clan', label: 'Clan', maxLength: 30 },
  { field: 'generation', id: 'hv-gen', label: 'Generation', maxLength: 6 },
  { field: 'predatorType', id: 'hv-pred', label: 'Predator Type', maxLength: 25 },
  { field: 'faction', id: 'hv-faction', label: 'Faction', maxLength: 25 },
  { field: 'embrace', id: 'hv-embrace', label: 'Embrace', maxLength: 35 },
  { field: 'sire', id: 'hv-sire', label: 'Sire', maxLength: 45 },
  { field: 'languages', id: 'hv-lang', label: 'Languages', maxLength: 100 },
];

const toNonNegativeInteger = (text: string) => String(Math.max(0, parseInt(text, 10) || 0));

interface XpBoxProps {
  id: string;
  value: Character['xpTotal'];
  onCommit: (value: string) => void;
}

function XpBox({ id, value, onCommit }: XpBoxProps) {
  const saved = String(value ?? '');
  const [draft, setDraft] = useState(saved);

  useEffect(() => setDraft(saved), [saved]);

  const commit = () => {
    const clean = toNonNegativeInteger(draft);
    setDraft(clean);
    if (clean !== saved) onCommit(clean);
  };

  return (
    <input
      className="xp-box"
      id={id}
      type="number"
      min="0"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
    />
  );
}

export function CharHeader() {
  const { character, editMode, update } = useCharacter();

  const setName = (name: string) => update((draft) => { draft.name = name; });
  const setAliases = (aliases: string) => update((draft) => { draft.aliases = aliases; });
  const setField = (field: HeaderField) => (value: string) => update((draft) => { draft[field] = value; });
  const setXpTotal = (xp: string) => update((draft) => { draft.xpTotal = xp; });
  const setXpSpent = (xp: string) => update((draft) => { draft.xpSpent = xp; });

  return (
    <div className="char-header">
      <div className="char-name-row">
        <Editable className="char-name" id="char-name" value={character.name} editable={editMode} maxLength={50} onCommit={setName} />
        <Editable className="char-aliases" id="char-aliases" value={character.aliases} editable={editMode} maxLength={80} onCommit={setAliases} />
      </div>

      <div className="hdeco" />

      <div className="hmeta">
        {HEADER_FIELDS.map(({ field, id, label, maxLength }) => (
          <div className="hmi" key={field}>
            <span className="hlbl">{label}</span>
            <Editable
              className="hval"
              id={id}
              value={character[field]}
              editable={editMode}
              maxLength={maxLength}
              onCommit={setField(field)}
            />
          </div>
        ))}

        <div className="hmi-xp">
          <div className="xp-item">
            <span className="hlbl">XP Total</span>
            <XpBox id="xp-total" value={character.xpTotal} onCommit={setXpTotal} />
          </div>
          <div className="xp-item">
            <span className="hlbl">XP Spent</span>
            <XpBox id="xp-spent" value={character.xpSpent} onCommit={setXpSpent} />
          </div>
        </div>
      </div>
    </div>
  );
}
