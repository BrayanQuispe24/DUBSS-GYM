// src/features/documentos/components/DocumentoUploadModal.tsx
import React, { useState, useRef } from 'react';
import {
  FaCloudArrowUp,
  FaFilePdf,
  FaXmark,
  FaPlus,
  FaSpinner,
  FaFileLines,
  FaUser,
  FaCheck,
  FaTrashCan,
} from 'react-icons/fa6';
import type { TipoDocumento } from '../services/documentoService';
import { useAuthStore, type AuthUser } from '@/store/authStore';

interface DocumentoUploadModalProps {
  isOpen: boolean;
  tipos: TipoDocumento[];
  users?: AuthUser[];
  defaultUserId?: number;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
  onOpenTipoModal?: () => void;
}

const DocumentoUploadModal: React.FC<DocumentoUploadModalProps> = ({
  isOpen,
  tipos,
  users = [],
  defaultUserId,
  onClose,
  onSubmit,
  isPending,
  onOpenTipoModal,
}) => {
  const { user: currentUser } = useAuthStore();
  const isCliente = currentUser?.rol === 'cliente';

  const [titulo, setTitulo] = useState('');
  const [idTipoDocumento, setIdTipoDocumento] = useState<number | string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  if (!isCliente) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(11, 23, 39, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        padding: '1rem',
      }}>
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.75rem', width: '100%', maxWidth: '420px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #E2E8F0', textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#DC2626', marginBottom: '0.75rem' }}>
            Acceso Restringido
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
            Únicamente los usuarios con rol <strong>Cliente</strong> pueden subir documentos al sistema.
          </p>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem', borderRadius: '6px',
              backgroundColor: '#003B70', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.pdf')) {
        setFile(droppedFile);
      } else {
        alert('Por favor seleccione únicamente un archivo en formato PDF.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !idTipoDocumento || !file) {
      alert('Por favor complete todos los campos obligatorios y adjunte un archivo PDF.');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo.trim());
    formData.append('id_tipo_documento', String(idTipoDocumento));
    formData.append('archivo', file);
    if (currentUser?.id) {
      formData.append('id_usuario', String(currentUser.id));
    }

    onSubmit(formData);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.75rem 2rem', width: '100%', maxWidth: '520px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #E2E8F0', position: 'relative',
      }}>
        {/* Header with Close Icon */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1727', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #003B70 0%, #002A52 100%)',
                color: '#FFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
              }}>
                <FaCloudArrowUp />
              </span>
              Subir Documento Digital
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
              Cargue carnets, certificados o respaldos en formato PDF.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px',
              color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E2E8F0';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F1F5F9';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <FaXmark />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Campo: Título del Documento */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              <FaFileLines style={{ color: '#003B70' }} /> Título del Documento *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Carnet de Identidad, Certificado Médico 2026..."
              required
              style={{
                width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px',
                border: '1px solid #CBD5E1', fontSize: '0.88rem', color: '#0F172A',
              }}
            />
          </div>

          {/* Campo: Tipo de Documento */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                Tipo de Documento *
              </label>
              {onOpenTipoModal && currentUser?.rol === 'administrador' && (
                <button
                  type="button"
                  onClick={onOpenTipoModal}
                  style={{
                    background: 'none', border: 'none', color: '#003B70', fontSize: '0.75rem', fontWeight: 700,
                    cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                  }}
                >
                  <FaPlus style={{ fontSize: '0.65rem' }} /> Crear Nuevo Tipo
                </button>
              )}
            </div>
            <select
              value={idTipoDocumento}
              onChange={(e) => setIdTipoDocumento(e.target.value)}
              required
              style={{
                width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px',
                border: '1px solid #CBD5E1', fontSize: '0.88rem', color: '#0F172A',
              }}
            >
              <option value="">Seleccione tipo de documento...</option>
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Drag & Drop Zone / File Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              Archivo PDF (Máx. 10 MB) *
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: isDragging ? '2px dashed #003B70' : '2px dashed #CBD5E1',
                  backgroundColor: isDragging ? '#F0F7FF' : '#F8FAFC',
                  borderRadius: '12px',
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#003B70';
                  e.currentTarget.style.backgroundColor = '#F0F7FF';
                }}
                onMouseLeave={(e) => {
                  if (!isDragging) {
                    e.currentTarget.style.borderColor = '#CBD5E1';
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }
                }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0', color: '#003B70', margin: '0 auto 0.75rem auto',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  <FaCloudArrowUp />
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.25rem' }}>
                  Arrastra tu archivo PDF aquí o <span style={{ color: '#003B70', textDecoration: 'underline' }}>Explorar</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Solo formato .pdf (Tamaño máximo 10 MB)
                </div>
              </div>
            ) : (
              <div style={{
                border: '1px solid #A7F3D0',
                backgroundColor: '#ECFDF5',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', overflow: 'hidden' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEE2E2',
                    color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', flexShrink: 0,
                  }}>
                    <FaFilePdf />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{
                      fontWeight: 700, fontSize: '0.88rem', color: '#0F172A',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px',
                    }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <FaCheck /> {formatFileSize(file.size)} • Listo para subir
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFile(null)}
                  style={{
                    background: '#FFFFFF', border: '1px solid #FECACA', borderRadius: '8px',
                    padding: '0.4rem 0.6rem', color: '#DC2626', cursor: 'pointer', fontSize: '0.8rem',
                    fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem',
                  }}
                  title="Quitar archivo"
                >
                  <FaTrashCan /> Cambiar
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF', color: '#475569', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || !file}
              style={{
                padding: '0.65rem 1.5rem', borderRadius: '10px', border: 'none',
                background: isPending || !file ? '#94A3B8' : 'linear-gradient(135deg, #003B70 0%, #002A52 100%)',
                color: '#FFFFFF', fontWeight: 700, fontSize: '0.85rem', cursor: isPending || !file ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: isPending || !file ? 'none' : '0 4px 12px rgba(0, 59, 112, 0.25)',
              }}
            >
              {isPending ? (
                <>
                  <FaSpinner className="animate-spin" /> Subiendo...
                </>
              ) : (
                'Subir Documento'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentoUploadModal;

