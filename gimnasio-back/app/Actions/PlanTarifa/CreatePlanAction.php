<?php

namespace App\Actions\PlanTarifa;

use App\DTOs\PlanTarifa\CreatePlanDTO;
use App\Models\Plan;

class CreatePlanAction
{
    public function execute(CreatePlanDTO $dto): Plan
    {
        $plan = Plan::create([
            'nombre' => $dto->nombre,
            'descripcion' => $dto->descripcion,
            'duracion_dias' => $dto->duracionDias,
            'estado' => $dto->estado,
            'id_tarifa' => $dto->idTarifa,
        ]);

        return $plan->load('tarifa');
    }
}
