<?php

namespace App\Actions\Entrenamiento;

use App\Models\GrupoMuscular;
use Illuminate\Database\Eloquent\Collection;

class ListarGruposMuscularesAction
{
    public function execute(): Collection
    {
        return GrupoMuscular::orderBy('nombre', 'asc')->get();
    }
}
