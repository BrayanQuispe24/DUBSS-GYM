<?php

namespace App\Actions\Inventario;

use App\DTOs\Inventario\CreateTipoEquipoDTO;
use App\Models\TipoEquipo;

class CreateTipoEquipoAction
{
    public function execute(CreateTipoEquipoDTO $dto): TipoEquipo
    {
        return TipoEquipo::create($dto->toArray());
    }
}
