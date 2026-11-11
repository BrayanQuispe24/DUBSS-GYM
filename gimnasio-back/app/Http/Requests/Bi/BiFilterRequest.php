<?php

namespace App\Http\Requests\Bi;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class BiFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if (! $user) {
            return false;
        }

        return in_array($user->getRolNombre(), ['administrador', 'recepcionista'], true);
    }

    public function rules(): array
    {
        return [
            'desde' => ['nullable', 'date'],
            'hasta' => ['nullable', 'date', 'after_or_equal:desde'],
            'id_disciplina' => ['nullable', 'integer', 'exists:disciplinas,id'],
            'metodo_pago' => ['nullable', 'string', 'max:50'],
            'estado_solicitud' => ['nullable', 'string', 'in:aprobado,pendiente,rechazado,cancelado'],
            'granularidad' => ['nullable', 'string', 'in:day,month'],
            'tipo_detalle' => ['nullable', 'string', 'in:todos,ingresos,inscripciones,solicitudes'],
            'search' => ['nullable', 'string', 'max:120'],
            'sort_by' => ['nullable', 'string', 'in:fecha,referencia,usuario,disciplina,estado,monto,tipo_registro'],
            'sort_dir' => ['nullable', 'string', 'in:asc,desc'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:5', 'max:100'],
        ];
    }

    /**
     * Normaliza los filtros globales aplicando fechas por defecto y periodo anterior equivalente.
     */
    public function normalizedFilters(): array
    {
        $tz = config('app.timezone', 'America/La_Paz');
        $validated = $this->validated();

        $hastaDate = ! empty($validated['hasta'])
            ? Carbon::parse($validated['hasta'], $tz)->startOfDay()
            : Carbon::now($tz)->startOfDay();

        $desdeDate = ! empty($validated['desde'])
            ? Carbon::parse($validated['desde'], $tz)->startOfDay()
            : $hastaDate->copy()->startOfMonth();

        if ($desdeDate->gt($hastaDate)) {
            $desdeDate = $hastaDate->copy()->startOfMonth();
        }

        $diasRango = max(1, $desdeDate->diffInDays($hastaDate) + 1);
        $prevHasta = $desdeDate->copy()->subDay();
        $prevDesde = $prevHasta->copy()->subDays($diasRango - 1);

        $granularidad = $validated['granularidad'] ?? ($diasRango > 62 ? 'month' : 'day');

        return [
            'desde' => $desdeDate->toDateString(),
            'hasta' => $hastaDate->toDateString(),
            'desde_dt' => $desdeDate->copy()->startOfDay()->toDateTimeString(),
            'hasta_dt' => $hastaDate->copy()->endOfDay()->toDateTimeString(),
            'prev_desde' => $prevDesde->toDateString(),
            'prev_hasta' => $prevHasta->toDateString(),
            'prev_desde_dt' => $prevDesde->copy()->startOfDay()->toDateTimeString(),
            'prev_hasta_dt' => $prevHasta->copy()->endOfDay()->toDateTimeString(),
            'id_disciplina' => isset($validated['id_disciplina']) ? (int) $validated['id_disciplina'] : null,
            'metodo_pago' => ! empty($validated['metodo_pago']) ? trim((string) $validated['metodo_pago']) : null,
            'estado_solicitud' => ! empty($validated['estado_solicitud']) ? strtolower((string) $validated['estado_solicitud']) : null,
            'granularidad' => $granularidad,
            'tipo_detalle' => $validated['tipo_detalle'] ?? 'todos',
            'search' => ! empty($validated['search']) ? trim((string) $validated['search']) : null,
            'sort_by' => $validated['sort_by'] ?? 'fecha',
            'sort_dir' => $validated['sort_dir'] ?? 'desc',
            'page' => (int) ($validated['page'] ?? 1),
            'per_page' => (int) ($validated['per_page'] ?? 15),
        ];
    }
}

