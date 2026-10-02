import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Character } from '../types/character';
import { blankCharacter } from '../data/defaultCharacter';
import {
  newCharacterId,
  readStore,
  withActiveCharacterRemoved,
  withCharacterAdded,
  withCharacterReplaced,
  writeStore,
} from './characterStore';
import type { CharacterStore } from './characterStore';
import { downloadCharacter, readCharacterFile } from './characterFiles';

interface CharacterSummary {
  id: string;
  name: string;
}

interface CharacterContextValue {
  character: Character;
  characters: CharacterSummary[];
  activeId: string;
  editMode: boolean;
  setEditMode: (on: boolean) => void;
  switchChar: (id: string) => void;
  newCharacter: () => void;
  deleteActiveCharacter: () => void;
  exportActive: () => void;
  importCharacter: (file: File) => Promise<void>;
  update: (change: (draft: Character) => void) => void;
}

const CharacterContext = createContext<CharacterContextValue | null>(null);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<CharacterStore>(readStore);
  const [editMode, setEditMode] = useState(false);

  const character = store.charactersById[store.active];

  const characters = useMemo(
    () => store.characters.map((id) => ({ id, name: store.charactersById[id]?.name || id })),
    [store]
  );

  const changeStore = useCallback((change: (current: CharacterStore) => CharacterStore) => {
    setStore((current) => {
      const next = change(current);
      if (next !== current) writeStore(next);
      return next;
    });
  }, []);

  const update = useCallback(
    (change: (draft: Character) => void) =>
      changeStore((current) => {
        const active = current.charactersById[current.active];
        if (!active) return current;
        const draft = structuredClone(active);
        change(draft);
        return withCharacterReplaced(current, draft);
      }),
    [changeStore]
  );

  const switchChar = useCallback(
    (id: string) => {
      changeStore((current) => (current.charactersById[id] ? { ...current, active: id } : current));
      setEditMode(false);
    },
    [changeStore]
  );

  const newCharacter = useCallback(() => {
    changeStore((current) => withCharacterAdded(current, blankCharacter(newCharacterId())));
    setEditMode(true);
  }, [changeStore]);

  const deleteActiveCharacter = useCallback(() => changeStore(withActiveCharacterRemoved), [changeStore]);

  const exportActive = useCallback(() => {
    if (character) downloadCharacter(character);
  }, [character]);

  const importCharacter = useCallback(
    async (file: File) => {
      const imported = await readCharacterFile(file);
      changeStore((current) => withCharacterAdded(current, imported));
    },
    [changeStore]
  );

  const value: CharacterContextValue = {
    character,
    characters,
    activeId: store.active,
    editMode,
    setEditMode,
    switchChar,
    newCharacter,
    deleteActiveCharacter,
    exportActive,
    importCharacter,
    update,
  };

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}

export function useCharacter(): CharacterContextValue {
  const context = useContext(CharacterContext);
  if (!context) throw new Error('useCharacter must be used within CharacterProvider');
  return context;
}
