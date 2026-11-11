// src/features/dashboard/components/GlobalFiltersBar.tsx
import React, { useState } from 'react';
import { Calendar, Filter, RotateCcw } from 'lucide-react';
import { biGlobalFiltersSchema } from '../schemas/biFilters.schema';
import { useDashboardFiltersStore } from '../store/dashboardFiltersStore';
import type { BiCatalogoDisciplina } from '../types/bi.types';

interface GlobalFiltersBarProps {
  disciplinas: BiCatalogoDisciplina[];
  metodosPago: string[];
}

const toLocalDateStr = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const GlobalFiltersBar: React.FC<GlobalFiltersBarProps> = ({
  disciplinas,
  metodosPago,
}) => {
  const {
    desde,
    hasta,
    id_disciplina,
    metodo_pago,
    estado_solicitud,
    granularidad,
    setDateRange,
    setDisciplina,
    setMetodoPago,
    setEstadoSolicitud,
    setGranularidad,
    resetFilters,
  } = useDashboardFiltersStore();

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleDateChange = (newDesde: string, newHasta: string) => {
    const parsed = biGlobalFiltersSchema.safeParse({
      desde: newDesde,
      hasta: newHasta,
      id_disciplina,
      metodo_pago,
      estado_solicitud,
      granularidad,
    });

    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message || 'Rango de fechas inválido');
      return;
    }

    setValidationError(null);
    setDateRange(newDesde, newHasta);
  };

  const applyPreset = (preset: 'today' | '7d' | 'month' | '90d') => {
    const now = new Date();
    const hastaStr = toLocalDateStr(now);
    let desdeDate = new Date(now);

    if (preset === 'today') {
      desdeDate = now;
    } else if (preset === '7d') {
      desdeDate.setDate(now.getDate() - 6);
    } else if (preset === 'month') {
      desdeDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (preset === '90d') {
      desdeDate.setDate(now.getDate() - 89);
      setGranularidad('month');
    }

    if (preset !== '90d') {
      setGranularidad('day');
    }

    setValidationError(null);
    setDateRange(toLocalDateStr(desdeDate), hastaStr);
  };

  return (
    <div className="bg-white dark:bg-[#141419] border border-zinc-200 dark:border-[#272732] rounded-sm shadow-sm p-3.5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-zinc-100 dark:border-[#272732]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">
          <Filter size={14} className="text-[#990000] dark:text-red-400" />
          <span>Filtros Globales del Dashboard</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset('today')}
            className="px-2.5 py-1 rounded-sm border border-zinc-200 dark:border-[#272732] bg-zinc-50 dark:bg-[#1A1A22] hover:bg-zinc-100 dark:hover:bg-[#21212B] text-small font-semibold text-zinc-700 dark:text-zinc-200 cursor-pointer"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => applyPreset('7d')}
            className="px-2.5 py-1 rounded-sm border border-zinc-200 dark:border-[#272732] bg-zinc-50 dark:bg-[#1A1A22] hover:bg-zinc-100 dark:hover:bg-[#21212B] text-small font-semibold text-zinc-700 dark:text-zinc-200 cursor-pointer"
          >
            Últimos 7 días
          </button>
          <button
            type="button"
            onClick={() => applyPreset('month')}
            className="px-2.5 py-1 rounded-sm border border-zinc-200 dark:border-[#272732] bg-zinc-50 dark:bg-[#1A1A22] hover:bg-zinc-100 dark:hover:bg-[#21212B] text-small font-semibold text-zinc-700 dark:text-zinc-200 cursor-pointer"
          >
            Este Mes
          </button>
          <button
            type="button"
            onClick={() => applyPreset('90d')}
            className="px-2.5 py-1 rounded-sm border border-zinc-200 dark:border-[#272732] bg-zinc-50 dark:bg-[#1A1A22] hover:bg-zinc-100 dark:hover:bg-[#21212B] text-small font-semibold text-zinc-700 dark:text-zinc-200 cursor-pointer"
          >
            Trimestre
          </button>
          <button
            type="button"
            onClick={() => {
              setValidationError(null);
              resetFilters();
            }}
            className="px-2.5 py-1 rounded-sm border border-zinc-300 dark:border-[#383846] bg-white dark:bg-[#141419] hover:bg-zinc-50 dark:hover:bg-[#21212B] text-small font-semibold text-zinc-700 dark:text-zinc-200 inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={12} />
            Limpiar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div>
          <label className="block text-tiny font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Desde
          </label>
          <div className="relative">
            <Calendar
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              type="date"
              value={desde}
              onChange={(e) => handleDateChange(e.target.value, hasta)}
              className="w-full pl-8 pr-2 py-1.5 rounded-sm text-xs font-medium border border-zinc-300 dark:border-[#383846] bg-white dark:bg-[#1A1A22] text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#990000] dark:focus:border-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-tiny font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Hasta
          </label>
          <div className="relative">
            <Calendar
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              type="date"
              value={hasta}
              onChange={(e) => handleDateChange(desde, e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 rounded-sm text-xs font-medium border border-zinc-300 dark:border-[#383846] bg-white dark:bg-[#1A1A22] text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#990000] dark:focus:border-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-tiny font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Disciplina
          </label>
          <select
            value={id_disciplina ?? ''}
            onChange={(e) =>
              setDisciplina(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-zinc-300 dark:border-[#383846] bg-white dark:bg-[#1A1A22] text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#990000] dark:focus:border-red-500 cursor-pointer"
          >
            <option value="">Todas las disciplinas</option>
            {disciplinas.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-tiny font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Método de Pago
          </label>
          <select
            value={metodo_pago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-zinc-300 dark:border-[#383846] bg-white dark:bg-[#1A1A22] text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#990000] dark:focus:border-red-500 cursor-pointer"
          >
            <option value="">Todos</option>
            {metodosPago.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-tiny font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Estado Solicitud
          </label>
          <select
            value={estado_solicitud}
            onChange={(e) =>
              setEstadoSolicitud(
                e.target.value as '' | 'aprobado' | 'pendiente' | 'rechazado'
              )
            }
            className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-zinc-300 dark:border-[#383846] bg-white dark:bg-[#1A1A22] text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#990000] dark:focus:border-red-500 cursor-pointer"
          >
            <option value="">Todos los estados</option>
            <option value="aprobado">Aceptadas / Aprobadas</option>
            <option value="pendiente">Pendientes</option>
            <option value="rechazado">Rechazadas</option>
          </select>
        </div>

        <div>
          <label className="block text-tiny font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Agrupación Serie
          </label>
          <select
            value={granularidad}
            onChange={(e) =>
              setGranularidad(e.target.value as 'day' | 'month')
            }
            className="w-full px-2.5 py-1.5 rounded-sm text-xs font-medium border border-zinc-300 dark:border-[#383846] bg-white dark:bg-[#1A1A22] text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#990000] dark:focus:border-red-500 cursor-pointer"
          >
            <option value="day">Por Día</option>
            <option value="month">Por Mes</option>
          </select>
        </div>
      </div>

      {validationError && (
        <div className="px-3 py-1.5 rounded-sm bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs font-semibold">
          {validationError}
        </div>
      )}
    </div>
  );
};

export default GlobalFiltersBar;
