// src/features/dashboard/types/bi.types.ts

export type BiGranularidad = 'day' | 'month';
export type BiTipoDetalle = 'todos' | 'ingresos' | 'inscripciones' | 'solicitudes';
export type BiSortDir = 'asc' | 'desc';

export interface BiGlobalFilters {
  desde: string;
  hasta: string;
  id_disciplina: number | null;
  metodo_pago: string;
  estado_solicitud: '' | 'aprobado' | 'pendiente' | 'rechazado';
  granularidad: BiGranularidad;
}

export interface BiCatalogoDisciplina {
  id: number;
  nombre: string;
  cantidad_cupos: number;
}

export interface BiResumenResponse {
  ingresos: {
    total: number;
    periodo_anterior: number;
    variacion_pct: number | null;
    cantidad_pagos: number;
    ticket_promedio: number;
  };
  inscripciones: {
    total: number;
    activas: number;
  };
  aforo_tiempo_real: {
    total_actual: number;
    cupo_maximo_total: number;
    ocupacion_pct: number;
    actualizado_en: string;
  };
  solicitudes: {
    total: number;
    aprobadas: number;
    pendientes: number;
    rechazadas: number;
    tasa_aprobacion_pct: number;
  };
  filtros_aplicados: {
    desde: string;
    hasta: string;
    prev_desde: string;
    prev_hasta: string;
    id_disciplina: number | null;
    metodo_pago: string | null;
    estado_solicitud: string | null;
    granularidad: BiGranularidad;
  };
  catalogos: {
    disciplinas: BiCatalogoDisciplina[];
    metodos_pago: string[];
  };
}

export interface BiIngresoEvolucionItem {
  periodo: string;
  label: string;
  ingresos: number;
  cantidad_pagos: number;
}

export interface BiBoletasDisciplinaItem {
  id_disciplina: number | null;
  disciplina: string;
  cantidad_boletas: number;
  monto_total: number;
}

export interface BiAforoDisciplinaItem {
  id_disciplina: number | null;
  disciplina: string;
  aforo_actual: number;
  cupo_maximo: number;
  ocupacion_pct: number;
}

export interface BiSeriesResponse {
  ingresos_evolucion: BiIngresoEvolucionItem[];
  boletas_por_disciplina: BiBoletasDisciplinaItem[];
  aforo_por_disciplina: BiAforoDisciplinaItem[];
}

export interface BiAforoTiempoRealResponse {
  total_actual: number;
  cupo_maximo_total: number;
  ocupacion_pct: number;
  por_disciplina: BiAforoDisciplinaItem[];
  actualizado_en: string;
}

export interface BiIngresosDisciplinaDonutItem {
  id_disciplina: number | null;
  disciplina: string;
  monto: number;
  cantidad_pagos: number;
  porcentaje: number;
}

export interface BiSolicitudesEstadoItem {
  estado: 'aprobado' | 'pendiente' | 'rechazado';
  label: string;
  cantidad: number;
  porcentaje: number;
}

export interface BiSolicitudPendienteReciente {
  id: number;
  numero_formulario: string;
  estado: string;
  fecha_registro: string;
  disciplina: string;
  usuario_nombre: string;
  usuario_codigo: string | null;
}

export interface BiDistribucionResponse {
  ingresos_por_disciplina: BiIngresosDisciplinaDonutItem[];
  solicitudes_por_estado: BiSolicitudesEstadoItem[];
  solicitudes_pendientes_recientes: BiSolicitudPendienteReciente[];
}

export interface BiMovimientoRow {
  id: string;
  registro_id: number;
  tipo_registro: 'ingreso' | 'inscripcion' | 'solicitud';
  fecha: string;
  referencia: string;
  usuario: string;
  disciplina: string;
  metodo_pago: string;
  estado: string;
  monto: number;
}

export interface BiMovimientosQueryParams extends BiGlobalFilters {
  tipo_detalle: BiTipoDetalle;
  search: string;
  sort_by: string;
  sort_dir: BiSortDir;
  page: number;
  per_page: number;
}

export interface BiMovimientosResponse {
  data: BiMovimientoRow[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface BiExportPayload {
  generado_en: string;
  generado_por: string;
  resumen: BiResumenResponse;
  series: BiSeriesResponse;
  distribucion: BiDistribucionResponse;
  movimientos: BiMovimientoRow[];
}

