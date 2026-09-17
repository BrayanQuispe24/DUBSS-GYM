// src/features/deporte/services/deporteService.ts
import api from '@/services/api';

export interface Disciplina {
  id: number;
  nombre: string;
  cantidad_cupos?: number;
  descripcion?: string;
  estado: string;
  horarios?: Horario[];
}

export interface Horario {
  id: number;
  dia_semana?: string;
  hora_inicio: string;
  hora_fin: string;
}

export interface DisciplinaHorarioItem {
  id: number;
  id_disciplina: number;
  id_horario: number;
  cupo_maximo?: number;
  estado?: boolean;
  horario?: Horario;
}

export interface Disciplina {
  id: number;
  nombre: string;
  cantidad_cupos?: number;
  descripcion?: string;
  estado: string;
  disciplina_horarios?: DisciplinaHorarioItem[];
  disciplinaHorarios?: DisciplinaHorarioItem[];
  horarios?: Horario[];
}

export interface CreateDisciplinaData {
  nombre: string;
  cantidad_cupos?: number;
  descripcion?: string;
  estado?: string;
}

export interface CreateHorarioData {
  dia_semana?: string;
  hora_inicio: string;
  hora_fin: string;
}

export interface AssignHorarioData {
  id_disciplina: number;
  id_horario: number;
  cupo_maximo?: number;
  estado?: boolean;
}

export const getDisciplinas = async (): Promise<Disciplina[]> => {
  const response = await api.get('/disciplinas');
  return response.data.data;
};

export const createDisciplina = async (data: CreateDisciplinaData): Promise<Disciplina> => {
  const response = await api.post('/disciplinas', data);
  return response.data.data;
};

export const updateDisciplina = async (id: number, data: Partial<CreateDisciplinaData>): Promise<Disciplina> => {
  const response = await api.put(`/disciplinas/${id}`, data);
  return response.data.data;
};

export const deleteDisciplina = async (id: number): Promise<void> => {
  await api.delete(`/disciplinas/${id}`);
};

export const getHorarios = async (): Promise<Horario[]> => {
  const response = await api.get('/horarios');
  return response.data.data;
};

export const createHorario = async (data: CreateHorarioData): Promise<Horario> => {
  const response = await api.post('/horarios', data);
  return response.data.data;
};

export const assignHorarioToDisciplina = async (data: AssignHorarioData): Promise<void> => {
  await api.post('/disciplina-horario', data);
};

export const removeHorarioFromDisciplina = async (id: number): Promise<void> => {
  await api.delete(`/disciplina-horario/${id}`);
};
