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
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
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
          color: 'var(--color-text-muted)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: '4px',
          border: '1px solid var(--color-border)',
        }}
      >
        <FaTag style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '0.75rem' }} />
        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          No se encontraron marcas registradas.
        </p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th style={{ padding: '0.65rem 1rem' }}>Marca / Fabricante</th>
            <th style={{ padding: '0.65rem 1rem' }}>Estado</th>
            <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {marcas.map((m) => {
            const isActivo = ['1', 'activo', 'true'].includes(String(m.estado).toLowerCase());
            return (
              <tr key={m.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {m.nombre}
                </td>
                <td style={{ padding: '0.65rem 1rem' }}>
                  <span
                    style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '2px',
                      fontSize: '0.70rem',
                      fontWeight: 700,
                      backgroundColor: isActivo ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                      color: isActivo ? 'var(--color-success-text)' : 'var(--color-danger-text)',
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
                          onClick={() => onDelete(m.id)}
                          title="Eliminar Marca"
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

export default MarcaTable;
