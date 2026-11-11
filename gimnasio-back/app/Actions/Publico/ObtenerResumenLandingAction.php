<?php

namespace App\Actions\Publico;

use App\Models\Disciplina;
use App\Models\Plan;
use App\Models\Usuario;
use App\Services\Bi\BiQueryHelper;

class ObtenerResumenLandingAction
{
    public function __construct(
        protected BiQueryHelper $biQueryHelper
    ) {}

    public function execute(): array
    {
        $disciplinas = Disciplina::with([
            'disciplinaHorarios' => function ($query) {
                $query->where('estado', true)->with('horario');
            },
        ])
            ->orderBy('nombre')
            ->get()
            ->filter(fn (Disciplina $d) => $this->esEstadoActivo($d->estado))
            ->values()
            ->map(function (Disciplina $disciplina) {
                $horarios = $disciplina->disciplinaHorarios
                    ->filter(fn ($dh) => $dh->horario !== null)
                    ->values()
                    ->map(fn ($dh) => [
                        'id' => $dh->id,
                        'id_disciplina' => $dh->id_disciplina,
                        'id_horario' => $dh->id_horario,
                        'dia_semana' => $dh->horario->dia_semana,
                        'hora_inicio' => $dh->horario->hora_inicio,
                        'hora_fin' => $dh->horario->hora_fin,
                        'cupo_maximo' => (int) ($dh->cupo_maximo ?? 0),
                        'cupos_ocupados' => (int) $dh->cupos_ocupados,
                        'cupos_disponibles' => (int) $dh->cupos_disponibles,
                    ]);

                return [
                    'id' => $disciplina->id,
                    'nombre' => $disciplina->nombre,
                    'cantidad_cupos' => (int) $disciplina->cantidad_cupos,
                    'total_cupos_ocupados' => (int) $disciplina->total_cupos_ocupados,
                    'total_cupos_disponibles' => (int) $disciplina->total_cupos_disponibles,
                    'horarios' => $horarios,
                ];
            });

        $hoy = now()->toDateString();

        $planes = Plan::with('tarifa')
            ->where('estado', true)
            ->orderBy('duracion_dias')
            ->get()
            ->filter(function (Plan $plan) use ($hoy) {
                if (! $plan->tarifa || ! $plan->tarifa->estado) {
                    return false;
                }
                if ($plan->tarifa->fecha_inicio && $plan->tarifa->fecha_inicio > $hoy) {
                    return false;
                }
                if ($plan->tarifa->fecha_fin && $plan->tarifa->fecha_fin < $hoy) {
                    return false;
                }

                return true;
            })
            ->values()
            ->map(fn (Plan $plan) => [
                'id' => $plan->id,
                'nombre' => $plan->nombre,
                'descripcion' => $plan->descripcion,
                'duracion_dias' => (int) $plan->duracion_dias,
                'tarifa' => [
                    'id' => $plan->tarifa->id,
                    'nombre' => $plan->tarifa->nombre,
                    'precio' => (float) $plan->tarifa->precio,
                    'fecha_inicio' => $plan->tarifa->fecha_inicio,
                    'fecha_fin' => $plan->tarifa->fecha_fin,
                ],
            ]);

        $clientesActivosQuery = Usuario::query()
            ->where('estado', true)
            ->whereHas('rol', fn ($q) => $q->whereRaw('LOWER(nombre) = ?', ['cliente']));

        $estudiantesActivos = (clone $clientesActivosQuery)
            ->where('tipo_usuario', 'estudiante')
            ->count();

        $docentesAdminActivos = (clone $clientesActivosQuery)
            ->whereIn('tipo_usuario', ['docente', 'administrativo'])
            ->count();

        $instructoresActivos = Usuario::query()
            ->where('estado', true)
            ->whereHas('rol', fn ($q) => $q->whereRaw('LOWER(nombre) = ?', ['instructor']))
            ->count();

        $aforo = $this->biQueryHelper->aforoTiempoReal();

        return [
            'disciplinas' => $disciplinas,
            'planes' => $planes,
            'estadisticas' => [
                'estudiantes_activos' => $estudiantesActivos,
                'docentes_admin_activos' => $docentesAdminActivos,
                'instructores_activos' => $instructoresActivos,
                'total_disciplinas_activas' => $disciplinas->count(),
                'aforo_actual' => (int) ($aforo['total_actual'] ?? 0),
                'cupo_maximo_total' => (int) ($aforo['cupo_maximo_total'] ?? 0),
            ],
        ];
    }

    private function esEstadoActivo(mixed $estado): bool
    {
        if (is_bool($estado)) {
            return $estado;
        }

        $normalizado = mb_strtolower(trim((string) $estado));

        return ! in_array($normalizado, ['inactivo', '0', 'false', ''], true);
    }
}
