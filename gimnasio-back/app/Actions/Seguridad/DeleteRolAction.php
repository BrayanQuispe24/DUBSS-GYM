<?php

namespace App\Actions\Seguridad;

use App\Models\Rol;

class DeleteRolAction
{
    public function execute(int $id): bool
    {
        $rol = Rol::findOrFail($id);
        return (bool) $rol->delete();
    }
}
