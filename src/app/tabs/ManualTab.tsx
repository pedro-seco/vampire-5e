import { CreationPrompt } from '../components/manual/CreationPrompt';
import { UsageGuide } from '../components/manual/UsageGuide';

export function ManualTab() {
  return (
    <div className="page">
      <div className="manual-layout">
        <div className="manual-col">
          <div className="manual-page">
            <UsageGuide />
          </div>
        </div>

        <div className="prompt-col">
          <div className="manual-page">
            <CreationPrompt />
          </div>
        </div>
      </div>
    </div>
  );
}
