# App — Ficha & Vault (React)

React + TypeScript + Vite. Uma só página (`index.html`) com a ficha de personagem e a vault
web como aba, cujo conteúdo é convertido dos `.md` em `../vault` no build, uma nota por chunk.
Spec completa em [`SPEC.md`](SPEC.md).

```
npm install
npm run dev      # http://localhost:5173 (ficha) · /#/vault (vault)
npm run build    # tsc -b && vite build → dist/
npm run lint
```

O deploy é automático: todo push na `main` roda `.github/workflows/deploy.yml`, que faz o build
e publica `dist/` no GitHub Pages. Configuração única no GitHub: *Settings → Pages → Source:
GitHub Actions*.

O código não tem comentários nem variáveis de uma letra: explicações ficam neste README, no
`SPEC.md` ou na mensagem de commit.

## A ficha

A aba Mechanics usa o layout do ankh (`app/ankh/`, CSS em `app/ankh/ankh.css`). As outras abas
são o port da ficha clássica em JS puro, com o mesmo visual: `app/sheet.css` é o CSS original, e
o markup segue o antigo porque o CSS depende de `body.edit-mode`, `[contenteditable="true"]` e
`:empty`. Os dados ficam em `localStorage['vtm5e']`, no mesmo formato de antes.

Dois bugs da versão antiga não foram reproduzidos:

- Ao ligar o modo de edição, especialidades, inventário, convicções e touchstones não ficavam
  editáveis até a lista ser redesenhada por outro motivo.
- Trocar de personagem com o modo de edição ligado gravava os campos do cabeçalho do personagem
  anterior por cima do novo.

## Mapa do código

| Pasta | O que é |
| --- | --- |
| `app/App.tsx`, `app/main.tsx` | Entrada da ficha: navegação e as quatro abas. |
| `app/tabs/` | Uma aba por arquivo: Mechanics, Narrative, Ref, Manual. |
| `app/ankh/` | Aba Mechanics: `AnkhSheet` escolhe `DesktopSheet` ou `MobileSheet`; `SheetItems` são as linhas editáveis; `geometry.ts`/`stage.ts` posicionam o texto pelo contorno do ankh; `backdrops/` são os fundos. |
| `app/components/narrative/` | Convicções, touchstones e cartões de referência. |
| `app/components/manual/` | Guia de uso e prompt de criação de personagem. |
| `app/components/modals/` | Modais de adicionar disciplina, poder, vantagem e de deletar personagem. |
| `app/components/shared/` | Peças reutilizadas: `Editable`, `Modal`, `SearchDropdown`, `PlusMinus` e utilitários. |
| `app/context/` | Estado do personagem: `CharacterContext` (React), `characterStore` (operações), `characterFiles` (importar/exportar), `storage` (localStorage). |
| `app/types/`, `app/data/` | Schema do personagem e dados de regras (disciplinas, vantagens, Blood Potency, prompt). |
| `app/vault/` | Aba da vault: `VaultTab` (lista lateral, uma nota por vez, busca), `route.ts` (rota por hash) e `highlight.ts`. |
| `scripts/vaultSections.ts` | Conversão das notas do Obsidian em HTML, usada pelo plugin do `vite.config.ts` (módulos virtuais `virtual:vault-index`, `vault-note/<id>` e `vault-search`). |
