<?php

namespace App\Actions\Historial;

use App\DTOs\Historial\CreateHistorialDTO;
use App\Models\Historial;
use App\Models\Usuario;

class CreateHistorialAction
{
    public function execute(CreateHistorialDTO $dto, Usuario $usuario): Historial
    {
        return Historial::create([
            'id_usuario' => $usuario->id,
            'fecha_apertura' => $dto->fecha_apertura ?? now(),
            'observaciones_generales' => $dto->observaciones_generales,
            'grupo_sanguineo' => $dto->grupo_sanguineo,
            'sexo' => $dto->sexo,
            'fecha_nacimiento' => $dto->fecha_nacimiento,
            'domicilio' => $dto->domicilio,
            'celular_emergencia' => $dto->celular_emergencia,
        ]);
    }
}
