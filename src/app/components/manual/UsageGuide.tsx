import type { ReactNode } from 'react';

const ARROW_STYLE = { color: 'var(--txt-m)', fontSize: 12 };
const BOX_ROW_STYLE = { display: 'flex', gap: 4, alignItems: 'center', marginTop: 4 };

function GuideItem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="manual-item">
      <div className="manual-item-title">{title}</div>
      {children}
    </div>
  );
}

function VisualAid({ label, annotation, children }: { label: string; annotation: string; children: ReactNode }) {
  return (
    <div className="visual-aid" style={{ marginTop: 8 }}>
      <span className="va-label">{label}</span>
      <div style={BOX_ROW_STYLE}>{children}</div>
      <div className="va-annotation">{annotation}</div>
    </div>
  );
}

const Arrow = ({ text }: { text: string }) => <span style={ARROW_STYLE}>{text}</span>;

function TrackerAids() {
  return (
    <>
      <VisualAid label="Health / Willpower" annotation="Empty → Superficial (╲) → Aggravated (✕) → Empty">
        <div className="box" />
        <Arrow text="→ click →" />
        <div className="box superficial" />
        <Arrow text="→ click →" />
        <div className="box aggravated" />
        <Arrow text="→ click → empty" />
      </VisualAid>

      <VisualAid label="Hunger" annotation="Empty → Filled (✕) → Empty. Always 5 boxes.">
        <div className="box" />
        <Arrow text="→ click →" />
        <div className="box hunger-on" />
        <Arrow text="→ click → empty" />
      </VisualAid>

      <VisualAid
        label="Humanity"
        annotation="Red boxes = current Humanity value (left to right). Click empty boxes from the right to add Stains (╲ in orange). Edit mode: use + / − to change the Humanity value."
      >
        <div className="box hum-filled" />
        <div className="box hum-filled" />
        <div className="box hum-filled" />
        <div className="box" />
        <div className="box stain" />
        <div className="box stain" />
      </VisualAid>
    </>
  );
}

export function UsageGuide() {
  return (
    <div className="manual-section">
      <div className="manual-section-title">How to Use This Sheet</div>

      <GuideItem title="▾ Switch Character">
        <p className="manual-text">Click the <strong>▾</strong> arrow next to the character name to open the character list. Click any name to switch. The sheet reloads with that character's data.</p>
      </GuideItem>

      <GuideItem title="＋ New Character">
        <p className="manual-text">Click the <strong>＋</strong> next to the character name. A blank sheet will be created. Switch to it using the ▾ dropdown and fill in the fields in Edit mode.</p>
      </GuideItem>

      <GuideItem title="✏ Edit Mode">
        <p className="manual-text">Click <strong>✏ Edit</strong> in the top right to unlock the sheet for editing. All text fields become editable. Numeric values (attributes, skills) show <strong>+</strong> and <strong>−</strong> buttons. Sections like Disciplines and Advantages show <strong>＋</strong> buttons to add new entries, and <strong>×</strong> to delete (a confirmation will appear). Click <strong>✏ Edit</strong> again to exit — changes are saved automatically.</p>
      </GuideItem>

      <GuideItem title="Trackers">
        <p className="manual-text">Tracker boxes are always interactive — no Edit mode needed. Click a box to cycle its state:</p>
        <TrackerAids />
      </GuideItem>

      <GuideItem title="Export & Import">
        <p className="manual-text"><strong>Export</strong> downloads your character as a <code>.json</code> file — keep it as a backup or send it to the Storyteller. <strong>Import</strong> loads a <code>.json</code> file and adds that character to your sheet. All data is stored in your browser's local storage; if you clear browser data, your characters will be lost — export regularly.</p>
      </GuideItem>

      <GuideItem title="Adding Disciplines">
        <p className="manual-text">In Edit mode, click <strong>＋</strong> next to Disciplines. Search for a discipline by name and confirm. Then click <strong>＋</strong> inside the discipline header to add powers — only powers at or below your current discipline level are available. To remove a power or a full discipline, click <strong>×</strong> and confirm.</p>
      </GuideItem>
    </div>
  );
}
