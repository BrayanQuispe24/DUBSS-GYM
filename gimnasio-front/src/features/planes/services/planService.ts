// src/features/planes/services/planService.ts
import api from '@/services/api';

export interface Tarifa {
  id: number;
  nombre: string;
  precio: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado: boolean;
  created_at?: string;
}

export interface Plan {
  id: number;
  nombre: string;
  descripcion?: string;
  duracion_dias: number;
  estado: boolean;
  id_tarifa?: number;
  tarifa?: Tarifa;
  created_at?: string;
}

export const getPlanes = async (): Promise<Plan[]> => {
  const response = await api.get('/planes');
  return response.data.data;
};

export const createPlan = async (data: Omit<Plan, 'id'>): Promise<Plan> => {
  const response = await api.post('/planes', data);
  return response.data.data;
};

export const updatePlan = async ({ id, data }: { id: number; data: Partial<Plan> }): Promise<Plan> => {
  const response = await api.put('/planes', { id, ...data });
  return response.data.data;
};

export const deletePlan = async (id: number): Promise<void> => {
  await api.delete(`/planes/${id}`);
};

export const getTarifas = async (): Promise<Tarifa[]> => {
  const response = await api.get('/tarifas');
  return response.data.data;
};

export const createTarifa = async (data: Omit<Tarifa, 'id'>): Promise<Tarifa> => {
  const response = await api.post('/tarifas', data);
  return response.data.data;
};

export const updateTarifa = async ({ id, data }: { id: number; data: Partial<Tarifa> }): Promise<Tarifa> => {
  const response = await api.put('/tarifas', { id, ...data });
  return response.data.data;
};

export const deleteTarifa = async (id: number): Promise<void> => {
  await api.delete(`/tarifas/${id}`);
};
