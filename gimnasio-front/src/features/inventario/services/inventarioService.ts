// src/features/inventario/services/inventarioService.ts
import api from '@/services/api';

export interface Ambiente {
  id: number;
  nombre: string;
  descripcion?: string;
  estado: string;
}

export interface Marca {
  id: number;
  nombre: string;
  estado: string;
}

export interface TipoEquipo {
  id: number;
  nombre: string;
  descripcion?: string;
  estado: string;
}

export interface Equipo {
  id: number;
  codigo: string;
  nombre: string;
  modelo?: string;
  fecha_adquisicion?: string;
  precio_compra?: number;
  estado: string;
  cantidad: number;
  id_ambiente?: number;
  id_marca?: number;
  id_tipo_equipo?: number;
  ambiente?: Ambiente;
  marca?: Marca;
  tipoEquipo?: TipoEquipo;
  mantenimientos?: Mantenimiento[];
}

export interface TipoMovimiento {
  id: number;
  nombre: string;
  descripcion?: string;
  es_salida?: boolean;
}

export interface MovimientoInventario {
  id: number;
  fecha_movimiento?: string;
  fecha_hora?: string;
  cantidad: number;
  motivo?: string;
  id_equipo: number;
  id_tipo_movimiento: number;
  id_usuario?: number;
  equipo?: Equipo;
  tipoMovimiento?: { id: number; nombre: string };
  usuario?: { id: number; name: string };
}

export interface Mantenimiento {
  id: number;
  tipo: string;
  cantidad?: number;
  fecha_inicio: string;
  fecha_fin?: string;
  descripcion?: string;
  costo?: number;
  estado: string | boolean;
  proximo_mantenimiento?: string;
  observacion?: string;
  id_equipo: number;
  equipo?: Equipo;
}

export const getAmbientes = async (): Promise<Ambiente[]> => {
  const response = await api.get('/ambientes');
  return response.data.data;
};

export const createAmbiente = async (data: Partial<Ambiente>): Promise<Ambiente> => {
  const response = await api.post('/ambientes', data);
  return response.data.data;
};

export const updateAmbiente = async (id: number, data: Partial<Ambiente>): Promise<Ambiente> => {
  const response = await api.put(`/ambientes/${id}`, data);
  return response.data.data;
};

export const deleteAmbiente = async (id: number): Promise<void> => {
  await api.delete(`/ambientes/${id}`);
};

export const getEquipos = async (): Promise<Equipo[]> => {
  const response = await api.get('/equipos');
  return response.data.data;
};

export const getMarcas = async (): Promise<Marca[]> => {
  const response = await api.get('/marcas');
  return response.data.data;
};

export const createMarca = async (data: Partial<Marca>): Promise<Marca> => {
  const response = await api.post('/marcas', data);
  return response.data.data;
};

export const updateMarca = async (id: number, data: Partial<Marca>): Promise<Marca> => {
  const response = await api.put(`/marcas/${id}`, data);
  return response.data.data;
};

export const deleteMarca = async (id: number): Promise<void> => {
  await api.delete(`/marcas/${id}`);
};

export const getTipoEquipos = async (): Promise<TipoEquipo[]> => {
  const response = await api.get('/tipo-equipos');
  return response.data.data;
};

export const createTipoEquipo = async (data: Partial<TipoEquipo>): Promise<TipoEquipo> => {
  const response = await api.post('/tipo-equipos', data);
  return response.data.data;
};

export const updateTipoEquipo = async (id: number, data: Partial<TipoEquipo>): Promise<TipoEquipo> => {
  const response = await api.put(`/tipo-equipos/${id}`, data);
  return response.data.data;
};

export const deleteTipoEquipo = async (id: number): Promise<void> => {
  await api.delete(`/tipo-equipos/${id}`);
};

export const createEquipo = async (data: Partial<Equipo>): Promise<Equipo> => {
  const response = await api.post('/equipos', data);
  return response.data.data;
};

export const updateEquipo = async (id: number, data: Partial<Equipo>): Promise<Equipo> => {
  const response = await api.put(`/equipos/${id}`, data);
  return response.data.data;
};

export const deleteEquipo = async (id: number): Promise<void> => {
  await api.delete(`/equipos/${id}`);
};

export const getMovimientosInventario = async (): Promise<MovimientoInventario[]> => {
  const response = await api.get('/movimientos-inventario');
  return response.data.data;
};

export const createMovimientoInventario = async (data: {
  fecha_movimiento: string;
  cantidad: number;
  motivo?: string;
  id_equipo: number;
  id_tipo_movimiento: number;
}): Promise<MovimientoInventario> => {
  const response = await api.post('/movimientos-inventario', data);
  return response.data.data;
};

export const getMantenimientos = async (): Promise<Mantenimiento[]> => {
  const response = await api.get('/mantenimientos');
  return response.data.data;
};

export const createMantenimiento = async (data: Partial<Mantenimiento>): Promise<Mantenimiento> => {
  const response = await api.post('/mantenimientos', data);
  return response.data.data;
};

export const updateMantenimiento = async (id: number, data: Partial<Mantenimiento>): Promise<Mantenimiento> => {
  const response = await api.put(`/mantenimientos/${id}`, data);
  return response.data.data;
};

export const getTiposMovimiento = async (): Promise<TipoMovimiento[]> => {
  const response = await api.get('/tipo-movimientos');
  return response.data.data;
};

export const createTipoMovimiento = async (data: Partial<TipoMovimiento>): Promise<TipoMovimiento> => {
  const response = await api.post('/tipo-movimientos', data);
  return response.data.data;
};

export const updateTipoMovimiento = async (id: number, data: Partial<TipoMovimiento>): Promise<TipoMovimiento> => {
  const response = await api.put(`/tipo-movimientos/${id}`, data);
  return response.data.data;
};

export const deleteTipoMovimiento = async (id: number): Promise<void> => {
  await api.delete(`/tipo-movimientos/${id}`);
};
