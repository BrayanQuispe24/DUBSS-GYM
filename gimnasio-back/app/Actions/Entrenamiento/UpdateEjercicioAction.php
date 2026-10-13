<?php

namespace App\Actions\Entrenamiento;

use App\Models\Ejercicio;
use App\Models\EjercicioGrupoMuscular;

class UpdateEjercicioAction
{
    public function execute(Ejercicio $ejercicio, array $data): Ejercicio
    {
        $updateData = [];
        if (isset($data['nombre'])) {
            $updateData['nombre'] = $data['nombre'];
        }
        if (array_key_exists('descripcion', $data)) {
            $updateData['descripcion'] = $data['descripcion'];
        }
        if (array_key_exists('url_video', $data)) {
            $updateData['url_video'] = $data['url_video'];
        }
        if (array_key_exists('id_tipo_ejercicio', $data)) {
            $updateData['id_tipo_ejercicio'] = $data['id_tipo_ejercicio'];
        }

        if (! empty($updateData)) {
            $ejercicio->update($updateData);
        }

        if (array_key_exists('grupos_musculares', $data) && is_array($data['grupos_musculares'])) {
            EjercicioGrupoMuscular::where('id_ejercicio', $ejercicio->id)->delete();
            foreach ($data['grupos_musculares'] as $idGrupo) {
                EjercicioGrupoMuscular::create([
                    'id_ejercicio' => $ejercicio->id,
                    'id_grupo_muscular' => $idGrupo,
                ]);
            }
        }

        return $ejercicio->fresh(['tipoEjercicio', 'ejercicioGrupoMusculares.grupoMuscular', 'imagenes']);
    }
}
