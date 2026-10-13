<?php

namespace App\Actions\Entrenamiento;

use App\Models\Rutina;
use Illuminate\Database\Eloquent\Collection;

class ListarRutinasAction
{
    public function execute(): Collection
    {
        return Rutina::with('rutinaEjercicios.ejercicio.tipoEjercicio')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
