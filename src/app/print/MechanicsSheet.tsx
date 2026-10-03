import type { ReactNode } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { SKILL_GROUPS, SKILL_LABELS } from '../types/character';
import { range } from '../components/shared/range';
import { ANKH_PATH } from '../ankh/geometry';
import {
  ATTRIBUTE_GROUPS, createColumn, LOWER_START, PROFILE_FIELDS, STAGE_BOTTOM_ROOM, STAGE_TOP_CROP, TRACKERS_TOP, UPPER_START,
} from '../ankh/layout';
import type { Row } from '../ankh/layout';
import { describePool } from '../ankh/poolText';
import { ANKH_TRANSFORM, STAGE_MIN_HEIGHT, STAGE_WIDTH } from '../ankh/stage';
import { Box, DamageBoxes, Dots } from './printParts';
import type { BoxMark } from './printParts';

const PAGE_WIDTH_PX = 794;
const PAGE_HEIGHT_PX = 1123;
const PAGE_MARGIN_PX = 40;
const ANKH_CLEARANCE = 14;
const HUMANITY_BOXES = 10;
const HUNGER_BOXES = 5;
const POTENCY_BARS = 10;
const RESONANCES = ['Sanguine', 'Choleric', 'Melancholic', 'Phlegmatic', 'Empty'];
const TRACKER_EDGE = 842;

function RowView({ row }: { row: Row }) {
  const offset = row.offset + ANKH_CLEARANCE;
  const position = row.side === 'left' ? { top: row.top, right: offset } : { top: row.top, left: offset };
  return <div className={`pstage-row pstage-row--${row.side} pstage-row--${row.kind}`} style={position}>{row.content}</div>;
}

function Traits({ side, label, dots, note }: { side: 'left' | 'right'; label: ReactNode; dots: ReactNode; note?: string }) {
  const noteView = note ? <span className="pstage-note">{note}</span> : null;
  return side === 'left' ? <>{noteView}{label}{dots}</> : <>{dots}{label}{noteView}</>;
}

function TrackerRow({ children }: { children: ReactNode }) {
  return <span className="pstage-tracker-row">{children}</span>;
}

export function MechanicsSheet() {
  const { character } = useCharacter();
  const { trackers } = character;

  const attributes = createColumn('left', UPPER_START);
  attributes.add('title', 'attributes', <span className="pstage-title">ATRIBUTOS</span>);
  for (const group of ATTRIBUTE_GROUPS) {
    attributes.add('group', group.label, <span className="pstage-group">{group.label}</span>);
    for (const [attribute, label] of group.attributes) {
      attributes.add('attribute', attribute, <Traits side="left" label={<span className="pstage-trait">{label}</span>} dots={<Dots value={character.attributes[attribute]} />} />);
    }
  }

  const profile = createColumn('right', UPPER_START);
  profile.add('title', 'profile', <span className="pstage-title">DADOS</span>);
  profile.add('name', 'name', <span className="pstage-name">{character.name}</span>);
  profile.add('aliases', 'aliases', <span className="pstage-aliases">{character.aliases}</span>);
  for (const { field, label } of PROFILE_FIELDS) {
    profile.add('field', field, <><span className="pstage-field-label">{label}</span><span className="pstage-field-value">{character[field]}</span></>);
  }

  profile.add('group', 'blood', <span className="pstage-group">SANGUE</span>);
  profile.add('field', 'generation', <><span className="pstage-field-label">GERAÇÃO</span><span className="pstage-field-value">{character.generation}</span></>);
  profile.add('field', 'potency', (
    <>
      <span className="pstage-field-label">POTÊNCIA {trackers.bp}</span>
      <span className="pstage-bars">
        {range(POTENCY_BARS).map((bar) => <span key={bar} className={'pstage-bar' + (bar < trackers.bp ? ' is-filled' : '')} />)}
      </span>
    </>
  ));
  profile.add('group', 'resonance', <span className="pstage-group">RESSONÂNCIA</span>);
  RESONANCES.forEach((resonance) => profile.add('text', 'resonance' + resonance, <><Box /><span className="pstage-text">{resonance}</span></>));

  const skills = createColumn('left', LOWER_START);
  skills.add('title', 'skills', <span className="pstage-title">PERÍCIAS</span>);
  for (const group of ['physical', 'social', 'mental'] as const) {
    skills.add('group', group, <span className="pstage-group">{group.toUpperCase()}</span>);
    for (const skill of SKILL_GROUPS[group]) {
      const entry = character.skills[skill];
      skills.add('skill', skill, <Traits side="left" label={<span className="pstage-trait">{SKILL_LABELS[skill]}</span>} dots={<Dots value={entry?.value ?? 0} />} note={entry?.value ? entry.specialty : undefined} />);
    }
  }

  const traits = createColumn('right', LOWER_START);
  traits.add('title', 'disciplines', <span className="pstage-title">DISCIPLINAS</span>);
  character.disciplines.forEach((discipline, disciplineIndex) => {
    traits.add('skill', 'discipline' + disciplineIndex, <Traits side="right" label={<span className="pstage-trait">{discipline.name}</span>} dots={<Dots value={discipline.level} />} />);
    discipline.powers.forEach((power, powerIndex) => {
      traits.add('power', `power${disciplineIndex}-${powerIndex}`, <span className="pstage-power">{power}</span>);
    });
    (discipline.rituals ?? []).forEach((ritual, ritualIndex) => {
      traits.add('power', `ritual${disciplineIndex}-${ritualIndex}`, <span className="pstage-power pstage-ritual">{ritual}</span>);
    });
  });
  traits.add('group', 'advantages', <span className="pstage-group">ADVANTAGES</span>);
  character.advantages.forEach((item, index) => {
    traits.add('skill', 'advantage' + index, <Traits side="right" label={<span className="pstage-trait">{item.name}</span>} dots={<Dots value={item.level} />} note={item.note} />);
  });
  traits.add('group', 'flaws', <span className="pstage-group">FLAWS</span>);
  character.flaws.forEach((item, index) => {
    traits.add('skill', 'flaw' + index, <Traits side="right" label={<span className="pstage-trait">{item.name}</span>} dots={<Dots value={item.level} />} note={item.note} />);
  });
  traits.add('group', 'inventory', <span className="pstage-group">INVENTÁRIO</span>);
  character.inventory.forEach((item, index) => traits.add('text', 'item' + index, <span className="pstage-text">{item}</span>));
  traits.add('group', 'pools', <span className="pstage-group">COLA PARA DADOS</span>);
  (character.pools || []).forEach((pool, index) => {
    traits.add('text', 'pool' + index, <span className="pstage-text"><strong>{pool.title || 'Pool'}</strong> — {describePool(character, pool)}</span>);
  });

  const rows = [...attributes.rows, ...profile.rows, ...skills.rows, ...traits.rows];
  const lastTop = Math.max(...rows.map((row) => row.top));
  const stageHeight = Math.max(STAGE_MIN_HEIGHT, lastTop + STAGE_BOTTOM_ROOM);
  const visibleHeight = stageHeight - STAGE_TOP_CROP;
  const scale = Math.min((PAGE_WIDTH_PX - PAGE_MARGIN_PX * 2) / STAGE_WIDTH, (PAGE_HEIGHT_PX - PAGE_MARGIN_PX * 2) / visibleHeight);

  const humanityMark = (box: number): BoxMark | undefined => {
    if (box < trackers.humanity) return 'filled';
    return box >= HUMANITY_BOXES - trackers.humanityStains ? 'stain' : undefined;
  };

  return (
    <div className="print-page print-page--bordered">
      <div className="pstage-frame" style={{ width: STAGE_WIDTH * scale, height: visibleHeight * scale }}>
        <div className="pstage" style={{ height: stageHeight, top: -STAGE_TOP_CROP, zoom: scale }}>
          <svg className="pstage-art" width={STAGE_WIDTH} height={stageHeight} viewBox={`0 0 ${STAGE_WIDTH} ${stageHeight}`} aria-hidden="true">
            <path transform={ANKH_TRANSFORM} d={ANKH_PATH} fill="none" stroke="#000" strokeWidth={3} fillRule="evenodd" />
          </svg>

          {rows.map((row) => <RowView key={row.key} row={row} />)}

          <div className="pstage-trackers pstage-trackers--left" style={{ top: TRACKERS_TOP, right: TRACKER_EDGE }}>
            <TrackerRow><span className="pstage-tracker-label">SAÚDE</span><span className="pstage-boxes"><DamageBoxes size={trackers.healthMax} states={trackers.health} /></span></TrackerRow>
            <TrackerRow><span className="pstage-tracker-label">WILLPOWER</span><span className="pstage-boxes"><DamageBoxes size={trackers.willpowerMax} states={trackers.willpower} /></span></TrackerRow>
            <TrackerRow><span className="pstage-tracker-label">XP</span><span className="pstage-text">{character.xpSpent} / {character.xpTotal}</span></TrackerRow>
          </div>
          <div className="pstage-trackers pstage-trackers--right" style={{ top: TRACKERS_TOP, left: TRACKER_EDGE }}>
            <TrackerRow>
              <span className="pstage-boxes">{range(HUMANITY_BOXES).map((box) => <Box key={box} mark={humanityMark(box)} />)}</span>
              <span className="pstage-tracker-label">HUMANITY</span>
            </TrackerRow>
            <TrackerRow>
              <span className="pstage-boxes">{range(HUNGER_BOXES).map((box) => <Box key={box} mark={trackers.hunger[box] ? 'filled' : undefined} />)}</span>
              <span className="pstage-tracker-label">HUNGER</span>
            </TrackerRow>
          </div>
        </div>
      </div>
    </div>
  );
}
