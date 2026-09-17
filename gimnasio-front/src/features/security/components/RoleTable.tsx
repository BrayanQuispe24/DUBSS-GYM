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
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        No se encontraron roles registrados.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
            <th style={{ padding: '0.85rem 1.25rem' }}>Rol</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Descripción</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Estado</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Permisos Asignados</th>
            <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((rol) => {
            const countPermisos = rol.permisos
              ? rol.permisos.length
              : (rol.rol_permisos || rol.rolPermisos || []).length;

            return (
            <tr key={rol.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0B1727' }}>
                {rol.nombre}
              </td>
              <td style={{ padding: '0.85rem 1.25rem', color: '#64748B' }}>
                {rol.descripcion || 'Sin descripción'}
              </td>
              <td style={{ padding: '0.85rem 1.25rem' }}>
                <span
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: ['1', 'activo', 'true'].includes(String(rol.estado).toLowerCase()) ? '#DCFCE7' : '#FEE2E2',
                    color: ['1', 'activo', 'true'].includes(String(rol.estado).toLowerCase()) ? '#15803D' : '#B91C1C',
                  }}
                >
                  {String(rol.estado ?? 'activo').toUpperCase()}
                </span>
              </td>
              <td style={{ padding: '0.85rem 1.25rem' }}>
                <span
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    backgroundColor: '#E0F2FE',
                    color: '#0369A1',
                  }}
                >
                  {countPermisos} Permisos
                </span>
              </td>
              <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                  <button
                    onClick={() => onManagePermissions(rol)}
                    title="Matriz de Permisos"
                    style={{
                      padding: '0.4rem 0.6rem',
                      borderRadius: '6px',
                      backgroundColor: '#FEF3C7',
                      color: '#D97706',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <FaKey />
                  </button>
                  <button
                    onClick={() => onEdit(rol)}
                    title="Editar Rol"
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
                    onClick={() => onDelete(rol.id)}
                    title="Eliminar Rol"
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

export default RoleTable;
