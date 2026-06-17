# VTM 5e Character Sheet — V1 Spec

## Overview

A static single-page web app hosted on GitHub Pages. Each player manages their own character sheet. Data persists via `localStorage`. No backend, no server, no cost.

---

## File Structure

```
docs/
  index.html                ← the entire app (SPA)
  assets/
    css/
      sheet.css
    js/
      sheet.js
    data/
      disciplines.json
      advantages.json
      bp.json
      predators.json
      items.json
```

---

## Global UI

### Navigation (sticky)
```
[Mecânica]  [Narrativa]  [Ref]  [Manual]        [Export]  [Import]
```

### Character controls (inside content header)
```
Character Name  ↓  ✏  ＋
◆──────────────────────────────────────────◆
```

| Control | Behavior |
|---|---|
| ↓ | Dropdown list of saved characters (searchable) |
| ✏ | Toggles edit mode |
| ＋ | Creates new blank character |
| Export | Downloads active character as `.json` |
| Import | Uploads a `.json`, adds to localStorage, switches to it |

### Edit Mode
- Toggled globally by ✏
- Fields become editable (contenteditable or inputs)
- Numeric fields show `+` / `−` controls
- Modular lists (disciplines, advantages, convictions, etc.) show `+` on section title and `×` on each item
- Deletions require confirmation
- Auto-saves to localStorage on every change

### localStorage Schema
```json
{
  "characters": ["khalil", "player2"],
  "active": "khalil",
  "khalil": { ...character object... }
}
```

---

## Character Object Schema

```json
{
  "name": "Khalil Mansour",
  "aliases": "\"O Dragomano\" · \"Ibn al-Zill\" · \"Oberon-7\"",
  "clan": "Nosferatu",
  "generation": "9th",
  "predatorType": "Alleycat",
  "faction": "Anarchist",
  "embrace": "1916 · Cairo",
  "sire": "al-Musawwir",
  "languages": "Arabic · French · Turkish · English",
  "xpTotal": null,
  "xpSpent": null,
  "attributes": {
    "strength": 2, "dexterity": 4, "stamina": 2,
    "charisma": 1, "manipulation": 3, "composure": 3,
    "intelligence": 2, "wits": 3, "resolve": 2
  },
  "skills": {
    "athletics": { "value": 1, "specialty": "" },
    "brawl": { "value": 3, "specialty": "" },
    "stealth": { "value": 4, "specialty": "Infiltration" }
  },
  "advantages": [
    { "name": "Contacts", "type": 1, "level": 3, "note": "Criminal" }
  ],
  "flaws": [
    { "name": "Adversary", "type": -1, "level": 2, "note": "Sire" }
  ],
  "trackers": {
    "healthMax": 5,
    "health": [0, 0, 0, 0, 0],
    "willpowerMax": 5,
    "willpower": [0, 0, 0, 0, 0],
    "hunger": [0, 0, 0, 0, 0],
    "humanity": 5,
    "humanityStains": 0,
    "bp": 3,
    "resonance": ""
  },
  "disciplines": [
    {
      "name": "Animalism",
      "level": 3,
      "powers": ["Bond Famulus", "Feral Whispers", "Unliving Hive"]
    }
  ],
  "inventory": ["Knife", "Burner phone"],
  "convictions": [
    "Never leave a trace.",
    "Dead men fix nothing.",
    "Distrust anyone who asks you to do what they wouldn't do themselves."
  ],
  "touchstones": [
    {
      "name": "Peter Hollis",
      "summary": "†1953 · Spy · MI6",
      "linkedConviction": "Never leave a trace.",
      "description": "..."
    }
  ],
  "background": "Born in 1883 in Damascus..."
}
```

Tracker box states: `0` = empty, `1` = superficial `\`, `2` = aggravated `X`.

---

## Tab: Mecânica

### Header block
- Character name (large, Cinzel Decorative)
- Aliases (italic subtitle, same line or just below)
- Meta row: `Clan · Generation · Predator Type · Faction · Embrace · Sire · Languages` + `XP Total / XP Spent`
- Layout: `justify-content: space-between`
- All fields editable in edit mode

### Attributes & Skills
- 4 columns: Physical · Social · Mental · Advantages+Flaws
- Attributes: values 0–5, `+`/`−` in edit mode
- Skills: values 0–5, `+`/`−` in edit mode
  - Zeroed skills appear visually muted
  - Specialty field appears inline when value > 0; editable in edit mode
- Advantages: dropdown (searchable, from `advantages.json`), value `+`/`−`, max from JSON
- Flaws: same dropdown, `type: -1` entries only
- 4th column has internal scroll if content overflows

### Trackers
Always interactive (no edit mode required to mark boxes).

| Tracker | Boxes | States | Direction | Edit mode |
|---|---|---|---|---|
| Health | manual (no auto-calc) | empty / `\` / `X` | left → right | resize with `+`/`−` |
| Willpower | manual (no auto-calc) | empty / `\` / `X` | left → right | resize with `+`/`−` |
| Hunger | 5 (fixed) | empty / `X` | left → right | — |
| Humanity | 1–10 (editable) | filled red / empty | value left → right | edit value with `+`/`−` |
| Humanity Stains | on empty boxes | `\` (distinct color) | right → left | always interactive |
| Blood Potency | 1–10 | filled red | — | clickable only in edit mode |

**Resonance:** inline radio buttons (button style), always interactive, values: `Sanguine · Choleric · Melancholic · Phlegmatic · Empty`.

**BP card** auto-populates stats from `bp.json` based on current BP value.

### Disciplines
- Single column
- Edit mode: `+` on section title → "Add Discipline" (searchable dropdown)
- Per discipline: `+` → "Add Power" (searchable dropdown, filtered to level ≤ discipline level)
- Powers pre-mapped in `disciplines.json`
- Constraint: power level ≤ discipline level (only rule enforced)
- `×` with confirmation to remove power or discipline

### Inventory
- Simple list below Disciplines
- Edit mode: `+` on title adds blank text line
- `×` with confirmation to delete item
- No columns, no data lookup — free text only

---

## Tab: Narrativa

Primarily a reading tab. Edit mode available but lighter than Mecânica.

### Header
- Same name + aliases as Mecânica tab

### Convictions + Touchstones
- Asymmetric 2-column layout: `1fr 2fr`
- **Convictions:** up to 5, free text. `+` on title to add, `×` with confirmation to delete.
- **Touchstones:** modular. `+` on title to add. Each entry has:
  - Name
  - Quick summary (short subtitle)
  - Linked conviction (dropdown of existing convictions)
  - Description (long text)
  - If linked conviction is deleted → field goes blank, no block

### Mechanical Reference
3 cards (read-only display, populated from character data):
- Clan Bane
- Compulsion (triggered at Hunger ≥ 4)
- Predator Type (pool from `predators.json`)

### Background
Free text block, editable in edit mode.

---

## Tab: Ref

Static content, no interactivity. All data from rulebook.

- Damage legend (`\` superficial · `X` aggravated)
- What causes aggravated vs. superficial damage
- Weapons & defenses table (from `items.json`)
- Common dice pools / difficulties
- Hunger effects by level
- Rouse Check rules
- Resonance table (humors and what activates them)
- Frenzy types + how a character contracts a compulsion
- Blood Potency by generation table
- Character creation (costs, specialties, Jack of All Trades)

---

## Tab: Manual

### How to use the app
- Switch characters (↓)
- Edit mode (✏) — what becomes editable and where
- Create new character (＋)
- Export / Import
- Tracker states (cycle behavior)
- Visual aids: annotated snippets of each editable section

### Character Creation Prompt
- Copyable prompt template for Claude.ai
- Guides the player through character creation via chat
- Claude outputs a JSON matching the character schema → player imports into the sheet
- **Note:** placeholder in V1. Prompt will be written after vault is complete — no fixed timeline.

---

## Data File Schemas

### `disciplines.json`
```json
[
  {
    "name": "Bond Famulus",
    "discipline": "Animalism",
    "level": 1,
    "pool": "—",
    "cost": "Free",
    "duration": "Permanent",
    "description": "...",
    "requirements": null
  }
]
```
`requirements`: amalgam prereqs (e.g. `"Obfuscate 2"`), or `null`.
`pool`: dice pool string (e.g. `"Manipulation + Animalism"`), or `"—"` for passive powers.

### `advantages.json`
```json
[
  {
    "name": "Contacts",
    "type": 1,
    "maxLevel": 5,
    "description": "Lvl 1: ... Lvl 2: ..."
  }
]
```
`type: 1` advantage · `type: -1` flaw.

### `bp.json`
```json
[
  {
    "level": 3,
    "bloodSurge": "+2 dice",
    "damageHealed": "2 Superficial",
    "disciplineBonus": "None",
    "rouseRoll": "Level 2 and below",
    "bane": 2,
    "penalty": "Animal/bagged: no Hunger reduction"
  }
]
```

### `predators.json`
```json
[
  {
    "name": "Alleycat",
    "pool": "Dexterity + Brawl",
    "description": "..."
  }
]
```

### `items.json`
```json
[
  {
    "name": "Knife",
    "description": "...",
    "bonus": "+1 die"
  }
]
```

---

## Out of Scope (V1)

- XP cost tracking / level-up validation
- Mobile layout (desktop-first)
- Multi-device sync
- Clan-specific compulsion cards (covered in Ref tab generically)
- Print button
- Session Notes

---

## Dependencies

- Vault completion → context summary → Claude prompt template (Manual tab)
- `disciplines.json` populated → Disciplines section functional
- `advantages.json` populated → Advantages section functional
- `bp.json` populated → BP card auto-display functional
- `predators.json` populated → Predator Type field + pool display functional
- `items.json` populated → Ref tab weapons table + inventory lookup functional
