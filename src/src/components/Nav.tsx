import { useEffect, useRef, useState } from 'react';
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

export function Nav({ tab, onTab }: NavProps) {
  const { characters, activeId, switchChar, newCharacter, editMode, setEditMode, exportActive, importCharacter } = useCharacter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  // Any click outside the ▾ button closes the character dropdown.
  useEffect(() => {
    const close = () => setSwitcherOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const selectTab = (id: TabId) => {
    onTab(id);
    window.scrollTo(0, 0);
    setDrawerOpen(false);
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      await importCharacter(file);
    } catch (err) {
      alert('Could not import character: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <>
      <div className={'tab-overlay' + (drawerOpen ? ' open' : '')} onClick={() => setDrawerOpen(false)} />
      <aside className={'tab-drawer' + (drawerOpen ? ' open' : '')}>
        <div className="drawer-head">Seções</div>
        {TABS.map((t) => (
          <button key={t.id} className={'drawer-tab' + (tab === t.id ? ' active' : '')} onClick={() => selectTab(t.id)}>
            {t.label}
          </button>
        ))}
      </aside>

      <nav className="tabnav">
        <button className="nav-icon-btn" id="btn-menu" title="Seções" onClick={() => setDrawerOpen((o) => !o)}>☰</button>
        <div className="nav-tabs">
          {TABS.map((t) => (
            <button key={t.id} className={'nav-tab' + (tab === t.id ? ' active' : '')} onClick={() => selectTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="nav-spacer" />
        <div className="nav-actions">
          <div className="char-switcher">
            <button
              className="nav-icon-btn"
              title="Trocar personagem"
              onClick={(e) => { e.stopPropagation(); setSwitcherOpen((o) => !o); }}
            >
              ▾
            </button>
            <div className={'char-dropdown' + (switcherOpen ? ' open' : '')}>
              {characters.map((c) => (
                <div
                  key={c.id}
                  className={'char-dropdown-item' + (c.id === activeId ? ' active' : '')}
                  onClick={() => { switchChar(c.id); setSwitcherOpen(false); }}
                >
                  {c.name}
                </div>
              ))}
            </div>
          </div>
          <button className="nav-icon-btn" title="Novo personagem" onClick={newCharacter}>＋</button>
          <button className="nav-icon-btn danger" title="Deletar personagem" onClick={() => setDeleteOpen(true)}>🗑</button>
          <div className="nav-sep" />
          <a className="nav-icon-btn" href="vault/index.html" target="_blank" title="Vault">
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 3.5C1 2.67 1.67 2 2.5 2H6l1.5 2H13.5C14.33 4 15 4.67 15 5.5V11.5C15 12.33 14.33 13 13.5 13H2.5C1.67 13 1 12.33 1 11.5V3.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </a>
          <button
            className={'nav-icon-btn' + (editMode ? ' active' : '')}
            title={editMode ? 'Sair do modo edição' : 'Editar'}
            onClick={() => setEditMode(!editMode)}
          >
            ✏
          </button>
          <button className="nav-icon-btn" title="Exportar" onClick={exportActive}>⬆</button>
          <button className="nav-icon-btn" title="Importar" onClick={() => importRef.current?.click()}>⬇</button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={(e) => { handleImport(e.target.files?.[0]); e.target.value = ''; }}
          />
        </div>
      </nav>

      <DeleteCharacterModal open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </>
  );
}
