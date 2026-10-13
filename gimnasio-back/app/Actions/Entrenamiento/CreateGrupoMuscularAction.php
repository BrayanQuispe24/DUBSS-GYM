<?php

namespace App\Actions\Entrenamiento;

use App\DTOs\Entrenamiento\CreateGrupoMuscularDTO;
use App\Models\GrupoMuscular;

class CreateGrupoMuscularAction
{
    public function execute(CreateGrupoMuscularDTO $dto): GrupoMuscular
    {
        return GrupoMuscular::create([
            'nombre' => $dto->nombre,
            'descripcion' => $dto->descripcion,
        ]);
    }
}
