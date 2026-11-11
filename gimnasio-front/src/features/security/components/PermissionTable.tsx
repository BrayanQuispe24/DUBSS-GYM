// src/features/security/components/PermissionTable.tsx
import React from 'react';
import { FaPenToSquare, FaTrashCan, FaKey } from 'react-icons/fa6';
import type { Permiso } from '../services/securityService';

interface PermissionTableProps {
  permisos: Permiso[];
  isLoading: boolean;
  onEdit: (permiso: Permiso) => void;
  onDelete: (id: number) => void;
}

const PermissionTable: React.FC<PermissionTableProps> = ({
  permisos,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
        Cargando catálogo de permisos del sistema...
      </div>
    );
  }

  if (permisos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.85rem' }}>
        No hay permisos individuales registrados en el sistema.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border-strong)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th style={{ padding: '0.65rem 0.85rem' }}>Identificador Permiso</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Descripción / Alcance</th>
            <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {permisos.map((permiso) => (
            <tr key={permiso.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <FaKey style={{ color: 'var(--color-warning-text)', fontSize: '0.8rem' }} />
                  <span style={{ fontFamily: 'monospace' }}>{permiso.nombre}</span>
                </div>
              </td>
              <td style={{ padding: '0.65rem 0.85rem', color: 'var(--color-text-muted)' }}>
                {permiso.descripcion || 'Sin descripción'}
              </td>
              <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                  <button
                    onClick={() => onEdit(permiso)}
                    title="Editar Permiso"
                    style={{
                      padding: '0.3rem 0.55rem',
                      borderRadius: '4px',
                      backgroundColor: 'var(--color-surface-muted)',
                      color: 'var(--color-text-secondary)',
                      border: '1px solid var(--color-border-strong)',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    <FaPenToSquare />
                  </button>
                  <button
                    onClick={() => onDelete(permiso.id)}
                    title="Eliminar Permiso"
                    style={{
                      padding: '0.3rem 0.55rem',
                      borderRadius: '4px',
                      backgroundColor: 'var(--color-danger-bg)',
                      color: 'var(--color-danger-text)',
                      border: '1px solid rgba(220, 38, 38, 0.35)',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    <FaTrashCan />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionTable;
