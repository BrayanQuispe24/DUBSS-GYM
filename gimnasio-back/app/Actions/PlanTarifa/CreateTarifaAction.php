<?php

namespace App\Actions\PlanTarifa;

use App\DTOs\PlanTarifa\CreateTarifaDTO;
use App\Models\Tarifa;

class CreateTarifaAction
{
    public function execute(CreateTarifaDTO $dto): Tarifa
    {
        return Tarifa::create([
            'nombre' => $dto->nombre,
            'precio' => $dto->precio,
            'fecha_inicio' => $dto->fechaInicio,
            'fecha_fin' => $dto->fechaFin,
            'estado' => $dto->estado,
        ]);
    }
}
