// src/features/historial/hooks/useHistorial.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getHistoriales,
  createHistorial,
  updateHistorial,
  deleteHistorial,
  createDetalleHistorial,
  createAntecedente,
  type CreateHistorialData,
  type CreateDetalleData,
} from '../services/historialService';
import showToast from '@/utils/toast';

export const useHistoriales = () => {
  return useQuery({
    queryKey: ['historiales'],
    queryFn: getHistoriales,
  });
};

export const useCreateHistorial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHistorial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historiales'] });
      showToast.success('Historial médico/deportivo registrado exitosamente.', 'Historial');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al registrar historial.', 'Error');
    },
  });
};

export const useUpdateHistorial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateHistorialData> }) =>
      updateHistorial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historiales'] });
      showToast.success('Historial actualizado exitosamente.', 'Historial');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al actualizar historial.', 'Error');
    },
  });
};

export const useDeleteHistorial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHistorial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historiales'] });
      showToast.success('Historial eliminado exitosamente.', 'Historial');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al eliminar historial.', 'Error');
    },
  });
};

export const useCreateDetalleHistorial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDetalleHistorial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historiales'] });
      showToast.success('Medición antropométrica agregada al historial.', 'Antropometría');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al agregar medición.', 'Error');
    },
  });
};

export const useCreateAntecedente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAntecedente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historiales'] });
      showToast.success('Antecedente médico registrado exitosamente.', 'Antecedentes');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al registrar antecedente.', 'Error');
    },
  });
};
