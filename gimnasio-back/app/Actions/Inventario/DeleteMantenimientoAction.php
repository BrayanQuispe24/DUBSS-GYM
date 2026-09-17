<?php

namespace App\Actions\Inventario;

use App\Models\Mantenimiento;

class DeleteMantenimientoAction
{
    public function execute(Mantenimiento $mantenimiento): bool
    {
        return (bool) $mantenimiento->delete();
    }
}
