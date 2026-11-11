// src/features/dashboard/store/dashboardFiltersStore.ts
import { create } from 'zustand';
import type { BiGlobalFilters, BiGranularidad, BiSortDir, BiTipoDetalle } from '../types/bi.types';

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDefaultDates = (): { desde: string; hasta: string } => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    desde: formatLocalDate(startOfMonth),
    hasta: formatLocalDate(now),
  };
};

interface DashboardFiltersState extends BiGlobalFilters {
  tipo_detalle: BiTipoDetalle;
  search: string;
  sort_by: string;
  sort_dir: BiSortDir;
  page: number;
  per_page: number;

  setDateRange: (desde: string, hasta: string) => void;
  setDisciplina: (idDisciplina: number | null) => void;
  setMetodoPago: (metodoPago: string) => void;
  setEstadoSolicitud: (estado: '' | 'aprobado' | 'pendiente' | 'rechazado') => void;
  setGranularidad: (granularidad: BiGranularidad) => void;
  setTipoDetalle: (tipo: BiTipoDetalle) => void;
  setSearch: (search: string) => void;
  setSorting: (sortBy: string, sortDir: BiSortDir) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  resetFilters: () => void;
}

const defaults = getDefaultDates();

export const useDashboardFiltersStore = create<DashboardFiltersState>((set) => ({
  desde: defaults.desde,
  hasta: defaults.hasta,
  id_disciplina: null,
  metodo_pago: '',
  estado_solicitud: '',
  granularidad: 'day',

  tipo_detalle: 'todos',
  search: '',
  sort_by: 'fecha',
  sort_dir: 'desc',
  page: 1,
  per_page: 15,

  setDateRange: (desde, hasta) => set({ desde, hasta, page: 1 }),
  setDisciplina: (id_disciplina) => set({ id_disciplina, page: 1 }),
  setMetodoPago: (metodo_pago) => set({ metodo_pago, page: 1 }),
  setEstadoSolicitud: (estado_solicitud) => set({ estado_solicitud, page: 1 }),
  setGranularidad: (granularidad) => set({ granularidad }),
  setTipoDetalle: (tipo_detalle) => set({ tipo_detalle, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setSorting: (sort_by, sort_dir) => set({ sort_by, sort_dir, page: 1 }),
  setPage: (page) => set({ page }),
  setPerPage: (per_page) => set({ per_page, page: 1 }),
  resetFilters: () => {
    const fresh = getDefaultDates();
    set({
      desde: fresh.desde,
      hasta: fresh.hasta,
      id_disciplina: null,
      metodo_pago: '',
      estado_solicitud: '',
      granularidad: 'day',
      tipo_detalle: 'todos',
      search: '',
      sort_by: 'fecha',
      sort_dir: 'desc',
      page: 1,
    });
  },
}));
