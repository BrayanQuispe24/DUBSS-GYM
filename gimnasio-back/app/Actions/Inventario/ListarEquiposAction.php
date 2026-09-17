<?php

namespace App\Actions\Inventario;

use App\Models\Equipo;
use Illuminate\Database\Eloquent\Collection;

class ListarEquiposAction
{
    public function execute(): Collection
    {
        return Equipo::with(['ambiente', 'marca', 'tipoEquipo', 'mantenimientos'])->get();
    }
}
