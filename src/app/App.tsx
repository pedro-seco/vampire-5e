import { useEffect, useState } from 'react';
import { CharacterProvider, useCharacter } from './context/CharacterContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { Nav } from './components/Nav';
import type { TabId } from './components/Nav';
import { MechanicsTab } from './tabs/MechanicsTab';
import { NarrativeTab } from './tabs/NarrativeTab';
import { RefTab } from './tabs/RefTab';
import { ManualTab } from './tabs/ManualTab';

function useEditModeBodyClass() {
  const { editMode } = useCharacter();
  useEffect(() => {
    document.body.classList.toggle('edit-mode', editMode);
  }, [editMode]);
}

function Sheet() {
  const [tab, setTab] = useState<TabId>('mechanics');
  useEditModeBodyClass();

  const pageClass = (id: TabId) => 'pg' + (tab === id ? ' visible' : '');

  return (
    <>
      <Nav tab={tab} onTab={setTab} />
      <div id="pg-mechanics" className={pageClass('mechanics')}><MechanicsTab /></div>
      <div id="pg-narrative" className={pageClass('narrative')}><NarrativeTab /></div>
      <div id="pg-ref" className={pageClass('ref')}><RefTab /></div>
      <div id="pg-manual" className={pageClass('manual')}><ManualTab /></div>
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
