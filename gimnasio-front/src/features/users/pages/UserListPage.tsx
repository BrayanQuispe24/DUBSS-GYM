import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaUsers, FaUserGear } from 'react-icons/fa6';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useToggleUserStatus } from '../hooks/useUsers';
import type { UserFilterParams, UserFormData } from '../types/user.types';
import UserFilters from '../components/UserFilters';
import UserTable from '../components/UserTable';
import UserFormPanel from '../components/UserFormPanel';
import { useAuthStore, type AuthUser } from '@/store/authStore';

const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const isAdmin = currentUser?.rol === 'administrador';

  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [filters, setFilters] = useState<UserFilterParams>({ search: '', rol: 'todos', estado: 'todos' });
  const [userToEdit, setUserToEdit] = useState<AuthUser | null>(null);

  const { data: apiUsers, isLoading } = useUsers(filters);
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: toggleStatus } = useToggleUserStatus();

  // Consumir únicamente datos reales obtenidos desde la API / Base de datos
  const baseUsers = apiUsers || [];

  const filteredUsers = baseUsers.filter((u) => {
    if (filters.search) {
      const term = filters.search.toLowerCase();
      const matchName = u.name.toLowerCase().includes(term);
      const matchEmail = u.email.toLowerCase().includes(term);
      const matchRU = u.registro_universitario?.toLowerCase().includes(term);
      const matchCI = u.ci?.toLowerCase().includes(term);
      if (!matchName && !matchEmail && !matchRU && !matchCI) return false;
    }
    if (filters.rol && filters.rol !== 'todos' && u.rol !== filters.rol) {
      return false;
    }
    if (filters.estado && filters.estado !== 'todos' && u.estado !== filters.estado) {
      return false;
    }
    return true;
  });

  const handleFilterChange = (newFilters: Partial<UserFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleOpenCreate = () => {
    if (!isAdmin) return;
    setUserToEdit(null);
    setActiveTab('form');
  };

  const handleOpenEdit = (user: AuthUser) => {
    if (!isAdmin) return;
    setUserToEdit(user);
    setActiveTab('form');
  };

  const handleViewUser = (user: AuthUser) => {
    navigate(`/dashboard/users/${user.id}`);
  };

  const handleFormSubmit = (data: UserFormData) => {
    if (!isAdmin) return;
    if (userToEdit) {
      updateUser(
        { id: userToEdit.id, data },
        {
          onSuccess: () => {
            setActiveTab('list');
            setUserToEdit(null);
          },
        }
      );
    } else {
      createUser(data, {
        onSuccess: () => {
          setActiveTab('list');
          setUserToEdit(null);
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!isAdmin) return;
    if (window.confirm('¿Está seguro de eliminar este usuario del sistema UAGRM?')) {
      deleteUser(id);
    }
  };

  const handleToggleStatus = (user: AuthUser) => {
    if (!isAdmin) return;
    toggleStatus({ id: user.id, currentStatus: user.estado });
  };

  return (
    <section>
      {/* ENTERPRISE TAB NAVIGATION BAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #E2E8F0',
        marginBottom: '1.25rem',
        gap: '0.25rem',
      }}>
        <button
          onClick={() => { setActiveTab('list'); setUserToEdit(null); }}
          style={{
            padding: '0.65rem 1.25rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'list' ? '2px solid #0077D4' : '2px solid transparent',
            color: activeTab === 'list' ? '#0077D4' : '#64748B',
            marginBottom: '-1px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease',
          }}
        >
          <FaUsers size={14} /> Directorio de Usuarios ({baseUsers.length})
        </button>

        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'form' && !userToEdit ? '2px solid #0077D4' : '2px solid transparent',
              color: activeTab === 'form' && !userToEdit ? '#0077D4' : '#64748B',
              marginBottom: '-1px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease',
            }}
          >
            <FaUserPlus size={14} /> Registrar Nuevo Usuario
          </button>
        )}

        {isAdmin && activeTab === 'form' && userToEdit && (
          <button
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              borderBottom: '2px solid #0077D4',
              color: '#0077D4',
              marginBottom: '-1px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FaUserGear size={14} /> Editando: {userToEdit.name}
          </button>
        )}
      </div>

      {/* TAB CONTENT: LIST */}
      {activeTab === 'list' && (
        <>
          <UserFilters filters={filters} onChange={handleFilterChange} />
          <UserTable
            users={filteredUsers}
            isLoading={isLoading}
            canManage={isAdmin}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onView={handleViewUser}
          />
        </>
      )}

      {/* TAB CONTENT: FORM */}
      {isAdmin && activeTab === 'form' && (
        <UserFormPanel
          userToEdit={userToEdit}
          onCancel={() => {
            setActiveTab('list');
            setUserToEdit(null);
          }}
          onSubmit={handleFormSubmit}
          isPending={isCreating || isUpdating}
        />
      )}
    </section>
  );
};

export default UserListPage;
