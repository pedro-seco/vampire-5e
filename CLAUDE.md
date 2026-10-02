# VTM 5e — Vault & Ficha

Repositório de mesa de **Vampiro: A Máscara 5ª edição**: uma vault de regras e lore em
Markdown (Obsidian), as fontes oficiais em texto e um app web (ficha de personagem + vault online).

Quem usa este repositório no Claude Code costuma ser o **Narrador** ou um jogador
consultando regras, montando NPCs ou personagens e preparando sessões. **Responda em português.**

## Onde está cada coisa

| Caminho | Conteúdo |
| --- | --- |
| `vault/Mecânicas/` | Regras em PT-BR (resumos curados): dados, testes, dano, atributos, skills, clãs, disciplinas, fome, frenzy, humanidade, geração/Blood Potency, predator types, vantagens, loresheets, XP… |
| `vault/Lore/` | Kindred, seitas (Camarilla, Anarquistas, Sabbat), Segunda Inquisição, Book of Nod, cultos, Chicago, Londres |
| `vault/Narração/` | Guia do Narrador, coteries, mapa de relacionamentos, dicas |
| `vault/Aventuras/` | Under the Skin |
| `vault/Personagens/` | Fichas dos PCs em Markdown |
| `vault/bibliografia/*.txt` | **Texto integral** (em inglês) de 15 livros: Anarch, Blood Sigils, Camarilla, Chicago by Night, Children of the Blood, Companion, Cults of the Blood Gods, Fall of London, Forbidden Religions, Player's Guide, Sabbat: The Black Hand, Second Inquisition, Storyteller Toolkit, Book of Nod Apocrypha, Under the Skin |
| `vault/bibliografia/documentos/Vampire the Masquerade.pdf` | **Core Rulebook** (só PDF, só local — não está no git) |
| `src/` | App React (ficha + vault web). Ver `src/README.md` e `src/SPEC.md`. |

## Como responder perguntas de regra e lore

1. **Comece pela vault** (`vault/`). É rápida e já está em PT-BR, mas é um **resumo**: cobre só
   uma fração dos livros e **já teve erros** de regra.
2. **Para mecânica (custos, dados, poderes, valores), confira na fonte** antes de afirmar:
   - Suplementos: `grep` nos `.txt` de `vault/bibliografia/`.
   - Core Rulebook: extraia o PDF para texto uma vez numa pasta temporária
     (`pdftotext -layout "vault/bibliografia/documentos/Vampire the Masquerade.pdf" <tmp>/core.txt`)
     e busque nele. O Core é a fonte de: criação de personagem (p. ~137), tabela de XP (p. 137),
     Blood Potency (pp. 215–216), disciplinas (pp. ~243–280), combate (p. ~301).
3. **Cite a fonte** na resposta: livro + página quando houver, ou `arquivo:linha`.
4. Se a vault discordar do livro, **diga isso** e ofereça corrigir o `.md` — não corrija sem
   perguntar. O livro vale sobre a vault.
5. Ao montar personagens ou NPCs, siga as regras de criação do Core e diga o que é escolha
   sua versus regra. Coisas que o livro deixa ao Narrador ("usually", "at the Storyteller's
   discretion") devem ser apresentadas como tal.

Material de suplemento (Companion, Player's Guide etc.) só vale se a crônica permitir — pergunte
se não estiver claro.

## Editando a vault

- Mantenha a sintaxe do Obsidian: wikilinks `[[Nota]]`, `[[Nota#Seção|texto]]`, linha de tags
  no topo (`#rules #dice`), seção "Sumário" e o rodapé "Ver também".
- Escreva em PT-BR, mantendo os termos de jogo em inglês quando é assim que a vault já usa
  (Hunger, Rouse Check, Blood Potency, nomes de poderes).
- A vault online publica `vault/Mecânicas/` (lista em `src/scripts/vaultSections.ts`);
  qualquer edição lá aparece no site no próximo deploy da `main`.

## O app

Só mexa em `src/` se for pedido. Rodar localmente:

```
cd src
npm install
npm run dev     # ficha em http://localhost:5173, vault em /vault/
```

Build e deploy: push na `main` dispara `.github/workflows/deploy.yml` (GitHub Pages).
