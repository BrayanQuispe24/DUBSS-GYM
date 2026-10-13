<?php

namespace App\Actions\Entrenamiento;

use App\Models\PlanEntrenamiento;
use App\Models\PlanEntrenamientoRutina;
use Illuminate\Support\Facades\DB;

class UpdatePlanEntrenamientoAction
{
    public function execute(PlanEntrenamiento $plan, array $data): PlanEntrenamiento
    {
        return DB::transaction(function () use ($plan, $data) {
            $updateData = [];
            if (isset($data['nombre'])) {
                $updateData['nombre'] = $data['nombre'];
            }
            if (array_key_exists('objetivo', $data)) {
                $updateData['objetivo'] = $data['objetivo'];
            }
            if (array_key_exists('fecha_inicio', $data)) {
                $updateData['fecha_inicio'] = $data['fecha_inicio'];
            }
            if (array_key_exists('fecha_fin', $data)) {
                $updateData['fecha_fin'] = $data['fecha_fin'];
            }
            if (array_key_exists('estado', $data)) {
                $updateData['estado'] = $data['estado'];
            }
            if (array_key_exists('observacion', $data)) {
                $updateData['observacion'] = $data['observacion'];
            }
            if (isset($data['id_usuario'])) {
                $updateData['id_usuario'] = $data['id_usuario'];
            }

            if (! empty($updateData)) {
                $plan->update($updateData);
            }

            if (array_key_exists('rutinas', $data) && is_array($data['rutinas'])) {
                PlanEntrenamientoRutina::where('id_plan_entrenamiento', $plan->id)->delete();
                foreach ($data['rutinas'] as $index => $rutinaData) {
                    PlanEntrenamientoRutina::create([
                        'id_plan_entrenamiento' => $plan->id,
                        'id_rutina' => $rutinaData['id_rutina'],
                        'dia_semana' => $rutinaData['dia_semana'] ?? null,
                        'orden' => $rutinaData['orden'] ?? ($index + 1),
                    ]);
                }
            }

            return $plan->fresh([
                'usuario',
                'planEntrenamientoRutinas.rutina.rutinaEjercicios.ejercicio.tipoEjercicio',
                'planEntrenamientoRutinas.rutina.rutinaEjercicios.ejercicio.imagenes',
            ]);
        });
    }
}
