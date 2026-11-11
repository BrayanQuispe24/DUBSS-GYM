<?php

namespace App\Actions\Bi;

use App\Services\Bi\BiQueryHelper;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class ListarDetalleBiAction
{
    public function __construct(private readonly BiQueryHelper $helper) {}

    public function execute(array $filters, bool $forExport = false): array
    {
        $tipo = $filters['tipo_detalle'] ?? 'todos';
        $queries = [];

        if (in_array($tipo, ['todos', 'ingresos'], true)) {
            $queries[] = $this->ingresosSubquery($filters);
        }
        if (in_array($tipo, ['todos', 'inscripciones'], true)) {
            $queries[] = $this->inscripcionesSubquery($filters);
        }
        if (in_array($tipo, ['todos', 'solicitudes'], true)) {
            $queries[] = $this->solicitudesSubquery($filters);
        }

        $union = array_shift($queries);
        foreach ($queries as $next) {
            $union->unionAll($next);
        }

        $outer = DB::query()->fromSub($union, 'bi_movimientos');

        if (! empty($filters['search'])) {
            $term = '%' . mb_strtolower($filters['search']) . '%';
            $outer->where(function (Builder $q) use ($term) {
                $q->whereRaw('LOWER(referencia) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(usuario) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(disciplina) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(estado) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(COALESCE(metodo_pago, ?)) LIKE ?', ['', $term]);
            });
        }

        $allowedSorts = ['fecha', 'referencia', 'usuario', 'disciplina', 'estado', 'monto', 'tipo_registro'];
        $sortBy = in_array($filters['sort_by'] ?? 'fecha', $allowedSorts, true) ? $filters['sort_by'] : 'fecha';
        $sortDir = ($filters['sort_dir'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        $outer->orderBy($sortBy, $sortDir);

        if ($forExport) {
            return $outer->limit(5000)->get()->map(fn ($r) => $this->formatRow($r))->all();
        }

        $paginator = $outer->paginate($filters['per_page'] ?? 15, ['*'], 'page', $filters['page'] ?? 1);

        return [
            'data' => collect($paginator->items())->map(fn ($r) => $this->formatRow($r))->values()->all(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem() ?? 0,
                'to' => $paginator->lastItem() ?? 0,
            ],
        ];
    }

    private function ingresosSubquery(array $filters): Builder
    {
        return $this->helper->ingresosQuery($filters, false)
            ->leftJoin('usuarios as u', 'fs.id_usuario', '=', 'u.id')
            ->selectRaw("
                bp.id as registro_id,
                CAST('ingreso' AS TEXT) as tipo_registro,
                CAST(COALESCE(bp.fecha_pago, bp.created_at) AS TEXT) as fecha,
                CAST(bp.numero_boleta AS TEXT) as referencia,
                CAST(COALESCE(NULLIF(TRIM(COALESCE(u.nombre, '') || ' ' || COALESCE(u.apellido, '')), ''), u.email, 'Socio UAGRM') AS TEXT) as usuario,
                CAST(COALESCE(d.nombre, 'General') AS TEXT) as disciplina,
                CAST(COALESCE(bp.metodo_pago, 'Caja Campus') AS TEXT) as metodo_pago,
                CAST(COALESCE(bp.estado, 'completado') AS TEXT) as estado,
                CAST(bp.monto AS DECIMAL(12,2)) as monto
            ");
    }

    private function inscripcionesSubquery(array $filters): Builder
    {
        return $this->helper->inscripcionesQuery($filters)
            ->leftJoin('usuarios as u', 'bi.id_usuario', '=', 'u.id')
            ->selectRaw("
                bi.id as registro_id,
                CAST('inscripcion' AS TEXT) as tipo_registro,
                CAST(COALESCE(bi.created_at, bi.fecha_inscripcion) AS TEXT) as fecha,
                CAST(bi.numero_boleta AS TEXT) as referencia,
                CAST(COALESCE(NULLIF(TRIM(COALESCE(u.nombre, '') || ' ' || COALESCE(u.apellido, '')), ''), u.email, 'Socio UAGRM') AS TEXT) as usuario,
                CAST(COALESCE(d.nombre, bi.disciplina, 'General') AS TEXT) as disciplina,
                CAST('Membresía' AS TEXT) as metodo_pago,
                CAST(COALESCE(bi.estado, 'activo') AS TEXT) as estado,
                CAST(bi.monto AS DECIMAL(12,2)) as monto
            ");
    }

    private function solicitudesSubquery(array $filters): Builder
    {
        return $this->helper->solicitudesQuery($filters)
            ->leftJoin('usuarios as u', 'fs.id_usuario', '=', 'u.id')
            ->leftJoin('planes as p', 'fs.id_plan', '=', 'p.id')
            ->leftJoin('tarifas as t', 'p.id_tarifa', '=', 't.id')
            ->selectRaw("
                fs.id as registro_id,
                CAST('solicitud' AS TEXT) as tipo_registro,
                CAST(COALESCE(fs.fecha_registro, fs.created_at) AS TEXT) as fecha,
                CAST(fs.numero_formulario AS TEXT) as referencia,
                CAST(COALESCE(NULLIF(TRIM(COALESCE(u.nombre, '') || ' ' || COALESCE(u.apellido, '')), ''), u.email, 'Socio UAGRM') AS TEXT) as usuario,
                CAST(COALESCE(d.nombre, 'General') AS TEXT) as disciplina,
                CAST(COALESCE(p.nombre, 'Trámite') AS TEXT) as metodo_pago,
                CAST(COALESCE(fs.estado, 'pendiente') AS TEXT) as estado,
                CAST(COALESCE(t.precio, 0) AS DECIMAL(12,2)) as monto
            ");
    }

    private function formatRow(object $row): array
    {
        return [
            'id' => "{$row->tipo_registro}-{$row->registro_id}",
            'registro_id' => (int) $row->registro_id,
            'tipo_registro' => (string) $row->tipo_registro,
            'fecha' => (string) $row->fecha,
            'referencia' => (string) $row->referencia,
            'usuario' => (string) $row->usuario,
            'disciplina' => (string) $row->disciplina,
            'metodo_pago' => (string) $row->metodo_pago,
            'estado' => (string) $row->estado,
            'monto' => round((float) $row->monto, 2),
        ];
    }
}
