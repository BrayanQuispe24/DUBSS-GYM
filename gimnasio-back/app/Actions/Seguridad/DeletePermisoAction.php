<?php

namespace App\Actions\Seguridad;

use App\Models\Permiso;

class DeletePermisoAction
{
    public function execute(int $id): bool
    {
        $permiso = Permiso::findOrFail($id);
        return (bool) $permiso->delete();
    }
}
