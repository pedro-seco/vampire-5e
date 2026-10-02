# Ficha — VTM 5e (React)

Port em React + TypeScript + Vite da ficha clássica (`docs/index.html` + `sheet.js`).
O visual é o mesmo: `src/sheet.css` é cópia do `docs/assets/css/sheet.css` e o markup segue
o original, porque o CSS depende de `body.edit-mode`, `[contenteditable="true"]` e `:empty`.

Sem backend: os dados ficam em `localStorage['vtm5e']`, no mesmo formato da ficha antiga.
JSONs exportados por uma servem na outra.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build  → dist/
npm run lint
```

## Mapa do código

| Pasta | O que é |
| --- | --- |
| `context/` | Estado do personagem (`CharacterContext`, persistência em `storage.ts`) e confirmação de exclusão. |
| `types/`, `data/` | Schema e dados de referência (disciplinas, vantagens, Blood Potency), extraídos do `sheet.js`. |
| `tabs/` | Uma aba por arquivo: Mechanics, Narrative, Ref, Manual. |
| `components/mechanics/` | Blocos da aba Mechanics: cabeçalho, atributos/skills, vantagens, trackers, disciplinas, inventário, pools. |
| `components/shared/` | `Editable` (campo contentEditable), `Modal`, `SearchDropdown`. |

## Diferenças em relação à ficha antiga

Dois bugs da versão em JS puro não foram reproduzidos:

- Ao ligar o modo de edição, especialidades, inventário, convicções e touchstones não ficavam
  editáveis até a lista ser redesenhada por outro motivo. Aqui ficam editáveis na hora.
- Trocar de personagem com o modo de edição ligado gravava os campos do cabeçalho do personagem
  anterior por cima do novo. Aqui cada campo salva ao perder o foco, sem esse efeito.
