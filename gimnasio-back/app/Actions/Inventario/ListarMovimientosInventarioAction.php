<?php

namespace App\Actions\Inventario;

use App\Models\MovimientoInventario;
use Illuminate\Database\Eloquent\Collection;

class ListarMovimientosInventarioAction
{
    public function execute(): Collection
    {
        return MovimientoInventario::with(['equipo', 'tipoMovimiento', 'usuario'])->get();
    }
}
