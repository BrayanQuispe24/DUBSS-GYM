<?php

namespace App\Actions\Bi;

use App\Services\Bi\BiQueryHelper;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class ObtenerSeriesBiAction
{
    public function __construct(private readonly BiQueryHelper $helper) {}

    public function execute(array $filters): array
    {
        return [
            'ingresos_evolucion' => $this->buildIngresosEvolucion($filters),
            'boletas_por_disciplina' => $this->buildBoletasPorDisciplina($filters),
            'aforo_por_disciplina' => $this->helper->aforoTiempoReal($filters['id_disciplina'])['por_disciplina'],
        ];
    }

    private function buildIngresosEvolucion(array $filters): array
    {
        $rows = $this->helper->ingresosQuery($filters, false)
            ->selectRaw('DATE(COALESCE(bp.fecha_pago, bp.created_at)) as fecha_dia, COALESCE(SUM(bp.monto), 0) as monto, COUNT(bp.id) as cantidad')
            ->groupByRaw('DATE(COALESCE(bp.fecha_pago, bp.created_at))')
            ->orderByRaw('DATE(COALESCE(bp.fecha_pago, bp.created_at)) ASC')
            ->get();

        $granularidad = $filters['granularidad'];
        $acumulado = [];

        foreach ($rows as $row) {
            $fecha = Carbon::parse($row->fecha_dia);
            $key = $granularidad === 'month' ? $fecha->format('Y-m') : $fecha->format('Y-m-d');
            if (! isset($acumulado[$key])) {
                $acumulado[$key] = ['ingresos' => 0.0, 'cantidad_pagos' => 0];
            }
            $acumulado[$key]['ingresos'] += (float) $row->monto;
            $acumulado[$key]['cantidad_pagos'] += (int) $row->cantidad;
        }

        $inicio = Carbon::parse($filters['desde']);
        $fin = Carbon::parse($filters['hasta']);
        $step = $granularidad === 'month' ? '1 month' : '1 day';

        if ($granularidad === 'month') {
            $inicio = $inicio->copy()->startOfMonth();
            $fin = $fin->copy()->startOfMonth();
        }

        $period = CarbonPeriod::create($inicio, $step, $fin);
        $mesesCortos = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        $serie = [];

        foreach ($period as $dt) {
            $key = $granularidad === 'month' ? $dt->format('Y-m') : $dt->format('Y-m-d');
            $label = $granularidad === 'month'
                ? $mesesCortos[$dt->month - 1] . ' ' . $dt->format('Y')
                : $dt->format('d') . ' ' . $mesesCortos[$dt->month - 1];

            $serie[] = [
                'periodo' => $key,
                'label' => $label,
                'ingresos' => round($acumulado[$key]['ingresos'] ?? 0.0, 2),
                'cantidad_pagos' => $acumulado[$key]['cantidad_pagos'] ?? 0,
            ];
        }

        return $serie;
    }

    private function buildBoletasPorDisciplina(array $filters): array
    {
        $rows = $this->helper->inscripcionesQuery($filters)
            ->selectRaw("
                bi.id_disciplina as id_disciplina,
                COALESCE(d.nombre, bi.disciplina, 'Sin Disciplina') as disciplina,
                COUNT(bi.id) as cantidad_boletas,
                COALESCE(SUM(bi.monto), 0) as monto_total
            ")
            ->groupBy('bi.id_disciplina', 'd.nombre', 'bi.disciplina')
            ->orderByDesc('cantidad_boletas')
            ->get();

        return $rows->map(fn ($r) => [
            'id_disciplina' => $r->id_disciplina !== null ? (int) $r->id_disciplina : null,
            'disciplina' => (string) $r->disciplina,
            'cantidad_boletas' => (int) $r->cantidad_boletas,
            'monto_total' => round((float) $r->monto_total, 2),
        ])->values()->all();
    }
}

