// src/features/users/services/userService.ts
import api from '@/services/api';
import { normalizeUser, type AuthUser } from '@/store/authStore';
import type { UserFilterParams, UserFormData, UserFullDetail } from '../types/user.types';

export const userService = {
  getUsers: async (params?: UserFilterParams): Promise<AuthUser[]> => {
    const response = await api.get<{ data: unknown[] } | unknown[]>('/usuarios', { params });
    const rawList = Array.isArray(response.data)
      ? response.data
      : (response.data as { data?: unknown[] })?.data || [];
    return rawList.map((item) => normalizeUser(item)).filter((u): u is AuthUser => u !== null);
  },

  getUserById: async (id: number): Promise<UserFullDetail> => {
    const response = await api.get(`/usuarios/${id}`);
    const rawData = (response.data as { data?: any })?.data || response.data;
    const normalized = normalizeUser(rawData);
    if (!normalized) throw new Error('Error al obtener datos del usuario');
    return {
      ...normalized,
      created_at: rawData.created_at,
      historiales: rawData.historiales || [],
      documentos: rawData.documentos || [],
      raw: rawData,
    };
  },

  createUser: async (data: UserFormData): Promise<AuthUser> => {
    const payload = {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      password: data.password,
      rol: data.rol,
      codigo: data.codigo || data.registro_universitario || '',
      ci: data.ci || '',
      celular: data.celular || data.telefono || '',
      tipo_usuario: data.tipo_usuario || 'estudiante',
      estado: data.estado || 'activo',
    };
    const response = await api.post('/usuarios', payload);
    const normalized = normalizeUser((response.data as { data?: unknown })?.data || response.data);
    return normalized || {
      id: 0,
      name: `${data.nombre} ${data.apellido}`,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      rol: data.rol,
    };
  },

  updateUser: async (id: number, data: Partial<UserFormData>): Promise<AuthUser> => {
    const payload: Record<string, unknown> = {
      id,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      rol: data.rol,
      codigo: data.codigo || data.registro_universitario || '',
      ci: data.ci || '',
      celular: data.celular || data.telefono || '',
      tipo_usuario: data.tipo_usuario,
      estado: data.estado,
    };
    if (data.password && data.password.trim() !== '') {
      payload.password = data.password;
    }

    const response = await api.put('/usuarios', payload);
    const normalized = normalizeUser((response.data as { data?: unknown })?.data || response.data);
    return normalized || {
      id,
      name: `${data.nombre || ''} ${data.apellido || ''}`.trim(),
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email || '',
      rol: data.rol || 'cliente',
    };
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },

  toggleStatus: async (id: number, currentStatus?: string | boolean | number): Promise<AuthUser> => {
    const isCurrentlyActive =
      currentStatus === 'activo' ||
      currentStatus === '1' ||
      currentStatus === 1 ||
      currentStatus === true ||
      currentStatus === 'true';

    const nextStatus = isCurrentlyActive ? 'suspendido' : 'activo';
    const response = await api.patch('/usuarios/estado', { id, estado: nextStatus });
    const normalized = normalizeUser((response.data as { data?: unknown })?.data || response.data);
    return normalized || { id, name: 'Usuario', email: '', rol: 'cliente', estado: nextStatus };
  },
};
