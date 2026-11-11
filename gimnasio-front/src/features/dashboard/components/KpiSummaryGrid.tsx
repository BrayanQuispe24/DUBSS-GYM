// src/features/dashboard/components/KpiSummaryGrid.tsx
import React from 'react';
import { Activity, ClipboardCheck, FileBadge2 } from 'lucide-react';
import type { BiAforoTiempoRealResponse, BiResumenResponse } from '../types/bi.types';
import { formatCompactNumber } from '../utils/biFormatters';

interface KpiSummaryGridProps {
  resumen?: BiResumenResponse;
  aforoLive?: BiAforoTiempoRealResponse;
  isLoading: boolean;
}

const KpiSummaryGrid: React.FC<KpiSummaryGridProps> = ({
  resumen,
  aforoLive,
  isLoading,
}) => {
  const aforoActual = aforoLive?.total_actual ?? resumen?.aforo_tiempo_real.total_actual ?? 0;
  const cupoMax = aforoLive?.cupo_maximo_total ?? resumen?.aforo_tiempo_real.cupo_maximo_total ?? 0;
  const ocupacionPct = aforoLive?.ocupacion_pct ?? resumen?.aforo_tiempo_real.ocupacion_pct ?? 0;

  const sol = resumen?.solicitudes;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* KPI 2: Boletas de Inscripción */}
      <div className="bg-white dark:bg-[#141419] border border-zinc-200 dark:border-[#272732] rounded-sm shadow-sm p-4 border-l-4 border-l-[#990000] dark:border-l-red-600">
        <div className="flex items-center justify-between">
          <span className="text-small font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Boletas de Inscripción
          </span>
          <div className="p-1.5 rounded-sm bg-red-50 dark:bg-red-950/40 text-[#990000] dark:text-red-400">
            <FileBadge2 size={16} />
          </div>
        </div>

        {isLoading ? (
          <div className="h-8 w-24 bg-zinc-100 dark:bg-[#1C1C24] rounded-sm animate-pulse mt-2" />
        ) : (
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-zinc-950 dark:text-white">
              {formatCompactNumber(resumen?.inscripciones.total ?? 0)}
            </span>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">emitidas</span>
          </div>
        )}

        <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-[#272732] flex items-center justify-between gap-2 text-xs">
          <span className="text-zinc-500 dark:text-zinc-400">Membresías activas del periodo</span>
          <span className="shrink-0 whitespace-nowrap px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 font-bold">
            {formatCompactNumber(resumen?.inscripciones.activas ?? 0)} activas
          </span>
        </div>
      </div>

      {/* KPI 3: Aforo en Tiempo Real */}
      <div className="bg-white dark:bg-[#141419] border border-zinc-200 dark:border-[#272732] rounded-sm shadow-sm p-4 border-l-4 border-l-[#DC2626] dark:border-l-red-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-small font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Aforo en Tiempo Real
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 text-micro font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              En vivo
            </span>
          </div>
          <div className="p-1.5 rounded-sm bg-red-50 dark:bg-red-950/40 text-[#DC2626] dark:text-red-400">
            <Activity size={16} />
          </div>
        </div>

        {isLoading ? (
          <div className="h-8 w-24 bg-zinc-100 dark:bg-[#1C1C24] rounded-sm animate-pulse mt-2" />
        ) : (
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-zinc-950 dark:text-white">
              {formatCompactNumber(aforoActual)}
            </span>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              / {formatCompactNumber(cupoMax)} cupos ({ocupacionPct}%)
            </span>
          </div>
        )}

        <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-[#272732]">
          <div className="w-full h-1.5 bg-zinc-100 dark:bg-[#23232D] rounded-sm overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                ocupacionPct >= 85
                  ? 'bg-red-600'
                  : ocupacionPct >= 60
                    ? 'bg-amber-500'
                    : 'bg-[#990000] dark:bg-red-500'
              }`}
              style={{ width: `${Math.min(100, ocupacionPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI 4: Solicitudes (Aceptadas / Pendientes / Rechazadas) */}
      <div className="bg-white dark:bg-[#141419] border border-zinc-200 dark:border-[#272732] rounded-sm shadow-sm p-4 border-l-4 border-l-zinc-800 dark:border-l-zinc-500">
        <div className="flex items-center justify-between">
          <span className="text-small font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Solicitudes de Trámite
          </span>
          <div className="p-1.5 rounded-sm bg-zinc-100 dark:bg-[#1C1C24] text-zinc-800 dark:text-zinc-200">
            <ClipboardCheck size={16} />
          </div>
        </div>

        {isLoading ? (
          <div className="h-8 w-24 bg-zinc-100 dark:bg-[#1C1C24] rounded-sm animate-pulse mt-2" />
        ) : (
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-zinc-950 dark:text-white">
              {formatCompactNumber(sol?.total ?? 0)}
            </span>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              ({sol?.tasa_aprobacion_pct ?? 0}% aprobación)
            </span>
          </div>
        )}

        <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-[#272732] grid grid-cols-3 gap-1 text-center">
          <div className="px-0.5 py-1 rounded-sm bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 min-w-0">
            <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 leading-tight">
              {formatCompactNumber(sol?.aprobadas ?? 0)}
            </div>
            <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">Aprob</div>
          </div>
          <div className="px-0.5 py-1 rounded-sm bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 min-w-0">
            <div className="text-xs font-extrabold text-amber-700 dark:text-amber-400 leading-tight">
              {formatCompactNumber(sol?.pendientes ?? 0)}
            </div>
            <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">Pend</div>
          </div>
          <div className="px-0.5 py-1 rounded-sm bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 min-w-0">
            <div className="text-xs font-extrabold text-red-700 dark:text-red-400 leading-tight">
              {formatCompactNumber(sol?.rechazadas ?? 0)}
            </div>
            <div className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400 whitespace-nowrap">Rech</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiSummaryGrid;
