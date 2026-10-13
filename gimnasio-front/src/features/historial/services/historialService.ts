// src/features/historial/services/historialService.ts
import api from '@/services/api';

export interface Historial {
  id: number;
  id_usuario: number;
  fecha_apertura?: string;
  observaciones_generales?: string;
  observaciones?: string;
  grupo_sanguineo?: string;
  sexo?: string;
  fecha_nacimiento?: string;
  domicilio?: string;
  facultad_carrera?: string;
  celular_emergencia?: string;
  estado?: string;
  created_at?: string;
  updated_at?: string;
  usuario?: {
    id: number;
    name?: string;
    nombre?: string;
    apellido?: string;
    codigo?: string;
    ci?: string;
    celular?: string;
    email: string;
    registro_universitario?: string;
  };
  detalles?: DetalleHistorial[];
  antecedentes?: Antecedente[] | string;
  antecedentes_medicos?: Antecedente[];
}

export interface DetalleHistorial {
  id: number;
  id_historial: number;
  fecha_registro?: string;
  fecha?: string;
  peso?: number;
  altura?: number;
  talla?: number;
  imc?: number;
  porcentaje_grasa?: number;
  masa_muscular?: number;
  presion?: string;
  observaciones?: string;
  created_at?: string;
}

export interface Antecedente {
  id?: number;
  id_historial: number;
  observaciones?: string;
  tiene_enfermedades_cardiovasculares?: boolean;
  detalle_enfermedades_cardiovasculares?: string;
  se_realizo_intervencion_cardiovascular?: boolean;
  detalle_intervencion_cardiovascular?: string;
  tiene_hipertension_arterial?: boolean;
  detalle_hipertension_arterial?: string;
  tiene_enfermedades_pulmonares?: boolean;
  detalle_enfermedades_pulmonares?: string;
  tiene_diabetes?: boolean;
  detalle_diabetes?: string;
  tiene_enfermedades_osteoarticulares?: boolean;
  detalle_enfermedades_osteoarticulares?: string;
  tiene_enfermedades_neurologicas?: boolean;
  detalle_enfermedades_neurologicas?: string;
  tiene_convulsiones?: boolean;
  detalle_convulsiones?: string;
  tiene_intervencion_quirurgica?: boolean;
  detalle_intervencion_quirurgica?: string;
  sufrio_fracturas_oseas?: boolean;
  detalle_fracturas_oseas?: string;
  sufrio_algun_sintoma_durante_deporte?: boolean;
  detalle_sintomas_durante_deporte?: string;
  tiene_lesiones?: boolean;
  detalle_lesiones?: string;
  tiene_alergias?: boolean;
  detalle_alergias?: string;
  created_at?: string;
}

export interface CreateHistorialData {
  id_usuario: number;
  facultad_carrera?: string;
  observaciones?: string;
  antecedentes?: string;
  estado?: string;
}

export interface CreateDetalleData {
  id_historial: number;
  fecha_registro?: string;
  fecha?: string;
  peso?: number;
  altura?: number;
  imc?: number;
  porcentaje_grasa?: number;
  masa_muscular?: number;
  presion?: string;
  observaciones?: string;
}

export const getHistoriales = async (): Promise<Historial[]> => {
  const response = await api.get('/historiales');
  return response.data.data;
};

export const createHistorial = async (data: CreateHistorialData): Promise<Historial> => {
  const response = await api.post('/historiales', data);
  return response.data.data;
};

export const updateHistorial = async (id: number, data: Partial<CreateHistorialData>): Promise<Historial> => {
  const response = await api.put('/historiales', { id, ...data });
  return response.data.data;
};

export const deleteHistorial = async (id: number): Promise<void> => {
  await api.delete(`/historiales/${id}`);
};

export const createDetalleHistorial = async (data: CreateDetalleData): Promise<DetalleHistorial> => {
  const response = await api.post('/detalle-historial', data);
  return response.data.data;
};

export const createAntecedente = async (data: Antecedente): Promise<Antecedente> => {
  const response = await api.post('/antecedentes', data);
  return response.data.data;
};
