// src/features/landing/types/landing.types.ts
export interface PublicDisciplinaHorario {
  id: number;
  id_disciplina: number;
  id_horario: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  cupo_maximo: number;
  cupos_ocupados: number;
  cupos_disponibles: number;
}

export interface PublicDisciplina {
  id: number;
  nombre: string;
  cantidad_cupos: number;
  total_cupos_ocupados: number;
  total_cupos_disponibles: number;
  horarios: PublicDisciplinaHorario[];
}

export interface PublicTarifa {
  id: number;
  nombre: string;
  precio: number;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
}

export interface PublicPlan {
  id: number;
  nombre: string;
  descripcion?: string | null;
  duracion_dias: number;
  tarifa: PublicTarifa;
}

export interface PublicEstadisticas {
  estudiantes_activos: number;
  docentes_admin_activos: number;
  instructores_activos: number;
  total_disciplinas_activas: number;
  aforo_actual: number;
  cupo_maximo_total: number;
}

export interface PublicLandingData {
  disciplinas: PublicDisciplina[];
  planes: PublicPlan[];
  estadisticas: PublicEstadisticas;
}
