<?php

namespace App\Actions\Bi;

use App\Services\Bi\BiQueryHelper;

class ObtenerResumenBiAction
{
    public function __construct(private readonly BiQueryHelper $helper) {}

    public function execute(array $filters): array
    {
        // 1. Ingresos actuales y periodo anterior equivalente
        $ingresosActualRow = $this->helper->ingresosQuery($filters, false)
            ->selectRaw('COALESCE(SUM(bp.monto), 0) as total, COUNT(bp.id) as cantidad')
            ->first();

        $ingresosPrevRow = $this->helper->ingresosQuery($filters, true)
            ->selectRaw('COALESCE(SUM(bp.monto), 0) as total')
            ->first();

        $ingresosTotal = round((float) ($ingresosActualRow->total ?? 0), 2);
        $ingresosAnterior = round((float) ($ingresosPrevRow->total ?? 0), 2);
        $cantidadPagos = (int) ($ingresosActualRow->cantidad ?? 0);

        $variacionPct = null;
        if ($ingresosAnterior > 0) {
            $variacionPct = round((($ingresosTotal - $ingresosAnterior) / $ingresosAnterior) * 100, 1);
        } elseif ($ingresosTotal > 0) {
            $variacionPct = 100.0;
        }

        // 2. Boletas de inscripción emitidas y activas
        $inscripcionesStats = $this->helper->inscripcionesQuery($filters)
            ->selectRaw("
                COUNT(bi.id) as total,
                SUM(CASE WHEN LOWER(COALESCE(bi.estado, '')) = 'activo' THEN 1 ELSE 0 END) as activas
            ")
            ->first();

        // 3. Aforo en tiempo real por disciplina
        $aforo = $this->helper->aforoTiempoReal($filters['id_disciplina']);

        // 4. Solicitudes aprobadas/aceptadas, pendientes y rechazadas
        $solicitudesStats = $this->helper->solicitudesQuery($filters)
            ->selectRaw("
                COUNT(fs.id) as total,
                SUM(CASE WHEN LOWER(COALESCE(fs.estado, '')) = 'aprobado' THEN 1 ELSE 0 END) as aprobadas,
                SUM(CASE WHEN LOWER(COALESCE(fs.estado, '')) = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
                SUM(CASE WHEN LOWER(COALESCE(fs.estado, '')) = 'rechazado' THEN 1 ELSE 0 END) as rechazadas
            ")
            ->first();

        $solTotal = (int) ($solicitudesStats->total ?? 0);
        $solAprobadas = (int) ($solicitudesStats->aprobadas ?? 0);
        $solPendientes = (int) ($solicitudesStats->pendientes ?? 0);
        $solRechazadas = (int) ($solicitudesStats->rechazadas ?? 0);

        return [
            'ingresos' => [
                'total' => $ingresosTotal,
                'periodo_anterior' => $ingresosAnterior,
                'variacion_pct' => $variacionPct,
                'cantidad_pagos' => $cantidadPagos,
                'ticket_promedio' => $cantidadPagos > 0 ? round($ingresosTotal / $cantidadPagos, 2) : 0.0,
            ],
            'inscripciones' => [
                'total' => (int) ($inscripcionesStats->total ?? 0),
                'activas' => (int) ($inscripcionesStats->activas ?? 0),
            ],
            'aforo_tiempo_real' => [
                'total_actual' => $aforo['total_actual'],
                'cupo_maximo_total' => $aforo['cupo_maximo_total'],
                'ocupacion_pct' => $aforo['ocupacion_pct'],
                'actualizado_en' => $aforo['actualizado_en'],
            ],
            'solicitudes' => [
                'total' => $solTotal,
                'aprobadas' => $solAprobadas,
                'pendientes' => $solPendientes,
                'rechazadas' => $solRechazadas,
                'tasa_aprobacion_pct' => $solTotal > 0 ? round(($solAprobadas / $solTotal) * 100, 1) : 0.0,
            ],
            'filtros_aplicados' => [
                'desde' => $filters['desde'],
                'hasta' => $filters['hasta'],
                'prev_desde' => $filters['prev_desde'],
                'prev_hasta' => $filters['prev_hasta'],
                'id_disciplina' => $filters['id_disciplina'],
                'metodo_pago' => $filters['metodo_pago'],
                'estado_solicitud' => $filters['estado_solicitud'],
                'granularidad' => $filters['granularidad'],
            ],
            'catalogos' => [
                'disciplinas' => $this->helper->disciplinasDisponibles(),
                'metodos_pago' => $this->helper->metodosPagoDisponibles(),
            ],
        ];
    }
}

