import { NewspaperPage } from '../components/narrative/NewspaperPage';
import { FitPage } from './FitPage';

export function NarrativeSheet() {
  return (
    <FitPage className="print-narrative">
      <NewspaperPage />
    </FitPage>
  );
}
