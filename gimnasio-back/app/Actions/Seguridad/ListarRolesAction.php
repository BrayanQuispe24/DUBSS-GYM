<?php

namespace App\Actions\Seguridad;

use App\Models\Rol;
use Illuminate\Database\Eloquent\Collection;

class ListarRolesAction
{
    public function execute(): Collection
    {
        return Rol::with(['rolPermisos.permiso', 'permisos'])->get();
    }
}
