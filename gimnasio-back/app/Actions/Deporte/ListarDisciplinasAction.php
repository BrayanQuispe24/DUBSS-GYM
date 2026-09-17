<?php

namespace App\Actions\Deporte;

use App\Models\Disciplina;
use Illuminate\Database\Eloquent\Collection;

class ListarDisciplinasAction
{
    public function execute(): Collection
    {
        return Disciplina::with('disciplinaHorarios.horario')->get();
    }
}
