<?php

namespace App\Actions\Espacio;

use App\DTOs\Espacio\CreateAmbienteDTO;
use App\Models\Ambiente;

class CreateAmbienteAction
{
    public function execute(CreateAmbienteDTO $dto): Ambiente
    {
        return Ambiente::create($dto->toArray());
    }
}
