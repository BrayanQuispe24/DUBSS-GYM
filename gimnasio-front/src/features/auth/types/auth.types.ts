// src/features/auth/types/auth.types.ts
import type { AuthUser } from '@/store/authStore';

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterClienteData {
  name?: string;
  nombre?: string;
  apellido?: string;
  email: string;
  password: string;
  password_confirmation: string;
  ci: string;
  registro_universitario: string;
  tipo_usuario: 'estudiante' | 'docente' | 'administrativo' | 'particular';
  telefono?: string;
  acepta_terminos?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  access_token: string;
  token_type?: string;
  message?: string;
}
