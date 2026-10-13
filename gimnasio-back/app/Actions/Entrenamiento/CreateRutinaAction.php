<?php

namespace App\Actions\Entrenamiento;

use App\DTOs\Entrenamiento\CreateRutinaDTO;
use App\Models\Rutina;
use App\Models\RutinaEjercicio;
use Illuminate\Support\Facades\DB;

class CreateRutinaAction
{
    public function execute(CreateRutinaDTO $dto): Rutina
    {
        return DB::transaction(function () use ($dto) {
            $rutina = Rutina::create([
                'nombre' => $dto->nombre,
                'descripcion' => $dto->descripcion,
                'nivel' => $dto->nivel,
                'estado' => $dto->estado,
            ]);

            foreach ($dto->ejercicios as $ejercicioData) {
                RutinaEjercicio::create([
                    'id_rutina' => $rutina->id,
                    'id_ejercicio' => $ejercicioData['id_ejercicio'],
                    'series' => $ejercicioData['series'] ?? null,
                    'repeticiones' => $ejercicioData['repeticiones'] ?? null,
                    'peso' => $ejercicioData['peso'] ?? null,
                    'duracion_segundos' => $ejercicioData['duracion_segundos'] ?? null,
                    'descanso_segundos' => $ejercicioData['descanso_segundos'] ?? null,
                    'orden' => $ejercicioData['orden'] ?? null,
                    'observacion' => $ejercicioData['observacion'] ?? null,
                ]);
            }

            return $rutina->load('rutinaEjercicios.ejercicio');
        });
    }
}
