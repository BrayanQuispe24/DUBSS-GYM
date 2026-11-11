// src/features/dashboard/charts/IngresosEvolucionChart.tsx
import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useUIStore } from '@/store/uiStore';
import type { BiIngresoEvolucionItem } from '../types/bi.types';
import { formatBs } from '../utils/biFormatters';

interface IngresosEvolucionChartProps {
  data: BiIngresoEvolucionItem[];
}

const IngresosEvolucionChart: React.FC<IngresosEvolucionChartProps> = ({ data }) => {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'dark';

  const option = useMemo(() => {
    const labels = data.map((d) => d.label);
    const values = data.map((d) => d.ingresos);
    const pagos = data.map((d) => d.cantidad_pagos);
    const lineColor = isDark ? '#EF4444' : '#990000';

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark ? '#141419' : '#111116',
        borderColor: '#DC2626',
        borderWidth: 1,
        textStyle: { color: '#FFFFFF', fontSize: 11 },
        axisPointer: {
          type: 'line',
          lineStyle: { color: isDark ? '#52525B' : '#71717A', type: 'dashed' },
        },
        formatter: (params: Array<{ dataIndex: number }>) => {
          const idx = params[0]?.dataIndex ?? 0;
          const item = data[idx];
          if (!item) return '';
          return `
            <div style="font-weight:700;margin-bottom:4px;">${item.label} (${item.periodo})</div>
            <div>Ingresos: <strong>${formatBs(item.ingresos)}</strong></div>
            <div>Pagos validados: <strong>${item.cantidad_pagos}</strong></div>
          `;
        },
      },
      grid: { left: 56, right: 18, top: 44, bottom: 28 },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: labels,
        axisLine: { lineStyle: { color: isDark ? '#323240' : '#D4D4D8' } },
        axisLabel: { color: isDark ? '#A1A1AA' : '#71717A', fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: isDark ? '#23232D' : '#EFEFF3', type: 'dashed' } },
        axisLabel: {
          color: isDark ? '#A1A1AA' : '#71717A',
          fontSize: 10,
          formatter: (val: number) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`),
        },
      },
      series: [
        {
          name: 'Ingresos (Bs.)',
          type: 'line',
          smooth: 0.3,
          symbol: 'circle',
          symbolSize: 6,
          data: values,
          lineStyle: { width: 2.5, color: lineColor },
          itemStyle: { color: lineColor, borderColor: isDark ? '#141419' : '#FFFFFF', borderWidth: 1.5 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: isDark ? 'rgba(220, 38, 38, 0.35)' : 'rgba(153, 0, 0, 0.25)' },
              { offset: 1, color: 'rgba(153, 0, 0, 0.02)' },
            ]),
          },
          markPoint: pagos.some((p) => p > 0)
            ? {
                symbolSize: 36,
                label: { fontSize: 9, color: '#FFFFFF' },
                itemStyle: { color: '#990000' },
                data: [{ type: 'max', name: 'Máx' }],
              }
            : undefined,
        },
      ],
    };
  }, [data, isDark]);

  return <ReactECharts option={option} style={{ height: 260, width: '100%' }} notMerge />;
};

export default IngresosEvolucionChart;
