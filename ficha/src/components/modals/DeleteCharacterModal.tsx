import { useCharacter } from '../../context/CharacterContext';

interface DeleteCharacterModalProps {
  open: boolean;
  onClose: () => void;
}

export function DeleteCharacterModal({ open, onClose }: DeleteCharacterModalProps) {
  const { character, deleteActiveCharacter } = useCharacter();

  return (
    <div className={'modal-overlay' + (open ? ' open' : '')}>
      <div className="modal">
        <div className="modal-title">Deletar Personagem</div>
        <p style={{ color: 'var(--txt-m)', fontSize: 15, margin: '0 0 18px', textAlign: 'center' }}>
          Tem certeza que quer deletar <strong style={{ color: 'var(--txt)' }}>{character?.name}</strong>?<br />
          <span style={{ color: '#e05', fontSize: 13 }}>Esta ação não pode ser desfeita.</span>
        </p>
        <div className="modal-actions">
          <button className="modal-btn" onClick={onClose}>Cancelar</button>
          <button
            className="modal-btn primary"
            style={{ background: '#a00', borderColor: '#c00' }}
            onClick={() => { deleteActiveCharacter(); onClose(); }}
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}
