import { useCharacter } from '../../context/CharacterContext';
import { clanTraitsFor } from '../../ankh/clanTraits';
import type { ClanTrait } from '../../ankh/clanTraits';
import { predatorReference } from '../../ankh/references';
import { range } from '../shared/range';

const WRITING_LINES = 3;

function Note({ title, trait }: { title: string; trait?: ClanTrait }) {
  return (
    <div className="paper-note">
      <h3>{title}{trait ? ': ' + trait.name : ''}</h3>
      {trait ? <p>{trait.text}</p> : <WritingLines />}
    </div>
  );
}

function WritingLines() {
  return <div className="paper-writing">{range(WRITING_LINES).map((line) => <div key={line} className="paper-writing__line" />)}</div>;
}

export function ClanNotes() {
  const { character } = useCharacter();
  const traits = clanTraitsFor(character.clan);
  const predator = character.predatorType ? predatorReference(character.predatorType) : null;

  return (
    <footer className="paper-foot">
      <Note title="Clan Bane" trait={traits?.bane} />
      <Note title="Compulsão" trait={traits?.compulsion} />
      <div className="paper-note">
        <h3>Predator Type{character.predatorType ? ': ' + character.predatorType : ''}</h3>
        {predator && predator.details.length > 0 ? <p>{predator.details.join(' · ')}</p> : <WritingLines />}
      </div>
    </footer>
  );
}
