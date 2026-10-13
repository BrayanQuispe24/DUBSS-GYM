// src/features/accesos/services/accesoService.ts
import api from '@/services/api';

export interface RegistroAcceso {
  id: number;
  fecha_hora: string;
  tipo: 'entrada' | 'salida';
  id_usuario: number;
  id_boleta_inscripcion?: number;
  usuario?: { id: number; nombre: string; apellido: string; ci?: string; codigo?: string };
  boleta_inscripcion?: { id: number; numero_boleta: string; estado: string };
}

export const getRegistrosAcceso = async (): Promise<RegistroAcceso[]> => {
  const response = await api.get('/registro-accesos');
  return response.data.data;
};

export const createRegistroAcceso = async (data: { tipo: 'entrada' | 'salida'; id_usuario: number; id_boleta_inscripcion?: number }): Promise<RegistroAcceso> => {
  const response = await api.post('/registro-accesos', data);
  return response.data.data;
};
