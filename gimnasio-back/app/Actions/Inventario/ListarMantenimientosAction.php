<?php

namespace App\Actions\Inventario;

use App\Models\Mantenimiento;
use Illuminate\Database\Eloquent\Collection;

class ListarMantenimientosAction
{
    public function execute(): Collection
    {
        return Mantenimiento::with('equipo')->get();
    }
}
