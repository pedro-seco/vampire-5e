import { useState } from 'react';
import { CREATION_PROMPT } from '../../data/creationPrompt';

const LABEL_RESET_DELAY_MS = 2000;
const COPIED_STYLE = { color: 'var(--gold)', borderColor: 'var(--gold)' };
const BLOCK_LEADING_WHITESPACE = '\n';
const BLOCK_TRAILING_WHITESPACE = '\n    ';

export function CreationPrompt() {
  const [copyLabel, setCopyLabel] = useState('Copy');

  const showLabelBriefly = (label: string) => {
    setCopyLabel(label);
    setTimeout(() => setCopyLabel('Copy'), LABEL_RESET_DELAY_MS);
  };

  const copyPrompt = () => {
    navigator.clipboard
      .writeText(CREATION_PROMPT)
      .then(() => showLabelBriefly('Copied!'))
      .catch(() => showLabelBriefly('Error'));
  };

  return (
    <div className="manual-section">
      <div className="manual-section-title">Character Creation — Claude Prompt</div>
      <p className="manual-text" style={{ marginBottom: 12 }}>
        Copy the prompt below and paste it into a new conversation at{' '}
        <a href="https://claude.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>claude.ai</a>.
        Claude will guide you through building your character step by step and output a JSON file you can
        import directly into this sheet.
      </p>
      <div className="prompt-block">
        {BLOCK_LEADING_WHITESPACE + CREATION_PROMPT + BLOCK_TRAILING_WHITESPACE}
        <button className="prompt-copy-btn" onClick={copyPrompt} style={copyLabel === 'Copied!' ? COPIED_STYLE : undefined}>
          {copyLabel}
        </button>
        {BLOCK_TRAILING_WHITESPACE}
      </div>
    </div>
  );
}
