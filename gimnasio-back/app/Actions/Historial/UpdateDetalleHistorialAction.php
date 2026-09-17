<?php

namespace App\Actions\Historial;

use App\DTOs\Historial\UpdateDetalleHistorialDTO;
use App\Models\DetalleHistorial;

class UpdateDetalleHistorialAction
{
    public function execute(UpdateDetalleHistorialDTO $dto): DetalleHistorial
    {
        $detalle = DetalleHistorial::findOrFail($dto->id);
        $detalle->update(array_filter([
            'peso' => $dto->peso,
            'altura' => $dto->altura,
            'imc' => $dto->imc,
            'porcentaje_grasa' => $dto->porcentaje_grasa,
            'masa_muscular' => $dto->masa_muscular,
            'presion' => $dto->presion,
            'fecha_registro' => $dto->fecha_registro,
        ], fn ($val) => $val !== null));

        return $detalle;
    }
}
