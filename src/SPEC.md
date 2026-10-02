# VTM 5e — Ficha & Vault · Spec

App estático (React + TypeScript + Vite) publicado no GitHub Pages pelo workflow
`.github/workflows/deploy.yml`. Sem backend: cada jogador guarda os próprios personagens
no `localStorage` do navegador.

O build gera duas páginas:

| Página | Entrada | URL publicada |
| --- | --- | --- |
| Ficha de personagem | `index.html` → `app/main.tsx` | `/vampire-5e/` |
| Vault (regras) | `vault/index.html` → `app/vault/main.tsx` | `/vampire-5e/vault/` |

---

## Estrutura

```
src/
  index.html, vault/index.html      entradas do Vite (multi-page)
  vite.config.ts                    plugin `vault-sections` + entradas
  scripts/vaultSections.ts          conversão .md (Obsidian) → HTML, roda no build
  app/
    App.tsx, main.tsx, sheet.css    ficha
    ankh/                           aba Mechanics: layout em volta do ankh (desktop e mobile)
    components/                     Nav, narrative/, manual/, modals/, shared/
    tabs/                           MechanicsTab, NarrativeTab, RefTab, ManualTab
    context/                        CharacterContext, characterStore, characterFiles, ConfirmContext, storage
    types/character.ts              schema do personagem
    data/                           disciplines.json, advantages.json, bp.json, defaultCharacter.ts, creationPrompt.ts
    vault/                          VaultApp.tsx, highlight.ts, vault.css
```

---

## Ficha

### Navegação
Barra fixa com as abas **Mechanics · Narrative · Ref · Manual** (em telas pequenas viram uma
gaveta lateral via ☰) e as ações: trocar personagem (▾), novo (＋), deletar (🗑), Vault,
modo de edição (✏), exportar (⬆), importar (⬇).

### Modo de edição
- Ligado/desligado pelo ✏; aplica `body.edit-mode`, que mostra todos os controles de edição.
- Campos de texto viram `contentEditable` e salvam ao perder o foco.
- Valores numéricos ganham `+`/`−`; listas ganham `＋` no título e `×` em cada item.
- Exclusões pedem confirmação (exceto pools de dados).
- Trackers e Resonance funcionam sempre, sem modo de edição. XP também é sempre editável.

### Aba Mechanics
Layout em volta do símbolo do ankh. O ankh é uma "janela" recortada na imagem de fundo
(a mesma foto do fundo, sem o blur), com o retrato do personagem dentro do laço ou, sem
retrato, o ícone do clã (game-icons.net, CC BY 3.0).

- **Desktop (> 820px):** palco fixo de 1440px, escalado para caber na largura. O texto abraça
  o contorno do ankh (tabela de meia-largura em `ankh/geometry.ts`). Esquerda: atributos e
  perícias. Direita: dados do personagem, sangue (geração + Blood Potency), disciplinas e poderes,
  advantages, flaws, inventário e cola para dados. Trackers no braço do ankh.
- **Mobile (≤ 820px):** cabo do ankh no topo com o retrato, nome, dados em 2 colunas, sangue,
  seção Estado (trackers), lâmina com atributos | disciplinas, depois perícias, vantagens,
  inventário e cola para dados.
- **Janelas de detalhe:** clicar numa perícia ou num poder abre uma janela ao lado (no mobile,
  uma gaveta embaixo) com o texto do Core quando disponível (Stealth p.164 e os poderes do Khalil)
  ou o resumo da vault / dados da ficha.
- **Aparência (modo de edição):** enviar/trocar/remover retrato (salvo como JPEG reduzido no
  personagem, campo `portrait`) e escolher um dos 5 fundos (`backdrop`).
- Atributos 1–5, skills 0–5 com especialidade, advantages/flaws com nível limitado pelo `maxLevel`
  de `advantages.json`. Disciplinas: adicionar (busca), nível 1–5, adicionar poder (só poderes com
  nível ≤ nível da disciplina).
- **Cola para dados:** pools salvos (atributo + skill + especialidade opcional (+1) + disciplina
  opcional), com a fórmula e o total calculados a partir da ficha atual.
- **Trackers:**

| Tracker | Caixas | Estados | Edição |
|---|---|---|---|
| Health / Willpower | `healthMax` / `willpowerMax` (1–15) | vazio → superficial → agravado | `+`/`−` no tamanho |
| Hunger | 5 | vazio ↔ cheio | — |
| Humanity | 10 | cheias = Humanidade; Stains preenchem as vazias da direita | `+`/`−` no valor |
| Blood Potency | 10 | cheias = BP | clique só em edição |

  O bloco de sangue mostra os efeitos do nível atual (`bp.json`) e o máximo pela geração.

### Aba Narrative
- **Convictions** (até 5) e **Touchstones** (nome, resumo, convicção vinculada, descrição).
  A convicção vinculada é escolhida num select no modo de edição; o vínculo é pelo texto.
- **Mechanical Reference:** três cartões (Bane, Compulsão, Predator). **Hoje são texto fixo
  do Khalil (Nosferatu / Paranoia / Alleycat)** — derivar do clã exige um arquivo de dados
  por clã que ainda não existe.
- **Background:** texto livre.
- **Languages** e **Notes:** texto livre (saíram da aba Mechanics).

### Aba Ref
Referência estática: tipos de dano, efeitos de Fome, Rouse Checks, Frenzy, Resonance,
Blood Potency por geração, armas e defesas, criação de personagem, dificuldades.

### Aba Manual
Como usar a ficha e um prompt de criação de personagem para colar no claude.ai, que devolve
um JSON importável.

### Persistência

```json
{
  "characters": ["khalil", "char_1790000000000"],
  "active": "khalil",
  "khalil": { "...": "objeto do personagem" }
}
```

Chave `localStorage['vtm5e']`. O schema completo do personagem está em
`src/types/character.ts` e o exemplo em `src/data/defaultCharacter.ts`. Estados das caixas de
dano: `0` vazio, `1` superficial, `2` agravado. Exportar baixa o personagem ativo como `.json`;
importar adiciona (ou substitui, se o `id` já existir) e ativa.

---

## Vault web

- Conteúdo gerado no build a partir de `../vault/Mecânicas/*.md` (lista e ordem em
  `VAULT_NOTES`, em `scripts/vaultSections.ts`). Em `npm run dev`, editar um `.md` recarrega a página.
- Wikilinks viram links para a seção/subtítulo certo; links para notas fora da vault web
  aparecem como texto (`.wiki-ref`). Imagens embutidas e blocos `table-of-contents` são omitidos;
  linhas só de tags são removidas; `==destaque==` vira negrito.
- Barra lateral com a seção ativa, busca com destaque dos termos e contagem de seções.

---

## Fora do escopo (por enquanto)

- Bane/Compulsão/Predator derivados do clã e do predator type
- Validação de custo de XP
- Sincronização entre dispositivos
- Lore, Narração e Aventuras na vault web (só Mecânicas hoje)
