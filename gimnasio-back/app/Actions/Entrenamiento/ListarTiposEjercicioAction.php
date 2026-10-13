<?php

namespace App\Actions\Entrenamiento;

use App\Models\TipoEjercicio;
use Illuminate\Database\Eloquent\Collection;

class ListarTiposEjercicioAction
{
    public function execute(): Collection
    {
        return TipoEjercicio::orderBy('nombre', 'asc')->get();
    }
}
