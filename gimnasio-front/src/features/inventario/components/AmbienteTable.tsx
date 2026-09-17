// src/features/inventario/components/AmbienteTable.tsx
import React from 'react';
import { FaPenToSquare, FaTrashCan, FaBuildingFlag, FaEye } from 'react-icons/fa6';
import type { Ambiente } from '../services/inventarioService';

interface AmbienteTableProps {
  ambientes: Ambiente[];
  isLoading: boolean;
  onView?: (ambiente: Ambiente) => void;
  onEdit: (ambiente: Ambiente) => void;
  onDelete: (id: number) => void;
}

const AmbienteTable: React.FC<AmbienteTableProps> = ({
  ambientes,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
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
          color: '#64748B',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
        }}
      >
        <FaBuildingFlag style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '0.75rem' }} />
        <p style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', margin: 0 }}>
          No se encontraron ambientes registrados.
        </p>
      </div>
    );
  }

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

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
            <th style={{ padding: '0.85rem 1.25rem' }}>Ambiente / Sala</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Descripción / Ubicación</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Estado</th>
            <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ambientes.map((amb) => {
            const status = getStatusBadge(amb.estado);
            return (
              <tr key={amb.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0B1727' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: status.color,
                        display: 'inline-block',
                      }}
                    />
                    {amb.nombre}
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1.25rem', color: '#64748B' }}>
                  {amb.descripcion || 'Sin descripción'}
                </td>
                <td style={{ padding: '0.85rem 1.25rem' }}>
                  <span
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      backgroundColor: status.bg,
                      color: status.color,
                    }}
                  >
                    {status.label}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                    {onView && (
                      <button
                        onClick={() => onView(amb)}
                        title="Ver Detalle"
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
                    )}
                    <button
                      onClick={() => onEdit(amb)}
                      title="Editar Ambiente"
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
                      onClick={() => onDelete(amb.id)}
                      title="Eliminar Ambiente"
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

export default AmbienteTable;
