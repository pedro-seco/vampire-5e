# Vampiro: A Máscara 5e — Ficha & Vault

Ficha de personagem interativa e referência consolidada de regras para **Vampire: The Masquerade 5th Edition**, desenvolvidas como ferramenta de mesa pessoal.

**🔗 Demo ao vivo:** [pedro-seco.github.io/vampire-5e](https://pedro-seco.github.io/vampire-5e/)

---

## Ficha de Personagem

<!-- Adicionar screenshot aqui -->

SPA dark-theme responsiva para PC e mobile. Os dados do personagem ficam salvos no navegador (`localStorage`) — sem servidor, sem login.

**Funcionalidades:**
- Quatro seções navegáveis via menu hamburguer: **Mechanics**, **Narrative**, **Ref**, **Manual**
- Todos os campos editáveis in-place; modo de edição togglável
- Exportar / importar ficha em JSON
- Suporte a múltiplos personagens via seletor no nav
- Layout adapta para telas pequenas (mobile-first)

---

## Vault de Mecânicas

<!-- Adicionar screenshot da vault aqui -->

Base de conhecimento de regras acessível em [pedro-seco.github.io/vampire-5e/vault](https://pedro-seco.github.io/vampire-5e/vault/) ou localmente via Obsidian.

**Conteúdo compilado:**

| Área | O que tem |
|------|-----------|
| **Mecânicas** | Regras fundamentais, atributos, skills, disciplinas (todos os clãs + poderes nível 1–5), fome, frenzy, humanidade, geração, XP, predator types, resonance, dyscrasias |
| **Clãs** | Perfis completos dos 13 clãs + sangue fraco: compulsões, fraquezas, disciplinas, loresheets associadas |
| **O Sangue** | Diablerie, blood bond, ghouls, perigos do sangue |
| **Lore** | Kindred, Jyhad, Book of Nod, Camarilla, Anarquistas, Sabbat, Segunda Inquisição, cultos vampíricos |
| **Cidades** | Chicago by Night (2020), Fall of London (2020) |
| **Narração** | Guia do narrador, coteries, mapa de relacionamentos |
| **Aventuras** | Under the Skin (one-shot, ~3–5h) |
| **Loresheets** | +30 loresheets de 8 suplementos diferentes |

**Fontes incorporadas:**

- *V5 Core Rulebook* · *Camarilla* · *Anarch* · *The Black Hand*
- *Second Inquisition* · *Chicago by Night* · *Fall of London*
- *Companion* · *Player's Guide* · *Storyteller Toolkit*
- *Book of Nod Apocrypha* · *Under the Skin* · *Blood Sigils*
- *Children of the Blood* · *Forbidden Religions* · *Cults of the Blood Gods*

---

## Como usar (Narrador)

### Ficha online
Acesse [pedro-seco.github.io/vampire-5e](https://pedro-seco.github.io/vampire-5e/) em qualquer navegador. Clique em **✏ Editar** para habilitar os campos, preencha a ficha e use **⬆ Exportar** para salvar o JSON localmente. Para carregar em outra máquina, use **⬇ Importar**.

### Vault online
Acesse [pedro-seco.github.io/vampire-5e/vault](https://pedro-seco.github.io/vampire-5e/vault/) e use a barra de busca para filtrar seções por palavra-chave. O menu lateral lista todas as seções; em mobile, abre via ☰.

### Vault local (Obsidian)
1. Clone o repositório: `git clone https://github.com/pedro-seco/vampire-5e.git`
2. Abra o Obsidian → *Open folder as vault* → selecione a pasta raiz do projeto
3. Os wikilinks `[[Arquivo]]` e as seções `[[#Heading]]` funcionam nativamente

---

## Estrutura do repositório

```
vampire-5e/
├── docs/                    # GitHub Pages (ficha + vault)
│   ├── index.html           # Ficha de personagem (SPA)
│   ├── assets/css/          # sheet.css
│   ├── assets/js/           # sheet.js
│   └── vault/               # Vault web
│       ├── index.html
│       └── assets/
│           ├── css/vault.css
│           ├── js/vault.js
│           └── data/sections.js   # Conteúdo compilado (gerado)
├── Mecânicas/               # Markdown source — regras
├── Lore/                    # Markdown source — lore
├── Narração/                # Markdown source — ferramentas de mesa
├── Aventuras/               # Markdown source — módulos
├── Personagens/             # Fichas dos PCs em MD
└── bibliografia/            # Referências de fontes
```

---

## Agradecimentos

Dedico este projeto ao site do Demiplane e sua IMPLEMENTAÇÃO HEDIONDA DO VAMPIRO 5E (Nunca mais vou usar btw), que despertou o sentimento em mim de querer fazer algo a respeito e aprender algo no caminho. (Valeu Zamora que fez a vault original que eu modifiquei).

---

## Disclaimer

Este é um projeto pessoal de fã, criado exclusivamente para uso em mesa privada e fins de portfólio. Não é afiliado, endossado ou licenciado pela **Paradox Interactive AB** ou pela **White Wolf Publishing**.

*Vampire: The Masquerade*, o logotipo da **World of Darkness**, todos os nomes de clãs, disciplinas e demais termos do sistema são marcas registradas de Paradox Interactive AB. Todo o material de regras e lore referenciado neste repositório pertence aos seus respectivos detentores de direito.

Nenhum conteúdo oficial é redistribuído neste repositório — os arquivos compilados constituem resumos, anotações e reescritas para referência rápida de mesa, nos termos de uso justo / fair use para fins não comerciais e educacionais.
