import { useState } from 'react';
import type { ReactNode } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { SKILL_GROUPS } from '../types/character';
import type { Attributes, SkillKey } from '../types/character';
import { AnchoredWindow } from './AnchoredWindow';
import { AnkhArt } from './AnkhArt';
import { AppearanceControls } from './AppearanceControls';
import { backdropFor, coverRect } from './backdrops';
import { BloodBlock, ResonancePicker } from './BloodBlock';
import { Frame } from './Frame';
import { FormWindow, PowerWindow, SkillWindow } from './DetailWindows';
import { PoolForm } from './pools';
import { AddButton, SectionTitle } from './SectionTitle';
import {
  AdvantageItem, AttributeItem, CharacterAliases, CharacterName, DisciplineItem, InventoryItem,
  PoolItem, PowerItem, ProfileFieldItem, SkillItem, XpItem,
} from './SheetItems';
import type { Side } from './SheetItems';
import { leftOffsetBeside, rightOffsetBeside, STAGE_MIN_HEIGHT, STAGE_WIDTH } from './stage';
import { DamageTrackBoxes, HumanityBoxes, HungerBoxes, TrackerLabel } from './Trackers';
import { isPowerSelected, isSkillSelected, useSheetDialogs } from './useSheetDialogs';
import type { Selection } from './useSheetDialogs';
import { CLAN_ICON_CREDIT } from './clanIcons';

type RowKind = 'title' | 'group' | 'attribute' | 'skill' | 'power' | 'field' | 'name' | 'aliases' | 'text';

interface Row {
  key: string;
  side: Side;
  top: number;
  offset: number;
  kind: RowKind;
  content: ReactNode;
}

const SPACING: Record<RowKind, number> = { title: 50, group: 32, attribute: 40, skill: 28, power: 27, field: 44, name: 54, aliases: 44, text: 29 };
const GROUP_NUDGE = 8;
const UPPER_START = 92;
const LOWER_START = 930;
const BLOOD_LEFT = 1012;
const TRACKERS_TOP = 806;
const SKILL_WINDOW_LEFT = 32;
const SIDE_WINDOW_LEFT = 1116;
const STAGE_BOTTOM_ROOM = 90;
const STAGE_TOP_CROP = 56;

const ATTRIBUTE_GROUPS: { label: string; attributes: [keyof Attributes, string][] }[] = [
  { label: 'PHYSICAL', attributes: [['strength', 'Strength'], ['dexterity', 'Dexterity'], ['stamina', 'Stamina']] },
  { label: 'SOCIAL', attributes: [['charisma', 'Charisma'], ['manipulation', 'Manipulation'], ['composure', 'Composure']] },
  { label: 'MENTAL', attributes: [['intelligence', 'Intelligence'], ['wits', 'Wits'], ['resolve', 'Resolve']] },
];

const PROFILE_FIELDS = [
  { field: 'clan', label: 'CLÃ' },
  { field: 'predatorType', label: 'PREDATOR' },
  { field: 'faction', label: 'FACÇÃO' },
  { field: 'embrace', label: 'ABRAÇO' },
  { field: 'sire', label: 'SIRE' },
] as const;

function createColumn(side: Side, start: number) {
  const rows: Row[] = [];
  let top = start;
  const place = side === 'left' ? rightOffsetBeside : leftOffsetBeside;

  const add = (kind: RowKind, key: string, content: ReactNode) => {
    const rowTop = kind === 'group' ? top + GROUP_NUDGE : top;
    rows.push({ key: side + key, side, top: rowTop, offset: place(top), kind, content });
    top += SPACING[kind];
  };

  return { rows, add, bottom: () => top };
}

function RowView({ row }: { row: Row }) {
  const position = row.side === 'left' ? { top: row.top, right: row.offset } : { top: row.top, left: row.offset };
  return <div className={`ankh-row ankh-row--${row.side} ankh-row--${row.kind}`} style={position}>{row.content}</div>;
}

function GroupLabel({ children, action }: { children: string; action?: ReactNode }) {
  return <><span className="ankh-group">{children}</span>{action}</>;
}

export function DesktopSheet({ scale }: { scale: number }) {
  const { character, editMode, update } = useCharacter();
  const [selection, setSelection] = useState<Selection | null>(null);
  const { dialogs, addDiscipline, addPower, addAdvantage } = useSheetDialogs();

  const toggle = (next: Selection, isSelected: boolean) => setSelection(isSelected ? null : next);
  const addInventoryItem = () => update((draft) => { draft.inventory.push('Novo item'); });

  const attributes = createColumn('left', UPPER_START);
  attributes.add('title', 'attributes', <SectionTitle>ATRIBUTOS</SectionTitle>);
  for (const group of ATTRIBUTE_GROUPS) {
    attributes.add('group', group.label, <GroupLabel>{group.label}</GroupLabel>);
    for (const [attribute, label] of group.attributes) attributes.add('attribute', attribute, <AttributeItem attribute={attribute} label={label} side="left" />);
  }

  const profile = createColumn('right', UPPER_START);
  profile.add('title', 'profile', <SectionTitle>DADOS</SectionTitle>);
  profile.add('name', 'name', <CharacterName />);
  profile.add('aliases', 'aliases', <CharacterAliases />);
  for (const { field, label } of PROFILE_FIELDS) profile.add('field', field, <ProfileFieldItem field={field} label={label} />);

  const skills = createColumn('left', LOWER_START);
  skills.add('title', 'skills', <SectionTitle>PERÍCIAS</SectionTitle>);
  const skillRowTops: Partial<Record<SkillKey, number>> = {};
  for (const group of ['physical', 'social', 'mental'] as const) {
    skills.add('group', group, <GroupLabel>{group.toUpperCase()}</GroupLabel>);
    for (const skill of SKILL_GROUPS[group]) {
      skillRowTops[skill] = skills.bottom();
      const selected = isSkillSelected(selection, skill);
      skills.add('skill', skill, <SkillItem skill={skill} side="left" selected={selected} onSelect={() => toggle({ kind: 'skill', skill }, selected)} />);
    }
  }

  const traits = createColumn('right', LOWER_START);
  const powerRowTops: Record<string, number> = {};
  traits.add('title', 'disciplines', <SectionTitle action={editMode ? <AddButton label="Adicionar disciplina" onClick={addDiscipline} /> : undefined}>DISCIPLINAS</SectionTitle>);
  character.disciplines.forEach((discipline, disciplineIndex) => {
    traits.add('skill', 'discipline' + disciplineIndex, <DisciplineItem index={disciplineIndex} side="right" onAddPower={() => addPower(disciplineIndex)} />);
    discipline.powers.forEach((power, powerIndex) => {
      powerRowTops[discipline.name + '/' + power] = traits.bottom();
      const selected = isPowerSelected(selection, discipline.name, power);
      traits.add('power', `power${disciplineIndex}-${powerIndex}`, (
        <PowerItem
          disciplineIndex={disciplineIndex}
          powerIndex={powerIndex}
          selected={selected}
          onSelect={() => toggle({ kind: 'power', discipline: discipline.name, power }, selected)}
        />
      ));
    });
  });

  const editAction = (label: string, onClick: () => void) => (editMode ? <AddButton label={label} onClick={onClick} /> : undefined);
  traits.add('group', 'advantages', <GroupLabel action={editAction('Adicionar advantage', () => addAdvantage('advantage'))}>ADVANTAGES</GroupLabel>);
  character.advantages.forEach((_item, index) => traits.add('skill', 'advantage' + index, <AdvantageItem kind="advantage" index={index} side="right" />));
  traits.add('group', 'flaws', <GroupLabel action={editAction('Adicionar flaw', () => addAdvantage('flaw'))}>FLAWS</GroupLabel>);
  character.flaws.forEach((_item, index) => traits.add('skill', 'flaw' + index, <AdvantageItem kind="flaw" index={index} side="right" />));
  traits.add('group', 'inventory', <GroupLabel action={editAction('Adicionar item', () => addInventoryItem())}>INVENTÁRIO</GroupLabel>);
  character.inventory.forEach((_item, index) => traits.add('text', 'item' + index, <InventoryItem index={index} />));
  const poolsTop = traits.bottom();
  traits.add('group', 'pools', <GroupLabel action={editAction('Adicionar pool', () => setSelection({ kind: 'pool-form' }))}>COLA PARA DADOS</GroupLabel>);
  (character.pools || []).forEach((_pool, index) => traits.add('text', 'pool' + index, <PoolItem index={index} />));

  const rows = [...attributes.rows, ...profile.rows, ...skills.rows, ...traits.rows];
  const lastTop = Math.max(...rows.map((row) => row.top));
  const stageHeight = Math.max(STAGE_MIN_HEIGHT, lastTop + STAGE_BOTTOM_ROOM);
  const backdrop = backdropFor(character.backdrop);
  const photo = coverRect(backdrop, { width: STAGE_WIDTH, height: stageHeight });

  const closeWindow = () => setSelection(null);

  let detailWindow: ReactNode = null;
  let windowAnchor = LOWER_START;
  let windowLeft = SIDE_WINDOW_LEFT;
  if (selection?.kind === 'skill') {
    const entry = character.skills[selection.skill];
    windowAnchor = skillRowTops[selection.skill] ?? LOWER_START;
    windowLeft = SKILL_WINDOW_LEFT;
    detailWindow = (
      <SkillWindow
        skill={selection.skill}
        value={entry?.value ?? 0}
        specialty={entry?.specialty ?? ''}
        onClose={closeWindow}
      />
    );
  } else if (selection?.kind === 'power') {
    windowAnchor = powerRowTops[selection.discipline + '/' + selection.power] ?? LOWER_START;
    detailWindow = (
      <PowerWindow
        discipline={selection.discipline}
        power={selection.power}
        onClose={closeWindow}
      />
    );
  } else if (selection?.kind === 'pool-form') {
    windowAnchor = poolsTop;
    detailWindow = (
      <FormWindow title="Novo pool" onClose={closeWindow}>
        <PoolForm onClose={closeWindow} />
      </FormWindow>
    );
  }

  return (
    <div className="ankh-scaler" style={{ height: (stageHeight - STAGE_TOP_CROP) * scale, width: STAGE_WIDTH * scale }}>
      <div className="ankh-stage" style={{ height: stageHeight, transform: `scale(${scale}) translateY(${-STAGE_TOP_CROP}px)` }}>
        <img className="ankh-backdrop" src={backdrop.url} alt="" aria-hidden="true" />
        <div className="ankh-shade" aria-hidden="true" />
        <svg className="ankh-art" width={STAGE_WIDTH} height={stageHeight} viewBox={`0 0 ${STAGE_WIDTH} ${stageHeight}`} aria-hidden="true">
          <AnkhArt backdropUrl={backdrop.url} backdropRect={photo} portrait={character.portrait} clan={character.clan} />
        </svg>
        {editMode && <AppearanceControls style={{ left: 600, top: 520, width: 240 }} />}

        {rows.map((row) => <RowView key={row.key} row={row} />)}

        <div className="ankh-blood-slot" style={{ top: profile.bottom() + 2, left: BLOOD_LEFT }}>
          <BloodBlock showResonance={false} />
        </div>

        <div className="ankh-trackers ankh-trackers--left" style={{ top: TRACKERS_TOP, right: 842 }}>
          <span className="ankh-tracker-row"><TrackerLabel>HEALTH</TrackerLabel><DamageTrackBoxes track="health" /></span>
          <span className="ankh-tracker-row"><TrackerLabel>WILLPOWER</TrackerLabel><DamageTrackBoxes track="willpower" /></span>
          <XpItem />
        </div>
        <div className="ankh-trackers ankh-trackers--right" style={{ top: TRACKERS_TOP, left: 842 }}>
          <span className="ankh-tracker-row"><HumanityBoxes /><TrackerLabel>HUMANITY</TrackerLabel></span>
          <span className="ankh-tracker-row"><HungerBoxes /><TrackerLabel>HUNGER</TrackerLabel></span>
          <ResonancePicker />
        </div>

        {detailWindow && (
          <AnchoredWindow key={JSON.stringify(selection)} anchorTop={windowAnchor} left={windowLeft} stageHeight={stageHeight} scale={scale}>
            {detailWindow}
          </AnchoredWindow>
        )}

        <Frame />
        <p className="ankh-credit">{CLAN_ICON_CREDIT}</p>
      </div>
      {dialogs}
    </div>
  );
}
