import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { ATTRIBUTE_LABELS, SKILL_GROUPS } from '../types/character';
import type { Attributes } from '../types/character';
import { AnkhArt } from './AnkhArt';
import { AppearanceControls } from './AppearanceControls';
import { backdropFor, coverRect } from './backdrops';
import type { Rect } from './backdrops';
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
import { SKILL_GROUP_TITLES } from './layout';
import { DamageTrackBoxes, HumanityBoxes, HungerBoxes, TrackerLabel } from './Trackers';
import { isAdvantageSelected, isAttributeSelected, isPowerSelected, isRitualSelected, isSkillSelected, useSheetDialogs } from './useSheetDialogs';
import type { Selection } from './useSheetDialogs';

interface AnkhView {
  width: number;
  height: number;
  translateX: number;
  translateY: number;
  scale: number;
}

const HILT_VIEW: AnkhView = { width: 390, height: 330, translateX: -111.06, translateY: -29.5, scale: 0.425 };
const BLADE_VIEW: AnkhView = { width: 390, height: 560, translateX: -165, translateY: -420, scale: 0.5 };

const ATTRIBUTE_GROUPS: { label: string; attributes: [keyof Attributes, string][] }[] = [
  { label: 'FÍSICOS', attributes: [['strength', 'Strength'], ['dexterity', 'Dexterity'], ['stamina', 'Stamina']] },
  { label: 'SOCIAIS', attributes: [['charisma', 'Charisma'], ['manipulation', 'Manipulation'], ['composure', 'Composure']] },
  { label: 'MENTAIS', attributes: [['intelligence', 'Intelligence'], ['wits', 'Wits'], ['resolve', 'Resolve']] },
];

const PROFILE_FIELDS = [
  { field: 'clan', label: 'CLÃ' },
  { field: 'predatorType', label: 'PREDATOR' },
  { field: 'faction', label: 'FACÇÃO' },
  { field: 'embrace', label: 'ABRAÇO' },
  { field: 'sire', label: 'SIRE' },
] as const;

interface Layout {
  width: number;
  height: number;
  hiltTop: number;
  bladeTop: number;
}

function useLayout() {
  const root = useRef<HTMLDivElement>(null);
  const hilt = useRef<HTMLDivElement>(null);
  const blade = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>({ width: 390, height: 2760, hiltTop: 12, bladeTop: 1150 });

  useLayoutEffect(() => {
    const measure = () => {
      if (!root.current || !hilt.current || !blade.current) return;
      const next = {
        width: root.current.offsetWidth,
        height: root.current.offsetHeight,
        hiltTop: hilt.current.offsetTop,
        bladeTop: blade.current.offsetTop,
      };
      setLayout((previous) =>
        previous.width === next.width && previous.height === next.height && previous.hiltTop === next.hiltTop && previous.bladeTop === next.bladeTop
          ? previous
          : next
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  return { root, hilt, blade, layout };
}

function photoInView(photo: Rect, view: AnkhView, svgLeft: number, svgTop: number): Rect {
  return {
    x: (photo.x - svgLeft - view.translateX) / view.scale,
    y: (photo.y - svgTop - view.translateY) / view.scale,
    width: photo.width / view.scale,
    height: photo.height / view.scale,
  };
}

interface AnkhPieceProps {
  view: AnkhView;
  photo: Rect;
  layout: Layout;
  top: number;
  showLoop: boolean;
}

function AnkhPiece({ view, photo, layout, top, showLoop }: AnkhPieceProps) {
  const { character } = useCharacter();
  const left = (layout.width - view.width) / 2;
  const backdrop = backdropFor(character.backdrop);

  return (
    <svg className="ankh-mobile__art" width={view.width} height={view.height} viewBox={`0 0 ${view.width} ${view.height}`} style={{ left }} aria-hidden="true">
      <g transform={`translate(${view.translateX} ${view.translateY}) scale(${view.scale})`}>
        <AnkhArt
          backdropUrl={backdrop.url}
          backdropRect={photoInView(photo, view, left, top)}
          portrait={character.portrait}
          showLoop={showLoop}
        />
      </g>
    </svg>
  );
}

function MobileSection({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="ankh-mobile__section" aria-label={title}>
      <div className="ankh-mobile__section-title"><SectionTitle action={action}>{title}</SectionTitle></div>
      {children}
    </section>
  );
}

function MobileGroup({ label, action, children }: { label: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="ankh-mobile__group">
      <span className="ankh-group">{label}{action}</span>
      <div className="ankh-mobile__grid">{children}</div>
    </div>
  );
}

export function MobileSheet() {
  const { character, editMode, update } = useCharacter();
  const [selection, setSelection] = useState<Selection | null>(null);
  const { dialogs, addDiscipline, addPower, addRitual, addAdvantage } = useSheetDialogs();
  const { root, hilt, blade, layout } = useLayout();

  const backdrop = backdropFor(character.backdrop);
  const photo = coverRect(backdrop, layout);
  const toggle = (next: Selection, isSelected: boolean) => setSelection(isSelected ? null : next);
  const editAction = (label: string, onClick: () => void) => (editMode ? <AddButton label={label} onClick={onClick} /> : undefined);
  const addInventoryItem = () => update((draft) => { draft.inventory.push('Novo item'); });
  const closeWindow = () => setSelection(null);

  let detailWindow: ReactNode = null;
  if (selection?.kind === 'skill') {
    const entry = character.skills[selection.skill];
    detailWindow = <SkillWindow skill={selection.skill} value={entry?.value ?? 0} specialty={entry?.specialty ?? ''} onClose={closeWindow} />;
  } else if (selection?.kind === 'power') {
    detailWindow = <PowerWindow discipline={selection.discipline} power={selection.power} onClose={closeWindow} />;
  } else if (selection?.kind === 'ritual') {
    detailWindow = <RitualWindow discipline={selection.discipline} ritual={selection.ritual} onClose={closeWindow} />;
  } else if (selection?.kind === 'attribute') {
    detailWindow = (
      <AttributeWindow
        attribute={selection.attribute}
        label={ATTRIBUTE_LABELS[selection.attribute]}
        value={character.attributes[selection.attribute]}
        onClose={closeWindow}
      />
    );
  } else if (selection?.kind === 'predator') {
    detailWindow = <PredatorWindow name={character.predatorType} onClose={closeWindow} />;
  } else if (selection?.kind === 'advantage') {
    const item = (selection.list === 'advantage' ? character.advantages : character.flaws)[selection.index];
    detailWindow = item ? <AdvantageWindow name={item.name} level={item.level} note={item.note} onClose={closeWindow} /> : null;
  } else if (selection?.kind === 'pool-form') {
    detailWindow = <FormWindow title="Novo pool" onClose={closeWindow}><PoolForm onClose={closeWindow} /></FormWindow>;
  }

  return (
    <div className="ankh-mobile" ref={root}>
      <img className="ankh-backdrop" src={backdrop.url} alt="" aria-hidden="true" />
      <div className="ankh-shade" aria-hidden="true" />

      <div className="ankh-mobile__hilt" ref={hilt}>
        <AnkhPiece view={HILT_VIEW} photo={photo} layout={layout} top={layout.hiltTop} showLoop />
      </div>

      <header className="ankh-mobile__identity">
        <CharacterName />
        <CharacterAliases />
      </header>

      {editMode && <AppearanceControls />}

      <div className="ankh-mobile__profile">
        {PROFILE_FIELDS.map(({ field, label }) => (
          <div key={field} className="ankh-mobile__field">
            <ProfileFieldItem
              field={field}
              label={label}
              selected={field === 'predatorType' && selection?.kind === 'predator'}
              onSelect={field === 'predatorType' && character.predatorType in PREDATOR_TEXTS ? () => toggle({ kind: 'predator' }, selection?.kind === 'predator') : undefined}
            />
          </div>
        ))}
        <div className="ankh-mobile__field is-wide"><XpItem /></div>
      </div>

      <div className="ankh-mobile__blood"><BloodBlock showResonance={false} /></div>

      <MobileSection title="ESTADO">
        <div className="ankh-mobile__trackers">
          <div className="ankh-mobile__tracker"><TrackerLabel>SAÚDE</TrackerLabel><DamageTrackBoxes track="health" /></div>
          <div className="ankh-mobile__tracker"><TrackerLabel>WILLPOWER</TrackerLabel><DamageTrackBoxes track="willpower" /></div>
          <div className="ankh-mobile__tracker is-wide"><TrackerLabel>HUMANITY</TrackerLabel><HumanityBoxes /></div>
          <div className="ankh-mobile__tracker is-wide"><TrackerLabel>HUNGER</TrackerLabel><HungerBoxes /></div>
          <div className="ankh-mobile__tracker is-wide"><ResonancePicker /></div>
        </div>
      </MobileSection>

      <div className="ankh-mobile__blade" ref={blade}>
        <AnkhPiece view={BLADE_VIEW} photo={photo} layout={layout} top={layout.bladeTop} showLoop={false} />
        <div className="ankh-mobile__columns">
          <div className="ankh-mobile__column is-left">
            <span className="ankh-mobile__column-title">ATRIBUTOS</span>
            {ATTRIBUTE_GROUPS.map((group) => (
              <div key={group.label} className="ankh-mobile__stack">
                <span className="ankh-group">{group.label}</span>
                {group.attributes.map(([attribute, label]) => (
                  <div key={attribute} className="ankh-mobile__item"><AttributeItem attribute={attribute} label={label} side="left" selected={isAttributeSelected(selection, attribute)} onSelect={() => toggle({ kind: 'attribute', attribute }, isAttributeSelected(selection, attribute))} /></div>
                ))}
              </div>
            ))}
          </div>
          <div className="ankh-mobile__column is-right">
            <span className="ankh-mobile__column-title">DISCIPLINAS{editAction('Adicionar disciplina', addDiscipline)}</span>
            {character.disciplines.map((discipline, disciplineIndex) => (
              <div key={discipline.name + disciplineIndex} className="ankh-mobile__stack">
                <div className="ankh-mobile__item"><DisciplineItem index={disciplineIndex} side="right" onAddPower={() => addPower(disciplineIndex)} onAddRitual={() => addRitual(disciplineIndex)} /></div>
                {discipline.powers.map((power, powerIndex) => {
                  const selected = isPowerSelected(selection, discipline.name, power);
                  return (
                    <span key={power + powerIndex} className="ankh-mobile__power">
                      <PowerItem
                        disciplineIndex={disciplineIndex}
                        powerIndex={powerIndex}
                        selected={selected}
                        onSelect={() => toggle({ kind: 'power', discipline: discipline.name, power }, selected)}
                      />
                    </span>
                  );
                })}
                {(discipline.rituals ?? []).map((ritual, ritualIndex) => {
                  const selected = isRitualSelected(selection, discipline.name, ritual);
                  return (
                    <span key={ritual + ritualIndex} className="ankh-mobile__power">
                      <RitualItem
                        disciplineIndex={disciplineIndex}
                        ritualIndex={ritualIndex}
                        selected={selected}
                        onSelect={() => toggle({ kind: 'ritual', discipline: discipline.name, ritual }, selected)}
                      />
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <MobileSection title="PERÍCIAS">
        {(['physical', 'social', 'mental'] as const).map((group) => (
          <MobileGroup key={group} label={SKILL_GROUP_TITLES[group]}>
            {SKILL_GROUPS[group].map((skill) => {
              const selected = isSkillSelected(selection, skill);
              return (
                <div key={skill} className="ankh-mobile__cell">
                  <SkillItem skill={skill} side="left" selected={selected} onSelect={() => toggle({ kind: 'skill', skill }, selected)} />
                </div>
              );
            })}
          </MobileGroup>
        ))}
      </MobileSection>

      <MobileSection title="VANTAGENS">
        <MobileGroup label="ADVANTAGES" action={editAction('Adicionar advantage', () => addAdvantage('advantage'))}>
          {character.advantages.map((item, index) => (
            <div key={item.name + index} className="ankh-mobile__cell">
              <AdvantageItem kind="advantage" index={index} side="left" selected={isAdvantageSelected(selection, 'advantage', index)} onSelect={() => toggle({ kind: 'advantage', list: 'advantage', index }, isAdvantageSelected(selection, 'advantage', index))} />
            </div>
          ))}
        </MobileGroup>
        <MobileGroup label="FLAWS" action={editAction('Adicionar flaw', () => addAdvantage('flaw'))}>
          {character.flaws.map((item, index) => (
            <div key={item.name + index} className="ankh-mobile__cell">
              <AdvantageItem kind="flaw" index={index} side="left" selected={isAdvantageSelected(selection, 'flaw', index)} onSelect={() => toggle({ kind: 'advantage', list: 'flaw', index }, isAdvantageSelected(selection, 'flaw', index))} />
            </div>
          ))}
        </MobileGroup>
      </MobileSection>

      <MobileSection title="INVENTÁRIO" action={editAction('Adicionar item', addInventoryItem)}>
        {character.inventory.map((item, index) => (
          <div key={item + index} className="ankh-mobile__line"><InventoryItem index={index} /></div>
        ))}
      </MobileSection>

      <MobileSection title="COLA PARA DADOS" action={editAction('Adicionar pool', () => setSelection({ kind: 'pool-form' }))}>
        {(character.pools || []).map((pool, index) => (
          <div key={pool.title + index} className="ankh-mobile__line"><PoolItem index={index} /></div>
        ))}
      </MobileSection>


      <Frame />

      {detailWindow && <div className="ankh-drawer">{detailWindow}</div>}
      {dialogs}
    </div>
  );
}
