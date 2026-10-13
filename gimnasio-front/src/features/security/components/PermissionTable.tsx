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
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B', backgroundColor: '#FFF', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}>
        No hay permisos individuales registrados en el sistema.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #CBD5E1', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #CBD5E1', color: '#475569', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th style={{ padding: '0.65rem 0.85rem' }}>Identificador Permiso</th>
            <th style={{ padding: '0.65rem 0.85rem' }}>Descripción / Alcance</th>
            <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {permisos.map((permiso) => (
            <tr key={permiso.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
              <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0B1727' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <FaKey style={{ color: '#D97706', fontSize: '0.8rem' }} />
                  <span style={{ fontFamily: 'monospace' }}>{permiso.nombre}</span>
                </div>
              </td>
              <td style={{ padding: '0.65rem 0.85rem', color: '#64748B' }}>
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
                    onClick={() => onDelete(permiso.id)}
                    title="Eliminar Permiso"
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionTable;
