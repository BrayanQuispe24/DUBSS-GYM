// src/features/nutricion/hooks/useNutricion.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPlanesAlimentacion, createPlanAlimentacion, deletePlanAlimentacion } from '../services/nutricionService';
import showToast from '@/utils/toast';

export const usePlanesAlimentacion = () => {
  return useQuery({
    queryKey: ['plan-alimentacion'],
    queryFn: getPlanesAlimentacion,
  });
};

export const useCreatePlanAlimentacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlanAlimentacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan-alimentacion'] });
      showToast.success('Plan de alimentación guardado', 'Nutrición');
    },
  });
};

export const useDeletePlanAlimentacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlanAlimentacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan-alimentacion'] });
      showToast.success('Plan de alimentación eliminado', 'Nutrición');
    },
  });
};
