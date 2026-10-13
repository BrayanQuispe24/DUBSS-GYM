// src/features/tramites/hooks/useTramites.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFormulariosSolicitud, createFormularioSolicitud, updateEstadoSolicitud,
  getBoletasPago, createBoletaPago,
  getBoletasInscripcion, createBoletaInscripcion, emitirInscripcionDesdePago
} from '../services/tramiteService';
import showToast from '@/utils/toast';

export const useFormulariosSolicitud = () => {
  return useQuery({ queryKey: ['formulario-solicitudes'], queryFn: getFormulariosSolicitud });
};

export const useCreateFormularioSolicitud = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFormularioSolicitud,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formulario-solicitudes'] });
      showToast.success('Formulario de solicitud registrado', 'Trámites');
    },
  });
};

export const useUpdateEstadoSolicitud = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEstadoSolicitud,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['formulario-solicitudes'] });
      queryClient.invalidateQueries({ queryKey: ['boletas-pago'] });
      showToast.success(`Estado de la solicitud actualizado a "${variables.estado.toUpperCase()}"`, 'Trámites');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.errors?.estado?.[0]
        || err.response?.data?.message
        || 'No se pudo cambiar el estado de la solicitud.';
      showToast.warning(msg, 'Restricción de Trámite');
    },
  });
};

export const useBoletasPago = () => {
  return useQuery({ queryKey: ['boletas-pago'], queryFn: getBoletasPago });
};

export const useCreateBoletaPago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBoletaPago,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boletas-pago'] });
      showToast.success('Boleta de pago registrada', 'Pagos');
    },
  });
};

export const useBoletasInscripcion = () => {
  return useQuery({ queryKey: ['boletas-inscripcion'], queryFn: getBoletasInscripcion });
};

export const useCreateBoletaInscripcion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBoletaInscripcion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boletas-inscripcion'] });
      queryClient.invalidateQueries({ queryKey: ['disciplinas'] });
      showToast.success('Boleta de inscripción emitida', 'Inscripciones');
    },
  });
};

export const useEmitirInscripcionDesdePago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: emitirInscripcionDesdePago,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boletas-pago'] });
      queryClient.invalidateQueries({ queryKey: ['boletas-inscripcion'] });
      queryClient.invalidateQueries({ queryKey: ['formulario-solicitudes'] });
      queryClient.invalidateQueries({ queryKey: ['disciplinas'] });
      showToast.success('Pago de Caja Campus validado y Boleta de Inscripción emitida', 'Inscripciones');
    },
  });
};
