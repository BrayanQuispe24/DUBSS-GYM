<?php

namespace App\Actions\Historial;

use App\DTOs\Historial\CreateDetalleHistorialDTO;
use App\Models\DetalleHistorial;

class CreateDetalleHistorialAction
{
    public function execute(CreateDetalleHistorialDTO $dto): DetalleHistorial
    {
        return DetalleHistorial::create([
            'id_historial' => $dto->id_historial,
            'peso' => $dto->peso,
            'altura' => $dto->altura,
            'imc' => $dto->imc,
            'porcentaje_grasa' => $dto->porcentaje_grasa,
            'masa_muscular' => $dto->masa_muscular,
            'presion' => $dto->presion,
            'fecha_registro' => $dto->fecha_registro ?? now(),
        ]);
    }
}
