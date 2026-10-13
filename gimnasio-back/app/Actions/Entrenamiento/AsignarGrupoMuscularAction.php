<?php

namespace App\Actions\Entrenamiento;

use App\Models\EjercicioGrupoMuscular;

class AsignarGrupoMuscularAction
{
    public function execute(int $idEjercicio, int $idGrupoMuscular): EjercicioGrupoMuscular
    {
        return EjercicioGrupoMuscular::firstOrCreate([
            'id_ejercicio' => $idEjercicio,
            'id_grupo_muscular' => $idGrupoMuscular,
        ]);
    }
}
