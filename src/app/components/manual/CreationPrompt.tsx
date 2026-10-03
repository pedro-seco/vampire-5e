import { useState } from 'react';
import { CREATION_PROMPT } from '../../data/creationPrompt';

const LABEL_RESET_DELAY_MS = 2000;
const COPIED_STYLE = { color: 'var(--gold)', borderColor: 'var(--gold)' };
const BLOCK_LEADING_WHITESPACE = '\n';
const BLOCK_TRAILING_WHITESPACE = '\n    ';

export function CreationPrompt() {
  const [copyLabel, setCopyLabel] = useState('Copiar');

  const showLabelBriefly = (label: string) => {
    setCopyLabel(label);
    setTimeout(() => setCopyLabel('Copiar'), LABEL_RESET_DELAY_MS);
  };

  const copyPrompt = () => {
    navigator.clipboard
      .writeText(CREATION_PROMPT)
      .then(() => showLabelBriefly('Copiado!'))
      .catch(() => showLabelBriefly('Erro'));
  };

  return (
    <div className="manual-section">
      <div className="manual-section-title">Criação de personagem — prompt para o Claude</div>
      <p className="manual-text" style={{ marginBottom: 12 }}>
        Copie o prompt abaixo e cole numa nova conversa em{' '}
        <a href="https://claude.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>claude.ai</a>.
        O Claude vai guiar a criação do personagem passo a passo e entregar um arquivo JSON que você pode
        importar direto nesta ficha.
      </p>
      <div className="prompt-block">
        {BLOCK_LEADING_WHITESPACE + CREATION_PROMPT + BLOCK_TRAILING_WHITESPACE}
        <button className="prompt-copy-btn" onClick={copyPrompt} style={copyLabel === 'Copiado!' ? COPIED_STYLE : undefined}>
          {copyLabel}
        </button>
        {BLOCK_TRAILING_WHITESPACE}
      </div>
    </div>
  );
}
