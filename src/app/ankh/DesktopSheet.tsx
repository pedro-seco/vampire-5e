import { useState } from 'react';
import type { ReactNode } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { ATTRIBUTE_LABELS, SKILL_GROUPS } from '../types/character';
import type { Attributes, SkillKey } from '../types/character';
import { AnchoredWindow } from './AnchoredWindow';
import { AnkhArt } from './AnkhArt';
import { AppearanceControls } from './AppearanceControls';
import { backdropFor, coverRect } from './backdrops';
import { BloodBlock, ResonancePicker } from './BloodBlock';
import { Frame } from './Frame';
import { AdvantageWindow, AttributeWindow, FormWindow, PowerWindow, PredatorWindow, RitualWindow, SkillWindow } from './DetailWindows';
import { PREDATOR_TEXTS } from './predators';
import { PoolForm } from './pools';
import { AddButton, SectionTitle } from './SectionTitle';
import {
  AdvantageItem, AttributeItem, CharacterAliases, CharacterName, DisciplineItem, InventoryItem,
  PoolItem, PowerItem, ProfileFieldItem, RitualItem, SkillItem, XpItem,
} from './SheetItems';
import { STAGE_MIN_HEIGHT, STAGE_WIDTH } from './stage';
import {
  ATTRIBUTE_GROUPS, BLOOD_LEFT, createColumn, LOWER_START, PROFILE_FIELDS, SKILL_GROUP_TITLES, STAGE_BOTTOM_ROOM, STAGE_TOP_CROP, TRACKERS_TOP, UPPER_START,
} from './layout';
import type { Row } from './layout';
import { DamageTrackBoxes, HumanityBoxes, HungerBoxes, TrackerLabel } from './Trackers';
import { isAdvantageSelected, isAttributeSelected, isPowerSelected, isRitualSelected, isSkillSelected, useSheetDialogs } from './useSheetDialogs';
import type { Selection } from './useSheetDialogs';

const SKILL_WINDOW_LEFT = 32;
const SIDE_WINDOW_LEFT = 1116;

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
  const { dialogs, addDiscipline, addPower, addRitual, addAdvantage } = useSheetDialogs();

  const toggle = (next: Selection, isSelected: boolean) => setSelection(isSelected ? null : next);
  const addInventoryItem = () => update((draft) => { draft.inventory.push('Novo item'); });

  const attributeRowTops: Partial<Record<keyof Attributes, number>> = {};
  const attributes = createColumn('left', UPPER_START);
  attributes.add('title', 'attributes', <SectionTitle>ATRIBUTOS</SectionTitle>);
  for (const group of ATTRIBUTE_GROUPS) {
    attributes.add('group', group.label, <GroupLabel>{group.label}</GroupLabel>);
    for (const [attribute, label] of group.attributes) {
      attributeRowTops[attribute] = attributes.bottom();
      const selected = isAttributeSelected(selection, attribute);
      attributes.add('attribute', attribute, <AttributeItem attribute={attribute} label={label} side="left" selected={selected} onSelect={() => toggle({ kind: 'attribute', attribute }, selected)} />);
    }
  }

  let predatorRowTop = UPPER_START;
  const profile = createColumn('right', UPPER_START);
  profile.add('title', 'profile', <SectionTitle>DADOS</SectionTitle>);
  profile.add('name', 'name', <CharacterName />);
  profile.add('aliases', 'aliases', <CharacterAliases />);
  const predatorSelected = selection?.kind === 'predator';
  for (const { field, label } of PROFILE_FIELDS) {
    if (field === 'predatorType') predatorRowTop = profile.bottom();
    const isPredator = field === 'predatorType';
    profile.add('field', field, (
      <ProfileFieldItem
        field={field}
        label={label}
        selected={isPredator && predatorSelected}
        onSelect={isPredator && character.predatorType in PREDATOR_TEXTS ? () => toggle({ kind: 'predator' }, predatorSelected) : undefined}
      />
    ));
  }

  const skills = createColumn('left', LOWER_START);
  skills.add('title', 'skills', <SectionTitle>PERÍCIAS</SectionTitle>);
  const skillRowTops: Partial<Record<SkillKey, number>> = {};
  for (const group of ['physical', 'social', 'mental'] as const) {
    skills.add('group', group, <GroupLabel>{SKILL_GROUP_TITLES[group]}</GroupLabel>);
    for (const skill of SKILL_GROUPS[group]) {
      skillRowTops[skill] = skills.bottom();
      const selected = isSkillSelected(selection, skill);
      skills.add('skill', skill, <SkillItem skill={skill} side="left" selected={selected} onSelect={() => toggle({ kind: 'skill', skill }, selected)} />);
    }
  }

  const traits = createColumn('right', LOWER_START);
  const powerRowTops: Record<string, number> = {};
  const ritualRowTops: Record<string, number> = {};
  const advantageRowTops: Record<string, number> = {};
  traits.add('title', 'disciplines', <SectionTitle action={editMode ? <AddButton label="Adicionar disciplina" onClick={addDiscipline} /> : undefined}>DISCIPLINAS</SectionTitle>);
  character.disciplines.forEach((discipline, disciplineIndex) => {
    traits.add('skill', 'discipline' + disciplineIndex, <DisciplineItem index={disciplineIndex} side="right" onAddPower={() => addPower(disciplineIndex)} onAddRitual={() => addRitual(disciplineIndex)} />);
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
    (discipline.rituals ?? []).forEach((ritual, ritualIndex) => {
      ritualRowTops[discipline.name + '/' + ritual] = traits.bottom();
      const selected = isRitualSelected(selection, discipline.name, ritual);
      traits.add('power', `ritual${disciplineIndex}-${ritualIndex}`, (
        <RitualItem
          disciplineIndex={disciplineIndex}
          ritualIndex={ritualIndex}
          selected={selected}
          onSelect={() => toggle({ kind: 'ritual', discipline: discipline.name, ritual }, selected)}
        />
      ));
    });
  });

  const editAction = (label: string, onClick: () => void) => (editMode ? <AddButton label={label} onClick={onClick} /> : undefined);
  traits.add('group', 'advantages', <GroupLabel action={editAction('Adicionar advantage', () => addAdvantage('advantage'))}>ADVANTAGES</GroupLabel>);
  (['advantage', 'flaw'] as const).forEach((list) => {
    if (list === 'flaw') traits.add('group', 'flaws', <GroupLabel action={editAction('Adicionar flaw', () => addAdvantage('flaw'))}>FLAWS</GroupLabel>);
    (list === 'advantage' ? character.advantages : character.flaws).forEach((_item, index) => {
      advantageRowTops[list + index] = traits.bottom();
      const selected = isAdvantageSelected(selection, list, index);
      traits.add('skill', list + index, <AdvantageItem kind={list} index={index} side="right" selected={selected} onSelect={() => toggle({ kind: 'advantage', list, index }, selected)} />);
    });
  });
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
  } else if (selection?.kind === 'ritual') {
    windowAnchor = ritualRowTops[selection.discipline + '/' + selection.ritual] ?? LOWER_START;
    detailWindow = <RitualWindow discipline={selection.discipline} ritual={selection.ritual} onClose={closeWindow} />;
  } else if (selection?.kind === 'attribute') {
    windowAnchor = attributeRowTops[selection.attribute] ?? UPPER_START;
    windowLeft = SKILL_WINDOW_LEFT;
    detailWindow = (
      <AttributeWindow
        attribute={selection.attribute}
        label={ATTRIBUTE_LABELS[selection.attribute]}
        value={character.attributes[selection.attribute]}
        onClose={closeWindow}
      />
    );
  } else if (selection?.kind === 'predator') {
    windowAnchor = predatorRowTop;
    detailWindow = <PredatorWindow name={character.predatorType} onClose={closeWindow} />;
  } else if (selection?.kind === 'advantage') {
    const item = (selection.list === 'advantage' ? character.advantages : character.flaws)[selection.index];
    windowAnchor = advantageRowTops[selection.list + selection.index] ?? LOWER_START;
    detailWindow = item ? <AdvantageWindow name={item.name} level={item.level} note={item.note} onClose={closeWindow} /> : null;
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
          <AnkhArt backdropUrl={backdrop.url} backdropRect={photo} portrait={character.portrait} />
        </svg>
        {editMode && <AppearanceControls style={{ left: 600, top: 520, width: 240 }} />}

        {rows.map((row) => <RowView key={row.key} row={row} />)}

        <div className="ankh-blood-slot" style={{ top: profile.bottom() + 2, left: BLOOD_LEFT }}>
          <BloodBlock showResonance={false} />
        </div>

        <div className="ankh-trackers ankh-trackers--left" style={{ top: TRACKERS_TOP, right: 842 }}>
          <span className="ankh-tracker-row"><TrackerLabel>SAÚDE</TrackerLabel><DamageTrackBoxes track="health" /></span>
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
      </div>
      {dialogs}
    </div>
  );
}
