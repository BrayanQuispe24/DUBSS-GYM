<?php

namespace App\Actions\Historial;

use App\DTOs\Historial\CreateAntecedenteDTO;
use App\Models\Antecedente;

class CreateAntecedenteAction
{
    public function execute(CreateAntecedenteDTO $dto): Antecedente
    {
        return Antecedente::create($dto->data);
    }
}
