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
2. Abra o Obsidian → *Open folder as vault* → selecione a pasta raiz do projeto (as notas ficam em `vault/`; `src/` é ignorada)
3. Os wikilinks `[[Arquivo]]` e as seções `[[#Heading]]` funcionam nativamente

---

## Estrutura do repositório

```
vampire-5e/
├── .github/workflows/deploy.yml   # Build do app e publicação no GitHub Pages
├── .obsidian/                     # Config do Obsidian (a raiz do repo é a vault)
├── src/                           # App React + Vite: ficha e vault web (ver src/README.md)
├── vault/                         # Conteúdo em Markdown
│   ├── Mecânicas/                 # Regras (é o que a vault web publica)
│   ├── Lore/                      # Lore e cidades
│   ├── Narração/                  # Ferramentas de mesa
│   ├── Aventuras/                 # Módulos
│   ├── Personagens/ + Personagens.md
│   └── bibliografia/              # Livros em .txt, imagens, PDFs (só locais)
└── CLAUDE.md                      # Instruções para usar o Claude Code como consultor de regras
```

O site é publicado automaticamente a cada push na `main`. Editar um `.md` em `vault/Mecânicas/`
atualiza a vault online no próximo deploy.

### Usando com o Claude Code
Abra o Claude Code na raiz do repositório e pergunte direto ("como funciona Blood Surge?",
"monte um NPC Tzimisce para Nova York"). O `CLAUDE.md` orienta o Claude a consultar a vault e
conferir nos livros.

---

## Agradecimentos

Dedico este projeto ao site do Demiplane e sua IMPLEMENTAÇÃO HEDIONDA DO VAMPIRO 5E (Nunca mais vou usar btw), que despertou o sentimento em mim de querer fazer algo a respeito e aprender algo no caminho. (Valeu Zamora que fez a vault original que eu modifiquei).

---

## Disclaimer

Este é um projeto pessoal de fã, criado exclusivamente para uso em mesa privada e fins de portfólio. Não é afiliado, endossado ou licenciado pela **Paradox Interactive AB** ou pela **White Wolf Publishing**.

*Vampire: The Masquerade*, o logotipo da **World of Darkness**, todos os nomes de clãs, disciplinas e demais termos do sistema são marcas registradas de Paradox Interactive AB. Todo o material de regras e lore referenciado neste repositório pertence aos seus respectivos detentores de direito.

Nenhum conteúdo oficial é redistribuído neste repositório — os arquivos compilados constituem resumos, anotações e reescritas para referência rápida de mesa, nos termos de uso justo / fair use para fins não comerciais e educacionais.
