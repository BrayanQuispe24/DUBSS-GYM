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
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
        Cargando matriz de roles del sistema...
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B', backgroundColor: '#FFF', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}>
        No se encontraron roles registrados.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #CBD5E1', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #CBD5E1', color: '#475569', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
            <tr key={rol.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
              <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0B1727' }}>
                {rol.nombre}
              </td>
              <td style={{ padding: '0.65rem 0.85rem', color: '#64748B' }}>
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
                    backgroundColor: ['1', 'activo', 'true'].includes(String(rol.estado).toLowerCase()) ? '#DCFCE7' : '#FEE2E2',
                    color: ['1', 'activo', 'true'].includes(String(rol.estado).toLowerCase()) ? '#15803D' : '#B91C1C',
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
                    backgroundColor: '#E0F2FE',
                    color: '#0077D4',
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
                      backgroundColor: '#FEF3C7',
                      color: '#D97706',
                      border: '1px solid #FCD34D',
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
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      border: '1px solid #CBD5E1',
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
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      border: '1px solid #FCA5A5',
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
