// src/features/dashboard/hooks/useBiDashboard.ts
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getBiAforoTiempoReal,
  getBiDistribucion,
  getBiMovimientos,
  getBiResumen,
  getBiSeries,
} from '../services/biDashboardService';
import type { BiGlobalFilters, BiMovimientosQueryParams } from '../types/bi.types';

export const useBiResumen = (filters: BiGlobalFilters, enabled = true) => {
  return useQuery({
    queryKey: ['bi', 'resumen', filters],
    queryFn: () => getBiResumen(filters),
    enabled,
    placeholderData: keepPreviousData,
  });
};

export const useBiSeries = (filters: BiGlobalFilters, enabled = true) => {
  return useQuery({
    queryKey: ['bi', 'series', filters],
    queryFn: () => getBiSeries(filters),
    enabled,
    placeholderData: keepPreviousData,
  });
};

export const useBiDistribucion = (filters: BiGlobalFilters, enabled = true) => {
  return useQuery({
    queryKey: ['bi', 'distribucion', filters],
    queryFn: () => getBiDistribucion(filters),
    enabled,
    placeholderData: keepPreviousData,
  });
};

export const useBiAforoTiempoReal = (idDisciplina: number | null, enabled = true) => {
  return useQuery({
    queryKey: ['bi', 'aforo-tiempo-real', idDisciplina],
    queryFn: () => getBiAforoTiempoReal(idDisciplina),
    enabled,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
};

export const useBiMovimientos = (params: BiMovimientosQueryParams, enabled = true) => {
  return useQuery({
    queryKey: ['bi', 'movimientos', params],
    queryFn: () => getBiMovimientos(params),
    enabled,
    placeholderData: keepPreviousData,
  });
};
