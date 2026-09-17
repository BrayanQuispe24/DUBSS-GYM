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
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
        Cargando catálogo de permisos del sistema...
      </div>
    );
  }

  if (permisos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        No hay permisos individuales registrados en el sistema.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
            <th style={{ padding: '0.85rem 1.25rem' }}>Identificador Permiso</th>
            <th style={{ padding: '0.85rem 1.25rem' }}>Descripción / Alcance</th>
            <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {permisos.map((permiso) => (
            <tr key={permiso.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0B1727' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaKey style={{ color: '#D97706', fontSize: '0.9rem' }} />
                  <span>{permiso.nombre}</span>
                </div>
              </td>
              <td style={{ padding: '0.85rem 1.25rem', color: '#64748B' }}>
                {permiso.descripcion || 'Sin descripción'}
              </td>
              <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                  <button
                    onClick={() => onEdit(permiso)}
                    title="Editar Permiso"
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
                    onClick={() => onDelete(permiso.id)}
                    title="Eliminar Permiso"
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionTable;
