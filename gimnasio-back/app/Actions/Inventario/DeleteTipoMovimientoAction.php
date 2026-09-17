<?php

namespace App\Actions\Inventario;

use App\Models\TipoMovimiento;

class DeleteTipoMovimientoAction
{
    public function execute(TipoMovimiento $tipoMovimiento): bool
    {
        return (bool) $tipoMovimiento->delete();
    }
}
