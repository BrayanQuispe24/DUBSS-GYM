<?php

namespace App\Actions\Espacio;

use App\DTOs\Espacio\UpdateAmbienteDTO;
use App\Models\Ambiente;

class UpdateAmbienteAction
{
    public function execute(Ambiente $ambiente, UpdateAmbienteDTO $dto): Ambiente
    {
        $ambiente->update($dto->toArray());
        return $ambiente;
    }
}
