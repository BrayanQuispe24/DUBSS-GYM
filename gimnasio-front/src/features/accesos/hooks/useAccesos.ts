// src/features/accesos/hooks/useAccesos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRegistrosAcceso, createRegistroAcceso } from '../services/accesoService';
import showToast from '@/utils/toast';

export const useRegistrosAcceso = () => {
  return useQuery({
    queryKey: ['registro-accesos'],
    queryFn: getRegistrosAcceso,
    refetchInterval: 10000, // Actualización automática en vivo cada 10s
  });
};

export const useCreateRegistroAcceso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRegistroAcceso,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['registro-accesos'] });
      showToast.success(`Marcación de ${data.tipo.toUpperCase()} registrada exitosamente`, 'Garita de Acceso');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al registrar marcación', 'Garita de Acceso');
    },
  });
};
