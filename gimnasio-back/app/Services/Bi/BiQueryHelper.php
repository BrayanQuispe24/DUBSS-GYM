<?php

namespace App\Services\Bi;

use Carbon\Carbon;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class BiQueryHelper
{
    /**
     * Consulta base de boletas de pago completadas (Ingresos) respetando filtros globales.
     */
    public function ingresosQuery(array $filters, bool $usePreviousPeriod = false): Builder
    {
        $desdeDt = $usePreviousPeriod ? $filters['prev_desde_dt'] : $filters['desde_dt'];
        $hastaDt = $usePreviousPeriod ? $filters['prev_hasta_dt'] : $filters['hasta_dt'];

        $query = DB::table('boleta_pago as bp')
            ->leftJoin('formulario_solicitud as fs', 'bp.id_formulario', '=', 'fs.id')
            ->leftJoin('disciplinas as d', 'fs.id_disciplina', '=', 'd.id')
            ->whereRaw("LOWER(COALESCE(bp.estado, '')) = ?", ['completado'])
            ->whereRaw('COALESCE(bp.fecha_pago, bp.created_at) BETWEEN ? AND ?', [$desdeDt, $hastaDt]);

        if (! empty($filters['id_disciplina'])) {
            $query->where('fs.id_disciplina', $filters['id_disciplina']);
        }

        if (! empty($filters['metodo_pago'])) {
            $query->whereRaw('LOWER(COALESCE(bp.metodo_pago, ?)) = ?', ['', strtolower($filters['metodo_pago'])]);
        }

        return $query;
    }

    /**
     * Consulta base de boletas de inscripción respetando filtros globales.
     */
    public function inscripcionesQuery(array $filters): Builder
    {
        $desde = $filters['desde'];
        $hasta = $filters['hasta'];

        $query = DB::table('boleta_inscripcion as bi')
            ->leftJoin('disciplinas as d', 'bi.id_disciplina', '=', 'd.id')
            ->whereRaw('COALESCE(bi.fecha_inscripcion, DATE(bi.created_at)) BETWEEN ? AND ?', [$desde, $hasta]);

        if (! empty($filters['id_disciplina'])) {
            $query->where('bi.id_disciplina', $filters['id_disciplina']);
        }

        return $query;
    }

    /**
     * Consulta base de formularios de solicitud respetando filtros globales.
     */
    public function solicitudesQuery(array $filters): Builder
    {
        $query = DB::table('formulario_solicitud as fs')
            ->leftJoin('disciplinas as d', 'fs.id_disciplina', '=', 'd.id')
            ->whereRaw('COALESCE(fs.fecha_registro, fs.created_at) BETWEEN ? AND ?', [
                $filters['desde_dt'],
                $filters['hasta_dt'],
            ]);

        if (! empty($filters['id_disciplina'])) {
            $query->where('fs.id_disciplina', $filters['id_disciplina']);
        }

        if (! empty($filters['estado_solicitud'])) {
            $query->whereRaw("LOWER(COALESCE(fs.estado, '')) = ?", [$filters['estado_solicitud']]);
        }

        return $query;
    }

    /**
     * Calcula el aforo en tiempo real por disciplina para el día actual (último registro = 'entrada').
     */
    public function aforoTiempoReal(?int $idDisciplina = null): array
    {
        $tz = config('app.timezone', 'America/La_Paz');
        $hoyInicio = Carbon::now($tz)->startOfDay()->toDateTimeString();
        $hoyFin = Carbon::now($tz)->endOfDay()->toDateTimeString();

        // Subconsulta: último registro de entrada/salida de hoy por boleta (o usuario si no hay boleta)
        $ultimosIds = DB::table('registro_entrada_salida')
            ->selectRaw('MAX(id) as max_id')
            ->whereBetween('fecha_hora', [$hoyInicio, $hoyFin])
            ->groupByRaw('CASE WHEN id_boleta_inscripcion IS NOT NULL THEN id_boleta_inscripcion ELSE -COALESCE(id_usuario, id) END');

        $activosDentro = DB::table('registro_entrada_salida as res')
            ->joinSub($ultimosIds, 'ult', function ($join) {
                $join->on('res.id', '=', 'ult.max_id');
            })
            ->leftJoin('boleta_inscripcion as bi', 'res.id_boleta_inscripcion', '=', 'bi.id')
            ->leftJoin('disciplinas as d', 'bi.id_disciplina', '=', 'd.id')
            ->whereRaw("LOWER(COALESCE(res.tipo, '')) = ?", ['entrada'])
            ->selectRaw("
                bi.id_disciplina as id_disciplina,
                COALESCE(d.nombre, bi.disciplina, 'Sin Disciplina') as disciplina_nombre,
                COUNT(*) as personas_dentro
            ")
            ->groupBy('bi.id_disciplina', 'd.nombre', 'bi.disciplina')
            ->get();

        $disciplinasQuery = DB::table('disciplinas')
            ->select('id', 'nombre', 'cantidad_cupos', 'estado')
            ->orderBy('nombre');

        if ($idDisciplina) {
            $disciplinasQuery->where('id', $idDisciplina);
        }

        $disciplinas = $disciplinasQuery->get();

        $conteoPorId = [];
        $conteoPorNombre = [];
        foreach ($activosDentro as $row) {
            if ($row->id_disciplina !== null) {
                $conteoPorId[(int) $row->id_disciplina] = ($conteoPorId[(int) $row->id_disciplina] ?? 0) + (int) $row->personas_dentro;
            } else {
                $key = mb_strtolower((string) $row->disciplina_nombre);
                $conteoPorNombre[$key] = ($conteoPorNombre[$key] ?? 0) + (int) $row->personas_dentro;
            }
        }

        $porDisciplina = [];
        $totalActual = 0;
        $totalCupos = 0;

        foreach ($disciplinas as $disc) {
            $keyNombre = mb_strtolower($disc->nombre);
            $actual = ($conteoPorId[(int) $disc->id] ?? 0) + ($conteoPorNombre[$keyNombre] ?? 0);
            unset($conteoPorNombre[$keyNombre]);

            $cupo = max(0, (int) $disc->cantidad_cupos);
            $totalActual += $actual;
            $totalCupos += $cupo;

            $porDisciplina[] = [
                'id_disciplina' => (int) $disc->id,
                'disciplina' => $disc->nombre,
                'aforo_actual' => $actual,
                'cupo_maximo' => $cupo,
                'ocupacion_pct' => $cupo > 0 ? round(($actual / $cupo) * 100, 1) : 0.0,
            ];
        }

        // Si existen registros de entrada sin disciplina asignada y no se filtró por disciplina específica
        if (! $idDisciplina) {
            foreach ($conteoPorNombre as $nombreKey => $cantidad) {
                if ($cantidad > 0) {
                    $totalActual += $cantidad;
                    $porDisciplina[] = [
                        'id_disciplina' => null,
                        'disciplina' => ucfirst($nombreKey),
                        'aforo_actual' => $cantidad,
                        'cupo_maximo' => 0,
                        'ocupacion_pct' => 0.0,
                    ];
                }
            }
        }

        return [
            'total_actual' => $totalActual,
            'cupo_maximo_total' => $totalCupos,
            'ocupacion_pct' => $totalCupos > 0 ? round(($totalActual / $totalCupos) * 100, 1) : 0.0,
            'por_disciplina' => $porDisciplina,
            'actualizado_en' => Carbon::now($tz)->toIso8601String(),
        ];
    }

    /**
     * Lista de disciplinas disponibles para filtros globales.
     */
    public function disciplinasDisponibles(): Collection
    {
        return DB::table('disciplinas')
            ->select('id', 'nombre', 'cantidad_cupos')
            ->orderBy('nombre')
            ->get();
    }

    /**
     * Lista de métodos de pago registrados para filtros globales.
     */
    public function metodosPagoDisponibles(): Collection
    {
        return DB::table('boleta_pago')
            ->whereNotNull('metodo_pago')
            ->where('metodo_pago', '!=', '')
            ->distinct()
            ->orderBy('metodo_pago')
            ->pluck('metodo_pago');
    }
}

