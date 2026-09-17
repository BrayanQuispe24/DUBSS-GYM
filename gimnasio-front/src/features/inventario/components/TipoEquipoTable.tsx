// src/features/inventario/components/TipoEquipoTable.tsx
import React from 'react';
import { FaPenToSquare, FaTrashCan, FaLayerGroup } from 'react-icons/fa6';
import type { TipoEquipo } from '../services/inventarioService';

interface TipoEquipoTableProps {
  tipos: TipoEquipo[];
  isLoading: boolean;
  onEdit: (tipo: TipoEquipo) => void;
  onDelete: (id: number) => void;
}

const TipoEquipoTable: React.FC<TipoEquipoTableProps> = ({
  tipos,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
        Cargando categorías / tipos de equipo...
      </div>
    );
  }

  if (tipos.length === 0) {
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
        <FaLayerGroup style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '0.75rem' }} />
        <p style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', margin: 0 }}>
          No se encontraron tipos de equipo registrados.
        </p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
            <th style={{ padding: '0.85rem 1.25rem' }}>Categoría / Tipo de Equipo</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Descripción</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Estado</th>
            <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tipos.map((tipo) => {
            const isActivo = ['1', 'activo', 'true'].includes(String(tipo.estado).toLowerCase());
            return (
              <tr key={tipo.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0B1727' }}>
                  {tipo.nombre}
                </td>
                <td style={{ padding: '0.85rem 1.25rem', color: '#64748B' }}>
                  {tipo.descripcion || 'Sin descripción'}
                </td>
                <td style={{ padding: '0.85rem 1.25rem' }}>
                  <span
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: isActivo ? '#DCFCE7' : '#FEE2E2',
                      color: isActivo ? '#15803D' : '#B91C1C',
                    }}
                  >
                    {isActivo ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                    <button
                      onClick={() => onEdit(tipo)}
                      title="Editar Tipo"
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
                      onClick={() => onDelete(tipo.id)}
                      title="Eliminar Tipo"
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

export default TipoEquipoTable;
