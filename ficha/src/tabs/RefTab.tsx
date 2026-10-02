/** Static rules reference — content identical to the legacy sheet's Ref tab. */
export function RefTab() {
  return (
    <div className="page">
      <div className="ref-page">
        <div className="ref-section">
          <div className="ref-section-title">Damage Types</div>
          <p className="ref-note"><strong>╲ Superficial</strong> — Reduced by half (rounded up) before applying to track. Healed with a Rouse Check.</p>
          <p className="ref-note"><strong>✕ Aggravated</strong> — Applied in full. Requires three Rouse Checks and a full day's rest to heal one box.</p>
          <p className="ref-note" style={{ marginTop: 6 }}><strong>Superficial sources:</strong> punches, kicks, falls, most firearms, staking (to vampires).</p>
          <p className="ref-note"><strong>Aggravated sources:</strong> fire, sunlight, claws/fangs of supernatural creatures, specific Discipline powers, decapitation.</p>
        </div>

        <div className="ref-section">
          <div className="ref-section-title">Hunger Effects</div>
          <table className="ref-table">
            <thead><tr><th>Level</th><th>Effect</th></tr></thead>
            <tbody>
              <tr><td className="t-val">1</td><td>No penalty.</td></tr>
              <tr><td className="t-val">2</td><td>−1 die on Rouse Checks that could be re-rolled.</td></tr>
              <tr><td className="t-val">3</td><td>Bestial Failure possible on any roll.</td></tr>
              <tr><td className="t-val">4</td><td>Clan Compulsion activates. Messy Critical possible.</td></tr>
              <tr><td className="t-val">5</td><td>Frenzy test required whenever provoked. Bestial Failure replaces all failures.</td></tr>
            </tbody>
          </table>
        </div>

        <div className="ref-section">
          <div className="ref-section-title">Rouse Checks</div>
          <p className="ref-note">Roll one die. On a <strong>failure (1–5)</strong>: Hunger increases by 1. On a <strong>success (6–10)</strong>: no change.</p>
          <p className="ref-note">At <strong>BP 3+</strong>, you may re-roll Rouse Checks for powers of level 2 and below — take the better result.</p>
          <p className="ref-note"><strong>Starvation:</strong> if Hunger would exceed 5, the vampire enters immediate Frenzy (Hunger Frenzy).</p>
        </div>

        <div className="ref-section">
          <div className="ref-section-title">Frenzy Types</div>
          <table className="ref-table">
            <thead><tr><th>Type</th><th>Trigger</th><th>Diff</th></tr></thead>
            <tbody>
              <tr><td className="t-name">Hunger Frenzy</td><td>Hunger 5 + smell of blood, or Hunger would exceed 5</td><td className="t-val">3</td></tr>
              <tr><td className="t-name">Terror Frenzy</td><td>Exposed to fire or sunlight</td><td className="t-val">3</td></tr>
              <tr><td className="t-name">Rage Frenzy</td><td>Provocation, humiliation, or physical attack</td><td className="t-val">2</td></tr>
            </tbody>
          </table>
          <p className="ref-note" style={{ marginTop: 6 }}>Resist with <strong>Composure + Resolve</strong> vs. Difficulty. Failure = Beast takes control.</p>
          <p className="ref-note"><strong>Compulsion:</strong> triggered by Messy Critical or Bestial Failure. The clan-specific compulsion applies for the rest of the scene. Suppressing for one turn costs 1 Willpower.</p>
        </div>

        <div className="ref-section">
          <div className="ref-section-title">Resonance</div>
          <table className="ref-table">
            <thead><tr><th>Resonance</th><th>Emotion / State</th><th>Disciplines</th></tr></thead>
            <tbody>
              <tr><td className="t-name">Sanguine</td><td>Desire, lust, passion</td><td className="t-acc">Celerity, Presence</td></tr>
              <tr><td className="t-name">Choleric</td><td>Anger, violence, hatred</td><td className="t-acc">Potence, Celerity</td></tr>
              <tr><td className="t-name">Melancholic</td><td>Fear, sorrow, loneliness</td><td className="t-acc">Fortitude, Obfuscate</td></tr>
              <tr><td className="t-name">Phlegmatic</td><td>Calm, lethargy, apathy</td><td className="t-acc">Auspex, Dominate</td></tr>
              <tr><td className="t-name">Empty</td><td>No strong emotion</td><td>—</td></tr>
            </tbody>
          </table>
        </div>

        <div className="ref-section">
          <div className="ref-section-title">Blood Potency by Generation</div>
          <table className="ref-table">
            <thead><tr><th>Generation</th><th>Max BP</th><th>Starting BP</th></tr></thead>
            <tbody>
              <tr><td className="t-name">16th–14th (Thin-blood)</td><td className="t-val">0</td><td className="t-val">0</td></tr>
              <tr><td className="t-name">13th</td><td className="t-val">1</td><td className="t-val">1</td></tr>
              <tr><td className="t-name">12th–11th</td><td className="t-val">2</td><td className="t-val">1</td></tr>
              <tr><td className="t-name">10th</td><td className="t-val">3</td><td className="t-val">1</td></tr>
              <tr><td className="t-name">9th</td><td className="t-val">4</td><td className="t-val">2</td></tr>
              <tr><td className="t-name">8th</td><td className="t-val">5</td><td className="t-val">3</td></tr>
              <tr><td className="t-name">7th</td><td className="t-val">6</td><td className="t-val">4</td></tr>
              <tr><td className="t-name">6th</td><td className="t-val">7</td><td className="t-val">5</td></tr>
              <tr><td className="t-name">5th</td><td className="t-val">8</td><td className="t-val">6</td></tr>
            </tbody>
          </table>
        </div>

        <div className="ref-section">
          <div className="ref-section-title">Weapons &amp; Defenses</div>
          <table className="ref-table">
            <thead><tr><th>Item</th><th>Bonus</th><th>Notes</th></tr></thead>
            <tbody id="ref-items-table">
              <tr><td className="t-name">Unarmed</td><td className="t-val">—</td><td>Superficial to vampires</td></tr>
              <tr><td className="t-name">Knife / Stake</td><td className="t-val">+1 die</td><td>Stake through heart: torpor</td></tr>
              <tr><td className="t-name">Sword / Axe</td><td className="t-val">+2 dice</td><td>—</td></tr>
              <tr><td className="t-name">Pistol</td><td className="t-val">+2 dice</td><td>Superficial to vampires</td></tr>
              <tr><td className="t-name">Rifle / Shotgun</td><td className="t-val">+3 dice</td><td>Superficial to vampires</td></tr>
              <tr><td className="t-name">Light Armor</td><td className="t-val">1 die armor</td><td>Protects vs. physical</td></tr>
              <tr><td className="t-name">Heavy Armor</td><td className="t-val">2 dice armor</td><td>−1 die to Dex rolls</td></tr>
            </tbody>
          </table>
        </div>

        <div className="ref-section">
          <div className="ref-section-title">Character Creation</div>
          <p className="ref-note"><strong>Attributes:</strong> Distribute 1/4/3/3 across Physical/Social/Mental (or any priority order). All start at 1.</p>
          <p className="ref-note"><strong>Skills:</strong> Distribute 8/6/4 across categories. Max 3 at creation (except with Exceptional skill merit).</p>
          <p className="ref-note"><strong>Specialties:</strong> 3 free specialties. A specialty adds 1 die when the skill applies in that context.</p>
          <p className="ref-note"><strong>Disciplines:</strong> 3 dots in clan disciplines. 1 dot in an out-of-clan discipline (costs extra XP later).</p>
          <p className="ref-note"><strong>Advantages:</strong> 7 dots. Flaws grant extra dots (max +2 from Flaws).</p>
          <p className="ref-note"><strong>Jack of All Trades:</strong> No skill can be left at 0 in more than one category. The lowest skill in the unprioritized category must be at least 1. (Optional; check with your Storyteller.)</p>
        </div>

        <div className="ref-section">
          <div className="ref-section-title">Common Difficulties</div>
          <table className="ref-table">
            <thead><tr><th>Difficulty</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td className="t-val">1</td><td>Simple task, unfavorable conditions</td></tr>
              <tr><td className="t-val">2</td><td>Standard task</td></tr>
              <tr><td className="t-val">3</td><td>Challenging; requires skill or luck</td></tr>
              <tr><td className="t-val">4</td><td>Difficult; specialists struggle</td></tr>
              <tr><td className="t-val">5</td><td>Formidable; near the limit of mortal ability</td></tr>
              <tr><td className="t-val">6+</td><td>Near-impossible without supernatural aid</td></tr>
            </tbody>
          </table>
          <p className="ref-note" style={{ marginTop: 6 }}><strong>Critical Win:</strong> two or more 10s in a roll. Exceptional effect at Storyteller discretion.</p>
          <p className="ref-note"><strong>Bestial Failure:</strong> no successes and at least one 1. The Beast asserts itself — a compulsion, an outburst, or a slip toward frenzy.</p>
        </div>
      </div>
    </div>
  );
}
