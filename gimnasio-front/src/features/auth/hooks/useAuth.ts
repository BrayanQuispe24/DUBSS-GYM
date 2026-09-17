// src/features/auth/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '@/store/authStore';
import type { LoginCredentials, RegisterClienteData } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';
import showToast from '@/utils/toast';

export const useLogin = () => {
  const loginStore = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      loginStore(data.user, data.access_token);
      showToast.success(`¡Bienvenido ${data.user.name}!`, 'Inicio de Sesión Exitoso');
      navigate('/dashboard');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const msg = err?.response?.data?.message || 'Credenciales incorrectas. Intente nuevamente.';
      showToast.error(msg, 'Error de Autenticación');
    },
  });
};

export const useRegisterCliente = () => {
  const loginStore = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterClienteData) => authService.registerCliente(data),
    onSuccess: (data) => {
      loginStore(data.user, data.access_token);
      showToast.success('Cuenta de cliente registrada con éxito. ¡Bienvenido a FitGo UAGRM!', 'Registro Exitoso');
      navigate('/dashboard');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const msg = err?.response?.data?.message || 'No se pudo completar el registro.';
      showToast.error(msg, 'Error de Registro');
    },
  });
};

export const useLogout = () => {
  const logoutStore = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      logoutStore();
      showToast.info('Has cerrado sesión correctamente.', 'Sesión Finalizada');
      navigate('/login');
    },
  });
};
