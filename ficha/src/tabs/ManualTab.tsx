import { useState } from 'react';

const CREATION_PROMPT = `You are a Vampire: The Masquerade 5th Edition character creation guide. Your job is to walk the player through building a new character step by step, then output a complete JSON they can import directly into their character sheet.

## Source books available for this chronicle
The following books are approved for character options:
- **V5 Core** (2018) — all base clans, core disciplines, predator types, advantages/flaws
- **Player's Guide** (2023) — additional predator types (Extortionist, Graverobber, Grim Reaper, Montero, Pursuer, Scene Queen, Trapdoor), expanded disciplines and merits
- **Companion** (2020) — Ravnos, Salubri, Tzimisce clans with full mechanics
- **Camarilla** (2018) — Camarilla faction options, loresheets
- **Anarch** (2018) — Anarch faction options, loresheets
- **Blood Sigils** (2023) — expanded Blood Sorcery rituals (levels 1–5)
- **Children of the Blood** (2021) — bloodline loresheets
- **Forbidden Religions** (2022) — cult/path backgrounds and loresheets
- **Cults of the Blood Gods** (2021) — religious faction options and loresheets

## How to proceed
Go through these phases **one at a time**. Present options, ask questions, wait for answers before moving on.

**Phase 1 — Concept:** name, aliases, mortal background, embrace (when/where), sire, current faction.
**Phase 2 — Clan & Generation:** present clans with disciplines/bane/compulsion; ask choice; generation default 13th.
**Phase 3 — Predator Type:** list all types (Core + PG) with mechanics; apply automatic bonuses/penalties.
**Phase 4 — Attributes:** explain 1/4/3/3 priority system; ask priority order and values for each attribute.
**Phase 5 — Skills:** 8/6/4 priority system; max 3 at creation; ask priority, values, and 3 specialties.
**Phase 6 — Disciplines:** 3 dots in clan disciplines; optionally 1 dot out-of-clan; list powers and ask choices.
**Phase 7 — Advantages & Flaws:** 7 dots; flaws give extra dots (max +2); list options, ask picks.
**Phase 8 — Trackers:** Humanity (7 adjusted by predator type), BP (1 or by generation), Health = Stamina+3, Willpower = Composure+Resolve.
**Phase 9 — Convictions & Touchstones:** 3 convictions (moral statements); 1–3 touchstones (mortal connections, each linked to a conviction).
**Phase 10 — Background & Languages:** origin paragraph; languages (1 dot Linguistics per additional language).
**Phase 11 — Review & JSON:** summarize sheet, ask for corrections, then output the complete JSON as a single code block.

## JSON output format
Output this exact structure with all 27 skill keys present:

\`\`\`json
{
  "id": "char_REPLACE_WITH_UNIX_TIMESTAMP",
  "name": "", "aliases": "", "clan": "", "generation": "13th",
  "predatorType": "", "faction": "", "embrace": "", "sire": "", "languages": "",
  "xpTotal": "", "xpSpent": "",
  "attributes": {
    "strength": 1, "dexterity": 1, "stamina": 1,
    "charisma": 1, "manipulation": 1, "composure": 1,
    "intelligence": 1, "wits": 1, "resolve": 1
  },
  "skills": {
    "athletics":{"value":0,"specialty":""},"brawl":{"value":0,"specialty":""},
    "craft":{"value":0,"specialty":""},"drive":{"value":0,"specialty":""},
    "firearms":{"value":0,"specialty":""},"larceny":{"value":0,"specialty":""},
    "melee":{"value":0,"specialty":""},"stealth":{"value":0,"specialty":""},
    "survival":{"value":0,"specialty":""},
    "animalKen":{"value":0,"specialty":""},"etiquette":{"value":0,"specialty":""},
    "insight":{"value":0,"specialty":""},"intimidation":{"value":0,"specialty":""},
    "leadership":{"value":0,"specialty":""},"performance":{"value":0,"specialty":""},
    "persuasion":{"value":0,"specialty":""},"streetwise":{"value":0,"specialty":""},
    "subterfuge":{"value":0,"specialty":""},
    "academics":{"value":0,"specialty":""},"awareness":{"value":0,"specialty":""},
    "finance":{"value":0,"specialty":""},"investigation":{"value":0,"specialty":""},
    "medicine":{"value":0,"specialty":""},"occult":{"value":0,"specialty":""},
    "politics":{"value":0,"specialty":""},"science":{"value":0,"specialty":""},
    "technology":{"value":0,"specialty":""}
  },
  "advantages": [{"name":"","level":1,"note":""}],
  "flaws": [{"name":"","level":1,"note":""}],
  "trackers": {
    "healthMax": 5, "health": [0,0,0,0,0],
    "willpowerMax": 5, "willpower": [0,0,0,0,0],
    "hunger": [0,0,0,0,0],
    "humanity": 7, "humanityStains": 0, "bp": 1, "resonance": ""
  },
  "disciplines": [{"name":"","level":1,"powers":[]}],
  "inventory": [], "convictions": [],
  "touchstones": [{"name":"","summary":"","linkedConviction":"","description":""}],
  "background": ""
}
\`\`\`

**Rules:** id = "char_" + current unix timestamp as integer. health array length = healthMax. willpower array length = willpowerMax. Skill keys are camelCase (animalKen not animal_ken). All 27 skill keys must be present.

Begin now with Phase 1.`;

export function ManualTab() {
  const [copyLabel, setCopyLabel] = useState('Copy');

  const copyPrompt = () => {
    navigator.clipboard
      .writeText(CREATION_PROMPT)
      .then(() => {
        setCopyLabel('Copied!');
        setTimeout(() => setCopyLabel('Copy'), 2000);
      })
      .catch(() => {
        setCopyLabel('Error');
        setTimeout(() => setCopyLabel('Copy'), 2000);
      });
  };

  return (
    <div className="page">
      <div className="manual-layout">
        <div className="manual-col">
          <div className="manual-page">
            <div className="manual-section">
              <div className="manual-section-title">How to Use This Sheet</div>

              <div className="manual-item">
                <div className="manual-item-title">▾ Switch Character</div>
                <p className="manual-text">Click the <strong>▾</strong> arrow next to the character name to open the character list. Click any name to switch. The sheet reloads with that character's data.</p>
              </div>

              <div className="manual-item">
                <div className="manual-item-title">＋ New Character</div>
                <p className="manual-text">Click the <strong>＋</strong> next to the character name. A blank sheet will be created. Switch to it using the ▾ dropdown and fill in the fields in Edit mode.</p>
              </div>

              <div className="manual-item">
                <div className="manual-item-title">✏ Edit Mode</div>
                <p className="manual-text">Click <strong>✏ Edit</strong> in the top right to unlock the sheet for editing. All text fields become editable. Numeric values (attributes, skills) show <strong>+</strong> and <strong>−</strong> buttons. Sections like Disciplines and Advantages show <strong>＋</strong> buttons to add new entries, and <strong>×</strong> to delete (a confirmation will appear). Click <strong>✏ Edit</strong> again to exit — changes are saved automatically.</p>
              </div>

              <div className="manual-item">
                <div className="manual-item-title">Trackers</div>
                <p className="manual-text">Tracker boxes are always interactive — no Edit mode needed. Click a box to cycle its state:</p>
                <div className="visual-aid" style={{ marginTop: 8 }}>
                  <span className="va-label">Health / Willpower</span>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 4 }}>
                    <div className="box" />
                    <span style={{ color: 'var(--txt-m)', fontSize: 12 }}>→ click →</span>
                    <div className="box superficial" />
                    <span style={{ color: 'var(--txt-m)', fontSize: 12 }}>→ click →</span>
                    <div className="box aggravated" />
                    <span style={{ color: 'var(--txt-m)', fontSize: 12 }}>→ click → empty</span>
                  </div>
                  <div className="va-annotation">Empty → Superficial (╲) → Aggravated (✕) → Empty</div>
                </div>
                <div className="visual-aid" style={{ marginTop: 8 }}>
                  <span className="va-label">Hunger</span>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 4 }}>
                    <div className="box" />
                    <span style={{ color: 'var(--txt-m)', fontSize: 12 }}>→ click →</span>
                    <div className="box hunger-on" />
                    <span style={{ color: 'var(--txt-m)', fontSize: 12 }}>→ click → empty</span>
                  </div>
                  <div className="va-annotation">Empty → Filled (✕) → Empty. Always 5 boxes.</div>
                </div>
                <div className="visual-aid" style={{ marginTop: 8 }}>
                  <span className="va-label">Humanity</span>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 4 }}>
                    <div className="box hum-filled" />
                    <div className="box hum-filled" />
                    <div className="box hum-filled" />
                    <div className="box" />
                    <div className="box stain" />
                    <div className="box stain" />
                  </div>
                  <div className="va-annotation">Red boxes = current Humanity value (left to right). Click empty boxes from the right to add Stains (╲ in orange). Edit mode: use + / − to change the Humanity value.</div>
                </div>
              </div>

              <div className="manual-item">
                <div className="manual-item-title">Export &amp; Import</div>
                <p className="manual-text"><strong>Export</strong> downloads your character as a <code>.json</code> file — keep it as a backup or send it to the Storyteller. <strong>Import</strong> loads a <code>.json</code> file and adds that character to your sheet. All data is stored in your browser's local storage; if you clear browser data, your characters will be lost — export regularly.</p>
              </div>

              <div className="manual-item">
                <div className="manual-item-title">Adding Disciplines</div>
                <p className="manual-text">In Edit mode, click <strong>＋</strong> next to Disciplines. Search for a discipline by name and confirm. Then click <strong>＋</strong> inside the discipline header to add powers — only powers at or below your current discipline level are available. To remove a power or a full discipline, click <strong>×</strong> and confirm.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="prompt-col">
          <div className="manual-page">
            <div className="manual-section">
              <div className="manual-section-title">Character Creation — Claude Prompt</div>
              <p className="manual-text" style={{ marginBottom: 12 }}>
                Copy the prompt below and paste it into a new conversation at{' '}
                <a href="https://claude.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>claude.ai</a>.
                Claude will guide you through building your character step by step and output a JSON file you can
                import directly into this sheet.
              </p>
              <div className="prompt-block">
                {/* Same surrounding whitespace the legacy markup had inside this pre-wrap block. */}
                {'\n' + CREATION_PROMPT + '\n    '}
                <button
                  className="prompt-copy-btn"
                  onClick={copyPrompt}
                  style={copyLabel === 'Copied!' ? { color: 'var(--gold)', borderColor: 'var(--gold)' } : undefined}
                >
                  {copyLabel}
                </button>
                {'\n    '}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
