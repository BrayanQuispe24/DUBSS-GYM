import React from 'react';
import {
  FaSpinner,
  FaUserSlash,
  FaUserShield,
  FaCircleCheck,
  FaBan,
  FaPenToSquare,
  FaUserCheck,
  FaUserLock,
  FaTrashCan,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
} from 'react-icons/fa6';
import type { AuthUser } from '@/store/authStore';

interface UserTableProps {
  users: AuthUser[];
  isLoading: boolean;
  canManage?: boolean;
  onEdit: (user: AuthUser) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (user: AuthUser) => void;
  onView: (user: AuthUser) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  canManage = true,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
}) => {
  const getRoleBadgeClass = (rol: string) => {
    switch (rol) {
      case 'administrador':
        return 'badge-role administrador';
      case 'recepcionista':
        return 'badge-role recepcionista';
      case 'instructor':
        return 'badge-role instructor';
      default:
        return 'badge-role cliente';
    }
  };

  const getRoleLabel = (rol: string) => {
    switch (rol) {
      case 'administrador':
        return 'Administrador';
      case 'recepcionista':
        return 'Recepcionista';
      case 'instructor':
        return 'Instructor';
      default:
        return 'Cliente';
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="table-responsive" style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
        <FaSpinner className="animate-spin" style={{ fontSize: '2rem', color: '#003B70', marginBottom: '0.75rem' }} />
        <div>Cargando directorio de usuarios UAGRM...</div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="table-responsive" style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
        <FaUserSlash style={{ fontSize: '2rem', color: '#94A3B8', marginBottom: '0.75rem' }} />
        <div style={{ fontWeight: 600 }}>No se encontraron usuarios</div>
        <div style={{ fontSize: '0.8rem' }}>Intente ajustar los filtros de búsqueda.</div>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '30px' }}><input type="checkbox" /></th>
            <th>Usuario / Correo</th>
            <th>Rol Asignado</th>
            <th>R.U. / C.I.</th>
            <th>Tipo / Teléfono</th>
            <th>Estado</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isSuspended =
              u.estado === 'suspendido' ||
              (u.estado as any) === 'inactivo' ||
              (u.estado as any) === false ||
              (u.estado as any) === 'false' ||
              (u.estado as any) === 0 ||
              (u.estado as any) === '0';
            return (
              <tr key={u.id}>
                <td><input type="checkbox" /></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: u.rol === 'administrador' ? '#990000' : u.rol === 'recepcionista' ? '#003B70' : '#059669',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {getInitials(u.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0B1727' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={getRoleBadgeClass(u.rol)}>
                    <FaUserShield /> {getRoleLabel(u.rol)}
                  </span>
                  {u.rol === 'instructor' && u.disciplina?.nombre && (
                    <div style={{ fontSize: '0.72rem', color: '#0284C7', fontWeight: 700, marginTop: '0.2rem' }}>
                      {u.disciplina.nombre}
                    </div>
                  )}
                </td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                    {u.registro_universitario || 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    CI: {u.ci || 'Sin CI'}
                  </div>
                </td>
                <td>
                  <div style={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '0.82rem' }}>
                    {u.tipo_usuario || 'Estudiante'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    {u.telefono || 'Sin teléfono'}
                  </div>
                </td>
                <td>
                  <span className={`badge-status ${isSuspended ? 'suspendido' : 'activo'}`}>
                    {isSuspended ? <FaBan /> : <FaCircleCheck />}
                    {isSuspended ? 'Suspendido' : 'Activo'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                    <button
                      className="action-btn"
                      onClick={() => onView(u)}
                      title="Ver Expediente Completo"
                      style={{ backgroundColor: '#F8FAFC', color: '#003B70', border: '1px solid #CBD5E1' }}
                    >
                      <FaEye />
                    </button>
                    {canManage && (
                      <>
                        <button
                          className="action-btn"
                          onClick={() => onEdit(u)}
                          title="Editar usuario"
                        >
                          <FaPenToSquare />
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => onToggleStatus(u)}
                          title={isSuspended ? 'Reactivar usuario' : 'Suspender usuario'}
                        >
                          {isSuspended ? <FaUserCheck /> : <FaUserLock />}
                        </button>
                        <button
                          className="action-btn btn-danger"
                          onClick={() => onDelete(u.id)}
                          title="Eliminar usuario"
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

      <div style={{
        padding: '0.75rem 1rem',
        borderTop: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: '#64748B',
      }}>
        <span>Mostrando {users.length} usuarios registrados en la plataforma</span>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button className="action-btn" disabled><FaChevronLeft /></button>
          <button className="action-btn" style={{ background: '#003B70', color: '#FFF', fontWeight: 700 }}>1</button>
          <button className="action-btn" disabled><FaChevronRight /></button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;

