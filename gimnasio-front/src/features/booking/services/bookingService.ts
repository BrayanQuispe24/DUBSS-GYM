// src/features/booking/services/bookingService.ts
import { authService } from '@/features/auth/services/authService';
import { createFormularioSolicitud, type FormularioSolicitud } from '@/features/tramites/services/tramiteService';
import { useAuthStore } from '@/store/authStore';

export interface SubmitAuthenticatedSolicitudPayload {
  id_usuario: number;
  id_disciplina: number;
  id_disciplina_horario?: number;
  id_plan?: number;
  celular?: string;
}

export interface SubmitGuestSolicitudPayload {
  nombre: string;
  apellido: string;
  email: string;
  registro_universitario: string;
  ci: string;
  celular: string;
  tipo_usuario: 'estudiante' | 'docente' | 'administrativo' | 'particular';
  password: string;
  password_confirmation: string;
  id_disciplina: number;
  id_disciplina_horario?: number;
  id_plan?: number;
}

const generarNumeroFormulario = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `DUBSS-FR-03-${new Date().getFullYear()}-${randomNum}`;
};

export const submitAuthenticatedSolicitud = async (
  payload: SubmitAuthenticatedSolicitudPayload
): Promise<FormularioSolicitud> => {
  return createFormularioSolicitud({
    numero_formulario: generarNumeroFormulario(),
    id_usuario: payload.id_usuario,
    id_disciplina: payload.id_disciplina,
    id_disciplina_horario: payload.id_disciplina_horario || null,
    id_plan: payload.id_plan || null,
    celular: payload.celular || null,
    estado: 'pendiente',
  });
};

export const submitGuestSolicitud = async (
  payload: SubmitGuestSolicitudPayload
): Promise<FormularioSolicitud> => {
  const authResponse = await authService.registerCliente({
    name: `${payload.nombre} ${payload.apellido}`.trim(),
    nombre: payload.nombre,
    apellido: payload.apellido,
    email: payload.email,
    registro_universitario: payload.registro_universitario,
    ci: payload.ci,
    telefono: payload.celular,
    tipo_usuario: payload.tipo_usuario,
    password: payload.password,
    password_confirmation: payload.password_confirmation,
    acepta_terminos: true,
  });

  useAuthStore.getState().login(authResponse.user, authResponse.access_token);
  const createdUserId = authResponse.user.id;

  return createFormularioSolicitud({
    numero_formulario: generarNumeroFormulario(),
    id_usuario: createdUserId,
    id_disciplina: payload.id_disciplina,
    id_disciplina_horario: payload.id_disciplina_horario || null,
    id_plan: payload.id_plan || null,
    celular: payload.celular,
    estado: 'pendiente',
  });
};
