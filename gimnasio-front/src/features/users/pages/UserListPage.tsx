import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa6';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useToggleUserStatus } from '../hooks/useUsers';
import type { UserFilterParams, UserFormData } from '../types/user.types';
import UserFilters from '../components/UserFilters';
import UserTable from '../components/UserTable';
import UserFormModal from '../components/UserFormModal';
import type { AuthUser } from '@/store/authStore';

const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<UserFilterParams>({ search: '', rol: 'todos', estado: 'todos' });
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleOpenCreateModal = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: AuthUser) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleViewUser = (user: AuthUser) => {
    navigate(`/dashboard/users/${user.id}`);
  };

  const handleFormSubmit = (data: UserFormData) => {
    if (userToEdit) {
      updateUser(
        { id: userToEdit.id, data },
        {
          onSuccess: () => setIsModalOpen(false),
        }
      );
    } else {
      createUser(data, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este usuario del sistema UAGRM?')) {
      deleteUser(id);
    }
  };

  const handleToggleStatus = (user: AuthUser) => {
    toggleStatus({ id: user.id, currentStatus: user.estado });
  };

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B1727' }}>Gestión de Usuarios del Sistema</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Administración centralizada de Administradores, Recepcionistas, Instructores y Clientes UAGRM.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #003B70 0%, #002A52 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 59, 112, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FaUserPlus /> Registrar Usuario
        </button>
      </div>

      <UserFilters filters={filters} onChange={handleFilterChange} />

      <UserTable
        users={filteredUsers}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onView={handleViewUser}
      />

      <UserFormModal
        isOpen={isModalOpen}
        userToEdit={userToEdit}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isPending={isCreating || isUpdating}
      />
    </section>
  );
};

export default UserListPage;
