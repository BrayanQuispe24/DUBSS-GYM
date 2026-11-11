// src/features/dashboard/charts/IngresosDisciplinaDonut.tsx
import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useUIStore } from '@/store/uiStore';
import type { BiIngresosDisciplinaDonutItem } from '../types/bi.types';
import { formatBs } from '../utils/biFormatters';

interface IngresosDisciplinaDonutProps {
  data: BiIngresosDisciplinaDonutItem[];
}

const PALETTE_LIGHT = ['#990000', '#DC2626', '#27272A', '#16A34A', '#D97706', '#71717A'];
const PALETTE_DARK = ['#DC2626', '#F87171', '#990000', '#22C55E', '#F59E0B', '#A1A1AA'];

const IngresosDisciplinaDonut: React.FC<IngresosDisciplinaDonutProps> = ({ data }) => {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';
  const palette = isDark ? PALETTE_DARK : PALETTE_LIGHT;

  const total = useMemo(() => data.reduce((acc, item) => acc + item.monto, 0), [data]);

  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: isDark ? '#141419' : '#111116',
        borderColor: '#DC2626',
        borderWidth: 1,
        textStyle: { color: '#FFFFFF', fontSize: 11 },
        formatter: (p: { name: string; value: number; percent: number }) =>
          `<strong>${p.name}</strong><br/>${formatBs(p.value)} (${p.percent}%)`,
      },
      color: palette,
      series: [
        {
          name: 'Ingresos por Disciplina',
          type: 'pie',
          radius: ['55%', '80%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: { borderColor: isDark ? '#141419' : '#FFFFFF', borderWidth: 2 },
          label: { show: false },
          data: data.map((d) => ({
            name: d.disciplina,
            value: d.monto,
          })),
        },
      ],
    };
  }, [data, isDark, palette]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-[165px] w-full">
        <ReactECharts option={option} style={{ height: 165, width: '100%' }} notMerge />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-3">
          <span className="text-tiny font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Total
          </span>
          <span className="text-xs font-extrabold text-zinc-950 dark:text-white leading-tight">
            {formatBs(total)}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
        {data.map((item, idx) => (
          <div
            key={item.disciplina}
            className="flex items-center justify-between gap-2 text-xs border-b border-zinc-100 dark:border-[#272732] pb-1.5 last:border-b-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: palette[idx % palette.length] }}
              />
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{item.disciplina}</span>
              <span className="text-tiny text-zinc-400 dark:text-zinc-500 shrink-0">({item.porcentaje}%)</span>
            </div>
            <div className="font-bold text-zinc-950 dark:text-white shrink-0">{formatBs(item.monto)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngresosDisciplinaDonut;
