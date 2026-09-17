// src/features/deporte/hooks/useDeporte.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDisciplinas,
  createDisciplina,
  updateDisciplina,
  deleteDisciplina,
  getHorarios,
  createHorario,
  assignHorarioToDisciplina,
  removeHorarioFromDisciplina,
} from '../services/deporteService';
import showToast from '@/utils/toast';

export const useDisciplinas = () => {
  return useQuery({
    queryKey: ['disciplinas'],
    queryFn: getDisciplinas,
  });
};

export const useHorarios = () => {
  return useQuery({
    queryKey: ['horarios'],
    queryFn: getHorarios,
  });
};

export const useCreateDisciplina = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDisciplina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplinas'] });
      showToast.success('Disciplina deportiva creada exitosamente.', 'Deportes');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al crear disciplina.', 'Error');
    },
  });
};

export const useUpdateDisciplina = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateDisciplina(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplinas'] });
      showToast.success('Disciplina actualizada exitosamente.', 'Deportes');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al actualizar disciplina.', 'Error');
    },
  });
};

export const useDeleteDisciplina = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDisciplina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplinas'] });
      showToast.success('Disciplina eliminada exitosamente.', 'Deportes');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al eliminar disciplina.', 'Error');
    },
  });
};

export const useCreateHorario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHorario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horarios'] });
      showToast.success('Nueva franja horaria registrada.', 'Horarios');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al crear horario.', 'Error');
    },
  });
};

export const useAssignHorario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignHorarioToDisciplina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplinas'] });
      showToast.success('Horario asignado a la disciplina.', 'Horarios');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al asignar horario.', 'Error');
    },
  });
};

export const useRemoveHorarioDisciplina = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeHorarioFromDisciplina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplinas'] });
      showToast.info('Horario desvinculado de la disciplina.', 'Horarios');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al desvincular horario.', 'Error');
    },
  });
};
