<?php

namespace App\Actions\Entrenamiento;

use App\Models\Rutina;
use App\Models\RutinaEjercicio;
use Illuminate\Support\Facades\DB;

class UpdateRutinaAction
{
    public function execute(Rutina $rutina, array $data): Rutina
    {
        return DB::transaction(function () use ($rutina, $data) {
            $updateData = [];
            if (isset($data['nombre'])) {
                $updateData['nombre'] = $data['nombre'];
            }
            if (array_key_exists('descripcion', $data)) {
                $updateData['descripcion'] = $data['descripcion'];
            }
            if (array_key_exists('nivel', $data)) {
                $updateData['nivel'] = $data['nivel'];
            }
            if (array_key_exists('estado', $data)) {
                $updateData['estado'] = $data['estado'];
            }

            if (! empty($updateData)) {
                $rutina->update($updateData);
            }

            if (array_key_exists('ejercicios', $data) && is_array($data['ejercicios'])) {
                RutinaEjercicio::where('id_rutina', $rutina->id)->delete();
                foreach ($data['ejercicios'] as $index => $item) {
                    RutinaEjercicio::create([
                        'id_rutina' => $rutina->id,
                        'id_ejercicio' => $item['id_ejercicio'],
                        'series' => $item['series'] ?? 4,
                        'repeticiones' => $item['repeticiones'] ?? 12,
                        'descanso_segundos' => $item['descanso_segundos'] ?? 60,
                        'orden' => $index + 1,
                    ]);
                }
            }

            return $rutina->fresh(['rutinaEjercicios.ejercicio.tipoEjercicio', 'rutinaEjercicios.ejercicio.imagenes']);
        });
    }
}
