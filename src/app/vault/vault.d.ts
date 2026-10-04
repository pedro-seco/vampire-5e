declare module 'virtual:vault-index' {
  export interface VaultEntry {
    id: string;
    title: string;
    group?: string;
    label?: string;
    audience: 'jogador' | 'narrador';
    part: 'base' | 'catalogo' | 'lore' | 'extras' | 'aventura';
  }

  export const entries: VaultEntry[];
  export function loadNote(id: string): Promise<string>;
  export interface VaultSearchEntry {
    text: string;
    headings: { id: string; text: string }[];
  }
  export function loadSearchText(): Promise<Record<string, VaultSearchEntry>>;
}
