<?php

namespace App\Actions\Deporte;

use App\Models\Horario;

class DeleteHorarioAction
{
    public function execute(int $id): bool
    {
        $horario = Horario::findOrFail($id);
        return (bool) $horario->delete();
    }
}
