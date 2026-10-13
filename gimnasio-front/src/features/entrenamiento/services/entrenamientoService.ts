// src/features/entrenamiento/services/entrenamientoService.ts
import api from '@/services/api';

export interface TipoEjercicio {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface GrupoMuscular {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface EjercicioImagen {
  id: number;
  id_ejercicio: number;
  path_imagen: string;
  titulo: string;
  descripcion?: string;
  orden?: number;
}

export interface Ejercicio {
  id: number;
  nombre: string;
  descripcion?: string;
  url_imagen?: string;
  url_video?: string;
  id_tipo_ejercicio?: number;
  tipo_ejercicio?: TipoEjercicio;
  ejercicio_grupo_musculares?: { id: number; grupo_muscular: GrupoMuscular }[];
  imagenes?: EjercicioImagen[];
}

export interface RutinaEjercicio {
  id?: number;
  id_ejercicio: number;
  ejercicio?: Ejercicio;
  series?: number;
  repeticiones?: number;
  peso?: number;
  duracion_segundos?: number;
  descanso_segundos?: number;
  orden?: number;
  observacion?: string;
}

export interface Rutina {
  id: number;
  nombre: string;
  descripcion?: string;
  nivel?: string;
  estado: boolean;
  rutina_ejercicios?: RutinaEjercicio[];
}

export interface PlanEntrenamiento {
  id: number;
  nombre: string;
  objetivo?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado: boolean;
  observacion?: string;
  id_usuario: number;
  usuario?: { id: number; nombre: string; apellido: string };
  plan_entrenamiento_rutinas?: { id: number; id_rutina: number; rutina?: Rutina; dia_semana?: string; orden?: number }[];
}

// Servicios TipoEjercicio
export const getTiposEjercicio = async (): Promise<TipoEjercicio[]> => {
  const response = await api.get('/tipo-ejercicios');
  return Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
};

export const createTipoEjercicio = async (data: Omit<TipoEjercicio, 'id'>): Promise<TipoEjercicio> => {
  const response = await api.post('/tipo-ejercicios', data);
  return response.data.data || response.data;
};

// Servicios GrupoMuscular
export const getGruposMusculares = async (): Promise<GrupoMuscular[]> => {
  const response = await api.get('/grupo-musculares');
  return Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
};

export const createGrupoMuscular = async (data: Omit<GrupoMuscular, 'id'>): Promise<GrupoMuscular> => {
  const response = await api.post('/grupo-musculares', data);
  return response.data.data || response.data;
};

export interface EjerciciosParams {
  search?: string;
  id_tipo_ejercicio?: number;
  id_grupo_muscular?: number;
  page?: number;
  per_page?: number;
  all?: boolean;
}

export interface PaginatedEjerciciosResponse {
  data: Ejercicio[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Servicios Ejercicio
export const getEjercicios = async (params?: EjerciciosParams): Promise<PaginatedEjerciciosResponse> => {
  const response = await api.get('/ejercicios', { params });
  const rawData = response.data;

  if (Array.isArray(rawData?.data)) {
    return {
      data: rawData.data,
      meta: rawData.meta,
    };
  }

  if (Array.isArray(rawData)) {
    return { data: rawData };
  }

  return { data: [] };
};

export const getEjercicioById = async (id: number): Promise<Ejercicio> => {
  const response = await api.get(`/ejercicios/${id}`);
  return response.data.data;
};

export const createEjercicio = async (data: Omit<Ejercicio, 'id'>): Promise<Ejercicio> => {
  const response = await api.post('/ejercicios', data);
  return response.data.data;
};

export const updateEjercicio = async (id: number, data: Partial<Ejercicio> & { grupos_musculares?: number[] }): Promise<Ejercicio> => {
  const response = await api.put(`/ejercicios/${id}`, data);
  return response.data.data;
};

export const deleteEjercicio = async (id: number): Promise<void> => {
  await api.delete(`/ejercicios/${id}`);
};

export const asignarGrupoMuscular = async (id_ejercicio: number, id_grupo_muscular: number): Promise<any> => {
  const response = await api.post('/ejercicio-grupo-muscular', { id_ejercicio, id_grupo_muscular });
  return response.data.data;
};

// Servicios Galería de Imágenes de Ejercicio
export const getImagenesEjercicio = async (idEjercicio: number): Promise<EjercicioImagen[]> => {
  const response = await api.get(`/ejercicios/${idEjercicio}/imagenes`);
  return response.data.data;
};

export const uploadImagenEjercicio = async (
  idEjercicio: number,
  file: File,
  titulo: string,
  descripcion?: string
): Promise<EjercicioImagen> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('titulo', titulo);
  if (descripcion) formData.append('descripcion', descripcion);

  const response = await api.post(`/ejercicios/${idEjercicio}/imagenes`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const deleteImagenEjercicio = async (idImagen: number): Promise<void> => {
  await api.delete(`/ejercicio-imagenes/${idImagen}`);
};

// Servicios Rutina
export const getRutinas = async (): Promise<Rutina[]> => {
  const response = await api.get('/rutinas');
  return response.data.data;
};

export const createRutina = async (data: any): Promise<Rutina> => {
  const response = await api.post('/rutinas', data);
  return response.data.data;
};

export const updateRutina = async (id: number, data: any): Promise<Rutina> => {
  const response = await api.put(`/rutinas/${id}`, data);
  return response.data.data;
};

export const deleteRutina = async (id: number): Promise<void> => {
  await api.delete(`/rutinas/${id}`);
};

// Servicios PlanEntrenamiento
export const getPlanesEntrenamiento = async (): Promise<PlanEntrenamiento[]> => {
  const response = await api.get('/plan-entrenamientos');
  return response.data.data;
};

export const getPlanEntrenamientoById = async (id: number): Promise<PlanEntrenamiento> => {
  const response = await api.get(`/plan-entrenamientos/${id}`);
  return response.data.data;
};

export const createPlanEntrenamiento = async (data: any): Promise<PlanEntrenamiento> => {
  const response = await api.post('/plan-entrenamientos', data);
  return response.data.data;
};

export const updatePlanEntrenamiento = async (id: number, data: any): Promise<PlanEntrenamiento> => {
  const response = await api.put(`/plan-entrenamientos/${id}`, data);
  return response.data.data;
};

export const deletePlanEntrenamiento = async (id: number): Promise<void> => {
  await api.delete(`/plan-entrenamientos/${id}`);
};

// --- MÓDULO IA: ANÁLISIS CORPORAL & RECOMENDACIÓN DE RUTINAS ---

export interface MetricasCorporales {
  inclinacion_hombros_grados?: number;
  diferencia_vertical_hombros_px?: number;
  inclinacion_cadera_grados?: number;
  alineacion_sagital_oreja_hombro_cadera?: number;
  simetria_espalda_score?: number;
}

export interface AnalisisCorporal {
  id: number;
  id_usuario: number;
  fecha_analisis: string;
  path_foto_frontal?: string;
  path_foto_perfil?: string;
  path_foto_espalda?: string;
  metricas_calculadas?: MetricasCorporales;
  calidad_analisis: string;
  confianza_promedio?: number;
  observaciones?: string;
}

export interface PerfilEntrenamiento {
  id?: number;
  id_usuario?: number;
  edad?: number;
  objetivo: 'HIPERTROFIA' | 'FUERZA' | 'RESISTENCIA' | 'ACONDICIONAMIENTO';
  nivel_experiencia: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
  dias_disponibles: number;
  duracion_sesion_min: number;
  equipamiento_disponible: string[];
  restricciones_declaradas: string[];
  id_ultimo_analisis?: number;
  ultimo_analisis?: AnalisisCorporal;
}

export interface GenerarRutinaIAResponse {
  message: string;
  data: {
    plan: PlanEntrenamiento;
    rutinas: Rutina[];
    reglas_aplicadas: string[];
    justificacion: string;
    observaciones: string[];
  };
}

export const analizarFotografiasCorporales = async (formData: FormData): Promise<AnalisisCorporal> => {
  const response = await api.post('/analisis-corporales', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const getHistorialAnalisisCorporales = async (): Promise<AnalisisCorporal[]> => {
  const response = await api.get('/analisis-corporales');
  return response.data.data;
};

export const getPerfilEntrenamiento = async (): Promise<PerfilEntrenamiento | null> => {
  const response = await api.get('/perfil-entrenamiento');
  return response.data.data;
};

export const savePerfilEntrenamiento = async (data: Partial<PerfilEntrenamiento>): Promise<PerfilEntrenamiento> => {
  const response = await api.post('/perfil-entrenamiento', data);
  return response.data.data;
};

export const generarRutinaIA = async (): Promise<GenerarRutinaIAResponse['data']> => {
  const response = await api.post('/recomendaciones/rutinas');
  return response.data.data;
};
