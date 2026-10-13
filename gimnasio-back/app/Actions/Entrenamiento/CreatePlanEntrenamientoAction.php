<?php

namespace App\Actions\Entrenamiento;

use App\DTOs\Entrenamiento\CreatePlanEntrenamientoDTO;
use App\Models\PlanEntrenamiento;
use App\Models\PlanEntrenamientoRutina;
use Illuminate\Support\Facades\DB;

class CreatePlanEntrenamientoAction
{
    public function execute(CreatePlanEntrenamientoDTO $dto): PlanEntrenamiento
    {
        return DB::transaction(function () use ($dto) {
            $plan = PlanEntrenamiento::create([
                'nombre' => $dto->nombre,
                'objetivo' => $dto->objetivo,
                'fecha_inicio' => $dto->fechaInicio,
                'fecha_fin' => $dto->fechaFin,
                'estado' => $dto->estado,
                'observacion' => $dto->observacion,
                'id_usuario' => $dto->idUsuario,
            ]);

            foreach ($dto->rutinas as $rutinaData) {
                PlanEntrenamientoRutina::create([
                    'id_plan_entrenamiento' => $plan->id,
                    'id_rutina' => $rutinaData['id_rutina'],
                    'dia_semana' => $rutinaData['dia_semana'] ?? null,
                    'orden' => $rutinaData['orden'] ?? null,
                ]);
            }

            return $plan->load(['usuario', 'planEntrenamientoRutinas.rutina']);
        });
    }
}
