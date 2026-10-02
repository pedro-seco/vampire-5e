import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Character } from '../types/character';
import { DEFAULT_CHARACTER, blankCharacter } from '../data/defaultCharacter';
import { storageGet, storageSave, loadStore } from './storage';

interface NormalizedStore {
  characters: string[];
  active: string;
  charactersById: Record<string, Character>;
}

function normalize(): NormalizedStore {
  const raw = loadStore();
  const charactersById: Record<string, Character> = {};
  raw.characters.forEach((id) => {
    const c = (raw as Record<string, unknown>)[id];
    if (c) charactersById[id] = c as Character;
  });
  return { characters: raw.characters, active: raw.active, charactersById };
}

function persist(state: NormalizedStore): void {
  const flat = storageGet();
  flat.characters = state.characters;
  flat.active = state.active;
  state.characters.forEach((id) => {
    flat[id] = state.charactersById[id];
  });
  storageSave(flat);
}

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
  update: (mutator: (draft: Character) => void) => void;
}

const CharacterContext = createContext<CharacterContextValue | null>(null);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<NormalizedStore>(() => normalize());
  const [editMode, setEditModeState] = useState(false);

  const character = store.charactersById[store.active];

  const characters = useMemo<CharacterSummary[]>(
    () => store.characters.map((id) => ({ id, name: store.charactersById[id]?.name || id })),
    [store]
  );

  const update = useCallback((mutator: (draft: Character) => void) => {
    setStore((prev) => {
      const current = prev.charactersById[prev.active];
      if (!current) return prev;
      const draft = structuredClone(current);
      mutator(draft);
      const next: NormalizedStore = {
        ...prev,
        charactersById: { ...prev.charactersById, [prev.active]: draft },
      };
      persist(next);
      return next;
    });
  }, []);

  const setEditMode = useCallback((on: boolean) => {
    setEditModeState(on);
  }, []);

  const switchChar = useCallback((id: string) => {
    setStore((prev) => {
      if (!prev.charactersById[id]) return prev;
      const next = { ...prev, active: id };
      persist(next);
      return next;
    });
    setEditModeState(false);
  }, []);

  const newCharacter = useCallback(() => {
    const id = 'char_' + Date.now();
    const newC = blankCharacter(id);
    setStore((prev) => {
      const next: NormalizedStore = {
        characters: [...prev.characters, id],
        active: id,
        charactersById: { ...prev.charactersById, [id]: newC },
      };
      persist(next);
      return next;
    });
    setEditModeState(true);
  }, []);

  const deleteActiveCharacter = useCallback(() => {
    setStore((prev) => {
      const idx = prev.characters.indexOf(prev.active);
      if (idx === -1) return prev;
      const remainingIds = prev.characters.filter((id) => id !== prev.active);
      const remainingById = { ...prev.charactersById };
      delete remainingById[prev.active];

      let next: NormalizedStore;
      if (remainingIds.length > 0) {
        const activeId = remainingIds[remainingIds.length - 1];
        next = { characters: remainingIds, active: activeId, charactersById: remainingById };
      } else {
        const id = 'char_' + Date.now();
        const fresh = JSON.parse(JSON.stringify(DEFAULT_CHARACTER)) as Character;
        fresh.id = id;
        next = { characters: [id], active: id, charactersById: { [id]: fresh } };
      }
      persist(next);
      return next;
    });
  }, []);

  const exportActive = useCallback(() => {
    if (!character) return;
    const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (character.name || 'character').replace(/\s+/g, '_') + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [character]);

  const importCharacter = useCallback((file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string) as Character;
          if (!imported.name) throw new Error('Invalid character file');
          if (!imported.id) imported.id = 'char_' + Date.now();
          setStore((prev) => {
            const characters = prev.characters.includes(imported.id)
              ? prev.characters
              : [...prev.characters, imported.id];
            const next: NormalizedStore = {
              characters,
              active: imported.id,
              charactersById: { ...prev.charactersById, [imported.id]: imported },
            };
            persist(next);
            return next;
          });
          resolve();
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Could not import character'));
        }
      };
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsText(file);
    });
  }, []);

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
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error('useCharacter must be used within CharacterProvider');
  return ctx;
}
