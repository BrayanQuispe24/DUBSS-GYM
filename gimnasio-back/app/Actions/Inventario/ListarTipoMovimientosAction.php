<?php

namespace App\Actions\Inventario;

use App\Models\TipoMovimiento;
use Illuminate\Database\Eloquent\Collection;

class ListarTipoMovimientosAction
{
    public function execute(): Collection
    {
        return TipoMovimiento::all();
    }
}
