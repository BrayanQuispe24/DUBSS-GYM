<?php

namespace App\Actions\Seguridad;

use App\DTOs\Seguridad\CreatePermisoDTO;
use App\Models\Permiso;

class CreatePermisoAction
{
    public function execute(CreatePermisoDTO $dto): Permiso
    {
        return Permiso::create([
            'nombre' => $dto->nombre,
            'estado' => $dto->estado,
        ]);
    }
}
