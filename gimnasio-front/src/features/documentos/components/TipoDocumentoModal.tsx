// src/features/documentos/components/TipoDocumentoModal.tsx
import React, { useState } from 'react';
import { FaTag, FaPlus } from 'react-icons/fa6';
import { useCreateTipoDocumento } from '../hooks/useDocumentos';
import type { TipoDocumento } from '../services/documentoService';
import { useAuthStore } from '@/store/authStore';

interface TipoDocumentoModalProps {
  isOpen: boolean;
  tipos: TipoDocumento[];
  onClose: () => void;
}

const TipoDocumentoModal: React.FC<TipoDocumentoModalProps> = ({ isOpen, tipos, onClose }) => {
  const { user: currentUser } = useAuthStore();
  const isAdmin = currentUser?.rol === 'administrador';

  const createTipoMutation = useCreateTipoDocumento();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(11, 23, 39, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '1.75rem', width: '100%', maxWidth: '420px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-danger-text)', marginBottom: '0.75rem' }}>
            Acceso Restringido
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Únicamente el usuario con rol <strong>Administrador</strong> tiene autorización para crear tipos de documento.
          </p>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem', borderRadius: '6px',
              backgroundColor: 'var(--color-primary)', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    createTipoMutation.mutate(
      { nombre: nombre.trim(), descripcion: descripcion.trim() || undefined },
      {
        onSuccess: () => {
          setNombre('');
          setDescripcion('');
        },
      }
    );
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(11, 23, 39, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'var(--color-surface, #141419)', borderRadius: '4px', padding: '1.75rem', width: '100%', maxWidth: '520px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid var(--color-border-strong, #383846)', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ borderBottom: '1px solid var(--color-border, #272732)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-primary, #F4F4F5)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaTag style={{ color: 'var(--color-primary-text, #EF4444)' }} /> Gestión de Tipos de Documento
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #A1A1AA)' }}>
            Cree y administre categorías para el repositorio documental institucional.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary, #D4D4D8)', marginBottom: '0.35rem' }}>
              Nombre del Tipo de Documento *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Certificado Médico, Carnet Universitario, Comprobante..."
              style={{
                width: '100%', padding: '0.6rem 0.8rem', borderRadius: '4px',
                border: '1px solid var(--color-border-strong, #383846)', fontSize: '0.88rem',
                backgroundColor: 'var(--color-surface, #141419)', color: 'var(--color-text-primary, #F4F4F5)', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary, #D4D4D8)', marginBottom: '0.35rem' }}>
              Descripción (Opcional)
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Breve descripción o requerimientos del documento..."
              style={{
                width: '100%', padding: '0.6rem 0.8rem', borderRadius: '4px',
                border: '1px solid var(--color-border-strong, #383846)', fontSize: '0.88rem',
                backgroundColor: 'var(--color-surface, #141419)', color: 'var(--color-text-primary, #F4F4F5)', outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={createTipoMutation.isPending}
            style={{
              padding: '0.6rem 1.25rem', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: '#990000', color: '#FFF', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'background-color 0.15s ease'
            }}
          >
            <FaPlus /> {createTipoMutation.isPending ? 'Guardando...' : 'Registrar Tipo de Documento'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--color-border, #272732)', paddingTop: '1rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-secondary, #D4D4D8)', marginBottom: '0.75rem' }}>
            Tipos Registrados Actualmente ({tipos.length}):
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
            {tipos.length === 0 ? (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #A1A1AA)' }}>No hay tipos registrados aun.</span>
            ) : (
              tipos.map((t) => (
                <div key={t.id} style={{ padding: '0.4rem 0.75rem', borderRadius: '4px', backgroundColor: 'var(--color-surface-muted, #1A1A22)', border: '1px solid var(--color-border, #272732)', fontSize: '0.8rem', color: 'var(--color-text-primary, #F4F4F5)' }}>
                  <strong>{t.nombre}</strong>
                  {t.descripcion && <span style={{ color: 'var(--color-text-muted, #A1A1AA)', display: 'block', fontSize: '0.72rem' }}>{t.descripcion}</span>}
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem', borderTop: '1px solid var(--color-border, #272732)', paddingTop: '1rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem', borderRadius: '4px', border: '1px solid var(--color-border-strong, #383846)',
              backgroundColor: 'var(--color-surface, #141419)', color: 'var(--color-text-secondary, #D4D4D8)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TipoDocumentoModal;
