<?php

namespace App\Actions\Inventario;

use App\DTOs\Inventario\CreateMarcaDTO;
use App\Models\Marca;

class CreateMarcaAction
{
    public function execute(CreateMarcaDTO $dto): Marca
    {
        return Marca::create($dto->toArray());
    }
}
