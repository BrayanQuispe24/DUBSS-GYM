<?php

namespace App\Actions\Inventario;

use App\DTOs\Inventario\CreateTipoMovimientoDTO;
use App\Models\TipoMovimiento;

class CreateTipoMovimientoAction
{
    public function execute(CreateTipoMovimientoDTO $dto): TipoMovimiento
    {
        return TipoMovimiento::create($dto->toArray());
    }
}
