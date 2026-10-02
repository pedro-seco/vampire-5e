import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ConfirmState {
  message: string;
  onConfirm: () => void;
}

interface ConfirmContextValue {
  confirmDelete: (message: string, onConfirm: () => void) => void;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<ConfirmState | null>(null);

  const confirmDelete = useCallback((message: string, onConfirm: () => void) => {
    setPending({ message, onConfirm });
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirmDelete }}>
      {children}
      <div className={'confirm-overlay' + (pending ? ' open' : '')}>
        <div className="confirm-box">
          <div className="confirm-msg">{pending?.message}</div>
          <div className="confirm-actions">
            <button className="modal-btn" onClick={() => setPending(null)}>
              Cancel
            </button>
            <button
              className="modal-btn primary"
              onClick={() => {
                pending?.onConfirm();
                setPending(null);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmContextValue {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
}
