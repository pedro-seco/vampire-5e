import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { buildVaultSections } from './scripts/vaultSections.ts'

const projectDir = path.dirname(fileURLToPath(import.meta.url))
const vaultDir = path.resolve(projectDir, '../vault')
const VIRTUAL_MODULE = 'virtual:vault-sections'
const RESOLVED_VIRTUAL_MODULE = '\0' + VIRTUAL_MODULE

function vaultSections(): Plugin {
  return {
    name: 'vault-sections',
    resolveId: (id) => (id === VIRTUAL_MODULE ? RESOLVED_VIRTUAL_MODULE : undefined),
    load(id) {
      if (id !== RESOLVED_VIRTUAL_MODULE) return
      return 'export default ' + JSON.stringify(buildVaultSections(vaultDir))
    },
    configureServer(server) {
      server.watcher.add(vaultDir)
      server.watcher.on('change', (file) => {
        const isVaultNote = file.startsWith(vaultDir) && file.endsWith('.md')
        if (!isVaultNote) return
        const sectionsModule = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE)
        if (sectionsModule) server.moduleGraph.invalidateModule(sectionsModule)
        server.ws.send({ type: 'full-reload' })
      })
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), vaultSections()],
  build: {
    rollupOptions: {
      input: {
        ficha: path.resolve(projectDir, 'index.html'),
        vault: path.resolve(projectDir, 'vault/index.html'),
      },
    },
  },
})
