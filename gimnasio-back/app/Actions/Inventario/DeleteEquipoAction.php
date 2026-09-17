<?php

namespace App\Actions\Inventario;

use App\Models\Equipo;

class DeleteEquipoAction
{
    public function execute(Equipo $equipo): bool
    {
        return (bool) $equipo->delete();
    }
}
