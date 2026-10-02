import { useEffect, useRef } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { useConfirm } from '../context/ConfirmContext';
import { Editable } from '../components/shared/Editable';
import { selectAll } from '../components/shared/selectAll';

const MAX_CONVICTIONS = 5;
const toRoman = (n: number) => ['I', 'II', 'III', 'IV', 'V'][n - 1] || String(n);

function Convictions() {
  const { character, editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();
  const listRef = useRef<HTMLDivElement>(null);
  const focusLast = useRef(false);

  useEffect(() => {
    if (!focusLast.current) return;
    focusLast.current = false;
    const items = listRef.current?.querySelectorAll<HTMLElement>('.conv-text');
    const last = items?.[items.length - 1];
    if (last) { last.focus(); selectAll(last); }
  }, [character.convictions.length]);

  const add = () => {
    if (!editMode || character.convictions.length >= MAX_CONVICTIONS) return;
    focusLast.current = true;
    update((d) => { d.convictions.push('New conviction.'); });
  };

  return (
    <div>
      <div className="sh">
        Convictions
        <button className="sh-add" title="Add conviction" onClick={add}>＋</button>
      </div>
      <div id="convictions-list" ref={listRef}>
        {character.convictions.map((conv, i) => (
          <div className="conviction-item" key={i}>
            <span className="conv-num">{toRoman(i + 1)}</span>
            <Editable
              className="conv-text"
              value={conv}
              editable={editMode}
              onCommit={(v) => update((d) => { d.convictions[i] = v; })}
            />
            <button
              className="btn-delete"
              onClick={() => confirmDelete('Remove this conviction?', () => update((d) => { d.convictions.splice(i, 1); }))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Touchstones() {
  const { character, editMode, update } = useCharacter();
  const { confirmDelete } = useConfirm();

  const add = () => {
    if (!editMode) return;
    update((d) => { d.touchstones.push({ name: 'New Touchstone', summary: '', linkedConviction: '', description: '' }); });
  };

  return (
    <div>
      <div className="sh">
        Touchstones
        <button className="sh-add" title="Add touchstone" onClick={add}>＋</button>
      </div>
      <div id="touchstones-list">
        {character.touchstones.map((ts, i) => (
          <div className="touchstone-item" key={i}>
            <div>
              <Editable
                className="ts-name"
                value={ts.name}
                editable={editMode}
                onCommit={(v) => update((d) => { d.touchstones[i].name = v; })}
              />
              <Editable
                className="ts-summary"
                value={ts.summary}
                editable={editMode}
                onCommit={(v) => update((d) => { d.touchstones[i].summary = v; })}
              />
            </div>
            <span className="ts-link">
              {editMode ? (
                <select
                  style={{
                    background: 'var(--bg-dsc)', border: '1px solid var(--brd-s)', color: 'var(--acc)',
                    fontSize: 13, fontStyle: 'italic', padding: '2px 4px',
                  }}
                  value={character.convictions.includes(ts.linkedConviction) ? ts.linkedConviction : ''}
                  onChange={(e) => update((d) => { d.touchstones[i].linkedConviction = e.target.value; })}
                >
                  <option value="">— no conviction —</option>
                  {character.convictions.map((c, ci) => (
                    <option key={ci} value={c}>→ {c}</option>
                  ))}
                </select>
              ) : (
                ts.linkedConviction ? '→ ' + ts.linkedConviction : ''
              )}
            </span>
            <Editable
              as="div"
              className="ts-desc"
              value={ts.description}
              editable={editMode}
              onCommit={(v) => update((d) => { d.touchstones[i].description = v; })}
            />
            <button
              className="btn-delete"
              onClick={() => confirmDelete('Remove touchstone "' + ts.name + '"?', () => update((d) => { d.touchstones.splice(i, 1); }))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NarrativeTab() {
  const { character, editMode, update } = useCharacter();

  return (
    <div className="page">
      <div className="char-name-row" style={{ marginBottom: 4 }}>
        <span className="char-name" id="narr-char-name" style={{ fontSize: 20 }}>{character.name}</span>
      </div>
      <div className="hdeco" style={{ marginBottom: 6 }} />
      <div className="narr-subtitle-row">
        <span style={{ fontStyle: 'italic', color: 'var(--txt-m)', fontSize: 13 }} id="narr-aliases">{character.aliases}</span>
        <span className="narr-label">Narrative Aspects</span>
      </div>

      <div className="p2-grid">
        <Convictions />
        <Touchstones />
      </div>

      {/* Mechanical reference — static text, exactly as in the legacy sheet. */}
      <div className="sh">Mechanical Reference</div>
      <div className="three-cards">
        <div className="ref-card">
          <div className="ref-card-title">Clan Bane</div>
          <div id="card-bane">All Nosferatu carry the Repulsive flaw (−2 dice on appearance-based social rolls without active Obfuscate). Any attempt to pass as human — including Obfuscate — suffers a penalty equal to Bane Severity (−2 dice at BP 3).</div>
        </div>
        <div className="ref-card">
          <div className="ref-card-title">Compulsion — Paranoia (Hunger ≥ 4)</div>
          <div id="card-compulsion">The vampire must investigate and expose any hidden secret present in the scene before taking any other action. Lasts until a secret is revealed or Hunger drops below 4. Suppressing for one turn costs 1 Willpower.</div>
        </div>
        <div className="ref-card">
          <div className="ref-card-title" id="card-pred-title">Predator — Alleycat</div>
          <div id="card-predator">Attacks victims directly, feeding in the chaos of physical confrontation. Bonus: Celerity ● (Rapid Reflexes), 3 dots of criminal Contacts, specialty in Brawl (Grappling) or Intimidation (Stickups). Cost: −1 Humanity at creation.</div>
        </div>
      </div>

      <div className="sh">Background</div>
      <div className="background-block">
        <div className="background-title">Origin &amp; Embrace</div>
        <Editable
          as="div"
          id="background-text"
          value={character.background}
          editable={editMode}
          onCommit={(v) => update((d) => { d.background = v; })}
        />
      </div>
    </div>
  );
}
