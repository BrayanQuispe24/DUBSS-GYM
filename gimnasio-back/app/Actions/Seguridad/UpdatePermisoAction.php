<?php

namespace App\Actions\Seguridad;

use App\DTOs\Seguridad\UpdatePermisoDTO;
use App\Models\Permiso;

class UpdatePermisoAction
{
    public function execute(UpdatePermisoDTO $dto): Permiso
    {
        $permiso = Permiso::findOrFail($dto->id);
        $permiso->update(array_filter([
            'nombre' => $dto->nombre,
            'estado' => $dto->estado,
        ], fn ($val) => $val !== null));

        return $permiso;
    }
}
