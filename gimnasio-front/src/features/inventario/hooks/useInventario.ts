// src/features/inventario/hooks/useInventario.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAmbientes,
  createAmbiente,
  updateAmbiente,
  deleteAmbiente,
  getEquipos,
  getMarcas,
  createMarca,
  updateMarca,
  deleteMarca,
  getTipoEquipos,
  createTipoEquipo,
  updateTipoEquipo,
  deleteTipoEquipo,
  createEquipo,
  updateEquipo,
  deleteEquipo,
  getMovimientosInventario,
  createMovimientoInventario,
  getMantenimientos,
  createMantenimiento,
  updateMantenimiento,
  getTiposMovimiento,
  createTipoMovimiento,
  updateTipoMovimiento,
  deleteTipoMovimiento,
} from '../services/inventarioService';
import showToast from '@/utils/toast';

export const useAmbientes = () => {
  return useQuery({
    queryKey: ['ambientes'],
    queryFn: getAmbientes,
  });
};

export const useMarcas = () => {
  return useQuery({
    queryKey: ['marcas'],
    queryFn: getMarcas,
  });
};

export const useCreateMarca = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMarca,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
      showToast.success('Marca registrada exitosamente.', 'Marcas');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al registrar marca.', 'Error');
    },
  });
};

export const useUpdateMarca = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateMarca(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
      showToast.success('Marca actualizada exitosamente.', 'Marcas');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al actualizar marca.', 'Error');
    },
  });
};

export const useDeleteMarca = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMarca,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
      showToast.success('Marca eliminada del sistema.', 'Marcas');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al eliminar marca.', 'Error');
    },
  });
};

export const useTipoEquipos = () => {
  return useQuery({
    queryKey: ['tipoEquipos'],
    queryFn: getTipoEquipos,
  });
};

export const useCreateTipoEquipo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTipoEquipo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipoEquipos'] });
      showToast.success('Tipo de equipo registrado exitosamente.', 'Categorías');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al registrar tipo de equipo.', 'Error');
    },
  });
};

export const useUpdateTipoEquipo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateTipoEquipo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipoEquipos'] });
      showToast.success('Tipo de equipo actualizado exitosamente.', 'Categorías');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al actualizar tipo de equipo.', 'Error');
    },
  });
};

export const useDeleteTipoEquipo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTipoEquipo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipoEquipos'] });
      showToast.success('Tipo de equipo eliminado del sistema.', 'Categorías');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al eliminar tipo de equipo.', 'Error');
    },
  });
};

export const useCreateAmbiente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAmbiente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambientes'] });
      showToast.success('Ambiente registrado exitosamente.', 'Ambientes & Espacios');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al registrar el ambiente.', 'Error');
    },
  });
};

export const useUpdateAmbiente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateAmbiente(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambientes'] });
      showToast.success('Ambiente actualizado exitosamente.', 'Ambientes & Espacios');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al actualizar el ambiente.', 'Error');
    },
  });
};

export const useDeleteAmbiente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAmbiente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambientes'] });
      showToast.success('Ambiente eliminado exitosamente.', 'Ambientes & Espacios');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al eliminar el ambiente.', 'Error');
    },
  });
};

export const useEquipos = () => {
  return useQuery({
    queryKey: ['equipos'],
    queryFn: getEquipos,
  });
};

export const useCreateEquipo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEquipo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos'] });
      showToast.success('Equipo registrado en el inventario.', 'Inventario');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al crear equipo.', 'Error');
    },
  });
};

export const useUpdateEquipo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateEquipo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos'] });
      showToast.success('Equipo actualizado exitosamente.', 'Inventario');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al actualizar equipo.', 'Error');
    },
  });
};

export const useDeleteEquipo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEquipo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos'] });
      showToast.success('Equipo eliminado del sistema.', 'Inventario');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al eliminar equipo.', 'Error');
    },
  });
};

export const useMovimientosInventario = () => {
  return useQuery({
    queryKey: ['movimientosInventario'],
    queryFn: getMovimientosInventario,
  });
};

export const useCreateMovimiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMovimientoInventario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimientosInventario'] });
      queryClient.invalidateQueries({ queryKey: ['equipos'] });
      showToast.success('Movimiento de stock registrado y actualizado en el inventario.', 'Stock');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al registrar movimiento.', 'Error');
    },
  });
};

export const useMantenimientos = () => {
  return useQuery({
    queryKey: ['mantenimientos'],
    queryFn: getMantenimientos,
  });
};

export const useCreateMantenimiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMantenimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mantenimientos'] });
      showToast.success('Mantenimiento técnico registrado.', 'Mantenimientos');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al registrar mantenimiento.', 'Error');
    },
  });
};

export const useUpdateMantenimiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateMantenimiento(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mantenimientos'] });
      showToast.success('Estado de orden de mantenimiento actualizado.', 'Mantenimientos');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al actualizar mantenimiento.', 'Error');
    },
  });
};

export const useTiposMovimiento = () => {
  return useQuery({
    queryKey: ['tiposMovimiento'],
    queryFn: getTiposMovimiento,
  });
};

export const useCreateTipoMovimiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTipoMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiposMovimiento'] });
      showToast.success('Tipo de movimiento registrado.', 'Stock');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al crear tipo de movimiento.', 'Error');
    },
  });
};

export const useUpdateTipoMovimiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateTipoMovimiento(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiposMovimiento'] });
      showToast.success('Tipo de movimiento actualizado.', 'Stock');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al actualizar tipo de movimiento.', 'Error');
    },
  });
};

export const useDeleteTipoMovimiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTipoMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiposMovimiento'] });
      showToast.success('Tipo de movimiento eliminado.', 'Stock');
    },
    onError: (err: any) => {
      showToast.error(err.response?.data?.message || 'Error al eliminar tipo de movimiento.', 'Error');
    },
  });
};
