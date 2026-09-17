<?php

namespace App\Actions\Inventario;

use App\DTOs\Inventario\UpdateTipoMovimientoDTO;
use App\Models\TipoMovimiento;

class UpdateTipoMovimientoAction
{
    public function execute(TipoMovimiento $tipoMovimiento, UpdateTipoMovimientoDTO $dto): TipoMovimiento
    {
        $tipoMovimiento->update($dto->toArray());
        return $tipoMovimiento;
    }
}
