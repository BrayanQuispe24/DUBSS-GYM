// src/features/dashboard/services/biDashboardService.ts
import api from '@/services/api';
import type {
  BiAforoTiempoRealResponse,
  BiDistribucionResponse,
  BiExportPayload,
  BiGlobalFilters,
  BiMovimientosQueryParams,
  BiMovimientosResponse,
  BiResumenResponse,
  BiSeriesResponse,
} from '../types/bi.types';

const buildFilterParams = (filters: BiGlobalFilters) => {
  const params: Record<string, string | number> = {
    desde: filters.desde,
    hasta: filters.hasta,
    granularidad: filters.granularidad,
  };

  if (filters.id_disciplina !== null) {
    params.id_disciplina = filters.id_disciplina;
  }
  if (filters.metodo_pago.trim() !== '') {
    params.metodo_pago = filters.metodo_pago.trim();
  }
  if (filters.estado_solicitud !== '') {
    params.estado_solicitud = filters.estado_solicitud;
  }

  return params;
};

export const getBiResumen = async (filters: BiGlobalFilters): Promise<BiResumenResponse> => {
  const response = await api.get<{ data: BiResumenResponse }>('/bi/resumen', {
    params: buildFilterParams(filters),
  });
  return response.data.data;
};

export const getBiSeries = async (filters: BiGlobalFilters): Promise<BiSeriesResponse> => {
  const response = await api.get<{ data: BiSeriesResponse }>('/bi/series', {
    params: buildFilterParams(filters),
  });
  return response.data.data;
};

export const getBiDistribucion = async (filters: BiGlobalFilters): Promise<BiDistribucionResponse> => {
  const response = await api.get<{ data: BiDistribucionResponse }>('/bi/distribucion', {
    params: buildFilterParams(filters),
  });
  return response.data.data;
};

export const getBiAforoTiempoReal = async (idDisciplina: number | null): Promise<BiAforoTiempoRealResponse> => {
  const params: Record<string, number> = {};
  if (idDisciplina !== null) {
    params.id_disciplina = idDisciplina;
  }
  const response = await api.get<{ data: BiAforoTiempoRealResponse }>('/bi/aforo-tiempo-real', { params });
  return response.data.data;
};

export const getBiMovimientos = async (query: BiMovimientosQueryParams): Promise<BiMovimientosResponse> => {
  const params: Record<string, string | number> = {
    ...buildFilterParams(query),
    tipo_detalle: query.tipo_detalle,
    sort_by: query.sort_by,
    sort_dir: query.sort_dir,
    page: query.page,
    per_page: query.per_page,
  };

  if (query.search.trim() !== '') {
    params.search = query.search.trim();
  }

  const response = await api.get<BiMovimientosResponse>('/bi/movimientos', { params });
  return response.data;
};

export const getBiExportDatos = async (
  filters: BiGlobalFilters,
  tipoDetalle: BiMovimientosQueryParams['tipo_detalle'] = 'todos',
  search = ''
): Promise<BiExportPayload> => {
  const params: Record<string, string | number> = {
    ...buildFilterParams(filters),
    tipo_detalle: tipoDetalle,
  };
  if (search.trim() !== '') {
    params.search = search.trim();
  }

  const response = await api.get<{ data: BiExportPayload }>('/bi/exportar-datos', { params });
  return response.data.data;
};
