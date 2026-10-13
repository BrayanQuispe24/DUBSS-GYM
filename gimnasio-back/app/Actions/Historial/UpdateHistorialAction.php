<?php

namespace App\Actions\Historial;

use App\DTOs\Historial\UpdateHistorialDTO;
use App\Models\Historial;

class UpdateHistorialAction
{
    public function execute(UpdateHistorialDTO $dto): Historial
    {
        $historial = Historial::findOrFail($dto->id);
        $historial->update(array_filter([
            'fecha_apertura' => $dto->fecha_apertura,
            'observaciones_generales' => $dto->observaciones_generales,
            'grupo_sanguineo' => $dto->grupo_sanguineo,
            'sexo' => $dto->sexo,
            'fecha_nacimiento' => $dto->fecha_nacimiento,
            'domicilio' => $dto->domicilio,
            'facultad_carrera' => $dto->facultad_carrera,
            'celular_emergencia' => $dto->celular_emergencia,
        ], fn ($val) => $val !== null));

        return $historial;
    }
}
