import type { Store } from '../types/character';
import { DEFAULT_CHARACTER } from '../data/defaultCharacter';

const STORAGE_KEY = 'vtm5e';

export function storageGet(): Partial<Store> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function storageSave(store: Partial<Store>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function loadStore(): Store {
  const store = storageGet();
  if (store.characters && store.characters.length > 0) return store as Store;

  const fresh: Store = {
    characters: [DEFAULT_CHARACTER.id],
    active: DEFAULT_CHARACTER.id,
    [DEFAULT_CHARACTER.id]: structuredClone(DEFAULT_CHARACTER),
  };
  storageSave(fresh);
  return fresh;
}
