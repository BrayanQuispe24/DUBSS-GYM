// src/features/inventario/components/EquipoTable.tsx
import React from 'react';
import { FaEye, FaPenToSquare, FaTrashCan, FaBoxesPacking } from 'react-icons/fa6';
import type { Equipo } from '../services/inventarioService';

interface EquipoTableProps {
  equipos: Equipo[];
  isLoading: boolean;
  onView: (equipo: Equipo) => void;
  onEdit: (equipo: Equipo) => void;
  onDelete: (id: number) => void;
}

const EquipoTable: React.FC<EquipoTableProps> = ({
  equipos,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
        Cargando inventario de equipos y máquinas...
      </div>
    );
  }

  if (equipos.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '3.5rem 2rem',
          color: '#64748B',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
        }}
      >
        <FaBoxesPacking style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '0.75rem' }} />
        <p style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', margin: 0 }}>
          No hay equipos registrados en el inventario.
        </p>
      </div>
    );
  }

  const getStatusBadge = (estadoRaw: string) => {
    const est = String(estadoRaw ?? 'bueno').toLowerCase();
    if (['bueno', 'excelente', 'operativo'].includes(est)) {
      return { label: 'BUENO', bg: '#DCFCE7', color: '#15803D' };
    }
    if (['regular', 'revisión'].includes(est)) {
      return { label: 'REGULAR', bg: '#FEF3C7', color: '#B45309' };
    }
    if (['mantenimiento', 'en mantenimiento'].includes(est)) {
      return { label: 'EN MANTENIMIENTO', bg: '#DBEAFE', color: '#1E40AF' };
    }
    return { label: 'BAJA', bg: '#FEE2E2', color: '#B91C1C' };
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
            <th style={{ padding: '0.85rem 1.25rem' }}>Código / Nombre</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Marca / Modelo</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Ambiente / Ubicación</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Stock</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Estado</th>
            <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {equipos.map((eq) => {
            const status = getStatusBadge(eq.estado);
            return (
              <tr key={eq.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0B1727' }}>
                  <div>{eq.nombre}</div>
                  <div style={{ fontSize: '0.75rem', color: '#003B70', fontWeight: 700 }}>CÓD: {eq.codigo}</div>
                </td>
                <td style={{ padding: '0.85rem 1.25rem', color: '#475569' }}>
                  {eq.marca?.nombre || 'Genérica'} {eq.modelo ? `(${eq.modelo})` : ''}
                </td>
                <td style={{ padding: '0.85rem 1.25rem', color: '#0369A1', fontWeight: 600 }}>
                  {eq.ambiente?.nombre || 'General'}
                </td>
                <td style={{ padding: '0.85rem 1.25rem' }}>
                  {(() => {
                    const activeMantenimientos = (eq.mantenimientos || []).filter((m) =>
                      ['1', 'true', 'pendiente', 'proceso'].includes(String(m.estado).toLowerCase())
                    );
                    const cantMant = activeMantenimientos.reduce((sum, m) => sum + (m.cantidad || 1), 0);

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            backgroundColor: eq.cantidad > 0 ? '#DCFCE7' : '#FEE2E2',
                            color: eq.cantidad > 0 ? '#15803D' : '#DC2626',
                            display: 'inline-block',
                            width: 'fit-content',
                          }}
                        >
                          {eq.cantidad} Disponibles
                        </span>
                        {cantMant > 0 && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: '#B45309',
                              backgroundColor: '#FEF3C7',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              width: 'fit-content',
                            }}
                          >
                            🛠️ {cantMant} en Mantenimiento
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </td>
                <td style={{ padding: '0.85rem 1.25rem' }}>
                  <span
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: status.bg,
                      color: status.color,
                    }}
                  >
                    {status.label}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                    <button
                      onClick={() => onView(eq)}
                      title="Ver Ficha Técnica"
                      style={{
                        padding: '0.4rem 0.6rem',
                        borderRadius: '6px',
                        backgroundColor: '#E0F2FE',
                        color: '#0369A1',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => onEdit(eq)}
                      title="Editar Equipo"
                      style={{
                        padding: '0.4rem 0.6rem',
                        borderRadius: '6px',
                        backgroundColor: '#F1F5F9',
                        color: '#475569',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <FaPenToSquare />
                    </button>
                    <button
                      onClick={() => onDelete(eq.id)}
                      title="Eliminar Equipo"
                      style={{
                        padding: '0.4rem 0.6rem',
                        borderRadius: '6px',
                        backgroundColor: '#FEE2E2',
                        color: '#DC2626',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <FaTrashCan />
                    </button>
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
