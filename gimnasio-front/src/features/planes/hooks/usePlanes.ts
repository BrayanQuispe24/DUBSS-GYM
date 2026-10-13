// src/features/planes/hooks/usePlanes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPlanes, createPlan, updatePlan, deletePlan,
  getTarifas, createTarifa, updateTarifa, deleteTarifa
} from '../services/planService';
import showToast from '@/utils/toast';

export const usePlanes = () => {
  return useQuery({
    queryKey: ['planes'],
    queryFn: getPlanes,
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planes'] });
      showToast.success('Plan creado exitosamente', 'Planes');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al crear plan', 'Planes');
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planes'] });
      showToast.success('Plan actualizado exitosamente', 'Planes');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al actualizar plan', 'Planes');
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planes'] });
      showToast.success('Plan eliminado exitosamente', 'Planes');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al eliminar plan', 'Planes');
    },
  });
};

export const useTarifas = () => {
  return useQuery({
    queryKey: ['tarifas'],
    queryFn: getTarifas,
  });
};

export const useCreateTarifa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTarifa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarifas'] });
      queryClient.invalidateQueries({ queryKey: ['planes'] });
      showToast.success('Tarifa creada exitosamente', 'Tarifas');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al crear tarifa', 'Tarifas');
    },
  });
};

export const useDeleteTarifa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTarifa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarifas'] });
      queryClient.invalidateQueries({ queryKey: ['planes'] });
      showToast.success('Tarifa eliminada exitosamente', 'Tarifas');
    },
  });
};
