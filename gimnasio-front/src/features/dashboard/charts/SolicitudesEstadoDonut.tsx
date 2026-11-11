// src/features/dashboard/charts/SolicitudesEstadoDonut.tsx
import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useUIStore } from '@/store/uiStore';
import type { BiSolicitudesEstadoItem } from '../types/bi.types';
import { formatCompactNumber } from '../utils/biFormatters';

interface SolicitudesEstadoDonutProps {
  data: BiSolicitudesEstadoItem[];
}

const COLOR_MAP: Record<BiSolicitudesEstadoItem['estado'], string> = {
  aprobado: '#16A34A',
  pendiente: '#D97706',
  rechazado: '#DC2626',
};

const SolicitudesEstadoDonut: React.FC<SolicitudesEstadoDonutProps> = ({ data }) => {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';

  const total = useMemo(() => data.reduce((acc, d) => acc + d.cantidad, 0), [data]);

  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: isDark ? '#141419' : '#111116',
        borderColor: '#DC2626',
        borderWidth: 1,
        textStyle: { color: '#FFFFFF', fontSize: 11 },
        formatter: (p: { name: string; value: number; percent: number }) =>
          `<strong>${p.name}</strong><br/>${p.value} solicitudes (${p.percent}%)`,
      },
      series: [
        {
          name: 'Estado de Solicitudes',
          type: 'pie',
          radius: ['55%', '80%'],
          center: ['50%', '50%'],
          itemStyle: { borderColor: isDark ? '#141419' : '#FFFFFF', borderWidth: 2 },
          label: { show: false },
          data: data.map((item) => ({
            name: item.label,
            value: item.cantidad,
            itemStyle: { color: COLOR_MAP[item.estado] },
          })),
        },
      ],
    };
  }, [data, isDark]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-[165px] w-full">
        <ReactECharts option={option} style={{ height: 165, width: '100%' }} notMerge />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-3">
          <span className="text-tiny font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Solicitudes
          </span>
          <span className="text-xl font-extrabold text-zinc-950 dark:text-white">
            {formatCompactNumber(total)}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        {data.map((item) => (
          <div
            key={item.estado}
            className="flex items-center justify-between gap-2 text-xs border-b border-zinc-100 dark:border-[#272732] pb-1.5 last:border-b-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: COLOR_MAP[item.estado] }}
              />
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{item.label}</span>
              <span className="text-tiny text-zinc-400 dark:text-zinc-500 shrink-0">({item.porcentaje}%)</span>
            </div>
            <span className="text-sm font-extrabold text-zinc-950 dark:text-white shrink-0">
              {formatCompactNumber(item.cantidad)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolicitudesEstadoDonut;
