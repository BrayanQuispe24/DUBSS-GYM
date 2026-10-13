<?php

namespace App\Actions\PlanTarifa;

use App\DTOs\PlanTarifa\UpdateTarifaDTO;
use App\Models\Tarifa;

class UpdateTarifaAction
{
    public function execute(UpdateTarifaDTO $dto): Tarifa
    {
        $tarifa = Tarifa::findOrFail($dto->id);

        $data = array_filter([
            'nombre' => $dto->nombre,
            'precio' => $dto->precio,
            'fecha_inicio' => $dto->fechaInicio,
            'fecha_fin' => $dto->fechaFin,
            'estado' => $dto->estado,
        ], fn ($value) => $value !== null);

        $tarifa->update($data);

        return $tarifa;
    }
}
