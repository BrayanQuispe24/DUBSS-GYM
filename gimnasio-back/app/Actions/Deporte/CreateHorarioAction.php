<?php

namespace App\Actions\Deporte;

use App\DTOs\Deporte\CreateHorarioDTO;
use App\Models\Horario;

class CreateHorarioAction
{
    public function execute(CreateHorarioDTO $dto): Horario
    {
        return Horario::create([
            'dia_semana' => $dto->dia_semana,
            'hora_inicio' => $dto->hora_inicio,
            'hora_fin' => $dto->hora_fin,
        ]);
    }
}
