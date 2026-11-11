// src/features/security/components/RoleTable.tsx
import React from 'react';
import { FaPenToSquare, FaTrashCan, FaKey } from 'react-icons/fa6';
import type { Rol } from '../services/securityService';

interface RoleTableProps {
  roles: Rol[];
  isLoading: boolean;
  onEdit: (rol: Rol) => void;
  onDelete: (id: number) => void;
  onManagePermissions: (rol: Rol) => void;
}

const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  isLoading,
  onEdit,
  onDelete,
  onManagePermissions,
}) => {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
        Cargando matriz de roles del sistema...
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', fontSize: '0.85rem' }}>
        No se encontraron roles registrados.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border-strong)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border-strong)', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th style={{ padding: '0.65rem 0.85rem' }}>Rol</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Descripción</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Estado</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Permisos Asignados</th>
            <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((rol) => {
            const countPermisos = rol.permisos
              ? rol.permisos.length
              : (rol.rol_permisos || rol.rolPermisos || []).length;

            return (
            <tr key={rol.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {rol.nombre}
              </td>
              <td style={{ padding: '0.65rem 0.85rem', color: 'var(--color-text-muted)' }}>
                {rol.descripcion || 'Sin descripción'}
              </td>
              <td style={{ padding: '0.65rem 0.85rem' }}>
                <span
                  style={{
                    padding: '0.15rem 0.5rem',
                    borderRadius: '2px',
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    backgroundColor: ['1', 'activo', 'true'].includes(String(rol.estado).toLowerCase()) ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                    color: ['1', 'activo', 'true'].includes(String(rol.estado).toLowerCase()) ? 'var(--color-success-text)' : 'var(--color-danger-text)',
                  }}
                >
                  {String(rol.estado ?? 'activo').toUpperCase()}
                </span>
              </td>
              <td style={{ padding: '0.65rem 0.85rem' }}>
                <span
                  style={{
                    padding: '0.15rem 0.5rem',
                    borderRadius: '2px',
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    backgroundColor: 'var(--color-primary-soft)',
                    color: 'var(--color-primary-text)',
                  }}
                >
                  {countPermisos} Permisos
                </span>
              </td>
              <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                  <button
                    onClick={() => onManagePermissions(rol)}
                    title="Matriz de Permisos"
                    style={{
                      padding: '0.3rem 0.55rem',
                      borderRadius: '4px',
                      backgroundColor: 'var(--color-warning-bg)',
                      color: 'var(--color-warning-text)',
                      border: '1px solid rgba(217, 119, 6, 0.35)',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    <FaKey />
                  </button>
                  <button
                    onClick={() => onEdit(rol)}
                    title="Editar Rol"
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
                    onClick={() => onDelete(rol.id)}
                    title="Eliminar Rol"
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RoleTable;
