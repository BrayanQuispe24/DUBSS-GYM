<?php

namespace App\Actions\Deporte;

use App\DTOs\Deporte\CreateDisciplinaDTO;
use App\Models\Disciplina;

class CreateDisciplinaAction
{
    public function execute(CreateDisciplinaDTO $dto): Disciplina
    {
        return Disciplina::create([
            'nombre' => $dto->nombre,
            'cantidad_cupos' => $dto->cantidad_cupos,
            'estado' => $dto->estado ?? 'activo',
        ]);
    }
}
