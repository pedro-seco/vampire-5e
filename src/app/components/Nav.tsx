import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { DeleteCharacterModal } from './modals/DeleteCharacterModal';

export type TabId = 'mechanics' | 'narrative' | 'ref' | 'manual';

const TABS: { id: TabId; label: string }[] = [
  { id: 'mechanics', label: 'Mechanics' },
  { id: 'narrative', label: 'Narrative' },
  { id: 'ref', label: 'Ref' },
  { id: 'manual', label: 'Manual' },
];

interface NavProps {
  tab: TabId;
  onTab: (tab: TabId) => void;
}

function VaultIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 3.5C1 2.67 1.67 2 2.5 2H6l1.5 2H13.5C14.33 4 15 4.67 15 5.5V11.5C15 12.33 14.33 13 13.5 13H2.5C1.67 13 1 12.33 1 11.5V3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CharacterSwitcher() {
  const { characters, activeId, switchChar } = useCharacter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const toggle = (event: MouseEvent) => {
    event.stopPropagation();
    setOpen((isOpen) => !isOpen);
  };

  const choose = (id: string) => {
    switchChar(id);
    setOpen(false);
  };

  return (
    <div className="char-switcher">
      <button className="nav-icon-btn" title="Trocar personagem" onClick={toggle}>▾</button>
      <div className={'char-dropdown' + (open ? ' open' : '')}>
        {characters.map((summary) => (
          <div
            key={summary.id}
            className={'char-dropdown-item' + (summary.id === activeId ? ' active' : '')}
            onClick={() => choose(summary.id)}
          >
            {summary.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function ImportButton() {
  const { importCharacter } = useCharacter();
  const fileInput = useRef<HTMLInputElement>(null);

  const importFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      await importCharacter(file);
    } catch (err) {
      alert('Could not import character: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const onFileChosen = (event: ChangeEvent<HTMLInputElement>) => {
    importFile(event.target.files?.[0]);
    event.target.value = '';
  };

  return (
    <>
      <button className="nav-icon-btn" title="Importar" onClick={() => fileInput.current?.click()}>⬇</button>
      <input ref={fileInput} type="file" accept=".json" style={{ display: 'none' }} onChange={onFileChosen} />
    </>
  );
}

export function Nav({ tab, onTab }: NavProps) {
  const { newCharacter, editMode, setEditMode, exportActive } = useCharacter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const selectTab = (id: TabId) => {
    onTab(id);
    window.scrollTo(0, 0);
    setDrawerOpen(false);
  };

  const tabButtons = (className: string) =>
    TABS.map(({ id, label }) => (
      <button key={id} className={className + (tab === id ? ' active' : '')} onClick={() => selectTab(id)}>
        {label}
      </button>
    ));

  return (
    <>
      <div className={'tab-overlay' + (drawerOpen ? ' open' : '')} onClick={() => setDrawerOpen(false)} />
      <aside className={'tab-drawer' + (drawerOpen ? ' open' : '')}>
        <div className="drawer-head">Seções</div>
        {tabButtons('drawer-tab')}
      </aside>

      <nav className="tabnav">
        <button className="nav-icon-btn" id="btn-menu" title="Seções" onClick={() => setDrawerOpen((isOpen) => !isOpen)}>☰</button>
        <div className="nav-tabs">{tabButtons('nav-tab')}</div>
        <div className="nav-spacer" />
        <div className="nav-actions">
          <CharacterSwitcher />
          <button className="nav-icon-btn" title="Novo personagem" onClick={newCharacter}>＋</button>
          <button className="nav-icon-btn danger" title="Deletar personagem" onClick={() => setDeleteOpen(true)}>🗑</button>
          <div className="nav-sep" />
          <a className="nav-icon-btn" href="vault/index.html" target="_blank" title="Vault"><VaultIcon /></a>
          <button
            className={'nav-icon-btn' + (editMode ? ' active' : '')}
            title={editMode ? 'Sair do modo edição' : 'Editar'}
            onClick={() => setEditMode(!editMode)}
          >
            ✏
          </button>
          <button className="nav-icon-btn" title="Exportar" onClick={exportActive}>⬆</button>
          <ImportButton />
        </div>
      </nav>

      <DeleteCharacterModal open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </>
  );
}
