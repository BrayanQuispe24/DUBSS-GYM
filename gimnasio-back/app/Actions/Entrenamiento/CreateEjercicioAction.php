<?php

namespace App\Actions\Entrenamiento;

use App\DTOs\Entrenamiento\CreateEjercicioDTO;
use App\Models\Ejercicio;

class CreateEjercicioAction
{
    public function execute(CreateEjercicioDTO $dto): Ejercicio
    {
        $ejercicio = Ejercicio::create([
            'nombre' => $dto->nombre,
            'descripcion' => $dto->descripcion,
            'url_video' => $dto->urlVideo,
            'id_tipo_ejercicio' => $dto->idTipoEjercicio,
        ]);

        return $ejercicio->load('tipoEjercicio');
    }
}
