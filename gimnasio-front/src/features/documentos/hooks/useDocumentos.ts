// src/features/documentos/hooks/useDocumentos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDocumentos,
  getTipoDocumentos,
  uploadDocumento,
  deleteDocumento,
  createTipoDocumento,
} from '../services/documentoService';
import showToast from '@/utils/toast';

export const useDocumentos = () => {
  return useQuery({
    queryKey: ['documentos'],
    queryFn: getDocumentos,
  });
};

export const useTipoDocumentos = () => {
  return useQuery({
    queryKey: ['tipoDocumentos'],
    queryFn: getTipoDocumentos,
  });
};

export const useUploadDocumento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadDocumento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      showToast.success('Documento digital subido exitosamente.', 'Documentos');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al subir el documento digital.', 'Error');
    },
  });
};

export const useDeleteDocumento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocumento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      showToast.success('Documento eliminado exitosamente.', 'Documentos');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al eliminar el documento.', 'Error');
    },
  });
};

export const useCreateTipoDocumento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTipoDocumento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipoDocumentos'] });
      showToast.success('Tipo de documento registrado.', 'Categorías');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al crear tipo de documento.', 'Error');
    },
  });
};
