// src/features/users/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import type { UserFilterParams, UserFormData } from '../types/user.types';
import showToast from '@/utils/toast';

export const useUsers = (filters?: UserFilterParams) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters),
  });
};

export const useUserDetail = (id: number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id && !isNaN(id),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserFormData) => userService.createUser(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast.success(`Usuario ${data.name} registrado correctamente.`, 'Gestión de Usuarios');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const msg = err?.response?.data?.message || 'Error al registrar usuario.';
      showToast.error(msg, 'Error en Registro');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserFormData> }) =>
      userService.updateUser(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast.success(`Datos de ${data.name || 'usuario'} actualizados.`, 'Gestión de Usuarios');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const msg = err?.response?.data?.message || 'Error al actualizar usuario.';
      showToast.error(msg, 'Error en Edición');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast.warning('Usuario eliminado del sistema UAGRM.', 'Gestión de Usuarios');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const msg = err?.response?.data?.message || 'Error al eliminar usuario.';
      showToast.error(msg, 'Error de Eliminación');
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: number; currentStatus?: string }) =>
      userService.toggleStatus(id, currentStatus),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast.info(`El estado de ${data.name || 'usuario'} ha cambiado.`, 'Estado Actualizado');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const msg = err?.response?.data?.message || 'Error al cambiar estado.';
      showToast.error(msg, 'Error en Operación');
    },
  });
};
