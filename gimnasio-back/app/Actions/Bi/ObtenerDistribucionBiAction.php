<?php

namespace App\Actions\Bi;

use App\Services\Bi\BiQueryHelper;

class ObtenerDistribucionBiAction
{
    public function __construct(private readonly BiQueryHelper $helper) {}

    public function execute(array $filters): array
    {
        return [
            'ingresos_por_disciplina' => $this->buildIngresosPorDisciplina($filters),
            'solicitudes_por_estado' => $this->buildSolicitudesPorEstado($filters),
            'solicitudes_pendientes_recientes' => $this->buildSolicitudesPendientesRecientes($filters),
        ];
    }

    private function buildIngresosPorDisciplina(array $filters): array
    {
        $rows = $this->helper->ingresosQuery($filters, false)
            ->selectRaw("
                fs.id_disciplina as id_disciplina,
                COALESCE(d.nombre, 'Sin Disciplina') as disciplina,
                COALESCE(SUM(bp.monto), 0) as monto,
                COUNT(bp.id) as cantidad_pagos
            ")
            ->groupBy('fs.id_disciplina', 'd.nombre')
            ->orderByDesc('monto')
            ->get();

        $total = $rows->sum(fn ($r) => (float) $r->monto);

        return $rows->map(function ($r) use ($total) {
            $monto = round((float) $r->monto, 2);

            return [
                'id_disciplina' => $r->id_disciplina !== null ? (int) $r->id_disciplina : null,
                'disciplina' => (string) $r->disciplina,
                'monto' => $monto,
                'cantidad_pagos' => (int) $r->cantidad_pagos,
                'porcentaje' => $total > 0 ? round(($monto / $total) * 100, 1) : 0.0,
            ];
        })->values()->all();
    }

    private function buildSolicitudesPorEstado(array $filters): array
    {
        $stats = $this->helper->solicitudesQuery($filters)
            ->selectRaw("
                LOWER(COALESCE(fs.estado, 'pendiente')) as estado_norm,
                COUNT(fs.id) as cantidad
            ")
            ->groupByRaw("LOWER(COALESCE(fs.estado, 'pendiente'))")
            ->pluck('cantidad', 'estado_norm');

        $aprobadas = (int) ($stats['aprobado'] ?? 0);
        $pendientes = (int) ($stats['pendiente'] ?? 0);
        $rechazadas = (int) ($stats['rechazado'] ?? 0);
        $total = $aprobadas + $pendientes + $rechazadas;

        $definiciones = [
            ['estado' => 'aprobado', 'label' => 'Aceptadas / Aprobadas', 'cantidad' => $aprobadas],
            ['estado' => 'pendiente', 'label' => 'Pendientes', 'cantidad' => $pendientes],
            ['estado' => 'rechazado', 'label' => 'Rechazadas', 'cantidad' => $rechazadas],
        ];

        return array_map(function (array $item) use ($total) {
            $item['porcentaje'] = $total > 0 ? round(($item['cantidad'] / $total) * 100, 1) : 0.0;

            return $item;
        }, $definiciones);
    }

    private function buildSolicitudesPendientesRecientes(array $filters): array
    {
        $rows = $this->helper->solicitudesQuery(array_merge($filters, ['estado_solicitud' => 'pendiente']))
            ->leftJoin('usuarios as u', 'fs.id_usuario', '=', 'u.id')
            ->selectRaw("
                fs.id,
                fs.numero_formulario,
                fs.estado,
                COALESCE(fs.fecha_registro, fs.created_at) as fecha_registro,
                COALESCE(d.nombre, 'General') as disciplina,
                TRIM(COALESCE(u.nombre, '') || ' ' || COALESCE(u.apellido, '')) as usuario_nombre,
                u.codigo as usuario_codigo
            ")
            ->orderByDesc('fecha_registro')
            ->limit(6)
            ->get();

        return $rows->map(fn ($r) => [
            'id' => (int) $r->id,
            'numero_formulario' => (string) $r->numero_formulario,
            'estado' => (string) $r->estado,
            'fecha_registro' => (string) $r->fecha_registro,
            'disciplina' => (string) $r->disciplina,
            'usuario_nombre' => trim((string) $r->usuario_nombre) !== '' ? trim((string) $r->usuario_nombre) : 'Socio UAGRM',
            'usuario_codigo' => $r->usuario_codigo,
        ])->values()->all();
    }
}

