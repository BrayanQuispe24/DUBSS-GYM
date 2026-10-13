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
    const isAvailable = estadoRaw === true || ['disponible', '1', 'true', 'activo'].includes(String(estadoRaw ?? '').toLowerCase());
    if (isAvailable) {
      return { label: 'DISPONIBLE', bg: '#DCFCE7', color: '#15803D' };
    }
    return { label: 'ELIMINADO', bg: '#FEE2E2', color: '#B91C1C' };
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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
              <tr key={amb.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.7rem 1rem', fontWeight: 700, color: '#0B1727' }}>
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
                <td style={{ padding: '0.7rem 1rem', color: '#64748B' }}>
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
                          backgroundColor: '#E0F2FE',
                          color: '#0369A1',
                          border: '1px solid #BAE6FD',
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
                            backgroundColor: '#F8FAFC',
                            color: '#475569',
                            border: '1px solid #CBD5E1',
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
                            backgroundColor: '#FEE2E2',
                            color: '#DC2626',
                            border: '1px solid #FCA5A5',
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
