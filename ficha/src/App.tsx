import { useEffect, useState } from 'react';
import { CharacterProvider, useCharacter } from './context/CharacterContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { Nav } from './components/Nav';
import type { TabId } from './components/Nav';
import { MechanicsTab } from './tabs/MechanicsTab';
import { NarrativeTab } from './tabs/NarrativeTab';
import { RefTab } from './tabs/RefTab';
import { ManualTab } from './tabs/ManualTab';

function Sheet() {
  const { editMode } = useCharacter();
  const [tab, setTab] = useState<TabId>('mechanics');

  // sheet.css keys all edit-mode controls off `body.edit-mode`.
  useEffect(() => {
    document.body.classList.toggle('edit-mode', editMode);
  }, [editMode]);

  // All pages stay mounted (like the legacy DOM) so collapse state survives tab switches.
  const page = (id: TabId) => 'pg' + (tab === id ? ' visible' : '');

  return (
    <>
      <Nav tab={tab} onTab={setTab} />
      <div id="pg-mechanics" className={page('mechanics')}><MechanicsTab /></div>
      <div id="pg-narrative" className={page('narrative')}><NarrativeTab /></div>
      <div id="pg-ref" className={page('ref')}><RefTab /></div>
      <div id="pg-manual" className={page('manual')}><ManualTab /></div>
    </>
  );
}

function App() {
  return (
    <CharacterProvider>
      <ConfirmProvider>
        <Sheet />
      </ConfirmProvider>
    </CharacterProvider>
  );
}

export default App;
