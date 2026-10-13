// src/features/inventario/components/MarcaTable.tsx
import React from 'react';
import { FaPenToSquare, FaTrashCan, FaTag } from 'react-icons/fa6';
import type { Marca } from '../services/inventarioService';

interface MarcaTableProps {
  marcas: Marca[];
  isLoading: boolean;
  isAdmin?: boolean;
  onEdit: (marca: Marca) => void;
  onDelete: (id: number) => void;
}

const MarcaTable: React.FC<MarcaTableProps> = ({
  marcas,
  isLoading,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
        Cargando catálogo de marcas de equipos...
      </div>
    );
  }

  if (marcas.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          color: '#64748B',
          backgroundColor: '#FFFFFF',
          borderRadius: '4px',
          border: '1px solid #E2E8F0',
        }}
      >
        <FaTag style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '0.75rem' }} />
        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#334155', margin: 0 }}>
          No se encontraron marcas registradas.
        </p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th style={{ padding: '0.65rem 1rem' }}>Marca / Fabricante</th>
            <th style={{ padding: '0.65rem 1rem' }}>Estado</th>
            <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {marcas.map((m) => {
            const isActivo = ['1', 'activo', 'true'].includes(String(m.estado).toLowerCase());
            return (
              <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: '#0B1727' }}>
                  {m.nombre}
                </td>
                <td style={{ padding: '0.65rem 1rem' }}>
                  <span
                    style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '2px',
                      fontSize: '0.70rem',
                      fontWeight: 700,
                      backgroundColor: isActivo ? '#DCFCE7' : '#FEE2E2',
                      color: isActivo ? '#15803D' : '#B91C1C',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {isActivo ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </td>
                <td style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onEdit(m)}
                          title="Editar Marca"
                          style={{
                            padding: '0.35rem 0.55rem',
                            borderRadius: '4px',
                            backgroundColor: '#F8FAFC',
                            color: '#475569',
                            border: '1px solid #CBD5E1',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          <FaPenToSquare />
                        </button>
                        <button
                          onClick={() => onDelete(m.id)}
                          title="Eliminar Marca"
                          style={{
                            padding: '0.35rem 0.55rem',
                            borderRadius: '4px',
                            backgroundColor: '#FEE2E2',
                            color: '#DC2626',
                            border: '1px solid #FECACA',
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

export default MarcaTable;
