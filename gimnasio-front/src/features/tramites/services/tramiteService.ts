// src/features/tramites/services/tramiteService.ts
import api from '@/services/api';

export interface FormularioSolicitud {
  id: number;
  numero_formulario: string;
  estado: string;
  fecha_registro?: string;
  id_disciplina: number;
  id_plan?: number;
  id_usuario: number;
  disciplina?: { id: number; nombre: string };
  plan?: { id: number; nombre: string; duracion_dias?: number; tarifa?: { id: number; nombre: string; precio: number } };
  usuario?: { id: number; nombre: string; apellido: string };
}

export interface BoletaPago {
  id: number;
  numero_boleta: string;
  fecha_pago?: string;
  monto: number;
  metodo_pago: string;
  concepto?: string;
  estado: string;
  comprobante_url?: string;
  id_formulario: number;
  formulario_solicitud?: FormularioSolicitud;
}

export interface BoletaInscripcion {
  id: number;
  numero_boleta: string;
  fecha_inscripcion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  monto: number;
  estado: string;
  disciplina?: string;
  id_tarifa?: number;
  id_usuario: number;
  usuario?: { id: number; nombre: string; apellido: string };
}

export const getFormulariosSolicitud = async (): Promise<FormularioSolicitud[]> => {
  const response = await api.get('/formulario-solicitudes');
  return response.data?.data ?? response.data ?? [];
};

export const createFormularioSolicitud = async (data: any): Promise<FormularioSolicitud> => {
  const response = await api.post('/formulario-solicitudes', data);
  return response.data?.data ?? response.data;
};

export const updateEstadoSolicitud = async ({ id, estado }: { id: number; estado: string }): Promise<FormularioSolicitud> => {
  const response = await api.patch(`/formulario-solicitudes/${id}/estado`, { estado });
  return response.data?.data ?? response.data;
};

export const getBoletasPago = async (): Promise<BoletaPago[]> => {
  const response = await api.get('/boletas-pago');
  return response.data?.data ?? response.data ?? [];
};

export const createBoletaPago = async (data: any): Promise<BoletaPago> => {
  const response = await api.post('/boletas-pago', data);
  return response.data?.data ?? response.data;
};

export const getBoletasInscripcion = async (): Promise<BoletaInscripcion[]> => {
  const response = await api.get('/boletas-inscripcion');
  return response.data?.data ?? response.data ?? [];
};

export const createBoletaInscripcion = async (data: any): Promise<BoletaInscripcion> => {
  const response = await api.post('/boletas-inscripcion', data);
  return response.data?.data ?? response.data;
};

export const emitirInscripcionDesdePago = async ({ id, numero_comprobante, fecha_inicio, fecha_fin }: { id: number; numero_comprobante?: string; fecha_inicio?: string; fecha_fin?: string }): Promise<any> => {
  const response = await api.post(`/boletas-pago/${id}/emitir-inscripcion`, { numero_comprobante, fecha_inicio, fecha_fin });
  return response.data;
};

export const getBoletaInscripcionQR = async (id: number): Promise<any> => {
  const response = await api.get(`/boletas-inscripcion/${id}/qr`);
  return response.data?.data ?? response.data;
};

export const validarQRAcceso = async (qr_payload: string, tipo: string = 'auto'): Promise<any> => {
  const response = await api.post('/registro-accesos/validar-qr', { qr_payload, tipo });
  return response.data;
};
