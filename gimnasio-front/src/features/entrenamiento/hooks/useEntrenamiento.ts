// src/features/entrenamiento/hooks/useEntrenamiento.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTiposEjercicio, createTipoEjercicio,
  getGruposMusculares, createGrupoMuscular,
  getEjercicios, getEjercicioById, createEjercicio, updateEjercicio, deleteEjercicio, asignarGrupoMuscular,
  getImagenesEjercicio, uploadImagenEjercicio, deleteImagenEjercicio,
  getRutinas, createRutina, updateRutina, deleteRutina,
  getPlanesEntrenamiento, getPlanEntrenamientoById, createPlanEntrenamiento, updatePlanEntrenamiento, deletePlanEntrenamiento
} from '../services/entrenamientoService';
import type { Ejercicio, EjerciciosParams } from '../services/entrenamientoService';
import showToast from '@/utils/toast';

export const useTiposEjercicio = () => {
  return useQuery({ queryKey: ['tipos-ejercicio'], queryFn: getTiposEjercicio });
};

export const useCreateTipoEjercicio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTipoEjercicio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-ejercicio'] });
      showToast.success('Tipo de ejercicio registrado', 'Entrenamiento');
    },
  });
};

export const useGruposMusculares = () => {
  return useQuery({ queryKey: ['grupos-musculares'], queryFn: getGruposMusculares });
};

export const useCreateGrupoMuscular = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGrupoMuscular,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos-musculares'] });
      showToast.success('Grupo muscular registrado', 'Entrenamiento');
    },
  });
};

export const useEjercicios = (params?: EjerciciosParams) => {
  return useQuery({
    queryKey: ['ejercicios', params],
    queryFn: () => getEjercicios(params),
  });
};

export const useEjercicioById = (id?: number) => {
  return useQuery({
    queryKey: ['ejercicio', id],
    queryFn: () => (id ? getEjercicioById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
};

export const useCreateEjercicio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEjercicio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ejercicios'] });
      showToast.success('Ejercicio registrado exitosamente', 'Ejercicios');
    },
  });
};

export const useUpdateEjercicio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Ejercicio> & { grupos_musculares?: number[] } }) =>
      updateEjercicio(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ejercicios'] });
      queryClient.invalidateQueries({ queryKey: ['ejercicio', variables.id] });
      showToast.success('Ejercicio actualizado exitosamente', 'Ejercicios');
    },
  });
};

export const useDeleteEjercicio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEjercicio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ejercicios'] });
      showToast.success('Ejercicio eliminado', 'Ejercicios');
    },
  });
};

export const useAsignarGrupoMuscular = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ idEjercicio, idGrupoMuscular }: { idEjercicio: number; idGrupoMuscular: number }) =>
      asignarGrupoMuscular(idEjercicio, idGrupoMuscular),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ejercicios'] });
      showToast.success('Grupo muscular asignado', 'Ejercicios');
    },
  });
};

export const useEjercicioImagenes = (idEjercicio?: number) => {
  return useQuery({
    queryKey: ['ejercicio-imagenes', idEjercicio],
    queryFn: () => (idEjercicio ? getImagenesEjercicio(idEjercicio) : Promise.resolve([])),
    enabled: !!idEjercicio,
  });
};

export const useUploadEjercicioImagen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ idEjercicio, file, titulo, descripcion }: { idEjercicio: number; file: File; titulo: string; descripcion?: string }) =>
      uploadImagenEjercicio(idEjercicio, file, titulo, descripcion),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ejercicio-imagenes', variables.idEjercicio] });
      queryClient.invalidateQueries({ queryKey: ['ejercicios'] });
      showToast.success('Imagen guardada localmente', 'Galería');
    },
  });
};

export const useDeleteEjercicioImagen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ idImagen, idEjercicio }: { idImagen: number; idEjercicio: number }) =>
      deleteImagenEjercicio(idImagen),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ejercicio-imagenes', variables.idEjercicio] });
      queryClient.invalidateQueries({ queryKey: ['ejercicios'] });
      showToast.success('Imagen eliminada de la galería', 'Galería');
    },
  });
};

export const useRutinas = () => {
  return useQuery({ queryKey: ['rutinas'], queryFn: getRutinas });
};

export const useCreateRutina = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRutina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rutinas'] });
      showToast.success('Rutina deportiva creada exitosamente', 'Rutinas');
    },
  });
};

export const useUpdateRutina = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateRutina(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rutinas'] });
      showToast.success('Rutina deportiva actualizada exitosamente', 'Rutinas');
    },
  });
};

export const useDeleteRutina = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRutina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rutinas'] });
      showToast.success('Rutina eliminada', 'Rutinas');
    },
  });
};

export const usePlanesEntrenamiento = () => {
  return useQuery({ queryKey: ['planes-entrenamiento'], queryFn: getPlanesEntrenamiento });
};

export const usePlanEntrenamiento = (id?: number) => {
  return useQuery({
    queryKey: ['plan-entrenamiento', id],
    queryFn: () => getPlanEntrenamientoById(id!),
    enabled: Boolean(id),
  });
};

export const useCreatePlanEntrenamiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlanEntrenamiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planes-entrenamiento'] });
      showToast.success('Plan de entrenamiento asignado exitosamente', 'Entrenamiento');
    },
  });
};

export const useUpdatePlanEntrenamiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updatePlanEntrenamiento(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planes-entrenamiento'] });
      showToast.success('Plan de entrenamiento actualizado exitosamente', 'Entrenamiento');
    },
  });
};

export const useDeletePlanEntrenamiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlanEntrenamiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planes-entrenamiento'] });
      showToast.success('Plan de entrenamiento eliminado', 'Entrenamiento');
    },
  });
};

// --- HOOKS IA: ANÁLISIS CORPORAL & RECOMENDACIÓN DE RUTINAS ---
import {
  analizarFotografiasCorporales,
  getHistorialAnalisisCorporales,
  getPerfilEntrenamiento,
  savePerfilEntrenamiento,
  generarRutinaIA,
} from '../services/entrenamientoService';

export const useHistorialAnalisisCorporales = () => {
  return useQuery({
    queryKey: ['analisis-corporales'],
    queryFn: getHistorialAnalisisCorporales,
  });
};

export const useAnalizarFotografias = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: analizarFotografiasCorporales,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analisis-corporales'] });
      queryClient.invalidateQueries({ queryKey: ['perfil-entrenamiento'] });
      showToast.success('Análisis de imágenes con MediaPipe completado', 'IA Postural');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al procesar las fotografías', 'IA Postural');
    },
  });
};

export const usePerfilEntrenamiento = () => {
  return useQuery({
    queryKey: ['perfil-entrenamiento'],
    queryFn: getPerfilEntrenamiento,
  });
};

export const useSavePerfilEntrenamiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: savePerfilEntrenamiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfil-entrenamiento'] });
      showToast.success('Perfil de entrenamiento actualizado', 'Perfil IA');
    },
  });
};

export const useGenerarRutinaIA = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generarRutinaIA,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planes-entrenamiento'] });
      queryClient.invalidateQueries({ queryKey: ['rutinas'] });
      showToast.success('¡Rutina recomendada generada exitosamente por el Sistema Experto!', 'IA Gym');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'No se pudo generar la rutina personalizada', 'Error IA');
    },
  });
};
