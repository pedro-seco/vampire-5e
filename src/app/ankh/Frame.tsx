const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

export function Frame() {
  return (
    <div className="ankh-frame-set" aria-hidden="true">
      <div className="ankh-frame" />
      <div className="ankh-frame ankh-frame--inner" />
      {CORNERS.map((corner) => <span key={corner} className={`ankh-corner is-${corner}`} />)}
    </div>
  );
}
