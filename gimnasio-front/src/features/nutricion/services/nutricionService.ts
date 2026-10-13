// src/features/nutricion/services/nutricionService.ts
import api from '@/services/api';

export interface DetallePlanAlimentacion {
  id?: number;
  dia_semana?: string;
  tipo_comida?: string;
  descripcion: string;
  calorias?: number;
  proteinas?: number;
  carbohidratos?: number;
  grasas?: number;
  observacion?: string;
}

export interface PlanAlimentacion {
  id: number;
  nombre: string;
  objetivo?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  observacion?: string;
  estado: boolean;
  id_usuario: number;
  usuario?: { id: number; nombre: string; apellido: string };
  detalles?: DetallePlanAlimentacion[];
  created_at?: string;
}

export const getPlanesAlimentacion = async (): Promise<PlanAlimentacion[]> => {
  const response = await api.get('/plan-alimentacion');
  return response.data.data;
};

export const createPlanAlimentacion = async (data: any): Promise<PlanAlimentacion> => {
  const response = await api.post('/plan-alimentacion', data);
  return response.data.data;
};

export const deletePlanAlimentacion = async (id: number): Promise<void> => {
  await api.delete(`/plan-alimentacion/${id}`);
};
