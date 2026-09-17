// src/features/auth/services/authService.ts
import api from '@/services/api';
import type { LoginCredentials, RegisterClienteData, AuthResponse } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Send email & password to Laravel POST /api/login endpoint
    const response = await api.post<AuthResponse>('/login', {
      email: credentials.identifier,
      password: credentials.password,
    });
    return response.data;
  },

  registerCliente: async (data: RegisterClienteData): Promise<AuthResponse> => {
    const rawName = data.name || `${data.nombre || ''} ${data.apellido || ''}`.trim();
    const nameParts = rawName ? rawName.split(' ') : [];
    const nombre = data.nombre || nameParts[0] || '';
    const apellido = data.apellido || nameParts.slice(1).join(' ') || '';

    const payload = {
      codigo: data.registro_universitario,
      nombre,
      apellido,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
      ci: data.ci,
      celular: data.telefono || '',
      tipo_usuario: data.tipo_usuario || 'estudiante',
      rol: 'Cliente', // Must match Laravel backend 'Cliente' role name in DB
      acepta_terminos: data.acepta_terminos ?? true,
    };

    const response = await api.post<AuthResponse>('/register', payload);
    return response.data;
  },

  getMe: async (): Promise<AuthResponse['user']> => {
    const response = await api.get('/profile');
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/logout');
    } catch {
      // Ignore network errors on logout
    }
  },
};
