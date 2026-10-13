<?php

namespace App\Actions\Entrenamiento;

use App\DTOs\Entrenamiento\CreateTipoEjercicioDTO;
use App\Models\TipoEjercicio;

class CreateTipoEjercicioAction
{
    public function execute(CreateTipoEjercicioDTO $dto): TipoEjercicio
    {
        return TipoEjercicio::create([
            'nombre' => $dto->nombre,
            'descripcion' => $dto->descripcion,
        ]);
    }
}
