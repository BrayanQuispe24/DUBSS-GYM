<?php

namespace App\Actions\PlanTarifa;

use App\DTOs\PlanTarifa\UpdatePlanDTO;
use App\Models\Plan;

class UpdatePlanAction
{
    public function execute(UpdatePlanDTO $dto): Plan
    {
        $plan = Plan::findOrFail($dto->id);

        $data = array_filter([
            'nombre' => $dto->nombre,
            'descripcion' => $dto->descripcion,
            'duracion_dias' => $dto->duracionDias,
            'estado' => $dto->estado,
            'id_tarifa' => $dto->idTarifa,
        ], fn ($value) => $value !== null);

        $plan->update($data);

        return $plan->load('tarifa');
    }
}
