<?php

namespace App\Actions\Seguridad;

use App\DTOs\Seguridad\CreateRolDTO;
use App\Models\Rol;

class CreateRolAction
{
    public function execute(CreateRolDTO $dto): Rol
    {
        return Rol::create([
            'nombre' => $dto->nombre,
            'estado' => $dto->estado,
        ]);
    }
}
