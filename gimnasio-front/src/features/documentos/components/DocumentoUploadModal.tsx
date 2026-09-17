// src/features/documentos/components/DocumentoUploadModal.tsx
import React, { useState } from 'react';
import type { TipoDocumento } from '../services/documentoService';

interface DocumentoUploadModalProps {
  isOpen: boolean;
  tipos: TipoDocumento[];
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
  onOpenTipoModal?: () => void;
}

const DocumentoUploadModal: React.FC<DocumentoUploadModalProps> = ({
  isOpen,
  tipos,
  onClose,
  onSubmit,
  isPending,
  onOpenTipoModal,
}) => {
  const [titulo, setTitulo] = useState('');
  const [idTipoDocumento, setIdTipoDocumento] = useState<number | string>('');
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !idTipoDocumento || !file) {
      alert('Por favor complete todos los campos obligatorios y seleccione un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('id_tipo_documento', String(idTipoDocumento));
    formData.append('archivo', file);

    onSubmit(formData);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.75rem', width: '100%', maxWidth: '480px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B1727', marginBottom: '1.25rem' }}>
          Subir Documento Digital
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Título del Documento *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Carnet Universitario, Certificado Médico..."
              required
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                Tipo de Documento *
              </label>
              {onOpenTipoModal && (
                <button
                  type="button"
                  onClick={onOpenTipoModal}
                  style={{ background: 'none', border: 'none', color: '#003B70', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  + Crear Nuevo Tipo
                </button>
              )}
            </div>
            <select
              value={idTipoDocumento}
              onChange={(e) => setIdTipoDocumento(e.target.value)}
              required
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            >
              <option value="">Seleccione tipo...</option>
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Archivo PDF (Documento en formato .pdf máx 10MB) *
            </label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              required
              style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.55rem 1.1rem', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{ padding: '0.55rem 1.25rem', borderRadius: '6px', border: 'none', backgroundColor: '#003B70', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
            >
              {isPending ? 'Subiendo...' : 'Subir Documento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentoUploadModal;
