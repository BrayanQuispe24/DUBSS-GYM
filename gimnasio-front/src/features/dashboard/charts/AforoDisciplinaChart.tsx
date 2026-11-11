// src/features/dashboard/charts/AforoDisciplinaChart.tsx
import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useUIStore } from '@/store/uiStore';
import type { BiAforoDisciplinaItem } from '../types/bi.types';

interface AforoDisciplinaChartProps {
  data: BiAforoDisciplinaItem[];
}

const AforoDisciplinaChart: React.FC<AforoDisciplinaChartProps> = ({ data }) => {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';

  const option = useMemo(() => {
    const names = data.map((d) => d.disciplina);
    const actuales = data.map((d) => ({
      value: d.aforo_actual,
      itemStyle: {
        color:
          d.ocupacion_pct >= 85
            ? '#EF4444'
            : d.ocupacion_pct >= 60
              ? '#D97706'
              : isDark
                ? '#DC2626'
                : '#990000',
        borderRadius: [0, 3, 3, 0],
      },
    }));
    const cupos = data.map((d) => d.cupo_maximo);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: isDark ? '#141419' : '#111116',
        borderColor: '#DC2626',
        borderWidth: 1,
        textStyle: { color: '#FFFFFF', fontSize: 11 },
        formatter: (params: Array<{ dataIndex: number }>) => {
          const idx = params[0]?.dataIndex ?? 0;
          const item = data[idx];
          if (!item) return '';
          return `
            <div style="font-weight:700;margin-bottom:4px;">${item.disciplina}</div>
            <div>Personas dentro ahora: <strong>${item.aforo_actual}</strong></div>
            <div>Cupo máximo: <strong>${item.cupo_maximo}</strong></div>
            <div>Ocupación: <strong>${item.ocupacion_pct}%</strong></div>
          `;
        },
      },
      legend: {
        bottom: 0,
        textStyle: { fontSize: 10, color: isDark ? '#A1A1AA' : '#52525B' },
      },
      grid: { left: 125, right: 28, top: 16, bottom: 36 },
      xAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: { lineStyle: { color: isDark ? '#23232D' : '#EFEFF3', type: 'dashed' } },
        axisLabel: { color: isDark ? '#A1A1AA' : '#71717A', fontSize: 10 },
      },
      yAxis: {
        type: 'category',
        data: names,
        inverse: true,
        axisLine: { lineStyle: { color: isDark ? '#323240' : '#D4D4D8' } },
        axisLabel: { color: isDark ? '#D4D4D8' : '#3F3F46', fontSize: 11, fontWeight: 600 },
      },
      series: [
        {
          name: 'Aforo Actual',
          type: 'bar',
          barMaxWidth: 16,
          data: actuales,
          label: {
            show: true,
            position: 'right',
            fontSize: 10,
            fontWeight: 700,
            color: isDark ? '#F4F4F5' : '#0B0B0D',
          },
        },
        {
          name: 'Cupo Máximo',
          type: 'bar',
          barMaxWidth: 16,
          data: cupos,
          itemStyle: { color: isDark ? '#272732' : '#E4E4E7', borderRadius: [0, 3, 3, 0] },
        },
      ],
    };
  }, [data, isDark]);

  return <ReactECharts option={option} style={{ height: 260, width: '100%' }} notMerge />;
};

export default AforoDisciplinaChart;
