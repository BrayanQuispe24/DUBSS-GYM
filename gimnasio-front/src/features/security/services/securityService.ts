// src/features/security/services/securityService.ts
import api from '@/services/api';

export interface RolPermisoRelation {
  id?: number;
  id_rol?: number;
  id_permiso?: number;
  permiso?: Permiso;
}

export interface Rol {
  id: number;
  nombre: string;
  descripcion?: string;
  estado: boolean | string;
  permisos?: Permiso[];
  rol_permisos?: RolPermisoRelation[];
  rolPermisos?: RolPermisoRelation[];
}

export interface Permiso {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface CreateRolData {
  nombre: string;
  descripcion?: string;
  estado?: boolean | string;
}

export interface CreatePermisoData {
  nombre: string;
  descripcion?: string;
}

export interface AssignPermissionsData {
  id_rol: number;
  permisos: number[];
}

export const getRoles = async (): Promise<Rol[]> => {
  const response = await api.get('/roles');
  return response.data.data;
};

export const createRol = async (data: CreateRolData): Promise<Rol> => {
  const payload = {
    ...data,
    estado: data.estado === undefined ? true : (data.estado === 'activo' || data.estado === true || data.estado === '1'),
  };
  const response = await api.post('/roles', payload);
  return response.data.data;
};

export const updateRol = async (id: number, data: Partial<CreateRolData>): Promise<Rol> => {
  const payload = {
    id,
    ...data,
    estado: data.estado !== undefined ? (data.estado === 'activo' || data.estado === true || data.estado === '1') : undefined,
  };
  const response = await api.put('/roles', payload);
  return response.data.data;
};

export const deleteRol = async (id: number): Promise<void> => {
  await api.delete(`/roles/${id}`);
};

export const getPermisos = async (): Promise<Permiso[]> => {
  const response = await api.get('/permisos');
  return response.data.data;
};

export const createPermiso = async (data: CreatePermisoData): Promise<Permiso> => {
  const response = await api.post('/permisos', data);
  return response.data.data;
};

export const updatePermiso = async (id: number, data: Partial<CreatePermisoData>): Promise<Permiso> => {
  const response = await api.put('/roles', data); // or /permisos if PUT supported
  return response.data.data;
};

export const deletePermiso = async (id: number): Promise<void> => {
  await api.delete(`/permisos/${id}`);
};

export const assignRolePermissions = async (data: AssignPermissionsData): Promise<void> => {
  await api.post('/rol-permiso', data);
};
