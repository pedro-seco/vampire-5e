import { useRef, useState } from 'react';
import type { ChangeEvent, CSSProperties } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { BACKDROPS, backdropFor } from './backdrops';
import { portraitFromFile } from './portrait';

export function AppearanceControls({ style }: { style?: CSSProperties }) {
  const { character, update } = useCharacter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const choosePortrait = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const portrait = await portraitFromFile(file);
      update((draft) => { draft.portrait = portrait; });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar a imagem');
    }
  };

  const removePortrait = () => update((draft) => { delete draft.portrait; });
  const chooseBackdrop = (id: string) => update((draft) => { draft.backdrop = id; });

  return (
    <div className="ankh-appearance" style={style}>
      <div className="ankh-appearance__row">
        <button type="button" className="ankh-button" onClick={() => fileInput.current?.click()}>
          {character.portrait ? 'Trocar retrato' : 'Adicionar retrato'}
        </button>
        {character.portrait && <button type="button" className="ankh-button is-quiet" onClick={removePortrait}>Remover</button>}
      </div>
      <label className="ankh-appearance__row">
        <span className="ankh-field-label">FUNDO</span>
        <select value={backdropFor(character.backdrop).id} onChange={(event) => chooseBackdrop(event.target.value)}>
          {BACKDROPS.map((backdrop) => <option key={backdrop.id} value={backdrop.id}>{backdrop.label}</option>)}
        </select>
      </label>
      {error && <span className="ankh-appearance__error">{error}</span>}
      <input ref={fileInput} type="file" accept="image/*" hidden onChange={choosePortrait} />
    </div>
  );
}
