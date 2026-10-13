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
                'nombre' => $dto->nombre,
                'objetivo' => $dto->objetivo,
                'fecha_inicio' => $dto->fechaInicio,
                'fecha_fin' => $dto->fechaFin,
                'observacion' => $dto->observacion,
                'estado' => $dto->estado,
                'id_usuario' => $dto->idUsuario,
            ]);

            foreach ($dto->detalles as $detalleData) {
                DetallePlanAlimentacion::create([
                    'id_plan_alimentacion' => $plan->id,
                    'dia_semana' => $detalleData['dia_semana'] ?? null,
                    'tipo_comida' => $detalleData['tipo_comida'] ?? null,
                    'descripcion' => $detalleData['descripcion'],
                    'calorias' => $detalleData['calorias'] ?? null,
                    'proteinas' => $detalleData['proteinas'] ?? null,
                    'carbohidratos' => $detalleData['carbohidratos'] ?? null,
                    'grasas' => $detalleData['grasas'] ?? null,
                    'observacion' => $detalleData['observacion'] ?? null,
                ]);
            }

            return $plan->load(['usuario', 'detalles']);
        });
    }
}
