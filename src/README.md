# App — Ficha & Vault (React)

React + TypeScript + Vite. Gera duas páginas: a ficha de personagem (`index.html`) e a vault
web (`vault/index.html`), cujo conteúdo é convertido dos `.md` em `../vault` no build.
Spec completa em [`SPEC.md`](SPEC.md).

```
npm install
npm run dev      # http://localhost:5173 (ficha) · /vault/ (vault)
npm run build    # tsc -b && vite build → dist/
npm run lint
```

O deploy é automático: todo push na `main` roda `.github/workflows/deploy.yml`, que faz o build
e publica `dist/` no GitHub Pages.

## A ficha

Port da ficha clássica em JS puro, com o mesmo visual: `src/sheet.css` é o CSS original, e o
markup segue o antigo porque o CSS depende de `body.edit-mode`, `[contenteditable="true"]` e
`:empty`. Os dados ficam em `localStorage['vtm5e']`, no mesmo formato de antes.

Dois bugs da versão antiga não foram reproduzidos:

- Ao ligar o modo de edição, especialidades, inventário, convicções e touchstones não ficavam
  editáveis até a lista ser redesenhada por outro motivo.
- Trocar de personagem com o modo de edição ligado gravava os campos do cabeçalho do personagem
  anterior por cima do novo.

## Mapa do código

| Pasta | O que é |
| --- | --- |
| `src/context/` | Estado do personagem (`CharacterContext`, persistência em `storage.ts`) e confirmação de exclusão. |
| `src/types/`, `src/data/` | Schema e dados de referência (disciplinas, vantagens, Blood Potency). |
| `src/tabs/` | Uma aba por arquivo: Mechanics, Narrative, Ref, Manual. |
| `src/components/mechanics/` | Blocos da aba Mechanics: cabeçalho, atributos/skills, vantagens, trackers, disciplinas, inventário, pools. |
| `src/components/shared/` | `Editable` (campo contentEditable), `Modal`, `SearchDropdown`. |
| `src/vault/` | Página da vault web (`VaultApp`). |
| `scripts/vaultSections.ts` | Conversão Obsidian → HTML usada pelo plugin `vault-sections` do `vite.config.ts`. |
