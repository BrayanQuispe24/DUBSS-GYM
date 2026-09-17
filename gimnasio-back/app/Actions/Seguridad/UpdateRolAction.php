<?php

namespace App\Actions\Seguridad;

use App\DTOs\Seguridad\UpdateRolDTO;
use App\Models\Rol;

class UpdateRolAction
{
    public function execute(UpdateRolDTO $dto): Rol
    {
        $rol = Rol::findOrFail($dto->id);
        $rol->update(array_filter([
            'nombre' => $dto->nombre,
            'estado' => $dto->estado,
        ], fn ($val) => $val !== null));

        return $rol;
    }
}
