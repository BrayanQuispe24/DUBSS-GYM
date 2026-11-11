// src/features/dashboard/components/SolicitudesStatusSummary.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import type { BiSolicitudPendienteReciente } from '../types/bi.types';
import { formatDateTimeShort } from '../utils/biFormatters';

interface SolicitudesStatusSummaryProps {
  solicitudes: BiSolicitudPendienteReciente[];
}

const SolicitudesStatusSummary: React.FC<SolicitudesStatusSummaryProps> = ({
  solicitudes,
}) => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-2">
        {solicitudes.map((sol) => (
          <div
            key={sol.id}
            className="p-2.5 rounded-sm border border-zinc-200 dark:border-[#272732] bg-zinc-50/70 dark:bg-[#1A1A22] hover:bg-zinc-100/80 dark:hover:bg-[#21212B] flex items-center justify-between gap-2 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-zinc-950 dark:text-zinc-100 truncate">
                  {sol.numero_formulario}
                </span>
                <span className="px-1.5 py-0.5 rounded-sm bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 text-micro font-bold uppercase">
                  Pendiente
                </span>
              </div>
              <div className="text-small text-zinc-600 dark:text-zinc-300 truncate mt-0.5">
                {sol.usuario_nombre} · <strong>{sol.disciplina}</strong>
              </div>
              <div className="flex items-center gap-1 text-tiny text-zinc-400 dark:text-zinc-500 mt-0.5">
                <Clock size={10} />
                <span>{formatDateTimeShort(sol.fecha_registro)}</span>
              </div>
            </div>

            <Link
              to="/dashboard/tramites"
              className="shrink-0 px-2 py-1 rounded-sm border border-zinc-300 dark:border-[#383846] bg-white dark:bg-[#141419] hover:border-[#990000] dark:hover:border-red-500 hover:text-[#990000] dark:hover:text-red-400 text-small font-semibold text-zinc-700 dark:text-zinc-200 transition-colors"
            >
              Revisar
            </Link>
          </div>
        ))}
      </div>

      <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-[#272732] flex justify-end">
        <Link
          to="/dashboard/tramites"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#990000] dark:text-red-400 hover:text-[#7A0000] dark:hover:text-red-300"
        >
          Ir a gestión de trámites <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};

export default SolicitudesStatusSummary;
