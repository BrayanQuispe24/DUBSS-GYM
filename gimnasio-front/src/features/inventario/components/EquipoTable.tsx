// src/features/inventario/components/EquipoTable.tsx
import React from 'react';
import { FaEye, FaPenToSquare, FaTrashCan, FaBoxesPacking, FaWrench } from 'react-icons/fa6';
import { getEquipoImageUrl, type Equipo } from '../services/inventarioService';

interface EquipoTableProps {
  equipos: Equipo[];
  isLoading: boolean;
  isAdmin?: boolean;
  onView: (equipo: Equipo) => void;
  onEdit: (equipo: Equipo) => void;
  onDelete: (id: number) => void;
}

const EquipoTable: React.FC<EquipoTableProps> = ({
  equipos,
  isLoading,
  isAdmin = false,
  onView,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
        Cargando inventario de equipos y máquinas...
      </div>
    );
  }

  if (equipos.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          color: 'var(--color-text-muted)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: '4px',
          border: '1px solid var(--color-border)',
        }}
      >
        <FaBoxesPacking style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '0.75rem' }} />
        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          No hay equipos registrados en el inventario.
        </p>
      </div>
    );
  }

  const getStatusBadge = (estadoRaw: any) => {
    const isVigente = estadoRaw === true || estadoRaw === 1 || ['1', 'true', 'bueno', 'operativo', 'vigente'].includes(String(estadoRaw ?? '').toLowerCase());
    if (isVigente) {
      return { label: 'VIGENTE', bg: 'var(--color-success-bg)', color: 'var(--color-success-text)' };
    }
    return { label: 'ELIMINADO', bg: 'var(--color-danger-bg)', color: 'var(--color-danger-text)' };
  };

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th style={{ padding: '0.65rem 1rem' }}>Código / Nombre</th>
            <th style={{ padding: '0.65rem 1rem' }}>Marca / Modelo</th>
            <th style={{ padding: '0.65rem 1rem' }}>Ambiente / Ubicación</th>
            <th style={{ padding: '0.65rem 1rem' }}>Stock</th>
            <th style={{ padding: '0.65rem 1rem' }}>Estado</th>
            <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {equipos.map((eq) => {
            const status = getStatusBadge(eq.estado);
            return (
              <tr key={eq.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {eq.imagen_url ? (
                      <img
                        src={getEquipoImageUrl(eq.imagen_url)}
                        alt={eq.nombre}
                        style={{ width: '38px', height: '38px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--color-border-strong)' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--color-surface-muted)',
                          border: '1px solid var(--color-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-primary-text)',
                          flexShrink: 0,
                        }}
                      >
                        <FaBoxesPacking style={{ fontSize: '1rem' }} />
                      </div>
                    )}
                    <div>
                      <div>{eq.nombre}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-primary-text)', fontWeight: 700 }}>CÓD: {eq.codigo}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '0.65rem 1rem', color: 'var(--color-text-secondary)' }}>
                  {eq.marca?.nombre || 'Genérica'} {eq.modelo ? `(${eq.modelo})` : ''}
                </td>
                <td style={{ padding: '0.65rem 1rem', color: 'var(--color-primary-text)', fontWeight: 600 }}>
                  {eq.ambiente?.nombre || 'General'}
                </td>
                <td style={{ padding: '0.65rem 1rem' }}>
                  {(() => {
                    const activeMantenimientos = (eq.mantenimientos || []).filter((m) =>
                      ['1', 'true', 'pendiente', 'proceso'].includes(String(m.estado).toLowerCase())
                    );
                    const cantMant = activeMantenimientos.reduce((sum, m) => sum + (m.cantidad || 1), 0);

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span
                          style={{
                            padding: '0.15rem 0.5rem',
                            borderRadius: '2px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: eq.cantidad > 0 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                            color: eq.cantidad > 0 ? 'var(--color-success-text)' : 'var(--color-danger-text)',
                            display: 'inline-block',
                            width: 'fit-content',
                          }}
                        >
                          {eq.cantidad} Disponibles
                        </span>
                        {cantMant > 0 && (
                          <span
                            style={{
                              fontSize: '0.70rem',
                              fontWeight: 700,
                              color: 'var(--color-warning-text)',
                              backgroundColor: 'var(--color-warning-bg)',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '2px',
                              width: 'fit-content',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <FaWrench size={9} /> {cantMant} en Mantenimiento
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </td>
                <td style={{ padding: '0.65rem 1rem' }}>
                  <span
                    style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '2px',
                      fontSize: '0.70rem',
                      fontWeight: 700,
                      backgroundColor: status.bg,
                      color: status.color,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {status.label}
                  </span>
                </td>
                <td style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                    <button
                      onClick={() => onView(eq)}
                      title="Ver Ficha Técnica"
                      style={{
                        padding: '0.35rem 0.55rem',
                        borderRadius: '4px',
                        backgroundColor: 'var(--color-surface-muted)',
                        color: 'var(--color-primary-text)',
                        border: '1px solid var(--color-border-strong)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                      }}
                    >
                      <FaEye />
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onEdit(eq)}
                          title="Editar Equipo"
                          style={{
                            padding: '0.35rem 0.55rem',
                            borderRadius: '4px',
                            backgroundColor: 'var(--color-surface-muted)',
                            color: 'var(--color-text-secondary)',
                            border: '1px solid var(--color-border-strong)',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          <FaPenToSquare />
                        </button>
                        <button
                          onClick={() => onDelete(eq.id)}
                          title="Eliminar Equipo"
                          style={{
                            padding: '0.35rem 0.55rem',
                            borderRadius: '4px',
                            backgroundColor: 'var(--color-danger-bg)',
                            color: 'var(--color-danger-text)',
                            border: '1px solid rgba(220, 38, 38, 0.35)',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
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

export default EquipoTable;
