<?php

namespace App\Actions\Historial;

use App\Models\DetalleHistorial;

class DeleteDetalleHistorialAction
{
    public function execute(int $id): bool
    {
        $detalle = DetalleHistorial::findOrFail($id);
        return (bool) $detalle->delete();
    }
}
