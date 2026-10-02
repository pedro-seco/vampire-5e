import type { Character } from '../types/character';
import { DEFAULT_CHARACTER } from '../data/defaultCharacter';
import { loadStore, storageGet, storageSave } from './storage';

export interface CharacterStore {
  characters: string[];
  active: string;
  charactersById: Record<string, Character>;
}

export const newCharacterId = () => 'char_' + Date.now();

export function readStore(): CharacterStore {
  const saved = loadStore();
  const charactersById: Record<string, Character> = {};
  for (const id of saved.characters) {
    const stored = (saved as Record<string, unknown>)[id];
    if (stored) charactersById[id] = stored as Character;
  }
  return { characters: saved.characters, active: saved.active, charactersById };
}

export function writeStore(store: CharacterStore): void {
  const saved = storageGet();
  saved.characters = store.characters;
  saved.active = store.active;
  for (const id of store.characters) saved[id] = store.charactersById[id];
  storageSave(saved);
}

export function withCharacterReplaced(store: CharacterStore, character: Character): CharacterStore {
  return { ...store, charactersById: { ...store.charactersById, [character.id]: character } };
}

export function withCharacterAdded(store: CharacterStore, character: Character): CharacterStore {
  const alreadyListed = store.characters.includes(character.id);
  return {
    characters: alreadyListed ? store.characters : [...store.characters, character.id],
    active: character.id,
    charactersById: { ...store.charactersById, [character.id]: character },
  };
}

export function withActiveCharacterRemoved(store: CharacterStore): CharacterStore {
  const remaining = store.characters.filter((id) => id !== store.active);
  const remainingById = { ...store.charactersById };
  delete remainingById[store.active];

  if (remaining.length > 0) {
    return { characters: remaining, active: remaining[remaining.length - 1], charactersById: remainingById };
  }

  const replacement = structuredClone(DEFAULT_CHARACTER);
  replacement.id = newCharacterId();
  return { characters: [replacement.id], active: replacement.id, charactersById: { [replacement.id]: replacement } };
}
