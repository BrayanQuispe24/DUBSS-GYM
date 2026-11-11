// src/features/dashboard/components/HeroIngresosCard.tsx
import React from 'react';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import type { BiResumenResponse } from '../types/bi.types';
import { formatBs, formatCompactNumber } from '../utils/biFormatters';

interface HeroIngresosCardProps {
  ingresos?: BiResumenResponse['ingresos'];
  filtros?: BiResumenResponse['filtros_aplicados'];
  isLoading: boolean;
}

const HeroIngresosCard: React.FC<HeroIngresosCardProps> = ({
  ingresos,
  filtros,
  isLoading,
}) => {
  const variacion = ingresos?.variacion_pct;
  const isPositive = variacion !== null && variacion !== undefined && variacion >= 0;

  return (
    <div className="bg-white dark:bg-[#141419] border border-zinc-200 dark:border-[#272732] rounded-sm shadow-sm p-4 flex flex-col justify-between">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-small font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Ingresos Recaudados
            </span>
            <span className="px-1.5 py-0.5 rounded-sm bg-red-50 dark:bg-red-950/40 text-[#990000] dark:text-red-400 border border-red-200 dark:border-red-900/50 text-tiny font-bold uppercase">
              Boletas Completadas
            </span>
          </div>

          {isLoading ? (
            <div className="h-9 w-48 bg-zinc-100 dark:bg-[#1C1C24] rounded-sm animate-pulse mt-2" />
          ) : (
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <span className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
                {formatBs(ingresos?.total ?? 0)}
              </span>

              {variacion !== null && variacion !== undefined && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-bold border ${
                    isPositive
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                      : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50'
                  }`}
                >
                  {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(variacion)}%
                </span>
              )}
            </div>
          )}

          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
            Periodo anterior ({filtros?.prev_desde ?? '—'} al {filtros?.prev_hasta ?? '—'}):{' '}
            <strong className="text-zinc-800 dark:text-zinc-200">
              {formatBs(ingresos?.periodo_anterior ?? 0)}
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-sm bg-zinc-50 dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#272732] text-right">
            <div className="text-tiny font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Pagos Validados
            </div>
            <div className="text-base font-extrabold text-zinc-950 dark:text-white">
              {formatCompactNumber(ingresos?.cantidad_pagos ?? 0)}
            </div>
          </div>

          <div className="px-3 py-2 rounded-sm bg-zinc-50 dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#272732] text-right">
            <div className="text-tiny font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Ticket Promedio
            </div>
            <div className="text-base font-extrabold text-[#990000] dark:text-red-400">
              {formatBs(ingresos?.ticket_promedio ?? 0)}
            </div>
          </div>

          <div className="hidden sm:flex w-10 h-10 rounded-sm bg-[#990000]/10 dark:bg-red-600/15 text-[#990000] dark:text-red-400 items-center justify-center border border-[#990000]/20 dark:border-red-500/25">
            <Wallet size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroIngresosCard;
