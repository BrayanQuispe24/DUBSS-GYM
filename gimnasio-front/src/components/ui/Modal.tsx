// src/components/ui/Modal.tsx
import React from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop show" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
