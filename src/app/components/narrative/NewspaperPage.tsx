import { useCharacter } from '../../context/CharacterContext';
import { Editable } from '../shared/Editable';
import { ClanNotes } from './ClanNotes';
import { Convictions } from './Convictions';
import { ImageSlot } from './ImageSlot';
import { Touchstones } from './Touchstones';
import './newspaper.css';

function Masthead() {
  const { character } = useCharacter();
  return (
    <header className="paper-masthead">
      <div className="paper-meta"><span>{character.name}</span><span>{character.aliases}</span></div>
      <h1>A Narrativa</h1>
    </header>
  );
}

function Lead() {
  const { character, editMode, update } = useCharacter();
  const setBackground = (text: string) => update((draft) => { draft.background = text; });
  const setPortrait = (portrait: string | undefined) =>
    update((draft) => {
      if (portrait) draft.portrait = portrait;
      else delete draft.portrait;
    });

  return (
    <section className="paper-lead">
      <div className="paper-text">
        <h2>Background</h2>
        <Editable as="div" id="background-text" className="paper-background" value={character.background} editable={editMode} onCommit={setBackground} />
        <Convictions />
      </div>
      <ImageSlot image={character.portrait} tall onChange={setPortrait} />
    </section>
  );
}

export function NewspaperPage() {
  return (
    <div className="paper">
      <Masthead />
      <Lead />
      <Touchstones />
      <ClanNotes />
    </div>
  );
}
