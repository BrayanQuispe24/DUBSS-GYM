<?php

namespace App\Actions\Inventario;

use App\DTOs\Inventario\UpdateMarcaDTO;
use App\Models\Marca;

class UpdateMarcaAction
{
    public function execute(Marca $marca, UpdateMarcaDTO $dto): Marca
    {
        $marca->update($dto->toArray());
        return $marca;
    }
}
