// src/features/security/hooks/useSecurity.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRoles,
  createRol,
  updateRol,
  deleteRol,
  getPermisos,
  createPermiso,
  updatePermiso,
  deletePermiso,
  assignRolePermissions,
  type CreateRolData,
  type CreatePermisoData,
} from '../services/securityService';
import showToast from '@/utils/toast';

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });
};

export const usePermisos = () => {
  return useQuery({
    queryKey: ['permisos'],
    queryFn: getPermisos,
  });
};

export const useCreateRol = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showToast.success('Rol creado exitosamente.', 'Seguridad');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al crear el rol.', 'Error');
    },
  });
};

export const useUpdateRol = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateRolData> }) => updateRol(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showToast.success('Rol actualizado exitosamente.', 'Seguridad');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al actualizar el rol.', 'Error');
    },
  });
};

export const useDeleteRol = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showToast.success('Rol eliminado exitosamente.', 'Seguridad');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al eliminar el rol.', 'Error');
    },
  });
};

export const useCreatePermiso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPermiso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permisos'] });
      showToast.success('Permiso del sistema creado exitosamente.', 'Seguridad');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al crear permiso.', 'Error');
    },
  });
};

export const useUpdatePermiso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreatePermisoData> }) => updatePermiso(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permisos'] });
      showToast.success('Permiso actualizado exitosamente.', 'Seguridad');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al actualizar permiso.', 'Error');
    },
  });
};

export const useDeletePermiso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePermiso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permisos'] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showToast.success('Permiso eliminado exitosamente.', 'Seguridad');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al eliminar permiso.', 'Error');
    },
  });
};

export const useAssignRolePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignRolePermissions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showToast.success('Permisos asignados al rol exitosamente.', 'Matriz de Permisos');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al asignar permisos.', 'Error');
    },
  });
};
