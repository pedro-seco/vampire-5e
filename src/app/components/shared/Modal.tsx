import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  confirmLabel?: string;
  children: ReactNode;
}

export function Modal({ open, title, onCancel, onConfirm, confirmDisabled, confirmLabel = 'Adicionar', children }: ModalProps) {
  return (
    <div className={'modal-overlay' + (open ? ' open' : '')}>
      <div className="modal">
        <div className="modal-title">{title}</div>
        {children}
        <div className="modal-actions">
          <button className="modal-btn" onClick={onCancel}>Cancelar</button>
          <button className="modal-btn primary" onClick={onConfirm} disabled={confirmDisabled}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
