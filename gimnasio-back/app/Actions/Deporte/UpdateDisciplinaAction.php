<?php

namespace App\Actions\Deporte;

use App\DTOs\Deporte\UpdateDisciplinaDTO;
use App\Models\Disciplina;

class UpdateDisciplinaAction
{
    public function execute(UpdateDisciplinaDTO $dto): Disciplina
    {
        $disciplina = Disciplina::findOrFail($dto->id);
        $disciplina->update([
            'nombre' => $dto->nombre,
            'cantidad_cupos' => $dto->cantidad_cupos,
            'estado' => $dto->estado ?? 'activo',
        ]);

        return $disciplina;
    }
}
