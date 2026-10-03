import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { buildVaultSections } from './scripts/vaultSections.ts'
import type { VaultSection } from './scripts/vaultSections.ts'

const projectDir = path.dirname(fileURLToPath(import.meta.url))
const vaultDir = path.resolve(projectDir, '../vault')
const INDEX_MODULE = 'virtual:vault-index'
const SEARCH_MODULE = 'virtual:vault-search'
const NOTE_MODULE_PREFIX = 'virtual:vault-note/'
const RESOLVED_PREFIX = '\0'

function noteLoaderLines(sections: VaultSection[]): string {
  return sections.map((section) => `  ${JSON.stringify(section.id)}: () => import(${JSON.stringify(NOTE_MODULE_PREFIX + section.id)}),`).join('\n')
}

function indexModule(sections: VaultSection[]): string {
  const entries = sections.map((section) => ({ id: section.id, title: section.title, group: section.group, label: section.label, audience: section.audience, part: section.part }))
  return [
    `export const entries = ${JSON.stringify(entries)};`,
    `const noteLoaders = {\n${noteLoaderLines(sections)}\n};`,
    'export const loadNote = (id) => noteLoaders[id]().then((module) => module.default);',
    `export const loadSearchText = () => import(${JSON.stringify(SEARCH_MODULE)}).then((module) => module.default);`,
  ].join('\n')
}

function vaultNotes(): Plugin {
  let sections: VaultSection[] | null = null
  const currentSections = () => (sections ??= buildVaultSections(vaultDir))

  return {
    name: 'vault-notes',
    resolveId(id) {
      const isVaultModule = id === INDEX_MODULE || id === SEARCH_MODULE || id.startsWith(NOTE_MODULE_PREFIX)
      return isVaultModule ? RESOLVED_PREFIX + id : undefined
    },
    load(id) {
      if (!id.startsWith(RESOLVED_PREFIX)) return
      const name = id.slice(RESOLVED_PREFIX.length)
      if (name === INDEX_MODULE) return indexModule(currentSections())
      if (name === SEARCH_MODULE) {
        const texts = Object.fromEntries(currentSections().map((section) => [section.id, { text: section.text, headings: section.headings }]))
        return 'export default ' + JSON.stringify(texts)
      }
      if (name.startsWith(NOTE_MODULE_PREFIX)) {
        const section = currentSections().find((candidate) => candidate.id === name.slice(NOTE_MODULE_PREFIX.length))
        return section ? 'export default ' + JSON.stringify(section.html) : undefined
      }
    },
    configureServer(server) {
      server.watcher.add(vaultDir)
      server.watcher.on('change', (file) => {
        const isVaultNote = file.startsWith(vaultDir) && file.endsWith('.md')
        if (!isVaultNote) return
        sections = null
        for (const moduleId of server.moduleGraph.idToModuleMap.keys()) {
          if (!moduleId.startsWith(RESOLVED_PREFIX + 'virtual:vault-')) continue
          const vaultModule = server.moduleGraph.getModuleById(moduleId)
          if (vaultModule) server.moduleGraph.invalidateModule(vaultModule)
        }
        server.ws.send({ type: 'full-reload' })
      })
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), vaultNotes()],
})
