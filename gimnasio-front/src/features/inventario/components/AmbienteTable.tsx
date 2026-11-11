// src/features/inventario/components/AmbienteTable.tsx
import React from 'react';
import { FaPenToSquare, FaTrashCan, FaBuildingFlag, FaEye } from 'react-icons/fa6';
import type { Ambiente } from '../services/inventarioService';

interface AmbienteTableProps {
  ambientes: Ambiente[];
  isLoading: boolean;
  isAdmin?: boolean;
  onView?: (ambiente: Ambiente) => void;
  onEdit: (ambiente: Ambiente) => void;
  onDelete: (id: number) => void;
}

const AmbienteTable: React.FC<AmbienteTableProps> = ({
  ambientes,
  isLoading,
  isAdmin = false,
  onView,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
        Cargando listado de ambientes y espacios...
      </div>
    );
  }

  if (ambientes.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--color-text-muted)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
        }}
      >
        <FaBuildingFlag style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '0.75rem' }} />
        <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          No se encontraron ambientes registrados.
        </p>
      </div>
    );
  }

  const getStatusBadge = (estadoRaw: string | boolean) => {
    const isAvailable = estadoRaw === true || ['disponible', '1', 'true', 'activo'].includes(String(estadoRaw ?? '').toLowerCase());
    if (isAvailable) {
      return { label: 'DISPONIBLE', bg: 'var(--color-success-bg)', color: 'var(--color-success-text)' };
    }
    return { label: 'ELIMINADO', bg: 'var(--color-danger-bg)', color: 'var(--color-danger-text)' };
  };

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <th style={{ padding: '0.75rem 1rem' }}>Ambiente / Sala</th>
            <th style={{ padding: '0.75rem 1rem' }}>Descripción / Ubicación</th>
            <th style={{ padding: '0.75rem 1rem' }}>Estado</th>
            <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ambientes.map((amb) => {
            const status = getStatusBadge(amb.estado);
            return (
              <tr key={amb.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.7rem 1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '2px',
                        backgroundColor: status.color,
                        display: 'inline-block',
                      }}
                    />
                    {amb.nombre}
                  </div>
                </td>
                <td style={{ padding: '0.7rem 1rem', color: 'var(--color-text-muted)' }}>
                  {amb.descripcion || 'Sin descripción'}
                </td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  <span
                    style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '2px',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      backgroundColor: status.bg,
                      color: status.color,
                      border: `1px solid ${status.color}33`,
                    }}
                  >
                    {status.label}
                  </span>
                </td>
                <td style={{ padding: '0.7rem 1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                    {onView && (
                      <button
                        onClick={() => onView(amb)}
                        title="Ver Detalle"
                        style={{
                          padding: '0.35rem 0.55rem',
                          borderRadius: '4px',
                          backgroundColor: 'var(--color-primary-soft)',
                          color: 'var(--color-primary-text)',
                          border: '1px solid rgba(220, 38, 38, 0.30)',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        <FaEye />
                      </button>
                    )}
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onEdit(amb)}
                          title="Editar Ambiente"
                          style={{
                            padding: '0.35rem 0.55rem',
                            borderRadius: '4px',
                            backgroundColor: 'var(--color-surface-muted)',
                            color: 'var(--color-text-secondary)',
                            border: '1px solid var(--color-border-strong)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          <FaPenToSquare />
                        </button>
                        <button
                          onClick={() => onDelete(amb.id)}
                          title="Eliminar Ambiente"
                          style={{
                            padding: '0.35rem 0.55rem',
                            borderRadius: '4px',
                            backgroundColor: 'var(--color-danger-bg)',
                            color: 'var(--color-danger-text)',
                            border: '1px solid rgba(220, 38, 38, 0.35)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          <FaTrashCan />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AmbienteTable;
