// src/features/dashboard/charts/InscripcionesDisciplinaChart.tsx
import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useUIStore } from '@/store/uiStore';
import type { BiBoletasDisciplinaItem } from '../types/bi.types';
import { formatBs } from '../utils/biFormatters';

interface InscripcionesDisciplinaChartProps {
  data: BiBoletasDisciplinaItem[];
}

const InscripcionesDisciplinaChart: React.FC<InscripcionesDisciplinaChartProps> = ({ data }) => {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';

  const option = useMemo(() => {
    const names = data.map((d) => d.disciplina);
    const counts = data.map((d) => d.cantidad_boletas);

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
            <div>Boletas emitidas: <strong>${item.cantidad_boletas}</strong></div>
            <div>Monto inscrito: <strong>${formatBs(item.monto_total)}</strong></div>
          `;
        },
      },
      grid: { left: 40, right: 12, top: 20, bottom: 38 },
      xAxis: {
        type: 'category',
        data: names,
        axisLine: { lineStyle: { color: isDark ? '#323240' : '#D4D4D8' } },
        axisLabel: {
          color: isDark ? '#D4D4D8' : '#52525B',
          fontSize: 10,
          interval: 0,
          rotate: names.length > 4 ? 18 : 0,
        },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: { lineStyle: { color: isDark ? '#23232D' : '#EFEFF3', type: 'dashed' } },
        axisLabel: { color: isDark ? '#A1A1AA' : '#71717A', fontSize: 10 },
      },
      series: [
        {
          name: 'Boletas de Inscripción',
          type: 'bar',
          barMaxWidth: 34,
          data: counts,
          itemStyle: {
            borderRadius: [3, 3, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#EF4444' },
              { offset: 1, color: '#990000' },
            ]),
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 10,
            fontWeight: 700,
            color: isDark ? '#F4F4F5' : '#0B0B0D',
          },
        },
      ],
    };
  }, [data, isDark]);

  return <ReactECharts option={option} style={{ height: 240, width: '100%' }} notMerge />;
};

export default InscripcionesDisciplinaChart;
