import { useEffect, useState } from 'react';

export const VAULT_ROUTE_PREFIX = '#/vault';

export interface VaultRoute {
  noteId?: string;
  anchor?: string;
}

export const isVaultHash = (hash: string) => hash === VAULT_ROUTE_PREFIX || hash.startsWith(VAULT_ROUTE_PREFIX + '/');

export function parseVaultHash(hash: string): VaultRoute {
  if (!isVaultHash(hash)) return {};
  const [noteId, anchor] = hash.slice(VAULT_ROUTE_PREFIX.length + 1).split('/').map(decodeURIComponent);
  return { noteId: noteId || undefined, anchor: anchor || undefined };
}

export const noteHash = (noteId: string, anchor?: string) => `${VAULT_ROUTE_PREFIX}/${noteId}${anchor ? '/' + anchor : ''}`;

export function useVaultRoute(): VaultRoute {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  return parseVaultHash(hash);
}
