<?php

namespace App\Actions\Deporte;

use App\DTOs\Deporte\AsignarDisciplinaHorarioDTO;
use App\Models\DisciplinaHorario;

class AsignarDisciplinaHorarioAction
{
    public function execute(AsignarDisciplinaHorarioDTO $dto): DisciplinaHorario
    {
        return DisciplinaHorario::updateOrCreate([
            'id_disciplina' => $dto->id_disciplina,
            'id_horario' => $dto->id_horario,
        ], [
            'cupo_maximo' => $dto->cupo_maximo,
            'estado' => $dto->estado,
        ]);
    }
}
