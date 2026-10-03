import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { DeleteCharacterModal } from './modals/DeleteCharacterModal';

export type TabId = 'mechanics' | 'narrative' | 'ref' | 'manual' | 'vault';

const TABS: { id: TabId; label: string }[] = [
  { id: 'mechanics', label: 'Mecânica' },
  { id: 'narrative', label: 'Narrativa' },
  { id: 'ref', label: 'Ref' },
  { id: 'manual', label: 'Manual' },
  { id: 'vault', label: 'Vault' },
];

interface NavProps {
  tab: TabId;
  onTab: (tab: TabId) => void;
}

function CharacterSwitcher() {
  const { characters, activeId, switchChar } = useCharacter();
  const activeName = characters.find((summary) => summary.id === activeId)?.name ?? 'Personagem';
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
      <button className="nav-text-btn nav-switch-btn" title="Trocar personagem" onClick={toggle}>
        <span className="nav-switch-name">{activeName}</span> ▾
      </button>
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
      alert('Não foi possível importar o personagem: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const onFileChosen = (event: ChangeEvent<HTMLInputElement>) => {
    importFile(event.target.files?.[0]);
    event.target.value = '';
  };

  return (
    <>
      <button className="nav-text-btn" onClick={() => fileInput.current?.click()}>Importar</button>
      <input ref={fileInput} type="file" accept=".json" style={{ display: 'none' }} onChange={onFileChosen} />
    </>
  );
}

export function Nav({ tab, onTab }: NavProps) {
  const { newCharacter, editMode, setEditMode, exportActive } = useCharacter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const selectTab = (id: TabId) => {
    if (id !== 'vault' && window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search);
    onTab(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
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
          <button className="nav-text-btn" onClick={newCharacter}>Novo</button>
          <button className={'nav-text-btn' + (editMode ? ' active' : '')} onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Sair da edição' : 'Editar'}
          </button>
          <button className="nav-text-btn" onClick={exportActive}>Exportar</button>
          <ImportButton />
          <button className="nav-text-btn" onClick={() => window.print()}>Impressão</button>
          <button className="nav-text-btn danger" onClick={() => setDeleteOpen(true)}>Excluir</button>
        </div>
      </nav>

      <DeleteCharacterModal open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </>
  );
}
