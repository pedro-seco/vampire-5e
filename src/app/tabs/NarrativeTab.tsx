import { useCharacter } from '../context/CharacterContext';
import { NewspaperPage } from '../components/narrative/NewspaperPage';
import { Editable } from '../components/shared/Editable';

function Languages() {
  const { character, editMode, update } = useCharacter();
  const setLanguages = (languages: string) => update((draft) => { draft.languages = languages; });

  return (
    <>
      <div className="sh">Idiomas</div>
      <Editable as="div" id="languages-text" className="notes-content" placeholder="Idiomas…" value={character.languages || ''} editable={editMode} onCommit={setLanguages} />
    </>
  );
}

function Notes() {
  const { character, editMode, update } = useCharacter();
  const setNotes = (notes: string) => update((draft) => { draft.notes = notes; });

  return (
    <>
      <div className="sh">Anotações</div>
      <Editable as="div" id="notes-text" className="notes-content" placeholder="Anotações livres…" value={character.notes || ''} editable={editMode} onCommit={setNotes} />
    </>
  );
}

export function NarrativeTab() {
  return (
    <div className="page">
      <NewspaperPage />
      <div className="paper paper-extra">
        <Languages />
        <Notes />
      </div>
    </div>
  );
}
