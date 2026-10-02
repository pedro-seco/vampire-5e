import { useCharacter } from '../context/CharacterContext';
import { Convictions } from '../components/narrative/Convictions';
import { MechanicalReference } from '../components/narrative/MechanicalReference';
import { Touchstones } from '../components/narrative/Touchstones';
import { Editable } from '../components/shared/Editable';

const ALIASES_STYLE = { fontStyle: 'italic', color: 'var(--txt-m)', fontSize: 13 } as const;

function NarrativeHeader() {
  const { character } = useCharacter();
  return (
    <>
      <div className="char-name-row" style={{ marginBottom: 4 }}>
        <span className="char-name" id="narr-char-name" style={{ fontSize: 20 }}>{character.name}</span>
      </div>
      <div className="hdeco" style={{ marginBottom: 6 }} />
      <div className="narr-subtitle-row">
        <span style={ALIASES_STYLE} id="narr-aliases">{character.aliases}</span>
        <span className="narr-label">Narrative Aspects</span>
      </div>
    </>
  );
}

function Background() {
  const { character, editMode, update } = useCharacter();
  const setBackground = (text: string) => update((draft) => { draft.background = text; });

  return (
    <>
      <div className="sh">Background</div>
      <div className="background-block">
        <div className="background-title">Origin &amp; Embrace</div>
        <Editable as="div" id="background-text" value={character.background} editable={editMode} onCommit={setBackground} />
      </div>
    </>
  );
}

function Languages() {
  const { character, editMode, update } = useCharacter();
  const setLanguages = (languages: string) => update((draft) => { draft.languages = languages; });

  return (
    <>
      <div className="sh">Languages</div>
      <Editable as="div" id="languages-text" className="notes-content" placeholder="Idiomas…" value={character.languages || ''} editable={editMode} onCommit={setLanguages} />
    </>
  );
}

function Notes() {
  const { character, editMode, update } = useCharacter();
  const setNotes = (notes: string) => update((draft) => { draft.notes = notes; });

  return (
    <>
      <div className="sh">Notes</div>
      <Editable as="div" id="notes-text" className="notes-content" placeholder="Anotações livres…" value={character.notes || ''} editable={editMode} onCommit={setNotes} />
    </>
  );
}

export function NarrativeTab() {
  return (
    <div className="page">
      <NarrativeHeader />

      <div className="p2-grid">
        <Convictions />
        <Touchstones />
      </div>

      <MechanicalReference />
      <Background />
      <Languages />
      <Notes />
    </div>
  );
}
