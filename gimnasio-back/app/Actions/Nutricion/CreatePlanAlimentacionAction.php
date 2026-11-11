<?php

namespace App\Actions\Nutricion;

use App\DTOs\Nutricion\CreatePlanAlimentacionDTO;
use App\Models\DetallePlanAlimentacion;
use App\Models\PlanAlimentacion;
use Illuminate\Support\Facades\DB;

class CreatePlanAlimentacionAction
{
    public function execute(CreatePlanAlimentacionDTO $dto): PlanAlimentacion
    {
        return DB::transaction(function () use ($dto) {
            $plan = PlanAlimentacion::create([
                'nombre' => mb_substr($dto->nombre, 0, 250),
                'objetivo' => $dto->objetivo ? mb_substr($dto->objetivo, 0, 250) : null,
                'fecha_inicio' => $dto->fechaInicio,
                'fecha_fin' => $dto->fechaFin,
                'observacion' => $dto->observacion,
                'estado' => $dto->estado,
                'id_usuario' => $dto->idUsuario,
            ]);

            foreach ($dto->detalles as $detalleData) {
                DetallePlanAlimentacion::create([
                    'id_plan_alimentacion' => $plan->id,
                    'dia_semana' => isset($detalleData['dia_semana']) ? mb_substr($detalleData['dia_semana'], 0, 250) : null,
                    'tipo_comida' => isset($detalleData['tipo_comida']) ? mb_substr($detalleData['tipo_comida'], 0, 250) : null,
                    'alimento' => mb_substr($detalleData['alimento'] ?? $detalleData['descripcion'] ?? 'Alimento prescrito', 0, 250),
                    'cantidad' => $detalleData['cantidad'] ?? $detalleData['calorias'] ?? null,
                    'unidad' => isset($detalleData['unidad']) ? mb_substr($detalleData['unidad'], 0, 50) : 'kcal',
                    'hora' => $detalleData['hora'] ?? null,
                    'observacion' => $detalleData['observacion'] ?? ($detalleData['descripcion'] ?? null),
                ]);
            }

            return $plan->load(['usuario', 'detalles']);
        });
    }
}
