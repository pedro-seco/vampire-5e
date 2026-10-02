import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { buildVaultSections } from './scripts/vaultSections.ts'

const root = path.dirname(fileURLToPath(import.meta.url))
const VAULT_DIR = path.resolve(root, '../vault')
const VIRTUAL_ID = 'virtual:vault-sections'
const RESOLVED_ID = '\0' + VIRTUAL_ID

/** Serves the .md notes in ../vault, converted to HTML, as `virtual:vault-sections`. */
function vaultSections(): Plugin {
  return {
    name: 'vault-sections',
    resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),
    load(id) {
      if (id !== RESOLVED_ID) return
      return 'export default ' + JSON.stringify(buildVaultSections(VAULT_DIR))
    },
    configureServer(server) {
      server.watcher.add(VAULT_DIR)
      server.watcher.on('change', (file) => {
        if (!file.startsWith(VAULT_DIR) || !file.endsWith('.md')) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      })
    },
  }
}

// https://vite.dev/config/
// base './' keeps asset paths relative, so the build works under GitHub Pages
// (/vampire-5e/) as well as opened from any folder.
export default defineConfig({
  base: './',
  plugins: [react(), vaultSections()],
  build: {
    rollupOptions: {
      input: {
        ficha: path.resolve(root, 'index.html'),
        vault: path.resolve(root, 'vault/index.html'),
      },
    },
  },
})
