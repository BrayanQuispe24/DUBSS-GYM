// src/features/inventario/components/AmbienteDetailModal.tsx
import React from 'react';
import { FaXmark, FaBuildingFlag, FaDumbbell, FaCircleInfo } from 'react-icons/fa6';
import type { Ambiente } from '../services/inventarioService';

interface AmbienteDetailModalProps {
  isOpen: boolean;
  ambiente: Ambiente | null;
  onClose: () => void;
}

const AmbienteDetailModal: React.FC<AmbienteDetailModalProps> = ({
  isOpen,
  ambiente,
  onClose,
}) => {
  if (!isOpen || !ambiente) return null;

  const getStatusBadge = (estadoRaw: string | boolean) => {
    const est = String(estadoRaw ?? 'disponible').toLowerCase();
    if (['disponible', '1', 'true', 'activo'].includes(est)) {
      return { label: 'DISPONIBLE', bg: '#DCFCE7', color: '#15803D' };
    }
    if (['mantenimiento', 'en mantenimiento'].includes(est)) {
      return { label: 'MANTENIMIENTO', bg: '#FEF3C7', color: '#B45309' };
    }
    return { label: 'INACTIVO', bg: '#FEE2E2', color: '#B91C1C' };
  };

  const status = getStatusBadge(ambiente.estado);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(11, 23, 39, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '600px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#003B70',
                color: '#FFF',
                fontSize: '1rem',
              }}
            >
              <FaBuildingFlag />
            </span>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B1727', margin: 0 }}>
                Detalles del Ambiente
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
                Información técnica y estado del espacio en la plataforma UAGRM.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.2rem',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaXmark />
          </button>
        </div>

        {/* BODY DETAILS */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Main Info Card */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Nombre de la Sala
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1727', marginTop: '0.2rem' }}>
                {ambiente.nombre}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Estado Operativo
              </span>
              <div style={{ marginTop: '0.3rem' }}>
                <span
                  style={{
                    padding: '0.25rem 0.7rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    backgroundColor: status.bg,
                    color: status.color,
                    display: 'inline-block',
                  }}
                >
                  {status.label}
                </span>
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Descripción / Ubicación Especificada
              </span>
              <div
                style={{
                  fontSize: '0.88rem',
                  color: '#334155',
                  marginTop: '0.25rem',
                  lineHeight: '1.5',
                  backgroundColor: '#FFFFFF',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                }}
              >
                {ambiente.descripcion || 'Sin descripción registrada para este ambiente.'}
              </div>
            </div>
          </div>

          {/* Additional Specs */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '10px',
              backgroundColor: '#F0F7FF',
              border: '1px solid #BAE6FD',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <FaCircleInfo style={{ color: '#0284C7', fontSize: '1.2rem', flexShrink: 0 }} />
            <div style={{ fontSize: '0.82rem', color: '#0369A1' }}>
              <strong>Identificador del Ambiente:</strong> #{ambiente.id} — Espacio registrado en la infraestructura del gimnasio universitario.
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.6rem 1.4rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#003B70',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,59,112,0.2)',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmbienteDetailModal;
