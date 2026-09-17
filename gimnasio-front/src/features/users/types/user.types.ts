// src/features/users/types/user.types.ts
import type { AuthUser, UserRole } from '@/store/authStore';
import type { Historial } from '@/features/historial/services/historialService';
import type { Documento } from '@/features/documentos/services/documentoService';

export interface UserFilterParams {
  search?: string;
  rol?: string;
  estado?: string;
  page?: number;
}

export interface UserFormData {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: UserRole;
  codigo?: string;
  registro_universitario?: string;
  ci?: string;
  celular?: string;
  telefono?: string;
  tipo_usuario?: 'estudiante' | 'docente' | 'administrativo' | 'particular';
  estado?: 'activo' | 'suspendido';
  password?: string;
}

export interface UserListResponse {
  data: AuthUser[];
  total: number;
  page: number;
  last_page: number;
}

export interface UserFullDetail extends AuthUser {
  created_at?: string;
  historiales?: Historial[];
  documentos?: Documento[];
  raw?: Record<string, unknown>;
}

