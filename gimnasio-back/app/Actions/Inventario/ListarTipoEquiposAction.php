<?php

namespace App\Actions\Inventario;

use App\Models\TipoEquipo;
use Illuminate\Database\Eloquent\Collection;

class ListarTipoEquiposAction
{
    public function execute(): Collection
    {
        return TipoEquipo::all();
    }
}
