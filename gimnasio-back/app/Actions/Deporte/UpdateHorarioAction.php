<?php

namespace App\Actions\Deporte;

use App\DTOs\Deporte\UpdateHorarioDTO;
use App\Models\Horario;

class UpdateHorarioAction
{
    public function execute(UpdateHorarioDTO $dto): Horario
    {
        $horario = Horario::findOrFail($dto->id);
        $horario->update([
            'hora_inicio' => $dto->hora_inicio,
            'hora_fin' => $dto->hora_fin,
        ]);

        return $horario;
    }
}
