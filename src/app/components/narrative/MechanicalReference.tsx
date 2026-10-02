const CARDS = [
  {
    title: 'Clan Bane',
    id: 'card-bane',
    text: 'All Nosferatu carry the Repulsive flaw (−2 dice on appearance-based social rolls without active Obfuscate). Any attempt to pass as human — including Obfuscate — suffers a penalty equal to Bane Severity (−2 dice at BP 3).',
  },
  {
    title: 'Compulsion — Paranoia (Hunger ≥ 4)',
    id: 'card-compulsion',
    text: 'The vampire must investigate and expose any hidden secret present in the scene before taking any other action. Lasts until a secret is revealed or Hunger drops below 4. Suppressing for one turn costs 1 Willpower.',
  },
  {
    title: 'Predator — Alleycat',
    titleId: 'card-pred-title',
    id: 'card-predator',
    text: 'Attacks victims directly, feeding in the chaos of physical confrontation. Bonus: Celerity ● (Rapid Reflexes), 3 dots of criminal Contacts, specialty in Brawl (Grappling) or Intimidation (Stickups). Cost: −1 Humanity at creation.',
  },
];

export function MechanicalReference() {
  return (
    <>
      <div className="sh">Mechanical Reference</div>
      <div className="three-cards">
        {CARDS.map((card) => (
          <div className="ref-card" key={card.id}>
            <div className="ref-card-title" id={card.titleId}>{card.title}</div>
            <div id={card.id}>{card.text}</div>
          </div>
        ))}
      </div>
    </>
  );
}
