// src/features/security/pages/RoleListPage.tsx
import React, { useState } from 'react';
import { FaShieldHalved, FaPlus, FaKey, FaUserGear } from 'react-icons/fa6';
import {
  useRoles,
  usePermisos,
  useCreateRol,
  useUpdateRol,
  useDeleteRol,
  useCreatePermiso,
  useUpdatePermiso,
  useDeletePermiso,
  useAssignRolePermissions,
} from '../hooks/useSecurity';
import type { Rol, Permiso } from '../services/securityService';
import RoleTable from '../components/RoleTable';
import RoleFormModal from '../components/RoleFormModal';
import PermissionTable from '../components/PermissionTable';
import PermissionFormModal from '../components/PermissionFormModal';
import PermissionMatrixModal from '../components/PermissionMatrixModal';

const RoleListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'permisos'>('roles');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPermFormModalOpen, setIsPermFormModalOpen] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);

  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [selectedPermiso, setSelectedPermiso] = useState<Permiso | null>(null);

  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();
  const { data: permisos = [], isLoading: isLoadingPermisos } = usePermisos();

  const createRolMutation = useCreateRol();
  const updateRolMutation = useUpdateRol();
  const deleteRolMutation = useDeleteRol();

  const createPermisoMutation = useCreatePermiso();
  const updatePermisoMutation = useUpdatePermiso();
  const deletePermisoMutation = useDeletePermiso();

  const assignPermissionsMutation = useAssignRolePermissions();

  // Roles actions
  const handleOpenCreateRol = () => {
    setSelectedRol(null);
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRol = (rol: Rol) => {
    setSelectedRol(rol);
    setIsRoleModalOpen(true);
  };

  const handleOpenMatrix = (rol: Rol) => {
    setSelectedRol(rol);
    setIsMatrixModalOpen(true);
  };

  const handleDeleteRol = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este rol del sistema?')) {
      deleteRolMutation.mutate(id);
    }
  };

  const handleRoleSubmit = (data: any) => {
    if (selectedRol) {
      updateRolMutation.mutate(
        { id: selectedRol.id, data },
        { onSuccess: () => setIsRoleModalOpen(false) }
      );
    } else {
      createRolMutation.mutate(data, {
        onSuccess: () => setIsRoleModalOpen(false),
      });
    }
  };

  // Permisos actions
  const handleOpenCreatePermiso = () => {
    setSelectedPermiso(null);
    setIsPermFormModalOpen(true);
  };

  const handleOpenEditPermiso = (p: Permiso) => {
    setSelectedPermiso(p);
    setIsPermFormModalOpen(true);
  };

  const handleDeletePermiso = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este permiso del sistema?')) {
      deletePermisoMutation.mutate(id);
    }
  };

  const handlePermisoSubmit = (data: any) => {
    if (selectedPermiso) {
      updatePermisoMutation.mutate(
        { id: selectedPermiso.id, data },
        { onSuccess: () => setIsPermFormModalOpen(false) }
      );
    } else {
      createPermisoMutation.mutate(data, {
        onSuccess: () => setIsPermFormModalOpen(false),
      });
    }
  };

  const handleMatrixSubmit = (permisosIds: number[]) => {
    if (selectedRol) {
      assignPermissionsMutation.mutate(
        { id_rol: selectedRol.id, permisos: permisosIds },
        { onSuccess: () => setIsMatrixModalOpen(false) }
      );
    }
  };

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B1727', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaShieldHalved style={{ color: '#003B70' }} /> Roles y Matriz de Permisos
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Definición de perfiles de acceso y facultades de seguridad en la plataforma UAGRM.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleOpenCreatePermiso}
            style={{
              padding: '0.65rem 1.1rem',
              borderRadius: '8px',
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              border: '1px solid #FCD34D',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <FaPlus /> Registrar Permiso
          </button>
          <button
            onClick={handleOpenCreateRol}
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
            <FaPlus /> Crear Nuevo Rol
          </button>
        </div>
      </div>

      {/* TAB SELECTOR */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => setActiveTab('roles')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '6px 6px 0 0',
            border: 'none',
            backgroundColor: activeTab === 'roles' ? '#003B70' : 'transparent',
            color: activeTab === 'roles' ? '#FFF' : '#64748B',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FaUserGear /> Roles de Usuario ({roles.length})
        </button>
        <button
          onClick={() => setActiveTab('permisos')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '6px 6px 0 0',
            border: 'none',
            backgroundColor: activeTab === 'permisos' ? '#003B70' : 'transparent',
            color: activeTab === 'permisos' ? '#FFF' : '#64748B',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FaKey /> Catálogo de Permisos ({permisos.length})
        </button>
      </div>

      {/* CONTENT TABS */}
      {activeTab === 'roles' ? (
        <RoleTable
          roles={roles}
          isLoading={isLoadingRoles}
          onEdit={handleOpenEditRol}
          onDelete={handleDeleteRol}
          onManagePermissions={handleOpenMatrix}
        />
      ) : (
        <PermissionTable
          permisos={permisos}
          isLoading={isLoadingPermisos}
          onEdit={handleOpenEditPermiso}
          onDelete={handleDeletePermiso}
        />
      )}

      {/* MODALS */}
      <RoleFormModal
        isOpen={isRoleModalOpen}
        rolToEdit={selectedRol}
        onClose={() => setIsRoleModalOpen(false)}
        onSubmit={handleRoleSubmit}
        isPending={createRolMutation.isPending || updateRolMutation.isPending}
      />

      <PermissionFormModal
        isOpen={isPermFormModalOpen}
        permisoToEdit={selectedPermiso}
        onClose={() => setIsPermFormModalOpen(false)}
        onSubmit={handlePermisoSubmit}
        isPending={createPermisoMutation.isPending || updatePermisoMutation.isPending}
      />

      <PermissionMatrixModal
        isOpen={isMatrixModalOpen}
        rol={selectedRol}
        allPermisos={permisos}
        onClose={() => setIsMatrixModalOpen(false)}
        onSubmit={handleMatrixSubmit}
        isPending={assignPermissionsMutation.isPending}
      />
    </section>
  );
};

export default RoleListPage;
