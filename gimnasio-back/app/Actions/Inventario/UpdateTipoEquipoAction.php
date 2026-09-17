<?php

namespace App\Actions\Inventario;

use App\DTOs\Inventario\UpdateTipoEquipoDTO;
use App\Models\TipoEquipo;

class UpdateTipoEquipoAction
{
    public function execute(TipoEquipo $tipoEquipo, UpdateTipoEquipoDTO $dto): TipoEquipo
    {
        $tipoEquipo->update($dto->toArray());
        return $tipoEquipo;
    }
}
