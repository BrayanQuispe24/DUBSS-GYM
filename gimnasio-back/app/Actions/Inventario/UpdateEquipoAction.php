<?php

namespace App\Actions\Inventario;

use App\DTOs\Inventario\UpdateEquipoDTO;
use App\Models\Equipo;

class UpdateEquipoAction
{
    public function execute(Equipo $equipo, UpdateEquipoDTO $dto): Equipo
    {
        $equipo->update($dto->toArray());
        return $equipo;
    }
}
