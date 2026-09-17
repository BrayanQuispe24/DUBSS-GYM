<?php

namespace App\Actions\Inventario;

use App\DTOs\Inventario\CreateEquipoDTO;
use App\Models\Equipo;

class CreateEquipoAction
{
    public function execute(CreateEquipoDTO $dto): Equipo
    {
        return Equipo::create($dto->toArray());
    }
}
