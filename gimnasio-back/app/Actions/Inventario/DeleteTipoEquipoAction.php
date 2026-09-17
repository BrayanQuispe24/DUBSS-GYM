<?php

namespace App\Actions\Inventario;

use App\Models\TipoEquipo;

class DeleteTipoEquipoAction
{
    public function execute(TipoEquipo $tipoEquipo): bool
    {
        return (bool) $tipoEquipo->delete();
    }
}
